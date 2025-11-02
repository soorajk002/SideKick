import { NextAuthOptions } from 'next-auth'
import { DrizzleAdapter } from '@auth/drizzle-adapter'
import GoogleProvider from 'next-auth/providers/google'
import { Provider } from 'next-auth/providers/index'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { db, users } from './db'
import { eq } from 'drizzle-orm'

const providers: Provider[] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  }),
]

// Add Microsoft provider if configured
if (process.env.MICROSOFT_CLIENT_ID && process.env.MICROSOFT_CLIENT_SECRET) {
  providers.push({
    id: 'microsoft',
    name: 'Microsoft',
    type: 'oauth',
    wellKnown: 'https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration',
    authorization: {
      params: {
        scope: 'openid profile email',
      },
    },
    clientId: process.env.MICROSOFT_CLIENT_ID,
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
  })
}

// Add Zoom provider if configured
if (process.env.ZOOM_CLIENT_ID && process.env.ZOOM_CLIENT_SECRET) {
  providers.push({
    id: 'zoom',
    name: 'Zoom',
    type: 'oauth',
    wellKnown: 'https://zoom.us/.well-known/openid-configuration',
    authorization: {
      params: {
        scope: 'openid profile email',
      },
    },
    clientId: process.env.ZOOM_CLIENT_ID,
    clientSecret: process.env.ZOOM_CLIENT_SECRET,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name || profile.display_name,
        email: profile.email,
        image: profile.picture || profile.pic_url,
      }
    },
  })
}

// Add credentials provider for email/password
providers.push(
  CredentialsProvider({
    name: 'Credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Password', type: 'password' },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) {
        throw new Error('Email and password are required')
      }

      // Find user by email
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, credentials.email))
        .limit(1)

      if (!user || !user.passwordHash) {
        throw new Error('Invalid email or password')
      }

      // Verify password
      const isValid = await bcrypt.compare(credentials.password, user.passwordHash)

      if (!isValid) {
        throw new Error('Invalid email or password')
      }

      return {
        id: user.id,
        email: user.email,
        name: user.fullName,
        image: user.avatarUrl,
      }
    },
  })
)

export const authOptions: NextAuthOptions = {
  adapter: DrizzleAdapter(db) as any,
  providers,
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
    newUser: '/dashboard',
  },
  callbacks: {
    async session({ session, token, user }) {
      if (session.user) {
        session.user.id = token.sub || user?.id
      }
      return session
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Redirect to dashboard after sign in
      if (url === baseUrl || url === `${baseUrl}/login` || url === `${baseUrl}/signup`) {
        return `${baseUrl}/dashboard`
      }
      // Allow relative callback URLs
      if (url.startsWith('/')) {
        return `${baseUrl}${url}`
      }
      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        return url
      }
      return baseUrl
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}

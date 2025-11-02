import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db, users, organizations, organizationMembers } from '@/lib/db'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, organizationName } = body

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and password are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate password strength
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: 'User with this email already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create user first
    const [newUser] = await db
      .insert(users)
      .values({
        fullName: name,
        email,
        passwordHash,
        isEmailVerified: false,
      })
      .returning()

    // Create organization if name provided (after user so we can set ownerId)
    let organizationId: string | null = null
    if (organizationName) {
      // Generate slug from organization name
      const baseSlug = organizationName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
      const slug = `${baseSlug}-${Date.now().toString(36)}`

      const [organization] = await db
        .insert(organizations)
        .values({
          name: organizationName,
          slug,
          ownerId: newUser.id,
          subscriptionStatus: 'trialing',
          aiCreditsLimit: 5, // Free trial: 5 meetings
          aiCreditsUsed: 0,
        })
        .returning()

      organizationId = organization.id

      // Add user to organization as owner
      await db
        .insert(organizationMembers)
        .values({
          organizationId,
          userId: newUser.id,
          role: 'owner',
        })
    }

    // Don't return password hash
    const { passwordHash: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        success: true,
        data: {
          user: userWithoutPassword,
          organizationId,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating user:', error)
    // Log more details for debugging
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create user account',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

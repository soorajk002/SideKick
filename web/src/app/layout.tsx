import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import './globals.css'
import { SessionProvider } from '@/components/providers/session-provider'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sidekick - AI-Powered Sales Checklists for Zoom',
  description: 'Close more deals with AI-powered sales playbooks and auto-checking during your Zoom meetings. Track what works, coach your team, and never miss a step.',
  keywords: ['sales', 'zoom', 'ai', 'checklist', 'playbook', 'crm', 'sales enablement'],
  authors: [{ name: 'Sidekick' }],
  openGraph: {
    title: 'Sidekick - AI-Powered Sales Checklists for Zoom',
    description: 'Close more deals with AI-powered sales playbooks',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sidekick - AI-Powered Sales Checklists for Zoom',
    description: 'Close more deals with AI-powered sales playbooks',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={poppins.className}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  )
}

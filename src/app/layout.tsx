import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/lib/auth'
import { LangProvider } from '@/lib/i18n'

export const metadata: Metadata = {
  title: 'S²IMS — Scholarship Intelligence & Management System',
  description: 'ระบบจับคู่ทุนการศึกษาอัจฉริยะ | Faculty of Political Science and Public Administration, CMU',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" suppressHydrationWarning>
      <body>
        <LangProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </LangProvider>
      </body>
    </html>
  )
}

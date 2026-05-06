'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from './Sidebar'
import Topbar from './Topbar'
import MobileBottomNav from './MobileBottomNav'
import { useAuth } from '@/lib/auth'
import { ToastProvider } from '@/components/ui/Toast'
import type { Role } from '@/lib/types'

interface AppShellProps {
  children: React.ReactNode
  requiredRole?: Role
  title?: string
}

export default function AppShell({ children, requiredRole, title }: AppShellProps) {
  const { user, role, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { router.push('/login'); return }
    if (requiredRole && role !== requiredRole) { router.push('/login'); return }
  }, [user, role, isLoaded, requiredRole, router])

  if (!isLoaded || !user) {
    return (
      <div className="min-h-screen bg-bg-000 flex items-center justify-center">
        <div className="text-ink-3 text-sm animate-pulse">กำลังโหลด...</div>
      </div>
    )
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-bg-000 flex flex-col">
        <Topbar title={title} />
        <div className="flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 52px)' }}>
          <div className="hidden md:block flex-shrink-0 h-full overflow-y-auto">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 page-animate">
            {children}
          </main>
        </div>
        <div className="md:hidden">
          <MobileBottomNav />
        </div>
      </div>
    </ToastProvider>
  )
}

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

/* ── Branded loading screen ─────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-bg-000 flex items-center justify-center">
      <div className="flex flex-col items-center gap-5 select-none">
        {/* Logo */}
        <div className="font-display font-bold text-3xl tracking-tight">
          <span className="text-role-primary">S²</span>
          <span className="text-ink-1">IMS</span>
        </div>
        {/* Dot pulsers */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-role-primary animate-pulse"
              style={{ animationDelay: `${i * 160}ms` }}
            />
          ))}
        </div>
        <div className="text-xs text-ink-3 font-mono tracking-widest">
          กำลังโหลด…
        </div>
      </div>
    </div>
  )
}

/* ── AppShell ───────────────────────────────────────────────────────────── */
export default function AppShell({ children, requiredRole, title }: AppShellProps) {
  const { user, role, isLoaded } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    if (!user) { router.push('/login'); return }
    if (requiredRole && role !== requiredRole) { router.push('/login'); return }
  }, [user, role, isLoaded, requiredRole, router])

  /* Show branded loader while auth state is hydrating */
  if (!isLoaded || !user) return <LoadingScreen />

  return (
    <ToastProvider>
      {/*
        data-role is the CSS-var theming hook.
        All [data-role="..."] selectors in globals.css cascade from here.
        Role → colour: student=blue, provider=emerald, staff=amber, esq=violet, admin=graphite
      */}
      <div
        data-role={role ?? 'staff'}
        className="min-h-screen bg-bg-000 flex flex-col"
      >
        <Topbar title={title} />

        <div
          className="flex flex-1 overflow-hidden"
          style={{ height: 'calc(100vh - 52px)' }}
        >
          {/* Desktop sidebar */}
          <div className="hidden md:block flex-shrink-0 h-full overflow-y-auto">
            <Sidebar />
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6 page-animate">
            {children}
          </main>
        </div>

        {/* Mobile bottom nav */}
        <div className="md:hidden">
          <MobileBottomNav />
        </div>
      </div>
    </ToastProvider>
  )
}

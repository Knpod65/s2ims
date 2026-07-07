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
  enableDemoAccess?: boolean
  demoAccessLabel?: string
}

const DEMO_ROLE_LABELS: Record<Role, string> = {
  student: 'นักศึกษา',
  staff: 'เจ้าหน้าที่',
  esq: 'ผู้บริหาร',
  provider: 'ผู้ให้ทุน',
  admin: 'ผู้ดูแลระบบ',
}

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-bg-000'

function DemoAccessCard({
  requiredRole,
  demoAccessLabel,
  currentRole,
  onActivate,
}: {
  requiredRole: Role
  demoAccessLabel?: string
  currentRole?: Role | null
  onActivate: () => void
}) {
  const label = demoAccessLabel ?? DEMO_ROLE_LABELS[requiredRole]
  const hasDifferentRole = currentRole && currentRole !== requiredRole

  return (
    <div className="min-h-screen bg-bg-000 px-4 py-10 text-ink-1">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] max-w-xl items-center justify-center">
        <section className="w-full rounded-2xl border border-white/[0.1] bg-bg-100 p-6 shadow-card">
          <div className="mb-3 inline-flex rounded-full border border-brand/25 bg-brand/10 px-3 py-1 text-[11px] font-semibold text-brand-light">
            S²IMS Prototype
          </div>
          <h1 className="font-display text-2xl font-bold tracking-normal text-ink-1">เข้าสู่โหมดตัวอย่าง</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            หน้านี้เป็นหน้าตัวอย่างของระบบ S²IMS สำหรับบทบาท {label} กรุณาเปิดโหมดตัวอย่างเพื่อดูหน้าจอจำลอง
          </p>
          {hasDifferentRole && (
            <p className="mt-3 rounded-lg border border-status-warning/25 bg-status-warning/10 p-3 text-xs leading-relaxed text-ink-2">
              ขณะนี้มีบทบาทตัวอย่างอื่นอยู่ ระบบจะสลับเป็นบทบาท {label} เมื่อกดปุ่มด้านล่าง
            </p>
          )}
          <button
            type="button"
            onClick={onActivate}
            className={`mt-5 min-h-11 w-full rounded-xl bg-brand px-4 py-3 text-sm font-bold text-black transition-colors hover:bg-brand-light ${focusClass}`}
          >
            เปิดโหมดตัวอย่าง{label}
          </button>
          <p className="mt-3 text-center text-xs text-ink-3">
            โหมดนี้ใช้ข้อมูล mock เท่านั้น และไม่ใช่การเข้าสู่ระบบจริง
          </p>
        </section>
      </div>
    </div>
  )
}

export default function AppShell({
  children,
  requiredRole,
  title,
  enableDemoAccess = false,
  demoAccessLabel,
}: AppShellProps) {
  const { user, role, isLoaded, login } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoaded) return
    if (enableDemoAccess) return
    if (!user) { router.push('/login'); return }
    if (requiredRole && role !== requiredRole) { router.push('/login'); return }
  }, [user, role, isLoaded, requiredRole, router, enableDemoAccess])

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-bg-000 flex items-center justify-center">
        <div className="text-ink-3 text-sm animate-pulse">กำลังโหลด...</div>
      </div>
    )
  }

  if (requiredRole && enableDemoAccess && (!user || role !== requiredRole)) {
    return (
      <DemoAccessCard
        requiredRole={requiredRole}
        demoAccessLabel={demoAccessLabel}
        currentRole={role}
        onActivate={() => login(requiredRole)}
      />
    )
  }

  if (!user || (requiredRole && role !== requiredRole)) {
    return (
      <div className="min-h-screen bg-bg-000 flex items-center justify-center px-4">
        <div className="rounded-xl border border-white/[0.08] bg-bg-100 px-5 py-4 text-center text-sm text-ink-2 shadow-card">
          กำลังนำไปหน้าเข้าสู่ระบบ...
        </div>
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

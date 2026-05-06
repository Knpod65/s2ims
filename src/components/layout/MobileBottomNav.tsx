'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'
import { MOBILE_NAV } from '@/lib/navigation'
import {
  Home, BookOpen, FileText, Bell, User, BarChart3, ClipboardList,
  LayoutDashboard, FilePlus, PlusCircle, TrendingUp, Shield, History,
  ScrollText, Download, Settings, ScanLine, Users
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Home, BookOpen, FileText, Bell, User, BarChart3, ClipboardList,
  LayoutDashboard, FilePlus, PlusCircle, TrendingUp, Shield, History,
  ScrollText, Download, Settings, ScanLine, Users,
}

export default function MobileBottomNav() {
  const { role } = useAuth()
  const { lang } = useLang()
  const pathname = usePathname()

  if (!role) return null
  const items = MOBILE_NAV[role]?.slice(0, 5) ?? []

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-bg-100 border-t border-white/[0.08] z-50 pb-safe">
      <div className="flex">
        {items.map((item) => {
          const Icon = ICONS[item.icon] || Home
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-all ${
                isActive ? 'text-brand' : 'text-ink-3'
              }`}
            >
              <div className={`relative ${isActive ? 'after:absolute after:-top-1 after:left-1/2 after:-translate-x-1/2 after:w-4 after:h-0.5 after:bg-brand after:rounded-full' : ''}`}>
                <Icon size={18} />
              </div>
              <span className="truncate max-w-[48px] text-center leading-tight">
                {lang === 'th' ? item.label_th : item.label_en}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

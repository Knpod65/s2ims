'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'
import { NAV_CONFIG, ROLE_LABELS } from '@/lib/navigation'
import {
  LayoutDashboard, BookOpen, FileText, User, Bell, ClipboardList,
  FilePlus, ScanLine, BarChart3, Users, Shield, ScrollText, Download,
  Settings, PlusCircle, TrendingUp, History, LogOut, ChevronRight
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, BookOpen, FileText, User, Bell, ClipboardList,
  FilePlus, ScanLine, BarChart3, Users, Shield, ScrollText, Download,
  Settings, PlusCircle, TrendingUp, History,
}

export default function Sidebar() {
  const { user, role, logout } = useAuth()
  const { lang } = useLang()
  const pathname = usePathname()

  if (!role || !user) return null
  const items = NAV_CONFIG[role]
  const roleLabel = ROLE_LABELS[role]

  return (
    <aside className="w-[240px] bg-bg-100 border-r border-white/[0.08] flex flex-col h-full">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/[0.08]">
        <div className="font-display font-bold text-lg tracking-tight text-ink-1">S²IMS</div>
        <div className="text-[10px] text-ink-3 mt-0.5 font-mono">v1.0 PROTOTYPE</div>
      </div>

      {/* Role badge */}
      <div className="px-4 py-3 border-b border-white/[0.08]">
        <div className="text-[10px] text-ink-3 uppercase tracking-widest mb-1.5">
          {lang === 'th' ? 'บทบาท' : 'Role'}
        </div>
        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${roleLabel.color}`}>
          {lang === 'th' ? roleLabel.th : roleLabel.en}
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-3 overflow-y-auto">
        {items.map((item) => {
          const Icon = ICONS[item.icon] || ChevronRight
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} />
              <span>{lang === 'th' ? item.label_th : item.label_en}</span>
              {item.badge && (
                <span className="ml-auto bg-status-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + logout */}
      <div className="border-t border-white/[0.08] p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand text-sm font-bold">
            {(lang === 'th' ? user.name_th : user.name_en)[0]}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-ink-1 truncate">
              {lang === 'th' ? user.name_th : user.name_en}
            </div>
            <div className="text-[10px] text-ink-3 truncate">{user.email}</div>
          </div>
        </div>
        <button
          onClick={() => { logout(); window.location.href = '/login' }}
          className="btn-ghost w-full flex items-center gap-2 text-xs"
        >
          <LogOut size={13} />
          {lang === 'th' ? 'ออกจากระบบ' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}

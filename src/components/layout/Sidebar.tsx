'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'
import { NAV_CONFIG, ROLE_LABELS } from '@/lib/navigation'
import {
  LayoutDashboard, BookOpen, FileText, User, Bell, ClipboardList,
  FilePlus, ScanLine, BarChart3, Users, Shield, ScrollText, Download,
  Settings, PlusCircle, TrendingUp, History, LogOut, ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  LayoutDashboard, BookOpen, FileText, User, Bell, ClipboardList,
  FilePlus, ScanLine, BarChart3, Users, Shield, ScrollText, Download,
  Settings, PlusCircle, TrendingUp, History,
}

/*
  Sidebar — premium role-themed redesign
  ────────────────────────────────────────
  Visual structure:
  ┌──────────────────────────────┐
  │ ═══ role-gradient accent bar │ ← 2 px
  │                              │
  │  S²IMS  v1.0 PROTOTYPE       │ ← logo section
  ├──────────────────────────────┤
  │  ● STUDENT                   │ ← role badge (role-colour from CSS vars)
  ├──────────────────────────────┤
  │  nav items                   │ ← .sidebar-item.active uses CSS vars
  │  ...                         │
  ├──────────────────────────────┤
  │  avatar  Name                │ ← user footer
  │  [Logout]                    │
  └──────────────────────────────┘

  Active state colour is inherited from .sidebar-item.active in globals.css
  (which reads --role-primary-hex, --role-surface, --role-border).
  No hardcoded amber in this component.
*/
export default function Sidebar() {
  const { user, role, logout } = useAuth()
  const { lang } = useLang()
  const pathname = usePathname()

  if (!role || !user) return null

  const items    = NAV_CONFIG[role]
  const roleLabel = ROLE_LABELS[role]
  const displayName = lang === 'th' ? user.name_th : user.name_en
  const avatarChar  = displayName.charAt(0).toUpperCase()

  return (
    <aside className="w-[240px] bg-bg-100 border-r border-line flex flex-col h-full">

      {/* ── Role gradient accent line (top edge) ── */}
      <div className="h-[2px] role-gradient-line shrink-0" />

      {/* ── Logo ── */}
      <div className="px-5 py-4 border-b border-line shrink-0">
        <div className="font-display font-bold text-lg tracking-tight leading-none">
          <span className="role-gradient-text">S²</span>
          <span className="text-ink-1">IMS</span>
        </div>
        <div className="text-[10px] text-ink-3 mt-1.5 font-mono tracking-[0.12em] uppercase">
          v1.0 · Prototype
        </div>
      </div>

      {/* ── Role badge ── */}
      <div className="px-4 py-3 border-b border-line shrink-0">
        <div className="text-[9px] font-semibold uppercase tracking-[0.14em] text-ink-3 mb-1.5">
          {lang === 'th' ? 'บทบาทปัจจุบัน' : 'Active Role'}
        </div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
          style={{
            background:  'var(--role-surface)',
            color:       'var(--role-primary-hex)',
            border:      '1px solid var(--role-border)',
          }}
        >
          {/* Dot indicator */}
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ background: 'var(--role-primary-hex)' }}
          />
          {lang === 'th' ? roleLabel.th : roleLabel.en}
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-2.5 overflow-y-auto">
        {items.map((item) => {
          const Icon    = ICONS[item.icon] ?? ChevronRight
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <Icon size={15} strokeWidth={isActive ? 2 : 1.75} />
              <span className="truncate">
                {lang === 'th' ? item.label_th : item.label_en}
              </span>
              {item.badge != null && item.badge > 0 && (
                <span
                  className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full
                             bg-status-danger/15 text-red-400 border border-status-danger/20
                             leading-none"
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* ── User footer ── */}
      <div className="border-t border-line p-4 shrink-0">
        {/* Avatar + name row */}
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center
                       text-[12px] font-bold font-display shrink-0"
            style={{
              background: 'var(--role-surface)',
              color:      'var(--role-primary-hex)',
              border:     '1px solid var(--role-border)',
            }}
          >
            {avatarChar}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-ink-1 truncate leading-snug">
              {displayName}
            </div>
            <div className="text-[10px] text-ink-3 truncate leading-snug mt-0.5">
              {user.email}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { logout(); window.location.href = '/login' }}
          className="btn-ghost w-full text-xs justify-start"
        >
          <LogOut size={13} strokeWidth={1.75} />
          {lang === 'th' ? 'ออกจากระบบ' : 'Logout'}
        </button>
      </div>
    </aside>
  )
}

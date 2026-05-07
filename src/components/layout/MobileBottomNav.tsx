'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'
import { MOBILE_NAV } from '@/lib/navigation'
import {
  Home, BookOpen, FileText, Bell, User, BarChart3, ClipboardList,
  LayoutDashboard, FilePlus, PlusCircle, TrendingUp, Shield, History,
  ScrollText, Download, Settings, ScanLine, Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICONS: Record<string, LucideIcon> = {
  Home, BookOpen, FileText, Bell, User, BarChart3, ClipboardList,
  LayoutDashboard, FilePlus, PlusCircle, TrendingUp, Shield, History,
  ScrollText, Download, Settings, ScanLine, Users,
}

/*
  MobileBottomNav — role-themed indicator
  ─────────────────────────────────────────
  • Active item icon + label colour via --role-primary-hex (inline style)
  • Active indicator: 3 px pill at the very top, coloured by role gradient
  • Inactive items: ink-3 (muted)
  • Background: bg-100 with subtle top border
  • Safe-area padding applied via .pb-safe
*/
export default function MobileBottomNav() {
  const { role } = useAuth()
  const { lang }  = useLang()
  const pathname  = usePathname()

  if (!role) return null

  const items = (MOBILE_NAV[role] ?? []).slice(0, 5)

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 pb-safe
                 bg-bg-100 border-t border-line"
    >
      <div className="flex">
        {items.map((item) => {
          const Icon     = ICONS[item.icon] ?? Home
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors duration-150"
              style={isActive
                ? { color: 'var(--role-primary-hex)' }
                : { color: '#737688' }
              }
            >
              {/* Active indicator pill at top */}
              <div className="relative flex items-center justify-center w-full">
                {isActive && (
                  <div
                    className="absolute -top-2.5 left-1/2 -translate-x-1/2
                               w-5 h-[3px] rounded-full role-gradient-line"
                  />
                )}
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </div>

              {/* Label */}
              <span className="text-[10px] font-medium truncate max-w-[52px] text-center leading-tight">
                {lang === 'th' ? item.label_th : item.label_en}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

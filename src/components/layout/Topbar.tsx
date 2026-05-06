'use client'
import { Bell, Globe } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'
import { mockNotifications } from '@/data/mock/notifications'

export default function Topbar({ title }: { title?: string }) {
  const { lang, setLang } = useLang()
  const { role } = useAuth()
  const unread = mockNotifications.filter(n => !n.is_read).length

  return (
    <header className="h-[52px] bg-bg-100 border-b border-white/[0.08] flex items-center px-5 gap-4 sticky top-0 z-50">
      {/* System name */}
      <div className="flex items-center gap-2 mr-auto">
        <span className="font-display font-bold text-sm text-ink-1 md:hidden">S²IMS</span>
        {title && <span className="text-ink-2 text-sm hidden md:block">{title}</span>}
      </div>

      {/* Lang toggle */}
      <button
        onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-ink-2 hover:text-ink-1 hover:bg-white/[0.1] transition-all"
      >
        <Globe size={13} />
        {lang === 'th' ? 'EN' : 'ภาษาไทย'}
      </button>

      {/* Notifications bell */}
      <button className="relative p-1.5 rounded-md hover:bg-white/[0.06] text-ink-2 hover:text-ink-1 transition-all">
        <Bell size={16} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-status-danger text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </header>
  )
}

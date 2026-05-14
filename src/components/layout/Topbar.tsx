'use client'
import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, Globe } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'
import { ROLE_LABELS } from '@/lib/navigation'
import { mockNotifications } from '@/data/mock/notifications'
import {
  createTopbarNotificationPayload,
  notificationNavigationPresenter,
  notificationNavigationService,
} from '@/lib/notifications'

/*
  Topbar — premium redesign
  ─────────────────────────
  Layout (left → right):
    [S²IMS brand + product]  [/ Page title]  ···spacer···
    [Role] [Freshness] [Lang] [Notifications] [Profile]

  Visual accents:
  • 2 px role-gradient line at the very bottom edge (auto-adapts to data-role)
  • Logo: S² in role-gradient-text, IMS in ink-1
  • Notification badge stays red (status-danger) — role-neutral urgency signal
  • Avatar pill uses role-surface bg + role-primary-hex text (from CSS vars)
*/
export default function Topbar({ title }: { title?: string }) {
  const { lang, setLang } = useLang()
  const { user, role } = useAuth()
  const router = useRouter()
  const unread = mockNotifications.filter((n) => !n.is_read).length
  const roleLabel = role ? ROLE_LABELS[role] : null
  const displayName = user ? (lang === 'th' ? user.name_th : user.name_en) : ''
  const notificationNavigation = useMemo(() => {
    const payload = createTopbarNotificationPayload({
      role,
      unreadCount: unread,
      lang,
    })
    const resolution = notificationNavigationService.resolve(payload, {
      actorRole: role ?? 'guest',
      lang,
    })

    return notificationNavigationPresenter.present(payload, resolution, { lang })
  }, [role, unread, lang])

  /* First character of the user's display name */
  const avatarChar = displayName ? displayName.charAt(0).toUpperCase() : '?'
  const handleNotificationClick = () => {
    if (notificationNavigation.isClickable && notificationNavigation.href) {
      router.push(notificationNavigation.href)
    }
  }

  return (
    <header className="relative h-[52px] bg-bg-100/90 backdrop-blur-xl border-b border-line flex items-center px-4 gap-3 sticky top-0 z-50 select-none">

      {/* ── Role gradient accent line (2 px, bottom edge) ── */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] role-gradient-line opacity-50 pointer-events-none" />

      {/* ── Left: Logo + optional breadcrumb title ── */}
      <div className="flex items-center gap-3 mr-auto min-w-0">
        {/* S²IMS logotype — always visible */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="font-display font-bold text-sm tracking-tight leading-none">
            <span className="role-gradient-text">S²</span>
            <span className="text-ink-1">IMS</span>
          </div>
          <div className="hidden sm:block h-5 w-px bg-line" />
          <div className="hidden sm:block">
            <div className="text-[11px] font-semibold text-ink-1 leading-tight">
              {lang === 'th' ? 'ระบบทุนอัจฉริยะ' : 'Scholarship Intelligence'}
            </div>
            <div className="hidden lg:block text-[10px] text-ink-3 leading-tight">
              {lang === 'th' ? 'S²IMS Workspace' : 'S²IMS Workspace'}
            </div>
          </div>
        </div>

        {/* Page title — desktop only, shown as breadcrumb */}
        {title && (
          <div className="hidden md:flex items-center gap-1.5 min-w-0">
            <span className="text-ink-3 text-sm">/</span>
            <span className="text-sm text-ink-2 truncate max-w-[320px]">{title}</span>
          </div>
        )}
      </div>

      {/* ── Right: controls ── */}
      <div className="flex items-center gap-1.5">
        {roleLabel && (
          <span
            className="hidden md:inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
            style={{
              background: 'var(--role-tint)',
              color: 'var(--role-primary-hex)',
              border: '1px solid var(--role-border)',
            }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-role-gradient" />
            {lang === 'th' ? roleLabel.th : roleLabel.en}
          </span>
        )}

        <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full bg-white border border-line px-2.5 py-1 text-[11px] font-medium text-ink-2">
          <span className="h-1.5 w-1.5 rounded-full bg-status-success animate-pulse-soft" />
          {lang === 'th' ? 'ซิงก์ล่าสุด' : 'Synced recently'}
        </span>

        {/* Language toggle */}
        <button
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md
                     bg-white border border-line
                     text-ink-2 hover:text-ink-1 hover:bg-surface-low
                     transition-all duration-150"
          aria-label="Toggle language"
        >
          <Globe size={12} strokeWidth={2} />
          <span>{lang === 'th' ? 'EN' : 'ไทย'}</span>
        </button>

        {/* Notification bell */}
        <button
          onClick={handleNotificationClick}
          className={`relative p-1.5 rounded-md
                     text-ink-2 transition-all duration-150
                     ${notificationNavigation.isClickable
                       ? 'hover:text-ink-1 hover:bg-role-tint'
                       : 'opacity-60 cursor-not-allowed'}`}
          aria-label={`${notificationNavigation.ariaLabel}${unread > 0
            ? lang === 'th'
              ? `, มี ${unread} รายการที่ยังไม่ได้อ่าน`
              : `, ${unread} unread`
            : ''}`}
          aria-disabled={!notificationNavigation.isClickable}
          title={notificationNavigation.disabledReason ?? notificationNavigation.actionLabel}
        >
          <Bell size={16} strokeWidth={1.75} />
          {unread > 0 && (
            <span
              className="absolute -top-0.5 -right-0.5
                         bg-status-danger text-white text-[9px] font-bold
                         w-4 h-4 rounded-full
                         flex items-center justify-center leading-none
                         ring-1 ring-bg-100"
            >
              {unread > 9 ? '9+' : unread}
            </span>
          )}
        </button>

        {/* User avatar chip — shows role colour from CSS vars */}
        {user && (
          <div
            className="ml-0.5 pl-2 border-l border-line flex items-center gap-2"
          >
            <div className="hidden xl:block text-right leading-tight">
              <div className="text-[11px] font-medium text-ink-1 max-w-[150px] truncate">
                {displayName}
              </div>
              <div className="text-[10px] text-ink-3">
                {lang === 'th' ? 'โปรไฟล์' : 'Profile'}
              </div>
            </div>
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center
                         text-[11px] font-bold font-display
                         transition-all duration-150 cursor-default"
              style={{
                background:  'var(--role-surface)',
                color:       'var(--role-primary-hex)',
                border:      '1px solid var(--role-border)',
              }}
              title={lang === 'th' ? user.name_th : user.name_en}
              aria-label={`Logged in as ${lang === 'th' ? user.name_th : user.name_en}`}
            >
              {avatarChar}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

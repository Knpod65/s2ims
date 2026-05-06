'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockNotifications } from '@/data/mock/notifications'
import { PageHeader } from '@/components/ui/index'
import { useToast } from '@/components/ui/Toast'
import type { Notification } from '@/lib/types'

const TYPE_ICON: Record<string, string> = {
  SCHOLARSHIP_OPEN: '🎓',
  DEADLINE_REMINDER: '⏰',
  MISSING_DOC: '📄',
  SHORTLISTED: '⭐',
  INTERVIEW_SCHEDULE: '📅',
  RESULT_AWARDED: '🏆',
  RESULT_NOT_AWARDED: '📋',
  CONFIRM_NEEDED: '✅',
  FINANCE_DOCS: '💳',
  REPORT_DUE: '📝',
  REPORT_OVERDUE: '🚨',
  ESQ_APPROVAL_NEEDED: '🔔',
  ANNOUNCEMENT_APPROVED: '✔️',
}

export default function NotificationsPage() {
  const { lang } = useLang()
  const router = useRouter()
  const { addToast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
  }

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    addToast(lang === 'th' ? 'อ่านทั้งหมดแล้ว' : 'All marked as read', 'info')
  }

  const handleClick = (n: Notification) => {
    markRead(n.id)
    if (n.action_url) router.push(n.action_url)
  }

  const unread = notifications.filter(n => !n.is_read)
  const read = notifications.filter(n => n.is_read)

  return (
    <AppShell requiredRole="student">
      <PageHeader
        title={lang === 'th' ? 'การแจ้งเตือน' : 'Notifications'}
        subtitle={`${unread.length} ${lang === 'th' ? 'ใหม่' : 'unread'}`}
        actions={unread.length > 0 ? (
          <button onClick={markAllRead} className="btn-ghost text-xs">
            {lang === 'th' ? 'อ่านทั้งหมด' : 'Mark all read'}
          </button>
        ) : undefined}
      />

      {unread.length > 0 && (
        <div className="mb-6">
          <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-2">
            {lang === 'th' ? 'ยังไม่ได้อ่าน' : 'Unread'}
          </div>
          <div className="space-y-2">
            {unread.map(n => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className="w-full text-left card p-4 border-brand/10 hover:border-brand/25 transition-all cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className="text-lg leading-none flex-shrink-0 mt-0.5">
                    {TYPE_ICON[n.type] ?? '🔔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-semibold text-sm text-ink-1">
                        {lang === 'th' ? n.title_th : n.title_en}
                      </div>
                      <div className="w-2 h-2 bg-brand rounded-full flex-shrink-0 mt-1.5" />
                    </div>
                    <div className="text-xs text-ink-3 mt-1 line-clamp-2">
                      {lang === 'th' ? n.body_th : n.body_en}
                    </div>
                    <div className="text-[10px] text-ink-3 mt-2">
                      {new Date(n.created_at).toLocaleDateString(
                        lang === 'th' ? 'th-TH' : 'en-US',
                        { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
                      )}
                      {n.action_url && (
                        <span className="ml-2 text-brand">{lang === 'th' ? '→ ดูรายละเอียด' : '→ View details'}</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-widest text-ink-3 mb-2">
            {lang === 'th' ? 'อ่านแล้ว' : 'Read'}
          </div>
          <div className="space-y-2">
            {read.map(n => (
              <button
                key={n.id}
                onClick={() => handleClick(n)}
                className="w-full text-left card p-4 opacity-50 hover:opacity-70 transition-opacity cursor-pointer"
              >
                <div className="flex gap-3">
                  <div className="text-base leading-none flex-shrink-0 mt-0.5">
                    {TYPE_ICON[n.type] ?? '🔔'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-ink-2">
                      {lang === 'th' ? n.title_th : n.title_en}
                    </div>
                    <div className="text-xs text-ink-3 mt-1 line-clamp-1">
                      {lang === 'th' ? n.body_th : n.body_en}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {notifications.length === 0 && (
        <div className="text-center py-16 text-ink-3">
          <div className="text-4xl mb-3 opacity-30">🔕</div>
          <div className="text-sm">{lang === 'th' ? 'ไม่มีการแจ้งเตือน' : 'No notifications'}</div>
        </div>
      )}
    </AppShell>
  )
}

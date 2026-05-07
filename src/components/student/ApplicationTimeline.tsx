'use client'
import { AlertTriangle, Check, Clock, Circle } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { StudentTimelineEvent } from '@/data/mock/studentApplicationData'

type ApplicationTimelineProps = {
  events: StudentTimelineEvent[]
  compact?: boolean
  className?: string
}

const EVENT_STYLE = {
  done: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  active: 'border-role-primary bg-role-tint text-role-primary',
  attention: 'border-[#FDE68A] bg-[#FFFBEB] text-[#78350F]',
  pending: 'border-line bg-surface-low text-ink-3',
}

const EVENT_ICON = {
  done: Check,
  active: Clock,
  attention: AlertTriangle,
  pending: Circle,
}

export default function ApplicationTimeline({ events, compact = false, className = '' }: ApplicationTimelineProps) {
  const { lang } = useLang()

  return (
    <div className={`space-y-0 ${className}`}>
      {events.map((event, index) => {
        const isLast = index === events.length - 1
        const Icon = EVENT_ICON[event.state]
        return (
          <div key={event.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 ${EVENT_STYLE[event.state]}`}>
                <Icon size={13} />
              </div>
              {!isLast && (
                <div className={`mt-1 min-h-8 w-0.5 flex-1 ${event.state === 'done' ? 'bg-emerald-200' : 'bg-line'}`} />
              )}
            </div>
            <div className={`min-w-0 flex-1 ${isLast ? '' : 'pb-5'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <div className="text-sm font-semibold text-ink-1">{event.label[lang]}</div>
                {!compact && (
                  <div className="font-mono text-[10px] text-ink-3">
                    {new Date(event.date).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                )}
              </div>
              {!compact && (
                <p className="mt-1 text-xs leading-relaxed text-ink-3">{event.description[lang]}</p>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

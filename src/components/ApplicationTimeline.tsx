'use client'
import { Check, AlertCircle, Clock } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { ApplicationStep } from '@/lib/types'

interface Props {
  steps: ApplicationStep[]
  compact?: boolean
}

export default function ApplicationTimeline({ steps, compact }: Props) {
  const { lang } = useLang()

  return (
    <div className="flex flex-col gap-0">
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1
        const label = lang === 'th' ? step.label_th : step.label_en

        return (
          <div key={i} className="flex gap-3">
            {/* Dot + line */}
            <div className="flex flex-col items-center">
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all
                ${step.status === 'done' ? 'bg-status-success/20 border-status-success' : ''}
                ${step.status === 'active' ? 'bg-role-tint border-role-primary animate-pulse-soft' : ''}
                ${step.status === 'error' ? 'bg-status-danger/20 border-status-danger' : ''}
                ${step.status === 'pending' ? 'bg-bg-300 border-line' : ''}
              `}>
                {step.status === 'done' && <Check size={12} className="text-status-success" />}
                {step.status === 'active' && <div className="w-2 h-2 bg-role-primary rounded-full" />}
                {step.status === 'error' && <AlertCircle size={12} className="text-status-danger" />}
                {step.status === 'pending' && <div className="w-1.5 h-1.5 bg-ink-3 rounded-full" />}
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[20px] mt-1 ${
                  step.status === 'done' ? 'bg-status-success/30' : 'bg-white border border-line'
                }`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-4 flex-1 min-w-0 ${isLast ? 'pb-0' : ''}`}>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-sm font-medium ${
                  step.status === 'pending' ? 'text-ink-3' :
                  step.status === 'error' ? 'text-status-danger' :
                  step.status === 'active' ? 'text-role-primary' :
                  'text-ink-1'
                }`}>{label}</span>
                {step.date && !compact && (
                  <span className="text-[10px] text-ink-3 flex items-center gap-1">
                    <Clock size={9} />
                    {new Date(step.date).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                )}
              </div>
              {step.note && !compact && (
                <div className={`mt-1 text-xs ${step.status === 'error' ? 'text-status-danger/80' : step.status === 'active' ? 'text-role-primary' : 'text-ink-3'}`}>
                  {step.note}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

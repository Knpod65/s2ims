'use client'

import { useLang } from '@/lib/i18n'
import { AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useState } from 'react'
import type { SuspiciousActivityAlert } from '@/data/mock/adminData'

interface SecurityAlertCardProps {
  alert: SuspiciousActivityAlert
  onMarkReviewed?: (alertId: string) => void
  onEscalate?: (alertId: string) => void
}

export default function SecurityAlertCard({
  alert,
  onMarkReviewed,
  onEscalate,
}: SecurityAlertCardProps) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high':
        return <AlertTriangle size={14} className="text-status-danger" />
      case 'medium':
        return <AlertCircle size={14} className="text-status-warning" />
      default:
        return <AlertCircle size={14} className="text-role-primary" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-status-danger/10 border-status-danger/20'
      case 'medium':
        return 'bg-status-warning/10 border-status-warning/20'
      default:
        return 'bg-role-tint border-role-border'
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      open: { th: 'เปิดอยู่', en: 'Open' },
      investigating: { th: 'กำลังสอบสวน', en: 'Investigating' },
      reviewed: { th: 'ตรวจสอบแล้ว', en: 'Reviewed' },
      escalated: { th: 'ขยายขึ้น', en: 'Escalated' },
      closed: { th: 'ปิด', en: 'Closed' },
    }
    return labels[status]?.[lang === 'th' ? 'th' : 'en'] || status
  }

  return (
    <div className={`rounded-lg border transition-all ${getSeverityColor(alert.severity)}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 hover:bg-surface-low transition-colors text-left"
      >
        <div className="mt-0.5">{getSeverityIcon(alert.severity)}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold text-sm text-ink-1">
              {lang === 'th' ? alert.description_th : alert.description_en}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-bg-100 text-ink-3">
              {getStatusLabel(alert.status)}
            </span>
          </div>
          <p className="text-xs text-ink-3">
            {new Date(alert.createdAt).toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')}
          </p>
        </div>
        <div className="text-xs text-ink-3">{expanded ? '−' : '+'}</div>
      </button>

      {expanded && (
        <div className="border-t border-line p-4 bg-bg-200/50 space-y-3">
          <div className="p-3 rounded bg-bg-100 border border-line">
            <p className="text-xs text-ink-3 font-semibold mb-1">
              {lang === 'th' ? 'รายละเอียด' : 'Details'}
            </p>
            <div className="space-y-1 text-xs text-ink-1 font-mono">
              {Object.entries(alert.details || {}).map(([key, val]) => (
                <div key={key} className="flex gap-2">
                  <span className="text-ink-3">{key}:</span>
                  <span>{String(val)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 rounded bg-[#FFFBEB] border border-[#FDE68A] text-[#78350F]">
            <p className="text-xs font-semibold mb-1">
              {lang === 'th' ? 'คำแนะนำ' : 'Recommendation'}
            </p>
            <p className="text-xs">
              {lang === 'th' ? alert.recommendation_th : alert.recommendation_en}
            </p>
          </div>

          {alert.reviewedBy && (
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-emerald-700 font-semibold mb-1">
                {lang === 'th' ? 'บันทึกการตรวจสอบ' : 'Review Notes'}
              </p>
              <p className="text-xs text-emerald-700">
                {lang === 'th' ? 'ตรวจสอบโดย:' : 'Reviewed by:'} {alert.reviewedBy}
              </p>
            </div>
          )}

          {alert.status === 'open' && (
            <div className="pt-3 border-t border-line space-y-2 flex gap-2">
              {onMarkReviewed && (
                <button
                  onClick={() => onMarkReviewed(alert.id)}
                  className="flex-1 text-xs py-2 px-3 bg-status-success/10 text-status-success rounded hover:bg-status-success/20 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle2 size={12} />
                  {lang === 'th' ? 'ทำเครื่องหมายว่าตรวจสอบแล้ว' : 'Mark Reviewed'}
                </button>
              )}
              {onEscalate && (
                <button
                  onClick={() => onEscalate(alert.id)}
                  className="flex-1 text-xs py-2 px-3 bg-status-danger/10 text-status-danger rounded hover:bg-status-danger/20 transition-colors flex items-center justify-center gap-1"
                >
                  <AlertTriangle size={12} />
                  {lang === 'th' ? 'ขยายขึ้น' : 'Escalate'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

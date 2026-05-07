'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { X } from 'lucide-react'
import AuditWarningCard from './AuditWarningCard'

interface MatchOverrideModalProps {
  isOpen: boolean
  onClose: () => void
  studentToken: string
  originalDecision: 'approved' | 'rejected'
  proposedDecision: 'approved' | 'rejected'
  matchScore: number
  onSubmit: (reason: string) => void
  isSubmitting?: boolean
}

export default function MatchOverrideModal({
  isOpen,
  onClose,
  studentToken,
  originalDecision,
  proposedDecision,
  matchScore,
  onSubmit,
  isSubmitting,
}: MatchOverrideModalProps) {
  const { lang } = useLang()
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    if (reason.trim()) {
      onSubmit(reason)
      setReason('')
    }
  }

  if (!isOpen) return null

  const getDecisionLabel = (decision: string) => {
    const labels: Record<string, Record<string, string>> = {
      approved: { th: 'อนุมัติ', en: 'Approved' },
      rejected: { th: 'ปฏิเสธ', en: 'Rejected' },
    }
    return labels[decision]?.[lang === 'th' ? 'th' : 'en'] || decision
  }

  return (
    <div className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-[0_28px_80px_rgba(15,23,42,.18)] border border-line">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-line">
          <h2 className="font-semibold text-ink-1">
            {lang === 'th' ? 'ขอแทนที่การจับคู่' : 'Manual Match Override'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-surface-low rounded transition-colors"
            disabled={isSubmitting}
          >
            <X size={16} className="text-ink-3" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Current vs Proposed */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-surface-low rounded-lg p-3 border border-line">
              <p className="text-xs text-ink-3 mb-1">{lang === 'th' ? 'การตัดสินใจปัจจุบัน' : 'Current Decision'}</p>
              <p className="font-semibold text-sm text-ink-1">{getDecisionLabel(originalDecision)}</p>
            </div>
            <div className="bg-role-tint rounded-lg p-3 border border-role">
              <p className="text-xs text-role mb-1">{lang === 'th' ? 'การตัดสินใจที่เสนอ' : 'Proposed Decision'}</p>
              <p className="font-semibold text-sm text-role">{getDecisionLabel(proposedDecision)}</p>
            </div>
          </div>

          {/* Student & Match Info */}
          <div className="bg-surface-low rounded-lg p-3 space-y-2 border border-line">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-3">{lang === 'th' ? 'นักเรียน' : 'Student'}</span>
              <span className="font-mono font-medium text-ink-1">{studentToken}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-3">{lang === 'th' ? 'คะแนนการจับคู่' : 'Match Score'}</span>
              <span className="font-medium text-ink-1">{(matchScore * 100).toFixed(1)}%</span>
            </div>
          </div>

          {/* Audit Warning */}
          <AuditWarningCard
            title={lang === 'th' ? 'การแทนที่ด้วยตนเอง' : 'Manual Override'}
            message={lang === 'th'
              ? 'การตัดสินใจนี้จะถูกบันทึกลงในประวัติการตรวจสอบ โปรดระบุเหตุผลที่ชัดเจนและสนับสนุน'
              : 'This override will be logged in the audit trail. Please provide clear, documented justification.'}
            requiresReason
          />

          {/* Reason Input */}
          <div>
            <label className="text-xs text-ink-3 font-medium block mb-2">
              {lang === 'th' ? 'เหตุผล (บังคับ)' : 'Reason (Required)'}
            </label>
            <textarea
              placeholder={lang === 'th' ? 'กรุณาระบุเหตุผลอย่างละเอียด...' : 'Please provide detailed justification...'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-base w-full text-xs py-2"
              rows={3}
              disabled={isSubmitting}
            />
            <p className="text-xs text-ink-3 mt-1">
              {lang === 'th'
                ? 'ตัวอักษรขั้นต่ำ: 20'
                : 'Minimum: 20 characters'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 p-4 border-t border-line bg-surface-low/70">
          <button
            onClick={onClose}
            className="flex-1 text-xs py-2 px-3 bg-white border border-line text-ink-1 rounded hover:bg-surface-muted transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || reason.length < 20 || isSubmitting}
            className="flex-1 text-xs py-2 px-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (lang === 'th' ? 'กำลังส่ง...' : 'Submitting...') : lang === 'th' ? 'ส่งการแทนที่' : 'Submit Override'}
          </button>
        </div>
      </div>
    </div>
  )
}

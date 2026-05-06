'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { X } from 'lucide-react'
import AuditWarningCard from './AuditWarningCard'

interface DisclosureRejectionModalProps {
  isOpen: boolean
  onClose: () => void
  candidateToken: string
  providerName: string
  onReject: (reason: string) => void
  isSubmitting?: boolean
}

export default function DisclosureRejectionModal({
  isOpen,
  onClose,
  candidateToken,
  providerName,
  onReject,
  isSubmitting,
}: DisclosureRejectionModalProps) {
  const { lang } = useLang()
  const [reason, setReason] = useState('')

  const handleSubmit = () => {
    if (reason.trim()) {
      onReject(reason)
      setReason('')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-100 rounded-lg max-w-md w-full mx-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          <h2 className="font-semibold text-ink-1">
            {lang === 'th' ? 'ปฏิเสธการเปิดเผยตัวตน' : 'Reject Disclosure'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/[0.08] rounded transition-colors"
            disabled={isSubmitting}
          >
            <X size={16} className="text-ink-3" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4">
          {/* Info */}
          <div className="bg-bg-200 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-3">{lang === 'th' ? 'ผู้สมัคร' : 'Candidate'}</span>
              <span className="font-medium text-ink-1">{candidateToken}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-ink-3">{lang === 'th' ? 'ผู้ให้โครงการ' : 'Provider'}</span>
              <span className="font-medium text-ink-1">{providerName}</span>
            </div>
          </div>

          {/* Audit Warning */}
          <AuditWarningCard
            title={lang === 'th' ? 'ปฏิเสธการเปิดเผย' : 'Disclosure Rejection'}
            message={lang === 'th'
              ? 'การปฏิเสธนี้จะบันทึกลงในประวัติการตรวจสอบ โปรดระบุเหตุผลที่ชัดเจน'
              : 'This rejection will be logged in the audit trail. Please provide a clear reason.'}
            requiresReason
          />

          {/* Rejection Reason */}
          <div>
            <label className="text-xs text-ink-3 font-medium block mb-2">
              {lang === 'th' ? 'เหตุผลการปฏิเสธ (บังคับ)' : 'Rejection Reason (Required)'}
            </label>
            <textarea
              placeholder={lang === 'th'
                ? 'กรุณาระบุเหตุผลการปฏิเสธ...'
                : 'Please provide rejection reason...'}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="input-base w-full text-xs py-2"
              rows={3}
              disabled={isSubmitting}
            />
            <p className="text-xs text-ink-3 mt-1">
              {lang === 'th' ? 'ตัวอักษรขั้นต่ำ: 15' : 'Minimum: 15 characters'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 p-4 border-t border-white/[0.08] bg-bg-200/50">
          <button
            onClick={onClose}
            className="flex-1 text-xs py-2 px-3 bg-white/[0.08] text-ink-1 rounded hover:bg-white/[0.12] transition-colors disabled:opacity-50"
            disabled={isSubmitting}
          >
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>
          <button
            onClick={handleSubmit}
            disabled={!reason.trim() || reason.length < 15 || isSubmitting}
            className="flex-1 text-xs py-2 px-3 bg-status-danger/10 text-status-danger rounded hover:bg-status-danger/20 transition-colors disabled:opacity-50"
          >
            {isSubmitting
              ? lang === 'th'
                ? 'กำลังปฏิเสธ...'
                : 'Rejecting...'
              : lang === 'th'
              ? '✗ ปฏิเสธ'
              : '✗ Reject'}
          </button>
        </div>
      </div>
    </div>
  )
}

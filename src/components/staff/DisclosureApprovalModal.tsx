'use client'

import { useLang } from '@/lib/i18n'
import { X, CheckCircle2 } from 'lucide-react'
import AuditWarningCard from './AuditWarningCard'

interface DisclosureApprovalModalProps {
  isOpen: boolean
  onClose: () => void
  candidateToken: string
  providerName: string
  fieldsToDisclose: string[]
  matchSummary: string
  onApprove: () => void
  isSubmitting?: boolean
}

export default function DisclosureApprovalModal({
  isOpen,
  onClose,
  candidateToken,
  providerName,
  fieldsToDisclose,
  matchSummary,
  onApprove,
  isSubmitting,
}: DisclosureApprovalModalProps) {
  const { lang } = useLang()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-100 rounded-lg max-w-md w-full mx-4 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          <h2 className="font-semibold text-ink-1">
            {lang === 'th' ? 'อนุมัติการเปิดเผยตัวตน' : 'Approve Disclosure'}
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
        <div className="p-4 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
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

          {/* Match Summary */}
          <div className="p-3 rounded bg-brand/10 border border-brand/20">
            <p className="text-xs text-brand font-semibold mb-1">
              {lang === 'th' ? 'สรุปการจับคู่' : 'Match Summary'}
            </p>
            <p className="text-xs text-brand/90">{matchSummary}</p>
          </div>

          {/* Fields to Disclose - Prominent Display */}
          <div className="p-4 rounded-lg bg-status-success/[0.08] border border-status-success/20">
            <p className="text-xs text-status-success font-semibold mb-3 flex items-center gap-1">
              <CheckCircle2 size={12} />
              {lang === 'th' ? 'ฟิลด์ที่จะเปิดเผยต่อนักเรียน' : 'Fields to Disclose to Student'}
            </p>
            <div className="space-y-2">
              {fieldsToDisclose.map((field, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs bg-white/[0.05] p-2 rounded">
                  <CheckCircle2 size={12} className="text-status-success flex-shrink-0" />
                  <span className="text-ink-1">{field}</span>
                </div>
              ))}
            </div>
            <p className="text-xs text-status-success/80 mt-3">
              {lang === 'th'
                ? '🔓 การเปิดเผยนี้จะทำให้นักเรียนเห็นตัวตนของผู้ให้โครงการและข้อมูลการจับคู่'
                : '🔓 This disclosure will reveal the provider and matching details to the student'}
            </p>
          </div>

          {/* Audit Warning */}
          <AuditWarningCard
            title={lang === 'th' ? 'การเปิดเผยตัวตน' : 'Identity Disclosure'}
            message={lang === 'th'
              ? 'การตัดสินใจนี้จะบันทึกไว้และไม่สามารถเปลี่ยนแปลงได้ เมื่อคุณอนุมัติแล้ว นักเรียนจะเห็นตัวตนของผู้ให้โครงการ'
              : 'This decision is logged and irreversible. Once approved, the student will see the provider identity.'}
            requiresReason
          />

          {/* Confirmation Message */}
          <div className="p-3 rounded bg-status-danger/[0.08] border border-status-danger/20">
            <p className="text-xs text-status-danger font-semibold mb-1">
              {lang === 'th' ? 'ยืนยันการกระทำของคุณ' : 'Confirm Your Action'}
            </p>
            <p className="text-xs text-status-danger/90">
              {lang === 'th'
                ? 'คลิกปุ่มด้านล่างเพื่อยืนยันการเปิดเผยตัวตนนี้ สิ่งนี้ไม่สามารถเลิกทำได้'
                : 'Click the button below to confirm this disclosure. This cannot be undone.'}
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
            onClick={onApprove}
            disabled={isSubmitting}
            className="flex-1 text-xs py-2 px-3 bg-status-success/10 text-status-success rounded hover:bg-status-success/20 transition-colors disabled:opacity-50 font-medium"
          >
            {isSubmitting
              ? lang === 'th'
                ? 'กำลังอนุมัติ...'
                : 'Approving...'
              : lang === 'th'
              ? '✓ ยืนยันการเปิดเผย'
              : '✓ Confirm Disclosure'}
          </button>
        </div>
      </div>
    </div>
  )
}

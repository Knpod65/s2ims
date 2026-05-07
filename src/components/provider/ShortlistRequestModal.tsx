'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { X } from 'lucide-react'
import ShortlistReasonField from './ShortlistReasonField'
import ShortlistConfirmationCard from './ShortlistConfirmationCard'

interface ShortlistRequestModalProps {
  isOpen: boolean
  onClose: () => void
  candidateCount: number
  scholarshipName: string
}

export default function ShortlistRequestModal({
  isOpen,
  onClose,
  candidateCount,
  scholarshipName,
}: ShortlistRequestModalProps) {
  const { lang } = useLang()
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setError('')

    if (!reason.trim()) {
      setError(lang === 'th' ? 'กรุณากรอกเหตุผล' : 'Please provide a reason')
      return
    }

    if (reason.trim().length < 10) {
      setError(lang === 'th' ? 'เหตุผลต้องมีความยาวอย่างน้อย 10 ตัวอักษร' : 'Reason must be at least 10 characters')
      return
    }

    // Submit (mock)
    setSubmitted(true)
  }

  const handleClose = () => {
    setReason('')
    setError('')
    setSubmitted(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/35 backdrop-blur-sm" onClick={handleClose} />

      {/* Modal */}
      <div className="relative w-full md:max-w-md bg-white rounded-t-3xl md:rounded-2xl shadow-[0_28px_80px_rgba(15,23,42,.18)] border border-line max-h-[90vh] md:max-h-none overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 md:p-6 border-b border-line bg-white/95 backdrop-blur-xl">
          <h2 className="font-semibold text-ink-1">
            {lang === 'th' ? 'ส่งขอเปิดเผยข้อมูล' : 'Request Information Disclosure'}
          </h2>
          <button onClick={handleClose} className="text-ink-3 hover:text-ink-1 hover:bg-surface-low rounded-md p-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          {submitted ? (
            <>
              <ShortlistConfirmationCard candidateCount={candidateCount} scholarshipName={scholarshipName} />
              <button
                onClick={handleClose}
                className="w-full mt-4 btn-secondary py-2.5 text-sm"
              >
                {lang === 'th' ? 'ปิด' : 'Close'}
              </button>
            </>
          ) : (
            <>
              {/* Summary */}
              <div className="bg-surface-low rounded-xl p-3 mb-4 border border-line">
                <p className="text-xs text-ink-3 mb-1">
                  {lang === 'th' ? 'จำนวนผู้สมัครที่เลือก:' : 'Selected candidates:'}
                </p>
                <p className="text-sm font-semibold text-ink-1">{candidateCount}</p>
              </div>

              <div className="bg-surface-low rounded-xl p-3 mb-4 border border-line">
                <p className="text-xs text-ink-3 mb-1">
                  {lang === 'th' ? 'ทุน:' : 'Scholarship:'}
                </p>
                <p className="text-sm font-semibold text-ink-1 truncate">{scholarshipName}</p>
              </div>

              {/* Reason Field */}
              <div className="mb-4">
                <ShortlistReasonField value={reason} onChange={setReason} error={error} />
              </div>

              {/* Privacy Notice */}
              <div className="mb-6 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <p className="text-xs text-blue-800 leading-relaxed">
                  {lang === 'th'
                    ? 'เจ้าหน้าที่จะตรวจสอบเหตุผลของคุณและตัดสินใจว่าจะเปิดเผยข้อมูลส่วนตัวของผู้สมัครหรือไม่'
                    : 'Staff will review your reason and decide whether to disclose personal information.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="flex-1 btn-secondary py-2.5 text-sm"
                >
                  {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60"
                  disabled={!reason.trim() || reason.trim().length < 10}
                >
                  {lang === 'th' ? 'ส่งขอ' : 'Submit Request'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

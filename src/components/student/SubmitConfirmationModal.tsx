'use client'
import { useState } from 'react'
import { AlertCircle, CheckCircle2, X } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import StudentPrivacyNotice from './StudentPrivacyNotice'

type SubmitConfirmationModalProps = {
  open: boolean
  onClose: () => void
  onConfirm: () => void
  readinessPct: number
}

export default function SubmitConfirmationModal({
  open,
  onClose,
  onConfirm,
  readinessPct,
}: SubmitConfirmationModalProps) {
  const { lang } = useLang()
  const [confirmedAccuracy, setConfirmedAccuracy] = useState(false)

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-1/30 p-4 backdrop-blur-sm sm:items-center">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-5 shadow-floating">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="inline-flex rounded-xl bg-role-tint p-2 text-role-primary">
              <CheckCircle2 size={18} />
            </div>
            <h2 className="mt-3 font-display text-xl font-bold text-ink-1">
              {lang === 'th' ? 'ส่งใบสมัคร?' : 'Submit application?'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              {lang === 'th'
                ? `ใบสมัครนี้พร้อมประมาณ ${readinessPct}% คุณยังสามารถบันทึกร่างไว้ก่อนได้`
                : `This application is about ${readinessPct}% ready. You can still save it as a draft instead.`}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-ink-3 hover:bg-surface-low hover:text-ink-1" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs leading-relaxed text-[#78350F]">
          <AlertCircle size={14} className="mr-1 inline" />
          {lang === 'th'
            ? 'นี่เป็นการจำลองเท่านั้น ยังไม่มีการส่งข้อมูลไปยังระบบจริงหรือจัดเก็บไฟล์จริง'
            : 'This is a mock flow only. No real backend submission or file storage is performed.'}
        </div>

        <div className="mt-4 rounded-xl border border-line bg-surface-low p-4">
          <div className="text-sm font-semibold text-ink-1">
            {lang === 'th' ? 'สรุปที่จะส่ง' : 'What will be submitted'}
          </div>
          <ul className="mt-2 space-y-1 text-xs leading-relaxed text-ink-2">
            <li>{lang === 'th' ? 'ข้อมูลใบสมัครและคำแถลงส่วนตัว' : 'Application sections and personal statement'}</li>
            <li>{lang === 'th' ? 'เอกสารที่แนบไว้ในใบสมัครนี้' : 'Documents attached to this application'}</li>
            <li>{lang === 'th' ? 'ข้อมูลโปรไฟล์ของคุณเท่าที่จำเป็นต่อการจับคู่' : 'Only the profile details needed for matching context'}</li>
          </ul>
        </div>

        <label className="mt-4 flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border border-line bg-white p-3">
          <input
            type="checkbox"
            checked={confirmedAccuracy}
            onChange={event => setConfirmedAccuracy(event.target.checked)}
            className="mt-0.5 accent-role-primary"
          />
          <span className="text-sm leading-relaxed text-ink-2">
            {lang === 'th'
              ? 'ฉันยืนยันว่าข้อมูลที่ส่งถูกต้องตามที่ฉันทราบ'
              : 'I confirm my information is accurate to the best of my knowledge.'}
          </span>
        </label>

        <StudentPrivacyNotice compact className="mt-4" />

        <div className="mt-5 flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={onClose} className="btn-secondary min-h-11 flex-1 px-4 py-2 text-sm">
            {lang === 'th' ? 'กลับไปแก้ไข' : 'Keep editing'}
          </button>
          <button type="button" onClick={onConfirm} disabled={!confirmedAccuracy} className="btn-primary min-h-11 flex-1 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50">
            {lang === 'th' ? 'ยืนยันส่ง' : 'Confirm submit'}
          </button>
        </div>
      </div>
    </div>
  )
}

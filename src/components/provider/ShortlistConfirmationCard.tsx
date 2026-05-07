'use client'

import { useLang } from '@/lib/i18n'
import ShortlistStatusBadge from './ShortlistStatusBadge'

interface ShortlistConfirmationCardProps {
  candidateCount: number
  scholarshipName: string
}

export default function ShortlistConfirmationCard({ candidateCount, scholarshipName }: ShortlistConfirmationCardProps) {
  const { lang } = useLang()

  return (
    <div className="rounded-2xl p-6 bg-emerald-50 border border-emerald-200 text-center">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600 text-white font-semibold">
        ✓
      </div>
      <h3 className="font-semibold text-ink-1 mb-1">
        {lang === 'th' ? 'ส่งขอแล้ว' : 'Request Submitted'}
      </h3>
      <p className="text-sm text-ink-3 mb-4">
        {lang === 'th'
          ? `ส่งขอเปิดเผยข้อมูล ${candidateCount} ผู้สมัครแล้ว`
          : `Requested disclosure for ${candidateCount} ${candidateCount === 1 ? 'candidate' : 'candidates'}`}
      </p>

      <div className="bg-white rounded-xl p-3 mb-4 text-left border border-emerald-100">
        <p className="text-xs text-ink-3 mb-1">
          {lang === 'th' ? 'ทุน:' : 'Scholarship:'}
        </p>
        <p className="text-sm font-semibold text-ink-1">{scholarshipName}</p>
      </div>

      <div className="flex justify-center">
        <ShortlistStatusBadge status="pending_review" />
      </div>

      <p className="text-xs text-ink-3 mt-4">
        {lang === 'th'
          ? 'เจ้าหน้าที่จะตรวจสอบและแจ้งผลภายใน 3–5 วันทำการ'
          : 'Staff will review and respond within 3–5 business days.'}
      </p>
    </div>
  )
}

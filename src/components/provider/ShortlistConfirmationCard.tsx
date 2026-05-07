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
    <div className="rounded-2xl border border-role-border bg-role-tint p-6 text-center">
      <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-role-gradient text-white font-semibold">
        <span className="sr-only">{lang === 'th' ? 'ส่งแล้ว' : 'Submitted'}</span>
        <span aria-hidden="true">✓</span>
      </div>
      <h3 className="font-semibold text-ink-1 mb-1">
        {lang === 'th' ? 'ส่งขอแล้ว' : 'Request Submitted'}
      </h3>
      <p className="text-sm text-ink-3 mb-4">
        {lang === 'th'
          ? `ส่งคำขอคัดเลือก ${candidateCount} โทเค็นแล้ว`
          : `Requested shortlist review for ${candidateCount} candidate token${candidateCount === 1 ? '' : 's'}`}
      </p>

      <div className="bg-white rounded-xl p-3 mb-4 text-left border border-role-border">
        <p className="text-xs text-ink-3 mb-1">
          {lang === 'th' ? 'ทุน:' : 'Scholarship:'}
        </p>
        <p className="text-sm font-semibold text-ink-1">{scholarshipName}</p>
      </div>

      <div className="flex justify-center">
        <ShortlistStatusBadge status="pending_staff_approval" />
      </div>

      <p className="text-xs text-ink-3 mt-4">
        {lang === 'th'
          ? 'เจ้าหน้าที่จะตรวจสอบคำขอ ยังไม่มีการเปิดเผยตัวตนนักศึกษาในระยะนี้'
          : 'Staff will review the request. No student identity is revealed in this phase.'}
      </p>
    </div>
  )
}

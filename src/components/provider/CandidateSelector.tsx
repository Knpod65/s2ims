'use client'

import { X } from 'lucide-react'
import { useLang } from '@/lib/i18n'

type CandidateSelectorProps = {
  selectedCount: number
  onClear: () => void
  onRequest: () => void
}

export default function CandidateSelector({ selectedCount, onClear, onRequest }: CandidateSelectorProps) {
  const { lang } = useLang()

  if (selectedCount === 0) {
    return null
  }

  return (
    <div className="sticky bottom-[calc(48px+env(safe-area-inset-bottom))] z-20 rounded-xl border border-role-border bg-white/90 p-3 shadow-card backdrop-blur-xl">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-1">
            {lang === 'th' ? `เลือก ${selectedCount} โทเค็น` : `${selectedCount} token${selectedCount === 1 ? '' : 's'} selected`}
          </p>
          <p className="text-xs text-ink-3">
            {lang === 'th' ? 'ส่งคำขอพร้อมเหตุผลเพื่อให้เจ้าหน้าที่ตรวจสอบ' : 'Submit with a reason for staff approval.'}
          </p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onClear} className="btn-secondary min-h-11 justify-center text-xs">
            <X size={14} />
            {lang === 'th' ? 'ล้าง' : 'Clear'}
          </button>
          <button type="button" onClick={onRequest} className="btn-primary min-h-11 justify-center text-xs">
            {lang === 'th' ? 'ขอคัดเลือก' : 'Request shortlist'}
          </button>
        </div>
      </div>
    </div>
  )
}

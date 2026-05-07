'use client'

import { useLang } from '@/lib/i18n'

interface ShortlistReasonFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
}

export default function ShortlistReasonField({ value, onChange, error }: ShortlistReasonFieldProps) {
  const { lang } = useLang()
  const charCount = value.length
  const isValid = charCount >= 10

  return (
    <div>
      <label className="text-xs font-semibold text-ink-1 block mb-2">
        {lang === 'th' ? 'เหตุผลในการขอคัดเลือก' : 'Shortlist reason'} <span className="text-[#B45309]">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={lang === 'th' ? 'อธิบายเหตุผลเชิงทุนว่าทำไมโทเค็นเหล่านี้ควรถูกส่งให้เจ้าหน้าที่พิจารณา...' : 'Explain the scholarship-fit reason for sending these tokens to staff review...'}
        rows={4}
        className={`w-full input-base min-h-[112px] resize-none ${error && !isValid ? 'border-[#F59E0B]' : ''}`}
      />
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs ${error && !isValid ? 'text-[#B45309]' : 'text-ink-3'}`}>
          {charCount} {lang === 'th' ? 'ตัวอักษร' : 'characters'} {lang === 'th' ? '(อย่างน้อย 10)' : '(minimum 10)'}
        </span>
        {error && <span className="text-xs text-[#B45309] font-semibold">{error}</span>}
      </div>
    </div>
  )
}

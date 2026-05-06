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
        {lang === 'th' ? 'เหตุผลในการส่งขอ' : 'Reason for Request'} <span className="text-status-danger">*</span>
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={lang === 'th' ? 'อธิบายว่าเพราะเหตุใดจึงส่งขอให้เจ้าหน้าที่เปิดเผยข้อมูล...' : 'Explain why you are requesting disclosure...'}
        rows={4}
        className={`w-full input-base resize-none ${error && !isValid ? 'border-status-danger' : ''}`}
      />
      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs ${error && !isValid ? 'text-status-danger' : 'text-ink-3'}`}>
          {charCount} {lang === 'th' ? 'ตัวอักษร' : 'characters'} {lang === 'th' ? '(อย่างน้อย 10)' : '(minimum 10)'}
        </span>
        {error && <span className="text-xs text-status-danger font-semibold">{error}</span>}
      </div>
    </div>
  )
}

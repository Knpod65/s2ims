import * as React from 'react'

export interface PreviewOnlyNoticeProps {
  title?: string
  description?: string
  apCodes?: Array<'AP-10B' | 'AP-10C' | 'AP-11'>
  className?: string
}

export function PreviewOnlyNotice({
  title = 'Preview Only — ข้อมูลนี้ไม่ถูกบันทึก',
  description = 'This section shows diagnostic data only. No data is saved, imported, or submitted.',
  apCodes,
  className = '',
}: PreviewOnlyNoticeProps) {
  return (
    <div
      role="note"
      className={[
        'inline-flex flex-col gap-1 rounded-md border border-[#6B3B8C] bg-[#F3E9F8] px-3 py-2 text-[#4A2A5C]',
        className,
      ].filter(Boolean).join(' ')}
    >
      <p className="flex items-center gap-1.5 text-sm font-semibold">
        <span aria-hidden="true">○</span>
        {title}
        {apCodes && apCodes.map((code) => (
          <span
            key={code}
            className="rounded border border-[#6B3B8C] px-1 py-0.5 font-mono text-xs"
          >
            {code}
          </span>
        ))}
      </p>
      {description && (
        <p className="text-xs text-[#4A2A5C]">{description}</p>
      )}
    </div>
  )
}

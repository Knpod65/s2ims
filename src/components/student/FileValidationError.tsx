'use client'
import { AlertTriangle } from 'lucide-react'
import { useLang } from '@/lib/i18n'

type FileValidationErrorProps = {
  acceptedTypes: string[]
  className?: string
}

export default function FileValidationError({ acceptedTypes, className = '' }: FileValidationErrorProps) {
  const { lang } = useLang()

  return (
    <div className={`rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs leading-relaxed text-[#78350F] ${className}`}>
      <div className="flex items-start gap-2">
        <AlertTriangle size={15} className="mt-0.5 shrink-0" />
        <div>
          <div className="font-semibold">
            {lang === 'th' ? 'ไฟล์นี้ยังไม่พร้อมให้ตรวจสอบ' : 'This file is not ready for review yet'}
          </div>
          <p className="mt-1">
            {lang === 'th'
              ? `ลองอัปโหลดเป็น ${acceptedTypes.join(', ')} เพื่อให้ตรวจสอบได้ง่ายขึ้น`
              : `Try uploading ${acceptedTypes.join(', ')} so it can be reviewed more easily.`}
          </p>
        </div>
      </div>
    </div>
  )
}

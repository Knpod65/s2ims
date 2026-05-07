'use client'

import { useLang } from '@/lib/i18n'
import { AlertTriangle } from 'lucide-react'

interface AuditWarningCardProps {
  title?: string
  message: string
  requiresReason?: boolean
}

export default function AuditWarningCard({ title, message, requiresReason }: AuditWarningCardProps) {
  const { lang } = useLang()

  return (
    <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#78350F] shadow-[0_12px_30px_rgba(120,53,15,.08)]">
      <AlertTriangle size={16} className="text-[#B45309] flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <p className="text-xs leading-relaxed">{message}</p>
        {requiresReason && (
          <p className="text-xs mt-2 font-medium">
            {lang === 'th'
              ? 'การกระทำนี้จะถูกบันทึกไว้และตรวจสอบย้อนหลังได้'
              : 'This action is logged and auditable'}
          </p>
        )}
      </div>
    </div>
  )
}

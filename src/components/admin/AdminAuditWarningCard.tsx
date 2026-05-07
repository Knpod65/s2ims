'use client'

import { useLang } from '@/lib/i18n'
import { AlertTriangle, LogOut } from 'lucide-react'

interface AdminAuditWarningCardProps {
  action_th: string
  action_en: string
  consequence_th: string
  consequence_en: string
  requiresReason?: boolean
}

export default function AdminAuditWarningCard({
  action_th,
  action_en,
  consequence_th,
  consequence_en,
  requiresReason = true,
}: AdminAuditWarningCardProps) {
  const { lang } = useLang()

  return (
    <div className="p-4 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#78350F]">
      <div className="flex gap-3 mb-3">
        <AlertTriangle size={16} className="text-[#B45309] flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-xs mb-1">
            {lang === 'th' ? 'บันทึกการตรวจสอบปลอดภัย' : 'Audit Trail Alert'}
          </p>
          <p className="text-xs">
            {lang === 'th' ? action_th : action_en}
          </p>
        </div>
      </div>

      <div className="ml-6 space-y-2">
        <div className="p-2 rounded bg-bg-100 border border-line">
          <p className="text-xs text-ink-3 font-semibold mb-1">
            {lang === 'th' ? 'ผลที่ตามมา' : 'Consequences'}
          </p>
          <div className="flex items-start gap-2">
            <LogOut size={12} className="text-status-danger flex-shrink-0 mt-0.5" />
            <p className="text-xs text-ink-1">
              {lang === 'th' ? consequence_th : consequence_en}
            </p>
          </div>
        </div>

        {requiresReason && (
          <p className="text-xs text-ink-3 italic">
            {lang === 'th'
              ? '* จำเป็นต้องให้เหตุผลสำหรับการดำเนินการนี้'
              : '* Documented reason required for this action'}
          </p>
        )}
      </div>
    </div>
  )
}

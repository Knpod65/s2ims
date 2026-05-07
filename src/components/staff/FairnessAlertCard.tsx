'use client'

import { useLang } from '@/lib/i18n'
import { AlertTriangle } from 'lucide-react'

interface FairnessAlertCardProps {
  type: 'low_income_high_match' | 'high_match_low_gpa' | 'other'
  message: string
}

export default function FairnessAlertCard({ type, message }: FairnessAlertCardProps) {
  const { lang } = useLang()

  const getTypeLabel = (t: string) => {
    const labels: Record<string, Record<string, string>> = {
      low_income_high_match: {
        th: 'รายได้ต่ำ + คะแนนสูง',
        en: 'Low Income + High Match',
      },
      high_match_low_gpa: {
        th: 'คะแนนสูง + GPA ต่ำ',
        en: 'High Match + Low GPA',
      },
      other: {
        th: 'ประเด็นด้านความยุติธรรม',
        en: 'Fairness Concern',
      },
    }
    return labels[t]?.[lang === 'th' ? 'th' : 'en'] || t
  }

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-to-br from-[#FEF3C7] to-[#FFF7ED] border border-amber-200 text-[#78350F]">
      <AlertTriangle size={14} className="text-amber-700 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="font-semibold text-xs mb-1">{getTypeLabel(type)}</p>
        <p className="text-xs leading-relaxed">{message}</p>
      </div>
    </div>
  )
}

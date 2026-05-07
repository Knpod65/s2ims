'use client'

import { useLang } from '@/lib/i18n'
import { AlertTriangle } from 'lucide-react'

interface ElevatedAccessWarningProps {
  message_th: string
  message_en: string
  riskLevel?: 'medium' | 'high'
}

export default function ElevatedAccessWarning({
  message_th,
  message_en,
  riskLevel = 'high',
}: ElevatedAccessWarningProps) {
  const { lang } = useLang()

  const bgColor = riskLevel === 'high' ? 'bg-red-50' : 'bg-[#FFFBEB]'
  const borderColor = riskLevel === 'high' ? 'border-red-200' : 'border-[#FDE68A]'
  const textColor = riskLevel === 'high' ? 'text-red-700' : 'text-[#78350F]'
  const iconColor = riskLevel === 'high' ? 'text-red-700' : 'text-[#B45309]'

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg ${bgColor} border ${borderColor}`}>
      <AlertTriangle size={16} className={`${iconColor} flex-shrink-0 mt-0.5`} />
      <div className="flex-1">
        <p className={`font-semibold text-xs ${textColor} mb-1`}>
          {lang === 'th' ? 'การเข้าถึงระดับสูง' : 'Elevated Access'}
        </p>
        <p className={`text-xs ${textColor}`}>
          {lang === 'th' ? message_th : message_en}
        </p>
      </div>
    </div>
  )
}

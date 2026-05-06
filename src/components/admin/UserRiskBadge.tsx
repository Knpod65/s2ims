'use client'

import { useLang } from '@/lib/i18n'
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react'

interface UserRiskBadgeProps {
  riskLevel: 'low' | 'medium' | 'high'
  size?: 'sm' | 'md'
}

export default function UserRiskBadge({ riskLevel, size = 'md' }: UserRiskBadgeProps) {
  const { lang } = useLang()

  const config = {
    low: { icon: CheckCircle2, color: 'text-status-success bg-status-success/10', label_th: 'ต่ำ', label_en: 'Low' },
    medium: { icon: AlertCircle, color: 'text-status-warning bg-status-warning/10', label_th: 'ปานกลาง', label_en: 'Medium' },
    high: { icon: AlertTriangle, color: 'text-status-danger bg-status-danger/10', label_th: 'สูง', label_en: 'High' },
  }

  const { icon: Icon, color, label_th, label_en } = config[riskLevel]
  const sizeClass = size === 'sm' ? 'px-2 py-1 gap-1' : 'px-3 py-1.5 gap-1.5'
  const iconSize = size === 'sm' ? 12 : 14

  return (
    <div className={`flex items-center rounded ${sizeClass} ${color}`}>
      <Icon size={iconSize} />
      <span className={size === 'sm' ? 'text-[10px]' : 'text-xs'}>
        {lang === 'th' ? label_th : label_en}
      </span>
    </div>
  )
}

'use client'

import { useLang } from '@/lib/i18n'
import { CheckCircle2, XCircle, AlertCircle, Lock } from 'lucide-react'

interface PermissionStatusBadgeProps {
  status: 'allowed' | 'denied' | 'needs_approval' | 'restricted'
  size?: 'sm' | 'md'
}

export default function PermissionStatusBadge({ status, size = 'md' }: PermissionStatusBadgeProps) {
  const { lang } = useLang()

  const config = {
    allowed: {
      icon: CheckCircle2,
      bg: 'bg-status-success/10',
      text: 'text-status-success',
      label_th: 'อนุญาต',
      label_en: 'Allowed',
    },
    denied: {
      icon: XCircle,
      bg: 'bg-status-danger/10',
      text: 'text-status-danger',
      label_th: 'ปฏิเสธ',
      label_en: 'Denied',
    },
    needs_approval: {
      icon: AlertCircle,
      bg: 'bg-status-warning/10',
      text: 'text-status-warning',
      label_th: 'รออนุมัติ',
      label_en: 'Needs Approval',
    },
    restricted: {
      icon: Lock,
      bg: 'bg-ink-3/10',
      text: 'text-ink-3',
      label_th: 'จำกัด',
      label_en: 'Restricted',
    },
  }

  const { icon: Icon, bg, text, label_th, label_en } = config[status]
  const sizeClass = size === 'sm' ? 'px-2 py-1 gap-1' : 'px-3 py-1.5 gap-1.5'
  const iconSize = size === 'sm' ? 12 : 14
  const textSize = size === 'sm' ? 'text-[10px]' : 'text-xs'

  return (
    <div className={`flex items-center rounded ${bg} ${text} ${sizeClass}`}>
      <Icon size={iconSize} />
      <span className={textSize}>{lang === 'th' ? label_th : label_en}</span>
    </div>
  )
}

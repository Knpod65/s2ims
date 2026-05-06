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
    <div className="flex items-start gap-3 p-4 rounded-lg bg-status-danger/[0.08] border border-status-danger/20">
      <AlertTriangle size={16} className="text-status-danger flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <p className="font-semibold text-sm text-status-danger mb-1">{title}</p>}
        <p className="text-xs text-status-danger/90">{message}</p>
        {requiresReason && (
          <p className="text-xs text-status-danger/80 mt-2">
            {lang === 'th'
              ? '⚠️ การกระทำนี้จะถูกบันทึกไว้และตรวจสอบได้'
              : '⚠️ This action is logged and auditable'}
          </p>
        )}
      </div>
    </div>
  )
}

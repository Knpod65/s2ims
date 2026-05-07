'use client'
import { Loader2 } from 'lucide-react'
import { useLang } from '@/lib/i18n'

type UploadProgressIndicatorProps = {
  progress: number
  className?: string
}

export default function UploadProgressIndicator({ progress, className = '' }: UploadProgressIndicatorProps) {
  const { lang } = useLang()
  const pct = Math.max(0, Math.min(100, Math.round(progress)))

  return (
    <div className={`rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF]/60 p-3 ${className}`}>
      <div className="mb-2 flex items-center justify-between gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 font-semibold text-role-primary">
          <Loader2 size={13} className="motion-safe:animate-spin" />
          {lang === 'th' ? 'กำลังอัปโหลดแบบจำลอง' : 'Mock upload in progress'}
        </span>
        <span className="font-mono font-semibold text-role-primary">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div className="h-full rounded-full bg-role-gradient" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

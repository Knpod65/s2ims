'use client'
import Link from 'next/link'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { StudentApplicationRecord } from '@/data/mock/studentApplicationData'

type ApplicationRevisionNoticeProps = {
  application: StudentApplicationRecord
  className?: string
}

export default function ApplicationRevisionNotice({ application, className = '' }: ApplicationRevisionNoticeProps) {
  const { lang } = useLang()

  if (application.state !== 'revision_requested' || !application.revisionMessage) return null

  return (
    <div className={`rounded-xl border border-[#FDE68A] bg-gradient-to-br from-[#FEF3C7] to-[#FFF7ED] p-4 text-[#78350F] ${className}`}>
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-white/80 p-2 shadow-soft">
          <AlertTriangle size={17} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-semibold">
            {lang === 'th' ? 'ทีมทุนขอให้อัปเดตข้อมูล' : 'Scholarship team requested an update'}
          </div>
          <p className="mt-1 text-sm leading-relaxed">{application.revisionMessage[lang]}</p>
          {application.revisionDueDate && (
            <p className="mt-2 text-xs">
              {lang === 'th' ? 'แนะนำให้อัปเดตก่อน' : 'Suggested update by'}{' '}
              {new Date(application.revisionDueDate).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          )}
          <Link href={`/student/applications/${application.id}/documents`} className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-[#78350F] shadow-soft">
            {lang === 'th' ? 'จัดการเอกสาร' : 'Manage documents'}
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  )
}

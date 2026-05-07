'use client'
import Link from 'next/link'
import { ArrowRight, CalendarDays, FileText, UploadCloud } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { StudentApplicationRecord } from '@/data/mock/studentApplicationData'
import { applicationStateLabels, applicationStateStyles, getScholarshipById } from '@/data/mock/studentApplicationData'
import { StatusBadge } from '@/components/ui/index'
import ApplicationTimeline from './ApplicationTimeline'

type ApplicationStatusCardProps = {
  application: StudentApplicationRecord
  className?: string
}

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
}

export default function ApplicationStatusCard({ application, className = '' }: ApplicationStatusCardProps) {
  const { lang } = useLang()
  const scholarship = getScholarshipById(application.scholarshipId)
  const title = scholarship ? (lang === 'th' ? scholarship.title_th : scholarship.title_en) : application.scholarshipId
  const needsDocs = application.documents.filter(doc => ['missing', 'invalid_file_type', 'rejected', 'needs_replacement'].includes(doc.state))
  const days = daysUntil(application.deadline)

  return (
    <article className={`card card-hover p-4 ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-1 flex items-center gap-1.5 text-xs text-ink-3">
            <FileText size={13} />
            {lang === 'th' ? 'ใบสมัคร' : 'Application'}
          </div>
          <h2 className="font-display text-lg font-bold leading-snug text-ink-1">{title}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <StatusBadge label={applicationStateLabels[application.state][lang]} color={applicationStateStyles[application.state]} />
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-low px-2.5 py-1 text-xs font-semibold text-ink-2">
              <CalendarDays size={13} />
              {days > 0 ? `${days} ${lang === 'th' ? 'วัน' : 'days left'}` : (lang === 'th' ? 'ตรวจสอบกำหนดส่ง' : 'Check deadline')}
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF] px-3 py-2 text-center text-role-primary">
          <div className="font-display text-xl font-bold">{application.readinessPct}%</div>
          <div className="text-[10px] font-semibold">{lang === 'th' ? 'พร้อม' : 'ready'}</div>
        </div>
      </div>

      {needsDocs.length > 0 && (
        <div className="mt-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs leading-relaxed text-[#78350F]">
          {lang === 'th'
            ? `เพิ่มเอกสารอีก ${needsDocs.length} รายการเพื่อให้ใบสมัครพร้อมขึ้น`
            : `Add ${needsDocs.length} document${needsDocs.length > 1 ? 's' : ''} to make this application more ready.`}
        </div>
      )}

      {application.state === 'revision_requested' && application.revisionMessage && (
        <div className="mt-3 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs leading-relaxed text-[#78350F]">
          {application.revisionMessage[lang]}
        </div>
      )}

      <ApplicationTimeline events={application.timeline.slice(0, 3)} compact className="mt-4" />

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Link href={`/student/applications/${application.id}`} className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-2 text-xs">
          {lang === 'th' ? 'ดูรายละเอียด' : 'View details'}
          <ArrowRight size={13} />
        </Link>
        <Link href={`/student/applications/${application.id}/documents`} className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-xs">
          <UploadCloud size={13} />
          {lang === 'th' ? 'เอกสาร' : 'Documents'}
        </Link>
      </div>
    </article>
  )
}

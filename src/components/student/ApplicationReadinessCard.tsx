'use client'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileCheck2, ListChecks } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { MissingDataItem } from '@/data/mock/studentMatchingData'
import type { StudentDocumentItem } from '@/data/mock/studentApplicationData'
import MissingDataPrompt from './MissingDataPrompt'

type ApplicationReadinessCardProps = {
  readinessPct: number
  readyDocs: number
  requiredDocs: number
  missingDocuments: StudentDocumentItem[]
  missingData: MissingDataItem[]
  improveHref?: string
  className?: string
}

export default function ApplicationReadinessCard({
  readinessPct,
  readyDocs,
  requiredDocs,
  missingDocuments,
  missingData,
  improveHref = '/student/profile/improve',
  className = '',
}: ApplicationReadinessCardProps) {
  const { lang } = useLang()
  const pct = Math.max(0, Math.min(100, Math.round(readinessPct)))

  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-role-primary">
            {lang === 'th' ? 'ความพร้อมใบสมัคร' : 'Application readiness'}
          </div>
          <h2 className="mt-1 font-display text-xl font-bold text-ink-1">
            {lang === 'th' ? 'พร้อมเริ่มใบสมัครอย่างมั่นใจ' : 'Start with a clear readiness view'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            {lang === 'th'
              ? 'รายการด้านล่างช่วยให้เห็นสิ่งที่พร้อมแล้วและสิ่งที่เติมได้ ไม่ใช่การตัดสิทธิ์'
              : 'The items below show what is ready and what can still be added. They are not disqualifications.'}
          </p>
        </div>
        <div className="rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF] p-4 text-role-primary">
          <div className="font-display text-3xl font-bold">{pct}%</div>
          <div className="text-xs font-semibold">{lang === 'th' ? 'ความพร้อม' : 'ready'}</div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-line bg-surface-low p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-1">
            <FileCheck2 size={16} className="text-role-primary" />
            {lang === 'th' ? 'เอกสารพร้อมใช้' : 'Documents ready'}
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-role-primary">
            {readyDocs}/{requiredDocs}
          </div>
        </div>
        <div className="rounded-xl border border-line bg-surface-low p-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-ink-1">
            <ListChecks size={16} className="text-role-primary" />
            {lang === 'th' ? 'รายการที่เติมได้' : 'Helpful next steps'}
          </div>
          <div className="mt-2 font-mono text-2xl font-bold text-role-primary">
            {missingDocuments.length + missingData.length}
          </div>
        </div>
      </div>

      {missingDocuments.length === 0 && missingData.length === 0 ? (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
          <CheckCircle2 size={16} className="mr-2 inline" />
          {lang === 'th' ? 'ข้อมูลสำคัญพร้อมสำหรับการส่งใบสมัคร' : 'Key details are ready for submission.'}
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {missingData.slice(0, 2).map(item => (
            <MissingDataPrompt key={item.id} item={item} compact />
          ))}
        </div>
      )}

      <Link href={improveHref} className="btn-secondary mt-4 inline-flex min-h-11 items-center gap-2 px-4 py-2 text-xs">
        {lang === 'th' ? 'ดูวิธีปรับปรุง' : 'Review next steps'}
        <ArrowRight size={13} />
      </Link>
    </section>
  )
}

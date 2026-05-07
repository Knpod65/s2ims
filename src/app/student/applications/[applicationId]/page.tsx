'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Edit3, FileText, UploadCloud } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { EmptyState, PageHeader, StatusBadge } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import {
  applicationStateLabels,
  applicationStateStyles,
  getScholarshipById,
  getStudentApplicationById,
} from '@/data/mock/studentApplicationData'
import { studentDataFreshness } from '@/data/mock/studentMatchingData'
import {
  ApplicationRevisionNotice,
  ApplicationTimeline,
  DataFreshnessIndicator,
  RequiredDocumentsList,
  StudentPrivacyNotice,
} from '@/components/student'

export default function StudentApplicationDetailPage({
  params,
}: {
  params: { applicationId: string }
}) {
  const { lang } = useLang()
  const application = getStudentApplicationById(params.applicationId)
  const scholarship = application ? getScholarshipById(application.scholarshipId) : undefined

  if (!application || !scholarship) {
    return (
      <AppShell requiredRole="student">
        <EmptyState
          icon={<FileText size={36} />}
          title={lang === 'th' ? 'ไม่พบใบสมัคร' : 'Application not found'}
          action={<Link href="/student/applications" className="btn-primary min-h-11 px-4 py-2 text-sm">{lang === 'th' ? 'กลับรายการ' : 'Back to tracker'}</Link>}
        />
      </AppShell>
    )
  }

  const title = lang === 'th' ? scholarship.title_th : scholarship.title_en
  const missingDocuments = application.documents.filter(doc => ['missing', 'invalid_file_type', 'rejected', 'needs_replacement'].includes(doc.state))
  const canEdit = ['draft', 'ready_to_submit', 'revision_requested'].includes(application.state)

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'รายละเอียดใบสมัคร' : 'Application detail'}
        subtitle={title}
        badge={<StatusBadge label={applicationStateLabels[application.state][lang]} color={applicationStateStyles[application.state]} />}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-6xl space-y-6">
        <ApplicationRevisionNotice application={application} />

        {missingDocuments.length > 0 && (
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[#78350F]">
            <div className="font-semibold">
              {lang === 'th' ? 'มีเอกสารที่ช่วยให้ใบสมัครพร้อมขึ้น' : 'Some documents can make this application stronger'}
            </div>
            <p className="mt-1 text-sm leading-relaxed">
              {lang === 'th'
                ? 'เพิ่มหรือแทนที่เอกสารตามคำแนะนำด้านล่างเมื่อคุณพร้อม'
                : 'Add or replace the documents below when you are ready.'}
            </p>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <main className="space-y-6">
            <section className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'สรุปใบสมัคร' : 'Application summary'}
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                <div className="rounded-xl border border-line bg-surface-low p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                    {lang === 'th' ? 'ความพร้อม' : 'Readiness'}
                  </div>
                  <div className="mt-1 font-display text-xl font-bold text-role-primary">{application.readinessPct}%</div>
                </div>
                <div className="rounded-xl border border-line bg-surface-low p-3">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                    {lang === 'th' ? 'เอกสาร' : 'Documents'}
                  </div>
                  <div className="mt-1 font-mono text-xl font-bold text-ink-1">{application.documents.length}</div>
                </div>
                <div className="rounded-xl border border-line bg-surface-low p-3 md:col-span-2">
                  <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-ink-3">
                    {lang === 'th' ? 'ทุน' : 'Scholarship'}
                  </div>
                  <div className="mt-1 line-clamp-1 text-sm font-semibold text-ink-1">{title}</div>
                </div>
              </div>
            </section>

            <section className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'ลำดับสถานะ' : 'Timeline'}
              </h2>
              <ApplicationTimeline events={application.timeline} className="mt-5" />
            </section>
          </main>

          <aside className="space-y-6">
            <section className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'เอกสารที่ส่งแล้วและยังเติมได้' : 'Submitted and pending documents'}
              </h2>
              <RequiredDocumentsList documents={application.documents} showActions className="mt-4" />
            </section>
            <StudentPrivacyNotice />
          </aside>
        </div>

        <div className="sticky bottom-[calc(48px+env(safe-area-inset-bottom))] z-20 rounded-2xl border border-line bg-white/90 p-3 shadow-floating backdrop-blur-xl md:bottom-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href="/student/applications" className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 text-sm">
              <ArrowLeft size={14} />
              {lang === 'th' ? 'กลับรายการ' : 'Back to tracker'}
            </Link>
            {canEdit && (
              <Link href={`/student/applications/${application.id}/edit`} className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
                <Edit3 size={14} />
                {lang === 'th' ? 'แก้ไขร่าง' : 'Continue editing'}
              </Link>
            )}
            <Link href={`/student/applications/${application.id}/documents`} className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
              <UploadCloud size={14} />
              {lang === 'th' ? 'จัดการเอกสาร' : 'Manage documents'}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

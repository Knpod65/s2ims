'use client'
import Link from 'next/link'
import { ArrowLeft, Save, UploadCloud } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { EmptyState, PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import { useToast } from '@/components/ui/Toast'
import {
  getScholarshipById,
  getStudentApplicationById,
} from '@/data/mock/studentApplicationData'
import { studentDataFreshness } from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  DocumentUploadChecklist,
  StudentPrivacyNotice,
} from '@/components/student'

export default function StudentApplicationDocumentsPage({
  params,
}: {
  params: { applicationId: string }
}) {
  const { lang } = useLang()
  const { addToast } = useToast()
  const application = getStudentApplicationById(params.applicationId)
  const scholarship = application ? getScholarshipById(application.scholarshipId) : undefined

  if (!application || !scholarship) {
    return (
      <AppShell requiredRole="student">
        <EmptyState
          title={lang === 'th' ? 'ไม่พบใบสมัคร' : 'Application not found'}
          action={<Link href="/student/applications" className="btn-primary min-h-11 px-4 py-2 text-sm">{lang === 'th' ? 'กลับรายการ' : 'Back to tracker'}</Link>}
        />
      </AppShell>
    )
  }

  const title = lang === 'th' ? scholarship.title_th : scholarship.title_en
  const needsAttention = application.documents.filter(doc => ['missing', 'invalid_file_type', 'rejected', 'needs_replacement'].includes(doc.state))

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'จัดการเอกสาร' : 'Manage documents'}
        subtitle={title}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="card p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'สรุปใบสมัคร' : 'Application summary'}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {lang === 'th'
                  ? 'หน้านี้เป็นการอัปโหลดแบบจำลอง ไม่มีการจัดเก็บไฟล์จริง'
                  : 'This is a mock upload page. No real file storage is performed.'}
              </p>
            </div>
            <div className="rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF] p-3 text-center text-role-primary">
              <div className="font-display text-xl font-bold">{application.readinessPct}%</div>
              <div className="text-[10px] font-semibold">{lang === 'th' ? 'พร้อม' : 'ready'}</div>
            </div>
          </div>
        </section>

        {needsAttention.length > 0 && (
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[#78350F]">
            <div className="font-semibold">
              {lang === 'th' ? 'เพิ่มเอกสารเพื่อให้ใบสมัครพร้อมขึ้น' : 'Add documents to make this application stronger'}
            </div>
            <p className="mt-1 text-sm leading-relaxed">
              {lang === 'th'
                ? `มี ${needsAttention.length} รายการที่เติมหรือแทนที่ได้เมื่อคุณพร้อม`
                : `${needsAttention.length} item${needsAttention.length > 1 ? 's' : ''} can be added or replaced when ready.`}
            </p>
          </div>
        )}

        <DocumentUploadChecklist documents={application.documents} />

        <StudentPrivacyNotice />

        <div className="sticky bottom-[calc(48px+env(safe-area-inset-bottom))] z-20 rounded-2xl border border-line bg-white/90 p-3 shadow-floating backdrop-blur-xl md:bottom-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/student/applications/${application.id}`} className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
              <ArrowLeft size={14} />
              {lang === 'th' ? 'กลับรายละเอียด' : 'Back to detail'}
            </Link>
            <button
              type="button"
              onClick={() => addToast(lang === 'th' ? 'บันทึกเอกสารแบบจำลองแล้ว' : 'Mock document draft saved', 'success')}
              className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm"
            >
              <Save size={14} />
              {lang === 'th' ? 'บันทึกแบบร่าง' : 'Save draft'}
            </button>
            <button type="button" className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
              <UploadCloud size={14} />
              {lang === 'th' ? 'เพิ่มไฟล์แบบจำลอง' : 'Mock upload'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

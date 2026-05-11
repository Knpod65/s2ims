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
  DocumentRecoveryPanel,
  NextBestActionPanel,
  StudentPrivacyNotice,
  StudentReadinessPath,
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
        <StudentReadinessPath
          readinessPct={application.readinessPct}
          documents={application.documents}
        />

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

        <DocumentRecoveryPanel documents={application.documents} />

        <NextBestActionPanel
          title={needsAttention.length > 0
            ? (lang === 'th' ? 'เพิ่มไฟล์ที่ช่วยให้ใบสมัครเดินต่อได้' : 'Add the files that help this application move forward')
            : (lang === 'th' ? 'เอกสารพร้อมแล้ว ตรวจรายละเอียดใบสมัครต่อได้' : 'Documents are ready; review the application detail next')}
          description={lang === 'th'
            ? 'หน้านี้เป็นการอัปโหลดแบบจำลอง ไม่มีการจัดเก็บไฟล์จริง และปุ่มเดิมยังทำงานเหมือนเดิม'
            : 'This remains a mock upload page. No real file storage is performed, and the existing actions behave the same way.'}
          primaryAction={(
            <button type="button" className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 text-sm">
              <UploadCloud size={14} />
              {lang === 'th' ? 'เพิ่มไฟล์แบบจำลอง' : 'Mock upload'}
            </button>
          )}
          secondaryActions={(
            <>
              <button
                type="button"
                onClick={() => addToast(lang === 'th' ? 'บันทึกเอกสารแบบจำลองแล้ว' : 'Mock document draft saved', 'success')}
                className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 text-sm"
              >
                <Save size={14} />
                {lang === 'th' ? 'บันทึกแบบร่าง' : 'Save draft'}
              </button>
              <Link href={`/student/applications/${application.id}`} className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 text-sm">
                <ArrowLeft size={14} />
                {lang === 'th' ? 'กลับรายละเอียด' : 'Back to detail'}
              </Link>
            </>
          )}
        />

        <StudentPrivacyNotice />
      </div>
    </AppShell>
  )
}

'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import {
  getApplicationReadiness,
  getRequiredDocumentsForScholarship,
  getScholarshipById,
} from '@/data/mock/studentApplicationData'
import { getRecommendationByScholarshipId, studentDataFreshness } from '@/data/mock/studentMatchingData'
import {
  ApplicationReadinessCard,
  DataFreshnessIndicator,
  EligibilityChecklist,
  RequiredDocumentsList,
  ScholarshipDetailCard,
  StudentPrivacyNotice,
} from '@/components/student'

export default function StudentScholarshipApplyPage({
  params,
}: {
  params: { scholarshipId: string }
}) {
  const { lang } = useLang()
  const scholarship = getScholarshipById(params.scholarshipId)
  const recommendation = getRecommendationByScholarshipId(params.scholarshipId)
  const documents = getRequiredDocumentsForScholarship(params.scholarshipId)
  const readiness = getApplicationReadiness(params.scholarshipId)

  if (!scholarship) {
    return (
      <AppShell requiredRole="student">
        <PageHeader title={lang === 'th' ? 'ไม่พบทุน' : 'Scholarship not found'} />
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'เริ่มใบสมัคร' : 'Start application'}
        subtitle={lang === 'th' ? 'ตรวจความพร้อมและความยินยอมก่อนสร้างร่างใบสมัคร' : 'Check readiness and consent before creating a draft.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-6xl space-y-6">
        <ScholarshipDetailCard
          scholarship={scholarship}
          recommendation={recommendation}
          explanationHref={`/student/recommendations/${scholarship.id}/explanation`}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <main className="space-y-6">
            <ApplicationReadinessCard
              readinessPct={readiness.readinessPct}
              readyDocs={readiness.readyDocs}
              requiredDocs={readiness.requiredDocs}
              missingDocuments={readiness.missingDocuments}
              missingData={readiness.missingData}
              improveHref="/student/profile/improve"
            />

            <section className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'ยืนยันคุณสมบัติ' : 'Eligibility confirmation'}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {lang === 'th'
                  ? 'ตรวจรายการหลักก่อนสร้างร่าง คุณยังสามารถเตรียมเอกสารเพิ่มเติมได้ภายหลัง'
                  : 'Review hard requirements before starting a draft. You can still prepare documents afterward.'}
              </p>
              {recommendation && <EligibilityChecklist rows={recommendation.eligibilityChecklist} className="mt-4" />}
            </section>

            <section className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'รายการเอกสาร' : 'Required document checklist'}
              </h2>
              <RequiredDocumentsList documents={documents} className="mt-4" />
            </section>
          </main>

          <aside className="space-y-6">
            {readiness.missingDocuments.length > 0 && (
              <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[#78350F]">
                <div className="font-semibold">
                  {lang === 'th' ? 'ยังมีข้อมูลที่ช่วยให้ใบสมัครพร้อมขึ้น' : 'A few details can make this stronger'}
                </div>
                <p className="mt-1 text-sm leading-relaxed">
                  {lang === 'th'
                    ? 'คุณเริ่มร่างได้เลย และกลับมาเพิ่มเอกสารก่อนส่งจริง'
                    : 'You can start a draft now and return to add documents before final submission.'}
                </p>
              </div>
            )}

            <div className="card p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-1">
                <ShieldCheck size={17} className="text-role-primary" />
                {lang === 'th' ? 'ความยินยอมและความเป็นส่วนตัว' : 'Consent and privacy'}
              </div>
              <p className="text-sm leading-relaxed text-ink-2">
                {lang === 'th'
                  ? 'การเริ่มร่างนี้เป็นการจำลองเท่านั้น ข้อมูลโปรไฟล์ของคุณใช้เพื่อช่วยเติมบริบทใบสมัครและไม่ส่งไฟล์จริงไปยังระบบจัดเก็บ'
                  : 'Starting this draft is mock-only. Your profile data is used to help contextualize the application and no real file storage occurs.'}
              </p>
            </div>

            <StudentPrivacyNotice />
          </aside>
        </div>

        <div className="sticky bottom-[calc(48px+env(safe-area-inset-bottom))] z-20 rounded-2xl border border-line bg-white/90 p-3 shadow-floating backdrop-blur-xl md:bottom-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/student/scholarships/${scholarship.id}`} className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
              <ArrowLeft size={14} />
              {lang === 'th' ? 'กลับรายละเอียดทุน' : 'Back to detail'}
            </Link>
            <Link href={readiness.application ? `/student/applications/${readiness.application.id}/edit` : '/student/applications/app_003/edit'} className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
              <CheckCircle2 size={14} />
              {lang === 'th' ? 'สร้างหรือเปิดร่างใบสมัคร' : 'Start draft'}
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

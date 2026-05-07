'use client'
import Link from 'next/link'
import { ArrowLeft, ClipboardCheck, FileText } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import {
  getApplicationReadiness,
  getRequiredDocumentsForScholarship,
  getScholarshipById,
} from '@/data/mock/studentApplicationData'
import {
  getRecommendationByScholarshipId,
  studentDataFreshness,
} from '@/data/mock/studentMatchingData'
import {
  ApplicationReadinessCard,
  DataFreshnessIndicator,
  EligibilityChecklist,
  RequiredDocumentsList,
  ScholarshipDetailCard,
  StudentPrivacyNotice,
} from '@/components/student'

export default function StudentScholarshipDetailPage({
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
        <Link href="/student/recommendations" className="btn-primary inline-flex min-h-11 items-center gap-2 px-4 py-2 text-sm">
          <ArrowLeft size={14} />
          {lang === 'th' ? 'กลับไปคำแนะนำ' : 'Back to recommendations'}
        </Link>
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'รายละเอียดทุนสำหรับนักศึกษา' : 'Student scholarship detail'}
        subtitle={lang === 'th' ? 'ดูความเหมาะสม เอกสาร และขั้นตอนสมัครจากมุมมองของคุณ' : 'Review fit, documents, and application next steps from your own view.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-6xl space-y-6">
        <ScholarshipDetailCard
          scholarship={scholarship}
          recommendation={recommendation}
          applyHref={`/student/scholarships/${scholarship.id}/apply`}
          explanationHref={`/student/recommendations/${scholarship.id}/explanation`}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <main className="space-y-6">
            <section className="card p-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="rounded-xl bg-role-tint p-2.5 text-role-primary">
                  <ClipboardCheck size={18} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink-1">
                    {lang === 'th' ? 'สรุปคุณสมบัติหลัก' : 'Eligibility summary'}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">
                    {lang === 'th'
                      ? 'รายการนี้เป็นเงื่อนไขหลักที่ควรผ่านหรือเตรียมก่อนสมัคร'
                      : 'These are the hard requirements to meet or prepare before applying.'}
                  </p>
                </div>
              </div>
              {recommendation ? (
                <EligibilityChecklist rows={recommendation.eligibilityChecklist} />
              ) : (
                <p className="rounded-xl border border-line bg-surface-low p-4 text-sm text-ink-2">
                  {lang === 'th' ? 'ยังไม่มีคำอธิบายการจับคู่สำหรับทุนนี้' : 'No matching explanation is available for this scholarship yet.'}
                </p>
              )}
            </section>

            <section className="card p-5">
              <div className="mb-4 flex items-start gap-3">
                <div className="rounded-xl bg-role-tint p-2.5 text-role-primary">
                  <FileText size={18} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-bold text-ink-1">
                    {lang === 'th' ? 'เอกสารที่ใช้สมัคร' : 'Required documents'}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">
                    {lang === 'th'
                      ? 'เอกสารที่ยังไม่พร้อมเป็นรายการที่เติมได้ ไม่ใช่การตัดสิทธิ์'
                      : 'Documents that are not ready are helpful next steps, not disqualifications.'}
                  </p>
                </div>
              </div>
              <RequiredDocumentsList documents={documents} />
            </section>
          </main>

          <aside className="space-y-6">
            <ApplicationReadinessCard
              readinessPct={readiness.readinessPct}
              readyDocs={readiness.readyDocs}
              requiredDocs={readiness.requiredDocs}
              missingDocuments={readiness.missingDocuments}
              missingData={readiness.missingData}
              improveHref={`/student/scholarships/${scholarship.id}/apply`}
            />
            <StudentPrivacyNotice />
          </aside>
        </div>
      </div>
    </AppShell>
  )
}

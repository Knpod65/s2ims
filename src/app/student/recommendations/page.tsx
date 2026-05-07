'use client'
import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { EmptyState, PageHeader } from '@/components/ui/index'
import {
  getScholarshipForRecommendation,
  studentDataFreshness,
  studentMissingData,
  studentProfileSummary,
  studentRecommendations,
} from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  MissingDataPrompt,
  RecommendationCard,
  StudentPrivacyNotice,
} from '@/components/student'

export default function StudentRecommendationsPage() {
  const { lang } = useLang()
  const visibleRecommendations = studentRecommendations
    .map(recommendation => ({
      recommendation,
      scholarship: getScholarshipForRecommendation(recommendation),
    }))
    .filter(item => item.scholarship)

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'ทุนที่แนะนำสำหรับคุณ' : 'Your scholarship matches'}
        subtitle={lang === 'th' ? 'คำแนะนำนี้อิงจากข้อมูลของคุณเองและข้อมูลทุนที่เปิดให้ตรวจสอบได้' : 'These recommendations use your own data and public scholarship details that S2IMS can check.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.7fr)]">
        <main className="space-y-4">
          <div className="rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF]/70 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.12em] text-role-primary">
                  {lang === 'th' ? 'ภาพรวมการจับคู่' : 'Matching overview'}
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  {lang === 'th'
                    ? `โปรไฟล์ของคุณสมบูรณ์ ${studentProfileSummary.completeness}% และมีคำแนะนำ ${visibleRecommendations.length} รายการ`
                    : `Your profile is ${studentProfileSummary.completeness}% complete with ${visibleRecommendations.length} recommendations.`}
                </p>
              </div>
              <Link href="/student/recommendations/explanation" className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-xs">
                {lang === 'th' ? 'ดูวิธีจับคู่' : 'How matching works'}
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {visibleRecommendations.length === 0 ? (
            <div className="card">
              <EmptyState
                icon={<Search size={42} />}
                title={lang === 'th' ? 'ยังไม่มีทุนที่แนะนำ' : 'No matches yet'}
                description={lang === 'th' ? 'เติมโปรไฟล์ให้ครบขึ้นเพื่อช่วยให้ระบบแนะนำทุนได้' : 'No matches yet - complete your profile to help S2IMS recommend scholarships.'}
                action={
                  <Link href="/student/profile/completion" className="btn-primary min-h-11 px-4 py-2 text-sm">
                    {lang === 'th' ? 'ดูความสมบูรณ์โปรไฟล์' : 'Complete your profile'}
                  </Link>
                }
              />
            </div>
          ) : (
            <div className="grid gap-4 lg:grid-cols-2">
              {visibleRecommendations.map(({ recommendation, scholarship }) => scholarship ? (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  scholarship={scholarship}
                />
              ) : null)}
            </div>
          )}
        </main>

        <aside className="space-y-4">
          <StudentPrivacyNotice />
          <section className="card p-4">
            <h2 className="font-display text-lg font-bold text-ink-1">
              {lang === 'th' ? 'ผลของข้อมูลที่ยังไม่ครบ' : 'Missing data impact'}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">
              {lang === 'th'
                ? 'ข้อมูลที่ยังไม่ครบไม่ได้ตัดสิทธิ์คุณ แต่ทำให้ความมั่นใจของคำแนะนำลดลง'
                : 'Missing data does not disqualify you, but it can lower confidence.'}
            </p>
            <div className="mt-4 space-y-3">
              {studentMissingData.slice(0, 3).map(item => (
                <MissingDataPrompt key={item.id} item={item} compact />
              ))}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  )
}

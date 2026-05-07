'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Building2, CalendarDays } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import {
  getRecommendationByScholarshipId,
  getScholarshipForRecommendation,
  studentDataFreshness,
} from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  EligibilityChecklist,
  FitBreakdown,
  MatchScoreRing,
  MatchingExplanationCard,
  StudentPrivacyNotice,
} from '@/components/student'
import { confidenceLabel } from '@/components/student/MatchScoreRing'

function formatDeadline(date: string, lang: 'th' | 'en') {
  return new Intl.DateTimeFormat(lang === 'th' ? 'th-TH' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date))
}

export default function StudentScholarshipExplanationPage({
  params,
}: {
  params: { scholarshipId: string }
}) {
  const { lang } = useLang()
  const recommendation = getRecommendationByScholarshipId(params.scholarshipId)
  const scholarship = recommendation ? getScholarshipForRecommendation(recommendation) : undefined

  if (!recommendation || !scholarship) {
    return (
      <AppShell requiredRole="student">
        <PageHeader
          title={lang === 'th' ? 'ไม่พบคำอธิบายการจับคู่' : 'Matching explanation not found'}
          subtitle={lang === 'th' ? 'ลองกลับไปดูรายการทุนที่แนะนำอีกครั้ง' : 'Return to recommendations and choose another scholarship.'}
        />
        <Link href="/student/recommendations" className="btn-primary inline-flex min-h-11 items-center gap-2 px-4 py-2 text-sm">
          <ArrowLeft size={14} />
          {lang === 'th' ? 'กลับไปคำแนะนำ' : 'Back to recommendations'}
        </Link>
      </AppShell>
    )
  }

  const title = lang === 'th' ? scholarship.title_th : scholarship.title_en
  const provider = lang === 'th' ? scholarship.provider_th : scholarship.provider

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'เหตุผลที่ทุนนี้เหมาะกับคุณ' : 'Why this scholarship matches you'}
        subtitle={title}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-6xl space-y-6">
        <section className="card p-5">
          <div className="grid gap-5 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center">
            <MatchScoreRing
              score={recommendation.matchScore}
              confidence={recommendation.confidence}
              size="lg"
              className="justify-self-start"
            />
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-ink-3">
                <span className="inline-flex items-center gap-1.5">
                  <Building2 size={13} />
                  {provider}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays size={13} />
                  {formatDeadline(recommendation.deadline, lang)}
                </span>
              </div>
              <h2 className="font-display text-2xl font-bold leading-tight text-ink-1">{title}</h2>
              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-2">
                {recommendation.eligibilitySummary[lang]}
              </p>
            </div>
            <div className="rounded-xl border border-[#0055FF]/20 bg-[#E5EDFF] p-4 text-role-primary">
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                {lang === 'th' ? 'ความมั่นใจ' : 'Confidence'}
              </div>
              <div className="mt-1 font-display text-xl font-bold">
                {confidenceLabel(recommendation.confidence, lang)}
              </div>
              <div className="mt-1 font-mono text-sm">{recommendation.confidencePercent}%</div>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <main className="space-y-6">
            <section className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'ตรวจสอบเงื่อนไขหลัก' : 'Hard eligibility'}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {lang === 'th'
                  ? 'สถานะสีเหลืองคือรายการที่ควรเตรียม ไม่ใช่การตัดสิทธิ์'
                  : 'Amber rows are preparation prompts, not disqualifications.'}
              </p>
              <EligibilityChecklist rows={recommendation.eligibilityChecklist} className="mt-4" />
            </section>

            <section className="card p-5">
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'องค์ประกอบความเหมาะสม' : 'Fit breakdown'}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {lang === 'th'
                  ? 'แถบนี้เป็นคำอธิบายแบบนักศึกษา ไม่ใช่การเปิดเผยสูตรคะแนนภายใน'
                  : 'These bars are a student-friendly explanation, not internal scoring leakage.'}
              </p>
              <FitBreakdown items={recommendation.fitBreakdown} className="mt-5" />
            </section>
          </main>

          <aside className="space-y-6">
            <MatchingExplanationCard
              recommendation={recommendation}
              freshness={studentDataFreshness}
              showImproveCta={false}
            />
            <StudentPrivacyNotice />
          </aside>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/student/recommendations" className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            <ArrowLeft size={14} />
            {lang === 'th' ? 'กลับไปคำแนะนำ' : 'Back to recommendations'}
          </Link>
          <Link href={`/scholarships/${recommendation.scholarshipId}`} className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            {lang === 'th' ? 'ดูรายละเอียดทุนสาธารณะ' : 'View public scholarship detail'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </AppShell>
  )
}

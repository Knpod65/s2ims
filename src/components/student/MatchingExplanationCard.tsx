'use client'
import Link from 'next/link'
import { ArrowRight, Brain, ClipboardCheck, HeartHandshake, Layers } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { DataFreshness, StudentRecommendation } from '@/data/mock/studentMatchingData'
import DataFreshnessIndicator from './DataFreshnessIndicator'
import FitBreakdown from './FitBreakdown'
import StudentPrivacyNotice from './StudentPrivacyNotice'

type MatchingExplanationCardProps = {
  recommendation?: StudentRecommendation
  general?: {
    hardEligibility: { th: string; en: string }
    softFit: { th: string; en: string }
    needContext: { th: string; en: string }
    missingData: { th: string; en: string }
  }
  freshness: DataFreshness
  showImproveCta?: boolean
  className?: string
}

export default function MatchingExplanationCard({
  recommendation,
  general,
  freshness,
  showImproveCta = true,
  className = '',
}: MatchingExplanationCardProps) {
  const { lang } = useLang()
  const hardEligibility = recommendation?.hardEligibilitySummary ?? general?.hardEligibility
  const softFit = recommendation?.softFitSummary ?? general?.softFit
  const needContext = recommendation?.needContextSummary ?? general?.needContext
  const missingData = recommendation?.missingDataImpact ?? general?.missingData

  const sections = [
    {
      id: 'hard',
      icon: ClipboardCheck,
      title: { th: 'เงื่อนไขหลัก', en: 'Hard eligibility' },
      body: hardEligibility,
    },
    {
      id: 'soft',
      icon: Layers,
      title: { th: 'ความเหมาะสมเชิงบริบท', en: 'Soft fit contribution' },
      body: softFit,
    },
    {
      id: 'need',
      icon: HeartHandshake,
      title: { th: 'ปัจจัยความต้องการและบริบท', en: 'Need and context factors' },
      body: needContext,
    },
    {
      id: 'missing',
      icon: Brain,
      title: { th: 'ผลของข้อมูลที่ยังไม่ครบ', en: 'Missing data impact' },
      body: missingData,
    },
  ].filter(section => section.body)

  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-role-primary">
            {lang === 'th' ? 'คำอธิบายการจับคู่' : 'Matching explanation'}
          </div>
          <h2 className="mt-1 font-display text-xl font-bold text-ink-1">
            {lang === 'th' ? 'ระบบมองความเหมาะสมอย่างไร' : 'How S2IMS understands fit'}
          </h2>
        </div>
        <DataFreshnessIndicator freshness={freshness} compact />
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {sections.map(section => {
          const Icon = section.icon
          return (
            <div key={section.id} className="rounded-xl border border-line bg-surface-low p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink-1">
                <span className="rounded-lg bg-white p-2 text-role-primary shadow-soft">
                  <Icon size={15} />
                </span>
                {section.title[lang]}
              </div>
              <p className="text-xs leading-relaxed text-ink-2">{section.body?.[lang]}</p>
            </div>
          )
        })}
      </div>

      {recommendation && (
        <div className="mt-5 rounded-xl border border-line bg-white p-4">
          <h3 className="mb-4 text-sm font-semibold text-ink-1">
            {lang === 'th' ? 'สัดส่วนคำอธิบายแบบนักศึกษา' : 'Student-friendly fit breakdown'}
          </h3>
          <FitBreakdown items={recommendation.fitBreakdown} />
        </div>
      )}

      <StudentPrivacyNotice className="mt-5" />

      {showImproveCta && (
        <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF]/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm leading-relaxed text-ink-2">
            {lang === 'th'
              ? 'ถ้าคุณเพิ่มข้อมูลที่ยังขาด ระบบจะอธิบายคำแนะนำได้มั่นใจขึ้น'
              : 'If you add missing details, S2IMS can explain recommendations with more confidence.'}
          </p>
          <Link href="/student/profile/improve" className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-xs">
            {lang === 'th' ? 'ปรับปรุงโปรไฟล์' : 'Improve profile'}
            <ArrowRight size={13} />
          </Link>
        </div>
      )}
    </section>
  )
}

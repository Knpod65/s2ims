'use client'
import Link from 'next/link'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import {
  generalMatchingExplanation,
  studentDataFreshness,
  studentMissingData,
} from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  MatchingExplanationCard,
  MissingDataPrompt,
} from '@/components/student'

export default function StudentRecommendationsExplanationPage() {
  const { lang } = useLang()

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'S2IMS จับคู่ทุนอย่างไร' : 'How S2IMS matching works'}
        subtitle={lang === 'th' ? 'คำอธิบายแบบนักศึกษา ไม่เปิดเผยคะแนนภายในที่ไม่จำเป็น' : 'A student-friendly explanation without exposing unnecessary internal scoring.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-5xl space-y-6">
        <MatchingExplanationCard
          general={generalMatchingExplanation}
          freshness={studentDataFreshness}
        />

        <section className="card p-5">
          <h2 className="font-display text-lg font-bold text-ink-1">
            {lang === 'th' ? 'สิ่งที่เพิ่มความมั่นใจได้' : 'What can improve confidence'}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">
            {lang === 'th'
              ? 'คุณไม่จำเป็นต้องเติมทุกอย่างทันที เริ่มจากข้อมูลที่สำคัญต่อทุนที่คุณสนใจก่อน'
              : 'You do not have to complete everything at once. Start with the details most relevant to scholarships you care about.'}
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {studentMissingData.slice(0, 4).map(item => (
              <MissingDataPrompt key={item.id} item={item} compact />
            ))}
          </div>
        </section>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/student/recommendations" className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            <ArrowLeft size={14} />
            {lang === 'th' ? 'กลับไปคำแนะนำ' : 'Back to recommendations'}
          </Link>
          <Link href="/student/profile/improve" className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            {lang === 'th' ? 'ปรับปรุงโปรไฟล์' : 'Improve profile'}
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </AppShell>
  )
}

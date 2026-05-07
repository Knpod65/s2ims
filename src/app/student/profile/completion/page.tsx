'use client'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lightbulb } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import {
  studentDataFreshness,
  studentMissingData,
  studentProfileSummary,
} from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  MissingDataPrompt,
  ProfileCompletenessCard,
  StudentPrivacyNotice,
} from '@/components/student'

export default function StudentProfileCompletionPage() {
  const { lang } = useLang()

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'ความสมบูรณ์ของโปรไฟล์' : 'Profile completion'}
        subtitle={lang === 'th' ? 'ดูว่าข้อมูลใดพร้อมใช้ และข้อมูลใดจะช่วยให้คำแนะนำชัดขึ้น' : 'See what is ready and what would make recommendations clearer.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-4xl space-y-6">
        <ProfileCompletenessCard
          percentage={studentProfileSummary.completeness}
          completedFields={studentProfileSummary.completedFields}
          totalFields={studentProfileSummary.totalFields}
          missingItems={studentMissingData}
          maxPrompts={3}
        />

        <section className="card p-5">
          <div className="mb-4 flex items-start gap-3">
            <div className="rounded-xl bg-role-tint p-2.5 text-role-primary">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'รายการข้อมูลที่ยังเติมได้' : 'Missing fields checklist'}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {lang === 'th'
                  ? 'รายการเหล่านี้เป็นโอกาสเพิ่มความมั่นใจ ไม่ใช่ข้อผิดพลาดของคุณ'
                  : 'These are confidence opportunities, not mistakes.'}
              </p>
            </div>
          </div>
          <div className="grid gap-3">
            {studentMissingData.map(item => (
              <MissingDataPrompt key={item.id} item={item} />
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF]/70 p-5">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-2.5 text-role-primary shadow-soft">
              <Lightbulb size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'ทำไมข้อมูลนี้ถึงสำคัญ' : 'Why this matters'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink-2">
                {lang === 'th'
                  ? 'S2IMS ใช้ข้อมูลโปรไฟล์เพื่ออธิบายความเหมาะสมอย่างเข้าใจง่าย ข้อมูลที่ครบขึ้นช่วยลดความไม่แน่นอนและช่วยให้คุณเห็นว่าควรเตรียมเอกสารหรือคำตอบใดก่อนสมัคร'
                  : 'S2IMS uses profile data to explain fit in student-friendly language. More complete data reduces uncertainty and helps you see what documents or answers to prepare before applying.'}
              </p>
            </div>
          </div>
        </section>

        <StudentPrivacyNotice />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/student/profile/improve" className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            {lang === 'th' ? 'เริ่มปรับปรุงโปรไฟล์' : 'Start improving profile'}
            <ArrowRight size={14} />
          </Link>
          <Link href="/student/profile" className="btn-secondary inline-flex min-h-11 items-center justify-center px-4 py-3 text-sm">
            {lang === 'th' ? 'กลับไปโปรไฟล์' : 'Back to profile'}
          </Link>
        </div>
      </div>
    </AppShell>
  )
}

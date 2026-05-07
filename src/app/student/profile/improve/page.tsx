'use client'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, ClipboardEdit, Lightbulb, TrendingUp } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import {
  studentDataFreshness,
  studentMissingData,
} from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  MissingDataPrompt,
  StudentPrivacyNotice,
} from '@/components/student'

export default function StudentProfileImprovePage() {
  const { lang } = useLang()

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'ปรับปรุงโปรไฟล์อย่างเป็นขั้นตอน' : 'Guided profile improvement'}
        subtitle={lang === 'th' ? 'เติมเฉพาะข้อมูลที่ช่วยให้ระบบอธิบายคำแนะนำได้ชัดขึ้น' : 'Add only the details that help S2IMS explain recommendations more clearly.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-4xl space-y-6">
        <section className="card p-5">
          <div className="mb-5 flex items-start gap-3">
            <div className="rounded-xl bg-role-tint p-2.5 text-role-primary">
              <ClipboardEdit size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink-1">
                {lang === 'th' ? 'ขั้นตอนแนะนำ' : 'Recommended steps'}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-2">
                {lang === 'th'
                  ? 'เริ่มจากข้อมูลที่มีผลต่อความมั่นใจสูงก่อน แล้วค่อยเติมรายละเอียดเสริมเมื่อพร้อม'
                  : 'Start with the details that most improve confidence, then add supporting context when ready.'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {studentMissingData.map((item, index) => (
              <div key={item.id} id={item.id} className="rounded-xl border border-line bg-white p-4">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-role-tint font-mono text-sm font-bold text-role-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-ink-1">{item.label[lang]}</h3>
                    <div className="mt-0.5 flex items-center gap-1.5 text-xs text-role-primary">
                      <TrendingUp size={12} />
                      {lang === 'th' ? 'เพิ่มความมั่นใจโดยประมาณ' : 'Estimated confidence lift'} +{item.confidenceImpact}%
                    </div>
                  </div>
                </div>
                <MissingDataPrompt item={item} compact />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <button className="btn-primary min-h-11 px-4 py-2 text-xs" type="button">
                    {item.ctaLabel[lang]}
                  </button>
                  <button className="btn-secondary min-h-11 px-4 py-2 text-xs" type="button">
                    {lang === 'th' ? 'บันทึกไว้ทำภายหลัง' : 'Save for later'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#FDE68A] bg-gradient-to-br from-[#FEF3C7] to-[#FFF7ED] p-5 text-[#78350F]">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white/80 p-2.5 shadow-soft">
              <Lightbulb size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold">
                {lang === 'th' ? 'ไม่มีข้อมูลไหนที่เป็นความผิดของคุณ' : 'Missing data is not your fault'}
              </h2>
              <p className="mt-2 text-sm leading-relaxed">
                {lang === 'th'
                  ? 'คำแนะนำเหล่านี้มีไว้ช่วยให้คุณควบคุมข้อมูลของตัวเองได้มากขึ้น คุณสามารถเติมทีละส่วน และระบบจะใช้เฉพาะข้อมูลที่จำเป็นต่อการจับคู่ทุน'
                  : 'These prompts are here to give you more control over your own data. You can add details one step at a time, and S2IMS uses only what is needed for matching.'}
              </p>
            </div>
          </div>
        </section>

        <StudentPrivacyNotice />

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/student/profile/completion" className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            <ArrowLeft size={14} />
            {lang === 'th' ? 'กลับไปดูความสมบูรณ์' : 'Back to completion'}
          </Link>
          <Link href="/student/profile" className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
            <CheckCircle2 size={14} />
            {lang === 'th' ? 'กลับไปโปรไฟล์' : 'Back to profile'}
          </Link>
        </div>
      </div>
    </AppShell>
  )
}

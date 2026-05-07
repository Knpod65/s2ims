'use client'
import Link from 'next/link'
import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { MissingDataItem } from '@/data/mock/studentMatchingData'
import MissingDataPrompt from './MissingDataPrompt'

type ProfileCompletenessCardProps = {
  percentage: number
  completedFields: number
  totalFields: number
  missingItems: MissingDataItem[]
  maxPrompts?: number
  className?: string
}

export default function ProfileCompletenessCard({
  percentage,
  completedFields,
  totalFields,
  missingItems,
  maxPrompts = 2,
  className = '',
}: ProfileCompletenessCardProps) {
  const { lang } = useLang()
  const safePct = Math.max(0, Math.min(100, Math.round(percentage)))
  const shownMissing = missingItems.slice(0, maxPrompts)

  return (
    <section className={`card p-5 ${className}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-role-primary">
            {lang === 'th' ? 'ความพร้อมของโปรไฟล์' : 'Profile readiness'}
          </div>
          <h2 className="mt-1 font-display text-xl font-bold text-ink-1">
            {lang === 'th' ? 'โปรไฟล์พร้อมสำหรับการจับคู่' : 'Your profile is ready for matching'}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
            {lang === 'th'
              ? 'ข้อมูลที่ครบขึ้นช่วยให้ S2IMS อธิบายคำแนะนำได้มั่นใจและเป็นธรรมขึ้น โดยไม่เปิดเผยข้อมูลส่วนตัวเกินจำเป็น'
              : 'A more complete profile helps S2IMS explain recommendations with more confidence and fairness without exposing unnecessary personal data.'}
          </p>
        </div>
        <div className="shrink-0">
          <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#E5EDFF]">
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(from 180deg, #0055FF ${safePct * 3.6}deg, #E5EDFF 0deg)`,
              }}
            />
            <div className="relative flex h-[74px] w-[74px] flex-col items-center justify-center rounded-full bg-white shadow-soft">
              <span className="font-display text-xl font-bold text-role-primary">{safePct}%</span>
              <span className="text-[10px] font-semibold text-ink-3">
                {completedFields}/{totalFields}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {shownMissing.length > 0 ? (
          shownMissing.map(item => (
            <MissingDataPrompt key={item.id} item={item} compact />
          ))
        ) : (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 md:col-span-2">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={16} />
              {lang === 'th' ? 'ข้อมูลสำคัญครบแล้ว' : 'Key matching details are complete'}
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-col gap-3 border-t border-line pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-ink-3">
          {lang === 'th'
            ? 'เหตุผลที่สำคัญ: ช่องว่างข้อมูลไม่ได้ทำให้คุณเสียสิทธิ์ แต่ทำให้ความมั่นใจของคำแนะนำลดลง'
            : 'Why this matters: missing data does not disqualify you, but it can lower recommendation confidence.'}
        </p>
        <Link href="/student/profile/improve" className="btn-primary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-2 text-xs">
          {lang === 'th' ? 'ปรับปรุงโปรไฟล์' : 'Improve profile'}
          <ArrowRight size={13} />
        </Link>
      </div>
    </section>
  )
}

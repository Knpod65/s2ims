'use client'

import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { mockProviderScholarships } from '@/data/mock/providerData'
import { ChevronRight, Lock } from 'lucide-react'

export default function ProviderCandidateSelectorPage() {
  const { lang } = useLang()

  const scholarships = mockProviderScholarships.filter((s) => s.status === 'OPEN')
  const draftScholarships = mockProviderScholarships.filter((s) => s.status !== 'OPEN')

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        title={lang === 'th' ? 'ดูชุมชนผู้สมัคร' : 'View Candidate Pools'}
        subtitle={lang === 'th' ? 'เลือกทุนเพื่อดูชุมชนผู้สมัครแบบไม่เปิดตัว' : 'Select a scholarship to view the anonymous candidate pool'}
      />

      {scholarships.length > 0 ? (
        <div className="space-y-4 mb-8">
          {scholarships.map((scholarship) => (
            <Link
              key={scholarship.id}
              href={`/provider/scholarships/${scholarship.id}/candidates`}
              className="card p-4 hover:border-brand/30 hover:bg-brand/[0.04] transition-all cursor-pointer"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-ink-1">
                    {lang === 'th' ? scholarship.title_th : scholarship.title_en}
                  </h3>
                  <p className="text-xs text-ink-3 mt-1 line-clamp-1">
                    {lang === 'th' ? scholarship.description_th : scholarship.description_en}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs">
                    <span className="text-ink-3">
                      <span className="font-semibold text-ink-1">฿{scholarship.amount.toLocaleString()}</span> {lang === 'th' ? 'ต่อทุน' : 'per award'}
                    </span>
                    <span className="text-ink-3">
                      <span className="font-semibold text-ink-1">{scholarship.num_awards}</span> {lang === 'th' ? 'ทุน' : 'awards'}
                    </span>
                    <span className="text-ink-3">
                      {lang === 'th' ? 'ปิดรับ:' : 'Deadline:'} <span className="font-semibold text-ink-1">{new Date(scholarship.deadline).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}</span>
                    </span>
                  </div>
                </div>
                <ChevronRight size={18} className="text-ink-3 flex-shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      ) : null}

      {draftScholarships.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-ink-1">
            {lang === 'th' ? 'ทุนร่าง (ไม่มีผู้สมัคร)' : 'Draft Scholarships (No Candidates)'}
          </h2>
          <div className="space-y-2">
            {draftScholarships.map((scholarship) => (
              <div key={scholarship.id} className="card p-4 opacity-50">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink-1">
                      {lang === 'th' ? scholarship.title_th : scholarship.title_en}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 text-ink-3 flex-shrink-0">
                    <Lock size={14} />
                    <span className="text-xs">{scholarship.status}</span>
                  </div>
                </div>
                <p className="text-xs text-ink-3 mt-2">
                  {lang === 'th' ? 'เผยแพร่ทุนเพื่อดูผู้สมัคร' : 'Publish scholarship to view candidates'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {scholarships.length === 0 && draftScholarships.length === 0 && (
        <div className="card p-8 text-center">
          <p className="text-ink-3 text-sm mb-4">
            {lang === 'th' ? 'ยังไม่มีทุนการศึกษา' : 'No scholarships yet'}
          </p>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-8 p-4 rounded-xl bg-status-info/[0.06] border border-status-info/20">
        <p className="text-xs text-status-info/80">
          <span className="font-semibold">🔒 {lang === 'th' ? 'ความเป็นส่วนตัวของผู้สมัคร' : 'Candidate Privacy'}</span>
          <br />
          {lang === 'th'
            ? 'ผู้สมัครได้รับการระบุด้วยโทเค็นที่ปลอดภัยเท่านั้น (Candidate #C-XXXX) ไม่มีชื่อ อีเมล หรืออักษรประจำตัว การจับคู่ขึ้นอยู่กับสถิติที่รวบรวมและคะแนนเท่านั้น'
            : 'All candidates are anonymized using secure tokens (Candidate #C-XXXX). No names, emails, or IDs. Matching is based on aggregated statistics and scores only.'}
        </p>
      </div>
    </AppShell>
  )
}

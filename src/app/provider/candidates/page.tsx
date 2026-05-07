'use client'

import Link from 'next/link'
import { ChevronRight, Lock, ShieldCheck, Users } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import { mockProviderScholarships } from '@/data/mock/providerData'
import ProviderPrivacyNotice from '@/components/provider/ProviderPrivacyNotice'
import { scholarshipStatusColor, scholarshipStatusLabel } from '@/components/provider/ProviderScholarshipCard'

export default function ProviderCandidateSelectorPage() {
  const { lang } = useLang()
  const readyScholarships = mockProviderScholarships.filter(s => s.candidatePoolStatus === 'ready')
  const lockedScholarships = mockProviderScholarships.filter(s => s.candidatePoolStatus !== 'ready')

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'ตัวเลือกชุมชนผู้สมัคร' : 'Candidate Pool Selector'}
        subtitle={lang === 'th' ? 'เลือกทุนเพื่อดูโทเค็นผู้สมัครและสถิติภาพรวมแบบไม่ระบุตัวตน' : 'Select a scholarship to view anonymous candidate tokens and aggregate pool stats.'}
      />

      <div className="space-y-6">
        <ProviderPrivacyNotice mode="candidate" />

        <section>
          <div className="mb-3 flex items-center gap-2">
            <Users size={17} className="text-role-primary" />
            <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'ชุมชนที่พร้อมใช้งาน' : 'Ready candidate pools'}</h2>
          </div>
          <div className="grid gap-4 xl:grid-cols-2">
            {readyScholarships.map(scholarship => (
              <Link
                key={scholarship.id}
                href={`/provider/scholarships/${scholarship.id}/candidates`}
                className="card card-hover group relative overflow-hidden p-4"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-role-gradient opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-ink-1">{lang === 'th' ? scholarship.title_th : scholarship.title_en}</h3>
                      <StatusBadge label={scholarshipStatusLabel(scholarship.status, lang)} color={scholarshipStatusColor(scholarship.status)} dot />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-ink-2">
                      {lang === 'th' ? scholarship.description_th : scholarship.description_en}
                    </p>
                  </div>
                  <ChevronRight size={18} className="mt-1 shrink-0 text-ink-3 transition group-hover:text-role-primary" />
                </div>
                {scholarship.candidatePoolStats && (
                  <div className="grid gap-2 sm:grid-cols-3">
                    <div className="rounded-lg bg-surface-low p-3">
                      <p className="text-[11px] text-ink-3">{lang === 'th' ? 'โทเค็นทั้งหมด' : 'Tokens'}</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-ink-1">{scholarship.candidatePoolStats.totalCandidates}</p>
                    </div>
                    <div className="rounded-lg bg-surface-low p-3">
                      <p className="text-[11px] text-ink-3">{lang === 'th' ? 'กลุ่มบนสุด' : 'Top band'}</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-role-primary">{scholarship.candidatePoolStats.topBand}</p>
                    </div>
                    <div className="rounded-lg bg-surface-low p-3">
                      <p className="text-[11px] text-ink-3">{lang === 'th' ? 'คะแนนเฉลี่ย' : 'Avg match'}</p>
                      <p className="mt-1 font-mono text-sm font-semibold text-ink-1">{scholarship.candidatePoolStats.averageMatchScore}%</p>
                    </div>
                  </div>
                )}
              </Link>
            ))}
          </div>
        </section>

        {lockedScholarships.length > 0 && (
          <section>
            <div className="mb-3 flex items-center gap-2">
              <Lock size={17} className="text-ink-3" />
              <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'ยังไม่เปิดชุมชนผู้สมัคร' : 'Pools not yet available'}</h2>
            </div>
            <div className="space-y-3">
              {lockedScholarships.map(scholarship => (
                <div key={scholarship.id} className="rounded-xl border border-line bg-white/70 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-ink-1">{lang === 'th' ? scholarship.title_th : scholarship.title_en}</h3>
                        <StatusBadge label={scholarshipStatusLabel(scholarship.status, lang)} color={scholarshipStatusColor(scholarship.status)} dot />
                      </div>
                      <p className="mt-2 text-sm text-ink-2">
                        {scholarship.status === 'DRAFT'
                          ? (lang === 'th' ? 'บันทึกหรือส่งร่างให้เจ้าหน้าที่ตรวจสอบก่อนเปิดชุมชนผู้สมัคร' : 'Save or submit the draft for staff review before candidate pools unlock.')
                          : (lang === 'th' ? 'รอเจ้าหน้าที่ตรวจสอบก่อนเปิดระบบจับคู่' : 'Waiting for staff review before matching opens.')}
                      </p>
                    </div>
                    <div className="flex min-h-11 items-center gap-2 rounded-lg border border-line bg-surface-low px-3 text-xs font-semibold text-ink-3">
                      <Lock size={14} />
                      {lang === 'th' ? 'ปิดอยู่' : 'Locked'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="rounded-xl border border-role-border bg-role-tint p-4 text-role-primary">
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck size={15} />
            {lang === 'th' ? 'ขอบเขตความเป็นส่วนตัว' : 'Privacy boundary'}
          </div>
          <p className="text-xs leading-relaxed">
            {lang === 'th'
              ? 'เส้นทางนี้ไม่แสดงชื่อ รหัสนักศึกษาจริง อีเมล หรือข้อมูลติดต่อของนักศึกษา'
              : 'This route does not display student names, raw student IDs, emails, or contact details.'}
          </p>
        </div>
      </div>
    </AppShell>
  )
}

'use client'

import Link from 'next/link'
import { Edit3, Lock, Target, Users } from 'lucide-react'
import { StatusBadge } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import type { Scholarship } from '@/data/mock/providerData'

type ProviderScholarshipCardProps = {
  scholarship: Scholarship
}

export function scholarshipStatusLabel(status: Scholarship['status'], lang: 'th' | 'en') {
  const labels = {
    DRAFT: { en: 'Draft', th: 'ร่าง' },
    ACTIVE: { en: 'Active', th: 'เปิดใช้งาน' },
    PENDING_REVIEW: { en: 'Pending review', th: 'รอตรวจสอบ' },
    CLOSED: { en: 'Closed', th: 'ปิดแล้ว' },
  }
  return labels[status][lang]
}

export function scholarshipStatusColor(status: Scholarship['status']) {
  if (status === 'ACTIVE') return 'bg-role-tint text-role-primary border-role-border'
  if (status === 'PENDING_REVIEW') return 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]'
  if (status === 'CLOSED') return 'bg-surface-low text-ink-2 border-line'
  return 'bg-white text-ink-3 border-line'
}

export default function ProviderScholarshipCard({ scholarship }: ProviderScholarshipCardProps) {
  const { lang } = useLang()
  const isPoolReady = scholarship.candidatePoolStatus === 'ready'

  return (
    <article className="group card card-hover relative overflow-hidden p-4">
      <div className="absolute inset-y-0 left-0 w-1 bg-role-gradient opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start gap-2">
            <h3 className="font-semibold text-ink-1">
              {lang === 'th' ? scholarship.title_th : scholarship.title_en}
            </h3>
            <StatusBadge label={scholarshipStatusLabel(scholarship.status, lang)} color={scholarshipStatusColor(scholarship.status)} dot />
          </div>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-2">
            {lang === 'th' ? scholarship.description_th : scholarship.description_en}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div className="rounded-lg bg-surface-low p-3">
              <p className="text-[11px] text-ink-3">{lang === 'th' ? 'จำนวนเงิน' : 'Amount'}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-ink-1">฿{scholarship.amount.toLocaleString()}</p>
            </div>
            <div className="rounded-lg bg-surface-low p-3">
              <p className="text-[11px] text-ink-3">{lang === 'th' ? 'จำนวนทุน' : 'Awards'}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-ink-1">{scholarship.num_awards}</p>
            </div>
            <div className="rounded-lg bg-surface-low p-3">
              <p className="text-[11px] text-ink-3">{lang === 'th' ? 'ปิดรับ' : 'Deadline'}</p>
              <p className="mt-1 font-mono text-sm font-semibold text-ink-1">
                {new Date(scholarship.deadline).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
              </p>
            </div>
            <div className="rounded-lg bg-role-tint p-3">
              <p className="text-[11px] text-role-primary">{lang === 'th' ? 'ชุมชนผู้สมัคร' : 'Candidate pool'}</p>
              <p className="mt-1 text-xs font-semibold text-role-primary">
                {isPoolReady ? (lang === 'th' ? 'พร้อม' : 'Ready') : (lang === 'th' ? 'ยังไม่พร้อม' : 'Locked')}
              </p>
            </div>
          </div>
        </div>

        <div className="grid min-w-[220px] grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-1">
          <Link href={`/provider/scholarships/${scholarship.id}/edit`} className="btn-secondary min-h-11 justify-center text-xs">
            <Edit3 size={14} />
            {lang === 'th' ? 'แก้ไข' : 'Edit'}
          </Link>
          <Link href={`/provider/scholarships/${scholarship.id}/criteria`} className="btn-secondary min-h-11 justify-center text-xs">
            <Target size={14} />
            {lang === 'th' ? 'เกณฑ์' : 'Criteria'}
          </Link>
          {isPoolReady ? (
            <Link href={`/provider/scholarships/${scholarship.id}/candidates`} className="btn-primary min-h-11 justify-center text-xs">
              <Users size={14} />
              {lang === 'th' ? 'ผู้สมัคร' : 'Candidates'}
            </Link>
          ) : (
            <button type="button" className="btn-secondary min-h-11 justify-center text-xs opacity-60" disabled>
              <Lock size={14} />
              {lang === 'th' ? 'ล็อก' : 'Locked'}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

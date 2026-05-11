'use client'

import Link from 'next/link'
import { Edit3, Lock, Target, Users } from 'lucide-react'
import { StatusBadge } from '@/components/ui/index'
import { getStatusLabel, getStatusTone } from '@/config/statusHelpers'
import { useLang } from '@/lib/i18n'
import type { CandidatePoolStatus, Scholarship } from '@/data/mock/providerData'

type ProviderScholarshipCardProps = {
  scholarship: Scholarship
}

export function scholarshipStatusLabel(status: Scholarship['status'], lang: 'th' | 'en') {
  const providerLabelOverrides: Partial<Record<Scholarship['status'], { th?: string; en?: string }>> = {
    DRAFT: { th: 'ร่าง' },
    ACTIVE: { th: 'เปิดใช้งาน' },
    CLOSED: { th: 'ปิดแล้ว' },
  }

  return providerLabelOverrides[status]?.[lang] ?? getStatusLabel('scholarship', status, lang)
}

export function scholarshipStatusColor(status: Scholarship['status']) {
  if (status === 'ACTIVE') return 'bg-role-tint text-role-primary border-role-border'
  const tone = getStatusTone('scholarship', status)
  if (tone === 'amber') return 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]'
  if (tone === 'success' || tone === 'emerald') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'CLOSED') return 'bg-surface-low text-ink-2 border-line'
  return 'bg-white text-ink-3 border-line'
}

function candidatePoolStatusLabel(status: CandidatePoolStatus, lang: 'th' | 'en') {
  return getStatusLabel('candidatePool', status, lang)
}

function candidatePoolStatusColor(status: CandidatePoolStatus) {
  const tone = getStatusTone('candidatePool', status)
  if (tone === 'emerald' || tone === 'success') {
    return {
      container: 'bg-role-tint',
      label: 'text-role-primary',
      value: 'text-role-primary',
    }
  }
  if (tone === 'amber') {
    return {
      container: 'bg-[#FFFBEB]',
      label: 'text-[#78350F]/70',
      value: 'text-[#78350F]',
    }
  }
  return {
    container: 'bg-surface-low',
    label: 'text-ink-3',
    value: 'text-ink-2',
  }
}

export default function ProviderScholarshipCard({ scholarship }: ProviderScholarshipCardProps) {
  const { lang } = useLang()
  const isPoolReady = scholarship.candidatePoolStatus === 'ready'
  const candidatePoolColor = candidatePoolStatusColor(scholarship.candidatePoolStatus)

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
            <div className={`rounded-lg p-3 ${candidatePoolColor.container}`}>
              <p className={`text-[11px] ${candidatePoolColor.label}`}>{lang === 'th' ? 'ชุมชนผู้สมัคร' : 'Candidate pool'}</p>
              <p className={`mt-1 text-xs font-semibold ${candidatePoolColor.value}`}>
                {candidatePoolStatusLabel(scholarship.candidatePoolStatus, lang)}
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

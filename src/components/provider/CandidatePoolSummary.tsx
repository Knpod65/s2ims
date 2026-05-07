'use client'

import { BarChart3, ShieldCheck, Users } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { CandidatePoolStats } from '@/data/mock/providerData'
import ProviderImpactCard from './ProviderImpactCard'

type CandidatePoolSummaryProps = {
  stats?: CandidatePoolStats
}

export default function CandidatePoolSummary({ stats }: CandidatePoolSummaryProps) {
  const { lang } = useLang()

  if (!stats) {
    return (
      <div className="card p-5">
        <p className="text-sm text-ink-2">{lang === 'th' ? 'ยังไม่มีข้อมูลชุมชนผู้สมัคร' : 'No candidate pool data yet.'}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ProviderImpactCard
          icon={Users}
          label={lang === 'th' ? 'ผู้สมัครนิรนามทั้งหมด' : 'Anonymous candidates'}
          value={stats.totalCandidates}
          helper={lang === 'th' ? 'แสดงเป็นโทเค็นเท่านั้น' : 'Shown as tokens only'}
        />
        <ProviderImpactCard
          icon={ShieldCheck}
          label={lang === 'th' ? 'กลุ่มบนสุด' : 'Top band'}
          value={stats.topBand}
          helper={lang === 'th' ? 'ผ่านเงื่อนไขและสอดคล้องสูง' : 'High fit after hard gates'}
        />
        <ProviderImpactCard
          icon={BarChart3}
          label={lang === 'th' ? 'กลุ่มดี' : 'Strong band'}
          value={stats.strongBand}
          helper={lang === 'th' ? 'เหมาะสำหรับรายชื่อสำรอง' : 'Useful shortlist depth'}
        />
        <ProviderImpactCard
          icon={BarChart3}
          label={lang === 'th' ? 'คะแนนเฉลี่ย' : 'Average match'}
          value={`${stats.averageMatchScore}%`}
          helper={lang === 'th' ? 'ไม่ใช่คะแนนดิบภายใน' : 'Student-friendly band score'}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="text-xs font-semibold text-ink-3">{lang === 'th' ? 'ภาพรวมความจำเป็น' : 'Need mix'}</p>
          <p className="mt-1 text-sm text-ink-1">{lang === 'th' ? stats.aggregateNeedMix_th : stats.aggregateNeedMix_en}</p>
        </div>
        <div className="rounded-xl border border-line bg-white p-4">
          <p className="text-xs font-semibold text-ink-3">{lang === 'th' ? 'ภาพรวมวิชาการ' : 'Academic mix'}</p>
          <p className="mt-1 text-sm text-ink-1">{lang === 'th' ? stats.aggregateAcademicMix_th : stats.aggregateAcademicMix_en}</p>
        </div>
      </div>
    </div>
  )
}

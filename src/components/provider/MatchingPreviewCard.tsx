'use client'

import { BarChart3, Users } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { CriteriaConfig } from '@/data/mock/providerData'

type MatchingPreviewCardProps = {
  criteria: CriteriaConfig
}

export default function MatchingPreviewCard({ criteria }: MatchingPreviewCardProps) {
  const { lang } = useLang()
  const estimate = criteria.candidateVolumeEstimate

  return (
    <section className="card p-5">
      <div className="mb-4 flex items-center gap-2">
        <BarChart3 size={17} className="text-role-primary" />
        <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'ภาพตัวอย่างการจับคู่' : 'Matching preview'}</h2>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-role-tint p-4 text-role-primary">
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-semibold">{lang === 'th' ? 'เข้าเงื่อนไขโดยประมาณ' : 'Estimated eligible'}</span>
            <Users size={17} />
          </div>
          <p className="mt-3 font-display text-3xl font-bold">{estimate.eligible}</p>
        </div>
        <div className="rounded-xl bg-surface-low p-4">
          <span className="text-xs font-semibold text-ink-2">{lang === 'th' ? 'พร้อมเข้าชุมชนผู้สมัคร' : 'Ready for candidate pool'}</span>
          <p className="mt-3 font-display text-3xl font-bold text-ink-1">{estimate.readyForPool}</p>
        </div>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-ink-2">
        {lang === 'th' ? estimate.note_th : estimate.note_en}
      </p>
    </section>
  )
}

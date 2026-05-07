'use client'

import { useMemo, useState } from 'react'
import { Save } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { CriteriaConfig } from '@/data/mock/providerData'
import MatchingPreviewCard from './MatchingPreviewCard'
import ProviderPrivacyNotice from './ProviderPrivacyNotice'

type ProviderCriteriaBuilderProps = {
  criteria: CriteriaConfig
}

export default function ProviderCriteriaBuilder({ criteria }: ProviderCriteriaBuilderProps) {
  const { lang } = useLang()
  const [weights, setWeights] = useState<Record<string, number>>(
    Object.fromEntries(criteria.criteria.map(item => [item.id, item.weight])),
  )
  const [saved, setSaved] = useState(false)

  const total = useMemo(() => Object.values(weights).reduce((sum, value) => sum + value, 0), [weights])
  const isValid = total === 100

  const setWeight = (id: string, value: number) => {
    setSaved(false)
    setWeights(prev => ({ ...prev, [id]: Math.max(0, Math.min(100, value)) }))
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-5">
        <section className="card p-5">
          <h2 className="mb-2 font-semibold text-ink-1">{lang === 'th' ? 'เงื่อนไขหลักที่ต้องผ่าน' : 'Hard constraints'}</h2>
          <p className="mb-4 text-sm text-ink-2">
            {lang === 'th'
              ? 'ผู้สมัครต้องผ่านเงื่อนไขเหล่านี้ก่อนเข้าสู่การจัดอันดับแบบไม่ระบุตัวตน'
              : 'Candidates must pass these gates before anonymous ranking.'}
          </p>
          <div className="space-y-3">
            {criteria.hardConstraints.map(item => (
              <div key={item.id} className="rounded-xl border border-line bg-white p-4">
                <p className="text-sm font-semibold text-ink-1">{lang === 'th' ? item.label_th : item.label_en}</p>
                <p className="mt-1 text-xs text-ink-2">{lang === 'th' ? item.value_th : item.value_en}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'น้ำหนักความสอดคล้อง' : 'Soft preference weights'}</h2>
              <p className="mt-1 text-sm text-ink-2">
                {lang === 'th' ? 'ปรับน้ำหนักปัจจัยเชิงคุณภาพ รวมต้องเท่ากับ 100%' : 'Tune qualitative matching factors. Total must equal 100%.'}
              </p>
            </div>
            <span className={`rounded-full border px-3 py-1 text-xs font-semibold ${isValid ? 'border-role-border bg-role-tint text-role-primary' : 'border-[#FDE68A] bg-[#FFFBEB] text-[#78350F]'}`}>
              {lang === 'th' ? 'รวม' : 'Total'} {total}%
            </span>
          </div>
          <div className="space-y-5">
            {criteria.criteria.map(item => (
              <label key={item.id} className="block">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-ink-1">{lang === 'th' ? item.name_th : item.name_en}</span>
                  <span className="font-mono text-sm font-semibold text-role-primary">{weights[item.id]}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={weights[item.id]}
                  onChange={event => setWeight(item.id, Number(event.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-low accent-[#10B981]"
                />
              </label>
            ))}
          </div>
          {!isValid && (
            <p className="mt-4 rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 text-xs font-medium text-[#78350F]">
              {lang === 'th' ? 'น้ำหนักต้องรวมกันเท่ากับ 100% ก่อนบันทึก' : 'Weights must total 100% before saving.'}
            </p>
          )}
        </section>
      </div>

      <aside className="space-y-5">
        <MatchingPreviewCard criteria={criteria} />
        <ProviderPrivacyNotice mode="criteria" />
        <div className="sticky bottom-[calc(48px+env(safe-area-inset-bottom))] rounded-xl border border-white/60 bg-white/90 p-3 shadow-card backdrop-blur-xl lg:static lg:bg-transparent lg:p-0 lg:shadow-none">
          {saved && (
            <p className="mb-2 rounded-lg border border-role-border bg-role-tint px-3 py-2 text-xs font-semibold text-role-primary">
              {lang === 'th' ? 'บันทึกเกณฑ์จำลองแล้ว' : 'Mock criteria saved'}
            </p>
          )}
          <button
            type="button"
            onClick={() => setSaved(true)}
            disabled={!isValid}
            className="btn-primary min-h-11 w-full justify-center text-sm disabled:opacity-50"
          >
            <Save size={15} />
            {lang === 'th' ? 'บันทึกเกณฑ์' : 'Save criteria'}
          </button>
        </div>
      </aside>
    </div>
  )
}

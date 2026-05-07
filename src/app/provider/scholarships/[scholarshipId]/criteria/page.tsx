'use client'

import { useRouter, useParams } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { mockProviderScholarships } from '@/data/mock/providerData'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface CriteriaWeights {
  gpa: number
  leadership: number
  community: number
  essay: number
}

export default function CriteriaPage() {
  const router = useRouter()
  const params = useParams()
  const { lang } = useLang()
  const scholarshipId = params.scholarshipId as string

  const scholarship = mockProviderScholarships.find((s) => s.id === scholarshipId)
  const criteriaConfig = scholarship?.criteriaConfig

  // Extract weights from criteria array or use defaults
  const defaultWeights: CriteriaWeights = {
    gpa: 30,
    leadership: 25,
    community: 25,
    essay: 20,
  }

  const defaultConstraints = {
    minGPA: 2.5,
    minLeadership: 0,
    minCommunity: 0,
    minEssay: 0,
  }

  // Compute initial weights
  const computeInitialWeights = (): CriteriaWeights => {
    if (!criteriaConfig?.criteria) return defaultWeights

    const weightMap: CriteriaWeights = { gpa: 0, leadership: 0, community: 0, essay: 0 }
    criteriaConfig.criteria.forEach((c) => {
      if (c.type === 'gpa') weightMap.gpa = c.weight
      else if (c.type === 'other' && c.name.toLowerCase().includes('leadership')) weightMap.leadership = c.weight
      else if (c.type === 'community_service') weightMap.community = c.weight
      else if (c.type === 'essay_quality') weightMap.essay = c.weight
    })
    return Object.values(weightMap).some((w) => w > 0) ? weightMap : defaultWeights
  }

  const [weights, setWeights] = useState<CriteriaWeights>(defaultWeights)
  const [hardConstraints, setHardConstraints] = useState(defaultConstraints)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Update weights from criteria config on client side
  useEffect(() => {
    if (criteriaConfig?.criteria) {
      const weightMap: CriteriaWeights = { gpa: 0, leadership: 0, community: 0, essay: 0 }
      criteriaConfig.criteria.forEach((c) => {
        if (c.type === 'gpa') weightMap.gpa = c.weight
        else if (c.type === 'other' && c.name.toLowerCase().includes('leadership')) weightMap.leadership = c.weight
        else if (c.type === 'community_service') weightMap.community = c.weight
        else if (c.type === 'essay_quality') weightMap.essay = c.weight
      })
      if (Object.values(weightMap).some((w) => w > 0)) {
        setWeights(weightMap)
      }
    }
  }, [criteriaConfig])

  const totalWeight = weights.gpa + weights.leadership + weights.community + weights.essay

  const handleWeightChange = (field: keyof CriteriaWeights, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(100, value)),
    }))
  }

  const handleConstraintChange = (field: string, value: number) => {
    setHardConstraints((prev) => ({
      ...prev,
      [field]: Math.max(0, Math.min(5, value)),
    }))
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (totalWeight !== 100) {
      newErrors.weights = lang === 'th' ? 'เกณฑ์ต้องรวมกันเท่ากับ 100%' : 'Criteria must total 100%'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validate()) {
      // Mock save
      router.push(`/provider/scholarships/${scholarshipId}`)
    }
  }

  if (!scholarship) {
    return (
      <AppShell requiredRole="provider">
        <div className="text-center py-8">
          <p className="text-ink-3">{lang === 'th' ? 'ไม่พบทุน' : 'Scholarship not found'}</p>
        </div>
      </AppShell>
    )
  }

  const criteriaList = [
    { key: 'gpa', label_en: 'GPA', label_th: 'คะแนนเฉลี่ย' },
    { key: 'leadership', label_en: 'Leadership', label_th: 'ความเป็นผู้นำ' },
    { key: 'community', label_en: 'Community Service', label_th: 'บริการชุมชน' },
    { key: 'essay', label_en: 'Essay Quality', label_th: 'คุณภาพบทความ' },
  ]

  return (
    <AppShell requiredRole="provider">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/provider/scholarships" className="text-ink-3 hover:text-ink-1 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <PageHeader
          title={lang === 'th' ? 'เกณฑ์การจับคู่' : 'Matching Criteria'}
          subtitle={lang === 'th' ? 'ตั้งค่าเกณฑ์และน้ำหนักในการจับคู่ผู้สมัคร' : 'Configure criteria weights for candidate matching'}
        />
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Weight Sliders */}
        <div className="card p-6">
          <h3 className="font-semibold text-ink-1 mb-4">
            {lang === 'th' ? 'น้ำหนักเกณฑ์' : 'Criteria Weights'}
          </h3>

          <div className="space-y-6">
            {criteriaList.map(({ key, label_en, label_th }) => {
              const typedKey = key as keyof CriteriaWeights
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-ink-1">
                      {lang === 'th' ? label_th : label_en}
                    </label>
                    <span className="text-sm font-semibold text-role-primary">{weights[typedKey]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights[typedKey]}
                    onChange={(e) => handleWeightChange(typedKey, parseInt(e.target.value))}
                    className="w-full h-2 bg-bg-100 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )
            })}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-bg-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-ink-3">
                {lang === 'th' ? 'รวมทั้งหมด' : 'Total'}
              </span>
              <span className={`text-lg font-semibold ${totalWeight === 100 ? 'text-status-success' : 'text-status-danger'}`}>
                {totalWeight}%
              </span>
            </div>
            {errors.weights && (
              <p className="text-xs text-status-danger mt-2">{errors.weights}</p>
            )}
          </div>
        </div>

        {/* Hard Constraints */}
        <div className="card p-6">
          <h3 className="font-semibold text-ink-1 mb-4">
            {lang === 'th' ? 'เงื่อนไขขั้นต่ำ' : 'Minimum Requirements'}
          </h3>

          <p className="text-xs text-ink-3 mb-4">
            {lang === 'th'
              ? 'ผู้สมัครต้องตรงตามเงื่อนไขเหล่านี้ทั้งหมดเพื่อมีสิทธิ์'
              : 'Candidates must meet ALL of these requirements to be eligible'}
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink-1 block mb-2">
                {lang === 'th' ? 'คะแนนเฉลี่ยต่ำสุด' : 'Minimum GPA'}
              </label>
              <input
                type="number"
                min="0"
                max="4"
                step="0.1"
                value={hardConstraints.minGPA}
                onChange={(e) => setHardConstraints((prev) => ({ ...prev, minGPA: parseFloat(e.target.value) || 0 }))}
                className="input-base w-full"
              />
              <p className="text-xs text-ink-3 mt-1">
                {lang === 'th' ? 'ค่าต้องอยู่ระหว่าง 0.0 ถึง 4.0' : 'Value must be between 0.0 and 4.0'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-ink-1 block mb-2">
                {lang === 'th' ? 'คะแนนความเป็นผู้นำต่ำสุด (1-5)' : 'Minimum Leadership Score (1-5)'}
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={hardConstraints.minLeadership}
                onChange={(e) => handleConstraintChange('minLeadership', parseInt(e.target.value) || 0)}
                className="input-base w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink-1 block mb-2">
                {lang === 'th' ? 'คะแนนบริการชุมชนต่ำสุด (1-5)' : 'Minimum Community Service Score (1-5)'}
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={hardConstraints.minCommunity}
                onChange={(e) => handleConstraintChange('minCommunity', parseInt(e.target.value) || 0)}
                className="input-base w-full"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-ink-1 block mb-2">
                {lang === 'th' ? 'คะแนนบทความต่ำสุด (1-5)' : 'Minimum Essay Score (1-5)'}
              </label>
              <input
                type="number"
                min="0"
                max="5"
                value={hardConstraints.minEssay}
                onChange={(e) => handleConstraintChange('minEssay', parseInt(e.target.value) || 0)}
                className="input-base w-full"
              />
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="card p-4 rounded-xl bg-status-info/[0.06] border border-status-info/20">
          <p className="text-xs text-status-info/80">
            <span className="font-semibold">🔒 {lang === 'th' ? 'ตรวจสอบการจับคู่' : 'Matching Preview'}</span>
            <br />
            {lang === 'th'
              ? 'เกณฑ์นี้จะนำไปใช้ทั่วโลกกับผู้สมัครที่ไม่ระบุตัวตนเพื่อสร้างการจับคู่ที่เป็นธรรม'
              : 'These criteria apply globally to anonymized candidates to create fair matches.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Link
            href="/provider/scholarships"
            className="flex-1 btn-secondary py-2.5 text-sm text-center"
          >
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </Link>
          <button
            onClick={handleSave}
            disabled={totalWeight !== 100}
            className="flex-1 btn-primary py-2.5 text-sm disabled:opacity-60"
          >
            {lang === 'th' ? 'บันทึก' : 'Save'}
          </button>
        </div>
      </div>
    </AppShell>
  )
}

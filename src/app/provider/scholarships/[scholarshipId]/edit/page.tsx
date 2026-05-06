'use client'

import { useRouter, useParams } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { mockProviderScholarships } from '@/data/mock/providerData'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function EditScholarshipPage() {
  const router = useRouter()
  const params = useParams()
  const { lang } = useLang()
  const scholarshipId = params.scholarshipId as string

  const scholarship = mockProviderScholarships.find((s) => s.id === scholarshipId)

  const [formData, setFormData] = useState({
    title_en: scholarship?.title_en || '',
    title_th: scholarship?.title_th || '',
    description_en: scholarship?.description_en || '',
    description_th: scholarship?.description_th || '',
    amount: scholarship?.amount || 0,
    num_awards: scholarship?.num_awards || 1,
    deadline: scholarship?.deadline || new Date().toISOString().split('T')[0],
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title_en.trim()) {
      newErrors.title_en = lang === 'th' ? 'กรุณากรอกชื่อทุน (EN)' : 'Please enter scholarship title (EN)'
    }
    if (!formData.title_th.trim()) {
      newErrors.title_th = lang === 'th' ? 'กรุณากรอกชื่อทุน (TH)' : 'Please enter scholarship title (TH)'
    }
    if (!formData.description_en.trim()) {
      newErrors.description_en = lang === 'th' ? 'กรุณากรอกรายละเอียด (EN)' : 'Please enter description (EN)'
    }
    if (!formData.description_th.trim()) {
      newErrors.description_th = lang === 'th' ? 'กรุณากรอกรายละเอียด (TH)' : 'Please enter description (TH)'
    }
    if (formData.amount <= 0) {
      newErrors.amount = lang === 'th' ? 'จำนวนเงินต้องมากกว่า 0' : 'Amount must be greater than 0'
    }
    if (formData.num_awards <= 0) {
      newErrors.num_awards = lang === 'th' ? 'จำนวนทุนต้องมากกว่า 0' : 'Number of awards must be greater than 0'
    }
    if (!formData.deadline) {
      newErrors.deadline = lang === 'th' ? 'กรุณาเลือกวันปิดรับสมัคร' : 'Please select deadline'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      // Mock submit
      router.push('/provider/scholarships')
    }
  }

  if (!scholarship) {
    return (
      <AppShell requiredRole="provider">
        <div className="text-center py-8">
          <p className="text-ink-3">
            {lang === 'th' ? 'ไม่พบทุน' : 'Scholarship not found'}
          </p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="provider">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/provider/scholarships" className="text-ink-3 hover:text-ink-1 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <PageHeader
          title={lang === 'th' ? 'แก้ไขทุน' : 'Edit Scholarship'}
          subtitle={lang === 'th' ? 'อัปเดตรายละเอียดทุนการศึกษา' : 'Update scholarship details'}
        />
      </div>

      <div className="max-w-2xl">
        <div className="card p-6 space-y-6">
          {/* English Title */}
          <div>
            <label className="text-sm font-semibold text-ink-1 block mb-2">
              {lang === 'th' ? 'ชื่อทุน (อังกฤษ)' : 'Scholarship Title (English)'} <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.title_en}
              onChange={(e) => handleChange('title_en', e.target.value)}
              placeholder={lang === 'th' ? 'ชื่อทุน' : 'Scholarship title'}
              className={`input-base w-full ${errors.title_en ? 'border-status-danger' : ''}`}
            />
            {errors.title_en && <p className="text-xs text-status-danger mt-1">{errors.title_en}</p>}
          </div>

          {/* Thai Title */}
          <div>
            <label className="text-sm font-semibold text-ink-1 block mb-2">
              {lang === 'th' ? 'ชื่อทุน (ไทย)' : 'Scholarship Title (Thai)'} <span className="text-status-danger">*</span>
            </label>
            <input
              type="text"
              value={formData.title_th}
              onChange={(e) => handleChange('title_th', e.target.value)}
              placeholder={lang === 'th' ? 'ชื่อทุน' : 'Scholarship title'}
              className={`input-base w-full ${errors.title_th ? 'border-status-danger' : ''}`}
            />
            {errors.title_th && <p className="text-xs text-status-danger mt-1">{errors.title_th}</p>}
          </div>

          {/* English Description */}
          <div>
            <label className="text-sm font-semibold text-ink-1 block mb-2">
              {lang === 'th' ? 'รายละเอียด (อังกฤษ)' : 'Description (English)'} <span className="text-status-danger">*</span>
            </label>
            <textarea
              value={formData.description_en}
              onChange={(e) => handleChange('description_en', e.target.value)}
              placeholder={lang === 'th' ? 'รายละเอียดทุน' : 'Scholarship description'}
              rows={3}
              className={`input-base w-full resize-none ${errors.description_en ? 'border-status-danger' : ''}`}
            />
            {errors.description_en && <p className="text-xs text-status-danger mt-1">{errors.description_en}</p>}
          </div>

          {/* Thai Description */}
          <div>
            <label className="text-sm font-semibold text-ink-1 block mb-2">
              {lang === 'th' ? 'รายละเอียด (ไทย)' : 'Description (Thai)'} <span className="text-status-danger">*</span>
            </label>
            <textarea
              value={formData.description_th}
              onChange={(e) => handleChange('description_th', e.target.value)}
              placeholder={lang === 'th' ? 'รายละเอียดทุน' : 'Scholarship description'}
              rows={3}
              className={`input-base w-full resize-none ${errors.description_th ? 'border-status-danger' : ''}`}
            />
            {errors.description_th && <p className="text-xs text-status-danger mt-1">{errors.description_th}</p>}
          </div>

          {/* Amount */}
          <div>
            <label className="text-sm font-semibold text-ink-1 block mb-2">
              {lang === 'th' ? 'จำนวนเงิน (บาท)' : 'Amount (Baht)'} <span className="text-status-danger">*</span>
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', parseInt(e.target.value) || 0)}
              min="1"
              className={`input-base w-full ${errors.amount ? 'border-status-danger' : ''}`}
            />
            {errors.amount && <p className="text-xs text-status-danger mt-1">{errors.amount}</p>}
          </div>

          {/* Number of Awards */}
          <div>
            <label className="text-sm font-semibold text-ink-1 block mb-2">
              {lang === 'th' ? 'จำนวนทุน' : 'Number of Awards'} <span className="text-status-danger">*</span>
            </label>
            <input
              type="number"
              value={formData.num_awards}
              onChange={(e) => handleChange('num_awards', parseInt(e.target.value) || 1)}
              min="1"
              className={`input-base w-full ${errors.num_awards ? 'border-status-danger' : ''}`}
            />
            {errors.num_awards && <p className="text-xs text-status-danger mt-1">{errors.num_awards}</p>}
          </div>

          {/* Deadline */}
          <div>
            <label className="text-sm font-semibold text-ink-1 block mb-2">
              {lang === 'th' ? 'วันปิดรับสมัคร' : 'Deadline'} <span className="text-status-danger">*</span>
            </label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => handleChange('deadline', e.target.value)}
              className={`input-base w-full ${errors.deadline ? 'border-status-danger' : ''}`}
            />
            {errors.deadline && <p className="text-xs text-status-danger mt-1">{errors.deadline}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/provider/scholarships"
              className="flex-1 btn-secondary py-2.5 text-sm text-center"
            >
              {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
            </Link>
            <button
              onClick={handleSubmit}
              className="flex-1 btn-primary py-2.5 text-sm"
            >
              {lang === 'th' ? 'บันทึก' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

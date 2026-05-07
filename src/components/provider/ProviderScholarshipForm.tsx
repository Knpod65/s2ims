'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, FileText, Save, Send } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { Scholarship } from '@/data/mock/providerData'
import ProviderPrivacyNotice from './ProviderPrivacyNotice'

type ProviderScholarshipFormProps = {
  mode: 'new' | 'edit'
  scholarship?: Scholarship
}

export default function ProviderScholarshipForm({ mode, scholarship }: ProviderScholarshipFormProps) {
  const { lang } = useLang()
  const [submitted, setSubmitted] = useState(false)
  const [savedDraft, setSavedDraft] = useState(false)
  const [formData, setFormData] = useState({
    title_th: scholarship?.title_th ?? '',
    title_en: scholarship?.title_en ?? '',
    provider_th: scholarship?.provider_th ?? 'บริษัท เจซีซี จำกัด',
    provider_en: scholarship?.provider ?? 'JCC Company Limited',
    description_th: scholarship?.description_th ?? '',
    description_en: scholarship?.description_en ?? '',
    amount: scholarship?.amount?.toString() ?? '',
    num_awards: scholarship?.num_awards?.toString() ?? '',
    deadline: scholarship?.deadline ?? '2026-08-31',
    gpa_min: scholarship?.gpa_min?.toString() ?? '3.00',
    academic_year: scholarship?.academic_year?.join(', ') ?? '2, 3, 4',
    requiredDocuments: scholarship?.requiredDocuments?.map(doc => doc.label_en).join(', ') ?? 'Transcript, Personal statement, Activity evidence',
  })

  const errors = useMemo(() => {
    const next: Record<string, string> = {}
    if (!formData.title_th.trim()) next.title_th = lang === 'th' ? 'กรุณาระบุชื่อทุนภาษาไทย' : 'Thai title is required'
    if (!formData.title_en.trim()) next.title_en = lang === 'th' ? 'กรุณาระบุชื่อทุนภาษาอังกฤษ' : 'English title is required'
    if (!formData.amount || Number(formData.amount) <= 0) next.amount = lang === 'th' ? 'จำนวนเงินต้องมากกว่า 0' : 'Amount must be greater than 0'
    if (!formData.num_awards || Number(formData.num_awards) <= 0) next.num_awards = lang === 'th' ? 'จำนวนทุนต้องมากกว่า 0' : 'Award count must be greater than 0'
    if (!formData.deadline) next.deadline = lang === 'th' ? 'กรุณาระบุวันปิดรับ' : 'Deadline is required'
    if (!formData.requiredDocuments.trim()) next.requiredDocuments = lang === 'th' ? 'ระบุเอกสารอย่างน้อยหนึ่งรายการ' : 'Add at least one document'
    return next
  }, [formData, lang])

  const isValid = Object.keys(errors).length === 0

  const update = (field: keyof typeof formData, value: string) => {
    setSavedDraft(false)
    setSubmitted(false)
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl space-y-4 py-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-role-tint text-role-primary">
          <CheckCircle2 size={26} />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-ink-1">
            {lang === 'th' ? 'ส่งให้เจ้าหน้าที่ตรวจสอบแล้ว' : 'Submitted for staff review'}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-2">
            {lang === 'th'
              ? 'นี่เป็นสถานะจำลอง เจ้าหน้าที่จะตรวจสอบรายละเอียดก่อนเปิดเผยทุนและชุมชนผู้สมัคร'
              : 'This is a mock state. Staff review happens before publication and candidate-pool access.'}
          </p>
        </div>
        <ProviderPrivacyNotice mode="review" />
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href="/provider/scholarships" className="btn-secondary min-h-11 justify-center text-sm">
            {lang === 'th' ? 'กลับพอร์ตโฟลิโอ' : 'Back to portfolio'}
          </Link>
          <button type="button" onClick={() => setSubmitted(false)} className="btn-primary min-h-11 justify-center text-sm">
            {lang === 'th' ? 'แก้ไขต่อ' : 'Continue editing'}
          </button>
        </div>
      </div>
    )
  }

  const fieldClass = (field: keyof typeof formData) => `input-base min-h-11 ${errors[field] ? 'border-[#F59E0B]' : ''}`

  return (
    <div className="mx-auto max-w-4xl space-y-5 pb-28 lg:pb-6">
      {savedDraft && (
        <div className="rounded-lg border border-role-border bg-role-tint px-4 py-3 text-sm font-medium text-role-primary">
          {lang === 'th' ? 'บันทึกร่างจำลองแล้ว' : 'Mock draft saved'}
        </div>
      )}

      <section className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <FileText size={17} className="text-role-primary" />
          <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'ข้อมูลทุนพื้นฐาน' : 'Basic scholarship information'}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'ชื่อทุน (ไทย)' : 'Scholarship name (Thai)'}</span>
            <input className={fieldClass('title_th')} value={formData.title_th} onChange={e => update('title_th', e.target.value)} />
            {errors.title_th && <span className="mt-1 block text-xs text-[#B45309]">{errors.title_th}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'ชื่อทุน (อังกฤษ)' : 'Scholarship name (English)'}</span>
            <input className={fieldClass('title_en')} value={formData.title_en} onChange={e => update('title_en', e.target.value)} />
            {errors.title_en && <span className="mt-1 block text-xs text-[#B45309]">{errors.title_en}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'องค์กรผู้ให้ทุน (ไทย)' : 'Provider organization (Thai)'}</span>
            <input className={fieldClass('provider_th')} value={formData.provider_th} onChange={e => update('provider_th', e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'องค์กรผู้ให้ทุน (อังกฤษ)' : 'Provider organization (English)'}</span>
            <input className={fieldClass('provider_en')} value={formData.provider_en} onChange={e => update('provider_en', e.target.value)} />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'รายละเอียด (ไทย)' : 'Description (Thai)'}</span>
            <textarea className={`${fieldClass('description_th')} min-h-[96px] resize-none`} value={formData.description_th} onChange={e => update('description_th', e.target.value)} />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'รายละเอียด (อังกฤษ)' : 'Description (English)'}</span>
            <textarea className={`${fieldClass('description_en')} min-h-[96px] resize-none`} value={formData.description_en} onChange={e => update('description_en', e.target.value)} />
          </label>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-4 font-semibold text-ink-1">{lang === 'th' ? 'จำนวนทุนและกำหนดเวลา' : 'Amount, awards, and deadline'}</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'จำนวนเงิน (บาท)' : 'Amount (THB)'}</span>
            <input type="number" className={fieldClass('amount')} value={formData.amount} onChange={e => update('amount', e.target.value)} min="0" />
            {errors.amount && <span className="mt-1 block text-xs text-[#B45309]">{errors.amount}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'จำนวนทุน' : 'Award count'}</span>
            <input type="number" className={fieldClass('num_awards')} value={formData.num_awards} onChange={e => update('num_awards', e.target.value)} min="1" />
            {errors.num_awards && <span className="mt-1 block text-xs text-[#B45309]">{errors.num_awards}</span>}
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'วันปิดรับสมัคร' : 'Deadline'}</span>
            <input type="date" className={fieldClass('deadline')} value={formData.deadline} onChange={e => update('deadline', e.target.value)} />
            {errors.deadline && <span className="mt-1 block text-xs text-[#B45309]">{errors.deadline}</span>}
          </label>
        </div>
      </section>

      <section className="card p-5">
        <h2 className="mb-4 font-semibold text-ink-1">{lang === 'th' ? 'เงื่อนไขและเอกสาร' : 'Eligibility and required documents'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'เกณฑ์ GPA ขั้นต่ำ' : 'Minimum GPA gate'}</span>
            <input type="number" className={fieldClass('gpa_min')} min="0" max="4" step="0.1" value={formData.gpa_min} onChange={e => update('gpa_min', e.target.value)} />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'ชั้นปีที่เข้าเกณฑ์' : 'Eligible academic years'}</span>
            <input className={fieldClass('academic_year')} value={formData.academic_year} onChange={e => update('academic_year', e.target.value)} />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1.5 block text-xs font-semibold text-ink-2">{lang === 'th' ? 'ตัวสร้างเอกสารที่ต้องใช้' : 'Required document builder'}</span>
            <textarea className={`${fieldClass('requiredDocuments')} min-h-[96px] resize-none`} value={formData.requiredDocuments} onChange={e => update('requiredDocuments', e.target.value)} />
            {errors.requiredDocuments && <span className="mt-1 block text-xs text-[#B45309]">{errors.requiredDocuments}</span>}
            <p className="mt-2 text-xs text-ink-3">
              {lang === 'th' ? 'แยกรายการด้วยเครื่องหมายจุลภาค ระบบนี้เป็นสถานะจำลอง ยังไม่มีการบันทึก backend' : 'Separate documents with commas. This is a mock state with no backend write.'}
            </p>
          </label>
        </div>
      </section>

      <ProviderPrivacyNotice mode="review" />

      <div className="sticky bottom-[calc(48px+env(safe-area-inset-bottom))] z-20 rounded-xl border border-white/60 bg-white/90 p-3 shadow-card backdrop-blur-xl md:static md:bg-transparent md:p-0 md:shadow-none md:backdrop-blur-none">
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={() => setSavedDraft(true)} className="btn-secondary min-h-11 flex-1 justify-center text-sm">
            <Save size={15} />
            {lang === 'th' ? 'บันทึกร่าง' : 'Save draft'}
          </button>
          <button type="button" onClick={() => setSubmitted(true)} disabled={!isValid} className="btn-primary min-h-11 flex-1 justify-center text-sm disabled:opacity-50">
            <Send size={15} />
            {mode === 'new'
              ? (lang === 'th' ? 'ส่งให้เจ้าหน้าที่ตรวจสอบ' : 'Submit for staff review')
              : (lang === 'th' ? 'ส่งการอัปเดตให้ตรวจสอบ' : 'Submit update for review')}
          </button>
        </div>
      </div>
    </div>
  )
}

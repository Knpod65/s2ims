'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { useToast } from '@/components/ui/Toast'
import { Send } from 'lucide-react'

export default function ProviderNewScholarshipPage() {
  const { lang } = useLang()
  const { addToast } = useToast()

  const [titleTh, setTitleTh] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [amount, setAmount] = useState('')
  const [numAwards, setNumAwards] = useState('')
  const [philosophyTh, setPhilosophyTh] = useState('')
  const [philosophyEn, setPhilosophyEn] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const isValid = titleTh.trim() && titleEn.trim() && amount && numAwards && philosophyTh.trim() && philosophyEn.trim()

  const handleSubmit = async () => {
    if (!isValid) {
      addToast(lang === 'th' ? 'กรุณากรอกข้อมูลให้ครบถ้วน' : 'Please fill in all required fields', 'error')
      return
    }
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    setSubmitting(false)
    setSubmitted(true)
    addToast(
      lang === 'th' ? 'ส่งโปรไฟล์ทุนให้เจ้าหน้าที่ตรวจสอบแล้ว' : 'Scholarship profile submitted for staff review',
      'success'
    )
  }

  if (submitted) {
    return (
      <AppShell requiredRole="provider">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="text-5xl mb-4">📋</div>
          <h2 className="font-display font-bold text-xl text-ink-1 mb-2">
            {lang === 'th' ? 'ส่งแล้ว รอการตรวจสอบ' : 'Submitted — Awaiting Review'}
          </h2>
          <p className="text-ink-3 text-sm mb-6">
            {lang === 'th'
              ? 'เจ้าหน้าที่จะตรวจสอบและแจ้งผลภายใน 3–5 วันทำการ'
              : 'Staff will review and respond within 3–5 business days.'}
          </p>
          <button
            onClick={() => { setSubmitted(false); setTitleTh(''); setTitleEn(''); setAmount(''); setNumAwards(''); setPhilosophyTh(''); setPhilosophyEn('') }}
            className="btn-secondary text-sm px-5 py-2"
          >
            {lang === 'th' ? 'สร้างทุนใหม่' : 'Create another'}
          </button>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        title={lang === 'th' ? 'สร้างโปรไฟล์ทุนใหม่' : 'Create Scholarship Profile'}
        subtitle={lang === 'th' ? 'กำหนดเกณฑ์และปรัชญาทุนการศึกษาของคุณ' : 'Define your scholarship criteria and philosophy'}
      />
      <div className="max-w-2xl space-y-4">
        {/* Basic info */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">
            {lang === 'th' ? 'ข้อมูลพื้นฐาน' : 'Basic Information'}
          </h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-ink-3 block mb-1">
                {lang === 'th' ? 'ชื่อทุน (ไทย)' : 'Scholarship name (Thai)'} <span className="text-status-danger">*</span>
              </label>
              <input className="input-base" placeholder="ทุน..." value={titleTh} onChange={e => setTitleTh(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-ink-3 block mb-1">
                {lang === 'th' ? 'ชื่อทุน (อังกฤษ)' : 'Scholarship name (English)'} <span className="text-status-danger">*</span>
              </label>
              <input className="input-base" placeholder="Scholarship..." value={titleEn} onChange={e => setTitleEn(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-ink-3 block mb-1">
                  {lang === 'th' ? 'จำนวนเงิน (บาท)' : 'Amount (THB)'} <span className="text-status-danger">*</span>
                </label>
                <input type="number" className="input-base" min="0" value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-ink-3 block mb-1">
                  {lang === 'th' ? 'จำนวนทุน' : 'Number of awards'} <span className="text-status-danger">*</span>
                </label>
                <input type="number" className="input-base" min="1" value={numAwards} onChange={e => setNumAwards(e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-1">
            {lang === 'th' ? 'ปรัชญาทุน (Soft Preferences)' : 'Scholarship Philosophy (Soft Preferences)'}
          </h3>
          <p className="text-xs text-ink-3 mb-4">
            {lang === 'th'
              ? 'ระบุสิ่งที่ทุนนี้มุ่งสนับสนุน ระบบจะใช้ข้อมูลนี้ในการจับคู่กับนักศึกษาที่เหมาะสม'
              : 'Describe what this scholarship aims to support. The system will use this for matching.'}
          </p>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-ink-3 block mb-1">
                {lang === 'th' ? 'ปรัชญา (ไทย)' : 'Philosophy (Thai)'} <span className="text-status-danger">*</span>
              </label>
              <textarea
                className="input-base h-20 resize-none"
                placeholder={lang === 'th' ? 'มุ่งสนับสนุน...' : 'Aims to support...'}
                value={philosophyTh}
                onChange={e => setPhilosophyTh(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs text-ink-3 block mb-1">
                {lang === 'th' ? 'ปรัชญา (อังกฤษ)' : 'Philosophy (English)'} <span className="text-status-danger">*</span>
              </label>
              <textarea
                className="input-base h-20 resize-none"
                placeholder="Aims to support..."
                value={philosophyEn}
                onChange={e => setPhilosophyEn(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {submitting ? (
            <span className="animate-pulse">{lang === 'th' ? 'กำลังส่ง...' : 'Submitting...'}</span>
          ) : (
            <><Send size={14} />{lang === 'th' ? 'ส่งให้เจ้าหน้าที่ตรวจสอบ' : 'Submit for Staff Review'}</>
          )}
        </button>
      </div>
    </AppShell>
  )
}

'use client'
import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'
import { mockScholarships } from '@/data/mock/scholarships'
import { mockUsers } from '@/data/mock/users'
import { formatAmount, formatAmountEn } from '@/lib/utils'
import { EmptyState } from '@/components/ui/index'
import { CheckCircle2, AlertCircle, ChevronRight, ChevronLeft, Trophy, FileText, MessageSquare, Send } from 'lucide-react'
import Link from 'next/link'

type Step = 'eligibility' | 'documents' | 'essay' | 'confirm' | 'submitted'

function ApplyForm() {
  const { lang } = useLang()
  const { user } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const scholarshipId = params.get('scholarship') ?? ''

  const scholarship = mockScholarships.find(s => s.id === scholarshipId)
  const student = mockUsers.find(u => u.id === user?.id)

  const [step, setStep] = useState<Step>('eligibility')
  const [essay, setEssay] = useState('')
  const [checkedDocs, setCheckedDocs] = useState<Set<string>>(new Set())
  const [submitting, setSubmitting] = useState(false)

  if (!scholarship) {
    return (
      <AppShell requiredRole="student">
        <EmptyState
          icon={<FileText size={32} />}
          title={lang === 'th' ? 'ไม่พบทุนที่ระบุ' : 'Scholarship not found'}
          action={<Link href="/scholarships" className="btn-secondary text-xs py-2 px-4">{lang === 'th' ? '← ดูทุนทั้งหมด' : '← View all scholarships'}</Link>}
        />
      </AppShell>
    )
  }

  if (scholarship.status !== 'OPEN') {
    return (
      <AppShell requiredRole="student">
        <EmptyState
          icon={<AlertCircle size={32} />}
          title={lang === 'th' ? 'ทุนนี้ปิดรับสมัครแล้ว' : 'This scholarship is not open for applications'}
          action={<Link href="/scholarships" className="btn-secondary text-xs py-2 px-4">{lang === 'th' ? '← ดูทุนที่เปิดรับ' : '← View open scholarships'}</Link>}
        />
      </AppShell>
    )
  }

  const studentGpa = 3.25
  const studentYear = student?.academic_year ?? 3
  const gpaOk = studentGpa >= scholarship.gpa_min
  const yearOk = !scholarship.academic_year || scholarship.academic_year.includes(studentYear)
  const eligible = gpaOk && yearOk

  const title = lang === 'th' ? scholarship.title_th : scholarship.title_en
  const amount = lang === 'th' ? formatAmount(scholarship.amount) : formatAmountEn(scholarship.amount)

  const requiredDocs = [
    { id: 'transcript', label_th: 'ใบแสดงผลการเรียน (Transcript)', label_en: 'Academic Transcript' },
    { id: 'id_card', label_th: 'สำเนาบัตรประชาชน', label_en: 'National ID copy' },
    { id: 'enrollment', label_th: 'หนังสือรับรองการเป็นนักศึกษา', label_en: 'Student enrollment certificate' },
    ...(scholarship.has_essay ? [{ id: 'essay', label_th: 'เรียงความ (ผ่านระบบ)', label_en: 'Essay (via system)' }] : []),
    ...(scholarship.has_proposal ? [{ id: 'proposal', label_th: 'ข้อเสนอโครงการ', label_en: 'Project proposal' }] : []),
  ]

  const allDocsChecked = requiredDocs.every(d => checkedDocs.has(d.id))

  const handleSubmit = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 1000))
    setSubmitting(false)
    setStep('submitted')
  }

  const STEPS: { id: Step; label_th: string; label_en: string }[] = [
    { id: 'eligibility', label_th: 'ตรวจสอบคุณสมบัติ', label_en: 'Eligibility' },
    { id: 'documents',   label_th: 'เอกสาร',           label_en: 'Documents' },
    ...(scholarship.has_essay ? [{ id: 'essay' as Step, label_th: 'เรียงความ', label_en: 'Essay' }] : []),
    { id: 'confirm',     label_th: 'ยืนยัน',            label_en: 'Confirm' },
  ]

  const stepIndex = STEPS.findIndex(s => s.id === step)

  if (step === 'submitted') {
    return (
      <AppShell requiredRole="student">
        <div className="max-w-lg mx-auto text-center py-12">
          <div className="w-20 h-20 rounded-full bg-status-success/10 border-2 border-status-success/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-status-success" />
          </div>
          <h2 className="font-display font-bold text-2xl text-ink-1 mb-2">
            {lang === 'th' ? 'ส่งใบสมัครแล้ว!' : 'Application Submitted!'}
          </h2>
          <p className="text-ink-2 text-sm mb-2">{title}</p>
          <p className="text-ink-3 text-xs mb-8">
            {lang === 'th'
              ? 'ระบบจะแจ้งเตือนเมื่อมีความคืบหน้า ติดตามสถานะได้ที่ใบสมัครของฉัน'
              : 'You will be notified when there are updates. Track status in My Applications.'}
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/student/applications" className="btn-primary px-5 py-2.5 text-sm">
              {lang === 'th' ? 'ดูใบสมัครของฉัน' : 'View My Applications'}
            </Link>
            <Link href="/scholarships" className="btn-secondary px-5 py-2.5 text-sm">
              {lang === 'th' ? 'ดูทุนอื่นๆ' : 'Browse more'}
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="student">
      {/* Scholarship header */}
      <div className="card p-4 mb-6 flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
          <Trophy size={18} className="text-brand" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-ink-1 truncate">{title}</div>
          <div className="text-xs text-ink-3">{amount} · {scholarship.num_awards} {lang === 'th' ? 'ทุน' : 'awards'}</div>
        </div>
        <Link href={`/scholarships/${scholarship.id}`} className="text-xs text-brand hover:text-brand-light">
          {lang === 'th' ? 'ดูรายละเอียด' : 'View details'} →
        </Link>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-shrink-0">
            <div className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
              i < stepIndex
                ? 'bg-status-success/10 border-status-success/30 text-status-success'
                : i === stepIndex
                ? 'bg-brand/10 border-brand/30 text-brand'
                : 'border-white/[0.08] text-ink-3'
            }`}>
              {i < stepIndex ? <CheckCircle2 size={11} /> : <span>{i + 1}</span>}
              {lang === 'th' ? s.label_th : s.label_en}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-ink-3 flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* ── Step: Eligibility ── */}
      {step === 'eligibility' && (
        <div className="max-w-lg">
          <h2 className="font-display font-semibold text-lg text-ink-1 mb-4">
            {lang === 'th' ? 'ตรวจสอบคุณสมบัติ' : 'Eligibility Check'}
          </h2>
          <div className="space-y-3 mb-6">
            <div className={`card p-4 flex items-center gap-3 ${gpaOk ? 'border-status-success/20' : 'border-status-danger/30'}`}>
              {gpaOk
                ? <CheckCircle2 size={18} className="text-status-success flex-shrink-0" />
                : <AlertCircle  size={18} className="text-status-danger flex-shrink-0" />}
              <div>
                <div className="text-sm font-medium text-ink-1">
                  GPA {lang === 'th' ? 'ขั้นต่ำ' : 'Minimum'}: {scholarship.gpa_min}
                </div>
                <div className={`text-xs ${gpaOk ? 'text-status-success' : 'text-status-danger'}`}>
                  {lang === 'th' ? 'GPA ของคุณ' : 'Your GPA'}: {studentGpa}
                  {gpaOk
                    ? (lang === 'th' ? ' ✓ ผ่านเกณฑ์' : ' ✓ Meets requirement')
                    : (lang === 'th' ? ' ✗ ต่ำกว่าเกณฑ์' : ' ✗ Below requirement')}
                </div>
              </div>
            </div>
            <div className={`card p-4 flex items-center gap-3 ${yearOk ? 'border-status-success/20' : 'border-status-danger/30'}`}>
              {yearOk
                ? <CheckCircle2 size={18} className="text-status-success flex-shrink-0" />
                : <AlertCircle  size={18} className="text-status-danger flex-shrink-0" />}
              <div>
                <div className="text-sm font-medium text-ink-1">
                  {lang === 'th' ? 'ชั้นปีที่เปิดรับ' : 'Eligible years'}:{' '}
                  {scholarship.academic_year?.join(', ') ?? (lang === 'th' ? 'ทุกชั้นปี' : 'All years')}
                </div>
                <div className={`text-xs ${yearOk ? 'text-status-success' : 'text-status-danger'}`}>
                  {lang === 'th' ? 'ชั้นปีของคุณ' : 'Your year'}: {studentYear}
                  {yearOk
                    ? (lang === 'th' ? ' ✓ ผ่านเกณฑ์' : ' ✓ Meets requirement')
                    : (lang === 'th' ? ' ✗ ไม่ตรงเกณฑ์' : ' ✗ Does not qualify')}
                </div>
              </div>
            </div>
          </div>
          {!eligible && (
            <div className="p-3 rounded-lg bg-status-danger/[0.06] border border-status-danger/20 text-xs text-status-danger mb-6">
              {lang === 'th'
                ? 'คุณไม่ตรงคุณสมบัติสำหรับทุนนี้ แต่คุณยังสามารถส่งใบสมัครได้ (อยู่ในดุลยพินิจของเจ้าหน้าที่)'
                : 'You do not fully meet the requirements, but you may still apply (subject to staff review).'}
            </div>
          )}
          <button
            onClick={() => setStep('documents')}
            className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2"
          >
            {lang === 'th' ? 'ถัดไป' : 'Next'} <ChevronRight size={15} />
          </button>
        </div>
      )}

      {/* ── Step: Documents ── */}
      {step === 'documents' && (
        <div className="max-w-lg">
          <h2 className="font-display font-semibold text-lg text-ink-1 mb-2">
            {lang === 'th' ? 'เอกสารที่ต้องใช้' : 'Required Documents'}
          </h2>
          <p className="text-xs text-ink-3 mb-5">
            {lang === 'th'
              ? 'ยืนยันว่าคุณมีเอกสารครบถ้วนก่อนส่งใบสมัคร'
              : 'Confirm you have all required documents before submitting.'}
          </p>
          <div className="space-y-2 mb-6">
            {requiredDocs.map(doc => (
              <label key={doc.id} className={`flex items-center gap-3 card p-3 cursor-pointer hover:border-white/[0.15] transition-all ${checkedDocs.has(doc.id) ? 'border-status-success/20 bg-status-success/[0.03]' : ''}`}>
                <input
                  type="checkbox"
                  className="accent-brand"
                  checked={checkedDocs.has(doc.id)}
                  onChange={e => {
                    const next = new Set(checkedDocs)
                    if (e.target.checked) next.add(doc.id)
                    else next.delete(doc.id)
                    setCheckedDocs(next)
                  }}
                />
                <span className="text-sm text-ink-1">{lang === 'th' ? doc.label_th : doc.label_en}</span>
                {checkedDocs.has(doc.id) && <CheckCircle2 size={14} className="ml-auto text-status-success" />}
              </label>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('eligibility')} className="btn-ghost text-sm px-4 flex items-center gap-1">
              <ChevronLeft size={15} />{lang === 'th' ? 'ย้อนกลับ' : 'Back'}
            </button>
            <button
              onClick={() => setStep(scholarship.has_essay ? 'essay' : 'confirm')}
              disabled={!allDocsChecked}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {lang === 'th' ? 'ถัดไป' : 'Next'} <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Essay ── */}
      {step === 'essay' && scholarship.has_essay && (
        <div className="max-w-lg">
          <h2 className="font-display font-semibold text-lg text-ink-1 mb-2 flex items-center gap-2">
            <MessageSquare size={18} className="text-brand" />
            {lang === 'th' ? 'เรียงความ' : 'Essay'}
          </h2>
          <p className="text-xs text-ink-3 mb-5">
            {lang === 'th'
              ? 'อธิบายว่าทำไมคุณจึงสมควรได้รับทุนนี้ และคุณจะนำทุนนี้ไปใช้ประโยชน์อย่างไร (ขั้นต่ำ 200 ตัวอักษร)'
              : 'Explain why you deserve this scholarship and how you will use it. (Minimum 200 characters)'}
          </p>
          <textarea
            className="input-base w-full min-h-[200px] resize-y text-sm leading-relaxed mb-4"
            placeholder={lang === 'th' ? 'เขียนเรียงความที่นี่...' : 'Write your essay here...'}
            value={essay}
            onChange={e => setEssay(e.target.value)}
          />
          <div className={`text-xs mb-4 ${essay.length >= 200 ? 'text-status-success' : 'text-ink-3'}`}>
            {essay.length} {lang === 'th' ? 'ตัวอักษร' : 'characters'}
            {essay.length < 200 && ` (${lang === 'th' ? 'ขั้นต่ำ' : 'minimum'} 200)`}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep('documents')} className="btn-ghost text-sm px-4 flex items-center gap-1">
              <ChevronLeft size={15} />{lang === 'th' ? 'ย้อนกลับ' : 'Back'}
            </button>
            <button
              onClick={() => setStep('confirm')}
              disabled={essay.length < 200}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-50"
            >
              {lang === 'th' ? 'ถัดไป' : 'Next'} <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* ── Step: Confirm ── */}
      {step === 'confirm' && (
        <div className="max-w-lg">
          <h2 className="font-display font-semibold text-lg text-ink-1 mb-5">
            {lang === 'th' ? 'ยืนยันการส่งใบสมัคร' : 'Confirm Submission'}
          </h2>
          <div className="card p-5 space-y-3 mb-6 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ทุน' : 'Scholarship'}</span>
              <span className="text-ink-1 text-right max-w-[60%]">{title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'จำนวนเงิน' : 'Amount'}</span>
              <span className="text-brand font-semibold">{amount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'เอกสาร' : 'Documents'}</span>
              <span className="text-status-success">{checkedDocs.size} {lang === 'th' ? 'รายการ ✓' : 'items ✓'}</span>
            </div>
            {scholarship.has_essay && (
              <div className="flex justify-between">
                <span className="text-ink-3">{lang === 'th' ? 'เรียงความ' : 'Essay'}</span>
                <span className="text-status-success">{essay.length} {lang === 'th' ? 'ตัวอักษร ✓' : 'chars ✓'}</span>
              </div>
            )}
          </div>
          <p className="text-xs text-ink-3 mb-6">
            {lang === 'th'
              ? 'ข้าพเจ้าขอรับรองว่าข้อมูลทั้งหมดที่ระบุเป็นความจริง และยินยอมให้คณะตรวจสอบเอกสารดังกล่าว'
              : 'I certify that all information provided is accurate and consent to verification by the faculty.'}
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setStep(scholarship.has_essay ? 'essay' : 'documents')}
              className="btn-ghost text-sm px-4 flex items-center gap-1"
            >
              <ChevronLeft size={15} />{lang === 'th' ? 'ย้อนกลับ' : 'Back'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary px-6 py-2.5 text-sm flex items-center gap-2 disabled:opacity-60"
            >
              {submitting ? (
                <span className="animate-pulse">{lang === 'th' ? 'กำลังส่ง...' : 'Submitting...'}</span>
              ) : (
                <><Send size={14} />{lang === 'th' ? 'ส่งใบสมัคร' : 'Submit Application'}</>
              )}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  )
}

export default function NewApplicationPage() {
  return (
    <Suspense>
      <ApplyForm />
    </Suspense>
  )
}

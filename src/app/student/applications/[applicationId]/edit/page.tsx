'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Save } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { EmptyState, PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import { useToast } from '@/components/ui/Toast'
import {
  getScholarshipById,
  getStudentApplicationById,
} from '@/data/mock/studentApplicationData'
import { studentDataFreshness } from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  StudentPrivacyNotice,
  SubmitConfirmationModal,
} from '@/components/student'

export default function StudentApplicationEditPage({
  params,
}: {
  params: { applicationId: string }
}) {
  const { lang } = useLang()
  const { addToast } = useToast()
  const application = getStudentApplicationById(params.applicationId)
  const scholarship = application ? getScholarshipById(application.scholarshipId) : undefined
  const [showConfirm, setShowConfirm] = useState(false)
  const [touched, setTouched] = useState(false)

  if (!application || !scholarship) {
    return (
      <AppShell requiredRole="student">
        <EmptyState
          title={lang === 'th' ? 'ไม่พบใบสมัคร' : 'Application not found'}
          action={<Link href="/student/applications" className="btn-primary min-h-11 px-4 py-2 text-sm">{lang === 'th' ? 'กลับรายการ' : 'Back to tracker'}</Link>}
        />
      </AppShell>
    )
  }

  const title = lang === 'th' ? scholarship.title_th : scholarship.title_en
  const requiredEmpty = application.draftSections.filter(section => section.required && !section.value[lang]).length

  const handleSave = () => {
    setTouched(true)
    addToast(lang === 'th' ? 'บันทึกร่างแบบจำลองแล้ว' : 'Mock draft saved', 'success')
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    addToast(lang === 'th' ? 'จำลองการส่งใบสมัครแล้ว' : 'Mock application submitted', 'success')
  }

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'แก้ไขใบสมัคร' : 'Edit application'}
        subtitle={title}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="mx-auto max-w-4xl space-y-6">
        {requiredEmpty > 0 && touched && (
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-sm leading-relaxed text-[#78350F]">
            {lang === 'th'
              ? 'ยังมีช่องสำคัญที่ช่วยให้ใบสมัครพร้อมขึ้น เติมเมื่อคุณพร้อมก่อนส่งจริง'
              : 'Some important fields can make this application more ready. Add them when ready before final submission.'}
          </div>
        )}

        <section className="card p-5">
          <h2 className="font-display text-lg font-bold text-ink-1">
            {lang === 'th' ? 'ข้อมูลใบสมัคร' : 'Application sections'}
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">
            {lang === 'th'
              ? 'หน้านี้เป็นฟอร์มจำลอง คุณสามารถแก้ไขข้อความเพื่อดูสถานะและรูปแบบได้'
              : 'This is a mock form. You can edit text to review states and layout.'}
          </p>

          <div className="mt-5 space-y-5">
            {application.draftSections.map(section => (
              <label key={section.id} className="block">
                <div className="mb-1 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-ink-1">{section.label[lang]}</span>
                  {section.required && (
                    <span className="rounded-full border border-line bg-surface-low px-2 py-0.5 text-[10px] font-semibold text-ink-3">
                      {lang === 'th' ? 'สำคัญ' : 'Important'}
                    </span>
                  )}
                </div>
                <p className="mb-2 text-xs leading-relaxed text-ink-3">{section.helper[lang]}</p>
                <textarea
                  className={`input-base min-h-[132px] resize-y ${touched && section.required && !section.value[lang] ? 'border-[#FDE68A] bg-[#FFFBEB]' : ''}`}
                  defaultValue={section.value[lang]}
                  onChange={() => setTouched(true)}
                  placeholder={lang === 'th' ? 'เขียนเท่าที่คุณสะดวก...' : 'Write what feels relevant...'}
                />
              </label>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="font-display text-lg font-bold text-ink-1">
            {lang === 'th' ? 'คำแถลงส่วนตัวเพิ่มเติม' : 'Additional personal statement'}
          </h2>
          <textarea
            className="input-base mt-3 min-h-[150px] resize-y"
            placeholder={lang === 'th' ? 'เพิ่มสิ่งที่อยากให้คณะกรรมการเข้าใจเกี่ยวกับคุณ...' : 'Add anything you want reviewers to understand about you...'}
            onChange={() => setTouched(true)}
          />
        </section>

        <StudentPrivacyNotice />

        <div className="sticky bottom-[calc(48px+env(safe-area-inset-bottom))] z-20 rounded-2xl border border-line bg-white/90 p-3 shadow-floating backdrop-blur-xl md:bottom-4">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/student/applications/${application.id}`} className="btn-secondary inline-flex min-h-11 items-center justify-center gap-2 px-4 py-3 text-sm">
              <ArrowLeft size={14} />
              {lang === 'th' ? 'กลับรายละเอียด' : 'Back to detail'}
            </Link>
            <button type="button" onClick={handleSave} className="btn-secondary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
              <Save size={14} />
              {lang === 'th' ? 'บันทึกร่าง' : 'Save draft'}
            </button>
            <button type="button" onClick={() => setShowConfirm(true)} className="btn-primary inline-flex min-h-11 flex-1 items-center justify-center gap-2 px-4 py-3 text-sm">
              <CheckCircle2 size={14} />
              {lang === 'th' ? 'ตรวจสอบก่อนส่ง' : 'Review submit'}
            </button>
          </div>
        </div>
      </div>

      <SubmitConfirmationModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        readinessPct={application.readinessPct}
      />
    </AppShell>
  )
}

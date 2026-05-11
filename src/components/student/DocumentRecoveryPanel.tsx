'use client'
import { CheckCircle2, Clock3, RefreshCw } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { StudentDocumentItem } from '@/data/mock/studentApplicationData'
import {
  isStudentDocumentStatusRecoverable,
  requiresStudentDocumentAttention,
} from '@/config/documentStatusDisplay'
import DocumentUploadCard from './DocumentUploadCard'

type DocumentRecoveryPanelProps = {
  documents: StudentDocumentItem[]
  className?: string
}

const PENDING_REVIEW_STATES = new Set(['uploading', 'uploaded', 'verification_pending'])

export default function DocumentRecoveryPanel({ documents, className = '' }: DocumentRecoveryPanelProps) {
  const { lang } = useLang()
  const needsAction = documents.filter(document => requiresStudentDocumentAttention(document.state))
  const pendingReview = documents.filter(document => PENDING_REVIEW_STATES.has(document.state))
  const ready = documents.filter(document => document.state === 'verified')
  const recoverableCount = documents.filter(document => isStudentDocumentStatusRecoverable(document.state)).length

  const sections = [
    {
      id: 'needs-action',
      icon: RefreshCw,
      documents: needsAction,
      title: lang === 'th' ? 'เติมหรือแทนที่ได้ตอนนี้' : 'Ready to add or replace',
      description: lang === 'th'
        ? 'รายการเหล่านี้ช่วยให้ใบสมัครพร้อมขึ้นเมื่อคุณมีไฟล์แล้ว'
        : 'These items can make the application stronger when you have the files ready.',
    },
    {
      id: 'pending-review',
      icon: Clock3,
      documents: pendingReview,
      title: lang === 'th' ? 'ส่งแล้วหรือรอตรวจสอบ' : 'Uploaded or pending review',
      description: lang === 'th'
        ? 'ไฟล์เหล่านี้อยู่ในสถานะอัปโหลดแล้วหรือรอเจ้าหน้าที่ตรวจสอบ'
        : 'These files have been uploaded or are waiting for staff verification.',
    },
    {
      id: 'ready',
      icon: CheckCircle2,
      documents: ready,
      title: lang === 'th' ? 'พร้อมใช้กับใบสมัคร' : 'Ready for this application',
      description: lang === 'th'
        ? 'เอกสารเหล่านี้พร้อมใช้กับขั้นตอนถัดไป'
        : 'These documents are ready for the next step.',
    },
  ]

  return (
    <section className={`space-y-5 ${className}`}>
      <div className="rounded-[1.5rem] border border-line bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.12em] text-role-primary">
              {lang === 'th' ? 'การกู้คืนเอกสาร' : 'Document recovery'}
            </div>
            <h2 className="mt-1 font-display text-xl font-bold text-ink-1">
              {lang === 'th' ? 'จัดเอกสารตามสิ่งที่ทำต่อได้' : 'Organized by what you can do next'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              {lang === 'th'
                ? 'สถานะและปุ่มอัปโหลดด้านล่างยังใช้ตรรกะเดิมทั้งหมด'
                : 'The status labels and upload controls below use the same behavior as before.'}
            </p>
          </div>
          <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-line bg-surface-low text-center">
            <div className="px-3 py-2">
              <div className="font-display text-lg font-bold text-[#78350F]">{needsAction.length}</div>
              <div className="text-[10px] font-semibold text-ink-3">{lang === 'th' ? 'เติมได้' : 'Action'}</div>
            </div>
            <div className="border-x border-line px-3 py-2">
              <div className="font-display text-lg font-bold text-role-primary">{pendingReview.length}</div>
              <div className="text-[10px] font-semibold text-ink-3">{lang === 'th' ? 'รอตรวจ' : 'Review'}</div>
            </div>
            <div className="px-3 py-2">
              <div className="font-display text-lg font-bold text-emerald-700">{ready.length}</div>
              <div className="text-[10px] font-semibold text-ink-3">{lang === 'th' ? 'พร้อม' : 'Ready'}</div>
            </div>
          </div>
        </div>

        {needsAction.length === 0 && recoverableCount === 0 && (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-700">
            <CheckCircle2 size={16} className="mr-2 inline" />
            {lang === 'th' ? 'เอกสารหลักพร้อมสำหรับใบสมัครนี้' : 'Key documents are ready for this application.'}
          </div>
        )}
      </div>

      {sections.map(section => {
        const Icon = section.icon
        if (section.documents.length === 0) return null
        return (
          <div key={section.id} className="rounded-[1.5rem] border border-line bg-surface-low p-4">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-xl bg-white p-2 text-role-primary shadow-soft">
                <Icon size={18} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-ink-1">{section.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">{section.description}</p>
              </div>
            </div>
            <div className="grid gap-4">
              {section.documents.map(document => (
                <DocumentUploadCard key={document.id} document={document} />
              ))}
            </div>
          </div>
        )
      })}
    </section>
  )
}

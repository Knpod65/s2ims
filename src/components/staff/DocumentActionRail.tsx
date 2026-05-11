'use client'

import { useLang } from '@/lib/i18n'
import { CheckCircle2, RotateCcw, AlertCircle, Clock, FileQuestion } from 'lucide-react'
import type { DocumentVerificationState } from '@/data/mock/staffData'

type Props = {
  documents: DocumentVerificationState[]
}

type Status = DocumentVerificationState['status']

function statusIcon(status: Status) {
  switch (status) {
    case 'verified':
      return <CheckCircle2 size={13} className="text-status-success" />
    case 'pending':
    case 'uploaded':
      return <Clock size={13} className="text-role-primary" />
    case 'rejected':
    case 'missing':
    case 'invalid_file_type':
      return <AlertCircle size={13} className="text-status-danger" />
    case 'needs_replacement':
      return <RotateCcw size={13} className="text-status-warning" />
    default:
      return <FileQuestion size={13} className="text-ink-3" />
  }
}

function actionGuidance(status: Status, lang: string): string {
  const map: Record<Status, { en: string; th: string }> = {
    verified:          { en: 'Verified — no further action needed',              th: 'ยืนยันแล้ว — ไม่ต้องดำเนินการเพิ่ม' },
    pending:           { en: 'Expand below to verify, reject, or request replacement', th: 'ขยายด้านล่างเพื่อยืนยัน ปฏิเสธ หรือขอส่งแทน' },
    uploaded:          { en: 'Expand below to review and verify',                th: 'ขยายด้านล่างเพื่อตรวจสอบและยืนยัน' },
    rejected:          { en: 'Rejected — awaiting student re-upload',            th: 'ปฏิเสธแล้ว — รอนักศึกษาอัปโหลดใหม่' },
    needs_replacement: { en: 'Replacement requested — awaiting student',         th: 'ขอส่งแทนแล้ว — รอนักศึกษา' },
    missing:           { en: 'Not yet submitted — no staff action available',    th: 'ยังไม่ได้ส่ง — ไม่มีการดำเนินการสำหรับเจ้าหน้าที่' },
    invalid_file_type: { en: 'System validation state — not a staff-initiated action', th: 'สถานะตรวจสอบของระบบ — ไม่ใช่การดำเนินการของเจ้าหน้าที่' },
  }
  return map[status]?.[lang === 'th' ? 'th' : 'en'] ?? status
}

export default function DocumentActionRail({ documents }: Props) {
  const { lang } = useLang()

  const needsAttention = documents.filter(d =>
    ['rejected', 'needs_replacement', 'missing', 'invalid_file_type'].includes(d.status)
  )
  const awaitingReview = documents.filter(d =>
    ['pending', 'uploaded'].includes(d.status)
  )
  const verifiedCount = documents.filter(d => d.status === 'verified').length

  const workList = [...needsAttention, ...awaitingReview]
  const allClear = workList.length === 0

  return (
    <div className="rounded-xl border border-line bg-surface-low/60 p-3.5 space-y-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold text-ink-1">
            {lang === 'th' ? 'สถานะการดำเนินการเอกสาร' : 'Document action status'}
          </div>
          <div className="text-[10px] text-ink-3 mt-0.5">
            {lang === 'th'
              ? 'ขยายแต่ละรายการในแผงด้านล่างเพื่อดำเนินการ'
              : 'Expand each item in the panel below to take action'}
          </div>
        </div>

        {/* Quick count chips */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
          {verifiedCount > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-status-success bg-status-success/10 rounded-full px-1.5 py-0.5">
              <CheckCircle2 size={9} />
              {verifiedCount}
            </span>
          )}
          {awaitingReview.length > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-role-primary bg-role-tint rounded-full px-1.5 py-0.5">
              <Clock size={9} />
              {awaitingReview.length}
            </span>
          )}
          {needsAttention.length > 0 && (
            <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-status-danger bg-status-danger/10 rounded-full px-1.5 py-0.5">
              <AlertCircle size={9} />
              {needsAttention.length}
            </span>
          )}
        </div>
      </div>

      {/* Per-document guidance list */}
      {allClear ? (
        <div className="flex items-center gap-1.5 text-[11px] text-status-success">
          <CheckCircle2 size={13} />
          {lang === 'th' ? 'เอกสารทั้งหมดยืนยันแล้ว' : 'All documents verified'}
        </div>
      ) : (
        <div className="space-y-1.5">
          {workList.map((doc) => (
            <div
              key={doc.id}
              className="flex items-start gap-2 p-2 rounded-lg bg-white border border-line"
            >
              <div className="mt-0.5 shrink-0">{statusIcon(doc.status)}</div>
              <div className="flex-1 min-w-0">
                <div className="text-[11px] font-medium text-ink-1 truncate">
                  {lang === 'th' ? doc.label_th : doc.label_en}
                  {doc.required && (
                    <span className="ml-1.5 text-[9px] font-semibold text-status-danger">
                      {lang === 'th' ? 'บังคับ' : 'Required'}
                    </span>
                  )}
                </div>
                <div className="text-[10px] text-ink-3 mt-0.5 leading-relaxed">
                  {actionGuidance(doc.status, lang)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

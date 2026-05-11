'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockApplications } from '@/data/mock/applications'
import { mockDocumentStates, mockStaffNotes, mockAuditEvents } from '@/data/mock/staffData'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { APP_STATUS_MAP } from '@/lib/utils'
import { formatStudentToken } from '@/config/tokenFormats'
import ApplicationTimeline from '@/components/ApplicationTimeline'
import MaskedStudentProfileCard from '@/components/staff/MaskedStudentProfileCard'
import DocumentVerificationPanel from '@/components/staff/DocumentVerificationPanel'
import AuditWarningCard from '@/components/staff/AuditWarningCard'
import { useToast } from '@/components/ui/Toast'
import { CheckCircle2, AlertCircle, Eye, MessageSquare } from 'lucide-react'
import type { ApplicationStatus } from '@/lib/types'

export default function StaffApplicationDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { lang } = useLang()
  const { addToast } = useToast()
  const app = mockApplications.find(a => a.id === id)
  const [currentStatus, setCurrentStatus] = useState<ApplicationStatus>(app?.status ?? 'SUBMITTED')
  const [revealModal, setRevealModal] = useState(false)
  const [revealReason, setRevealReason] = useState('')
  const [staffNote, setStaffNote] = useState('')

  if (!app) return <AppShell requiredRole="staff"><div className="text-ink-3">Not found</div></AppShell>

  const si = APP_STATUS_MAP[currentStatus]
  const appDocs = mockDocumentStates[id] || []
  const appNotes = mockStaffNotes[id] || []
  const appAuditEvents = mockAuditEvents.filter((e) => e.applicationId === id)
  const studentToken = formatStudentToken(app.student_id)

  const handleStatusChange = (s: ApplicationStatus) => {
    setCurrentStatus(s)
    addToast(
      lang === 'th'
        ? `เปลี่ยนสถานะเป็น "${APP_STATUS_MAP[s].th}" แล้ว`
        : `Status updated to "${APP_STATUS_MAP[s].en}"`,
      'success'
    )
  }

  const handleRevealIdentity = () => {
    setRevealModal(true)
  }

  const handleConfirmReveal = () => {
    if (revealReason.trim()) {
      // Mock: log the reveal action
      addToast(
        lang === 'th'
          ? 'ตัวตนของนักศึกษาถูกเปิดเผยแล้ว'
          : 'Student identity revealed',
        'success'
      )
      setRevealModal(false)
      setRevealReason('')
    }
  }

  const handleAddStaffNote = () => {
    if (staffNote.trim()) {
      addToast(
        lang === 'th' ? 'เพิ่มหมายเหตุแล้ว' : 'Staff note added',
        'success'
      )
      setStaffNote('')
    }
  }

  return (
    <AppShell requiredRole="staff">
      <PageHeader
        title={lang==='th'?`ใบสมัคร — ${app.student_id}`:`Application — ${app.student_id}`}
        subtitle={lang==='th'?app.scholarship_title_th:app.scholarship_title_en}
        badge={<StatusBadge label={si[lang === 'th' ? 'th' : 'en']} color={si.color}/>}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">
          {/* Masked Student Profile */}
          <MaskedStudentProfileCard
            profile={{
              token: studentToken,
              gpaRange: { min: 3.6, max: 3.8 },
              financialNeedPercentile: 75,
              academicYear: 4,
              department: 'Computer Science',
            }}
            onRevealIdentity={handleRevealIdentity}
          />

          {/* Document Verification Panel */}
          <DocumentVerificationPanel
            documents={appDocs}
            onVerify={(docId) => {
              addToast(
                lang === 'th' ? 'เอกสารยืนยันแล้ว' : 'Document verified',
                'success'
              )
            }}
            onReject={(docId, reason) => {
              addToast(
                lang === 'th'
                  ? `เอกสารปฏิเสธแล้ว: ${reason}`
                  : `Document rejected: ${reason}`,
                'info'
              )
            }}
            onRequestReplacement={(docId, message) => {
              addToast(
                lang === 'th'
                  ? `ขอส่งแทน: ${message}`
                  : `Replacement requested: ${message}`,
                'info'
              )
            }}
          />

          {/* Staff Notes */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4 flex items-center gap-2">
              <MessageSquare size={14} />
              {lang === 'th' ? 'หมายเหตุของเจ้าหน้าที่' : 'Staff Notes'}
            </h3>

            {/* Existing Notes */}
            {appNotes.length > 0 && (
              <div className="space-y-2 mb-4 pb-4 border-b border-line">
                {appNotes.map((note) => (
                  <div key={note.id} className="p-3 rounded bg-bg-200">
                    <p className="text-xs text-ink-1 mb-1">{note.content}</p>
                    <p className="text-xs text-ink-3">
                      {note.createdBy} •{' '}
                      {new Date(note.createdAt).toLocaleDateString(
                        lang === 'th' ? 'th-TH' : 'en-US'
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Note */}
            <textarea
              placeholder={lang === 'th' ? 'เพิ่มหมายเหตุ...' : 'Add a note...'}
              value={staffNote}
              onChange={(e) => setStaffNote(e.target.value)}
              className="input-base w-full text-xs py-2 mb-2"
              rows={2}
            />
            <button
              onClick={handleAddStaffNote}
              disabled={!staffNote.trim()}
              className="w-full text-xs py-1.5 px-3 bg-role-tint text-role-primary rounded hover:bg-role-tint transition-colors disabled:opacity-50"
            >
              {lang === 'th' ? 'เพิ่มหมายเหตุ' : 'Add Note'}
            </button>
          </div>

          {/* Status Update */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'เปลี่ยนสถานะ':'Update Status'}</h3>
            <div className="flex gap-2 flex-wrap">
              {(['UNDER_REVIEW','SHORTLISTED','NEEDS_DOCS','INTERVIEW_SCHEDULED','AWARDED','NOT_AWARDED'] as ApplicationStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${currentStatus===s?'border-role-border bg-role-tint text-role-primary':'border-line text-ink-3 hover:border-line-strong hover:text-ink-2'}`}
                >
                  {APP_STATUS_MAP[s][lang==='th'?'th':'en']}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Timeline & Score */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'ขั้นตอน':'Timeline'}</h3>
            <ApplicationTimeline steps={app.steps}/>
            <div className="mt-4 pt-4 border-t border-line">
              <div className="text-xs text-ink-3 mb-1">{lang==='th'?'คะแนนจับคู่':'Match Score'}</div>
              <div className="text-2xl font-display font-bold text-role-primary">{app.match_score}%</div>
            </div>
          </div>

          {/* Audit Timeline */}
          {appAuditEvents.length > 0 && (
            <div className="card p-5">
              <h3 className="font-semibold text-sm text-ink-1 mb-3">
                {lang === 'th' ? 'ประวัติการตรวจสอบ' : 'Audit Trail'}
              </h3>
              <div className="space-y-2 text-xs">
                {appAuditEvents.slice(0, 5).map((event) => (
                  <div key={event.id} className="p-2 rounded bg-bg-200 border border-line">
                    <p className="text-ink-3 font-mono">
                      {new Date(event.timestamp).toLocaleString(
                        lang === 'th' ? 'th-TH' : 'en-US'
                      )}
                    </p>
                    <p className="text-ink-1 mt-0.5">{event.action}</p>
                    {event.reason && (
                      <p className="text-ink-3 mt-1">{event.reason}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reveal Identity Modal */}
      {revealModal && (
        <div className="fixed inset-0 bg-slate-950/35 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl max-w-md w-full mx-4 shadow-[0_28px_80px_rgba(15,23,42,.18)] border border-line p-6 space-y-4">
            <h2 className="font-semibold text-ink-1">
              {lang === 'th' ? 'เปิดเผยตัวตนนักศึกษา' : 'Reveal Student Identity'}
            </h2>

            <AuditWarningCard
              title={lang === 'th' ? 'เปิดเผยตัวตน' : 'Identity Reveal'}
              message={lang === 'th'
                ? 'การเปิดเผยนี้จะบันทึกลงในประวัติการตรวจสอบและไม่สามารถเปลี่ยนแปลงได้'
                : 'This reveal will be logged in the audit trail and cannot be undone.'}
              requiresReason
            />

            <div>
              <label className="text-xs text-ink-3 font-medium block mb-2">
                {lang === 'th' ? 'เหตุผล (บังคับ)' : 'Reason (Required)'}
              </label>
              <textarea
                placeholder={lang === 'th' ? 'กรุณาระบุเหตุผล...' : 'Please provide reason...'}
                value={revealReason}
                onChange={(e) => setRevealReason(e.target.value)}
                className="input-base w-full text-xs py-2"
                rows={2}
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setRevealModal(false)
                  setRevealReason('')
                }}
                className="flex-1 text-xs py-2 px-3 bg-white border border-line text-ink-1 rounded hover:bg-surface-muted transition-colors"
              >
                {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                onClick={handleConfirmReveal}
                disabled={!revealReason.trim()}
                className="flex-1 text-xs py-2 px-3 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {lang === 'th' ? 'เปิดเผย' : 'Reveal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  )
}

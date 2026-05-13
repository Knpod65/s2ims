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
import StaffDocumentEvidenceWorkbench from '@/components/staff/StaffDocumentEvidenceWorkbench'
import DocumentActionRail from '@/components/staff/DocumentActionRail'
import { useToast } from '@/components/ui/Toast'
import { CheckCircle2, AlertCircle, Eye, MessageSquare } from 'lucide-react'
import type { ApplicationStatus } from '@/lib/types'
import { buildStaffDocumentRejectEvent, buildStaffDocumentReplacementRequestEvent } from '@/lib/audit/auditEventBuilder'
import { sharedMockAuditWriter } from '@/lib/audit/sharedMockWriter'

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
  const verifiedDocs = appDocs.filter((doc) => doc.status === 'verified').length
  const actionDocs = appDocs.filter((doc) => ['rejected', 'needs_replacement', 'missing', 'invalid_file_type'].includes(doc.status)).length

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

      <StaffDocumentEvidenceWorkbench
        studentToken={studentToken}
        scholarshipTitle={lang === 'th' ? app.scholarship_title_th : app.scholarship_title_en}
        statusBadge={<StatusBadge label={si[lang === 'th' ? 'th' : 'en']} color={si.color} />}
        metrics={[
          { label: lang === 'th' ? 'เอกสาร' : 'Documents', value: `${verifiedDocs}/${appDocs.length}` },
          { label: lang === 'th' ? 'ต้องดูแล' : 'Needs review', value: actionDocs },
          { label: lang === 'th' ? 'คะแนนจับคู่' : 'Match score', value: `${app.match_score}%` },
        ]}
        actionRail={<DocumentActionRail documents={appDocs} />}
        evidence={(
          <DocumentVerificationPanel
            documents={appDocs}
            onVerify={(docId) => {
              addToast(
                lang === 'th' ? 'เอกสารยืนยันแล้ว' : 'Document verified',
                'success'
              )
            }}
            onReject={(docId, reason) => {
              try {
                const doc = appDocs.find(d => d.id === docId)
                const event = buildStaffDocumentRejectEvent({
                  actorId: 'staff_demo_session',
                  actorRole: 'staff',
                  actorDisplayName: 'Staff (Demo)',
                  documentId: docId,
                  applicationId: id,
                  studentToken: studentToken,
                  sourceRoute: `/staff/applications/${id}`,
                  reason: reason,
                  createdAt: new Date().toISOString(),
                  metadata: {
                    documentId: docId,
                    applicationId: id,
                    studentToken: studentToken,
                    previousStatus: doc?.status ?? '',
                    nextStatus: 'rejected',
                  },
                })
                sharedMockAuditWriter.write(event)
              } catch (err) {
                console.warn('[AP-6D] Mock audit write failed (reject)', err)
              }
              addToast(
                lang === 'th'
                  ? `เอกสารปฏิเสธแล้ว: ${reason}`
                  : `Document rejected: ${reason}`,
                'info'
              )
            }}
            onRequestReplacement={(docId, message) => {
              try {
                const doc = appDocs.find(d => d.id === docId)
                const event = buildStaffDocumentReplacementRequestEvent({
                  actorId: 'staff_demo_session',
                  actorRole: 'staff',
                  actorDisplayName: 'Staff (Demo)',
                  documentId: docId,
                  applicationId: id,
                  studentToken: studentToken,
                  sourceRoute: `/staff/applications/${id}`,
                  reason: message,
                  createdAt: new Date().toISOString(),
                  metadata: {
                    documentId: docId,
                    applicationId: id,
                    studentToken: studentToken,
                    previousStatus: doc?.status ?? '',
                    nextStatus: 'needs_replacement',
                  },
                })
                sharedMockAuditWriter.write(event)
              } catch (err) {
                console.warn('[AP-6D] Mock audit write failed (replacement request)', err)
              }
              addToast(
                lang === 'th'
                  ? `ขอส่งแทน: ${message}`
                  : `Replacement requested: ${message}`,
                'info'
              )
            }}
          />
        )}
        reviewContext={(
          <div className="space-y-4">
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

            <div className="rounded-xl border border-line bg-surface-low p-4">
              <h4 className="mb-4 text-sm font-semibold text-ink-1">{lang==='th'?'ขั้นตอน':'Timeline'}</h4>
              <ApplicationTimeline steps={app.steps}/>
              <div className="mt-4 border-t border-line pt-4">
                <div className="mb-1 text-xs text-ink-3">{lang==='th'?'คะแนนจับคู่':'Match Score'}</div>
                <div className="font-display text-2xl font-bold text-role-primary">{app.match_score}%</div>
              </div>
            </div>
          </div>
        )}
        operations={(
          <>
            <div>
              <h4 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ink-1">
                <MessageSquare size={14} />
                {lang === 'th' ? 'หมายเหตุของเจ้าหน้าที่' : 'Staff Notes'}
              </h4>

              {appNotes.length > 0 && (
                <div className="mb-4 space-y-2 border-b border-line pb-4">
                  {appNotes.map((note) => (
                    <div key={note.id} className="rounded bg-bg-200 p-3">
                      <p className="mb-1 text-xs text-ink-1">{note.content}</p>
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

              <textarea
                placeholder={lang === 'th' ? 'เพิ่มหมายเหตุ...' : 'Add a note...'}
                value={staffNote}
                onChange={(e) => setStaffNote(e.target.value)}
                className="input-base mb-2 w-full py-2 text-xs"
                rows={2}
              />
              <button
                onClick={handleAddStaffNote}
                disabled={!staffNote.trim()}
                className="w-full rounded bg-role-tint px-3 py-1.5 text-xs text-role-primary transition-colors hover:bg-role-tint disabled:opacity-50"
              >
                {lang === 'th' ? 'เพิ่มหมายเหตุ' : 'Add Note'}
              </button>
            </div>

            <div className="border-t border-line pt-5">
              <h4 className="mb-4 text-sm font-semibold text-ink-1">{lang==='th'?'เปลี่ยนสถานะ':'Update Status'}</h4>
              <div className="flex flex-wrap gap-2">
                {(['UNDER_REVIEW','SHORTLISTED','NEEDS_DOCS','INTERVIEW_SCHEDULED','AWARDED','NOT_AWARDED'] as ApplicationStatus[]).map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(s)}
                    className={`rounded-lg border px-3 py-1.5 text-xs transition-all ${currentStatus===s?'border-role-border bg-role-tint text-role-primary':'border-line text-ink-3 hover:border-line-strong hover:text-ink-2'}`}
                  >
                    {APP_STATUS_MAP[s][lang==='th'?'th':'en']}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        auditTrail={appAuditEvents.length > 0 ? (
          <div>
            <h3 className="mb-3 font-display text-lg font-bold text-ink-1">
              {lang === 'th' ? 'ประวัติการตรวจสอบ' : 'Audit Trail'}
            </h3>
            <div className="space-y-2 text-xs">
              {appAuditEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="rounded border border-line bg-bg-200 p-2">
                  <p className="font-mono text-ink-3">
                    {new Date(event.timestamp).toLocaleString(
                      lang === 'th' ? 'th-TH' : 'en-US'
                    )}
                  </p>
                  <p className="mt-0.5 text-ink-1">{event.action}</p>
                  {event.reason && (
                    <p className="mt-1 text-ink-3">{event.reason}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : undefined}
      />

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

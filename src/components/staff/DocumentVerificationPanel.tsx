'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { CheckCircle2, AlertCircle, Clock, FileQuestion, Trash2, RotateCcw, FileText } from 'lucide-react'
import type { DocumentVerificationState } from '@/data/mock/staffData'
import AuditWarningCard from './AuditWarningCard'

interface DocumentVerificationPanelProps {
  documents: DocumentVerificationState[]
  onVerify?: (docId: string) => void
  onReject?: (docId: string, reason: string) => void
  onRequestReplacement?: (docId: string, message: string) => void
}

export default function DocumentVerificationPanel({
  documents,
  onVerify,
  onReject,
  onRequestReplacement,
}: DocumentVerificationPanelProps) {
  const { lang } = useLang()
  const [expandedDoc, setExpandedDoc] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState<Record<string, string>>({})
  const [replacementMsg, setReplacementMsg] = useState<Record<string, string>>({})

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 size={14} className="text-status-success" />
      case 'pending':
        return <Clock size={14} className="text-brand" />
      case 'rejected':
      case 'invalid_file_type':
        return <AlertCircle size={14} className="text-status-danger" />
      case 'needs_replacement':
        return <RotateCcw size={14} className="text-status-warning" />
      default:
        return <FileQuestion size={14} className="text-ink-3" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      uploaded: { th: 'อัปโหลดแล้ว', en: 'Uploaded' },
      pending: { th: 'รอตรวจสอบ', en: 'Pending' },
      verified: { th: 'ยืนยันแล้ว', en: 'Verified' },
      invalid_file_type: { th: 'ประเภทไฟล์ไม่ถูกต้อง', en: 'Invalid File Type' },
      rejected: { th: 'ปฏิเสธแล้ว', en: 'Rejected' },
      needs_replacement: { th: 'ต้องส่งแทน', en: 'Needs Replacement' },
      missing: { th: 'ขาดหายไป', en: 'Missing' },
    }
    return labels[status]?.[lang === 'th' ? 'th' : 'en'] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'bg-status-success/10 text-status-success'
      case 'pending':
      case 'uploaded':
        return 'bg-brand/10 text-brand'
      case 'rejected':
      case 'invalid_file_type':
      case 'missing':
        return 'bg-status-danger/10 text-status-danger'
      case 'needs_replacement':
        return 'bg-status-warning/10 text-status-warning'
      default:
        return 'bg-bg-100 text-ink-3'
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-sm text-ink-1 mb-4">
        {lang === 'th' ? 'ตรวจสอบเอกสาร' : 'Document Verification'}
      </h3>

      {documents.map((doc) => (
        <div key={doc.id} className={`rounded-lg border transition-all ${expandedDoc === doc.id ? 'border-brand/30 bg-brand/[0.02]' : 'border-white/[0.08]'}`}>
          {/* Header */}
          <button
            onClick={() => setExpandedDoc(expandedDoc === doc.id ? null : doc.id)}
            className="w-full p-4 flex items-start justify-between gap-3 hover:bg-white/[0.02] transition-colors"
          >
            <div className="flex items-start gap-3 flex-1 text-left">
              <div className="mt-0.5">{getStatusIcon(doc.status)}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm text-ink-1">
                    {lang === 'th' ? doc.label_th : doc.label_en}
                  </span>
                  {doc.required && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-status-danger/10 text-status-danger">
                      {lang === 'th' ? 'บังคับ' : 'Required'}
                    </span>
                  )}
                </div>
                <p className={`text-xs ${getStatusColor(doc.status)}`}>{getStatusLabel(doc.status)}</p>
              </div>
            </div>
            <div className="text-xs text-ink-3">{expandedDoc === doc.id ? '−' : '+'}</div>
          </button>

          {/* Expanded Details */}
          {expandedDoc === doc.id && (
            <div className="border-t border-white/[0.08] p-4 bg-bg-200/50">
              <div className="space-y-3">
                {/* Basic Info */}
                {doc.fileName && (
                  <div className="flex items-center gap-2 text-xs">
                    <FileText size={12} className="text-ink-3" />
                    <span className="text-ink-3">{doc.fileName}</span>
                  </div>
                )}

                {doc.uploadedAt && (
                  <p className="text-xs text-ink-3">
                    {lang === 'th' ? 'อัปโหลด:' : 'Uploaded:'} {new Date(doc.uploadedAt).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
                  </p>
                )}

                {/* Rejection Reason */}
                {doc.status === 'rejected' && doc.rejectionReason && (
                  <div className="p-3 rounded bg-status-danger/10 border border-status-danger/20">
                    <p className="text-xs text-status-danger font-semibold mb-1">
                      {lang === 'th' ? 'เหตุผลการปฏิเสธ' : 'Rejection Reason'}
                    </p>
                    <p className="text-xs text-status-danger/90">{doc.rejectionReason}</p>
                  </div>
                )}

                {/* Replacement Message */}
                {doc.status === 'needs_replacement' && doc.replacementMessage && (
                  <div className="p-3 rounded bg-status-warning/10 border border-status-warning/20">
                    <p className="text-xs text-status-warning font-semibold mb-1">
                      {lang === 'th' ? 'ข้อความขอส่งแทน' : 'Replacement Request'}
                    </p>
                    <p className="text-xs text-status-warning/90">{doc.replacementMessage}</p>
                  </div>
                )}

                {/* Staff Note */}
                {doc.staffNote && (
                  <div className="p-3 rounded bg-brand/10 border border-brand/20">
                    <p className="text-xs text-brand font-semibold mb-1">
                      {lang === 'th' ? 'หมายเหตุของเจ้าหน้าที่' : 'Staff Note'}
                    </p>
                    <p className="text-xs text-brand/90">{doc.staffNote}</p>
                  </div>
                )}

                {/* Actions */}
                {doc.status !== 'verified' && (
                  <div className="pt-3 border-t border-white/[0.08] space-y-2">
                    {doc.status !== 'rejected' && doc.status !== 'needs_replacement' && (
                      <>
                        {onVerify && (
                          <button
                            onClick={() => {
                              onVerify(doc.id)
                              setExpandedDoc(null)
                            }}
                            className="w-full text-xs py-2 px-3 bg-status-success/10 text-status-success rounded hover:bg-status-success/20 transition-colors"
                          >
                            {lang === 'th' ? '✓ ยืนยันเอกสาร' : '✓ Verify Document'}
                          </button>
                        )}
                      </>
                    )}

                    {onReject && doc.status !== 'rejected' && (
                      <>
                        {expandedDoc === doc.id && !rejectReason[doc.id] && (
                          <>
                            <p className="text-xs text-ink-3 font-medium mt-3">
                              {lang === 'th' ? 'ปฏิเสธเอกสาร' : 'Reject Document'}
                            </p>
                            <textarea
                              placeholder={lang === 'th' ? 'กรุณาระบุเหตุผล...' : 'Please specify reason...'}
                              value={rejectReason[doc.id] || ''}
                              onChange={(e) => setRejectReason({ ...rejectReason, [doc.id]: e.target.value })}
                              className="input-base w-full text-xs py-2"
                              rows={2}
                            />
                            <button
                              onClick={() => {
                                if (rejectReason[doc.id]?.trim()) {
                                  onReject(doc.id, rejectReason[doc.id])
                                  setRejectReason({ ...rejectReason, [doc.id]: '' })
                                  setExpandedDoc(null)
                                }
                              }}
                              disabled={!rejectReason[doc.id]?.trim()}
                              className="w-full text-xs py-1.5 px-3 bg-status-danger/10 text-status-danger rounded hover:bg-status-danger/20 transition-colors disabled:opacity-50"
                            >
                              {lang === 'th' ? 'ส่งการปฏิเสธ' : 'Send Rejection'}
                            </button>
                          </>
                        )}
                      </>
                    )}

                    {onRequestReplacement && doc.status !== 'rejected' && (
                      <>
                        <p className="text-xs text-ink-3 font-medium mt-3">
                          {lang === 'th' ? 'ขอส่งแทน' : 'Request Replacement'}
                        </p>
                        <textarea
                          placeholder={lang === 'th' ? 'กรุณาระบุข้อมูลที่ต้องการ...' : 'Please specify what is needed...'}
                          value={replacementMsg[doc.id] || ''}
                          onChange={(e) => setReplacementMsg({ ...replacementMsg, [doc.id]: e.target.value })}
                          className="input-base w-full text-xs py-2"
                          rows={2}
                        />
                        <button
                          onClick={() => {
                            if (replacementMsg[doc.id]?.trim()) {
                              onRequestReplacement(doc.id, replacementMsg[doc.id])
                              setReplacementMsg({ ...replacementMsg, [doc.id]: '' })
                              setExpandedDoc(null)
                            }
                          }}
                          disabled={!replacementMsg[doc.id]?.trim()}
                          className="w-full text-xs py-1.5 px-3 bg-status-warning/10 text-status-warning rounded hover:bg-status-warning/20 transition-colors disabled:opacity-50"
                        >
                          {lang === 'th' ? 'ส่งคำขอ' : 'Send Request'}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

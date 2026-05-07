'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { Mail, Clock, CheckCircle2, X, Eye } from 'lucide-react'
import type { StaffDisclosureRequest } from '@/data/mock/staffData'

interface DisclosureRequestCardProps {
  request: StaffDisclosureRequest
  onApprove?: (requestId: string) => void
  onReject?: (requestId: string) => void
  onViewDetails?: (requestId: string) => void
}

export default function DisclosureRequestCard({
  request,
  onApprove,
  onReject,
  onViewDetails,
}: DisclosureRequestCardProps) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending_staff_approval':
        return <Clock size={14} className="text-amber-700" />
      case 'approved':
        return <CheckCircle2 size={14} className="text-status-success" />
      case 'rejected':
        return <X size={14} className="text-status-danger" />
      default:
        return <Mail size={14} className="text-ink-3" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      pending_staff_approval: { th: 'รอตรวจสอบ', en: 'Pending Review' },
      approved: { th: 'อนุมัติ', en: 'Approved' },
      rejected: { th: 'ปฏิเสธ', en: 'Rejected' },
    }
    return labels[status]?.[lang === 'th' ? 'th' : 'en'] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_staff_approval':
        return 'bg-[#FFFBEB] text-[#78350F] border border-[#FDE68A]'
      case 'approved':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      case 'rejected':
        return 'bg-red-50 text-red-700 border border-red-200'
      default:
        return 'bg-surface-low text-ink-3 border border-line'
    }
  }

  return (
    <div
      className={`rounded-xl border bg-white shadow-card transition-all ${
        expanded ? 'border-amber-200' : 'border-line'
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between gap-3 hover:bg-surface-low transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 text-left">
          <div className="mt-0.5">{getStatusIcon(request.status)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-ink-1">{request.providerName}</span>
            </div>
            <p className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${getStatusColor(request.status)}`}>
              {getStatusLabel(request.status)}
            </p>
            <p className="mt-2 inline-flex rounded-md border border-dashed border-slate-300 bg-slate-50 px-2 py-1 font-mono text-[11px] font-semibold text-slate-700">
              {request.candidateToken}
            </p>
          </div>
        </div>
        <div className="text-xs text-ink-3">{expanded ? '−' : '+'}</div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-line p-4 bg-surface-low/60 space-y-3">
          {/* Request Info */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ผู้ให้โครงการ' : 'Provider'}</span>
              <span className="text-ink-1 font-medium">{request.providerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ผู้สมัคร' : 'Candidate'}</span>
              <span className="font-mono text-ink-1 font-medium">{request.candidateToken}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'วันที่ร้องขอ' : 'Requested'}</span>
              <span className="text-ink-1 font-medium">
                {new Date(request.requestedAt).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
              </span>
            </div>
          </div>

          {/* Provider Reason */}
          <div className="p-3 rounded-lg bg-white border border-line">
            <p className="text-xs text-ink-3 font-semibold mb-1">
              {lang === 'th' ? 'เหตุผลการร้องขอ' : 'Request Reason'}
            </p>
            <p className="text-xs text-ink-1">{request.providerReason}</p>
          </div>

          {/* Fields to Disclose */}
          <div className="p-3 rounded-lg bg-white border border-line">
            <p className="text-xs text-ink-3 font-semibold mb-2">
              {lang === 'th' ? 'ฟิลด์ที่ร้องขอ' : 'Requested Fields'}
            </p>
            <div className="flex flex-wrap gap-1">
              {request.fieldsToDisclose.map((field, idx) => (
                <span key={idx} className="text-xs bg-[#FFFBEB] text-[#78350F] border border-[#FDE68A] px-2 py-1 rounded">
                  {field}
                </span>
              ))}
            </div>
          </div>

          {/* Disclosure Risk */}
          {request.disclosureRiskNote && (
            <div className="p-3 rounded-lg bg-[#FFFBEB] border border-[#FDE68A] text-[#78350F]">
              <p className="text-xs font-semibold mb-1">
                {lang === 'th' ? 'หมายเหตุความเสี่ยง' : 'Risk Note'}
              </p>
              <p className="text-xs leading-relaxed">{request.disclosureRiskNote}</p>
            </div>
          )}

          {/* Match Summary */}
          <div className="p-3 rounded-lg bg-role-tint border border-role">
            <p className="text-xs text-role font-semibold mb-1">
              {lang === 'th' ? 'สรุปการจับคู่' : 'Match Summary'}
            </p>
            <p className="text-xs text-ink-2 leading-relaxed">{request.matchSummary}</p>
          </div>

          {/* Approval Details (if approved) */}
          {request.status === 'approved' && request.approvedBy && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <p className="text-xs text-emerald-700 font-semibold mb-1">
                {lang === 'th' ? 'รายละเอียดการอนุมัติ' : 'Approval Details'}
              </p>
              <p className="text-xs text-emerald-700">
                {lang === 'th' ? 'อนุมัติโดย:' : 'Approved by:'} {request.approvedBy}
              </p>
              {request.approvedAt && (
                <p className="text-xs text-emerald-700 mt-1">
                  {new Date(request.approvedAt).toLocaleDateString(lang === 'th' ? 'th-TH' : 'en-US')}
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          {request.status === 'pending_staff_approval' && (
            <div className="pt-3 border-t border-line space-y-2">
              {onViewDetails && (
                <button
                  onClick={() => onViewDetails(request.id)}
                  className="w-full text-xs py-2 px-3 bg-role-tint text-role rounded hover:bg-white transition-colors flex items-center justify-center gap-1 border border-role"
                >
                  <Eye size={12} />
                  {lang === 'th' ? 'ดูรายละเอียดและอนุมัติ' : 'View & Approve'}
                </button>
              )}
              {onReject && (
                <button
                  onClick={() => onReject(request.id)}
                  className="w-full text-xs py-2 px-3 bg-status-danger/10 text-status-danger rounded hover:bg-status-danger/20 transition-colors"
                >
                  {lang === 'th' ? 'ปฏิเสธ' : 'Reject'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

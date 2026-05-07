'use client'

import { useLang } from '@/lib/i18n'
import { Clock, CheckCircle2, XCircle } from 'lucide-react'
import { useState } from 'react'
import type { AccessRequest } from '@/data/mock/adminData'

interface AccessRequestCardProps {
  request: AccessRequest
  onApprove?: (requestId: string) => void
  onDeny?: (requestId: string) => void
}

export default function AccessRequestCard({
  request,
  onApprove,
  onDeny,
}: AccessRequestCardProps) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={14} className="text-role-primary" />
      case 'approved':
        return <CheckCircle2 size={14} className="text-status-success" />
      case 'denied':
        return <XCircle size={14} className="text-status-danger" />
      default:
        return <Clock size={14} className="text-ink-3" />
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      pending: { th: 'รออนุมัติ', en: 'Pending' },
      approved: { th: 'อนุมัติ', en: 'Approved' },
      denied: { th: 'ปฏิเสธ', en: 'Denied' },
    }
    return labels[status]?.[lang === 'th' ? 'th' : 'en'] || status
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-role-tint border-role-border'
      case 'approved':
        return 'bg-status-success/10 border-status-success/20'
      case 'denied':
        return 'bg-status-danger/10 border-status-danger/20'
      default:
        return 'bg-bg-100'
    }
  }

  return (
    <div className={`rounded-lg border transition-all ${getStatusColor(request.status)}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 hover:bg-surface-low transition-colors text-left"
      >
        <div className="mt-0.5">{getStatusIcon(request.status)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-ink-1">
              {lang === 'th' ? request.userName_th : request.userName_en}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-bg-100 text-ink-3">
              {getStatusLabel(request.status)}
            </span>
          </div>
          <p className="text-xs text-ink-3 truncate">{request.requestedPermission}</p>
          <p className="text-xs text-ink-3 mt-0.5">
            {new Date(request.requestedAt).toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')}
          </p>
        </div>
        <div className="text-xs text-ink-3 flex-shrink-0">{expanded ? '−' : '+'}</div>
      </button>

      {expanded && (
        <div className="border-t border-line p-4 bg-bg-200/50 space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ผู้ใช้' : 'User'}</span>
              <span className="text-ink-1 font-medium">
                {lang === 'th' ? request.userName_th : request.userName_en}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'สิทธิ์ที่ร้องขอ' : 'Requested Permission'}</span>
              <span className="text-ink-1 font-medium font-mono text-[11px]">
                {request.requestedPermission}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'สถานะ' : 'Status'}</span>
              <span className="text-ink-1 font-medium">{getStatusLabel(request.status)}</span>
            </div>
          </div>

          <div className="p-3 rounded bg-bg-100 border border-line">
            <p className="text-xs text-ink-3 font-semibold mb-1">
              {lang === 'th' ? 'เหตุผลการร้องขอ' : 'Request Reason'}
            </p>
            <p className="text-xs text-ink-1">{request.requestReason}</p>
          </div>

          {request.reviewReason && (
            <div className={`p-3 rounded border ${
              request.status === 'approved'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <p className={`text-xs font-semibold mb-1 ${
                request.status === 'approved' ? 'text-emerald-700' : 'text-red-700'
              }`}>
                {lang === 'th' ? 'บันทึกการตรวจสอบ' : 'Review Notes'}
              </p>
              <p className={`text-xs ${
                request.status === 'approved' ? 'text-emerald-700' : 'text-red-700'
              }`}>
                {request.reviewReason}
              </p>
            </div>
          )}

          {request.status === 'pending' && (
            <div className="pt-3 border-t border-line space-y-2">
              {onApprove && (
                <button
                  onClick={() => onApprove(request.id)}
                  className="w-full text-xs py-2 px-3 bg-status-success/10 text-status-success rounded hover:bg-status-success/20 transition-colors flex items-center justify-center gap-1"
                >
                  <CheckCircle2 size={12} />
                  {lang === 'th' ? 'อนุมัติ' : 'Approve'}
                </button>
              )}
              {onDeny && (
                <button
                  onClick={() => onDeny(request.id)}
                  className="w-full text-xs py-2 px-3 bg-status-danger/10 text-status-danger rounded hover:bg-status-danger/20 transition-colors flex items-center justify-center gap-1"
                >
                  <XCircle size={12} />
                  {lang === 'th' ? 'ปฏิเสธ' : 'Deny'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

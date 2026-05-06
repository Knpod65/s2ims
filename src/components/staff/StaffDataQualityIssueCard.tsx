'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { AlertTriangle, AlertCircle, Zap, CheckCircle2 } from 'lucide-react'
import type { DataQualityIssue } from '@/data/mock/staffData'

interface StaffDataQualityIssueCardProps {
  issue: DataQualityIssue
  onResolve?: (issueId: string) => void
}

export default function StaffDataQualityIssueCard({ issue, onResolve }: StaffDataQualityIssueCardProps) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle size={16} className="text-status-danger" />
      case 'warning':
        return <AlertCircle size={16} className="text-status-warning" />
      case 'info':
        return <Zap size={16} className="text-brand" />
      default:
        return <AlertCircle size={16} className="text-ink-3" />
    }
  }

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, Record<string, string>> = {
      critical: { th: 'ร้ายแรง', en: 'Critical' },
      warning: { th: 'คำเตือน', en: 'Warning' },
      info: { th: 'ข้อมูล', en: 'Info' },
    }
    return labels[severity]?.[lang === 'th' ? 'th' : 'en'] || severity
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-status-danger/10 text-status-danger'
      case 'warning':
        return 'bg-status-warning/10 text-status-warning'
      case 'info':
        return 'bg-brand/10 text-brand'
      default:
        return 'bg-bg-100 text-ink-3'
    }
  }

  const getTypeLabel = (type: string) => {
    const labels: Record<string, Record<string, string>> = {
      missing_document: { th: 'เอกสารที่หายไป', en: 'Missing Document' },
      invalid_gpa: { th: 'GPA ไม่ถูกต้อง', en: 'Invalid GPA' },
      missing_financial_data: { th: 'ข้อมูลทางการเงินที่หายไป', en: 'Missing Financial Data' },
      outdated_transcript: { th: 'ตัวเลขที่ล้าสมัย', en: 'Outdated Transcript' },
      conflicting_data: { th: 'ข้อมูลที่ขัดแย้ง', en: 'Conflicting Data' },
      incomplete_profile: { th: 'โปรไฟล์ที่ไม่สมบูรณ์', en: 'Incomplete Profile' },
    }
    return labels[type]?.[lang === 'th' ? 'th' : 'en'] || type
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return null
      case 'in_progress':
        return <Zap size={12} className="text-status-warning" />
      case 'resolved':
        return <CheckCircle2 size={12} className="text-status-success" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, Record<string, string>> = {
      open: { th: 'เปิด', en: 'Open' },
      in_progress: { th: 'กำลังดำเนินการ', en: 'In Progress' },
      resolved: { th: 'แก้ไขแล้ว', en: 'Resolved' },
    }
    return labels[status]?.[lang === 'th' ? 'th' : 'en'] || status
  }

  return (
    <div
      className={`rounded-lg border transition-all ${
        expanded ? 'border-brand/30 bg-brand/[0.02]' : 'border-white/[0.08]'
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 text-left">
          <div className="mt-0.5">{getSeverityIcon(issue.severity)}</div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-ink-1">{getTypeLabel(issue.type)}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded ${getSeverityColor(issue.severity)}`}>
                {getSeverityLabel(issue.severity)}
              </span>
            </div>
            <p className="text-xs text-ink-3">
              {lang === 'th' ? 'ส่วนที่ได้รับผลกระทบ:' : 'Affected:'} {issue.affectedCount}{' '}
              {issue.affectedCount === 1
                ? lang === 'th'
                  ? 'รายการ'
                  : 'item'
                : lang === 'th'
                ? 'รายการ'
                : 'items'}
            </p>
          </div>
        </div>
        <div className="text-xs text-ink-3 flex items-center gap-1">
          {getStatusIcon(issue.status)}
          {expanded ? '−' : '+'}
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-white/[0.08] p-4 bg-bg-200/50 space-y-3">
          {/* Issue Details */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ประเภท' : 'Type'}</span>
              <span className="text-ink-1 font-medium">{getTypeLabel(issue.type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'สถานะ' : 'Status'}</span>
              <span className="text-ink-1 font-medium">{getStatusLabel(issue.status)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ความรุนแรง' : 'Severity'}</span>
              <span className={`font-medium ${getSeverityColor(issue.severity)}`}>
                {getSeverityLabel(issue.severity)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ปัจจุบันรับผิดชอบ' : 'Owner'}</span>
              <span className="text-ink-1 font-medium">{issue.owner}</span>
            </div>
          </div>

          {/* Suggested Fix */}
          <div className="p-3 rounded bg-bg-100 border border-white/[0.08]">
            <p className="text-xs text-ink-3 font-semibold mb-1">
              {lang === 'th' ? 'การแก้ไขที่แนะนำ' : 'Suggested Fix'}
            </p>
            <p className="text-xs text-ink-1">{issue.suggestedFix}</p>
          </div>

          {/* Status Badge */}
          <div className={`p-3 rounded border ${
            issue.status === 'resolved'
              ? 'bg-status-success/10 border-status-success/20'
              : issue.status === 'in_progress'
              ? 'bg-status-warning/10 border-status-warning/20'
              : 'bg-status-danger/10 border-status-danger/20'
          }`}>
            <p className={`text-xs font-semibold flex items-center gap-1 ${
              issue.status === 'resolved'
                ? 'text-status-success'
                : issue.status === 'in_progress'
                ? 'text-status-warning'
                : 'text-status-danger'
            }`}>
              {getStatusIcon(issue.status)}
              {getStatusLabel(issue.status)}
            </p>
          </div>

          {/* Action */}
          {issue.status === 'open' && onResolve && (
            <div className="pt-3 border-t border-white/[0.08]">
              <button
                onClick={() => onResolve(issue.id)}
                className="w-full text-xs py-2 px-3 bg-brand/10 text-brand rounded hover:bg-brand/20 transition-colors"
              >
                {lang === 'th' ? 'ทำเครื่องหมายว่าดำเนินการอยู่' : 'Mark In Progress'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

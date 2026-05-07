'use client'

import { useLang } from '@/lib/i18n'
import { useState } from 'react'
import { mockDataQualityIssues } from '@/data/mock/staffData'
import StaffDataQualityIssueCard from '@/components/staff/StaffDataQualityIssueCard'
import AppShell from '@/components/layout/AppShell'

export default function DataQualityPage() {
  const { lang } = useLang()
  const [issues, setIssues] = useState(mockDataQualityIssues)

  const handleResolveIssue = (issueId: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === issueId
          ? { ...issue, status: 'in_progress' as const }
          : issue
      )
    )
  }

  const criticalIssues = issues.filter((i) => i.severity === 'high')
  const warningIssues = issues.filter((i) => i.severity === 'medium')
  const infoIssues = issues.filter((i) => i.severity === 'low')

  const openIssues = issues.filter((i) => i.status === 'open')
  const inProgressIssues = issues.filter((i) => i.status === 'in_progress')
  const resolvedIssues = issues.filter((i) => i.status === 'resolved')

  return (
    <AppShell requiredRole="staff">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-ink-1 mb-2">
            {lang === 'th' ? 'คุณภาพของข้อมูล' : 'Data Quality'}
          </h1>
          <p className="text-sm text-ink-3">
            {lang === 'th'
              ? 'ติดตามและแก้ไขปัญหาคุณภาพข้อมูลที่อาจส่งผลต่อการจับคู่และการตัดสินใจ'
              : 'Track and resolve data quality issues that may impact matching and decisions.'}
          </p>
        </div>

        {/* Severity Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4 border-status-danger/20">
            <p className="text-xs text-status-danger font-medium mb-1">
              {lang === 'th' ? 'ร้ายแรง' : 'Critical'}
            </p>
            <p className="text-2xl font-bold text-status-danger">{criticalIssues.length}</p>
          </div>
          <div className="card p-4 border-status-warning/20">
            <p className="text-xs text-status-warning font-medium mb-1">
              {lang === 'th' ? 'คำเตือน' : 'Warning'}
            </p>
            <p className="text-2xl font-bold text-status-warning">{warningIssues.length}</p>
          </div>
          <div className="card p-4 border-role-border">
            <p className="text-xs text-role-primary font-medium mb-1">
              {lang === 'th' ? 'ข้อมูล' : 'Info'}
            </p>
            <p className="text-2xl font-bold text-role-primary">{infoIssues.length}</p>
          </div>
        </div>

        {/* Status Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'เปิด' : 'Open'}
            </p>
            <p className="text-2xl font-bold text-status-danger">{openIssues.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'กำลังดำเนินการ' : 'In Progress'}
            </p>
            <p className="text-2xl font-bold text-status-warning">{inProgressIssues.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'แก้ไขแล้ว' : 'Resolved'}
            </p>
            <p className="text-2xl font-bold text-status-success">{resolvedIssues.length}</p>
          </div>
        </div>

        {/* Critical Issues */}
        {criticalIssues.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-status-danger mb-4">
              {lang === 'th' ? 'ปัญหาร้ายแรง' : 'Critical Issues'}
            </h2>
            <div className="space-y-3">
              {criticalIssues.map((issue) => (
                <StaffDataQualityIssueCard
                  key={issue.id}
                  issue={issue}
                  onResolve={handleResolveIssue}
                />
              ))}
            </div>
          </div>
        )}

        {/* Warning Issues */}
        {warningIssues.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-status-warning mb-4">
              {lang === 'th' ? 'ปัญหาที่ต้องเตือน' : 'Warning Issues'}
            </h2>
            <div className="space-y-3">
              {warningIssues.map((issue) => (
                <StaffDataQualityIssueCard
                  key={issue.id}
                  issue={issue}
                  onResolve={handleResolveIssue}
                />
              ))}
            </div>
          </div>
        )}

        {/* Info Issues */}
        {infoIssues.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold text-sm text-role-primary mb-4">
              {lang === 'th' ? 'ปัญหาข้อมูล' : 'Info Issues'}
            </h2>
            <div className="space-y-3">
              {infoIssues.map((issue) => (
                <StaffDataQualityIssueCard
                  key={issue.id}
                  issue={issue}
                  onResolve={handleResolveIssue}
                />
              ))}
            </div>
          </div>
        )}

        {issues.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-sm text-ink-3">
              {lang === 'th'
                ? 'ไม่มีปัญหาคุณภาพข้อมูล'
                : 'No data quality issues'}
            </p>
          </div>
        )}
      </div>
    </AppShell>
  )
}

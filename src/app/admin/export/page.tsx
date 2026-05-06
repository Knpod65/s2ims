'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { useToast } from '@/components/ui/Toast'
import { mockUsers } from '@/data/mock/users'
import { mockApplications } from '@/data/mock/applications'
import { mockScholarships } from '@/data/mock/scholarships'
import { mockAuditLogs } from '@/data/mock/audit-logs'
import { Download, Database, FileText, Users, ScrollText } from 'lucide-react'

function toCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ''
  const headers = Object.keys(rows[0])
  const escape = (v: unknown) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }
  return [headers.join(','), ...rows.map(r => headers.map(h => escape(r[h])).join(','))].join('\n')
}

function downloadCsv(filename: string, csv: string) {
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminExportPage() {
  const { lang } = useLang()
  const { addToast } = useToast()
  const [loading, setLoading] = useState<string | null>(null)

  const handleExport = async (type: string, format: string) => {
    const key = `${type}-${format}`
    setLoading(key)
    await new Promise(r => setTimeout(r, 600))

    const stamp = new Date().toISOString().slice(0, 10)

    if (type === 'users') {
      const rows = mockUsers.map(u => ({
        id: u.id, name_th: u.name_th, name_en: u.name_en,
        email: u.email, role: u.role, is_active: u.is_active, created_at: u.created_at,
      }))
      if (format === 'CSV') downloadCsv(`users_${stamp}.csv`, toCsv(rows))
      else downloadJson(`users_${stamp}.json`, rows)
    } else if (type === 'applications') {
      const rows = mockApplications.map(a => ({
        id: a.id, scholarship_id: a.scholarship_id,
        scholarship: a.scholarship_title_en, student_id: a.student_id,
        status: a.status, match_score: a.match_score,
        applied_at: a.applied_at, updated_at: a.updated_at,
      }))
      if (format === 'CSV') downloadCsv(`applications_${stamp}.csv`, toCsv(rows))
      else downloadCsv(`applications_${stamp}.csv`, toCsv(rows))
    } else if (type === 'scholarships') {
      const rows = mockScholarships.map(s => ({
        id: s.id, title_en: s.title_en, type: s.type,
        amount: s.amount, num_awards: s.num_awards,
        deadline: s.deadline, status: s.status, provider: s.provider,
      }))
      if (format === 'CSV') downloadCsv(`scholarships_${stamp}.csv`, toCsv(rows))
      else downloadJson(`scholarships_${stamp}.json`, rows)
    } else if (type === 'audit') {
      const rows = mockAuditLogs.map(l => ({
        id: l.id, actor: l.actor_name, role: l.actor_role,
        action: l.action, entity: l.entity_type, entity_id: l.entity_id,
        ip: l.ip, created_at: l.created_at,
      }))
      downloadCsv(`audit_log_${stamp}.csv`, toCsv(rows))
    }

    setLoading(null)
    addToast(lang === 'th' ? `ดาวน์โหลด ${format} แล้ว` : `${format} downloaded`, 'success')
  }

  const EXPORTS = [
    { id: 'users', icon: Users, th: 'ข้อมูลผู้ใช้', en: 'User Data', formats: ['CSV', 'JSON'] as const },
    { id: 'applications', icon: FileText, th: 'ใบสมัครทั้งหมด', en: 'All Applications', formats: ['CSV'] as const },
    { id: 'scholarships', icon: Database, th: 'ข้อมูลทุน', en: 'Scholarship Data', formats: ['CSV', 'JSON'] as const },
    { id: 'audit', icon: ScrollText, th: 'Audit Log', en: 'Audit Log', formats: ['CSV'] as const },
  ]

  return (
    <AppShell requiredRole="admin">
      <PageHeader
        title={lang === 'th' ? 'ส่งออกข้อมูล' : 'Export Center'}
        subtitle={lang === 'th' ? 'ดาวน์โหลดข้อมูลในรูปแบบต่างๆ' : 'Download data in various formats'}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        {EXPORTS.map(({ id, icon: Icon, th, en, formats }) => (
          <div key={id} className="card p-5">
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-lg bg-white/[0.06]">
                <Icon size={18} className="text-ink-2" />
              </div>
              <div>
                <div className="font-semibold text-sm text-ink-1">{lang === 'th' ? th : en}</div>
                <div className="text-xs text-ink-3">{formats.join(' · ')}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {formats.map(f => {
                const key = `${id}-${f}`
                return (
                  <button
                    key={f}
                    onClick={() => handleExport(id, f)}
                    disabled={loading === key}
                    className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 flex-1 justify-center disabled:opacity-60"
                  >
                    <Download size={11} />
                    {loading === key ? '...' : f}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  )
}

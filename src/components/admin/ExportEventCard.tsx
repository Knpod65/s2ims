'use client'

import { useLang } from '@/lib/i18n'
import { Download, Mail, HardDrive, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import type { ExportEvent } from '@/data/mock/adminData'

interface ExportEventCardProps {
  event: ExportEvent
}

export default function ExportEventCard({ event }: ExportEventCardProps) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)

  const getExportTypeLabel = (type: string) => {
    const labels: Record<string, Record<string, string>> = {
      audit_log: { th: 'บันทึกการตรวจสอบ', en: 'Audit Logs' },
      user_list: { th: 'รายชื่อผู้ใช้', en: 'User List' },
      application_data: { th: 'ข้อมูลใบสมัคร', en: 'Application Data' },
      student_data: { th: 'ข้อมูลนักศึกษา', en: 'Student Data' },
      sensitive_access: { th: 'การเข้าถึงที่ละเอียด', en: 'Sensitive Access' },
      failed_logins: { th: 'ความพยายามเข้าสู่ระบบล้มเหลว', en: 'Failed Logins' },
    }
    return labels[type]?.[lang === 'th' ? 'th' : 'en'] || type
  }

  const getDataLevelIcon = (level: string) => {
    switch (level) {
      case 'public':
        return '🔓'
      case 'internal':
        return '🔒'
      case 'restricted':
        return '🔐'
      case 'confidential':
        return '⚠️'
      default:
        return '📋'
    }
  }

  const getDestinationIcon = (dest?: string) => {
    switch (dest) {
      case 'email':
        return <Mail size={12} />
      case 'downloaded':
        return <Download size={12} />
      case 'storage':
        return <HardDrive size={12} />
      default:
        return <Download size={12} />
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-status-danger/10 border-status-danger/20'
      case 'medium':
        return 'bg-status-warning/10 border-status-warning/20'
      default:
        return 'bg-brand/10 border-brand/20'
    }
  }

  const getDestinationLabel = (dest?: string) => {
    const labels: Record<string, Record<string, string>> = {
      email: { th: 'อีเมล', en: 'Email' },
      downloaded: { th: 'ดาวน์โหลด', en: 'Downloaded' },
      storage: { th: 'ที่เก็บข้อมูล', en: 'Storage' },
    }
    return labels[dest || 'downloaded']?.[lang === 'th' ? 'th' : 'en'] || 'Unknown'
  }

  return (
    <div className={`rounded-lg border transition-all ${getRiskColor(event.riskLevel)}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 hover:bg-white/[0.02] transition-colors text-left"
      >
        <div className="mt-0.5 text-lg">{getDataLevelIcon(event.dataLevel)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-ink-1">
              {getExportTypeLabel(event.exportType)}
            </span>
            {event.riskLevel === 'high' && <AlertTriangle size={12} className="text-status-danger" />}
          </div>
          <p className="text-xs text-ink-3">
            {event.recordCount} {lang === 'th' ? 'บันทึก' : 'records'} • {getDestinationLabel(event.destination)}
          </p>
          <p className="text-xs text-ink-3 mt-0.5">
            {new Date(event.exportedAt).toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')}
          </p>
        </div>
        <div className="text-xs text-ink-3 flex-shrink-0">{expanded ? '−' : '+'}</div>
      </button>

      {expanded && (
        <div className="border-t border-white/[0.08] p-4 bg-bg-200/50 space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ส่งออกโดย' : 'Exported By'}</span>
              <span className="text-ink-1 font-medium">{event.exportedBy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ระดับข้อมูล' : 'Data Level'}</span>
              <span className="text-ink-1 font-medium uppercase">{event.dataLevel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'จำนวนบันทึก' : 'Record Count'}</span>
              <span className="text-ink-1 font-medium">{event.recordCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'IP' : 'IP Address'}</span>
              <span className="text-ink-1 font-mono text-[11px]">{event.ip}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ปลายทาง' : 'Destination'}</span>
              <span className="text-ink-1 font-medium flex items-center gap-1">
                {getDestinationIcon(event.destination)}
                {getDestinationLabel(event.destination)}
              </span>
            </div>
          </div>

          {Object.keys(event.filters || {}).length > 0 && (
            <div className="p-3 rounded bg-bg-100 border border-white/[0.08]">
              <p className="text-xs text-ink-3 font-semibold mb-2">
                {lang === 'th' ? 'ตัวกรอง' : 'Filters'}
              </p>
              <div className="space-y-1 text-xs text-ink-1 font-mono">
                {Object.entries(event.filters || {}).map(([key, val]) => (
                  <div key={key} className="flex gap-2">
                    <span className="text-ink-3">{key}:</span>
                    <span>{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

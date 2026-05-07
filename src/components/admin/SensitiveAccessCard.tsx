'use client'

import { useLang } from '@/lib/i18n'
import { Eye, Zap, FileText, Users, Lock, Share2 } from 'lucide-react'
import { useState } from 'react'
import type { SensitiveAccessEvent } from '@/data/mock/adminData'

interface SensitiveAccessCardProps {
  event: SensitiveAccessEvent
}

export default function SensitiveAccessCard({ event }: SensitiveAccessCardProps) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'identity_reveal':
        return <Eye size={14} className="text-status-danger" />
      case 'manual_override':
        return <Zap size={14} className="text-status-warning" />
      case 'disclosure_approved':
        return <FileText size={14} className="text-role-primary" />
      case 'role_change':
        return <Users size={14} className="text-status-info" />
      case 'scope_change':
        return <Lock size={14} className="text-status-warning" />
      case 'permission_grant':
        return <Share2 size={14} className="text-role-primary" />
      default:
        return <FileText size={14} />
    }
  }

  const getEventLabel = (eventType: string) => {
    const labels: Record<string, Record<string, string>> = {
      identity_reveal: { th: 'เปิดเผยข้อมูลประจำตัว', en: 'Identity Revealed' },
      manual_override: { th: 'แทนที่ด้วยตนเอง', en: 'Manual Override' },
      disclosure_approved: { th: 'อนุมัติการเปิดเผย', en: 'Disclosure Approved' },
      role_change: { th: 'เปลี่ยนแปลงบทบาท', en: 'Role Changed' },
      scope_change: { th: 'เปลี่ยนแปลงขอบเขต', en: 'Scope Changed' },
      permission_grant: { th: 'มอบสิทธิ์', en: 'Permission Granted' },
    }
    return labels[eventType]?.[lang === 'th' ? 'th' : 'en'] || eventType
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-status-danger/10 border-status-danger/20'
      case 'medium':
        return 'bg-status-warning/10 border-status-warning/20'
      default:
        return 'bg-role-tint border-role-border'
    }
  }

  return (
    <div className={`rounded-lg border transition-all ${getRiskColor(event.riskLevel)}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start gap-3 hover:bg-surface-low transition-colors text-left"
      >
        <div className="mt-0.5">{getEventIcon(event.eventType)}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="font-semibold text-sm text-ink-1">
              {getEventLabel(event.eventType)}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded ${
              event.riskLevel === 'high'
                ? 'bg-status-danger/20 text-status-danger'
                : event.riskLevel === 'medium'
                ? 'bg-status-warning/20 text-status-warning'
                : 'bg-role-tint text-role-primary'
            }`}>
              {event.riskLevel.toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-ink-3">
            {event.actor.name} ({event.actor.role})
          </p>
          <p className="text-xs text-ink-3 mt-0.5">
            {new Date(event.timestamp).toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')}
          </p>
        </div>
        <div className="text-xs text-ink-3 flex-shrink-0">{expanded ? '−' : '+'}</div>
      </button>

      {expanded && (
        <div className="border-t border-line p-4 bg-bg-200/50 space-y-3">
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ผู้กระทำการ' : 'Actor'}</span>
              <span className="text-ink-1 font-medium">{event.actor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'เป้าหมาย' : 'Target'}</span>
              <span className="text-ink-1 font-medium">{event.target.token || event.target.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-3">{lang === 'th' ? 'ประเภท' : 'Type'}</span>
              <span className="text-ink-1 font-medium">{event.target.type}</span>
            </div>
          </div>

          <div className="p-3 rounded bg-bg-100 border border-line">
            <p className="text-xs text-ink-3 font-semibold mb-1">
              {lang === 'th' ? 'เหตุผล' : 'Reason'}
            </p>
            <p className="text-xs text-ink-1">{event.reason}</p>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-bg-100">
              <p className="text-ink-3 mb-0.5">{lang === 'th' ? 'คำอธิบาย TH' : 'Description TH'}</p>
              <p className="text-ink-1 text-[11px]">{event.description_th}</p>
            </div>
            <div className="p-2 rounded bg-bg-100">
              <p className="text-ink-3 mb-0.5">{lang === 'th' ? 'คำอธิบาย EN' : 'Description EN'}</p>
              <p className="text-ink-1 text-[11px]">{event.description_en}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

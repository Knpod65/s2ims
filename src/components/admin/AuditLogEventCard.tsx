'use client'

import { useLang } from '@/lib/i18n'
import { useState } from 'react'
import type { AuditLog } from '@/lib/types'
import RoleBadge from './RoleBadge'

interface AuditLogEventCardProps {
  log: AuditLog
}

export default function AuditLogEventCard({ log }: AuditLogEventCardProps) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)

  const getActionColor = (action: string) => {
    if (action.includes('role')) return 'text-status-warning'
    if (action.includes('permission')) return 'text-status-danger'
    if (action.includes('delete')) return 'text-status-danger'
    if (action.includes('user')) return 'text-brand'
    if (action.includes('approved')) return 'text-status-success'
    return 'text-ink-1'
  }

  return (
    <div className="rounded-lg border border-white/[0.08] p-4 hover:border-white/20 transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className={`text-sm font-semibold ${getActionColor(log.action)}`}>
                {log.action}
              </span>
              <RoleBadge role={log.actor_role} size="sm" />
            </div>
            <p className="text-xs text-ink-3">
              {log.actor_name} • {log.entity_type} #{log.entity_id}
            </p>
            <p className="text-xs text-ink-3 mt-1">
              {new Date(log.created_at).toLocaleString(lang === 'th' ? 'th-TH' : 'en-US')}
            </p>
          </div>
          <div className="text-xs text-ink-3 flex-shrink-0">{expanded ? '−' : '+'}</div>
        </div>
      </button>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-white/[0.08] space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-ink-3">{lang === 'th' ? 'ผู้กระทำการ' : 'Actor'}</span>
            <span className="text-ink-1 font-medium">{log.actor_name} ({log.actor_id})</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-3">{lang === 'th' ? 'IP' : 'IP Address'}</span>
            <span className="text-ink-1 font-mono">{log.ip}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-3">{lang === 'th' ? 'ลำดับสิ่งอ้างอิง' : 'Entity'}</span>
            <span className="text-ink-1 font-mono">
              {log.entity_type}#{log.entity_id}
            </span>
          </div>

          {(log.before || log.after) && (
            <div className="mt-2 p-2 rounded bg-bg-100 border border-white/[0.08]">
              {log.before && (
                <div className="mb-2">
                  <p className="text-ink-3 font-semibold mb-1">
                    {lang === 'th' ? 'ก่อนหน้า' : 'Before'}
                  </p>
                  <p className="text-[11px] text-ink-1 font-mono">
                    {JSON.stringify(log.before, null, 2)}
                  </p>
                </div>
              )}
              {log.after && (
                <div>
                  <p className="text-ink-3 font-semibold mb-1">
                    {lang === 'th' ? 'หลังจาก' : 'After'}
                  </p>
                  <p className="text-[11px] text-ink-1 font-mono">
                    {JSON.stringify(log.after, null, 2)}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

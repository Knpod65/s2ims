import * as React from 'react'
import { softCivicGovernance } from '@/config/theme'

export type GovernanceApCode = 'AP-10B' | 'AP-10C' | 'AP-11'

export interface GovernanceBlockedNoticeProps {
  apCode: GovernanceApCode
  title?: string
  reason?: string
  className?: string
}

const apCodeDefaults: Record<GovernanceApCode, { title: string; reason: string }> = {
  'AP-10B': {
    title:  'AP-10B Gate — Confirm Import Blocked',
    reason: 'Confirm Import is disabled pending AP-10B governance approval. This preview does not import data.',
  },
  'AP-10C': {
    title:  'AP-10C Gate — Export Blocked',
    reason: 'Export is disabled pending AP-10C governance approval.',
  },
  'AP-11': {
    title:  'AP-11 Gate — Approve / Reject Blocked',
    reason: 'Approve / Reject actions are disabled pending AP-11 governance approval. Current actions are diagnostic only.',
  },
}

export function GovernanceBlockedNotice({
  apCode,
  title,
  reason,
  className = '',
}: GovernanceBlockedNoticeProps) {
  const colors = softCivicGovernance[apCode.toLowerCase().replace('-', '') as keyof typeof softCivicGovernance]
  const defaults = apCodeDefaults[apCode]
  const displayTitle  = title  ?? defaults.title
  const displayReason = reason ?? defaults.reason

  return (
    <div
      className={[
        'flex flex-col gap-1 rounded-md border-l-4 px-4 py-3',
        className,
      ].filter(Boolean).join(' ')}
      style={{
        backgroundColor: colors.light,
        borderLeftColor: colors.base,
        color:           colors.text,
      }}
    >
      <p className="flex items-center gap-2 text-sm font-semibold" style={{ color: colors.base }}>
        <span aria-hidden="true">⊘</span>
        {displayTitle}
        <span className="ml-auto rounded border px-1.5 py-0.5 font-mono text-xs" style={{ borderColor: colors.base }}>
          {apCode}
        </span>
      </p>
      <p className="text-sm" style={{ color: colors.text }}>{displayReason}</p>
      <p className="text-xs italic" style={{ color: colors.text }}>
        This action requires future governance approval. It is not currently approved or complete.
      </p>
    </div>
  )
}

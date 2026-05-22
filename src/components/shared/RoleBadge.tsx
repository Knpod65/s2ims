import * as React from 'react'
import { softCivicRoles } from '@/config/theme'

export type RoleBadgeRole = 'admin' | 'staff' | 'provider' | 'student' | 'esq' | 'public'

export interface RoleBadgeProps {
  role: RoleBadgeRole
  label?: string
  size?: 'sm' | 'md'
  className?: string
}

const roleDisplayNames: Record<RoleBadgeRole, { label: string; abbr: string }> = {
  admin:    { label: 'Admin',    abbr: 'AD' },
  staff:    { label: 'Staff',    abbr: 'ST' },
  provider: { label: 'Provider', abbr: 'PR' },
  student:  { label: 'Student',  abbr: 'SN' },
  esq:      { label: 'ESQ',      abbr: 'EQ' },
  public:   { label: 'Public',   abbr: 'PB' },
}

const sizeClasses: Record<'sm' | 'md', string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
}

export function RoleBadge({
  role,
  label,
  size = 'md',
  className = '',
}: RoleBadgeProps) {
  const colors = softCivicRoles[role]
  const display = roleDisplayNames[role]
  const displayLabel = label ?? display.label

  return (
    <span
      className={[
        'inline-flex items-center rounded-full border font-medium',
        sizeClasses[size],
        className,
      ].filter(Boolean).join(' ')}
      style={{
        backgroundColor: colors.light,
        borderColor:      colors.base,
        color:            colors.base,
      }}
      aria-label={`Current role: ${displayLabel}`}
    >
      {/* Abbreviation ensures role is legible without relying on color alone. */}
      <span aria-hidden="true" className="font-mono font-bold text-[10px]">{display.abbr}</span>
      {displayLabel}
    </span>
  )
}

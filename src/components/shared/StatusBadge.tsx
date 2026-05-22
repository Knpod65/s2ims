'use client'

import * as React from 'react'

export type StatusBadgeStatus =
  | 'success'
  | 'warning'
  | 'error'
  | 'info'
  | 'neutral'
  | 'blocked'
  | 'preview'
  | 'disabled'

export type StatusBadgeSize = 'sm' | 'md'

export interface StatusBadgeProps {
  label: string
  status?: StatusBadgeStatus
  icon?: React.ReactNode
  size?: StatusBadgeSize
  className?: string
  'aria-label'?: string
}

const statusClasses: Record<StatusBadgeStatus, string> = {
  success:  'bg-[#E8F1ED] text-[#1F3D32] border-[#2E5B4A]',
  warning:  'bg-[#F5EDE3] text-[#5C3E1C] border-[#8B5E2B]',
  error:    'bg-[#F5E9E9] text-[#5C2727] border-[#8B3B3B]',
  info:     'bg-[#E8EEF6] text-[#1F3D5C] border-[#2E5B8C]',
  neutral:  'bg-gray-100  text-gray-700  border-gray-200',
  // blocked = soft civic gray — distinct from disabled
  blocked:  'bg-[#F0F0F0] text-[#3A3A3A] border-[#5C5C5C]',
  // preview = magenta-violet — NEVER amber/warning
  preview:  'bg-[#F3E9F8] text-[#4A2A5C] border-[#6B3B8C]',
  disabled: 'bg-gray-100  text-gray-400  border-gray-200',
}

const sizeClasses: Record<StatusBadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-xs gap-1.5',
}

export function StatusBadge({
  label,
  status = 'neutral',
  icon,
  size = 'md',
  className = '',
  'aria-label': ariaLabel,
}: StatusBadgeProps) {
  const classes = [
    'inline-flex items-center rounded-full border font-medium',
    statusClasses[status],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ')

  // Non-color signal icons ensure preview/blocked are distinguishable without color.
  const statusIcon = !icon && status === 'preview' ? '○' : !icon && status === 'blocked' ? '⊘' : null

  return (
    <span
      className={classes}
      aria-label={ariaLabel ?? label}
      role="img"
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {statusIcon && <span className="shrink-0 mr-0.5" aria-hidden="true">{statusIcon}</span>}
      {label}
    </span>
  )
}

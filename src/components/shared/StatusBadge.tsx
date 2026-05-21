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
  success:  'bg-emerald-100 text-emerald-800 border-emerald-200',
  warning:  'bg-amber-100   text-amber-800   border-amber-200',
  error:    'bg-red-100     text-red-800     border-red-200',
  info:     'bg-sky-100     text-sky-800     border-sky-200',
  neutral:  'bg-gray-100    text-gray-700    border-gray-200',
  blocked:  'bg-gray-200    text-gray-600    border-gray-300',
  preview:  'bg-purple-100  text-purple-800  border-purple-200',
  disabled: 'bg-gray-100    text-gray-400    border-gray-200',
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

  return (
    <span
      className={classes}
      aria-label={ariaLabel ?? label}
      role="img"
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {label}
    </span>
  )
}

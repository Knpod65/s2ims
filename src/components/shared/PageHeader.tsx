import * as React from 'react'

export interface PageHeaderProps {
  eyebrow?: string
  title: string
  description?: string
  badge?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  eyebrow,
  title,
  description,
  badge,
  actions,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={['pb-4 border-b border-gray-200', className].filter(Boolean).join(' ')}>
      {eyebrow && (
        <p className="mb-1 text-xs font-medium uppercase tracking-widest text-[#4A4E52]">
          {eyebrow}
        </p>
      )}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-semibold text-[#1B1D1F] leading-tight">
            {title}
          </h1>
          {badge && <span>{badge}</span>}
        </div>
        {actions && (
          <div className="flex items-center gap-2 flex-wrap">
            {actions}
          </div>
        )}
      </div>
      {description && (
        <p className="mt-1 text-sm text-[#4A4E52]">{description}</p>
      )}
    </div>
  )
}

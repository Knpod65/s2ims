import * as React from 'react'

export interface SectionHeaderProps {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function SectionHeader({
  title,
  description,
  action,
  className = '',
}: SectionHeaderProps) {
  return (
    <div className={['flex flex-wrap items-start justify-between gap-2 mb-3', className].filter(Boolean).join(' ')}>
      <div>
        <h2 className="text-base font-semibold text-[#1B1D1F]">{title}</h2>
        {description && (
          <p className="mt-0.5 text-sm text-[#4A4E52]">{description}</p>
        )}
      </div>
      {action && (
        <div className="shrink-0">{action}</div>
      )}
    </div>
  )
}

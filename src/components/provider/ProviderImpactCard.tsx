'use client'

import type { LucideIcon } from 'lucide-react'

type ProviderImpactCardProps = {
  label: string
  value: string | number
  helper?: string
  icon?: LucideIcon
}

export default function ProviderImpactCard({ label, value, helper, icon: Icon }: ProviderImpactCardProps) {
  return (
    <div className="card card-hover p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs text-ink-3">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold text-role-primary">{value}</p>
          {helper && <p className="mt-2 text-xs leading-relaxed text-ink-2">{helper}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl bg-role-tint p-2.5 text-role-primary">
            <Icon size={18} />
          </div>
        )}
      </div>
    </div>
  )
}

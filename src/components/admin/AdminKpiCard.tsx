'use client'

import { useLang } from '@/lib/i18n'
import { TrendingUp, TrendingDown, AlertTriangle } from 'lucide-react'

interface AdminKpiCardProps {
  value: string | number
  label_th: string
  label_en: string
  icon: React.ReactNode
  trend?: 'up' | 'down' | 'alert'
  trendValue?: number
  color?: string
  onClick?: () => void
}

export default function AdminKpiCard({
  value,
  label_th,
  label_en,
  icon,
  trend,
  trendValue,
  color = 'text-role-primary',
  onClick,
}: AdminKpiCardProps) {
  const { lang } = useLang()

  return (
    <div
      onClick={onClick}
      className={`card p-4 ${onClick ? 'cursor-pointer hover:border-line-strong' : ''} transition-all`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <p className="text-xs text-ink-3 mb-1">{lang === 'th' ? label_th : label_en}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
          {trend && trendValue !== undefined && (
            <div className={`flex items-center gap-1 mt-2 text-xs ${
              trend === 'alert' ? 'text-status-danger' : trend === 'up' ? 'text-status-danger' : 'text-status-success'
            }`}>
              {trend === 'alert' && <AlertTriangle size={12} />}
              {trend === 'up' && <TrendingUp size={12} />}
              {trend === 'down' && <TrendingDown size={12} />}
              <span>{trendValue > 0 ? '+' : ''}{trendValue}%</span>
            </div>
          )}
        </div>
        <div className={`${color} opacity-70`}>{icon}</div>
      </div>
    </div>
  )
}

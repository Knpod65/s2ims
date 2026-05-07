'use client'

import { useId } from 'react'
import { useLang } from '@/lib/i18n'

export type MatchConfidence = 'low' | 'medium' | 'high'

type MatchScoreRingProps = {
  score: number
  size?: 'sm' | 'md' | 'lg'
  confidence?: MatchConfidence
  showConfidenceLabel?: boolean
  className?: string
}

const SIZE_MAP = {
  sm: { box: 36, radius: 14, stroke: 4, text: 'text-[10px]', label: 'text-[9px]' },
  md: { box: 64, radius: 25, stroke: 6, text: 'text-base', label: 'text-[10px]' },
  lg: { box: 96, radius: 38, stroke: 8, text: 'text-2xl', label: 'text-xs' },
}

export function confidenceFromScore(score: number): MatchConfidence {
  if (score >= 80) return 'high'
  if (score >= 55) return 'medium'
  return 'low'
}

export function confidenceLabel(confidence: MatchConfidence, lang: 'th' | 'en') {
  const labels = {
    low: { th: 'ต่ำ', en: 'Low' },
    medium: { th: 'ปานกลาง', en: 'Medium' },
    high: { th: 'สูง', en: 'High' },
  }
  return labels[confidence][lang]
}

export default function MatchScoreRing({
  score,
  size = 'md',
  confidence,
  showConfidenceLabel = true,
  className = '',
}: MatchScoreRingProps) {
  const { lang } = useLang()
  const safeScore = Math.max(0, Math.min(100, Math.round(score)))
  const resolvedConfidence = confidence ?? confidenceFromScore(safeScore)
  const config = SIZE_MAP[size]
  const circumference = 2 * Math.PI * config.radius
  const offset = circumference * (1 - safeScore / 100)
  const rawId = useId()
  const gradientId = `match-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`

  return (
    <div className={`inline-flex flex-col items-center justify-center gap-1 ${className}`}>
      <div className="relative inline-flex items-center justify-center" style={{ width: config.box, height: config.box }}>
        <svg
          width={config.box}
          height={config.box}
          viewBox={`0 0 ${config.box} ${config.box}`}
          className="absolute inset-0 -rotate-90"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--role-grad-from)" />
              <stop offset="100%" stopColor="var(--role-grad-to)" />
            </linearGradient>
          </defs>
          <circle
            cx={config.box / 2}
            cy={config.box / 2}
            r={config.radius}
            fill="none"
            stroke="var(--role-tint)"
            strokeWidth={config.stroke}
          />
          <circle
            cx={config.box / 2}
            cy={config.box / 2}
            r={config.radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={config.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="motion-safe:transition-[stroke-dashoffset] motion-safe:duration-700 motion-safe:ease-out"
          />
        </svg>
        <span className={`font-display font-bold text-role-primary ${config.text}`}>
          {safeScore}%
        </span>
      </div>
      {showConfidenceLabel && (
        <span className={`${config.label} font-semibold text-ink-2 leading-none`}>
          {confidenceLabel(resolvedConfidence, lang)}
        </span>
      )}
    </div>
  )
}

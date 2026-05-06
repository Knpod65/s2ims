'use client'
import { useLang } from '@/lib/i18n'

interface Props { pct: number; missing?: string[] }

export default function ProfileCompletionRing({ pct, missing }: Props) {
  const { lang } = useLang()
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - pct / 100)
  const color = pct === 100 ? '#10B981' : pct >= 70 ? '#F59E0B' : '#EF4444'

  return (
    <div className="flex items-center gap-4">
      <div className="relative" style={{ width: 88, height: 88, flexShrink: 0 }}>
        <svg width="88" height="88" viewBox="0 0 88 88" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="44" cy="44" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle
            cx="44" cy="44" r={r} fill="none"
            stroke={color} strokeWidth="7"
            strokeDasharray={circ} strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-display font-bold" style={{ color }}>{pct}%</span>
        </div>
      </div>

      <div>
        <div className="font-semibold text-ink-1 text-sm mb-1">
          {lang === 'th' ? 'ความสมบูรณ์ของโปรไฟล์' : 'Profile Completion'}
        </div>
        {pct < 100 && missing && missing.length > 0 && (
          <div className="text-xs text-ink-3 space-y-0.5">
            {missing.slice(0, 3).map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-status-danger rounded-full" />
                {item}
              </div>
            ))}
            {missing.length > 3 && (
              <div className="text-ink-3">+{missing.length - 3} {lang === 'th' ? 'รายการ' : 'more'}</div>
            )}
          </div>
        )}
        {pct === 100 && (
          <div className="text-xs text-status-success">
            ✓ {lang === 'th' ? 'โปรไฟล์สมบูรณ์แล้ว' : 'Profile complete'}
          </div>
        )}
      </div>
    </div>
  )
}

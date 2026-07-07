interface MatchScoreMeterProps {
  score: number
  compact?: boolean
}

export default function MatchScoreMeter({ score, compact = false }: MatchScoreMeterProps) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)))

  return (
    <div className={compact ? 'space-y-1.5' : 'space-y-2'} aria-label={`คะแนนความเหมาะสม ${safeScore} เปอร์เซ็นต์`}>
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="break-words text-[10px] font-semibold uppercase tracking-[0.14em] text-cyber-slate/70">
            คะแนนความเหมาะสม
          </div>
          {!compact && (
            <div className="break-words text-xs text-cyber-slate/70">
              ใช้เพื่อจัดอันดับ ไม่ใช่ผลอนุมัติ
            </div>
          )}
        </div>
        <div className="flex-shrink-0 font-display text-2xl font-bold leading-none text-cyber-slate">
          {safeScore}<span className="text-sm text-cyber-slate/65">%</span>
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/75 ring-1 ring-cyber-border/55">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-mint transition-[width] duration-base ease-cyber"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  )
}

interface MatchScoreMeterProps {
  score: number
  compact?: boolean
}

export default function MatchScoreMeter({ score, compact = false }: MatchScoreMeterProps) {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)))

  return (
    <div className={compact ? 'space-y-1.5' : 'space-y-2'}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-cyber-slate/55">
            คะแนนความเหมาะสม
          </div>
          {!compact && <div className="text-xs text-cyber-slate/60">ใช้เพื่อจัดอันดับ ไม่ใช่ผลอนุมัติ</div>}
        </div>
        <div className="font-display text-2xl font-bold leading-none text-cyber-slate">
          {safeScore}<span className="text-sm text-cyber-slate/55">%</span>
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/70 ring-1 ring-cyber-border/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-violet to-cyber-mint transition-[width] duration-base ease-cyber"
          style={{ width: `${safeScore}%` }}
        />
      </div>
    </div>
  )
}

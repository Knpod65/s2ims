interface WorkHourProgressBarProps {
  confirmedHours: number
  requiredHours: number
}

export default function WorkHourProgressBar({ confirmedHours, requiredHours }: WorkHourProgressBarProps) {
  const percent = requiredHours > 0 ? Math.min(100, Math.round((confirmedHours / requiredHours) * 100)) : 0

  return (
    <div>
      <div className="mb-2 flex items-end justify-between gap-3">
        <div>
          <div className="text-2xl font-bold text-cyber-slate">{confirmedHours.toFixed(2)}</div>
          <div className="text-xs font-semibold text-cyber-slate/70">ชั่วโมงที่ผู้ดูแลยืนยันแล้ว</div>
        </div>
        <div className="text-right text-xs font-bold text-cyber-slate/70">
          จาก {requiredHours.toFixed(0)} ชั่วโมง
        </div>
      </div>
      <div className="h-3 overflow-hidden rounded-full border border-cyber-border/45 bg-white/65">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-mint to-cyber-violet"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="mt-1 text-[11px] font-semibold text-cyber-slate/65">{percent}% ของชั่วโมงที่ต้องครบ</div>
    </div>
  )
}

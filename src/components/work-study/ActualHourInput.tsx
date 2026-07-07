'use client'

interface ActualHourInputProps {
  value: number
  submittedHours: number
  onChange: (value: number) => void
}

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

export default function ActualHourInput({ value, submittedHours, onChange }: ActualHourInputProps) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-cyber-slate">ชั่วโมงจริงที่ยืนยัน</span>
      <input
        type="number"
        min="0"
        step="0.25"
        value={value}
        onChange={(event) => onChange(Math.max(0, Number(event.target.value)))}
        className={`mt-1 min-h-11 w-full rounded-lg border border-cyber-border/55 bg-white/75 px-3 py-2 text-sm font-bold text-cyber-slate outline-none ${focusClass}`}
      />
      <span className="mt-1 block text-[11px] text-cyber-slate/65">
        นักศึกษาส่ง {submittedHours.toFixed(2)} ชั่วโมง ผู้ดูแลสามารถปรับตามเวลาจริง
      </span>
    </label>
  )
}

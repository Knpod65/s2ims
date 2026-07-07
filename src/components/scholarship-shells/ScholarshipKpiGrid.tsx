import type { ScholarshipShellKpi } from '@/data/mock/scholarshipRoleShells'

const TONES: Record<ScholarshipShellKpi['tone'], string> = {
  cyan: 'border-cyber-cyan/45 bg-cyber-cyan/25',
  violet: 'border-cyber-violet/45 bg-cyber-violet/25',
  mint: 'border-cyber-mint/45 bg-cyber-mint/30',
  peach: 'border-cyber-peach/45 bg-cyber-peach/30',
}

export default function ScholarshipKpiGrid({ kpis }: { kpis: ScholarshipShellKpi[] }) {
  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className={`rounded-lg border p-3 ${TONES[kpi.tone]}`}>
          <div className="break-words text-xl font-bold text-cyber-slate">{kpi.value}</div>
          <div className="mt-1 break-words text-[11px] font-bold text-cyber-slate">{kpi.label}</div>
          <div className="mt-1 break-words text-[11px] leading-snug text-cyber-slate/65">{kpi.helper}</div>
        </div>
      ))}
    </div>
  )
}

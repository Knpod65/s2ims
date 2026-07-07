import { CircleDot } from 'lucide-react'
import type { ScholarshipWorkflowItem } from '@/data/mock/scholarshipRoleShells'

export default function ScholarshipWorkflowCard({ item }: { item: ScholarshipWorkflowItem }) {
  return (
    <article className="rounded-xl border border-cyber-border/45 bg-white/65 p-4 text-cyber-slate shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-sm font-bold">{item.title}</h3>
          <p className="mt-1 break-words text-xs leading-relaxed text-cyber-slate/70">{item.description}</p>
        </div>
        <CircleDot size={16} className="mt-0.5 flex-shrink-0 text-cyan-800" aria-hidden="true" />
      </div>
      <span className="inline-flex rounded-full border border-cyber-cyan/45 bg-cyber-cyan/20 px-3 py-1 text-[11px] font-bold text-cyber-slate">
        {item.status}
      </span>
    </article>
  )
}

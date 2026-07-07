import { Paperclip } from 'lucide-react'

export default function EvidenceAttachmentChip({ reference }: { reference?: string }) {
  if (!reference) {
    return (
      <span className="inline-flex min-h-8 items-center rounded-full border border-cyber-border/45 bg-white/60 px-3 py-1 text-[11px] font-semibold text-cyber-slate/65">
        ไม่มีหลักฐานแนบ
      </span>
    )
  }

  return (
    <span className="inline-flex max-w-full min-h-8 items-center gap-1.5 rounded-full border border-cyber-cyan/45 bg-cyber-cyan/20 px-3 py-1 text-[11px] font-semibold text-cyber-slate">
      <Paperclip size={13} className="flex-shrink-0 text-cyan-800" aria-hidden="true" />
      <span className="truncate">{reference}</span>
    </span>
  )
}

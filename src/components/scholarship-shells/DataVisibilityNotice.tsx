import { ShieldCheck } from 'lucide-react'

export default function DataVisibilityNotice({ note }: { note: string }) {
  return (
    <div className="rounded-xl border border-cyber-violet/45 bg-cyber-violet/20 p-4 text-cyber-slate shadow-sm">
      <div className="mb-2 flex items-center gap-2">
        <ShieldCheck size={16} className="text-violet-800" aria-hidden="true" />
        <h2 className="text-sm font-bold">PDPA และขอบเขตการมองเห็น</h2>
      </div>
      <p className="break-words text-xs leading-relaxed text-cyber-slate/75">{note}</p>
    </div>
  )
}

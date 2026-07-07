import { FileSearch } from 'lucide-react'
import type { WorkLog } from '@/lib/types'
import EvidenceAttachmentChip from './EvidenceAttachmentChip'

export default function WorkEvidencePreviewPanel({ log }: { log: WorkLog }) {
  return (
    <aside className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="mb-3 flex items-center gap-2">
        <FileSearch size={16} className="text-cyan-800" aria-hidden="true" />
        <h2 className="text-sm font-bold">หลักฐานประกอบ</h2>
      </div>
      <EvidenceAttachmentChip reference={log.evidence_reference} />
      <div className="mt-3 rounded-lg border border-cyber-border/35 bg-white/60 p-3">
        <div className="text-[11px] font-bold text-cyber-slate">รายละเอียดงานที่ส่ง</div>
        <p className="mt-1 break-words text-xs leading-relaxed text-cyber-slate/75">{log.task_description}</p>
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-cyber-slate/65">
        หน้านี้เป็น mock-only shell สำหรับตรวจหลักฐานอ้างอิงและบันทึกผลในหน้าจอเท่านั้น
      </p>
    </aside>
  )
}

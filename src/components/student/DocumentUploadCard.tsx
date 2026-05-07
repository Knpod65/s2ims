'use client'
import { UploadCloud } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { StudentDocumentItem } from '@/data/mock/studentApplicationData'
import RequiredDocumentsList from './RequiredDocumentsList'

type DocumentUploadCardProps = {
  document: StudentDocumentItem
  className?: string
}

export default function DocumentUploadCard({ document, className = '' }: DocumentUploadCardProps) {
  const { lang } = useLang()

  return (
    <div className={`card p-4 ${document.state === 'missing' ? 'border-dashed border-[#0055FF]/35' : ''} ${className}`}>
      <RequiredDocumentsList documents={[document]} showActions />
      <button
        type="button"
        className="mt-4 flex min-h-[72px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[#0055FF]/35 bg-[#E5EDFF]/50 px-4 py-4 text-center text-role-primary transition hover:border-role-border hover:bg-role-tint"
      >
        <UploadCloud size={24} />
        <span className="text-sm font-semibold">
          {lang === 'th' ? 'เลือกไฟล์เพื่ออัปโหลดแบบจำลอง' : 'Choose file for mock upload'}
        </span>
        <span className="text-xs text-ink-3">
          {lang === 'th' ? 'รองรับ' : 'Accepted'} {document.acceptedTypes.join(', ')}
        </span>
      </button>
    </div>
  )
}

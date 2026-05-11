'use client'
import { AlertTriangle, CheckCircle2, Clock, FileText, RefreshCw, UploadCloud } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { StudentDocumentItem } from '@/data/mock/studentApplicationData'
import {
  getStudentDocumentStatusClassName,
  getStudentDocumentStatusLabel,
  requiresStudentDocumentAttention,
} from '@/config/documentStatusDisplay'
import UploadProgressIndicator from './UploadProgressIndicator'
import FileValidationError from './FileValidationError'

type DocumentUploadCardProps = {
  document: StudentDocumentItem
  className?: string
}

export default function DocumentUploadCard({ document, className = '' }: DocumentUploadCardProps) {
  const { lang } = useLang()

  const iconByState = {
    missing: UploadCloud,
    uploading: RefreshCw,
    uploaded: CheckCircle2,
    invalid_file_type: AlertTriangle,
    verification_pending: Clock,
    verified: CheckCircle2,
    rejected: AlertTriangle,
    needs_replacement: RefreshCw,
  } as const

  const Icon = iconByState[document.state]
  const needsAttention = requiresStudentDocumentAttention(document.state)

  return (
    <div className={`card p-4 ${document.state === 'missing' ? 'border-dashed border-[#0055FF]/35' : ''} ${className}`}>
      <div className="rounded-xl border bg-white p-4 border-line">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <FileText size={16} className="text-role-primary" />
              <h3 className="text-sm font-semibold text-ink-1">{document.label[lang]}</h3>
              {document.required && (
                <span className="rounded-full border border-line bg-surface-low px-2 py-0.5 text-[10px] font-semibold text-ink-3">
                  {lang === 'th' ? 'จำเป็น' : 'Required'}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs leading-relaxed text-ink-2">{document.description[lang]}</p>
            {document.fileName && <div className="mt-2 font-mono text-[11px] text-ink-3">{document.fileName}</div>}
          </div>
          <span className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${getStudentDocumentStatusClassName(document.state)}`}>
            <Icon size={13} />
            {getStudentDocumentStatusLabel(document.state, lang)}
          </span>
        </div>

        <p className="mt-3 text-xs leading-relaxed text-ink-3">{document.guidance[lang]}</p>

        {document.state === 'uploading' && document.progress !== undefined && (
          <UploadProgressIndicator progress={document.progress} className="mt-3" />
        )}

        {document.state === 'invalid_file_type' && (
          <FileValidationError acceptedTypes={document.acceptedTypes} className="mt-3" />
        )}

        {needsAttention && (
          <button type="button" className="btn-primary mt-3 inline-flex min-h-11 items-center gap-2 px-4 py-2 text-xs">
            <UploadCloud size={14} />
            {lang === 'th' ? 'เพิ่มหรือแทนที่เอกสาร' : 'Add or replace document'}
          </button>
        )}
      </div>
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

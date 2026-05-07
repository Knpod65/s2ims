'use client'
import { AlertTriangle, CheckCircle2, Clock, FileText, RefreshCw, UploadCloud } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { StudentDocumentItem, StudentDocumentState } from '@/data/mock/studentApplicationData'
import { documentStateLabels } from '@/data/mock/studentApplicationData'
import UploadProgressIndicator from './UploadProgressIndicator'
import FileValidationError from './FileValidationError'

type RequiredDocumentsListProps = {
  documents: StudentDocumentItem[]
  showActions?: boolean
  className?: string
}

const STATE_STYLE: Record<StudentDocumentState, string> = {
  missing: 'bg-[#E5EDFF] text-role-primary border-[#0055FF]/20',
  uploading: 'bg-blue-50 text-blue-700 border-blue-200',
  uploaded: 'bg-[#E5EDFF] text-role-primary border-[#0055FF]/20',
  invalid_file_type: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  verification_pending: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
  needs_replacement: 'bg-[#FFFBEB] text-[#78350F] border-[#FDE68A]',
}

const STATE_ICON = {
  missing: UploadCloud,
  uploading: RefreshCw,
  uploaded: CheckCircle2,
  invalid_file_type: AlertTriangle,
  verification_pending: Clock,
  verified: CheckCircle2,
  rejected: AlertTriangle,
  needs_replacement: RefreshCw,
}

export default function RequiredDocumentsList({ documents, showActions = false, className = '' }: RequiredDocumentsListProps) {
  const { lang } = useLang()

  return (
    <div className={`space-y-3 ${className}`}>
      {documents.map(document => {
        const Icon = STATE_ICON[document.state]
        const needsAttention = ['missing', 'invalid_file_type', 'rejected', 'needs_replacement'].includes(document.state)
        return (
          <div key={document.id} className={`rounded-xl border bg-white p-4 ${
            document.state === 'missing'
              ? 'border-dashed border-[#0055FF]/35'
              : 'border-line'
          }`}>
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
                {document.fileName && (
                  <div className="mt-2 font-mono text-[11px] text-ink-3">{document.fileName}</div>
                )}
              </div>
              <span className={`inline-flex min-h-8 shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${STATE_STYLE[document.state]}`}>
                <Icon size={13} />
                {documentStateLabels[document.state][lang]}
              </span>
            </div>

            <p className="mt-3 text-xs leading-relaxed text-ink-3">{document.guidance[lang]}</p>

            {document.state === 'uploading' && document.progress !== undefined && (
              <UploadProgressIndicator progress={document.progress} className="mt-3" />
            )}

            {document.state === 'invalid_file_type' && (
              <FileValidationError acceptedTypes={document.acceptedTypes} className="mt-3" />
            )}

            {showActions && needsAttention && (
              <button type="button" className="btn-primary mt-3 inline-flex min-h-11 items-center gap-2 px-4 py-2 text-xs">
                <UploadCloud size={14} />
                {lang === 'th' ? 'เพิ่มหรือแทนที่เอกสาร' : 'Add or replace document'}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

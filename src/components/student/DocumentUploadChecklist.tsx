'use client'
import type { StudentDocumentItem } from '@/data/mock/studentApplicationData'
import DocumentUploadCard from './DocumentUploadCard'

type DocumentUploadChecklistProps = {
  documents: StudentDocumentItem[]
  className?: string
}

export default function DocumentUploadChecklist({ documents, className = '' }: DocumentUploadChecklistProps) {
  return (
    <div className={`grid gap-4 ${className}`}>
      {documents.map(document => (
        <DocumentUploadCard key={document.id} document={document} />
      ))}
    </div>
  )
}

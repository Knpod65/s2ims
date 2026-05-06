'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockAnnouncements } from '@/data/mock/announcements'
import { PageHeader, EmptyState } from '@/components/ui/index'
import { useToast } from '@/components/ui/Toast'
import { Send, Download, FileText } from 'lucide-react'
import Link from 'next/link'

export default function AnnouncementPreviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { lang } = useLang()
  const { addToast } = useToast()
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const ann = mockAnnouncements.find(a => a.id === id) ?? mockAnnouncements[0]

  const handleSubmitToESQ = async () => {
    setSubmitting(true)
    await new Promise(r => setTimeout(r, 700))
    setSubmitted(true)
    setSubmitting(false)
    addToast(
      lang === 'th'
        ? 'ส่งให้ ESQ อนุมัติแล้ว — รอการตอบกลับ'
        : 'Submitted to ESQ for approval — awaiting response',
      'success'
    )
    setTimeout(() => router.push('/staff/dashboard'), 1500)
  }

  const handleDownloadPDF = () => {
    addToast(
      lang === 'th' ? 'กำลังสร้าง PDF... (จำลอง)' : 'Generating PDF... (mock)',
      'info'
    )
  }

  if (!ann) {
    return (
      <AppShell requiredRole="staff">
        <EmptyState
          icon={<FileText size={32} />}
          title={lang === 'th' ? 'ไม่พบประกาศ' : 'Announcement not found'}
          action={<Link href="/staff/announcements/new" className="btn-secondary text-xs py-2 px-4">← {lang === 'th' ? 'กลับ' : 'Back'}</Link>}
        />
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="staff">
      <PageHeader
        title={lang === 'th' ? 'ตัวอย่างประกาศ' : 'Announcement Preview'}
        subtitle={lang === 'th' ? ann.title_th : ann.title_en}
        actions={
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <Download size={12}/>{lang === 'th' ? 'ดาวน์โหลด PDF' : 'Download PDF'}
            </button>
            <button
              onClick={handleSubmitToESQ}
              disabled={submitting || submitted}
              className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5 disabled:opacity-60"
            >
              {submitting
                ? <span className="w-3 h-3 border border-white/40 border-t-white rounded-full animate-spin"/>
                : <Send size={12}/>
              }
              {submitted
                ? (lang === 'th' ? 'ส่งแล้ว ✓' : 'Submitted ✓')
                : (lang === 'th' ? 'ส่งให้ ESQ อนุมัติ' : 'Submit to ESQ')
              }
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Thai */}
        <div className="card p-5 space-y-4">
          <div className="text-[10px] text-ink-3 uppercase tracking-widest">🇹🇭 ภาษาไทย</div>
          <h2 className="font-display font-bold text-base text-ink-1">{ann.title_th}</h2>
          <p className="text-sm text-ink-2 leading-relaxed">{ann.body_th}</p>
          {ann.deadline && (
            <div className="pt-3 border-t border-white/[0.06] text-xs text-ink-3">
              📅 กำหนดส่ง: <span className="text-ink-1">{ann.deadline}</span>
            </div>
          )}
        </div>

        {/* English */}
        <div className="card p-5 space-y-4">
          <div className="text-[10px] text-ink-3 uppercase tracking-widest">🇺🇸 English</div>
          <h2 className="font-display font-bold text-base text-ink-1">{ann.title_en}</h2>
          <p className="text-sm text-ink-2 leading-relaxed">{ann.body_en}</p>
          {ann.deadline && (
            <div className="pt-3 border-t border-white/[0.06] text-xs text-ink-3">
              📅 Deadline: <span className="text-ink-1">{ann.deadline}</span>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

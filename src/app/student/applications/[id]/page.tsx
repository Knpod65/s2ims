'use client'
import { use, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockApplications } from '@/data/mock/applications'
import { APP_STATUS_MAP } from '@/lib/utils'
import { StatusBadge, PageHeader, EmptyState } from '@/components/ui/index'
import { useToast } from '@/components/ui/Toast'
import ApplicationTimeline from '@/components/ApplicationTimeline'
import { CheckCircle2, AlertCircle, Clock, Upload, ThumbsUp, FileText } from 'lucide-react'
import type { ApplicationStatus } from '@/lib/types'
import Link from 'next/link'

export default function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { lang } = useLang()
  const { addToast } = useToast()

  const appData = mockApplications.find(a => a.id === id)
  const [status, setStatus] = useState<ApplicationStatus>(appData?.status ?? 'DRAFT')

  if (!appData) {
    return (
      <AppShell requiredRole="student">
        <EmptyState
          icon={<FileText size={32} />}
          title={lang === 'th' ? 'ไม่พบใบสมัคร' : 'Application not found'}
          action={<Link href="/student/applications" className="btn-secondary text-xs py-2 px-4">{lang === 'th' ? '← กลับรายการ' : '← Back to list'}</Link>}
        />
      </AppShell>
    )
  }

  const si = APP_STATUS_MAP[status]
  const title = lang === 'th' ? appData.scholarship_title_th : appData.scholarship_title_en

  const handleConfirm = async () => {
    await new Promise(r => setTimeout(r, 500))
    setStatus('CONFIRMED')
    addToast(
      lang === 'th' ? 'ยืนยันการรับทุนแล้ว! ทีมการเงินจะติดต่อกลับเร็วๆ นี้' : 'Scholarship accepted! Finance team will contact you soon.',
      'success'
    )
  }

  return (
    <AppShell requiredRole="student">
      <PageHeader
        title={lang === 'th' ? 'รายละเอียดใบสมัคร' : 'Application Detail'}
        subtitle={title}
        badge={<StatusBadge label={si[lang === 'th' ? 'th' : 'en']} color={si.color} />}
      />

      {/* Confirm acceptance banner */}
      {status === 'AWARDED' && (
        <div className="mb-6 p-4 rounded-xl bg-status-success/[0.08] border border-status-success/30 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex-1">
            <div className="font-semibold text-sm text-status-success flex items-center gap-2 mb-1">
              <ThumbsUp size={16} />
              {lang === 'th' ? 'ยินดีด้วย! คุณได้รับทุน' : 'Congratulations! You have been awarded'}
            </div>
            <div className="text-xs text-ink-2">
              {lang === 'th'
                ? 'กรุณายืนยันการรับทุนภายใน 7 วัน มิฉะนั้นสิทธิ์จะถูกยกเลิก'
                : 'Please confirm acceptance within 7 days or the award will be forfeited.'}
            </div>
          </div>
          <button
            onClick={handleConfirm}
            className="btn-success text-sm px-5 py-2.5 flex-shrink-0 flex items-center gap-2"
          >
            <CheckCircle2 size={15} />
            {lang === 'th' ? 'ยืนยันรับทุน' : 'Accept Award'}
          </button>
        </div>
      )}

      {/* Confirmed banner */}
      {status === 'CONFIRMED' && (
        <div className="mb-6 p-4 rounded-xl bg-status-success/[0.06] border border-status-success/20 flex items-center gap-3">
          <CheckCircle2 size={16} className="text-status-success flex-shrink-0" />
          <span className="text-sm text-status-success">
            {lang === 'th' ? 'ยืนยันการรับทุนแล้ว — รอการดำเนินการด้านการเงิน' : 'Award accepted — awaiting finance processing'}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">
            {lang === 'th' ? 'ขั้นตอนการสมัคร' : 'Application Timeline'}
          </h3>
          <ApplicationTimeline steps={appData.steps} />
        </div>

        {/* Documents */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">
            {lang === 'th' ? 'เอกสารที่ต้องส่ง' : 'Required Documents'}
          </h3>
          <div className="space-y-2">
            {appData.docs_required.map(doc => {
              const label = lang === 'th' ? doc.label_th : doc.label_en
              return (
                <div
                  key={doc.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    doc.status === 'verified' ? 'border-status-success/20 bg-status-success/[0.04]' :
                    doc.status === 'missing'  ? 'border-status-danger/30 bg-status-danger/[0.04]' :
                    doc.status === 'uploaded' ? 'border-status-info/20 bg-status-info/[0.04]' :
                    'border-white/[0.08] bg-bg-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    {doc.status === 'verified' && <CheckCircle2 size={16} className="text-status-success" />}
                    {doc.status === 'missing'  && <AlertCircle  size={16} className="text-status-danger" />}
                    {doc.status === 'pending'  && <Clock        size={16} className="text-ink-3" />}
                    {doc.status === 'uploaded' && <CheckCircle2 size={16} className="text-status-info" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-ink-1">{label}</div>
                    {doc.uploaded_at && doc.status === 'uploaded' && (
                      <div className="text-[10px] text-ink-3 mt-0.5">
                        {lang === 'th' ? 'อัปโหลดเมื่อ' : 'Uploaded'} {new Date(doc.uploaded_at).toLocaleDateString()}
                      </div>
                    )}
                    {doc.note && (
                      <div className="text-[10px] text-status-danger mt-0.5">{doc.note}</div>
                    )}
                  </div>
                  {(doc.status === 'missing' || doc.status === 'pending') && (
                    <label className="flex items-center gap-1 text-[10px] px-2 py-1 bg-brand/10 text-brand rounded border border-brand/20 cursor-pointer hover:bg-brand/20 transition-colors">
                      <Upload size={10} />
                      {lang === 'th' ? 'อัปโหลด' : 'Upload'}
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={() =>
                          addToast(
                            lang === 'th' ? `อัปโหลด ${label} แล้ว` : `${label} uploaded`,
                            'success'
                          )
                        }
                      />
                    </label>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { mockAnnouncements } from '@/data/mock/announcements'
import { PageHeader } from '@/components/ui/index'
import { CheckCircle2, XCircle, MessageSquare, ArrowLeft, Clock } from 'lucide-react'
import Link from 'next/link'

export default function ESQReviewPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { lang } = useLang()
  const ann = mockAnnouncements.find(a => a.id === id) || mockAnnouncements[0]
  const [decision, setDecision] = useState<string | null>(null)
  const [comment, setComment] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const handleDecision = (d: string) => {
    if (!comment && d !== 'approved') return
    setDecision(d)
    setConfirmed(true)
  }

  if (confirmed && decision) {
    const colors = { approved: 'status-success', revision: 'role-primary', rejected: 'status-danger' }
    const icons = { approved: '✅', revision: '✏️', rejected: '❌' }
    const labels_th = { approved: 'อนุมัติแล้ว', revision: 'ส่งกลับเพื่อแก้ไข', rejected: 'ไม่อนุมัติ' }
    const labels_en = { approved: 'Approved', revision: 'Revision Requested', rejected: 'Rejected' }
    return (
      <AppShell requiredRole="esq">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="card p-10 max-w-sm text-center">
            <div className="text-4xl mb-4">{icons[decision as keyof typeof icons]}</div>
            <div className="font-display font-bold text-lg text-ink-1 mb-2">
              {lang==='th' ? labels_th[decision as keyof typeof labels_th] : labels_en[decision as keyof typeof labels_en]}
            </div>
            <div className="text-sm text-ink-3 mb-6">
              {lang==='th'?'การตัดสินใจถูกบันทึกใน Audit Log แล้ว':'Decision logged in audit trail.'}
              {comment && <div className="mt-2 p-2 bg-surface-low rounded text-xs">{comment}</div>}
            </div>
            <Link href="/esq/dashboard" className="btn-primary text-xs py-2 px-4 inline-block">
              {lang==='th'?'กลับแดชบอร์ด':'Back to Dashboard'}
            </Link>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="esq">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/esq/dashboard" className="flex items-center gap-1.5 text-ink-3 hover:text-ink-1 text-xs transition-colors">
          <ArrowLeft size={13}/>{lang==='th'?'กลับ':'Back'}
        </Link>
      </div>
      <PageHeader
        title={lang==='th'?'ตรวจสอบประกาศ':'Review Announcement'}
        subtitle={lang==='th'?ann.title_th:ann.title_en}
      />

      {ann.sla_hours !== undefined && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border mb-5 ${ann.sla_hours < 24 ? 'bg-status-danger/[0.06] border-status-danger/25' : 'bg-role-tint border-role-border'}`}>
          <Clock size={14} className={ann.sla_hours < 24 ? 'text-status-danger' : 'text-role-primary'}/>
          <span className={`text-sm font-medium ${ann.sla_hours < 24 ? 'text-status-danger' : 'text-role-primary'}`}>
            SLA: {ann.sla_hours} {lang==='th'?'ชั่วโมงที่เหลือ':'hours remaining'}
            {ann.sla_hours < 24 && (lang==='th'?' — ด่วน!':' — Urgent!')}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Content preview */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card p-6">
            <div className="text-[10px] text-ink-3 uppercase tracking-widest mb-3 pb-2 border-b border-line">
              🇹🇭 ภาษาไทย
            </div>
            <h2 className="font-display font-bold text-lg text-ink-1 mb-3">{ann.title_th}</h2>
            <p className="text-sm text-ink-2 leading-relaxed">{ann.body_th}</p>
          </div>
          <div className="card p-6 border-line">
            <div className="text-[10px] text-ink-3 uppercase tracking-widest mb-3 pb-2 border-b border-line">
              🇺🇸 English Version
            </div>
            <h2 className="font-display font-bold text-lg text-ink-1 mb-3">{ann.title_en}</h2>
            <p className="text-sm text-ink-2 leading-relaxed">{ann.body_en}</p>
          </div>
        </div>

        {/* Decision panel */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'การตัดสินใจ':'Decision'}</h3>

            <div className="space-y-2.5 mb-4">
              <button
                onClick={() => { setDecision('approved'); setConfirmed(true) }}
                className="btn-success w-full flex items-center justify-center gap-2 py-3 text-sm"
              >
                <CheckCircle2 size={16}/>{lang==='th'?'อนุมัติ':'Approve'}
              </button>
              <button
                onClick={() => setDecision(decision === 'revision' ? null : 'revision')}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl border transition-all ${decision==='revision'?'border-role-border bg-role-tint text-role-primary':'btn-secondary'}`}
              >
                <MessageSquare size={15}/>{lang==='th'?'ขอแก้ไข':'Request Revision'}
              </button>
              <button
                onClick={() => setDecision(decision === 'rejected' ? null : 'rejected')}
                className={`w-full flex items-center justify-center gap-2 py-2.5 text-sm rounded-xl border transition-all ${decision==='rejected'?'border-red-300 bg-red-50 text-red-700':'btn-danger'}`}
              >
                <XCircle size={15}/>{lang==='th'?'ไม่อนุมัติ':'Reject'}
              </button>
            </div>

            {(decision === 'revision' || decision === 'rejected') && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-ink-3 block mb-1">
                    {lang==='th'?'ความเห็น (ส่งถึงเจ้าหน้าที่) *':'Comment (sent to staff) *'}
                  </label>
                  <textarea
                    className="input-base h-24 resize-none text-xs"
                    value={comment}
                    onChange={e=>setComment(e.target.value)}
                    placeholder={lang==='th'?'ระบุสิ่งที่ต้องแก้ไขหรือเหตุผล...':'Specify what needs to be revised or reason...'}
                  />
                </div>
                <button
                  onClick={() => handleDecision(decision)}
                  disabled={!comment}
                  className={`w-full py-2.5 text-sm rounded-xl font-semibold transition-all ${comment ? 'btn-primary' : 'bg-white border border-line text-ink-3 cursor-not-allowed'}`}
                >
                  {lang==='th'?'ยืนยันการตัดสินใจ':'Confirm Decision'}
                </button>
              </div>
            )}
          </div>

          <div className="card-sm p-4">
            <div className="text-xs text-ink-3 mb-2">{lang==='th'?'ข้อมูลประกาศ':'Announcement Info'}</div>
            <div className="space-y-1.5 text-xs text-ink-2">
              <div>ID: <span className="font-mono text-ink-3">{ann.id}</span></div>
              <div>{lang==='th'?'สร้างเมื่อ':'Created'}: <span className="text-ink-3">{ann.created_at.split('T')[0]}</span></div>
              <div>{lang==='th'?'สร้างโดย':'By'}: <span className="text-ink-3">น.ส.รัตนา มะลิวัลย์</span></div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

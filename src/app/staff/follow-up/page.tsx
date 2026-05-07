'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { useToast } from '@/components/ui/Toast'
import { AlertTriangle, Send, CheckCircle2 } from 'lucide-react'

const MOCK_FOLLOWUPS = [
  { student: '650912345', name_th: 'นายพิชญ์ ใจดี', name_en: 'Phich Jaidee', scholarship_th: 'ทุน JCC', scholarship_en: 'JCC Scholarship', due: '2025-06-30', status: 'FOLLOW_UP_REQUIRED' as const },
  { student: '650923456', name_th: 'น.ส.มาลี สวัสดี', name_en: 'Mali Sawatdi', scholarship_th: 'ทุนนวัตกรรมฯ', scholarship_en: 'Innovation Scholarship', due: '2025-05-31', status: 'REPORT_OVERDUE' as const },
]

export default function StaffFollowUpPage() {
  const { lang } = useLang()
  const { addToast } = useToast()
  const [reminded, setReminded] = useState<Record<number, boolean>>({})

  const handleRemind = (i: number, name: string) => {
    setReminded(prev => ({ ...prev, [i]: true }))
    addToast(
      lang === 'th' ? `ส่งการแจ้งเตือนถึง ${name} แล้ว` : `Reminder sent to ${name}`,
      'success'
    )
  }

  return (
    <AppShell requiredRole="staff">
      <PageHeader title={lang==='th'?'ติดตามรายงานผล':'Follow-up Tracking'} subtitle={lang==='th'?'ติดตามการส่งรายงานของผู้รับทุน':'Track report submissions from scholarship recipients'}/>
      <div className="space-y-3">
        {MOCK_FOLLOWUPS.map((f, i) => {
          const days = Math.ceil((new Date(f.due).getTime() - Date.now()) / 86400000)
          const isOverdue = days < 0
          const isSent = reminded[i]
          return (
            <div key={i} className={`card p-4 ${isOverdue?'border-status-danger/30':''}`}>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-medium text-sm text-ink-1">{lang==='th'?f.name_th:f.name_en}</div>
                  <div className="text-xs text-ink-3 mt-0.5">{lang==='th'?f.scholarship_th:f.scholarship_en} · ID: {f.student}</div>
                  <div className={`flex items-center gap-1 text-xs mt-1.5 ${isOverdue?'text-status-danger':'text-role-primary'}`}>
                    {isOverdue && <AlertTriangle size={11}/>}
                    {isOverdue
                      ? `${lang==='th'?'ล่าช้า':'Overdue'} ${Math.abs(days)} ${lang==='th'?'วัน':'days'}`
                      : `${lang==='th'?'กำหนดส่ง':'Due'}: ${new Date(f.due).toLocaleDateString(lang==='th'?'th-TH':'en-US')}`
                    }
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge
                    label={isOverdue?(lang==='th'?'รายงานล่าช้า':'Report Overdue'):(lang==='th'?'ต้องส่งรายงาน':'Report Required')}
                    color={isOverdue?'bg-red-50 text-red-700 border-red-200':'bg-role-tint text-role-primary-2 border-role-border'}
                  />
                  <button
                    onClick={() => handleRemind(i, lang==='th'?f.name_th:f.name_en)}
                    disabled={isSent}
                    className={`text-xs flex items-center gap-1.5 py-1.5 px-3 rounded-lg border transition-all ${isSent?'bg-emerald-50 text-emerald-700 border-emerald-200 cursor-default':'btn-secondary'}`}
                  >
                    {isSent ? <CheckCircle2 size={11}/> : <Send size={11}/>}
                    {isSent ? (lang==='th'?'ส่งแล้ว':'Sent') : (lang==='th'?'แจ้งเตือน':'Remind')}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AppShell>
  )
}

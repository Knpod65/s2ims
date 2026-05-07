'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { Upload, Clock, CheckCircle2, FileText, Image, Send } from 'lucide-react'

export default function StudentFollowUpPage() {
  const { lang } = useLang()
  const [text, setText] = useState('')
  const [achievements, setAchievements] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const daysLeft = 33

  return (
    <AppShell requiredRole="student">
      <PageHeader
        title={lang==='th'?'รายงานผลการใช้ทุน':'Follow-up Report'}
        subtitle={lang==='th'?'ส่งรายงานผลการใช้ทุนและกิจกรรมที่ดำเนินการ':'Submit your scholarship usage report and activities'}
      />

      {submitted ? (
        <div className="card p-10 max-w-lg text-center">
          <div className="text-4xl mb-4">🎉</div>
          <div className="font-display font-bold text-lg text-status-success mb-2">
            {lang==='th'?'ส่งรายงานสำเร็จ!':'Report Submitted!'}
          </div>
          <div className="text-sm text-ink-3">
            {lang==='th'?'ขอบคุณที่ส่งรายงาน เจ้าหน้าที่จะตรวจสอบและแจ้งผลภายใน 7 วัน':'Thank you for submitting. Staff will review within 7 days.'}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl space-y-4">
          {/* Deadline notice */}
          <div className={`flex items-center gap-3 p-3 rounded-xl border ${daysLeft <= 7 ? 'bg-status-danger/[0.06] border-status-danger/25' : 'bg-role-tint border-role-border'}`}>
            <Clock size={15} className={daysLeft <= 7 ? 'text-status-danger' : 'text-role-primary'}/>
            <div className="text-sm">
              <span className={`font-semibold ${daysLeft <= 7 ? 'text-status-danger' : 'text-role-primary'}`}>
                {daysLeft} {lang==='th'?'วัน':'days'}
              </span>
              <span className="text-ink-3 ml-1">
                {lang==='th'?`เหลือเวลา — กำหนดส่ง 30 มิถุนายน ${new Date().getFullYear()+543}`:`remaining — deadline June 30, ${new Date().getFullYear()}`}
              </span>
            </div>
          </div>

          {/* Scholarship context */}
          <div className="card p-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-role-tint flex items-center justify-center flex-shrink-0">
              <FileText size={16} className="text-role-primary"/>
            </div>
            <div>
              <div className="text-sm font-medium text-ink-1">{lang==='th'?'ทุน JCC เพื่อนักศึกษาดีเด่น':'JCC Excellence Scholarship'}</div>
              <div className="text-xs text-ink-3">{lang==='th'?'ปีการศึกษา 2566 · จำนวน 50,000 บาท':'Academic Year 2023 · ฿50,000'}</div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'รายงานผลการใช้ทุน':'Scholarship Usage Report'}</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-ink-3 block mb-1.5">
                  {lang==='th'?'สรุปการใช้ทุน *':'Scholarship Usage Summary *'}
                </label>
                <textarea
                  className="input-base h-28 resize-none"
                  value={text}
                  onChange={e=>setText(e.target.value)}
                  placeholder={lang==='th'?'อธิบายว่าคุณใช้ทุนการศึกษาเพื่อวัตถุประสงค์ใด...':'Describe how you used this scholarship...'}
                />
              </div>
              <div>
                <label className="text-xs text-ink-3 block mb-1.5">
                  {lang==='th'?'ผลสำเร็จและประสบการณ์ที่ได้รับ *':'Achievements & Experience *'}
                </label>
                <textarea
                  className="input-base h-24 resize-none"
                  value={achievements}
                  onChange={e=>setAchievements(e.target.value)}
                  placeholder={lang==='th'?'ผลสำเร็จ ทักษะ ประสบการณ์ที่ได้รับ...':'Achievements, skills, and experience gained...'}
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'เอกสารและรูปภาพ':'Documents & Photos'}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="card-sm p-4 border-dashed border-line text-center cursor-pointer hover:border-role-border transition-all">
                <FileText size={20} className="mx-auto text-ink-3 mb-2"/>
                <div className="text-xs text-ink-2">{lang==='th'?'แนบรายงาน (PDF)':'Attach Report (PDF)'}</div>
              </div>
              <div className="card-sm p-4 border-dashed border-line text-center cursor-pointer hover:border-role-border transition-all">
                <Image size={20} className="mx-auto text-ink-3 mb-2"/>
                <div className="text-xs text-ink-2">{lang==='th'?'ภาพถ่ายกิจกรรม':'Activity Photos'}</div>
              </div>
            </div>
          </div>

          <button
            onClick={() => { if(text && achievements) setSubmitted(true) }}
            disabled={!text || !achievements}
            className={`w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${text && achievements ? 'btn-primary' : 'bg-white border border-line text-ink-3 cursor-not-allowed'}`}
          >
            <Send size={14}/>{lang==='th'?'ส่งรายงาน':'Submit Report'}
          </button>
        </div>
      )}
    </AppShell>
  )
}

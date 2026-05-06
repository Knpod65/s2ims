'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { Upload, AlertTriangle, CheckCircle2, Check, RefreshCw } from 'lucide-react'
import { confidenceColor } from '@/lib/utils'

const MOCK_FIELDS = [
  { key: 'scholarship_name', label_th: 'ชื่อทุน', label_en: 'Scholarship Name', value: 'ทุนนวัตกรรม-สังคมผู้ประกอบการ', confidence: 0.95 },
  { key: 'provider', label_th: 'ผู้ให้ทุน', label_en: 'Provider', value: 'คณะรัฐศาสตร์และรัฐประศาสนศาสตร์', confidence: 0.91 },
  { key: 'amount', label_th: 'จำนวนเงิน', label_en: 'Amount', value: '30,000', confidence: 0.88 },
  { key: 'num_awards', label_th: 'จำนวนทุน', label_en: 'Number of Awards', value: '10', confidence: 0.92 },
  { key: 'deadline', label_th: 'กำหนดส่ง', label_en: 'Deadline', value: '15 พฤษภาคม 2568', confidence: 0.74 },
  { key: 'gpa_min', label_th: 'GPA ขั้นต่ำ', label_en: 'Minimum GPA', value: '2.5', confidence: 0.43 },
  { key: 'contact', label_th: 'ติดต่อ', label_en: 'Contact', value: 'งานพัฒนานักศึกษา โทร. 053-XXX-XXX', confidence: 0.67 },
]

type JobStatus = 'idle' | 'uploading' | 'extracting' | 'needs_review' | 'confirmed'

export default function OcrPage() {
  const { lang } = useLang()
  const [jobStatus, setJobStatus] = useState<JobStatus>('idle')
  const [fields, setFields] = useState(MOCK_FIELDS.map(f => ({ ...f })))

  const handleUpload = () => {
    setJobStatus('uploading')
    setTimeout(() => {
      setJobStatus('extracting')
      setTimeout(() => setJobStatus('needs_review'), 1500)
    }, 800)
  }

  const handleConfirm = () => setJobStatus('confirmed')
  const handleReset = () => { setJobStatus('idle'); setFields(MOCK_FIELDS.map(f=>({...f}))) }

  const lowConf = fields.filter(f => f.confidence < 0.5).length
  const midConf = fields.filter(f => f.confidence >= 0.5 && f.confidence < 0.85).length

  return (
    <AppShell requiredRole="staff">
      <PageHeader
        title={lang==='th'?'คิว OCR':'OCR Queue'}
        subtitle={lang==='th'?'ดึงข้อมูลจากเอกสาร PDF / รูปภาพ อัตโนมัติ':'Auto-extract structured data from PDF or image documents'}
      />

      {jobStatus === 'idle' && (
        <div className="max-w-lg">
          <div
            onClick={handleUpload}
            className="card p-10 border-dashed border-white/[0.2] text-center cursor-pointer hover:border-brand/40 hover:bg-brand/[0.02] transition-all group"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand/10 border border-brand/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform">
              <Upload size={24} className="text-brand"/>
            </div>
            <div className="font-semibold text-sm text-ink-1 mb-1">{lang==='th'?'อัปโหลดเอกสาร':'Upload Document'}</div>
            <div className="text-xs text-ink-3 mb-4">{lang==='th'?'รองรับ PDF, JPG, PNG (ไทย + อังกฤษ)':'Supports PDF, JPG, PNG (Thai + English OCR)'}</div>
            <div className="btn-primary inline-flex items-center gap-2 text-xs px-4 py-2">
              <Upload size={12}/>{lang==='th'?'เลือกไฟล์ (Mock Demo)':'Choose File (Mock Demo)'}
            </div>
          </div>
        </div>
      )}

      {(jobStatus === 'uploading' || jobStatus === 'extracting') && (
        <div className="card p-8 max-w-lg text-center">
          <div className="w-12 h-12 rounded-full border-2 border-brand border-t-transparent animate-spin mx-auto mb-4"/>
          <div className="font-semibold text-sm text-ink-1 mb-1">
            {jobStatus === 'uploading' ? (lang==='th'?'กำลังอัปโหลด...':'Uploading...') : (lang==='th'?'กำลังดึงข้อมูล...':'Extracting fields...')}
          </div>
          <div className="text-xs text-ink-3">{lang==='th'?'ระบบ OCR กำลังประมวลผลเอกสาร':'OCR engine processing your document'}</div>
        </div>
      )}

      {jobStatus === 'needs_review' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Document viewer */}
          <div className="lg:col-span-2 card p-4">
            <div className="text-xs text-ink-3 uppercase tracking-widest mb-3">{lang==='th'?'ไฟล์ต้นฉบับ':'Original Document'}</div>
            <div className="bg-bg-300 rounded-xl h-72 flex flex-col items-center justify-center border border-white/[0.06]">
              <div className="text-5xl mb-3">📄</div>
              <div className="text-sm text-ink-2 font-medium">scholarship_announcement.pdf</div>
              <div className="text-xs text-ink-3 mt-1">2.3 MB · 4 pages</div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="card-sm p-2">
                <div className="font-bold text-status-success">{fields.filter(f=>f.confidence>=0.85).length}</div>
                <div className="text-ink-3">{lang==='th'?'สูง':'High'}</div>
              </div>
              <div className="card-sm p-2">
                <div className="font-bold text-brand">{midConf}</div>
                <div className="text-ink-3">{lang==='th'?'ปานกลาง':'Medium'}</div>
              </div>
              <div className="card-sm p-2">
                <div className="font-bold text-status-danger">{lowConf}</div>
                <div className="text-ink-3">{lang==='th'?'ต่ำ':'Low'}</div>
              </div>
            </div>
          </div>

          {/* Extracted fields */}
          <div className="lg:col-span-3 card p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs text-ink-3 uppercase tracking-widest">{lang==='th'?'ข้อมูลที่ดึงได้':'Extracted Fields'}</div>
              <button onClick={handleConfirm} className="btn-success text-xs flex items-center gap-1.5 py-1.5 px-3">
                <Check size={12}/>{lang==='th'?'ยืนยันทั้งหมด':'Confirm All'}
              </button>
            </div>

            {lowConf > 0 && (
              <div className="flex items-center gap-2 mb-4 p-2.5 bg-status-danger/[0.06] border border-status-danger/20 rounded-lg">
                <AlertTriangle size={13} className="text-status-danger flex-shrink-0"/>
                <span className="text-xs text-status-danger">
                  {lowConf} {lang==='th'?'ช่องมีความมั่นใจต่ำ — กรุณาตรวจสอบ':'fields have low confidence — please verify'}
                </span>
              </div>
            )}

            <div className="space-y-2.5">
              {fields.map((f, i) => {
                const isLow = f.confidence < 0.5
                const isMid = f.confidence >= 0.5 && f.confidence < 0.85
                const isHigh = f.confidence >= 0.85
                const label = lang==='th' ? f.label_th : f.label_en
                return (
                  <div
                    key={f.key}
                    className={`p-3 rounded-xl border transition-all ${
                      isHigh ? 'border-status-success/20 bg-status-success/[0.03]' :
                      isMid  ? 'border-brand/20 bg-brand/[0.03]' :
                               'border-status-danger/30 bg-status-danger/[0.04]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {isHigh && <CheckCircle2 size={11} className="text-status-success"/>}
                        {isMid  && <AlertTriangle size={11} className="text-brand"/>}
                        {isLow  && <AlertTriangle size={11} className="text-status-danger"/>}
                        <span className="text-[10px] text-ink-3">{label}</span>
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${confidenceColor(f.confidence)}`}>
                        {Math.round(f.confidence * 100)}%
                      </span>
                    </div>
                    <input
                      className="input-base text-xs py-1.5"
                      value={f.value}
                      onChange={e => {
                        const nf = [...fields]
                        nf[i] = { ...nf[i], value: e.target.value }
                        setFields(nf)
                      }}
                    />
                    {isLow && (
                      <div className="text-[10px] text-status-danger mt-1">
                        ⚠️ {lang==='th'?'ความมั่นใจต่ำมาก — กรุณาตรวจสอบและแก้ไข':'Very low confidence — please review and correct'}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {jobStatus === 'confirmed' && (
        <div className="card p-8 max-w-lg text-center">
          <div className="text-4xl mb-4">✅</div>
          <div className="font-display font-bold text-lg text-status-success mb-2">
            {lang==='th'?'ยืนยันการดึงข้อมูลแล้ว':'Extraction Confirmed'}
          </div>
          <div className="text-sm text-ink-3 mb-6">
            {lang==='th'?'ข้อมูลถูกบันทึกเรียบร้อยแล้ว — บันทึกใน Audit Log โดย':'Data saved — logged in audit trail by'} รัตนา มะลิวัลย์
          </div>
          <button onClick={handleReset} className="btn-secondary text-xs flex items-center gap-2 mx-auto py-2 px-4">
            <RefreshCw size={12}/>{lang==='th'?'อัปโหลดเอกสารใหม่':'Upload Another Document'}
          </button>
        </div>
      )}
    </AppShell>
  )
}
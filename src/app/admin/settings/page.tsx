'use client'
import { useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { useToast } from '@/components/ui/Toast'

export default function AdminSettingsPage() {
  const { lang } = useLang()
  const { addToast } = useToast()

  const [ocrHigh, setOcrHigh] = useState(85)
  const [ocrMed, setOcrMed] = useState(50)
  const [pdpaMonths, setPdpaMonths] = useState(24)
  const [slaHours, setSlaHours] = useState(48)
  const [notifyEmail, setNotifyEmail] = useState(true)
  const [notifyDeadline, setNotifyDeadline] = useState(true)
  const [notifyEsq, setNotifyEsq] = useState(true)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    addToast(lang === 'th' ? 'บันทึกการตั้งค่าแล้ว' : 'Settings saved', 'success')
  }

  return (
    <AppShell requiredRole="admin">
      <PageHeader
        title={lang === 'th' ? 'ตั้งค่าระบบ' : 'System Settings'}
        subtitle={lang === 'th' ? 'กำหนดค่าพารามิเตอร์ของระบบ' : 'Configure system parameters'}
      />
      <div className="max-w-2xl space-y-4">
        {/* OCR */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">OCR Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-ink-1">{lang === 'th' ? 'ความมั่นใจขั้นต่ำ — ยืนยันอัตโนมัติ' : 'Min confidence — auto-confirm'}</div>
                <div className="text-xs text-ink-3">{lang === 'th' ? 'ช่วง High: ยืนยันโดยไม่ต้องตรวจสอบ' : 'High zone: confirmed without review'}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" className="input-base w-20 text-center" value={ocrHigh}
                  onChange={e => setOcrHigh(Number(e.target.value))} min={0} max={100} />
                <span className="text-xs text-ink-3">%</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-ink-1">{lang === 'th' ? 'ความมั่นใจขั้นต่ำ — ต้องตรวจสอบ' : 'Min confidence — manual review'}</div>
                <div className="text-xs text-ink-3">{lang === 'th' ? 'ช่วง Medium: ต้องให้เจ้าหน้าที่ตรวจสอบ' : 'Medium zone: requires staff review'}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" className="input-base w-20 text-center" value={ocrMed}
                  onChange={e => setOcrMed(Number(e.target.value))} min={0} max={100} />
                <span className="text-xs text-ink-3">%</span>
              </div>
            </div>
          </div>
        </div>

        {/* PDPA & Workflow */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">PDPA &amp; Workflow</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-ink-1">{lang === 'th' ? 'ระยะเวลาเก็บข้อมูล PDPA' : 'PDPA data retention period'}</div>
                <div className="text-xs text-ink-3">{lang === 'th' ? 'หลังจากนี้ข้อมูลจะถูกลบอัตโนมัติ' : 'Data auto-deleted after this period'}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" className="input-base w-20 text-center" value={pdpaMonths}
                  onChange={e => setPdpaMonths(Number(e.target.value))} min={1} />
                <span className="text-xs text-ink-3">{lang === 'th' ? 'เดือน' : 'months'}</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm text-ink-1">{lang === 'th' ? 'SLA การอนุมัติประกาศ (ESQ)' : 'Announcement approval SLA (ESQ)'}</div>
                <div className="text-xs text-ink-3">{lang === 'th' ? 'เกินกำหนดจะแสดงคำเตือนสีแดง' : 'Over limit shows red urgency warning'}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" className="input-base w-20 text-center" value={slaHours}
                  onChange={e => setSlaHours(Number(e.target.value))} min={1} />
                <span className="text-xs text-ink-3">{lang === 'th' ? 'ชม.' : 'hrs'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">
            {lang === 'th' ? 'การแจ้งเตือน' : 'Notification Settings'}
          </h3>
          <div className="space-y-1">
            {([
              [notifyEmail, setNotifyEmail, 'ส่ง Email เมื่อมีประกาศใหม่', 'Send email on new announcement'],
              [notifyDeadline, setNotifyDeadline, 'แจ้งเตือน 7 วันก่อนกำหนดส่ง', 'Notify 7 days before deadline'],
              [notifyEsq, setNotifyEsq, 'แจ้งเตือน ESQ เมื่อมีประกาศรออนุมัติ', 'Notify ESQ when approval pending'],
            ] as [boolean, (v: boolean) => void, string, string][]).map(([checked, setter, th, en], i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer py-2.5 border-b border-white/[0.04] last:border-0">
                <input type="checkbox" checked={checked} onChange={e => setter(e.target.checked)} className="accent-brand" />
                <span className="text-sm text-ink-1">{lang === 'th' ? th : en}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary w-full py-2.5 text-sm disabled:opacity-60"
        >
          {saving
            ? (lang === 'th' ? 'กำลังบันทึก...' : 'Saving...')
            : (lang === 'th' ? 'บันทึกการตั้งค่า' : 'Save Settings')}
        </button>
      </div>
    </AppShell>
  )
}

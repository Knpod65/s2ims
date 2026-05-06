'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatCard } from '@/components/ui/index'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { FileText, Users, Trophy, AlertCircle, Download } from 'lucide-react'

function exportAnalyticsCSV() {
  const header = 'Stage,Count'
  const rows = [
    ['Views','342'],['Eligible','156'],['Notified','140'],['Started','89'],
    ['Submitted','64'],['Shortlisted','28'],['Awarded','10'],['Confirmed','8'],
    ['Finance OK','7'],['Report In','5'],
  ].map(r => r.join(','))
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `analytics-funnel-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

const FUNNEL = [
  { stage_th: 'เข้าชมประกาศ', stage_en: 'Views', value: 342 },
  { stage_th: 'นักศึกษาที่มีสิทธิ์', stage_en: 'Eligible', value: 156 },
  { stage_th: 'แจ้งเตือนแล้ว', stage_en: 'Notified', value: 140 },
  { stage_th: 'เริ่มสมัคร', stage_en: 'Started', value: 89 },
  { stage_th: 'ส่งใบสมัครแล้ว', stage_en: 'Submitted', value: 64 },
  { stage_th: 'ผ่านคัดเลือก', stage_en: 'Shortlisted', value: 28 },
  { stage_th: 'ได้รับทุน', stage_en: 'Awarded', value: 10 },
  { stage_th: 'ยืนยันรับทุน', stage_en: 'Confirmed', value: 8 },
  { stage_th: 'เอกสารการเงินครบ', stage_en: 'Finance OK', value: 7 },
  { stage_th: 'ส่งรายงาน', stage_en: 'Report In', value: 5 },
]

const MONTHLY = [
  { m: 'ม.ค.', en: 'Jan', apps: 12, awarded: 2 },
  { m: 'ก.พ.', en: 'Feb', apps: 18, awarded: 3 },
  { m: 'มี.ค.', en: 'Mar', apps: 34, awarded: 7 },
  { m: 'เม.ย.', en: 'Apr', apps: 56, awarded: 10 },
  { m: 'พ.ค.', en: 'May', apps: 28, awarded: 5 },
]

const TOOLTIP_STYLE = { background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12, color: '#E2E8F5' }

export default function StaffAnalyticsPage() {
  const { lang } = useLang()
  return (
    <AppShell requiredRole="staff">
      <PageHeader
        title={lang==='th'?'วิเคราะห์ข้อมูล':'Analytics Dashboard'}
        subtitle={lang==='th'?'ตัวชี้วัดและสถิติทุนการศึกษาในภาพรวม':'Scholarship metrics and KPIs overview'}
        actions={
          <button onClick={exportAnalyticsCSV} className="btn-secondary text-xs flex items-center gap-1.5 py-1.5 px-3">
            <Download size={13}/>{lang==='th'?'ส่งออก CSV':'Export CSV'}
          </button>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard value="342" label={lang==='th'?'เข้าชมประกาศ':'Announcement Views'} icon={<FileText size={16}/>} color="text-status-info" delta="+12% vs last month" deltaUp/>
        <StatCard value="64" label={lang==='th'?'ใบสมัครที่ส่งแล้ว':'Submitted Applications'} icon={<Users size={16}/>} color="text-brand" delta="+8%" deltaUp/>
        <StatCard value="10" label={lang==='th'?'ได้รับทุน':'Awarded'} icon={<Trophy size={16}/>} color="text-status-success"/>
        <StatCard value="3" label={lang==='th'?'รายงานค้างส่ง':'Overdue Reports'} icon={<AlertCircle size={16}/>} color="text-status-danger" delta="-2 vs last week" deltaUp={false}/>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        {/* Funnel */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-5">{lang==='th'?'📊 Funnel การสมัครทุน':'📊 Scholarship Application Funnel'}</h3>
          <div className="space-y-2">
            {FUNNEL.map((f) => {
              const pct = Math.round((f.value / 342) * 100)
              return (
                <div key={f.stage_en} className="flex items-center gap-3">
                  <div className="text-[10px] text-ink-3 w-24 text-right leading-tight">
                    {lang==='th'?f.stage_th:f.stage_en}
                  </div>
                  <div className="flex-1 bg-white/[0.04] rounded-full h-5 relative overflow-hidden">
                    <div
                      className="h-full bg-brand/70 rounded-full transition-all duration-700"
                      style={{ width: `${pct}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-end pr-1.5">
                      <span className="text-[9px] font-mono text-brand/80">{pct}%</span>
                    </div>
                  </div>
                  <div className="font-mono text-xs text-ink-2 w-7 text-right">{f.value}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Monthly chart */}
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'📈 ใบสมัครรายเดือน':'📈 Monthly Applications'}</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY} margin={{ left: -20, bottom: 0 }}>
              <XAxis dataKey={lang==='th'?'m':'en'} tick={{ fontSize: 10, fill: '#4A5568' }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fontSize: 10, fill: '#4A5568' }} axisLine={false} tickLine={false}/>
              <Tooltip contentStyle={TOOLTIP_STYLE}/>
              <Bar dataKey="apps" fill="#F59E0B" radius={[4,4,0,0]} name={lang==='th'?'ใบสมัคร':'Applications'}/>
              <Bar dataKey="awarded" fill="#10B981" radius={[4,4,0,0]} name={lang==='th'?'ได้รับทุน':'Awarded'}/>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workload */}
      <div className="card p-5">
        <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'⚙️ ภาระงานเจ้าหน้าที่ (สัปดาห์นี้)':'⚙️ Staff Workload (This Week)'}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { th: 'ประกาศที่สร้าง', en: 'Announcements created', value: 2 },
            { th: 'OCR ที่ยืนยัน', en: 'OCR confirmations', value: 5 },
            { th: 'ใบสมัครที่ตรวจ', en: 'Applications reviewed', value: 18 },
            { th: 'เอกสารที่ยืนยัน', en: 'Documents verified', value: 24 },
          ].map(item => (
            <div key={item.th} className="card-sm p-3 text-center">
              <div className="font-display font-bold text-xl text-brand">{item.value}</div>
              <div className="text-[10px] text-ink-3 mt-1">{lang==='th'?item.th:item.en}</div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
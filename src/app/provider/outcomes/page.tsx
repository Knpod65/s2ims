'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatCard } from '@/components/ui/index'

export default function ProviderOutcomesPage() {
  const { lang } = useLang()
  return (
    <AppShell requiredRole="provider">
      <PageHeader title={lang==='th'?'ผลลัพธ์ผู้รับทุน':'Scholarship Outcome Report'} subtitle={lang==='th'?'ข้อมูลผลลัพธ์ระยะยาวของผู้รับทุน (รวม)':'Longitudinal outcome data for recipients (aggregate)'}/>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard value="10" label={lang==='th'?'ผู้รับทุนทั้งหมด':'Total Recipients'} color="text-brand"/>
        <StatCard value="3.42" label={lang==='th'?'GPA เฉลี่ย (หลังรับทุน)':'Avg GPA (post-award)'} color="text-status-success"/>
        <StatCard value="90%" label={lang==='th'?'อัตราการคงอยู่':'Retention Rate'} color="text-status-track"/>
        <StatCard value="80%" label={lang==='th'?'สำเร็จการศึกษา':'Graduation Rate'} color="text-status-info"/>
      </div>
      <div className="card p-5 max-w-lg">
        <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'ผลการติดตาม':'Follow-up Summary'}</h3>
        <div className="space-y-3 text-sm">
          {[[lang==='th'?'ส่งรายงานตามกำหนด':'Reports submitted on time','8/10','80%'],[lang==='th'?'รายงานล่าช้า':'Overdue reports','2/10','20%'],[lang==='th'?'ฝึกงาน/โคออป':'Co-op/Internship','6/10','60%']].map(([label,fraction,pct]) => (
            <div key={label as string} className="flex items-center justify-between border-b border-white/[0.06] pb-3 last:border-0">
              <span className="text-ink-2 text-xs">{label}</span>
              <div className="text-right"><div className="font-mono text-xs text-ink-1">{fraction}</div><div className="text-[10px] text-ink-3">{pct}</div></div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
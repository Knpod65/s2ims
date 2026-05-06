'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { Shield } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

function Chart({ lang }: { lang: string }) {
  const d = [
    { label: lang==='th'?'ปี 1':'Year 1', v: 12 },
    { label: lang==='th'?'ปี 2':'Year 2', v: 24 },
    { label: lang==='th'?'ปี 3':'Year 3', v: 18 },
    { label: lang==='th'?'ปี 4':'Year 4', v: 10 },
  ]
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={d} margin={{left:-20}}>
        <XAxis dataKey="label" tick={{fontSize:10,fill:'#4A5568'}} axisLine={false} tickLine={false}/>
        <YAxis tick={{fontSize:10,fill:'#4A5568'}} axisLine={false} tickLine={false}/>
        <Tooltip contentStyle={{background:'#111827',border:'1px solid rgba(255,255,255,0.08)',borderRadius:8,fontSize:12}}/>
        <Bar dataKey="v" fill="#F59E0B" radius={[4,4,0,0]}/>
      </BarChart>
    </ResponsiveContainer>
  )
}

export default function ProviderInsightsPage() {
  const { lang } = useLang()
  return (
    <AppShell requiredRole="provider">
      <PageHeader title={lang==='th'?'สถิติผู้สมัคร':'Applicant Insights'} subtitle={lang==='th'?'ข้อมูลรวมเท่านั้น — ปกป้องภายใต้ PDPA':'Aggregated data only — PDPA protected'}/>
      <div className="p-3 mb-6 rounded-xl bg-status-info/[0.06] border border-status-info/20 flex items-center gap-3">
        <Shield size={14} className="text-status-info flex-shrink-0"/>
        <span className="text-xs text-status-info/80">{lang==='th'?'ข้อมูลทั้งหมดเป็นแบบรวม ไม่มีข้อมูลส่วนตัวของนักศึกษาแสดง':'All data is aggregated. No individual student data is shown.'}</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5"><h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'ผู้สมัครตามชั้นปี':'Applicants by Year'}</h3><Chart lang={lang}/></div>
        <div className="card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">{lang==='th'?'ช่วง GPA (รวม)':'GPA Bands (Aggregate)'}</h3>
          <div className="space-y-3">
            {[['< 2.5','5','8%'],['2.5–2.99','14','22%'],['3.0–3.49','28','44%'],['3.5+','17','27%']].map(([band,n,pct]) => (
              <div key={band} className="flex items-center gap-3">
                <div className="text-xs text-ink-3 font-mono w-16">{band}</div>
                <div className="flex-1 bg-white/[0.04] rounded-full h-4 relative overflow-hidden">
                  <div className="h-full bg-brand/60 rounded-full" style={{width:pct}}/>
                </div>
                <div className="text-xs text-ink-2 font-mono w-6">{n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { mockAnnouncements } from '@/data/mock/announcements'
import { ANN_STATUS_MAP } from '@/lib/utils'

export default function ESQHistoryPage() {
  const { lang } = useLang()
  const allAnn = mockAnnouncements
  return (
    <AppShell requiredRole="esq">
      <PageHeader
        title={lang==='th'?'ประวัติการอนุมัติ':'Approval History'}
        subtitle={lang==='th'?'ประกาศทั้งหมดที่ผ่านการดำเนินการ':'All announcements that have been processed'}
      />
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-bg-200">
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'ประกาศ':'Announcement'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'สถานะ':'Status'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'อัปเดต':'Updated'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'ความเห็น ESQ':'ESQ Comment'}</th>
            </tr>
          </thead>
          <tbody>
            {allAnn.map((ann, i) => {
              const si = ANN_STATUS_MAP[ann.status]
              return (
                <tr key={ann.id} className={`border-b border-white/[0.04] ${i%2===1?'bg-white/[0.01]':''}`}>
                  <td className="p-3">
                    <div className="text-xs font-medium text-ink-1 line-clamp-1 max-w-[220px]">
                      {lang==='th'?ann.title_th:ann.title_en}
                    </div>
                  </td>
                  <td className="p-3">
                    <StatusBadge label={si[lang==='th'?'th':'en']} color={si.color}/>
                  </td>
                  <td className="p-3 text-xs text-ink-3 font-mono whitespace-nowrap">
                    {ann.updated_at.split('T')[0]}
                  </td>
                  <td className="p-3 text-xs text-ink-3 max-w-[160px]">
                    {ann.esq_comment || <span className="text-ink-3/40">—</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
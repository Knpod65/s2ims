'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { EmptyState, PageHeader, StatusBadge } from '@/components/ui/index'
import { SafetyBanner, SectionHeader } from '@/components/shared'
import { mockAnnouncements } from '@/data/mock/announcements'
import { ANN_STATUS_MAP } from '@/lib/utils'
import { History, ShieldCheck } from 'lucide-react'

function recommendationStatusLabel(status: string, fallback: { th: string; en: string }, lang: 'th' | 'en') {
  if (status === 'APPROVED') {
    return lang === 'th' ? 'บันทึกคำแนะนำแล้ว' : 'Recommendation recorded'
  }
  if (status === 'REJECTED') {
    return lang === 'th' ? 'แนะนำให้ปรับแก้' : 'Revision recommended'
  }
  if (status === 'SUBMITTED') {
    return lang === 'th' ? 'รอคำแนะนำ' : 'Awaiting recommendation'
  }
  return fallback[lang]
}

export default function ESQHistoryPage() {
  const { lang } = useLang()
  const allAnn = mockAnnouncements
  const t = lang === 'th' ? 'th' : 'en'

  return (
    <AppShell requiredRole="esq">
      <PageHeader
        title={lang==='th'?'ประวัติคำแนะนำ ESQ':'Recommendation History'}
        subtitle={lang==='th'?'บันทึกคำแนะนำต่อประกาศที่ผ่านมา ไม่ใช่การอนุมัติอย่างเป็นทางการ':'Past ESQ recommendation records. These are not official approvals.'}
      />
      <SafetyBanner
        tone="info"
        title={lang === 'th' ? 'คำแนะนำเท่านั้น — ไม่ใช่การอนุมัติ' : 'Recommendation — not an approval'}
        description={lang === 'th'
          ? 'หน้านี้แสดงประวัติคำแนะนำในต้นแบบเท่านั้น ไม่มีการลงนาม อนุมัติ หรือสร้างหลักฐานอย่างเป็นทางการ'
          : 'This page shows mock recommendation history only. It does not sign off, approve, or create official evidence.'}
        apCodes={['AP-11']}
        className="mb-4"
      />
      <SectionHeader
        title={lang === 'th' ? 'รายการคำแนะนำที่ผ่านมา' : 'Recommendation records'}
        description={lang === 'th'
          ? 'ใช้เพื่อตรวจสอบบริบทการพิจารณาในเดโม โดยทุกสถานะยังเป็นข้อมูลจำลอง'
          : 'Use this demo history to review recommendation context; all statuses remain mock data.'}
        action={<ShieldCheck size={17} className="text-role-primary" aria-hidden="true" />}
      />
      {allAnn.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={<History size={32} />}
            title={lang === 'th' ? 'ยังไม่มีประวัติคำแนะนำ' : 'No recommendation history yet'}
            description={lang === 'th'
              ? 'เมื่อมีการบันทึกคำแนะนำในเดโม รายการจะปรากฏที่นี่ โดยยังไม่ถือเป็นการอนุมัติหรือหลักฐานทางการ'
              : 'When mock recommendations are recorded, they will appear here. They are still not approvals or official evidence.'}
          />
        </div>
      ) : (
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-200">
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'ประกาศ':'Announcement'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'สถานะคำแนะนำ':'Recommendation status'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'อัปเดต':'Updated'}</th>
              <th className="text-left p-3 text-xs text-ink-3 font-semibold">{lang==='th'?'ความเห็น ESQ':'ESQ Comment'}</th>
            </tr>
          </thead>
          <tbody>
            {allAnn.map((ann, i) => {
              const si = ANN_STATUS_MAP[ann.status]
              return (
                <tr key={ann.id} className={`border-b border-line ${i%2===1?'bg-surface-low/60':''}`}>
                  <td className="p-3">
                    <div className="text-xs font-medium text-ink-1 line-clamp-1 max-w-[220px]">
                      {lang==='th'?ann.title_th:ann.title_en}
                    </div>
                  </td>
                  <td className="p-3">
                    <StatusBadge label={recommendationStatusLabel(ann.status, si, t)} color={si.color}/>
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
      )}
    </AppShell>
  )
}

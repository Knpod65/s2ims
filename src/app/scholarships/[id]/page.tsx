'use client'
import Link from 'next/link'
import { ArrowLeft, Clock, Trophy, Users, BookOpen, MessageSquare, Video } from 'lucide-react'
import { mockScholarships } from '@/data/mock/scholarships'
import { useLang } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'
import { daysUntil, deadlineColor, formatAmount, formatAmountEn } from '@/lib/utils'
import { StatusBadge } from '@/components/ui/index'
import { SCH_STATUS_MAP } from '@/lib/utils'
import { MatchScoreRing } from '@/components/ScholarshipCard'

export default function ScholarshipDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const { lang } = useLang()
  const { role } = useAuth()
  const s = mockScholarships.find(x => x.id === id)
  if (!s) return <div className="min-h-screen bg-bg-000 flex items-center justify-center text-ink-3">Not found</div>
  
  const days = daysUntil(s.deadline)
  const title = lang === 'th' ? s.title_th : s.title_en
  const philosophy = lang === 'th' ? s.philosophy_th : s.philosophy_en
  const statusInfo = SCH_STATUS_MAP[s.status]

  return (
    <div className="min-h-screen bg-bg-000">
      <header className="border-b border-line px-5 h-14 flex items-center gap-4">
        <Link href="/scholarships" className="flex items-center gap-2 text-ink-3 hover:text-ink-1 text-sm"><ArrowLeft size={14}/>{lang==='th'?'กลับ':'Back'}</Link>
      </header>
      <div className="max-w-3xl mx-auto px-5 py-8 page-animate">
        <div className="card p-6 mb-6">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="text-xs text-ink-3 mb-1">{lang==='th'?s.provider_th:s.provider}</div>
              <h1 className="font-display font-bold text-2xl text-ink-1 mb-2">{title}</h1>
              <div className="flex gap-2 flex-wrap">
                <StatusBadge label={statusInfo[lang==='th'?'th':'en']} color={statusInfo.color}/>
              </div>
            </div>
            {s.match_pct && <MatchScoreRing pct={s.match_pct}/>}
          </div>
          <p className="text-ink-2 text-sm leading-relaxed">{philosophy}</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="card-sm p-3 text-center"><div className="text-role-primary font-bold text-lg">{lang==='th'?formatAmount(s.amount):formatAmountEn(s.amount)}</div><div className="text-xs text-ink-3">{lang==='th'?'จำนวนเงิน':'Amount'}</div></div>
          <div className="card-sm p-3 text-center"><div className="text-ink-1 font-bold text-lg">{s.num_awards}</div><div className="text-xs text-ink-3">{lang==='th'?'จำนวนทุน':'Awards'}</div></div>
          <div className="card-sm p-3 text-center"><div className="text-ink-1 font-bold text-lg">≥{s.gpa_min}</div><div className="text-xs text-ink-3">GPA {lang==='th'?'ขั้นต่ำ':'minimum'}</div></div>
          <div className={`card-sm p-3 text-center ${days <= 3 && days >= 0 ? 'border-status-danger/30' : ''}`}><div className={`font-bold text-lg ${deadlineColor(days)}`}>{days < 0 ? '-' : days}</div><div className="text-xs text-ink-3">{lang==='th'?'วัน เหลือ':'days left'}</div></div>
        </div>
        <div className="card p-4 mb-4">
          <h3 className="font-semibold text-sm text-ink-1 mb-3">{lang==='th'?'ข้อกำหนด':'Requirements'}</h3>
          <div className="flex gap-4 flex-wrap text-xs">
            <div className={`flex items-center gap-1.5 ${s.has_essay?'text-ink-1':'text-ink-3 line-through'}`}><MessageSquare size={13}/>{lang==='th'?'เรียงความ':'Essay'}</div>
            <div className={`flex items-center gap-1.5 ${s.has_interview?'text-ink-1':'text-ink-3 line-through'}`}><Users size={13}/>{lang==='th'?'สัมภาษณ์':'Interview'}</div>
            <div className={`flex items-center gap-1.5 ${s.has_proposal?'text-ink-1':'text-ink-3 line-through'}`}><BookOpen size={13}/>{lang==='th'?'ข้อเสนอโครงการ':'Proposal'}</div>
          </div>
        </div>
        {role === 'student' && s.status === 'OPEN' && (
          <Link
            href={`/student/applications/new?scholarship=${s.id}`}
            className="btn-primary w-full block text-center py-3 text-sm"
          >
            {lang === 'th' ? 'สมัครทุนนี้' : 'Apply for this Scholarship'} →
          </Link>
        )}
      </div>
    </div>
  )
}

'use client'

import { BookOpen, CheckCircle2, ClipboardList, ShieldCheck, Users } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import ProviderImpactCard from './ProviderImpactCard'
import type { Scholarship } from '@/data/mock/providerData'

type ProviderDashboardSummaryProps = {
  scholarships: Scholarship[]
}

export default function ProviderDashboardSummary({ scholarships }: ProviderDashboardSummaryProps) {
  const { lang } = useLang()
  const active = scholarships.filter(s => s.status === 'ACTIVE').length
  const drafts = scholarships.filter(s => s.status === 'DRAFT').length
  const pendingReview = scholarships.filter(s => s.status === 'PENDING_REVIEW').length
  const readyPools = scholarships.filter(s => s.candidatePoolStatus === 'ready').length
  const pendingShortlists = scholarships.filter(s => s.shortlistStatus === 'pending_staff_approval').length

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
      <ProviderImpactCard
        icon={BookOpen}
        label={lang === 'th' ? 'ทุนที่เปิดอยู่' : 'Active scholarships'}
        value={active}
        helper={lang === 'th' ? 'พร้อมรับและจับคู่ผู้สมัคร' : 'Published and matching-ready'}
      />
      <ProviderImpactCard
        icon={ClipboardList}
        label={lang === 'th' ? 'ร่างทุน' : 'Draft scholarships'}
        value={drafts}
        helper={lang === 'th' ? 'ยังไม่เปิดชุมชนผู้สมัคร' : 'Candidate pools stay locked'}
      />
      <ProviderImpactCard
        icon={ShieldCheck}
        label={lang === 'th' ? 'รอเจ้าหน้าที่ตรวจสอบ' : 'Pending staff review'}
        value={pendingReview}
        helper={lang === 'th' ? 'ไม่มีการเผยแพร่จนกว่าจะอนุมัติ' : 'No publication before approval'}
      />
      <ProviderImpactCard
        icon={Users}
        label={lang === 'th' ? 'ชุมชนผู้สมัครพร้อม' : 'Candidate pools ready'}
        value={readyPools}
        helper={lang === 'th' ? 'แสดงโทเค็นและข้อมูลแบบกลุ่ม' : 'Tokenized and banded only'}
      />
      <ProviderImpactCard
        icon={CheckCircle2}
        label={lang === 'th' ? 'คำขอคัดเลือก' : 'Shortlist requests'}
        value={pendingShortlists}
        helper={lang === 'th' ? 'รออนุมัติจากเจ้าหน้าที่' : 'Pending staff approval'}
      />
    </div>
  )
}

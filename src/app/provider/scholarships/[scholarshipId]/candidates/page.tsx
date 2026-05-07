'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { EmptyState, PageHeader } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import {
  getProviderCandidatesForScholarship,
  getProviderPoolStatsForScholarship,
  getProviderScholarshipById,
} from '@/data/mock/providerData'
import AnonymousCandidateCard from '@/components/provider/AnonymousCandidateCard'
import CandidatePoolSummary from '@/components/provider/CandidatePoolSummary'
import CandidatePoolTable from '@/components/provider/CandidatePoolTable'
import CandidateSelector from '@/components/provider/CandidateSelector'
import ProviderPrivacyNotice from '@/components/provider/ProviderPrivacyNotice'
import ShortlistRequestModal from '@/components/provider/ShortlistRequestModal'

export default function CandidatesPage({ params }: { params: { scholarshipId: string } }) {
  const { lang } = useLang()
  const scholarship = getProviderScholarshipById(params.scholarshipId)
  const candidates = getProviderCandidatesForScholarship(params.scholarshipId)
  const stats = getProviderPoolStatsForScholarship(params.scholarshipId)
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!scholarship) {
    return (
      <AppShell requiredRole="provider">
        <EmptyState
          title={lang === 'th' ? 'ไม่พบทุน' : 'Scholarship not found'}
          action={<Link href="/provider/scholarships" className="btn-primary min-h-11 px-4 text-sm">{lang === 'th' ? 'กลับพอร์ตโฟลิโอ' : 'Back to portfolio'}</Link>}
        />
      </AppShell>
    )
  }

  const toggleCandidateSelection = (token: string) => {
    setSelectedCandidates(prev => {
      const next = new Set(prev)
      if (next.has(token)) next.delete(token)
      else next.add(token)
      return next
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCandidates(new Set())
  }

  const title = lang === 'th' ? scholarship.title_th : scholarship.title_en

  return (
    <AppShell requiredRole="provider">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'ชุมชนผู้สมัครนิรนาม' : 'Anonymous Candidate Pool'}
        subtitle={title}
        actions={
          <Link href="/provider/candidates" className="btn-secondary min-h-11 px-3 text-xs">
            <ArrowLeft size={14} />
            {lang === 'th' ? 'ตัวเลือกชุมชน' : 'Pool selector'}
          </Link>
        }
      />

      <div className="space-y-6 pb-28">
        <ProviderPrivacyNotice mode="candidate" />

        <CandidatePoolSummary stats={stats} />

        <section>
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="font-semibold text-ink-1">{lang === 'th' ? 'เลือกโทเค็นสำหรับขอคัดเลือก' : 'Select tokens for shortlist request'}</h2>
              <p className="mt-1 text-sm text-ink-2">
                {lang === 'th'
                  ? 'ผู้ให้ทุนเห็นเฉพาะ Candidate #C-XXXX พร้อมข้อมูลแบบกลุ่มเท่านั้น'
                  : 'Providers see Candidate #C-XXXX tokens and banded data only.'}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-role-border bg-role-tint px-3 py-1.5 text-xs font-semibold text-role-primary">
              <ShieldCheck size={13} />
              {lang === 'th' ? 'ไม่มีตัวตนจริง' : 'No raw identity'}
            </div>
          </div>

          <div className="space-y-3 lg:hidden">
            {candidates.map(candidate => (
              <AnonymousCandidateCard
                key={candidate.candidateToken}
                candidate={candidate}
                selected={selectedCandidates.has(candidate.candidateToken)}
                onToggle={toggleCandidateSelection}
              />
            ))}
          </div>
          <div className="hidden lg:block">
            <CandidatePoolTable candidates={candidates} />
          </div>
        </section>

        {candidates.map(candidate => (
          <div key={`desktop-${candidate.candidateToken}`} className="hidden lg:block">
            <AnonymousCandidateCard
              candidate={candidate}
              selected={selectedCandidates.has(candidate.candidateToken)}
              onToggle={toggleCandidateSelection}
            />
          </div>
        ))}

        {candidates.length === 0 && (
          <EmptyState title={lang === 'th' ? 'ยังไม่มีโทเค็นผู้สมัคร' : 'No candidate tokens yet'} />
        )}

        <CandidateSelector
          selectedCount={selectedCandidates.size}
          onClear={() => setSelectedCandidates(new Set())}
          onRequest={() => setIsModalOpen(true)}
        />
      </div>

      <ShortlistRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        candidateCount={selectedCandidates.size}
        scholarshipName={title}
      />
    </AppShell>
  )
}

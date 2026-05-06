'use client'

import { useParams } from 'next/navigation'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { mockProviderScholarships } from '@/data/mock/providerData'
import { ArrowLeft, CheckCircle2, Circle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import ShortlistRequestModal from '@/components/provider/ShortlistRequestModal'

interface SelectedCandidate {
  candidateToken: string
}

export default function CandidatesPage() {
  const params = useParams()
  const { lang } = useLang()
  const scholarshipId = params.scholarshipId as string

  const scholarship = mockProviderScholarships.find((s) => s.id === scholarshipId)
  const candidates = scholarship?.matchedCandidates || []

  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set())
  const [isModalOpen, setIsModalOpen] = useState(false)

  const toggleCandidateSelection = (token: string) => {
    const newSelected = new Set(selectedCandidates)
    if (newSelected.has(token)) {
      newSelected.delete(token)
    } else {
      newSelected.add(token)
    }
    setSelectedCandidates(newSelected)
  }

  const handleClearSelection = () => {
    setSelectedCandidates(new Set())
  }

  const handleOpenModal = () => {
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCandidates(new Set())
  }

  const getRankBandColor = (rank: string) => {
    switch (rank) {
      case 'excellent':
        return 'bg-status-success/[0.12] text-status-success'
      case 'strong':
        return 'bg-status-info/[0.12] text-status-info'
      case 'moderate':
        return 'bg-status-warning/[0.12] text-status-warning'
      case 'weak':
        return 'bg-status-danger/[0.12] text-status-danger'
      default:
        return 'bg-bg-100 text-ink-3'
    }
  }

  const getRankBandLabel = (rank: string) => {
    const labels: Record<string, Record<string, string>> = {
      excellent: { en: 'Excellent Match', th: 'ตรงกันดีมาก' },
      strong: { en: 'Strong Match', th: 'ตรงกันดี' },
      moderate: { en: 'Moderate Match', th: 'ตรงกันปานกลาง' },
      weak: { en: 'Weak Match', th: 'ตรงกันน้อย' },
    }
    return labels[rank]?.[lang === 'th' ? 'th' : 'en'] || rank
  }

  const poolStats = scholarship?.candidatePoolStats

  if (!scholarship) {
    return (
      <AppShell requiredRole="provider">
        <div className="text-center py-8">
          <p className="text-ink-3">{lang === 'th' ? 'ไม่พบทุน' : 'Scholarship not found'}</p>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="provider">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/provider/scholarships" className="text-ink-3 hover:text-ink-1 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <PageHeader
          title={lang === 'th' ? 'ชุมชนผู้สมัคร' : 'Candidate Pool'}
          subtitle={lang === 'th' ? 'ดูและเลือกผู้สมัครที่เข้าเงื่อนไข' : 'View and shortlist qualified candidates'}
        />
      </div>

      <div className="space-y-6">
        {/* Pool Statistics */}
        {poolStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="card p-4">
              <p className="text-xs text-ink-3 mb-1">
                {lang === 'th' ? 'ทั้งหมด' : 'Total'}
              </p>
              <p className="text-2xl font-semibold text-ink-1">{poolStats.totalCandidates}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-ink-3 mb-1">
                {lang === 'th' ? 'ความตรงกันเฉลี่ย' : 'Avg Confidence'}
              </p>
              <p className="text-2xl font-semibold text-ink-1">{(poolStats.averageConfidence * 100).toFixed(0)}%</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-ink-3 mb-1">
                {lang === 'th' ? 'ตรงกันดีมาก' : 'Excellent'}
              </p>
              <p className="text-2xl font-semibold text-status-success">{poolStats.excellentMatches}</p>
            </div>
            <div className="card p-4">
              <p className="text-xs text-ink-3 mb-1">
                {lang === 'th' ? 'ตรงกันดี' : 'Strong'}
              </p>
              <p className="text-2xl font-semibold text-status-info">{poolStats.strongMatches}</p>
            </div>
          </div>
        )}

        {/* Selection Summary */}
        {selectedCandidates.size > 0 && (
          <div className="card p-4 bg-brand/[0.06] border border-brand/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-ink-1">
                  {lang === 'th' ? `เลือก ${selectedCandidates.size} ผู้สมัคร` : `${selectedCandidates.size} candidate${selectedCandidates.size === 1 ? '' : 's'} selected`}
                </p>
                <p className="text-xs text-ink-3 mt-1">
                  {lang === 'th' ? 'คลิกส่งขอเพื่อร้องขอการเปิดเผยข้อมูล' : 'Click Request to ask for disclosure'}
                </p>
              </div>
              <button
                onClick={handleClearSelection}
                className="text-xs text-status-danger hover:text-status-danger/80 font-semibold transition-colors"
              >
                {lang === 'th' ? 'ลบทั้งหมด' : 'Clear'}
              </button>
            </div>
          </div>
        )}

        {/* Candidates List */}
        <div className="space-y-3">
          {candidates.length > 0 ? (
            candidates.map((candidate) => {
              const isSelected = selectedCandidates.has(candidate.candidateToken)
              return (
                <div
                  key={candidate.candidateToken}
                  className="card p-4 hover:border-brand/30 transition-colors cursor-pointer"
                  onClick={() => toggleCandidateSelection(candidate.candidateToken)}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      {isSelected ? (
                        <CheckCircle2 size={20} className="text-brand" />
                      ) : (
                        <Circle size={20} className="text-ink-3" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div>
                          <h3 className="font-semibold text-ink-1">
                            {candidate.candidateToken}
                          </h3>
                          <p className="text-xs text-ink-3 mt-1">
                            {lang === 'th' ? 'ผู้สมัครที่ไม่ระบุตัวตน' : 'Anonymous Candidate'}
                          </p>
                        </div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${getRankBandColor(candidate.matchRankBand)}`}>
                          {getRankBandLabel(candidate.matchRankBand)}
                        </span>
                      </div>

                      {/* Match Confidence */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-ink-3">
                            {lang === 'th' ? 'ตรงกัน' : 'Match Confidence'}
                          </span>
                          <span className="text-xs font-semibold text-brand">{Math.round(candidate.matchConfidence * 100)}%</span>
                        </div>
                        <div className="h-2 bg-bg-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand transition-all"
                            style={{ width: `${candidate.matchConfidence * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Scoring Breakdown */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                        {candidate.scoringDetails.map((detail, idx) => (
                          <div key={idx} className="bg-bg-100 rounded p-2">
                            <p className="text-ink-3 truncate">{detail.criterionName}</p>
                            <p className="font-semibold text-ink-1">{detail.contribution}%</p>
                          </div>
                        ))}
                      </div>

                      {/* Aggregate Stats */}
                      <div className="mt-3 pt-3 border-t border-bg-100">
                        <div className="flex items-center gap-4 text-xs text-ink-3">
                          <span>
                            {lang === 'th' ? 'GPA:' : 'GPA:'} <span className="font-semibold text-ink-1">{candidate.aggregateStats.gpaRange.min}-{candidate.aggregateStats.gpaRange.max}</span>
                          </span>
                          <span>
                            {lang === 'th' ? 'ความต้องการ:' : 'Financial Need:'} <span className="font-semibold text-ink-1">{candidate.aggregateStats.financialNeedPercentile}th %ile</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="card p-8 text-center">
              <p className="text-ink-3 text-sm">
                {lang === 'th' ? 'ยังไม่มีผู้สมัครในระบบ' : 'No candidates in pool yet'}
              </p>
            </div>
          )}
        </div>

        {/* Action Button */}
        {candidates.length > 0 && (
          <div className="sticky bottom-0 p-4 bg-gradient-to-t from-bg-000 to-transparent">
            <button
              onClick={handleOpenModal}
              disabled={selectedCandidates.size === 0}
              className="w-full btn-primary py-3 text-sm font-semibold disabled:opacity-60"
            >
              {lang === 'th'
                ? `ส่งขอเปิดเผย (${selectedCandidates.size})`
                : `Request Disclosure (${selectedCandidates.size})`}
            </button>
          </div>
        )}

        {/* Privacy Notice */}
        <div className="card p-4 rounded-xl bg-status-info/[0.06] border border-status-info/20">
          <p className="text-xs text-status-info/80">
            <span className="font-semibold">🔒 {lang === 'th' ? 'ความเป็นส่วนตัวของผู้สมัคร' : 'Candidate Privacy'}</span>
            <br />
            {lang === 'th'
              ? 'ผู้สมัครจะได้รับการระบุด้วยโทเค็นที่ปลอดภัยเท่านั้น (Candidate #C-XXXX) ไม่มีชื่อ อีเมล หรืออักษรประจำตัว การจับคู่ขึ้นอยู่กับสถิติที่รวบรวมและคะแนนเท่านั้น'
              : 'All candidates are anonymized using secure tokens (Candidate #C-XXXX). No names, emails, or IDs. Matching is based on aggregated statistics and scores only.'}
          </p>
        </div>
      </div>

      {/* Shortlist Request Modal */}
      <ShortlistRequestModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        candidateCount={selectedCandidates.size}
        scholarshipName={scholarship.title_en}
      />
    </AppShell>
  )
}

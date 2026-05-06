'use client'

import { useLang } from '@/lib/i18n'
import { useState } from 'react'
import Link from 'next/link'
import { mockMatchReviews } from '@/data/mock/staffData'
import MatchReviewCard from '@/components/staff/MatchReviewCard'
import MatchOverrideModal from '@/components/staff/MatchOverrideModal'
import AppShell from '@/components/layout/AppShell'

export default function MatchingReviewPage() {
  const { lang } = useLang()
  const [overrideModal, setOverrideModal] = useState<{
    isOpen: boolean
    matchId?: string
  }>({ isOpen: false })

  const currentReview = mockMatchReviews.find((r) => r.id === overrideModal.matchId)

  const handleRequestOverride = (matchId: string) => {
    setOverrideModal({ isOpen: true, matchId })
  }

  const handleSubmitOverride = (reason: string) => {
    // Mock: just close modal after submission
    setOverrideModal({ isOpen: false })
  }

  return (
    <AppShell requiredRole="staff">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-ink-1 mb-2">
            {lang === 'th' ? 'ตรวจสอบการจับคู่' : 'Matching Review'}
          </h1>
          <p className="text-sm text-ink-3">
            {lang === 'th'
              ? 'ทบทวนและอนุมัติการจับคู่ของผู้สมัครกับโครงการให้ทุน รวมถึงการปฏิเสธและการแทนที่ด้วยตนเอง'
              : 'Review and approve candidate-scholarship matches. Include rejections and manual overrides.'}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'ยอดการจับคู่ทั้งหมด' : 'Total Matches'}
            </p>
            <p className="text-2xl font-bold text-ink-1">{mockMatchReviews.length}</p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'ความเป็นห่วง' : 'Flagged'}
            </p>
            <p className="text-2xl font-bold text-status-warning">
              {mockMatchReviews.filter((r) => r.fairnessFlag).length}
            </p>
          </div>
          <div className="card p-4">
            <p className="text-xs text-ink-3 mb-1">
              {lang === 'th' ? 'ข้อมูลล้าสมัย' : 'Stale Data'}
            </p>
            <p className="text-2xl font-bold text-status-danger">
              {mockMatchReviews.filter((r) => r.dataFreshness === 'stale').length}
            </p>
          </div>
        </div>

        {/* Matching Reviews */}
        <div className="space-y-3">
          <h2 className="font-semibold text-sm text-ink-1 mb-4">
            {lang === 'th' ? 'คิวการจับคู่' : 'Matching Queue'}
          </h2>

          {mockMatchReviews.length === 0 ? (
            <div className="card p-8 text-center">
              <p className="text-sm text-ink-3">
                {lang === 'th' ? 'ไม่มีการจับคู่ที่ต้องการการตรวจสอบ' : 'No matches requiring review'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {mockMatchReviews.map((review) => (
                <Link
                  key={review.id}
                  href={`/staff/matching-review/${review.id}`}
                  className="block hover:opacity-75 transition-opacity"
                >
                  <MatchReviewCard
                    review={review}
                    onRequestManualOverride={handleRequestOverride}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Override Modal */}
      {currentReview && (
        <MatchOverrideModal
          isOpen={overrideModal.isOpen}
          onClose={() => setOverrideModal({ isOpen: false })}
          studentToken={currentReview.studentToken}
          originalDecision={currentReview.hardEligibilityPass ? 'approved' : 'rejected'}
          proposedDecision={currentReview.hardEligibilityPass ? 'rejected' : 'approved'}
          matchScore={currentReview.matchScore}
          onSubmit={handleSubmitOverride}
        />
      )}
    </AppShell>
  )
}

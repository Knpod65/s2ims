'use client'

import { useLang } from '@/lib/i18n'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { mockMatchReviews } from '@/data/mock/staffData'
import MaskedStudentProfileCard from '@/components/staff/MaskedStudentProfileCard'
import MatchReviewCard from '@/components/staff/MatchReviewCard'
import MatchOverrideModal from '@/components/staff/MatchOverrideModal'
import AppShell from '@/components/layout/AppShell'

export default function MatchDetailPage() {
  const { lang } = useLang()
  const router = useRouter()
  const params = useParams()
  const matchId = params.matchId as string

  const [showOverrideModal, setShowOverrideModal] = useState(false)

  const review = mockMatchReviews.find((r) => r.id === matchId)

  if (!review) {
    return (
      <AppShell requiredRole="staff">
        <div className="card p-8 text-center">
          <p className="text-sm text-ink-3">
            {lang === 'th' ? 'ไม่พบการจับคู่' : 'Match not found'}
          </p>
          <Link
            href="/staff/matching-review"
            className="text-xs text-role-primary hover:text-role-primary mt-4 inline-block"
          >
            {lang === 'th' ? '← กลับไปตรวจสอบการจับคู่' : '← Back to Matching Review'}
          </Link>
        </div>
      </AppShell>
    )
  }

  const handleSubmitOverride = (reason: string) => {
    // Mock: just close modal after submission
    setShowOverrideModal(false)
  }

  return (
    <AppShell requiredRole="staff">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-surface-low rounded transition-colors"
          >
            <ChevronLeft size={20} className="text-ink-3" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-ink-1">
              {lang === 'th' ? 'รายละเอียดการจับคู่' : 'Match Details'}
            </h1>
            <p className="text-sm text-ink-3">{review.studentToken}</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile */}
          <div className="lg:col-span-1">
            <MaskedStudentProfileCard
              profile={{
                token: review.studentToken,
                gpaRange: { min: 3.6, max: 3.8 },
                financialNeedPercentile: 75,
                academicYear: 4,
                department: 'Computer Science',
              }}
            />
          </div>

          {/* Right Column - Review Details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Match Review Card */}
            <MatchReviewCard
              review={review}
              onRequestManualOverride={() => setShowOverrideModal(true)}
            />

            {/* Application Details */}
            <div className="card p-5 border-role-border space-y-4">
              <h3 className="font-semibold text-sm text-ink-1">
                {lang === 'th' ? 'รายละเอียดการสมัคร' : 'Application Details'}
              </h3>

              <div className="space-y-3">
                <div className="flex items-start justify-between p-3 rounded bg-bg-100">
                  <span className="text-xs text-ink-3">
                    {lang === 'th' ? 'หมายเลขการสมัคร' : 'Application ID'}
                  </span>
                  <span className="text-xs font-medium text-ink-1">{review.applicationId}</span>
                </div>

                <div className="flex items-start justify-between p-3 rounded bg-bg-100">
                  <span className="text-xs text-ink-3">
                    {lang === 'th' ? 'หมายเลขทุน' : 'Scholarship ID'}
                  </span>
                  <span className="text-xs font-medium text-ink-1">{review.scholarshipId}</span>
                </div>

                <div className="flex items-start justify-between p-3 rounded bg-bg-100">
                  <span className="text-xs text-ink-3">
                    {lang === 'th' ? 'วันที่ปรับปรุงล่าสุด' : 'Last Updated'}
                  </span>
                  <span className="text-xs font-medium text-ink-1">
                    {new Date(review.lastUpdated).toLocaleDateString(
                      lang === 'th' ? 'th-TH' : 'en-US'
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Decision Support */}
            <div className="card p-5 border-role-border">
              <h3 className="font-semibold text-sm text-ink-1 mb-3">
                {lang === 'th' ? 'การสนับสนุนการตัดสินใจ' : 'Decision Support'}
              </h3>
              <p className="text-xs text-ink-3 leading-relaxed">
                {review.hardEligibilityPass
                  ? lang === 'th'
                    ? 'ผู้สมัครนี้ผ่านเกณฑ์ความสามารถอย่างเข้มงวด ลองพิจารณาอนุมัติ เว้นแต่มีปัญหาด้านการเงินหรือข้อมูล'
                    : 'This candidate passes hard eligibility. Consider approval unless there are financial or data concerns.'
                  : lang === 'th'
                  ? 'ผู้สมัครนี้ไม่ผ่านเกณฑ์ความสามารถอย่างเข้มงวด คุณอาจต้องการแทนที่ด้วยตนเองหากมีสถานการณ์พิเศษ'
                  : 'This candidate does not pass hard eligibility. Consider manual override if there are special circumstances.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Override Modal */}
      <MatchOverrideModal
        isOpen={showOverrideModal}
        onClose={() => setShowOverrideModal(false)}
        studentToken={review.studentToken}
        originalDecision={review.hardEligibilityPass ? 'approved' : 'rejected'}
        proposedDecision={review.hardEligibilityPass ? 'rejected' : 'approved'}
        matchScore={review.matchScore}
        onSubmit={handleSubmitOverride}
      />
    </AppShell>
  )
}

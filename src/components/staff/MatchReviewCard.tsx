'use client'

import { useState } from 'react'
import { useLang } from '@/lib/i18n'
import { TrendingUp, AlertTriangle, CheckCircle2, Zap } from 'lucide-react'
import type { MatchReview } from '@/data/mock/staffData'
import FairnessAlertCard from './FairnessAlertCard'

interface MatchReviewCardProps {
  review: MatchReview
  onRequestManualOverride?: (matchId: string) => void
}

export default function MatchReviewCard({ review, onRequestManualOverride }: MatchReviewCardProps) {
  const { lang } = useLang()
  const [expanded, setExpanded] = useState(false)

  const getConfidenceBandColor = (band: string) => {
    switch (band) {
      case 'excellent':
      case 'strong':
        return 'bg-status-success/10 text-status-success'
      case 'moderate':
        return 'bg-status-warning/10 text-status-warning'
      case 'weak':
        return 'bg-status-danger/10 text-status-danger'
      default:
        return 'bg-brand/10 text-brand'
    }
  }

  const getConfidenceBandLabel = (band: string) => {
    const labels: Record<string, Record<string, string>> = {
      excellent: { th: 'ความเชื่อมั่นยอดเยี่ยม', en: 'Excellent' },
      strong: { th: 'ความเชื่อมั่นสูง', en: 'Strong' },
      moderate: { th: 'ความเชื่อมั่นปานกลาง', en: 'Moderate' },
      weak: { th: 'ความเชื่อมั่นต่ำ', en: 'Weak' },
    }
    return labels[band]?.[lang === 'th' ? 'th' : 'en'] || band
  }

  return (
    <div
      className={`rounded-lg border transition-all ${
        expanded ? 'border-brand/30 bg-brand/[0.02]' : 'border-white/[0.08]'
      }`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-start justify-between gap-3 hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-start gap-3 flex-1 text-left">
          <TrendingUp size={16} className="text-brand mt-0.5" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm text-ink-1">{review.studentToken}</span>
              {review.hardEligibilityPass && (
                <CheckCircle2 size={12} className="text-status-success" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs px-2 py-1 rounded ${getConfidenceBandColor(review.confidenceBand)}`}>
                {getConfidenceBandLabel(review.confidenceBand)}
              </span>
              <span className="text-xs text-ink-3">
                {lang === 'th' ? 'คะแนน:' : 'Score:'} {review.matchScore}%
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs text-ink-3">{expanded ? '−' : '+'}</div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="border-t border-white/[0.08] p-4 bg-bg-200/50 space-y-3">
          {/* Match Score & Confidence */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-100 rounded-lg p-3">
              <p className="text-xs text-ink-3 mb-1">{lang === 'th' ? 'คะแนนการจับคู่' : 'Match Score'}</p>
              <p className="font-semibold text-ink-1">{review.matchScore}%</p>
            </div>
            <div className="bg-bg-100 rounded-lg p-3">
              <p className="text-xs text-ink-3 mb-1">{lang === 'th' ? 'ความเชื่อมั่น' : 'Confidence'}</p>
              <p className="font-semibold text-ink-1">{(review.confidence * 100).toFixed(0)}%</p>
            </div>
          </div>

          {/* Eligibility Status */}
          <div className="p-3 rounded bg-brand/10 border border-brand/20">
            <p className="text-xs text-brand font-semibold mb-1">
              {lang === 'th' ? 'สถานะความสามารถ' : 'Eligibility Status'}
            </p>
            <p className="text-xs text-brand/90">
              {review.hardEligibilityPass
                ? lang === 'th'
                  ? '✓ ผ่านเงื่อนไขอย่างเข้มงวด'
                  : '✓ Passes hard eligibility'
                : lang === 'th'
                ? '✗ ไม่ผ่านเงื่อนไขอย่างเข้มงวด'
                : '✗ Fails hard eligibility'}
            </p>
          </div>

          {/* Soft Match Breakdown */}
          <div className="p-3 rounded bg-bg-100 border border-white/[0.08]">
            <p className="text-xs text-ink-3 font-semibold mb-2">
              {lang === 'th' ? 'การแยกตัวชี้วัดการจับคู่' : 'Soft Match Breakdown'}
            </p>
            <div className="space-y-2">
              {review.softMatchBreakdown.map((criteria, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="text-ink-3">{criteria.criterion}</span>
                  <span className="font-medium text-ink-1">{criteria.contribution}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Fairness Alert */}
          {review.fairnessFlag && (
            <FairnessAlertCard
              type={review.fairnessFlag.type}
              message={review.fairnessFlag.message}
            />
          )}

          {/* Data Freshness */}
          <p className="text-xs text-ink-3">
            {lang === 'th' ? 'ความสดใหม่ของข้อมูล:' : 'Data Freshness:'}{' '}
            {review.dataFreshness === 'current'
              ? lang === 'th'
                ? 'ปัจจุบัน'
                : 'Current'
              : lang === 'th'
              ? 'เก่า (> 30 วัน)'
              : 'Stale (> 30 days)'}
          </p>

          {/* Actions */}
          <div className="pt-3 border-t border-white/[0.08]">
            {onRequestManualOverride && (
              <button
                onClick={() => onRequestManualOverride(review.id)}
                className="w-full text-xs py-2 px-3 bg-status-warning/10 text-status-warning rounded hover:bg-status-warning/20 transition-colors flex items-center justify-center gap-1"
              >
                <Zap size={12} />
                {lang === 'th' ? 'ขอแทนที่ด้วยตนเอง' : 'Request Manual Override'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

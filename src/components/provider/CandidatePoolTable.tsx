'use client'

import MatchScoreRing from '@/components/MatchScoreRing'
import { useLang } from '@/lib/i18n'
import type { CandidateMatch } from '@/data/mock/providerData'
import ShortlistStatusBadge from './ShortlistStatusBadge'

type CandidatePoolTableProps = {
  candidates: CandidateMatch[]
}

export default function CandidatePoolTable({ candidates }: CandidatePoolTableProps) {
  const { lang } = useLang()

  return (
    <div className="hidden overflow-hidden rounded-xl border border-line bg-white lg:block">
      <table className="w-full text-left text-sm">
        <thead className="bg-surface-low text-xs uppercase tracking-[0.08em] text-ink-3">
          <tr>
            <th className="px-4 py-3">{lang === 'th' ? 'โทเค็นผู้สมัคร' : 'Candidate token'}</th>
            <th className="px-4 py-3">{lang === 'th' ? 'คะแนน' : 'Match'}</th>
            <th className="px-4 py-3">{lang === 'th' ? 'กลุ่มวิชาการ' : 'Academic band'}</th>
            <th className="px-4 py-3">{lang === 'th' ? 'ความจำเป็น' : 'Need band'}</th>
            <th className="px-4 py-3">{lang === 'th' ? 'สถานะ' : 'Status'}</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {candidates.map(candidate => (
            <tr key={candidate.candidateToken} className="hover:bg-role-tint/60">
              <td className="px-4 py-3 font-mono font-semibold text-ink-1">{candidate.candidateToken}</td>
              <td className="px-4 py-3">
                <MatchScoreRing score={candidate.matchScore} size="sm" confidence={candidate.confidence} showConfidenceLabel={false} />
              </td>
              <td className="px-4 py-3 text-xs text-ink-2">{lang === 'th' ? candidate.academicBand_th : candidate.academicBand_en}</td>
              <td className="px-4 py-3 text-xs text-ink-2">{lang === 'th' ? candidate.needBand_th : candidate.needBand_en}</td>
              <td className="px-4 py-3">
                <ShortlistStatusBadge status={candidate.shortlistStatus === 'none' ? 'none' : candidate.shortlistStatus} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

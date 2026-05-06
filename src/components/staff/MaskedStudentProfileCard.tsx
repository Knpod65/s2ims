'use client'

import { useLang } from '@/lib/i18n'
import { Eye, Lock } from 'lucide-react'
import type { MaskedStudentProfile } from '@/data/mock/staffData'

interface MaskedStudentProfileCardProps {
  profile: MaskedStudentProfile
  onRevealIdentity?: () => void
}

export default function MaskedStudentProfileCard({ profile, onRevealIdentity }: MaskedStudentProfileCardProps) {
  const { lang } = useLang()

  return (
    <div className="card p-5 border-brand/20">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Lock size={14} className="text-brand" />
          <div>
            <h3 className="font-semibold text-ink-1">{profile.token}</h3>
            <p className="text-xs text-ink-3">{lang === 'th' ? 'โปรไฟล์ที่ปกปิด' : 'Masked Profile'}</p>
          </div>
        </div>
        {onRevealIdentity && (
          <button
            onClick={onRevealIdentity}
            className="text-xs text-brand hover:text-brand-light flex items-center gap-1 px-2 py-1 rounded border border-brand/20 hover:border-brand/40 transition-all"
          >
            <Eye size={12} />
            {lang === 'th' ? 'เปิดเผยตัวตน' : 'Reveal Identity'}
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
        <div className="bg-bg-100 rounded-lg p-3">
          <p className="text-xs text-ink-3 mb-1">{lang === 'th' ? 'GPA' : 'GPA'}</p>
          <p className="font-semibold text-ink-1">
            {profile.gpaRange.min.toFixed(1)}–{profile.gpaRange.max.toFixed(1)}
          </p>
        </div>
        <div className="bg-bg-100 rounded-lg p-3">
          <p className="text-xs text-ink-3 mb-1">
            {lang === 'th' ? 'ความต้องการทางการเงิน' : 'Financial Need'}
          </p>
          <p className="font-semibold text-ink-1">{profile.financialNeedPercentile}th %ile</p>
        </div>
        <div className="bg-bg-100 rounded-lg p-3">
          <p className="text-xs text-ink-3 mb-1">{lang === 'th' ? 'ชั้นปี' : 'Academic Year'}</p>
          <p className="font-semibold text-ink-1">Year {profile.academicYear}</p>
        </div>
        {profile.department && (
          <div className="bg-bg-100 rounded-lg p-3">
            <p className="text-xs text-ink-3 mb-1">{lang === 'th' ? 'ภาค' : 'Department'}</p>
            <p className="font-semibold text-ink-1 truncate">{profile.department}</p>
          </div>
        )}
      </div>

      <div className="mt-3 pt-3 border-t border-bg-100">
        <p className="text-xs text-ink-3">
          {lang === 'th'
            ? '🔒 ข้อมูลส่วนบุคคล (ชื่อ อีเมล โทรศัพท์) ถูกซ่อนไว้ตามค่าเริ่มต้นเพื่อปกป้องความเป็นส่วนตัว'
            : '🔒 Personal information (name, email, phone) is hidden by default to protect privacy'}
        </p>
      </div>
    </div>
  )
}

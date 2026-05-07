'use client'
import { ShieldCheck } from 'lucide-react'
import { useLang } from '@/lib/i18n'

type StudentPrivacyNoticeProps = {
  compact?: boolean
  className?: string
}

export default function StudentPrivacyNotice({ compact = false, className = '' }: StudentPrivacyNoticeProps) {
  const { lang } = useLang()

  return (
    <div className={`rounded-xl border border-[#0055FF]/15 bg-[#E5EDFF]/70 px-4 py-3 text-sm text-ink-2 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-lg bg-white p-2 text-role-primary shadow-soft">
          <ShieldCheck size={compact ? 15 : 17} />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-ink-1">
            {lang === 'th' ? 'ข้อมูลของคุณใช้เพื่อการจับคู่ทุนเท่านั้น' : 'Your data is used only for your scholarship matching'}
          </div>
          {!compact && (
            <p className="mt-1 text-xs leading-relaxed text-ink-2">
              {lang === 'th'
                ? 'คุณเห็นเฉพาะข้อมูลของตนเอง S2IMS ไม่แสดงข้อมูลผู้สมัครรายอื่นหรือข้อมูลกลุ่มผู้สมัครให้ผู้ให้ทุนในหน้านักศึกษา และคำอธิบายนี้หลีกเลี่ยงคะแนนภายในที่ไม่จำเป็น'
                : 'You only see your own data. S2IMS does not expose other applicants or provider candidate-pool data on student pages, and this explanation avoids unnecessary internal scoring details.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

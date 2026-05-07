'use client'

import { PrivacyNotice } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'

type ProviderPrivacyNoticeProps = {
  mode?: 'candidate' | 'aggregate' | 'criteria' | 'review'
  className?: string
}

export default function ProviderPrivacyNotice({ mode = 'candidate', className = '' }: ProviderPrivacyNoticeProps) {
  const { lang } = useLang()

  const copy = {
    candidate: {
      en: 'Candidate pools are anonymized. Providers see Candidate #C-XXXX tokens plus banded or aggregate data only. Names, raw student IDs, emails, and exact sensitive values stay hidden until a future staff-approved disclosure process.',
      th: 'ชุมชนผู้สมัครถูกทำให้ไม่ระบุตัวตน ผู้ให้ทุนเห็นเฉพาะโทเค็น Candidate #C-XXXX และข้อมูลแบบกลุ่มหรือภาพรวมเท่านั้น ชื่อ รหัสนักศึกษาจริง อีเมล และค่าละเอียดที่อ่อนไหวยังคงถูกปกปิดจนกว่าจะมีขั้นตอนอนุมัติจากเจ้าหน้าที่ในอนาคต',
    },
    aggregate: {
      en: 'This view is aggregate-only. Metrics are grouped into safe bands and do not expose individual student records.',
      th: 'หน้านี้แสดงข้อมูลภาพรวมเท่านั้น ตัวชี้วัดถูกจัดเป็นกลุ่มที่ปลอดภัยและไม่เปิดเผยข้อมูลรายบุคคลของนักศึกษา',
    },
    criteria: {
      en: 'Criteria changes affect anonymous matching previews only. Providers can tune hard gates and soft weights without accessing student identity.',
      th: 'การปรับเกณฑ์มีผลต่อภาพตัวอย่างการจับคู่แบบไม่ระบุตัวตนเท่านั้น ผู้ให้ทุนปรับเงื่อนไขหลักและน้ำหนักความสอดคล้องได้โดยไม่เห็นตัวตนนักศึกษา',
    },
    review: {
      en: 'Scholarship creation and shortlist requests are mock submissions for staff review. No backend write or identity reveal is performed in this phase.',
      th: 'การสร้างทุนและการขอรายชื่อคัดเลือกเป็นการส่งจำลองเพื่อให้เจ้าหน้าที่ตรวจสอบ ไม่มีการบันทึก backend หรือเปิดเผยตัวตนในระยะนี้',
    },
  }

  return (
    <div className={className}>
      <PrivacyNotice variant={mode === 'review' ? 'warning' : 'default'}>
        {copy[mode][lang === 'th' ? 'th' : 'en']}
      </PrivacyNotice>
    </div>
  )
}

'use client'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { BadgeCheck, ClipboardList, FileCheck2, HeartHandshake, Pencil, ShieldCheck } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'
import {
  studentDataFreshness,
  studentMissingData,
  studentProfileSummary,
  type ProfileSignalStatus,
} from '@/data/mock/studentMatchingData'
import {
  DataFreshnessIndicator,
  ProfileCompletenessCard,
  StudentPrivacyNotice,
} from '@/components/student'

function SignalBadge({ status }: { status: ProfileSignalStatus }) {
  const { lang } = useLang()
  const label = status === 'verified'
    ? (lang === 'th' ? 'ตรวจสอบแล้ว' : 'Verified')
    : (lang === 'th' ? 'นักศึกษาระบุ' : 'Self-reported')
  const classes = status === 'verified'
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : 'border-[#0055FF]/20 bg-[#E5EDFF] text-role-primary'

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${classes}`}>
      {status === 'verified' ? <BadgeCheck size={12} /> : <Pencil size={12} />}
      {label}
    </span>
  )
}

function ProfileSummarySection({
  title,
  description,
  icon,
  items,
}: {
  title: string
  description: string
  icon: ReactNode
  items: Array<{ label: { th: string; en: string }; value: { th: string; en: string }; status: ProfileSignalStatus }>
}) {
  const { lang } = useLang()

  return (
    <section className="card p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="rounded-xl bg-role-tint p-2.5 text-role-primary">
          {icon}
        </div>
        <div>
          <h2 className="font-display text-lg font-bold text-ink-1">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-2">{description}</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.label.en} className="rounded-xl border border-line bg-white p-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-xs text-ink-3">{item.label[lang]}</div>
                <div className="mt-1 text-sm font-semibold text-ink-1">{item.value[lang]}</div>
              </div>
              <SignalBadge status={item.status} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default function StudentProfilePage() {
  const { lang } = useLang()
  const { user } = useAuth()
  const { addToast } = useToast()

  const [gpa, setGpa] = useState('3.25')
  const [housing, setHousing] = useState('dorm')
  const [works, setWorks] = useState(true)
  const [year, setYear] = useState('3')
  const [distance, setDistance] = useState('')
  const [clubs, setClubs] = useState('')
  const [skills, setSkills] = useState('')
  const [saving, setSaving] = useState(false)

  const missing = useMemo(() => {
    const m: string[] = []
    if (!distance) m.push(lang === 'th' ? 'ระยะทางจากบ้าน' : 'Distance from home')
    if (!clubs) m.push(lang === 'th' ? 'กิจกรรมชมรม' : 'Club activities')
    if (!skills) m.push(lang === 'th' ? 'ทักษะพิเศษ' : 'Special skills')
    return m
  }, [distance, clubs, skills, lang])

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    addToast(lang === 'th' ? 'บันทึกโปรไฟล์แล้ว' : 'Profile saved successfully', 'success')
  }

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'โปรไฟล์ของฉัน' : 'My Profile'}
        subtitle={lang === 'th' ? 'ข้อมูลของคุณช่วยให้การแนะนำทุนโปร่งใสและเป็นส่วนตัว' : 'Your own data helps make scholarship recommendations transparent and private.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <div className="space-y-6">
          <ProfileCompletenessCard
            percentage={studentProfileSummary.completeness}
            completedFields={studentProfileSummary.completedFields}
            totalFields={studentProfileSummary.totalFields}
            missingItems={studentMissingData}
          />
          <StudentPrivacyNotice />
          <section className="card p-5">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-xl bg-role-tint p-2.5 text-role-primary">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="font-display text-lg font-bold text-ink-1">
                  {lang === 'th' ? 'ตัวตนและข้อมูลทะเบียน' : 'Identity and registry data'}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  {lang === 'th'
                    ? 'ข้อมูลนี้เป็นข้อมูลของคุณเองและใช้เพื่อยืนยันสิทธิ์เบื้องต้น'
                    : 'This is your own data and is used for basic eligibility checks.'}
                </p>
              </div>
            </div>
            <div className="rounded-xl border border-line bg-surface-low p-4">
              <div className="text-xs text-ink-3">ID</div>
              <div className="mt-1 font-mono text-sm font-semibold text-ink-1">{user?.student_id ?? '650912345'}</div>
              <div className="mt-3 text-xs text-ink-3">{lang === 'th' ? 'ชื่อ' : 'Name'}</div>
              <div className="mt-1 text-sm font-semibold text-ink-1">{user ? (lang === 'th' ? user.name_th : user.name_en) : '-'}</div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <ProfileSummarySection
            title={lang === 'th' ? 'ข้อมูลการศึกษา' : 'Academic profile'}
            description={lang === 'th' ? 'ใช้ตรวจสอบเกณฑ์พื้นฐาน เช่น GPA ชั้นปี และสาขา' : 'Used to check basic criteria such as GPA, year, and major.'}
            icon={<ClipboardList size={18} />}
            items={studentProfileSummary.academic}
          />
          <ProfileSummarySection
            title={lang === 'th' ? 'บริบทความต้องการทุน' : 'Financial need summary'}
            description={lang === 'th' ? 'ช่วยให้ระบบอธิบายทุนที่เกี่ยวข้องกับความจำเป็นได้รอบคอบขึ้น' : 'Helps explain need-sensitive recommendations more thoughtfully.'}
            icon={<HeartHandshake size={18} />}
            items={studentProfileSummary.financialNeed}
          />
          <ProfileSummarySection
            title={lang === 'th' ? 'กิจกรรมและอาสา' : 'Activity and volunteer summary'}
            description={lang === 'th' ? 'เพิ่มบริบทสำหรับทุนด้านกิจกรรม ผู้นำ และผลกระทบทางสังคม' : 'Adds context for activity, leadership, and social-impact scholarships.'}
            icon={<BadgeCheck size={18} />}
            items={studentProfileSummary.activities}
          />
          <ProfileSummarySection
            title={lang === 'th' ? 'ความพร้อมเอกสาร' : 'Document readiness'}
            description={lang === 'th' ? 'ช่วยให้เห็นว่าข้อมูลใดพร้อมใช้และข้อมูลใดยังควรเติม' : 'Shows what is ready and what could still be improved.'}
            icon={<FileCheck2 size={18} />}
            items={studentProfileSummary.documentReadiness}
          />

          <section className="card p-5">
            <h2 className="font-display text-lg font-bold text-ink-1">
              {lang === 'th' ? 'ปรับปรุงข้อมูลที่ใช้จับคู่' : 'Update matching signals'}
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">
              {lang === 'th'
                ? 'ช่องเหล่านี้เป็นตัวอย่างข้อมูลที่นักศึกษาสามารถระบุเองได้ ข้อมูลที่ยังว่างจะไม่ลงโทษคุณ'
                : 'These are examples of self-reported details. Empty fields are prompts, not penalties.'}
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-ink-3">GPA</label>
                <input className="input-base min-h-11" value={gpa} onChange={e => setGpa(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-ink-3">{lang === 'th' ? 'ชั้นปี' : 'Year'}</label>
                <select className="input-base min-h-11" value={year} onChange={e => setYear(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-ink-3">{lang === 'th' ? 'ที่พัก' : 'Housing'}</label>
                <select className="input-base min-h-11" value={housing} onChange={e => setHousing(e.target.value)}>
                  <option value="dorm">{lang === 'th' ? 'หอพักมหาวิทยาลัย' : 'University dormitory'}</option>
                  <option value="rent">{lang === 'th' ? 'เช่าห้อง/บ้าน' : 'Rented room/house'}</option>
                  <option value="own">{lang === 'th' ? 'บ้านของครอบครัว' : 'Family home'}</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-ink-3">{lang === 'th' ? 'ระยะทางจากบ้าน' : 'Distance from home'}</label>
                <input className="input-base min-h-11" placeholder={lang === 'th' ? 'เช่น 120 กม.' : 'e.g. 120 km'} value={distance} onChange={e => setDistance(e.target.value)} />
              </div>
            </div>
            <div className="mt-4 space-y-4">
              <label className="flex min-h-11 items-center gap-3 rounded-xl border border-line bg-surface-low px-3 py-2">
                <input type="checkbox" checked={works} onChange={e => setWorks(e.target.checked)} className="accent-role-primary" />
                <span className="text-sm text-ink-1">
                  {lang === 'th' ? 'มีงานพาร์ทไทม์หรือช่วยรับผิดชอบค่าใช้จ่ายของตนเอง' : 'Works part-time or helps cover own expenses'}
                </span>
              </label>
              <div>
                <label className="mb-1 block text-xs text-ink-3">{lang === 'th' ? 'กิจกรรมชมรม/องค์กร' : 'Club or organization activities'}</label>
                <input className="input-base min-h-11" value={clubs} onChange={e => setClubs(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-xs text-ink-3">{lang === 'th' ? 'ทักษะพิเศษ' : 'Special skills'}</label>
                <input className="input-base min-h-11" value={skills} onChange={e => setSkills(e.target.value)} />
              </div>
            </div>
            {missing.length > 0 && (
              <div className="mt-4 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-3 text-xs leading-relaxed text-[#78350F]">
                {lang === 'th' ? 'ยังเติมได้อีก' : 'Still useful to add'}: {missing.join(', ')}
              </div>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-primary mt-5 min-h-11 w-full py-2.5 text-sm disabled:opacity-60"
            >
              {saving
                ? (lang === 'th' ? 'กำลังบันทึก...' : 'Saving...')
                : (lang === 'th' ? 'บันทึกโปรไฟล์' : 'Save Profile')}
            </button>
          </section>
        </div>
      </div>
    </AppShell>
  )
}

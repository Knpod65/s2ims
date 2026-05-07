'use client'
import { useState, useMemo } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import ProfileCompletionRing from '@/components/ProfileCompletionRing'
import { useAuth } from '@/lib/auth'
import { useToast } from '@/components/ui/Toast'

export default function StudentProfilePage() {
  const { lang } = useLang()
  const { user } = useAuth()
  const { addToast } = useToast()

  const [gpa, setGpa] = useState('3.25')
  const [housing, setHousing] = useState('dorm')
  const [works, setWorks] = useState(false)
  const [year, setYear] = useState('3')
  const [distance, setDistance] = useState('')
  const [clubs, setClubs] = useState('')
  const [skills, setSkills] = useState('')
  const [saving, setSaving] = useState(false)

  const missing = useMemo(() => {
    const m: string[] = []
    if (!distance) m.push(lang === 'th' ? 'ระยะทางจากบ้าน' : 'Distance from home')
    if (!clubs)    m.push(lang === 'th' ? 'กิจกรรมชมรม' : 'Club activities')
    if (!skills)   m.push(lang === 'th' ? 'ทักษะพิเศษ' : 'Special skills')
    return m
  }, [distance, clubs, skills, lang])

  const filledCount = 5 + (distance ? 1 : 0) + (clubs ? 1 : 0) + (skills ? 1 : 0)
  const pct = Math.round((filledCount / 8) * 100)

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 600))
    setSaving(false)
    addToast(lang === 'th' ? 'บันทึกโปรไฟล์แล้ว' : 'Profile saved successfully', 'success')
  }

  return (
    <AppShell requiredRole="student">
      <PageHeader
        title={lang === 'th' ? 'โปรไฟล์ของฉัน' : 'My Profile'}
        subtitle={lang === 'th' ? 'ข้อมูลที่ใช้จับคู่ทุนการศึกษา' : 'Information used for scholarship matching'}
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Completion ring sidebar */}
        <div className="card p-5">
          <ProfileCompletionRing pct={pct} missing={missing} />
          <div className="mt-4 border-t border-line pt-4 space-y-1 text-xs text-ink-3">
            <div>ID: {user?.student_id ?? '650912345'}</div>
            <div>{lang === 'th' ? 'สาขา' : 'Major'}: {lang === 'th' ? 'รัฐศาสตร์' : 'Political Science'}</div>
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Academic */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">
              {lang === 'th' ? 'ข้อมูลการศึกษา' : 'Academic Information'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-ink-3 block mb-1">GPA</label>
                <input className="input-base" value={gpa} onChange={e => setGpa(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-ink-3 block mb-1">{lang === 'th' ? 'ชั้นปี' : 'Year'}</label>
                <select className="input-base" value={year} onChange={e => setYear(e.target.value)}>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
            </div>
          </div>

          {/* Living situation */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">
              {lang === 'th' ? 'สถานการณ์ที่พัก' : 'Living Situation'}
            </h3>
            <div className="space-y-3 mb-4">
              {([
                ['dorm', lang === 'th' ? 'หอพักมหาวิทยาลัย' : 'University dormitory'],
                ['rent', lang === 'th' ? 'เช่าห้อง/บ้าน' : 'Rented room/house'],
                ['own',  lang === 'th' ? 'บ้านของตัวเอง' : 'Own/family home'],
              ] as [string, string][]).map(([v, l]) => (
                <label key={v} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" name="housing" value={v} checked={housing === v}
                    onChange={() => setHousing(v)} className="accent-role-primary" />
                  <span className="text-sm text-ink-1">{l}</span>
                </label>
              ))}
            </div>
            <div>
              <label className="text-xs text-ink-3 block mb-1">
                {lang === 'th' ? 'ระยะทางจากบ้านถึงมหาวิทยาลัย (กม.)' : 'Distance from home to university (km)'}
              </label>
              <input
                className="input-base"
                placeholder={lang === 'th' ? 'เช่น 120' : 'e.g. 120'}
                value={distance}
                onChange={e => setDistance(e.target.value)}
              />
            </div>
          </div>

          {/* Activities & skills */}
          <div className="card p-5">
            <h3 className="font-semibold text-sm text-ink-1 mb-4">
              {lang === 'th' ? 'กิจกรรมและทักษะ' : 'Activities & Skills'}
            </h3>
            <p className="text-xs text-ink-3 mb-4">
              {lang === 'th'
                ? 'ข้อมูลเหล่านี้ช่วยให้ระบบเข้าใจสถานการณ์ของคุณโดยไม่ต้องถามโดยตรง'
                : 'These signals help us understand your situation without asking directly'}
            </p>
            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={works} onChange={e => setWorks(e.target.checked)} className="accent-role-primary" />
                <span className="text-sm text-ink-1">
                  {lang === 'th' ? 'มีงานพาร์ทไทม์ / ช่วยเหลือค่าใช้จ่ายของตัวเอง' : 'Works part-time / covers own expenses'}
                </span>
              </label>
              <div>
                <label className="text-xs text-ink-3 block mb-1">
                  {lang === 'th' ? 'กิจกรรมชมรม/องค์กร' : 'Club / organization activities'}
                </label>
                <input
                  className="input-base"
                  placeholder={lang === 'th' ? 'เช่น ชมรมดนตรี, นักศึกษาวิชาทหาร' : 'e.g. Music club, Student council'}
                  value={clubs}
                  onChange={e => setClubs(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs text-ink-3 block mb-1">
                  {lang === 'th' ? 'ทักษะพิเศษ' : 'Special skills'}
                </label>
                <input
                  className="input-base"
                  placeholder={lang === 'th' ? 'เช่น ภาษาอังกฤษ, การเขียนโปรแกรม' : 'e.g. English, Programming'}
                  value={skills}
                  onChange={e => setSkills(e.target.value)}
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-primary w-full py-2.5 text-sm disabled:opacity-60"
          >
            {saving
              ? (lang === 'th' ? 'กำลังบันทึก...' : 'Saving...')
              : (lang === 'th' ? 'บันทึกโปรไฟล์' : 'Save Profile')}
          </button>
        </div>
      </div>
    </AppShell>
  )
}

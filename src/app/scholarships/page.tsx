'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Search, Globe } from 'lucide-react'
import { mockScholarships } from '@/data/mock/scholarships'
import ScholarshipCard from '@/components/ScholarshipCard'
import { useLang } from '@/lib/i18n'
import { useAuth } from '@/lib/auth'

export default function ScholarshipsPage() {
  const { lang, setLang } = useLang()
  const { role } = useAuth()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [saved, setSaved] = useState<Set<string>>(
    () => new Set(mockScholarships.filter(s => s.is_saved).map(s => s.id))
  )

  const toggleSave = (id: string) => {
    setSaved(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filtered = mockScholarships.filter(s => {
    const q = search.toLowerCase()
    const matchSearch = s.title_th.toLowerCase().includes(q) || s.title_en.toLowerCase().includes(q)
    const matchFilter = filter === 'all' || s.type === filter
    return matchSearch && matchFilter
  })

  return (
    <div className="min-h-screen bg-bg-000">
      <header className="border-b border-white/[0.08] px-5 h-14 flex items-center gap-4 sticky top-0 bg-bg-000/95 backdrop-blur z-10">
        <Link href="/" className="font-display font-bold text-base text-ink-1">S²IMS</Link>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-ink-2 hover:text-ink-1 transition-all"
          >
            <Globe size={12} />{lang === 'th' ? 'EN' : 'TH'}
          </button>
          {role
            ? <Link href={`/${role}/dashboard`} className="btn-primary text-xs py-1.5 px-3">Dashboard</Link>
            : <Link href="/login" className="btn-primary text-xs py-1.5 px-3">{lang === 'th' ? 'เข้าสู่ระบบ' : 'Login'}</Link>
          }
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-5 py-8 page-animate">
        <h1 className="font-display font-bold text-2xl text-ink-1 mb-1">
          {lang === 'th' ? 'ทุนการศึกษาทั้งหมด' : 'All Scholarships'}
        </h1>
        <p className="text-ink-3 text-sm mb-6">
          {filtered.length} {lang === 'th' ? 'รายการ' : 'scholarships found'}
          {saved.size > 0 && (
            <span className="ml-3 text-brand">· {saved.size} {lang === 'th' ? 'บันทึกแล้ว' : 'saved'}</span>
          )}
        </p>

        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-3" />
            <input
              className="input-base pl-9"
              placeholder={lang === 'th' ? 'ค้นหาทุน...' : 'Search scholarships...'}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="input-base w-auto" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="all">{lang === 'th' ? 'ทุกประเภท' : 'All Types'}</option>
            <option value="merit">{lang === 'th' ? 'ผลการเรียน' : 'Merit'}</option>
            <option value="need">{lang === 'th' ? 'ความต้องการ' : 'Need-based'}</option>
            <option value="activity">{lang === 'th' ? 'กิจกรรม' : 'Activity'}</option>
            <option value="research">{lang === 'th' ? 'วิจัย' : 'Research'}</option>
            <option value="international">{lang === 'th' ? 'นานาชาติ' : 'International'}</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-ink-3">
            <div className="text-4xl mb-3 opacity-30">🔍</div>
            <div className="text-sm">{lang === 'th' ? 'ไม่พบทุนที่ตรงกับการค้นหา' : 'No scholarships match your search'}</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(s => (
              <ScholarshipCard
                key={s.id}
                scholarship={{ ...s, is_saved: saved.has(s.id) }}
                showMatch={!!role}
                onSave={toggleSave}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

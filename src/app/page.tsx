'use client'
import Link from 'next/link'
import { BookOpen, ArrowRight, Globe } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import { mockScholarships } from '@/data/mock/scholarships'
import ScholarshipCard from '@/components/ScholarshipCard'
import { useAuth } from '@/lib/auth'
import { ROLE_HOME } from '@/lib/navigation'

export default function HomePage() {
  const { lang, setLang } = useLang()
  const { role } = useAuth()

  const open = mockScholarships.filter(s => s.status === 'OPEN' || s.status === 'PUBLISHED').slice(0, 3)

  return (
    <div className="min-h-screen bg-bg-000">
      {/* Topbar */}
      <header className="border-b border-white/[0.08] px-5 h-14 flex items-center gap-4">
        <div className="font-display font-bold text-lg text-ink-1 tracking-tight">S²IMS</div>
        <div className="text-ink-3 text-xs hidden sm:block">
          {lang === 'th' ? 'ระบบจับคู่ทุนการศึกษาอัจฉริยะ' : 'Scholarship Intelligence & Management'}
        </div>
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-ink-2 hover:text-ink-1 transition-all"
          >
            <Globe size={12} />
            {lang === 'th' ? 'EN' : 'TH'}
          </button>
          {role ? (
            <Link href={ROLE_HOME[role]} className="btn-primary text-xs py-1.5 px-3">
              {lang === 'th' ? 'ไปยังแดชบอร์ด' : 'Go to Dashboard'}
            </Link>
          ) : (
            <Link href="/login" className="btn-primary text-xs py-1.5 px-3">
              {lang === 'th' ? 'เข้าสู่ระบบ' : 'Login'}
            </Link>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="px-5 py-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-medium mb-6">
          <BookOpen size={12} />
          {lang === 'th' ? 'คณะรัฐศาสตร์และรัฐประศาสนศาสตร์ มหาวิทยาลัยเชียงใหม่' : 'Faculty of Political Science and Public Administration, CMU'}
        </div>
        <h1 className="font-display font-bold text-4xl md:text-5xl text-ink-1 tracking-tight leading-tight mb-4">
          {lang === 'th'
            ? <>ค้นหาทุนที่<span className="text-brand"> เหมาะกับคุณ</span><br />ด้วยระบบอัจฉริยะ</>
            : <>Find scholarships<span className="text-brand"> matched for you</span><br />with AI-powered intelligence</>
          }
        </h1>
        <p className="text-ink-2 text-lg max-w-xl mx-auto mb-8">
          {lang === 'th'
            ? 'ระบบจับคู่ทุนการศึกษาอัจฉริยะ ที่เข้าใจโปรไฟล์ของคุณและแนะนำทุนที่เหมาะสมที่สุด'
            : 'An intelligent scholarship matching system that understands your profile and recommends the best opportunities.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/login" className="btn-primary flex items-center justify-center gap-2 px-6 py-3 text-sm">
            {lang === 'th' ? 'เริ่มต้นใช้งาน' : 'Get Started'}
            <ArrowRight size={14} />
          </Link>
          <Link href="/scholarships" className="btn-secondary flex items-center justify-center gap-2 px-6 py-3 text-sm">
            {lang === 'th' ? 'ดูทุนที่เปิดรับ' : 'Browse Scholarships'}
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="px-5 py-8 border-y border-white/[0.06]">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num: '5', label: lang === 'th' ? 'ทุนที่เปิดรับ' : 'Open Scholarships' },
            { num: '฿205,000', label: lang === 'th' ? 'มูลค่าทุนรวม' : 'Total Award Value' },
            { num: '46', label: lang === 'th' ? 'จำนวนทุนทั้งหมด' : 'Total Awards' },
            { num: '4', label: lang === 'th' ? 'ผู้ให้ทุน' : 'Scholarship Providers' },
          ].map((s, i) => (
            <div key={i} className="card p-4 text-center">
              <div className="font-display font-bold text-2xl text-brand mb-1">{s.num}</div>
              <div className="text-xs text-ink-3">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured scholarships */}
      <section className="px-5 py-12 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-bold text-xl text-ink-1">
            {lang === 'th' ? '🔥 ทุนที่เปิดรับตอนนี้' : '🔥 Currently Open'}
          </h2>
          <Link href="/scholarships" className="text-brand text-sm flex items-center gap-1 hover:text-brand-light">
            {lang === 'th' ? 'ดูทั้งหมด' : 'View all'} <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {open.map(s => <ScholarshipCard key={s.id} scholarship={s} />)}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-5 py-6 text-center text-xs text-ink-3">
        S²IMS v1.0 Prototype · {lang === 'th' ? 'คณะรัฐศาสตร์และรัฐประศาสนศาสตร์ มหาวิทยาลัยเชียงใหม่' : 'Faculty of Political Science and Public Administration, Chiang Mai University'}
      </footer>
    </div>
  )
}

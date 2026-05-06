'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, ChevronRight, Shield, BookOpen, Users, Building2, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'
import { ROLE_HOME, ROLE_LABELS } from '@/lib/navigation'
import type { Role } from '@/lib/types'

const ROLE_META: { role: Role; icon: LucideIcon; desc_th: string; desc_en: string }[] = [
  { role: 'student',  icon: BookOpen,   desc_th: 'สมัครทุน ติดตามสถานะ เช็คผล',   desc_en: 'Apply for scholarships, track status, view results' },
  { role: 'staff',    icon: Users,      desc_th: 'จัดการประกาศ ตรวจสอบใบสมัคร OCR', desc_en: 'Manage announcements, review applications, OCR' },
  { role: 'esq',      icon: Shield,     desc_th: 'อนุมัติประกาศก่อนเผยแพร่',         desc_en: 'Approve announcements before publishing' },
  { role: 'provider', icon: Building2,  desc_th: 'สร้างโปรไฟล์ทุน ดูสถิติรวม',     desc_en: 'Create scholarship profiles, view aggregated insights' },
  { role: 'admin',    icon: Settings,   desc_th: 'จัดการระบบ ผู้ใช้ และ Audit Log', desc_en: 'System management, users, and audit log' },
]

export default function LoginPage() {
  const { login } = useAuth()
  const { lang, setLang } = useLang()
  const router = useRouter()
  const [selected, setSelected] = useState<Role | null>(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!selected) return
    setLoading(true)
    await new Promise(r => setTimeout(r, 600)) // mock delay
    login(selected)
    router.push(ROLE_HOME[selected])
  }

  return (
    <div className="min-h-screen bg-bg-000 flex flex-col items-center justify-center p-4">
      {/* Lang toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white/[0.06] border border-white/[0.1] text-ink-2 hover:text-ink-1 transition-all"
        >
          <Globe size={12} />
          {lang === 'th' ? 'EN' : 'ภาษาไทย'}
        </button>
      </div>

      <div className="w-full max-w-lg page-animate">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="font-display font-bold text-3xl text-ink-1 tracking-tight mb-1">S²IMS</div>
          <div className="text-ink-3 text-sm">
            {lang === 'th'
              ? 'ระบบจับคู่ทุนการศึกษาอัจฉริยะ — เลือกบทบาทเพื่อเข้าสู่ระบบ'
              : 'Scholarship Intelligence & Management System — Select your role to continue'
            }
          </div>
        </div>

        {/* Role cards */}
        <div className="space-y-2 mb-6">
          {ROLE_META.map(({ role, icon: Icon, desc_th, desc_en }) => {
            const rl = ROLE_LABELS[role]
            const isSelected = selected === role
            return (
              <button
                key={role}
                onClick={() => setSelected(role)}
                className={`w-full card p-4 flex items-center gap-4 text-left transition-all ${
                  isSelected
                    ? 'border-brand/40 bg-brand/[0.06] shadow-glow'
                    : 'hover:border-white/[0.15] hover:bg-bg-300/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-brand/20' : 'bg-white/[0.06]'
                }`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-ink-1">
                      {lang === 'th' ? rl.th : rl.en}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${rl.color}`}>
                      {role}
                    </span>
                  </div>
                  <div className="text-xs text-ink-3">{lang === 'th' ? desc_th : desc_en}</div>
                </div>
                {isSelected && <ChevronRight size={16} className="text-brand flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={!selected || loading}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
            selected && !loading
              ? 'btn-primary'
              : 'bg-white/[0.06] text-ink-3 cursor-not-allowed'
          }`}
        >
          {loading
            ? (lang === 'th' ? 'กำลังเข้าสู่ระบบ...' : 'Signing in...')
            : selected
            ? `${lang === 'th' ? 'เข้าสู่ระบบในฐานะ' : 'Login as'} ${lang === 'th' ? ROLE_LABELS[selected].th : ROLE_LABELS[selected].en}`
            : (lang === 'th' ? 'เลือกบทบาทก่อน' : 'Select a role first')
          }
        </button>

        <p className="text-center text-xs text-ink-3 mt-4">
          {lang === 'th' ? '⚠️ นี่คือ Prototype — ไม่มี Authentication จริง' : '⚠️ This is a prototype — no real authentication'}
        </p>
      </div>
    </div>
  )
}

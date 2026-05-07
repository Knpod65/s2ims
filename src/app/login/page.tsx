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
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      {/* Lang toggle */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
          className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-md bg-white border border-line text-ink-2 hover:text-ink-1 hover:bg-surface-low transition-all"
        >
          <Globe size={12} />
          {lang === 'th' ? 'EN' : 'ภาษาไทย'}
        </button>
      </div>

      <div className="w-full max-w-lg page-animate">
        {/* Header */}
        <div className="text-center mb-8">
          <div
            className="font-display font-bold text-4xl tracking-tight mb-2 inline-block"
            style={{
              background: 'linear-gradient(135deg, #0055FF, #8B5CF6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            S²IMS
          </div>
          <div className="text-ink-2 text-sm">
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
                className={`w-full rounded-xl p-4 flex items-center gap-4 text-left transition-all border bg-white shadow-card ${
                  isSelected
                    ? 'border-[#0055FF]/40 shadow-[0_18px_45px_rgba(0,85,255,.12)]'
                    : 'border-line hover:border-line-strong hover:bg-surface-low'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border border-line bg-surface-low"
                  style={isSelected
                    ? {
                        background: 'linear-gradient(135deg, #0055FF, #8B5CF6)',
                        color: '#FFFFFF',
                        borderColor: 'transparent',
                      }
                    : undefined}
                >
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-sm text-ink-1">
                      {lang === 'th' ? rl.th : rl.en}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full border border-[#0055FF]/20 bg-[#E5EDFF] text-[#0055FF] font-semibold">
                        {lang === 'th' ? 'เลือกแล้ว' : 'Selected'}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-ink-3">{lang === 'th' ? desc_th : desc_en}</div>
                </div>
                {isSelected && <ChevronRight size={16} className="text-[#0055FF] flex-shrink-0" />}
              </button>
            )
          })}
        </div>

        {/* Login button */}
        <button
          onClick={handleLogin}
          disabled={!selected || loading}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center ${
            selected && !loading
              ? 'text-white shadow-[0_18px_45px_rgba(0,85,255,.18)] hover:brightness-105'
              : 'bg-white border border-line text-ink-3 cursor-not-allowed'
          }`}
          style={selected && !loading
            ? { background: 'linear-gradient(135deg, #0055FF, #8B5CF6)' }
            : undefined}
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

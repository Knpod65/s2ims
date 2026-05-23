'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, ChevronRight, Shield, BookOpen, Users, Building2, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'
import { ROLE_HOME, ROLE_LABELS } from '@/lib/navigation'
import type { Role } from '@/lib/types'
import { Button } from '@/components/shared/Button'
import { PageHeader } from '@/components/shared/PageHeader'
import { RoleBadge } from '@/components/shared/RoleBadge'
import { SafetyBanner } from '@/components/shared/SafetyBanner'
import { SectionHeader } from '@/components/shared/SectionHeader'
import { StatusBadge } from '@/components/shared/StatusBadge'

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
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
          iconStart={<Globe size={12} />}
        >
          {lang === 'th' ? 'EN' : 'ภาษาไทย'}
        </Button>
      </div>

      <div className="w-full max-w-lg page-animate">
        <PageHeader
          eyebrow={lang === 'th' ? 'โปรโตไทป์' : 'Prototype'}
          title="S²IMS"
          description={lang === 'th'
            ? 'ระบบจับคู่ทุนการศึกษาอัจฉริยะ — เลือกบทบาทเพื่อเข้าสู่ระบบ'
            : 'Scholarship Intelligence & Management System — Select your role to continue'
          }
          badge={<StatusBadge status="preview" label={lang === 'th' ? 'Prototype only' : 'Prototype only'} size="sm" />}
          className="mb-5"
        />

        <SafetyBanner
          tone="info"
          title={lang === 'th' ? 'เข้าสู่ระบบแบบจำลอง' : 'Mock sign-in only'}
          description={lang === 'th'
            ? 'หน้านี้ใช้ local mock auth เพื่อเลือกบทบาทเท่านั้น ไม่มี authentication จริงหรือการบันทึกข้อมูล'
            : 'This screen uses local mock auth only to pick a role. No real authentication or persistence occurs.'
          }
          className="mb-5"
        />

        {/* Role cards */}
        <SectionHeader
          title={lang === 'th' ? 'เลือกบทบาท' : 'Choose your role'}
          description={lang === 'th'
            ? 'บทบาทที่เลือกจะกำหนดหน้าเริ่มต้นหลังเข้าสู่ระบบ'
            : 'The selected role determines your starting page after sign-in.'
          }
          className="mb-3"
        />

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
                      <>
                        <RoleBadge role={role} size="sm" />
                        <StatusBadge
                          status="info"
                          label={lang === 'th' ? 'เลือกแล้ว' : 'Selected'}
                          size="sm"
                        />
                      </>
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

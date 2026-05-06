'use client'

import { useLang } from '@/lib/i18n'

interface RoleBadgeProps {
  role: 'student' | 'staff' | 'esq' | 'provider' | 'admin'
  size?: 'sm' | 'md'
  variant?: 'default' | 'outline'
}

export default function RoleBadge({ role, size = 'md', variant = 'default' }: RoleBadgeProps) {
  const { lang } = useLang()

  const labels: Record<string, Record<string, string>> = {
    student: { th: 'นักศึกษา', en: 'Student' },
    staff: { th: 'เจ้าหน้าที่', en: 'Staff' },
    esq: { th: 'หัวหน้า ESQ', en: 'ESQ Head' },
    provider: { th: 'ผู้ให้ทุน', en: 'Provider' },
    admin: { th: 'ผู้ดูแลระบบ', en: 'Admin' },
  }

  const colors: Record<string, { bg: string; text: string }> = {
    student: { bg: 'bg-blue-100', text: 'text-blue-700' },
    staff: { bg: 'bg-green-100', text: 'text-green-700' },
    esq: { bg: 'bg-purple-100', text: 'text-purple-700' },
    provider: { bg: 'bg-orange-100', text: 'text-orange-700' },
    admin: { bg: 'bg-red-100', text: 'text-red-700' },
  }

  const { bg, text } = colors[role]
  const sizeClass = size === 'sm' ? 'px-2 py-1 text-[10px]' : 'px-3 py-1.5 text-xs'

  if (variant === 'outline') {
    return (
      <div className={`rounded border ${text} border-current/30 ${sizeClass}`}>
        {lang === 'th' ? labels[role].th : labels[role].en}
      </div>
    )
  }

  return (
    <div className={`rounded ${bg} ${text} ${sizeClass} font-medium`}>
      {lang === 'th' ? labels[role].th : labels[role].en}
    </div>
  )
}

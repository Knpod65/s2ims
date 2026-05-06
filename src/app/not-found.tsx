'use client'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import { useLang } from '@/lib/i18n'

export default function NotFound() {
  const { role } = useAuth()
  const { lang } = useLang()
  const home = role ? `/${role}/dashboard` : '/login'

  return (
    <div className="min-h-screen bg-bg-000 flex flex-col items-center justify-center p-6 text-center">
      <div className="font-display font-bold text-[120px] leading-none text-white/[0.04] mb-2 select-none">
        404
      </div>
      <h1 className="font-display font-bold text-2xl text-ink-1 mb-2 -mt-6">
        {lang === 'th' ? 'ไม่พบหน้านี้' : 'Page not found'}
      </h1>
      <p className="text-ink-3 text-sm mb-8 max-w-xs">
        {lang === 'th'
          ? 'หน้าที่คุณกำลังหาอาจถูกย้ายหรือลบออกไปแล้ว'
          : 'The page you are looking for may have been moved or deleted.'}
      </p>
      <Link href={home} className="btn-primary px-6 py-2.5 text-sm">
        {lang === 'th' ? '← กลับหน้าหลัก' : '← Back to dashboard'}
      </Link>
      <div className="mt-4 text-[10px] font-mono text-ink-3">S²IMS · Faculty of PolSci &amp; PA · CMU</div>
    </div>
  )
}

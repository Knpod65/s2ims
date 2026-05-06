'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatCard } from '@/components/ui/index'
import Link from 'next/link'
import { FileText, ScanLine, Clock, Users, FilePlus, TrendingUp, Mail, AlertTriangle } from 'lucide-react'
import { mockMatchReviews, mockStaffDisclosureRequests, mockDataQualityIssues } from '@/data/mock/staffData'

export default function StaffDashboard() {
  const { lang } = useLang()

  const pendingMatches = mockMatchReviews.length
  const flaggedMatches = mockMatchReviews.filter((m) => m.fairnessFlag).length
  const pendingDisclosures = mockStaffDisclosureRequests.filter((r) => r.status === 'pending_staff_approval').length
  const criticalQualityIssues = mockDataQualityIssues.filter((i) => i.severity === 'high').length

  return (
    <AppShell requiredRole="staff">
      <PageHeader
        title={lang === 'th' ? 'แดชบอร์ดเจ้าหน้าที่' : 'Staff Dashboard'}
        actions={
          <Link
            href="/staff/announcements/new"
            className="btn-primary text-xs flex items-center gap-1.5 py-1.5"
          >
            <FilePlus size={13} />
            {lang === 'th' ? 'สร้างประกาศ' : 'New Announcement'}
          </Link>
        }
      />

      {/* Phase 6 & Legacy Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        <StatCard
          value={3}
          label={lang === 'th' ? 'ทุนที่เปิดอยู่' : 'Active Scholarships'}
          icon={<FileText size={16} />}
          color="text-status-success"
        />
        <StatCard
          value={pendingMatches}
          label={lang === 'th' ? 'การจับคู่ที่รอ' : 'Pending Matches'}
          icon={<TrendingUp size={16} />}
          color="text-brand"
        />
        <StatCard
          value={pendingDisclosures}
          label={lang === 'th' ? 'คำขอเปิดเผย' : 'Disclosure Requests'}
          icon={<Mail size={16} />}
          color="text-status-warning"
        />
        <StatCard
          value={criticalQualityIssues}
          label={lang === 'th' ? 'ปัญหาข้อมูลร้ายแรง' : 'Critical Data Issues'}
          icon={<AlertTriangle size={16} />}
          color="text-status-danger"
        />
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        {[
          {
            title: lang === 'th' ? 'ตรวจสอบการจับคู่' : 'Review Matches',
            desc: lang === 'th'
              ? 'ตรวจสอบและอนุมัติการจับคู่'
              : 'Review and approve candidate matches',
            href: '/staff/matching-review',
            color: 'text-brand',
            badge: flaggedMatches > 0 ? flaggedMatches : null,
          },
          {
            title: lang === 'th' ? 'คำขอเปิดเผย' : 'Disclosure Requests',
            desc: lang === 'th'
              ? 'อนุมัติหรือปฏิเสธการเปิดเผย'
              : 'Approve or reject disclosure requests',
            href: '/staff/disclosure-requests',
            color: 'text-status-warning',
            badge: pendingDisclosures > 0 ? pendingDisclosures : null,
          },
          {
            title: lang === 'th' ? 'คุณภาพข้อมูล' : 'Data Quality',
            desc: lang === 'th'
              ? 'จัดการปัญหาคุณภาพข้อมูล'
              : 'Track and resolve data issues',
            href: '/staff/data-quality',
            color: 'text-status-danger',
            badge: criticalQualityIssues > 0 ? criticalQualityIssues : null,
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card p-5 hover:border-white/20 transition-all relative"
          >
            {item.badge && (
              <div className="absolute top-3 right-3 bg-status-danger text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                {item.badge}
              </div>
            )}
            <div className={`font-semibold text-sm mb-1 ${item.color}`}>{item.title}</div>
            <div className="text-xs text-ink-3">{item.desc}</div>
          </Link>
        ))}
      </div>

      {/* Legacy Section */}
      <h3 className="font-semibold text-sm text-ink-1 mb-4">
        {lang === 'th' ? 'อื่น ๆ' : 'Other Operations'}
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {[
          {
            title: lang === 'th' ? 'สร้างประกาศ' : 'New Announcement',
            desc: lang === 'th' ? 'สร้างประกาศพร้อมตัวอย่าง TH/EN' : 'Create structured announcement',
            href: '/staff/announcements/new',
            color: 'text-brand',
          },
          {
            title: lang === 'th' ? 'คิว OCR' : 'OCR Queue',
            desc: lang === 'th' ? 'อัปโหลดและดึงข้อมูล' : 'Upload and extract fields',
            href: '/staff/ocr',
            color: 'text-status-ai',
          },
          {
            title: lang === 'th' ? 'จัดการใบสมัคร' : 'Applications',
            desc: lang === 'th' ? 'ตรวจสอบใบสมัครทั้งหมด' : 'Review all applications',
            href: '/staff/applications',
            color: 'text-status-info',
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="card p-5 hover:border-white/20 transition-all"
          >
            <div className={`font-semibold text-sm mb-1 ${item.color}`}>{item.title}</div>
            <div className="text-xs text-ink-3">{item.desc}</div>
          </Link>
        ))}
      </div>
    </AppShell>
  )
}
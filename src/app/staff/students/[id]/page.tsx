'use client'
import { use } from 'react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader, StatCard, EmptyState } from '@/components/ui/index'
import { mockApplications } from '@/data/mock/applications'
import { mockUsers } from '@/data/mock/users'
import { APP_STATUS_MAP } from '@/lib/utils'
import { Lock, User } from 'lucide-react'
import Link from 'next/link'

export default function StaffStudentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { lang } = useLang()

  const student = mockUsers.find(u => u.id === id && u.role === 'student')
  const apps = mockApplications.filter(a => a.student_id === id)

  if (!student) {
    return (
      <AppShell requiredRole="staff">
        <EmptyState
          icon={<User size={32} />}
          title={lang === 'th' ? 'ไม่พบข้อมูลนักศึกษา' : 'Student not found'}
          description={lang === 'th' ? `ไม่พบนักศึกษาที่มี ID: ${id}` : `No student found with ID: ${id}`}
          action={<Link href="/staff/applications" className="btn-secondary text-xs py-2 px-4">{lang === 'th' ? '← กลับรายการ' : '← Back to list'}</Link>}
        />
      </AppShell>
    )
  }

  return (
    <AppShell requiredRole="staff">
      <div className="flex items-center gap-2 mb-4 p-2.5 bg-role-tint border border-role-border rounded-lg">
        <Lock size={12} className="text-role-primary" />
        <span className="text-xs text-role-primary">
          {lang === 'th'
            ? 'การเข้าถึงโปรไฟล์นักศึกษาถูกบันทึกใน Audit Log'
            : 'Student profile access is logged in the audit trail'}
        </span>
      </div>

      <PageHeader
        title={lang === 'th' ? `โปรไฟล์: ${student.name_th}` : `Profile: ${student.name_en}`}
        subtitle={lang === 'th' ? 'มุมมองเจ้าหน้าที่ — ข้อมูลที่ mask แล้ว' : 'Staff view — masked PII'}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard value={apps.length} label={lang === 'th' ? 'ใบสมัครทั้งหมด' : 'Total Applications'} color="text-role-primary" />
        <StatCard value="3.25" label="GPA" color="text-status-success" />
        <StatCard value="68%" label={lang === 'th' ? 'โปรไฟล์สมบูรณ์' : 'Profile Complete'} color="text-status-info" />
        <StatCard
          value={student.academic_year ? `${lang === 'th' ? 'ปี' : 'Yr'} ${student.academic_year}` : '—'}
          label={lang === 'th' ? 'ชั้นปี' : 'Academic Year'}
          color="text-status-track"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-4 space-y-2 text-xs">
          <div className="text-[10px] uppercase tracking-widest text-ink-3 mb-2">{lang === 'th' ? 'ข้อมูลพื้นฐาน' : 'Basic Info'}</div>
          <div className="flex justify-between"><span className="text-ink-3">{lang === 'th' ? 'รหัสนักศึกษา' : 'Student ID'}</span><span className="text-ink-1 font-mono">{student.student_id ?? '—'}</span></div>
          <div className="flex justify-between"><span className="text-ink-3">{lang === 'th' ? 'อีเมล' : 'Email'}</span><span className="text-ink-2 truncate ml-2">{student.email}</span></div>
          <div className="flex justify-between"><span className="text-ink-3">{lang === 'th' ? 'สาขา' : 'Major'}</span><span className="text-ink-1">{student.major ?? '—'}</span></div>
        </div>
        <div className="md:col-span-2 card p-5">
          <h3 className="font-semibold text-sm text-ink-1 mb-4">
            {lang === 'th' ? 'ประวัติการสมัคร' : 'Application History'}
          </h3>
          {apps.length === 0 ? (
            <div className="text-xs text-ink-3 text-center py-4">{lang === 'th' ? 'ยังไม่มีใบสมัคร' : 'No applications yet'}</div>
          ) : (
            <div className="space-y-2">
              {apps.map(app => {
                const si = APP_STATUS_MAP[app.status]
                return (
                  <Link
                    key={app.id}
                    href={`/staff/applications/${app.id}`}
                    className="card-sm p-3 flex items-center justify-between hover:border-line transition-all block"
                  >
                    <div className="text-xs text-ink-1 flex-1 mr-3">
                      {lang === 'th' ? app.scholarship_title_th : app.scholarship_title_en}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-mono text-role-primary">{app.match_score}%</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${si.color}`}>
                        {si[lang === 'th' ? 'th' : 'en']}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

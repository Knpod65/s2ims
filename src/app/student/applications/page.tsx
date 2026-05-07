'use client'
import { useMemo, useState } from 'react'
import Link from 'next/link'
import { CalendarDays, Filter, FileWarning } from 'lucide-react'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { EmptyState, PageHeader, StatCard } from '@/components/ui/index'
import {
  applicationStateLabels,
  studentApplications,
  type StudentApplicationState,
} from '@/data/mock/studentApplicationData'
import { studentDataFreshness } from '@/data/mock/studentMatchingData'
import {
  ApplicationStatusCard,
  DataFreshnessIndicator,
  StudentPrivacyNotice,
} from '@/components/student'

const FILTERS: Array<StudentApplicationState | 'all'> = [
  'all',
  'draft',
  'revision_requested',
  'in_review',
  'approved',
]

function daysUntil(date: string) {
  return Math.ceil((new Date(date).getTime() - Date.now()) / 86400000)
}

export default function StudentApplicationsPage() {
  const { lang } = useLang()
  const [filter, setFilter] = useState<StudentApplicationState | 'all'>('all')

  const filteredApplications = useMemo(() => {
    if (filter === 'all') return studentApplications
    return studentApplications.filter(application => application.state === filter)
  }, [filter])

  const missingDocumentCount = studentApplications.reduce(
    (count, application) => count + application.documents.filter(doc => ['missing', 'invalid_file_type', 'rejected', 'needs_replacement'].includes(doc.state)).length,
    0,
  )
  const nearestDeadline = Math.min(...studentApplications.map(application => Math.max(0, daysUntil(application.deadline))))
  const revisionCount = studentApplications.filter(application => application.state === 'revision_requested').length

  return (
    <AppShell requiredRole="student">
      <PageHeader
        roleIndicator
        title={lang === 'th' ? 'ติดตามใบสมัคร' : 'Application tracker'}
        subtitle={lang === 'th' ? 'ดูสถานะ เอกสาร และขั้นตอนถัดไปของใบสมัครทุนของคุณ' : 'Track your own scholarship applications, documents, and next steps.'}
        actions={<DataFreshnessIndicator freshness={studentDataFreshness} />}
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.7fr)]">
        <main className="space-y-5">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <StatCard
              value={studentApplications.length}
              label={lang === 'th' ? 'ใบสมัครทั้งหมด' : 'Applications'}
              roleAccent
            />
            <StatCard
              value={revisionCount}
              label={lang === 'th' ? 'ขอแก้ไข' : 'Revisions'}
              color="text-status-warning"
              icon={<FileWarning size={16} />}
            />
            <StatCard
              value={missingDocumentCount}
              label={lang === 'th' ? 'เอกสารที่เติมได้' : 'Document next steps'}
              color="text-role-primary"
            />
            <StatCard
              value={nearestDeadline}
              label={lang === 'th' ? 'วันสู่กำหนดใกล้สุด' : 'Days to nearest deadline'}
              color="text-status-info"
              icon={<CalendarDays size={16} />}
            />
          </div>

          <div className="card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-ink-1">
              <Filter size={16} className="text-role-primary" />
              {lang === 'th' ? 'กรองสถานะ' : 'Status filter'}
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FILTERS.map(item => {
                const selected = filter === item
                const label = item === 'all'
                  ? (lang === 'th' ? 'ทั้งหมด' : 'All')
                  : applicationStateLabels[item][lang]
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    className={`min-h-11 shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      selected
                        ? 'border-role-border bg-role-tint text-role-primary'
                        : 'border-line bg-white text-ink-2 hover:border-role-border'
                    }`}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>

          {filteredApplications.length > 0 ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredApplications.map(application => (
                <ApplicationStatusCard key={application.id} application={application} />
              ))}
            </div>
          ) : (
            <div className="card">
              <EmptyState
                title={lang === 'th' ? 'ไม่มีใบสมัครในสถานะนี้' : 'No applications in this state'}
                description={lang === 'th' ? 'ลองเลือกตัวกรองอื่น หรือกลับไปดูทุนที่แนะนำ' : 'Try another filter or return to recommendations.'}
                action={<Link href="/student/recommendations" className="btn-primary min-h-11 px-4 py-2 text-sm">{lang === 'th' ? 'ดูทุนที่แนะนำ' : 'View recommendations'}</Link>}
              />
            </div>
          )}
        </main>

        <aside className="space-y-4">
          <StudentPrivacyNotice />
          <div className="rounded-xl border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[#78350F]">
            <div className="font-semibold">
              {lang === 'th' ? 'การแจ้งเตือนเอกสาร' : 'Document reminder'}
            </div>
            <p className="mt-1 text-sm leading-relaxed">
              {lang === 'th'
                ? 'เพิ่มเอกสารที่ช่วยให้ใบสมัครพร้อมขึ้นเมื่อคุณสะดวก ไม่มีการอัปโหลดไฟล์จริงในต้นแบบนี้'
                : 'Add documents that make each application more ready when convenient. This prototype does not perform real file uploads.'}
            </p>
          </div>
        </aside>
      </div>
    </AppShell>
  )
}

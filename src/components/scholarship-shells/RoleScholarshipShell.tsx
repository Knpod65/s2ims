import { Landmark } from 'lucide-react'
import type { ScholarshipRoleShellConfig } from '@/data/mock/scholarshipRoleShells'
import DataVisibilityNotice from './DataVisibilityNotice'
import ScholarshipKpiGrid from './ScholarshipKpiGrid'
import ScholarshipWorkflowCard from './ScholarshipWorkflowCard'
import SoftNeonPanel from './SoftNeonPanel'

export default function RoleScholarshipShell({ config }: { config: ScholarshipRoleShellConfig }) {
  return (
    <div className="-m-4 min-h-[calc(100vh-52px)] overflow-x-hidden bg-cyber-bg px-4 py-5 text-cyber-slate md:-m-6 md:px-6 md:py-6">
      <div className="mx-auto max-w-7xl">
        <header className="mb-5 rounded-xl border border-cyber-border/50 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyber-cyan/65 bg-cyber-cyan/20 px-3 py-1 text-[11px] font-bold text-sky-950">
                <Landmark size={13} aria-hidden="true" />
                {config.eyebrow}
              </div>
              <h1 className="break-words font-display text-2xl font-bold tracking-normal text-cyber-slate md:text-3xl">
                {config.title}
              </h1>
              <p className="mt-1 max-w-3xl break-words text-sm leading-relaxed text-cyber-slate/75">
                {config.description}
              </p>
            </div>
          </div>
        </header>

        <div className="mb-5">
          <ScholarshipKpiGrid kpis={config.kpis} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <main className="space-y-4">
            <SoftNeonPanel>
              <h2 className="break-words text-lg font-bold">{config.primaryPanelTitle}</h2>
              <p className="mt-2 break-words text-sm leading-relaxed text-cyber-slate/75">{config.primaryPanelBody}</p>
            </SoftNeonPanel>

            <section className="grid grid-cols-1 gap-3 md:grid-cols-3">
              {config.workflow.map((item) => (
                <ScholarshipWorkflowCard key={item.title} item={item} />
              ))}
            </section>
          </main>

          <aside className="space-y-4">
            <DataVisibilityNotice note={config.visibilityNote} />
            <SoftNeonPanel>
              <h2 className="text-sm font-bold">สถานะต้นแบบ</h2>
              <p className="mt-2 break-words text-xs leading-relaxed text-cyber-slate/70">
                หน้านี้ใช้ข้อมูลจำลองและแสดงภาพรวมตามบทบาท ยังไม่มีการเชื่อมต่อฐานข้อมูลหรือการตัดสินผลทุนจริง
              </p>
            </SoftNeonPanel>
          </aside>
        </div>
      </div>
    </div>
  )
}

import { Activity, Database, FileText, Landmark, ShieldCheck, SlidersHorizontal, Users } from 'lucide-react'
import type { ScholarshipRoleShellConfig } from '@/data/mock/scholarshipRoleShells'
import DataVisibilityNotice from './DataVisibilityNotice'
import ScholarshipKpiGrid from './ScholarshipKpiGrid'
import ScholarshipWorkflowCard from './ScholarshipWorkflowCard'
import SoftNeonPanel from './SoftNeonPanel'

const toneBorder = {
  cyan: 'border-cyber-cyan/45 bg-cyber-cyan/20',
  violet: 'border-cyber-violet/45 bg-cyber-violet/20',
  mint: 'border-cyber-mint/45 bg-cyber-mint/25',
  peach: 'border-cyber-peach/45 bg-cyber-peach/25',
  blush: 'border-cyber-blush/50 bg-cyber-blush/30',
}

const barTone = {
  cyan: 'bg-cyber-cyan',
  violet: 'bg-cyber-violet',
  mint: 'bg-cyber-mint',
  peach: 'bg-cyber-peach',
  blush: 'bg-cyber-blush',
}

type Tone = keyof typeof toneBorder

const adminPolicies = [
  { name: 'ทุนขาดแคลน', status: 'ใช้งานอยู่', type: 'Financial need', source: 'กองทุนมหาวิทยาลัย', rule: 'รายได้ครอบครัวต่ำกว่าเกณฑ์ พร้อมเอกสารรับรอง' },
  { name: 'ทุนค่าเล่าเรียน', status: 'ใช้งานอยู่', type: 'Tuition support', source: 'ทุนบริจาค', rule: 'มีภาระค่าเล่าเรียนและไม่ซ้ำซ้อนทุนประเภทเดียวกัน' },
  { name: 'ทุนช่วยงาน', status: 'กำกับตามรอบ', type: 'Work scholarship', source: 'คณะ/หน่วยงาน', rule: 'นับชั่วโมงเฉพาะรายการที่ผู้ดูแลรับรองแล้ว' },
  { name: 'ทุนต่อเนื่อง', status: 'ฉบับร่าง', type: 'Continuous support', source: 'ภายนอก', rule: 'ติดตาม GPA และประวัติรับทุนต่อเนื่องก่อนเสนออนุมัติ' },
]

const normalizations = [
  { examples: ['ทุนขาดแคลน', 'ขาดแคลนทุนทรัพย์', 'ทุนช่วยเหลือฉุกเฉิน'], normalized: 'Financial need' },
  { examples: ['ทุนทำงาน', 'ทุน TA', 'ทุนช่วยงาน'], normalized: 'Work scholarship' },
  { examples: ['ค่าเทอม', 'ค่าเล่าเรียน', 'ทุนหน่วยกิต'], normalized: 'Tuition support' },
]

const visibilityRows = [
  { role: 'Student', profile: 'เห็นของตนเอง', finance: 'เห็นของตนเอง', aggregate: 'ไม่แสดง', notes: 'เจ้าของข้อมูล' },
  { role: 'Staff', profile: 'เห็นเมื่อจำเป็น', finance: 'จำกัดตามงาน', aggregate: 'เห็น', notes: 'ตรวจสอบเอกสาร/เงื่อนไข' },
  { role: 'Admin', profile: 'ตั้งค่าสิทธิ์', finance: 'ตั้งค่าสิทธิ์', aggregate: 'เห็น', notes: 'กำกับระบบ ไม่ใช่อนุมัติรายบุคคล' },
  { role: 'Executive/ESQ', profile: 'ซ่อน', finance: 'ซ่อน', aggregate: 'เห็น', notes: 'ข้อมูลภาพรวมเท่านั้น' },
  { role: 'Provider', profile: 'ซ่อน', finance: 'ซ่อน', aggregate: 'เห็นแบบไม่ระบุตัวตน', notes: 'ไม่มีรายชื่อนักศึกษา' },
]

const permissionCards = [
  { role: 'Student', scope: 'ดูทุนที่เกี่ยวข้องและสถานะของตนเอง', tone: 'cyan' as Tone },
  { role: 'Staff', scope: 'ตรวจข้อมูลทุน เอกสาร และรายการที่ต้องทบทวน', tone: 'violet' as Tone },
  { role: 'Supervisor', scope: 'รับรองชั่วโมงช่วยงานเฉพาะนักศึกษาที่ดูแล', tone: 'mint' as Tone },
  { role: 'Admin', scope: 'กำกับสิทธิ์ มาตรฐานข้อมูล และประวัติการนำเข้า', tone: 'peach' as Tone },
  { role: 'Executive/ESQ', scope: 'เห็นภาพรวมเชิงนโยบายโดยไม่เห็นรายบุคคล', tone: 'blush' as Tone },
  { role: 'Provider', scope: 'เห็นผลลัพธ์รวมและโอกาสสนับสนุนแบบนิรนาม', tone: 'cyan' as Tone },
]

const auditLog = [
  { title: 'นำเข้า 2_2567', detail: 'นำเข้ารายการทุนพร้อมคำเตือนข้อมูล 6 รายการ', meta: 'Import event' },
  { title: 'ตรวจสอบกฎทุน', detail: 'พบประเภททุนสะกดไม่สม่ำเสมอและมูลค่าที่ไม่ใช่ตัวเลข', meta: 'Validation event' },
  { title: 'ปรับตัวอย่างนโยบาย', detail: 'อัปเดตตัวอย่างเกณฑ์ทุนต่อเนื่องในโหมด preview', meta: 'Policy update preview' },
  { title: 'ทบทวนสิทธิ์ผู้ให้ทุน', detail: 'ยืนยันว่าผู้ให้ทุนเห็นเฉพาะข้อมูลภาพรวม', meta: 'Role access event' },
]

const importHistory = [
  { file: '2_2567', rows: '257', status: 'สำเร็จบางส่วน', warnings: '6 warnings' },
  { file: '1_2567', rows: '198', status: 'สำเร็จ', warnings: '3 warnings' },
  { file: '2566', rows: '31', status: 'สำเร็จ', warnings: '2 warnings' },
  { file: '2565', rows: '27', status: 'สำเร็จ', warnings: '1 warning' },
]

const fieldMapping = [
  { field: 'Scholarship name', source: 'ชื่อทุน', governance: 'ใช้เป็นชื่อหลักหลัง normalize' },
  { field: 'Student ID', source: 'รหัสนักศึกษา', governance: 'ข้อมูลส่วนบุคคล ถูกซ่อนตามสิทธิ์' },
  { field: 'Funding source', source: 'แหล่งทุน', governance: 'ใช้จัดกลุ่มแหล่งเงินทุน' },
  { field: 'Scholarship value', source: 'มูลค่าทุน', governance: 'ต้องเป็นตัวเลขก่อนเข้ารายงาน' },
  { field: 'Scholarship type', source: 'ประเภททุน', governance: 'แมปกับ taxonomy กลาง' },
  { field: 'Term/year', source: 'ภาค/ปี', governance: 'ใช้แยกรอบนำเข้าและแนวโน้ม' },
]

const categoryDistribution = [
  { label: 'Financial need', value: 36, count: 186, tone: 'cyan' as Tone },
  { label: 'Work scholarship', value: 19, count: 98, tone: 'mint' as Tone },
  { label: 'Activity/innovation', value: 11, count: 56, tone: 'blush' as Tone },
  { label: 'Tuition support', value: 28, count: 142, tone: 'violet' as Tone },
  { label: 'Continuous scholarship', value: 6, count: 31, tone: 'peach' as Tone },
]

const fundingSources = [
  { label: 'University fund', value: 52, tone: 'cyan' as Tone },
  { label: 'Donated fund', value: 27, tone: 'violet' as Tone },
  { label: 'External fund', value: 15, tone: 'blush' as Tone },
  { label: 'Other', value: 6, tone: 'peach' as Tone },
]

function ProgressRow({ label, value, helper, tone }: { label: string; value: number; helper?: string; tone: Tone }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between gap-3 text-xs">
        <span className="break-words font-semibold text-cyber-slate">{label}</span>
        <span className="flex-shrink-0 font-bold text-cyber-slate/70">{value}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/70">
        <div className={`h-full rounded-full ${barTone[tone]}`} style={{ width: `${value}%` }} />
      </div>
      {helper && <div className="mt-1 break-words text-[11px] leading-snug text-cyber-slate/65">{helper}</div>}
    </div>
  )
}

function MiniStatusCard({ title, value, helper, tone }: { title: string; value: string; helper: string; tone: Tone }) {
  return (
    <div className={`rounded-xl border p-4 ${toneBorder[tone]}`}>
      <div className="text-xl font-bold text-cyber-slate">{value}</div>
      <div className="mt-1 break-words text-xs font-bold text-cyber-slate">{title}</div>
      <div className="mt-1 break-words text-[11px] leading-snug text-cyber-slate/65">{helper}</div>
    </div>
  )
}

function AdminGovernanceDashboard({ config }: { config: ScholarshipRoleShellConfig }) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
      <main className="space-y-5">
        <SoftNeonPanel>
          <div className="mb-4 flex items-center gap-2">
            <FileText size={17} className="text-cyan-800" aria-hidden="true" />
            <h2 className="text-lg font-bold">ทะเบียนนโยบายทุน</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {adminPolicies.map((policy) => (
              <article key={policy.name} className="rounded-xl border border-cyber-border/40 bg-white/65 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="break-words text-sm font-bold">{policy.name}</h3>
                    <p className="mt-1 break-words text-xs text-cyber-slate/65">{policy.source}</p>
                  </div>
                  <span className="rounded-full border border-cyber-mint/55 bg-cyber-mint/30 px-2.5 py-1 text-[10px] font-bold">
                    {policy.status}
                  </span>
                </div>
                <div className="mt-3 rounded-lg border border-cyber-cyan/35 bg-cyber-cyan/15 px-3 py-2 text-[11px] font-bold">
                  {policy.type}
                </div>
                <p className="mt-3 break-words text-xs leading-relaxed text-cyber-slate/75">{policy.rule}</p>
              </article>
            ))}
          </div>
        </SoftNeonPanel>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SoftNeonPanel>
            <div className="mb-3 flex items-center gap-2">
              <SlidersHorizontal size={17} className="text-violet-800" aria-hidden="true" />
              <h2 className="text-base font-bold">จัดการประเภททุน</h2>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-cyber-slate/70">
              ตัวอย่าง governance preview สำหรับรวมคำสะกดและประเภททุนที่ไม่สม่ำเสมอ ยังไม่ใช่การแก้ข้อมูลจริง
            </p>
            <div className="space-y-3">
              {normalizations.map((item) => (
                <div key={item.normalized} className="rounded-xl border border-cyber-border/35 bg-white/60 p-3">
                  <div className="flex flex-wrap gap-1.5">
                    {item.examples.map((example) => (
                      <span key={example} className="rounded-full border border-cyber-peach/45 bg-cyber-peach/25 px-2 py-1 text-[10px] font-semibold">
                        {example}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-xs font-bold text-cyber-slate">→ {item.normalized}</div>
                </div>
              ))}
            </div>
          </SoftNeonPanel>

          <SoftNeonPanel>
            <div className="mb-3 flex items-center gap-2">
              <Database size={17} className="text-cyan-800" aria-hidden="true" />
              <h2 className="text-base font-bold">พจนานุกรมข้อมูล / การแมปฟิลด์ข้อมูล</h2>
            </div>
            <div className="space-y-2">
              {fieldMapping.map((item) => (
                <div key={item.field} className="grid grid-cols-[1fr_1fr] gap-2 rounded-lg border border-cyber-border/35 bg-white/60 p-3 text-xs">
                  <div>
                    <div className="font-bold text-cyber-slate">{item.field}</div>
                    <div className="text-cyber-slate/60">{item.source}</div>
                  </div>
                  <div className="break-words text-cyber-slate/75">{item.governance}</div>
                </div>
              ))}
            </div>
          </SoftNeonPanel>
        </div>

        <SoftNeonPanel>
          <div className="mb-3 flex items-center gap-2">
            <ShieldCheck size={17} className="text-violet-800" aria-hidden="true" />
            <h2 className="text-base font-bold">ตั้งค่าการเปิดเผยข้อมูลส่วนบุคคล</h2>
          </div>
          <p className="mb-3 text-xs leading-relaxed text-cyber-slate/70">
            สิทธิ์การมองเห็นข้อมูลเป็นตัวอย่างแบบอ่านอย่างเดียว ข้อมูลส่วนบุคคลถูกซ่อนตามสิทธิ์
          </p>
          <div className="overflow-x-auto">
            <div className="min-w-[720px] space-y-2">
              <div className="grid grid-cols-[1.1fr_repeat(4,1fr)] gap-2 px-3 text-[11px] font-bold text-cyber-slate/60">
                <span>Role</span><span>Profile</span><span>Financial</span><span>Aggregate</span><span>Note</span>
              </div>
              {visibilityRows.map((row) => (
                <div key={row.role} className="grid grid-cols-[1.1fr_repeat(4,1fr)] gap-2 rounded-lg border border-cyber-border/35 bg-white/60 p-3 text-xs">
                  <span className="font-bold">{row.role}</span>
                  <span>{row.profile}</span>
                  <span>{row.finance}</span>
                  <span>{row.aggregate}</span>
                  <span className="break-words text-cyber-slate/70">{row.notes}</span>
                </div>
              ))}
            </div>
          </div>
        </SoftNeonPanel>
      </main>

      <aside className="space-y-5">
        <DataVisibilityNotice note={config.visibilityNote} />
        <SoftNeonPanel>
          <div className="mb-3 flex items-center gap-2">
            <Users size={17} className="text-cyan-800" aria-hidden="true" />
            <h2 className="text-base font-bold">Role permission cards</h2>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-1">
            {permissionCards.map((item) => (
              <div key={item.role} className={`rounded-xl border p-3 ${toneBorder[item.tone]}`}>
                <div className="text-sm font-bold">{item.role}</div>
                <div className="mt-1 break-words text-xs leading-relaxed text-cyber-slate/70">{item.scope}</div>
              </div>
            ))}
          </div>
        </SoftNeonPanel>

        <SoftNeonPanel>
          <div className="mb-3 flex items-center gap-2">
            <Activity size={17} className="text-cyan-800" aria-hidden="true" />
            <h2 className="text-base font-bold">System health</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <MiniStatusCard title="Data readiness" value="91%" helper="พร้อมใช้ในรายงานภาพรวม" tone="mint" />
            <MiniStatusCard title="Warning count" value="12" helper="รอตรวจ spelling/amount" tone="peach" />
            <MiniStatusCard title="Last validation" value="วันนี้" helper="mock validation preview" tone="cyan" />
            <MiniStatusCard title="Policy mode" value="Preview" helper="ยังไม่มีการแก้จริง" tone="violet" />
          </div>
        </SoftNeonPanel>

        <SoftNeonPanel>
          <h2 className="mb-3 text-base font-bold">บันทึกการตรวจสอบ</h2>
          <div className="space-y-2">
            {auditLog.map((event) => (
              <div key={event.title} className="rounded-lg border border-cyber-border/35 bg-white/60 p-3">
                <div className="text-xs font-bold">{event.title}</div>
                <div className="mt-1 text-[11px] leading-snug text-cyber-slate/70">{event.detail}</div>
                <div className="mt-1 text-[10px] font-bold uppercase tracking-wide text-cyber-slate/45">{event.meta}</div>
              </div>
            ))}
          </div>
        </SoftNeonPanel>

        <SoftNeonPanel>
          <h2 className="mb-3 text-base font-bold">ประวัติการนำเข้าข้อมูล</h2>
          <div className="space-y-2">
            {importHistory.map((item) => (
              <div key={item.file} className="flex items-center justify-between gap-3 rounded-lg border border-cyber-border/35 bg-white/60 p-3 text-xs">
                <div>
                  <div className="font-bold">{item.file}</div>
                  <div className="text-cyber-slate/60">{item.rows} rows · {item.warnings}</div>
                </div>
                <span className="rounded-full border border-cyber-cyan/45 bg-cyber-cyan/20 px-2 py-1 text-[10px] font-bold">{item.status}</span>
              </div>
            ))}
          </div>
        </SoftNeonPanel>
      </aside>
    </div>
  )
}

function ExecutiveDashboard({ config }: { config: ScholarshipRoleShellConfig }) {
  return (
    <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
      <main className="space-y-5">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SoftNeonPanel>
            <h2 className="mb-4 text-base font-bold">การกระจายทุนตามประเภท</h2>
            <div className="space-y-4">
              {categoryDistribution.map((item) => (
                <ProgressRow key={item.label} label={`${item.label} · ${item.count} records`} value={item.value} tone={item.tone} />
              ))}
            </div>
          </SoftNeonPanel>

          <SoftNeonPanel>
            <h2 className="mb-4 text-base font-bold">Funding source breakdown</h2>
            <div className="space-y-4">
              {fundingSources.map((item) => (
                <ProgressRow key={item.label} label={item.label} value={item.value} tone={item.tone} />
              ))}
            </div>
          </SoftNeonPanel>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <SoftNeonPanel>
            <h2 className="text-base font-bold">Repeat / continuous support</h2>
            <div className="mt-4 space-y-4">
              <ProgressRow label="Repeat support indicator" value={34} tone="violet" helper="กลุ่มที่ได้รับการดูแลมากกว่าหนึ่งรอบทุน" />
              <ProgressRow label="Continuous scholarship indicator" value={22} tone="mint" helper="ทุนที่ออกแบบเพื่อการดูแลต่อเนื่อง" />
            </div>
          </SoftNeonPanel>

          <SoftNeonPanel>
            <h2 className="text-base font-bold">การเข้าถึงทุนอย่างเป็นธรรม</h2>
            <p className="mt-2 text-xs leading-relaxed text-cyber-slate/70">
              ข้อมูลภาพรวมเท่านั้น ไม่แสดงรายบุคคล ไม่มีชื่อ รหัสนักศึกษา หรือหลักฐานการทำงาน
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <MiniStatusCard title="Coverage review" value="4" helper="มิติที่ควรติดตาม" tone="cyan" />
              <MiniStatusCard title="Aggregate only" value="100%" helper="ไม่มีข้อมูลรายคน" tone="mint" />
            </div>
          </SoftNeonPanel>

          <SoftNeonPanel>
            <h2 className="text-base font-bold">สถานะคุณภาพข้อมูล</h2>
            <div className="mt-4 space-y-2">
              <div className="rounded-lg border border-cyber-peach/45 bg-cyber-peach/25 p-3 text-xs font-semibold">Non-numeric scholarship amount warning · 8 records</div>
              <div className="rounded-lg border border-cyber-violet/45 bg-cyber-violet/20 p-3 text-xs font-semibold">Inconsistent type spelling warning · 12 records</div>
              <div className="rounded-lg border border-cyber-mint/45 bg-cyber-mint/25 p-3 text-xs font-semibold">Validation readiness · 91%</div>
            </div>
          </SoftNeonPanel>
        </div>

        <SoftNeonPanel>
          <h2 className="mb-3 text-base font-bold">ข้อสังเกตเชิงนโยบาย</h2>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {[
              'ทุนบางประเภทมีผลเชิงลึกต่อการดูแลต่อเนื่อง',
              'ควรติดตามความครอบคลุมรายสาขา/ชั้นปี',
              'ข้อมูลนี้เป็นภาพรวมเพื่อการตัดสินใจเชิงนโยบาย',
            ].map((insight, index) => (
              <div key={insight} className={`rounded-xl border p-4 text-sm font-semibold leading-relaxed ${toneBorder[index === 0 ? 'violet' : index === 1 ? 'cyan' : 'peach']}`}>
                {insight}
              </div>
            ))}
          </div>
        </SoftNeonPanel>
      </main>

      <aside className="space-y-5">
        <DataVisibilityNotice note={config.visibilityNote} />
        <SoftNeonPanel>
          <h2 className="text-base font-bold">ภาพรวมทุนการศึกษา</h2>
          <p className="mt-2 text-xs leading-relaxed text-cyber-slate/70">
            จำนวนนักศึกษาที่ได้รับการสนับสนุน 229 คน จาก 513 scholarship records และ 45 scholarship names รวมมูลค่าทุนรวมประมาณ 5.45M THB
          </p>
        </SoftNeonPanel>
        <SoftNeonPanel>
          <h2 className="text-base font-bold">Aggregate privacy guardrail</h2>
          <p className="mt-2 text-xs leading-relaxed text-cyber-slate/70">
            ข้อมูลภาพรวมเท่านั้น ไม่แสดงรายบุคคล ไม่แสดงรหัสนักศึกษา และไม่แสดง work-log evidence
          </p>
        </SoftNeonPanel>
      </aside>
    </div>
  )
}

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

        {config.role === 'admin' && <AdminGovernanceDashboard config={config} />}
        {config.role === 'esq' && <ExecutiveDashboard config={config} />}

        {config.role === 'staff' && <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
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
        </div>}
      </div>
    </div>
  )
}

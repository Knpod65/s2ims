import { ArrowRight, Edit, Plus, ShieldCheck, Target, Users } from 'lucide-react'
import Link from 'next/link'
import AppShell from '@/components/layout/AppShell'
import { mockProviderImpactData, mockProviderScholarships } from '@/data/mock/providerData'

const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

const outcomeStats = [
  { label: 'Need-based support', value: '18', tone: 'border-cyber-cyan/45 bg-cyber-cyan/20' },
  { label: 'Merit / excellence', value: '7', tone: 'border-cyber-violet/45 bg-cyber-violet/20' },
  { label: 'International pathway', value: '3', tone: 'border-cyber-blush/50 bg-cyber-blush/30' },
  { label: 'Continuity support', value: '42%', tone: 'border-cyber-mint/45 bg-cyber-mint/25' },
]

const candidatePool = [
  { label: 'Match-ready', value: 47, helper: 'ผ่านเกณฑ์หลักและพร้อมให้คณะตรวจต่อ', tone: 'bg-cyber-mint' },
  { label: 'Need review', value: 31, helper: 'ควรตรวจเอกสารหรือเงื่อนไขเพิ่มเติม', tone: 'bg-cyber-peach' },
  { label: 'Missing document', value: 18, helper: 'ยังขาดเอกสารหรือข้อมูลที่จำเป็น', tone: 'bg-cyber-violet' },
]

const fundUsageRows = [
  { label: 'ทุนช่วยเหลือด้านค่าใช้จ่าย', amount: '480,000 THB' },
  { label: 'ทุนค่าเล่าเรียน', amount: '260,000 THB' },
  { label: 'ทุนกิจกรรม/นวัตกรรม', amount: '120,000 THB' },
]

function MetricCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <div className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="text-2xl font-bold">{value}</div>
      <div className="mt-1 break-words text-xs font-bold">{label}</div>
      <div className="mt-1 break-words text-[11px] leading-snug text-cyber-slate/65">{helper}</div>
    </div>
  )
}

function SoftPanel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur ${className}`}>
      {children}
    </section>
  )
}

export default function ProviderScholarshipsPage() {
  const scholarships = mockProviderScholarships
  const impact = mockProviderImpactData
  const activeFunds = scholarships.filter((item) => item.status === 'OPEN').length
  const totalCommitted = scholarships.reduce((total, item) => total + item.amount * item.num_awards, 0)
  const budgetUsedPct = 78
  const budgetRemaining = Math.max(0, totalCommitted - impact.totalAwardAmount)
  const totalCandidates = scholarships.reduce((total, item) => total + (item.candidatePoolStats?.totalCandidates ?? 0), 0)

  return (
    <AppShell requiredRole="provider" title="ผลลัพธ์ของทุน" enableDemoAccess demoAccessLabel="ผู้ให้ทุน">
      <div className="-m-4 min-h-[calc(100vh-52px)] overflow-x-hidden bg-cyber-bg px-4 py-5 text-cyber-slate md:-m-6 md:px-6 md:py-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-5 rounded-xl border border-cyber-border/50 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyber-cyan/65 bg-cyber-cyan/20 px-3 py-1 text-[11px] font-bold text-sky-950">
                  <ShieldCheck size={13} aria-hidden="true" />
                  Provider / Donor Impact
                </div>
                <h1 className="break-words font-display text-2xl font-bold tracking-normal text-cyber-slate md:text-3xl">
                  ผลลัพธ์ของทุน
                </h1>
                <p className="mt-1 max-w-3xl break-words text-sm leading-relaxed text-cyber-slate/75">
                  ข้อมูลภาพรวมสำหรับผู้ให้ทุน แสดงการใช้เงินทุน ผลลัพธ์รวม และโอกาสการสนับสนุนเพิ่มเติมโดยไม่เปิดเผยข้อมูลรายบุคคล
                </p>
              </div>
              <Link
                href="/provider/scholarships/new"
                className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyber-slate px-4 py-2.5 text-sm font-bold text-white shadow-sm ${focusClass}`}
              >
                <Plus size={15} aria-hidden="true" />
                สร้างทุนใหม่
              </Link>
            </div>
          </header>

          <section className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="จำนวนนักศึกษาที่ได้รับการสนับสนุน" value={`${impact.awardedCount}`} helper="จำนวนรวมแบบ aggregate เท่านั้น" />
            <MetricCard label="Active funds" value={`${activeFunds}`} helper="ทุนที่เปิดใช้งานในพอร์ตผู้ให้ทุน" />
            <MetricCard label="Total fund usage" value={`${impact.totalAwardAmount.toLocaleString('th-TH')} THB`} helper="ยอดใช้ทุนรวมจากข้อมูลจำลอง" />
            <MetricCard label="Outcome snapshot" value={`${Math.round(impact.studentRetentionRate * 100)}%`} helper="ตัวชี้วัดผลลัพธ์ระดับภาพรวม" />
          </section>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_380px]">
            <main className="space-y-5">
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
                <SoftPanel>
                  <h2 className="text-base font-bold">การใช้เงินทุน</h2>
                  <div className="mt-4 rounded-xl border border-cyber-cyan/40 bg-white/65 p-4">
                    <div className="mb-2 flex items-end justify-between gap-3">
                      <div>
                        <div className="text-2xl font-bold">{budgetUsedPct}%</div>
                        <div className="text-xs font-semibold text-cyber-slate/70">Budget used</div>
                      </div>
                      <div className="text-right text-xs font-semibold text-cyber-slate/70">
                        Remaining {budgetRemaining.toLocaleString('th-TH')} THB
                      </div>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-white">
                      <div className="h-full rounded-full bg-gradient-to-r from-cyber-cyan via-cyber-mint to-cyber-violet" style={{ width: `${budgetUsedPct}%` }} />
                    </div>
                    <p className="mt-3 text-xs leading-relaxed text-cyber-slate/70">
                      Scholarship cycle status: อยู่ระหว่างติดตามผลลัพธ์และรอบสนับสนุนถัดไป
                    </p>
                  </div>
                  <div className="mt-3 space-y-2">
                    {fundUsageRows.map((item) => (
                      <div key={item.label} className="flex items-center justify-between gap-3 rounded-lg border border-cyber-border/35 bg-white/60 p-3 text-xs">
                        <span className="break-words font-semibold">{item.label}</span>
                        <span className="flex-shrink-0 font-bold">{item.amount}</span>
                      </div>
                    ))}
                  </div>
                </SoftPanel>

                <SoftPanel>
                  <h2 className="text-base font-bold">Aggregate outcomes</h2>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {outcomeStats.map((item) => (
                      <div key={item.label} className={`rounded-xl border p-4 ${item.tone}`}>
                        <div className="text-xl font-bold">{item.value}</div>
                        <div className="mt-1 break-words text-xs font-bold">{item.label}</div>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 rounded-xl border border-cyber-mint/45 bg-cyber-mint/25 p-3 text-xs leading-relaxed text-cyber-slate/75">
                    Broad student outcome placeholders are intentionally aggregate and do not identify individual recipients.
                  </p>
                </SoftPanel>
              </div>

              <SoftPanel>
                <div className="mb-3 flex items-center gap-2">
                  <Users size={17} className="text-cyan-800" aria-hidden="true" />
                  <h2 className="text-base font-bold">โอกาสการสนับสนุนเพิ่มเติม</h2>
                </div>
                <p className="mb-4 text-xs leading-relaxed text-cyber-slate/70">
                  Candidate pool / support opportunity แสดงเฉพาะจำนวนรวม ไม่มีรายชื่อ ไม่มีรหัสนักศึกษา และไม่มีเอกสารหลักฐานรายคน
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                  {candidatePool.map((item) => (
                    <div key={item.label} className="rounded-xl border border-cyber-border/35 bg-white/65 p-4">
                      <div className="mb-2 flex items-center justify-between gap-3">
                        <span className="text-xs font-bold">{item.label}</span>
                        <span className="text-lg font-bold">{item.value}</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-white">
                        <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
                      </div>
                      <div className="mt-2 text-[11px] leading-snug text-cyber-slate/65">{item.helper}</div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 text-xs font-semibold text-cyber-slate/70">Aggregate candidate pool: {totalCandidates} records</div>
              </SoftPanel>

              <SoftPanel>
                <h2 className="text-base font-bold">เรื่องราวผลลัพธ์แบบไม่เปิดเผยตัวตน</h2>
                <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <article className="rounded-xl border border-cyber-blush/45 bg-cyber-blush/25 p-4">
                    <div className="mb-2 inline-flex rounded-full border border-cyber-blush/55 bg-white/50 px-2.5 py-1 text-[10px] font-bold">
                      ทุนช่วยเหลือด้านค่าใช้จ่าย
                    </div>
                    <p className="break-words text-sm leading-relaxed">
                      การสนับสนุนช่วยลดภาระค่าครองชีพระหว่างภาคเรียน ทำให้นักศึกษากลุ่มหนึ่งสามารถรักษาความต่อเนื่องในการเรียนได้ดีขึ้น
                    </p>
                  </article>
                  <article className="rounded-xl border border-cyber-violet/45 bg-cyber-violet/20 p-4">
                    <div className="mb-2 inline-flex rounded-full border border-cyber-violet/55 bg-white/50 px-2.5 py-1 text-[10px] font-bold">
                      ทุนค่าเล่าเรียน
                    </div>
                    <p className="break-words text-sm leading-relaxed">
                      ภาพรวมการใช้ทุนชี้ว่าการสนับสนุนค่าเล่าเรียนช่วยลดความเสี่ยงด้านการลงทะเบียนและเพิ่มเสถียรภาพของการเรียนต่อเนื่อง
                    </p>
                  </article>
                </div>
              </SoftPanel>

              <SoftPanel>
                <h2 className="mb-3 text-base font-bold">Provider portfolio actions</h2>
                <div className="space-y-3">
                  {scholarships.map((scholarship) => (
                    <article key={scholarship.id} className="rounded-xl border border-cyber-border/40 bg-white/65 p-4">
                      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <h3 className="break-words text-sm font-bold">{scholarship.title_en}</h3>
                          <p className="mt-1 break-words text-xs text-cyber-slate/65">
                            {scholarship.status} · {scholarship.num_awards} awards · {scholarship.amount.toLocaleString('th-TH')} THB each
                          </p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:min-w-[360px]">
                          <Link href={`/provider/scholarships/${scholarship.id}/edit`} className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-cyber-border/55 bg-white/70 px-3 py-2 text-xs font-bold ${focusClass}`}>
                            <Edit size={13} aria-hidden="true" /> Edit
                          </Link>
                          <Link href={`/provider/scholarships/${scholarship.id}/criteria`} className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-cyber-border/55 bg-white/70 px-3 py-2 text-xs font-bold ${focusClass}`}>
                            <Target size={13} aria-hidden="true" /> Criteria
                          </Link>
                          {scholarship.status === 'OPEN' && (
                            <Link href={`/provider/scholarships/${scholarship.id}/candidates`} className={`inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-cyber-cyan/55 bg-cyber-cyan/20 px-3 py-2 text-xs font-bold ${focusClass}`}>
                              <Users size={13} aria-hidden="true" /> Candidates
                            </Link>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </SoftPanel>
            </main>

            <aside className="space-y-5">
              <SoftPanel>
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck size={17} className="text-violet-800" aria-hidden="true" />
                  <h2 className="text-base font-bold">Privacy notice</h2>
                </div>
                <div className="space-y-2 text-xs leading-relaxed text-cyber-slate/75">
                  <p className="rounded-lg border border-cyber-violet/35 bg-cyber-violet/20 p-3">มุมมองนี้ไม่แสดงข้อมูลรายบุคคล</p>
                  <p className="rounded-lg border border-cyber-cyan/35 bg-cyber-cyan/20 p-3">ข้อมูลแสดงในระดับภาพรวมเท่านั้น</p>
                  <p className="rounded-lg border border-cyber-peach/40 bg-cyber-peach/25 p-3">การพิจารณาและอนุมัติยังอยู่ภายใต้กระบวนการของคณะ</p>
                </div>
              </SoftPanel>

              <SoftPanel>
                <h2 className="text-base font-bold">Impact summary</h2>
                <p className="mt-2 text-xs leading-relaxed text-cyber-slate/70">
                  ผู้ให้ทุนเห็นผลลัพธ์ระดับพอร์ตและแนวโน้มการสนับสนุน ไม่เห็นรายชื่อนักศึกษา รหัสนักศึกษา หรือ work-log evidence
                </p>
                <Link href="/provider/impact" className={`mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-cyber-cyan/55 bg-cyber-cyan/20 px-3 py-2 text-xs font-bold ${focusClass}`}>
                  ดูหน้าผลลัพธ์เพิ่มเติม <ArrowRight size={13} aria-hidden="true" />
                </Link>
              </SoftPanel>
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

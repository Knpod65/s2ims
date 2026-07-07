'use client'

import { useMemo, useState } from 'react'
import AppShell from '@/components/layout/AppShell'
import ScholarshipMatchCard from '@/components/scholarships/ScholarshipMatchCard'
import ScholarshipDetailPanel from '@/components/scholarships/ScholarshipDetailPanel'
import { MATCH_STATUS_COPY } from '@/components/scholarships/MatchStatusBadge'
import { mockScholarships } from '@/data/mock/scholarships'
import { getMockMatchingProfileForScholarship } from '@/data/mock/studentMatching'
import { calculateScholarshipMatch } from '@/lib/matching'
import type { MatchStatus } from '@/lib/types'

const STATUS_ORDER: MatchStatus[] = ['MATCHED', 'NEAR_MATCH', 'PENDING_REVIEW', 'NOT_ELIGIBLE']

export default function StudentScholarshipsPage() {
  const matches = useMemo(() => {
    return mockScholarships
      .map((scholarship) => ({
        scholarship,
        matchResult: calculateScholarshipMatch(
          scholarship,
          getMockMatchingProfileForScholarship(scholarship.id),
        ),
      }))
      .sort((a, b) => b.matchResult.matchScore - a.matchResult.matchScore)
  }, [])

  const [saved, setSaved] = useState<Set<string>>(
    () => new Set(mockScholarships.filter((scholarship) => scholarship.is_saved).map((scholarship) => scholarship.id)),
  )
  const [hidden, setHidden] = useState<Set<string>>(() => new Set())
  const [selectedId, setSelectedId] = useState<string | null>(matches[0]?.scholarship.id ?? null)

  const visibleMatches = matches.filter((item) => !hidden.has(item.scholarship.id))
  const selectedItem =
    visibleMatches.find((item) => item.scholarship.id === selectedId) ??
    visibleMatches[0] ??
    null

  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: matches.filter((item) => item.matchResult.matchStatus === status).length,
  }))

  const toggleSaved = (id: string) => {
    setSaved((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const dismiss = (id: string) => {
    setHidden((current) => {
      const next = new Set(current)
      next.add(id)
      return next
    })
  }

  return (
    <AppShell requiredRole="student" title="ทุนที่เหมาะกับฉัน">
      <div className="-m-4 min-h-[calc(100vh-52px)] bg-cyber-bg px-4 py-5 text-cyber-slate md:-m-6 md:px-6 md:py-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-5 rounded-xl border border-cyber-border/70 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="mb-2 inline-flex rounded-full border border-cyber-cyan bg-cyber-cyan/25 px-3 py-1 text-[11px] font-bold text-sky-900">
                  Student Matching
                </div>
                <h1 className="font-display text-2xl font-bold tracking-normal text-cyber-slate md:text-3xl">
                  ทุนที่เหมาะกับฉัน
                </h1>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-cyber-slate/65">
                  รายการทุนสำหรับโปรไฟล์ตัวอย่าง แสดงสถานะจากเงื่อนไขบังคับและข้อมูลที่ต้องตรวจสอบ
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
                {counts.map(({ status, count }) => {
                  const copy = MATCH_STATUS_COPY[status]
                  return (
                    <div key={status} className={`rounded-lg border px-3 py-2 ${copy.tone}`}>
                      <div className="text-lg font-bold leading-none">{count}</div>
                      <div className="mt-1 text-[11px] font-semibold leading-tight">{copy.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-bold text-cyber-slate">รายการแนะนำ</h2>
                  <p className="text-xs text-cyber-slate/55">
                    แสดง {visibleMatches.length} จาก {matches.length} ทุน
                  </p>
                </div>
                {hidden.size > 0 && (
                  <button
                    type="button"
                    onClick={() => setHidden(new Set())}
                    className="rounded-full border border-cyber-border/70 bg-white/65 px-3 py-1.5 text-xs font-bold text-cyber-slate transition-colors duration-fast ease-cyber hover:bg-white"
                  >
                    แสดงทั้งหมด
                  </button>
                )}
              </div>

              {visibleMatches.length === 0 ? (
                <div className="rounded-xl border border-cyber-border/70 bg-cyber-glass p-8 text-center shadow-cyber-soft">
                  <h3 className="font-bold text-cyber-slate">ยังไม่มีทุนในรายการ</h3>
                  <button
                    type="button"
                    onClick={() => setHidden(new Set())}
                    className="mt-4 rounded-lg bg-cyber-slate px-4 py-2 text-sm font-bold text-white"
                  >
                    แสดงทุนทั้งหมด
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleMatches.map((item) => {
                    const isSelected = selectedItem?.scholarship.id === item.scholarship.id

                    return (
                      <div key={item.scholarship.id} className="space-y-3">
                        <ScholarshipMatchCard
                          scholarship={item.scholarship}
                          matchResult={item.matchResult}
                          isSaved={saved.has(item.scholarship.id)}
                          isSelected={isSelected}
                          onViewDetails={() => setSelectedId(item.scholarship.id)}
                          onSave={() => toggleSaved(item.scholarship.id)}
                          onDismiss={() => dismiss(item.scholarship.id)}
                        />
                        {isSelected && (
                          <div className="lg:hidden">
                            <ScholarshipDetailPanel
                              scholarship={item.scholarship}
                              matchResult={item.matchResult}
                              onClose={() => setSelectedId(null)}
                            />
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </section>

            <aside className="hidden lg:block">
              <div className="sticky top-4">
                {selectedItem ? (
                  <ScholarshipDetailPanel
                    scholarship={selectedItem.scholarship}
                    matchResult={selectedItem.matchResult}
                  />
                ) : (
                  <div className="rounded-xl border border-cyber-border/70 bg-cyber-glass p-6 text-sm text-cyber-slate/60 shadow-cyber-soft">
                    เลือกทุนเพื่อดูรายละเอียด
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

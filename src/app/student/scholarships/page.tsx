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
const focusClass = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyber-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-cyber-bg'

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

  const resetHidden = () => {
    setHidden(new Set())
    setSelectedId((current) => current ?? matches[0]?.scholarship.id ?? null)
  }

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

    if (selectedId === id) {
      const nextVisible = matches.find((item) => item.scholarship.id !== id && !hidden.has(item.scholarship.id))
      setSelectedId(nextVisible?.scholarship.id ?? null)
    }
  }

  return (
    <AppShell requiredRole="student" title="ทุนที่เหมาะกับฉัน">
      <div className="-m-4 min-h-[calc(100vh-52px)] overflow-x-hidden bg-cyber-bg px-4 py-5 text-cyber-slate md:-m-6 md:px-6 md:py-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-5 rounded-xl border border-cyber-border/55 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex rounded-full border border-cyber-cyan/75 bg-cyber-cyan/20 px-3 py-1 text-[11px] font-bold text-sky-950">
                  Student Matching
                </div>
                <h1 className="break-words font-display text-2xl font-bold tracking-normal text-cyber-slate md:text-3xl">
                  ทุนที่เหมาะกับฉัน
                </h1>
                <p className="mt-1 max-w-2xl break-words text-sm leading-relaxed text-cyber-slate/75">
                  รายการทุนสำหรับโปรไฟล์ตัวอย่าง แสดงสถานะจากเงื่อนไขบังคับและข้อมูลที่ต้องตรวจสอบ
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:min-w-[520px]">
                {counts.map(({ status, count }) => {
                  const copy = MATCH_STATUS_COPY[status]
                  return (
                    <div key={status} className={`rounded-lg border px-3 py-2 shadow-sm ${copy.tone}`}>
                      <div className="text-lg font-bold leading-none">{count}</div>
                      <div className="mt-1 break-words text-[11px] font-semibold leading-tight">{copy.label}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </header>

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_430px]">
            <section className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="break-words text-sm font-bold text-cyber-slate">รายการแนะนำ</h2>
                  <p className="break-words text-xs text-cyber-slate/70">
                    แสดง {visibleMatches.length} จาก {matches.length} ทุน
                  </p>
                </div>
                {hidden.size > 0 && (
                  <button
                    type="button"
                    onClick={resetHidden}
                    className={`min-h-11 flex-shrink-0 rounded-full border border-cyber-border/60 bg-white/70 px-4 py-2 text-xs font-bold text-cyber-slate transition-colors duration-fast ease-cyber hover:bg-white ${focusClass}`}
                  >
                    แสดงทั้งหมด
                  </button>
                )}
              </div>

              {visibleMatches.length === 0 ? (
                <div className="rounded-xl border border-cyber-border/55 bg-cyber-glass p-8 text-center shadow-cyber-soft">
                  <h3 className="break-words font-bold text-cyber-slate">ยังไม่มีทุนในรายการ</h3>
                  <p className="mx-auto mt-1 max-w-sm break-words text-sm text-cyber-slate/70">
                    คุณซ่อนทุนทั้งหมดไว้ชั่วคราว สามารถแสดงรายการทั้งหมดกลับมาได้
                  </p>
                  <button
                    type="button"
                    onClick={resetHidden}
                    className={`mt-4 min-h-11 rounded-lg bg-cyber-slate px-4 py-2 text-sm font-bold text-white ${focusClass}`}
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
              <div className="sticky top-4 max-h-[calc(100vh-96px)] overflow-y-auto pr-1">
                {selectedItem ? (
                  <ScholarshipDetailPanel
                    scholarship={selectedItem.scholarship}
                    matchResult={selectedItem.matchResult}
                  />
                ) : (
                  <div className="rounded-xl border border-cyber-border/55 bg-cyber-glass p-6 text-sm text-cyber-slate/70 shadow-cyber-soft">
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

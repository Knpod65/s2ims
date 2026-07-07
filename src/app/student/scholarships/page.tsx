'use client'

import { useEffect, useMemo, useState } from 'react'
import { BookmarkCheck, History, RotateCcw, SlidersHorizontal } from 'lucide-react'
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

type StatusFilter = 'ALL' | MatchStatus
type DeckAction = 'viewed' | 'saved' | 'unsaved' | 'started' | 'dismissed'
type RecentAction = 'saved' | 'started' | null

interface DeckHistoryItem {
  id: string
  scholarshipId: string
  scholarshipTitle: string
  action: DeckAction
  createdAt: string
}

interface FeedbackState {
  scholarshipId: string
  action: RecentAction
  message: string
}

const ACTION_LABELS: Record<DeckAction, string> = {
  viewed: 'เปิดดูรายละเอียด',
  saved: 'บันทึกไว้',
  unsaved: 'ยกเลิกบันทึก',
  started: 'เริ่มสมัคร',
  dismissed: 'ไม่เหมาะกับฉัน',
}

function HistoryPanel({ items }: { items: DeckHistoryItem[] }) {
  return (
    <section className="rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="mb-3 flex items-center gap-2">
        <History size={16} className="text-cyan-800" aria-hidden="true" />
        <h2 className="text-sm font-bold">ประวัติการคัดเลือก</h2>
      </div>

      {items.length === 0 ? (
        <p className="break-words rounded-lg border border-cyber-border/35 bg-white/55 p-3 text-xs leading-relaxed text-cyber-slate/70">
          ยังไม่มีการดำเนินการ ลองเปิดดูรายละเอียด บันทึกไว้ หรือซ่อนทุนที่ไม่เหมาะกับคุณ
        </p>
      ) : (
        <ol className="space-y-2">
          {items.slice(0, 5).map((item) => (
            <li key={item.id} className="rounded-lg border border-cyber-border/35 bg-white/55 p-3">
              <div className="text-[11px] font-bold text-cyber-slate">{ACTION_LABELS[item.action]}</div>
              <div className="mt-0.5 break-words text-xs leading-snug text-cyber-slate/75">{item.scholarshipTitle}</div>
              <div className="mt-1 text-[10px] text-cyber-slate/55">{item.createdAt}</div>
            </li>
          ))}
        </ol>
      )}
    </section>
  )
}

function DeckPreview({
  activeTitle,
  nextTitle,
  feedback,
}: {
  activeTitle?: string
  nextTitle?: string
  feedback: FeedbackState | null
}) {
  return (
    <section className="mb-5 rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 text-cyber-slate shadow-cyber-soft backdrop-blur">
      <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,0.82fr)]">
        <div className="relative min-h-[86px]">
          <div
            aria-hidden="true"
            className="absolute inset-x-6 top-5 h-16 rounded-xl border border-cyber-violet/25 bg-cyber-violet/15 shadow-sm"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-3 top-2 h-16 rounded-xl border border-cyber-cyan/25 bg-cyber-cyan/15 shadow-sm"
          />
          <div className="relative rounded-xl border border-cyber-border/45 bg-white/70 p-3 shadow-cyber-soft">
            <div className="text-[10px] font-bold uppercase tracking-wide text-cyber-slate/60">Active card</div>
            <div className="mt-1 break-words text-sm font-bold leading-snug">
              {activeTitle ?? 'ยังไม่ได้เลือกทุน'}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-cyber-border/35 bg-white/60 p-3">
          <div className="text-[10px] font-bold uppercase tracking-wide text-cyber-slate/60">Next preview</div>
          <div className="mt-1 break-words text-sm font-semibold leading-snug text-cyber-slate/80">
            {nextTitle ?? 'ไม่มีรายการถัดไปในตัวกรองนี้'}
          </div>
          <div aria-live="polite" className="mt-2 min-h-5 break-words text-[11px] font-semibold text-cyber-slate/70">
            {feedback?.message ?? 'ใช้ปุ่มบนการ์ดเพื่อบันทึก เริ่มสมัคร หรือซ่อนทุน'}
          </div>
        </div>
      </div>
    </section>
  )
}

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
  const [started, setStarted] = useState<Set<string>>(() => new Set())
  const [selectedId, setSelectedId] = useState<string | null>(matches[0]?.scholarship.id ?? null)
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL')
  const [savedOnly, setSavedOnly] = useState(false)
  const [history, setHistory] = useState<DeckHistoryItem[]>([])
  const [feedback, setFeedback] = useState<FeedbackState | null>(null)

  const visibleMatches = matches.filter((item) => {
    if (hidden.has(item.scholarship.id)) return false
    if (savedOnly && !saved.has(item.scholarship.id)) return false
    if (statusFilter !== 'ALL' && item.matchResult.matchStatus !== statusFilter) return false
    return true
  })
  const visibleIdsKey = visibleMatches.map((item) => item.scholarship.id).join('|')
  const selectedItem =
    visibleMatches.find((item) => item.scholarship.id === selectedId) ??
    visibleMatches[0] ??
    null
  const selectedIndex = selectedItem
    ? visibleMatches.findIndex((item) => item.scholarship.id === selectedItem.scholarship.id)
    : -1
  const nextItem = selectedIndex >= 0
    ? visibleMatches[selectedIndex + 1] ?? visibleMatches[0]
    : null

  useEffect(() => {
    if (!visibleMatches.length) {
      if (selectedId !== null) setSelectedId(null)
      return
    }

    if (!selectedId || !visibleMatches.some((item) => item.scholarship.id === selectedId)) {
      setSelectedId(visibleMatches[0].scholarship.id)
    }
  }, [selectedId, visibleIdsKey, visibleMatches])

  const counts = STATUS_ORDER.map((status) => ({
    status,
    count: matches.filter((item) => item.matchResult.matchStatus === status).length,
  }))

  const recordAction = (action: DeckAction, scholarshipId: string, scholarshipTitle: string) => {
    setHistory((current) => [
      {
        id: `${action}-${scholarshipId}-${Date.now()}`,
        scholarshipId,
        scholarshipTitle,
        action,
        createdAt: new Intl.DateTimeFormat('th-TH', {
          hour: '2-digit',
          minute: '2-digit',
          day: 'numeric',
          month: 'short',
        }).format(new Date()),
      },
      ...current,
    ].slice(0, 12))
  }

  const resetHidden = () => {
    setHidden(new Set())
    setSelectedId(matches[0]?.scholarship.id ?? null)
  }

  const toggleSaved = (id: string, title: string) => {
    const wasSaved = saved.has(id)
    setSaved((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
    recordAction(wasSaved ? 'unsaved' : 'saved', id, title)
    setFeedback({
      scholarshipId: id,
      action: wasSaved ? null : 'saved',
      message: wasSaved ? 'ยกเลิกการบันทึกแล้ว' : 'บันทึกทุนนี้ไว้แล้ว',
    })
  }

  const viewDetails = (id: string, title: string) => {
    setSelectedId(id)
    recordAction('viewed', id, title)
  }

  const startApplication = (id: string, title: string) => {
    setStarted((current) => new Set(current).add(id))
    recordAction('started', id, title)
    setFeedback({
      scholarshipId: id,
      action: 'started',
      message: 'ทำเครื่องหมายว่าเริ่มสมัครแล้ว',
    })
  }

  const dismiss = (id: string, title: string) => {
    setHidden((current) => {
      const next = new Set(current)
      next.add(id)
      return next
    })
    recordAction('dismissed', id, title)
    setFeedback({
      scholarshipId: id,
      action: null,
      message: 'ซ่อนทุนนี้จากรายการชั่วคราวแล้ว',
    })

    if (selectedId === id) {
      const nextVisible = visibleMatches.find((item) => item.scholarship.id !== id)
      setSelectedId(nextVisible?.scholarship.id ?? null)
    }
  }

  return (
    <AppShell requiredRole="student" title="ทุนที่เหมาะกับฉัน" enableDemoAccess demoAccessLabel="นักศึกษา">
      <div className="-m-4 min-h-[calc(100vh-52px)] overflow-x-hidden bg-cyber-bg px-4 py-5 text-cyber-slate md:-m-6 md:px-6 md:py-6">
        <div className="mx-auto max-w-7xl">
          <header className="mb-5 rounded-xl border border-cyber-border/50 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="mb-2 inline-flex rounded-full border border-cyber-cyan/65 bg-cyber-cyan/20 px-3 py-1 text-[11px] font-bold text-sky-950">
                  Student Matching
                </div>
                <h1 className="break-words font-display text-2xl font-bold tracking-normal text-cyber-slate md:text-3xl">
                  ทุนที่เหมาะกับฉัน
                </h1>
                <p className="mt-1 max-w-2xl break-words text-sm leading-relaxed text-cyber-slate/75">
                  เลือกดู บันทึกไว้ หรือซ่อนทุนจากผลแมตช์จำลอง โดยสถานะยังยึดตามเงื่อนไขบังคับจากระบบเท่านั้น
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

          <DeckPreview
            activeTitle={selectedItem?.scholarship.title_en}
            nextTitle={nextItem && nextItem.scholarship.id !== selectedItem?.scholarship.id ? nextItem.scholarship.title_en : undefined}
            feedback={feedback}
          />

          <section className="mb-5 rounded-xl border border-cyber-border/45 bg-cyber-glass p-4 shadow-cyber-soft backdrop-blur">
            <div className="mb-3 flex items-center gap-2 text-sm font-bold text-cyber-slate">
              <SlidersHorizontal size={16} className="text-cyan-800" aria-hidden="true" />
              ตัวกรองและสถานะเด็ค
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatusFilter('ALL')}
                aria-pressed={statusFilter === 'ALL'}
                className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-fast ease-cyber ${focusClass} ${
                  statusFilter === 'ALL'
                    ? 'border-cyber-slate bg-cyber-slate text-white'
                    : 'border-cyber-border/55 bg-white/65 text-cyber-slate hover:bg-white'
                }`}
              >
                ทั้งหมด
              </button>
              {STATUS_ORDER.map((status) => {
                const copy = MATCH_STATUS_COPY[status]
                const active = statusFilter === status
                return (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    aria-pressed={active}
                    className={`min-h-11 rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-fast ease-cyber ${focusClass} ${
                      active ? `${copy.tone} ring-2 ring-cyber-cyan/25` : 'border-cyber-border/55 bg-white/65 text-cyber-slate hover:bg-white'
                    }`}
                  >
                    {copy.label}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={() => setSavedOnly((current) => !current)}
                aria-pressed={savedOnly}
                className={`inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold transition-colors duration-fast ease-cyber ${focusClass} ${
                  savedOnly
                    ? 'border-cyber-mint/80 bg-cyber-mint/45 text-emerald-950'
                    : 'border-cyber-border/55 bg-white/65 text-cyber-slate hover:bg-white'
                }`}
              >
                <BookmarkCheck size={14} aria-hidden="true" />
                เฉพาะที่บันทึกไว้
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              <div className="rounded-lg border border-cyber-border/35 bg-white/55 p-3">
                <div className="text-lg font-bold">{visibleMatches.length}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">กำลังแสดง</div>
              </div>
              <div className="rounded-lg border border-cyber-border/35 bg-white/55 p-3">
                <div className="text-lg font-bold">{saved.size}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">บันทึกไว้</div>
              </div>
              <div className="rounded-lg border border-cyber-border/35 bg-white/55 p-3">
                <div className="text-lg font-bold">{started.size}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">เริ่มสมัคร</div>
              </div>
              <div className="rounded-lg border border-cyber-border/35 bg-white/55 p-3">
                <div className="text-lg font-bold">{hidden.size}</div>
                <div className="text-[11px] font-semibold text-cyber-slate/70">ซ่อนไว้</div>
              </div>
            </div>
          </section>

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
                    className={`inline-flex min-h-11 flex-shrink-0 items-center gap-2 rounded-full border border-cyber-border/60 bg-white/70 px-4 py-2 text-xs font-bold text-cyber-slate transition-colors duration-fast ease-cyber hover:bg-white ${focusClass}`}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    แสดงทั้งหมด
                  </button>
                )}
              </div>

              {visibleMatches.length === 0 ? (
                <div className="rounded-xl border border-cyber-border/55 bg-cyber-glass p-8 text-center shadow-cyber-soft">
                  <h3 className="break-words font-bold text-cyber-slate">ยังไม่มีทุนในตัวกรองนี้</h3>
                  <p className="mx-auto mt-1 max-w-sm break-words text-sm text-cyber-slate/70">
                    ลองเปลี่ยนตัวกรอง หรือกดแสดงทั้งหมดเพื่อเรียกทุนที่ซ่อนไว้กลับมา
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatusFilter('ALL')
                      setSavedOnly(false)
                      resetHidden()
                    }}
                    className={`mt-4 min-h-11 rounded-lg bg-cyber-slate px-4 py-2 text-sm font-bold text-white ${focusClass}`}
                  >
                    รีเซ็ตตัวกรอง
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {visibleMatches.map((item) => {
                    const isSelected = selectedItem?.scholarship.id === item.scholarship.id
                    const id = item.scholarship.id
                    const title = item.scholarship.title_en

                    return (
                      <div key={id} className="space-y-3">
                        <ScholarshipMatchCard
                          scholarship={item.scholarship}
                          matchResult={item.matchResult}
                          isSaved={saved.has(id)}
                          isStarted={started.has(id)}
                          isSelected={isSelected}
                          recentAction={feedback?.scholarshipId === id ? feedback.action ?? undefined : undefined}
                          onViewDetails={() => viewDetails(id, title)}
                          onSave={() => toggleSaved(id, title)}
                          onStart={() => startApplication(id, title)}
                          onDismiss={() => dismiss(id, title)}
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

              <div className="lg:hidden">
                <HistoryPanel items={history} />
              </div>
            </section>

            <aside className="hidden space-y-4 lg:block">
              <div className="sticky top-4 max-h-[calc(100vh-96px)] overflow-y-auto pr-1">
                <div className="space-y-4">
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
                  <HistoryPanel items={history} />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </AppShell>
  )
}

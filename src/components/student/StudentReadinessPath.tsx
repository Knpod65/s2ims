'use client'
import { CheckCircle2, Circle, FileCheck2, ListChecks, Route } from 'lucide-react'
import { useLang } from '@/lib/i18n'
import type { MissingDataItem } from '@/data/mock/studentMatchingData'
import type { StudentDocumentItem } from '@/data/mock/studentApplicationData'
import { requiresStudentDocumentAttention } from '@/config/documentStatusDisplay'

type StudentReadinessPathProps = {
  readinessPct: number
  documents: StudentDocumentItem[]
  missingData?: MissingDataItem[]
  missingDataCount?: number
  className?: string
}

type StepState = 'complete' | 'active' | 'pending'

function getStepClassName(state: StepState) {
  if (state === 'complete') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (state === 'active') return 'border-[#0055FF]/25 bg-[#E5EDFF] text-role-primary'
  return 'border-line bg-white text-ink-3'
}

function getConnectorClassName(state: StepState) {
  return state === 'complete' ? 'bg-emerald-300' : 'bg-line'
}

export default function StudentReadinessPath({
  readinessPct,
  documents,
  missingData = [],
  missingDataCount,
  className = '',
}: StudentReadinessPathProps) {
  const { lang } = useLang()
  const pct = Math.max(0, Math.min(100, Math.round(readinessPct)))
  const requiredDocs = documents.filter(document => document.required).length
  const readyDocs = documents.filter(document => ['verified', 'uploaded', 'verification_pending'].includes(document.state)).length
  const attentionDocs = documents.filter(document => requiresStudentDocumentAttention(document.state)).length
  const helpfulItems = missingDataCount ?? missingData.length

  const profileState: StepState = helpfulItems === 0 ? 'complete' : 'active'
  const documentState: StepState = attentionDocs === 0 ? 'complete' : 'active'
  const reviewState: StepState = pct >= 80 && attentionDocs === 0 ? 'complete' : 'pending'

  const steps = [
    {
      id: 'profile',
      icon: ListChecks,
      state: profileState,
      title: lang === 'th' ? 'ข้อมูลสนับสนุน' : 'Supporting details',
      description: helpfulItems === 0
        ? (lang === 'th' ? 'ข้อมูลหลักพร้อมใช้' : 'Key details are ready')
        : (lang === 'th'
            ? `เติมได้อีก ${helpfulItems} รายการ`
            : `${helpfulItems} helpful item${helpfulItems > 1 ? 's' : ''} to add`),
    },
    {
      id: 'documents',
      icon: FileCheck2,
      state: documentState,
      title: lang === 'th' ? 'เอกสาร' : 'Documents',
      description: attentionDocs === 0
        ? (lang === 'th' ? 'เอกสารพร้อมสำหรับขั้นถัดไป' : 'Documents are ready for the next step')
        : (lang === 'th'
            ? `${readyDocs}/${requiredDocs} รายการหลักพร้อม`
            : `${readyDocs}/${requiredDocs} required ready`),
    },
    {
      id: 'review',
      icon: Route,
      state: reviewState,
      title: lang === 'th' ? 'พร้อมส่งต่อ' : 'Ready path',
      description: pct >= 80
        ? (lang === 'th' ? 'ใบสมัครมีความพร้อมสูง' : 'Application is in a strong place')
        : (lang === 'th' ? 'เพิ่มรายละเอียดเพื่อความพร้อมขึ้น' : 'Add details to strengthen readiness'),
    },
  ]

  return (
    <section className={`overflow-hidden rounded-[1.5rem] border border-[#0055FF]/15 bg-gradient-to-br from-[#E5EDFF] via-white to-white ${className}`}>
      <div className="grid gap-5 p-5 lg:grid-cols-[220px_minmax(0,1fr)] lg:p-6">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.12em] text-role-primary">
            {lang === 'th' ? 'เส้นทางความพร้อม' : 'Readiness path'}
          </div>
          <div className="mt-2 flex items-end gap-2 text-role-primary">
            <span className="font-display text-5xl font-bold leading-none">{pct}%</span>
            <span className="pb-1 text-sm font-semibold">{lang === 'th' ? 'พร้อม' : 'ready'}</span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-2">
            {lang === 'th'
              ? 'ดูภาพรวมว่าอะไรพร้อมแล้ว อะไรเติมได้ และขั้นตอนถัดไปคืออะไร'
              : 'See what is ready, what can still be added, and what comes next.'}
          </p>
        </div>

        <ol className="grid gap-3 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isComplete = step.state === 'complete'
            return (
              <li key={step.id} className="relative">
                {index > 0 && (
                  <div className={`absolute -left-3 top-7 hidden h-0.5 w-3 md:block ${getConnectorClassName(steps[index - 1].state)}`} />
                )}
                <div className={`h-full rounded-2xl border p-4 ${getStepClassName(step.state)}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="rounded-xl bg-white/80 p-2 shadow-soft">
                      <Icon size={18} />
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold">
                      {isComplete ? <CheckCircle2 size={13} /> : <Circle size={13} />}
                      {isComplete
                        ? (lang === 'th' ? 'พร้อม' : 'Ready')
                        : (step.state === 'active'
                            ? (lang === 'th' ? 'กำลังเติมได้' : 'In progress')
                            : (lang === 'th' ? 'ขั้นถัดไป' : 'Next'))}
                    </span>
                  </div>
                  <h2 className="mt-4 text-sm font-bold text-ink-1">{step.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-ink-2">{step.description}</p>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

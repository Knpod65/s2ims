'use client'

import type { ReactNode } from 'react'
import { AlertTriangle, FileSearch, ShieldCheck } from 'lucide-react'
import { useLang } from '@/lib/i18n'

type WorkbenchMetric = {
  label: string
  value: string | number
}

type StaffDocumentEvidenceWorkbenchProps = {
  studentToken: string
  scholarshipTitle: string
  statusBadge: ReactNode
  metrics: WorkbenchMetric[]
  evidence: ReactNode
  reviewContext: ReactNode
  operations: ReactNode
  auditTrail?: ReactNode
  className?: string
}

export default function StaffDocumentEvidenceWorkbench({
  studentToken,
  scholarshipTitle,
  statusBadge,
  metrics,
  evidence,
  reviewContext,
  operations,
  auditTrail,
  className = '',
}: StaffDocumentEvidenceWorkbenchProps) {
  const { lang } = useLang()

  return (
    <section className={`space-y-5 ${className}`}>
      <div className="overflow-hidden rounded-[1.5rem] border border-role-border bg-gradient-to-br from-role-tint via-white to-white shadow-soft">
        <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:p-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-role-primary shadow-soft">
              <FileSearch size={13} />
              {lang === 'th' ? 'พื้นที่ตรวจสอบเอกสาร' : 'Document evidence workbench'}
            </div>
            <h2 className="mt-3 font-display text-2xl font-bold text-ink-1">
              {lang === 'th' ? 'ตรวจหลักฐานก่อนตัดสินใจ' : 'Review evidence before deciding'}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-2">
              {lang === 'th'
                ? 'พื้นที่นี้จัดเอกสาร บริบทใบสมัคร และข้อควรระวังด้าน audit ให้อยู่ใกล้กัน โดยยังใช้พฤติกรรมตรวจเอกสารเดิมทั้งหมด'
                : 'This workspace keeps documents, application context, and audit awareness together while preserving the existing document review behavior.'}
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-white/85 p-4 shadow-soft">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3">
                  {lang === 'th' ? 'ผู้สมัคร' : 'Applicant'}
                </div>
                <div className="mt-1 font-mono text-sm font-semibold text-ink-1">{studentToken}</div>
              </div>
              {statusBadge}
            </div>
            <div className="mt-3 text-xs leading-relaxed text-ink-2">{scholarshipTitle}</div>
          </div>
        </div>

        <div className="grid border-t border-role-border/70 bg-white/60 sm:grid-cols-3">
          {metrics.map((metric, index) => (
            <div key={metric.label} className={`p-4 ${index > 0 ? 'border-t border-line sm:border-l sm:border-t-0' : ''}`}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-ink-3">{metric.label}</div>
              <div className="mt-1 font-display text-xl font-bold text-role-primary">{metric.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-[#FDE68A] bg-[#FFFBEB] p-4 text-[#78350F]">
        <div className="flex items-start gap-3">
          <AlertTriangle size={17} className="mt-0.5 shrink-0 text-[#B45309]" />
          <div>
            <div className="text-sm font-semibold">
              {lang === 'th' ? 'บริบท audit สำหรับต้นแบบ' : 'Prototype audit awareness'}
            </div>
            <p className="mt-1 text-xs leading-relaxed">
              {lang === 'th'
                ? 'การตัดสินใจเกี่ยวกับเอกสารควรมีหมายเหตุการตรวจสอบที่ชัดเจน ขณะนี้ audit logging แสดงเป็นบริบทใน UI ต้นแบบเท่านั้น'
                : 'Document decisions should include clear review notes. Audit logging is currently represented in the prototype UI only.'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(340px,0.75fr)]">
        <div className="space-y-5">
          <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-xl bg-role-tint p-2 text-role-primary">
                <FileSearch size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-ink-1">
                  {lang === 'th' ? 'หลักฐานเอกสาร' : 'Document evidence'}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  {lang === 'th'
                    ? 'ใช้แผงตรวจสอบเอกสารเดิมเพื่อคงพฤติกรรมปุ่ม เหตุผล และสถานะทั้งหมด'
                    : 'Uses the existing verification panel so actions, reasons, and statuses behave exactly as before.'}
                </p>
              </div>
            </div>
            {evidence}
          </section>

          {auditTrail && (
            <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-soft">
              {auditTrail}
            </section>
          )}
        </div>

        <aside className="space-y-5">
          <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-start gap-3">
              <div className="rounded-xl bg-surface-low p-2 text-ink-2">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold text-ink-1">
                  {lang === 'th' ? 'บริบทการตรวจสอบ' : 'Review context'}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-2">
                  {lang === 'th'
                    ? 'โปรไฟล์ยังคงปกปิดตัวตนตามค่าเริ่มต้น'
                    : 'Profile identity remains masked by default.'}
                </p>
              </div>
            </div>
            {reviewContext}
          </section>

          <section className="rounded-[1.5rem] border border-line bg-white p-5 shadow-soft">
            <h3 className="font-display text-lg font-bold text-ink-1">
              {lang === 'th' ? 'การดำเนินงานของเจ้าหน้าที่' : 'Staff operations'}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">
              {lang === 'th'
                ? 'หมายเหตุและสถานะใบสมัครยังทำงานด้วยพฤติกรรมเดิม'
                : 'Notes and application status controls keep their existing behavior.'}
            </p>
            <div className="mt-4 space-y-5">{operations}</div>
          </section>
        </aside>
      </div>
    </section>
  )
}

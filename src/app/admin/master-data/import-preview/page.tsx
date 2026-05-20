'use client'

import { useMemo, useState, type ChangeEvent } from 'react'
import AppShell from '@/components/layout/AppShell'
import { PageHeader, StatusBadge } from '@/components/ui/index'
import { useLang } from '@/lib/i18n'
import {
  parseMasterDataImportWorkbook,
  type MasterDataImportFilter,
  type MasterDataImportPreviewResult,
  type MasterDataImportPreviewRow,
  type MasterDataImportSourceType,
} from '@/lib/master-data-import'
import {
  AlertCircle,
  Ban,
  CheckCircle2,
  FileSpreadsheet,
  Filter,
  Info,
  Link2,
  Lock,
  RotateCcw,
  Shield,
  Upload,
  XCircle,
} from 'lucide-react'

const SOURCE_OPTIONS: Array<{
  value: MasterDataImportSourceType
  label: string
  description: string
  disabled?: boolean
}> = [
  {
    value: 'combined_personnel',
    label: 'Staff + Teacher combined personnel file',
    description: 'Preview and separate Staff_Master / Teacher_Master rows.',
  },
  {
    value: 'staff_master',
    label: 'Staff master',
    description: 'Preview operational Staff_Master rows.',
  },
  {
    value: 'teacher_master',
    label: 'Teacher master',
    description: 'Preview Teacher_Master rows and advisor candidates.',
  },
  {
    value: 'responsible_person_assignment',
    label: 'Responsible person assignment draft',
    description: 'Preview assignment rows and person matching needs.',
  },
  {
    value: 'account_profile',
    label: 'Account profile draft',
    description: 'Preview account/person matching rows.',
  },
  {
    value: 'lecturer_future',
    label: 'Lecturer (future only)',
    description: 'Blocked until future governance approval.',
    disabled: true,
  },
  {
    value: 'opencourse_future',
    label: 'OpenCourse (future only)',
    description: 'Blocked until future governance approval.',
    disabled: true,
  },
  {
    value: 'student_enrollment_future',
    label: 'Student/enrollment aggregate (future only)',
    description: 'Student PII import is not allowed in this flow.',
    disabled: true,
  },
]

const FILTER_OPTIONS: Array<{ value: MasterDataImportFilter; label: string }> = [
  { value: 'all', label: 'All rows' },
  { value: 'valid', label: 'Valid' },
  { value: 'errors', label: 'Errors' },
  { value: 'warnings', label: 'Warnings' },
  { value: 'duplicate_cmu_mail', label: 'Duplicate cmu_mail' },
  { value: 'missing_cmu_mail', label: 'Missing cmu_mail' },
  { value: 'manual_mapping', label: 'Manual mapping' },
  { value: 'blocked', label: 'Blocked rows' },
]

const REQUIRED_SAFETY_COPY = [
  'Preview only',
  'No data has been imported yet',
  'This does not open AP-10B',
  'This does not create official evidence',
  'Student PII import is not allowed in this flow',
]

function rowMatchesFilter(row: MasterDataImportPreviewRow, filter: MasterDataImportFilter) {
  if (filter === 'all') return true
  if (filter === 'valid') return row.validationStatus === 'valid'
  if (filter === 'errors') return row.validationStatus === 'error'
  if (filter === 'warnings') return row.validationStatus === 'warning'
  if (filter === 'duplicate_cmu_mail') return row.messages.some((message) => message.code === 'duplicate_cmu_mail')
  if (filter === 'missing_cmu_mail') return row.messages.some((message) => message.code === 'missing_cmu_mail')
  if (filter === 'manual_mapping') return row.mappingRequired
  if (filter === 'blocked') return row.blocked
  return true
}

function statusColor(status: MasterDataImportPreviewRow['validationStatus']) {
  if (status === 'error') return 'bg-red-50 text-red-700 border-red-200'
  if (status === 'warning') return 'bg-amber-50 text-amber-700 border-amber-200'
  if (status === 'info') return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-emerald-50 text-emerald-700 border-emerald-200'
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string
  value: string | number
  tone: 'neutral' | 'success' | 'warning' | 'danger'
}) {
  const toneClass = {
    neutral: 'text-ink-1',
    success: 'text-emerald-700',
    warning: 'text-amber-700',
    danger: 'text-red-700',
  }[tone]

  return (
    <div className="card p-4">
      <div className={`text-2xl font-bold font-display ${toneClass}`}>{value}</div>
      <div className="mt-1 text-xs text-ink-2">{label}</div>
    </div>
  )
}

function SafetyBanner() {
  return (
    <section aria-label="Master data import safety boundary" className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4">
      <div className="flex items-start gap-3">
        <Shield size={18} className="mt-0.5 shrink-0 text-amber-700" />
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {REQUIRED_SAFETY_COPY.map((copy) => (
              <span key={copy} className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs font-semibold text-amber-800">
                {copy}
              </span>
            ))}
          </div>
          <p className="text-sm text-amber-900">
            MC54 parses files in browser memory for preview only. It does not persist rows, create sessions, write audit events, create official evidence, or change AP-10B/AP-10C/AP-11 status.
          </p>
        </div>
      </div>
    </section>
  )
}

function SheetDetectionPanel({ result }: { result: MasterDataImportPreviewResult | null }) {
  if (!result) {
    return (
      <section className="card p-4" aria-label="Sheet detection empty state">
        <div className="flex items-center gap-2 text-sm font-semibold text-ink-1">
          <FileSpreadsheet size={16} />
          Sheet detection
        </div>
        <p className="mt-2 text-sm text-ink-2">Select a source type and choose a .xlsx file to preview detected sheets.</p>
      </section>
    )
  }

  return (
    <section className="card p-4" aria-label="Sheet detection results">
      <div className="flex items-center gap-2 text-sm font-semibold text-ink-1">
        <FileSpreadsheet size={16} />
        Sheet detection
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {result.sheets.map((sheet) => (
          <div key={sheet.sheetName} className="rounded-lg border border-line bg-bg-100 p-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-ink-1">{sheet.sheetName}</div>
                <div className="mt-1 text-xs text-ink-3">{sheet.rowCount} preview rows</div>
              </div>
              <StatusBadge
                label={sheet.blocked ? 'Blocked' : sheet.inferred ? 'Inferred' : 'Detected'}
                color={sheet.blocked ? 'bg-red-50 text-red-700 border-red-200' : sheet.inferred ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}
                dot
              />
            </div>
            <p className="mt-2 text-xs text-ink-2">{sheet.reason}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

function PreviewTable({ rows }: { rows: MasterDataImportPreviewRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="card p-6 text-center">
        <div className="text-sm font-medium text-ink-2">No preview rows match this filter.</div>
        <div className="mt-1 text-xs text-ink-3">No data has been imported yet.</div>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-200">
              <th className="p-3 text-left text-xs font-semibold text-ink-3">Row</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">Type</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">name_th</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">name_en</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">cmu_mail</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">Unit / Department</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">Position</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">Status</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">Validation</th>
              <th className="p-3 text-left text-xs font-semibold text-ink-3">Warning/error reason</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className={`border-b border-line ${index % 2 === 1 ? 'bg-surface-low/60' : ''}`}>
                <td className="p-3 font-mono text-xs text-ink-3">{row.sourceRowNumber}</td>
                <td className="p-3 text-xs text-ink-2">{row.normalizedRecordType}</td>
                <td className="p-3 text-xs text-ink-1">{row.name_th || '—'}</td>
                <td className="p-3 text-xs text-ink-1">{row.name_en || '—'}</td>
                <td className="p-3 font-mono text-xs text-ink-2">{row.cmu_mail || 'Missing'}</td>
                <td className="p-3 text-xs text-ink-2">{row.unitOrDivision || row.department || '—'}</td>
                <td className="p-3 text-xs text-ink-2">{row.position || '—'}</td>
                <td className="p-3 text-xs text-ink-2">{row.status || '—'}</td>
                <td className="p-3">
                  <StatusBadge label={row.validationStatus} color={statusColor(row.validationStatus)} dot />
                </td>
                <td className="p-3 text-xs text-ink-2">
                  {row.messages.length > 0 ? (
                    <div className="space-y-1">
                      {row.messages.slice(0, 3).map((message) => (
                        <div key={`${row.id}:${message.code}:${message.reason}`} className="flex items-start gap-1.5">
                          {message.severity === 'error' ? <XCircle size={12} className="mt-0.5 shrink-0 text-red-600" /> : message.severity === 'warning' ? <AlertCircle size={12} className="mt-0.5 shrink-0 text-amber-600" /> : <Info size={12} className="mt-0.5 shrink-0 text-blue-600" />}
                          <span>{message.reason}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="text-emerald-700">Ready for preview review</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function MasterDataImportPreviewPage() {
  const { lang } = useLang()
  const [sourceType, setSourceType] = useState<MasterDataImportSourceType>('combined_personnel')
  const [filter, setFilter] = useState<MasterDataImportFilter>('all')
  const [result, setResult] = useState<MasterDataImportPreviewResult | null>(null)
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [acknowledged, setAcknowledged] = useState({
    noAp10b: false,
    noEvidence: false,
    seedOnly: false,
  })

  const filteredRows = useMemo(() => {
    return result?.rows.filter((row) => rowMatchesFilter(row, filter)) ?? []
  }, [filter, result])

  const selectedOption = SOURCE_OPTIONS.find((option) => option.value === sourceType)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setIsParsing(true)
    setParseError(null)
    setResult(null)
    try {
      const preview = await parseMasterDataImportWorkbook(file, sourceType)
      setResult(preview)
    } catch (error) {
      setParseError(error instanceof Error ? error.message : 'Unable to parse workbook.')
    } finally {
      setIsParsing(false)
      event.target.value = ''
    }
  }

  function resetPreview() {
    setResult(null)
    setParseError(null)
    setFilter('all')
    setAcknowledged({ noAp10b: false, noEvidence: false, seedOnly: false })
  }

  const summary = result?.summary

  return (
    <AppShell requiredRole="admin" title="Master Data Import Preview">
      <PageHeader
        title={lang === 'th' ? 'ตัวอย่างนำเข้าข้อมูลหลัก' : 'Master Data Import Preview'}
        subtitle={lang === 'th' ? 'ตรวจสอบไฟล์บุคลากรแบบพรีวิวเท่านั้น ไม่มีการบันทึกข้อมูล' : 'Preview staff and teacher master data files without importing or persisting data.'}
        badge={<StatusBadge label="Preview only" color="bg-amber-50 text-amber-700 border-amber-200" dot />}
      />

      <SafetyBanner />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="space-y-4">
          <section className="card p-4" aria-label="Source selection and workbook upload">
            <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div>
                <label className="text-xs font-semibold text-ink-2" htmlFor="source-type">
                  Source type
                </label>
                <select
                  id="source-type"
                  value={sourceType}
                  onChange={(event) => setSourceType(event.target.value as MasterDataImportSourceType)}
                  className="mt-2 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink-1 focus:outline-none focus:ring-2 focus:ring-role-primary/30"
                >
                  {SOURCE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-ink-3">{selectedOption?.description}</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-ink-2" htmlFor="xlsx-upload">
                  Upload zone
                </label>
                <label
                  htmlFor="xlsx-upload"
                  className="mt-2 flex min-h-[92px] cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-line bg-bg-100 px-4 py-3 text-center hover:bg-surface-low"
                >
                  <Upload size={18} className="text-role-primary" />
                  <span className="mt-2 text-sm font-medium text-ink-1">Choose .xlsx for preview</span>
                  <span className="mt-1 text-xs text-ink-3">No data has been imported yet</span>
                </label>
                <input
                  id="xlsx-upload"
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {isParsing && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">
                Parsing workbook in browser memory for preview only.
              </div>
            )}

            {parseError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
                {parseError}
              </div>
            )}
          </section>

          <SheetDetectionPanel result={result} />

          {summary && (
            <section aria-label="Validation summary" className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
              <SummaryCard label="total_rows" value={summary.total_rows} tone="neutral" />
              <SummaryCard label="valid_rows" value={summary.valid_rows} tone="success" />
              <SummaryCard label="warning_rows" value={summary.warning_rows} tone="warning" />
              <SummaryCard label="error_rows" value={summary.error_rows} tone="danger" />
              <SummaryCard label="duplicate_email_count" value={summary.duplicate_email_count} tone={summary.duplicate_email_count > 0 ? 'danger' : 'neutral'} />
              <SummaryCard label="missing_email_count" value={summary.missing_email_count} tone={summary.missing_email_count > 0 ? 'warning' : 'neutral'} />
              <SummaryCard label="unresolved_mapping_count" value={summary.unresolved_mapping_count} tone={summary.unresolved_mapping_count > 0 ? 'warning' : 'neutral'} />
              <SummaryCard label="blocked_rows" value={summary.blocked_rows} tone={summary.blocked_rows > 0 ? 'danger' : 'neutral'} />
              <SummaryCard label="ready_to_confirm" value={summary.ready_to_confirm ? 'true' : 'false'} tone="neutral" />
            </section>
          )}

          <section aria-label="Row filters and preview table" className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-ink-1">
                <Filter size={16} />
                Row-level preview
              </div>
              <select
                value={filter}
                onChange={(event) => setFilter(event.target.value as MasterDataImportFilter)}
                className="rounded-lg border border-line bg-white px-3 py-2 text-xs text-ink-1 focus:outline-none focus:ring-2 focus:ring-role-primary/30"
              >
                {FILTER_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            {result ? (
              <PreviewTable rows={filteredRows} />
            ) : (
              <div className="card p-6 text-center">
                <div className="text-sm font-medium text-ink-2">No workbook preview yet.</div>
                <div className="mt-1 text-xs text-ink-3">Preview only. Select a source type and choose a .xlsx file.</div>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-4">
          <section className="card p-4" aria-label="Manual mapping queue">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-1">
              <Link2 size={16} />
              Manual mapping queue
            </div>
            {result && result.mappingQueue.length > 0 ? (
              <div className="mt-3 space-y-2">
                {result.mappingQueue.slice(0, 8).map((item) => (
                  <div key={item.id} className="rounded-lg border border-line bg-bg-100 p-3">
                    <div className="text-xs font-semibold text-ink-1">{item.displayName}</div>
                    <div className="mt-1 text-[11px] text-ink-3">Row {item.sourceRowNumber} · {item.caseType}</div>
                    <p className="mt-2 text-xs text-ink-2">{item.reason}</p>
                  </div>
                ))}
                {result.mappingQueue.length > 8 && (
                  <div className="text-xs text-ink-3">+{result.mappingQueue.length - 8} more mapping cases</div>
                )}
              </div>
            ) : (
              <p className="mt-3 text-sm text-ink-2">No unresolved mapping items.</p>
            )}
          </section>

          <section className="card p-4" aria-label="Confirm import disabled gate">
            <div className="flex items-center gap-2 text-sm font-semibold text-ink-1">
              <Lock size={16} />
              Confirm import gate
            </div>
            <p className="mt-2 text-sm text-ink-2">
              Confirm Import is intentionally disabled in MC54. This runtime previews validation only.
            </p>
            <div className="mt-4 space-y-2">
              <label className="flex items-start gap-2 text-xs text-ink-2">
                <input
                  type="checkbox"
                  checked={acknowledged.noAp10b}
                  onChange={(event) => setAcknowledged((current) => ({ ...current, noAp10b: event.target.checked }))}
                  className="mt-0.5"
                />
                <span>This does not open AP-10B</span>
              </label>
              <label className="flex items-start gap-2 text-xs text-ink-2">
                <input
                  type="checkbox"
                  checked={acknowledged.noEvidence}
                  onChange={(event) => setAcknowledged((current) => ({ ...current, noEvidence: event.target.checked }))}
                  className="mt-0.5"
                />
                <span>This does not create official evidence</span>
              </label>
              <label className="flex items-start gap-2 text-xs text-ink-2">
                <input
                  type="checkbox"
                  checked={acknowledged.seedOnly}
                  onChange={(event) => setAcknowledged((current) => ({ ...current, seedOnly: event.target.checked }))}
                  className="mt-0.5"
                />
                <span>This import is master-data seed only</span>
              </label>
            </div>
            <button
              type="button"
              disabled
              className="mt-4 flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-line bg-bg-200 px-3 py-2 text-sm font-semibold text-ink-3"
              aria-disabled="true"
            >
              <Ban size={14} />
              Confirm Import disabled in MC54
            </button>
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-line bg-bg-100 p-3 text-xs text-ink-2">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-emerald-700" />
              <span>Preview state is discarded on reset or page reload. No import session is created.</span>
            </div>
          </section>

          <button
            type="button"
            onClick={resetPreview}
            className="btn-secondary w-full justify-center text-sm"
          >
            <RotateCcw size={14} />
            Reset preview
          </button>
        </aside>
      </div>
    </AppShell>
  )
}

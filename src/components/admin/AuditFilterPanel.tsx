'use client'

import { useLang } from '@/lib/i18n'
import { useState } from 'react'
import { X } from 'lucide-react'

interface AuditFilterPanelProps {
  onFilterChange?: (filters: AuditFilters) => void
}

export interface AuditFilters {
  action?: string
  actorRole?: 'student' | 'staff' | 'esq' | 'provider' | 'admin' | ''
  entityType?: string
  dateFrom?: string
  dateTo?: string
  riskLevel?: 'high' | 'medium' | 'low' | ''
  sensitiveOnly?: boolean
}

export default function AuditFilterPanel({ onFilterChange }: AuditFilterPanelProps) {
  const { lang } = useLang()
  const [filters, setFilters] = useState<AuditFilters>({
    action: '',
    actorRole: '',
    entityType: '',
    dateFrom: '',
    dateTo: '',
    riskLevel: '',
    sensitiveOnly: false,
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const handleFilterChange = (key: keyof AuditFilters, value: unknown) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  const handleReset = () => {
    const emptyFilters: AuditFilters = {
      action: '',
      actorRole: '',
      entityType: '',
      dateFrom: '',
      dateTo: '',
      riskLevel: '',
      sensitiveOnly: false,
    }
    setFilters(emptyFilters)
    onFilterChange?.(emptyFilters)
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([, val]) => (typeof val === 'string' ? val : val !== false)
  )

  return (
    <div className="card p-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full"
      >
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-sm text-ink-1">
            {lang === 'th' ? 'ตัวกรอง' : 'Filters'}
          </h3>
          {hasActiveFilters && (
            <span className="text-[10px] px-2 py-0.5 rounded bg-role-tint text-role-primary">
              {Object.entries(filters).filter(([, val]) => (typeof val === 'string' ? val : val !== false)).length}
            </span>
          )}
        </div>
        <div className="text-xs text-ink-3">{isExpanded ? '▼' : '▶'}</div>
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 pt-4 border-t border-line">
          {/* Action Filter */}
          <div>
            <label className="text-xs text-ink-3 font-semibold block mb-1">
              {lang === 'th' ? 'การกระทำ' : 'Action'}
            </label>
            <input
              type="text"
              placeholder={lang === 'th' ? 'ค้นหาการกระทำ...' : 'Search actions...'}
              value={filters.action || ''}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-line bg-bg-200 text-ink-1 placeholder-ink-3 focus:outline-none focus:border-role-border"
            />
          </div>

          {/* Actor Role Filter */}
          <div>
            <label className="text-xs text-ink-3 font-semibold block mb-1">
              {lang === 'th' ? 'บทบาทผู้กระทำการ' : 'Actor Role'}
            </label>
            <select
              value={filters.actorRole || ''}
              onChange={(e) => handleFilterChange('actorRole', e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-line bg-bg-200 text-ink-1 focus:outline-none focus:border-role-border"
            >
              <option value="">{lang === 'th' ? 'ทั้งหมด' : 'All'}</option>
              <option value="student">{lang === 'th' ? 'นักศึกษา' : 'Student'}</option>
              <option value="staff">{lang === 'th' ? 'เจ้าหน้าที่' : 'Staff'}</option>
              <option value="esq">{lang === 'th' ? 'หัวหน้า ESQ' : 'ESQ Head'}</option>
              <option value="provider">{lang === 'th' ? 'ผู้ให้ทุน' : 'Provider'}</option>
              <option value="admin">{lang === 'th' ? 'ผู้ดูแลระบบ' : 'Admin'}</option>
            </select>
          </div>

          {/* Entity Type Filter */}
          <div>
            <label className="text-xs text-ink-3 font-semibold block mb-1">
              {lang === 'th' ? 'ประเภทสิ่งอ้างอิง' : 'Entity Type'}
            </label>
            <select
              value={filters.entityType || ''}
              onChange={(e) => handleFilterChange('entityType', e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-line bg-bg-200 text-ink-1 focus:outline-none focus:border-role-border"
            >
              <option value="">{lang === 'th' ? 'ทั้งหมด' : 'All'}</option>
              <option value="User">{lang === 'th' ? 'ผู้ใช้' : 'User'}</option>
              <option value="Application">{lang === 'th' ? 'ใบสมัคร' : 'Application'}</option>
              <option value="Announcement">{lang === 'th' ? 'ประกาศ' : 'Announcement'}</option>
              <option value="OcrJob">OCR</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-ink-3 font-semibold block mb-1">
                {lang === 'th' ? 'จากวันที่' : 'From Date'}
              </label>
              <input
                type="date"
                value={filters.dateFrom || ''}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-line bg-bg-200 text-ink-1 focus:outline-none focus:border-role-border"
              />
            </div>
            <div>
              <label className="text-xs text-ink-3 font-semibold block mb-1">
                {lang === 'th' ? 'ถึงวันที่' : 'To Date'}
              </label>
              <input
                type="date"
                value={filters.dateTo || ''}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded border border-line bg-bg-200 text-ink-1 focus:outline-none focus:border-role-border"
              />
            </div>
          </div>

          {/* Risk Level Filter */}
          <div>
            <label className="text-xs text-ink-3 font-semibold block mb-1">
              {lang === 'th' ? 'ระดับความเสี่ยง' : 'Risk Level'}
            </label>
            <select
              value={filters.riskLevel || ''}
              onChange={(e) => handleFilterChange('riskLevel', e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded border border-line bg-bg-200 text-ink-1 focus:outline-none focus:border-role-border"
            >
              <option value="">{lang === 'th' ? 'ทั้งหมด' : 'All'}</option>
              <option value="high">{lang === 'th' ? 'สูง' : 'High'}</option>
              <option value="medium">{lang === 'th' ? 'ปานกลาง' : 'Medium'}</option>
              <option value="low">{lang === 'th' ? 'ต่ำ' : 'Low'}</option>
            </select>
          </div>

          {/* Sensitive Only Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.sensitiveOnly || false}
              onChange={(e) => handleFilterChange('sensitiveOnly', e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-xs text-ink-1">
              {lang === 'th' ? 'เฉพาะการกระทำที่ละเอียดอ่อนเท่านั้น' : 'Sensitive Actions Only'}
            </span>
          </label>

          {/* Reset Button */}
          {hasActiveFilters && (
            <button
              onClick={handleReset}
              className="w-full text-xs py-1.5 px-3 rounded bg-ink-3/10 text-ink-3 hover:bg-ink-3/20 transition-colors flex items-center justify-center gap-1"
            >
              <X size={12} />
              {lang === 'th' ? 'รีเซ็ตตัวกรอง' : 'Reset Filters'}
            </button>
          )}
        </div>
      )}
    </div>
  )
}

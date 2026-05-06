'use client'

import { useLang } from '@/lib/i18n'
import { useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import type { AdminRole } from '@/data/mock/adminData'
import ElevatedAccessWarning from './ElevatedAccessWarning'
import AdminAuditWarningCard from './AdminAuditWarningCard'

interface RoleAssignmentPanelProps {
  userId: string
  userName_th: string
  userName_en: string
  currentRoles: string[]
  availableRoles: AdminRole[]
  onAssignRole?: (roleId: string, reason: string) => void
  onRemoveRole?: (roleId: string, reason: string) => void
}

export default function RoleAssignmentPanel({
  userId,
  userName_th,
  userName_en,
  currentRoles,
  availableRoles,
  onAssignRole,
  onRemoveRole,
}: RoleAssignmentPanelProps) {
  const { lang } = useLang()
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [mode, setMode] = useState<'view' | 'assign' | 'remove'>('view')

  const currentRoleDetails = availableRoles.filter(r => currentRoles.includes(r.id))
  const availableToAssign = availableRoles.filter(r => !currentRoles.includes(r.id))

  const hasHighRiskRoles = availableRoles
    .filter(r => currentRoles.includes(r.id))
    .some(r => r.permissions.some(p => p.includes('delete') || p.includes('grant')))

  const selectedRoleDetails = selectedRole ? availableRoles.find(r => r.id === selectedRole) : null

  const handleAssignClick = () => {
    if (selectedRole && reason.trim().length >= 20 && onAssignRole) {
      onAssignRole(selectedRole, reason)
      setSelectedRole(null)
      setReason('')
      setMode('view')
    }
  }

  const handleRemoveClick = (roleId: string) => {
    if (reason.trim().length >= 20 && onRemoveRole) {
      onRemoveRole(roleId, reason)
      setReason('')
      setMode('view')
    }
  }

  if (mode === 'view') {
    return (
      <div className="card p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-ink-1">
            {lang === 'th' ? 'การมอบหมายบทบาท' : 'Role Assignment'}
          </h3>
          <button
            onClick={() => setMode('assign')}
            className="text-xs py-1 px-2 rounded bg-brand/10 text-brand hover:bg-brand/20 transition-colors"
          >
            {lang === 'th' ? '+ เพิ่มบทบาท' : '+ Add Role'}
          </button>
        </div>

        {currentRoleDetails.length === 0 ? (
          <p className="text-xs text-ink-3 italic">
            {lang === 'th' ? 'ยังไม่มีบทบาทที่มอบหมาย' : 'No roles assigned yet'}
          </p>
        ) : (
          <div className="space-y-2">
            {currentRoleDetails.map(role => (
              <div
                key={role.id}
                className="flex items-start justify-between p-3 rounded bg-bg-100 border border-white/[0.08]"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle2 size={12} className="text-status-success" />
                    <span className="font-medium text-xs text-ink-1">
                      {lang === 'th' ? role.name_th : role.name_en}
                    </span>
                  </div>
                  <p className="text-xs text-ink-3">
                    {lang === 'th' ? role.description_th : role.description_en}
                  </p>
                  <p className="text-xs text-ink-3 mt-1">
                    {role.permissions.length} {lang === 'th' ? 'สิทธิ์' : 'permissions'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRole(role.id)
                    setMode('remove')
                  }}
                  className="text-xs py-1 px-2 rounded bg-status-danger/10 text-status-danger hover:bg-status-danger/20 transition-colors flex-shrink-0 ml-2"
                >
                  {lang === 'th' ? 'นำออก' : 'Remove'}
                </button>
              </div>
            ))}
          </div>
        )}

        {hasHighRiskRoles && (
          <ElevatedAccessWarning
            message_th={`${lang === 'th' ? userName_th : userName_en} มีการเข้าถึงระดับสูง`}
            message_en={`${lang === 'th' ? userName_th : userName_en} has elevated access`}
            riskLevel="high"
          />
        )}
      </div>
    )
  }

  if (mode === 'assign') {
    return (
      <div className="card p-5 space-y-4">
        <h3 className="font-semibold text-sm text-ink-1">
          {lang === 'th' ? 'มอบหมายบทบาทใหม่' : 'Assign New Role'}
        </h3>

        <AdminAuditWarningCard
          action_th="มอบหมายบทบาทใหม่ให้ผู้ใช้งาน"
          action_en="Assigning new role to user"
          consequence_th="เปลี่ยนแปลงจะถูกบันทึกในบันทึกการตรวจสอบ"
          consequence_en="Changes will be logged in audit trail"
          requiresReason={true}
        />

        <div>
          <label className="text-xs text-ink-3 font-semibold block mb-2">
            {lang === 'th' ? 'เลือกบทบาท' : 'Select Role'}
          </label>
          <select
            value={selectedRole || ''}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded border border-white/[0.08] bg-bg-200 text-ink-1 focus:outline-none focus:border-brand/50"
          >
            <option value="">{lang === 'th' ? 'เลือกบทบาท...' : 'Select a role...'}</option>
            {availableToAssign.map(role => (
              <option key={role.id} value={role.id}>
                {lang === 'th' ? role.name_th : role.name_en}
              </option>
            ))}
          </select>
        </div>

        {selectedRoleDetails && (
          <div className="p-3 rounded bg-bg-100 border border-white/[0.08]">
            <p className="text-xs text-ink-3 font-semibold mb-1">
              {lang === 'th' ? 'รายละเอียดบทบาท' : 'Role Details'}
            </p>
            <p className="text-xs text-ink-1 mb-2">
              {lang === 'th' ? selectedRoleDetails.description_th : selectedRoleDetails.description_en}
            </p>
            <p className="text-xs text-ink-3">
              {selectedRoleDetails.permissions.length} {lang === 'th' ? 'สิทธิ์' : 'permissions'}
            </p>
          </div>
        )}

        <div>
          <label className="text-xs text-ink-3 font-semibold block mb-2">
            {lang === 'th' ? 'เหตุผล (ต่ำสุด 20 ตัวอักษร)' : 'Reason (min 20 characters)'}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={lang === 'th' ? 'อธิบายเหตุผลในการมอบหมายบทบาทนี้...' : 'Explain the reason for assigning this role...'}
            className="w-full px-3 py-2 text-xs rounded border border-white/[0.08] bg-bg-200 text-ink-1 placeholder-ink-3 focus:outline-none focus:border-brand/50 resize-none h-20"
          />
          <p className={`text-xs mt-1 ${reason.length < 20 ? 'text-status-danger' : 'text-status-success'}`}>
            {reason.length}/20
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('view')
              setSelectedRole(null)
              setReason('')
            }}
            className="flex-1 text-xs py-2 px-3 rounded border border-white/[0.08] text-ink-1 hover:bg-white/[0.05] transition-colors"
          >
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>
          <button
            onClick={handleAssignClick}
            disabled={!selectedRole || reason.length < 20}
            className="flex-1 text-xs py-2 px-3 rounded bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {lang === 'th' ? 'มอบหมาย' : 'Assign'}
          </button>
        </div>
      </div>
    )
  }

  if (mode === 'remove') {
    return (
      <div className="card p-5 space-y-4">
        <h3 className="font-semibold text-sm text-ink-1">
          {lang === 'th' ? 'นำออกบทบาท' : 'Remove Role'}
        </h3>

        <AdminAuditWarningCard
          action_th="นำออกบทบาทจากผู้ใช้งาน"
          action_en="Removing role from user"
          consequence_th="การเปลี่ยนแปลงจะถูกบันทึกและไม่สามารถย้อนกลับได้"
          consequence_en="Changes will be logged and cannot be undone"
          requiresReason={true}
        />

        {selectedRoleDetails && (
          <div className="p-3 rounded bg-status-danger/10 border border-status-danger/20">
            <p className="text-xs text-status-danger font-semibold mb-1">
              {lang === 'th' ? 'บทบาทที่จะนำออก' : 'Role to Remove'}
            </p>
            <p className="text-xs text-status-danger">
              {lang === 'th' ? selectedRoleDetails.name_th : selectedRoleDetails.name_en}
            </p>
          </div>
        )}

        <div>
          <label className="text-xs text-ink-3 font-semibold block mb-2">
            {lang === 'th' ? 'เหตุผล (ต่ำสุด 20 ตัวอักษร)' : 'Reason (min 20 characters)'}
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={lang === 'th' ? 'อธิบายเหตุผลในการนำออกบทบาทนี้...' : 'Explain the reason for removing this role...'}
            className="w-full px-3 py-2 text-xs rounded border border-white/[0.08] bg-bg-200 text-ink-1 placeholder-ink-3 focus:outline-none focus:border-brand/50 resize-none h-20"
          />
          <p className={`text-xs mt-1 ${reason.length < 20 ? 'text-status-danger' : 'text-status-success'}`}>
            {reason.length}/20
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setMode('view')
              setSelectedRole(null)
              setReason('')
            }}
            className="flex-1 text-xs py-2 px-3 rounded border border-white/[0.08] text-ink-1 hover:bg-white/[0.05] transition-colors"
          >
            {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
          </button>
          <button
            onClick={() => selectedRole && handleRemoveClick(selectedRole)}
            disabled={reason.length < 20}
            className="flex-1 text-xs py-2 px-3 rounded bg-status-danger text-white hover:bg-status-danger/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {lang === 'th' ? 'นำออก' : 'Remove'}
          </button>
        </div>
      </div>
    )
  }

  return null
}

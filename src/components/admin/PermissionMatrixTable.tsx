'use client'

import { useLang } from '@/lib/i18n'
import { CheckCircle2, XCircle, AlertCircle, Lock } from 'lucide-react'
import { useState } from 'react'
import type { AdminRole, AdminPermission } from '@/data/mock/adminData'
import PermissionStatusBadge from './PermissionStatusBadge'

interface PermissionMatrixTableProps {
  roles: AdminRole[]
  permissions: AdminPermission[]
}

interface PermissionStatus {
  [roleId: string]: {
    [permissionId: string]: 'allowed' | 'denied' | 'needs_approval' | 'restricted'
  }
}

export default function PermissionMatrixTable({ roles, permissions }: PermissionMatrixTableProps) {
  const { lang } = useLang()
  const [expandedCategory, setExpandedCategory] = useState<string | null>('users')

  // Build permission matrix based on role permissions
  const getPermissionStatus = (roleId: string, permissionId: string): 'allowed' | 'denied' | 'needs_approval' | 'restricted' => {
    const role = roles.find(r => r.id === roleId)
    if (!role) return 'denied'

    if (role.permissions.includes(permissionId)) {
      const perm = permissions.find(p => p.id === permissionId)
      // High-risk permissions need approval even if granted
      if (perm?.riskLevel === 'high') {
        return 'needs_approval'
      }
      return 'allowed'
    }
    return 'denied'
  }

  const categories = Array.from(new Set(permissions.map(p => p.category)))

  const getIconForStatus = (status: 'allowed' | 'denied' | 'needs_approval' | 'restricted') => {
    switch (status) {
      case 'allowed':
        return <CheckCircle2 size={14} className="text-status-success" />
      case 'denied':
        return <XCircle size={14} className="text-status-danger" />
      case 'needs_approval':
        return <AlertCircle size={14} className="text-status-warning" />
      case 'restricted':
        return <Lock size={14} className="text-ink-3" />
    }
  }

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const categoryPermissions = permissions.filter(p => p.category === category)
        const isExpanded = expandedCategory === category

        return (
          <div key={category}>
            <button
              onClick={() => setExpandedCategory(isExpanded ? null : category)}
              className="flex items-center gap-2 w-full text-left mb-3 p-2 rounded hover:bg-surface-low transition-colors"
            >
              <div className="text-sm font-semibold text-ink-1 capitalize">{category}</div>
              <div className="text-xs text-ink-3">{isExpanded ? '▼' : '▶'}</div>
            </button>

            {isExpanded && (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="text-left px-3 py-2 text-ink-3 font-semibold">
                        {lang === 'th' ? 'สิทธิ์' : 'Permission'}
                      </th>
                      {roles.map(role => (
                        <th key={role.id} className="text-center px-2 py-2 text-ink-3 font-semibold whitespace-nowrap">
                          <div className="max-w-[80px]">
                            <div className="text-[10px]">{lang === 'th' ? role.name_th : role.name_en}</div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {categoryPermissions.map((perm, idx) => (
                      <tr key={perm.id} className={idx % 2 === 0 ? 'bg-surface-low' : ''}>
                        <td className="px-3 py-2 text-ink-1">
                          <div className="max-w-[150px]">
                            <div className="font-medium">{lang === 'th' ? perm.label_th : perm.label_en}</div>
                            <div className="text-ink-3 text-[9px]">{perm.name}</div>
                          </div>
                        </td>
                        {roles.map(role => {
                          const status = getPermissionStatus(role.id, perm.id)
                          return (
                            <td key={`${role.id}-${perm.id}`} className="text-center px-2 py-2">
                              <div className="flex justify-center" title={status}>
                                {getIconForStatus(status)}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      })}

      <div className="mt-6 p-4 rounded-lg bg-bg-100 border border-line">
        <p className="text-xs font-semibold text-ink-1 mb-2">
          {lang === 'th' ? 'คำอธิบายสัญลักษณ์' : 'Legend'}
        </p>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-status-success" />
            <span className="text-ink-3">{lang === 'th' ? 'อนุญาต' : 'Allowed'}</span>
          </div>
          <div className="flex items-center gap-2">
            <XCircle size={12} className="text-status-danger" />
            <span className="text-ink-3">{lang === 'th' ? 'ปฏิเสธ' : 'Denied'}</span>
          </div>
          <div className="flex items-center gap-2">
            <AlertCircle size={12} className="text-status-warning" />
            <span className="text-ink-3">{lang === 'th' ? 'ต้องการการอนุมัติ' : 'Needs Approval'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-ink-3" />
            <span className="text-ink-3">{lang === 'th' ? 'จำกัด' : 'Restricted'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

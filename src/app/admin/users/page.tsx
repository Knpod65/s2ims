'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { Button, DisabledActionHint, RoleBadge, SafetyBanner, SectionHeader, StatusBadge } from '@/components/shared'
import { mockUsers } from '@/data/mock/users'
import { ROLE_LABELS } from '@/lib/navigation'
import { Download, Lock, UserPlus, Users } from 'lucide-react'

export default function AdminUsersPage() {
  const { lang } = useLang()
  const t = lang === 'th' ? 'th' : 'en'

  return (
    <AppShell requiredRole="admin">
      <PageHeader
        title={lang==='th'?'จัดการผู้ใช้':'User Management'}
        subtitle={`${mockUsers.length} ${lang==='th'?'ผู้ใช้ทั้งหมด':'total users'}`}
        actions={
          <div className="flex flex-wrap gap-3">
            <DisabledActionHint
              apCode="AP-10C"
              reason={lang === 'th' ? 'การส่งออกผู้ใช้ยังปิดไว้ในต้นแบบ' : 'User export is disabled in the prototype.'}
            >
              <Button variant="secondary" size="sm" disabled apCode="AP-10C" iconStart={<Download size={13}/>}>
                {lang==='th'?'ส่งออก':'Export'}
              </Button>
            </DisabledActionHint>
            <DisabledActionHint
              reason={lang === 'th' ? 'การเพิ่มผู้ใช้เป็น mock action ไม่มีการสร้างบัญชีจริง' : 'Add user is a mock action. No real account is created.'}
            >
              <Button variant="primary" size="sm" disabled iconStart={<UserPlus size={13}/>}>
                {lang==='th'?'เพิ่มผู้ใช้':'Add User'}
              </Button>
            </DisabledActionHint>
          </div>
        }
      />
      <SafetyBanner
        tone="blocked"
        title={lang === 'th' ? 'การจัดการผู้ใช้เป็นต้นแบบเท่านั้น' : 'User management is prototype-only'}
        description={lang === 'th'
          ? 'ข้อมูลในหน้านี้เป็น mock data ปุ่มส่งออก เพิ่มผู้ใช้ และแก้ไขยังไม่เปลี่ยนบัญชีจริง ไม่สร้าง audit event และไม่เปิด AP-10C/AP-11'
          : 'This page uses mock data. Export, add, and edit controls do not mutate real accounts, write audit events, or open AP-10C/AP-11.'}
        apCodes={['AP-10C', 'AP-11']}
        className="mb-4"
      />
      <SectionHeader
        title={lang === 'th' ? 'บัญชีผู้ใช้จำลอง' : 'Mock user accounts'}
        description={lang === 'th'
          ? 'แสดงบทบาทและสถานะสำหรับการสาธิตเท่านั้น การดำเนินการถูกแสดงไว้แต่ยังปิดใช้งาน'
          : 'Shows role and status for demo review only. Actions remain visible but disabled.'}
        action={<Users size={17} className="text-role-primary" aria-hidden="true" />}
      />
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line bg-bg-200">
              <th className="text-left p-3 text-xs text-ink-3">{lang==='th'?'ชื่อ':'Name'}</th>
              <th className="text-left p-3 text-xs text-ink-3">{lang==='th'?'อีเมล':'Email'}</th>
              <th className="text-left p-3 text-xs text-ink-3">{lang==='th'?'บทบาท':'Role'}</th>
              <th className="text-left p-3 text-xs text-ink-3">{lang==='th'?'สถานะ':'Status'}</th>
              <th className="text-left p-3 text-xs text-ink-3">{lang==='th'?'เข้าระบบล่าสุด':'Last Login'}</th>
              <th className="p-3 text-xs text-ink-3"></th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user, i) => {
              const rl = ROLE_LABELS[user.role]
              return (
                <tr key={user.id} className={`border-b border-line ${i%2===1?'bg-surface-low/60':''}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-role-tint border border-role-border flex items-center justify-center text-role-primary text-xs font-bold flex-shrink-0">
                        {(lang==='th'?user.name_th:user.name_en)[0]}
                      </div>
                      <span className="text-xs text-ink-1">{lang==='th'?user.name_th:user.name_en}</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-ink-3 font-mono">{user.email}</td>
                  <td className="p-3">
                    <RoleBadge role={user.role} label={rl[t]} size="sm" />
                  </td>
                  <td className="p-3">
                    <StatusBadge
                      label={user.is_active?(lang==='th'?'ใช้งาน':'Active'):(lang==='th'?'ปิดใช้':'Inactive')}
                      status={user.is_active ? 'success' : 'disabled'}
                      size="sm"
                    />
                  </td>
                  <td className="p-3 text-xs text-ink-3 font-mono">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString(lang==='th'?'th-TH':'en-US') : '-'}
                  </td>
                  <td className="p-3">
                    <DisabledActionHint
                      reason={lang === 'th' ? 'ปิดไว้ในต้นแบบ ไม่มีการเปลี่ยนบัญชีจริง' : 'Disabled in prototype. No real account mutation.'}
                    >
                      <button
                        type="button"
                        disabled
                        aria-disabled="true"
                        className="inline-flex items-center gap-1 rounded border border-line bg-bg-200 px-2 py-1 text-xs font-medium text-ink-3"
                      >
                        <Lock size={12} />
                        {lang==='th'?'แก้ไข':'Edit'}
                      </button>
                    </DisabledActionHint>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}

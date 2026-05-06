'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { mockUsers } from '@/data/mock/users'
import { ROLE_LABELS } from '@/lib/navigation'
import { UserPlus, Download } from 'lucide-react'

export default function AdminUsersPage() {
  const { lang } = useLang()
  return (
    <AppShell requiredRole="admin">
      <PageHeader
        title={lang==='th'?'จัดการผู้ใช้':'User Management'}
        subtitle={`${mockUsers.length} ${lang==='th'?'ผู้ใช้ทั้งหมด':'total users'}`}
        actions={
          <div className="flex gap-2">
            <button className="btn-secondary text-xs flex items-center gap-1.5 py-1.5"><Download size={13}/>{lang==='th'?'ส่งออก':'Export'}</button>
            <button className="btn-primary text-xs flex items-center gap-1.5 py-1.5"><UserPlus size={13}/>{lang==='th'?'เพิ่มผู้ใช้':'Add User'}</button>
          </div>
        }
      />
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.08] bg-bg-200">
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
                <tr key={user.id} className={`border-b border-white/[0.04] ${i%2===1?'bg-white/[0.01]':''}`}>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-brand text-xs font-bold flex-shrink-0">
                        {(lang==='th'?user.name_th:user.name_en)[0]}
                      </div>
                      <span className="text-xs text-ink-1">{lang==='th'?user.name_th:user.name_en}</span>
                    </div>
                  </td>
                  <td className="p-3 text-xs text-ink-3 font-mono">{user.email}</td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${rl.color}`}>
                      {lang==='th'?rl.th:rl.en}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${user.is_active?'bg-status-success/15 text-green-300 border border-status-success/25':'bg-white/[0.06] text-ink-3 border border-white/[0.1]'}`}>
                      {user.is_active?(lang==='th'?'ใช้งาน':'Active'):(lang==='th'?'ปิดใช้':'Inactive')}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-ink-3 font-mono">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString(lang==='th'?'th-TH':'en-US') : '-'}
                  </td>
                  <td className="p-3">
                    <button className="text-xs text-brand hover:text-brand-light">{lang==='th'?'แก้ไข':'Edit'}</button>
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
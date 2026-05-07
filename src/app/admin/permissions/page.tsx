'use client'
import AppShell from '@/components/layout/AppShell'
import { useLang } from '@/lib/i18n'
import { PageHeader } from '@/components/ui/index'
import { Check, X } from 'lucide-react'

const FEATURES_TH = ['ดูประกาศสาธารณะ','สมัครทุน','ดูโปรไฟล์ตนเอง','จัดการประกาศ','ตรวจสอบใบสมัคร','OCR เอกสาร','อนุมัติประกาศ','ดูสถิติรวม','จัดการผู้ใช้','ดู Audit Log']
const FEATURES_EN = ['View public scholarships','Apply for scholarships','View own profile','Manage announcements','Review applications','OCR documents','Approve announcements','View aggregate stats','Manage users','View audit log']
const ROLES_TH = ['นักศึกษา','เจ้าหน้าที่','หัวหน้า ESQ','ผู้ให้ทุน','ผู้ดูแลระบบ']
const ROLES_EN = ['Student','Staff','ESQ Head','Provider','Admin']
const MATRIX = [
  [true,true,true,false,false,false,false,false,false,false],
  [true,false,true,true,true,true,false,true,false,false],
  [true,false,false,true,false,false,true,true,false,false],
  [true,false,false,false,false,false,false,true,false,false],
  [true,true,true,true,true,true,true,true,true,true],
]

export default function PermissionsPage() {
  const { lang } = useLang()
  const features = lang==='th'?FEATURES_TH:FEATURES_EN
  const roles = lang==='th'?ROLES_TH:ROLES_EN
  return (
    <AppShell requiredRole="admin">
      <PageHeader title={lang==='th'?'ตาราง Permission':'Permission Matrix'} subtitle={lang==='th'?'สิทธิ์การเข้าถึงตามบทบาท':'Role-based access control matrix'}/>
      <div className="card overflow-x-auto">
        <table className="w-full text-xs min-w-[600px]">
          <thead>
            <tr className="border-b border-line bg-bg-200">
              <th className="text-left p-3 text-ink-3 font-semibold min-w-[160px]">{lang==='th'?'ฟีเจอร์':'Feature'}</th>
              {roles.map(r => <th key={r} className="p-3 text-center text-ink-3 font-semibold whitespace-nowrap">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, fi) => (
              <tr key={fi} className={`border-b border-line ${fi%2===1?'bg-surface-low/60':''}`}>
                <td className="p-3 text-ink-1">{feature}</td>
                {MATRIX.map((row, ri) => (
                  <td key={ri} className="p-3 text-center">
                    {row[fi]
                      ? <Check size={14} className="mx-auto text-status-success"/>
                      : <X size={14} className="mx-auto text-ink-3 opacity-30"/>
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  )
}
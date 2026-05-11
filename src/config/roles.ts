import type { Role } from '@/lib/types'

export type RoleAudience = 'external' | 'internal'

export type RoleThemeName =
  | 'Aurora Blue'
  | 'Trust Emerald'
  | 'Operational Amber'
  | 'Strategic Violet'
  | 'Control Graphite'

export interface RoleConfig {
  key: Role
  label: {
    en: string
    th: string
  }
  themeName: RoleThemeName
  homeRoute: string
  routePrefixes: readonly string[]
  shortDescription: {
    en: string
    th: string
  }
  dataVisibilityNotes: string
  audience: RoleAudience
  internal: boolean
}

export const ROLE_CONFIG = {
  student: {
    key: 'student',
    label: {
      en: 'Student',
      th: 'นักศึกษา',
    },
    themeName: 'Aurora Blue',
    homeRoute: '/student/dashboard',
    routePrefixes: ['/student'],
    shortDescription: {
      en: 'Own profile, recommendations, scholarships, applications, and documents.',
      th: 'ดูข้อมูลตนเอง คำแนะนำทุน สมัครทุน และเอกสารของตนเอง',
    },
    dataVisibilityNotes:
      'Students should see only their own profile, matching explanations, applications, and document states.',
    audience: 'external',
    internal: false,
  },
  provider: {
    key: 'provider',
    label: {
      en: 'Provider',
      th: 'ผู้ให้ทุน',
    },
    themeName: 'Trust Emerald',
    homeRoute: '/provider/dashboard',
    routePrefixes: ['/provider'],
    shortDescription: {
      en: 'Scholarship portfolio, anonymized candidate pools, and aggregate impact.',
      th: 'จัดการทุน กลุ่มผู้สมัครแบบไม่เปิดเผยตัวตน และผลลัพธ์เชิงสรุป',
    },
    dataVisibilityNotes:
      'Providers must see Candidate #C-XXXX tokens only, with banded or aggregate student data.',
    audience: 'external',
    internal: false,
  },
  staff: {
    key: 'staff',
    label: {
      en: 'Staff',
      th: 'เจ้าหน้าที่',
    },
    themeName: 'Operational Amber',
    homeRoute: '/staff/dashboard',
    routePrefixes: ['/staff'],
    shortDescription: {
      en: 'Operational review, data quality, disclosure requests, and scholarship workflows.',
      th: 'ตรวจงานปฏิบัติการ คุณภาพข้อมูล คำขอเปิดเผยข้อมูล และเวิร์กโฟลว์ทุน',
    },
    dataVisibilityNotes:
      'Staff should use masked Student #S-XXXX identifiers by default and reveal identity only with reason and audit.',
    audience: 'internal',
    internal: true,
  },
  esq: {
    key: 'esq',
    label: {
      en: 'Executive / ESQ',
      th: 'ผู้บริหาร / ESQ',
    },
    themeName: 'Strategic Violet',
    homeRoute: '/esq/dashboard',
    routePrefixes: ['/esq'],
    shortDescription: {
      en: 'Aggregate governance, equity review, reports, and approval oversight.',
      th: 'กำกับดูแลภาพรวม ตรวจความเป็นธรรม รายงาน และอนุมัติในระดับนโยบาย',
    },
    dataVisibilityNotes:
      'Executive and ESQ views should remain aggregate-only unless a future policy grants a tightly audited exception.',
    audience: 'internal',
    internal: true,
  },
  admin: {
    key: 'admin',
    label: {
      en: 'Admin',
      th: 'ผู้ดูแลระบบ',
    },
    themeName: 'Control Graphite',
    homeRoute: '/admin/dashboard',
    routePrefixes: ['/admin'],
    shortDescription: {
      en: 'System configuration, users, permissions, audit logs, and platform controls.',
      th: 'จัดการระบบ ผู้ใช้ สิทธิ์ บันทึกตรวจสอบ และการควบคุมแพลตฟอร์ม',
    },
    dataVisibilityNotes:
      'Admin audit views should use tokens by default; sensitive identity fields require reason, scope, and audit trail.',
    audience: 'internal',
    internal: true,
  },
} as const satisfies Record<Role, RoleConfig>

export const ROLE_KEYS = Object.keys(ROLE_CONFIG) as Role[]

export function getRoleConfig(role: Role): RoleConfig {
  return ROLE_CONFIG[role]
}

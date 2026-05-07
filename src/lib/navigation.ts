import type { NavItem, Role } from './types'

/*
  NAV_CONFIG — full sidebar nav per role.
  Routes are UNCHANGED from the original spec.
*/
export const NAV_CONFIG: Record<Role, NavItem[]> = {
  student: [
    { label_th: 'แดชบอร์ด',       label_en: 'Dashboard',       href: '/student/dashboard',        icon: 'LayoutDashboard' },
    { label_th: 'ทุนการศึกษา',     label_en: 'Scholarships',    href: '/scholarships',              icon: 'BookOpen' },
    { label_th: 'ใบสมัครของฉัน',   label_en: 'My Applications', href: '/student/applications',      icon: 'FileText' },
    { label_th: 'โปรไฟล์',         label_en: 'My Profile',      href: '/student/profile',           icon: 'User' },
    { label_th: 'การแจ้งเตือน',    label_en: 'Notifications',   href: '/student/notifications',     icon: 'Bell' },
    { label_th: 'รายงานผล',        label_en: 'Follow-up',       href: '/student/follow-up',         icon: 'ClipboardList' },
  ],
  staff: [
    { label_th: 'แดชบอร์ด',        label_en: 'Dashboard',        href: '/staff/dashboard',           icon: 'LayoutDashboard' },
    { label_th: 'สร้างประกาศ',     label_en: 'New Announcement', href: '/staff/announcements/new',   icon: 'FilePlus' },
    { label_th: 'จัดการใบสมัคร',   label_en: 'Applications',     href: '/staff/applications',        icon: 'FileText' },
    { label_th: 'คิว OCR',         label_en: 'OCR Queue',         href: '/staff/ocr',                 icon: 'ScanLine' },
    { label_th: 'วิเคราะห์',       label_en: 'Analytics',         href: '/staff/analytics',           icon: 'BarChart3' },
    { label_th: 'ติดตามผล',        label_en: 'Follow-up',         href: '/staff/follow-up',           icon: 'ClipboardList' },
  ],
  esq: [
    { label_th: 'แดชบอร์ด',             label_en: 'Dashboard',        href: '/esq/dashboard', icon: 'LayoutDashboard' },
    { label_th: 'ประวัติการอนุมัติ',    label_en: 'Approval History', href: '/esq/history',   icon: 'History' },
  ],
  provider: [
    { label_th: 'แดชบอร์ด',         label_en: 'Dashboard',         href: '/provider/dashboard',          icon: 'LayoutDashboard' },
    { label_th: 'สร้างทุน',          label_en: 'Create Scholarship', href: '/provider/scholarships/new',   icon: 'PlusCircle' },
    { label_th: 'สถิติผู้สมัคร',    label_en: 'Applicant Insights', href: '/provider/insights',            icon: 'BarChart3' },
    { label_th: 'ผลลัพธ์',           label_en: 'Outcomes',           href: '/provider/outcomes',            icon: 'TrendingUp' },
  ],
  admin: [
    { label_th: 'แดชบอร์ด',          label_en: 'Dashboard',   href: '/admin/dashboard',  icon: 'LayoutDashboard' },
    { label_th: 'จัดการผู้ใช้',      label_en: 'Users',        href: '/admin/users',      icon: 'Users' },
    { label_th: 'สิทธิ์การเข้าถึง', label_en: 'Permissions',  href: '/admin/permissions', icon: 'Shield' },
    { label_th: 'ประวัติการใช้งาน',  label_en: 'Audit Log',   href: '/admin/audit-log',  icon: 'ScrollText' },
    { label_th: 'ส่งออกข้อมูล',     label_en: 'Export',       href: '/admin/export',     icon: 'Download' },
    { label_th: 'ตั้งค่าระบบ',       label_en: 'Settings',    href: '/admin/settings',   icon: 'Settings' },
  ],
}

/*
  MOBILE_NAV — max 5 items shown in the bottom tab bar.
  Routes are UNCHANGED from the original spec.
*/
export const MOBILE_NAV: Record<Role, NavItem[]> = {
  student: [
    { label_th: 'หน้าแรก', label_en: 'Home',    href: '/student/dashboard',     icon: 'Home' },
    { label_th: 'จับคู่',   label_en: 'Matches', href: '/scholarships',           icon: 'BookOpen' },
    { label_th: 'งาน',      label_en: 'Tasks',   href: '/student/applications',   icon: 'ClipboardList' },
    { label_th: 'โปรไฟล์', label_en: 'Profile', href: '/student/profile',        icon: 'User' },
  ],
  provider: [
    { label_th: 'หน้าแรก', label_en: 'Home',       href: '/provider/dashboard',     icon: 'Home' },
    { label_th: 'ทุน',     label_en: 'Grants',     href: '/provider/scholarships',  icon: 'BookOpen' },
    { label_th: 'ผู้สมัคร',label_en: 'Candidates', href: '/provider/candidates',    icon: 'Users' },
    { label_th: 'โปรไฟล์', label_en: 'Profile',    href: '/provider/impact',        icon: 'User' },
  ],
  staff: [
    { label_th: 'หน้าแรก', label_en: 'Home',    href: '/staff/dashboard',            icon: 'Home' },
    { label_th: 'คิว',      label_en: 'Queue',   href: '/staff/ocr',                  icon: 'ScanLine' },
    { label_th: 'ตรวจสอบ', label_en: 'Audit',   href: '/staff/disclosure-requests',  icon: 'Shield' },
    { label_th: 'โปรไฟล์', label_en: 'Profile', href: '/staff/follow-up',            icon: 'User' },
  ],
  esq: [
    { label_th: 'ภาพรวม', label_en: 'Overview', href: '/esq/dashboard', icon: 'Home' },
    { label_th: 'รายงาน', label_en: 'Reports',  href: '/esq/history',   icon: 'History' },
    { label_th: 'สมดุล',  label_en: 'Equity',   href: '/esq/dashboard', icon: 'Shield' },
    { label_th: 'โปรไฟล์',label_en: 'Profile',  href: '/esq/history',   icon: 'User' },
  ],
  admin: [
    { label_th: 'หน้าแรก', label_en: 'Home',   href: '/admin/dashboard', icon: 'Home' },
    { label_th: 'ผู้ใช้',   label_en: 'Users',  href: '/admin/users',     icon: 'Users' },
    { label_th: 'ตรวจสอบ', label_en: 'Audit',  href: '/admin/audit-log', icon: 'ScrollText' },
    { label_th: 'ระบบ',    label_en: 'System', href: '/admin/settings',  icon: 'Settings' },
  ],
}

/*
  ROLE_HOME — redirect target after login.
  Routes are UNCHANGED.
*/
export const ROLE_HOME: Record<Role, string> = {
  student:  '/student/dashboard',
  staff:    '/staff/dashboard',
  esq:      '/esq/dashboard',
  provider: '/provider/dashboard',
  admin:    '/admin/dashboard',
}

/*
  ROLE_LABELS — display names and Tailwind colour classes per role.
  colour classes are used in places that cannot use inline CSS vars
  (e.g. static Tailwind class strings in non-shell components).
  The Sidebar now uses inline styles with CSS vars instead of these classes.

  Theme mapping:
    student  → Aurora Blue     (#0055FF)
    provider → Trust Emerald   (#10B981)
    staff    → Operational Amber (#F59E0B)
    esq      → Strategic Violet (#8B5CF6)   [data-role="esq"]
    admin    → Control Graphite (#4B5563)
*/
export const ROLE_LABELS: Record<Role, { th: string; en: string; color: string }> = {
  student:  { th: 'นักศึกษา',      en: 'Student',    color: 'bg-[#E5EDFF] text-[#0055FF] border-[#0055FF]/20' },
  staff:    { th: 'เจ้าหน้าที่',   en: 'Staff',      color: 'bg-amber-50 text-amber-700 border-amber-200' },
  esq:      { th: 'หัวหน้า ESQ',   en: 'ESQ Head',   color: 'bg-violet-50 text-violet-700 border-violet-200' },
  provider: { th: 'ผู้ให้ทุน',     en: 'Provider',   color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  admin:    { th: 'ผู้ดูแลระบบ',   en: 'Admin',      color: 'bg-[#E7EAEE] text-[#4B5563] border-[#4B5563]/20' },
}

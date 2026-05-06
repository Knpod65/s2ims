import type { NavItem, Role } from './types'

export const NAV_CONFIG: Record<Role, NavItem[]> = {
  student: [
    { label_th: 'แดชบอร์ด', label_en: 'Dashboard', href: '/student/dashboard', icon: 'LayoutDashboard' },
    { label_th: 'ทุนการศึกษา', label_en: 'Scholarships', href: '/scholarships', icon: 'BookOpen' },
    { label_th: 'ใบสมัครของฉัน', label_en: 'My Applications', href: '/student/applications', icon: 'FileText' },
    { label_th: 'โปรไฟล์', label_en: 'My Profile', href: '/student/profile', icon: 'User' },
    { label_th: 'การแจ้งเตือน', label_en: 'Notifications', href: '/student/notifications', icon: 'Bell' },
    { label_th: 'รายงานผล', label_en: 'Follow-up', href: '/student/follow-up', icon: 'ClipboardList' },
  ],
  staff: [
    { label_th: 'แดชบอร์ด', label_en: 'Dashboard', href: '/staff/dashboard', icon: 'LayoutDashboard' },
    { label_th: 'สร้างประกาศ', label_en: 'New Announcement', href: '/staff/announcements/new', icon: 'FilePlus' },
    { label_th: 'จัดการใบสมัคร', label_en: 'Applications', href: '/staff/applications', icon: 'FileText' },
    { label_th: 'คิว OCR', label_en: 'OCR Queue', href: '/staff/ocr', icon: 'ScanLine' },
    { label_th: 'วิเคราะห์', label_en: 'Analytics', href: '/staff/analytics', icon: 'BarChart3' },
    { label_th: 'ติดตามผล', label_en: 'Follow-up', href: '/staff/follow-up', icon: 'ClipboardList' },
  ],
  esq: [
    { label_th: 'แดชบอร์ด', label_en: 'Dashboard', href: '/esq/dashboard', icon: 'LayoutDashboard' },
    { label_th: 'ประวัติการอนุมัติ', label_en: 'Approval History', href: '/esq/history', icon: 'History' },
  ],
  provider: [
    { label_th: 'แดชบอร์ด', label_en: 'Dashboard', href: '/provider/dashboard', icon: 'LayoutDashboard' },
    { label_th: 'สร้างทุน', label_en: 'Create Scholarship', href: '/provider/scholarships/new', icon: 'PlusCircle' },
    { label_th: 'สถิติผู้สมัคร', label_en: 'Applicant Insights', href: '/provider/insights', icon: 'BarChart3' },
    { label_th: 'ผลลัพธ์', label_en: 'Outcomes', href: '/provider/outcomes', icon: 'TrendingUp' },
  ],
  admin: [
    { label_th: 'แดชบอร์ด', label_en: 'Dashboard', href: '/admin/dashboard', icon: 'LayoutDashboard' },
    { label_th: 'จัดการผู้ใช้', label_en: 'Users', href: '/admin/users', icon: 'Users' },
    { label_th: 'สิทธิ์การเข้าถึง', label_en: 'Permissions', href: '/admin/permissions', icon: 'Shield' },
    { label_th: 'ประวัติการใช้งาน', label_en: 'Audit Log', href: '/admin/audit-log', icon: 'ScrollText' },
    { label_th: 'ส่งออกข้อมูล', label_en: 'Export', href: '/admin/export', icon: 'Download' },
    { label_th: 'ตั้งค่าระบบ', label_en: 'Settings', href: '/admin/settings', icon: 'Settings' },
  ],
}

export const MOBILE_NAV: Record<Role, NavItem[]> = {
  student: [
    { label_th: 'หน้าหลัก', label_en: 'Home', href: '/student/dashboard', icon: 'Home' },
    { label_th: 'ทุน', label_en: 'Scholarships', href: '/scholarships', icon: 'BookOpen' },
    { label_th: 'ใบสมัคร', label_en: 'Apply', href: '/student/applications', icon: 'FileText' },
    { label_th: 'แจ้งเตือน', label_en: 'Alerts', href: '/student/notifications', icon: 'Bell' },
    { label_th: 'โปรไฟล์', label_en: 'Profile', href: '/student/profile', icon: 'User' },
  ],
  staff: NAV_CONFIG.staff.slice(0, 5),
  esq: NAV_CONFIG.esq,
  provider: NAV_CONFIG.provider.slice(0, 4),
  admin: NAV_CONFIG.admin.slice(0, 5),
}

export const ROLE_HOME: Record<Role, string> = {
  student: '/student/dashboard',
  staff: '/staff/dashboard',
  esq: '/esq/dashboard',
  provider: '/provider/dashboard',
  admin: '/admin/dashboard',
}

export const ROLE_LABELS: Record<Role, { th: string; en: string; color: string }> = {
  student: { th: 'นักศึกษา', en: 'Student', color: 'bg-status-info/15 text-blue-300 border-status-info/25' },
  staff: { th: 'เจ้าหน้าที่', en: 'Staff', color: 'bg-status-success/15 text-green-300 border-status-success/25' },
  esq: { th: 'หัวหน้า ESQ', en: 'ESQ Head', color: 'bg-status-ai/15 text-purple-300 border-status-ai/25' },
  provider: { th: 'ผู้ให้ทุน', en: 'Provider', color: 'bg-brand/15 text-brand-light border-brand/25' },
  admin: { th: 'ผู้ดูแลระบบ', en: 'Admin', color: 'bg-status-danger/15 text-red-300 border-status-danger/25' },
}

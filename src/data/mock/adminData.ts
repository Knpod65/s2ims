// ── Admin User Management ──────────────────────────────────────────
export interface AdminUser {
  id: string
  name_th: string
  name_en: string
  email: string
  role: 'student' | 'staff' | 'esq' | 'provider' | 'admin'
  displayName: string
  status: 'active' | 'inactive' | 'suspended' | 'pending_approval'
  roles: string[]  // List of assigned role IDs
  scopes: AccessScope[]
  lastLogin?: string
  createdAt: string
  createdBy: string
  riskLevel: 'low' | 'medium' | 'high'  // Based on access patterns
  suspiciousActivityCount: number
  failedLoginAttempts?: number
}

// ── Role & Permission Management ────────────────────────────────────
export interface AdminRole {
  id: string
  name_th: string
  name_en: string
  description_th: string
  description_en: string
  permissions: string[]  // Permission IDs
  isSystemRole: boolean
  createdAt: string
}

export interface AdminPermission {
  id: string
  name: string  // e.g., "users.view", "users.edit", "audit.export"
  label_th: string
  label_en: string
  category: 'users' | 'roles' | 'permissions' | 'audit' | 'security' | 'exports' | 'settings'
  riskLevel: 'low' | 'medium' | 'high'  // Sensitive actions flagged as high
}

// ── Access Scope ───────────────────────────────────────────────────
export interface AccessScope {
  id: string
  type: 'department' | 'provider' | 'scholarship' | 'global'
  value: string  // e.g., "ENGINEERING" for department, provider ID, scholarship ID, or "ALL" for global
  description_th?: string
  description_en?: string
}

// ── Role Assignment Event ──────────────────────────────────────────
export interface RoleAssignmentEvent {
  id: string
  userId: string
  previousRole?: string
  newRole: string
  assignedBy: string
  assignedAt: string
  reason: string
  auditLogId: string
}

// ── Access Request ─────────────────────────────────────────────────
export interface AccessRequest {
  id: string
  userId: string
  userName_th: string
  userName_en: string
  requestedPermission: string
  requestReason: string
  status: 'pending' | 'approved' | 'denied'
  requestedAt: string
  reviewedBy?: string
  reviewedAt?: string
  reviewReason?: string
}

// ── Sensitive Access Event (for Security Center) ────────────────────
export interface SensitiveAccessEvent {
  id: string
  eventType: 'identity_reveal' | 'manual_override' | 'disclosure_approved' | 'role_change' | 'scope_change' | 'permission_grant'
  actor: {
    id: string
    name: string
    role: string
  }
  target: {
    type: 'user' | 'student' | 'application' | 'match'
    id: string
    token?: string  // Student #S-XXXX, etc
  }
  description_th: string
  description_en: string
  reason: string
  riskLevel: 'low' | 'medium' | 'high'
  timestamp: string
  auditLogId: string
}

// ── Failed Login Event ─────────────────────────────────────────────
export interface FailedLoginEvent {
  id: string
  userId: string
  userName?: string
  email: string
  ip: string
  timestamp: string
  reason: string  // e.g., "invalid_password", "mfa_failed", "account_locked"
  riskLevel: 'low' | 'medium' | 'high'
}

// ── Export Event ───────────────────────────────────────────────────
export interface ExportEvent {
  id: string
  exportedBy: string
  exportType: 'audit_log' | 'user_list' | 'application_data' | 'student_data' | 'sensitive_access' | 'failed_logins'
  dataLevel: 'public' | 'internal' | 'restricted' | 'confidential'
  recordCount: number
  filters: Record<string, unknown>
  exportedAt: string
  ip: string
  destination?: string  // Where was it exported to (email, download, etc)
  riskLevel: 'low' | 'medium' | 'high'
  auditLogId: string
}

// ── Suspicious Activity Alert ──────────────────────────────────────
export interface SuspiciousActivityAlert {
  id: string
  alertType: 'brute_force' | 'unusual_access' | 'data_export_spike' | 'permission_escalation' | 'multiple_failed_logins' | 'suspicious_pattern'
  severity: 'low' | 'medium' | 'high'
  description_th: string
  description_en: string
  details: Record<string, unknown>
  createdAt: string
  reviewedAt?: string
  reviewedBy?: string
  status: 'open' | 'investigating' | 'reviewed' | 'escalated' | 'closed'
  recommendation_th: string
  recommendation_en: string
}

// ── Integration Health ─────────────────────────────────────────────
export interface IntegrationHealth {
  id: string
  name: string
  status: 'healthy' | 'degraded' | 'down'
  lastCheck: string
  responseTime?: number  // milliseconds
  errorCount?: number
  description_th: string
  description_en: string
}

// ═══════════════════════════════════════════════════════════════════
// MOCK DATA INSTANCES
// ═══════════════════════════════════════════════════════════════════

// Admin Permissions Matrix (25+ permissions)
export const mockAdminPermissions: AdminPermission[] = [
  // Users
  { id: 'perm_users_view', name: 'users.view', label_th: 'ดูผู้ใช้', label_en: 'View Users', category: 'users', riskLevel: 'low' },
  { id: 'perm_users_edit', name: 'users.edit', label_th: 'แก้ไขผู้ใช้', label_en: 'Edit Users', category: 'users', riskLevel: 'medium' },
  { id: 'perm_users_delete', name: 'users.delete', label_th: 'ลบผู้ใช้', label_en: 'Delete Users', category: 'users', riskLevel: 'high' },
  { id: 'perm_users_invite', name: 'users.invite', label_th: 'เชิญผู้ใช้', label_en: 'Invite Users', category: 'users', riskLevel: 'medium' },
  { id: 'perm_users_status', name: 'users.status_change', label_th: 'เปลี่ยนสถานะผู้ใช้', label_en: 'Change User Status', category: 'users', riskLevel: 'medium' },

  // Roles & Permissions
  { id: 'perm_roles_view', name: 'roles.view', label_th: 'ดูบทบาท', label_en: 'View Roles', category: 'roles', riskLevel: 'low' },
  { id: 'perm_roles_assign', name: 'roles.assign', label_th: 'มอบหมายบทบาท', label_en: 'Assign Roles', category: 'roles', riskLevel: 'high' },
  { id: 'perm_roles_create', name: 'roles.create', label_th: 'สร้างบทบาท', label_en: 'Create Roles', category: 'roles', riskLevel: 'high' },
  { id: 'perm_perms_view', name: 'permissions.view', label_th: 'ดูสิทธิ์', label_en: 'View Permissions', category: 'permissions', riskLevel: 'low' },
  { id: 'perm_perms_grant', name: 'permissions.grant', label_th: 'มอบสิทธิ์', label_en: 'Grant Permissions', category: 'permissions', riskLevel: 'high' },

  // Audit & Security
  { id: 'perm_audit_view', name: 'audit.view', label_th: 'ดูบันทึกการตรวจสอบ', label_en: 'View Audit Logs', category: 'audit', riskLevel: 'low' },
  { id: 'perm_audit_export', name: 'audit.export', label_th: 'ส่งออกบันทึก', label_en: 'Export Audit Logs', category: 'audit', riskLevel: 'medium' },
  { id: 'perm_security_view', name: 'security.view', label_th: 'ดูศูนย์ความปลอดภัย', label_en: 'View Security Center', category: 'security', riskLevel: 'low' },
  { id: 'perm_security_respond', name: 'security.respond', label_th: 'ตอบสนองต่ออ้ยาย', label_en: 'Respond to Alerts', category: 'security', riskLevel: 'high' },

  // Data & Exports
  { id: 'perm_data_export', name: 'data.export', label_th: 'ส่งออกข้อมูล', label_en: 'Export Data', category: 'exports', riskLevel: 'high' },
  { id: 'perm_data_sensitive_export', name: 'data.sensitive_export', label_th: 'ส่งออกข้อมูลที่ละเอียด', label_en: 'Export Sensitive Data', category: 'exports', riskLevel: 'high' },

  // Settings
  { id: 'perm_settings_view', name: 'settings.view', label_th: 'ดูการตั้งค่า', label_en: 'View Settings', category: 'settings', riskLevel: 'low' },
  { id: 'perm_settings_edit', name: 'settings.edit', label_th: 'แก้ไขการตั้งค่า', label_en: 'Edit Settings', category: 'settings', riskLevel: 'high' },
]

// Admin Roles
export const mockAdminRoles: AdminRole[] = [
  {
    id: 'role_admin_full',
    name_th: 'ผู้ดูแลระบบเต็มรูปแบบ',
    name_en: 'Full Admin',
    description_th: 'สิทธิ์เข้าถึงระบบทั้งหมด',
    description_en: 'Full system access',
    permissions: mockAdminPermissions.map(p => p.id),
    isSystemRole: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'role_admin_user_mgmt',
    name_th: 'ผู้จัดการผู้ใช้',
    name_en: 'User Manager',
    description_th: 'จัดการผู้ใช้และบทบาท',
    description_en: 'Manage users and roles',
    permissions: [
      'perm_users_view', 'perm_users_edit', 'perm_users_invite', 'perm_users_status',
      'perm_roles_view', 'perm_roles_assign',
      'perm_perms_view', 'perm_audit_view',
    ],
    isSystemRole: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'role_admin_security',
    name_th: 'ผู้จัดการความปลอดภัย',
    name_en: 'Security Manager',
    description_th: 'จัดการการตรวจสอบและความปลอดภัย',
    description_en: 'Manage audit and security',
    permissions: [
      'perm_audit_view', 'perm_audit_export',
      'perm_security_view', 'perm_security_respond',
      'perm_data_export',
    ],
    isSystemRole: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'role_admin_auditor',
    name_th: 'ผู้ตรวจสอบ',
    name_en: 'Auditor',
    description_th: 'ดูบันทึกการตรวจสอบเท่านั้น',
    description_en: 'View-only audit access',
    permissions: [
      'perm_audit_view', 'perm_audit_export',
    ],
    isSystemRole: true,
    createdAt: '2025-01-01T00:00:00Z',
  },
]

// Admin Users
export const mockAdminUsers: AdminUser[] = [
  {
    id: 'usr_admin_001',
    name_th: 'นายธนพล ระบบดี',
    name_en: 'Thanapol Systemgood',
    email: 'thanapol@esq.edu',
    role: 'admin',
    displayName: 'Thanapol (Admin)',
    status: 'active',
    roles: ['role_admin_full'],
    scopes: [{ id: 'scope_global', type: 'global', value: 'ALL' }],
    lastLogin: '2025-05-06T08:00:00Z',
    createdAt: '2025-01-01T00:00:00Z',
    createdBy: 'system',
    riskLevel: 'low',
    suspiciousActivityCount: 0,
  },
  {
    id: 'usr_admin_002',
    name_th: 'นางสาวศิรินา คุณบริหาร',
    name_en: 'Sirina Kumbarulan',
    email: 'sirina@esq.edu',
    role: 'admin',
    displayName: 'Sirina (User Manager)',
    status: 'active',
    roles: ['role_admin_user_mgmt'],
    scopes: [{ id: 'scope_global', type: 'global', value: 'ALL' }],
    lastLogin: '2025-05-05T14:30:00Z',
    createdAt: '2025-02-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    riskLevel: 'low',
    suspiciousActivityCount: 0,
  },
  {
    id: 'usr_admin_003',
    name_th: 'นายสมศักดิ์ ดูแลความปลอดภัย',
    name_en: 'Somsak Dulaewamsoksi',
    email: 'somsak@esq.edu',
    role: 'admin',
    displayName: 'Somsak (Security Manager)',
    status: 'active',
    roles: ['role_admin_security'],
    scopes: [{ id: 'scope_global', type: 'global', value: 'ALL' }],
    lastLogin: '2025-05-06T10:15:00Z',
    createdAt: '2025-02-15T00:00:00Z',
    createdBy: 'usr_admin_001',
    riskLevel: 'low',
    suspiciousActivityCount: 0,
  },
  {
    id: 'usr_staff_elevated',
    name_th: 'น.ส.รัตนา มะลิวัลย์',
    name_en: 'Rattana Maliwannalai',
    email: 'rattana@esq.edu',
    role: 'staff',
    displayName: 'Rattana (Elevated Staff)',
    status: 'active',
    roles: ['role_admin_auditor'],
    scopes: [{ id: 'scope_global', type: 'global', value: 'ALL' }],
    lastLogin: '2025-05-04T09:00:00Z',
    createdAt: '2025-03-01T00:00:00Z',
    createdBy: 'usr_admin_001',
    riskLevel: 'low',
    suspiciousActivityCount: 0,
  },
  {
    id: 'usr_provider_suspicious',
    name_th: 'บริษัท ท่องเที่ยวสุขใจ จำกัด',
    name_en: 'Sukjai Travel Co., Ltd.',
    email: 'admin@sukjai.co.th',
    role: 'provider',
    displayName: 'Sukjai Admin',
    status: 'active',
    roles: [],
    scopes: [{ id: 'scope_provider_001', type: 'provider', value: 'provider_sukjai' }],
    lastLogin: '2025-04-29T16:45:00Z',
    createdAt: '2025-03-10T00:00:00Z',
    createdBy: 'usr_admin_001',
    riskLevel: 'high',
    suspiciousActivityCount: 3,
    failedLoginAttempts: 5,
  },
]

// Access Requests (for permission denied scenarios)
export const mockAccessRequests: AccessRequest[] = [
  {
    id: 'ar_001',
    userId: 'usr_staff_elevated',
    userName_th: 'น.ส.รัตนา มะลิวัลย์',
    userName_en: 'Rattana Maliwannalai',
    requestedPermission: 'perm_data_sensitive_export',
    requestReason: 'Need to export sensitive student data for annual report preparation',
    status: 'pending',
    requestedAt: '2025-05-04T14:00:00Z',
  },
  {
    id: 'ar_002',
    userId: 'usr_staff_001',
    userName_th: 'น.ส.รัตนา มะลิวัลย์',
    userName_en: 'Rattana Maliwannalai',
    requestedPermission: 'perm_roles_assign',
    requestReason: 'Need to reassign roles for new team member onboarding',
    status: 'approved',
    requestedAt: '2025-05-01T10:00:00Z',
    reviewedBy: 'usr_admin_001',
    reviewedAt: '2025-05-02T09:00:00Z',
    reviewReason: 'Approved - part of standard onboarding process',
  },
  {
    id: 'ar_003',
    userId: 'usr_provider_suspicious',
    userName_th: 'บริษัท ท่องเที่ยวสุขใจ จำกัด',
    userName_en: 'Sukjai Travel Co., Ltd.',
    requestedPermission: 'perm_audit_export',
    requestReason: 'Want to see audit logs for our account',
    status: 'denied',
    requestedAt: '2025-04-28T11:00:00Z',
    reviewedBy: 'usr_admin_001',
    reviewedAt: '2025-04-28T14:00:00Z',
    reviewReason: 'Denied - providers do not have audit export access per policy',
  },
]

// Sensitive Access Events (for Security Command Center)
export const mockSensitiveAccessEvents: SensitiveAccessEvent[] = [
  {
    id: 'sae_001',
    eventType: 'identity_reveal',
    actor: { id: 'usr_staff_001', name: 'Rattana Maliwannalai', role: 'staff' },
    target: { type: 'student', id: 'std_001', token: 'Student #S-1847' },
    description_th: 'เปิดเผยข้อมูลประจำตัวของนักศึกษา',
    description_en: 'Student identity revealed',
    reason: 'Verification for scholarship award confirmation',
    riskLevel: 'high',
    timestamp: '2025-05-05T14:30:00Z',
    auditLogId: 'al_ide_001',
  },
  {
    id: 'sae_002',
    eventType: 'manual_override',
    actor: { id: 'usr_admin_001', name: 'Thanapol Systemgood', role: 'admin' },
    target: { type: 'match', id: 'match_001', token: 'Match #M-0043' },
    description_th: 'ลบล้างการจับคู่ด้วยตนเอง',
    description_en: 'Manual match override',
    reason: 'Fairness concern - low income with high match score, override to deny',
    riskLevel: 'high',
    timestamp: '2025-05-04T10:15:00Z',
    auditLogId: 'al_ovr_001',
  },
  {
    id: 'sae_003',
    eventType: 'disclosure_approved',
    actor: { id: 'usr_admin_001', name: 'Thanapol Systemgood', role: 'admin' },
    target: { type: 'student', id: 'std_002', token: 'Student #S-5421' },
    description_th: 'อนุมัติการเปิดเผยข้อมูล',
    description_en: 'Disclosure approved to provider',
    reason: 'Provider requested GPA and financial need for interview shortlisting',
    riskLevel: 'medium',
    timestamp: '2025-05-03T16:45:00Z',
    auditLogId: 'al_disc_001',
  },
  {
    id: 'sae_004',
    eventType: 'role_change',
    actor: { id: 'usr_admin_001', name: 'Thanapol Systemgood', role: 'admin' },
    target: { type: 'user', id: 'usr_admin_002', token: 'User #U-0002' },
    description_th: 'เปลี่ยนแปลงบทบาทของผู้ใช้',
    description_en: 'User role assignment changed',
    reason: 'Promoted to User Manager role for team expansion',
    riskLevel: 'high',
    timestamp: '2025-05-02T11:00:00Z',
    auditLogId: 'al_role_001',
  },
  {
    id: 'sae_005',
    eventType: 'permission_grant',
    actor: { id: 'usr_admin_001', name: 'Thanapol Systemgood', role: 'admin' },
    target: { type: 'user', id: 'usr_staff_001', token: 'User #U-0001' },
    description_th: 'มอบสิทธิ์เข้าถึงใหม่',
    description_en: 'New permission granted',
    reason: 'Staff member requires audit export access for compliance reporting',
    riskLevel: 'medium',
    timestamp: '2025-05-01T09:30:00Z',
    auditLogId: 'al_perm_001',
  },
]

// Failed Login Events (for Security Center)
export const mockFailedLoginEvents: FailedLoginEvent[] = [
  {
    id: 'fle_001',
    userId: 'usr_provider_suspicious',
    userName: 'Sukjai Travel Admin',
    email: 'admin@sukjai.co.th',
    ip: '203.154.10.25',
    timestamp: '2025-05-06T07:45:00Z',
    reason: 'invalid_password',
    riskLevel: 'low',
  },
  {
    id: 'fle_002',
    userId: 'usr_provider_suspicious',
    userName: 'Sukjai Travel Admin',
    email: 'admin@sukjai.co.th',
    ip: '203.154.10.25',
    timestamp: '2025-05-06T07:48:00Z',
    reason: 'invalid_password',
    riskLevel: 'low',
  },
  {
    id: 'fle_003',
    userId: 'usr_provider_suspicious',
    userName: 'Sukjai Travel Admin',
    email: 'admin@sukjai.co.th',
    ip: '203.154.10.26',
    timestamp: '2025-05-06T08:00:00Z',
    reason: 'mfa_failed',
    riskLevel: 'medium',
  },
  {
    id: 'fle_004',
    userId: 'unknown_user',
    email: 'attacker@malicious.com',
    ip: '192.168.1.100',
    timestamp: '2025-05-05T23:30:00Z',
    reason: 'account_locked',
    riskLevel: 'high',
  },
]

// Export Events (for Export Monitoring)
export const mockExportEvents: ExportEvent[] = [
  {
    id: 'exp_001',
    exportedBy: 'usr_admin_001',
    exportType: 'audit_log',
    dataLevel: 'internal',
    recordCount: 1250,
    filters: { dateRange: '2025-04-01_to_2025-05-06', action: 'all' },
    exportedAt: '2025-05-06T08:00:00Z',
    ip: '10.0.1.2',
    destination: 'downloaded',
    riskLevel: 'medium',
    auditLogId: 'al_exp_001',
  },
  {
    id: 'exp_002',
    exportedBy: 'usr_admin_003',
    exportType: 'sensitive_access',
    dataLevel: 'confidential',
    recordCount: 47,
    filters: { dateRange: '2025-05-01_to_2025-05-06', eventType: 'identity_reveal' },
    exportedAt: '2025-05-04T14:00:00Z',
    ip: '10.0.1.5',
    destination: 'email',
    riskLevel: 'high',
    auditLogId: 'al_exp_002',
  },
  {
    id: 'exp_003',
    exportedBy: 'usr_staff_elevated',
    exportType: 'failed_logins',
    dataLevel: 'internal',
    recordCount: 23,
    filters: { dateRange: '2025-05-01_to_2025-05-06' },
    exportedAt: '2025-05-03T16:00:00Z',
    ip: '10.0.1.8',
    destination: 'downloaded',
    riskLevel: 'medium',
    auditLogId: 'al_exp_003',
  },
]

// Suspicious Activity Alerts (for Alerts Section)
export const mockSuspiciousActivityAlerts: SuspiciousActivityAlert[] = [
  {
    id: 'alert_001',
    alertType: 'multiple_failed_logins',
    severity: 'high',
    description_th: 'หลายครั้งความพยายามเข้าสู่ระบบล้มเหลว',
    description_en: 'Multiple failed login attempts detected',
    details: {
      userId: 'usr_provider_suspicious',
      email: 'admin@sukjai.co.th',
      attemptCount: 5,
      timeWindow: '1_hour',
      ips: ['203.154.10.25', '203.154.10.26'],
    },
    createdAt: '2025-05-06T08:15:00Z',
    status: 'open',
    recommendation_th: 'ล็อกบัญชีและส่งการแจ้งเตือนความปลอดภัย',
    recommendation_en: 'Lock account and send security alert',
  },
  {
    id: 'alert_002',
    alertType: 'brute_force',
    severity: 'high',
    description_th: 'ตรวจพบการโจมตีบังคับกำลัง',
    description_en: 'Brute force attack detected',
    details: {
      ip: '192.168.1.100',
      targetEmail: 'attacker@malicious.com',
      attemptCount: 12,
      timeWindow: '30_minutes',
    },
    createdAt: '2025-05-06T00:15:00Z',
    reviewedAt: '2025-05-06T01:00:00Z',
    reviewedBy: 'usr_admin_003',
    status: 'escalated',
    recommendation_th: 'บล็อก IP และปิดการใช้งานบัญชี',
    recommendation_en: 'Block IP and disable account',
  },
  {
    id: 'alert_003',
    alertType: 'unusual_access',
    severity: 'medium',
    description_th: 'การเข้าถึงที่ผิดปกติตรวจพบ',
    description_en: 'Unusual access pattern detected',
    details: {
      userId: 'usr_staff_elevated',
      action: 'data_sensitive_export',
      time: '2025-05-05_02:45:00',
      typicalAccessTime: 'business_hours',
    },
    createdAt: '2025-05-05T03:00:00Z',
    status: 'investigating',
    recommendation_th: 'ติดต่อผู้ใช้เพื่อยืนยัน',
    recommendation_en: 'Contact user for confirmation',
  },
  {
    id: 'alert_004',
    alertType: 'data_export_spike',
    severity: 'medium',
    description_th: 'การเพิ่มขึ้นกระหน่ำในการส่งออกข้อมูล',
    description_en: 'Data export spike detected',
    details: {
      normalExportCount: '2-3_per_week',
      currentExportCount: '7',
      timeWindow: '1_day',
      user: 'usr_admin_003',
    },
    createdAt: '2025-05-04T16:30:00Z',
    reviewedAt: '2025-05-04T17:00:00Z',
    reviewedBy: 'usr_admin_001',
    status: 'reviewed',
    recommendation_th: 'ตรวจสอบการส่งออก - อาจเป็นงานตามปกติ',
    recommendation_en: 'Review exports - may be routine work',
  },
]

// Integration Health (for Dashboard)
export const mockIntegrationHealth: IntegrationHealth[] = [
  {
    id: 'int_001',
    name: 'Authentication Service',
    status: 'healthy',
    lastCheck: '2025-05-06T08:30:00Z',
    responseTime: 145,
    description_th: 'บริการตรวจสอบสิทธิ์',
    description_en: 'Authentication Service',
  },
  {
    id: 'int_002',
    name: 'Database Connection',
    status: 'healthy',
    lastCheck: '2025-05-06T08:29:00Z',
    responseTime: 23,
    description_th: 'การเชื่อมต่อฐานข้อมูล',
    description_en: 'Database Connection',
  },
  {
    id: 'int_003',
    name: 'Email Service',
    status: 'degraded',
    lastCheck: '2025-05-06T08:15:00Z',
    responseTime: 3200,
    errorCount: 2,
    description_th: 'บริการอีเมล',
    description_en: 'Email Service',
  },
  {
    id: 'int_004',
    name: 'File Storage',
    status: 'healthy',
    lastCheck: '2025-05-06T08:28:00Z',
    responseTime: 78,
    description_th: 'ที่เก็บไฟล์',
    description_en: 'File Storage',
  },
]

// Role Assignment History (for audit trail)
export const mockRoleAssignmentHistory: RoleAssignmentEvent[] = [
  {
    id: 'rae_001',
    userId: 'usr_admin_002',
    previousRole: 'staff',
    newRole: 'role_admin_user_mgmt',
    assignedBy: 'usr_admin_001',
    assignedAt: '2025-02-01T10:00:00Z',
    reason: 'Promotion to User Manager - team expansion',
    auditLogId: 'al_role_001',
  },
  {
    id: 'rae_002',
    userId: 'usr_staff_elevated',
    previousRole: undefined,
    newRole: 'role_admin_auditor',
    assignedBy: 'usr_admin_001',
    assignedAt: '2025-03-01T14:00:00Z',
    reason: 'Added auditor role for compliance reporting',
    auditLogId: 'al_role_002',
  },
]

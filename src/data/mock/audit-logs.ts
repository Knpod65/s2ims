import type { AuditLog } from '../../lib/types'

export const mockAuditLogs: AuditLog[] = [
  { id: 'al1', actor_id: 'usr_esq_001', actor_name: 'รศ.ดร.สมชาย วิทยา', actor_role: 'esq', action: 'announcement.approved', entity_type: 'Announcement', entity_id: 'ann_002', ip: '10.0.1.5', created_at: '2025-04-08T11:30:00Z' },
  { id: 'al2', actor_id: 'usr_staff_001', actor_name: 'น.ส.รัตนา มะลิวัลย์', actor_role: 'staff', action: 'announcement.submitted', entity_type: 'Announcement', entity_id: 'ann_001', ip: '10.0.1.8', created_at: '2025-04-10T09:15:00Z' },
  { id: 'al3', actor_id: 'usr_staff_001', actor_name: 'น.ส.รัตนา มะลิวัลย์', actor_role: 'staff', action: 'application.status_updated', entity_type: 'Application', entity_id: 'app_001', before: { status: 'SUBMITTED' }, after: { status: 'SHORTLISTED' }, ip: '10.0.1.8', created_at: '2025-04-18T14:00:00Z' },
  { id: 'al4', actor_id: 'usr_staff_001', actor_name: 'น.ส.รัตนา มะลิวัลย์', actor_role: 'staff', action: 'ocr.confirmed', entity_type: 'OcrJob', entity_id: 'ocr_001', ip: '10.0.1.8', created_at: '2025-04-20T10:30:00Z' },
  { id: 'al5', actor_id: 'usr_admin_001', actor_name: 'นายธนพล ระบบดี', actor_role: 'admin', action: 'user.role_changed', entity_type: 'User', entity_id: 'usr_staff_001', before: { role: 'staff' }, after: { role: 'staff' }, ip: '10.0.1.2', created_at: '2025-04-25T16:00:00Z' },
  { id: 'al6', actor_id: 'usr_student_001', actor_name: 'นายพิชญ์ ใจดี', actor_role: 'student', action: 'application.submitted', entity_type: 'Application', entity_id: 'app_002', ip: '10.0.2.100', created_at: '2025-04-15T20:00:00Z' },
]

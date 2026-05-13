import type { AuditLog } from '@/lib/types'
import { buildAuditEvent } from './auditEventBuilder'
import type { AuditEvent } from './auditTypes'

export type AuditRecordSource = 'fixture' | 'writer'

// Unified display row — normalizes both AuditLog fixture records and AuditEvent writer events
export interface AdminAuditDisplayRow {
  id: string
  source: AuditRecordSource
  actorName: string
  actorId: string
  actorRole: string
  action: string
  entityType: string
  entityId: string
  createdAt: string
  persistenceMode: 'mock_only' | 'prototype_only' | 'real_persisted'
  // Extended fields — present for writer events
  eventType?: string
  severity?: string
  reason?: string | null
  reasonRequired?: boolean
  targetDisplayToken?: string
  targetPrivacyLevel?: string
  metadata?: Record<string, unknown>
  sourceRoute?: string
  policyVersion?: string
  // Legacy fields — present for fixture events
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  ip?: string
}

function fixtureToRow(log: AuditLog): AdminAuditDisplayRow {
  return {
    id: log.id,
    source: 'fixture',
    actorName: log.actor_name,
    actorId: log.actor_id,
    actorRole: log.actor_role,
    action: log.action,
    entityType: log.entity_type,
    entityId: log.entity_id,
    createdAt: log.created_at,
    persistenceMode: 'mock_only',
    before: log.before,
    after: log.after,
    ip: log.ip,
  }
}

function writerEventToRow(event: AuditEvent): AdminAuditDisplayRow {
  return {
    id: event.id,
    source: 'writer',
    actorName: event.actorDisplayName,
    actorId: event.actorId,
    actorRole: event.actorRole,
    action: event.eventType,
    entityType: event.targetType,
    entityId: event.targetId,
    createdAt: event.createdAt,
    persistenceMode: event.persistenceMode,
    eventType: event.eventType,
    severity: event.severity,
    reason: event.reason,
    reasonRequired: event.reasonRequired,
    targetDisplayToken: event.targetDisplayToken,
    targetPrivacyLevel: event.targetPrivacyLevel,
    metadata: event.metadata as Record<string, unknown>,
    sourceRoute: event.sourceRoute,
    policyVersion: event.policyVersion,
  }
}

// Static demo writer events — module-level, mock_only, never persisted.
// These are generated once at module load to illustrate what the mock writer produces.
// They do NOT come from real Staff actions. No runtime writes occur.
const DEMO_WRITER_EVENTS: AuditEvent[] = (() => {
  try {
    return [
      buildAuditEvent({
        id: 'demo_writer_ev_001',
        eventType: 'staff.document.verify',
        actorId: 'staff_demo_001',
        actorRole: 'staff',
        actorDisplayName: 'น.ส.รัตนา มะลิวัลย์ (Demo)',
        targetType: 'document',
        targetId: 'doc_demo_001',
        targetDisplayToken: 'Student #S-2345',
        targetPrivacyLevel: 'internal',
        reasonRequired: false,
        metadata: {
          documentId: 'doc_demo_001',
          applicationId: 'app_002',
          studentToken: 'Student #S-2345',
          nextStatus: 'verified',
        },
        sourceRoute: '/staff/applications/app_002',
        createdAt: '2026-05-10T09:00:00Z',
        severity: 'low',
        persistenceMode: 'mock_only',
      }),
      buildAuditEvent({
        id: 'demo_writer_ev_002',
        eventType: 'staff.document.reject',
        actorId: 'staff_demo_001',
        actorRole: 'staff',
        actorDisplayName: 'น.ส.รัตนา มะลิวัลย์ (Demo)',
        targetType: 'document',
        targetId: 'doc_demo_002',
        targetDisplayToken: 'Student #S-2345',
        targetPrivacyLevel: 'internal',
        reason: 'Document is missing required pages.',
        reasonRequired: true,
        reasonMinLength: 1,
        metadata: {
          documentId: 'doc_demo_002',
          applicationId: 'app_002',
          studentToken: 'Student #S-2345',
          nextStatus: 'rejected',
        },
        sourceRoute: '/staff/applications/app_002',
        createdAt: '2026-05-10T10:30:00Z',
        severity: 'medium',
        persistenceMode: 'mock_only',
      }),
      buildAuditEvent({
        id: 'demo_writer_ev_003',
        eventType: 'admin.role.assign',
        actorId: 'admin_demo_001',
        actorRole: 'admin',
        actorDisplayName: 'นายธนพล ระบบดี (Demo)',
        targetType: 'role_assignment',
        targetId: 'usr_staff_002',
        targetDisplayToken: 'Staff #ST-0002',
        targetPrivacyLevel: 'internal',
        reason: 'New staff onboarding — scholarship review team.',
        reasonRequired: true,
        reasonMinLength: 1,
        metadata: { roleBefore: 'none', roleAfter: 'staff' },
        sourceRoute: '/admin/users',
        createdAt: '2026-05-11T08:00:00Z',
        severity: 'critical',
        persistenceMode: 'mock_only',
      }),
    ]
  } catch {
    return []
  }
})()

// Returns combined fixture + writer demo rows sorted by createdAt descending.
// Pure function — does not write to any store or mutate any source.
export function getAdminAuditDisplayRows(fixtureLogs: AuditLog[]): AdminAuditDisplayRow[] {
  const fixtureRows = fixtureLogs.map(fixtureToRow)
  const writerRows = DEMO_WRITER_EVENTS.map(writerEventToRow)
  const combined = [...fixtureRows, ...writerRows]
  combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return combined
}

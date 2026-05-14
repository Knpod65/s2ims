import type { AuditLog } from '@/lib/types'
import { AuditDisplayPresenter } from './presenters/auditDisplayPresenter'
import type { AuditEvent, AuditEventType, AuditActorRole, AuditTargetType } from './auditTypes'
import type { AuditDisplayRow, AdminAuditDisplayRow } from './contracts/auditContracts'
import { sharedMockAuditWriter } from './sharedMockWriter'
import { buildAuditEvent } from './auditEventBuilder'

// ---------------------------------------------------------------------------
// Source: AuditDisplayPresenter — AP-8C Refactor
// ---------------------------------------------------------------------------
// The presenter is now the single display-formatting boundary.
// This adapter composes raw data into AuditEvents, then delegates to
// the presenter for all label formatting, persistence labels, source
// labels, and drawer-ready detail fields.
// ---------------------------------------------------------------------------

// Shared presenter instance (en: admin view; locale overridden per-request)
const presenter = new AuditDisplayPresenter('en', 'admin')

/** Append source info to a presenter-produced row. */
function withSource(row: AuditDisplayRow, source: 'fixture' | 'writer'): AdminAuditDisplayRow {
  return { ...row, source }
}

/** Convert a fixture AuditLog into a presentable AuditDisplayRow via the presenter. */
function fixtureToRow(log: AuditLog): AdminAuditDisplayRow {
  const event: AuditEvent & { before?: AuditDisplayRow['before']; after?: AuditDisplayRow['after']; ip?: string } = {
    id: log.id,
    eventType: log.action as AuditEventType,
    actionKey: null,
    actorId: log.actor_id,
    actorRole: log.actor_role as AuditActorRole,
    actorDisplayName: log.actor_name,
    targetType: log.entity_type as AuditTargetType,
    targetId: log.entity_id,
    targetDisplayToken: `${log.actor_role} #${log.actor_id}`,
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '',
    createdAt: log.created_at,
    severity: 'info' as AuditEvent['severity'],
    policyVersion: '',
    persistenceMode: 'mock_only' as AuditEvent['persistenceMode'],
    before: log.before as AuditDisplayRow['before'],
    after: log.after as AuditDisplayRow['after'],
    ip: log.ip,
  }

  return withSource(presenter.present(event) as AuditDisplayRow, 'fixture')
}

/** Convert a writer AuditEvent into a presentable AuditDisplayRow via the presenter. */
function writerEventToRow(event: AuditEvent): AdminAuditDisplayRow {
  return withSource(presenter.present(event) as AuditDisplayRow, 'writer')
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
        createdAt: '2026-05-10T09:00:00.000Z',
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
        createdAt: '2026-05-10T10:30:00.000Z',
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
        createdAt: '2026-05-11T08:00:00.000Z',
        severity: 'critical',
        persistenceMode: 'mock_only',
      }),
    ]
  } catch {
    return []
  }
})()

/**
 * Returns combined fixture + static demo + live shared writer rows
 * sorted by createdAt descending.
 * Presenter handles all display label formatting — this function only
 * composes raw data and delegates to the presenter.
 */
export function getAdminAuditDisplayRows(fixtureLogs: AuditLog[]): AdminAuditDisplayRow[] {
  const fixtureRows = fixtureLogs.map(fixtureToRow)
  const demoRows = DEMO_WRITER_EVENTS.map(writerEventToRow)
  const liveRows = sharedMockAuditWriter.list().map(writerEventToRow)
  const combined = [...fixtureRows, ...demoRows, ...liveRows]
  combined.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  return combined
}
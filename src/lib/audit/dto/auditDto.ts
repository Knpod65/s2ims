// ---------------------------------------------------------------------------
// Audit DTOs — AP-8A Runtime Skeleton
// ---------------------------------------------------------------------------
// Lightweight serialisable data-transfer objects for the audit layer.
//
// These formalise the shapes that travel between UI → Service → Repository.
// They complement (and reference) the types already in auditTypes.ts.
//
// Laravel/PHP equivalents:
//   AuditEventData     → App\Data\Audit\AuditEventData
//   AuditActorData     → App\Data\Audit\AuditActorData
//   AuditTargetData    → App\Data\Audit\AuditTargetData
//   AuditWriteResult    → App\Data\Audit\AuditWriteResult
// ---------------------------------------------------------------------------

import type {
  AuditEvent,
  AuditEventType,
  AuditActorRole,
  AuditTargetType,
  AuditPrivacyLevel,
  AuditSeverity,
  AuditPersistenceMode,
  AuditMetadata,
} from '../auditTypes'

// ---------------------------------------------------------------------------
// Context DTOs
// ---------------------------------------------------------------------------

/** DTO for who/what performed the action. */
export type AuditActorContextDto = {
  id: string
  role: AuditActorRole
  name?: string
  token: string // e.g. "ST-456", "PR-789", "SYS-001"
}

/** DTO for what the action targeted. */
export type AuditTargetContextDto = {
  id: string
  type: AuditTargetType
  name?: string
  token: string // e.g. "S-123", "DOC-456"
  privacyLevel: AuditPrivacyLevel
}

/** DTO for the action itself. */
export type AuditActionContextDto = {
  type: string // e.g. 'STAFF_DOCUMENT_REJECT'
  label: string // e.g. 'Rejected document'
  subType?: string
}

/** DTO for optional reason context. */
export type AuditReasonContextDto = {
  reason?: string
  reasonId?: string
}

// ---------------------------------------------------------------------------
// Event creation DTO
// ---------------------------------------------------------------------------

/** The full input shape for creating an audit event. */
export type AuditEventInputDto = {
  action: AuditActionContextDto
  actor: AuditActorContextDto
  target: AuditTargetContextDto
  reason?: AuditReasonContextDto
  metadata: AuditMetadata
}

// ---------------------------------------------------------------------------
// Output DTOs
// ---------------------------------------------------------------------------

/** Result returned by writer after a persist attempt. */
export type AuditWriteResultDto = {
  success: boolean
  eventId?: string // populated on success
  error?: string // populated on failure
}

/** Paginated envelope for list results. */
export type AuditPaginatedResultDto<T> = {
  data: T[]
  total: number
  page: number
  perPage: number
  hasMore: boolean
}

/** Filter parameters for listing audit events. */
export type AuditListFiltersDto = {
  eventType?: AuditEventType | AuditEventType[]
  actorRole?: AuditActorRole | AuditActorRole[]
  actorId?: string | string[]
  targetType?: AuditTargetType | AuditTargetType[]
  targetId?: string | string[]
  persistenceMode?: AuditPersistenceMode | AuditPersistenceMode[]
  sourceRoute?: string | string[]
  severity?: AuditSeverity | AuditSeverity[]
  createdAtStart?: string // ISO 8601
  createdAtEnd?: string // ISO 8601
  hasReason?: boolean
  privacyLevel?: AuditPrivacyLevel | AuditPrivacyLevel[]
}

/** Pagination parameters. */
export type AuditPaginationInputDto = {
  page: number // 1-indexed
  perPage: number
  cursor?: string // for cursor-based pagination
  sort?: string
  direction?: 'asc' | 'desc'
}

// ---------------------------------------------------------------------------
// Persistence context
// ---------------------------------------------------------------------------

export type AuditPersistenceContextDto = {
  mode: AuditPersistenceMode
  stageLabel: string // e.g. 'Mock/Demo', 'Official', 'Prototype'
  isReal: boolean
}

// ---------------------------------------------------------------------------
// Display output DTO
// ---------------------------------------------------------------------------

/** The shape the presenter produces for the Admin table / drawer / CSV. */
export type AuditDisplayRowDto = {
  id: string
  createdAt: string // ISO
  actorLabel: string
  actorRoleLabel: string
  actionLabel: string
  targetLabel: string
  sourceLabel: string
  persistenceLabel: string
  severityLabel?: string
  routeHref?: string
  canOpenDetail: boolean
  copyStage: AuditPersistenceMode
}

/** Minimal shape for CSV export rows. */
export type AuditCsvRowDto = {
  id: string
  createdAt: string
  actor: string
  actorRole: string
  action: string
  target: string
  source: string
  persistence: string
  severity: string
  reason?: string
}
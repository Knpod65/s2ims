// ---------------------------------------------------------------------------
// Audit Contracts — AP-8A Runtime Skeleton (updated for AP-8C)
// ---------------------------------------------------------------------------
// Documentation-only interfaces that formalise the audit service, repository,
// policy, presenter, and copy-stage boundaries defined in AP-7 and AP-8.
//
// No storage, no UI, no side-effects — pure TypeScript contracts.
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
  AuditActorInput,
  AuditTargetInput,
  BuildAuditEventInput,
  StaffDocumentAuditInput,
} from '../auditTypes'
import type { AuditCopyStage } from '../copy/auditCopyStage'

// ---------------------------------------------------------------------------
// Output DTOs (defined before presenter contracts that reference them)
// ---------------------------------------------------------------------------

export interface AuditWriteResult {
  success: boolean
  eventId?: string
  error?: string
}

export interface AuditDisplayRow {
  id: string
  createdAt: string
  formattedTime: string
  actorId: string
  actorRole: AuditActorRole
  actorLabel: string
  actorRoleLabel: string
  actionLabel: string
  targetLabel: string
  sourceLabel: string
  sourceType: 'fixture' | 'writer'
  persistenceLabel: string
  severityLabel?: string
  canOpenDetail: boolean
  copyStage: AuditCopyStage

  // Drawer detail fields (presenter-populated)
  eventType?: string
  actionKey?: string | null
  reason?: string | null
  reasonRequired?: boolean
  targetDisplayToken?: string
  targetPrivacyLevel?: string
  targetType?: AuditTargetType
  targetId?: string
  sourceRoute?: string
  policyVersion?: string
  metadata?: Record<string, unknown>

  // Legacy fixture-only fields
  before?: Record<string, unknown>
  after?: Record<string, unknown>
  ip?: string
}

/** AuditDisplayRow with an explicit source discriminator for the admin table. */
export interface AdminAuditDisplayRow extends AuditDisplayRow {
  source: 'fixture' | 'writer'
}

export interface CsvAuditRow {
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

// ---------------------------------------------------------------------------
// AuditEventFactoryContract
// ---------------------------------------------------------------------------

export interface AuditEventFactoryContract {
  /**
   * Build a complete AuditEvent from validated contexts and input.
   * Does not persist. Pure construction + validation.
   */
  create(input: BuildAuditEventInput): AuditEvent

  /** Build a staff document verification event. */
  buildStaffDocumentVerifyEvent(input: StaffDocumentAuditInput): AuditEvent

  /** Build a staff document rejection event. */
  buildStaffDocumentRejectEvent(input: StaffDocumentAuditInput): AuditEvent

  /** Build a staff document replacement request event. */
  buildStaffDocumentReplacementRequestEvent(input: StaffDocumentAuditInput): AuditEvent
}

// ---------------------------------------------------------------------------
// AuditWriterContract
// ---------------------------------------------------------------------------

export interface AuditWriterContract {
  /** Write a single audit event. Returns the written event. */
  write(event: AuditEvent): Promise<AuditEvent>

  /** Write multiple events. */
  writeMany(events: AuditEvent[]): Promise<AuditEvent[]>

  /** List events matching an optional filter. */
  list(filter?: AuditWriterFilter): Promise<AuditEvent[]>

  /** Find one event by ID. */
  getById(id: string): Promise<AuditEvent | undefined>

  /** Count events matching an optional filter. */
  count(filter?: AuditWriterFilter): Promise<number>

  /** Clear all stored events (test/mock utility). */
  clear?(): Promise<void>

  /** Seed with pre-built events (test/mock utility). */
  seed?(events: AuditEvent[]): Promise<void>

  /** Return a snapshot copy (test/mock utility). */
  snapshot?(): Promise<{ events: AuditEvent[]; count: number }>
}

export interface AuditWriterFilter {
  eventType?: AuditEventType | AuditEventType[]
  actorRole?: AuditActorRole | AuditActorRole[]
  targetType?: AuditTargetType | AuditTargetType[]
  targetPrivacyLevel?: AuditPrivacyLevel | AuditPrivacyLevel[]
  severity?: AuditSeverity | AuditSeverity[]
  sourceRoute?: string | string[]
  persistenceMode?: AuditPersistenceMode | AuditPersistenceMode[]
}

// ---------------------------------------------------------------------------
// AuditRepositoryContract
// ---------------------------------------------------------------------------

export interface AuditRepositoryContract {
  /** Append a single event. */
  append(event: AuditEvent): Promise<void>

  /** Append multiple events. */
  appendMany(events: AuditEvent[]): Promise<void>

  /** Find by ID. */
  findById(id: string): Promise<AuditEvent | undefined>

  /** List with optional filters. */
  list(filters?: AuditRepositoryFilters): Promise<AuditEvent[]>

  /** Count with optional filters. */
  count(filters?: AuditRepositoryFilters): Promise<number>

  /** Clear mock-only events (optional, for tests). */
  clearMockOnly?(): Promise<void>
}

export interface AuditRepositoryFilters {
  eventType?: AuditEventType | AuditEventType[]
  actorRole?: AuditActorRole | AuditActorRole[]
  actorId?: string | string[]
  targetType?: AuditTargetType | AuditTargetType[]
  targetId?: string | string[]
  persistenceMode?: AuditPersistenceMode | AuditPersistenceMode[]
  sourceRoute?: string | string[]
  severity?: AuditSeverity | AuditSeverity[]
  createdAtStart?: string // ISO
  createdAtEnd?: string // ISO
  hasReason?: boolean
  privacyLevel?: AuditPrivacyLevel | AuditPrivacyLevel[]
  // Pagination (future)
  page?: number
  perPage?: number
  sort?: string
  direction?: 'asc' | 'desc'
}

// ---------------------------------------------------------------------------
// AuditPolicyGuardContract
// ---------------------------------------------------------------------------

export interface AuditPolicyGuardContract {
  /** Does this action require an audit event? */
  requiresAudit(
    actionContext: AuditActionContext,
    actorContext: AuditActorContext,
    targetContext: AuditTargetContext
  ): boolean

  /** Which metadata keys are allowed for this action? */
  allowedMetadataKeys(actionContext: AuditActionContext): string[]

  /** What privacy level applies to this target? */
  getTargetPrivacyLevel(targetContext: AuditTargetContext): AuditPrivacyLevel
}

// ---------------------------------------------------------------------------
// AuditMetadataSanitizerContract
// ---------------------------------------------------------------------------

export interface AuditMetadataSanitizerContract {
  /**
   * Validate and optionally sanitize a metadata key-value pair.
   * Returns a safe value (tokenized, masked, or placeholder).
   */
  sanitize(key: string, value: unknown): string

  /** Is this key allowed to be stored at all? */
  isAllowedKey(key: string): boolean
}

// ---------------------------------------------------------------------------
// AuditDisplayPresenterContract
// ---------------------------------------------------------------------------

export interface AuditDisplayPresenterContract {
  /** Convert a stored event into a UI-ready display row. */
  present(event: AuditEvent, options?: DisplayOptions): AuditDisplayRow

  /** Batch convert. */
  presentMany(events: AuditEvent[], options?: DisplayOptions): AuditDisplayRow[]

  /** Convert to CSV-friendly row. */
  toCsvRow(event: AuditEvent, options?: DisplayOptions): CsvAuditRow
}

export interface DisplayOptions {
  locale?: 'en' | 'th'
  includeSensitive?: boolean // admin-only override
}

// ---------------------------------------------------------------------------
// AuditCopyStageResolverContract
// ---------------------------------------------------------------------------

export interface AuditCopyStageResolverContract {
  /** Determine the copy stage for a given event. */
  getCopyStage(event: AuditEvent): AuditCopyStage

  /** Return the human-readable label for a copy stage. */
  getCopyLabel(stage: AuditCopyStage, locale?: 'en' | 'th'): string
}

// ---------------------------------------------------------------------------
// AuditServiceContract
// ---------------------------------------------------------------------------

export interface AuditServiceContract {
  // Workflow-specific write methods
  recordStaffDocumentRejection(input: StaffDocumentRejectionInput): Promise<AuditWriteResult>
  recordStaffDocumentReplacementRequest(input: StaffDocumentReplacementRequestInput): Promise<AuditWriteResult>
  recordStaffDocumentVerification(input: StaffDocumentVerificationInput): Promise<AuditWriteResult>
  recordDisclosureApproval(input: DisclosureApprovalInput): Promise<AuditWriteResult>
  recordMatchOverride(input: MatchOverrideInput): Promise<AuditWriteResult>
  recordExportGenerated(input: ExportGeneratedInput): Promise<AuditWriteResult>

  // Read methods
  listForAdmin(filters?: AdminAuditFilters): Promise<AuditDisplayRow[]>
  listForActor(actorId: string, filters?: ActorAuditFilters): Promise<AuditDisplayRow[]>
  listForTarget(targetType: string, targetId: string, filters?: TargetAuditFilters): Promise<AuditDisplayRow[]>
}

// ---------------------------------------------------------------------------
// Shared context DTOs (used by contracts above)
// ---------------------------------------------------------------------------

export interface AuditActionContext {
  type: string
  label: string
  subType?: string
}

export interface AuditActorContext {
  id: string
  role: AuditActorRole
  name?: string
  token: string
}

export interface AuditTargetContext {
  id: string
  type: AuditTargetType
  name?: string
  token: string
  privacyLevel: AuditPrivacyLevel
}

export interface AuditReasonContext {
  reason?: string
  reasonId?: string
}

// ---------------------------------------------------------------------------
// Input DTOs for service methods
// ---------------------------------------------------------------------------

export interface StaffDocumentRejectionInput {
  actorId: string
  actorRole: AuditActorRole
  actorDisplayName: string
  documentId: string
  applicationId: string
  studentToken: string
  sourceRoute: string
  reason: string
  id?: string
  createdAt?: string
  metadata?: AuditMetadata
}

export interface StaffDocumentReplacementRequestInput extends StaffDocumentRejectionInput {}

export interface StaffDocumentVerificationInput {
  actorId: string
  actorRole: AuditActorRole
  actorDisplayName: string
  documentId: string
  applicationId: string
  studentToken: string
  sourceRoute: string
  id?: string
  createdAt?: string
  metadata?: AuditMetadata
}

export interface DisclosureApprovalInput {
  actorId: string
  actorRole: AuditActorRole
  actorDisplayName: string
  targetType: AuditTargetType
  targetId: string
  targetDisplayToken: string
  sourceRoute: string
  reason?: string
  id?: string
  createdAt?: string
  metadata?: AuditMetadata
}

export interface MatchOverrideInput {
  actorId: string
  actorRole: AuditActorRole
  actorDisplayName: string
  targetType: AuditTargetType
  targetId: string
  targetDisplayToken: string
  sourceRoute: string
  reason: string
  id?: string
  createdAt?: string
  metadata?: AuditMetadata
}

export interface ExportGeneratedInput {
  actorId: string
  actorRole: AuditActorRole
  actorDisplayName: string
  exportType: string
  rowCount: number
  sourceRoute: string
  id?: string
  createdAt?: string
  metadata?: AuditMetadata
}

// ---------------------------------------------------------------------------
// Filter DTOs for read methods
// ---------------------------------------------------------------------------

export interface AdminAuditFilters extends AuditRepositoryFilters {}

export interface ActorAuditFilters {
  eventType?: AuditEventType | AuditEventType[]
  targetType?: AuditTargetType | AuditTargetType[]
  persistenceMode?: AuditPersistenceMode | AuditPersistenceMode[]
  createdAtStart?: string
  createdAtEnd?: string
}

export interface TargetAuditFilters {
  eventType?: AuditEventType | AuditEventType[]
  actorRole?: AuditActorRole | AuditActorRole[]
  persistenceMode?: AuditPersistenceMode | AuditPersistenceMode[]
  createdAtStart?: string
  createdAtEnd?: string
}
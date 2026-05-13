// ---------------------------------------------------------------------------
// Audit Service — AP-8A Runtime Skeleton
// ---------------------------------------------------------------------------
// Minimal orchestration layer: validates via policy, builds via factory,
// writes via writer, returns results. Does NOT wire into any UI.
//
// This is a skeleton — it is NOT instantiated by any page component yet.
// Current AP-6D sharedMockWriter usage remains untouched.
//
// Laravel/PHP equivalent: App\Services\Audit\AuditService
// ---------------------------------------------------------------------------

import type { AuditEvent, AuditPrivacyLevel } from '../auditTypes'
import type { AuditWriterFilter } from '../contracts/auditContracts'
import type {
  AuditServiceContract,
  AuditWriteResult,
  StaffDocumentRejectionInput,
  StaffDocumentReplacementRequestInput,
  StaffDocumentVerificationInput,
  DisclosureApprovalInput,
  MatchOverrideInput,
  ExportGeneratedInput,
  AdminAuditFilters,
  ActorAuditFilters,
  TargetAuditFilters,
  AuditDisplayRow,
  AuditWriterContract,
  AuditEventFactoryContract,
  AuditPolicyGuardContract,
  AuditDisplayPresenterContract,
} from '../contracts/auditContracts'
import { buildAuditEvent, buildStaffDocumentRejectEvent, buildStaffDocumentReplacementRequestEvent } from '../auditEventBuilder'

// ---------------------------------------------------------------------------
// Minimal AuditService implementation (skeleton)
// ---------------------------------------------------------------------------

export class AuditService implements AuditServiceContract {
  constructor(
    private readonly writer: AuditWriterContract,
    private readonly factory: AuditEventFactoryContract,
    private readonly policy: AuditPolicyGuardContract,
    private readonly presenter: AuditDisplayPresenterContract,
  ) {}

  // ---------------------------------------------------------------------------
  // Write methods
  // ---------------------------------------------------------------------------

  async recordStaffDocumentRejection(input: StaffDocumentRejectionInput): Promise<AuditWriteResult> {
    return this.recordWithPolicyCheck(
      buildStaffDocumentRejectEvent({
        actorId: input.actorId,
        actorRole: input.actorRole,
        actorDisplayName: input.actorDisplayName,
        documentId: input.documentId,
        applicationId: input.applicationId,
        studentToken: input.studentToken,
        sourceRoute: input.sourceRoute,
        reason: input.reason,
        id: input.id,
        createdAt: input.createdAt,
        metadata: input.metadata,
      }),
    )
  }

  async recordStaffDocumentReplacementRequest(input: StaffDocumentReplacementRequestInput): Promise<AuditWriteResult> {
    return this.recordWithPolicyCheck(
      buildStaffDocumentReplacementRequestEvent({
        actorId: input.actorId,
        actorRole: input.actorRole,
        actorDisplayName: input.actorDisplayName,
        documentId: input.documentId,
        applicationId: input.applicationId,
        studentToken: input.studentToken,
        sourceRoute: input.sourceRoute,
        reason: input.reason,
        id: input.id,
        createdAt: input.createdAt,
        metadata: input.metadata,
      }),
    )
  }

  async recordStaffDocumentVerification(input: StaffDocumentVerificationInput): Promise<AuditWriteResult> {
    // Note: verify action is NOT wired in AP-6D and remains deferred.
    // This skeleton method exists for contract completeness only.
    const { buildStaffDocumentVerifyEvent } = await import('../auditEventBuilder')
    return this.recordWithPolicyCheck(
      buildStaffDocumentVerifyEvent({
        actorId: input.actorId,
        actorRole: input.actorRole,
        actorDisplayName: input.actorDisplayName,
        documentId: input.documentId,
        applicationId: input.applicationId,
        studentToken: input.studentToken,
        sourceRoute: input.sourceRoute,
        id: input.id,
        createdAt: input.createdAt,
        metadata: input.metadata,
      }),
    )
  }

  async recordDisclosureApproval(input: DisclosureApprovalInput): Promise<AuditWriteResult> {
    return this.recordWithPolicyCheck(
      buildAuditEvent({
        id: input.id,
        eventType: 'staff.disclosure.approve_identity_reveal',
        actorId: input.actorId,
        actorRole: input.actorRole,
        actorDisplayName: input.actorDisplayName,
        targetType: input.targetType,
        targetId: input.targetId,
        targetDisplayToken: input.targetDisplayToken,
        targetPrivacyLevel: 'internal',
        sourceRoute: input.sourceRoute,
        reason: input.reason,
        metadata: input.metadata,
        createdAt: input.createdAt,
        persistenceMode: 'mock_only',
        severity: 'medium',
      }),
    )
  }

  async recordMatchOverride(input: MatchOverrideInput): Promise<AuditWriteResult> {
    return this.recordWithPolicyCheck(
      buildAuditEvent({
        id: input.id,
        eventType: 'staff.match.override_decision',
        actorId: input.actorId,
        actorRole: input.actorRole,
        actorDisplayName: input.actorDisplayName,
        targetType: input.targetType,
        targetId: input.targetId,
        targetDisplayToken: input.targetDisplayToken,
        targetPrivacyLevel: 'internal',
        sourceRoute: input.sourceRoute,
        reason: input.reason,
        metadata: input.metadata,
        createdAt: input.createdAt,
        persistenceMode: 'mock_only',
        severity: 'high',
      }),
    )
  }

  async recordExportGenerated(input: ExportGeneratedInput): Promise<AuditWriteResult> {
    return this.recordWithPolicyCheck(
      buildAuditEvent({
        id: input.id,
        eventType: 'admin.export.generate',
        actorId: input.actorId,
        actorRole: input.actorRole,
        actorDisplayName: input.actorDisplayName,
        targetType: 'export_job',
        targetId: `export_${Date.now()}`,
        targetDisplayToken: `${input.exportType.toUpperCase()}_EXPORT`,
        targetPrivacyLevel: 'internal',
        sourceRoute: input.sourceRoute,
        metadata: { ...input.metadata, exportType: input.exportType, rowCount: input.rowCount },
        createdAt: input.createdAt,
        persistenceMode: 'mock_only',
        severity: 'low',
      }),
    )
  }

  // ---------------------------------------------------------------------------
  // Read methods
  // ---------------------------------------------------------------------------

  async listForAdmin(filters?: AdminAuditFilters): Promise<AuditDisplayRow[]> {
    const events = await this.writer.list(filters as AuditWriterFilter | undefined)
    return events.map((e) => this.presenter.present(e))
  }

  async listForActor(actorId: string, filters?: ActorAuditFilters): Promise<AuditDisplayRow[]> {
    const mergedFilters = { ...filters, actorId }
    const events = await this.writer.list(mergedFilters as AuditWriterFilter)
    return events.map((e) => this.presenter.present(e))
  }

  async listForTarget(targetType: string, targetId: string, filters?: TargetAuditFilters): Promise<AuditDisplayRow[]> {
    const mergedFilters = { ...filters, targetType, targetId }
    const events = await this.writer.list(mergedFilters as AuditWriterFilter)
    return events.map((e) => this.presenter.present(e))
  }

  // ---------------------------------------------------------------------------
  // Private helper: build → policy check → write
  // ---------------------------------------------------------------------------

  private async recordWithPolicyCheck(event: AuditEvent): Promise<AuditWriteResult> {
    // Policy check — is auditing required for this action?
    const actionContext = { type: event.eventType, label: event.eventType }
    const actorContext = { id: event.actorId, role: event.actorRole, token: event.actorId }
    const targetContext = {
      id: event.targetId,
      type: event.targetType,
      token: event.targetDisplayToken,
      privacyLevel: event.targetPrivacyLevel,
    }

    if (!this.policy.requiresAudit(actionContext, actorContext, targetContext)) {
      return { success: true }
    }

    try {
      const written = await this.writer.write(event)
      return { success: true, eventId: written.id }
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error)
      return { success: false, error: msg }
    }
  }
}

// ---------------------------------------------------------------------------
// Factory function for easy test/mock setup
// ---------------------------------------------------------------------------

/**
 * Create a ready-to-use AuditService with an InMemoryAuditRepository.
 * This is intended for testing and future migration — NOT for production pages.
 */
export async function createAuditServiceForMockTesting(): Promise<AuditService> {
  const { AuditDisplayPresenter } = await import('../presenters/auditDisplayPresenter')
  const { InMemoryAuditRepository } = await import('../repositories/inMemoryAuditRepository')

  const repo = new InMemoryAuditRepository()

  const policy: AuditPolicyGuardContract = {
    requiresAudit: () => true,
    allowedMetadataKeys: () => {
      const { SAFE_AUDIT_METADATA_KEYS } = require('../auditMetadataRules') as typeof import('../auditMetadataRules')
      return Object.keys(SAFE_AUDIT_METADATA_KEYS.reduce(
        (acc: Record<string, boolean>, k: string) => ({ ...acc, [k]: true }),
        {},
      ))
    },
    getTargetPrivacyLevel: (_target: unknown): AuditPrivacyLevel => 'internal',
  }

  const presenter = new AuditDisplayPresenter('en', 'admin')

  const { createMockAuditWriter } = await import('../mockAuditWriter')
  const mockWriter = createMockAuditWriter()

  const writer: AuditWriterContract = {
    write: async (event: AuditEvent) => {
      const result = mockWriter.write(event)
      await repo.append(result)
      return { ...result }
    },
    writeMany: async (events: AuditEvent[]) => {
      const results = mockWriter.writeMany(events)
      await repo.appendMany(results)
      return results.map((e) => ({ ...e }))
    },
    list: async (filter?: AuditWriterFilter) => repo.list(filter),
    getById: async (id: string) => repo.findById(id),
    count: async (filter?: AuditWriterFilter) => repo.count(filter),
    clear: async () => {
      mockWriter.clear()
      await repo.clearMockOnly?.()
    },
    seed: async (events: AuditEvent[]) => {
      mockWriter.seed(events)
      await repo.appendMany(events)
    },
    snapshot: async () => mockWriter.snapshot?.() ?? { events: [], count: 0 },
  }

  function createFn(input: unknown): AuditEvent {
    const { buildAuditEvent } = require('../auditEventBuilder') as typeof import('../auditEventBuilder')
    return buildAuditEvent(input as any)
  }

  return new AuditService(writer, { create: createFn } as AuditEventFactoryContract, policy, presenter)
}
# Audit Service Interface Spec AP-8

## 1. Purpose
Define concrete future interfaces for the audit service and related components. This is documentation-only; no source files are created or modified.

## 2. TypeScript Interface Plan
The following interfaces are planned for future implementation in `src/lib/audit/contracts/`.

### AuditEventFactory
```typescript
interface AuditEventFactory {
  /**
   * Builds an audit event from contexts and input.
   * Does not persist the event.
   * @param actionContext - The action being audited.
   * @param actorContext - The actor performing the action.
   * @param targetContext - The target of the action.
   * @param metadataInput - Structured metadata (already sanitized).
   * @returns A new audit event object (shape defined by auditTypes.ts).
   */
  create(
    actionContext: AuditActionContext,
    actorContext: AuditActorContext,
    targetContext: AuditTargetContext,
    metadataInput: AuditMetadataInput
  ): AuditEvent;
}
```

### AuditWriter
```typescript
interface AuditWriter {
  /**
   * Writes an audit event using the underlying repository.
   * Applies policy validation but does not duplicate validation already done by service.
   * @param event - The audit event to write.
   * @returns A result indicating success or failure.
   */
  write(event: AuditEvent): Promise<AuditWriteResult>;

  /**
   * Optional: batch write for performance.
   */
  writeMany(events: AuditEvent[]): Promise<AuditWriteResult[]>;
}
```

### AuditRepository
```typescript
interface AuditRepository {
  /**
   * Append a single audit event.
   */
  append(event: AuditEvent): Promise<void>;

  /**
   * Append multiple audit events.
   */
  appendMany(events: AuditEvent[]): Promise<void>;

  /**
   * Find an audit event by its ID.
   */
  findById(id: string): Promise<AuditEvent | null>;

  /**
   * List audit events with optional filters.
   * @param filters - See AuditRepositoryContract AP-8 for filter definitions.
   * @returns Array of matching audit events.
   */
  list(filters?: AuditRepositoryFilters): Promise<AuditEvent[]>;

  /**
   * Count audit events matching filters.
   */
  count(filters?: AuditRepositoryFilters): Promise<number>;

  /**
   * Clear mock-only events (useful in tests).
   * This method may be omitted in production repositories.
   */
  clearMockOnly?(): Promise<void>;
}
```

### AuditMetadataSanitizer
```typescript
interface AuditMetadataSanitizer {
  /**
   * Sanitizes a metadata value according to privacy rules.
   * @param key - The metadata key.
   * @param value - The raw value (may be unsafe).
   * @returns A safe value for storage/display (e.g., tokenized, masked, or "[Hidden by privacy rule]").
   */
  sanitize(key: string, value: unknown): string;

  /**
   * Determines if a metadata key is allowed to be stored at all.
   * @param key - The metadata key.
   * @returns true if the key is not blocked.
   */
  isAllowedKey(key: string): boolean;
}
```

### AuditPolicyGuard
```typescript
interface AuditPolicyGuard {
  /**
   * Determines if an action requires an audit event.
   * @param actionContext - The action context.
   * @param actorContext - The actor context.
   * @param targetContext - The target context.
   * @returns true if the action should be audited.
   */
  requiresAudit(
    actionContext: AuditActionContext,
    actorContext: AuditActorContext,
    targetContext: AuditTargetContext
  ): boolean;

  /**
   * Returns the list of metadata keys that are allowed for this action.
   * @param actionContext - The action context.
   * @returns Array of allowed metadata keys.
   */
  allowedMetadataKeys(actionContext: AuditActionContext): string[];

  /**
   * Returns the target privacy level for the given target.
   * @param targetContext - The target context.
   * @returns The privacy level (e.g., 'public', 'sensitive', 'restricted').
   */
  getTargetPrivacyLevel(targetContext: AuditTargetContext): 'public' | 'sensitive' | 'restricted';
}
```

### AuditDisplayPresenter
```typescript
interface AuditDisplayPresenter {
  /**
   * Converts a stored audit event into a UI-ready display row.
   * Used for Admin audit log table, drawer, and export.
   * @param event - The audit event from the repository.
   * @returns An object suitable for rendering in UI components.
   */
  present(event: AuditEvent): AuditDisplayRow;
}
```

### AuditCopyStageResolver
```typescript
interface AuditCopyStageResolver {
  /**
   * Determines the copy stage for the given audit event and current configuration.
   * @param event - The audit event.
   * @returns The copy stage (e.g., 'mock', 'real_persisted', 'prototype').
   */
  getCopyStage(event: AuditEvent): 'mock_only' | 'real_persisted' | 'prototype_only';

  /**
   * Returns the copy text to display for the given copy stage.
   * @param stage - The copy stage.
   * @returns The localized string (e.g., "This is a mock/demo event. Not official audit evidence.").
   */
  getCopyText(stage: 'mock_only' | 'real_persisted' | 'prototype_only'): string;
}
```

### AuditService
```typescript
interface AuditService {
  /**
   * Records a staff document rejection.
   * This is an example of a workflow-specific method.
   * @param input - DTO containing all necessary contexts and metadata.
   * @returns A write result.
   */
  recordStaffDocumentRejection(input: StaffDocumentRejectionInput): Promise<AuditWriteResult>;

  /**
   * Records a staff document replacement request.
   */
  recordStaffDocumentReplacementRequest(input: StaffDocumentReplacementRequestInput): Promise<AuditWriteResult>;

  /**
   * Records a staff document verification (if applicable).
   */
  recordStaffDocumentVerification(input: StaffDocumentVerificationInput): Promise<AuditWriteResult>;

  /**
   * Records a disclosure approval.
   */
  recordDisclosureApproval(input: DisclosureApprovalInput): Promise<AuditWriteResult>;

  /**
   * Records a match override.
   */
  recordMatchOverride(input: MatchOverrideInput): Promise<AuditWriteResult>;

  /**
   * Records an export generation.
   */
  recordExportGenerated(input: ExportGeneratedInput): Promise<AuditWriteResult>;

  /**
   * Lists audit events for Admin display with filters.
   * @param filters - Admin-specific filters (e.g., persistence mode, date range).
   * @returns Array of display rows ready for UI.
   */
  listForAdmin(filters?: AdminAuditFilters): Promise<AuditDisplayRow[]>;

  /**
   * Lists audit events for a given actor (e.g., staff member).
   * @param actorId - The actor's identifier (token).
   * @returns Array of display rows.
   */
  listForActor(actorId: string): Promise<AuditDisplayRow[]>;

  /**
   * Lists audit events for a given target (e.g., a student or document).
   * @param targetType - The type of target (e.g., 'student', 'document').
   * @param targetId - The target's identifier (token).
   * @returns Array of display rows.
   */
  listForTarget(targetType: string, targetId: string): Promise<AuditDisplayRow[]>;
}
```

## 3. Core DTO Shapes
The following types are planned for `src/lib/audit/dto/`.

```typescript
// Base context types
type AuditActorContext = {
  id: string; // e.g., user ID or system identifier (internal)
  role: 'staff' | 'provider' | 'system' | 'admin' | 'esq';
  name?: string; // optional, only if safe to display
  token: string; // e.g., ST-456, PR-789, SYS-001
};

type AuditTargetContext = {
  id: string; // internal ID
  type: 'student' | 'document' | 'scholarship' | 'application' | 'provider' | 'announcement';
  name?: string; // optional, only if safe to display
  token: string; // e.g., S-123, DOC-456
  privacyLevel: 'public' | 'sensitive' | 'restricted';
};

type AuditActionContext = {
  type: string; // e.g., 'STAFF_DOCUMENT_REJECT'
  label: string; // human-readable action (e.g., 'Rejected document')
  subType?: string; // optional sub-action
};

type AuditReasonContext = {
  reason?: string; // free-text reason, may be undefined if not required
  reasonId?: string; // optional enum if using coded reasons
};

type AuditMetadataInput = Record<string, unknown>; // key-value pairs, already sanitized by AuditMetadataSanitizer before passing to factory

type AuditEventInput = {
  action: AuditActionContext;
  actor: AuditActorContext;
  target: AuditTargetContext;
  reason?: AuditReasonContext;
  metadata: AuditMetadataInput;
};

// Output types
type AuditWriteResult = {
  success: boolean;
  eventId?: string; // only if success
  error?: string; // only if !success
};

type AuditDisplayRow = {
  id: string;
  createdAt: string; // ISO string
  actorLabel: string; // e.g., "ST-456" or "Jane Doe" if allowed
  actorRoleLabel: string; // e.g., "Staff"
  actionLabel: string; // e.g., "Rejected document"
  targetLabel: string; // e.g., "S-123" or document name if allowed
  sourceLabel: string; // e.g., "Staff Application"
  persistenceLabel: string; // e.g., "Mock/Demo"
  severityLabel: string; // e.g., "Info"
  routeHref?: string; // optional link to detail view
  canOpenDetail: boolean;
  copyStage: 'mock_only' | 'real_persisted' | 'prototype_only';
};
```

## 4. Service Method Plan
The `AuditService` would provide methods for each major audit-worthy workflow. Examples:

- `recordStaffDocumentRejection(input)`: maps to Staff rejecting a document in the application detail page.
- `recordStaffDocumentReplacementRequest(input)`: maps to Staff requesting a replacement.
- `recordStaffDocumentVerification(input)`: if verification is audited separately.
- `recordDisclosureApproval(input)`: when a staff member approves a disclosure request.
- `recordMatchOverride(input)`: when staff overrides a match score.
- `recordExportGenerated(input)`: when an export is generated (for audit trail).
- `listForAdmin(filters)`: used by Admin audit log page to populate the table.
- `listForActor(actorId)`: could be used in a Staff "My Audit Activity" view.
- `listForTarget(targetType, targetId)`: could be used to show all events related to a specific student or document.

Each method would:
1. Validate the action requires audit via `AuditPolicyGuard.requiresAudit`.
2. Build the actor, target, action, and reason contexts from the input.
3. Sanitize metadata via `AuditMetadataSanitizer` (if not already done by caller).
4. Use `AuditEventFactory.create` to build the event.
5. Use `AuditWriter.write` to persist the event.
6. Return the `AuditWriteResult`.

## 5. Error Handling Contract
- Writer failures (e.g., repository down) must not break the primary UI workflow in mock or early persistence stages.
- In mock mode, errors are logged but the UI proceeds as if success (to avoid blocking UI on audit failures).
- In future real persistence, errors may be surfaced via a shadow mode or retry mechanism, but the primary action should still complete.
- Errors should return `AuditWriteResult.success = false` with an explanatory message.
- Fatal configuration errors (e.g., missing repository) may throw during application boot or in tests, but not during runtime UI interactions.

## 6. Validation Boundary
- AP-8 does **not** change reason validation (still governed by `sensitiveActions.ts` and reason modals).
- FormRequest-like validation (e.g., reason length, required fields) belongs in a future action/request layer, not in the UI or service.
- The UI should not own persistence validation; it should pass input to the service and let the service decide if an audit is needed.
- `ReasonRequiredModal` remains deferred; AP-8 only plans the service boundary.

## 7. Laravel/PHP Equivalent
The following pseudo-code shows the Laravel/PHP equivalents.

### AuditEventData (DTO)
```php
namespace App\Data\Audit;

final class AuditEventData
{
    public function __construct(
        public AuditActionContext $action,
        public AuditActorContext $actor,
        public AuditTargetContext $target,
        public ?AuditReasonContext $reason,
        public array $metadata // already sanitized
    ) {}
}
```

### AuditWriterInterface
```php
namespace App\Contracts\Audit;

interface AuditWriterInterface
{
    public function write(AuditEvent $event): AuditWriteResult;
    public function writeMany(array $events): array; // returns array of AuditWriteResult
}
```

### AuditRepositoryInterface
```php
namespace App\Repositories\Audit;

interface AuditRepositoryInterface
{
    public function append(AuditEvent $event): void;
    public function appendMany(array $events): void;
    public function findById(string $id): ?AuditEvent;
    public function array list(array $filters = []): array;
    public function int count(array $filters = []): int;
    public function void clearMockOnly(): void; // optional
}
```

### AuditService
```php
namespace App\Services\Audit;

final class AuditService
{
    public function __construct(
        private AuditWriterInterface $writer,
        private AuditPolicyGuard $policy,
        private AuditMetadataSanitizer $sanitizer,
        private AuditEventFactory $factory
    ) {}

    public function recordStaffDocumentRejection(StaffDocumentRejectionInput $input): AuditWriteResult
    {
        // 1. Check if action requires audit
        if (!$this->policy->requiresAudit(
            $input->action,
            $input->actor,
            $input->target
        )) {
            return new AuditWriteResult(true); // no audit needed
        }

        // 2. Build contexts from input (actor, target, action, reason)
        // 3. Sanitize metadata
        // 4. Create event
        // 5. Write via writer
        // 6. Return result
    }

    // ... other methods similarly
}
```

### AuditPolicyGuard (simplified)
```php
namespace App\Policies;

final class AuditPolicy
{
    public function requiresAudit(
        AuditActionContext $action,
        AuditActorContext $actor,
        AuditTargetContext $target
    ): bool {
        // logic from sensitiveActions.ts and policy rules
    }

    public function allowedMetadataKeys(AuditActionContext $action): array
    {
        // return list of allowed keys for this action type
    }

    public function getTargetPrivacyLevel(AuditTargetContext $target): string
    {
        // return 'public', 'sensitive', or 'restricted'
    }
}
```

### AuditEventResource (Presenter)
```php
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

final class AuditEventResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'createdAt' => $this->createdAt,
            'actorLabel' => $this->actor->token, // or name if allowed
            'actorRoleLabel' => $this->actor->role,
            'actionLabel' => $this->action->label,
            'targetLabel' => $this->target->token, // or name if allowed
            'sourceLabel' => $this->source,
            'persistenceLabel' => $this->persistenceMode->label,
            'severityLabel' => $this->severity->label,
            'routeHref' => $this->routeHref,
            'canOpenDetail' => $this->canOpenDetail,
            'copyStage' => $this->copyStage,
        ];
    }
}
```

## 8. DRY Enforcement Rules
To maintain DRY boundaries after implementing these contracts, enforce the following rules:

- No direct `buildStaffDocumentRejectEvent` calls inside UI after the service exists.
- No direct `sharedMockWriter.write` from UI after the service exists.
- No copy text inside repository or service.
- No privacy filtering inside table row rendering; use the presenter.
- No duplicate source/persistence mapping outside the presenter.
- Validation of reason length and requirement stays in the action/request layer, not in UI or service.
- The UI layer only calls service methods and passes DTOs; it does not construct audit events.

## 9. Non-Goals (Reiterated)
This spec does not:
- Implement any runtime code.
- Add real persistence or backend/API.
- Change reason validation.
- Introduce ReasonRequiredModal.
- Wire Staff verify action.
- Fix the notification click issue (documented separately).


# Audit Repository Contract AP-8

## 1. Repository Purpose
The audit repository is responsible for storing and retrieving audit events. It abstracts the persistence mechanism (in-memory, database, etc.) and allows the audit writer to work with a consistent interface.

## 2. Current Mock Writer vs Future Repository
Currently, `src/lib/audit/mockAuditWriter.ts` provides an in-memory mock audit writer with methods like `write`, `list`, `clear`, etc.
In the future, we will have one or more repository implementations (e.g., `InMemoryAuditRepository` for testing/mock, `DatabaseAuditRepository` for real persistence) that implement the `AuditRepository` interface.

## 3. Repository Interface Design
The following TypeScript interface is planned for `src/lib/audit/contracts/AuditRepository.ts`:

```typescript
interface AuditRepository {
  /**
   * Append a single audit event to the store.
   * @param event - The audit event to append.
   * @returns A promise that resolves when the event is stored.
   */
  append(event: AuditEvent): Promise<void>;

  /**
   * Append multiple audit events.
   * @param events - Array of audit events to append.
   * @returns A promise that resolves when all events are stored.
   */
  appendMany(events: AuditEvent[]): Promise<void>;

  /**
   * Find an audit event by its ID.
   * @param id - The unique identifier of the audit event.
   * @returns A promise that resolves to the audit event or null if not found.
   */
  findById(id: string): Promise<AuditEvent | null>;

  /**
   * List audit events with optional filters.
   * @param filters - Optional filters to apply (see section 4).
   * @returns A promise that resolves to an array of matching audit events.
   */
  list(filters?: AuditRepositoryFilters): Promise<AuditEvent[]>;

  /**
   * Count audit events matching the given filters.
   * @param filters - Optional filters to apply.
   * @returns A promise that resolves to the number of matching audit events.
   */
  count(filters?: AuditRepositoryFilters): Promise<number>;

  /**
   * Clear mock-only events.
   * This method is useful for tests and may be omitted in production repositories.
   * @returns A promise that resolves when the mock-only events are cleared.
   */
  clearMockOnly?(): Promise<void>;
}
```

## 4. Query/Filter Contract
The `filters` parameter in `list` and `count` methods is an object with the following optional properties:
- `eventType`: string | string[] - Match by event type (e.g., 'STAFF_DOCUMENT_REJECT').
- `actorRole`: 'staff' | 'provider' | 'system' | 'admin' | 'esq' | string[] - Match by actor role.
- `actorId`: string | string[] - Match by actor ID (internal ID, not token).
- `targetType`: string | string[] - Match by target type (e.g., 'student', 'document').
- `targetId`: string | string[] - Match by target ID (internal ID).
- `persistenceMode`: 'mock_only' | 'real_persisted' | 'prototype_only' | string[] - Match by persistence mode.
- `sourceRoute`: string | string[] - Match by source route (e.g., '/staff/applications/[id]').
- `severity`: string | string[] - Match by severity (e.g., 'Info', 'Warning', 'Error').
- `createdAtStart`: string (ISO string) - Match events created on or after this date/time.
- `createdAtEnd`: string (ISO string) - Match events created on or before this date/time.
- `hasReason`: boolean - If true, only return events with a non-empty reason; if false, only events without a reason.
- `privacyLevel`: 'public' | 'sensitive' | 'restricted' | string[] - Match by target privacy level.

## 5. Pagination Contract
For large datasets, the repository may support pagination in the future. The planned pagination parameters are:
- `page`: number (1-indexed) - The page number to retrieve.
- `perPage`: number - Number of items per page.
- `cursor`: string - A cursor for cursor-based pagination (alternative to page/perPage).
- `sort`: string - The field to sort by (e.g., 'createdAt', 'id').
- `direction`: 'asc' | 'desc' - The sort direction.

These parameters would be added to the `AuditRepositoryFilters` type.

## 6. Persistence Mode Behavior
The repository should respect the persistence mode of the audit event. The persistence mode is a property of the audit event (see `auditTypes.ts`). The repository implementations may behave as follows:
- `mock_only`: The event is stored in a mock/in-memory store (if using `InMemoryAuditRepository`). In a real database repository, mock-only events might be stored in a separate table or not stored at all (depending on configuration).
- `prototype_only`: Similar to mock-only, but for prototype events.
- `real_persisted`: The event is stored in the real persistent store (e.g., database).
- `shadow_persisted` (future): The event is written to both mock and real stores for migration.
- `rejected` (future): The event was rejected by the persistence layer (e.g., due to validation) and may be stored separately for inspection.

The repository interface does not enforce persistence mode; it is up to the implementation to handle it appropriately. However, the contract assumes that the repository will not change the persistence mode of the event.

## 7. Storage Implementation Stages
We plan the following repository implementations:
- `InMemoryAuditRepository`: An in-memory store that holds audit events in an array. Used for tests and as a mock. It respects persistence mode by storing all events but may provide a method to clear mock-only events.
- `DatabaseAuditRepository`: A future implementation that stores audit events in a real database (e.g., PostgreSQL, MySQL). It would have a table for audit events and would store events regardless of persistence mode (or with a column for persistence mode).
- `ShadowWriteAuditRepository` (future): A wrapper that writes to both an in-memory and a database repository for migration purposes.

## 8. Laravel/PHP Repository Equivalent
The Laravel/PHP equivalent of the `AuditRepository` interface is:

```php
namespace App\Repositories\Audit;

use App\Data\Audit\AuditEvent;

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

Example method signatures in a concrete class:

```php
namespace App\Repositories\Audit;

use App\Data\Audit\AuditEvent;
use Illuminate\Support\Facades\DB;

class DatabaseAuditRepository implements AuditRepositoryInterface
{
    public function append(AuditEvent $event): void
    {
        // insert into audit_table
    }

    public function findById(string $id): ?AuditEvent
    {
        // select from audit_table where id = ?
    }

    // ... other methods
}
```

## 9. Privacy and Metadata
The repository stores sanitized metadata only. Raw metadata is rejected before storage by the `AuditMetadataSanitizer` (see `AuditPolicyAndPrivacyContract_AP8.md`). The repository does not perform additional sanitization; it trusts that the event given to it has already been sanitized.

## 10. What Repository Must Not Do
- No UI copy: The repository must not return strings intended for UI display (e.g., "Mock/Demo").
- No row styling: The repository must not return CSS classes or style information.
- No role display labels: The repository must not return role labels like "Staff" or "Provider".
- No reason min-length decisions: The repository must not enforce reason length; that is handled elsewhere.
- No modal decisions: The repository must not decide whether to show a modal.

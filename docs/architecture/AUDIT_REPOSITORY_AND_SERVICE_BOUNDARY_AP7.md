# Audit Repository and Service Boundary — AP-7

Date: 2026-05-13
Branch: `architecture/audit-persistence-strategy-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

This document defines the planned interface shapes for:

- `AuditWriterInterface` — shared contract both mock and persistent writers implement
- `MockAuditWriter` — current in-memory implementation (exists)
- `PersistentAuditWriter` — future backend implementation (planned, not implemented)
- `AuditRepository` — abstraction over storage (planned, not implemented)
- `AuditEventInput` — DTO contract (exists as `BuildAuditEventInput`)
- `AuditPolicy` / metadata guard — privacy boundary (exists as `validateAuditMetadata`)
- `AuditMetadataSanitizer` — planned hardening
- `AuditDisplayPresenter` — current adapter (exists as `adminAuditDisplayAdapter`)
- Where validation should live
- Where copy/UI strings must not live

All pseudo-code below is planning notation only. Nothing here is implemented.

---

## AuditWriter Interface

### Planned TypeScript contract

```typescript
// src/lib/audit/writers/AuditWriterInterface.ts
// Planning only — not implemented

interface AuditWriterInterface {
  write(event: AuditEvent): Promise<AuditEvent>      // Future: async for API call
  writeMany(events: AuditEvent[]): Promise<AuditEvent[]>
  list(filter?: AuditWriterFilter): Promise<AuditEvent[]>
  getById(id: string): Promise<AuditEvent | undefined>
  count(filter?: AuditWriterFilter): Promise<number>
}
```

### Current MockAuditWriter (synchronous, in-memory)

```typescript
// Already exists in src/lib/audit/mockAuditWriter.ts
// Current interface is synchronous — this is intentional for mock/test use only.
// The persistent writer will use async/Promise to allow API/DB calls.
// The mock can remain synchronous internally; it may wrap in Promise.resolve() if needed.

interface MockAuditWriter {
  write(event: AuditEvent): AuditEvent         // synchronous — mock only
  writeMany(events: AuditEvent[]): AuditEvent[]
  list(filter?: MockAuditWriterFilter): AuditEvent[]
  getById(id: string): AuditEvent | undefined
  clear(): void
  seed(events: AuditEvent[]): void
  snapshot(): MockAuditWriterSnapshot
  count(): number
}
```

Note: The synchronous/async boundary is a planned difference between mock and persistent writers.
The mock remains synchronous for use in check scripts and test contexts.
The persistent writer will be async to support API/DB calls.

### Planned PersistentAuditWriter (future — not implemented)

```typescript
// src/lib/audit/writers/PersistentAuditWriter.ts
// Planning only — do not implement until AP-8B is approved

class PersistentAuditWriter implements AuditWriterInterface {
  constructor(
    private readonly apiBaseUrl: string,
    private readonly sessionToken: string,
  ) {}

  async write(event: AuditEvent): Promise<AuditEvent> {
    // POST /api/audit-events with event payload
    // Server sets createdAt — client value is advisory only
    // Server validates forbidden metadata keys — client validation is a pre-check only
    // Returns persisted event with server-assigned fields
  }

  async list(filter?: AuditWriterFilter): Promise<AuditEvent[]> {
    // GET /api/audit-events?filter=...
    // Role-scoped — server enforces who can read which events
  }
  // ...
}
```

### Laravel/PHP equivalent

```php
// app/Contracts/AuditWriterInterface.php
// Planning notation only

interface AuditWriterInterface
{
    public function store(AuditEventData $data): AuditEvent;
    public function storeMany(array $data): Collection;
    public function findById(string $id): ?AuditEvent;
    public function query(AuditFilterData $filter): Collection;
    public function count(AuditFilterData $filter = null): int;
}

// app/Repositories/MockAuditRepository.php
class MockAuditRepository implements AuditWriterInterface { /* in-memory */ }

// app/Repositories/EloquentAuditRepository.php
class EloquentAuditRepository implements AuditWriterInterface { /* DB via Eloquent */ }
```

---

## AuditRepository Abstraction

The repository abstraction decouples the service layer from storage details.
Both mock and persistent writers implement the same interface.
The service layer never calls storage directly — always through the interface.

```typescript
// Planned — not implemented
// src/lib/audit/repository/AuditRepository.ts

interface AuditRepository {
  store(event: AuditEvent): Promise<AuditEvent>
  findById(id: string): Promise<AuditEvent | undefined>
  query(filter: AuditQueryFilter): Promise<AuditEvent[]>
  count(filter?: AuditQueryFilter): Promise<number>
}

// DI binding — determines which implementation is used
// In Next.js this might be env-controlled:
// process.env.AUDIT_BACKEND === 'mock' → MockAuditRepository
// process.env.AUDIT_BACKEND === 'api' → PersistentAuditRepository
```

Laravel equivalent:

```php
// config/audit.php
return [
  'driver' => env('AUDIT_DRIVER', 'mock'), // 'mock' | 'eloquent'
];

// AppServiceProvider.php
$this->app->bind(AuditWriterInterface::class, function () {
  return match(config('audit.driver')) {
    'eloquent' => new EloquentAuditRepository(),
    default => new MockAuditRepository(),
  };
});
```

---

## AuditEventInput / DTO

### Current (TypeScript — exists)

```typescript
// src/lib/audit/auditTypes.ts

interface BuildAuditEventInput extends AuditActorInput, AuditTargetInput {
  eventType: AuditEventType
  reason?: string | null
  reasonRequired?: boolean
  reasonMinLength?: number
  metadata?: AuditMetadata
  sourceRoute: string
  createdAt?: string       // client hint only — server overrides for real persistence
  severity?: AuditSeverity
  policyVersion?: string
  persistenceMode?: AuditPersistenceMode
}

interface StaffDocumentAuditInput extends AuditActorInput {
  documentId: string
  applicationId: string
  studentToken: string       // privacy token — never raw student_id
  sourceRoute: string
  reason?: string | null
  metadata?: AuditMetadata
}
```

### Future requirements for real persistence

When real persistence is wired:

- `actorId` must come from authenticated session — not prototype placeholder.
- `createdAt` must be overridden by server — client value is advisory only.
- `persistenceMode` will be `'real_persisted'` — builder must accept this.
- `id` must be server-generated UUID — stable client IDs are only for mock testing.

### Laravel/PHP equivalent

```php
// app/Data/StaffDocumentAuditData.php
// Planning notation only

class StaffDocumentAuditData extends Data
{
    public function __construct(
        public readonly string $actorId,
        public readonly string $actorRole,
        public readonly string $actorDisplayName,
        public readonly string $documentId,
        public readonly string $applicationId,
        public readonly string $studentToken,
        public readonly string $sourceRoute,
        public readonly ?string $reason,
        public readonly array $metadata,
    ) {}
}
```

---

## AuditPolicy / Privacy Guard

### Current (TypeScript — exists)

```typescript
// src/lib/audit/auditMetadataRules.ts

function validateAuditMetadata(
  metadata: AuditMetadata,
  context: AuditMetadataValidationContext
): AuditMetadataValidationResult

// Enforces:
// - FORBIDDEN_AUDIT_METADATA_KEYS → hard errors
// - provider actor must not include raw student identity keys
// - executive/esq actor warned against individual target keys
// - unknown keys → warnings (not errors)
```

### Planned hardening for AP-8

The current guard runs client-side only inside `buildAuditEvent`. For real persistence:

1. The same `FORBIDDEN_AUDIT_METADATA_KEYS` list must be enforced server-side.
2. The server must reject any event with forbidden keys regardless of client validation.
3. Unknown keys should trigger a warning/log server-side, not a hard error, to allow
   future safe key additions without deployment churn.

### Laravel/PHP equivalent

```php
// app/Policies/AuditMetadataPolicy.php
// Planning notation only

class AuditMetadataPolicy
{
    private const FORBIDDEN_KEYS = ['rawStudentName', 'studentEmail', 'rawStudentId', ...];
    private const SAFE_KEYS = ['documentId', 'applicationId', 'studentToken', 'nextStatus', ...];

    public function validate(array $metadata, string $actorRole, string $targetType): ValidationResult
    {
        // reject forbidden keys
        // warn unknown keys
        // enforce provider/esq specific rules
    }
}
```

---

## AuditMetadataSanitizer (planned)

A future `AuditMetadataSanitizer` should strip forbidden keys before persistence
rather than throwing an error, when operating in a trusted server context where
the keys are present due to legacy code or accidental inclusion.

```typescript
// Planned — not implemented
// src/lib/audit/validation/AuditMetadataSanitizer.ts

function sanitizeAuditMetadata(
  metadata: AuditMetadata,
  context: AuditMetadataValidationContext,
  options?: { stripUnknown?: boolean }
): { sanitized: AuditMetadata; stripped: string[]; warnings: string[] }

// Used in: server-side API handler before DB write
// Not used in: client-side builder (builder throws on forbidden keys)
```

---

## AuditDisplayPresenter

### Current (TypeScript — exists)

```typescript
// src/lib/audit/adminAuditDisplayAdapter.ts

export function getAdminAuditDisplayRows(fixtureLogs: AuditLog[]): AdminAuditDisplayRow[]

// Currently: reads fixture + DEMO_WRITER_EVENTS + sharedMockAuditWriter.list()
// Future: reads from AuditRepository.query() — same AdminAuditDisplayRow shape
```

### Planned AP-8 changes to adapter

The `getAdminAuditDisplayRows` function signature will change to accept API response rows
instead of (or in addition to) fixture logs. The `AdminAuditDisplayRow` shape should remain
stable — only the data source changes.

```typescript
// Planned — not implemented

// Current signature:
// export function getAdminAuditDisplayRows(fixtureLogs: AuditLog[]): AdminAuditDisplayRow[]

// Future signature option A (backward-compatible):
// export function getAdminAuditDisplayRows(
//   fixtureLogs: AuditLog[],
//   persistedEvents?: AuditEvent[],
// ): AdminAuditDisplayRow[]

// Future signature option B (clean break):
// export function getAdminAuditDisplayRows(
//   sources: AdminAuditDataSources,
// ): AdminAuditDisplayRow[]
// where AdminAuditDataSources = { fixtureLogs?, writerEvents?, persistedEvents? }
```

Do not implement either option until AP-8 is approved.

### Laravel/PHP equivalent

```php
// app/Http/Resources/AdminAuditEventCollection.php
// Planning notation only

class AdminAuditEventCollection extends ResourceCollection
{
    public function toArray($request): array
    {
        return $this->collection->map(fn($event) => [
            'id' => $event->id,
            'source' => $event->persistence_mode === 'real_persisted' ? 'persisted' : 'writer',
            'actorName' => $event->actor_display_name,
            // ... role-scoped field selection
        ])->all();
    }
}
```

---

## Where Validation Should Live

| Validation type | Where it should live | Where it must NOT live |
|----------------|---------------------|----------------------|
| Metadata forbidden key check | `buildAuditEvent` (client) + server API handler | Inline in UI component callbacks |
| Reason non-empty check | `buildAuditEvent` (client) | Duplicated in each page callback |
| Reason min-length check | Builder helpers (client) + server API handler | Scattered in UI component states |
| Actor identity validation | Server API handler only | Client — client cannot trust itself |
| Timestamp authority | Server only | Client `new Date()` is advisory |
| Persistence mode check | Writer (client mock) + server API handler | UI render logic |
| Role-scoped metadata view | Server + presenter | Component JSX conditions |

---

## Where Copy / UI Strings Must NOT Live

| Copy type | Must NOT live in |
|-----------|-----------------|
| Copy stage decision (Stage 0/1/2/3) | Per-component props or inline strings |
| "This action is logged" language | Any component before real persistence exists |
| Mock/demo notice copy | Scattered per-page; must be centralized in `AuditWarningCard` and banner |
| Persistence mode display label | Inline in JSX; must come from `AdminAuditDisplayRow.persistenceMode` via adapter |
| Reason required copy | Inline per-component; should come from `SENSITIVE_ACTIONS` config |

---

## Service Layer (Planned for AP-8+)

The service layer orchestrates builder → validation → writer → return.
It is the single place where the full audit write workflow is executed.
The page callback should call the service — not call the builder and writer directly.

### Current (no service layer — direct call in page callback)

```typescript
// Current pattern in page.tsx — too much logic in the UI callback
onReject={(docId, reason) => {
  try {
    const event = buildStaffDocumentRejectEvent({ ... })
    sharedMockAuditWriter.write(event)
  } catch (err) {
    console.warn('[AP-6D] Mock audit write failed (reject)', err)
  }
  addToast(...)
}}
```

### Planned service layer (AP-8+, not implemented)

```typescript
// Planned — not implemented
// src/lib/audit/services/auditService.ts

async function recordDocumentRejection(
  input: StaffDocumentAuditInput,
): Promise<{ success: boolean; event?: AuditEvent; error?: string }> {
  try {
    const event = buildStaffDocumentRejectEvent(input)
    const persisted = await auditRepository.store(event)
    return { success: true, event: persisted }
  } catch (err) {
    console.warn('[AuditService] Document rejection write failed', err)
    return { success: false, error: String(err) }
  }
}
```

Page callback becomes:

```typescript
// Planned — not implemented
onReject={async (docId, reason) => {
  await auditService.recordDocumentRejection({ actorId, docId, reason, ... })
  addToast(...)
}}
```

This separation means:

- Page component is thin — no builder imports, no writer imports.
- Service is the single write boundary.
- Error handling is centralized.
- The service can swap the writer (mock ↔ persistent) via DI/config without changing page code.

### Laravel/PHP equivalent

```php
// app/Services/AuditService.php
// Planning notation only

class AuditService
{
    public function __construct(
        private readonly AuditWriterInterface $writer,
        private readonly BuildAuditEventAction $builder,
        private readonly AuditMetadataPolicy $policy,
    ) {}

    public function recordDocumentRejection(StaffDocumentAuditData $data): AuditEvent
    {
        $this->policy->validate($data->metadata, $data->actorRole, 'document');
        $event = $this->builder->handle($data);
        return $this->writer->store($event);
    }
}
```

This maps cleanly to the PROJELEARNT pattern:
`Controller → FormRequest → Service → Repository → Model`

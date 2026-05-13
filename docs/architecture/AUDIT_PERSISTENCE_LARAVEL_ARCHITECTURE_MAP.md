# Audit Persistence Laravel/PHP Architecture Map — AP-7

Date: 2026-05-13
Branch: `architecture/audit-persistence-strategy-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

This document maps current Next.js/TypeScript audit modules to their Laravel/PHP conceptual
equivalents, and defines the proposed folder boundaries for both the current TypeScript
architecture and a future Laravel-aligned structure.

It is a planning reference only. No code is implemented here.

---

## Current TypeScript → Laravel/PHP Concept Map

### Core type contracts

| TypeScript | File | Laravel/PHP concept | Laravel equivalent |
|-----------|------|--------------------|--------------------|
| `AuditEvent` interface | `auditTypes.ts` | Eloquent model shape / API Resource | `App\Models\AuditEvent` / `App\Http\Resources\AuditEventResource` |
| `BuildAuditEventInput` | `auditTypes.ts` | FormRequest / DTO | `App\Http\Requests\StoreAuditEventRequest` |
| `StaffDocumentAuditInput` | `auditTypes.ts` | Typed DTO for a specific action type | `App\Data\StaffDocumentAuditData` (Spatie Data or custom) |
| `AuditActorInput` | `auditTypes.ts` | Actor context DTO | Part of `StoreAuditEventRequest` |
| `AuditTargetInput` | `auditTypes.ts` | Target context DTO | Part of `StoreAuditEventRequest` |
| `AuditEventType` union | `auditTypes.ts` | Enum / string cast | `App\Enums\AuditEventType` |
| `AuditPersistenceMode` union | `auditTypes.ts` | Enum | `App\Enums\AuditPersistenceMode` |
| `AuditSeverity` union | `auditTypes.ts` | Enum | `App\Enums\AuditSeverity` |
| `AuditPrivacyLevel` union | `auditTypes.ts` | Enum | `App\Enums\AuditPrivacyLevel` |

### Builder / factory layer

| TypeScript | File | Laravel/PHP concept | Laravel equivalent |
|-----------|------|--------------------|--------------------|
| `buildAuditEvent()` | `auditEventBuilder.ts` | Action class / DTO factory | `App\Actions\BuildAuditEventAction` |
| `buildStaffDocumentRejectEvent()` | `auditEventBuilder.ts` | Specialized action | `App\Actions\Staff\BuildDocumentRejectAuditAction` |
| `buildStaffDocumentReplacementRequestEvent()` | `auditEventBuilder.ts` | Specialized action | `App\Actions\Staff\BuildDocumentReplacementAuditAction` |
| `buildStaffDocumentVerifyEvent()` | `auditEventBuilder.ts` | Specialized action | `App\Actions\Staff\BuildDocumentVerifyAuditAction` |
| `AuditEventValidationError` | `auditEventBuilder.ts` | Custom exception | `App\Exceptions\AuditEventValidationException` |
| `AUDIT_POLICY_VERSION` | `auditEventBuilder.ts` | Config constant | `config('audit.policy_version')` |

### Writer / repository layer

| TypeScript | File | Laravel/PHP concept | Laravel equivalent |
|-----------|------|--------------------|--------------------|
| `MockAuditWriter` interface | `mockAuditWriter.ts` | Repository interface | `App\Contracts\AuditWriterInterface` |
| `createMockAuditWriter()` | `mockAuditWriter.ts` | In-memory repository (test/stub) | `App\Repositories\MockAuditRepository` |
| `sharedMockAuditWriter` | `sharedMockWriter.ts` | Singleton service binding (test only) | `app()->instance(AuditWriterInterface::class, new MockAuditRepository())` |
| `MockAuditWriterError` | `mockAuditWriter.ts` | Custom exception | `App\Exceptions\AuditWriterException` |
| _(future)_ `PersistentAuditWriter` | _(not yet)_ | Eloquent repository | `App\Repositories\EloquentAuditRepository` |
| _(future)_ `AuditRepository` abstraction | _(not yet)_ | Repository interface | `App\Contracts\AuditRepositoryInterface` |

### Metadata / privacy layer

| TypeScript | File | Laravel/PHP concept | Laravel equivalent |
|-----------|------|--------------------|--------------------|
| `validateAuditMetadata()` | `auditMetadataRules.ts` | Policy / Guard | `App\Policies\AuditMetadataPolicy` |
| `FORBIDDEN_AUDIT_METADATA_KEYS` | `auditMetadataRules.ts` | Config / const | `config('audit.forbidden_metadata_keys')` |
| `SAFE_AUDIT_METADATA_KEYS` | `auditMetadataRules.ts` | Config / allowlist | `config('audit.safe_metadata_keys')` |
| `AuditMetadataValidationContext` | `auditMetadataRules.ts` | Policy context | Gate context / Policy data |

### Display / presenter layer

| TypeScript | File | Laravel/PHP concept | Laravel equivalent |
|-----------|------|--------------------|--------------------|
| `getAdminAuditDisplayRows()` | `adminAuditDisplayAdapter.ts` | Resource / Presenter | `App\Http\Resources\AdminAuditEventCollection` |
| `AdminAuditDisplayRow` | `adminAuditDisplayAdapter.ts` | Resource shape | `App\Http\Resources\AdminAuditDisplayResource` |
| `fixtureToRow()` | `adminAuditDisplayAdapter.ts` | Transformer for legacy shape | Part of Resource |
| `writerEventToRow()` | `adminAuditDisplayAdapter.ts` | Transformer for writer shape | Part of Resource |
| `DEMO_WRITER_EVENTS` | `adminAuditDisplayAdapter.ts` | Seeder data / factory state | `Database\Seeders\AuditEventSeeder` (demo only) |

### Page / controller layer

| TypeScript | File | Laravel/PHP concept | Laravel equivalent |
|-----------|------|--------------------|--------------------|
| `page.tsx` (Staff applications) | `src/app/staff/applications/[id]/page.tsx` | Controller action + View | `App\Http\Controllers\Staff\ApplicationController@show` + `Livewire\Staff\ApplicationDetail` |
| `onReject` callback | inside `page.tsx` | Controller action call → Service | `$this->auditService->recordDocumentRejection($input)` |
| `onRequestReplacement` callback | inside `page.tsx` | Controller action call → Service | `$this->auditService->recordReplacementRequest($input)` |
| `page.tsx` (Admin audit log) | `src/app/admin/audit-log/page.tsx` | Controller + View | `App\Http\Controllers\Admin\AuditLogController@index` |

### Check / test layer

| TypeScript | File | Laravel/PHP concept | Laravel equivalent |
|-----------|------|--------------------|--------------------|
| `check-audit-events.mjs` (42 checks) | `scripts/check-audit-events.mjs` | Feature/integration test | `Tests\Feature\AuditEventBuilderTest` |
| `addCheck()` pattern | `check-audit-events.mjs` | `it()` / `test()` in PHPUnit/Pest | `it('base builder creates required fields', ...)` |

---

## Proposed TypeScript Folder Boundaries (current → improved)

### Current flat structure (all in `src/lib/audit/`)

```
src/lib/audit/
├── auditTypes.ts          ← types/contracts
├── auditEventBuilder.ts   ← builder/factory
├── auditMetadataRules.ts  ← privacy/validation
├── mockAuditWriter.ts     ← writer implementation
├── sharedMockWriter.ts    ← singleton/di binding
├── adminAuditDisplayAdapter.ts  ← presenter
└── index.ts               ← public exports
```

### Proposed future structure (Laravel-aligned layers)

```
src/lib/audit/
├── types/
│   └── auditTypes.ts              ← AuditEvent, DTOs, enums
├── builders/
│   └── auditEventBuilder.ts       ← factory + specialized builders
├── validation/
│   └── auditMetadataRules.ts      ← privacy policy / allowlist guard
├── writers/
│   ├── AuditWriterInterface.ts    ← shared interface (contracts)
│   ├── mockAuditWriter.ts         ← mock implementation
│   └── sharedMockWriter.ts        ← singleton binding (test/dev only)
├── repository/
│   └── AuditRepository.ts         ← repository abstraction (AP-8)
├── presenters/
│   └── adminAuditDisplayAdapter.ts ← resource/presenter
├── services/
│   └── auditService.ts            ← orchestration (AP-8+)
└── index.ts                       ← public exports
```

This restructure can happen incrementally — files can be moved without changing content.
Move only when a new file needs to be created in the same conceptual folder.

---

## Equivalent Laravel Folder Boundaries

```
app/
├── Contracts/
│   └── AuditWriterInterface.php
│   └── AuditRepositoryInterface.php
├── Data/                             (Spatie Data or custom DTOs)
│   └── StaffDocumentAuditData.php
│   └── AuditEventData.php
├── Enums/
│   └── AuditEventType.php
│   └── AuditSeverity.php
│   └── AuditPersistenceMode.php
│   └── AuditPrivacyLevel.php
├── Actions/
│   └── BuildAuditEventAction.php
│   └── Staff/
│       └── BuildDocumentRejectAuditAction.php
│       └── BuildDocumentReplacementAuditAction.php
├── Policies/
│   └── AuditMetadataPolicy.php
├── Repositories/
│   └── MockAuditRepository.php        (test/stub)
│   └── EloquentAuditRepository.php    (future AP-8)
├── Services/
│   └── AuditService.php               (orchestration)
├── Http/
│   ├── Controllers/
│   │   ├── Staff/
│   │   │   └── ApplicationController.php
│   │   └── Admin/
│   │       └── AuditLogController.php
│   ├── Requests/
│   │   └── StoreAuditEventRequest.php
│   └── Resources/
│       └── AdminAuditEventResource.php
│       └── AdminAuditEventCollection.php
├── Models/
│   └── AuditEvent.php                 (future AP-8)
└── Exceptions/
    └── AuditEventValidationException.php
    └── AuditWriterException.php

database/
└── migrations/
    └── xxxx_create_audit_events_table.php    (future AP-8)

config/
└── audit.php        (policy_version, forbidden_keys, safe_keys, severity levels)

tests/
└── Feature/
    └── AuditEventBuilderTest.php
    └── AuditMetadataValidationTest.php
    └── StaffDocumentAuditTest.php
```

---

## Naming Conventions

| Category | TypeScript convention | Laravel/PHP convention |
|----------|----------------------|----------------------|
| Type/interface | PascalCase interface | PascalCase class/interface |
| Builder function | `buildStaffDocumentRejectEvent()` | `BuildDocumentRejectAuditAction::handle()` |
| Writer method | `writer.write(event)` | `$repository->store($event)` |
| Validation | `validateAuditMetadata(meta, ctx)` | `AuditMetadataPolicy::validate($meta, $context)` |
| Presenter | `getAdminAuditDisplayRows(logs)` | `AdminAuditEventCollection::make($logs)` |
| Error | `AuditEventValidationError` | `AuditEventValidationException` |
| Config constant | `AUDIT_POLICY_VERSION` | `config('audit.policy_version')` |
| Enum value | `'staff.document.reject'` string union | `AuditEventType::StaffDocumentReject` |

---

## Key Architecture Principles (from PROJELEARNT)

Mapping PROJELEARNT principles to S2IMS audit architecture:

| PROJELEARNT principle | S2IMS audit mapping |
|----------------------|-------------------|
| Route → Controller | `/staff/applications/[id]` page → Staff audit callback |
| FormRequest | `StaffDocumentAuditInput` / `BuildAuditEventInput` validation |
| Service layer | `auditService` orchestrates builder → writer → display |
| Policy | `validateAuditMetadata` / future `AuditMetadataPolicy` |
| Repository | `MockAuditWriter` interface → future `EloquentAuditRepository` |
| Model | `AuditEvent` DTO → future Eloquent `AuditEvent` model |
| Resource | `AdminAuditDisplayRow` / `adminAuditDisplayAdapter` |
| Event/Listener | Future: `AuditEventPersisted` event → notification/export listener |
| Config | `AUDIT_POLICY_VERSION`, `SAFE/FORBIDDEN_METADATA_KEYS` |
| Test | `check-audit-events.mjs` → PHPUnit/Pest feature tests |

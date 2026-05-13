# Audit Service/Repository Runtime Skeleton AP-8A Summary

## Overview

Implemented `AP-8A — Audit Service/Repository Runtime Skeleton` on branch `architecture/audit-service-repository-runtime-skeleton`.

This phase introduces a minimal runtime skeleton for the audit service/repository architecture defined in AP-8 contracts. It creates TypeScript interface files and lightweight implementations without changing current app behavior.

## Why AP-8A Exists

AP-8 defined concrete interface contracts but no runtime code. AP-8A validates those contracts by implementing skeleton classes and functions that:
- Prove the contract boundaries work in TypeScript
- Provide a foundation for future persistent storage implementations
- Enable isolated unit testing of audit logic
- Keep the current AP-6D mock writer behavior completely untouched

## Files Created

| File | Purpose |
|------|---------|
| `src/lib/audit/contracts/auditContracts.ts` | TypeScript interfaces: AuditEventFactoryContract, AuditWriterContract, AuditRepositoryContract, AuditPolicyGuardContract, AuditMetadataSanitizerContract, AuditDisplayPresenterContract, AuditCopyStageResolverContract, AuditServiceContract |
| `src/lib/audit/dto/auditDto.ts` | DTO types: AuditActorContextDto, AuditTargetContextDto, AuditActionContextDto, AuditEventInputDto, AuditWriteResultDto, AuditPaginatedResultDto, AuditListFiltersDto, AuditDisplayRowDto, AuditCsvRowDto |
| `src/lib/audit/repositories/inMemoryAuditRepository.ts` | InMemoryAuditRepository class implementing AuditRepositoryContract (append, findById, list, count, clear) |
| `src/lib/audit/policies/auditPolicy.ts` | Policy functions: canViewAuditEvent, canExportAuditEvents, canViewMetadata, maskTargetForRole, getPrivacyLevelLabel |
| `src/lib/audit/presenters/auditDisplayPresenter.ts` | AuditDisplayPresenter class implementing AuditDisplayPresenterContract (present, presentMany, toCsvRow) |
| `src/lib/audit/copy/auditCopyStage.ts` | Copy resolver: resolveCopyStage, getMockEvidenceWarning, isMockSafe, isRealPersisted |
| `src/lib/audit/services/auditService.ts` | AuditService class implementing AuditServiceContract with createAuditServiceForMockTesting factory |
| `docs/architecture/AUDIT_SERVICE_REPOSITORY_RUNTIME_SKELETON_AP8A_SUMMARY.md` | This document |

## Files Modified

| File | Change |
|------|--------|
| `src/lib/audit/index.ts` | Added exports for contracts, dto, services, repositories, policies, presenters, copy |
| `scripts/check-audit-events.mjs` | Added 7 AP-8A skeleton checks (total now 49) |
| `docs/architecture/NEXT_RENOVATION_STEPS.md` | Added AP-8A section with results and recommended next steps |

## Laravel/PHP-Inspired Mapping

| TypeScript Concept | Laravel/PHP Equivalent |
|--------------------|----------------------|
| `AuditEventFactoryContract` | `App\Factories\AuditEventFactory` |
| `AuditWriterContract` | `App\Contracts\Audit\AuditWriterInterface` |
| `AuditRepositoryContract` | `App\Repositories\Audit\AuditRepositoryInterface` |
| `AuditPolicyGuardContract` | `App\Policies\AuditPolicy` |
| `AuditMetadataSanitizerContract` | `App\Services\Audit\AuditMetadataSanitizer` |
| `AuditDisplayPresenterContract` | `App\Http\Resources\AuditEventResource` |
| `AuditCopyStageResolverContract` | `config/audit.php` copy_stages |
| `InMemoryAuditRepository` | `App\Repositories\Audit\InMemoryAuditRepository` |
| `AuditService` | `App\Services\Audit\AuditService` |

Folder structure:
```
app/
  Contracts/Audit/
    AuditWriterInterface.php
    AuditRepositoryInterface.php
  Data/Audit/
    AuditEventData.php
    AuditActorData.php
    AuditTargetData.php
  Services/Audit/
    AuditService.php
  Repositories/Audit/
    InMemoryAuditRepository.php
    DatabaseAuditRepository.php  (future)
  Policies/
    AuditPolicy.php
  Http/Resources/
    AuditEventResource.php
```

## DRY Boundaries Now Represented in Code

- **UI calls Service only** — page components import nothing from writer/repository/factory
- **Service orchestrates** — validates via policy, builds via factory, writes via writer
- **Writer delegates to Repository** — single storage touchpoint
- **Presenter handles display** — no display logic in service or repository
- **Policy enforces privacy** — role-based visibility separated from data access
- **Copy stage centralized** — one resolver, not scattered across components

## What Is Intentionally Not Wired Yet

- No page component uses the new `AuditService` — it is available for future refactoring
- `adminAuditDisplayAdapter.ts` remains the live display adapter
- `sharedMockWriter` remains the current AP-6D runtime path
- No Staff callback rewiring (AP-6D behavior preserved)
- No Admin audit log changes
- No reason validation changes
- No notification click implementation

## Validation Results

- `npm run build`: passed (40/40 routes, 0 type errors)
- `npm run check:tokens`: passed (4/4)
- `npm run check:audit-events`: passed (49/49)
- All 5 local routes verified returning 200 OK (pre-merge check)
- No hydration errors, no console errors

## Safety Confirmations

This implementation did not:

- Change runtime code in existing components
- Add real persistence or backend/API
- Create database migrations
- Mutate `src/data/mock/audit-logs.ts`
- Change reason validation
- Introduce `ReasonRequiredModal`
- Wire Staff verify action
- Change notification click behavior
- Modify `package.json`
- Start AP-8B, AP-8C, AP-9, or UX-N1

Existing behavior preserved:
- `adminAuditDisplayAdapter` still controls current Admin display
- `sharedMockWriter` remains current AP-6D runtime path
- All AP-6D mock audit wiring intact

## Recommended Next Step

Choose one:

**Option A — AP-8A-QA: Skeleton Review Pass**
Have a human reviewer verify the contract boundaries make sense, then begin wiring a single workflow (e.g., Staff document rejection) through the new service layer behind a feature flag.

**Option B — AP-8C: Refactor Audit Display to Presenter**
Replace `adminAuditDisplayAdapter.ts` usage with the new `AuditDisplayPresenter`, connecting it to a real repository read path.

**Option C — AP-8B: Audit Database Schema Plan**
Plan the `audit_events` table schema and Laravel migration, informed by the repository filter contract.

Recommended: **Option A** — validate contracts with a single wired workflow before broader refactoring.
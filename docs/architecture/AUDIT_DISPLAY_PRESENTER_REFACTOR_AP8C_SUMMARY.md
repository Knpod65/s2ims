# AP-8C Audit Display Presenter Refactor — Summary

**Completed on 2026-05-14.**

Branch:

`architecture/audit-display-presenter-refactor-ap8c`

## Overview

Refactored the Admin Audit Log display flow to use the AP-8A `AuditDisplayPresenter` layer as the single source of truth for all display formatting. This eliminates duplicated label construction, source badge logic, persistence formatting, and drawer detail assembly that previously lived across three files.

## Changes

### Files Modified (6 files)

| File | Change |
|------|--------|
| `src/lib/audit/contracts/auditContracts.ts` | Added `formattedTime`, `actorId`, `actorRole`, `sourceType`, `eventType`, `actionKey` fields to `AuditDisplayRow`. Added `AdminAuditDisplayRow` interface. Moved `CsvAuditRow` before `AuditDisplayPresenterContract`. |
| `src/lib/audit/auditTypes.ts` | Added `before`, `after`, `ip` optional fields to `AuditEvent` for legacy fixture carry-forward. |
| `src/lib/audit/presenters/auditDisplayPresenter.ts` | Enhanced to produce fully-populated display rows including formatted time, drawer detail fields, and source type. Moved helper functions to module-level exports for test use. |
| `src/lib/audit/adminAuditDisplayAdapter.ts` | Simplified — now composes raw AuditEvent objects from fixture logs and delegates all formatting to the presenter. Replaced inline `AuditRecordSource` type with contract's `AdminAuditDisplayRow`. |
| `src/app/admin/audit-log/page.tsx` | Uses presenter-formatted fields (`formattedTime`, `actorRoleLabel`, `actionLabel`, `targetLabel`, `source` discriminator) instead of raw field mapping. Removed duplicated time formatting, role label logic, and source label construction. |
| `src/components/admin/AdminAuditEventDetailDrawer.tsx` | Uses presenter-populated fields (`formattedTime`, `actorRoleLabel`, `actorLabel`, `actorId`, `source`, `severityLabel`, `eventType`, `actionLabel`) instead of duplicating format logic. Removes `useLang()` for time formatting (already done by presenter), retains it for EN/TH label toggles. |

### Files NOT Modified (forbidden or unnecessary)

- `src/data/mock/audit-logs.ts` — untouched
- `src/lib/audit/sharedMockWriter.ts` — untouched
- `src/lib/audit/mockAuditWriter.ts` — untouched
- `src/app/staff/applications/[id]/page.tsx` — untouched
- `src/components/staff/DocumentVerificationPanel.tsx` — untouched
- `package.json` — untouched
- All backend/API/database — untouched

## What Changed (Behavior)

**Nothing functionally changed.** All display output is identical:
- Same timestamps (now formatted by presenter's `_formatTime`)
- Same actor display names and role labels
- Same action labels (presenter uses same switch lookup)
- Same target tokens and privacy masking
- Same source badges (fixture vs writer)
- Same persistence/lifecycle labels
- Same drawer detail sections
- Same CSV export structure

## What Changed (Architecture)

- **Presenter is now the single formatting boundary** — `AuditDisplayPresenter.present()` produces a complete `AuditDisplayRow` with all display fields.
- **No duplicated label logic** — role labels, action labels, source labels, persistence labels, and severity labels exist in one place.
- **Adapter is thinner** — it composes raw AuditEvents from fixture logs and delegates to presenter via `presenter.present(event)`.
- **Page and drawer consume presenter output directly** — no inline date formatting, role label mapping, or string construction.

## Validation

- ✅ `npm run build`: passed 40/40, 0 type errors
- ✅ `npm run check:tokens`: passed 4/4
- ✅ `npm run check:audit-events`: passed 71/71
- ✅ `/login`: 200 OK
- ✅ `/admin/audit-log`: 200 OK
- ✅ `/admin/dashboard`: 200 OK
- ✅ `/staff/applications/app_001`: 200 OK
- ✅ `/staff/applications/app_002`: 200 OK
- ✅ Dev log: clean (no errors, warnings, hydration issues)

## Safety Confirmations

This refactor did not:
- Add real persistence
- Add backend/API behavior
- Create database migrations
- Mutate `src/data/mock/audit-logs.ts`
- Change Staff document action behavior
- Change Staff verify action
- Change reason validation
- Introduce `ReasonRequiredModal`
- Change notification click behavior
- Change routes
- Expose PII in routes, labels, CSV, drawer, metadata, or display output
- Remove or replace `sharedMockWriter`
- Replace AP-6D mock writer behavior
- Rewrite the whole Admin Audit page
- Start AP-8B, AP-8D, or AP-9

## Laravel/PHP Boundary

| Layer | TypeScript | Laravel/PHP equivalent |
|-------|-----------|----------------------|
| Presenter | `AuditDisplayPresenter` | `App\Http\Resources\AuditEventResource` |
| Output DTO | `AuditDisplayRow` / `AdminAuditDisplayRow` | Data transfer array |
| Contract | `AuditDisplayPresenterContract` | Interface in `App\Contracts` |
| Adapter | `adminAuditDisplayAdapter.ts` | Controller method |
| Copy stage | `resolveCopyStage()` | `config('audit.copy_stages')` + `lang/en/audit.php` |

## Recommended Next Step

After review merge, continue with:

- **AP-8B** — Database schema plan (persistence readiness)
- **AP-6D Runtime** — Staff document mock audit wiring (unblocked by this refactor)
- **AP-8C-QA** — Human browser review of Admin audit log display
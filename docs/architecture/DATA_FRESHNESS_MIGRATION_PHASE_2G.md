# S²IMS Data Freshness Status Runtime Migration — Phase 2G

**Phase:** 2G — Data Freshness Status Runtime Migration
**Branch:** audit/architecture-renovation-plan
**Date:** 2026-05-11
**Status:** Runtime migration complete for the data freshness domain only.

---

## Scope

Phase 2G migrated only the low-risk data freshness status domain.

Included keys:
- `fresh`
- `stale`
- `failed`

Skipped domains:
- Application statuses
- Document statuses
- Scholarship statuses
- Shortlist and disclosure statuses
- Audit and security risk statuses
- Announcement, OCR, admin, eligibility, and matching-adjacent statuses

No routes, auth logic, role guards, navigation, disclosure behavior, export behavior,
backend/API/database behavior, or major components were changed.

---

## Files Inspected

- `docs/architecture/STATUS_USAGE_INVENTORY_PHASE_2F.md`
- `docs/architecture/STATUS_MIGRATION_PLAN_PHASE_2F.md`
- `src/config/statuses.ts`
- `src/data/mock/staffData.ts`
- `src/data/mock/studentMatchingData.ts`
- `src/data/mock/providerData.ts`
- `src/components/student/DataFreshnessIndicator.tsx`
- `src/components/provider/ProviderDataFreshnessIndicator.tsx`
- `src/components/staff/MatchReviewCard.tsx`
- `src/app/provider/impact/page.tsx`
- Student pages that render `DataFreshnessIndicator`
- `src/app/staff/matching-review/page.tsx`

---

## Files Changed

- `src/config/statusHelpers.ts`
- `src/data/mock/staffData.ts`
- `src/components/staff/MatchReviewCard.tsx`
- `src/components/student/DataFreshnessIndicator.tsx`
- `src/components/provider/ProviderDataFreshnessIndicator.tsx`
- `docs/architecture/DATA_FRESHNESS_MIGRATION_PHASE_2G.md`

---

## Before / After Status Keys

Before:

| Source | Keys |
|---|---|
| `src/config/statuses.ts` | `fresh`, `stale`, `failed` |
| `src/data/mock/providerData.ts` | `fresh`, `stale`, `failed` |
| `src/data/mock/studentMatchingData.ts` | `fresh`, `stale`, `failed` |
| `src/data/mock/staffData.ts` | `current`, `stale` |

After:

| Source | Keys |
|---|---|
| `src/config/statuses.ts` | `fresh`, `stale`, `failed` |
| `src/data/mock/providerData.ts` | `fresh`, `stale`, `failed` |
| `src/data/mock/studentMatchingData.ts` | `fresh`, `stale`, `failed` |
| `src/data/mock/staffData.ts` | `fresh`, `stale`, `failed` |

Staff mock records using `dataFreshness: 'current'` were normalized to
`dataFreshness: 'fresh'`. `MatchReviewCard` now checks for `fresh` and still renders the
same user-facing "Current" / "ปัจจุบัน" copy as before.

---

## Helper Function Decision

Added `src/config/statusHelpers.ts` with:

- `getStatusConfig(domain, status)`
- `getStatusLabel(domain, status, lang)`
- `getStatusTone(domain, status)`
- `isTerminalStatus(domain, status)`
- `requiresAction(domain, status)`

Only the data freshness indicators were wired to the helper in this phase.

The student and provider freshness indicators still retain their existing local display
labels and classes because their current surface-specific copy and visual treatment are
not identical to `DATA_FRESHNESS_STATUSES`. The helper is used as the centralized config
lookup and fallback source without changing the rendered UI.

---

## Behavior Unchanged

The migration is intended to be behavior-identical:

- Student freshness labels remain `Fresh`, `Stale`, and `Sync failed` in English, with
  existing Thai labels preserved.
- Provider freshness fallback labels remain `Fresh`, `Needs sync`, and `Sync unavailable`
  in English, with existing Thai labels preserved.
- Provider supplied `label_en` / `label_th` values still take precedence.
- Existing icon choices and badge classes are preserved.
- Staff matching review still displays fresh data as `Current` / `ปัจจุบัน`.

---

## QA Checklist

- Confirm `staffData.ts` no longer uses `dataFreshness: 'current'`.
- Confirm staff matching review fresh rows still render as `Current` / `ปัจจุบัน`.
- Confirm student freshness badges retain their existing labels, icons, timestamp, and colors.
- Confirm provider freshness badge still prefers supplied sync labels.
- Run `npm run build`.
- Run `npm run check:tokens`.
- Search remaining freshness/current occurrences:
  `rg "'current'|dataFreshness|fresh|stale|failed" src/data/mock src/components src/app`.

---

## Next Recommended Phase

Recommended next phase: Phase 2H, migrate `shortlistRequest` status display only after
confirming whether the user-facing declined label should remain `Declined` or adopt the
central config label `Not approved`.

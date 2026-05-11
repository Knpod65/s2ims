# S²IMS Shortlist Request Status Display Migration — Phase 2H

**Phase:** 2H — Shortlist Request Status Display Migration
**Branch:** audit/architecture-renovation-plan
**Date:** 2026-05-11
**Status:** Runtime display migration complete for provider shortlist request badges only.

---

## Scope

Phase 2H migrated only provider-facing shortlist request status badge display.

Included keys:
- `none`
- `pending_staff_approval`
- `approved`
- `declined`

Skipped domains:
- Application statuses
- Document statuses
- Scholarship statuses
- Disclosure statuses
- Audit and security risk statuses
- Data freshness statuses
- Announcement, OCR, admin, eligibility, and matching-adjacent statuses

No routes, auth logic, role guards, navigation, disclosure behavior, export behavior,
shortlist request behavior, reason validation behavior, backend/API/database behavior,
or major components were changed.

---

## Files Inspected

- `src/components/provider/ShortlistStatusBadge.tsx`
- `src/components/provider/AnonymousCandidateCard.tsx`
- `src/components/provider/CandidatePoolTable.tsx`
- `src/components/provider/ShortlistConfirmationCard.tsx`
- `src/data/mock/providerData.ts`
- `src/config/statuses.ts`
- `src/config/statusHelpers.ts`
- Provider pages that count or render shortlist request statuses
- Staff disclosure files were identified in search output and intentionally skipped

---

## Files Changed

- `src/components/provider/ShortlistStatusBadge.tsx`
- `src/config/statuses.ts`
- `docs/architecture/SHORTLIST_STATUS_MIGRATION_PHASE_2H.md`

---

## Status Keys Preserved

No shortlist status keys were changed.

The provider mock data continues to use:
- `none`
- `pending_staff_approval`
- `approved`
- `declined`

The internal rejection key remains `declined`.

---

## Label Decision

Product decision:

| Key | Provider-facing EN label | Provider-facing TH label |
|---|---|---|
| `declined` | `Not approved` | `ไม่อนุมัติ` |

The previous provider badge showed `declined` as `Declined` in English. Phase 2H
normalizes that display label to the centralized config label `Not approved`.

To preserve existing provider display behavior for the other active statuses, the
shortlist config labels were aligned with the previous badge copy:

| Key | Label |
|---|---|
| `none` | `Not requested` / `ยังไม่ขอ` |
| `pending_staff_approval` | `Pending Staff Approval` / `รออนุมัติจากเจ้าหน้าที่` |
| `approved` | `Approved` / `อนุมัติแล้ว` |

---

## Before / After Behavior

Before:
- `ShortlistStatusBadge` used a local inline status config for labels and styles.
- `declined` rendered as `Declined` / `ไม่อนุมัติ`.

After:
- `ShortlistStatusBadge` uses `getStatusLabel()` and `getStatusTone()` from
  `src/config/statusHelpers.ts`.
- `declined` renders as `Not approved` / `ไม่อนุมัติ`.
- Existing pill shape, dot, neutral style, warm warning style, and emerald approved
  style are preserved.

Behavior unchanged except for the approved wording normalization for `declined`.

---

## QA Checklist

- Confirm provider candidate table still renders shortlist badges.
- Confirm anonymous candidate cards still hide the badge when `shortlistStatus === 'none'`.
- Confirm shortlist confirmation card still renders `pending_staff_approval`.
- Confirm `declined` uses the key `declined` but displays `Not approved` / `ไม่อนุมัติ`.
- Confirm shortlist request modal behavior and reason validation were not changed.
- Run `npm run build`.
- Run `npm run check:tokens`.
- Search remaining shortlist references:
  `rg "ShortlistStatusBadge|shortlistStatus|pending_staff_approval|declined|Not approved|Declined" src/components src/app src/data/mock src/config`

---

## Next Recommended Phase

Recommended next phase: Phase 2I, migrate scholarship status display only after deciding
whether provider-context `ACTIVE` should keep role-tint styling or adopt the centralized
emerald tone.

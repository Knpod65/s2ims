# S²IMS Candidate Pool Status Display Migration — Phase 2J

**Phase:** 2J — Provider Candidate Pool Status Decision & Display Migration
**Branch:** audit/architecture-renovation-plan
**Date:** 2026-05-11
**Status:** Runtime display migration complete for provider candidate pool status display only.

---

## Scope

Phase 2J migrated only provider candidate pool status display.

Included candidate pool keys:
- `not_available`
- `ready`
- `pending_staff_approval`

Skipped domains:
- Application statuses
- Document statuses
- Public scholarship statuses
- Provider scholarship status display beyond existing Phase 2I helpers
- Shortlist statuses
- Disclosure statuses
- Audit and security risk statuses
- Data freshness statuses

No routes, auth logic, role guards, navigation, disclosure behavior, export behavior,
provider form behavior, candidate selection logic, backend/API/database behavior, or major
components were changed.

---

## Files Inspected

- `src/data/mock/providerData.ts`
- `src/components/provider/ProviderScholarshipCard.tsx`
- `src/components/provider/CandidatePoolSummary.tsx`
- `src/components/provider/ProviderDashboardSummary.tsx`
- `src/app/provider/candidates/page.tsx`
- `src/app/provider/scholarships/[scholarshipId]/edit/page.tsx`
- `src/app/provider/scholarships/[scholarshipId]/criteria/page.tsx`
- `src/config/statuses.ts`
- `src/config/statusHelpers.ts`

---

## Files Changed

- `src/config/statuses.ts`
- `src/components/provider/ProviderScholarshipCard.tsx`
- `docs/architecture/CANDIDATE_POOL_STATUS_MIGRATION_PHASE_2J.md`

---

## Domain Decision

Candidate pool status is a separate status domain.

It was not merged with shortlist request status, even though both domains can contain the
key `pending_staff_approval`, because the semantics are different:

- Candidate pool status describes provider access to an anonymized candidate pool.
- Shortlist request status describes governance review of a provider shortlist request.

Added config domain:

- `candidatePool`

---

## Status Keys Preserved

No candidate pool status keys were changed.

Provider mock data continues to use:
- `not_available`
- `ready`
- `pending_staff_approval`

---

## Labels And Tones

| Key | EN label | TH label | Tone |
|---|---|---|---|
| `not_available` | `Not available` | `ยังไม่พร้อม` | neutral/muted |
| `ready` | `Ready` | `พร้อมใช้งาน` | role-aware emerald/success |
| `pending_staff_approval` | `Pending staff review` | `รอเจ้าหน้าที่ตรวจสอบ` | warm amber |

`ready` keeps provider role-aware styling through role tokens instead of hard-coded emerald.

---

## Before / After Behavior

Before:
- Provider scholarship cards rendered candidate pool display with local `ready` vs locked copy.
- `ready` controlled candidate pool access.
- Non-ready statuses stayed locked.

After:
- Provider scholarship cards read candidate pool labels and tones from centralized status config.
- `ready` still controls candidate pool access.
- `not_available` and `pending_staff_approval` still keep the pool locked.
- Filtering, links, disabled buttons, criteria behavior, edit behavior, and candidate selection
  behavior were not changed.

Behavior is unchanged except for display wording/style centralization in the provider scholarship
card candidate pool block.

---

## Skipped Logic

The following logic was intentionally not changed:

- `readyScholarships` / `lockedScholarships` filtering
- `candidatePoolStatus === 'ready'` access checks
- Criteria builder behavior
- Provider scholarship form behavior
- Candidate pool selector behavior
- Candidate selection behavior
- Shortlist request behavior

---

## QA Checklist

- Confirm provider scholarship cards show candidate pool status labels from config.
- Confirm `ready` pools still show the Candidates link.
- Confirm `not_available` and `pending_staff_approval` pools still show locked controls.
- Confirm provider candidate selector still separates ready and locked scholarships.
- Confirm criteria and edit pages still show the Candidates action only for `ready`.
- Run `npm run build`.
- Run `npm run check:tokens`.
- Search remaining candidate pool references:
  `rg "CandidatePoolStatus|candidatePoolStatus|not_available|ready|pending_staff_approval|readyScholarships|lockedScholarships" src/components src/app src/data/mock src/config`

---

## Next Recommended Phase

Recommended next phase: Phase 2K, migrate one additional low-risk provider-only display domain
or pause status migrations and review the accumulated helper/config pattern before touching
higher-risk application, document, disclosure, or audit domains.

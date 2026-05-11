# S²IMS Renovation Branch Review Package — Phase 2L

**Phase:** 2L — Prepare PR / Merge Review Package
**Branch:** `audit/architecture-renovation-plan`
**Date:** 2026-05-11
**Status:** Documentation/review package only. No runtime code changed in this phase.

---

## Purpose

The renovation branch documents the current S²IMS prototype architecture, adds low-risk
read-only configuration foundations, centralizes token formatting, defines privacy and governance
guardrails, and proves a small status-config migration pattern on low-risk provider/status
surfaces.

The branch should be reviewed before merging or continuing higher-risk runtime migrations.

---

## Commit Summary

| Commit | Summary |
|---|---|
| `37eb0fb` | Add architecture renovation audit and plan |
| `5dfdac8` | Add Phase 1 architecture maps |
| `eb8f9d6` | Add read-only role/status/privacy config |
| `03e23bf` | Inventory config usage for renovation |
| `0d0d937` | Centralize token formatting utilities |
| `b55b3bc` | Define token formatting policy and checks |
| `c082787` | Inventory sensitive action reason rules |
| `577adcd` | Plan status config migration |
| `e579a37` | Centralize data freshness status handling |
| `2cfc1b0` | Centralize shortlist status display |
| `6169b0b` | Centralize provider scholarship status display |
| `613a5a3` | Centralize candidate pool status display |
| `7470a7d` | Review status migration pattern |

---

## What Changed By Category

### Architecture Docs

Added or expanded architecture review and planning docs:

- `ARCHITECTURE_RENOVATION_AUDIT.md`
- `RENOVATION_PLAN.md`
- `docs/architecture/ROUTE_MAP.md`
- `docs/architecture/COMPONENT_INVENTORY.md`
- `docs/architecture/ROLE_PERMISSION_MAP.md`
- `docs/architecture/PDPA_DATA_EXPOSURE_MAP.md`
- `docs/architecture/DATA_ACCESS_MAP.md`
- `docs/architecture/NEXT_RENOVATION_STEPS.md`
- Phase-specific migration and review docs from 2B through 2K.

### Read-Only Configs

Added read-only config foundations:

- `src/config/roles.ts`
- `src/config/privacy.ts`
- `src/config/sensitiveActions.ts`
- `src/config/exportAllowlist.ts`
- `src/config/statuses.ts`
- `src/config/statusHelpers.ts`

These files document policy/config intent and are only lightly wired into low-risk runtime
surfaces.

### Token Formatting Utilities

Added centralized token format config and utilities:

- `src/config/tokenFormats.ts`

Updated token formatting call sites in staff application detail behavior where appropriate.

### Token Check Script

Added lightweight token output checks:

- `scripts/check-token-formats.mjs`
- `npm run check:tokens`

### Sensitive Action Policy Docs

Added governance policy docs:

- `docs/architecture/SENSITIVE_ACTION_REASON_INVENTORY_PHASE_2E.md`
- `docs/architecture/SENSITIVE_ACTION_POLICY_PHASE_2E.md`
- `docs/architecture/REASON_REQUIRED_MODAL_PROPOSAL_PHASE_2E.md`

No sensitive action modal behavior was changed.

### Status Migration Plans

Added status inventory and migration guidance:

- `docs/architecture/STATUS_USAGE_INVENTORY_PHASE_2F.md`
- `docs/architecture/STATUS_MIGRATION_PLAN_PHASE_2F.md`
- `docs/architecture/STATUS_MIGRATION_REVIEW_PHASE_2K.md`
- `docs/architecture/STATUS_HELPER_PATTERN_PHASE_2K.md`

### Runtime Status Migrations 2G-2J

Completed low-risk runtime display migrations:

- 2G — `dataFreshness`
- 2H — `shortlistRequest`
- 2I — provider scholarship display using the `scholarship` domain
- 2J — `candidatePool`

Higher-risk domains are intentionally not migrated.

---

## Files Created / Modified Summary

High-level file summary from `main..audit/architecture-renovation-plan`:

- Added architecture and renovation docs.
- Added `src/config/*` read-only config files.
- Added `src/config/statusHelpers.ts`.
- Added token format checks and `npm run check:tokens`.
- Modified a small number of runtime components for token formatting and low-risk status display.
- Modified `src/data/mock/staffData.ts` to normalize freshness key `current` to `fresh`.

Runtime component files touched by status migration:

- `src/components/student/DataFreshnessIndicator.tsx`
- `src/components/provider/ProviderDataFreshnessIndicator.tsx`
- `src/components/staff/MatchReviewCard.tsx`
- `src/components/provider/ShortlistStatusBadge.tsx`
- `src/components/provider/ProviderScholarshipCard.tsx`

---

## Runtime Behavior Changes

Intentional low-risk runtime changes:

- `dataFreshness` staff mock/status logic normalized from `current` to `fresh`; displayed
  staff copy remains `Current` / `ปัจจุบัน`.
- Provider shortlist status key `declined` still stays `declined`, but provider-facing label
  is now `Not approved` / `ไม่อนุมัติ`.
- Provider scholarship status display now reads labels/tones through status helpers while
  preserving role-aware `ACTIVE` styling and existing provider label overrides.
- Provider candidate pool status display now reads from a dedicated `candidatePool` config
  domain; `ready` still controls access.

No approval, disclosure, export, routing, or auth behavior was changed.

---

## Explicitly Not Changed

The branch does not change:

- Auth behavior or localStorage role behavior.
- Route structure.
- Role guards.
- Navigation behavior.
- Backend/API/database behavior.
- Export behavior.
- Disclosure workflow.
- Staff approval workflow.
- Provider privacy boundary logic.
- Provider candidate selection logic.
- Provider form behavior.
- Public scholarship status behavior.
- Application/document/disclosure/audit/security status systems.

---

## Build And Checks

Latest validation before Phase 2L:

- `npm run build` — passed.
- `npm run check:tokens` — passed.

Reviewers should rerun these after rebasing or merging latest `main`.

---

## Risks

- The branch is documentation-heavy but now includes several runtime display migrations.
- Status helper usage is adapter-based and not yet unit tested.
- Tone-to-class mapping is still local to components, not centralized.
- Higher-risk status domains remain unmigrated and have known label/tone/key mismatches.
- Client-only auth and mock governance remain prototype limitations.
- No automated smoke or screenshot tests exist.

---

## Suggested Reviewer Checklist

- Confirm docs are useful and not misleading.
- Confirm config files are read-only foundations and do not imply production enforcement.
- Review token formatting utilities and token check script.
- Review low-risk status migrations for behavior preservation.
- Verify provider candidate pool still shows anonymized/token-only data.
- Confirm no application/document/disclosure/audit/security migration slipped in.
- Confirm `npm run build` passes.
- Confirm `npm run check:tokens` passes.
- Review `STATUS_MIGRATION_REVIEW_PHASE_2K.md` before approving any next runtime migration.

---

## Suggested Merge Strategy

Recommended strategy:

1. Pull latest `main`.
2. Rebase `audit/architecture-renovation-plan` onto latest `main` if conflicts are small.
3. If rebase creates noisy doc conflicts, merge latest `main` into the renovation branch instead.
4. Run the merge checklist in `RENOVATION_MERGE_CHECKLIST_PHASE_2L.md`.
5. Open PR from `audit/architecture-renovation-plan` to `main`.
6. Prefer squash merge only if the team does not need phase-by-phase history.
7. Prefer regular merge if preserving the renovation audit trail is valuable.

Recommended next action: open PR / merge review before more runtime migration.

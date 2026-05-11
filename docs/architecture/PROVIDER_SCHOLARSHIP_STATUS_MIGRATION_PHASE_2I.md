# S²IMS Provider Scholarship Status Display Migration — Phase 2I

**Phase:** 2I — Provider Scholarship Status Display Migration
**Branch:** audit/architecture-renovation-plan
**Date:** 2026-05-11
**Status:** Runtime display migration complete for provider scholarship status badges only.

---

## Scope

Phase 2I migrated only provider-facing scholarship status display helpers used by provider
scholarship cards and provider candidate scholarship badges.

Included provider keys:
- `DRAFT`
- `PENDING_REVIEW`
- `ACTIVE`
- `CLOSED`

Skipped domains:
- Application statuses
- Document statuses
- Public scholarship statuses
- Student scholarship pages
- Shortlist and disclosure statuses
- Audit and security risk statuses
- Data freshness statuses
- Candidate pool status logic

No routes, auth logic, role guards, navigation, disclosure behavior, export behavior,
provider form behavior, backend/API/database behavior, or major components were changed.

---

## Files Inspected

- `src/components/provider/ProviderScholarshipCard.tsx`
- `src/app/provider/scholarships/page.tsx`
- `src/app/provider/candidates/page.tsx`
- `src/components/provider/ProviderDashboardSummary.tsx`
- `src/data/mock/providerData.ts`
- `src/config/statuses.ts`
- `src/config/statusHelpers.ts`
- Provider scholarship criteria and edit pages that read `candidatePoolStatus`

---

## Files Changed

- `src/components/provider/ProviderScholarshipCard.tsx`
- `docs/architecture/PROVIDER_SCHOLARSHIP_STATUS_MIGRATION_PHASE_2I.md`

---

## Status Keys Preserved

No provider scholarship status keys were changed.

Provider mock data continues to use:
- `DRAFT`
- `PENDING_REVIEW`
- `ACTIVE`
- `CLOSED`

`candidatePoolStatus` was inspected but not changed.

---

## ACTIVE Style Decision

Product/style decision:

`ACTIVE` keeps provider role-aware Trust Emerald styling:

- `bg-role-tint`
- `text-role-primary`
- `border-role-border`

This intentionally does not hard-code emerald utility classes because provider surfaces
should keep role-aware styling.

---

## Before / After Behavior

Before:
- `ProviderScholarshipCard.tsx` exported local `scholarshipStatusLabel()` and
  `scholarshipStatusColor()` helpers with inline status maps.

After:
- The exported helpers remain available for existing provider call sites.
- Labels and tones are read from `src/config/statusHelpers.ts`.
- A tiny provider adapter preserves existing Thai provider labels where they intentionally
  differ from the shared scholarship config.
- `ACTIVE` keeps role-aware Trust Emerald styling.
- `PENDING_REVIEW` keeps warm amber/audit styling.
- `DRAFT` remains neutral/muted.
- `CLOSED` remains neutral/muted.

Behavior is unchanged.

---

## QA Checklist

- Confirm provider scholarship cards still show status badges with dots.
- Confirm provider scholarship filter chips still use existing labels.
- Confirm provider candidate scholarship badges still render status labels and colors.
- Confirm `ACTIVE` uses role-aware styling, not hard-coded emerald.
- Confirm `PENDING_REVIEW` uses warm amber.
- Confirm `DRAFT` and `CLOSED` remain neutral/muted.
- Confirm candidate pool, criteria, shortlist, and provider form behavior were not changed.
- Run `npm run build`.
- Run `npm run check:tokens`.
- Search remaining provider scholarship references:
  `rg "ProviderScholarshipStatus|scholarshipStatusLabel|scholarshipStatusColor|PENDING_REVIEW|ACTIVE|DRAFT|CLOSED|candidatePoolStatus" src/components src/app src/data/mock src/config`

---

## Next Recommended Phase

Recommended next phase: Phase 2J, review whether provider candidate pool status display
should remain separate from centralized status config or get its own small config domain.

# S²IMS Status Helper Pattern — Phase 2K

**Phase:** 2K — Status Helper Pattern Review
**Branch:** audit/architecture-renovation-plan
**Date:** 2026-05-11
**Status:** Documentation/review only.

---

## Purpose

This document captures the status helper/config pattern that emerged during Phases 2G-2J.
It should guide future migrations without forcing high-risk domains to migrate too early.

---

## Current Helpers

Use helpers from `src/config/statusHelpers.ts`:

- `getStatusConfig(domain, status)`
- `getStatusLabel(domain, status, lang)`
- `getStatusTone(domain, status)`
- `isTerminalStatus(domain, status)`
- `requiresAction(domain, status)`

The helpers read from `STATUS_GROUPS` in `src/config/statuses.ts`.

---

## How To Use The Helpers

Use `getStatusConfig(domain, status)` when a component needs the full config object or wants
to validate that a key exists.

Example from Phase 2G:

```ts
const statusConfig = getStatusConfig('dataFreshness', freshness.status)
```

Use `getStatusLabel(domain, status, lang)` when the component can safely use the centralized
label.

Example from Phase 2H:

```ts
const label = getStatusLabel('shortlistRequest', status, lang === 'th' ? 'th' : 'en')
```

Use `getStatusTone(domain, status)` when the component already has an adapter from semantic
tone to its existing classes.

Example from Phase 2I and 2J:

```ts
const tone = getStatusTone('scholarship', status)
```

Do not use `isTerminalStatus` or `requiresAction` to change runtime behavior until that behavior
has its own approved phase and test/QA plan.

---

## When An Adapter Is Acceptable

Adapters are acceptable when:

- The internal status key is correct but the surface needs role-specific wording.
- The shared tone is correct but a role-aware token must be preserved.
- The component already has stable visual classes that must remain behavior-identical.
- The migration is intentionally display-only.

Examples:

- Phase 2G kept student/provider freshness surface labels as local fallbacks while using config
  lookup to validate status keys.
- Phase 2I preserved provider Thai labels for `DRAFT`, `ACTIVE`, and `CLOSED`.
- Phase 2I preserved `ACTIVE` role-aware styling with `bg-role-tint text-role-primary border-role-border`.
- Phase 2J mapped candidate pool `ready` to role-aware provider styling even though the config tone
  is `emerald`.

Adapter rule:

- The adapter may translate config label/tone into existing display.
- The adapter must not change status keys, access logic, approval logic, disclosure behavior, or
  export behavior.

---

## When Not To Use Config Yet

Do not wire config into a runtime component when:

- The config label differs from current UI and the product decision is not approved.
- The status key conventions are incompatible.
- The status controls behavior, not just display.
- The status affects disclosure, audit, export, eligibility, or student-facing rejection wording.
- The component has no screenshot QA coverage and a visual change would be hard to detect.
- The status domain is page-local/prototype-only and may not deserve shared config.

Examples to delay:

- Application statuses: uppercase shared config and lowercase student states do not align.
- Document statuses: role-specific rejected/needs-replacement wording must be decided first.
- Disclosure statuses: rejected/not-approved wording affects governance and privacy.
- Audit risk statuses: `critical` handling is incomplete and tone policy is not settled.
- OCR job statuses: may be page-local rather than shared persistence status.

---

## Preserving Role-Aware Styling

Shared config should describe semantic tone, not always exact classes.

Use role-aware classes when a role surface already depends on them:

- `bg-role-tint`
- `text-role-primary`
- `border-role-border`

Examples:

- Provider scholarship `ACTIVE` keeps role-aware Trust Emerald styling.
- Candidate pool `ready` keeps role-aware provider success styling.

Avoid replacing role-aware classes with hard-coded emerald utilities unless product/design
explicitly approves the visual change.

---

## Product Wording Overrides

Some labels are product decisions, not technical duplication.

Use overrides when:

- The same status needs different role-specific wording.
- A shared config label is technically correct but too harsh or too vague for a surface.
- The current UI copy has been approved and the migration must be behavior-identical.

Examples:

- Phase 2I keeps provider Thai `DRAFT` as `ร่าง` rather than shared `ฉบับร่าง`.
- Phase 2I keeps provider Thai `ACTIVE` as `เปิดใช้งาน` rather than shared `ใช้งานอยู่`.
- Phase 2G keeps freshness display copy per surface.

Document every override in the phase migration doc.

---

## Stable Internal Keys With Changed Labels

Changing display labels is safer than changing keys.

Pattern:

1. Keep the internal key unchanged.
2. Update or use config label for the approved product wording.
3. Verify data, filters, and behavior still use the original key.
4. Document the key/label split.

Example:

- Phase 2H kept `declined` as the internal shortlist key.
- Provider-facing label changed to `Not approved` / `ไม่อนุมัติ`.
- Shortlist behavior and data shape did not change.

---

## Tone To Class Mapping

Current state:

- Tone-to-class mapping is still local to components/adapters.
- This is acceptable while migrations are small and visual preservation matters.

Future option:

- Introduce a shared `badgeToneToClass()` only after reviewing all active tones and role-aware
  exceptions.

Do not centralize tone classes prematurely if it would erase role-specific styling or change
existing badge colors.

---

## Examples From 2G-2J

### Data Freshness

Pattern:

- Use `getStatusConfig('dataFreshness', status)` for config validation/fallback.
- Keep surface-specific labels and classes.
- Normalize mismatched mock key from `current` to `fresh`.

Why:

- Provider and student freshness badges have different display copy and colors.

### Shortlist Request

Pattern:

- Use `getStatusLabel('shortlistRequest', status, lang)`.
- Use `getStatusTone('shortlistRequest', status)` with a local style adapter.
- Preserve key `declined`.

Why:

- The approved product change was label-only: `Declined` to `Not approved`.

### Provider Scholarship

Pattern:

- Reuse exported `scholarshipStatusLabel()` and `scholarshipStatusColor()` for existing call sites.
- Internally delegate to config helpers.
- Add provider label overrides and role-aware style preservation.

Why:

- Provider pages already import these helpers, so this avoided a broad call-site migration.

### Candidate Pool

Pattern:

- Add a new `candidatePool` domain.
- Do not reuse `shortlistRequest`.
- Use config labels/tones for provider scholarship card display.
- Leave access checks as `candidatePoolStatus === 'ready'`.

Why:

- Candidate pool availability and shortlist governance are different concepts, even when both use
  `pending_staff_approval`.

---

## Preflight Checklist For Future Status Migrations

- Inventory all keys and display call sites with `rg`.
- Confirm the config domain exists and labels match current UI or approved product wording.
- Confirm whether keys are display-only or behavior-gating.
- Preserve internal keys unless a key migration is explicitly approved.
- Decide whether role-aware styling must remain.
- Add or update phase documentation.
- Run `npm run build`.
- Run `npm run check:tokens`.
- Search the migrated domain after changes and document remaining acceptable occurrences.

---

## Recommended Next Step

Recommended next phase: **Phase 2L — Pause renovation branch and prepare PR/merge review**.

The helper pattern is now established enough to review. Higher-risk domains should wait until
reviewers agree on the adapter pattern, product wording policy, and QA expectations.

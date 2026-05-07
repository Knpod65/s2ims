# Phase 4 Carry-Forward Notes

## Reuse Rules

- `MatchScoreRing` will be reused in Provider candidate cards, but the role gradient should become Trust Emerald automatically through `--role-gradient` / role CSS variables.
- `StatusBadge` should be reused on Provider candidate and status surfaces.
- `AuditWarningCard` should be reused for Provider export and disclosure-sensitive actions.
- The mobile sticky CTA pattern carries forward to Provider mobile views:
  - `bottom-[calc(48px+env(safe-area-inset-bottom))]`
  - keep actions at least 44px tall.

## Import Boundaries

- Provider must not import student-internal components such as:
  - `ApplicationTimeline`
  - `MissingDataPrompt`
  - `RequiredDocumentsList`
  - any other component from `src/components/student/*`
- Provider-specific UI should use shared primitives or Provider-owned components.

## Privacy Boundaries

- Provider candidate pool must show `Candidate #C-XXXX` only.
- Provider must never see student identity before staff disclosure approval.
- Provider surfaces must not expose student profile details, raw identity, internal scoring internals, or staff-only disclosure workflow controls.

## Manual Boundary Check

Current manual check:

`rg "components/student|@/components/student|\\.\\./.*components/student" src/app/provider src/components/provider`

Expected result: no matches.

An ESLint `no-restricted-imports` rule could enforce this boundary later, but it should be approved before implementation because it may affect build/lint behavior across existing role folders.

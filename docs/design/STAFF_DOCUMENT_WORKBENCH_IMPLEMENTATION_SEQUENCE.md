# Staff Document Workbench Implementation Sequence

Date: 2026-05-11
Scope: phased runtime recommendation. No runtime changes in this planning branch.

## Guiding Rule

Staff document review is higher risk than the Student refresh. Runtime work should be phased so each slice can be reviewed, screenshot-tested, and rolled back independently.

## Phase SW-1: Layout-Only Workbench Shell

Goal:

- Wrap the current staff application detail content in a workbench layout.
- Compose the existing `DocumentVerificationPanel` without changing its internals.

Likely files touched:

- `src/app/staff/applications/[id]/page.tsx`
- optional new shell component under `src/components/staff/`
- QA docs under `docs/qa/staff-document-evidence-workbench/`

Must not touch:

- `DocumentVerificationPanel` behavior
- document status keys
- callbacks
- mock data
- identity reveal logic
- application status update logic
- staff notes logic

Validation:

- `npm run build`
- `npm run check:tokens`
- route checks for `/staff/applications/app_001` and `/staff/applications/app_002`
- desktop/mobile/Thai screenshot QA

Rollback:

- Restore previous page layout.
- Remove shell component and QA artifacts if necessary.

## Phase SW-2: Extract Action Rail From `DocumentVerificationPanel`

Goal:

- Move verify/reject/replacement controls into a `DocumentActionRail` while preserving callbacks and action availability.

Likely files touched:

- `src/components/staff/DocumentVerificationPanel.tsx`
- `src/components/staff/DocumentActionRail.tsx`
- possibly `src/components/staff/VerificationDecisionPanel.tsx`
- possibly `src/components/staff/ReplacementReasonPanel.tsx`

Must not touch:

- callback signatures
- current disabled rules
- status keys
- staff labels
- mock data
- real audit behavior

Validation:

- same as SW-1
- manual QA for verify/reject/replacement actions
- console check for controlled textarea warnings

Rollback:

- Revert action extraction files and restore action block inside `DocumentVerificationPanel`.

## Phase SW-3: Add `AuditRequirementStrip`

Goal:

- Show staff reason/audit requirements visibly near document rejection and replacement controls.
- Use visual warning only unless real audit writes are separately implemented.

Likely files touched:

- `src/components/staff/AuditRequirementStrip.tsx`
- `src/components/staff/DocumentActionRail.tsx`
- optionally `src/config/sensitiveActions.ts` read-only consumption

Must not touch:

- real audit writes
- audit event mock data
- reason minimum length enforcement unless explicitly approved
- existing action callbacks

Validation:

- screenshots for rejection and replacement action states
- Thai audit warning wrapping
- verify warning copy does not imply real persistence

Rollback:

- Remove `AuditRequirementStrip` composition.
- Leave action rail intact if SW-2 already merged.

## Phase SW-4: Improve Mobile Evidence Flow

Goal:

- Make the workbench usable at 375px by prioritizing evidence, then action, then context.

Likely files touched:

- workbench shell component
- evidence rail layout
- action rail layout

Must not touch:

- data
- callbacks
- status labels
- status keys
- audit behavior

Validation:

- 375px screenshots
- tap target review
- Thai wrapping
- no content overlap with mobile nav

Rollback:

- Revert layout CSS/classes only.

## Phase SW-5: Consider Staff Document Status Adapter

Goal:

- Extract staff document status label/icon/tone helpers after staff label decisions are fully approved.

Likely files touched:

- `src/config/documentStatusDisplay.ts`
- `src/components/staff/DocumentVerificationPanel.tsx`
- possibly extracted staff workbench components

Must not touch:

- Student document status adapter behavior
- Student wording
- status keys
- application statuses
- staff action behavior

Validation:

- compare before/after labels and tones
- screenshot all staff document statuses
- run `rg` for remaining inline staff status functions

Rollback:

- Restore inline status helpers in staff components if any mismatch appears.

## Build And Check Requirement

Every runtime phase requires:

```bash
source ~/.nvm/nvm.sh
npm run build
npm run check:tokens
```

## Screenshot Requirement

Every runtime phase requires screenshots under:

`docs/qa/staff-document-evidence-workbench/`

Minimum:

- desktop app_001
- desktop app_002
- mobile 375 app_001
- mobile 375 app_002
- Thai app_002
- action/audit state if action UI changed

## Recommended First Runtime Branch

Recommended:

`design/staff-document-evidence-workbench-runtime`

Recommended first runtime phase:

Phase SW-1 — layout-only workbench shell around existing `DocumentVerificationPanel`.

Reason:

- It tests the staff workbench model without changing verification behavior.
- It keeps the blast radius small.
- It gives reviewers screenshots before action extraction or audit policy changes.

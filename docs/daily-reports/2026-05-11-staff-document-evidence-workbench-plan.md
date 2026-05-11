# Staff Document Evidence Workbench Plan Merge Checkpoint

Date: 2026-05-11

## Merge Summary

- Source branch: `design/staff-document-evidence-workbench-plan`
- Target branch: `main`
- Merge commit: `34263eb`
- Merge message: `Merge staff document evidence workbench plan`

## Validation

- Source branch `npm run build`: passed
- Source branch `npm run check:tokens`: passed
- Main branch `npm run build`: passed after merge
- Main branch `npm run check:tokens`: passed after merge

## Planning Docs Added

- `docs/design/STAFF_DOCUMENT_EVIDENCE_WORKBENCH_PLAN.md`
- `docs/design/STAFF_DOCUMENT_WORKBENCH_COMPONENT_PLAN.md`
- `docs/design/STAFF_DOCUMENT_WORKBENCH_BEHAVIOR_CONTRACT.md`
- `docs/design/STAFF_DOCUMENT_WORKBENCH_QA_PLAN.md`
- `docs/design/STAFF_DOCUMENT_WORKBENCH_IMPLEMENTATION_SEQUENCE.md`

Updated:

- `docs/architecture/NEXT_RENOVATION_STEPS.md`

## Behavior

Runtime behavior is unchanged.

This merge did not change:

- staff document verification behavior
- document status keys
- mock data
- verify/reject/replacement callbacks
- route structure
- auth or role guards
- backend/API behavior
- export behavior
- disclosure behavior
- upload behavior
- student document wording
- provider/admin/ESQ flows

## Recommended Runtime Branch

Recommended next runtime branch:

`design/staff-document-evidence-workbench-runtime`

## Recommended First Runtime Phase

Recommended first runtime phase:

Phase SW-1 — layout-only shell around the existing `DocumentVerificationPanel`.

The first runtime slice should:

- compose the existing `DocumentVerificationPanel`
- preserve all callbacks
- preserve all status keys
- preserve current button availability
- preserve current reason rules
- avoid real audit writes
- avoid implying audit persistence that does not exist

## Risks To Preserve

Future implementation must preserve:

- audit and reason-sensitive action boundaries
- identity reveal sensitivity
- masked student profile by default
- staff operational document wording
- student recovery wording separately from staff wording
- `rejected` and `needs_replacement` as distinct staff states
- `pending` and `verification_pending` as separate role-surface keys
- no additional student PII exposure

## Next Step

Runtime implementation can begin only after this planning checkpoint is reviewed. The first implementation branch should stay layout-only and must include screenshot QA for desktop, mobile 375px, Thai locale, and rejected/needs-replacement document states.

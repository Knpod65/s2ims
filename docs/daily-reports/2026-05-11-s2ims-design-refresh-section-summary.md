# S2IMS Design Refresh Section Summary

Date: 2026-05-11

## A. Section Objective

This section began because the S2IMS UI was functional but increasingly felt repetitive and generic. The goal was to move away from generic Claude-style SaaS layouts and toward role-specific task surfaces without destabilizing the app.

Objectives completed:

- Move away from "cards everywhere" as the default UI answer.
- Establish a design direction for role-specific workspaces and task surfaces.
- Fix ESQ runtime console noise before beginning runtime design work.
- Document staff document policy and DRY risks before future refactors.
- Implement the first small runtime refresh slice in the Student document recovery/readiness flow.

## B. Branches Completed

- `bugfix/esq-runtime-console-errors`
- `renovation/staff-document-status-policy`
- `design/pattern-fatigue-audit`
- `design/student-document-recovery-refresh`

## C. Merged Outcomes

### ESQ Runtime Bugfix

Merged outcome:

- Fixed duplicate mobile nav key warnings.
- Fixed client-page `use(params)` runtime errors.
- Preserved route structure and behavior.

### Staff Document Status Policy And DRY Audit Planning

Merged outcome:

- Added staff document policy direction.
- Added system-wide DRY audit planning.
- Clarified that privacy-separated semantics should not be collapsed too early.
- Preserved runtime behavior.

### UI Pattern Fatigue Audit

Merged outcome:

- Added UI pattern fatigue audit.
- Added S2IMS design refresh direction.
- Added pattern breaker component roadmap.
- Added "do not generic UI" rules for future prompts.
- Added design refresh companion note.

### Student Document Recovery Refresh

Merged outcome:

- Added the first runtime refresh slice based on the audit.
- Introduced:
  - `StudentReadinessPath`
  - `DocumentRecoveryPanel`
  - `NextBestActionPanel`
- Updated only Student document/application readiness surfaces.
- Added QA screenshots and console review.
- Preserved upload behavior, document status keys, mock data, routes, and student document status adapter behavior.

## D. Key Design Decisions

- Stop defaulting every section to a white rounded card.
- Use task surfaces instead of generic dashboard/card/table/modal repetition.
- Preserve role identity while making roles feel operationally different.
- Preserve PDPA, privacy, masking, and governance boundaries.
- Keep Student document recovery language supportive.
- Keep Staff operational status language separate from Student-facing wording.
- Do not DRY privacy-separated semantics too early.
- Use Aurora Blue for meaningful progress, active steps, or primary actions, not decoration only.
- Keep runtime refresh slices small and independently reviewable.

## E. Current Validated State

- Current branch: `main`
- Main is synced with `origin/main`.
- Working tree is clean.
- `npm run build`: passed
- `npm run check:tokens`: passed

## F. Recommended Next Section

Recommended next section:

1. Staff Application Detail -> Document Evidence Workbench

Reason:

- It will prove the Staff operations model from the design audit.
- It can apply the staff document status policy that is now documented.
- It addresses a high-value workflow where evidence, actions, notes, and audit context are currently split across generic card columns.
- It should start with a small planning and visual QA pass because staff workflows have higher audit and operational risk than the completed Student refresh.

Other possible sections:

2. Provider Candidate Pool -> Candidate Decision Workbench
3. Student Matching Explanation -> Match Reasoning Canvas

## Closing Notes

This section successfully moved from audit and policy work into a contained runtime UI refresh without changing data logic, route structure, auth, upload behavior, or governance boundaries. The next refresh should keep the same discipline: define the task surface, preserve sensitive behavior, validate with screenshots, and avoid broad redesign.

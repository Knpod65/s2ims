# S²IMS Advisor Candidate Generator Plan MC2 — 2026-05-16

## Date

2026-05-16

## Branch

architecture/s2ims-advisor-candidate-generator-plan-mc2

## Purpose

Documentation-only MC2 plan for a future Personnel-based advisor/faculty reviewer candidate generator. Builds on MC1 runtime candidate pool adapter. Defines the `AdvisorCandidate` type, department matching rules, advisor review statuses, privacy rules, and manual confirmation model.

Advisor candidates are workflow suggestions only — not automatic assignments, not approvals, not AP-10B governance owners, not scholarship authorizations.

## Files Created

- docs/architecture/S2IMS_ADVISOR_CANDIDATE_GENERATOR_PLAN_MC2.md
- docs/architecture/S2IMS_ADVISOR_REVIEW_STATUS_MODEL_MC2.md
- docs/daily-reports/2026-05-16-s2ims-advisor-candidate-generator-plan-mc2.md

## Files Modified

- docs/architecture/NEXT_RENOVATION_STEPS.md (MC2 section appended)

## Validation Results

- npm run build: Compiled successfully — 0 type errors
- npm run check:tokens: Passed (4/4)
- npm run check:audit-events: Passed (139/139)

## Route Smoke

- /login: 200 OK
- /admin/audit-log: 200 OK
- /admin/dashboard: 200 OK
- /staff/applications/app_001: 200 OK
- /staff/applications/app_002: 200 OK

## Dev Log

Clean — no errors, warnings, or hydration issues.

## Docs-Only Confirmation

- git diff --name-only origin/main...HEAD | grep -v "^docs/" — empty
- All changes are under docs/* only
- No runtime code created or modified

## MC1 Boundary Preserved

- src/lib/assignment/ — unchanged
- 6 MC1 TypeScript modules remain as-is on main
- No modification to candidatePoolTypes.ts, candidatePoolPrivacy.ts, or any MC1 adapter
- MC2 plan notes that future runtime must reuse MC1 privacy utilities without modifying them

## Privacy Confirmations

- Mobile: FORBIDDEN — must not be copied to AdvisorCandidate output
- Personal email: FORBIDDEN — must not display by default
- remark: Internal only — must not be copied
- teacher_id → sourceId: Internal only, not displayed
- cmu_mail → officialEmail: Stored only; shown where role-authorized
- Student ID: Must be masked in all advisor-visible contexts
- PII exposed: No

## Safety Confirmations

- src/* changed: No
- scripts/* changed: No
- package.json changed: No
- Backend/API files created: No
- Migration files created: No
- SQL files created: No
- Schema implementation files created: No
- Runtime implementation created: No
- Persistence activated: No
- Auto-assignment planned: No
- Approvals collected: No
- Any owner named as AP-10B owner: No
- AP-10C started: No
- AP-11 started: No

## AP-10B Unaffected

- Candidate owners identified: 0/7
- Authority verified: 0/7
- Named owners: 0/7
- Approvals collected: 0/7
- Blocking conditions active: 9/9
- Blocking conditions cleared: 0/9
- AP-10C: Blocked
- AP-11: Blocked

## Recommended Next Step

- Run QA checkpoint on feature branch before merging
- Merge after QA review
- Post-merge QA on main
- Runtime implementation is a separate explicitly approved branch and task
- AP-10B owner candidate identification remains the only unblocked governance action

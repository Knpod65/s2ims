# S²IMS Candidate Review Audit Preview Runtime QA Checklist MC16

## Purpose

This checklist defines future runtime QA criteria for the MC15 diagnostic preview UI.

MC16 does not run or implement interaction automation. It documents what future QA must verify before any interaction polish or official audit-write work can proceed.

## Pre-QA Setup

- Confirm branch and commit under test.
- Confirm expected audit baseline.
- Confirm no unexpected `src/*`, `scripts/*`, route, backend/API, migration, SQL, export, notification, or persistence changes.
- Confirm AP-10B gate status remains owners 0/7, approvals 0/7, blockers 9/9 active.
- Confirm AP-10C and AP-11 remain blocked.

## Validation Commands

Run:

```bash
source ~/.nvm/nvm.sh
npm run build
npm run check:tokens
npm run check:audit-events
```

Expected:
- build 40/40
- 0 type errors
- tokens 4/4
- audit/event checks 299/299 unless a later approved phase intentionally changes the count

## Route Smoke

Smoke routes:
- `/login`
- `/admin/audit-log`
- `/admin/dashboard`
- `/staff/applications/app_001`
- `/staff/applications/app_002`

Expected:
- 5/5 routes return 200 OK
- dev log grep is clean for `error|warn|hydrat|key|unsupported|chunk|500|404`

## Interaction QA

Verify:
- initial render does not generate a preview automatically
- no candidate is auto-selected
- action clicks generate local diagnostic preview only
- repeated clicks remain local-only
- switching candidate/action updates local preview only
- clear/reset returns to empty state
- readonly mode disables controls
- no action creates assignment, approval, scholarship decision, official evidence, notification, export, API call, or audit write

## Copy QA

Required visible copy:
- `Diagnostic preview`
- `Not saved`
- `Not submitted`
- `Not official evidence`
- `Not an approval`
- `Not an assignment`
- `Local UI signal only`
- `No diagnostic preview has been generated. Review actions remain local UI signals only.`

Forbidden positive active-state copy:
- `Saved`
- `Submitted`
- `Recorded`
- `Official`
- `Evidence collected`
- `Assigned`
- `Approved`
- `Decision completed`
- `AP-10B approval collected`
- `Authority verified`

Negative wording such as `Not saved` remains allowed.

## Accessibility QA

Verify:
- keyboard focus order is logical
- controls have visible focus states
- disabled controls communicate disabled state
- warning copy is screen-reader readable
- preview state changes are announced or otherwise understandable
- badges are text-visible
- false flags are text-visible
- status meaning does not depend on color alone

## Safety Grep Checks

Review for absence of:
- `fetch(`
- `/api/`
- `axios`
- `XMLHttpRequest`
- `localStorage`
- `sessionStorage`
- `indexedDB`
- `sharedMockWriter`
- `AuditService`
- audit repository calls
- export/download actions
- notification calls
- enabled assign/approve/decision actions
- forbidden PII field display

## Diff Scope Checks

For MC16, expected diff scope is docs-only:
- `docs/architecture/*`
- `docs/daily-reports/*`
- `docs/qa/*`
- `docs/architecture/NEXT_RENOVATION_STEPS.md`

Stop if any non-doc file appears.

## AP-10B Separation Checks

Confirm:
- no AP-10B approval collected
- no AP-10B owner named by MC16
- no AP-10B gate status changed
- no AP-10C started
- no AP-11 started
- diagnostic preview remains outside AP-10B governance evidence

## Merge / Post-Merge QA Criteria

Before merge:
- validation passed
- smoke passed
- dev log clean
- docs-only diff confirmed
- QA checkpoint completed

After merge:
- validation passed on `main`
- smoke passed on `main`
- merge checkpoint created
- post-merge QA created
- AP-10B, AP-10C, and AP-11 safety confirmed


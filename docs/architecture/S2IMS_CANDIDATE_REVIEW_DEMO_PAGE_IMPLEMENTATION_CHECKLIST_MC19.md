# S²IMS Candidate Review Demo Page Implementation Checklist MC19

## Purpose

This checklist is for a future implementation branch that creates the Candidate Review Diagnostic Preview Demo Page. It is referenced from the MC19 master plan. All items must pass before the implementation branch may be merged to main.

This document is planning-only. No runtime files are created here.

---

## Allowed Future Files

A future implementation may add only the following types of files:

| Path Pattern | Purpose |
|-------------|---------|
| `src/app/admin/demo/candidate-review/page.tsx` | Admin-gated demo page (preferred option) |
| `src/app/dev/demo/candidate-review/page.tsx` | Dev-environment-only demo page (alternative) |
| `src/app/staff/training/candidate-review-demo/page.tsx` | Staff training demo page (alternative) |
| `src/app/*/demo/**/*.tsx` | Any demo-namespace page (role-gated) |
| Co-located demo fixture (e.g., `demoFixtures.ts` in same directory) | Safe mock data only — no PII |

---

## Forbidden Future Files

| Path Pattern | Why Forbidden |
|-------------|--------------|
| `src/app/api/**` | No API routes — no backend |
| `src/lib/assignment/*` (modification) | No changes to core assignment logic |
| `src/lib/audit/*` (modification) | No changes to audit logic |
| `prisma/**`, `migrations/**`, `*.sql` | No DB schema or migration |
| `src/lib/db/**`, `src/server/**` | No backend/server files |
| Any file calling `fetch()`, `axios()`, or data source | No real data fetch |
| Any file importing real mock data with student/personnel records | Must use co-located demo fixture only |

---

## Route and Access Options

Choose one of the following. Each option requires the demo page to be invisible to normal user navigation:

### Option A — Admin Demo Route (Recommended)

- Path: `/admin/demo/candidate-review`
- Gate: Admin role only
- No navigation link in production UI
- Clearly labeled demo banner

### Option B — Dev-Only Route

- Path: `/dev/demo/candidate-review`
- Gate: Development environment guard (`process.env.NODE_ENV === "development"`)
- Not linked in any navigation
- Returns 404 in production

### Option C — Storybook / Component Preview

- No route needed
- `CandidateSelectionReviewShell.stories.tsx` with demo fixture
- Only if Storybook is installed and configured

---

## Required Demo Copy

All of the following must be present on the rendered demo page:

- [ ] `"Demo only"` — visible banner or badge
- [ ] `"Uses safe mock data"` — visible in banner or subtitle
- [ ] `"No real student or personnel data"` — visible in banner or subtitle
- [ ] `"Diagnostic preview only"` — in or near the preview panel
- [ ] `"Not saved"` — in or near the preview panel
- [ ] `"Not submitted"` — in or near the preview panel
- [ ] `"Not official evidence"` — in or near the preview panel
- [ ] `"Not an approval"` — in or near the preview panel
- [ ] `"Not an assignment"` — in or near the preview panel

---

## Safe Mock Data Checklist

- [ ] All `candidateId` values use `"demo-"` prefix
- [ ] No `studentId`, `rawStudentId`, `nationalId` present
- [ ] No `mobile`, `phone`, email variants present
- [ ] No `remark`, `freeTextReason`, `reasonText` with non-safe content
- [ ] No `bankAccount`, `approvalStatus`, `scholarshipDecision` present
- [ ] No `assignedBy`, `assignedAt`, `ap10bApproval`, `authorityEvidence` present
- [ ] `actorRole` is `"system_preview"` in all demo events
- [ ] `workflowContext` is `"candidate_review"` or explicitly safe value
- [ ] `roleCategory` uses `"_demo"` suffix or clearly non-real value
- [ ] Grep: no `nationalId` in demo fixture file
- [ ] Grep: no `mobile` or `phone` in demo fixture file
- [ ] Grep: no `email` in demo fixture file
- [ ] Grep: no `bankAccount` in demo fixture file

---

## No-Write / No-Persistence Checklist

- [ ] No `localStorage` — grep: no hits in demo page or fixture
- [ ] No `sessionStorage` — grep: no hits in demo page or fixture
- [ ] No `IndexedDB` — grep: no hits in demo page or fixture
- [ ] No `fetch()` — grep: no hits in demo page or fixture
- [ ] No `axios()` — grep: no hits in demo page or fixture
- [ ] No `sharedMockWriter` call — grep: no hits in demo page or fixture
- [ ] No `AuditService` call — grep: no hits in demo page or fixture
- [ ] No repository call — grep: no hits in demo page or fixture
- [ ] No export or download behavior
- [ ] No notification behavior

---

## No-Real-Data Checklist

- [ ] No import from production mock data files containing real-looking student records
- [ ] No import from `src/data/**` unless data has been reviewed for PII
- [ ] No database query
- [ ] No API route handler called
- [ ] All candidate objects are constructed inline or in co-located demo fixture
- [ ] `readonly` is `true` — no review action buttons trigger real state changes in production

---

## Read-Only Checklist

- [ ] `readonly` prop is `true` on `CandidateSelectionReviewShell` in demo page
- [ ] No enabled Assign button
- [ ] No enabled Approve button
- [ ] No enabled Decision button
- [ ] `FORBIDDEN_ACTIONS` set (MC8, 8 entries) unchanged in shell component
- [ ] `assertSafeCandidateReviewTransition` guard remains intact in shell

---

## AP-10B / AP-10C / AP-11 Checklist

- [ ] AP-10B gate unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers
- [ ] No AP-10B approval collected
- [ ] AP-10C: Blocked
- [ ] AP-11: Blocked

---

## Validation Commands

Run all of the following before merging a future implementation branch:

```
npm run build
```
Expected: Compiled successfully — 0 type errors — 40/40 pages (or incremented count if new page added)

```
npm run check:tokens
```
Expected: Passed — 4/4

```
npm run check:audit-events
```
Expected: Passed — 316/316 (or incremented if new audit checks added for the demo page)

Route smoke (5 baseline routes must remain 200 OK):
- `/login` → 200
- `/admin/audit-log` → 200
- `/admin/dashboard` → 200
- `/staff/applications/app_001` → 200
- `/staff/applications/app_002` → 200

Dev log: Clean (no unexpected errors from demo page imports)

Diff check:
```
git diff --name-only origin/main...HEAD | grep -v "^docs/" | grep -v "^src/app/"
```
Expected: zero lines (only docs and the new demo page)

---

## Merge and Post-Merge QA Checklist

- [ ] Feature branch QA passed
- [ ] Merge commit created with `--no-ff`
- [ ] Post-merge build 40/40 (or incremented), tokens 4/4, audit 316/316 (or incremented)
- [ ] Post-merge route smoke 5×200 OK
- [ ] Merge checkpoint doc created
- [ ] Post-merge QA docs created
- [ ] NEXT_RENOVATION_STEPS.md updated

---

## Abort Conditions

Stop immediately if any of the following occur:

- Build fails (type errors in demo page) → investigate and fix before proceeding
- Audit checks drop below baseline (316) → stop — do not merge
- Diff contains files outside `docs/` and the allowed `src/app/demo` path → stop — remove non-allowed files
- Any PII field found in demo fixture → stop — remove and replace with safe mock data
- Any `fetch()`, API call, or persistence found in demo page → stop — remove before proceeding

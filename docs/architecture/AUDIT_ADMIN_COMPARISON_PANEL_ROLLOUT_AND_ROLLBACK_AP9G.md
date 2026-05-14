# Audit Admin Comparison Panel Rollout and Rollback AP-9G

## 1. Purpose

This document defines the staged rollout plan and rollback strategy for the future AP-9G Admin debug comparison panel. Each stage requires a QA gate before proceeding to the next. Any failed gate triggers rollback to the previous stage.

This is a planning document. No panel exists yet.

## 2. Rollout Prerequisites

Before Stage 1 (hidden component) can begin, all of the following must be confirmed:

- `npm run build` passes 40/40
- `npm run check:tokens` passes 4/4
- `npm run check:audit-events` passes 122/122
- All 5 route smoke tests pass (200 OK)
- Dev log clean
- AP-9G documentation reviewed and approved (AP-9G-QA passed)
- Privacy boundary reviewed and signed off
- Access control model reviewed and signed off
- UI spec reviewed and signed off

## 3. Feature Flags

All three flags must be `false` by default and must be explicitly enabled per environment:

| Flag | Default | Controls |
|------|---------|---------|
| `featureEnabled` | `false` | Master AP-9F gate (already exists) |
| `readCompareEnabled` | `false` | Comparison runs gate (already exists) |
| `adminDebugPanelEnabled` | `false` | Panel visibility gate (new in AP-9G implementation) |

## 4. Stage 0 — Docs-Only (Current)

**Status:** Active (this document is Stage 0 output)

**What exists:**
- AP-9G planning documentation
- Privacy boundary, access control, UI spec, rollout/rollback, QA checklist docs

**What does not exist:**
- Any panel component
- Any runtime code change
- Any feature flag change

**QA gate for Stage 0:** AP-9G documentation review passes.

## 5. Stage 1 — Hidden Component

**What changes:**
- A `AdminAuditComparisonDebugPanel` component is created in `src/components/admin/`
- The component renders nothing for all roles and all flag combinations
- No route changes
- No Admin Audit Log page changes
- All three flags remain `false`

**QA gate for Stage 1:**
- Component exists in codebase but renders no DOM output
- Non-Admin roles see no output
- Admin role (flags disabled) sees no output
- `npm run build` passes 40/40
- All checks pass 122/122
- Route smoke passes
- Dev log clean

## 6. Stage 2 — Admin-Only Debug Panel

**What changes:**
- `adminDebugPanelEnabled` flag added to config (default `false`)
- When all three flags are `true` and role is `admin`, panel renders within `/admin/audit-log`
- Panel shows summary cards and mismatch table using safe fields only
- `AuditDisplayPresenter` and Admin Audit Log table are unchanged

**QA gate for Stage 2:**
- Panel renders for Admin when all flags enabled
- Panel renders nothing for Staff/Student/Provider/ESQ in all flag states
- Privacy review: no PII in panel output
- Accessibility review: `aria-label`, `aria-expanded`, `aria-live` present
- Source-of-truth review: Admin Audit Log behavior unchanged
- All checks 122/122
- Route smoke passes
- Dev log clean

## 7. Stage 3 — Staging-Only Review

**What changes:**
- Flags enabled in staging environment only
- Internal Admin users can view the panel
- Comparison runs are manually triggered by developer tooling

**QA gate for Stage 3:**
- Comparison data visible to Admin in staging
- No other role sees comparison data
- Privacy audit: sample comparison output reviewed for PII leaks
- Accessibility audit: screen reader test
- Performance review: panel does not slow down audit log page
- All checks 122/122 in staging
- Route smoke passes in staging

## 8. Stage 4 — Production Disabled-by-Default

**What changes:**
- Feature released to production with all flags `false`
- Admin users can enable flags per-session via developer tooling
- No comparison runs in production unless explicitly enabled

**QA gate for Stage 4:**
- Production build passes 40/40
- All flags confirmed `false` on production deploy
- Admin Audit Log verified unchanged in production
- No comparison data visible to any user by default
- On-call runbook updated with rollback procedure

## 9. Rollback Triggers

Any of the following events triggers immediate rollback to Stage 0 behavior (panel hidden, all flags disabled):

| Trigger | Severity | Response |
|---------|----------|---------|
| PII discovered in panel output | Critical | Immediate rollback + incident report |
| Admin Audit Log source-of-truth confused | Critical | Immediate rollback |
| Prototype read shown as authoritative | Critical | Immediate rollback |
| Unauthorized role access to panel data | Critical | Immediate rollback + incident report |
| Route regression (non-200 response) | High | Rollback + investigation |
| Build failure after panel deployment | High | Rollback |
| Audit/notification check failure | High | Rollback |
| Accessibility regression | Medium | Rollback + fix |
| User-visible confusion about official audit data | Medium | Rollback + UX review |
| Performance regression on audit log page | Medium | Rollback + investigation |

## 10. Rollback Actions

When a rollback trigger is detected:

1. **Disable `adminDebugPanelEnabled` flag** — immediate effect, panel hides
2. **Disable `readCompareEnabled` flag** — stops comparison runs
3. **Verify panel is hidden** — confirm non-Admin and Admin users see no panel
4. **Clear in-memory comparison metrics** — call `getReadComparisonMetrics().clear()` in developer tooling (not from UI)
5. **Run validation:**
   - `npm run build` → expect 40/40
   - `npm run check:tokens` → expect 4/4
   - `npm run check:audit-events` → expect 122/122
6. **Route smoke all 5 routes** — confirm all 200 OK
7. **Confirm Admin Audit Log unchanged** — verify `/admin/audit-log` shows mock/fixture data, no comparison data
8. **Dev log review** — confirm no residual errors
9. **Incident report** — if trigger was Critical severity, create incident report

## 11. Verification After Rollback

After rollback, confirm:
- [ ] `adminDebugPanelEnabled` is `false`
- [ ] `readCompareEnabled` is `false`
- [ ] No panel DOM output for any role
- [ ] No panel DOM output for Admin
- [ ] Admin Audit Log shows source data correctly
- [ ] `sharedMockWriter` unchanged
- [ ] `adminAuditDisplayAdapter` unchanged
- [ ] All 5 routes 200 OK
- [ ] 122/122 checks pass
- [ ] Dev log clean
- [ ] `AuditDisplayPresenter` unchanged

## 12. QA Checklist

- [ ] Rollout prerequisites confirmed before Stage 1
- [ ] Stage 1: component renders no DOM output
- [ ] Stage 2: Admin panel renders when all flags true
- [ ] Stage 2: non-Admin panels render nothing
- [ ] Stage 2: privacy review passed
- [ ] Stage 2: accessibility review passed
- [ ] Stage 3: staging review completed
- [ ] Stage 4: production deploy with all flags false
- [ ] Rollback procedure documented and tested
- [ ] On-call runbook updated
- [ ] Each stage has its own QA gate sign-off

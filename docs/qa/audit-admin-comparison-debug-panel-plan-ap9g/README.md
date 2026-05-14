# Audit Admin Comparison Debug Panel Plan AP-9G QA

## Overview

AP-9G added documentation-only planning for a future Admin-only, disabled-by-default, debug-only audit comparison panel. The plan was committed as `8cec03a` on branch `architecture/audit-admin-comparison-debug-panel-plan-ap9g`.

This QA confirms the planning docs are complete, the privacy boundary is safe, access control is Admin-only, the UI state model is sound, the rollout/rollback strategy is complete, and no runtime code was changed.

## Scope

QA covers:
- main AP-9G plan (`AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_PLAN_AP9G.md`)
- privacy boundary (`AUDIT_ADMIN_COMPARISON_PANEL_PRIVACY_BOUNDARY_AP9G.md`)
- access control (`AUDIT_ADMIN_COMPARISON_PANEL_ACCESS_CONTROL_AP9G.md`)
- UI specification (`AUDIT_ADMIN_COMPARISON_PANEL_UI_SPEC_AP9G.md`)
- rollout and rollback (`AUDIT_ADMIN_COMPARISON_PANEL_ROLLOUT_AND_ROLLBACK_AP9G.md`)
- QA checklist (`AUDIT_ADMIN_COMPARISON_PANEL_QA_CHECKLIST_AP9G.md`)
- roadmap update (`NEXT_RENOVATION_STEPS.md`)
- validation and route smoke
- runtime boundary preservation

## Validation Results

- Build: passed, **40/40** routes, 0 type errors
- Token check: passed **4/4**
- Audit/notification checks: passed **122/122**
- Route smoke:
  - `/login`: 200 OK
  - `/admin/audit-log`: 200 OK
  - `/admin/dashboard`: 200 OK
  - `/staff/applications/app_001`: 200 OK
  - `/staff/applications/app_002`: 200 OK
- Dev log: clean — no errors, warnings, or hydration issues

## QA Checklist

### Docs-Only Scope

- [x] No `src/*` changes
- [x] No `scripts/*` changes
- [x] No `package.json` changes
- [x] No backend/API files
- [x] No database migrations
- [x] No mock fixture mutation
- [x] No component created
- [x] No route created

### Plan Completeness

- [x] Admin-only model defined — Section 7: role check `role === 'admin'`, empty render for all other roles
- [x] Debug-only model defined — panel explicitly labelled as developer/debug view, not official audit log
- [x] Disabled-by-default model defined — all three flags (`featureEnabled`, `readCompareEnabled`, `adminDebugPanelEnabled`) default to `false`
- [x] Feature flag model defined — Section 8 lists all three flags with defaults
- [x] Safe metrics display model defined — Section 9 defines allowed aggregate fields
- [x] "What panel may show" defined — Section 10: status, counts, timestamps, mismatch category/dimension/safeMessage, masked tokens
- [x] "What panel must never show" defined — Section 11: actorId, targetId, student ID, national ID, email, phone, bank account, IP, file names, OCR text, reason text, metadata values, prototype as authoritative
- [x] Relationship to Admin Audit Log defined — Section 12: Admin Audit Log unchanged, separate panel only
- [x] Relationship to AP-9F service defined — Section 13: panel reads `getReadComparisonMetrics().list()` only, never appends or mutates
- [x] Explicit non-goals defined — Section 5: 16 explicit non-goals listed

### Privacy

- [x] Forbidden UI data list complete — Section 2: actorId, targetId, raw student ID, national ID, email, phone, bank account, raw IP, file name, file path, OCR text, full reason text, metadata values, raw route params, uploaded document identifiers, sourceEventId, prototypeEventId
- [x] Allowed UI data list safe — Section 3: aggregate counts, status, category, dimension, safeMessage, masked tokens, timestamps only
- [x] Mismatch display rules safe — Section 5: only category/dimension/safeMessage/masked tokens; table collapsible; not exportable; max 50 rows
- [x] Logging restrictions defined — Section 6: safe aggregate log format; forbidden field list
- [x] Export restrictions defined — Section 7: excluded from CSV/PDF/clipboard/API
- [x] Tooltip/copy restrictions defined — Section 8: no raw IDs, no user identifiers, no reason text
- [x] Thai/English copy safety defined — Section 9: translation mapping required; forbidden copy fields listed

### Access Control

- [x] Admin-only rule defined — hard constraint, enforced at component, route, and flag levels
- [x] Student role blocked — silent empty render
- [x] Staff role blocked — silent empty render
- [x] Provider role blocked — silent empty render
- [x] ESQ role blocked — silent empty render
- [x] Unauthenticated access blocked — redirect to `/login`
- [x] Direct URL behavior planned — redirect to `/admin/dashboard` for non-Admin, not a 403 or error reveal
- [x] Blocked access does not reveal panel exists — no empty container in DOM, no placeholder

### UI / Accessibility

- [x] Panel states defined — 8 states: blocked, disabled, no-data, matched, mismatched, failed, skipped, loading
- [x] Summary cards safe — aggregate counts and timestamps only, no raw event data
- [x] Mismatch table columns safe — category, dimension, safeMessage, masked tokens only; sourceEventId/prototypeEventId explicitly forbidden
- [x] Mismatch table not exportable — Section 6: "Not exportable to CSV or clipboard"
- [x] Empty/disabled/failed/loading states defined — Sections 7–10
- [x] Accessibility requirements defined — aria-label, aria-live, role="status", scope="col", aria-expanded, color not sole indicator
- [x] Mobile behavior defined — collapse to badge+count <768px, horizontal table scroll, vertical card stack
- [x] Copy examples safe — Section 13: Thai and English examples verified PII-free

### Rollout / Rollback

- [x] Stage 0 docs-only defined — current state
- [x] Stage 1 hidden component defined — renders nothing for all roles/flags
- [x] Stage 2 admin-only debug panel defined — flags enabled + admin role
- [x] Stage 3 staging-only review defined — internal Admin review with flags enabled
- [x] Stage 4 production disabled-by-default defined — all flags `false` on production deploy
- [x] Rollback triggers defined — PII exposure (Critical), prototype-as-official (Critical), route regression, build failure, unauthorized role access, accessibility regression
- [x] Rollback actions defined — disable all flags, verify panel hidden, clear metrics, validate 122/122, route smoke, confirm Admin Audit Log unchanged
- [x] Post-rollback verification defined — Section 11: 12-item checklist

### Runtime Safety

- [x] Admin UI not switched to prototype reads
- [x] `sharedMockWriter` source of truth preserved
- [x] `adminAuditDisplayAdapter` active read path preserved
- [x] `AuditDisplayPresenter` boundary preserved
- [x] Prototype persistence not activated
- [x] Real persistence not added
- [x] Staff callbacks unchanged
- [x] Staff verify not wired
- [x] Reason validation unchanged
- [x] `ReasonRequiredModal` not introduced
- [x] Notification behavior unchanged
- [x] PII exposure not added
- [x] AP-10 not started

## Result

**AP-9G QA passed.**

The planning documentation is complete, internally consistent, and safe. All 6 planning docs cover Admin-only access, debug-only display, disabled-by-default flags, PII-free metrics, staged rollout/rollback, and a comprehensive QA checklist. No runtime code was introduced. All AP-9F safety boundaries are preserved.

## Recommended Next Step

- Merge AP-9G after review
- AP-9G post-merge QA after merge
- Runtime implementation (Stage 1 hidden component) only after explicit approval
- Do not start AP-10
- Do not activate real persistence

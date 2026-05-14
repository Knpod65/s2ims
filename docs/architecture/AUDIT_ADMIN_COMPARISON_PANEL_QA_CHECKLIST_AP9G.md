# Audit Admin Comparison Panel QA Checklist AP-9G

This checklist is used for each AP-9G implementation stage QA gate. All items must be confirmed before proceeding to the next stage.

---

## A. Docs-Only Safety (Stage 0)

- [ ] No `src/*` changes
- [ ] No `scripts/*` changes
- [ ] No `package.json` changes
- [ ] No backend/API files added or modified
- [ ] No database migrations created
- [ ] No mock fixture (`src/data/mock/audit-logs.ts`) mutated
- [ ] No `src/app/*` changes
- [ ] No `src/components/*` changes
- [ ] Diff scope confirmed: only `docs/architecture/*` and `docs/daily-reports/*` and `docs/architecture/NEXT_RENOVATION_STEPS.md`

---

## B. Admin-Only Access

- [ ] Panel renders nothing for `staff` role
- [ ] Panel renders nothing for `student` role
- [ ] Panel renders nothing for `provider` role
- [ ] Panel renders nothing for `esq` role
- [ ] Panel renders nothing for unauthenticated user
- [ ] Panel renders nothing when `adminDebugPanelEnabled` is `false`
- [ ] Panel renders nothing when `featureEnabled` is `false`
- [ ] Panel renders nothing when `readCompareEnabled` is `false`
- [ ] No DOM trace when panel is blocked (no empty container or hidden element)
- [ ] No route accessible to non-Admin that reveals panel exists
- [ ] Direct URL access by non-Admin redirects appropriately
- [ ] Navigation menu shows no comparison panel link for non-Admin roles

---

## C. Feature Flag Safety

- [ ] `featureEnabled` defaults to `false`
- [ ] `readCompareEnabled` defaults to `false`
- [ ] `adminDebugPanelEnabled` defaults to `false`
- [ ] All three flags must be `true` for panel to render
- [ ] Panel hides immediately when any flag becomes `false`
- [ ] No comparison runs occur when `readCompareEnabled` is `false`
- [ ] No panel DOM output in production without explicit flag enablement

---

## D. UI Display Safety

- [ ] Panel is visually distinct from Admin Audit Log table
- [ ] Panel header clearly identifies it as debug/developer data (not official)
- [ ] Thai debug label present and accurate
- [ ] English debug label present and accurate
- [ ] Status badge uses enum label only (no raw event data)
- [ ] Summary cards show only aggregate counts and timestamps
- [ ] Mismatch table shows only: category, dimension, safeMessage, masked tokens
- [ ] Mismatch table is not exported by CSV/print
- [ ] Mismatch table is collapsible
- [ ] Empty state renders correctly
- [ ] Disabled state shows label only (no counts)
- [ ] Failed state shows `safeMessage` only (no stack trace)
- [ ] Loading state shows no partial data

---

## E. Privacy and PII

- [ ] No `actorId` in panel UI
- [ ] No `targetId` in panel UI
- [ ] No raw student ID in panel UI
- [ ] No national ID in panel UI
- [ ] No email address in panel UI
- [ ] No phone number in panel UI
- [ ] No bank account number in panel UI
- [ ] No raw IP address in panel UI
- [ ] No file name or file path in panel UI
- [ ] No OCR text in panel UI
- [ ] No full reason text in panel UI
- [ ] No metadata values in panel UI
- [ ] No raw route params in panel UI
- [ ] `sourceSafeToken` verified as masked before display
- [ ] `prototypeSafeToken` verified as masked before display
- [ ] `safeMessage` is the only free-text field shown
- [ ] Log output contains only safe aggregate fields
- [ ] Thai copy reviewed for PII
- [ ] English copy reviewed for PII
- [ ] Tooltip text reviewed for PII

---

## F. Runtime Boundary Preservation

- [ ] Admin Audit Log table behavior unchanged
- [ ] Drawer behavior unchanged
- [ ] CSV/export behavior unchanged
- [ ] `adminAuditDisplayAdapter` active read path preserved
- [ ] `sharedMockWriter` source of truth preserved
- [ ] `AuditDisplayPresenter` formatting boundary preserved
- [ ] Prototype persistence remains disabled by default
- [ ] Real persistence not added
- [ ] No backend/API added
- [ ] No database migration added
- [ ] No mock fixture mutation
- [ ] Staff callbacks unchanged
- [ ] Staff verify not wired
- [ ] Reason validation unchanged
- [ ] `ReasonRequiredModal` not introduced
- [ ] Notification behavior unchanged
- [ ] AP-10 not started

---

## G. Accessibility

- [ ] Panel section has `aria-label`
- [ ] Status badge has `aria-live="polite"` and text equivalent
- [ ] Health indicator icon has `aria-label` text
- [ ] Mismatch table has `<caption>` element
- [ ] Table headers have `scope="col"`
- [ ] Collapsible toggle has `aria-expanded`
- [ ] Focus does not trap when panel is collapsed
- [ ] Color is not the only status indicator (icon + text required)
- [ ] Screen reader test completed

---

## H. Mobile Behavior

- [ ] Panel collapses to badge + count on screens < 768px
- [ ] Mismatch table scrolls horizontally on mobile
- [ ] Summary cards stack vertically on mobile
- [ ] Debug label visible when expanded on mobile
- [ ] Touch targets meet minimum size requirements (44px)

---

## I. Rollback Readiness

- [ ] All three flags can be disabled independently
- [ ] Panel hides immediately when `adminDebugPanelEnabled` is `false`
- [ ] In-memory metrics can be cleared via developer tooling
- [ ] Rollback procedure documented (see rollout/rollback doc)
- [ ] On-call runbook includes comparison panel rollback steps
- [ ] Rollback verified to restore Admin Audit Log to full normal behavior

---

## J. Validation

- [ ] `npm run build` passes 40/40
- [ ] `npm run check:tokens` passes 4/4
- [ ] `npm run check:audit-events` passes 122/122
- [ ] `/login` returns 200 OK
- [ ] `/admin/audit-log` returns 200 OK
- [ ] `/admin/dashboard` returns 200 OK
- [ ] `/staff/applications/app_001` returns 200 OK
- [ ] `/staff/applications/app_002` returns 200 OK
- [ ] Dev log grep returns no errors, warnings, or hydration issues

---

## K. Final Approval Checklist

- [ ] All sections A–J reviewed and confirmed
- [ ] Privacy boundary review signed off
- [ ] Access control review signed off
- [ ] UI spec review signed off
- [ ] Rollout/rollback plan reviewed
- [ ] Staging review completed (if Stage 3+)
- [ ] Source-of-truth review: Admin Audit Log shows only mock/fixture data
- [ ] AP-10 not started
- [ ] Real persistence not added
- [ ] Explicit approval granted for next stage

# S²IMS Candidate Review Audit Preview UX Checklist MC14

## Purpose

This document provides a comprehensive QA checklist for future UX hardening of the MC13 diagnostic preview UI. The checklist must be run before any UX hardening implementation is merged. Do not merge any UI changes without completing all checks.

## 1. Planning & Scope Verification

- [ ] Branch purpose is documented (UX hardening for MC13 diagnostic preview only)
- [ ] Branch is scoped to `src/components/assignment/CandidateSelectionReviewShell.tsx` only
- [ ] No changes to other components, pages, routes, or navigation
- [ ] No changes to backend, API, or database files
- [ ] No migrations, SQL, or schema changes
- [ ] No changes to Staff callbacks or notification behavior
- [ ] No changes to export or download behavior
- [ ] No changes to assignment or scholarship workflows
- [ ] No AP-10B governance changes
- [ ] No AP-10C or AP-11 activation

## 2. Visual Boundary Checks

- [ ] Diagnostic badge is prominently visible at preview panel top
- [ ] False flags section is visually distinct (e.g., separate card, different background)
- [ ] Warning copy is styled with warning color (yellow/amber not subtle)
- [ ] Action buttons are visually different from workflow buttons
- [ ] Empty state is clear when no preview exists
- [ ] "Clear Preview" button is easily accessible
- [ ] No visual confusions with "Save", "Submit", or "Record" buttons
- [ ] Colors are not used alone to communicate status (text also present)

## 3. Copy & Label Checks

- [ ] Panel title reads "Diagnostic Preview" (EN) / "ตัวอย่างการวินิจฉัย" (TH)
- [ ] Panel subtitle reads "Local UI signal only" (EN) / "สัญญาณ UI ของเครื่องเท่านั้น" (TH)
- [ ] "Not saved" label visible
- [ ] "Not submitted" label visible
- [ ] "Not official evidence" label visible
- [ ] "Not an approval" label visible
- [ ] "Not an assignment" label visible
- [ ] "Diagnostic only" label visible
- [ ] "Discarded after preview" label visible
- [ ] No forbidden copy ("Saved", "Submitted", "Recorded", "Official", etc.) present
- [ ] Empty state copy is exact: "No diagnostic preview has been generated. Review actions remain local UI signals only."
- [ ] All copy is bilingual (EN/TH)

## 4. False-Flag Display Checks

- [ ] `persisted: false` is displayed
- [ ] `written: false` is displayed
- [ ] `exported: false` is displayed
- [ ] `notified: false` is displayed
- [ ] `officialEvidence: false` is displayed
- [ ] `diagnosticOnly: true` is displayed
- [ ] `discardedAfterPreview: true` is displayed
- [ ] All flags are text-visible (not just color-coded)
- [ ] Flags are in a dedicated "False Flags" or "Safety Indicators" section
- [ ] Flags are understandable to users without technical background

## 5. Empty State Checks

- [ ] Empty state appears when `auditPreview === null`
- [ ] Empty state copy does not imply "waiting to save"
- [ ] Empty state copy does not imply "incomplete"
- [ ] Empty state copy does not imply "missing approval"
- [ ] Empty state copy does not imply "failed audit"

## 6. Action Label Checks

### Allowed Labels
- [ ] "Shortlist" label allowed
- [ ] "Skip" label allowed
- [ ] "Needs more context" label allowed
- [ ] "Reject for assignment" label allowed
- [ ] "Select for review" label allowed
- [ ] "Clear local review state" label allowed

### Forbidden Labels
- [ ] "Assign" label NOT present
- [ ] "Approve" label NOT present
- [ ] "Submit decision" label NOT present
- [ ] "Save audit" label NOT present
- [ ] "Record evidence" label NOT present
- [ ] "Confirm scholarship" label NOT present
- [ ] "Collect approval" label NOT present
- [ ] "Verify authority" label NOT present

## 7. Accessibility Checks

- [ ] Screen reader announces preview panel when it appears
- [ ] False flags are announced by screen reader (not color-only)
- [ ] Warning badge has `aria-label` or text equivalent
- [ ] Action buttons have descriptive labels
- [ ] "Clear Preview" button has clear label
- [ ] Preview state change has `aria-live="polite"` or `aria-label`
- [ ] Disabled state uses `aria-disabled="true"` where applicable
- [ ] All text is high contrast (WCAG AA minimum)
- [ ] No information conveyed by color alone

## 8. Privacy Checks

- [ ] No PII is displayed in preview fields
- [ ] No candidate ID visible in preview
- [ ] No mobile, phone, email displayed
- [ ] No student ID, national ID displayed
- [ ] No bank account displayed
- [ ] No approval status visible
- [ ] No scholarship decision visible
- [ ] No assigned-by or assigned-at displayed
- [ ] No approval evidence visible
- [ ] No free text reason or remark displayed
- [ ] Grep `src/components/assignment/CandidateSelectionReviewShell.tsx` for forbidden fields: `candidateId`, `mobile`, `email`, `studentId`, `nationalId`, `bankAccount` — must return zero results

## 9. AP-10B Separation Checks

- [ ] No AP-10B approval collection in preview panel
- [ ] No "Collect Approval" action present
- [ ] No "Authority Verify" action present
- [ ] No governance button enabled
- [ ] No assignment action enabled
- [ ] No scholarship decision action enabled
- [ ] Preview panel is diagnostic/read-only only
- [ ] No AP-10B gate status change
- [ ] AP-10B remains: 0/7 owners, 0/7 approvals, 9/9 blockers

## 10. AP-10C / AP-11 Checks

- [ ] AP-10C is still blocked (no changes)
- [ ] AP-11 is still blocked (no changes)
- [ ] No changes to `ap10bApproval` field handling
- [ ] No changes to `authorityEvidence` field handling
- [ ] No changes to scholarship decision fields
- [ ] No changes to role or category transitions
- [ ] No changes to approval collection

## 11. Build & Validation Checks

- [ ] `npm run build` passes: "Generating static pages (40/40)"
- [ ] `npm run check:tokens` passes: "4/4"
- [ ] `node scripts/check-audit-events.mjs` passes: "278/278"
- [ ] All 5 route smoke tests return 200 OK:
  - [ ] `/login` → 200
  - [ ] `/admin/audit-log` → 200
  - [ ] `/admin/dashboard` → 200
  - [ ] `/staff/applications/app_001` → 200
  - [ ] `/staff/applications/app_002` → 200
- [ ] Dev server starts without errors
- [ ] Dev server logs are clean (no `Cannot find module` errors)
- [ ] Preview is visible in dev server when testing with `readonly={false}`

## 12. Audit Checks

### Forbidden Strings (must not appear in src/)
- [ ] "Saved" not found in shell component
- [ ] "Submitted" not found in shell component
- [ ] "Recorded" not found in shell component
- [ ] "Assigned" not found in shell component
- [ ] "Approved" not found in shell component
- [ ] "Official" not found in shell component (except in copy context)
- [ ] No `fetch()` calls added
- [ ] No `localStorage` usage added
- [ ] No `sessionStorage` usage added
- [ ] No `IndexedDB` usage added
- [ ] No `sharedMockWriter` calls added
- [ ] No `AuditService` calls added

### Required Strings (must appear at least once)
- [ ] "Diagnostic preview" appears in component or copy
- [ ] "Not saved" appears
- [ ] "Not official evidence" appears
- [ ] "persisted: false" appears
- [ ] "diagnosticOnly: true" appears
- [ ] "discardedAfterPreview: true" appears

## 13. Diff-Only Checks

After implementation, run:

```bash
git diff --name-only origin/main...HEAD
git diff --name-only origin/main...HEAD | grep -v "^docs/" || echo "All changes are docs-only"
```

- [ ] Only docs/ files appear in diff
- [ ] No src/ files modified
- [ ] No scripts/ files modified
- [ ] No package.json modified
- [ ] No tsconfig or build config modified

## 14. Post-Merge Checks

After merging to main:

- [ ] All checks pass again (build, tokens, audit, routes)
- [ ] main branch builds cleanly
- [ ] main branch passes audit checks
- [ ] Route smoke tests pass on main
- [ ] Dev server runs cleanly from main
- [ ] Post-merge QA docs created
- [ ] Post-merge QA artifacts committed
- [ ] main is clean and ready for next features

---

## Final Approval Signature

**QA Officer:** _________________________ **Date:** _____________

**Code Reviewer:** _________________________ **Date:** _____________

**Architecture Review:** _________________________ **Date:** _____________

---

**Checklist Version:** MC14 Planning
**Date:** 2026-05-17
**Status:** Documentation-only — No checks run until implementation phase

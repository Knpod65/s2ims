# S²IMS Candidate Review Demo Combined Preview UX Hardening Checklist MC34

## Purpose

This checklist defines what a future UX hardening branch for the combined demo route must achieve and must not do. It governs allowed file paths, forbidden file paths, scope gates, and validation requirements. Creating a branch from this checklist does not constitute AP-10B approval, production readiness, or official sign-off.

---

## Allowed Future Files

A future UX hardening runtime branch may only touch:

| File | Scope |
|------|-------|
| `src/app/admin/candidate-review-demo/page.tsx` | Section layout, spacing, demo copy, heading structure |
| `src/components/assignment/CandidateSelectionReviewShell.tsx` | Accessibility attributes, read-only copy, heading hierarchy |
| `src/components/assignment/FeedbackBacklogPreview.tsx` | Accessibility attributes, read-only copy, heading hierarchy, badge visibility |

---

## Forbidden Future Files

A future UX hardening branch must NOT touch:

| File / Path | Reason |
|-------------|--------|
| `src/lib/navigation.ts` | No navigation change allowed |
| `src/components/layout/Sidebar.tsx` | No navigation exposure |
| `src/components/layout/MobileBottomNav.tsx` | No navigation exposure |
| `src/components/layout/Topbar.tsx` | No navigation exposure |
| `src/lib/assignment/candidateReviewDemoData.ts` | Mock data structure — logic-only file |
| Any `src/` file outside the allowed list | Out of scope |
| `scripts/*` | No script changes |
| `package.json` | No dependency changes |
| Any backend, API, migration, or SQL file | Not allowed |

---

## Section Separation Checklist

Before merging a future UX hardening branch, confirm:

- [ ] Candidate review section has a distinct heading (e.g., `<h2>Candidate Review — Diagnostic Preview</h2>`)
- [ ] Feedback backlog section has a distinct heading (e.g., `<h2>Feedback Backlog Preview</h2>`)
- [ ] Both headings are different from each other
- [ ] Sufficient vertical spacing separates the two sections (e.g., `mt-8` or greater)
- [ ] The two sections do not visually merge at any breakpoint
- [ ] Each section has its own accessible `aria-label` or `aria-labelledby`
- [ ] Empty state for each section is handled independently

---

## Copy Hardening Checklist

### Route Level

- [ ] Route-level demo notice is prominent and positioned above both sections
- [ ] Copy includes: "Demo only"
- [ ] Copy includes: "Diagnostic preview only"
- [ ] Copy includes: "Uses safe mock data"
- [ ] Copy includes: "No real student or personnel data"
- [ ] Copy includes: "Not saved"
- [ ] Copy includes: "Not submitted"
- [ ] Copy includes: "Not official evidence"
- [ ] Copy includes: "Not an approval"
- [ ] Copy includes: "Not an assignment"
- [ ] Copy includes: "Not a scholarship decision"

### Candidate Section

- [ ] Section copy communicates: "local review signal only — not a production assignment"
- [ ] Section copy communicates: "diagnostic preview only"
- [ ] Section copy communicates: "no scholarship decision"
- [ ] Section copy communicates: "no candidate assignment"
- [ ] Section description passed to shell does not use production workflow language

### Backlog Section

- [ ] Section copy communicates: "planning preview only — not a production backlog"
- [ ] Section copy communicates: "mock backlog items only — not real stakeholder feedback"
- [ ] Section copy communicates: "no feedback collection"
- [ ] Section copy communicates: "not submitted to production backlog"
- [ ] Section copy communicates: "not AP-10B evidence"
- [ ] Section description passed to component does not use production feedback language

---

## Accessibility Checklist

- [ ] Heading hierarchy is logical (no skipped levels)
- [ ] `CandidateSelectionReviewShell` has a section-level accessible label
- [ ] `FeedbackBacklogPreview` has a section-level accessible label
- [ ] Route-level demo notice has `role="note"` or equivalent
- [ ] Priority and status indicators are not color-only — text or pattern used
- [ ] Read-only badges are text-visible — not icon-only
- [ ] `aria-readonly="true"` or equivalent on read-only interactive-looking elements
- [ ] False safety flag indicators carry text labels — not icon-only
- [ ] Empty state copy is readable without icons
- [ ] No interactive element implies an action that cannot be taken
- [ ] Keyboard tab order is logical and does not focus non-actionable items

---

## Responsive Checklist

- [ ] Both sections stack vertically at 768px and below
- [ ] No horizontal overflow at any common breakpoint (320px, 375px, 768px, 1024px)
- [ ] Route-level demo warning remains visible at all breakpoints
- [ ] Section headings remain visible at small widths
- [ ] Card content within each section is not clipped at small widths
- [ ] Spacing between sections is visible at small widths
- [ ] Badge text is not truncated at small widths

---

## Negative Behavior Checklist

Before merging a future UX hardening branch, confirm all of the following are absent:

- [ ] No `<form>` elements
- [ ] No `<input>` elements
- [ ] No `<textarea>` elements
- [ ] No submit button
- [ ] No save button
- [ ] No assign button
- [ ] No approve button
- [ ] No decision button
- [ ] No export or download button
- [ ] No `fetch()` or `axios()` or `useEffect` network call
- [ ] No `localStorage` read or write
- [ ] No `sessionStorage` read or write
- [ ] No `IndexedDB` access
- [ ] No `AuditService.record()` call
- [ ] No `sharedMockWriter` call
- [ ] No audit repository call
- [ ] No notification send
- [ ] No file export

---

## Validation Commands

Run at every checkpoint before merging a future UX hardening branch:

```bash
npm run build
# Expected: ✓ Generating static pages (41/41) — 0 type errors

npm run check:tokens
# Expected: All token formatting checks passed.

npm run check:audit-events
# Expected: All audit event checks passed: 418/418
```

Route smoke test (all must return 200):

```bash
curl -o /dev/null -w "%{http_code}" http://localhost:3000/login
curl -o /dev/null -w "%{http_code}" http://localhost:3000/admin/audit-log
curl -o /dev/null -w "%{http_code}" http://localhost:3000/admin/dashboard
curl -o /dev/null -w "%{http_code}" http://localhost:3000/staff/applications/app_001
curl -o /dev/null -w "%{http_code}" http://localhost:3000/staff/applications/app_002
curl -o /dev/null -w "%{http_code}" http://localhost:3000/admin/candidate-review-demo
```

Diff scope confirmation (must return empty):

```bash
git diff --name-only origin/main...HEAD | grep -v "^src/app/admin/candidate-review-demo/page.tsx" \
  | grep -v "^src/components/assignment/CandidateSelectionReviewShell.tsx" \
  | grep -v "^src/components/assignment/FeedbackBacklogPreview.tsx" \
  | grep -v "^docs/" \
  || echo "(none — scope confirmed)"
```

---

## Merge and Post-Merge QA Criteria

A future UX hardening branch may only be merged to main if ALL of the following are true:

- [ ] All items in the Section Separation Checklist pass
- [ ] All items in the Copy Hardening Checklist pass
- [ ] All items in the Accessibility Checklist pass
- [ ] All items in the Responsive Checklist pass
- [ ] All items in the Negative Behavior Checklist pass (all absent)
- [ ] Build passes: 41/41, 0 type errors
- [ ] Token checks pass: 4/4
- [ ] Audit checks pass: 418/418 (no regression)
- [ ] Routes pass: 6×200 OK
- [ ] Dev log is clean
- [ ] Diff scope is limited to allowed files only
- [ ] AP-10B gate unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers
- [ ] AP-10C blocked
- [ ] AP-11 blocked

---

## Non-Approval Confirmation

This checklist does not constitute approval of any kind. No UX hardening branch proposal constitutes AP-10B evidence. No merge of a UX hardening branch constitutes AP-10B sign-off. The AP-10B gate remains 0/7 owners, 0/7 approvals, 9/9 blockers regardless of how many UX hardening branches are created or merged.

AP-10C and AP-11 remain blocked.

---

## AP-10B Separation Statement

Creating a UX hardening branch from this checklist is a scoped engineering process, not a governance action. Improving demo copy, heading structure, accessibility, or responsive layout does not constitute AP-10B approval, production readiness, scholarship decision, candidate assignment, or official evidence.

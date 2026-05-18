# S²IMS Candidate Review Demo Combined Preview QA & UX Hardening Plan MC34

## 1. Purpose

MC34 defines QA and UX hardening requirements for the combined hidden demo route at `/admin/candidate-review-demo` that now displays both the candidate review diagnostic preview and the feedback backlog preview.

Core rule:
The combined demo route must remain a read-only, safe mock-data, non-official demonstration surface. It must not collect feedback, save data, submit data, approve work, assign work, create official evidence, expose navigation, or change AP-10B governance status.

Branch creation or runtime hardening does not constitute AP-10B approval. No MC34 document constitutes official evidence or governance action.

---

## 2. Scope

### In scope

- Combined route UX review criteria
- Section separation rules
- Required copy for both preview sections
- Risk analysis of confusing candidate review vs. backlog preview
- Accessibility check requirements
- Responsive layout check requirements
- Empty-state check requirements
- Negative behavior check requirements
- QA checklist for future UX hardening implementation
- AP-10B separation rules

### Out of scope

- Runtime implementation of any UX hardening
- Route modification
- Navigation exposure
- New route or page creation
- Feedback form implementation
- Storage or persistence
- Backend or API
- Database schema or migration
- Audit write implementation
- Official evidence creation
- Candidate assignment
- Scholarship approval decision
- AP-10B governance action
- AP-10C activation
- AP-11 activation

---

## 3. Source Baseline

The combined hidden demo route was built across the following MCs:

| MC | Contribution |
|----|-------------|
| MC20 | Hidden candidate review diagnostic demo route created at `/admin/candidate-review-demo` |
| MC31 | `FeedbackBacklogPreview` read-only component created |
| MC33 | `FeedbackBacklogPreview` integrated into the hidden demo route |

Current state on main:
- Route exists and loads at `/admin/candidate-review-demo` — 200 OK
- Route is hidden from all navigation (nav config, Sidebar, MobileBottomNav, Topbar)
- Route contains two sections: candidate review preview and feedback backlog preview
- No feedback form exists
- No audit write exists
- No persistence exists
- No backend or API exists
- No official evidence exists

Validation baseline (post-MC33):
- Build: 41/41 pages, 0 type errors
- Token checks: 4/4
- Audit/event checks: 418/418
- Routes: 6×200 OK
- Dev log: clean

MC34 does not modify source or runtime files. Baseline is unchanged by this document.

---

## 4. Combined Route Sections

The hidden demo route now contains two read-only preview sections:

### Section 1 — Candidate Review Diagnostic Preview

Purpose: demonstrates the candidate selection review shell with safe mock candidates.

Requirements:
- Separate heading identifying it as candidate review diagnostic preview
- Explanatory copy confirming demo-only, read-only, no official workflow
- Demo/read-only boundary communicated clearly
- No assignment action CTA
- No approval action CTA
- No scholarship decision language
- No official workflow language

### Section 2 — Feedback Backlog Preview

Purpose: demonstrates a read-only view of mock feedback backlog items.

Requirements:
- Separate heading identifying it as backlog preview
- Explanatory copy confirming safe mock data, planning preview only, no production backlog
- Demo/read-only boundary communicated clearly
- No feedback collection form
- No submit action CTA
- No production backlog language
- No real stakeholder, student, or personnel data

### Per-Section Invariants

Each section must have:
- Its own heading (not shared with the other section)
- Its own explanatory copy (not shared)
- An explicit demo/read-only statement
- No action CTA that implies data saving, assignment, or approval
- No official workflow language

---

## 5. Section Separation Rules

Future UX hardening must ensure:

1. Candidate review and feedback backlog sections are visually distinct — different headings, different visual treatment, clear spacing
2. A user can identify that the two sections represent different demo concepts
3. Both sections carry non-official safety copy — no section should look like a production workflow
4. The backlog preview does not look or behave like a production feedback backlog
5. The candidate preview does not look or behave like an assignment workflow
6. Neither section appears to save, submit, or approve anything
7. The combined route does not appear production-ready merely because it contains multiple sections
8. If either section is empty, the empty state communicates "no items to preview" — not "no data found" (which implies real data lookup)

---

## 6. Required Copy Checklist

### Route-Level Copy (present above both sections)

All of the following must be visible at the route level:

- [ ] Demo only
- [ ] Diagnostic preview only
- [ ] Uses safe mock data
- [ ] No real student or personnel data
- [ ] Not saved
- [ ] Not submitted
- [ ] Not official evidence
- [ ] Not an approval
- [ ] Not an assignment
- [ ] Not a scholarship decision

### Candidate Section Copy

In addition to route-level copy, the candidate section must communicate:

- [ ] Local review signal only — not a production assignment
- [ ] Diagnostic preview only — for demonstration purposes
- [ ] No scholarship decision
- [ ] No candidate assignment

### Backlog Section Copy

In addition to route-level copy, the backlog section must communicate:

- [ ] Planning preview only — not a production backlog
- [ ] Mock backlog items only — not real stakeholder feedback
- [ ] No feedback collection
- [ ] Not submitted to production backlog
- [ ] Not AP-10B evidence

---

## 7. Confusion Risks

The combined route introduces risks of misinterpretation. The following must be addressed by future UX hardening:

### Risk 1 — Backlog Items Misread as Real Feedback

Risk: A viewer may believe the mock backlog items represent real stakeholder feedback.

Mitigation: Each backlog item card must carry a "mock data" badge or copy. The section heading must use "Demo Preview" language. The section description must state "mock backlog items only".

### Risk 2 — Candidate Review Actions Misread as Assignment Actions

Risk: A viewer may believe the candidate review shell allows real candidate assignment.

Mitigation: The shell must be read-only. No assign/approve button must be visible or enabled. The section copy must state "local review signal only — not an assignment workflow".

### Risk 3 — False Flags Misread as Editable State

Risk: A viewer may believe the false safety flag indicators in the feedback preview are interactive or editable.

Mitigation: Flag indicators must be read-only and labeled as "mock flags". No edit affordance should be present.

### Risk 4 — AP-10B Impact Label Misread as Approval

Risk: A viewer may believe that a backlog item labeled "AP-10B impact" means that AP-10B approval was taken.

Mitigation: Any AP-10B reference in the backlog preview must carry accompanying copy: "This label indicates a planning flag only. No AP-10B action was taken."

### Risk 5 — Route Appears Production-Ready

Risk: A viewer may believe the route is production-ready because it now has multiple sections, each with realistic content.

Mitigation: The route-level demo notice must remain prominent. Both sections must repeat read-only and demo-only copy. The route must not be accessible from any navigation menu.

---

## 8. Accessibility Requirements

Future UX hardening must satisfy:

### Heading Structure

- [ ] Route-level heading follows logical document outline
- [ ] Section headings are distinct and follow the route heading in outline order
- [ ] No heading is skipped (h1 → h2 → h3, no skipping)

### Section Labels

- [ ] Both sections have accessible `aria-label` or `aria-labelledby` attributes
- [ ] The candidate review section is labeled distinctly from the backlog section
- [ ] Demo notices have `role="note"` or equivalent

### Badges and Status Indicators

- [ ] Read-only badges are text-visible (not icon-only)
- [ ] Priority and status indicators are not color-only — they carry text or pattern
- [ ] False safety flag indicators are text-visible

### Screen Reader State

- [ ] Read-only state is communicated to screen readers (via `aria-readonly` or descriptive copy)
- [ ] No interactive element implies actions that cannot be performed
- [ ] Keyboard focus traversal does not imply editability or actionability

### Empty States

- [ ] Empty states are text-readable without icons
- [ ] Empty state copy does not imply a real data lookup failed
- [ ] Empty state copy confirms mock data context

---

## 9. Responsive Layout Requirements

Future UX hardening must satisfy:

### Small Screen Behavior

- [ ] Both sections stack vertically on small screens (< 768px)
- [ ] Cards and tables within each section remain readable at small width
- [ ] No horizontal overflow on small screens
- [ ] Route-level demo warning remains visible above both sections

### Section Visibility

- [ ] Section labels remain visible at all screen widths
- [ ] Spacing between sections is sufficient to communicate visual separation
- [ ] Candidate review and backlog sections do not visually merge at any breakpoint

### Text Legibility

- [ ] Demo copy remains legible at small sizes
- [ ] Badge text is not clipped or hidden at small sizes
- [ ] Priority and status labels remain readable at small sizes

---

## 10. Negative Behavior QA

At every validation checkpoint, the following must be confirmed absent:

### No Form Runtime

- [ ] No `<form>` elements in the combined route
- [ ] No `<input>` elements
- [ ] No `<textarea>` elements
- [ ] No `<select>` elements (unless display-only with no interaction)

### No Actionable Buttons

- [ ] No submit button
- [ ] No save button
- [ ] No assign button
- [ ] No approve button
- [ ] No decision button
- [ ] No export or download button

### No Data Operations

- [ ] No `fetch()` or `axios` calls
- [ ] No `localStorage` access
- [ ] No `sessionStorage` access
- [ ] No `IndexedDB` access
- [ ] No audit write (no `AuditService.record()`, no `sharedMockWriter`)
- [ ] No export or download behavior

### No Navigation or Scope Expansion

- [ ] `candidate-review-demo` absent from `src/lib/navigation.ts`
- [ ] `candidate-review-demo` absent from `src/components/layout/Sidebar.tsx`
- [ ] `candidate-review-demo` absent from `src/components/layout/MobileBottomNav.tsx`
- [ ] `candidate-review-demo` absent from `src/components/layout/Topbar.tsx`

### No Governance Action

- [ ] AP-10B gate unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers
- [ ] AP-10C remains blocked
- [ ] AP-11 remains blocked

---

## 11. QA Checklist (MC34 Scope)

MC34 is documentation-only. The following confirms the MC34 planning package is complete and safe:

- [ ] MC34 docs created on feature branch — docs-only
- [ ] No `src/*` files changed
- [ ] No `scripts/*` files changed
- [ ] No `package.json` changes
- [ ] Combined route QA plan documented (this document)
- [ ] QA scenario matrix documented
- [ ] UX hardening checklist documented
- [ ] Section separation rules clear
- [ ] Required copy checklist complete
- [ ] Confusion risks documented with mitigations
- [ ] Accessibility requirements documented
- [ ] Responsive layout requirements documented
- [ ] Negative behavior QA requirements documented
- [ ] AP-10B separation rules confirmed
- [ ] Validation baseline unchanged: build 41/41, tokens 4/4, audit 418/418, routes 6×200 OK
- [ ] AP-10B gate unchanged: 0/7, 9/9 blockers
- [ ] AP-10C blocked
- [ ] AP-11 blocked
- [ ] MC1–MC33 boundaries preserved

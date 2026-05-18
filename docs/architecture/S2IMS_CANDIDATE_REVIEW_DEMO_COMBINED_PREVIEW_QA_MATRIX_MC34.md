# S²IMS Candidate Review Demo Combined Preview QA Matrix MC34

## Purpose

This matrix defines the expected and forbidden results for each QA scenario when validating the combined hidden demo route. It covers route-level, candidate section, backlog section, cross-section, accessibility, responsive, negative behavior, and AP-10B separation scenarios.

All scenarios are evaluated against the current route state: read-only, safe mock data, hidden from navigation, no feedback form, no audit write, no persistence, no backend/API.

---

## QA Scenario Matrix

### 1. Route-Level Scenarios

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| Navigate to `/admin/candidate-review-demo` directly | Page loads — 200 OK | Route returns 404 or 500 |
| Check route in sidebar nav | Route is absent from sidebar | Route appears in sidebar nav |
| Check route in top navigation | Route is absent from topnav | Route appears in topnav |
| Check route in mobile bottom nav | Route is absent from mobile nav | Route appears in mobile nav |
| Route-level demo notice | Yellow demo notice visible above both sections | Demo notice is absent or below content |
| Route-level copy — "Demo only" | Present in route notice | Absent |
| Route-level copy — "Safe mock data only" | Present in route notice | Absent |
| Route-level copy — "Not saved" | Present in route notice | Absent |
| Route-level copy — "Not official evidence" | Present in route notice | Absent |
| Route-level copy — "Not an approval" | Present in route notice | Absent |
| Route-level copy — "Not an assignment" | Present in route notice | Absent |

### 2. Candidate Section Scenarios

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| Candidate review section renders | `CandidateSelectionReviewShell` renders with mock candidates | Section is blank or errored |
| Candidate section heading | Section has distinct heading identifying it as candidate review preview | Heading is absent or identical to backlog heading |
| Candidate section copy — "read-only" | Read-only copy present | Copy absent or copy implies editability |
| Candidate section copy — "diagnostic preview only" | Present | Absent |
| Candidate section copy — "Not a scholarship decision" | Present | Absent |
| Candidate section copy — "Not a candidate assignment" | Present | Absent |
| Candidate assign button | No assign button visible or enabled | Assign button present or enabled |
| Candidate approve button | No approve button visible or enabled | Approve button present or enabled |
| Candidate `readonly` prop | `readonly={true}` passed to shell | `readonly={false}` or no `readonly` prop |

### 3. Backlog Section Scenarios

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| Backlog section renders | `FeedbackBacklogPreview` renders with mock backlog items | Section is blank or errored |
| Backlog section heading | Section has distinct heading identifying it as backlog preview | Heading is absent or identical to candidate heading |
| Backlog section copy — "Safe mock data only" | Present | Absent |
| Backlog section copy — "Read-only" | Present | Absent |
| Backlog section copy — "Not saved" | Present | Absent |
| Backlog section copy — "Not submitted" | Present | Absent |
| Backlog section copy — "Not official evidence" | Present | Absent |
| Backlog section copy — "Not AP-10B evidence" | Present | Absent |
| Backlog section copy — "No real stakeholder/student/personnel data" | Present | Absent |
| Feedback form | No `<form>` or `<input>` in backlog section | Form or input present |
| Submit button | No submit button in backlog section | Submit button present or enabled |
| Backlog empty state | Empty state reads "No backlog items to preview" or equivalent | Empty state reads "No results found" (implies real data) |

### 4. Cross-Section Confusion Scenarios

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| Visual distinction between sections | Clear visual separation — spacing, heading, styling | Sections look like one continuous list |
| Headings are unique | Each section has a distinct heading | Both sections share the same heading |
| Copy is unique per section | Candidate and backlog sections have different descriptive copy | Both sections use identical copy |
| Backlog items look like planning artifacts | Backlog cards carry "mock" or "planning" label | Backlog cards look like real stakeholder submissions |
| Candidate review shell looks like review tool | Shell is read-only with diagnostic copy | Shell looks like a live assignment workflow |
| AP-10B impact flag | If an item has "AP-10B impact" label, accompanying copy confirms "planning flag only — no AP-10B action taken" | Flag implies AP-10B approval was performed |
| False flag indicators | Flag indicators are read-only with "mock" label | Flag indicators appear interactive or editable |

### 5. Accessibility Scenarios

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| Heading outline | Headings follow logical order (h1 → h2 → h3, no skipping) | Headings skip levels or are out of order |
| Section landmarks | Each section has `aria-label` or `aria-labelledby` | Sections are unlabeled |
| Demo notice role | Demo notice has `role="note"` or semantic equivalent | Demo notice has no accessible role |
| Priority/status color | Priority and status indicators are not color-only — carry text | Priority readable only via color |
| Badge text | Read-only and mock badges are text-visible | Badges are icon-only |
| Screen reader read-only | Read-only state communicated via `aria-readonly` or copy | Screen reader receives no read-only signal |
| Keyboard traversal | Keyboard focus traversal does not reach non-existent actions | Tab focus lands on disabled submit or assign buttons |
| Empty state accessibility | Empty state text is readable without icons | Empty state is icon-only |

### 6. Responsive Scenarios

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| Small screen layout (< 768px) | Both sections stack vertically | Sections overlap or become unusable |
| Cards at small width | Cards remain readable — no content clipped | Cards clip content horizontally |
| Horizontal overflow | No horizontal scroll at any breakpoint | Page has horizontal overflow |
| Demo warning visibility | Route-level demo warning visible at small sizes | Demo warning pushed below fold or hidden |
| Section labels at small sizes | Section headings remain visible and readable | Section headings disappear or overlap |
| Section spacing | Sufficient vertical spacing between sections on small screens | Sections appear merged |

### 7. Negative Behavior Scenarios

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| Form presence | No `<form>` elements in route | `<form>` element present |
| Input presence | No `<input>` elements | `<input>` element present |
| Submit action | No submit action possible | Submit button present or enabled |
| Assign action | No assign action possible | Assign button present or enabled |
| Fetch/API | No `fetch()` or API call executed on page load or interaction | Network request sent |
| localStorage | No `localStorage` access | localStorage read or written |
| sessionStorage | No `sessionStorage` access | sessionStorage read or written |
| IndexedDB | No `IndexedDB` access | IndexedDB opened or accessed |
| Audit write | No `AuditService.record()` or `sharedMockWriter` call | Audit event written |
| Export/download | No file download triggered | File download initiated |
| Notification | No notification sent | Email, push, or system notification sent |

### 8. AP-10B Separation Scenarios

| Scenario | Expected Result | Must Not Happen |
|----------|-----------------|-----------------|
| AP-10B owner count | 0/7 owners — unchanged | Owner count changes |
| AP-10B approval count | 0/7 approvals — unchanged | Approval count changes |
| AP-10B blocker count | 9/9 blockers active — unchanged | Blocker count decreases |
| AP-10C status | Blocked — unchanged | AP-10C activated |
| AP-11 status | Blocked — unchanged | AP-11 activated |
| Viewing combined route | Viewing route does not constitute AP-10B approval | Route viewing treated as governance action |
| Backlog preview with AP-10B impact flag | Flag is planning label only — AP-10B gate unchanged | Gate status treated as changed because of flag |

---

## AP-10B Separation Statement

No scenario in this matrix constitutes AP-10B approval. No QA result constitutes official evidence. No backlog item shown in the preview constitutes AP-10B sign-off. The AP-10B gate remains 0/7 owners, 0/7 approvals, 9/9 blockers regardless of how many times the combined demo route is reviewed or validated.

AP-10C and AP-11 remain blocked.

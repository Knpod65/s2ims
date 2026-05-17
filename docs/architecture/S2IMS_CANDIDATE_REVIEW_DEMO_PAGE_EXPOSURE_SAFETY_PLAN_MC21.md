# S²IMS Candidate Review Demo Page Exposure Safety Plan MC21

## 1. Purpose

MC21 defines safe exposure rules, stakeholder review boundaries, and access expectations for the MC20 read-only diagnostic preview demo page at `/admin/candidate-review-demo`.

**Core Rule:**
The demo page may support internal review, training, and stakeholder understanding only. It must not become an official workflow surface, audit evidence surface, approval surface, assignment surface, or AP-10B governance surface.

MC21 does NOT authorize:
- Runtime implementation of any route guard
- Navigation changes
- Backend/API routes
- Persistence activation
- Audit writes
- Official evidence
- Assignment or approval
- Scholarship decision
- AP-10B collection
- AP-10C
- AP-11

MC21 is documentation-only. No `src/*`, no `scripts/*`, no `package.json` changes.

---

## 2. Scope

### In Scope

- Demo page exposure rules
- Stakeholder review rules
- Access and navigation expectations
- Demo copy requirements
- Review-session safety checklist
- QA checklist before demos
- AP-10B separation documentation

### Out of Scope

- Runtime implementation of any kind
- Route guard implementation
- Navigation implementation
- Backend/API
- Persistence (database, file, browser storage)
- Audit writes
- Export or notification behavior
- Official evidence creation
- Real student, personnel, or scholarship data
- Assignment
- Approval
- Scholarship decision
- AP-10B governance
- AP-10C
- AP-11

---

## 3. Source Baseline

MC21 builds on the following completed milestones. MC21 does NOT modify any source files.

### MC19 — Demo Page Plan

`docs/architecture/S2IMS_CANDIDATE_REVIEW_DIAGNOSTIC_PREVIEW_DEMO_PAGE_PLAN_MC19.md` defined the planning requirements: read-only default, safe mock data rules, demo copy requirements, privacy boundaries, route/access option inventory, and QA checklist for the implementation branch.

### MC20 — Demo Page Runtime

`src/app/admin/candidate-review-demo/page.tsx` implemented the isolated admin demo route at `/admin/candidate-review-demo`. The page:
- Renders `CandidateSelectionReviewShell` with `readonly={true}`
- Uses safe mock data from `src/lib/assignment/candidateReviewDemoData.ts`
- Contains all required demo banner copy
- Makes no API calls, writes no audit events, persists nothing

### Current Validation Baseline

| Check | Result |
|-------|--------|
| Build | 41/41 pages, 0 type errors |
| Token check | 4/4 |
| Audit/event checks | 341/341 |
| Routes | 6×200 OK |
| Dev log | Clean |

### AP-10B Status

| Metric | Value |
|--------|-------|
| Owners identified | 0/7 |
| Approvals collected | 0/7 |
| Blocking conditions active | 9/9 |
| AP-10C | Blocked |
| AP-11 | Blocked |

MC21 does not modify any of these values.

---

## 4. Allowed Demo Uses

### Allowed

- Internal product review sessions
- Stakeholder walkthrough (product team, governance reviewers, trainers)
- UX/UI review and feedback collection
- Training demonstration for staff or administrators
- Privacy review to confirm no PII is displayed
- Accessibility review
- Safe mock data structure demonstration
- Documentation of what the candidate review workflow surface looks like

### Not Allowed

| Use | Why Forbidden |
|-----|--------------|
| Processing real candidate applications | No real workflow action is available |
| Assigning real staff or advisors | No assignment action exists |
| Making scholarship decisions | No decision action exists |
| Collecting approvals | No approval action exists |
| Collecting AP-10B governance approvals | AP-10B gate is separate and unchanged |
| Creating audit evidence | No audit write exists |
| Exporting records | No export behavior exists |
| Notifying users | No notification behavior exists |
| Treating demo feedback as official sign-off | Feedback is not governance |

---

## 5. Access and Exposure Rules

### Current State

The demo route `/admin/candidate-review-demo` exists as an isolated admin route with no navigation link from any sidebar, topnav, or breadcrumb. Access requires knowing the URL directly. This is the recommended current state.

### Exposure Rules

1. **No public exposure** — the demo route must not be exposed to the public or to unauthenticated users by default.
2. **No production nav link** — no link to the demo route may be added to sidebar, topnav, breadcrumb, or dashboard without a separate explicitly approved branch.
3. **No real data source** — the demo page must only use the safe mock data helper `createCandidateReviewDemoCandidates()`. No database query, API call, or real data import is permitted.
4. **No external links to production actions** — the demo page must not contain links or buttons that navigate to real workflow pages or trigger real workflow actions.
5. **No export or download** — no export, download, or save-to-file behavior.
6. **No notification** — no email, SMS, or in-app notification triggered by demo interactions.
7. **No official workflow CTA** — no button labeled "Assign", "Approve", "Submit", "Confirm", "Record", "Save", or any variant that implies official workflow action.

### Future Exposure Changes

Any change to the above rules (e.g., adding a nav link, adding a role guard, changing route path) requires:
1. A separate explicitly approved branch
2. Its own planning document
3. QA validation confirming no regression

---

## 6. Required Demo Banner Copy

The demo page at `/admin/candidate-review-demo` currently includes all of the following required copy. Any future modification to the demo page must preserve these strings.

### Required Copy (must be present)

| String | Location |
|--------|----------|
| `"Demo only"` | Demo banner |
| `"Diagnostic preview only"` | Demo banner |
| `"Uses safe mock data"` | Demo banner |
| `"No real student or personnel data"` | Demo banner |
| `"Not saved"` | Demo banner |
| `"Not submitted"` | Demo banner |
| `"Not official evidence"` | Demo banner or shell |
| `"Not an approval"` | Demo banner or shell |
| `"Not an assignment"` | Demo banner or shell |
| `"Not a scholarship decision"` | Demo banner |

### Forbidden Copy (must NOT appear as a positive claim)

| String | Why Forbidden |
|--------|--------------|
| `"Production ready"` | Implies official status |
| `"Official"` (as positive claim) | Implies governance status |
| `"Approved"` (as positive claim) | Implies approval action occurred |
| `"Assigned"` (as positive claim) | Implies assignment action occurred |
| `"Submitted"` (as positive claim) | Implies form submission occurred |
| `"Recorded"` (as positive claim) | Implies data persistence occurred |
| `"Evidence collected"` | Implies official audit evidence |
| `"Real workflow"` | Implies official workflow |
| `"AP-10B approved"` | Implies AP-10B governance action |

---

## 7. Review Session Safety Checklist

Before running any stakeholder demo session using the demo page, the session host must confirm all of the following:

### Technical Checks

- [ ] Route `/admin/candidate-review-demo` returns 200 OK
- [ ] Demo page displays the demo banner with all required copy strings
- [ ] `createCandidateReviewDemoCandidates()` returns 4 safe items with `"demo-"` prefix candidateIds
- [ ] `assertSafeCandidateReviewDemoData` passes at render time
- [ ] No API or network call is made when the page loads (confirm via browser devtools Network tab)
- [ ] No data is written to localStorage, sessionStorage, or IndexedDB
- [ ] No audit write call is made (no sharedMockWriter, AuditService, repository)
- [ ] All action buttons are disabled (`readonly={true}`)
- [ ] No Assign/Approve/Decision/Submit/Save button is enabled

### Governance Checks

- [ ] AP-10B gate unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers active
- [ ] AP-10C: Blocked
- [ ] AP-11: Blocked
- [ ] Demo session is not an AP-10B approval event
- [ ] Demo session is not an AP-10C trigger
- [ ] Demo session is not a production readiness approval

### Safety Checks

- [ ] No PII is displayed on the demo page
- [ ] No real student or personnel identifiers are present
- [ ] Demo banner is clearly visible at page load
- [ ] Diagnostic preview panel warnings are present

---

## 8. Demo Feedback Rules

### Feedback May Be Collected About

- UI clarity and comprehension
- UX flow and navigation expectations
- Copy legibility
- Accessibility and keyboard navigation
- Workflow understanding (does the demo help reviewers understand the real workflow?)
- Privacy concerns (is any displayed element concerning from a privacy perspective?)
- Accessibility concerns
- Suggested copy improvements

### Feedback Must NOT Be Recorded As

| Forbidden Recording | Why |
|--------------------|-----|
| Approval of the workflow | Demo feedback is not governance |
| Official decision | Demo is not an official workflow surface |
| AP-10B sign-off | AP-10B requires separate gate clearance |
| Authority verification | Demo data is mock only |
| Production readiness approval | Separate approval process required |
| Scholarship assignment authorization | Not a scholarship surface |

### Feedback Collection Format

Feedback may be collected in:
- Written notes
- Informal verbal summary
- Design review comments
- Documentation comments

Feedback must NOT be collected in:
- AP-10B sign-off forms
- Official approval trackers
- Scholarship assignment records
- Audit event logs

---

## 9. AP-10B Separation

The MC20 demo page does not interact with AP-10B governance in any way. MC21 does not change this.

| Metric | Status |
|--------|--------|
| Candidate owners identified | 0/7 — unchanged |
| Authority verified | 0/7 — unchanged |
| Named owners | 0/7 — unchanged |
| Approvals collected | 0/7 — unchanged |
| Blocking conditions active | 9/9 — unchanged |
| AP-10C may open | No |
| AP-11 may open | No |

**Demo sessions using the MC20 page do not contribute to, clear, or modify any AP-10B blocking condition.**

---

## 10. QA Checklist

- [ ] MC21 is docs-only — no `src/*`, `scripts/*`, or `package.json` changes
- [ ] Exposure rules documented
- [ ] Stakeholder review checklist documented (see MC21 stakeholder checklist doc)
- [ ] Exposure decision matrix documented (see MC21 exposure decision matrix doc)
- [ ] Demo feedback boundaries documented
- [ ] Required copy rules documented
- [ ] Forbidden copy rules documented
- [ ] AP-10B separation documented
- [ ] No route/navigation change
- [ ] No runtime implementation
- [ ] Build 41/41, 0 type errors
- [ ] Token check 4/4
- [ ] Audit checks 341/341
- [ ] All 6 routes 200 OK
- [ ] Dev log clean
- [ ] MC1–MC20 boundaries preserved
- [ ] AP-10B gate unchanged: 0/7 owners, 9/9 blockers
- [ ] AP-10C blocked
- [ ] AP-11 blocked

---

## 11. Closure Verdict

MC21 documents the safe exposure and stakeholder review boundaries for the MC20 diagnostic preview demo page. This plan authorizes documentation of boundaries only. It does NOT authorize any runtime, navigation, or route changes.

**MC21 planning is documentation-only. No route, navigation, or runtime was implemented.**
AP-10C remains blocked. AP-11 remains blocked.

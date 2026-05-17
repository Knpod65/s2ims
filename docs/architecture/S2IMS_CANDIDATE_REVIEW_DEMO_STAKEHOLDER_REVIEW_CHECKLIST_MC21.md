# S²IMS Candidate Review Demo Page Stakeholder Review Checklist MC21

## Purpose

This checklist must be completed before, during, and after any stakeholder demo session using the MC20 read-only diagnostic preview demo page at `/admin/candidate-review-demo`. It ensures demo sessions remain safe, bounded, and clearly separated from official workflow actions and AP-10B governance.

---

## Pre-Demo Checklist

Complete all items before beginning any demo session.

### Technical Verification

- [ ] Route `/admin/candidate-review-demo` returns 200 OK
- [ ] Build passes: `npm run build` → 41/41, 0 type errors
- [ ] Audit checks pass: `npm run check:audit-events` → 341/341
- [ ] Token checks pass: `npm run check:tokens` → 4/4
- [ ] Demo page displays the demo banner at page load
- [ ] Demo banner contains: "Demo only", "Uses safe mock data", "No real student or personnel data"
- [ ] Demo banner contains: "Not saved", "Not submitted", "Not official evidence"
- [ ] Demo banner contains: "Not an approval", "Not an assignment", "Not a scholarship decision"
- [ ] All action buttons (Shortlist, Skip, Review, etc.) are disabled
- [ ] No enabled Assign/Approve/Decision/Submit/Save button visible

### Data Safety Verification

- [ ] Confirm candidateIds all use `"demo-"` prefix
- [ ] Confirm no real student identifiers displayed
- [ ] Confirm no PII fields (email, phone, nationalId, bankAccount, remark) displayed
- [ ] Confirm `isMock: true` for all displayed candidates
- [ ] Confirm `privacyLevel: "safe_display"` for all displayed candidates

### Governance Verification

- [ ] AP-10B gate unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers
- [ ] AP-10C: Blocked
- [ ] AP-11: Blocked
- [ ] This demo session is NOT an AP-10B approval event
- [ ] This demo session is NOT an AP-10C trigger
- [ ] This demo session is NOT a production readiness sign-off

### Network Verification (browser devtools)

- [ ] No API or network fetch call triggered on page load
- [ ] No XHR or Fetch request made by the demo page
- [ ] No data written to localStorage, sessionStorage, or IndexedDB

---

## During-Demo Checklist

Confirm the following throughout the demo session.

### Interaction Boundaries

- [ ] No live or real candidate data is entered into the demo page
- [ ] No enabled action button is clicked (all buttons should be disabled in readonly mode)
- [ ] No export, download, or print action is triggered
- [ ] No notification is triggered
- [ ] No screen is navigated to that contains real candidate, student, or scholarship data
- [ ] Demo banner remains visible throughout the session

### Communication Boundaries

- [ ] Demo is clearly introduced as "Demo only. Uses safe mock data."
- [ ] Participants are informed: "This is not an official workflow session."
- [ ] Participants are informed: "No data is saved or submitted."
- [ ] Participants are informed: "Feedback collected here is not a governance approval."
- [ ] No participant action is described as "approving", "assigning", or "deciding"

### Diagnostic Preview Boundaries (if preview panel is shown)

- [ ] Diagnostic preview panel warning copy is visible: "Audit preview is diagnostic only."
- [ ] False flags are visible: `persisted: false`, `officialEvidence: false`, `diagnosticOnly: true`
- [ ] No participant interprets the preview as an official audit record

---

## Post-Demo Checklist

Complete after the demo session ends.

### Data State Verification

- [ ] No data was persisted (no database write, no localStorage write, no API call)
- [ ] No approval was recorded
- [ ] No assignment was recorded
- [ ] No scholarship decision was recorded
- [ ] No AP-10B approval was collected
- [ ] AP-10B gate unchanged after session: 0/7, 9/9 blockers
- [ ] AP-10C status unchanged: Blocked
- [ ] AP-11 status unchanged: Blocked

### Feedback Handling

- [ ] Feedback collected is stored as informal notes or design review comments only
- [ ] Feedback is NOT filed in AP-10B sign-off forms
- [ ] Feedback is NOT filed in official approval trackers
- [ ] Feedback is NOT filed in scholarship assignment records
- [ ] Feedback is NOT filed in audit event logs

---

## Feedback Collection Rules

### Allowed Feedback Topics

| Topic | Allowed |
|-------|---------|
| UI clarity and comprehension | Yes |
| UX flow and navigation expectations | Yes |
| Copy legibility and tone | Yes |
| Accessibility and keyboard navigation | Yes |
| Privacy concerns (display safety) | Yes |
| Workflow understanding questions | Yes |
| Suggested copy improvements | Yes |
| Confusion about demo vs. real workflow | Yes |

### Forbidden Feedback Classifications

| Classification | Why Forbidden |
|----------------|--------------|
| Approval of the workflow | Demo feedback is not governance |
| Official decision on candidate review | Demo is not an official workflow surface |
| AP-10B sign-off | Requires separate gate clearance |
| Authority verification | Mock data only |
| Production readiness approval | Separate approval process required |
| Scholarship assignment authorization | Not a scholarship surface |

---

## Privacy Check

Before and during the demo:

| Privacy Item | Check |
|-------------|-------|
| No real student ID displayed | Verify candidateIds start with `"demo-"` |
| No real teacher/advisor ID displayed | Verify sourceIds start with `"demo-source-"` |
| No nationalId displayed | Not present in demo data |
| No phone/mobile displayed | Not present in demo data |
| No email displayed | Not present in demo data |
| No bankAccount displayed | Not present in demo data |
| No private remark displayed | Not present in demo data |
| No approvalStatus displayed | Not present in demo data |

---

## Accessibility Check

| Accessibility Item | Check |
|-------------------|-------|
| Demo banner is visible on page load | Required |
| Disabled buttons are visually distinct | Required |
| `aria-disabled="true"` on disabled buttons | Required |
| `aria-live="polite"` on diagnostic preview panel | Required |
| `aria-label` on demo notice | Required |
| Keyboard navigation does not trigger disabled buttons | Required |

---

## AP-10B Separation Check

The following must be confirmed before and after every demo session:

| AP-10B Item | Required Status |
|------------|----------------|
| Owners identified | 0/7 — unchanged |
| Approvals collected | 0/7 — unchanged |
| Blocking conditions active | 9/9 — unchanged |
| AP-10C | Blocked |
| AP-11 | Blocked |
| Demo session contributed to AP-10B | Never |
| Demo session cleared a blocking condition | Never |

---

## Sign-Off Restrictions

The following actions are explicitly forbidden after a demo session:

| Forbidden Action | Alternative |
|-----------------|-------------|
| Recording demo attendance as AP-10B approval | Do not record |
| Recording demo feedback as governance sign-off | File as informal notes only |
| Using demo completion to advance AP-10B gate | Separate AP-10B process required |
| Describing demo session as "production approval" | Demo is not a production approval |
| Marking demo as "scholarship decision made" | No scholarship decision was made |

# S²IMS Candidate Review Diagnostic Preview Demo Page Plan MC19

## 1. Purpose

MC19 plans a future read-only demo page for safely demonstrating the Candidate Review Diagnostic Preview UI to stakeholders (reviewers, trainers, governance evaluators) without triggering any real workflow actions.

**Core Rule:**
The demo page is for review, training, and stakeholder understanding only. It must not create official evidence, audit writes, persistence, assignment, approval, scholarship decision, AP-10B approval, AP-10C activity, or AP-11 activity.

MC19 does NOT authorize:
- Runtime implementation of any demo page
- Route or page creation
- Backend/API routes
- Persistence activation
- Audit writes
- Official evidence
- Assignment or approval
- Scholarship decision
- AP-10B collection
- AP-10C
- AP-11

MC19 is documentation-only. No `src/*`, no `scripts/*`, no `package.json` changes.

---

## 2. Scope

### In Scope

- Demo page purpose and audience definition
- Read-only default behavior specification
- Safe mock data rules
- Demo copy requirements
- Privacy boundaries
- Route/access option inventory
- QA checklist for future implementation branch

### Out of Scope

- Runtime implementation of any demo page
- Route or page creation (`src/app/*`)
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

MC19 builds on the following completed milestones. MC19 does NOT modify any of these source files.

### MC13 — Diagnostic Preview UI

`src/components/assignment/CandidateSelectionReviewShell.tsx` displays the MC12 no-op preview result in a local React `useState` panel. Safe fields shown: `eventName`, `poolType`, `roleCategory`, `workflowContext`, `previousReviewState`, `nextReviewState`, `safeReasonCode`, `mode`, `persisted`, `written`, `exported`, `notified`, `officialEvidence`, `diagnosticOnly`, `discardedAfterPreview`, `message`.

### MC15 — UX Hardening

Added "not saved / not submitted / not official evidence / not approval / not assignment" labels, `aria-live="polite"` accessibility marker, and strengthened warning copy.

### MC17 — Interaction Polish

Latest-preview-only behavior, clear/reset clears review state to `not_reviewed`, previous and next review state visible, accessibility improvements.

### MC18 — Readiness Closure

Formally closed MC13–MC17. Documented what is complete, what is not implemented, AP-10B separation, allowed future options. Listed MC19 read-only demo page as an allowed future branch option.

---

## 4. Demo Page Requirements

A future demo page implementation must meet all of the following requirements:

### Read-Only Default

- `readonly` prop must be `true` — no review action buttons enabled
- No Assign, Approve, or Decision button visible or enabled
- `FORBIDDEN_ACTIONS` set (MC8) must remain intact

### Safe Mock Data Only

- All candidate data must be demo-constructed (see Section 5)
- No real student IDs, teacher IDs, national IDs, or personnel records
- No real scholarship decisions, approval statuses, or AP-10B data
- No database query, API call, or external data fetch

### Demo Labeling

- A clearly visible demo banner must be present on the page
- The banner must state: "Demo only. Uses safe mock data. No real student or personnel data."
- All preview output must retain the existing diagnostic warning copy from MC15/MC17

### No Persistence

- No `localStorage`, `sessionStorage`, or `IndexedDB`
- No API call or fetch
- No audit write (no `sharedMockWriter`, no `AuditService`, no repository)
- No export or download behavior
- No notification

### No Official Workflow Actions

- No candidate assignment
- No approval collection
- No scholarship decision recording
- No AP-10B approval collection
- No AP-10C activity
- No AP-11 activity

---

## 5. Safe Mock Data Rules

### Allowed Demo Fields

| Field | Allowed Values |
|-------|---------------|
| `candidateId` | `"demo-advisor-001"`, `"demo-advisor-002"`, `"demo-staff-001"`, etc. |
| Display name | `"Advisor Demo 1"`, `"Staff Demo 1"`, etc. |
| `poolType` | `"advisor"` or `"staff"` |
| `roleCategory` | `"advisor_demo"`, `"staff_demo"`, or other clearly demo strings |
| `actorRole` | `"system_preview"` (the safe demo literal in the union) |
| `workflowContext` | `"candidate_review"` (safe demo value) |
| `safeReasonCode` | Any safe string without PII (e.g., `"demo_shortlist"`, `"demo_skip"`) |

### Forbidden Demo Fields

| Field | Why Forbidden |
|-------|--------------|
| Real student IDs (`S-xxxx` or raw numeric) | PII |
| Real teacher/advisor personnel IDs | PII |
| `nationalId` | PII |
| `mobile`, `phone` | PII |
| `email`, `personalEmail`, `rawEmail`, `privateEmail` | PII |
| `remark`, `freeTextReason`, `reasonText` | May contain PII |
| `rawStudentId` | PII |
| `bankAccount` | PII / financial |
| `approvalStatus`, `approvedBy` | Governance status |
| `scholarshipDecision` | Official outcome |
| `assignedBy`, `assignedAt` | Official assignment record |
| `ap10bApproval`, `authorityEvidence` | AP-10B governance |

### Constructing Safe Demo Candidates

All demo candidates must be constructed inline in the demo page or a co-located demo fixture file. They must NOT be imported from real data sources, mock data files containing real-looking student records, or any database query.

---

## 6. Demo Copy Requirements

### Required Copy (must be present on the demo page)

- `"Demo only"` — visible banner or label
- `"Diagnostic preview only"` — in or near the preview panel
- `"Not saved"` — in or near the preview panel (inherited from MC15)
- `"Not submitted"` — in or near the preview panel (inherited from MC15)
- `"Not official evidence"` — in or near the preview panel (inherited from MC15)
- `"Not an approval"` — in or near the preview panel (inherited from MC15)
- `"Not an assignment"` — in or near the preview panel (inherited from MC15)
- `"Not a scholarship decision"` — at minimum implied by context
- `"Uses safe mock data"` — visible banner or label
- `"No real student or personnel data"` — visible banner or label

### Forbidden Copy (must NOT appear on the demo page)

- `"Official"` (as a positive claim)
- `"Approved"` (as a positive claim)
- `"Assigned"` (as a positive claim)
- `"Saved"` (as a positive claim)
- `"Submitted"` (as a positive claim)
- `"Evidence collected"` (as a positive claim)
- `"Production audit"` (as a positive claim)
- `"Real workflow"` (as a positive claim)
- `"AP-10B approved"` (as a positive claim)

---

## 7. Route and Access Planning

### Future Implementation Options

| Option | Description | Notes |
|--------|-------------|-------|
| Internal admin demo route | `src/app/admin/demo/candidate-review/page.tsx` | Role-gated, admin only, clearly labeled |
| Hidden dev route | `src/app/dev/demo/candidate-review/page.tsx` | Not linked in nav, dev environment only |
| Storybook/component preview | `CandidateSelectionReviewShell.stories.tsx` | If Storybook is available; no route needed |
| Role-gated training page | `src/app/staff/training/candidate-review-demo/page.tsx` | For staff trainer use only |

### Route Requirements (whichever option is chosen)

- No public exposure by default — must be behind role gate or dev-only guard
- No data fetch — all data must be inline demo fixtures
- No real data dependency — no database, no API
- No external link or export
- Clear demo banner visible at page load
- No navigation link from production UI unless explicitly approved

---

## 8. QA Checklist (for future implementation branch)

When a future implementation branch is created, it must pass all of the following:

### Scope

- [ ] Demo page confined to allowed `src/app/` path (admin, dev, or training only)
- [ ] No `src/lib/*`, `src/components/*` modifications beyond the demo page
- [ ] No `scripts/*` changes unless adding new audit checks for the demo page
- [ ] No `package.json` changes

### Mock Data

- [ ] All candidate data constructed inline or from a co-located demo fixture
- [ ] No real student IDs — grep confirms no `S-\d{4}` or national ID patterns
- [ ] No PII fields (phone, email, nationalId, bankAccount, remark) in demo fixture
- [ ] `actorRole: "system_preview"` used
- [ ] `workflowContext: "candidate_review"` used

### Copy

- [ ] Demo banner present: "Demo only. Uses safe mock data."
- [ ] "Not saved / not submitted / not official evidence" copy present
- [ ] No forbidden copy present ("Official", "Approved", "Assigned", etc.)

### Read-Only

- [ ] `readonly` defaults to `true` on the demo page
- [ ] No enabled Assign/Approve/Decision button
- [ ] `FORBIDDEN_ACTIONS` set intact

### No Persistence / No API

- [ ] No `localStorage`, `sessionStorage`, `IndexedDB` — grep confirms no hits
- [ ] No `fetch()` or API call — grep confirms no hits
- [ ] No `sharedMockWriter`, `AuditService`, repository calls — grep confirms no hits

### AP-10B

- [ ] AP-10B gate unchanged: 0/7 owners, 0/7 approvals, 9/9 blockers
- [ ] AP-10C: Blocked
- [ ] AP-11: Blocked

### Validation

- [ ] `npm run build` → 40/40 pages (or incremented if new page added), 0 type errors
- [ ] `npm run check:tokens` → 4/4
- [ ] `npm run check:audit-events` → 316/316 (or incremented if new checks added)
- [ ] Routes: 5×200 OK baseline preserved
- [ ] Dev log: Clean

---

## 9. AP-10B Separation

The demo page does not interact with AP-10B governance in any way.

| Metric | Status |
|--------|--------|
| Candidate owners identified | 0/7 — unchanged |
| Authority verified | 0/7 — unchanged |
| Named owners | 0/7 — unchanged |
| Approvals collected | 0/7 — unchanged |
| Blocking conditions active | 9/9 — unchanged |
| AP-10C may open | No |
| AP-11 may open | No |

---

## 10. Closure Verdict

MC19 documents the planning requirements for a future read-only demo page. This plan authorizes documentation of requirements only. It does NOT authorize implementation.

**A future implementation branch must:**
1. Receive explicit separate approval
2. Follow all requirements in this plan
3. Pass the QA checklist in Section 8
4. Not modify AP-10B gate, AP-10C, or AP-11 status

**MC19 planning is documentation-only. No route, page, or runtime was implemented.**
AP-10C remains blocked. AP-11 remains blocked.

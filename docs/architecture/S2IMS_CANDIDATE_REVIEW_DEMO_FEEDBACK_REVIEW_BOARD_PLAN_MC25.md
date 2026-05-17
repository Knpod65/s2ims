# S²IMS Candidate Review Demo — Feedback Review Board Plan (MC25)

## Branch

`architecture/s2ims-candidate-review-demo-feedback-review-board-plan-mc25`

---

## 1. Purpose

MC25 defines how stakeholder feedback captured in MC24 feedback records should be reviewed, triaged, prioritized, and converted into safe future work items.

**Core rule:** Feedback review is product, UX, and process planning only. It must not be treated as — and must not be used as — any of the following:

- Production readiness approval
- Audit write readiness approval
- AP-10B governance approval or owner nomination
- Authority verification of any kind
- Official sign-off
- Scholarship decision
- Assignment decision
- Official evidence

The review board is an internal planning process. Its outputs are candidate work items and planning documents. It does not activate any workflow, governance gate, or official process.

---

## 2. Scope

### In scope for MC25

- Review board purpose and principles
- Review board composition and roles
- Feedback triage process
- Feedback prioritization model
- Future branch decision rules
- Governance-sensitive feedback handling
- Safe backlog creation
- AP-10B separation language

### Out of scope (not implemented by MC25)

- Runtime implementation of any kind
- Review board UI implementation
- Form or survey implementation
- Storage or persistence
- Backend or API
- Audit write
- Route or navigation changes
- Official evidence creation
- Candidate assignment
- Scholarship approval
- AP-10B governance
- AP-10C activation
- AP-11 activation

---

## 3. Source Baseline

MC25 builds on the following completed milestones:

| MC | Description |
|----|-------------|
| MC20 | Read-only diagnostic preview demo page at `/admin/candidate-review-demo`. Safe mock data only. Route hidden from navigation. |
| MC21 | Demo page exposure and review safety documentation. Stakeholder review checklist. Exposure decision matrix. |
| MC22 | Navigation safety runtime. 12 static checks confirming demo route absent from all nav files. Audit baseline: 353/353. |
| MC23 | Stakeholder walkthrough pack, feedback form (sections A–G), post-demo follow-up template. |
| MC24 | Feedback intake rules, 9-category classification matrix, feedback record template, privacy exclusion list. |

Current validation baseline:

| Metric | Value |
|--------|-------|
| Build | 41/41 pages, 0 type errors |
| Token checks | 4/4 |
| Audit checks | 353/353 |
| Routes | 6×200 OK |
| AP-10B gate | 0/7 owners, 9/9 blockers |
| AP-10C | Blocked |
| AP-11 | Blocked |

MC25 does not modify any source, script, or navigation file.

---

## 4. Review Board Composition

The feedback review board consists of non-authoritative roles only. No role on the review board constitutes an AP-10B owner, approver, or authority.

### Roles

| Role | Responsibility |
|------|---------------|
| **Facilitator** | Coordinates the review session; ensures the non-approval boundary is observed; handles governance-sensitive feedback escalation |
| **Product / UX Reviewer** | Reviews feedback for UX clarity, copy quality, workflow understanding, and usability improvement opportunities |
| **Privacy Reviewer** | Reviews feedback for privacy concerns, PDPA implications, and data display issues |
| **Technical Reviewer** | Assesses feasibility and scope of proposed branch types; confirms docs-only vs. runtime classification |
| **Documentation Reviewer** | Reviews feedback for training needs, walkthrough quality, and documentation improvement opportunities |

### Role restrictions

- No review board member becomes an AP-10B owner by participating
- No review board member may issue approvals, sign-offs, or governance decisions during a review session
- No review board session produces official evidence
- Positive outcomes from a review session do not constitute production readiness

---

## 5. Feedback Review Workflow

The following 8-step workflow governs each review board session.

### Step 1 — Gather safe feedback records

Collect all MC24 feedback records for the session period. Confirm each record was created using the MC24 feedback record template and contains a non-approval confirmation.

### Step 2 — Remove or redact accidental PII

Before reviewing, scan all records for personally identifying information. If any PII is found (real names, student IDs, national IDs, contact information), redact it immediately and note the redaction. Do not proceed with review until the record is clean.

### Step 3 — Classify using MC24 matrix

Assign each record to one of the 9 MC24 feedback categories:
- UX Clarity
- Copy / Content
- Accessibility
- Privacy / PDPA
- Workflow Understanding
- Training / Readiness
- Risk / Concern
- Future Enhancement
- Out of Scope / Governance

If a record has not been classified, classify it now before proceeding.

### Step 4 — Mark governance-sensitive feedback as out-of-scope

Any record in category 9 (Out of Scope / Governance) must be set aside. It must not enter the prioritization or backlog stages. See Section 8 for handling rules.

### Step 5 — Group similar feedback

Group records that describe the same or closely related concerns. Assign a group label. This reduces duplicate backlog items and makes prioritization more efficient.

### Step 6 — Prioritize using the prioritization model

Apply the 6-level prioritization model from Section 6. Assign each record or group a priority level (P0–P4 or Out of scope). Higher-priority items should enter the backlog first.

### Step 7 — Convert safe feedback into candidate future branches

For each P0–P4 item, determine whether it warrants a future branch. Apply the branch decision rules from Section 7. Record the proposed branch type in the safe backlog using the template from Section 9.

### Step 8 — Record non-approval boundary confirmation

At the end of each review session, the facilitator must record the following confirmation in the session summary:

> "This review session did not constitute approval of any kind. No AP-10B action was taken. No official evidence was created. No production readiness decision was made."

---

## 6. Prioritization Model

Each feedback record or group is assigned one of the following six priority levels.

### P0 — Safety / Privacy Concern

**Meaning:** The feedback identifies a safety or privacy risk that could cause harm, expose sensitive data, or create a compliance violation if not addressed before further exposure.

**Examples:**
- "The mock candidate IDs appear realistic enough to be mistaken for real records."
- "The privacy warning disappears on scroll — users may miss it entirely."

**Possible response:** Immediately review with privacy reviewer. Create a docs-only risk note. If a real privacy or PDPA risk is confirmed, escalate to governance before any further demo exposure.

**Branch eligibility:** Privacy wording clarification (docs); privacy fix runtime (if separately approved).

---

### P1 — Misleading Copy or Workflow Misunderstanding

**Meaning:** The feedback identifies text or interface elements that could be interpreted as official actions, production behavior, or real workflow steps.

**Examples:**
- "The 'Submit Review' label could be misread as an official submission."
- "Stakeholders thought the review signal was being saved to a database."

**Possible response:** Create a docs-only copy polish planning note. Propose a copy polish runtime branch.

**Branch eligibility:** Copy polish docs; copy polish runtime.

---

### P2 — Accessibility Blocker

**Meaning:** The feedback identifies an accessibility issue that prevents a group of users from using the demo at all (e.g., no keyboard access, no screen reader support, insufficient contrast).

**Examples:**
- "Keyboard focus is lost after clicking the first candidate card."
- "The status badge fails WCAG AA contrast requirements."

**Possible response:** Create a docs-only accessibility planning note. Propose an accessibility polish runtime branch.

**Branch eligibility:** Accessibility polish docs; accessibility polish runtime.

---

### P3 — UX Clarity Improvement

**Meaning:** The feedback identifies a usability issue that makes the demo harder to understand or navigate, but does not block use entirely.

**Examples:**
- "The candidate panel layout is confusing — status and name are hard to distinguish."
- "The walkthrough steps would benefit from numbered headings."

**Possible response:** Create a docs-only UX clarification note. Propose a demo layout polish branch.

**Branch eligibility:** Demo layout polish docs; demo layout polish runtime.

---

### P4 — Training / Documentation Improvement

**Meaning:** The feedback identifies a gap in training materials, demo documentation, or facilitator guides.

**Examples:**
- "Staff would need a facilitator guide explaining the demo context."
- "The walkthrough doc should include a glossary of terms like 'diagnostic preview'."

**Possible response:** Create a training material update branch (docs only).

**Branch eligibility:** Training/walkthrough doc update (docs only).

---

### Out of Scope / Governance

**Meaning:** The feedback touches governance, approvals, AP-10B, production readiness, persistence, or other out-of-scope concerns.

**Examples:**
- "Based on the demo, I think this is ready for the scholarship workflow."
- "We should proceed with the audit write implementation."

**Possible response:** Do not enter in backlog. Record in out-of-scope log. Redirect to governance process if escalation is requested.

**Branch eligibility:** None — requires separate governance process.

---

## 7. Future Branch Decision Rules

### Allowed branch types from review board output

| Branch Type | Allowed? | Notes |
|------------|---------|-------|
| Copy polish (docs only) | Yes | docs/architecture/* only |
| Copy polish runtime | Yes | Requires separate implementation branch |
| Accessibility polish (docs only) | Yes | docs/architecture/* only |
| Accessibility polish runtime | Yes | Requires separate implementation branch |
| Demo layout polish (docs only) | Yes | docs/architecture/* only |
| Demo layout polish runtime | Yes | Requires separate implementation branch |
| Training / walkthrough doc update | Yes | docs/architecture/* only |
| Privacy wording clarification (docs) | Yes | docs/architecture/* only |
| Audit-write planning package (docs) | Conditional | Only if separately approved — must not be a direct output of review board |

### Forbidden branch types without separate approval

| Branch Type | Status |
|------------|--------|
| Audit write runtime | Forbidden — requires separate approved branch |
| Persistence runtime | Forbidden — requires separate approved branch |
| Backend or API runtime | Forbidden — requires separate approved branch |
| Schema or migration | Forbidden — requires separate approved branch |
| Approval workflow activation | Forbidden — requires separate approved branch |
| Assignment workflow activation | Forbidden — requires separate approved branch |
| Navigation exposure of demo route | Forbidden — requires separate approved branch |
| AP-10C activation | Forbidden — requires AP-10B gate progress |
| AP-11 activation | Forbidden — requires AP-10C completion |

---

## 8. Governance-Sensitive Feedback Handling

### Triggers

The following types of feedback must be classified as Out of Scope / Governance-Sensitive and must not enter the regular triage or backlog process:

- Feedback suggesting the demo is ready for production
- Feedback suggesting audit write implementation should proceed
- Requests for AP-10B approval collection
- Requests for authority verification
- Requests for schema or persistence implementation
- Requests for legal or DPO sign-off
- Requests to proceed with scholarship decision workflow
- Requests to activate assignment workflow

### Required action

1. Do not record as product/UX feedback.
2. Do not create a backlog item.
3. Record the feedback in an out-of-scope log with the following note: "Governance-sensitive feedback — not actioned. Route to AP-10B approval process if escalation is separately requested."
4. Inform the stakeholder that this type of feedback falls outside the scope of a demo walkthrough review and explain the AP-10B separation boundary.
5. If the stakeholder persists or escalates, consult the governance process — do not unilaterally act.

### AP-10B separation restatement

The review board does not collect, verify, or produce AP-10B approvals. No review board output changes the AP-10B gate status. The AP-10B gate remains: 0/7 owners, 9/9 blockers — unchanged.

---

## 9. Safe Backlog Record Template

Each candidate future work item produced by the review board must use the following template.

### Required fields

| Field | Description |
|-------|-------------|
| **Backlog item ID** | Sequential identifier (e.g., MC25-BL-001) |
| **Source feedback ID** | MC24 feedback record ID(s) this item derives from |
| **Source session date** | Date of the original walkthrough session |
| **Feedback category** | MC24 category (one of 9) |
| **Priority** | P0 / P1 / P2 / P3 / P4 |
| **Summary** | Brief description of the feedback theme |
| **Safety concern** | Yes / No — if Yes, describe briefly |
| **Proposed branch type** | One of the allowed branch types from Section 7 |
| **AP-10B impact** | None / Governance-sensitive (if governance-sensitive, do not enter in backlog) |
| **Non-approval confirmation** | "This backlog item does not constitute approval of any kind. No AP-10B action was taken. No official evidence was created." |

### Excluded fields (must not appear in any backlog item)

- Personal contact information
- Signatures of any kind
- Approval statements
- Real student or personnel names
- Real student or personnel identifiers
- Approval language of any kind
- AP-10B governance language

---

## 10. QA Checklist

- [ ] Docs-only scope — no src/*, scripts/*, or package.json changes
- [ ] No route or navigation files modified
- [ ] Review board purpose and principles documented
- [ ] Review board composition and roles documented (Section 4)
- [ ] Feedback review workflow documented — 8 steps (Section 5)
- [ ] Prioritization model documented — 6 levels P0–P4 + Out of scope (Section 6)
- [ ] Future branch decision rules documented (Section 7)
- [ ] Governance-sensitive feedback handling documented (Section 8)
- [ ] Safe backlog record template documented (Section 9)
- [ ] AP-10B gate unchanged: 0/7 owners, 9/9 blockers
- [ ] AP-10C: Blocked
- [ ] AP-11: Blocked
- [ ] MC1–MC24 boundaries preserved

---

## Safety Statement

This plan:
- Is documentation only
- Does not modify any source, script, or navigation file
- Does not expose the demo route in any navigation menu
- Does not implement a review board UI, form, or storage
- Does not change route behavior
- Does not implement audit write
- Does not persist state
- Does not collect official evidence
- Does not change AP-10B gate status
- Does not activate AP-10C or AP-11

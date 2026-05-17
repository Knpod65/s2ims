# S²IMS Candidate Review Demo — Feedback Intake Plan (MC24)

## Branch

`architecture/s2ims-candidate-review-demo-feedback-intake-plan-mc24`

---

## 1. Purpose

MC24 defines a safe process for collecting, classifying, and acting on stakeholder feedback gathered during MC23 demo walkthrough sessions.

**Core rule:** Feedback is product, UX, and process input only. It must not be treated as — and must not be used as — any of the following:

- Production readiness approval
- Audit write readiness approval
- AP-10B governance approval or owner nomination
- Authority verification of any kind
- Scholarship decision
- Assignment decision
- Official evidence
- Sign-off

Feedback intake is an advisory process. It informs design and documentation decisions. It does not activate any workflow, governance gate, or official process.

---

## 2. Scope

### In scope for MC24

- Feedback intake rules
- Feedback classification model
- Allowed feedback content
- Forbidden feedback content
- Non-approval boundary definition
- Action-item creation rules
- Privacy limits
- AP-10B separation language
- Future branch decision rules

### Out of scope (not implemented by MC24)

- Runtime implementation of any kind
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

MC24 builds on the following completed milestones:

| MC | Description |
|----|-------------|
| MC20 | Read-only diagnostic preview demo page at `/admin/candidate-review-demo`. Safe mock data only. Route hidden from navigation. |
| MC21 | Demo page exposure and review safety documentation. Stakeholder review checklist. Exposure decision matrix. |
| MC22 | Navigation safety runtime. 12 static checks confirming demo route absent from all nav files. Audit baseline: 353/353. |
| MC23 | Stakeholder walkthrough pack, feedback form (sections A–G), post-demo follow-up template. |

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

MC24 does not modify any source, script, or navigation file.

---

## 4. Allowed Feedback

The following types of feedback may be collected during demo walkthrough sessions:

| Category | Description |
|----------|-------------|
| Clarity | Whether the interface and its copy are clear and understandable |
| Wording / copy | Accuracy, professionalism, and appropriateness of all text |
| UX layout | Layout, visual hierarchy, information architecture, flow |
| Accessibility | Keyboard navigation, contrast, screen reader compatibility, focus indicators |
| Privacy concerns | Data display concerns, privacy warning sufficiency, masking observations |
| Workflow understanding | Whether the interface correctly communicates the intended review workflow |
| Training / demo usefulness | Whether the demo is effective for training or review purposes |
| Risk / concern notes | Concerns about design decisions, edge cases, or potential misuse |
| Future improvement suggestions | Ideas for future iterations or enhancements |

---

## 5. Forbidden Feedback Collection

The following must not be collected, recorded, or treated as feedback output from any session:

### Approval and authority

- Signatures of any kind
- Approval statements (written or verbal)
- AP-10B sign-off or approval
- Authority verification
- Production readiness approval
- Scholarship decision statements
- Assignment decision statements

### Personal data (no PII)

- Real student names or IDs
- National identification numbers
- Passport or government ID information
- Phone numbers
- Personal email addresses
- Home or work addresses
- Banking or financial data
- Medical or health data

### Sensitive content

- Private hardship or personal circumstance details
- Private remarks about identified individuals
- Confidential personnel records
- Unofficial assessments of real candidates

---

## 6. Feedback Classification Model

Each piece of feedback from a walkthrough session must be assigned to one of the following nine categories. The category determines what follow-up actions are permitted.

### Category 1 — UX Clarity

**Meaning:** Feedback about whether the interface, layout, or information architecture is clear and understandable.

**Allowed examples:**
- "The candidate card layout is confusing — the status is hard to find."
- "I wasn't sure which panel I should interact with first."

**Must not be interpreted as:** Production readiness approval or sign-off on the UX direction.

**Permitted follow-up:** Docs-only UX clarification note or demo layout polish branch (docs/architecture only).

---

### Category 2 — Copy / Content

**Meaning:** Feedback about the accuracy, wording, tone, or professionalism of text on the demo page.

**Allowed examples:**
- "The phrase 'diagnostic preview' is unclear — stakeholders may not know what it means."
- "The banner copy should be larger and bolder."

**Must not be interpreted as:** Approval of the current copy or sign-off that copy is production-ready.

**Permitted follow-up:** Docs-only copy polish branch or wording clarification note.

---

### Category 3 — Accessibility

**Meaning:** Feedback about accessibility issues — contrast, keyboard navigation, focus management, screen reader support, font size, or motion.

**Allowed examples:**
- "The status badge color doesn't have sufficient contrast."
- "I couldn't navigate the candidate cards with keyboard alone."

**Must not be interpreted as:** Accessibility compliance sign-off.

**Permitted follow-up:** Docs-only accessibility improvement planning branch.

---

### Category 4 — Privacy / PDPA

**Meaning:** Feedback about privacy, data display, masking, and compliance concerns.

**Allowed examples:**
- "The mock candidate IDs look too realistic — they could be mistaken for real records."
- "The privacy warning doesn't explain where data is stored."

**Must not be interpreted as:** PDPA compliance sign-off or official privacy approval.

**Permitted follow-up:** Docs-only privacy clarification note or planning document. Escalate if feedback suggests a real compliance risk.

---

### Category 5 — Workflow Understanding

**Meaning:** Feedback about whether the demo accurately and clearly represents the intended candidate review workflow.

**Allowed examples:**
- "It wasn't clear who approves the review result after the advisor submits it."
- "The sequence of steps isn't obvious from the interface."

**Must not be interpreted as:** Approval of the workflow design or sign-off that the workflow is correct.

**Permitted follow-up:** Docs-only workflow clarification planning document.

---

### Category 6 — Training / Readiness

**Meaning:** Feedback about whether the demo is suitable for training purposes or whether staff and advisors would need additional guidance.

**Allowed examples:**
- "Staff would need at least a half-day training session before using this."
- "The demo is useful but should include a guided walkthrough mode."

**Must not be interpreted as:** Production readiness approval or confirmation that training requirements are met.

**Permitted follow-up:** Docs-only training material planning document.

---

### Category 7 — Risk / Concern

**Meaning:** Feedback identifying risks, concerns, or potential problems with the demo or the underlying design.

**Allowed examples:**
- "The review signal could be mistaken for an official record if the demo banner isn't visible."
- "There's no clear indication that the data is mock — some stakeholders may not read the banner."

**Must not be interpreted as:** A governance decision or a blocker that stops future work without a separate process.

**Permitted follow-up:** Escalation to governance review if the concern relates to a compliance or AP-10B boundary. Otherwise, docs-only risk note or planning document.

---

### Category 8 — Future Enhancement

**Meaning:** Ideas for new features, design improvements, or additional functionality for future iterations.

**Allowed examples:**
- "It would be helpful to show the review history for each candidate."
- "A summary panel at the top would improve usability."

**Must not be interpreted as:** A commitment to implement the enhancement or approval of a roadmap.

**Permitted follow-up:** Docs-only future planning document. No runtime implementation without a separate approved branch.

---

### Category 9 — Out of Scope / Governance

**Meaning:** Feedback that falls outside the permitted intake scope — e.g., requests for approval, governance decisions, AP-10B actions, or official evidence.

**Examples:**
- "Based on what I saw, I think this is ready for production."
- "I approve this for the scholarship workflow."
- "You can proceed with the audit write implementation."

**Must not be interpreted as:** Any form of approval or governance action.

**Required action:** Do not record this as feedback. Redirect the stakeholder with the non-approval boundary statement from Section 7. If repeated or escalated, consult the governance process.

---

## 7. Non-Approval Boundary

The following principles govern all feedback intake sessions and must be communicated to stakeholders before and after each session:

- **Feedback is not approval.** Providing feedback does not constitute approval of any design, implementation, or workflow decision.
- **Positive feedback is not sign-off.** Expressing satisfaction, enthusiasm, or agreement does not constitute a governance approval.
- **Attendance is not approval.** Attending a walkthrough session does not constitute approval of any kind.
- **Leadership comments are not AP-10B approval.** Comments from senior staff, management, or external stakeholders are not AP-10B approvals unless separately collected using the AP-10B approval process.
- **Feedback notes are not official evidence.** Session notes, feedback records, and meeting summaries do not constitute official evidence in any governance or compliance process.
- **No participant becomes AP-10B owner by participating.** No walkthrough attendee is nominated as an AP-10B owner, approver, or authority by virtue of attending or providing feedback.

---

## 8. Action Item Rules

### Permitted action items from feedback

The following action items may be created directly from walkthrough feedback without requiring additional approval:

| Action Item Type | Permitted |
|-----------------|-----------|
| Copy polish branch (docs/architecture only) | Yes |
| Accessibility improvement planning branch (docs only) | Yes |
| Demo layout polish planning document | Yes |
| Training material planning document | Yes |
| Privacy wording clarification document | Yes |
| Future planning documentation | Yes |
| Risk/concern note | Yes |

### Forbidden action items without separate approval

The following may NOT be created as action items from feedback alone. Each requires a separately approved branch and governance process:

| Action Item Type | Status |
|-----------------|--------|
| Audit write implementation | Forbidden — requires separate approved branch |
| Persistence implementation | Forbidden — requires separate approved branch |
| Backend or API implementation | Forbidden — requires separate approved branch |
| Schema or migration implementation | Forbidden — requires separate approved branch |
| Approval workflow activation | Forbidden — requires separate approved branch |
| Assignment workflow activation | Forbidden — requires separate approved branch |
| Navigation exposure of demo route | Forbidden — requires separate approved branch |
| AP-10C activation | Forbidden — requires AP-10B gate progress |
| AP-11 activation | Forbidden — requires AP-10C completion |

---

## 9. Feedback Record Template

Each feedback record from a session must use the following template. This template is safe for non-PII feedback collection.

### Required fields

| Field | Description |
|-------|-------------|
| Session date | Date of the walkthrough session (YYYY-MM-DD) |
| Stakeholder group / category | Role or group category only (e.g., "Admin staff", "Advisor group") — no names, no personal identifiers |
| Demo facilitator | Role or name of facilitator (internal use only) |
| Feedback category | One of the 9 categories from Section 6 |
| Feedback summary | Brief, factual description of the feedback — no personal opinions attributed to individuals |
| Risk / concern | If applicable: describe the risk or concern |
| Proposed follow-up | One of the permitted action items from Section 8, or "None" |
| Non-approval confirmation | "This record does not constitute approval of any kind." |

### Excluded fields (must not appear in any record)

- Signature
- Personal contact information
- Real student or personnel names
- Real student or personnel identifiers
- Approval wording of any kind
- AP-10B evidence language
- Production readiness statement

---

## 10. QA Checklist

- [ ] Docs-only scope — no src/*, scripts/*, or package.json changes
- [ ] No route or navigation files modified
- [ ] Feedback intake rules documented (Sections 4–5)
- [ ] Forbidden feedback collection documented
- [ ] Feedback classification model documented (9 categories)
- [ ] Non-approval boundary documented (Section 7)
- [ ] Action item rules documented (Section 8)
- [ ] Feedback record template documented (Section 9)
- [ ] AP-10B gate unchanged: 0/7 owners, 9/9 blockers
- [ ] AP-10C: Blocked
- [ ] AP-11: Blocked
- [ ] MC1–MC23 boundaries preserved

---

## Safety Statement

This plan:
- Is documentation only
- Does not modify any source, script, or navigation file
- Does not expose the demo route in any navigation menu
- Does not implement forms, surveys, or feedback storage
- Does not change route behavior
- Does not implement audit write
- Does not persist state
- Does not collect official evidence
- Does not change AP-10B gate status
- Does not activate AP-10C or AP-11

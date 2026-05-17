# S²IMS Candidate Review Demo — Feedback Prioritization Matrix (MC25)

## Purpose

This matrix supports consistent, safe prioritization of stakeholder feedback during S²IMS candidate review demo feedback review board sessions. It provides structured guidance for assigning priority levels, determining branch eligibility, and escalating governance-sensitive feedback.

Use this matrix alongside the master review board plan (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_REVIEW_BOARD_PLAN_MC25.md`) and the safe backlog template (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_SAFE_BACKLOG_TEMPLATE_MC25.md`).

---

## Priority Table

| Priority | Meaning | Example | Response | Branch Eligibility |
|----------|---------|---------|----------|--------------------|
| **P0** — Safety / Privacy Concern | A risk that could expose sensitive data, cause harm, or create a compliance violation | "Mock IDs look too realistic — could be mistaken for real records" | Immediate privacy review; escalate if real PDPA risk confirmed | Privacy wording clarification (docs); privacy fix runtime (if separately approved) |
| **P1** — Misleading Copy / Workflow Misunderstanding | Text or interface element that could be interpreted as an official action or production behavior | "'Submit Review' label could be misread as an official submission" | Docs-only copy polish note; propose copy polish runtime branch | Copy polish docs; copy polish runtime |
| **P2** — Accessibility Blocker | An issue that prevents a group of users from using the demo at all | "Keyboard focus is lost after clicking the first candidate card" | Docs-only accessibility note; propose accessibility polish branch | Accessibility polish docs; accessibility polish runtime |
| **P3** — UX Clarity Improvement | A usability issue that makes the demo harder to understand or navigate | "Candidate panel layout is confusing — status and name are hard to distinguish" | Docs-only UX clarification note; propose demo layout polish branch | Demo layout polish docs; demo layout polish runtime |
| **P4** — Training / Documentation Improvement | A gap in training materials, demo documentation, or facilitator guides | "Staff would need a facilitator guide explaining the demo context" | Training material update branch (docs only) | Training/walkthrough doc update (docs only) |
| **Out of Scope / Governance** | Feedback touching governance, approvals, AP-10B, production readiness, or persistence | "Based on the demo, I think this is ready for the scholarship workflow" | Do not enter in backlog; record in out-of-scope log; redirect to governance process | None |

---

## Severity Guidance

### Distinguishing P0 from P1

P0 is reserved for feedback that identifies a real or potential harm: data exposure, privacy violation, or a safety risk if the demo were shown to a broader audience without remediation. The concern must be specific and actionable.

P1 describes feedback where the interface could mislead a stakeholder into thinking an action has real-world effect — but does not expose data or create a compliance risk. A "Submit Review" label is P1 because it's misleading; a missing privacy masking layer on mock data that appears too realistic is P0.

**Key question for P0/P1 distinction:** Could acting on this feedback without remediation cause harm to a real person or create a legal/compliance exposure? If yes, P0. If the risk is confusion only, P1.

### Distinguishing P2 from P3

P2 is a blocker: a stakeholder with a disability or using assistive technology cannot use the demo at all. P3 is an improvement: the demo works but is confusing or harder to use than it should be.

**Key question for P2/P3 distinction:** Is a user excluded from using the demo entirely? If yes, P2. If they can use it but with difficulty or confusion, P3.

### Distinguishing P3 from P4

P3 describes issues with the demo interface itself (layout, copy, visual hierarchy). P4 describes gaps in supporting materials (facilitator guides, walkthroughs, glossaries, training docs).

**Key question for P3/P4 distinction:** Is the issue in the demo page itself, or in the documentation around it? Interface issue → P3. Documentation gap → P4.

### Identifying Out of Scope / Governance

Any feedback that implies a governance decision, approval, or production readiness claim is Out of Scope. This includes subtly positive endorsements that could be used as evidence of readiness.

**Watch for:** "I think this is ready," "we can proceed with," "I approve," "you should implement," or any reference to specific AP-10B, AP-10C, or AP-11 actions.

---

## Branch Eligibility Details

| Priority | Docs-Only Branch | Runtime Branch | Notes |
|----------|-----------------|---------------|-------|
| P0 | Privacy wording clarification | Privacy fix runtime (if separately approved) | Escalate to governance before runtime work if real PDPA risk |
| P1 | Copy polish docs | Copy polish runtime | Runtime branch requires separate implementation approval |
| P2 | Accessibility planning docs | Accessibility polish runtime | Runtime branch requires separate implementation approval |
| P3 | UX clarification docs | Demo layout polish runtime | Runtime branch requires separate implementation approval |
| P4 | Training material update (docs only) | None | P4 is documentation-only; no runtime branch |
| Out of scope | None | None | Governance process only; no product backlog entry |

---

## Examples of Correctly Prioritized Feedback

**P0:**
> "The demo page shows mock candidate IDs in the format `demo-cand-001`. Some stakeholders assumed these were real anonymized records. If a real student's number happened to match this pattern, there could be privacy implications."

Priority rationale: Identifies a potential data display concern with privacy implications. Requires immediate privacy review.

---

**P1:**
> "The label 'Mark as Reviewed' next to each candidate could be misread by non-technical stakeholders as submitting an official decision. Three out of four participants in our group thought it was submitting something real."

Priority rationale: Misleading copy leading to workflow misunderstanding. High risk of confusion but no data exposure.

---

**P2:**
> "I use a screen reader and the candidate cards are not labeled with ARIA roles. The screen reader reads them as generic divs. I could not tell which card I was on or how to navigate between them."

Priority rationale: Accessibility blocker — user with assistive technology cannot use the demo at all.

---

**P3:**
> "The layout puts the privacy warning at the bottom of the page, below the fold. Most people won't scroll down to see it. Moving it to a more prominent position would help."

Priority rationale: UX clarity improvement — privacy warning is visible but in a suboptimal position.

---

**P4:**
> "Facilitators would benefit from a one-page cheat sheet explaining the demo context, key terms, and how to respond to common stakeholder questions."

Priority rationale: Training/documentation gap — does not affect the demo page itself.

---

**Out of scope:**
> "After seeing this today, I'm comfortable saying we're ready to move forward with production."

Priority rationale: Governance-sensitive — this is a production readiness claim, not UX/product feedback.

---

## Escalation Rules

Escalate immediately (stop the review session and consult the governance process) if:

1. A board member attempts to record a governance approval or AP-10B action as a backlog item.
2. A record contains real student, personnel, or scholarship data that was not caught before the session.
3. A P0 item is identified that suggests a real PDPA/privacy compliance risk requiring legal or DPO review.
4. A board member proposes creating a runtime branch for audit write, persistence, or backend/API without a separately approved branch process.
5. External stakeholders request that review board output be used as governance evidence.

---

## AP-10B Separation Notes

Prioritization and backlog creation are explicitly separated from AP-10B governance:

- No review board session constitutes an AP-10B approval event
- No backlog item constitutes an AP-10B approval or owner nomination
- No priority level unlocks AP-10B governance actions
- The AP-10B gate remains: 0/7 owners, 9/9 blockers — unchanged by any review board activity
- AP-10C: Blocked — unchanged
- AP-11: Blocked — unchanged

---

*Matrix version: MC25. Last updated: 2026-05-17.*

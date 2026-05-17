# S²IMS Candidate Review Demo — Feedback Classification Matrix (MC24)

## Purpose

This matrix supports the safe classification of stakeholder feedback from S²IMS candidate review demo walkthrough sessions. It provides structured guidance for facilitators on how to categorize feedback, what follow-up actions are permitted, and when to escalate.

Use this matrix alongside the master intake plan (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_INTAKE_PLAN_MC24.md`) and the feedback record template (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_RECORD_TEMPLATE_MC24.md`).

---

## Classification Table

| Category | Allowed Feedback Example | Must Not Be Interpreted As | Follow-up Option |
|----------|--------------------------|----------------------------|-----------------|
| **1. UX Clarity** | "The candidate card layout is confusing — status is hard to find" | UX approval or sign-off | Docs-only UX clarification note or demo layout polish planning doc |
| **2. Copy / Content** | "The phrase 'diagnostic preview' is unclear to non-technical stakeholders" | Copy approval or production-ready confirmation | Docs-only copy polish branch or wording clarification note |
| **3. Accessibility** | "Color contrast on the status badge is insufficient" | Accessibility compliance sign-off | Docs-only accessibility improvement planning branch |
| **4. Privacy / PDPA** | "Mock IDs look too realistic — could be mistaken for real records" | PDPA compliance sign-off or privacy approval | Docs-only privacy clarification note; escalate if real compliance risk |
| **5. Workflow Understanding** | "It wasn't clear who approves the result after the advisor submits" | Workflow design approval or correctness sign-off | Docs-only workflow clarification planning document |
| **6. Training / Readiness** | "Staff would need at least a half-day training session before using this" | Production readiness approval or training sign-off | Docs-only training material planning document |
| **7. Risk / Concern** | "Review signal could be mistaken for an official record without visible banner" | A governance decision or implementation blocker | Docs-only risk note; escalate to governance if AP-10B boundary is implicated |
| **8. Future Enhancement** | "It would be helpful to show the review history for each candidate" | Commitment to implement or roadmap approval | Docs-only future planning document; no runtime implementation without separate approved branch |
| **9. Out of Scope / Governance** | "Based on what I saw, I think this is ready for production" | Any form of approval or governance action | Do not record; redirect with non-approval boundary statement; escalate if repeated |

---

## Examples of Allowed Feedback

The following are verbatim examples of safe, classifiable feedback from walkthrough sessions:

**UX Clarity:**
> "I found the layout hard to parse at first glance. The candidate name and status should be more visually prominent."

**Copy / Content:**
> "The banner text is technically accurate but uses jargon. Consider simpler language for non-technical attendees."

**Accessibility:**
> "I tried using keyboard navigation and could not reach the second candidate card — focus appears to be trapped on the first."

**Privacy / PDPA:**
> "The 'privacy level: safe_display' label isn't visible to end users — is that intentional? It raised questions about what 'safe' means."

**Workflow Understanding:**
> "After the advisor marks a candidate, I wasn't sure what happens next. Is there a next step button or does it auto-advance?"

**Training / Readiness:**
> "This demo would be useful for onboarding, but we'd need a facilitator guide to go with it."

**Risk / Concern:**
> "If someone misses the demo banner, they might think the review signal is being saved. Can we make the banner stickier or more prominent?"

**Future Enhancement:**
> "A summary panel that shows how many candidates have been reviewed so far would improve the experience."

---

## Examples of Unsafe Feedback

The following are examples of feedback that must NOT be recorded or acted upon as intake feedback. Each includes a facilitator note explaining why it is unsafe.

| Unsafe Feedback | Why It Is Unsafe | Facilitator Action |
|----------------|-----------------|-------------------|
| "I approve this design for the scholarship workflow." | Constitutes a governance approval | Do not record. State the non-approval boundary. |
| "Based on today's session, you can proceed with the audit write." | Treats feedback as implementation authorization | Do not record. Clarify that sessions do not authorize implementation. |
| "I nominate myself as the AP-10B approver for this." | AP-10B approval must be collected via AP-10B process | Do not record. Explain AP-10B separation. |
| "This session confirms we're ready for production." | Production readiness requires separate process | Do not record. State the non-approval boundary. |
| "The student ID shown — [name] — has the right qualifications." | Contains real student identifier | Stop immediately. Do not record. Remind stakeholder demo uses mock data only. |
| "You should definitely ship this." | Positive comment treated as sign-off | Record as Category 8 (Future Enhancement) only; strip approval interpretation. |

---

## Follow-up Branch Mapping

Feedback categories map to the following permitted follow-up branch types:

| Category | Permitted Branch Type | Notes |
|----------|----------------------|-------|
| 1. UX Clarity | `docs/architecture/*` polish planning | No src/* changes |
| 2. Copy / Content | `docs/architecture/*` copy polish | No src/* changes |
| 3. Accessibility | `docs/architecture/*` accessibility planning | No src/* changes; runtime fixes require separate approved src branch |
| 4. Privacy / PDPA | `docs/architecture/*` privacy clarification | Escalate to governance if compliance risk found |
| 5. Workflow Understanding | `docs/architecture/*` workflow planning | No src/* changes |
| 6. Training / Readiness | `docs/architecture/*` training material | No src/* changes |
| 7. Risk / Concern | `docs/architecture/*` risk note or escalation | Governance escalation if AP-10B boundary implicated |
| 8. Future Enhancement | `docs/architecture/*` future planning | No runtime implementation without separate approved branch |
| 9. Out of Scope / Governance | No follow-up branch | Redirect and escalate if repeated |

---

## Escalation Rules

Escalate immediately (stop the intake session and consult the governance process) if any of the following occur:

1. A stakeholder attempts to provide AP-10B approval or owner nomination during the session.
2. Feedback references real student, personnel, or scholarship data.
3. A stakeholder claims the session constitutes production readiness approval.
4. A stakeholder requests that the demo route be exposed in navigation immediately.
5. Feedback suggests a real PDPA/privacy compliance risk that requires legal or DPO review.
6. A stakeholder requests implementation of audit write, persistence, or backend/API as a direct outcome of the session.

---

## AP-10B Separation Notes

AP-10B governs the collection of explicit approval from a defined set of owners before any production-facing feature is enabled. Feedback intake sessions are explicitly separated from AP-10B as follows:

- No session note, feedback record, or follow-up communication constitutes an AP-10B approval
- No session attendee is nominated as an AP-10B owner by virtue of attending or providing feedback
- The AP-10B gate remains at 0/7 owners, 9/9 blockers — unchanged by any feedback intake activity
- Any stakeholder who wishes to formally act as an AP-10B owner must do so through the AP-10B process, not through a demo session

---

*Matrix version: MC24. Last updated: 2026-05-17.*

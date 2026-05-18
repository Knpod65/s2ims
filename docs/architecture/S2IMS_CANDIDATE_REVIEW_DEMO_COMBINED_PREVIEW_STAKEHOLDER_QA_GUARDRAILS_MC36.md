# S²IMS Candidate Review Demo Combined Preview Stakeholder Q&A Guardrails MC36

## Purpose

This document provides guardrails for facilitators handling stakeholder questions during or after walkthroughs of the combined demo route at `/admin/candidate-review-demo`.

The combined route contains two sections (candidate review diagnostic preview and feedback backlog preview) introduced by MC33 and hardened by MC35. Stakeholders unfamiliar with the demo's non-official status may ask questions that — if answered carelessly — could be misinterpreted as approval, authorization, or official evidence.

These guardrails define safe answers and phrases that must not be used.

---

## Common Stakeholder Questions — Safe Answers

| Stakeholder Question | Safe Answer | Must Not Say |
|----------------------|-------------|--------------|
| Can this go live? | "No. This demo is not production readiness evidence. Production or persistence work remains blocked by AP-10B approval requirements and separate implementation phases that have not been started." | "Yes, looks ready" / "Probably soon" / "That depends on the team" |
| Is this approved? | "No. Nothing in this session or on this page constitutes approval of any kind. No approval pathway exists here." | "The walkthrough serves as sign-off" / "Your feedback counts as approval" |
| Can I sign off here? | "No. No sign-off mechanism exists in this session. Any sign-off or official approval requires a separate formal governance process." | "Your signature authorizes..." / "Your verbal agreement is enough" |
| Does this change AP-10B status? | "No. AP-10B gate is unchanged at 0/7 owners with 9 active blockers. This session does not affect that status." | "This counts toward AP-10B" / "Participation here moves the process forward" |
| Can this become official evidence? | "No. Official evidence requires separate AP-10B governance approval. This demo explicitly is not official evidence." | "This session creates a record" / "We can use this as evidence later" |
| Does this mean the feature is ready? | "No. This is a read-only demo using safe mock data. Feature readiness requires AP-10B governance, separate implementation phases, and formal sign-off processes." | "Yes, it's feature-complete" / "Mostly ready" |
| Is this real data? | "No. All data shown is safe mock data only. No real student, candidate, staff, or stakeholder data is present or used." | "The data is representative" / "Based on real cases" |
| Can I take a screenshot to share? | "You can, but please note any shared screenshot must include the disclaimer that it shows a read-only demo using safe mock data only — not an official workflow or production system." | No restriction stated — this can mislead others |
| Do I need to do anything after this session? | "No action is required from you. We will send a follow-up documenting what was shown, the feedback collected, and confirming no approval was collected." | "Please confirm your approval in writing" / "Send us your sign-off" |
| Who authorized this demo? | "This demo page exists as a diagnostic and planning preview only, authorized as a read-only internal tool. It is not authorized as a production workflow or official evidence collection mechanism." | Naming individuals as authorizing production use |
| Can we use this to train staff? | "The demo can be used for illustrative training purposes only, with the understanding that participants must be clearly informed it is read-only mock data and not a live workflow." | "Yes, treat it as the real system" |
| What happens to my feedback? | "Your feedback will be summarized in a follow-up document and used to inform future planning and documentation only. It will not be stored in any database, form, or official record through this demo." | "It goes into the system" / "We log all responses" |

---

## Production-Readiness Boundary

**Rule:** No walkthrough session or stakeholder response may be interpreted as production readiness evidence.

Production readiness requires:
- AP-10B governance approval (0/7 owners, 9/9 blockers — not cleared by walkthroughs)
- Separate implementation branch(es) with formal approval
- Formal QA and security review
- Legal/DPO review if applicable

**Facilitator language if pressed:**

> "Production readiness is a separate formal process. This demo session does not move that process forward. Nothing you see here is ready for production without completing AP-10B governance and the subsequent implementation phases."

---

## AP-10B Boundary

**Rule:** Walkthrough participation does not count toward AP-10B approval.

AP-10B requires:
- 7 owner approvals (currently 0/7)
- 9 active blockers cleared (currently 9/9 active)

**Facilitator language if asked:**

> "AP-10B is a separate governance gate. It requires 7 formal owner approvals through a defined process. This walkthrough session is not part of that process and does not affect AP-10B status. The gate remains at 0/7 owners with 9 active blockers."

---

## Official Evidence Boundary

**Rule:** Nothing produced by or during a demo walkthrough constitutes official evidence.

Official evidence requires:
- A formally initiated evidence collection process
- AP-10B governance authorization
- A defined evidence pathway (which has not been started)

**Facilitator language if asked:**

> "Official evidence for this system requires a separate governance process. This demo session produces no official evidence. Any attempt to treat walkthrough notes, screenshots, or stakeholder statements as official evidence would be incorrect and must not be done."

---

## Feedback-Only Boundary

**Rule:** The only valid output of a walkthrough session is non-binding feedback.

Valid feedback outputs:
- Written summary of stakeholder comments
- Themes identified (clarity, wording, confusion risks, etc.)
- Recommendations for future planning docs

Invalid outputs:
- Approval records
- Sign-off documents
- Official evidence logs
- AP-10B authority verifications
- Production readiness certifications
- Assignment authorizations
- Scholarship decisions

**Facilitator language to close any ambiguity:**

> "Just to be clear: the output of this session is a feedback summary. Nothing more. Any document produced from this session will state explicitly that no approval was collected and that AP-10B gate status is unchanged."

---

## Phrases That Must Never Be Used by Facilitators

- "Your participation counts as approval."
- "We'll treat this as a green light."
- "This session moves us forward on AP-10B."
- "You've signed off by attending."
- "This is official."
- "This data is real."
- "This is production-ready."
- "This is evidence that we can use."
- "Your feedback authorizes the next step."

---

## Final Safety Statement

This Q&A guardrail document is documentation-only. It governs facilitator language and does not implement any runtime behavior, persist any data, collect any approvals, or create any official evidence.

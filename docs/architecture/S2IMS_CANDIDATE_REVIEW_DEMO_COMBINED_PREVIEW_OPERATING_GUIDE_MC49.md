# S²IMS Candidate Review Demo Combined Preview Operating Guide MC49

## Purpose

This guide provides facilitators with step-by-step instructions for conducting safe, controlled walkthroughs of the three-section hidden demo route (`/admin/candidate-review-demo`).

The guide ensures all participants understand the read-only, non-official, non-AP-10B nature of the demo.

---

## Who Can Facilitate

- Internal S²IMS project team members
- Stakeholders who have read this guide and the handoff pack (MC49)
- No external parties without explicit approval and safety briefing

---

## Pre-Demo Checklist

### Environment
- [ ] Confirm route accessible via direct URL: `/admin/candidate-review-demo`
- [ ] Confirm route hidden from navigation (no sidebar/topbar/mobile nav)
- [ ] Run validation: build 41/41, tokens 4/4, audit 490/490
- [ ] Confirm dev log clean
- [ ] Prepare safe note template for feedback capture

### Stakeholder Briefing
- [ ] Send direct URL in advance (do not share navigation link)
- [ ] Include opening/closing statements in invite
- [ ] State "safe mock data only" and "read-only preview" in invite
- [ ] Confirm no real personal data will be used or collected

### Materials
- [ ] Stakeholder script (opening + closing statements)
- [ ] Safe note template (no PII fields, no approval wording)
- [ ] Stop conditions list (printed or visible)
- [ ] AP-10B status statement (0/7, 0/7, 9/9)

---

## Live Demo Flow

### Phase 1: Opening (2 minutes)
1. Welcome stakeholders
2. Deliver opening statement:
   > "This demo uses safe mock data only. It is read-only and does not save, submit, approve, assign, export, notify, create official evidence, or change AP-10B/AP-10C/AP-11 status."
3. Confirm understanding (verbal acknowledgment)
4. State feedback is advisory/planning-only

### Phase 2: Section Walkthrough (15-20 minutes)

#### Section 1: Candidate Review Diagnostic Preview
- Navigate to candidate review section
- Explain: local review signals only, no assignment, no approval
- Show diagnostic preview panel (not saved, not official evidence)
- Allow Q&A on UX clarity, workflow understanding

#### Section 2: Feedback Backlog Preview
- Navigate to feedback backlog section
- Explain: safe mock backlog items, planning structure only
- Show category grouping, priority, status
- Allow Q&A on backlog organization, missing categories

#### Section 3: Feedback Synthesis Preview
- Navigate to feedback synthesis section
- Explain: safe mock synthesis records, planning themes only
- Show severity grouping, governance-sensitive items
- Allow Q&A on synthesis themes, follow-up types

### Phase 3: Q&A and Feedback Capture (10-15 minutes)
- Use safe note template
- Redirect governance-sensitive comments to separate review
- Do not promise implementation or timeline
- Do not accept signatures or approval wording

### Phase 4: Closing (2 minutes)
1. Deliver closing statement:
   > "Feedback from this session is advisory and planning-only. It is not approval, sign-off, official evidence, or authorization for production work."
2. Thank stakeholders
3. Confirm next steps (synthesis summary within X days)

---

## Section-by-Section Guide

### Candidate Review Diagnostic Preview
**Talking Points:**
- "This section shows what a local review signal looks like before any workflow action."
- "Notice the 'not saved, not official evidence' badges."
- "No assign or approve buttons are enabled."
- "This is diagnostic only."

**Common Questions & Responses:**
- Q: Can we assign from here?
  A: No. Assignment requires a separate approved workflow.
- Q: Is this review saved?
  A: No. It is local UI state only.

### Feedback Backlog Preview
**Talking Points:**
- "This section shows how stakeholder feedback could be organized into planning backlog items."
- "All items are safe mock data derived from MC29 samples."
- "Notice the priority, status, and non-approval flags."
- "No submission or editing is possible."

**Common Questions & Responses:**
- Q: Can we add real feedback here?
  A: No. This is a preview. Feedback collection requires a separate approved form.
- Q: Are these real stakeholder comments?
  A: No. All items are synthetic mock data for planning demonstration.

### Feedback Synthesis Preview
**Talking Points:**
- "This section shows how feedback themes could be synthesized into planning signals."
- "All records are safe mock data from MC43 samples."
- "Notice severity grouping and governance-sensitive flags."
- "No official evidence or AP-10B escalation is created."

**Common Questions & Responses:**
- Q: Does this approve anything?
  A: No. All items have `officialEvidence: false` and `approvalCollected: false`.
- Q: Can we escalate governance-sensitive items?
  A: Not from this demo. Governance escalation requires a separate approved process.

---

## Stakeholder Q&A Guardrails

### Allowed Discussion Topics
- UX confusion points
- Copy clarity suggestions
- Accessibility observations
- Workflow understanding gaps
- Training/support needs
- Governance-sensitive concerns (flagged for separate review)

### Forbidden Discussion Topics
- Real personal data or PII
- Signatures or written approvals
- Legal/DPO sign-off
- Production authorization
- Scholarship decisions
- Assignment instructions
- AP-10B approval claims
- Timeline promises

### Redirect Phrases
- "That sounds like a governance-sensitive concern. Let's capture it for a separate planning review."
- "We can't collect real data in this demo. Let's note the category and discuss mock examples."
- "Approval language isn't applicable here. This is planning input only."

---

## Safe Note-Taking Rules

### Template Fields (Allowed)
- Session ID (synthetic)
- Stakeholder group (generic category)
- Category (from allowed list)
- Summary (no PII, no approval wording)
- Safety concern flag
- Proposed follow-up type

### Forbidden Note Fields
- Real names
- Email addresses
- Phone numbers
- Student IDs
- National IDs
- Bank accounts
- Signatures
- Approval stamps

### Post-Session Handling
- Synthesize notes using MC39/MC41/MC43 safe path
- Remove any accidental PII before synthesis
- Store notes in planning-only location (no official evidence flag)

---

## Stop Conditions

### Immediate Stop Triggers
1. Stakeholder requests approval or sign-off
2. Stakeholder attempts to provide real personal data
3. Stakeholder asks to save/submit records
4. Stakeholder requests official evidence creation
5. Stakeholder asks to change AP-10B/AP-10C/AP-11 status
6. Route unexpectedly appears in navigation
7. Validation fails (build, tokens, audit)
8. Dev log shows runtime errors

### Response Protocol
1. Pause demo immediately
2. State: "We need to pause. This demo does not support that action."
3. Document concern for post-session review
4. Resume only after concern is redirected to appropriate channel

---

## Post-Demo Handling

### Within 48 Hours
- Synthesize feedback using MC39/MC41/MC43 safe synthesis path
- Generate planning summary (no official evidence)
- Distribute summary to participants with "planning input only" disclaimer

### Within 1 Week
- Review governance-sensitive items in separate planning session
- Do not update AP-10B gate
- Do not create official evidence
- Do not authorize implementation without new milestone

### Ongoing
- Maintain demo route as read-only
- Keep route hidden from navigation
- Do not enable persistence, audit writes, or feedback forms without new milestone

---

## AP-10B Separation

### Status Reminder
- Owners identified: 0/7
- Approvals collected: 0/7
- Blockers active: 9/9
- AP-10C: Blocked
- AP-11: Blocked

### Facilitator Script
"This demo does not collect AP-10B approvals. The gate remains at 0/7 owners, 0/7 approvals, and 9/9 blockers. Feedback from this session cannot change that status."

### Post-Demo Rule
- Do not update AP-10B gate based on demo feedback
- Do not treat demo feedback as AP-10B evidence
- Future AP-10B progress requires a separate approved governance milestone

---

**Guide Version:** MC49
**Last Updated:** 2026-05-19
**Status:** Ready for facilitator use in controlled internal walkthroughs.
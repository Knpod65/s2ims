# S²IMS Candidate Review Demo Combined Preview Walkthrough Script MC36

## Purpose

This document provides a facilitator script for conducting stakeholder walkthroughs of the hardened combined demo route at `/admin/candidate-review-demo`. The route contains two preview sections: candidate review diagnostic preview and feedback backlog preview.

This script replaces the single-section walkthrough script from MC23. It must be used for all walkthroughs after MC35 is merged to main.

**Core constraint:** This walkthrough collects feedback only. It does not collect approval, sign-off, AP-10B authority, scholarship decision, or official evidence.

---

## Facilitator Opening Script

Read verbatim at the start of every session:

> "Thank you for joining this walkthrough. Before we begin, I want to be clear about what you are about to see.
>
> This is a read-only demonstration page using safe mock data only. It contains two separate preview sections: candidate review diagnostic preview and feedback backlog preview.
>
> Neither section saves, submits, approves, assigns, exports, notifies, or creates official evidence.
>
> Nothing shown here is AP-10B evidence, production approval, scholarship approval, or assignment authorization.
>
> Your participation in this session does not constitute approval of any kind. We are here to gather your feedback on clarity, layout, and usability only.
>
> Do you have any questions before we begin?"

---

## Route-Level Explanation

After opening, direct stakeholders to the yellow warning box at the top of the page.

**Facilitator notes:**

1. Point to the yellow bordered notice box.
2. Read aloud: *"Demo only. Diagnostic preview only. Uses safe mock data."*
3. Read: *"Not saved. Not submitted. Not official evidence."*
4. Read: *"Not an approval. Not an assignment. Not a scholarship decision."*
5. Explain: "These statements are displayed on the page itself so that anyone who views this route — even without a facilitator present — understands its non-official status."

**Script:**

> "The page opens with a yellow warning box. This is intentional. It states that this is a demo using safe mock data, that nothing is saved or submitted, and that nothing here is an approval, assignment, or scholarship decision.
>
> Every person who views this page sees this warning. It is not removable and it is not conditional."

---

## Candidate Review Diagnostic Preview Section

Scroll to the first section heading: **Candidate Review Diagnostic Preview**.

**Facilitator notes:**

- The h2 heading reads "Candidate Review Diagnostic Preview"
- Below the heading: "Local review signal only. No scholarship decision. No candidate assignment."
- The section shows how candidate review interactions appear in the system

**Script:**

> "The first section is the Candidate Review Diagnostic Preview. The subtitle below the heading says: 'Local review signal only. No scholarship decision. No candidate assignment.'
>
> This section shows how candidate review interactions would appear in the system — the layout, the candidate information display, and the review signal indicators.
>
> No real candidate data is shown. This uses safe mock data only.
>
> Nothing in this section assigns a candidate to a position or scholarship. Nothing here approves a scholarship. Nothing creates official evidence.
>
> The section is read-only. The component enforces `readonly={true}` — no action is possible."

**Feedback questions for this section (see Section: Questions to Ask).**

---

## Feedback Backlog Preview Section

Scroll to the second section heading: **Feedback Backlog Preview**.

**Facilitator notes:**

- The h2 heading reads "Feedback Backlog Preview"
- Below the heading: "Planning preview only. Mock backlog items only. No feedback collection. No production backlog."
- The section shows mock planning backlog items

**Script:**

> "The second section is the Feedback Backlog Preview. The subtitle says: 'Planning preview only. Mock backlog items only. No feedback collection. No production backlog.'
>
> This section shows what a feedback planning backlog might look like — sample items to illustrate how future planning work could be organized.
>
> No real backlog data is shown. These are mock items only.
>
> Nothing in this section collects feedback. Nothing creates a production backlog. Nothing triggers branch creation or issue tracking.
>
> This is purely illustrative."

**Feedback questions for this section (see Section: Questions to Ask).**

---

## False Safety Flag Explanation

If stakeholders ask about safety indicators or status flags displayed in the demo:

**Script:**

> "The system displays safety flags to make the demo's read-only, non-official status visible at a glance. These flags show:
>
> - Official evidence: false
> - Approval collected: false
> - Persisted: false
> - Exported: false
> - Notified: false
> - Is mock: true
> - Non-approval confirmed: true
>
> These flags cannot be changed by anyone in this session. They are not workflow controls — they are transparency indicators. Their current values are the only valid values for this demo."

---

## Questions to Ask Stakeholders

Ask these questions during or after the walkthrough:

**On the candidate review section:**

1. Is the layout of the candidate review section clear enough for staff who would use a similar view in production?
2. Does the section heading and subtitle make clear that this is a diagnostic preview only?
3. Are there any elements that could be mistaken for a live workflow or real candidate data?
4. What confusion risks do you see for a first-time viewer?

**On the feedback backlog section:**

5. Does the backlog preview section communicate its illustrative purpose clearly?
6. Are the mock backlog items realistic enough to be useful for planning discussions?
7. Is the distinction between the two sections (candidate review vs. backlog) clear?

**On the combined route:**

8. Does the overall page structure help or hinder understanding of how these two features relate?
9. Is the read-only, non-official status clear enough from the page itself — without a facilitator explanation?
10. What would you change about the copy or layout to reduce confusion?

---

## What Not to Ask

Facilitators must not ask any question that could be interpreted as soliciting approval. Do not ask:

- "Do you approve of this design?"
- "Can we proceed with this approach?"
- "Does this meet your requirements for sign-off?"
- "Are you satisfied enough for this to go into production?"
- "Can you authorize this workflow?"
- "Does this fulfill the AP-10B requirement?"

If a stakeholder volunteers an approval statement, respond:

> "Thank you — but I want to be clear that this session is feedback-only. No approval can be collected here. Any official approval would require a separate governance process."

---

## Facilitator Closing Script

Read verbatim at the end of every session:

> "Thank you for your feedback. Before we close, I want to confirm what this session was and was not.
>
> This was a feedback session on a read-only demo using safe mock data. Your feedback will be used to inform future planning and documentation.
>
> This session did not collect any approval. It did not collect any sign-off. It did not constitute an AP-10B authority verification. It did not authorize production readiness, scholarship approval, candidate assignment, or any official action.
>
> The AP-10B gate remains at 0 of 7 owner approvals with 9 active blockers. AP-10C and AP-11 remain blocked.
>
> A written follow-up will be sent that documents the session purpose, the sections reviewed, feedback themes, and confirmation that no approval was collected.
>
> Do you have any questions about what this session was or was not?"

---

## AP-10B Separation Reminder

After every walkthrough, the facilitator must record the following in the session notes:

> "AP-10B gate status: 0/7 owners, 0/7 approvals, 9/9 blockers active. This walkthrough session did not change AP-10B gate status. AP-10C remains blocked. AP-11 remains blocked."

If any stakeholder asks about AP-10B progress:

> "AP-10B requires 7 owner approvals and has 9 active blockers. None of those blockers are cleared by this walkthrough session. AP-10B progress requires a separate formal process that has not been initiated."

---

## Final Safety Statement

This walkthrough script is documentation-only. It governs how facilitators conduct non-approval stakeholder feedback sessions. It does not implement any runtime behavior, persist any data, collect any approvals, or create any official evidence.

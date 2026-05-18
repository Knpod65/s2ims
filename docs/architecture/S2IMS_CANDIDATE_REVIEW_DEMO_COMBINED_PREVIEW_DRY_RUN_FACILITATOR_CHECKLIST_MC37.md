# S²IMS Candidate Review Demo Combined Preview Dry-Run Facilitator Checklist MC37

## Purpose

This document provides a phase-by-phase facilitator checklist for conducting the MC37 internal dry run of the hardened combined demo route at `/admin/candidate-review-demo`.

Use this checklist during the dry run to ensure the facilitator covers every required step, stays within non-approval boundaries, and correctly explains both preview sections. Check each item as completed during the session.

**Core constraint:** The dry run is rehearsal only. The facilitator must not collect approval, sign-off, AP-10B authority, or any official evidence.

---

## Pre-Session Checklist

Complete before starting the dry-run session.

| # | Item | Done |
|---|------|------|
| 1 | Confirm the `/admin/candidate-review-demo` route is accessible in the browser | ☐ |
| 2 | Confirm the route does NOT appear in the sidebar navigation | ☐ |
| 3 | Confirm the route does NOT appear in the top navigation bar | ☐ |
| 4 | Confirm the route does NOT appear in the mobile navigation | ☐ |
| 5 | Confirm no real student data is visible on the page | ☐ |
| 6 | Confirm no real personnel data is visible on the page | ☐ |
| 7 | Confirm no real stakeholder data is visible on the page | ☐ |
| 8 | Confirm the yellow warning box is visible at the top of the page | ☐ |
| 9 | Confirm the MC36 walkthrough script is open and ready | ☐ |
| 10 | Confirm the MC36 Q&A guardrails are open and ready | ☐ |
| 11 | Confirm all dry-run participants have been briefed on rehearsal-only status | ☐ |
| 12 | Confirm note-taker role is assigned and ready | ☐ |
| 13 | Confirm observer role is assigned and ready | ☐ |

---

## Opening Script Checklist

| # | Item | Done |
|---|------|------|
| 1 | Read verbatim opening from MC36 walkthrough script | ☐ |
| 2 | Confirm "two separate preview sections" stated explicitly | ☐ |
| 3 | Confirm "safe mock data only" stated explicitly | ☐ |
| 4 | Confirm "does not save, submit, approve, assign, export, notify" stated | ☐ |
| 5 | Confirm "not official evidence" stated | ☐ |
| 6 | Confirm "not AP-10B evidence" stated | ☐ |
| 7 | Confirm "participation does not constitute approval" stated | ☐ |
| 8 | Point to the yellow warning box on the page | ☐ |
| 9 | Read yellow warning box copy aloud | ☐ |
| 10 | Confirm no approval-seeking language used in opening | ☐ |

---

## Candidate Section Walkthrough Checklist

| # | Item | Done |
|---|------|------|
| 1 | Scroll to the "Candidate Review Diagnostic Preview" h2 heading | ☐ |
| 2 | Read the h2 heading aloud | ☐ |
| 3 | Read the subtitle aloud: "Local review signal only. No scholarship decision. No candidate assignment." | ☐ |
| 4 | Explain this shows how candidate review interactions appear in the system | ☐ |
| 5 | Confirm "no real candidate data" stated | ☐ |
| 6 | Confirm "safe mock data only" stated | ☐ |
| 7 | Confirm "does not assign any candidate" stated | ☐ |
| 8 | Confirm "does not approve any scholarship" stated | ☐ |
| 9 | Confirm "does not create official evidence" stated | ☐ |
| 10 | Confirm "`readonly={true}` is enforced at the component level" or equivalent stated | ☐ |
| 11 | Confirm no interactive elements demonstrated or implied | ☐ |

---

## Backlog Section Walkthrough Checklist

| # | Item | Done |
|---|------|------|
| 1 | Scroll to the "Feedback Backlog Preview" h2 heading | ☐ |
| 2 | Read the h2 heading aloud | ☐ |
| 3 | Read the subtitle aloud: "Planning preview only. Mock backlog items only. No feedback collection. No production backlog." | ☐ |
| 4 | Explain this shows what a feedback planning backlog might look like | ☐ |
| 5 | Confirm "mock items only" stated | ☐ |
| 6 | Confirm "not a real backlog" stated | ☐ |
| 7 | Confirm "does not collect feedback" stated | ☐ |
| 8 | Confirm "does not create production backlog" stated | ☐ |
| 9 | Confirm "does not trigger branch creation or issue tracking" stated | ☐ |
| 10 | Confirm no data is written, saved, or exported | ☐ |

---

## False Flag Explanation Checklist

| # | Flag | Explain as read-only | Done |
|---|------|---------------------|------|
| 1 | `officialEvidence: false` | Nothing in this session is official evidence | ☐ |
| 2 | `approvalCollected: false` | No approval has been or will be collected | ☐ |
| 3 | `persisted: false` | Nothing has been or will be saved | ☐ |
| 4 | `exported: false` | Nothing has been or will be exported | ☐ |
| 5 | `notified: false` | No notifications have been or will be sent | ☐ |
| 6 | `isMock: true` | All data shown is safe mock data only | ☐ |
| 7 | `nonApprovalConfirmed: true` | Non-approval status is confirmed | ☐ |
| 8 | Confirm: "These flags cannot be changed by anyone in this session" stated | ☐ |
| 9 | Confirm: "These are transparency indicators, not workflow controls" stated | ☐ |

---

## Q&A Handling Checklist

For each of the 10 stress-test prompts from the MC37 master plan, verify the facilitator gives a safe answer aligned with MC36 guardrails.

| # | Prompt | Safe Answer Given | Done |
|---|--------|------------------|------|
| 1 | "Can this go live now?" | No — not production readiness evidence, blocked by AP-10B | ☐ |
| 2 | "Is this official evidence?" | No — explicitly not official evidence, requires separate AP-10B governance | ☐ |
| 3 | "Does this count as AP-10B approval?" | No — AP-10B requires formal owner approval, not walkthrough participation | ☐ |
| 4 | "Can this assign a candidate?" | No — candidate section is read-only, no assignment possible | ☐ |
| 5 | "Can this approve scholarship decisions?" | No — no approval pathway exists in the demo | ☐ |
| 6 | "Where is the saved feedback?" | Feedback is not saved — nothing in the demo persists | ☐ |
| 7 | "Can we export this?" | No — no export behavior exists in the demo | ☐ |
| 8 | "Can we notify staff from here?" | No — no notification behavior exists in the demo | ☐ |
| 9 | "Is the backlog real?" | No — mock planning items only, not a production backlog | ☐ |
| 10 | "Are these real students or real stakeholders?" | No — safe mock data only, no real student or personnel data | ☐ |

---

## Closing Checklist

| # | Item | Done |
|---|------|------|
| 1 | Read verbatim closing from MC36 walkthrough script | ☐ |
| 2 | Confirm "this session did not collect any approval" stated | ☐ |
| 3 | Confirm "this session did not collect any sign-off" stated | ☐ |
| 4 | Confirm "not an AP-10B authority verification" stated | ☐ |
| 5 | State: "AP-10B gate: 0/7 owners, 9/9 blockers active. This session did not change AP-10B status." | ☐ |
| 6 | Confirm "AP-10C remains blocked" stated | ☐ |
| 7 | Confirm "AP-11 remains blocked" stated | ☐ |
| 8 | Confirm written follow-up will be sent (no approval captured) | ☐ |
| 9 | Confirm no approval-seeking language used in closing | ☐ |

---

## Post-Session Checklist

| # | Item | Done |
|---|------|------|
| 1 | Record all issues observed by the observer | ☐ |
| 2 | Record all action items | ☐ |
| 3 | Confirm no approval statement captured in session notes | ☐ |
| 4 | Confirm no PII captured in session notes | ☐ |
| 5 | Score each readiness dimension from the MC37 scorecard | ☐ |
| 6 | Determine overall readiness decision: Proceed / Revise docs / Block | ☐ |
| 7 | Assign follow-up actions to allowed categories only (see MC37 master plan Section 10) | ☐ |
| 8 | Confirm no forbidden direct actions triggered (production deployment, AP-10C, AP-11, etc.) | ☐ |

---

## AP-10B Separation Reminder

After every dry-run session, the facilitator must record the following in the session notes verbatim:

> "AP-10B gate status: 0/7 owners, 0/7 approvals, 9/9 blockers active. This dry-run session did not change AP-10B gate status. AP-10C remains blocked. AP-11 remains blocked."

Dry-run participation does not count toward AP-10B approval. AP-10B requires a separate formal governance process that has not been initiated.

---

## Final Safety Statement

This facilitator checklist is documentation-only. It governs rehearsal behavior and does not implement any runtime behavior, persist any data, collect any approvals, or create any official evidence.

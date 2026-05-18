# S²IMS Candidate Review Demo Combined Preview Stakeholder Dry-Run Package Plan MC37

## 1. Purpose

MC37 defines an internal dry-run package for rehearsing the hardened combined demo route and the MC36 stakeholder walkthrough before any real stakeholder review session.

The dry run ensures that facilitators are prepared to explain both sections clearly, handle Q&A safely, and maintain strict non-approval boundaries — before any external audience sees the demo.

**Core rule:**
The dry run is rehearsal only. It must not collect stakeholder approval, AP-10B approval, authority verification, production readiness approval, scholarship decision, assignment decision, or official evidence of any kind.

---

## 2. Scope

### In scope

- Dry-run participant roles
- Facilitator checklist
- Observer checklist
- Timing guide
- Script rehearsal flow
- Q&A stress-test prompts
- Confusion-risk checklist
- Pass/fail readiness criteria
- Post-dry-run action rules
- AP-10B separation rules

### Out of scope

- Runtime implementation
- Route modification
- Navigation exposure
- New route or page creation
- Feedback form implementation
- Storage or persistence
- Backend or API implementation
- Database, schema, or migration changes
- Audit write
- Official evidence creation
- Assignment
- Approval
- Scholarship decision
- AP-10B governance action
- AP-10C activation
- AP-11 activation

---

## 3. Source Baseline

| MC | Contribution |
|----|-------------|
| MC35 | Hardened combined demo route: route-level h1, two h2 section headings, accessible labels, strengthened non-official copy |
| MC36 | Updated walkthrough script, stakeholder Q&A guardrails, updated briefing language |

**Current state:**

- Route: `/admin/candidate-review-demo` — hidden from all navigation
- Section 1: Candidate Review Diagnostic Preview
- Section 2: Feedback Backlog Preview
- Route-level warning box: explicit non-official, non-approval, non-evidence copy
- Walkthrough script: MC36 — verbatim opening/closing, two-section walk, AP-10B reminder
- Q&A guardrails: MC36 — 12 questions with safe answers and must-not-say column
- Validation baseline: build 41/41, tokens 4/4, audit 440/440, routes 6×200 OK

**MC37 does not modify source or runtime files.** Baseline remains 440/440.

---

## 4. Dry-Run Roles

| Role | Responsibility |
|------|---------------|
| Facilitator | Runs the MC36 walkthrough script verbatim. Explains both sections. Handles Q&A using MC36 guardrails. Must not use approval-seeking language. |
| Observer | Watches for confusion risks, misinterpretations, and guardrail failures. Scores each readiness dimension silently. |
| Note-taker | Records issues and action items. Must not record approval statements. Must not record PII. |
| Privacy reviewer | Confirms no unintended PII is displayed or referenced. Confirms all data shown is safe mock data. |
| UX reviewer | Reviews layout, accessibility, and heading clarity from a first-time viewer perspective. |
| Technical reviewer | Confirms the route is hidden from navigation, confirms read-only behavior, confirms no interactive elements exist. |

**Important:** These are rehearsal roles only. No participant is an AP-10B owner. No participant collects approvals. Participation in the dry run does not advance AP-10B status.

---

## 5. Facilitator Checklist

See `S2IMS_CANDIDATE_REVIEW_DEMO_COMBINED_PREVIEW_DRY_RUN_FACILITATOR_CHECKLIST_MC37.md` for the full phase-by-phase checklist.

Summary of key phases:

| Phase | Key Action |
|-------|-----------|
| Pre-session | Confirm route accessible, hidden from nav, no real data, MC36 script ready |
| Opening | Read verbatim briefing from MC36 script |
| Candidate section | Scroll to h2, explain local review signals, explain readonly |
| Backlog section | Scroll to h2, explain mock items, explain no collection |
| False flags | Read all 7 flags, confirm read-only status |
| Q&A | Run all 10 stress-test prompts from Section 8 |
| Closing | Read verbatim closing from MC36 script, state AP-10B unchanged |
| Post-session | Record issues and action items, confirm no approval in notes |

---

## 6. Observer Checklist

The observer watches silently and scores each item after the session:

| Item | Watch For |
|------|----------|
| Section confusion | Do participants confuse candidate review with backlog preview? |
| False flag confusion | Do participants interpret any flag as an editable workflow control? |
| AP-10B confusion | Do participants believe the session advances AP-10B approval? |
| Production-readiness confusion | Do participants believe the demo is production-ready? |
| Approval language | Does anyone use language suggesting approval, sign-off, or authorization? |
| Save/submit expectation | Does anyone expect their actions or feedback to be saved? |
| Accessibility issues | Any element difficult to read, navigate, or understand? |
| Copy confusion | Does any on-page copy create production-readiness or approval misunderstanding? |
| Q&A gaps | Are any guardrail answers insufficient for a participant's question? |
| Pacing issues | Are any sections too fast or too slow to absorb? |

---

## 7. Timing Guide

| Segment | Duration | Notes |
|---------|----------|-------|
| Opening boundary | 3 min | Read verbatim briefing; do not rush |
| Candidate review preview | 5 min | h2 heading, local signals, readonly |
| Feedback backlog preview | 5 min | h2 heading, mock items, no collection |
| False flag explanation | 5 min | All 7 flags, read-only clarification |
| Q&A stress test | 10 min | All 10 prompts from Section 8 |
| Readiness scoring | 5 min | Observer scores each dimension |
| Action item review | 5 min | Record and categorize issues |
| **Total** | **~38 min** | |

---

## 8. Q&A Stress-Test Prompts

Run all 10 prompts in order. Use the MC36 guardrail safe answers. Record facilitator response quality for each.

| # | Prompt | Required Safe Response Source |
|---|--------|------------------------------|
| 1 | "Can this go live now?" | MC36 guardrails — production-readiness boundary |
| 2 | "Is this official evidence?" | MC36 guardrails — official-evidence boundary |
| 3 | "Does this count as AP-10B approval?" | MC36 guardrails — AP-10B boundary |
| 4 | "Can this assign a candidate?" | MC36 walkthrough script — candidate section |
| 5 | "Can this approve scholarship decisions?" | MC36 walkthrough script — candidate section |
| 6 | "Where is the saved feedback?" | MC36 guardrails — feedback-only boundary |
| 7 | "Can we export this?" | MC36 guardrails — feedback-only boundary |
| 8 | "Can we notify staff from here?" | MC36 guardrails — feedback-only boundary |
| 9 | "Is the backlog real?" | MC36 walkthrough script — backlog section |
| 10 | "Are these real students or real stakeholders?" | MC36 walkthrough script — route-level explanation |

**Scoring:** For each prompt, observer marks: Pass (safe answer given), Partial (safe answer given but unclear), Fail (incorrect or approval-adjacent answer given).

---

## 9. Readiness Criteria

### Pass criteria (all must be met to proceed to real stakeholder session)

- Facilitator explains both sections clearly without being prompted
- All 7 false safety flags are explained accurately as read-only
- No participant interprets the session as collecting approval of any kind
- No participant interprets backlog preview as a real production backlog
- AP-10B separation is clearly understood: session does not advance AP-10B
- No high-risk confusion item remains unresolved after Q&A
- All 10 stress-test prompts receive safe answers (Pass or Partial)

### Fail criteria (any one blocks real stakeholder session)

- Any participant believes feedback is saved to a system
- Any participant believes the demo creates official evidence
- Any participant believes the candidate review section assigns or approves
- Any participant believes the session satisfies or advances AP-10B
- A major accessibility blocker prevents meaningful walkthrough
- Route copy causes production-readiness confusion that cannot be resolved verbally

---

## 10. Post-Dry-Run Action Rules

### Allowed follow-up actions

- Update MC36 walkthrough script copy
- Update MC36 Q&A guardrails
- Create a UX copy hardening plan (separate docs-only MC)
- Create an accessibility hardening plan (separate docs-only MC)
- Create a layout hardening plan (separate docs-only MC)
- Schedule a second dry run if readiness criteria not met

### Forbidden direct actions from dry-run results

- Production deployment of the demo route
- Activation of audit write functionality
- Activation of persistence or storage
- Exposure of demo route in navigation
- Activation of approval workflow
- Activation of assignment workflow
- Starting AP-10C
- Starting AP-11
- Treating dry-run participant feedback as AP-10B evidence

---

## 11. QA Checklist

| Item | Expected |
|------|---------|
| MC37 scope | docs-only |
| `src/*` files changed | None |
| `scripts/*` files changed | None |
| `package.json` changed | No |
| Navigation files changed | No |
| New route created | No |
| Dry-run package documented | Yes |
| Facilitator checklist documented | Yes |
| Observer checklist documented | Yes |
| Timing guide documented | Yes |
| Q&A stress-test prompts documented | Yes |
| Readiness criteria documented | Yes |
| Post-dry-run action rules documented | Yes |
| AP-10B separation rules documented | Yes |
| AP-10B unchanged | Confirmed — 0/7, 9/9 blockers |
| AP-10C blocked | Confirmed |
| AP-11 blocked | Confirmed |
| Build baseline | 41/41 |
| Token check baseline | 4/4 |
| Audit check baseline | 440/440 |

---

## Final Safety Statement

Candidate review demo combined preview dry-run package planning is documentation-only.
No route/page implementation was performed.
No component wiring was performed.
No navigation change was performed.
No feedback form runtime was implemented.
No audit write was implemented.
No state was persisted.
No browser storage was introduced.
No API/backend call was introduced.
No export or notification behavior was introduced.
No official evidence was created.
No approval collection was performed.
No candidate was auto-assigned.
No scholarship approval was performed.
No AP-10B approval collection was performed.
No AP-10B gate status changed.
No runtime schema, SQL, migration, backend/API, persistence activation, or official workflow assignment was performed.

# S²IMS Candidate Review Demo Combined Preview Stakeholder Walkthrough Update Plan MC36

## 1. Purpose

MC36 updates stakeholder walkthrough guidance for the hardened combined demo route that now includes both candidate review diagnostic preview and feedback backlog preview (introduced by MC33 and hardened by MC35).

The MC23 walkthrough pack was written for a single-section demo route. MC36 updates all guidance to reflect the two-section structure, the strengthened non-official copy, and the explicit section headings and accessible labels introduced by MC35.

**Core rule:**
The walkthrough supports understanding and feedback only. It must not collect approval, sign-off, AP-10B authority verification, scholarship decision, assignment decision, production readiness approval, or official evidence of any kind.

---

## 2. Scope

### In scope

- Updated stakeholder briefing script
- Combined route walkthrough flow (two-section)
- Explanation of candidate review diagnostic preview section
- Explanation of feedback backlog preview section
- False safety flag explanation
- Stakeholder feedback boundaries
- Non-approval boundary language
- AP-10B separation language
- Production-readiness question handling
- Post-demo follow-up guidance
- QA checklist for future walkthrough usage

### Out of scope

- Runtime implementation
- Route modification
- Navigation exposure of demo route
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
| MC23 | Original stakeholder walkthrough pack, feedback form, post-demo follow-up template — single-section route |
| MC33 | Integrated `FeedbackBacklogPreview` component into hidden demo route |
| MC34 | Documented combined route QA and UX hardening requirements |
| MC35 | Hardened demo route UX: route-level `<h1>`, two `<h2>` section headings, accessible labels, strengthened non-official copy |

**Current state post-MC35:**

- Route: `/admin/candidate-review-demo` — hidden from all navigation
- Section 1: Candidate Review Diagnostic Preview (h2 heading, `aria-label`, `CandidateSelectionReviewShell`)
- Section 2: Feedback Backlog Preview (h2 heading, `aria-label`, `FeedbackBacklogPreview`)
- Route-level warning box: explicit non-official, non-approval, non-evidence copy
- Validation baseline: build 41/41, tokens 4/4, audit 440/440, routes 6×200 OK

**MC36 does not modify source or runtime files.** Baseline remains 440/440.

---

## 4. Updated Stakeholder Briefing Script

Facilitators must open every walkthrough session with the following statement verbatim:

> "This is a read-only demonstration page using safe mock data only. It contains two separate preview sections: candidate review diagnostic preview and feedback backlog preview. Neither section saves, submits, approves, assigns, exports, notifies, or creates official evidence. Nothing shown here is AP-10B evidence, production approval, scholarship approval, or assignment authorization."

This replaces the MC23 single-section briefing.

---

## 5. Walkthrough Flow

| Step | Action | Facilitator Note |
|------|--------|-----------------|
| 1 | Open with demo-only boundary | Read verbatim briefing from Section 4 |
| 2 | Explain the page has two separate preview sections | Point to the page heading and two section headings |
| 3 | Review route-level warning copy | Read yellow warning box aloud; confirm stakeholders understand non-official status |
| 4 | Walk through Candidate Review Diagnostic Preview section | Scroll to Section 1 h2 heading |
| 5 | Explain local review signals only | "This shows how candidate review interactions appear — not a real workflow" |
| 6 | Explain diagnostic audit preview boundaries | "No candidate is assigned. No scholarship is approved. No evidence is created." |
| 7 | Walk through Feedback Backlog Preview section | Scroll to Section 2 h2 heading |
| 8 | Explain mock backlog items only | "These are planning samples only — not a production backlog" |
| 9 | Explain false safety flags | See Section 7 |
| 10 | Ask stakeholder feedback questions | See Section 8 |
| 11 | Close with non-approval reminder | Read closing from walkthrough script (MC36 script doc) |

---

## 6. Section Explanation Guide

### Candidate Review Diagnostic Preview

- Shows how candidate review interactions appear in the system
- Local/diagnostic signal only — no real workflow occurs
- Does not assign any candidate to any position or scholarship
- Does not approve any scholarship
- Does not create official evidence of any kind
- `readonly={true}` is enforced at the component level

### Feedback Backlog Preview

- Shows mock planning backlog items for illustrative purposes
- Sample/demo data only — not derived from real backlog
- Does not collect stakeholder feedback into any system
- Does not create a production backlog
- Does not trigger branch creation or issue tracking
- No data is written, saved, or exported

---

## 7. False Safety Flag Explanation

The demo route displays safety flags to make its read-only, non-official status visible. Facilitators should explain these to stakeholders:

| Flag | Value | What it means |
|------|-------|---------------|
| `officialEvidence` | `false` | Nothing in this session constitutes official evidence |
| `approvalCollected` | `false` | No approval has been collected |
| `persisted` | `false` | Nothing has been saved or stored |
| `exported` | `false` | Nothing has been exported |
| `notified` | `false` | No notifications have been sent |
| `isMock` | `true` | All data displayed is safe mock data |
| `nonApprovalConfirmed` | `true` | Non-approval status has been confirmed |

**Key clarification for stakeholders:** These flags are displayed to make safety visible, not to indicate editable workflow state. They cannot be toggled by stakeholders, and their current values are the only valid values for this demo.

---

## 8. Stakeholder Feedback Boundaries

### Allowed feedback topics

- Clarity of copy and labels
- Wording of section headings and descriptions
- Layout and visual hierarchy
- Accessibility (screen reader, keyboard navigation)
- Privacy expectations from the candidate or student perspective
- Workflow understanding (does the demo communicate how the real system will work?)
- Training usefulness (would this help onboard staff?)
- Confusion risks (could any element be mistaken for a live workflow?)

### Forbidden interpretations of feedback

Feedback from a walkthrough session must not be interpreted as:

| Forbidden Interpretation | Reason |
|--------------------------|--------|
| Approval of any kind | No approval pathway exists in a demo walkthrough |
| Sign-off | No sign-off mechanism exists |
| AP-10B authority verification | AP-10B requires separate governance — not walkthrough participation |
| Production readiness confirmation | Demo sessions do not constitute production authorization |
| Scholarship decision | No scholarship decisions may be made via demo walkthrough |
| Assignment authorization | No candidate assignment may be authorized via demo walkthrough |
| Legal or DPO approval | Legal/DPO review requires separate formal process |

---

## 9. Handling Production-Readiness Questions

### "Can this go live?"

**Safe answer:**
> "No. This demo is not production readiness evidence. Production or persistence work remains blocked by AP-10B approval requirements and separate implementation phases that have not been started."

### "Can this become official evidence?"

**Safe answer:**
> "No. The current demo is explicitly not official evidence. Any official evidence pathway must go through separate AP-10B governance approval. That process has not been initiated and requires 7 owner approvals currently at 0/7."

### "Is the system ready for real candidates?"

**Safe answer:**
> "No. The demo uses safe mock data only. No real candidate data is present. Real candidate workflows require AP-10B approval, which remains at 0/7 with 9 active blockers."

### "Does stakeholder participation in this session count toward AP-10B?"

**Safe answer:**
> "No. Walkthrough participation does not count toward AP-10B approval. AP-10B requires formal owner approval through a separate governance process."

---

## 10. Post-Demo Follow-Up Guidance

Every post-demo follow-up must include the following elements:

1. **Demo purpose** — restate that the session was a read-only demo using safe mock data
2. **Sections reviewed** — candidate review diagnostic preview and feedback backlog preview
3. **Feedback themes** — summarize what stakeholders said without implying approval
4. **No approval collected** — explicit statement that no approval was collected
5. **No AP-10B gate change** — explicit statement that AP-10B gate is unchanged (0/7 owners, 9/9 blockers)
6. **No production authorization** — explicit statement that no production authorization was granted
7. **Recommended next step** — if follow-up planning or runtime work is needed, name the separate explicitly approved branch/MC that would address it

**Template language:**

> "This follow-up documents the [DATE] stakeholder walkthrough of the S²IMS candidate review demo combined preview. The session was read-only, used safe mock data only, and covered two sections: candidate review diagnostic preview and feedback backlog preview. No approval was collected. No AP-10B gate change occurred. No production authorization was granted. [FEEDBACK SUMMARY]. Recommended next: [NEXT STEP or 'No runtime action at this time']."

---

## 11. QA Checklist

| Item | Expected |
|------|---------|
| MC36 scope | docs-only |
| `src/*` files changed | None |
| `scripts/*` files changed | None |
| `package.json` changed | No |
| Navigation files changed | No |
| New route created | No |
| Walkthrough updated for combined route | Yes |
| Two-section explanation documented | Yes |
| False safety flag explanation documented | Yes |
| Production-readiness response documented | Yes |
| Non-approval boundary documented | Yes |
| AP-10B unchanged | Confirmed — 0/7, 9/9 blockers |
| AP-10C blocked | Confirmed |
| AP-11 blocked | Confirmed |
| Build baseline | 41/41 |
| Token check baseline | 4/4 |
| Audit check baseline | 440/440 |

---

## Final Safety Statement

Candidate review demo combined preview stakeholder walkthrough update planning is documentation-only.
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

# S²IMS Candidate Review Demo — Feedback Runtime Branch Proposal Template (MC26)

## Purpose

This template provides a standardized, safe format for proposing a runtime implementation branch from an MC25 safe backlog item. Using this template ensures that:

- Each runtime branch is traceable to a classified, prioritized backlog item
- Scope boundaries are explicitly confirmed before branch creation
- No branch proposal is accidentally treated as approval or governance evidence
- AP-10B separation is maintained for every proposal

A completed, reviewed proposal document must exist before any runtime branch is created. Do not create a runtime branch from a review board session directly.

Use alongside the master backlog runtime plan (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_BACKLOG_RUNTIME_PLAN_MC26.md`) and the runtime branch rules (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_RUNTIME_BRANCH_RULES_MC26.md`).

---

## Safe Branch Proposal Template

Copy this template for each proposed runtime branch.

---

**RUNTIME BRANCH PROPOSAL — S²IMS CANDIDATE REVIEW DEMO**

| Field | Value |
|-------|-------|
| **Proposal ID** | (e.g., MC26-BP-001) |
| **Source backlog item ID** | (MC25 backlog item ID, e.g., MC25-BL-003) |
| **Source session date** | (Date of the original walkthrough session, YYYY-MM-DD) |
| **Feedback category** | (MC24 category, one of 9) |
| **Priority** | (P0 / P1 / P2 / P3 / P4 — must not be Out of scope) |
| **Branch type** | (One of: Copy Polish Runtime / Accessibility Polish Runtime / Demo Layout Polish Runtime / Privacy Wording Fix Runtime) |
| **Proposed branch name** | (e.g., `fix/s2ims-candidate-review-demo-copy-polish-mc26-bl-003`) |
| **Summary of proposed change** | (Brief description of what will change — no personal opinions attributed to named individuals) |
| **Affected file paths** | (List all files that will be changed — must only contain permitted paths) |
| **Forbidden paths confirmed** | (Yes — I confirm no forbidden file paths will be modified) |
| **Validation plan** | (build 41/41, audit 353/353, routes 6×200 OK, dev log clean) |
| **AP-10B impact** | (None — this change does not affect AP-10B gate, AP-10C, or AP-11) |
| **Non-approval confirmation** | This branch proposal does not constitute approval of any kind. No AP-10B action was taken. No official evidence was created. |

---

## Required Fields

Every branch proposal must include all 13 fields above. A proposal is considered incomplete and must not proceed if any required field is missing or if the non-approval confirmation is absent.

---

## Forbidden Fields

The following information must NOT appear anywhere in a branch proposal:

- Full names of individual stakeholders, students, or personnel
- Approval statements of any kind (written or paraphrased)
- Signatures
- AP-10B governance language (e.g., "AP-10B approved", "owner nominated", "gate cleared")
- Production readiness language (e.g., "ready to ship", "approved for production")
- Real student or personnel identifiers
- Personal contact information

---

## Non-Approval Confirmation Language

The following statement must appear verbatim in the **Non-approval confirmation** field of every branch proposal:

> "This branch proposal does not constitute approval of any kind. No AP-10B action was taken. No official evidence was created."

This statement must not be abbreviated, omitted, or paraphrased.

---

## AP-10B Separation Statement

All runtime branch proposals are explicitly separated from AP-10B governance:

- No branch proposal constitutes an AP-10B approval
- No branch proposal nominates an AP-10B owner
- No branch proposal changes the AP-10B gate status
- Creating and merging a runtime branch from this proposal does not progress the AP-10B gate
- The AP-10B gate remains: 0/7 owners, 9/9 blockers — unchanged
- AP-10C: Blocked — unchanged
- AP-11: Blocked — unchanged

---

## Sample Safe Branch Proposal

The following is a correctly completed example of a safe branch proposal.

---

**RUNTIME BRANCH PROPOSAL — S²IMS CANDIDATE REVIEW DEMO**

| Field | Value |
|-------|-------|
| **Proposal ID** | MC26-BP-001 |
| **Source backlog item ID** | MC25-BL-001 |
| **Source session date** | 2026-05-17 |
| **Feedback category** | Copy / Content |
| **Priority** | P1 |
| **Branch type** | Copy Polish Runtime |
| **Proposed branch name** | `fix/s2ims-candidate-review-demo-copy-polish-mark-reviewed-label` |
| **Summary of proposed change** | Rename the "Mark as Reviewed" label to "Note for Internal Review" to make clear the action is a local signal only with no official effect. Change applies to `CandidateSelectionReviewShell.tsx` string literal only. |
| **Affected file paths** | `src/components/assignment/CandidateSelectionReviewShell.tsx` |
| **Forbidden paths confirmed** | Yes — no navigation files, layout components, scripts, or other src/* files will be modified. |
| **Validation plan** | npm run build → 41/41, npm run check:audit-events → 353/353, route smoke → 6×200 OK, dev log clean |
| **AP-10B impact** | None — this change does not affect AP-10B gate, AP-10C, or AP-11 |
| **Non-approval confirmation** | This branch proposal does not constitute approval of any kind. No AP-10B action was taken. No official evidence was created. |

---

## Sample Unsafe Branch Proposal

The following is an incorrectly completed branch proposal. Annotations explain what makes each element unsafe.

---

**RUNTIME BRANCH PROPOSAL — S²IMS CANDIDATE REVIEW DEMO** *(UNSAFE — DO NOT FILE)*

| Field | Value | Why Unsafe |
|-------|-------|------------|
| **Proposal ID** | MC26-BP-002 | — |
| **Source backlog item ID** | — | ❌ Missing source backlog reference |
| **Source session date** | 2026-05-17 | — |
| **Feedback category** | Production approval | ❌ Not a valid MC24 category |
| **Priority** | Out of scope | ❌ Out of scope items must not become branch proposals |
| **Branch type** | Audit write implementation | ❌ Forbidden branch type |
| **Proposed branch name** | `feature/audit-write` | — |
| **Summary of proposed change** | As approved by the director, implement audit write for the candidate review demo. | ❌ Contains approval claim; references named authority |
| **Affected file paths** | `src/services/audit/`, `src/lib/assignment/`, `scripts/check-audit-events.mjs` | ❌ Forbidden paths — scripts and audit service are forbidden |
| **Forbidden paths confirmed** | (blank) | ❌ Required confirmation is missing |
| **Validation plan** | (blank) | ❌ Required validation plan is missing |
| **AP-10B impact** | AP-10B gate cleared by director | ❌ AP-10B impact cannot be claimed by a branch proposal |
| **Non-approval confirmation** | *(omitted)* | ❌ Non-approval confirmation must never be omitted |

**Correct action:** Do not file this proposal. This is a governance-sensitive backlog item — route it to the AP-10B approval process. Do not create any runtime branch from this item.

---

*Template version: MC26. Last updated: 2026-05-17.*

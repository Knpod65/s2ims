# S²IMS Candidate Review Demo — Feedback Safe Backlog Template (MC25)

## Purpose

This template provides a standardized, safe format for recording candidate future work items produced by the MC25 feedback review board. Using this template ensures that:

- Backlog items derive from classified, non-PII feedback records
- No personal data appears in backlog entries
- No backlog item is accidentally treated as approval or governance evidence
- All backlog items include an explicit non-approval confirmation
- AP-10B separation is maintained for every entry

Use this template alongside the master review board plan (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_REVIEW_BOARD_PLAN_MC25.md`) and the prioritization matrix (`S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_PRIORITIZATION_MATRIX_MC25.md`).

---

## Safe Backlog Record Template

Copy this template for each candidate future work item.

---

**BACKLOG ITEM — S²IMS CANDIDATE REVIEW DEMO FEEDBACK**

| Field | Value |
|-------|-------|
| **Backlog item ID** | (e.g., MC25-BL-001) |
| **Source feedback ID** | (MC24 record ID(s) this item derives from, e.g., 2026-05-17-003) |
| **Source session date** | (YYYY-MM-DD of the original walkthrough session) |
| **Feedback category** | (One of the 9 MC24 categories) |
| **Priority** | (P0 / P1 / P2 / P3 / P4) |
| **Summary** | (Brief, factual description of the feedback theme — no personal opinions attributed to named individuals) |
| **Safety concern** | (Yes / No — if Yes, describe briefly) |
| **Proposed branch type** | (One of the allowed branch types from the review board plan Section 7, or "Pending further review") |
| **AP-10B impact** | (None / Governance-sensitive — if governance-sensitive, this item must not be filed; route to governance instead) |
| **Non-approval confirmation** | This backlog item does not constitute approval of any kind. No AP-10B action was taken. No official evidence was created. |

---

## Required Fields

Every backlog item must include all 10 fields above. An item is considered incomplete and must not be acted upon if any required field is missing.

The **Non-approval confirmation** field must contain the verbatim statement:

> "This backlog item does not constitute approval of any kind. No AP-10B action was taken. No official evidence was created."

This statement must not be abbreviated, omitted, or paraphrased.

---

## Forbidden Fields

The following information must NOT appear anywhere in a backlog item:

- Full names of individual stakeholders, students, or personnel
- National ID numbers, passport numbers, or government-issued IDs
- Phone numbers or personal email addresses
- Home or work addresses
- Student application IDs or scholarship record IDs corresponding to real individuals
- Medical, health, or financial data
- Private hardship or personal circumstance details
- Approval statements of any kind
- Signatures
- AP-10B governance language (e.g., "AP-10B approved by", "owner nominated")
- Production readiness language (e.g., "ready to ship", "approved for production")

---

## Non-Approval Confirmation Language

The following statement must appear verbatim in the **Non-approval confirmation** field of every backlog item:

> "This backlog item does not constitute approval of any kind. No AP-10B action was taken. No official evidence was created."

This language must not be omitted, abbreviated, or paraphrased in a way that weakens its meaning.

---

## AP-10B Separation Statement

All backlog items produced by the review board are explicitly separated from AP-10B governance:

- No backlog item constitutes an AP-10B approval
- No backlog item nominates an AP-10B owner
- No backlog item changes the AP-10B gate status
- The AP-10B gate remains: 0/7 owners, 9/9 blockers — unchanged
- AP-10C: Blocked — unchanged
- AP-11: Blocked — unchanged

If a proposed backlog item has AP-10B impact set to "Governance-sensitive", it must not be filed in the backlog. Route it to the governance process only.

---

## Sample Safe Backlog Item

The following is a correctly completed example of a safe backlog item.

---

**BACKLOG ITEM — S²IMS CANDIDATE REVIEW DEMO FEEDBACK**

| Field | Value |
|-------|-------|
| **Backlog item ID** | MC25-BL-001 |
| **Source feedback ID** | 2026-05-17-003, 2026-05-17-007 |
| **Source session date** | 2026-05-17 |
| **Feedback category** | Copy / Content |
| **Priority** | P1 |
| **Summary** | Multiple participants interpreted the "Mark as Reviewed" label as submitting an official decision. The label should be revised to make clear that it is a local review signal only with no persistence or official effect. |
| **Safety concern** | No |
| **Proposed branch type** | Copy polish runtime (separate implementation branch required) |
| **AP-10B impact** | None |
| **Non-approval confirmation** | This backlog item does not constitute approval of any kind. No AP-10B action was taken. No official evidence was created. |

---

## Sample Unsafe Backlog Item

The following is an incorrectly completed backlog item. Annotations explain what makes each element unsafe.

---

**BACKLOG ITEM — S²IMS CANDIDATE REVIEW DEMO FEEDBACK** *(UNSAFE — DO NOT FILE)*

| Field | Value | Why Unsafe |
|-------|-------|------------|
| **Backlog item ID** | MC25-BL-002 | — |
| **Source feedback ID** | — | ❌ Missing source reference |
| **Source session date** | 2026-05-17 | — |
| **Feedback category** | Production approval | ❌ Not a valid MC24 category |
| **Priority** | (blank) | ❌ Priority field is required |
| **Summary** | Dr. Somchai said we're ready to proceed. He approves the audit write implementation. | ❌ Contains a real name; constitutes a governance approval claim |
| **Safety concern** | No | — |
| **Proposed branch type** | Begin audit write implementation immediately | ❌ Forbidden branch type — requires separate approved branch |
| **AP-10B impact** | (blank) | ❌ AP-10B impact field is required |
| **Non-approval confirmation** | *(omitted)* | ❌ Non-approval confirmation must never be omitted |

**Correct action:** Do not file this item. Remove the name. Remove the approval language. Remove the forbidden branch type. If this item reflects a governance-sensitive request, route it to the governance process and record it in the out-of-scope log. Do not create a backlog item.

---

*Template version: MC25. Last updated: 2026-05-17.*

# S²IMS AP-10B Readiness Decision Matrix

**Classification**: Internal Governance Planning Document  
**Date**: 2026-05-21  
**Milestone**: MC73  
**Status**: Planning only — No path is currently active. All paths C–F are BLOCKED.

---

## Purpose

This decision matrix defines six paths for S²IMS progression. Each path describes what it allows, what it requires, its risk level, and its current status. Leadership uses this matrix to decide which path to authorize.

---

## Path Overview

| Path | Name | Allows | Current Status |
|------|------|--------|----------------|
| **A** | UX Polish Only | UI/design renovation, no data | ✅ Safe — May proceed |
| **B** | Controlled Demo | Stakeholder demo with synthetic data | ✅ Safe with prep |
| **C** | Limited Pilot | Restricted real-data pilot | ⚠️ Requires governance action |
| **D** | Persistence Enable | Activate real database persistence | ⚠️ Requires governance action |
| **E** | Import Enable | Activate AP-10B (Confirm Import) | ⚠️ Requires full governance |
| **F** | Production | Full production deployment | ❌ BLOCKED — Requires all governance gates |

---

## Path A — UX Polish Only

**Description**: Continue UI/UX renovation work without touching data layers or governance gates.

| Attribute | Value |
|-----------|-------|
| **Allows** | Migrate pages to shared primitives (Button, StatusBadge), Figma design work, component library expansion, accessibility improvements |
| **Requires** | No new approval — already safe |
| **Does NOT allow** | Real data, persistence activation, any AP gate changes |
| **Risk level** | Low |
| **Status** | ✅ SAFE TO PROCEED |
| **Next step** | Proceed with MC74+ UI renovation |

---

## Path B — Controlled Demo

**Description**: Run a structured stakeholder demo using the S²IMS system with synthetic data.

| Attribute | Value |
|-----------|-------|
| **Allows** | Full UI walkthrough for all 6 roles, stakeholder feedback collection, UX review sessions |
| **Requires** | Demo coordinator, demo script, stakeholder scheduling, feedback collection template (all available in MC73 docs) |
| **Does NOT allow** | Real data import, persistence activation, any AP gate changes |
| **Risk level** | Low |
| **Status** | ✅ SAFE TO PROCEED (after scheduling) |
| **Preparation** | Use `docs/architecture/S2IMS_CONTROLLED_DEMO_EXECUTION_REPORT_TEMPLATE_MC73.md` and `S2IMS_CONTROLLED_DEMO_FEEDBACK_COLLECTION_TEMPLATE_MC73.md` |
| **Note** | **No demo has occurred yet. Do not claim a demo took place until template is filled in post-session.** |

---

## Path C — Limited Pilot with Restricted Real Data

**Description**: Import a small, well-defined subset of real data (e.g., one scholarship cycle, anonymized) for internal testing.

| Attribute | Value |
|-----------|-------|
| **Allows** | Limited real-data import for internal testing only, not public-facing |
| **Requires** | PDPA review (1.1), Data contract (2.1–2.3), Rollback procedure (2.5), AP-10B authority designated (6.1), Go/no-go meeting (6.4) |
| **Does NOT allow** | Full production import, public access to real data, official records |
| **Risk level** | Medium — real data involved |
| **Status** | ⚠️ BLOCKED — Governance checklist items 1.1, 2.1–2.3, 2.5, 6.1, 6.4 must be confirmed first |
| **Unblocked by** | `docs/governance/S2IMS_IMPORT_PERSISTENCE_READINESS_GOVERNANCE_CHECKLIST_MC73.md` items above |

---

## Path D — Persistence Activation

**Description**: Activate the real database layer so actions taken in the system are persisted between sessions.

| Attribute | Value |
|-----------|-------|
| **Allows** | Real-time data persistence, session continuity, multi-user coordination |
| **Requires** | All Section 3 infrastructure items (3.1–3.6), AP-10B authority, PDPA review, data retention policy, security review |
| **Does NOT allow** | Data import without completing all checklist items |
| **Risk level** | Medium-High — schema changes, data loss risk if misconfigured |
| **Status** | ⚠️ BLOCKED — Governance checklist Sections 1, 3, 4 must be confirmed |
| **Code path** | AP-10B gate in import confirmation flow (currently no-op) |

---

## Path E — Import Activation (AP-10B Open)

**Description**: Enable the Confirm Import workflow (AP-10B) so staff can process real data imports end-to-end.

| Attribute | Value |
|-----------|-------|
| **Allows** | Full import workflow: upload → preview → confirm → persist |
| **Requires** | ALL governance checklist items (1.1–6.5), operator training (5.1), audit log persistence (3.3), full PDPA compliance |
| **Does NOT allow** | Export approval (AP-10C separate), approval workflows (AP-11 separate) |
| **Risk level** | High — irreversible data writes, PDPA exposure if misconfigured |
| **Status** | ⚠️ BLOCKED — All 25 checklist items must be confirmed before AP-10B can open |
| **Authority** | Requires designated AP-10B authority (item 6.1) + go/no-go sign-off (item 6.5) |

---

## Path F — Full Production Deployment

**Description**: Open all governance gates (AP-10B, AP-10C, AP-11) and deploy as a production system.

| Attribute | Value |
|-----------|-------|
| **Allows** | Real data import, export approval, approval workflows, official audit records, production persistence |
| **Requires** | All 25 governance checklist items + AP-10C authority (6.2) + AP-11 authority (6.3) + production infrastructure + security sign-off |
| **Risk level** | High — full production exposure |
| **Status** | ❌ BLOCKED — No governance items confirmed. All three gates remain locked. |
| **Earliest possible** | After all governance checklist items are confirmed and go/no-go meeting held |

---

## Current Recommended Path

**Path A (UX Polish)** or **Path B (Demo Scheduling)** are the only paths that can be initiated without additional approvals.

To initiate Path C, D, E, or F, designate governance owners using the checklist in `docs/governance/S2IMS_IMPORT_PERSISTENCE_READINESS_GOVERNANCE_CHECKLIST_MC73.md`.

---

## Path Comparison Summary

| | Path A | Path B | Path C | Path D | Path E | Path F |
|-|--------|--------|--------|--------|--------|--------|
| Real data | ❌ | ❌ | Limited | ❌ | ✅ | ✅ |
| Persistence | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ |
| AP-10B open | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| AP-10C open | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| AP-11 open | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Risk | Low | Low | Med | Med-High | High | High |
| Approval needed | None | None | Partial | Partial | Full | Full |
| **Current status** | ✅ OK | ✅ OK | ⚠️ | ⚠️ | ⚠️ | ❌ |

---

**Document Classification**: Internal governance planning only.  
**Not a decision record.** Paths C–F cannot be activated without completing the governance checklist.

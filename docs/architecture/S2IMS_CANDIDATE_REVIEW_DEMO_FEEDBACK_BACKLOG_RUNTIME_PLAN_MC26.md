# S²IMS Candidate Review Demo — Feedback Backlog Runtime Plan (MC26)

## Branch

`architecture/s2ims-candidate-review-demo-feedback-backlog-runtime-plan-mc26`

---

## 1. Purpose

MC26 defines how MC25 safe backlog items are converted into scoped runtime implementation branches. It establishes the rules, scope gates, and proposal process that must be followed before any backlog item is translated into actual code changes.

**Core rule:** Branch creation is a scoped engineering process. It is not an approval, governance action, or official sign-off. Creating a runtime branch from a backlog item does not constitute:

- AP-10B approval or owner nomination
- Production readiness approval
- Audit write readiness approval
- Scholarship or assignment decision
- Official evidence of any kind

The backlog-to-branch process converts a planned work item into a scoped, reviewable implementation effort. It does not activate any governance gate.

---

## 2. Scope

### In scope for MC26

- Backlog-to-branch conversion rules
- Permitted runtime branch types and scope boundaries
- Forbidden runtime branch types
- Branch scope gates (allowed/forbidden file paths per branch type)
- Backlog-to-branch conversion workflow
- Branch proposal template
- Branch proposal review checklist
- AP-10B separation language

### Out of scope (not implemented by MC26)

- Runtime implementation of any branch
- Persistence of any kind
- Backend or API
- Audit write
- Route or navigation changes
- Official evidence creation
- Candidate assignment
- Scholarship approval
- AP-10B governance
- AP-10C activation
- AP-11 activation

---

## 3. Source Baseline

MC26 builds on the following completed milestones:

| MC | Description |
|----|-------------|
| MC20 | Read-only diagnostic preview demo page at `/admin/candidate-review-demo`. Safe mock data. Route hidden from navigation. |
| MC21 | Demo page exposure and review safety documentation. |
| MC22 | Navigation safety runtime. 353/353 audit baseline. |
| MC23 | Stakeholder walkthrough pack, feedback form, post-demo follow-up template. |
| MC24 | Feedback intake rules, 9-category classification matrix, feedback record template. |
| MC25 | Feedback review board, 6-level prioritization model (P0–P4), safe backlog template. |

Current validation baseline:

| Metric | Value |
|--------|-------|
| Build | 41/41 pages, 0 type errors |
| Token checks | 4/4 |
| Audit checks | 353/353 |
| Routes | 6×200 OK |
| AP-10B gate | 0/7 owners, 9/9 blockers |
| AP-10C | Blocked |
| AP-11 | Blocked |

MC26 does not modify any source, script, or navigation file.

---

## 4. Permitted Runtime Branch Types

The following runtime branch types may be created from MC25 P0–P4 backlog items. Each branch type has a defined scope boundary that must not be exceeded.

### Copy Polish Runtime

**Source priority:** P1 (Misleading Copy / Workflow Misunderstanding)

**Purpose:** Revise copy on the demo page to prevent misleading interpretations of demo actions.

**Allowed file paths:**
- `src/app/admin/candidate-review-demo/page.tsx`
- `src/components/assignment/CandidateSelectionReviewShell.tsx`

**Forbidden file paths (must not be touched):**
- `src/lib/navigation.ts`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/MobileBottomNav.tsx`
- `src/components/layout/Topbar.tsx`
- `src/lib/assignment/candidateReviewDemoData.ts` (unless copy change only — no logic)
- Any file outside `src/app/admin/candidate-review-demo/` and `src/components/assignment/`
- All `scripts/*` files
- All `docs/*` files (handled separately)

**Required post-change validation:** build 41/41, audit 353/353, routes 6×200 OK.

---

### Accessibility Polish Runtime

**Source priority:** P2 (Accessibility Blocker)

**Purpose:** Fix accessibility issues on the demo page (ARIA roles, keyboard navigation, contrast, focus management).

**Allowed file paths:**
- `src/app/admin/candidate-review-demo/page.tsx`
- `src/components/assignment/CandidateSelectionReviewShell.tsx`
- `src/components/assignment/` (accessibility-specific changes only — no logic or behavior changes)

**Forbidden file paths (must not be touched):**
- All navigation files
- All layout components not in `src/components/assignment/`
- All `scripts/*` files
- Any persistence, backend, or API file

**Required post-change validation:** build 41/41, audit 353/353, routes 6×200 OK.

---

### Demo Layout Polish Runtime

**Source priority:** P3 (UX Clarity Improvement)

**Purpose:** Improve the visual layout, hierarchy, or information structure of the demo page.

**Allowed file paths:**
- `src/app/admin/candidate-review-demo/page.tsx`
- `src/components/assignment/CandidateSelectionReviewShell.tsx`

**Forbidden file paths (must not be touched):**
- All navigation files
- All layout components
- `src/lib/assignment/candidateReviewDemoData.ts` (no data changes)
- All `scripts/*` files

**Required post-change validation:** build 41/41, audit 353/353, routes 6×200 OK.

---

### Privacy Wording Fix Runtime

**Source priority:** P0 (Safety / Privacy Concern)

**Purpose:** Fix misleading mock data labels, demo boundary markers, or privacy-related display copy.

**Allowed file paths:**
- `src/lib/assignment/candidateReviewDemoData.ts` — label/copy changes only; no logic changes; `isMock: true` and `privacyLevel: "safe_display"` must be preserved
- `src/app/admin/candidate-review-demo/page.tsx` — privacy warning copy only

**Forbidden file paths (must not be touched):**
- All navigation files
- All layout components
- All `scripts/*` files
- Any file that changes data shape, adds fields, or alters mock data structure

**Required post-change validation:** build 41/41, audit 353/353 (must not drop), routes 6×200 OK.

---

## 5. Forbidden Runtime Branch Types

The following must not be created as direct outputs of the backlog-to-branch conversion process without a separately approved governance branch:

| Branch Type | Status |
|------------|--------|
| Audit write runtime | Forbidden — requires AP-10B gate progress + separate approved branch |
| Persistence runtime | Forbidden — requires separate approved branch |
| Backend / API runtime | Forbidden — requires separate approved branch |
| Schema / migration | Forbidden — requires separate approved branch |
| Approval workflow activation | Forbidden — requires separate approved branch |
| Assignment workflow activation | Forbidden — requires separate approved branch |
| Navigation exposure of demo route | Forbidden — requires separate approved branch |
| AP-10C activation | Forbidden — requires AP-10B gate to clear 7/7 |
| AP-11 activation | Forbidden — requires AP-10C completion |
| Any branch that modifies `scripts/*` | Forbidden — scripts are protected baseline |
| Any branch that modifies `package.json` | Forbidden — dependency changes require separate process |

---

## 6. Backlog-to-Branch Conversion Workflow

The following 7-step workflow must be completed before any runtime branch is created from a backlog item.

### Step 1 — Select a backlog item

Choose an MC25 backlog item with priority P0–P4. Do not select items with AP-10B impact set to "Governance-sensitive".

### Step 2 — Verify non-governance-sensitive

Confirm the backlog item's AP-10B impact field is set to "None". If it is "Governance-sensitive", stop — do not proceed with branch creation. Route the item to the governance process.

### Step 3 — Determine permitted branch type

Map the backlog item's MC24 feedback category and MC25 priority level to one of the four permitted branch types in Section 4. If the required change cannot be accommodated by any of the four permitted branch types, stop and escalate.

### Step 4 — Write a branch proposal document

Create a branch proposal document using the template in `S2IMS_CANDIDATE_REVIEW_DEMO_FEEDBACK_RUNTIME_BRANCH_TEMPLATE_MC26.md`. Fill all required fields. Confirm the non-approval confirmation is present verbatim.

### Step 5 — Confirm scope boundary

Review the allowed and forbidden file paths for the selected branch type (Section 4 / Section 7 of the runtime branch rules doc). Confirm the proposed change does not require touching any forbidden path. If it does, stop and escalate.

### Step 6 — Confirm no AP-10B impact

Confirm that the proposed runtime change does not:
- Write audit events
- Persist state
- Call a backend/API
- Expose the demo route in navigation
- Collect approvals or personal data
- Change the AP-10B gate

If any of the above applies, stop and escalate to the governance process.

### Step 7 — Create the branch from the proposal doc

Create the runtime branch using the branch name format specified in the proposal doc. The branch must not be created from a review board session directly — it must have a completed, reviewed proposal doc. Complete the implementation within the confirmed scope boundary. Run validation (build 41/41, audit 353/353, routes 6×200 OK) before merging.

---

## 7. Runtime Branch Scope Gates

Each permitted branch type has an explicit scope gate. Scope gates define the maximum extent of changes permitted on that branch. Any proposed change that exceeds the scope gate must stop and escalate.

### Scope gate: Copy Polish Runtime

| | |
|-|-|
| **Allowed paths** | `src/app/admin/candidate-review-demo/page.tsx`, `src/components/assignment/CandidateSelectionReviewShell.tsx` |
| **Forbidden paths** | All navigation files, all layout components, all scripts, all other src/* |
| **Allowed change types** | String literals, copy text, label text, banner text |
| **Forbidden change types** | Logic changes, state changes, import changes, new components, route changes |
| **Required build** | 41/41, 0 type errors |
| **Required audit count** | 353/353 |
| **Required route smoke** | 6×200 OK |

### Scope gate: Accessibility Polish Runtime

| | |
|-|-|
| **Allowed paths** | `src/app/admin/candidate-review-demo/page.tsx`, `src/components/assignment/CandidateSelectionReviewShell.tsx`, accessibility-specific additions in `src/components/assignment/` |
| **Forbidden paths** | All navigation files, all layout components outside `src/components/assignment/`, all scripts |
| **Allowed change types** | ARIA attributes, role attributes, tabIndex, focus management, color/contrast CSS, keyboard event handlers for navigation only |
| **Forbidden change types** | Logic changes, state persistence, new API calls, new audit events, route changes |
| **Required build** | 41/41, 0 type errors |
| **Required audit count** | 353/353 |
| **Required route smoke** | 6×200 OK |

### Scope gate: Demo Layout Polish Runtime

| | |
|-|-|
| **Allowed paths** | `src/app/admin/candidate-review-demo/page.tsx`, `src/components/assignment/CandidateSelectionReviewShell.tsx` |
| **Forbidden paths** | All navigation files, all layout components, `src/lib/assignment/candidateReviewDemoData.ts`, all scripts |
| **Allowed change types** | CSS classes, layout structure, visual hierarchy, information ordering |
| **Forbidden change types** | Data changes, logic changes, state persistence, new imports, route changes |
| **Required build** | 41/41, 0 type errors |
| **Required audit count** | 353/353 |
| **Required route smoke** | 6×200 OK |

### Scope gate: Privacy Wording Fix Runtime

| | |
|-|-|
| **Allowed paths** | `src/lib/assignment/candidateReviewDemoData.ts` (copy/labels only), `src/app/admin/candidate-review-demo/page.tsx` (privacy warning copy only) |
| **Forbidden paths** | All navigation files, all layout components, all scripts, any file that alters data structure or logic |
| **Allowed change types** | String literals for display labels and privacy warnings only; `isMock: true` and `privacyLevel: "safe_display"` must be preserved unchanged |
| **Forbidden change types** | Data structure changes, field additions, logic changes, new exports, mock data quantity changes |
| **Required build** | 41/41, 0 type errors |
| **Required audit count** | 353/353 (must not drop — MC22 checks must all pass) |
| **Required route smoke** | 6×200 OK |

---

## 8. Branch Proposal Review Checklist

Before any runtime branch is created, the following checklist must be completed:

- [ ] Backlog item ID is present and references an MC25 safe backlog item
- [ ] Backlog item priority is P0, P1, P2, P3, or P4 (not Out of scope)
- [ ] Backlog item AP-10B impact is "None"
- [ ] Branch type is one of the four permitted types (Section 4)
- [ ] Scope boundary confirmed — all proposed file paths are in the allowed list
- [ ] No persistence changes planned
- [ ] No audit write planned
- [ ] No navigation exposure planned
- [ ] No AP-10B approval collected or implied
- [ ] Validation plan includes build 41/41, audit 353/353, routes 6×200 OK
- [ ] Non-approval confirmation present verbatim in the proposal doc

---

## 9. AP-10B Separation

Branch creation from a feedback backlog item is explicitly separated from AP-10B governance:

- No branch proposal constitutes an AP-10B approval
- No branch proposal nominates an AP-10B owner
- No branch creation changes the AP-10B gate status
- No number of completed runtime branches constitutes production readiness
- The AP-10B gate remains: 0/7 owners, 9/9 blockers — unchanged regardless of runtime branch activity
- AP-10C: Blocked — unchanged
- AP-11: Blocked — unchanged

Creating and merging copy polish, accessibility, layout, or privacy wording branches does not move the AP-10B gate. AP-10B progress requires a separate, explicit AP-10B approval collection process.

---

## 10. QA Checklist

- [ ] Docs-only scope — no src/*, scripts/*, or package.json changes
- [ ] No route or navigation files modified
- [ ] Backlog-to-branch conversion workflow documented (7 steps)
- [ ] Permitted runtime branch types documented (4 types with scope boundaries)
- [ ] Forbidden runtime branch types documented
- [ ] Runtime branch scope gates documented (Section 7)
- [ ] Branch proposal review checklist documented (Section 8)
- [ ] AP-10B separation documented (Section 9)
- [ ] AP-10B gate unchanged: 0/7 owners, 9/9 blockers
- [ ] AP-10C: Blocked
- [ ] AP-11: Blocked
- [ ] MC1–MC25 boundaries preserved

---

## Safety Statement

This plan:
- Is documentation only
- Does not modify any source, script, or navigation file
- Does not implement any runtime branch
- Does not expose the demo route in any navigation menu
- Does not change route behavior
- Does not implement audit write
- Does not persist state
- Does not collect official evidence
- Does not change AP-10B gate status
- Does not activate AP-10C or AP-11

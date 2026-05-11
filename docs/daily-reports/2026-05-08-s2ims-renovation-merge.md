# S²IMS Architecture Renovation Merge Checkpoint

**Date:** 2026-05-08  
**Branch:** `main`  
**Merge commit:** `7ed0933`  
**Merged branch:** `audit/architecture-renovation-plan`  
**Merge title:** `Merge architecture renovation foundation`

---

## Validation Results

- `npm run build` — passed after merge.
- `npm run check:tokens` — passed after merge.
- Git status before report creation was clean on `main`.

---

## Major Architecture Foundations Now On Main

The renovation foundation is now merged into `main`.

Added architecture and planning coverage:

- Architecture renovation audit.
- Renovation plan.
- Route map.
- Component inventory.
- Role / permission map.
- PDPA data exposure map.
- Data access map.
- Next renovation steps.
- Phase-specific review docs through Phase 2L.

Added read-only config foundations:

- Role config.
- Privacy config.
- Sensitive action config.
- Export allowlist config.
- Status config and status helpers.
- Token format config.

Added policy and review docs:

- Token formatting policy and migration notes.
- Sensitive action reason inventory and policy.
- Reason-required modal proposal.
- Status usage inventory and migration plan.
- Status helper pattern review.
- Renovation branch review package and merge checklist.

---

## Runtime Migrations Now On Main

Low-risk runtime migrations now on `main`:

- Data freshness status handling centralized.
- Staff freshness key normalized from `current` to `fresh`, while staff display remains `Current` / `ปัจจุบัน`.
- Shortlist status display centralized.
- Provider-facing shortlist `declined` label now displays as `Not approved` / `ไม่อนุมัติ`.
- Provider scholarship status display centralized for provider surfaces.
- Candidate pool status display centralized with a dedicated `candidatePool` status domain.
- Token formatting utility adopted in one safe staff location.
- `npm run check:tokens` added for lightweight token output checks.

---

## Intentionally Not Changed

The merge did not change:

- Auth behavior.
- Route structure.
- Role guards.
- Navigation behavior.
- Backend/API/database behavior.
- Export behavior.
- Disclosure workflow.
- Staff approval workflow.
- Provider privacy boundary logic.
- Provider candidate selection logic.
- Provider form behavior.
- Public scholarship status behavior.
- Application/document/disclosure/audit/security status systems.

---

## Remaining Risks

- Client-only auth remains a prototype limitation.
- Privacy, export, and audit policies are documented but not backend-enforced.
- Status helper usage is still adapter-based and has no dedicated unit tests.
- Tone-to-class mapping remains local to components/adapters.
- Higher-risk status domains remain unmigrated:
  - Application statuses.
  - Document statuses.
  - Disclosure statuses.
  - Audit/security risk statuses.
  - Admin export/security statuses.
  - OCR/job statuses.
- No automated screenshot or smoke test suite exists yet.
- Provider privacy boundary remains convention/config guided rather than enforced by runtime policy or tests.

---

## Recommended Next Branches

Recommended branch options after this merge:

1. `audit/post-merge-smoke-review`
   - Purpose: manually smoke test high-value routes and provider privacy boundary after merge.

2. `tests/token-status-helper-hardening`
   - Purpose: add lightweight unit checks for token and status helper behavior before more runtime migration.

3. `docs/document-status-migration-plan`
   - Purpose: plan document status migration only, with product wording and screenshot QA requirements.

4. `audit/provider-privacy-boundary-checks`
   - Purpose: add documentation or lightweight checks that provider candidate pools remain token-only.

---

## Recommended Next Phase

Recommended next phase: **post-merge smoke review before new runtime renovation work**.

Rationale:

- The architecture foundation is now on `main`.
- Build and token checks pass.
- Runtime migrations were intentionally small, but several low-risk display surfaces changed.
- Higher-risk domains should wait until the merged foundation is smoke tested and reviewed in-place.

After smoke review, the safest next implementation phase is helper hardening with tests. The safest
next planning phase is a document status migration plan only.

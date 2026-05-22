# S²IMS Page Implementation Priority — MC86

**Companion to**: S2IMS_DESIGN_HANDOFF_INTAKE_REVIEW_MC86.md and the handoff screen-implementation-map.md

**Source**: handoff/screen-implementation-map.md (16 routes analyzed) + current codebase grep + governance contracts.

---

## Tier 1 — Implement First (Highest Impact + Highest Governance Risk)

These 6 surfaces should be the first to receive the new visual language **after** Phase 0-2 primitives are stable.

1. **/login** (public entry)
   - Source: Round 2 + 3
   - Why first: First thing every user sees; sets "Soft Civic" tone immediately.
   - Governance: Must not imply persistence or approval.
   - Risk: Low (public).
   - Dependencies: Button, RoleBadge, SafetyBanner (light).

2. **/admin/audit-log**
   - Source: Round 2
   - Why: Highest governance visibility surface (evidence boundary).
   - Must have: permanent evidence SafetyBanner, correct preview/blocked colors, PII ★ masking.
   - Risk: Critical — any regression here is a security incident.
   - Dependencies: SafetyBanner, DataTable, StatusBadge (new palette).

3. **/admin/master-data/import-preview** (AP-10B gate)
   - Source: Round 2 + MC54
   - Why: The single most important AP-10B enforcement surface.
   - Must have: permanent "AP-10B Gate — Preview Only" banner + Confirm Import permanently disabled + lock + DisabledActionHint + preview violet.
   - Risk: Critical.
   - Dependencies: SafetyBanner, DisabledActionHint, preview color discipline.

4. **/staff/applications** (list + [id])
   - Source: Round 2 + MC8/MC17 lineage
   - Why: Core staff workflow; many existing safety patterns to preserve (local state only).
   - Must preserve: MC8 local review state, no persistence, "recommendation only".
   - Risk: High (must not regress existing diagnostic behavior).
   - Dependencies: SafetyBanner, FeedbackCaptureCard, existing candidate review shell.

5. **/admin/dashboard** (governance command center)
   - Source: Round 2 + 3 (Admin Governance journey)
   - Why: Surfaces AP blocker status at a glance.
   - Must have: governance SafetyBanner + MetricCards showing blocker state.
   - Risk: Medium-High.
   - Dependencies: MetricCard, SafetyBanner.

6. **/esq/* routes** (dashboard, history, announcement review)
   - Source: Round 3
   - Why: Strict "Recommendation — not an approval" language discipline required everywhere.
   - Risk: High (language + safety copy).
   - Dependencies: SafetyBanner, explicit bilingual copy enforcement.

---

## Tier 2 — After Tier 1 Stable

- /provider/dashboard, /provider/scholarships, /provider/candidates
- /student/applications, /student/applications/[id], /student/dashboard
- Public /scholarships + [id]

These are lower governance risk and can wait until the safety primitives and Tier 1 screens prove the new visual language works without regression.

---

## Tier 3 — Later / Out of First Wave

- Deep detail views
- Any new routes or navigation changes
- Anything that would require enabling currently blocked actions

---

## What Must Remain Unchanged on Every Tier (from handoff map)

- Confirm Import disabled on import-preview
- No new audit event types
- Local review state (MC8) remains local-only on staff routes
- ESQ outputs labeled "Recommendation" (never approval)
- PII masking + ★ per role
- Disabled actions stay visible + have DisabledActionHint
- No persistence, no backend, no package changes

**End of Page Implementation Priority — MC86**

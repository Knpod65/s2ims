# S²IMS MC87 Recommended First Implementation Scope — MC86

**Purpose**: Authoritative recommendation for the very first visual implementation wave after MC86 completes.

**Derived from**: handoff/implementation-phasing-plan.md + screen-implementation-map.md + component gap analysis + governance contracts.

---

## Recommended Scope for MC87 (First Visual Wave)

**Name**: S²IMS Soft Civic Intelligence Visual Foundation + Tier 1 Screens

**Phases Included**:
- Phase 0: Token alignment (CSS vars + Tailwind mapping, zero visual change)
- Phase 1: Polish existing Button + StatusBadge (no API break, add preview/disabled variant + data-governance + new palette)
- Phase 2: Build core safety primitives (SafetyBanner, DisabledActionHint, RoleBadge, PreviewOnlyNotice, GovernanceBlockedNotice, PageHeader/SectionHeader, Sidebar/TopBar refactor, MetricCard, DataTable shell, etc.)

**First Screens to Restyle (after primitives)**:
1. /login (public tone setter)
2. /admin/audit-log (highest governance)
3. /admin/master-data/import-preview (AP-10B critical gate)

**Why these three + primitives?**
- Highest user visibility + highest governance risk.
- Existing safety copy and disabled patterns from MC54/MC8/MC17 already present — easy to layer new visuals on top.
- Proves the 10 governance boundaries in the most dangerous places first.
- Low risk of regressing complex business logic (import-preview is already guarded preview-only).

**What MC87 Must NOT Do** (non-negotiable):
- Enable Confirm Import, Export, or any Approve/Reject action.
- Introduce new audit event types.
- Persist data or call backend.
- Modify package.json or add font npm packages (IBM Plex via CSS only).
- Touch deep provider/student detail flows or create new routes.
- Claim any approval or AP gate progress.

**Validation Gates for Every MC87 Commit**:
- Build 42/42, Tokens 4/4, Audit 502/502
- Full 10-boundary governance checklist (from handoff notes)
- Screenshot regression vs the 31 MC68 reference images for the 3 target screens + login
- No src/app/* changes outside the 3 screens + new shared primitives
- Working tree clean, docs-only for planning artifacts

**Effort Estimate**: 2–4 weeks for a small team (mostly presentational + one refactor of Button/StatusBadge).

**Rollback Strategy**: Every phase has explicit per-phase rollback instructions in the handoff phasing plan.

---

## Why Not Start with Everything?

The handoff explicitly warns against "big bang" visual migration. Starting with primitives + the three most critical surfaces allows the team to:
- Prove the new "Soft Civic" personality without breaking existing diagnostic flows.
- Catch any accessibility or governance regression early.
- Build confidence before touching provider/student or public discovery surfaces.

**End of MC87 Recommendation — MC86**

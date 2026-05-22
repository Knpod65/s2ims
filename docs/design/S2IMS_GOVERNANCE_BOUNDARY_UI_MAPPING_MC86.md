# S²IMS Governance Boundary UI Mapping — MC86

**Purpose**: Maps each of the 10 non-negotiable governance boundaries from handoff/governance-boundary-implementation-notes.md to the exact current UI locations and required visual treatment.

**Source**: handoff/governance-boundary-implementation-notes.md + code grep (read-only) + MC54/MC8/MC17 existing safety copy.

---

## 1. AP-10B — Confirm Import Disabled (Import Preview)

**Current Location**: src/app/admin/master-data/import-preview/page.tsx
**Current State**: Has `disabled: true` entries and "Blocked until future governance approval" text in several places.
**Required Visual Treatment (from contract)**:
- Permanent SafetyBanner variant "preview" or "governance" at top: "AP-10B Gate — Preview Only. This preview does not import real data."
- Confirm Import button: disabled + lock icon + immediate DisabledActionHint: "Confirm Import is disabled pending AP-10B governance approval."
- Use --status-preview (magenta-violet) for any preview badges or accents.
**Verification**: Click must be inert; hint visible; banner first element.
**Gap**: No standardized SafetyBanner or DisabledActionHint component yet; copy exists but not enforced uniformly.

---

## 2 & 3. AP-10C Export + AP-11 Approve/Reject Disabled

**Current Locations**: Export buttons in audit-log, staff, provider; Approve/Reject in staff review, ESQ, etc.
**Current State**: Many actions already have disabled states from prior MCs.
**Required**: All such controls must render visibly disabled + lock + specific DisabledActionHint for AP-10C or AP-11.
**Gap**: No reusable DisabledActionHint; hints are ad-hoc or missing.

---

## 4. ESQ = Recommendation Only (Never Approval)

**Current Locations**: /esq/dashboard, /esq/history, /esq/announcements/[id]/review
**Current State**: Existing copy often says "review" or "verify" — needs explicit "Recommendation — not an approval" (bilingual) on every output.
**Required**: SafetyBanner + every label/button text must contain the exact phrase.
**Gap**: Language discipline not yet systematically audited or componentized.

---

## 5. SafetyBanner Permanent on Every Preview/Blocked Route

**Required Routes** (minimum from contract):
- /admin/master-data/import-preview
- /admin/audit-log
- /admin/candidate-review-demo
- /esq/*
- Any future diagnostic route

**Current State**: Many of these routes have safety copy in the body, but no permanent top banner component.
**Gap**: No SafetyBanner component exists.

---

## 6. PII Masked + ★ per Role

**Current**: theme/privacy.ts and display logic in many tables already do tokenization (C-2048, S-2345).
**Required**: Consistent ★ reveal indicator + role-based reveal only on explicit interaction.
**Gap**: Not yet wired to the new RoleBadge or a reusable masking utility in all new components.

---

## 7. Disabled Actions Always Visible (Never Hidden)

**Current**: Most disabled buttons stay in DOM (good).
**Required**: Never remove from DOM; always pair with DisabledActionHint.
**Gap**: Some conditional rendering still hides actions in older code.

---

## 8. --status-preview Reserved for AP-10B Only

**Current**: StatusBadge 'preview' uses purple-100 (same family as secondary brand).
**Required**: Must be the distinct magenta-violet from handoff and used **only** on AP-10B surfaces.
**Gap**: Color collision + no enforcement comment in code.

---

## 9. Evidence-Boundary Banner on /admin/audit-log

**Current**: Has "audit" in title and some copy.
**Required**: Permanent top SafetyBanner variant "evidence": "Evidence Boundary — All records shown are diagnostic or mock. No official audit trail is being written."
**Gap**: No component.

---

## 10. No New Audit Events + Reset Preview = UI-Only

**Current**: MC10–MC54 lineage already enforces diagnosticOnly / no audit write for preview flows.
**Required**: Visual work must not introduce new event names; any "Reset Preview" must not call audit writer.
**Verification**: `npm run check:audit-events` must stay at 502/502 after any visual change.
**Gap**: None in current primitives — must be maintained in MC87.

---

## Enforcement for MC87 Implementers

Before every commit in the visual implementation branch:
- Re-run the 10-boundary checklist from handoff/governance-boundary-implementation-notes.md
- Run full `npm run check:audit-events`
- Compare screenshots against the 31 MC68 references
- Any violation = immediate rollback

**End of Governance Boundary UI Mapping — MC86**

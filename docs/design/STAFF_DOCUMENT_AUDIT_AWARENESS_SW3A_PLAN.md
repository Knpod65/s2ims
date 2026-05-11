# Staff Document Audit Awareness — SW-3A Plan

Date: 2026-05-11
Branch: `design/staff-document-audit-awareness-plan`
Phase: SW-3A planning only. No runtime changes authorized.
Preceding phase: SW-2A (`design/staff-document-action-rail-runtime`, merged `95b73e8`)

---

## 1. Current State

### Audit awareness surfaces after SW-2A

| Location | Component | Strip type | Always visible? | Copy |
|----------|-----------|-----------|-----------------|------|
| Workbench header | `StaffDocumentEvidenceWorkbench` (SW-1) | Page-level amber strip | Yes | "Document decisions should include clear review notes. Audit logging is currently represented in the prototype UI only." |
| DocumentActionRail bottom | `DocumentActionRail` (SW-2A) | Rail-level amber strip | Yes, while rail renders | "Prototype audit awareness — real audit persistence is not yet connected. Document actions should be auditable in production." |
| Rejection flow | `DocumentVerificationPanel` | None | N/A | Not rendered |
| Replacement flow | `DocumentVerificationPanel` | None | N/A | Not rendered |

### AuditWarningCard import status

`AuditWarningCard` is imported at line 7 of `DocumentVerificationPanel.tsx` but is never
rendered anywhere inside the component. This is a confirmed governance gap documented in
`STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md`.

### Reason capture current behavior

**Rejection flow** (inside expanded accordion row, `DocumentVerificationPanel` lines 173–203):
- Label: "Reject Document"
- Inline textarea — placeholder "Please specify reason..."
- Empty/whitespace guard: button disabled if `!rejectReason[doc.id]?.trim()`
- No minimum character length enforced
- No `AuditWarningCard` rendered

**Replacement flow** (inside expanded accordion row, lines 205–231):
- Label: "Request Replacement"
- Inline textarea — placeholder "Please specify what is needed..."
- Empty/whitespace guard: button disabled if `!replacementMsg[doc.id]?.trim()`
- No minimum character length enforced
- No `AuditWarningCard` rendered

### Policy gap

`sensitiveActions.ts` marks both `document_rejection` and `document_replacement_request` as:
- `requiresReason: true`
- `requiresAudit: true`
- `defaultRiskLevel: 'medium'`

`SENSITIVE_ACTION_POLICY_PHASE_2E.md` defines medium-risk minimum reason length as 20 characters.
Neither flow enforces this. This gap predates SW-2A and is tracked separately (SW-3B / SD-3).

---

## 2. Runtime Observation (Do Not Fix in This Phase)

**Observation only — not a blocker for SW-3A audit awareness wiring.**

In `DocumentVerificationPanel.tsx` lines 175–201, the rejection textarea section is gated by:

```tsx
{expandedDoc === doc.id && !rejectReason[doc.id] && (
  <>
    {/* reject label, textarea, button */}
  </>
)}
```

The condition `!rejectReason[doc.id]` is truthy only when the per-doc reason string is
empty or undefined. As soon as the user types a character, `rejectReason[doc.id]` becomes
a non-empty string (truthy), making `!rejectReason[doc.id]` false, which hides the entire
section including the textarea and submit button while the user is still typing.

This is a pre-existing UX defect. The replacement flow does not have this condition and is
not affected.

**SW-3A must not fix this defect.** Fixing it would change `DocumentVerificationPanel`
internals in the same commit as audit awareness wiring, violating the one-behavioral-change-
per-commit rule. The defect should be addressed in a dedicated commit after SW-3A, before
SD-3 (min-length enforcement), since min-length validation requires the form to persist
while the user types.

---

## 3. `AuditWarningCard` `requiresReason` Prop — Prototype Safety Issue

`AuditWarningCard` renders additional copy when `requiresReason={true}`:

```
EN: "This action is logged and auditable"
TH: "การกระทำนี้จะถูกบันทึกไว้และตรวจสอบย้อนหลังได้"
```

This copy implies real audit persistence ("logged") and is **not prototype-safe** per
`STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md`.

**SW-3A must NOT pass `requiresReason` to `AuditWarningCard` for document actions.**
Use only `title` and `message` props with prototype-safe copy (see Section 5).

The `requiresReason` prop is safe for use in surfaces where real audit writes exist
(identity reveal modal, disclosure modals, match override modal). It is not safe for
document rejection and replacement until real audit writes are implemented.

---

## 4. Placement Option Comparison

### Option A — AuditWarningCard inside rejection and replacement action areas

**Description:** Add `AuditWarningCard` above the reject textarea and above the replacement
textarea inside the expanded accordion row in `DocumentVerificationPanel`. Prototype-safe
copy. No `requiresReason` prop.

| Criterion | Assessment |
|-----------|-----------|
| User clarity | High — card appears immediately before the action |
| Governance accuracy | High — framing is scoped to the specific action |
| Risk of implying fake persistence | Low — prototype-safe copy used, no `requiresReason` prop |
| Visual clutter | Low — only visible when the user has expanded a document |
| Mobile impact | Low — card is compact, appears inside accordion |
| Future compatibility | High — card can swap to real-audit copy when writes are implemented |
| Implementation risk | Low — one `<AuditWarningCard>` call per action zone, no logic change |
| Conflict with existing amber strips | Minimal — rail strip removed in same commit to avoid three amber zones |

### Option B — Rail-level amber strip only (no inline card)

**Description:** Keep the SW-2A `DocumentActionRail` amber strip as the primary audit
awareness signal. Add no per-action cards inside `DocumentVerificationPanel`.

| Criterion | Assessment |
|-----------|-----------|
| User clarity | Low — strip is not scoped to a specific action; staff may not associate it with rejection |
| Governance accuracy | Low — a general-awareness strip is not a substitute for action-level framing |
| Risk of implying fake persistence | Low |
| Visual clutter | Low |
| Mobile impact | None (no new element) |
| Future compatibility | Low — does not satisfy the policy requirement for action-level audit framing |
| Implementation risk | None |
| Conflict with existing amber strips | Existing dual-strip issue remains unresolved |

### Option C — Single workbench-level governance strip (remove rail strip, no inline card)

**Description:** Consolidate both existing amber strips into one persistent banner above the
entire evidence section. Do not add per-action cards inside `DocumentVerificationPanel`.

| Criterion | Assessment |
|-----------|-----------|
| User clarity | Medium — visible before any expansion, but not scoped to a specific action |
| Governance accuracy | Low — workbench-level framing does not satisfy action-level audit policy |
| Risk of implying fake persistence | Low |
| Visual clutter | Low (fewer strips than current state) |
| Mobile impact | Neutral |
| Future compatibility | Low — layout-level governance cannot be repurposed for action-specific real-audit wiring |
| Implementation risk | Low |
| Conflict with existing amber strips | Resolves dual-strip, but does not address per-action governance gap |

### Option D — Per-action inline microcopy only (no card, no strip)

**Description:** Replace the amber card with small-text microcopy directly below each
action label ("Rejection decisions are reviewed. Provide a clear reason."). No card component.

| Criterion | Assessment |
|-----------|-----------|
| User clarity | Low — microcopy is easy to overlook; no visual weight to signal governance context |
| Governance accuracy | Medium — words are correct but visual prominence is insufficient |
| Risk of implying fake persistence | Low |
| Visual clutter | Minimal |
| Mobile impact | None |
| Future compatibility | Low — cannot easily be upgraded to a real-audit card without introducing the card later anyway |
| Implementation risk | Low |
| Conflict with existing amber strips | No interaction |

---

## 5. Recommended SW-3A Runtime Scope

**Recommended option: Option A.**

Rationale:
- Satisfies the governance gap: `AuditWarningCard` at action level, scoped to rejection and
  replacement.
- Lowest implementation risk: no behavioral change, no new abstraction, no reason-validation
  change.
- Consistent with existing patterns: identity reveal modal, disclosure modals, and match
  override modal already use `AuditWarningCard` at the action level.
- Prototype-safe: no `requiresReason` prop, no persistence-implying copy.
- Reduces amber fatigue: rail strip removed in same commit → net result is still two amber
  zones (workbench strip + per-action card), down from three.

---

## 6. Exact Proposed Copy

### Rejection zone — `AuditWarningCard`

```tsx
<AuditWarningCard
  title={lang === 'th' ? 'ปฏิเสธเอกสาร' : 'Reject Document'}
  message={lang === 'th'
    ? 'การตัดสินใจปฏิเสธจะถูกตรวจสอบ กรุณาระบุเหตุผลที่ชัดเจนเพื่อการบันทึก'
    : 'Rejection decisions are reviewed. Provide a clear reason for record purposes.'}
/>
```

Do NOT pass `requiresReason` — see Section 3.

### Replacement zone — `AuditWarningCard`

```tsx
<AuditWarningCard
  title={lang === 'th' ? 'ขอส่งแทนเอกสาร' : 'Request Replacement'}
  message={lang === 'th'
    ? 'คำขอส่งแทนจะถูกติดตาม กรุณาอธิบายสิ่งที่ต้องการโดยไม่ใช้ถ้อยคำกล่าวโทษ'
    : 'Replacement requests are tracked. Explain what is needed without blame language.'}
/>
```

Source: `STAFF_AUDIT_AWARENESS_PLACEMENT_GUIDE.md` — prototype-safe approved copy.

---

## 7. Placement Sketch

Inside `DocumentVerificationPanel`, within the expanded accordion row, inside the
`border-t border-line pt-3 space-y-2` actions section:

```
[Expanded accordion row]
  ├─ File info / uploadedAt
  ├─ Rejection reason display (if already rejected, status === 'rejected')
  ├─ Staff note
  └─ [Actions — border-t, pt-3]
       │
       ├─ [Verify button — if applicable]
       │
       ├─ ┌───────────────────────────────────────────┐  ← INSERT: AuditWarningCard
       │   │ 🔶 Reject Document                       │    (above label, above textarea)
       │   │ Rejection decisions are reviewed.        │
       │   │ Provide a clear reason for record        │
       │   │ purposes.                                │
       │   └───────────────────────────────────────────┘
       ├─ <p> Reject Document </p>                        (existing label)
       ├─ <textarea> reason ... </textarea>               (existing textarea)
       └─ [Send Rejection button]
       
       ├─ ┌───────────────────────────────────────────┐  ← INSERT: AuditWarningCard
       │   │ 🔶 Request Replacement                   │    (above label, above textarea)
       │   │ Replacement requests are tracked.        │
       │   │ Explain what is needed without           │
       │   │ blame language.                          │
       │   └───────────────────────────────────────────┘
       ├─ <p> Request Replacement </p>                    (existing label)
       ├─ <textarea> message ... </textarea>              (existing textarea)
       └─ [Send Request button]
```

The `AuditWarningCard` goes above the existing label, not between the label and textarea.
This preserves the visual grouping of label → textarea → button.

---

## 8. Amber Strip Consolidation in SW-3A

See `STAFF_DOCUMENT_AMBER_STRIP_CONSOLIDATION_PLAN.md` for full details.

Summary: Remove the `DocumentActionRail` amber strip in the same SW-3A commit.
Keep the `StaffDocumentEvidenceWorkbench` workbench strip.

Post-SW-3A amber zones:
1. Workbench amber strip (always visible, page-level) — retained
2. Per-action `AuditWarningCard` (visible when accordion expanded) — new in SW-3A

---

## 9. Behavior-Preservation Constraints

SW-3A must not change:

- `onVerify`, `onReject`, `onRequestReplacement` callbacks
- Reason textarea value, onChange, placeholder text
- Submit button disabled condition (`!reason?.trim()`)
- Minimum character length behavior (still absent — deferred to SD-3 / SW-3B)
- `expandedDoc` accordion state management
- `rejectReason`, `replacementMsg` state shapes
- Document status keys or labels
- Mock data
- Routes, auth, role guards
- Backend/API, export, disclosure, provider/student/admin/ESQ workflows
- Identity reveal modal
- Staff notes, application status controls
- Audit trail display

---

## 10. Do-Not-Change List

| Item | Reason |
|------|--------|
| `DocumentVerificationPanel` reason textarea logic | Behavioral change — separate phase |
| Minimum reason length | Behavioral change — SD-3/SW-3B, requires product approval |
| Reject form visibility defect (`!rejectReason[doc.id]`) | Pre-existing bug — separate fix before SD-3 |
| `AuditWarningCard.requiresReason` prop (do not pass) | Copy implies real persistence |
| `sensitiveActions.ts` warningCopy | Config planning, separate refactor |
| `DocumentActionRail` guidance text | No wording change in this phase |
| Student document wording | Permanently separate from staff — see boundary doc |
| `ReasonRequiredModal` | Not introduced in SW-3A |

---

## 11. QA Requirements for Runtime Phase

Visual checks:
- Rejection `AuditWarningCard` appears above rejection label in expanded accordion row
- Replacement `AuditWarningCard` appears above replacement label in expanded accordion row
- Neither card appears for `verified` documents
- Neither card appears for `invalid_file_type` (system state, not staff-initiated)
- `AuditWarningCard` does not appear in the verify action area
- Rail-level amber strip is removed
- Workbench-level amber strip still present
- Existing verify/reject/replacement buttons still functional
- Reason textarea still accepts input and gates submit button
- No duplicate React keys
- No hydration errors

Screenshot targets:
- Desktop rejection flow expanded (app_002 Household Registration)
- Desktop replacement flow expanded (app_002 Guardian Income Proof)
- Mobile 375px both flows
- Thai locale both flows
- State clip: AuditWarningCard in reject zone
- State clip: AuditWarningCard in replacement zone
- State clip: workbench strip visible, rail strip absent

Console checks:
- No runtime errors
- No duplicate key warnings
- No hydration mismatch

Build gates:
- `npm run build` — 40 routes, 0 type errors
- `npm run check:tokens` — 4/4

---

## 12. Recommended Runtime Branch

```
design/staff-document-audit-awareness-runtime
```

Base from: `main` at `f54c14e` (post SW-2A checkpoint).

Commit scope: single commit — audit card wiring + rail strip removal.
Do not combine with min-length enforcement in the same commit.

---

## 13. What Comes After SW-3A

Do not begin these phases automatically.

| Phase | Scope | Prerequisite |
|-------|-------|-------------|
| Pre-SD-3 fix | Fix `!rejectReason[doc.id]` defect so form persists while user types | Standalone commit, approved separately |
| SW-3B / SD-3 | Add 20-char minimum length + character counter to rejection and replacement | Product/stakeholder approval required; pre-SD-3 fix must land first |
| SD-1 | Extract staff document status display adapter | Separate from all behavioral changes |
| Option B modals | `DocumentRejectionModal`, `DocumentReplacementModal` with per-action audit framing | Approved after SD-1 is stable |

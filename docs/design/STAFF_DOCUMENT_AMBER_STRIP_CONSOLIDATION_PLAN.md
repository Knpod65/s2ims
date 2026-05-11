# Staff Document Amber Strip Consolidation Plan

Date: 2026-05-11
Branch: `design/staff-document-audit-awareness-plan`
Status: Planning only. No runtime changes authorized.

---

## 1. Current State After SW-2A

The staff application detail page (`/staff/applications/[id]`) has two amber strips
after the SW-2A merge (`95b73e8`).

### Strip 1 — Workbench-level (SW-1)

**Component:** `StaffDocumentEvidenceWorkbench.tsx` lines 82–96
**Scope:** Page-level. Always visible regardless of document state or accordion expand.
**Location:** Between the workbench header card and the main evidence/review grid.
**Visibility:** All staff on any application detail page that uses the workbench.

**Copy (EN):**
> "Document decisions should include clear review notes. Audit logging is currently represented in the prototype UI only."

**Copy (TH):**
> "การตัดสินใจเกี่ยวกับเอกสารควรมีหมายเหตุการตรวจสอบที่ชัดเจน ขณะนี้ audit logging แสดงเป็นบริบทใน UI ต้นแบบเท่านั้น"

**Risk level:** Safe — explicitly says audit logging is prototype-only.
**Purpose:** General governance reminder before staff begin any document review.

---

### Strip 2 — DocumentActionRail-level (SW-2A)

**Component:** `DocumentActionRail.tsx` lines 128–136
**Scope:** Rail-level. Always visible when `DocumentActionRail` renders (which is always, via `actionRail` prop in `StaffDocumentEvidenceWorkbench`).
**Location:** Bottom of the `DocumentActionRail` card, above `DocumentVerificationPanel`.
**Visibility:** All staff on any application with documents.

**Copy (EN):**
> "Prototype audit awareness — real audit persistence is not yet connected. Document actions should be auditable in production."

**Copy (TH):**
> "บริบท audit ต้นแบบ — การบันทึก audit จริงยังไม่ได้เชื่อมต่อ การดำเนินการเอกสารควรสามารถตรวจสอบได้ในระบบจริง"

**Risk level:** Safe copy, but strip adds amber fatigue.
**Purpose:** Per-rail reminder that document action outcomes are not yet persisted.

---

## 2. Amber Fatigue Analysis

### Desktop layout (after SW-2A, before SW-3A)

```
[Workbench header card]
     ↓
[🔶 Amber strip — SW-1, always visible]               ← Strip 1
     ↓
[Evidence + Review context grid]
  ↓
  [Document evidence card]
    ↓
    [DocumentActionRail]
      ...count chips...
      ...per-doc guidance rows...
      [🔶 Rail amber strip — SW-2A, always visible]   ← Strip 2
    ↓
    [DocumentVerificationPanel accordion]
      [Accordion rows — collapsed]
```

Both amber strips are visible simultaneously before the user expands any document.
On desktop, the two strips appear within 600–900px of each other on a 1440px-wide
layout (the rail sits inside the evidence card, below the workbench header).

**Impact:** Moderate amber fatigue on desktop. Staff reading the page see two amber
zones before doing anything.

### Mobile layout (375px, after SW-2A, before SW-3A)

On mobile, the evidence section is full-width and stacked. The two amber strips appear
even closer together — potentially within the same viewport, stacked vertically inside
a card that already has amber border styling (`border-amber-200` on expanded accordion rows).

**Impact:** Higher amber fatigue on mobile. Three amber signals within one scroll unit
(workbench strip → rail strip → expanded accordion border) creates visual noise.

---

## 3. What SW-3A Will Add

If Option A is implemented per `STAFF_DOCUMENT_AUDIT_AWARENESS_SW3A_PLAN.md`, SW-3A
adds:

- `AuditWarningCard` above the rejection textarea (visible when rejection accordion expanded)
- `AuditWarningCard` above the replacement textarea (visible when replacement accordion expanded)

Without consolidation, post-SW-3A amber zones would be:
1. Workbench strip (always visible)
2. Rail strip (always visible)
3. Rejection `AuditWarningCard` (visible when expanded)
4. Replacement `AuditWarningCard` (visible when expanded)

On desktop, a staff member expanding a rejection document would see three amber elements
simultaneously — workbench strip, rail strip, and `AuditWarningCard`. On mobile, all three
could appear within one viewport scroll. This is amber fatigue that degrades the signal
value of each card.

---

## 4. Recommendation

### Remove the rail-level amber strip in SW-3A

Remove the amber strip from `DocumentActionRail.tsx` (lines 128–136, the `<div>` that
renders the AlertTriangle + prototype audit awareness text at the bottom of the rail card).

**Justification:**
- The per-action `AuditWarningCard` added in SW-3A provides more targeted governance
  framing — at the specific moment of action, not always-visible.
- The workbench-level strip (SW-1) already covers the page-level prototype awareness
  ("Audit logging is currently represented in the prototype UI only.").
- With the rail strip removed, the workbench strip provides always-visible context
  and the per-action card provides action-scoped context. Two amber zones total.
- The `DocumentActionRail` quick-count chips and per-doc guidance rows remain. Only the
  amber text strip at the bottom is removed.

### Keep the workbench-level strip (SW-1) unchanged

The workbench strip in `StaffDocumentEvidenceWorkbench.tsx` should not be modified in
SW-3A. It provides general governance framing for the entire evidence review session,
independent of which document is expanded.

**Do not change:**
- Copy
- Styling (amber background, border, icon)
- Position (between workbench header and main grid)

---

## 5. Post-SW-3A Amber Zone Map

```
[Workbench header card]
     ↓
[🔶 Amber strip — SW-1, always visible]              ← RETAINED (unchanged)
     ↓
[Evidence + Review context grid]
  ↓
  [Document evidence card]
    ↓
    [DocumentActionRail]
      ...count chips...
      ...per-doc guidance rows...
      [amber strip REMOVED in SW-3A]                 ← REMOVED
    ↓
    [DocumentVerificationPanel accordion]
      [Accordion rows — collapsed]
      
      [When rejection row expanded:]
        ┌────────────────────────────────────────┐
        │ 🔶 Reject Document                     │  ← ADDED in SW-3A
        │ Rejection decisions are reviewed...    │
        └────────────────────────────────────────┘
        [Reject label]
        [Reason textarea]
        [Send Rejection button]
      
      [When replacement row expanded:]
        ┌────────────────────────────────────────┐
        │ 🔶 Request Replacement                 │  ← ADDED in SW-3A
        │ Replacement requests are tracked...    │
        └────────────────────────────────────────┘
        [Replacement label]
        [Message textarea]
        [Send Request button]
```

Amber zones summary post-SW-3A:
- **Always visible:** 1 strip (workbench)
- **Conditional (action-scoped):** 1 card per expanded action (rejection or replacement)
- **Total visible simultaneously:** max 2 (workbench + one per-action card)

This is the minimum reasonable amber presence for governance framing in a prototype that
has two sensitive document actions.

---

## 6. Mobile-Specific Notes

### Current mobile issue (pre-SW-3A)

At 375px, the two always-visible amber strips (workbench + rail) appear within the first
few hundred pixels of the staff application detail page. Staff scanning on mobile encounter
amber before seeing any document content.

### Post-SW-3A mobile behavior

- Workbench strip: visible on initial load (above the fold or near it depending on phone)
- Rail strip: removed — eliminates one always-visible amber element
- Per-action cards: only visible when a document row is expanded, which requires intentional
  user interaction on mobile (tap to expand)

Mobile result: one always-visible amber zone instead of two. Significantly reduced clutter.

### Mobile QA requirement for SW-3A runtime

- Confirm workbench strip still renders correctly at 375px
- Confirm rail strip is absent
- Confirm `AuditWarningCard` renders correctly when rejection/replacement row is expanded
- Confirm no overflow or horizontal scroll caused by the `AuditWarningCard` inside accordion

---

## 7. Do-Not-Change List for Strip Consolidation

| Item | Decision |
|------|----------|
| Workbench strip copy | Do not change |
| Workbench strip styling | Do not change |
| Workbench strip position | Do not change |
| Rail quick-count chips | Do not change |
| Rail per-doc guidance rows | Do not change |
| Rail header ("Document action status") | Do not change |
| Rail sub-line ("Expand each item in the panel below to take action") | Do not change |
| `DocumentVerificationPanel` border-amber styling on expanded rows | Do not change (pre-existing) |

Only remove: the `<div>` containing AlertTriangle + audit awareness text at the bottom of
`DocumentActionRail.tsx` (the section bordered by `pt-2 border-t border-line`).

---

## 8. Future Strip Management

### When real audit writes are implemented

When `onReject` and `onRequestReplacement` are wired to real API calls that persist audit
events:

1. Update the workbench-level strip copy to reflect real persistence:
   - Remove "currently represented in the prototype UI only."
   - Replace with: "Document decisions are audit logged. Include a clear reason before submitting."

2. Update `AuditWarningCard` message to production-safe copy:
   - EN: "This rejection will be recorded in the audit trail. Provide a clear reason."
   - TH: "การปฏิเสธนี้จะถูกบันทึกในประวัติ audit กรุณาระบุเหตุผลที่ชัดเจน"
   - Consider adding `requiresReason` prop if the prop copy is also updated to production-safe phrasing.

3. Do not reintroduce the rail amber strip. The workbench strip + per-action card is
   sufficient and avoids re-creating the amber fatigue problem.

### SD-1 and beyond

If `DocumentActionRail` is eventually removed or restructured as part of SD-1 (staff
display adapter extraction), re-evaluate amber zone count at that time.

Current policy: one always-visible strip (workbench) + per-action card. Do not
add more strips without reviewing the total amber zone count.

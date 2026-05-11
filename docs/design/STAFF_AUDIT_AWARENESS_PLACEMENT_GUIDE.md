# Staff Audit Awareness Placement Guide

Date: 2026-05-11
Branch: `design/staff-document-action-rail-plan`
Status: Planning only. No runtime changes authorized.

## Purpose

This document defines where audit awareness should appear in the staff document review UI,
what copy is safe for a prototype context, and what must not be implied before real audit
persistence exists.

---

## Current State

### Where AuditWarningCard currently appears

| Surface | Renders AuditWarningCard | Copy |
|---------|------------------------|------|
| Identity reveal modal (in applications/[id]/page.tsx) | Yes | "This reveal will be logged in the audit trail and cannot be undone." |
| `DisclosureApprovalModal` | Yes | "This decision is logged and irreversible." |
| `DisclosureRejectionModal` | Yes | "This rejection will be logged in the audit trail." |
| `MatchOverrideModal` | Yes | "This override will be logged in the audit trail." |
| `DocumentVerificationPanel` rejection | No (imported but not rendered) | — |
| `DocumentVerificationPanel` replacement | No (imported but not rendered) | — |
| `StaffDocumentEvidenceWorkbench` | Prototype strip | "Audit logging is currently represented in the prototype UI only." |

### Where AuditWarningCard should appear but does not

- Rejection flow inside `DocumentVerificationPanel`.
- Replacement request flow inside `DocumentVerificationPanel`.

This gap is documented in `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md`.

---

## Prototype-Safe Audit Copy Rules

The system is currently mock/prototype-only. No real audit event is written when staff
reject or request replacement for a document. This means audit copy must be honest about
its scope.

### Safe copy for prototype context

For document rejection and replacement until real audit writes exist:

EN: "Rejection decisions are reviewed. Provide a clear reason for record purposes."
TH: "การตัดสินใจปฏิเสธจะถูกตรวจสอบ กรุณาระบุเหตุผลที่ชัดเจนเพื่อการบันทึก"

EN: "Replacement requests are tracked. Explain what is needed without blame language."
TH: "คำขอส่งแทนจะถูกติดตาม กรุณาอธิบายสิ่งที่ต้องการโดยไม่ใช้ถ้อยคำกล่าวโทษ"

### Copy that must NOT be used until real writes exist

Do not use:
- "This action will be logged in the audit trail."
- "This rejection cannot be undone."
- "Permanently recorded."
- Any copy that implies irreversibility or real persistence.

The `StaffDocumentEvidenceWorkbench` prototype strip already uses:
> "Audit logging is currently represented in the prototype UI only."

This pattern is correct and should be repeated for inline document actions until real writes exist.

---

## Option A — AuditWarningCard Inside DocumentVerificationPanel (Before Modals)

### Description

Add `AuditWarningCard` above the rejection textarea and above the replacement textarea
inside `DocumentVerificationPanel`, within the expanded row section.

Use prototype-safe copy (no persistence implied).

### Pros

- Keeps audit awareness close to the action without restructuring the component.
- Low blast radius: visual change only.
- No reason validation change required.
- Follows Phase SD-2 recommendation from `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md`.

### Cons

- Card appears inside an accordion — only visible when expanded.
- Does not elevate audit framing to a level that staff see before clicking to expand.
- Hardcoded amber hex colors in `AuditWarningCard` (`#FFFBEB / #FDE68A / #78350F`) are
  a DRY debt item (see `DRY_SYSTEM_AUDIT.md` category C).

### UX Impact

Low. Adds amber card inside the expanded document row.

### Governance Risk

Low if prototype-safe copy is used.

### Implementation Risk

Low. One import call per action zone.

---

## Option B — AuditWarningCard in Per-Action Modals (After SW-2A)

### Description

After SW-2A (DocumentActionRail) is stable, introduce per-action modals
(`DocumentRejectionModal`, `DocumentReplacementModal`) that include `AuditWarningCard`
with prototype-safe copy.

### Pros

- `AuditWarningCard` is prominent at the modal level — staff cannot miss it.
- Governance framing is visible before staff confirms.
- Consistent with `DisclosureRejectionModal` and `MatchOverrideModal` patterns.

### Cons

- Requires modals to exist first.
- Larger change.

### UX Impact

Medium. Governance is more visible but requires a modal step.

### Governance Risk

Low. Modal makes the governance requirement explicit.

---

## Option C — Workbench-Level Awareness Banner (No Modal, No Inline Change)

### Description

Keep the existing `StaffDocumentEvidenceWorkbench` prototype audit strip as is.
Add a second, persistent, document-action-specific banner above the `DocumentVerificationPanel`
within the evidence section. This banner warns staff before they expand any document.

Uses prototype-safe copy.

### Pros

- Visible before any expansion.
- No component changes required.
- Can be implemented as a prop or hardcoded into the workbench layout.

### Cons

- Banner fatigue if always visible.
- Does not appear close to the actual action buttons.
- Docs not fulfill the policy requirement for AuditWarningCard at the action level.

---

## Recommended Choice

**Option A first (Phase SD-2), then Option B when per-action modals are introduced.**

Rationale:
- Option A is the minimal safe step: visible near the action, prototype-safe copy, low risk.
- Option B is the right long-term pattern, consistent with existing governance modals.
- Option C should not replace per-action audit awareness — banners at layout level are
  not a substitute for action-level governance framing.

---

## AuditWarningCard Props Contract for Document Actions

When wired for rejection (Option A — prototype safe):

```tsx
<AuditWarningCard
  title={lang === 'th' ? 'ปฏิเสธเอกสาร' : 'Reject Document'}
  message={lang === 'th'
    ? 'การตัดสินใจปฏิเสธจะถูกตรวจสอบ กรุณาระบุเหตุผลที่ชัดเจนเพื่อการบันทึก'
    : 'Rejection decisions are reviewed. Provide a clear reason for record purposes.'}
  requiresReason
/>
```

When wired for replacement (Option A — prototype safe):

```tsx
<AuditWarningCard
  title={lang === 'th' ? 'ขอส่งแทนเอกสาร' : 'Request Replacement'}
  message={lang === 'th'
    ? 'คำขอส่งแทนจะถูกติดตาม กรุณาอธิบายสิ่งที่ต้องการโดยไม่ใช้ถ้อยคำกล่าวโทษ'
    : 'Replacement requests are tracked. Explain what is needed without blame language.'}
  requiresReason
/>
```

Do not use this copy: "This action is logged in the audit trail" — it implies persistence.

---

## What Not To Do

- Do not wire `AuditWarningCard` with copy that claims a real audit event has occurred.
- Do not skip the prototype-safe copy rule until a real audit write is implemented.
- Do not add `AuditWarningCard` and minimum-length enforcement in the same commit.
- Do not render `AuditWarningCard` for `invalid_file_type` — that is a system/validation
  state, not a staff-initiated governance action.
- Do not render `AuditWarningCard` for `verified` — verification does not require a reason
  per `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md`.
- Do not reuse `AdminAuditWarningCard` on staff surfaces — that component is for admin-scoped
  governance framing. See `DRY_SYSTEM_AUDIT.md` category C.

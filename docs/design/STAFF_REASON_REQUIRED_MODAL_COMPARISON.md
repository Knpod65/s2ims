# Staff Reason Required Modal Comparison

Date: 2026-05-11
Branch: `design/staff-document-action-rail-plan`
Status: Planning only. No runtime changes authorized.

## Purpose

This document compares the current inline reason approach in `DocumentVerificationPanel`
against a shared `ReasonRequiredModal` primitive and per-action dedicated modals. It helps
decide when and whether to introduce a shared modal for document governance actions.

---

## Current State

### Reason capture in DocumentVerificationPanel

Rejection:
- Inline textarea below the "Reject Document" label inside the expanded accordion row.
- Disabled if empty or whitespace-only.
- No minimum character length enforced.
- No `AuditWarningCard` shown.
- Placeholder: "Please specify reason..." / "กรุณาระบุเหตุผล..."
- Submit button: "Send Rejection"

Replacement:
- Inline textarea below the "Request Replacement" label.
- Same empty/whitespace guard.
- No minimum length.
- No `AuditWarningCard`.
- Placeholder: "Please specify what is needed..." / "กรุณาระบุข้อมูลที่ต้องการ..."
- Submit button: "Send Request"

### Reason capture in other modals (for comparison)

| Component | Min length | AuditWarningCard | Enforcement |
|-----------|-----------|-----------------|-------------|
| `DocumentVerificationPanel` rejection | None (whitespace only) | Not rendered | Button disabled if empty |
| `DocumentVerificationPanel` replacement | None (whitespace only) | Not rendered | Button disabled if empty |
| `DisclosureRejectionModal` | 15 characters | Yes | Button disabled if < 15 |
| `MatchOverrideModal` | 20 characters | Yes | Button disabled if < 20 |
| `ShortlistRequestModal` | 10 characters | No (`AuditWarningCard` not used) | Button disabled if < 10 |

Policy expectation from `SENSITIVE_ACTION_POLICY_PHASE_2E.md`:
- `document_rejection`: min 20 characters.
- `document_replacement_request`: min 20 characters.

Current implementation does not enforce this policy.

---

## Option A — Keep Inline, Add Minimum Length (Recommended for Next Phase)

### Description

Keep the existing inline textarea pattern inside `DocumentVerificationPanel`. Add:
- A 20-character minimum validation matching the policy.
- A character counter display below the textarea.
- An `AuditWarningCard` above the textarea zone (in Phase SD-3 / SW-3A as separate commits).

### Pros

- Minimal blast radius.
- No new component required.
- Consistent with the existing `RoleAssignmentPanel` character counter pattern.
- Does not require product decision on whether to use a modal.
- Can be done in small increments: AuditWarningCard first, then min-length second.

### Cons

- Does not normalize the modal governance pattern across the codebase.
- Reason and audit warning remain buried inside an accordion row.
- Hard to make visible at a glance — staff may miss audit context.

### UX Impact

Low. Adds a character counter. Slightly more friction on rejection.

### Governance Risk

Low. Enforces existing policy without changing the interaction model.

### Implementation Risk

Low. Two-line validation change. One component.

---

## Option B — Per-Action Dedicated Modals

### Description

Create separate modals for each document action:
- `DocumentRejectionModal` — own reason capture, AuditWarningCard, 20-char minimum.
- `DocumentReplacementModal` — own message capture, AuditWarningCard, 20-char minimum.

Each modal is opened by the inline button click. The inline textarea is removed.

### Pros

- Consistent with `DisclosureRejectionModal` and `MatchOverrideModal` patterns.
- `AuditWarningCard` is prominent at modal level.
- Reason minimum length enforced per action.
- Easier to audit: modal shows governance framing explicitly before staff confirms.

### Cons

- Two new modal components.
- Requires `DocumentVerificationPanel` to open modals — new prop or internal state change.
- Changes the interaction model for staff (inline → modal).
- Requires product approval before changing the interaction model.

### UX Impact

Medium. Staff must confirm rejection in a separate modal step. Higher friction but clearer governance.

### Governance Risk

Low once implemented. Modal makes governance requirements explicit.

### Implementation Risk

Medium. New components follow an established pattern but require integration with the panel.

---

## Option C — Shared ReasonRequiredModal Primitive

### Description

Build a single `src/components/ui/ReasonRequiredModal.tsx` that accepts:
- `action: SensitiveActionKey`
- `title: string`
- `auditWarningMessage: string`
- `onConfirm: (reason: string) => void`
- `onClose: () => void`

All governance actions (document rejection, replacement, match override, disclosure rejection)
reuse this modal with action-specific configuration.

### Pros

- Single source of truth for reason capture governance.
- Config-driven: `SENSITIVE_ACTION_CONFIG` already has `warningCopy` for each action.
- Eliminates duplicate modal shell across 4+ components.

### Cons

- High coupling: one modal serves multiple governance paths.
- Any prop mismatch or conditional branch could accidentally apply the wrong governance to an action.
- Requires all existing modal consumers to be refactored before the primitive is stable.
- `DO_NOT_DRY_YET.md` item 9: disclosure approval vs rejection flows must stay separate.
  A shared modal that is too generic could accidentally merge these.
- Requires policy approval for the shared primitive design.

### UX Impact

Low — UI looks the same. High governance risk if poorly scoped.

### Governance Risk

High during transition. If the primitive is introduced before all consumers are migrated,
multiple parallel reason patterns exist during the migration window.

### Implementation Risk

High. Shared governance primitive requires careful design, testing, and policy sign-off
before any consumer is wired.

---

## Recommended Choice

**Option A first, then Option B if product approves.**

Rationale:
- `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md` Phase SD-3 calls for min-length enforcement as a
  separate behavioral phase after the display adapter is extracted.
- The display adapter (Phase SD-1) is not yet extracted.
- Adding min-length inline is the safest behavioral change: one component, no new abstraction.
- Per-action modals (Option B) are the right next governance step, but they depend on
  SD-1 (staff display adapter) being stable and product approval of the interaction model change.
- Option C (shared primitive) should not be attempted until all per-action modals are
  working independently and the policy for a shared primitive is approved.

---

## What Not To Do

- Do not implement Option C without per-action modals working first.
- Do not combine AuditWarningCard wiring and min-length enforcement in a single commit.
- Do not reuse student document helpers inside document governance modals.
- Do not skip the display adapter extraction (SD-1) before adding min-length enforcement.
- Do not claim a shared `ReasonRequiredModal` is safe until `DO_NOT_DRY_YET.md` items
  9 and 10 are resolved.
- Do not add `isSubmitting` spinner behavior to document actions until real API writes exist.

---

## Parallel Min-Length Inconsistency Summary

This is a governance gap. Until aligned:

| Action | Current min | Policy expectation |
|--------|------------|-------------------|
| Document rejection | None | 20 |
| Document replacement | None | 20 |
| Disclosure rejection | 15 | 20 (per 2E policy) |
| Match override | 20 | 20 ✓ |
| Shortlist request | 10 | 20 (per 2E policy) |

Resolution requires product/stakeholder sign-off on uniform minimums before any change.
See `DRY_REFACTOR_ROADMAP.md` DRY-5A.

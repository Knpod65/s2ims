# Staff Document Action Rail Optimization Plan

Date: 2026-05-11
Branch: `design/staff-document-action-rail-plan`
Status: Planning only. No runtime changes authorized.

## Purpose

This document compares three options for separating the Verify / Reject / Request Replacement
actions from `DocumentVerificationPanel` after SW-1. It recommends the safest sequence for
the next runtime phase.

---

## Current State After SW-1

`DocumentVerificationPanel` is a single accordion component. Each document row expands to
show status, metadata, and inline action controls. Actions (verify, reject, replace) are
embedded inside the expanded row along with their reason textareas.

`StaffDocumentEvidenceWorkbench` wraps the panel as a layout shell only. It does not own
any action logic.

Behavior preserved from before SW-1:
- Action availability depends on current document status.
- Reason textarea is shown inline after expand.
- Reject and replace buttons are disabled when reason/message is empty.
- No minimum length is enforced.
- No `AuditWarningCard` is rendered inside the panel.
- All three callbacks (`onVerify`, `onReject`, `onRequestReplacement`) are mock-only toasts.

---

## Option A — Extract a DocumentActionRail Shell (Recommended)

### Description

Create `src/components/staff/DocumentActionRail.tsx` as a layout-only wrapper that:
- Receives the same three callback props from its parent.
- Receives the current document status to compute button availability.
- Renders the three action zones (verify zone, reject zone, replace zone) as named slots.
- Does not own reason state, reason validation, or audit warning rendering.
- Passes callbacks through unchanged.

`DocumentVerificationPanel` continues to render the inline reason fields and existing
button logic inside the expanded panel. The rail is additive — it does not replace the
panel's existing inline actions; it provides an alternative surface for primary quick actions
at the top of each expanded row.

### Pros

- Minimal blast radius: no action logic moves.
- No reason validation changes.
- No `AuditWarningCard` wiring required.
- Callbacks remain identical.
- Can be added as an `actionRail` slot inside the expanded section of each document row.
- Rollback: remove the rail render; panel behavior unchanged.
- Does not require staff label decisions from `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md`.

### Cons

- Two surfaces show the same actions (rail + existing inline) unless the inline is hidden.
- If inline is hidden, careful testing required to confirm no regression in button availability.
- Does not resolve reason validation gap or AuditWarningCard gap.

### UX Impact

Low. Adds a clearer action zone near the top of the expanded row, reducing scroll.
Does not change what actions are available or when.

### Governance Risk

Low. No reason capture changes. No audit copy changes.

### Implementation Risk

Low. New component only. `DocumentVerificationPanel` unchanged.

### What Not To Do

- Do not move reason textarea into the rail in this phase.
- Do not wire `AuditWarningCard` into the rail in this phase.
- Do not change button availability logic in this phase.
- Do not extract status label display to config in the same change.

### Safest Sequence

1. Create `DocumentActionRail` with three callback props and a status prop.
2. Render it inside the expanded section of `DocumentVerificationPanel`, above the
   existing inline action zone.
3. Confirm the same buttons appear in both rail and inline — no regression.
4. In a follow-up phase, hide the inline buttons if the rail is confirmed stable.
5. Build and visual QA before merge.

---

## Option B — Lift Actions Out of DocumentVerificationPanel Into the Workbench

### Description

Move the action buttons and reason textareas from inside `DocumentVerificationPanel` up into
`StaffDocumentEvidenceWorkbench`. The panel becomes a read-only status display list.
The workbench owns a separate action panel that shows the selected document's action state.

### Pros

- Cleaner separation: panel shows status, workbench owns actions.
- Opens the door for a proper `ReasonRequiredModal` pattern without patching the panel.
- Allows `AuditWarningCard` to appear at the workbench level without touching the panel.

### Cons

- Larger refactor: action state management moves to the workbench.
- The panel's current expand/collapse mechanism is coupled to the action zone.
- Requires tracking selected document ID in the workbench, which is new state.
- Risk of visual regression if any document selection state is not preserved.
- Requires careful audit of all status/action combinations to verify correctness.
- Much higher blast radius than Option A.

### UX Impact

Medium. Staff workflow changes: click document → separate action panel activates.
This may or may not be the desired UX — it needs product review.

### Governance Risk

Medium. More code moves near the reason capture surface.

### Implementation Risk

High for this phase. Not recommended until Option A has been validated and approved.

### What Not To Do

- Do not attempt Option B as the first SW-2 step.
- Do not couple action state to workbench layout state.

---

## Option C — Leave Actions In Panel, Add Per-Action Modal Wrappers

### Description

Keep actions inside `DocumentVerificationPanel` inline as they are. For rejection and
replacement, open a separate modal (e.g. `DocumentRejectionModal`, `DocumentReplacementModal`)
instead of the inline textarea. The modal handles reason capture, minimum length, and
`AuditWarningCard`.

### Pros

- Clean governance boundary: modal owns reason + audit framing.
- Consistent with `DisclosureRejectionModal` and `MatchOverrideModal` patterns.
- Does not require changes to the panel's button availability logic.
- Reason minimum length can be introduced in the modal without touching the panel.

### Cons

- New modal components required.
- Panel still needs to open the modal — some coupling remains.
- Two governance paths (modal vs. inline) during transition.
- Requires product decision on whether verify should also have a modal or stay inline.

### UX Impact

Medium. Rejection and replacement become modal flows, matching disclosure and override patterns.
May feel more consistent, but changes the interaction model for document review.

### Governance Risk

Low once modal is implemented. AuditWarningCard and reason policy are encapsulated.

### Implementation Risk

Medium. Modals are new components but follow an established pattern.

### What Not To Do

- Do not introduce modals without `AuditWarningCard` — the point of a modal is the governance framing.
- Do not share the modal with `DocumentVerificationPanel` and `DisclosureRejectionModal` before
  the `ReasonRequiredModal` primitive is approved (see `STAFF_REASON_REQUIRED_MODAL_COMPARISON.md`).

---

## Recommended Choice

**Option A first.**

Rationale:
- SW-1 is confirmed stable. The next phase should be minimal.
- Option A adds layout clarity without touching any action logic, reason capture, or validation.
- It is the most reversible option.
- Option B and C both require product/governance decisions that are not yet approved:
  - Option B requires a selected-document-in-workbench UX decision.
  - Option C requires the `ReasonRequiredModal` primitive to be approved first.
- Option A can be followed by Option C (modal extraction) once Option A is stable.

---

## Recommended Runtime Sequence After SW-1

| Phase | Name | Scope | Risk |
|-------|------|-------|------|
| SW-2A | DocumentActionRail shell | Layout only, same callbacks, same availability | Low |
| SW-2B | Visual QA and confirm availability regression-free | No code | — |
| SW-3A | Add AuditWarningCard to rejection and replacement zones | Visual only, no behavior change | Low–Medium |
| SW-3B | Add 20-char minimum to rejection reason and replacement message | Behavior change — requires approval | Medium |
| SW-4 | DocumentRejectionModal / DocumentReplacementModal | New modal with reason + audit framing | Medium |
| SW-5 | ReasonRequiredModal shared primitive | Shared governance — requires policy approval | Medium |

Do not skip phases. Do not combine SW-2A and SW-3A in the same commit.

---

## What Not To Do

- Do not touch `DocumentVerificationPanel` internals in SW-2A.
- Do not change reason validation behavior in SW-2A.
- Do not wire `AuditWarningCard` into the panel in SW-2A.
- Do not migrate staff status labels to config in the same phase.
- Do not use student display helpers inside the staff action rail.
- Do not combine action layout change with audit warning wiring in the same commit.
- Do not skip visual QA between phases.

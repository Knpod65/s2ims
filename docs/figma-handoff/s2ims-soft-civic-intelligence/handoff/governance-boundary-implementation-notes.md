# S²IMS Governance Boundary Implementation Notes — Soft Civic Intelligence Handoff

**Purpose**: Explicit, enforceable rules that every visual implementation must satisfy. These are non-negotiable.

**Location**: docs/figma-handoff/s2ims-soft-civic-intelligence/handoff/governance-boundary-implementation-notes.md

**Rule**: If any of these ten boundaries are violated during implementation, the work fails review and must be rolled back.

---

## 1. AP-10B — Confirm Import Disabled (Import Preview Route)

**Route / Component**: `/admin/master-data/import-preview` — Confirm Import button / action

**Required Visual Behavior**:
- Button must render in disabled visual state (gray, lock icon, `--status-blocked` or `--status-preview` tint)
- Immediate sibling or tooltip must contain `DisabledActionHint` with message: "Confirm Import is disabled pending AP-10B governance approval. This preview does not import data."
- SafetyBanner at top of page must explicitly state "AP-10B Gate — Preview Only"

**Verification Step**:
- Navigate to the route
- Attempt to trigger the action (click, keyboard, etc.)
- Confirm the action is inert and the hint is visible
- Screenshot must match the handoff reference (magenta-violet preview accent + lock)

**Failure Condition**:
- Action becomes clickable or hint is missing → immediate rollback + security notification

---

## 2. AP-10C — Export Disabled

**Route / Component**: Any Export button (admin, staff, provider contexts)

**Required Visual Behavior**:
- Export control rendered disabled with lock icon
- `DisabledActionHint`: "Export is disabled pending AP-10C governance approval."

**Verification Step**:
- Locate every export control in the application
- Confirm all are disabled + hint present

**Failure Condition**:
- Any export control becomes functional or hint is absent

---

## 3. AP-11 — Approve / Reject Disabled

**Route / Component**: Any Approve, Reject, or official decision action (staff, admin, ESQ contexts)

**Required Visual Behavior**:
- Controls disabled, lock icon, `DisabledActionHint`: "Approve / Reject actions are disabled pending AP-11 governance approval. Current actions are diagnostic only."

**Verification Step**:
- Audit every route that previously contained decision actions
- Confirm all decision controls are disabled + hint visible

**Failure Condition**:
- Any decision control becomes active

---

## 4. ESQ Outputs Are Recommendations, Never Approvals

**Route / Component**: All ESQ routes (`/esq/dashboard`, `/esq/history`, `/esq/announcements/[id]/review`)

**Required Visual Behavior**:
- Every output label, button text, and banner must contain the exact phrase "Recommendation — not an approval" (bilingual)
- No UI element may use the word "Approve", "Approved", "Approval", or similar

**Verification Step**:
- Full text audit of all ESQ screens (including dynamic content)
- Screenshot evidence of correct wording

**Failure Condition**:
- Any approval language appears in ESQ surfaces

---

## 5. SafetyBanner Is Permanent on Every Preview / Blocked Route

**Routes Affected** (minimum):
- `/admin/master-data/import-preview`
- `/admin/audit-log`
- `/admin/candidate-review-demo`
- `/esq/*`
- Any future diagnostic or preview route

**Required Visual Behavior**:
- SafetyBanner is the first content element below the TopBar
- Banner uses the correct variant (`preview`, `blocked`, `evidence`, `governance`)
- Banner is non-dismissible

**Verification Step**:
- Every listed route must show the banner on first load
- Banner must not be removable by user action

**Failure Condition**:
- Banner is missing, dismissible, or placed after other content

---

## 6. PII Masked Per Viewer Role with ★ Indicator

**Routes / Components**:
- All tables and detail views that could surface student or staff identity

**Required Visual Behavior**:
- Raw PII is never shown by default
- Masked values display with ★ (e.g., "S-****2345 ★")
- Role-based reveal is only available to authorized roles via explicit interaction (never automatic)

**Verification Step**:
- As each role, view every screen that could contain PII
- Confirm masking + ★ indicator

**Failure Condition**:
- Any raw PII leaks to an unauthorized viewer role

---

## 7. Disabled Actions Are Always Visible, Never Hidden

**Rule**:
- No disabled governance action may be removed from the DOM or visually hidden
- The control must remain in the layout with disabled styling + `DisabledActionHint`

**Verification Step**:
- Audit every previously interactive control that is now governance-blocked
- Confirm the control is still rendered and the hint explains why

**Failure Condition**:
- Any disabled action is hidden from the UI

---

## 8. --preview Color Reserved Exclusively for AP-10B Contexts

**Color**: `#6B3B8C` (magenta-violet) + light tint

**Rule**:
- This color must only be used for AP-10B preview states, PreviewOnlyNotice, preview badges, and related AP-10B surfaces
- It must never be used for warning, error, success, or general info

**Verification Step**:
- Global search for the preview color token in the implementation
- Confirm usage is limited to the approved contexts

**Failure Condition**:
- Preview color appears on a non-AP-10B surface

---

## 9. Evidence-Boundary Banner on /admin/audit-log

**Route**: `/admin/audit-log`

**Required Visual Behavior**:
- Permanent `SafetyBanner` variant "evidence" at the very top
- Text: "Evidence Boundary — All records shown are diagnostic or mock. No official audit trail is being written."

**Verification Step**:
- Load the audit log as each authorized role
- Confirm banner is present and correct

**Failure Condition**:
- Banner missing or wording incorrect

---

## 10. No New Audit Event Types + Reset Preview Is UI-Only

**Rule**:
- Visual implementation work must not introduce any new audit event names or write any audit events
- If a "Reset Preview" or "Clear Local State" control exists, it must be strictly local UI state and must not call any audit writer

**Verification Step**:
- Run the full audit-event check script (`npm run check:audit-events`)
- Confirm no new event types appear
- Manually exercise any reset/preview-clear controls and verify no audit write occurs

**Failure Condition**:
- New audit event type detected or any audit write triggered by visual-only controls

---

## Enforcement

These ten boundaries are **hard gates**. Any implementation branch that violates even one of them must be rejected and the violating changes reverted before any further work proceeds.

This document, together with the component contracts and screen map, forms the complete governance contract for the Soft Civic Intelligence visual implementation.

**End of Governance Boundary Implementation Notes**

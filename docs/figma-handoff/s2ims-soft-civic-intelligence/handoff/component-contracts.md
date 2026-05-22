# S²IMS Component Contracts — Soft Civic Intelligence Handoff

**Purpose**: Authoritative contract for every reusable UI component that must exist or be updated to realize the "Soft Civic Intelligence" visual language.

**Location**: docs/figma-handoff/s2ims-soft-civic-intelligence/handoff/component-contracts.md

**Audience**: MC86 implementation team, future Claude Code sessions, and any developer touching the UI layer.

**Rule**: Every component below must be implemented (or refactored) to satisfy the governance, accessibility, and bilingual requirements listed. No component may silently hide disabled actions or remove safety banners.

---

## 1. Button

**Purpose**: Primary interactive element for all roles. Must support five visual variants plus disabled state while remaining accessible.

**Props** (TypeScript shape for reference):
```ts
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  'aria-label'?: string;
  'data-governance'?: 'ap10b' | 'ap10c' | 'ap11' | 'preview';
}
```

**Variants**:
- primary — role accent background, white text
- secondary — outline with role ink
- ghost — transparent with subtle hover
- danger — error red for destructive actions (still visible when disabled)
- disabled — gray, cursor not-allowed, still visible

**Visual States**:
- Default, hover, focus (2px ring), active, disabled

**Accessibility Requirements**:
- Minimum 44×44 px touch target
- 4.5:1 contrast on all text
- `aria-disabled` when disabled (never remove from DOM)
- Keyboard focus visible with `--role-*` color ring

**Thai/English Behavior**:
- Font stack automatically switches to IBM Plex Sans Thai when Thai characters detected
- Line-height relaxed for Thai

**Governance Constraints**:
- When `data-governance="ap10b"`, use `--status-preview` (magenta-violet) and show lock icon
- Never hide a disabled governance action — always render with DisabledActionHint nearby

**Where Used**:
- All forms, modals, primary CTAs, dangerous actions, preview-only flows

**Implementation Notes**:
- Refactor existing MC71 Button to accept the new `variant` union while keeping backward-compatible defaults
- Add `data-governance` prop for automatic preview coloring

**What Not To Do**:
- Do not remove the button from the DOM when disabled
- Do not use red for preview states (reserved for danger + AP-11)

---

## 2. StatusBadge

**Purpose**: Compact, high-visibility label for workflow state, validation result, or governance status.

**Variants** (8 required):
- success, warning, error, info, preview, blocked, disabled, neutral

**Props**:
```ts
interface StatusBadgeProps {
  status: 'success' | 'warning' | 'error' | 'info' | 'preview' | 'blocked' | 'disabled' | 'neutral';
  children: React.ReactNode;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}
```

**Visual States**:
- Light background tint + dark text using the status color tokens
- Preview variant must be visually distinct (magenta-violet) from warning (amber)

**Accessibility**:
- Text contrast ≥ 4.5:1
- `aria-label` describing the semantic meaning (e.g., "Preview only — no data will be saved")

**Governance**:
- `preview` badge must never be used outside AP-10B contexts
- `blocked` badge used for AP-10C / AP-11 disabled gates

**Where Used**:
- /admin/audit-log rows, import-preview validation results, candidate review states, journey step indicators

**Implementation Notes**:
- Extend existing StatusBadge (MC71) with the two new variants (preview, blocked) and enforce the color distinction

**What Not To Do**:
- Do not reuse warning amber for preview states

---

## 3. RoleBadge

**Purpose**: Small pill or chip that clearly communicates the current user's role context.

**Variants**:
- admin, staff, provider, student, esq, public

**Props**:
- `role`: one of the six role keys
- `showIcon` (optional)
- `size`

**Visual Treatment**:
- Role-specific background tint + role ink text
- Subtle icon (user silhouette or role symbol) on left

**Accessibility**:
- `aria-label="Current role: Admin"`

**Governance**:
- Must remain visible even on governance-blocked routes (helps users understand why certain actions are disabled)

**Where Used**:
- TopBar, user profile header, audit log actor column, journey step headers

---

## 4. SafetyBanner

**Purpose**: Permanent, non-dismissible banner that communicates the current route or action is in a restricted or preview-only state.

**Required Locations**:
- Every route listed in the governance boundary document
- /admin/master-data/import-preview, /admin/audit-log, /admin/candidate-review-demo, any future preview routes

**Props**:
```ts
interface SafetyBannerProps {
  variant: 'preview' | 'blocked' | 'governance' | 'evidence';
  title: string;           // e.g. "Preview Only"
  description: string;     // Thai + English
  children?: React.ReactNode;
}
```

**Visual Treatment**:
- Full-width, soft background using the appropriate status color
- Bold title + explanatory body text
- Never uses red unless the state is truly an error

**Accessibility**:
- `role="status"`
- `aria-live="polite"`

**Governance**:
- Must be the first visible element below the TopBar on any affected route
- Text must explicitly state "does not save", "does not import", "does not approve", etc.

**What Not To Do**:
- Do not make it dismissible
- Do not use for non-governance information

---

## 5. PreviewOnlyNotice

**Purpose**: Small, inline callout used inside cards or sections that are diagnostic/preview only.

**Visual**:
- Light preview tint background, preview ink text, small eye or preview icon

**Usage**:
- Inside import-preview panels, candidate review diagnostic sections, feedback synthesis previews

**Governance**:
- Must be paired with DisabledActionHint when any action is present

---

## 6. GovernanceBlockedNotice

**Purpose**: Stronger variant of PreviewOnlyNotice used for AP-10C / AP-11 blocked actions.

**Visual**:
- Blocked color palette, lock icon, explicit statement that the action requires future governance approval

**Where Used**:
- Export buttons, Approve/Reject buttons, any AP-11 surface

---

## 7. DisabledActionHint

**Purpose**: Inline or tooltip-style hint that explains why an action is disabled and what governance step is required to enable it.

**Props**:
- `reason`: 'ap10b' | 'ap10c' | 'ap11' | 'preview' | 'role' | 'custom'
- `message`: string (bilingual)

**Visual**:
- Small lock or eye icon + short text
- Never hides the disabled control itself

**Critical Rule**:
- The disabled button or control must remain in the DOM and visible. The hint only explains why.

---

## 8. PageHeader

**Purpose**: Consistent top-of-page header containing title, optional subtitle, and role context.

**Must include**:
- Large, high-contrast title (IBM Plex Sans / Thai)
- Optional `SafetyBanner` immediately below when the page is restricted
- Optional `RoleBadge` on the right

**Accessibility**:
- `h1` for the page title

---

## 9. SectionHeader

**Purpose**: Smaller heading used inside pages to divide content blocks.

**Visual**:
- Slightly smaller than PageHeader, consistent spacing above/below

---

## 10. MetricCard

**Purpose**: At-a-glance number or status card used on dashboards.

**Variants**:
- Neutral, success, warning, preview, blocked

**Must respect**:
- Role color accents when showing role-specific metrics
- Preview/Blocked states when the metric is derived from diagnostic data only

---

## 11. DataTable (Shell)

**Purpose**: Reusable table container with consistent header, row, and empty states.

**Requirements**:
- Header row uses surface-warm
- Rows alternate with subtle surface-paper
- PII columns must show ★ mask + role-based reveal hint
- Empty state must use the EmptyState component below

**Governance**:
- Any table that could contain evidence must carry the evidence-boundary treatment defined in the audit-log screen contract

---

## 12. FilterBar

**Purpose**: Horizontal control bar for filtering lists (status, role, date, etc.).

**Must**:
- Use consistent control radius (8px)
- Support disabled state with DisabledActionHint when filters are governance-restricted

---

## 13. FormField / FormShell

**Purpose**: Wrapper for all form inputs (text, select, textarea, file).

**Requirements**:
- Consistent label typography
- Error / warning / preview states
- Thai/English label switching
- When the field is part of a preview flow, the entire shell must carry PreviewOnlyNotice treatment

---

## 14. FeedbackCaptureCard

**Purpose**: Card used in diagnostic/demo flows to capture non-approval planning feedback.

**Visual**:
- Warm surface, rounded-14, subtle border
- Must include explicit "Planning feedback only — does not constitute approval" language

**Governance**:
- Never presented as a form that saves to production

---

## 15. RouteVerificationPanel

**Purpose**: Developer/QA-only panel (visible in dev or with special flag) that lists the current route, required safety banners, and governance state.

**Must**:
- Show the exact SafetyBanner variant that should be present
- List any DisabledActionHint that must appear
- Never be visible to normal users

---

## 16. DocCompletenessRing

**Purpose**: Circular progress indicator used on documentation or checklist pages (e.g., MC68 evidence completeness).

**Visual**:
- Uses role or status colors
- Must gracefully handle 0% and 100% states

---

## 17. Sidebar

**Purpose**: Persistent left navigation for authenticated roles.

**Requirements**:
- Role-aware highlighting
- Governance-blocked sections must still be visible (with small blocked badge)
- Never hide navigation items based on permissions without showing the blocked state

**Current State**:
- Existing Sidebar from MC22/MC35 must be refactored to use the new radius, color, and badge system

---

## 18. TopBar

**Purpose**: Global header containing logo, role switcher (if allowed), user context, and any global safety indicators.

**Requirements**:
- Must show current role via RoleBadge
- Must surface any global preview or governance mode
- Safe area for Thai text

---

## Summary of Non-Negotiable Rules Across All Components

- Disabled actions are always rendered visibly
- Preview color (#6B3B8C magenta-violet) is never used for warning or error
- SafetyBanner is the first content element on any restricted route
- PII is masked by default with ★ reveal
- All text supports Thai + English with correct font stack
- No component may imply approval, persistence, or AP-10B clearance

This contract is the single source of truth for component behavior in the Soft Civic Intelligence redesign.

**End of Component Contracts**

# S²IMS Safety Primitives Contract — MC87

**Date**: 2026-05-21  
**Location**: src/components/shared/  
**Exported from**: src/components/shared/index.ts  

These seven components are the foundation safety and governance primitives for the
Soft Civic Intelligence visual system. They are presentational only — no API calls,
no audit writes, no persistence, no browser storage.

---

## 1. SafetyBanner

**File**: `src/components/shared/SafetyBanner.tsx`

```ts
interface SafetyBannerProps {
  tone?: 'preview' | 'blocked' | 'warning' | 'info'  // default: 'info'
  title: string
  description?: string
  items?: string[]
  apCodes?: Array<'AP-10B' | 'AP-10C' | 'AP-11'>
  className?: string
}
```

**Usage rules**:
- Must be the first visible content element on any governance-restricted route
- Non-dismissible — no close button rendered
- `tone='preview'` uses magenta-violet (AP-10B contexts only)
- `tone='blocked'` uses soft blocked gray (AP-10C / AP-11 contexts)
- AP code pills rendered when `apCodes` provided

**Accessibility**: `role="status"` `aria-live="polite"`

**Governance**: Must not imply persistence, import, approval, or official evidence.

---

## 2. DisabledActionHint

**File**: `src/components/shared/DisabledActionHint.tsx`

```ts
interface DisabledActionHintProps {
  apCode?: 'AP-10B' | 'AP-10C' | 'AP-11'
  reason: string
  children?: React.ReactNode  // wraps the disabled control
  className?: string
}
```

**Usage rules**:
- Wrap the disabled `<Button>` or control as `children` — the control must remain visible
- `reason` must state why the action is disabled in plain language
- `apCode` renders the AP code prefix in monospace font
- Never hide or remove the disabled control from the DOM

**Accessibility**: `role="note"`. Lock icon (⊘) is aria-hidden.

---

## 3. RoleBadge

**File**: `src/components/shared/RoleBadge.tsx`

```ts
type RoleBadgeRole = 'admin' | 'staff' | 'provider' | 'student' | 'esq' | 'public'

interface RoleBadgeProps {
  role: RoleBadgeRole
  label?: string        // default: role display name
  size?: 'sm' | 'md'   // default: 'md'
  className?: string
}
```

**Usage rules**:
- Uses `softCivicRoles` palette via inline style (works without tailwind.config.ts change)
- Two-letter abbreviation rendered as non-color signal
- Must remain visible on governance-blocked routes

**Accessibility**: `aria-label="Current role: {displayLabel}"`

---

## 4. PreviewOnlyNotice

**File**: `src/components/shared/PreviewOnlyNotice.tsx`

```ts
interface PreviewOnlyNoticeProps {
  title?: string        // default: 'Preview Only — ข้อมูลนี้ไม่ถูกบันทึก'
  description?: string  // default: no-persistence explanation
  apCodes?: Array<'AP-10B' | 'AP-10C' | 'AP-11'>
  className?: string
}
```

**Usage rules**:
- Inline callout — smaller than SafetyBanner, used inside cards/sections
- Must be paired with DisabledActionHint when any action is present
- Preview palette (#F3E9F8) — magenta-violet, not amber

**Accessibility**: `role="note"`

---

## 5. GovernanceBlockedNotice

**File**: `src/components/shared/GovernanceBlockedNotice.tsx`

```ts
type GovernanceApCode = 'AP-10B' | 'AP-10C' | 'AP-11'

interface GovernanceBlockedNoticeProps {
  apCode: GovernanceApCode  // required
  title?: string            // default: AP-code specific title
  reason?: string           // default: AP-code specific reason
  className?: string
}
```

**Default copy per AP code**:
- AP-10B: "AP-10B Gate — Confirm Import Blocked" + import preview message
- AP-10C: "AP-10C Gate — Export Blocked" + export disabled message
- AP-11: "AP-11 Gate — Approve / Reject Blocked" + diagnostic-only message

**Usage rules**:
- Uses `softCivicGovernance` palette via inline style
- Always renders: "This action requires future governance approval. It is not currently approved or complete."
- Lock icon (⊘) is aria-hidden

---

## 6. PageHeader

**File**: `src/components/shared/PageHeader.tsx`

```ts
interface PageHeaderProps {
  eyebrow?: string          // small caps label above title
  title: string             // rendered as <h1>
  description?: string
  badge?: React.ReactNode   // rendered next to title
  actions?: React.ReactNode // right side CTA area
  className?: string
}
```

**Usage rules**:
- Title renders as `<h1>` — only one per page
- Warm paper surface implied by parent page background
- Thai-friendly: system font stack gracefully handles Thai characters
- Bottom border separator included by default

---

## 7. SectionHeader

**File**: `src/components/shared/SectionHeader.tsx`

```ts
interface SectionHeaderProps {
  title: string             // rendered as <h2>
  description?: string
  action?: React.ReactNode  // right side action (e.g., filter button)
  className?: string
}
```

**Usage rules**:
- Title renders as `<h2>` — subordinate to PageHeader `<h1>`
- Consistent 3px bottom margin
- Right-aligned `action` slot for optional section-level controls

---

## Summary of Non-Negotiable Rules (all components)

- Disabled actions are always rendered visibly — never removed from DOM
- Preview color (#6B3B8C magenta-violet) is never used for warning or error
- AP gate language must never say "approved", "complete", or "cleared"
- No component may write audit events, call APIs, or use browser storage
- All components support Thai + English text via system font stack
- Color is never the only meaning signal — icons or text reinforce status

---

## Future Page Integration (MC88+)

These primitives are exported from `src/components/shared/index.ts` and ready for import.
Page integration is explicitly deferred to MC88 or later. The first page integration
must be limited to one low-risk page with a full rollback plan.

# MC71 Wave 1 Foundation Primitives: Design Token Scaffold + Button + StatusBadge

**Status**: ✅ MC71 Implementation Complete  
**Date**: 2026-05-21  
**Branch**: architecture/s2ims-ux-renovation-wave1-foundation-primitives-mc71

---

## Purpose

MC71 implements the smallest safe foundation for Wave 1 shared UI primitives. It creates:

1. **Design token scaffold** — pure TypeScript constants, no runtime side effects
2. **Button component** — accessible, variant/size-aware, with loading state
3. **StatusBadge component** — semantic status prop, WCAG 2.1 AA compliant
4. **Shared barrel export** — `src/components/shared/index.ts`

This is the first MC with runtime source file changes. MC71 does NOT migrate existing pages. That is planned for MC72+ after explicit approval.

---

## Files Created

| File | Purpose |
|------|---------|
| `src/config/theme.ts` | Design token constants (colors, spacing, typography, radius, shadows, breakpoints, statusColors) |
| `src/components/shared/Button.tsx` | Button component with 4 variants × 3 sizes, loading state, icon slots |
| `src/components/shared/StatusBadge.tsx` | Status badge with 8 semantic status values × 2 sizes |
| `src/components/shared/index.ts` | Barrel export for shared primitives |

---

## Scope

**In Scope for MC71**:
- Create 4 source files listed above
- Documentation and QA artifacts

**Explicitly NOT In Scope for MC71**:
- Migrating existing pages to use new components
- Modifying route behavior
- Enabling AP-10B/AP-10C/AP-11 gates
- Creating DataTable, FormShell, DashboardShell (planned for later MCs)
- Creating persistence/backend
- Writing audit events

---

## Design Token API (`src/config/theme.ts`)

Pure TypeScript constants — `as const` assertions throughout, zero runtime side effects.

### Colors
```typescript
import { colors } from '@/config/theme'
colors.primary     // '#3B82F6'
colors.gray[500]   // '#6B7280'
```

### Status Colors
```typescript
import { statusColors } from '@/config/theme'
statusColors.success.bg    // 'bg-emerald-100'
statusColors.warning.text  // 'text-amber-800'
```

### Typography Scale
```typescript
import { typography } from '@/config/theme'
typography.title.size    // '20px'
typography.body.weight   // 400
```

---

## Button Component API (`src/components/shared/Button.tsx`)

```typescript
import { Button } from '@/components/shared'

// Variants: 'primary' | 'secondary' | 'ghost' | 'danger'
// Sizes: 'sm' | 'md' | 'lg'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `ButtonVariant` | `'primary'` | Visual style |
| `size` | `ButtonSize` | `'md'` | Height/padding/text size |
| `disabled` | `boolean` | `false` | Disabled state |
| `loading` | `boolean` | `false` | Loading spinner (disables button) |
| `iconStart` | `ReactNode` | — | Icon before label |
| `iconEnd` | `ReactNode` | — | Icon after label |
| `aria-label` | `string` | — | For icon-only buttons |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Form button type |
| `onClick` | `MouseEventHandler` | — | Click handler |
| `className` | `string` | `''` | Additional Tailwind classes |

### Size Reference

| Size | Height | Text | Padding |
|------|--------|------|---------|
| `sm` | 32px | xs | px-4 py-1 |
| `md` | 40px | sm | px-5 py-2 |
| `lg` | 44px | sm | px-6 py-2.5 |

### Accessibility
- Focus ring: `focus-visible:ring-2 focus-visible:ring-offset-2` with variant-matched color
- Disabled: `aria-disabled`, `disabled`, pointer-events-none
- Loading: Loader2 icon has `aria-hidden="true"`, button is `disabled`
- Icons: wrapped in `aria-hidden="true"` spans

---

## StatusBadge Component API (`src/components/shared/StatusBadge.tsx`)

```typescript
import { StatusBadge } from '@/components/shared'

// Status: 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'blocked' | 'preview' | 'disabled'
// Size: 'sm' | 'md'
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | required | Display text |
| `status` | `StatusBadgeStatus` | `'neutral'` | Semantic status color |
| `icon` | `ReactNode` | — | Optional icon before label |
| `size` | `StatusBadgeSize` | `'md'` | Padding/gap size |
| `className` | `string` | `''` | Additional Tailwind classes |
| `aria-label` | `string` | `label` | Override accessible label |

### Status Colors

| Status | Background | Text | Border |
|--------|-----------|------|--------|
| `success` | emerald-100 | emerald-800 | emerald-200 |
| `warning` | amber-100 | amber-800 | amber-200 |
| `error` | red-100 | red-800 | red-200 |
| `info` | sky-100 | sky-800 | sky-200 |
| `neutral` | gray-100 | gray-700 | gray-200 |
| `blocked` | gray-200 | gray-600 | gray-300 |
| `preview` | purple-100 | purple-800 | purple-200 |
| `disabled` | gray-100 | gray-400 | gray-200 |

### Accessibility
- `role="img"` on the span
- `aria-label` defaults to `label` prop value
- Icon has `aria-hidden="true"`

---

## Usage Examples

```tsx
import { Button, StatusBadge } from '@/components/shared'

// Primary button
<Button onClick={handleApprove}>Approve</Button>

// Danger button with loading state
<Button variant="danger" loading={isDeleting}>Delete</Button>

// Secondary button with icon
<Button variant="secondary" iconStart={<Download size={14} />}>Export</Button>

// Status badges
<StatusBadge label="Approved" status="success" />
<StatusBadge label="Pending" status="warning" />
<StatusBadge label="Blocked" status="blocked" />
<StatusBadge label="Preview Only" status="preview" />
```

---

## What Was NOT Migrated

MC71 creates the primitives only. Existing pages that render their own inline buttons or badges have NOT been updated. Migration is planned for MC72+ after explicit approval.

Files that can benefit from migration (future MC72 scope):
- 20+ files using inline button patterns → migrate to `<Button>`
- 15+ files using inline badge patterns → migrate to `<StatusBadge>`

---

## Safety Statement

MC71 creates a limited shared UI primitive scaffold only. It does not migrate existing pages, does not change route/navigation behavior, does not enable persistence/audit writes/official evidence, and does not open AP-10B/AP-10C/AP-11.

---

## Recommended MC72

MC72 scope: migrate a small number of existing pages (3-5 pages) to use the new Button and StatusBadge primitives. Requires explicit approval before starting.

---

**Document Status**: ✅ MC71 Implementation Complete  
**Last Updated**: 2026-05-21

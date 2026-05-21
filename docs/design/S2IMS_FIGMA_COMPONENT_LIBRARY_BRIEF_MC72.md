# S²IMS Figma Component Library Brief — MC72

**Status**: MC72 Design Documentation  
**Date**: 2026-05-21  
**Purpose**: Component-by-component design specifications for the S²IMS Figma component library

---

## MC72 Scope Statement

Docs-only. These specifications are for Figma/design tooling only. No runtime code changes. AP-10B/AP-10C/AP-11 remain locked.

---

## Already Implemented (MC71)

These components exist in `src/components/shared/` and have full API contracts. Design should match their implemented behavior exactly.

---

## Component 1: Button

**Source**: `src/components/shared/Button.tsx`  
**Figma layer name**: `Primitives/Button`

### Variants
| Variant | Background | Text | Border | Hover | Focus Ring |
|---------|-----------|------|--------|-------|-----------|
| primary | blue-500 | white | none | blue-600 | blue-500 |
| secondary | transparent | gray-700 | gray-300 | gray-100 bg | blue-500 |
| ghost | transparent | gray-700 | none | gray-50 bg | blue-500 |
| danger | red-500 | white | none | red-600 | red-500 |

### Sizes
| Size | Height | Padding X | Padding Y | Font Size | Gap |
|------|--------|----------|----------|-----------|-----|
| sm | 32px | 16px | 4px | 12px (text-xs) | 6px |
| md | 40px | 20px | 8px | 14px (text-sm) | 8px |
| lg | 44px | 24px | 10px | 14px (text-sm) | 8px |

### States
- **Default**: base variant styles
- **Hover**: slightly darker background (see table)
- **Focus**: 2px ring in variant color + 2px offset (white gap between element and ring)
- **Disabled**: opacity-50, cursor-not-allowed
- **Loading**: Loader2 spinner (12px for sm, 14px for md/lg) replaces iconStart; label remains visible

### Props for Figma Variants
- `variant` — primary / secondary / ghost / danger (4 variants)
- `size` — sm / md / lg
- `state` — default / hover / focus / disabled / loading
- `hasIconStart` — boolean
- `hasIconEnd` — boolean

### Border Radius
All sizes: 6px (radius.md)

### Accessibility Notes
- Focus ring: `focus-visible:ring-2 focus-visible:ring-offset-2`
- Disabled: `aria-disabled`, `pointer-events-none`
- Loading: `aria-disabled` set, spinner has `aria-hidden`
- Icon wrappers have `aria-hidden`

### Figma Component Setup
- Use auto-layout (horizontal, align center)
- Create as component with variant properties
- Layer: `Button/[variant]/[size]/[state]`

---

## Component 2: StatusBadge

**Source**: `src/components/shared/StatusBadge.tsx`  
**Figma layer name**: `Primitives/StatusBadge`

### Status Colors
| Status | Background | Text | Border |
|--------|-----------|------|--------|
| success | emerald-100 (#D1FAE5) | emerald-800 (#065F46) | emerald-200 (#A7F3D0) |
| warning | amber-100 (#FEF3C7) | amber-800 (#92400E) | amber-200 (#FDE68A) |
| error | red-100 (#FEE2E2) | red-800 (#991B1B) | red-200 (#FECACA) |
| info | sky-100 (#E0F2FE) | sky-800 (#075985) | sky-200 (#BAE6FD) |
| neutral | gray-100 (#F3F4F6) | gray-700 (#374151) | gray-200 (#E5E7EB) |
| blocked | gray-200 (#E5E7EB) | gray-600 (#4B5563) | gray-300 (#D1D5DB) |
| preview | purple-100 (#EDE9FE) | purple-800 (#5B21B6) | purple-200 (#DDD6FE) |
| disabled | gray-100 (#F3F4F6) | gray-400 (#9CA3AF) | gray-200 (#E5E7EB) |

### Sizes
| Size | Padding X | Padding Y | Font Size | Gap |
|------|----------|----------|-----------|-----|
| sm | 8px | 2px | 12px (text-xs) | 4px |
| md | 10px | 4px | 12px (text-xs) | 6px |

### Props for Figma Variants
- `status` — 8 values
- `size` — sm / md
- `hasIcon` — boolean (optional leading icon)

### Border Radius
All: 9999px (full pill / radius.full)

### Accessibility Notes
- `role="img"` + `aria-label` with full status description
- Icon has `aria-hidden`
- Badge is not interactive (no focus ring needed)

### Figma Component Setup
- Auto-layout horizontal, center aligned
- Border: 1px solid (status border color)
- Layer: `StatusBadge/[status]/[size]`

---

## Component 3: PageHeader

**Status**: Planned (future MC) — design spec only  
**Figma layer name**: `Layout/PageHeader`

### Purpose
Top-of-page heading area with optional breadcrumb, title, subtitle, and action area.

### Variants
| Variant | Has Breadcrumb | Has Subtitle | Has Actions |
|---------|--------------|-------------|------------|
| minimal | no | no | no |
| standard | yes | no | no |
| with-actions | yes | yes | yes |

### Anatomy
- **Breadcrumb row** (optional): home > section > current (text-sm, gray-500)
- **Title row**: `<h1>` 28px (headline), gray-900, font-weight 600
- **Subtitle** (optional): text-sm, gray-500, margin-top 4px
- **Actions area** (optional): right-aligned, flex row gap-2

### Sizes
- Height: auto (min 64px without breadcrumb, 80px with breadcrumb)
- Padding: 24px top, 24px bottom, matches page horizontal padding

### States
- Default, with-actions (Button right side), loading skeleton

### Figma Component Setup
- Auto-layout vertical
- Separate instances for with/without breadcrumb
- Layer: `PageHeader/[variant]`

---

## Component 4: SafetyBanner

**Status**: Planned (future MC) — design spec only  
**Figma layer name**: `Feedback/SafetyBanner`

### Purpose
Full-width banner shown at the top of preview-only or governance-locked routes. Non-dismissible. Always visible.

### Variants
| Variant | Use Case | Color Scheme |
|---------|----------|-------------|
| preview | Route is demo/preview-only | Amber: bg-amber-50, border-amber-200, text-amber-800 |
| blocked | Governance gate is locked | Gray: bg-gray-100, border-gray-300, text-gray-700 |
| info | Informational notice | Sky: bg-sky-50, border-sky-200, text-sky-800 |

### Anatomy
- Icon: `AlertTriangle` (preview/blocked) or `Info` (info), 16px, flex-shrink-0
- Thai headline text: font-medium, 14px
- English sub-text: 12px, opacity-75
- No close/dismiss button

### Routes That Must Show SafetyBanner
- `/admin/candidate-review-demo` → preview variant
- `/admin/master-data/import-preview` → preview variant (AP-10B)

### Dimensions
- Full width of content area
- Padding: 12px 16px
- Border: 1px bottom

### Figma Component Setup
- Auto-layout horizontal
- Full width (stretch)
- Layer: `SafetyBanner/[variant]`

---

## Component 5: PreviewOnlyNotice

**Status**: Planned (future MC) — design spec only  
**Figma layer name**: `Feedback/PreviewOnlyNotice`

### Purpose
Compact inline notice for individual actions/sections that are in preview state (smaller than SafetyBanner).

### Variants
- `inline` — appears next to a disabled button to explain why
- `card` — appears as a small card below a section heading

### Copy Pattern
- Thai: "ฟีเจอร์นี้อยู่ระหว่างการพัฒนา"
- English: "This feature is under development"

---

## Component 6: GovernanceBlockedNotice

**Status**: Planned (future MC) — design spec only  
**Figma layer name**: `Feedback/GovernanceBlockedNotice`

### Purpose
Explains to authorized users why a specific governance gate is locked. Shown in admin context only.

### Variants
| Gate | Thai Text | English Sub-text |
|------|----------|-----------------|
| AP-10B | "การนำเข้าข้อมูลยังไม่เปิดใช้งาน" | "Confirm Import (AP-10B) not yet enabled" |
| AP-10C | "การส่งออกข้อมูลยังไม่เปิดใช้งาน" | "Export Approval (AP-10C) not yet enabled" |
| AP-11 | "ระบบอนุมัติยังไม่เปิดใช้งาน" | "Approval Workflows (AP-11) not yet enabled" |

---

## Component 7: EmptyState

**Status**: Planned (future MC) — design spec only  
**Figma layer name**: `Feedback/EmptyState`

### Purpose
Shown when a list/table has no data. Never leave a blank white area.

### Variants
| Variant | When Used | Illustration |
|---------|----------|-------------|
| no-data | No records exist yet | Simple icon + headline |
| filtered-empty | Active filters removed all results | Icon + "ล้างตัวกรอง / Clear filters" Button |
| loading | Data is being fetched | Skeleton rows (3-5 rows) |
| error | Data fetch failed | Warning icon + retry Button |

### Anatomy (no-data variant)
- Center-aligned in available space
- Illustration: 64×64px icon placeholder (gray-300 fill)
- Headline: text-sm font-medium gray-700 (Thai)
- Sub-text: text-xs gray-500 (English)
- Optional CTA Button (primary or secondary, sm)

### Figma Component Setup
- Auto-layout vertical, center-aligned
- Min-height: 200px
- Layer: `EmptyState/[variant]`

---

## Component 8: MetricCard

**Status**: Planned (future MC) — design spec only  
**Figma layer name**: `Data/MetricCard`

### Purpose
KPI summary card for dashboards. Shows a single metric with label, value, and optional trend.

### Anatomy
- **Label**: text-xs gray-500, uppercase, tracking-wide (Thai/bilingual)
- **Value**: 36px font-bold gray-900 (or status color for alert states)
- **Trend** (optional): text-xs with arrow icon — green (up good), red (down bad), or gray (neutral)
- **Sub-label** (optional): text-xs gray-400

### Variants
- `default` — white card, standard metric
- `highlight` — blue-50 background, primary metric
- `alert` — amber-50 background, metric needing attention

### Dimensions
- Min width: 180px; typical: 200-240px
- Height: auto (~100-120px with padding)
- Padding: 20px
- Border: 1px gray-200, radius 8px (radius.lg)
- Shadow: shadow-sm

### Privacy Rules
- Never show real student counts — use mock numbers (e.g., 247, 53)
- Admin-only metrics (application totals, user counts) must not appear on Provider dashboard

### Figma Component Setup
- Auto-layout vertical
- Layer: `MetricCard/[variant]`

---

## Component 9: DataTable (Shell)

**Status**: Planned (future MC73) — skeleton spec for now  
**Figma layer name**: `Data/DataTable`

### Purpose
Sortable, paginated, keyboard-navigable table for all list views.

### Anatomy
- **Header row**: bg-gray-50, text-xs uppercase gray-500, with sort icons (inactive/asc/desc)
- **Data rows**: bg-white, border-b gray-200, text-sm gray-700
- **Hover state**: bg-gray-50 on row hover
- **Selected state**: bg-blue-50 on checkbox select
- **Pagination bar**: text-sm gray-500 + prev/next Buttons (ghost sm)

### Skeleton (for Figma)
Draw a table structure with:
- 5 column headers (placeholder labels)
- 5 data rows (gray bar placeholders 8px height)
- Pagination bar at bottom

### States
- Default, hover (row), selected (row + checkbox), sorted (column header), empty (EmptyState inside), loading (skeleton rows)

---

## Component 10: FormShell (Shell)

**Status**: Planned (future MC73) — skeleton spec  
**Figma layer name**: `Forms/FormShell`

### Purpose
Standardized form layout with field grouping, labels, validation errors.

### Anatomy
- **Field group**: label (text-sm gray-700 font-medium) + input + error message
- **Error state**: border-red-500 input, text-xs text-red-600 error message below field
- **Helper text**: text-xs gray-400 below field (no error)
- **Submit area**: bottom of form, right-aligned Button row

### Field Sizes
- Input height: 40px (matches Button md)
- Label: text-sm, margin-bottom 4px
- Gap between fields: 16px (spacing.md)

---

## Component 11: RoleBadge

**Status**: Planned (future MC) — design spec  
**Figma layer name**: `Layout/RoleBadge`

### Purpose
Shows the current user's role in the navigation header.

### Variants
| Role | Label (TH) | Label (EN) | Background | Text |
|------|-----------|-----------|-----------|------|
| Admin | ผู้ดูแลระบบ | Admin | bg-red-100 | text-red-800 |
| Staff | เจ้าหน้าที่ | Staff | bg-blue-100 | text-blue-800 |
| Provider | ผู้ให้ทุน | Provider | bg-green-100 | text-green-800 |
| Student | นักศึกษา | Student | bg-purple-100 | text-purple-800 |
| ESQ | ผู้คัดกรอง | ESQ | bg-amber-100 | text-amber-800 |

### Anatomy
- Pill shape (radius.full)
- Text: text-xs font-medium
- Padding: px-2.5 py-1 (same as StatusBadge md)
- Optional user icon before text

---

## Component 12: FilterBar

**Status**: Planned (future MC) — design spec  
**Figma layer name**: `Data/FilterBar`

### Purpose
Horizontal row of filter controls above data tables: search input + filter selects + optional date range.

### Anatomy
- **Search input**: left-aligned, 240px min width, magnifier icon prefix
- **Filter selects**: each 160px wide, dropdown with options
- **Clear filters** link: text-sm text-blue-600, appears only when filters are active
- **Result count**: text-sm gray-500, right-aligned — "แสดง X รายการ / Showing X results"

### Height
- 48px (matches Button lg height with padding)

### States
- Default (no filters active), active (1+ filters selected, clear link visible)

---

## Component 13: DisabledActionHint

**Status**: Planned (future MC) — design spec  
**Figma layer name**: `Feedback/DisabledActionHint`

### Purpose
Tooltip shown on hover over disabled buttons. Explains why the action is unavailable.

### Anatomy
- Tooltip style: dark (bg-gray-900, text-white), text-xs, max-width 240px
- Trigger: hover/focus on the disabled button wrapper
- Arrow pointing toward the disabled button
- Content: short Thai explanation + AP code in parentheses

### Copy Examples
- "การนำเข้าข้อมูลจริงยังไม่เปิดใช้งาน (AP-10B)"
- "ระบบอนุมัติยังไม่เปิดใช้งาน (AP-11)"
- "การส่งออกข้อมูลยังไม่เปิดใช้งาน (AP-10C)"

### Figma Setup
- Create as overlay/tooltip component
- Not always visible — shown on hover state of disabled Button

---

## Component 14: DashboardShell

**Status**: Planned (future MC73) — layout skeleton spec  
**Figma layer name**: `Layout/DashboardShell`

### Purpose
The top-level layout wrapper: sidebar + header + main content area.

### Anatomy
- **Sidebar**: 240px fixed width, bg-white, border-r gray-200, full height
  - Logo area: 64px height, centered logo + app name
  - Navigation items: 40px height each, active=bg-blue-50 text-blue-700, icon + label
  - Bottom: user profile area + logout
- **Header**: full width minus sidebar, 64px height, bg-white, border-b gray-200
  - Left: page breadcrumb / title (optional)
  - Right: `RoleBadge` + notification bell (future) + user avatar
- **Main content area**: remaining width, bg-gray-50, padding 24px, scrollable

### Responsive Behavior
- Desktop (≥1280px): full sidebar visible
- Tablet (768-1279px): sidebar collapsible (hamburger toggle)
- Mobile (<768px): sidebar hidden, drawer overlay on hamburger tap

### Role-Specific Navigation Colors
Each role uses a consistent accent in the sidebar active state:
| Role | Active BG | Active Text |
|------|----------|-----------|
| Admin | bg-red-50 | text-red-700 |
| Staff | bg-blue-50 | text-blue-700 |
| Provider | bg-green-50 | text-green-700 |
| Student | bg-purple-50 | text-purple-700 |
| ESQ | bg-amber-50 | text-amber-700 |

---

## Safety Statement

MC72 is documentation/design-only. This component library brief defines Figma specifications only. No runtime components are created in MC72. All components marked "Planned (future MC)" require explicit approval and separate implementation MCs.

---

**Document Status**: MC72 Design Documentation  
**Last Updated**: 2026-05-21

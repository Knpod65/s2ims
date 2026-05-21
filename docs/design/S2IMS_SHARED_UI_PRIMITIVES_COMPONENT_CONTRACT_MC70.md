# S²IMS Shared UI Primitives: Component Contracts — MC70

**Detailed specifications for Wave 1 core components.** These contracts define the interface, accessibility requirements, and implementation details for each component. Use these specifications as the single source of truth during MC71 implementation.

---

## Component Contract Template

Each component includes:
- **Purpose**: What problem does this solve?
- **Props Interface**: Input parameters and types
- **Visual States**: All visual variants
- **Keyboard Navigation**: How keyboard users interact
- **ARIA Requirements**: Accessibility annotations
- **Design Tokens**: Colors, spacing, typography
- **Responsive Behavior**: Mobile/tablet/desktop
- **Edge Cases**: Disabled, loading, error states
- **Testing Requirements**: How to verify correctness

---

## Contract 1: Button Component

### Purpose
Universal button component used across 30+ pages for all primary, secondary, danger, and ghost actions.

### Props Interface

```tsx
interface ButtonProps {
  // Required
  label: string;                    // Button text
  onClick: () => void;              // Click handler
  
  // Optional
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'; // Default: primary
  size?: 'sm' | 'md' | 'lg';       // Default: md
  disabled?: boolean;               // Default: false
  loading?: boolean;                // Default: false
  icon?: React.ReactNode;           // Optional left icon
  ariaLabel?: string;               // Required if icon-only
  type?: 'button' | 'submit' | 'reset'; // Default: button
}
```

### Visual States

| State | Primary Bg | Text | Border | Cursor |
|-------|-----------|------|--------|--------|
| Normal | Primary | White | None | pointer |
| Hover | Primary Dark | White | None | pointer |
| Focus | Primary | White | 2px Primary | pointer |
| Disabled | Gray300 | Gray500 | None | not-allowed |
| Loading | Primary | White | None | not-allowed |

### Sizes

| Size | Height | Padding | Font | Responsive |
|------|--------|---------|------|------------|
| sm | 32px | 8px 16px | 12px | Icon-only or inline |
| md | 40px | 12px 20px | 14px | Standard (desktop) |
| lg | 44px | 16px 24px | 14px | Touch-friendly (mobile, forms) |

### Variants

**Primary** (Main action)
- Background: Primary (#3B82F6)
- Text: White
- Hover: Primary with increased opacity
- Focus: 2px Primary outline
- Use: Form submission, main CTA

**Secondary** (Alternative action)
- Background: Transparent
- Border: 1px Gray300
- Text: Gray700
- Hover: Gray100 background
- Focus: 2px Primary outline
- Use: Cancel, Back, secondary navigation

**Danger** (Destructive action)
- Background: Error (#EF4444)
- Text: White
- Hover: Error with increased opacity
- Focus: 2px Error outline
- Use: Delete, Remove, Destructive actions

**Ghost** (Tertiary action)
- Background: Transparent
- Text: Primary or Gray700 (context-dependent)
- Hover: Gray50 background
- Focus: 2px Primary outline
- Use: Minimal actions, link-like buttons

### Keyboard Navigation

| Key | Behavior |
|-----|----------|
| Tab | Focus button (includes in tab order) |
| Enter | Activate button |
| Space | Activate button |
| Escape | Optional: close associated modal/popover |

### ARIA Requirements

```tsx
// All buttons
<button
  aria-label={ariaLabel || label}  // Required if icon-only
  disabled={disabled}               // Automatically sets aria-disabled
  type={type}
>
  {loading && <Spinner />}
  {label}
</button>

// Icon-only buttons MUST have ariaLabel
<button aria-label="Delete item" title="Delete">
  <TrashIcon />
</button>
```

### Design Tokens Used

- **Colors**: Primary (#3B82F6), Error (#EF4444), Gray300, Gray500, Gray700, White
- **Spacing**: 8px/12px/16px padding, 12px/20px/24px horizontal
- **Typography**: Body 14px regular
- **Border Radius**: 6px standard, 4px compact
- **Focus**: 2px solid Primary outline

### Responsive Behavior

- **Mobile**: Prefer lg (44px) for touch-friendly minimum
- **Tablet**: Use md (40px) for standard actions
- **Desktop**: Use md (40px) standard, sm (32px) for inline actions

### Edge Cases

**Disabled State**:
- Gray background, Gray text, `cursor: not-allowed`
- `disabled` attribute set (auto aria-disabled)
- Click handler not called
- No hover/focus state changes

**Loading State**:
- Spinner indicator (inside button or inline)
- Label changes to "Loading..." or hidden
- Button disabled during load
- Timeout recommendation: 30 seconds max before error

**Icon-Only Button**:
- Must have `ariaLabel` or `title`
- Same size/height as text button
- Icon centered

### Testing Requirements

```
✓ Render with all variant/size combinations
✓ Keyboard: Tab focuses, Enter/Space activates
✓ Focus indicator visible (2px Primary outline)
✓ Disabled: No click handler called
✓ Loading: Shows spinner, disabled during load
✓ Icon-only: aria-label present
✓ Touch-friendly: lg size > 44px height
✓ Color contrast: 4.5:1 minimum (all variants)
```

### Files to Create/Modify (MC71)

**Create**:
- `src/components/ui/Button.tsx` (new)
- `src/components/ui/button.stories.tsx` (Storybook)

**Modify**:
- 30+ pages using scattered button styles

---

## Contract 2: StatusBadge Component

### Purpose
Color-coded status indicator used across 15+ pages for status, priority, type, and state badges.

### Props Interface

```tsx
interface StatusBadgeProps {
  // Required
  label: string;                    // Badge text
  
  // Optional
  variant?: 'status' | 'priority' | 'type' | 'state'; // Default: status
  value?: 'pending' | 'approved' | 'rejected' | 'blocked' | 'high' | 'medium' | 'low' | 'info' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';       // Default: md
  icon?: React.ReactNode;           // Optional icon
  ariaLabel?: string;               // Screen reader label
}
```

### Visual Variants

**Status Badge Variants**:
| Status | Background | Text | Icon | Use Case |
|--------|-----------|------|------|----------|
| Pending | Warning (#F59E0B) | Dark | Clock | Awaiting review |
| Approved | Success (#10B981) | White | Checkmark | Accepted/Approved |
| Rejected | Error (#EF4444) | White | X | Denied/Rejected |
| Blocked | Gray300 | Gray700 | Lock | Unable to proceed |

**Priority Badge Variants**:
| Priority | Background | Text | Icon |
|----------|-----------|------|------|
| High | Error (#EF4444) | White | ↑ |
| Medium | Warning (#F59E0B) | Dark | — |
| Low | Gray300 | Gray700 | ↓ |

**Type Badge Variants**:
| Type | Background | Text | Icon |
|------|-----------|------|------|
| Notification | Info (#0EA5E9) | White | Bell |
| Announcement | Secondary (#8B5CF6) | White | Megaphone |
| Alert | Error (#EF4444) | White | ⚠ |

### Sizes

| Size | Padding | Font | Height |
|------|---------|------|--------|
| sm | 4px 8px | 12px | 24px |
| md | 8px 12px | 14px | 32px |
| lg | 12px 16px | 14px | 40px |

### ARIA Requirements

```tsx
// Text badge
<span role="img" aria-label={ariaLabel || label}>
  {icon && <Icon />}
  {label}
</span>

// Example: aria-label="Status: Pending Review"
// Example: aria-label="Priority: High"
```

### Design Tokens Used

- **Colors**: Success (#10B981), Warning (#F59E0B), Error (#EF4444), Info (#0EA5E9), Gray300, Gray700, White
- **Spacing**: 4px–12px padding
- **Typography**: Body 14px, SmallText 12px
- **Border Radius**: 6px standard, 4px compact

### Responsive Behavior

- **Mobile**: Prefer sm/md for space efficiency
- **Tablet**: Use md standard
- **Desktop**: Use md standard, lg for emphasis

### Edge Cases

**Icon Without Text**:
- Must have `ariaLabel`
- Circle background
- Centered icon

**Very Long Text**:
- Truncate with ellipsis (max 2 lines)
- Tooltip on hover with full text

### Testing Requirements

```
✓ Render all variants (status, priority, type)
✓ Color contrast: 4.5:1 minimum
✓ Icon displays correctly
✓ ariaLabel present for screen readers
✓ Responsive sizing (sm/md/lg)
✓ No color-only information (text + color)
```

### Files to Create/Modify (MC71)

**Create**:
- `src/components/ui/StatusBadge.tsx` (new)
- `src/components/ui/status-badge.stories.tsx` (Storybook)

**Modify**:
- 15+ pages using scattered badge implementations

---

## Contract 3: DataTable Component

### Purpose
Reusable, accessible data table with sorting, filtering, pagination, and keyboard navigation. Used in 9 pages with different data types.

### Props Interface

```tsx
interface DataTableProps {
  // Required
  columns: Column[];                // Column definitions
  data: Row[];                      // Table data
  
  // Optional
  sortable?: boolean;               // Default: true
  filterable?: boolean;             // Default: true
  pagination?: true | 'auto';       // Default: true
  pageSize?: number;                // Default: 20
  pageSizeOptions?: number[];       // Default: [10, 20, 50, 100]
  selectable?: boolean;             // Default: false
  expandable?: boolean;             // Default: false
  emptyState?: React.ReactNode;     // Custom empty message
  rowHeight?: 'sm' | 'md' | 'lg';  // Default: md (48px)
  ariaLabel: string;                // Required: table description
}

interface Column {
  id: string;                       // Unique identifier
  header: string;                   // Column header text
  accessor: string;                 // Data field path
  sortable?: boolean;               // Default: true
  filterable?: boolean;             // Default: true
  render?: (value: any) => React.ReactNode; // Custom cell render
  width?: string;                   // Optional column width
}

interface Row {
  id: string;                       // Unique row identifier
  [key: string]: any;               // Data fields
}
```

### Visual Structure

```
Header Row (Sticky):
┌────┬──────┬────────┬──────────┬────────┐
│☐  │Name ↑│Status  │Updated  │Action │ (sortable headers)
├────┼──────┼────────┼──────────┼────────┤
Data Rows:
│☑  │John  │Pending │Today    │ ··· │
│☐  │Jane  │Approved│Yesterday│ ··· │
│☐  │Bob   │Blocked │2 days   │ ··· │
├────┴──────┴────────┴──────────┴────────┤
Pagination:
│ Showing 1–3 of 150 | ◄ [1] 2 3 ► │
└────────────────────────────────────────┘
```

### Keyboard Navigation

| Key | Behavior |
|-----|----------|
| Tab | Focus header/cell/button |
| Arrow Up/Down | Navigate rows |
| Arrow Left/Right | Navigate cells |
| Space | Check checkbox, toggle expand |
| Enter | Expand row, activate action |
| Escape | Close dropdown, cancel edit |

### ARIA Requirements

```tsx
<table
  role="grid"
  aria-label={ariaLabel}
  aria-rowcount={totalRows}
>
  <thead role="rowgroup">
    <tr role="row">
      <th
        role="button"
        aria-sort="ascending|descending|none"
        tabIndex={0}
      >
        {header} {sortIndicator}
      </th>
    </tr>
  </thead>
  
  <tbody role="rowgroup">
    <tr role="row" aria-label={`Row ${rowNumber}`}>
      <td
        role="gridcell"
        aria-label={`${columnName}: ${value}`}
      >
        {value}
      </td>
    </tr>
  </tbody>
</table>
```

### Design Tokens Used

- **Colors**: Gray50, Gray100, Gray200, Gray300, Gray500, Gray700, Primary, Success, Warning, Error, White
- **Spacing**: Cell padding 12px, row gap 8px
- **Typography**: Header 14px bold, Body 14px
- **Heights**: Header 40px, Row 48px (min touch), Pagination 36px
- **Borders**: 1px Gray200

### Responsive Behavior

- **Desktop**: Traditional table layout
- **Tablet**: Horizontal scroll table OR card layout (user preference)
- **Mobile**: Card layout (1 row = 1 card)

```tsx
// Mobile card layout example:
// ┌─────────────────┐
// │ Name: John      │
// │ Status: Pending │
// │ Updated: Today  │
// │ [View] [Edit]   │
// └─────────────────┘
```

### Edge Cases

**Empty State**:
- Show icon + message: "No data matching your filters"
- Optional action: "Clear filters" or "Create new item"
- Accessibility: `role="status"` `aria-live="polite"`

**Loading State**:
- Show 5 skeleton rows (shimmer effect)
- Gray200 background, same height as normal rows
- Spinner with "Loading..." text

**No Selection**:
- Checkbox column optional
- Selection disabled by default

**Single Row** (expand):
- Show chevron (> or ∨) to indicate expandable
- Focus shows row highlight
- Enter/Space to toggle expand
- Expanded content below row

### Testing Requirements

```
✓ Render all 9 table types (audit log, apps, matching, follow-up, etc.)
✓ Sorting: Click header to sort ascending/descending/unsorted
✓ Filtering: Search + multi-column filters working
✓ Pagination: Page navigation and size selector working
✓ Keyboard nav: Arrow keys, Tab, Enter, Escape functional
✓ Focus indicators: Visible on header cells and rows
✓ ARIA labels: All cells have proper aria-labels
✓ Empty state: Displays correctly when no data
✓ Loading: Skeleton rows show while loading
✓ Responsive: Card layout on mobile, table on desktop
✓ Row expand: Details visible when expanded, keyboard controllable
✓ Accessibility: Keyboard-only navigation functional
```

### Files to Create/Modify (MC71)

**Create**:
- `src/components/table/DataTable.tsx` (new)
- `src/components/table/DataTableCell.tsx`
- `src/components/table/DataTableHeader.tsx`
- `src/components/table/DataTablePagination.tsx`
- `src/components/table/data-table.stories.tsx` (Storybook)

**Modify**:
- 9 pages: audit-log, applications, matching-review, follow-up, disclosures, scholarships, student-apps, notifications, esq-history

---

## Contract 4: FormShell Component

### Purpose
Standardized form layout with validation, progress (multi-step), and accessibility. Used in 5+ forms.

### Props Interface

```tsx
interface FormShellProps {
  // Required
  title: string;                    // Form title
  onSubmit: (data: any) => Promise<void>; // Submit handler
  fields: FormField[];              // Field definitions
  
  // Optional
  subtitle?: string;                // Optional subtitle
  steps?: FormStep[];               // For multi-step forms
  currentStep?: number;             // Current step (1-indexed)
  onStepChange?: (step: number) => void; // Step change callback
  layout?: 'single' | 'two-column'; // Default: single
  cancelButton?: boolean;           // Default: true
  successMessage?: string;          // Default: "Form submitted successfully"
}

interface FormField {
  id: string;                       // Unique field ID
  label: string;                    // Field label
  type: 'text' | 'textarea' | 'email' | 'select' | 'checkbox' | 'radio' | 'date';
  required?: boolean;               // Default: false
  placeholder?: string;             // Optional placeholder
  help?: string;                    // Optional help text
  options?: { label: string; value: string }[]; // For select/radio/checkbox
  validate?: (value: any) => string | null; // Custom validator (return error msg or null)
  span?: 1 | 2;                    // Column span (for two-column layout)
}

interface FormStep {
  title: string;                    // Step title
  fields: FormField[];              // Fields in this step
}
```

### Visual Structure

```
Single-Column Form:
┌────────────────────────────┐
│ Form Title                 │
│ Form subtitle (optional)   │
├────────────────────────────┤
│ Label *               ✓    │
│ Help text below field      │
│                            │
│ Label *               ✗    │
│ Error message in red       │
│                            │
│ Label                      │
│ ○ Option 1                │
│ ○ Option 2                │
│                            │
│ [Cancel] [Submit]        │
└────────────────────────────┘

Multi-Step Form Progress:
○ Step 1 — ○ Step 2 — ○ Step 3
(Active: filled Primary, text bold)
(Completed: Success checkmark)
(Inactive: Gray hollow circle)
```

### Keyboard Navigation

| Key | Behavior |
|-----|----------|
| Tab | Move to next field |
| Shift+Tab | Move to previous field |
| Arrow Up/Down | Navigate dropdowns, radio options |
| Enter | Submit form (if no textarea focus) |
| Escape | Close dropdown, cancel modal |
| Space | Toggle checkbox, select radio |

### ARIA Requirements

```tsx
<form role="form" aria-label={title}>
  <h1>{title}</h1>
  
  {/* Progress indicator (if multi-step) */}
  <div aria-label={`Step ${currentStep} of ${steps.length}`}>
    {/* Step circles */}
  </div>
  
  {/* Fields */}
  <div className="form-field">
    <label htmlFor="field-id">
      {label}
      {required && <span aria-label="required">*</span>}
    </label>
    <input
      id="field-id"
      aria-required={required}
      aria-invalid={hasError}
      aria-describedby={errorId || helpId}
    />
    {error && (
      <div id={errorId} role="alert">{error}</div>
    )}
    {help && (
      <small id={helpId}>{help}</small>
    )}
  </div>
  
  {/* Submit feedback */}
  {loading && (
    <div role="status" aria-live="polite">
      <Spinner /> Saving...
    </div>
  )}
  
  {/* Success message */}
  {success && (
    <div role="status" aria-live="polite">
      ✓ {successMessage}
    </div>
  )}
  
  {/* Error banner */}
  {submitError && (
    <div role="alert" aria-live="assertive">
      ✗ {submitError}
    </div>
  )}
</form>
```

### Validation States

| State | Visual | ARIA |
|-------|--------|------|
| Empty | Gray border | aria-invalid="false" |
| Filled (Valid) | Gray border, ✓ icon | aria-invalid="false" |
| Focused | Primary outline | aria-invalid="false" |
| Error | Red border, ✗ icon + message | aria-invalid="true" aria-describedby="error-msg" |
| Disabled | Gray background | disabled |

### Design Tokens Used

- **Colors**: Primary, Success, Error, Gray300, Gray400, Gray500, Gray700, White
- **Spacing**: Field gap 16px, section gap 24px, padding 24px
- **Typography**: Title 28px, Label 14px, Body 14px, Help 12px, Error 12px
- **Heights**: Input 40px, Textarea 120px, Button 44px
- **Border Radius**: 6px (inputs), 4px (compact)

### Responsive Behavior

- **Single Column**: Max 600px wide, centered
- **Two Column**: Side-by-side on desktop, stack on mobile
- **Mobile**: Full-width, minimal padding

### Edge Cases

**Required Field**:
- Red asterisk (*) next to label
- `aria-required="true"`
- Validation error if empty on submit

**Custom Validation**:
- Real-time validation on blur
- Error message below field
- aria-invalid + aria-describedby for screen readers

**File Input** (if applicable):
- Max file size: Validate on change
- Allowed types: Define in validation
- Show file preview (for images)

**Date Input**:
- Format: MM/DD/YYYY or localized
- Mobile: Native date picker (type="date")
- Desktop: Calendar icon + input field

### Testing Requirements

```
✓ Render all field types (text, textarea, select, checkbox, radio, date)
✓ Validation: Error messages appear on submit
✓ Required fields: Red asterisk and aria-required
✓ Help text: Displays below field, linked with aria-describedby
✓ Keyboard nav: Tab through fields, Arrow keys in dropdowns
✓ Focus indicators: 2px Primary outline visible
✓ Multi-step: Progress indicator updates on step change
✓ Cancel: Goes back without submitting
✓ Submit: Calls onSubmit handler, shows success message
✓ Error handling: Shows error banner with retry option
✓ Disabled fields: No input possible, cursor not-allowed
✓ Loading: Shows spinner, button disabled during submit
✓ ARIA labels: All fields have proper labels and descriptions
```

### Files to Create/Modify (MC71)

**Create**:
- `src/components/form/FormShell.tsx` (new)
- `src/components/form/FormField.tsx`
- `src/components/form/form-shell.stories.tsx` (Storybook)

**Modify**:
- 5+ pages: admin/settings, staff/announcements/new, provider/scholarships/new, student/applications/new, student/profile

---

## Contract 5: DashboardShell Component

### Purpose
Unified dashboard layout with responsive widget grid, quick actions, and recent activity. Used in 5 role dashboards.

### Props Interface

```tsx
interface DashboardShellProps {
  // Required
  title: string;                    // Dashboard title (role name)
  widgets: DashboardWidget[];       // Widget definitions
  
  // Optional
  subtitle?: string;                // Optional subtitle
  lastUpdated?: Date;               // Last update timestamp
  quickActions?: DashboardAction[]; // Quick action buttons
  recentActivity?: ActivityItem[];  // Recent activity list
  layout?: 'grid' | 'flex';        // Default: grid
}

interface DashboardWidget {
  id: string;
  title: string;
  type: 'summary' | 'card' | 'chart' | 'table'; // Widget type
  value: string | number;           // Large value (for summary)
  unit?: string;                    // Unit text (e.g., "Pending", "Total")
  trend?: 'up' | 'down' | 'neutral'; // Trend indicator
  trendValue?: number;              // Trend number (e.g., "+2 since yesterday")
  color?: 'primary' | 'success' | 'warning' | 'error'; // Badge color
  onClick?: () => void;             // Click handler (if clickable)
  content?: React.ReactNode;        // Custom content
}

interface DashboardAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}

interface ActivityItem {
  id: string;
  timestamp: Date;
  user?: string;
  action: string;
  status?: 'success' | 'warning' | 'error';
}
```

### Visual Structure

```
┌──────────────────────────────────────────┐
│ [Logo] Dashboard  [Title]  🔔 👤 EN/TH  │ Header
├──────────────────────────────────────────┤
│ Sidebar      │ [Summary Widgets Grid]    │ 3 cols desktop
│ ├─Home       │ 23 Pending    15 In Progress │ 2 cols tablet
│ ├─Apps       │ ↓ -2 since    ↑ +3 since    │ 1 col mobile
│ ├─...        │                             │
│              │ [8 Completed] [2 Blocked]   │
│              │                             │
│              │ ┌─ Quick Actions ────────┐ │
│              │ │ [Start Review] [View]   │ │
│              │ │ [New Ann...] [Upload]   │ │
│              │ └─────────────────────────┘ │
│              │                             │
│              │ ┌─ Recent Activity ────────┐│
│              │ │ Date | User | Action   │││
│              │ │ Today | John | Approved││
│              │ │ ...                    │││
│              │ └─────────────────────────┘│
└──────────────────────────────────────────┘
```

### Keyboard Navigation

| Key | Behavior |
|-----|----------|
| Tab | Focus summary widget, action button, nav item |
| Arrow Up/Down | Navigate sidebar items |
| Enter | Click widget, action, or nav item |
| Escape | Close any dropdowns or menus |

### ARIA Requirements

```tsx
<main role="main" aria-label={`${title} Dashboard`}>
  <h1>{title}</h1>
  
  {/* Widgets */}
  <section role="region" aria-label="Summary widgets">
    {widgets.map(widget => (
      <div
        role="region"
        aria-label={widget.title}
        tabIndex={widget.onClick ? 0 : -1}
      >
        <div className="value">{widget.value}</div>
        <div className="unit">{widget.unit}</div>
        {widget.trend && (
          <span aria-label={`Trend: ${widget.trendLabel}`}>
            {trendIcon}
          </span>
        )}
      </div>
    ))}
  </section>
  
  {/* Quick Actions */}
  <section role="region" aria-label="Quick Actions">
    {quickActions.map(action => (
      <button
        aria-label={action.label}
        disabled={action.disabled}
      >
        {action.icon}
        {action.label}
      </button>
    ))}
  </section>
  
  {/* Recent Activity */}
  <section role="region" aria-label="Recent Activity">
    <table role="grid">
      {/* Activity rows */}
    </table>
  </section>
</main>
```

### Design Tokens Used

- **Colors**: Primary, Gray50, Gray100, Gray200, Gray500, Gray700, White
- **Spacing**: md 16px (card padding), lg 24px (gap between cards), xl 32px (page padding)
- **Typography**: Headline 28px (title), Title 20px (widget title), Body 14px
- **Heights**: Widget 120px (sm), 160px (md), 200px (lg)
- **Border Radius**: 8px (cards), 4px (buttons)

### Responsive Behavior

- **Desktop**: 3-column widget grid, visible sidebar
- **Tablet**: 2-column grid, collapsible sidebar
- **Mobile**: 1-column grid, hamburger sidebar drawer

### Edge Cases

**No Widgets**:
- Show empty state: "No widgets configured"
- Optional action: "Configure widgets"

**No Activity**:
- Show empty state: "No recent activity"

**Loading**:
- Skeleton widgets while loading
- Spinner in widget, Gray300 background

**Clickable Widget**:
- `onClick` handler
- Cursor: pointer
- Hover: Slight shadow increase
- Focus: 2px Primary outline

### Testing Requirements

```
✓ Render all 5 role dashboards (Admin, Staff, Provider, Student, ESQ)
✓ Summary widgets: Display value, unit, trend correctly
✓ Quick actions: Buttons render and click works
✓ Recent activity: Table displays, sortable if applicable
✓ Keyboard nav: Tab focuses elements, Enter activates
✓ Focus indicators: Visible on widgets and buttons
✓ ARIA labels: Dashboard, widgets, sections labeled
✓ Responsive: Grid adjusts for mobile/tablet/desktop
✓ Empty state: Shows correctly when no data
✓ Loading: Skeleton rows visible while loading
✓ Clickable widgets: Click handler called on enter/space
```

### Files to Create/Modify (MC71)

**Create**:
- `src/components/layout/DashboardShell.tsx` (new, expand from Wave 0 if exists)
- `src/components/layout/dashboard-shell.stories.tsx` (Storybook)

**Modify**:
- 5 dashboards: admin/dashboard, staff/dashboard, provider/dashboard, student/dashboard, esq/dashboard

---

## Cross-Component Integration

### Dependency Graph

```
Design Tokens (from MC69)
  ↓
Button (no dependencies)
  ↓
StatusBadge (depends: colors)
  ↓
DataTable (depends: Button, StatusBadge)
FormShell (depends: Button, error patterns)
  ↓
DashboardShell (depends: all above)
```

### Safe Implementation Order for MC71

1. **Button** — Start here, lowest dependencies
2. **StatusBadge** — Depends on colors from tokens
3. **DataTable** — Depends on Button, StatusBadge
4. **FormShell** — Depends on Button, validation patterns
5. **DashboardShell** — Depends on all above

---

## Approval

**Component Contracts**: ✅ **COMPLETE & READY FOR MC71 IMPLEMENTATION**

All 5 core components have detailed specifications, prop interfaces, accessibility requirements, design token mappings, and testing requirements.

**Next Step**: MC71 (Create all components based on these contracts)

---

**Document Generated**: 2026-05-21  
**Contract Lead**: Claude Haiku 4.5  
**Status**: ✅ CONTRACTS FINALIZED FOR IMPLEMENTATION

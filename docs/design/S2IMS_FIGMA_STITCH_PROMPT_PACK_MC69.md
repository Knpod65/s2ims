# S²IMS Figma/Stitch Prompt Pack — MC69

Design briefs for AI-assisted design tool generation (Figma AI, Stitch, or similar). Each brief specifies exact layout, components, and interaction model to guide design generation.

---

## Overview

This pack contains 14 design briefs, one for each major surface or role journey. Each brief is written to be actionable in Figma's AI features or similar design-to-code tools (Stitch, TailwindCSS generators, etc.).

**How to Use**:
1. Copy a design brief into Figma's AI design prompt
2. Customize with role-specific colors/text (role name, action labels)
3. Generate initial design
4. Refine spacing, typography, accessibility (color contrast, focus indicators)
5. Export to Figma component library
6. Hand off to dev team for component extraction

---

## Brief 1: Enhanced Dashboard Shell (DashboardShell)

### Context
**Used in**: Admin, Staff, Provider, Student, ESQ dashboards
**Reuse Count**: 5 dashboards
**Goal**: Unified, accessible dashboard layout for all roles

### Design Brief

```
Create a responsive dashboard layout with the following structure:

HEADER (Full Width, Fixed at Top):
- Left side: Role icon/avatar + "Dashboard" label
- Center: Page title (e.g., "Admin Dashboard", "Staff Dashboard")
- Right side: Last updated timestamp, Help icon, Language toggle (EN/TH), Notifications bell, User menu

MAIN CONTENT AREA (Flex Layout):
- Left sidebar (optional, hidden on mobile): Navigation menu with role-specific items
  - Items: Dashboard, [Role-Specific Pages], Settings, Logout
  - Selected state: Bold + primary color background
  - Keyboard nav: Tab/Arrow keys to navigate

- Main area (responsive grid):
  
  SECTION 1: SUMMARY WIDGETS (Grid, 2-3 per row on desktop, 1 on mobile)
  - Widget Type: SummaryWidget
    - Card: White background, subtle shadow, rounded corners (8px)
    - Content:
      - Large number (Primary color, bold, 28px)
      - Label below (Gray500, 14px)
      - Trend indicator (optional: ↑↓ with Green/Red)
      - Example: "23 Pending Applications" with ↓ -2 since yesterday
    - Spacing: 16px padding inside card, 24px gap between cards
    - Hover: Slight shadow increase, cursor pointer (if clickable)
    - Focus: 2px solid Primary outline (keyboard access)
    - Responsive: Stack on mobile, 2 cols on tablet, 3+ on desktop
  
  SECTION 2: QUICK ACTIONS (Card with Button Grid)
  - Card: White background, subtle shadow, 16px padding
  - Title: "Quick Actions" (20px, semi-bold)
  - Buttons: Grid layout (3-4 per row on desktop, 1-2 on tablet, 1 on mobile)
    - Button style: Secondary (Gray300 border, Gray700 text)
    - Button text: Verb-first ("Start Review", "View Applications", "New Announcement")
    - Size: 44px height (touch-friendly minimum)
    - Spacing: 12px between buttons
    - Hover: Primary color border
    - Focus: 2px Primary outline

  SECTION 3: RECENT ACTIVITY (Table or Timeline)
  - Card: White background, 16px padding
  - Title: "Recent Activity" (20px, semi-bold)
  - Content: Last 5-10 events
    - If table: Columns (Date/Time, User/Role, Action, Status)
    - If timeline: Vertical list with icons + text
    - Styling: Alternating row backgrounds (white + Gray50) for table
    - Focus: Full row highlight on keyboard focus
    - Keyboard nav: Arrow keys between rows, Enter to expand

SPACING & STYLING:
- Page padding: 24px on desktop, 16px on tablet, 12px on mobile
- Gap between sections: 32px
- Card spacing: 24px
- All borders: 1px Gray200 or subtle shadow (no hard borders)
- Background: White or Gray50
- Corner radius: 8px for all cards
- Shadow: subtle (0 1px 3px rgba(0,0,0,0.1))

ACCESSIBILITY:
- Color contrast: All text 4.5:1 minimum (Gray700 on White)
- Focus indicators: 2px solid Primary on all interactive elements
- Keyboard nav: Tab through sections, Arrow keys within sections
- ARIA labels: 
  - dashboard role="main" aria-label="[Role] Dashboard"
  - widget role="region" aria-label="[Widget Name]"
  - button aria-label="[Action Description]"
- Empty state: Show message "No data available" with Gray400 text

RESPONSIVE BREAKPOINTS:
- Mobile (< 640px): 1 column, full-width cards, hidden sidebar
- Tablet (640-1024px): 2 columns for widgets, 1-column for sections
- Desktop (> 1024px): 3+ columns for widgets, sidebar visible

INTERACTION PATTERNS:
- Click summary widget: Navigate to detail page (if applicable)
- Click quick action button: Trigger action or navigate
- Keyboard: Tab to focus, Arrow keys in tables, Enter to activate, Escape to close modals
- Loading state: Spinner in widget, Gray300 skeleton background
- Error state: Red border + error icon + error message (role="alert")
- Empty state: Gray icon + "No data available" message

EXAMPLE LAYOUT (Desktop):
┌─────────────────────────────────────────────────────────┐
│ [Logo] Dashboard    [Title]        [Time] 🔔 👤           │
├─────────────────────────────────────────────────────────┤
│ Navigation │  Summary Widget 1  │ Summary Widget 2  │    │
│   ├─Home   │ 23 Pending         │ 15 In Progress    │    │
│   ├─Apps   │ ↓ -2 since yesterday│ ↑ +3 since yesterday│ │
│   ├─...    │                     │                   │    │
│            │ Summary Widget 3    │ Summary Widget 4  │    │
│            │ 8 Completed         │ 2 Blocked         │    │
│            │                     │                   │    │
│            ├─────────────────────────────────────────┤    │
│            │ Quick Actions                           │    │
│            │ [Start Review] [View Apps] [New Ann...] │    │
│            │ [Upload Data]  [Settings]               │    │
│            ├─────────────────────────────────────────┤    │
│            │ Recent Activity                         │    │
│            │ Date    | User | Action | Status        │    │
│            │ Today   | John | Approved | ✓           │    │
│            │ ...                                     │    │
└─────────────────────────────────────────────────────────┘
```

### Design Tokens

**Colors**: Primary (#3B82F6), Secondary (#8B5CF6), Success (#10B981), Gray50, Gray200, Gray500, Gray700, White

**Typography**: Headline 28px, Title 20px, Body 14px, SmallText 12px

**Spacing**: xs 4px, sm 8px, md 16px, lg 24px, xl 32px

**Rounded**: 8px for cards, 4px for buttons, 2px for inputs

---

## Brief 2: DataTable Component (Sortable, Filterable, Keyboard-Accessible)

### Context
**Used in**: Admin audit log, Staff applications, Staff matching, Staff follow-up, Staff disclosures, Provider scholarships, Student applications, Student notifications, ESQ history (9 tables total)

**Goal**: Single reusable, accessible table component with sort/filter/pagination

### Design Brief

```
Create a data table component with the following features:

TABLE STRUCTURE (Responsive):
- Desktop: Traditional table layout (HTML table with thead, tbody)
- Mobile: Card layout (1 row = 1 card, stackable)
- Tablet: Horizontal scroll table OR card layout (user preference)

HEADER ROW (Sticky on scroll):
- Background: Gray100 (light background to distinguish headers)
- Text: Gray700, bold, 14px
- Sortable columns: Show ↑↓ icon, highlight on hover
  - Click header: Sort ascending / descending / unsorted (3 states)
  - Current sort: Show ↑ (ascending) or ↓ (descending) icon
  - Keyboard: Focus header, Enter/Space to sort
- Column alignment: Left-align text, right-align numbers, center-align icons/badges
- Border: 1px Gray200 bottom border

DATA ROWS:
- Background: White (alternating White/Gray50 for scannability)
- Text: Gray700, 14px
- Height: 48px minimum (touch-friendly)
- Hover state: Gray50 background (entire row)
- Selection checkbox (if applicable): Left-aligned checkbox, styled as primary color on select
- Status badge (if applicable): Right-aligned, color-coded (Success/Warning/Error/Neutral)

INTERACTIVE CELLS:
- Links: Primary color, underline on hover
- Buttons/actions: Secondary button style, 32px height
  - Inline actions: Icon button (no text) or text button
  - Dropdown actions: Overflow menu (···) with modal/popover
  - Keyboard: Tab to focus, Enter to activate, Arrow to navigate dropdown
- Edit mode (if applicable): Input field with Save/Cancel buttons

PAGINATION:
- Style: Centered below table, Gray500 text
- Format: "Showing 1–20 of 150" + Previous/Next buttons
- Previous/Next buttons: Gray300 border, Gray700 text, disabled state (Gray200) when at start/end
- Jump to page (optional): Input field for page number
- Page size selector: Dropdown (Show 10/20/50/100 per page)
- Keyboard: Tab to buttons, Enter to navigate, Arrow/number keys in input

FILTERING & SEARCH:
- Search input: Above table, placeholder "Search by [field name]"
  - Keyboard: Type to filter in real-time
  - Clear button (X): Visible when text entered
- Filter dropdowns (if multi-column filtering):
  - Dropdown style: Gray300 border, 44px height
  - Options: Label + count (e.g., "Pending (23)")
  - Multi-select: Checkboxes in dropdown
  - Apply button: Primary style
- Filter badges: Below search, showing active filters with X to clear

EMPTY STATE:
- Icon: Large gray icon (e.g., folder icon for empty list)
- Text: Gray400, 16px, "No data matching your filters"
- Action: Link to clear filters or create new item (if applicable)
- Accessibility: role="status" aria-live="polite"

LOADING STATE:
- Skeleton rows: Gray200 shimmer effect, same height as normal rows
- Show 5 skeleton rows while loading
- Spinner in center with "Loading..." text
- Keyboard: Still tab-able, but buttons disabled during load

ACCESSIBILITY:
- Table role="grid" aria-label="[Table Name]"
- Sortable header: button role, aria-sort="ascending|descending|none"
- Keyboard navigation:
  - Tab: Move between rows
  - Arrow Up/Down: Navigate rows
  - Arrow Left/Right: Navigate cells (if edit mode)
  - Enter: Activate action, edit row
  - Escape: Close dropdown, cancel edit
- ARIA labels:
  - th aria-label="[Column Name], sortable"
  - tr aria-label="Row [N]"
  - td aria-label="[Column Name]: [Value]"
- Column headers: Use <th> with scope="col"
- No zebra striping alone: Use light background colors + border (better accessibility)

RESPONSIVE DESIGN:
- Desktop (> 1024px): Full table layout
- Tablet (640-1024px): Horizontal scroll OR card layout per user preference
- Mobile (< 640px): Card layout
  - Card: One row per card, White background, 16px padding
  - Label + Value on separate lines
  - Actions: Full-width buttons or dropdown icon
  - Example card:
    ┌──────────────┐
    │ Name: John   │
    │ Status: Pending
    │ Date: Today  │
    │ [View] [Edit]│
    └──────────────┘

INTERACTION PATTERNS:
- Row expand (if detail view):
  - Click row or [Details] button: Expand to show more info below row
  - Keyboard: Focus row, Enter to expand, Escape to collapse
  - Icon: Chevron (> or ∨) to indicate expandable
- Bulk actions:
  - Checkbox header: Select all / deselect all
  - Checkboxes on rows: Select individual
  - Bulk action bar: Appears above table when rows selected
    - Action buttons: Delete, Archive, Export, etc.
    - Keyboard: Tab to actions, Enter to confirm

EXAMPLE LAYOUT (Desktop):
┌─────────────────────────────────────────┐
│ [Search Box] [Filter ▼] [Clear Filters]│
├─────────────────────────────────────────┤
│ ☐ Name ↑ │ Status  │ Updated  │ Action│
├─────────────────────────────────────────┤
│ ☐ John   │ Pending │ Today    │ [···] │
│ ☐ Jane   │ Approved│ Yesterday│ [···] │
│ ☐ Bob    │ Blocked │ 2 days   │ [···] │
├─────────────────────────────────────────┤
│ Showing 1-3 of 150 | Previous [1] 2 Next│
└─────────────────────────────────────────┘
```

### Design Tokens

**Colors**: Gray50, Gray100, Gray200, Gray300, Gray500, Gray700, Primary (#3B82F6), Success, Warning, Error, White

**Typography**: Header 14px bold, Body 14px

**Height**: Row 48px, Header 40px, Pagination 36px

**Spacing**: Cell padding 12px, Row gap 8px

---

## Brief 3: FormShell Component (Multi-Step Form with Validation)

### Context
**Used in**: Admin settings, Staff announcements, Provider new scholarship, Student new application, Student profile edit

**Goal**: Unified form layout with validation, progress, and accessibility

### Design Brief

```
Create a responsive form component with the following structure:

FORM CONTAINER:
- Max width: 600px (single column) or 900px (two-column layout)
- Background: White or Gray50
- Padding: 24px on desktop, 16px on tablet, 12px on mobile
- Border: 1px Gray200 (optional subtle border)
- Corner radius: 8px

HEADER:
- Title: Large (28px, bold, Gray700)
- Subtitle: Optional, small text (14px, Gray500)
- Progress indicator (if multi-step):
  - Horizontal: Step 1 / 3 with filled circles
    - Active step: Primary color, bold number
    - Completed steps: Success color, checkmark
    - Inactive steps: Gray300, hollow circle
  - Keyboard: Not keyboard-interactive, informational only
  - Accessibility: aria-label="Step [N] of [Total]"

FORM FIELDS (Vertically Stacked):
- Field layout (each field):
  - Label: 14px, bold, Gray700, no colon (label already implies it)
    - Required indicator: Red asterisk (*) next to label
    - Accessibility: <label for="[input-id]">
  - Input/textarea/select: 
    - Width: Full width (100%)
    - Height: 40px (input), 120px (textarea)
    - Padding: 12px
    - Border: 1px Gray300, rounded 6px
    - Font: 14px, Gray700
    - Placeholder: Gray400, italic (optional)
    - Focus state: 2px solid Primary outline, Gray200 border
    - Disabled state: Gray200 background, Gray300 text, cursor not-allowed
    - Error state: 2px solid Error border, red text below
  - Error message (if validation failed):
    - Text: 12px, Error color, bold
    - Icon: Red ✗ icon, left-aligned
    - Accessibility: aria-invalid="true" aria-describedby="[error-id]"
    - <div id="[error-id]" role="alert">
  - Help text (optional):
    - Text: 12px, Gray400, below input
    - Accessibility: aria-describedby="[help-id]"
    - Example: "Enter your full name as it appears on documents"
  - Field spacing: 16px between fields

FIELD TYPES:
- Text input: Standard single-line
- Textarea: Multi-line, 120px height, resizable bottom-right
- Select/dropdown: 40px height, Gray300 border
  - Custom dropdown: White background, Gray300 border, Primary on hover, Primary on select
  - Keyboard: Arrow keys to navigate options, Enter to select, Escape to close
- Checkbox group:
  - Label above group: 14px, bold
  - Checkboxes stacked vertically
  - Each checkbox: 18px size, Gray300 border, Primary when checked
  - Keyboard: Tab to first, Arrow keys between, Space to toggle
- Radio group:
  - Same layout as checkbox group, but radio buttons (circles)
  - Only 1 option selectable
- Date input:
  - Format: MM/DD/YYYY or localized
  - Icon: Calendar icon on right
  - Mobile: Native date picker (input type="date")
  - Accessibility: aria-label="[Date Field Name]"

BUTTON ROW (Bottom of Form):
- Layout: Flex, space-between on desktop (Cancel left, Primary right)
- Layout: Stack on mobile (full-width buttons, one per row)
- Buttons:
  - Primary button: "Submit", "Save", "Continue" (Primary color)
    - Size: 44px height, 120px width minimum
    - Keyboard: Tab to focus, Enter to activate
    - Disabled state (if validation incomplete): Gray300 background, cursor not-allowed
  - Secondary button: "Cancel", "Back" (Gray300 border)
  - Size: Same height (44px), matching width
  - Hover: Slight shadow increase, color change
  - Focus: 2px solid Primary outline
- Loading state (if submitting):
  - Spinner inside button, text changes to "Saving..."
  - Disabled: cursor not-allowed, no click interaction
  - Timer (optional): Show "This may take a few seconds"

PROGRESS & VALIDATION FEEDBACK:
- Real-time validation: Show ✓ (green) when field valid, ✗ (red) when invalid
  - Green checkmark: Right side of field, Gray400, only after user exits field
  - Red X: Right side of field, Error color, plus error message below
- Field state indicators:
  - Empty: Gray300 border
  - Filled (valid): Gray200 border, green checkmark
  - Focused: 2px Primary outline
  - Error: 2px Error border, red X + error message
  - Disabled: Gray200 background, strikethrough text (optional)

SUCCESS MESSAGE:
- After form submission, show success banner:
  - Background: Success color (light)
  - Border: 2px Success color left border
  - Icon: Success checkmark, large, Success color
  - Text: Green, 14px, "Form submitted successfully"
  - Action: "View [Item]" link or auto-redirect after 2 seconds
  - Accessibility: role="status" aria-live="polite"

ERROR MESSAGE:
- Submission error banner:
  - Background: Error color (light)
  - Border: 2px Error color left border
  - Icon: Error X, large, Error color
  - Text: Red, 14px, "[Error message]"
  - Action: "[Retry]" link to resubmit
  - Accessibility: role="alert" aria-live="assertive"

ACCESSIBILITY:
- Form role="form" aria-label="[Form Name]"
- Keyboard navigation: Tab through fields in order, Arrow keys in dropdowns/radios
- Focus management:
  - On load: Focus first field
  - On error: Focus first error field, announce error
  - On submit: Show success message, focus success message or redirect
- Labels: Every input must have <label for="[id]">
- Required fields: Marked with red * and aria-required="true"
- Validation messages: role="alert" aria-live="assertive" (announced immediately)
- Group labels: <fieldset><legend> for checkbox/radio groups

RESPONSIVE DESIGN:
- Desktop (> 1024px): Single column (max 600px wide), centered on page
- Tablet (640-1024px): Single column, full-width with padding
- Mobile (< 640px): Single column, full-width, minimal padding
- Two-column form layout (if applicable, e.g., first name + last name):
  - Desktop: Side-by-side (calc(50% - 8px) width each)
  - Tablet: Side-by-side if space, else stack
  - Mobile: Always stack (full-width each field)

EXAMPLE LAYOUT (Desktop):
┌─────────────────────────────────┐
│ Create New Scholarship           │
│ Step 1 of 3                      │
├─────────────────────────────────┤
│ Name * __________ ✓             │
│ Help text: Enter scholarship    │
│                                 │
│ Amount * __________ 2000000     │
│ Error text: Amount required ✗   │
│                                 │
│ Description                     │
│ ________________                │
│ ________________                │
│                                 │
│ Status *                        │
│ ○ Draft                         │
│ ○ Published                     │
│                                 │
│ [Cancel] [Continue] ►           │
└─────────────────────────────────┘
```

### Design Tokens

**Colors**: Primary (#3B82F6), Success (#10B981), Error (#EF4444), Gray300, Gray400, Gray500, Gray700, White

**Typography**: Title 28px, Label 14px, Body 14px, Help 12px, Error 12px

**Height**: Input 40px, Textarea 120px, Button 44px

**Spacing**: Field gap 16px, Section gap 24px, Padding 24px

---

## Brief 4–14: Role-Specific Dashboard Briefs

Due to length, these are summarized. Use Brief 1 (DashboardShell) + role-specific content:

### Brief 4: Admin Dashboard Enhanced
- Summary: System health, user counts, recent audit activity
- Widgets: User Count (Total, Active, Inactive), Audit Activity (Events last 24h), System Status (Routes up, Alerts)
- Quick Actions: Import Preview, Export Data, Review Users, Manage Permissions

### Brief 5: Staff Dashboard Enhanced
- Summary: Application queue, matching queue, follow-ups, data quality alerts
- Widgets: Pending Applications (23, ↓2), Matching Queue (15), Follow-ups (8), Data Quality (2 alerts)
- Quick Actions: Review Applications, Start Matching, View Analytics, Upload Data

### Brief 6: Provider Dashboard Enhanced
- Summary: Scholarship portfolio, candidate count, match metrics
- Widgets: Active Scholarships (12), Total Candidates (458), Avg Match Score (78%), Recent Matches (5 this month)
- Quick Actions: New Scholarship, View Portfolio, Export Impact Data

### Brief 7: Student Dashboard Enhanced
- Summary: Application progress, profile completion, recommendations
- Widgets: Open Applications (3), Submitted (2), Profile Completion (85%), Recommended Scholarships (7)
- Quick Actions: Start New Application, Improve Profile, View Recommendations

### Brief 8: ESQ Dashboard Enhanced
- Summary: Review queue, pending items, activity
- Widgets: Pending Reviews (12), Completed This Month (34), Avg Review Time (8 min)
- Quick Actions: Start Review, View History

### Brief 9–14: Individual Page Designs
- Brief 9: Admin Audit Log Table (DataTable with filtering, sorting, keyboard nav)
- Brief 10: Staff Applications Table (DataTable, status badges, row expand)
- Brief 11: Student New Application Form (FormShell, 5-step wizard, real-time validation)
- Brief 12: Provider Scholarships List (DataTable, quick actions, bulk operations)
- Brief 13: Student Profile Completion (Progress bar, section breakdown, next-step guidance)
- Brief 14: Matching Review Queue (DataTable, match score display, decision controls)

---

## Using These Briefs in Design Tools

### In Figma AI:
1. Copy Brief 1-3 into Figma's "Design with AI" prompt
2. Customize role names, colors, action labels
3. Generate initial design
4. Refine spacing, colors, typography
5. Create component library (DashboardShell, DataTable, FormShell)
6. Export to Figma file for team review

### In Stitch (Framer, etc.):
1. Use Briefs as code prompts (Stitch generates Tailwind/React code)
2. Customize styling tokens (colors, spacing)
3. Generate component code
4. Integrate with React project

### For Design-to-Code Tools:
1. Use Briefs as specifications
2. Each brief maps to 1-2 components
3. Accessibility requirements built into brief (WCAG AA standards)
4. Output: React components + Tailwind CSS + Storybook stories

---

## Summary: Briefs for Handoff

| Brief | Component | Pages | Effort | Priority |
|-------|-----------|-------|--------|----------|
| 1 | DashboardShell | 5 dashboards | 1-2 days | P1 Wave 1 |
| 2 | DataTable | 9 tables | 2-3 days | P1 Wave 1 |
| 3 | FormShell | 5 forms | 1-2 days | P1 Wave 1 |
| 4-8 | Role Dashboards | 5 pages | 1-2 days (per role, reuse DashboardShell) | P1 Wave 1 |
| 9-14 | Page Designs | 6 pages | 3-4 days (per page, reuse components) | P1 Wave 1 |

**Total Design Time**: ~15-20 hours (2-3 days with designer focus)

**Code Implementation Time** (after designs): ~10-15 days (component extraction + page integration)

**Handoff Package**: Figma file (components) + Storybook (component docs) + Accessibility checklist

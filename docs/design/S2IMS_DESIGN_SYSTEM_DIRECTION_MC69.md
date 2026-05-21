# S²IMS Design System Direction — MC69

Strategic design system recommendations for consistent, accessible, role-based UX across all 54 pages.

---

## 1. Layout System

### Current State
- Inconsistent dashboard layouts across admin, staff, provider, student, ESQ roles
- No unified DashboardShell pattern
- Navigation inconsistent (sidebar vs. top nav)
- Spacing, padding, margins vary across pages

### Recommended System

**DashboardShell Component** (for all dashboards)
```
DashboardShell {
  header: {
    title: string
    subtitle?: string
    lastUpdated?: timestamp
  }
  
  widgets: Widget[] {
    - SummaryWidget (counts, metrics)
    - QuickActionsWidget (call-to-action buttons)
    - RecentActivityWidget (last N events)
    - AlertWidget (warnings, system status)
  }
  
  layout: "grid" | "flex" | "auto"
  spacing: {
    gap: "16px | 24px | 32px"  // between widgets
    padding: "16px | 24px"      // inside cards
  }
}
```

**Consistent Spacing Tokens**
- xs: 4px (internal spacing)
- sm: 8px (button padding, icon spacing)
- md: 16px (card padding, widget gap)
- lg: 24px (dashboard gap, section margin)
- xl: 32px (top-level spacing)

**Responsive Breakpoints**
- Mobile: < 640px (1 column, full-width cards)
- Tablet: 640–1024px (2 columns, stacked where needed)
- Desktop: > 1024px (3-4 columns, full layout)

---

## 2. Navigation System

### Recommended Pattern

**Role-Based Navigation Bar**
```
NavBar {
  left: [
    Logo (click → /[role]/dashboard)
    Breadcrumb (current page path)
  ]
  
  center: [
    PrimaryNav (role-specific menu items)
  ]
  
  right: [
    SearchBar (optional for staff/admin)
    LanguageToggle (EN / TH)
    NotificationBell (unread count badge)
    UserMenu (Profile, Settings, Logout)
  ]
  
  mobile: HamburgerMenu (collapses all nav to drawer)
}
```

**Role-Specific Navigation**
- Admin: Dashboard, Audit Log, Users, Permissions, Settings, Export, Master Data
- Staff: Dashboard, Applications, Matching Review, Announcements, Analytics, Data Quality, OCR, Follow-up, Disclosures
- Provider: Dashboard, Scholarships, Candidates, Impact, Insights, Outcomes
- Student: Dashboard, Scholarships, Applications, Profile, Recommendations, Notifications, Follow-up
- ESQ: Dashboard, Review History, Announcements Review

**Mobile Navigation** (Drawer)
- Hamburger menu (top-left)
- Full nav list in drawer
- Close on selection or X button
- Last-used role persisted (for users with multiple roles)

---

## 3. Component Library

### Existing Components (Inventory)
| Component | Current Count | Current Files | Status | Consolidation Target |
|-----------|---|---|---|---|
| DataTable | 12+ | table.tsx, cell.tsx, header.tsx | Inconsistent styling | Consolidate to 1 DataTable |
| Form | 8+ | form.tsx, input.tsx, textarea.tsx, select.tsx | Some missing validation | Extract FormShell |
| Card | 15+ | card.tsx, dashboard-card.tsx, info-card.tsx | Naming inconsistent | Standardize (1 Card component) |
| Badge | 6+ | badge.tsx, status-badge.tsx, priority-badge.tsx | Scattered usage | Standardize (1 StatusBadge) |
| Button | 4+ | button.tsx, icon-button.tsx, fab.tsx | Sizing/styling inconsistent | Consolidate (1 Button + variants) |
| Modal | 3+ | modal.tsx, dialog.tsx, alert-dialog.tsx | Low usage | Keep 1 Modal, remove duplicates |
| Notification | 5+ | toast.tsx, alert.tsx, banner.tsx | Styling inconsistent | Standardize (1 Notification system) |
| Dropdown | 3+ | dropdown.tsx, menu.tsx, select.tsx | Keyboard nav missing | Add to all dropdowns |

### Recommended Consolidation
```
src/components/
├── layout/
│   ├── DashboardShell.tsx        (NEW - used in 5 dashboards)
│   ├── FormShell.tsx             (NEW - used in 5 forms)
│   ├── AppShell.tsx              (EXISTING - top-level layout)
│   └── NavBar.tsx                (IMPROVE - role-aware nav)
├── table/
│   ├── DataTable.tsx             (CONSOLIDATE - 12 tables → 1)
│   ├── DataTableCell.tsx
│   ├── DataTableHeader.tsx
│   └── DataTablePagination.tsx
├── form/
│   ├── FormField.tsx             (IMPROVE - add error display)
│   ├── FormInput.tsx
│   ├── FormTextarea.tsx
│   ├── FormSelect.tsx
│   ├── FormCheckbox.tsx
│   └── FormValidation.tsx        (NEW - reusable validation UI)
├── ui/
│   ├── Button.tsx                (CONSOLIDATE - 4 variants → 1)
│   ├── Card.tsx                  (STANDARDIZE - 3 types → 1)
│   ├── StatusBadge.tsx           (CONSOLIDATE - 6 badges → 1)
│   ├── Modal.tsx                 (KEEP 1)
│   ├── Notification.tsx          (CONSOLIDATE - 5 types → 1)
│   ├── Dropdown.tsx              (CONSOLIDATE - 3 types → 1)
│   ├── Avatar.tsx
│   ├── Spinner.tsx
│   └── Icon.tsx
└── role-specific/ (optional for role-unique components)
    ├── MatchingScoreDisplay.tsx
    ├── ApplicationStatusFlow.tsx
    ├── PrivacyMaskingBadge.tsx
    └── AuditTrailWidget.tsx
```

### Design System Goals
- **Reduce Component Duplication**: 82 components → ~50 core + role-specific (~40% reduction)
- **Improve Consistency**: Single Button/Card/Badge/DataTable across all pages
- **Enhance Accessibility**: Add keyboard nav, ARIA, focus indicators to all reusable components
- **Standardize Naming**: card.tsx, info-card.tsx, dashboard-card.tsx → Card.tsx with variants
- **Document Variants**: Button (primary, secondary, danger), Badge (success, warning, error), etc.

---

## 4. Typography & Copy

### Type Scale
```
Display1:     48px / bold / line-height 1.1    (page titles, h1)
Display2:     36px / bold / line-height 1.2    (section headers, h2)
Headline:     28px / semi-bold / line-height 1.3  (subsections, h3)
Title:        20px / semi-bold / line-height 1.4  (card titles, form labels)
Subtitle:     16px / medium / line-height 1.5     (secondary text, field labels)
Body:         14px / regular / line-height 1.6    (paragraph text, table cells)
SmallText:    12px / regular / line-height 1.5    (helper text, captions, tooltips)
Mono:         13px / regular / monospace           (code, IDs, technical text)
```

### Font Family
- **Default**: Inter (or system sans-serif fallback)
- **Monospace**: Monaco, Courier New (for code blocks, IDs)
- **Thai**: NotoSansThai (subset for Thai UI text)

### Copy Standards
**English–Thai Consistency**
- Keep copy concise (UI text, not prose)
- Labels: Title Case (Button, "Start Review", "View Details")
- Field labels: Lowercase start ("email address", "scholarship name")
- Buttons: Verb-first ("Save Changes", "Delete Application", "Mark as Read")
- Error messages: Clear and actionable ("Email is required", "Password must be at least 8 characters")
- Help text: Brief explanations in SmallText below field or tooltip

**Hard-Coded Text Removal** (Phase 2)
- Current: ~150+ hard-coded strings across pages
- Target: Move to i18n dictionary (react-i18next or similar)
- Quick wins: Menu labels, button text, form labels (P2 priority)
- Future: All user-facing text (P3, after Phase 1 consolidation)

### Example: Form Field with I18n
```tsx
<FormField>
  <label>{t("forms.scholarshipName")}</label>
  <input placeholder={t("placeholders.scholarshipName")} />
  <small>{t("help.scholarshipName")}</small>
</FormField>
```

---

## 5. Color Palette & Visual Hierarchy

### Core Colors
```
Primary:       #3B82F6 (blue, 500)    - Actions, links, focus indicators
Secondary:     #8B5CF6 (purple, 500)  - Emphasis, alternates
Success:       #10B981 (green, 500)   - Approved, positive feedback
Warning:       #F59E0B (amber, 500)   - Caution, review needed
Error:         #EF4444 (red, 500)     - Rejected, error state
Info:          #0EA5E9 (cyan, 500)    - Information, neutral action

Neutral:
  Gray50:      #F9FAFB             - Lightest background
  Gray100:     #F3F4F6             - Light background
  Gray200:     #E5E7EB             - Input borders, dividers
  Gray300:     #D1D5DB             - Disabled state, subtle borders
  Gray400:     #9CA3AF             - Secondary text
  Gray500:     #6B7280             - Primary text (body)
  Gray600:     #4B5563             - Dark text, labels
  Gray700:     #374151             - Darkest text
  Gray900:     #111827             - Pure black (avoid; use Gray700)
```

### Application
- **Background**: Gray50 or White
- **Cards**: White with subtle shadow (Gray100 border optional)
- **Primary Buttons**: Primary on White
- **Secondary Buttons**: Gray300 border, Gray700 text
- **Status Badges**: 
  - Success: Green background, white text
  - Warning: Amber background, dark text
  - Error: Red background, white text
  - Info: Cyan background, dark text
  - Neutral: Gray200 background, Gray700 text
- **Links**: Primary color, underline on hover
- **Focus Indicators**: 2px solid Primary (ring around element)

### Dark Mode (Optional Phase 3)
- Not currently scoped for MC69
- Recommended future task: media query `prefers-color-scheme: dark`
- Would require color token mapping (light ↔ dark pairs)

---

## 6. Accessibility Standards (WCAG 2.1 AA)

### Current Compliance
- **Overall**: ~72% of pages WCAG AA compliant
- **Keyboard Navigation**: 40% of pages (missing on tables, forms)
- **Color Contrast**: 85% of pages (some text too light)
- **ARIA Labels**: 50% of interactive elements labeled
- **Screen Reader**: 30% optimized for screen reader navigation

### Target for MC69 Renovation
- **Overall**: 100% WCAG AA compliant
- **Keyboard Navigation**: 100% of interactive pages (DataTable, forms, dropdowns)
- **Color Contrast**: 100% (WCAG AA minimum 4.5:1 for text)
- **ARIA Labels**: 100% of interactive elements
- **Screen Reader**: 80%+ (reasonable effort, not 100% optimal yet)

### Keyboard Navigation Standards
| Element | Behavior |
|---------|----------|
| Button | Tab to focus, Enter/Space to activate |
| Link | Tab to focus, Enter to follow |
| Dropdown | Tab to focus, Arrow Down/Up to navigate, Enter to select, Escape to close |
| DataTable | Tab between rows, Arrow keys within row, Enter to expand/edit |
| Modal | Tab cycles within modal, Escape to close, focus returned to trigger |
| Form | Tab through fields, Shift+Tab to go back, Enter to submit (if no textarea) |
| Checkbox | Tab to focus, Space to toggle, Arrow keys in group |
| Radio | Tab to first, Arrow keys between options, Space to select |

### ARIA Standards
```
DataTable {
  table role="grid"
  thead role="rowgroup"
  tbody role="rowgroup"
  tr role="row"
  td role="gridcell" aria-label="[content description]"
  td[aria-sort="ascending|descending|none"] (sortable columns)
  td aria-label="[column name]: [value]"
}

Form {
  input aria-label="[field name]" aria-required="true"
  input aria-invalid="true" aria-describedby="error-message"
  div id="error-message" role="alert" (error text)
  fieldset (for grouped inputs like radio/checkbox)
}

Navigation {
  nav aria-label="Main navigation"
  button aria-current="page" (current page link in nav)
}

Modal {
  div role="dialog" aria-modal="true" aria-labelledby="modal-title"
  h2 id="modal-title" (modal title)
}

Notification {
  div role="alert" aria-live="polite" (for toast/banner)
  role="alert" aria-live="assertive" (for urgent errors)
}

Disclosure {
  button aria-expanded="true|false"
  button aria-controls="panel-id" (toggle panel)
  div id="panel-id" (content being toggled)
}
```

### Focus Management
- Focus outline: 2px solid Primary color (avoid outline: none)
- Focus visible only on keyboard (not mouse; use :focus-visible)
- Focus visible on all interactive elements (buttons, links, inputs, tabs)
- Focus trap in modals (cycle within modal, Escape to close)
- Focus restoration when modal closes (return to trigger button)

### Color Contrast Requirements
| Text Type | Requirement | Example |
|-----------|---|---|
| Body text | 4.5:1 (AA) | Gray700 (#374151) on White, Gray100 on White |
| Large text (18px+) | 3:1 (AA) | Gray500 on White (not acceptable for body) |
| Disabled state | 3:1 (AA) | Gray300 on White (acceptable; lower contrast OK for disabled) |
| Links | 4.5:1 (AA) | Primary (#3B82F6) on White |
| Buttons | 4.5:1 (AA) | White on Primary (#3B82F6) |

### Internationalization (i18n) Standards

**Current State**: English + Thai, some hard-coded text

**Target for MC69**: English + Thai + framework for additional languages

**Directory Structure**
```
src/locales/
├── en/
│   ├── auth.json        (login, role selection, logout)
│   ├── forms.json       (form labels, validation errors)
│   ├── tables.json      (column headers, actions, empty states)
│   ├── notifications.json  (success, error, warning messages)
│   ├── navigation.json   (menu items, breadcrumbs)
│   └── help.json        (tooltips, help text)
└── th/
    ├── auth.json
    ├── forms.json
    ... (same structure)
```

**Translation Key Naming Convention**
```
[domain].[context].[element]
Examples:
  forms.scholarshipName.label = "Scholarship Name"
  forms.scholarshipName.error.required = "Scholarship name is required"
  tables.applications.columns.status = "Status"
  notifications.success.applicationSaved = "Application saved successfully"
```

**Screen Reader Optimization** (Phase 3)
- Announce page section changes (aria-live regions)
- Skip to main content link
- Landmark regions (nav, main, aside, footer)
- Page titles: "[Page Name] — S²IMS"
- Headings: Proper hierarchy (h1 → h2 → h3, no h2 after h1 after h4)
- Lists: Use ul/ol instead of divs for lists
- Tables: Use proper th, td, thead, tbody for data tables

---

## 7. Responsive Design

### Mobile-First Approach
- Design for mobile (< 640px) first, then tablet, then desktop
- Touch targets: minimum 44×44px (accessibility standard)
- Spacing: Increase on mobile for finger-friendly taps
- Columns: Single column on mobile, 2 on tablet, 3+ on desktop

### Responsive Breakpoints
```
sm: 640px    (tablets landscape / small desktop)
md: 768px    (tablets portrait / larger desktop)
lg: 1024px   (desktop)
xl: 1280px   (large desktop)
2xl: 1536px  (very large desktop)
```

### Mobile Considerations
- **Navigation**: Drawer menu (hamburger) instead of sidebar
- **Tables**: Horizontal scroll or card layout (not data table)
- **Forms**: Full-width inputs, stacked fields
- **Dashboards**: Single column, widget reorder
- **Modals**: Full-screen or fullwidth + padding (avoid small popups)
- **Text**: Increase font size slightly for readability (14px → 16px on mobile)

---

## 8. Data Visualization (Charts)

### Current State
- Minimal chart usage (analytics and impact pages only)
- No consistent chart library or styling

### Recommended: Recharts + Tailwind
```
Chart Types:
- LineChart (trends over time: matches/month, activity)
- BarChart (comparisons: criteria effectiveness, role distribution)
- PieChart (composition: application status breakdown)
- AreaChart (trends: enrollment over time)

Styling:
- Color: Use primary color for main line/bar, secondary for comparison
- Legend: Below chart, wrapping on mobile
- Tooltip: Show on hover with clean formatting
- Responsive: Adjust chart height/width based on container (flex-responsive)
- Accessibility: Provide data table alternative for screen readers
```

---

## 9. Theme Configuration (Centralized)

### Recommended: Create src/config/theme.ts
```typescript
export const theme = {
  colors: {
    primary: "#3B82F6",
    secondary: "#8B5CF6",
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
    info: "#0EA5E9",
    gray: {
      50: "#F9FAFB",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6B7280",
      600: "#4B5563",
      700: "#374151",
      900: "#111827",
    },
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  fontSizes: {
    display1: "48px",
    display2: "36px",
    headline: "28px",
    title: "20px",
    subtitle: "16px",
    body: "14px",
    smallText: "12px",
  },
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};
```

### Benefits
- Single source of truth for colors, spacing, fonts
- Easy theme switching (light/dark mode in future)
- Components use `theme.colors.primary` instead of hard-coded `#3B82F6`
- When design changes (e.g., primary color), update 1 file instead of 50+

---

## 10. Implementation Priority & Effort

### Phase 1: Core System (MC69)
1. **DashboardShell** — 1-2 days
   - Used in 5 dashboards (admin, staff, provider, student, ESQ)
   - Effort: 1-2 days
   - Impact: High (consolidates layout inconsistencies)

2. **DataTable Consolidation** — 2-3 days
   - Consolidate 12+ tables into 1 reusable component
   - Add keyboard navigation + ARIA labels
   - Effort: 2-3 days
   - Impact: High (code reduction ~300 LOC, consistency)

3. **FormShell** — 1-2 days
   - Used in 5 forms (admin settings, staff announcements, provider new, student new app, student profile)
   - Add form validation display
   - Effort: 1-2 days
   - Impact: High (reduces form duplication ~200 LOC)

4. **StatusBadge Standardization** — 1 day
   - Consolidate 6 badge types into 1 component with variants
   - Effort: 0.5-1 day
   - Impact: Medium (code reduction ~50 LOC)

5. **Theme Configuration** — 0.5 day
   - Create src/config/theme.ts
   - Update components to use tokens
   - Effort: 0.5 day
   - Impact: Medium (enables future dark mode + global changes)

6. **Typography & I18n Framework** — 1-2 days
   - Extract hard-coded text to i18n dictionaries
   - Create naming convention for translations
   - Effort: 1-2 days
   - Impact: Medium (enables Thai/English, reduces hard-coded text)

7. **Accessibility Baseline** — 2-3 days
   - Add keyboard navigation to all interactive components
   - Add ARIA labels to tables, forms, modals
   - Fix color contrast issues
   - Effort: 2-3 days
   - Impact: High (72% → 100% WCAG AA compliance)

### Phase 2: Polish & Refinement (MC70+)
- Dark mode theme
- Advanced chart library integration
- Screen reader optimization (80% → 100%)
- Component Storybook documentation
- Design tokens documentation

---

## Summary: Design System Impact

| Item | Current State | Target | Effort | Priority |
|------|---|---|---|---|
| Dashboard Layout | Inconsistent | DashboardShell (5 dashboards) | 1-2 days | P1 Wave 1 |
| DataTable | 12 variants | 1 consolidated component | 2-3 days | P1 Wave 1 |
| Forms | 8+ variations | FormShell (5 forms) | 1-2 days | P1 Wave 1 |
| Typography | Varied | Standardized scale | 1 day | P2 Wave 1 |
| Colors | 40+ hard-coded | 10 theme tokens | 0.5 day | P2 Wave 1 |
| I18n | Hard-coded text | Dictionary-based (EN/TH) | 1-2 days | P2 Wave 1 |
| Accessibility | 72% WCAG AA | 100% WCAG AA | 2-3 days | P1 Wave 1 |
| **Total Effort** | **—** | **~11-15 days** | **—** | **—** |

**Code Reduction Opportunity**: ~1,400 LOC of component duplication removal (Phase 1)

**Consolidation Targets**: DashboardShell (400 LOC), DataTable (600 LOC), FormShell (300 LOC), StatusBadge (100 LOC)

**Next Steps**: After MC69 audit approval, Phase 1 implementation targets Wave 1 of role journey redesign with safe, high-impact component consolidation.

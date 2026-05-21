# S²IMS Design Review Checklist — MC72

**Status**: MC72 Design Documentation  
**Date**: 2026-05-21  
**Purpose**: Pre-handoff design review checklist for all S²IMS Figma screens

---

## MC72 Scope Statement

Docs-only. This checklist is for Figma design review only. No runtime code changes. AP-10B/AP-10C/AP-11 remain locked.

---

## How to Use

Run through each section below before marking a Figma screen as ready for handoff to engineering. All items must be ✅ before handoff. Items marked ⚠️ require explanation in the Figma comments.

---

## Checklist 1: Screenshot Comparison (Before / After)

Verify each redesigned screen against its MC68 screenshot reference.

- [ ] Current screenshot referenced (path: `docs/screenshots/mc68-role-based-user-manual/[filename].png`)
- [ ] All key UI elements from current state are preserved or deliberately removed with reason noted
- [ ] New design addresses at least the top 3 issues identified in the MC69 UX audit
- [ ] No functionality was accidentally removed in redesign
- [ ] Route and role match between screenshot reference and Figma frame
- [ ] Navigation structure matches current app (same sidebar items, same order)
- [ ] Empty state is designed (not just the data-filled state)
- [ ] Loading skeleton is designed (not just the loaded state)
- [ ] Error state is designed for any data-dependent views

---

## Checklist 2: Accessibility (WCAG 2.1 AA)

- [ ] **Color contrast — body text**: All gray-700+ text on white background ✅ (exceeds 4.5:1)
- [ ] **Color contrast — secondary text**: gray-500 on white ✅ (4.6:1 — passes AA)
- [ ] **Color contrast — buttons**: White text on blue-500 ✅ (3.3:1 — passes AA large text); verify primary buttons meet 3:1 for text size
- [ ] **Focus ring**: All interactive elements (buttons, links, inputs, checkboxes) have visible focus ring (2px blue-500, 2px offset)
- [ ] **Focus ring**: Focus ring is not clipped by parent overflow:hidden — verify in layout
- [ ] **Keyboard order**: Tab order follows visual reading order (left-to-right, top-to-bottom)
- [ ] **Skip link**: "ข้ามไปยังเนื้อหาหลัก / Skip to main content" is the first focusable element on each page
- [ ] **ARIA landmarks**: `<header>`, `<nav>`, `<main>`, `<aside>` regions are labeled in annotations
- [ ] **Icon-only controls**: Every icon-only button has an `aria-label` annotation in Figma
- [ ] **Status badges**: All StatusBadge components have `role="img"` + `aria-label` annotation
- [ ] **Form fields**: Every input has a visible label (not placeholder-only)
- [ ] **Error messages**: Error state shows message text below field (not just border color change)
- [ ] **Tables**: Column headers are marked as `<th>` in Figma annotations; sort direction indicated visually AND with annotation
- [ ] **Images**: Decorative images are annotated `aria-hidden`; informative images have alt text annotation
- [ ] **Motion**: No animations that flash more than 3 times per second

---

## Checklist 3: Bilingual (Thai / English)

- [ ] **Page title**: Thai H1 present on all pages
- [ ] **Navigation labels**: All sidebar/nav items have Thai label (English in tooltip or sub-label)
- [ ] **Button labels**: All buttons use Thai text (no English-only buttons unless English is the product language for that context)
- [ ] **Form field labels**: Bilingual pattern applied: Thai label (font-medium) + English sub-label (gray-400, 12px)
- [ ] **Status labels**: All StatusBadge labels translated to Thai; English in parentheses on first occurrence per page
- [ ] **Table column headers**: Thai primary with English in parentheses
- [ ] **Empty state messages**: Bilingual — Thai headline + English sub-copy
- [ ] **Error messages**: Thai error text present; English tooltip available
- [ ] **Metric card labels**: Bilingual using "/" separator pattern (e.g., "ใบสมัคร / Applications")
- [ ] **No mixed-language buttons**: A single button does not mix Thai + English in label text
- [ ] **SafetyBanner**: Both Thai and English text present
- [ ] **Dates**: Thai Buddhist Era (พ.ศ.) format used for user-facing dates; API/technical IDs use Gregorian
- [ ] **Numbers**: Arabic numerals used for counts and IDs

---

## Checklist 4: Privacy & PDPA

- [ ] **Student names**: Masked on all Staff/Admin screens using pattern "น. #ST-XXXX" or "นักเรียน #ST-XXXX"
- [ ] **ID card numbers**: Always masked as "X-XXXX-XXXXX-XX-X" — never shown in full in any design
- [ ] **Phone numbers**: Masked as "08X-XXX-XXXX" — never shown in full
- [ ] **Email addresses**: Masked as "xxxx@xxx.com" on screens where student owns data but staff/admin is viewing
- [ ] **Financial data**: No salary, bank account, or family income shown in mock data
- [ ] **Provider visibility**: Provider screens show candidate match score and status — NOT full application essays or ID card data
- [ ] **Student visibility**: Student screens show only that student's own data — no other students visible, no admin metrics
- [ ] **Public screens**: No PII visible on unauthenticated routes — only scholarship metadata
- [ ] **ESQ screens**: Candidate names masked on review screens — only ID and academic data shown
- [ ] **Mock data only**: No real Thai ID numbers, real names, real institution names in designs
- [ ] **Privacy notice**: Any screen with personal data visible has a small "ข้อมูลส่วนบุคคลได้รับการคุ้มครองตาม PDPA" notice in footer or section header

---

## Checklist 5: Governance Boundaries

- [ ] **AP-10B — Confirm Import**: "นำเข้าข้อมูล / Import" button on import-preview route is visually disabled (opacity-50, gray border, no pointer events) with `DisabledActionHint` tooltip
- [ ] **AP-10B — SafetyBanner**: Import-preview route has non-dismissible amber SafetyBanner at top
- [ ] **AP-10C — Export**: All "ส่งออก / Export" buttons are visually disabled with AP-10C notice tooltip
- [ ] **AP-11 — Approve/Reject**: Candidate review demo route has no active Approve/Reject buttons — both disabled with AP-11 notice
- [ ] **AP-11 — SafetyBanner**: Candidate review demo route has non-dismissible amber SafetyBanner at top
- [ ] **ESQ language**: ESQ review uses "แนะนำ / Recommend" not "อนุมัติ / Approve" — no AP-11 implication
- [ ] **Preview badge**: All preview-only screens show a `StatusBadge` status=preview on the PageHeader
- [ ] **No hidden "enable" toggles**: No switch, checkbox, or button in the design can be interpreted as enabling a governance gate
- [ ] **Disabled state is visible, not hidden**: Blocked actions are shown as disabled — not removed from the layout (visibility communicates governance state)

---

## Checklist 6: Component Consistency

- [ ] **Button usage**: All call-to-action buttons use the `Button` component (variant=primary for main action, secondary for secondary, ghost for tertiary, danger for destructive)
- [ ] **Button sizing**: Buttons in similar contexts use consistent sizes (sm for table row actions, md for form submits, lg for hero CTAs)
- [ ] **StatusBadge usage**: All status indicators use `StatusBadge` component — no custom inline colored pills
- [ ] **StatusBadge status mapping**: Status values map correctly to semantic colors (success=green, warning=amber, error=red, etc.)
- [ ] **Token alignment**: Colors used in design match theme.ts tokens — no off-brand grays or blues
- [ ] **Border radius**: Cards use 8px (radius.lg), components use 6px (radius.md), badges use full pill (radius.full)
- [ ] **Shadow**: Cards use shadow-sm only — no heavy drop shadows
- [ ] **Spacing**: Gaps between sections use spacing tokens (16px=md, 24px=lg, 32px=xl) — no arbitrary spacing
- [ ] **Typography scale**: H1=28px, H2=20px, body=14px, small=12px — matches typography tokens
- [ ] **Form inputs**: All inputs are 40px tall (matches Button md height) — consistent with design system
- [ ] **Empty states**: Empty state component used consistently — no blank white areas
- [ ] **Loading states**: Skeleton placeholders used (not blank or spinner-only)

---

## Checklist 7: Stakeholder Review Questions

Before final handoff, confirm answers to these questions with the project team:

**Bilingual priority**:
- [ ] Confirmed: Thai is primary language for all public-facing and government-facing content
- [ ] Confirmed: English secondary labels are acceptable (not required to be full translations)
- [ ] Confirmed: Date format — Thai Buddhist Era for official, Gregorian for system/API display

**Governance gates**:
- [ ] Confirmed: AP-10B, AP-10C, AP-11 gates remain disabled for this release
- [ ] Confirmed: Disabled states are intentional design — not a bug to fix before release
- [ ] Confirmed: SafetyBanners on preview routes are intentional and non-dismissible

**Data privacy**:
- [ ] Confirmed: Masking rules for student PII are consistent with PDPA requirements
- [ ] Confirmed: Mock data patterns (ST-XXXX IDs, masked names) are acceptable for demo/preview state

**Design system**:
- [ ] Confirmed: Button and StatusBadge primitives from MC71 are the source of truth
- [ ] Confirmed: Any deviation from the component library requires a new component contract (future MC)

**Accessibility**:
- [ ] Confirmed: Skip link and ARIA landmark annotations will be implemented in engineering
- [ ] Confirmed: Thai screen reader support has been considered (Thai TTS/AT compatibility)

---

## Sign-Off

**Design Review Status**: ☐ In Progress / ☐ Approved for Handoff

| Screen Group | Screenshot Comparison | Accessibility | Bilingual | Privacy | Governance | Components |
|-------------|----------------------|--------------|----------|---------|-----------|------------|
| Auth / Login | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Admin Dashboard | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Admin Audit Log | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Admin Candidate Review | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Admin Import Preview | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Staff Dashboard | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Staff Applications | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Staff App Detail | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Staff Analytics | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Staff OCR | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Provider Dashboard | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Provider Scholarships | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Provider Candidates | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Student Applications | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| Public Scholarships | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |
| ESQ Review | ☐ | ☐ | ☐ | ☐ | ☐ | ☐ |

---

**Safety Statement**: MC72 is documentation/design-only. This checklist supports Figma design review only. No runtime code changes. AP-10B/AP-10C/AP-11 remain locked.

---

**Document Status**: MC72 Design Documentation  
**Last Updated**: 2026-05-21

# CODEBASE STATUS FOR DESIGN

Project: S2IMS - Scholarship Intelligence & Management System  
Repo: https://github.com/Knpod65/s2ims.git  
Local path: `/Users/kinompungpound/Developer/s2ims`  
Branch: `main`  
Commit inspected: `3849474b0a16870290d49e79706fc8de4350eb67`  
Report date: 2026-05-07  
Design reference: not inspected because no concrete Stitch export path was provided in this turn.

## 1. Current Architecture

S2IMS is currently a Next.js prototype using the App Router.

Core stack:

- Next.js `14.2.3`
- React `18`
- TypeScript `5`
- Tailwind CSS `3.4.1`
- lucide-react icons
- Recharts for charts
- clsx utility
- Mock data only, no backend/API/database integration yet

Important app architecture:

- `src/app/layout.tsx` wraps all pages with `LangProvider` and `AuthProvider`.
- `src/components/layout/AppShell.tsx` provides the authenticated role layout.
- `src/lib/auth.tsx` stores mock role login in `localStorage` under `s2ims_role`.
- `src/lib/i18n.tsx` stores language selection in `localStorage` under `s2ims_lang`.
- `src/lib/navigation.ts` defines role navigation, mobile navigation, role home routes, and role badge colors.
- `src/data/mock/*` is the source of all displayed business data.

There is no API layer, server action layer, database schema, real session management, file storage, or external service integration yet.

## 2. Folder Structure

Top-level folders and files relevant to design:

- `src/app` - App Router pages, layouts, loading states, error and not-found pages
- `src/components/layout` - AppShell, Sidebar, Topbar, MobileBottomNav
- `src/components/ui` - shared primitives such as badges, stat cards, page headers, empty states, skeletons, toast
- `src/components/staff` - staff workflow, privacy, matching, disclosure, document, data-quality components
- `src/components/provider` - provider shortlist and candidate disclosure components
- `src/components/admin` - admin, permission, audit, export, security, access governance components
- `src/components` - shared cards/timeline/profile components
- `src/data/mock` - all mock users, scholarships, applications, announcements, notifications, audit logs, admin data, staff data, provider data
- `src/lib` - auth, i18n, navigation, types, formatting/status utilities
- `messages` - TH/EN message dictionaries
- `tailwind.config.ts` - color, radius, shadow, font, animation tokens
- `src/app/globals.css` - global fonts, dark theme, utility classes, card/button/input/sidebar styles

## 3. Existing Routes

Public:

- `/`
- `/login`
- `/scholarships`
- `/scholarships/[id]`

Student:

- `/student/dashboard`
- `/student/applications`
- `/student/applications/[id]`
- `/student/applications/new`
- `/student/profile`
- `/student/notifications`
- `/student/follow-up`

Staff:

- `/staff/dashboard`
- `/staff/announcements/new`
- `/staff/announcements/[id]/preview`
- `/staff/applications`
- `/staff/applications/[id]`
- `/staff/students/[id]`
- `/staff/ocr`
- `/staff/analytics`
- `/staff/follow-up`
- `/staff/matching-review`
- `/staff/matching-review/[matchId]`
- `/staff/disclosure-requests`
- `/staff/data-quality`

ESQ:

- `/esq/dashboard`
- `/esq/history`
- `/esq/announcements/[id]/review`

Provider:

- `/provider/dashboard`
- `/provider/scholarships`
- `/provider/scholarships/new`
- `/provider/scholarships/[scholarshipId]/edit`
- `/provider/scholarships/[scholarshipId]/criteria`
- `/provider/scholarships/[scholarshipId]/candidates`
- `/provider/candidates`
- `/provider/insights`
- `/provider/impact`
- `/provider/outcomes`

Admin:

- `/admin/dashboard`
- `/admin/users`
- `/admin/permissions`
- `/admin/audit-log`
- `/admin/export`
- `/admin/settings`

Build output confirms 43 app routes including dynamic routes and static routes.

## 4. AppShell/Layout Status

Implemented:

- Shared authenticated shell with topbar, desktop sidebar, mobile bottom navigation, and scrollable content area.
- `requiredRole` prop redirects users to `/login` when role does not match.
- Desktop sidebar is shown at `md` and above.
- Mobile bottom nav is shown below `md`.
- Topbar includes language toggle and notification badge.
- Role badge appears in sidebar.

Important design notes:

- Layout is functional and coherent for a prototype.
- Shell is strongly dark-mode oriented.
- Sidebar width is fixed at `240px`.
- Main content uses `p-4 md:p-6` and bottom padding for mobile nav.
- There is not yet a role-specific AppShell visual theme beyond role badge color.
- No breadcrumb pattern is implemented.
- No global command/search pattern is implemented.
- Topbar title support exists but many pages rely mostly on in-page headers.

## 5. Design System/Tokens Status

Implemented tokens:

- Background tokens: `bg-000` through `bg-400`
- Brand amber: `#F59E0B`, light amber, dim amber
- Ink tokens: `ink-1`, `ink-2`, `ink-3`
- Status colors: info, success, danger, warning, ai, track
- Fonts: Syne, DM Sans, DM Mono, Noto Sans Thai
- Radius tokens: xs, sm, md, lg, xl
- Shadows: card, lifted, glow
- Animations: pulse, ring draw, fade, slide, toast

Implemented utility classes:

- `.card`, `.card-sm`, `.card-hover`
- `.input-base`
- `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-danger`, `.btn-success`
- `.sidebar-item`
- `.page-animate`
- `.deadline-pulse`

Design system gaps:

- Tokens are code-level only; no documented component spec yet.
- Component variants are informal utility classes rather than a formal primitive library.
- Most role surfaces share the same dark amber visual language.
- Status icons currently include emoji in several utility mappings and UI strings.
- Typography scale is not yet documented for dashboards, tables, forms, and dense operational pages.
- Some components use fixed colors directly instead of token-only styling.
- Card radius is mixed: global cards are 12px, card-sm is 8px, Tailwind tokens include 10px/16px/24px.

## 6. Role Theme Status

Roles implemented:

- `student`
- `staff`
- `esq`
- `provider`
- `admin`

Role theme status:

- Role navigation exists in `src/lib/navigation.ts`.
- Role label and badge color exist for every role.
- Mobile navigation exists for every role.
- Role home route exists for every role.
- Role-level navigation shape is implemented.

What is missing:

- No complete role theme system for page backgrounds, accent hierarchy, density, empty states, illustrations, or data visualization palettes.
- No formal "role moodboard" or visual hierarchy per role.
- Provider/admin/staff privacy-sensitive screens need sharper visual affordances for risk, approval, and audit states.

## 7. Existing Components

Shared:

- `ApplicationTimeline`
- `ProfileCompletionRing`
- `ScholarshipCard`
- `Toast`
- UI primitives: `StatusBadge`, `StatCard`, `PageHeader`, `EmptyState`, `SectionLabel`, `Divider`, `Skeleton`, `SkeletonCard`

Layout:

- `AppShell`
- `Sidebar`
- `Topbar`
- `MobileBottomNav`

Staff:

- `AuditWarningCard`
- `DisclosureApprovalModal`
- `DisclosureRejectionModal`
- `DisclosureRequestCard`
- `DocumentVerificationPanel`
- `FairnessAlertCard`
- `MaskedStudentProfileCard`
- `MatchOverrideModal`
- `MatchReviewCard`
- `StaffDataQualityIssueCard`

Provider:

- `ShortlistConfirmationCard`
- `ShortlistReasonField`
- `ShortlistRequestModal`
- `ShortlistStatusBadge`

Admin:

- `AccessRequestCard`
- `AdminAuditWarningCard`
- `AdminKpiCard`
- `AuditFilterPanel`
- `AuditLogEventCard`
- `ElevatedAccessWarning`
- `ExportEventCard`
- `PermissionMatrixTable`
- `PermissionStatusBadge`
- `RoleAssignmentPanel`
- `RoleBadge`
- `SecurityAlertCard`
- `SensitiveAccessCard`
- `UserRiskBadge`

Component maturity:

- Good breadth for prototype workflows.
- Most components are tightly tied to mock data shapes.
- No Storybook or visual catalog exists yet.
- No snapshot or component tests exist.

## 8. Existing Mock Data

Mock data files:

- `users.ts` - five users, one per role
- `scholarships.ts` - public scholarship records
- `applications.ts` - student application records and timelines
- `announcements.ts` - staff/ESQ announcement records
- `notifications.ts` - student/topbar notifications
- `audit-logs.ts` - basic audit log events
- `staffData.ts` - masked students, document verification, match reviews, manual overrides, disclosure requests, data quality, staff notes, audit events
- `providerData.ts` - provider scholarships, candidates, shortlists, pool stats, aggregate impact, criteria
- `adminData.ts` - permissions, roles, admin users, access requests, sensitive access events, failed logins, exports, suspicious alerts, integration health, role assignment history

Mock data warnings:

- Scholarship deadlines are in 2025. As of 2026-05-07, routes that say "currently open" can still render deadline text as closed/expired.
- Mock data uses static IDs and static dates, so time-sensitive screens can drift.
- Mock data includes sensitive governance scenarios, but there is no enforcement layer behind it.

## 9. Auth/Role Guard Status

Implemented:

- Mock login page lets users choose one of five roles.
- Login stores role in `localStorage`.
- `AuthProvider` resolves a matching mock user.
- `AppShell` checks `requiredRole`.
- Unauthorized users are redirected to `/login`.

Limitations:

- Auth is client-only and prototype-only.
- No real identity provider.
- No sessions, cookies, JWT, middleware, or server-side route protection.
- Public routes are accessible to all.
- Role guard happens after hydration, so protected page code still ships to the browser.
- No permission matrix enforcement beyond UI routing.

## 10. Responsive/Mobile Support

Implemented:

- Mobile bottom navigation below `md`.
- Desktop sidebar at `md` and above.
- Many pages use responsive grids such as `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`.
- Some tables and matrix views use horizontal overflow.
- Cards and text frequently use `truncate`, `line-clamp`, and responsive spacing.

Needs design review:

- Dense 3-column mobile stat rows appear in staff/data-quality/disclosure/matching screens and may feel cramped.
- Admin permission and audit tables need mobile-specific review.
- Long Thai labels may overflow in narrow cards/buttons.
- Modal behavior is partly mobile-aware, especially provider shortlist modal, but not standardized across all modals.
- No Playwright or visual viewport testing has been run yet.

## 11. TH/EN Language Support

Implemented:

- `LangProvider` supports `th` and `en`.
- Language preference is stored in `localStorage`.
- Root HTML language defaults to `th`.
- Topbar and login have language toggles.
- Data models include many `*_th` and `*_en` fields.
- `messages/th.json` and `messages/en.json` exist.

Gaps:

- Many pages use inline `lang === 'th' ? ... : ...` strings instead of the message dictionary.
- Some pages always render Thai body text for announcement previews/reviews even when English is selected.
- No route-level locale structure.
- No formal translation completeness check.
- No date/time/currency abstraction beyond helper utilities and inline `toLocaleDateString` calls.

## 12. Privacy/Governance Components

Implemented prototype coverage:

- Provider aggregate-only messaging under PDPA.
- Provider insights/impact/outcomes are framed as aggregate data.
- Provider candidate shortlist request flow with reason field.
- Staff disclosure request review and approval/rejection modals.
- Masked student profile card.
- Staff manual match override modal with reason/audit warning.
- Staff data quality issue workflow.
- Admin permission matrix.
- Admin audit log and export pages.
- Admin sensitive access cards, access requests, suspicious activity alerts, role assignment panel.
- Admin settings include PDPA/workflow settings.

Gaps:

- Governance is visual/mock only.
- No backend audit log writes.
- No real data masking enforcement.
- No consent model implementation.
- No data retention implementation.
- No export authorization enforcement.
- No immutable audit trail.
- No field-level permission checks.

## 13. Build Status

Command run:

```sh
npm run build
```

Result:

- Passed.
- Next.js version reported: `14.2.3`.
- Production build compiled successfully.
- Type checking and route generation completed.
- Static pages generated: 36/36.

Dev server:

- Available at `http://localhost:3000`.
- GET `/` returned HTTP `200`.
- HEAD `/` returned HTTP `200` after restarting the dev server cleanly.

Current git status after inspection:

- Branch: `main`
- Up to date with `origin/main`
- Untracked expected file: `s2ims.code-workspace`
- New report file: `CODEBASE_STATUS_FOR_DESIGN.md`

## What Is Implemented

Implemented at prototype level:

- Public landing page and scholarship browsing.
- Mock login for five roles.
- Role-specific AppShell navigation.
- Student dashboard, scholarship application flow, application detail, profile, notifications, follow-up.
- Staff dashboard, announcement creation/preview, application review, OCR queue, analytics, follow-up, matching review, disclosure requests, data quality.
- ESQ dashboard, approval review, approval history.
- Provider dashboard, scholarship management, criteria editor, candidate pools, shortlist requests, insights, impact, outcomes.
- Admin dashboard, user management, permissions, audit log, export, settings.
- Thai/English switching in most surfaces.
- Privacy/governance concepts across provider, staff, and admin workflows.
- Responsive layout patterns for desktop/mobile.

## What Is Missing

Missing for product readiness:

- Real authentication and authorization.
- Backend APIs.
- Database schema and persistence.
- File upload/storage.
- Real OCR integration.
- Real matching engine.
- Real notification delivery.
- Real audit/event logging.
- Real export permissions and data governance.
- Validation schemas for forms and data.
- Error/loading consistency across all routes.
- Automated tests.
- Accessibility audit.
- Visual regression testing.
- Design system documentation.
- Current-date-safe seed data.

## Visual/Design Gaps

Main gaps for Claude Design:

- The visual system is coherent but one-note: dark surfaces plus amber brand dominates nearly all roles.
- Role differentiation is mostly navigation/badge based, not experience based.
- Dense operational pages need stronger hierarchy between primary action, review state, risk state, and metadata.
- Governance/privacy screens need consistent warning, approval, disclosure, and audit affordances.
- Mobile views need targeted design for high-density staff/admin workflows.
- Public landing page is functional but still prototype-like and lacks a strong institutional/brand visual asset.
- Charts use Recharts with inline colors and need a stronger data visualization palette.
- Status styling uses mixed badges, emojis, and text; should be normalized.
- Some "open" scholarships are visually described as closed because mock dates are stale.
- Modal patterns vary between components.

## Technical Risks

Risks to account for before deep design implementation:

- `next@14.2.3` previously emitted a security warning during install and should be upgraded in a planned dependency pass.
- `npm install` previously reported 8 vulnerabilities.
- Node is installed through nvm as LTS `v24.15.0`; adding `.nvmrc` would make the team environment reproducible.
- Auth and role guard are client-side only.
- Protected route code is not server-protected.
- Mock data has stale dates relative to 2026-05-07.
- UI components are not isolated in a component catalog.
- No tests currently protect layouts, routes, or role flows.
- No actual design reference has been compared yet.

## Recommended Next Phase From Code Perspective

Recommended next phase:

1. Align Claude Design on a design baseline for AppShell, role navigation, cards, forms, tables, warnings, modals, and status badges.
2. Define role-specific theme rules without fragmenting the product.
3. Normalize design tokens in Tailwind and global utilities before large-scale screen polishing.
4. Update mock dates/data so visual review reflects current product state.
5. Create a small route review checklist for desktop and mobile.
6. After design direction is approved, implement visual changes in a focused pass without changing business behavior.
7. Then add backend/auth/data architecture separately.

## Screens/Routes Claude Design Should Review First

High-priority design review routes:

- `/login` - role selection and prototype auth entry
- `/` - public landing and scholarship entry point
- `/scholarships` and `/scholarships/[id]` - public discovery and scholarship detail
- `/student/dashboard` - student home pattern
- `/student/applications/new` - student application flow
- `/staff/dashboard` - staff operational command center
- `/staff/applications/[id]` - staff review/detail density
- `/staff/matching-review` and `/staff/matching-review/[matchId]` - matching and override UX
- `/staff/disclosure-requests` - privacy/governance approval UX
- `/provider/dashboard` - provider aggregate/PDPA framing
- `/provider/scholarships/[scholarshipId]/candidates` - candidate shortlist/disclosure flow
- `/provider/impact` and `/provider/insights` - aggregate analytics design
- `/esq/dashboard` and `/esq/announcements/[id]/review` - approval workflow
- `/admin/permissions` - permission matrix
- `/admin/audit-log` - audit review
- `/admin/export` - sensitive export workflow
- `/admin/settings` - PDPA/system governance settings

## Dev URL

Use:

```sh
http://localhost:3000
```

If the server is not running, start it from the project root:

```sh
cd /Users/kinompungpound/Developer/s2ims
npm run dev
```

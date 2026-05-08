# Config Usage Inventory Phase 2B

## Purpose

This Phase 2B inventory documents current hard-coded role, status, privacy, token, sensitive-action, and export usages after Phase 2A introduced read-only config files. It is a planning artifact only.

Phase 2B did not wire `src/config/*` into the app.

## Scope Checked

- `src/lib/navigation.ts`
- `src/lib/auth.tsx`
- `src/lib/utils.ts`
- `src/components/layout/*`
- `src/components/ui/index.tsx`
- `src/app/**/*`
- `src/components/**/*`
- `src/data/mock/**/*`
- Phase 2A configs under `src/config/*`

Search confirmation: no runtime source currently imports from `@/config`, `src/config`, or relative config paths.

## 1. Hard-Coded Role Usage Inventory

| File path | Usage type | Current hard-coded value | Suggested future config source | Migration risk |
|---|---|---|---|---|
| `src/lib/types.ts` | Role union | `student`, `staff`, `esq`, `provider`, `admin` | Keep as base type; align `ROLE_CONFIG` with this union | Low |
| `src/lib/navigation.ts` | Sidebar nav by role | `NAV_CONFIG` role keys, labels, routes, icons | Future `src/config/navigation.ts` plus `src/config/roles.ts` for role metadata | Medium |
| `src/lib/navigation.ts` | Mobile nav by role | `MOBILE_NAV` per role | Future `src/config/navigation.ts`; keep route behavior identical | Medium |
| `src/lib/navigation.ts` | Home routes | `ROLE_HOME` | `ROLE_CONFIG[role].homeRoute` | Medium |
| `src/lib/navigation.ts` | Display labels/theme classes | `ROLE_LABELS` with TH/EN and Tailwind classes | `src/config/roles.ts` for labels/theme names; keep visual class mapping separate until tested | Medium |
| `src/lib/auth.tsx` | Mock auth storage | `localStorage` key `s2ims_role`; lookup by `mockUsers.find(u.role)` | `src/config/roles.ts` can validate role keys later, but auth behavior should remain untouched for now | High |
| `src/components/layout/AppShell.tsx` | Guard role prop | `requiredRole?: Role`; redirect to `/login` | Do not migrate yet; role guard behavior is sensitive | High |
| `src/components/layout/AppShell.tsx` | Role theming hook | `data-role={role ?? 'staff'}` | `src/config/roles.ts` may document fallback later; avoid changing CSS hook now | Medium |
| `src/components/layout/Topbar.tsx` | Role label | `ROLE_LABELS[role]` | `src/config/roles.ts` labels after visual parity check | Low |
| `src/components/layout/Sidebar.tsx` | Role navigation and label | `NAV_CONFIG[role]`, `ROLE_LABELS[role]` | Navigation config later; roles config for labels | Medium |
| `src/components/layout/MobileBottomNav.tsx` | Role nav slots | `MOBILE_NAV[role]` | Navigation config later; do not touch route mapping yet | Medium |
| `src/app/login/page.tsx` | Login role cards and redirect | `ROLE_META`, `ROLE_LABELS`, `ROLE_HOME[selected]` | `src/config/roles.ts` for labels/descriptions/home route after tests | Medium |
| `src/app/not-found.tsx` | Fallback home | Template `/${role}/dashboard` | `ROLE_CONFIG[role].homeRoute` | Low to medium |
| `src/app/**/page.tsx` | Route guard declarations | Repeated `<AppShell requiredRole="student/provider/staff/esq/admin">` | Keep explicit for now; future route map tests before any helper | High |
| `src/app/globals.css` | Role tokens | `[data-role="student"]`, etc. | Keep CSS tokens as visual system source; `src/config/roles.ts` documents theme names only | Low |

### Role Findings

- Role constants are already typed, but role metadata is split across `src/lib/navigation.ts`, `src/app/login/page.tsx`, layout components, and CSS role tokens.
- Navigation and home-route values are behavior-affecting. They should not be migrated until route smoke checks exist.
- Login and auth are more sensitive than display labels because a small role/home-route mismatch can block access to the prototype.

## 2. Status Usage Inventory

| Status family | Current declaration/rendering locations | Duplication notes | Suggested future config source | Migration risk |
|---|---|---|---|---|
| Application statuses | `src/lib/types.ts`, `src/lib/utils.ts` `APP_STATUS_MAP`, `src/data/mock/applications.ts`, student pages using `APP_STATUS_MAP` | Core legacy application statuses have labels/colors in `APP_STATUS_MAP`; red is still used for `NEEDS_DOCS` and `REPORT_OVERDUE` | `APPLICATION_STATUSES` in `src/config/statuses.ts` | Medium |
| Student application states | `src/data/mock/studentApplicationData.ts` `StudentApplicationState`, `applicationStateLabels`, `applicationStateStyles`; `src/components/student/ApplicationStatusCard.tsx`; student app pages | Separate newer lowercase states: `draft`, `ready_to_submit`, `submitted`, `in_review`, `revision_requested`, etc. | Extend or map through `APPLICATION_STATUSES` with aliases before wiring | Medium |
| Document statuses | `src/lib/types.ts` `DocumentItem.status`; `src/data/mock/studentApplicationData.ts`; `src/components/student/RequiredDocumentsList.tsx`; `src/components/staff/DocumentVerificationPanel.tsx`; `src/data/mock/staffData.ts` | Student and staff document status labels/tones are duplicated; staff uses red for rejected/invalid/missing while Phase 3 wanted amber for many document warnings | `DOCUMENT_STATUSES` in `src/config/statuses.ts` | Medium |
| Scholarship statuses | `src/lib/types.ts`; `src/lib/utils.ts` `SCH_STATUS_MAP`; `src/data/mock/scholarships.ts`; provider `ProviderScholarshipStatus`; `ProviderScholarshipCard`; `/provider/scholarships` filters | Public scholarship statuses and provider statuses differ (`OPEN/PUBLISHED` vs `ACTIVE/PENDING_REVIEW`) | `SCHOLARSHIP_STATUSES` in `src/config/statuses.ts`, with provider aliases | Medium |
| Shortlist request statuses | `src/data/mock/providerData.ts`; `ShortlistStatusBadge`; `ShortlistConfirmationCard`; provider candidate pages | Labels/tones are local to provider components; pending status appears in mock data and UI | `SHORTLIST_REQUEST_STATUSES` | Low to medium |
| Disclosure request statuses | `src/data/mock/staffData.ts`; `DisclosureRequestCard`; staff disclosure page | Labels, icons, and tones are local; rejected uses red in card | `DISCLOSURE_REQUEST_STATUSES` | Medium |
| Review statuses | ESQ review page local `approved/revision/rejected`; staff matching decisions; admin access requests | Similar concepts use separate names and tones | `REVIEW_STATUSES` plus domain-specific adapters | Medium |
| Audit/security risk statuses | `src/data/mock/adminData.ts`; `SensitiveAccessCard`; `ExportEventCard`; `SecurityAlertCard`; risk badge components | Risk labels and colors are scattered across admin components | `AUDIT_RISK_STATUSES` | Medium |
| Data freshness statuses | `src/data/mock/studentMatchingData.ts`; `src/components/student/DataFreshnessIndicator.tsx`; provider data freshness in `src/data/mock/providerData.ts`; `ProviderDataFreshnessIndicator` | Student and provider freshness components duplicate `fresh/stale/failed` labels/tones; student failed uses red, provider failed is neutral | `DATA_FRESHNESS_STATUSES` | Low to medium |

### Status Findings

- `StatusBadge` is a flexible primitive that accepts a final label and Tailwind color string; it does not know status semantics.
- Status labels and tones are currently spread across `src/lib/utils.ts`, mock data modules, and role-specific components.
- The highest visual-risk statuses are negative/warning states where older red styling conflicts with newer governance guidance.
- A config-driven status helper is useful, but it should not be the first wiring step because it may shift visible labels or colors across many routes.

## 3. Privacy / Masking Usage Inventory

| Surface | Current formatting/location | Raw ID or identity visibility | Suggested future config source | Migration risk |
|---|---|---|---|---|
| Provider candidate pools | `src/data/mock/providerData.ts` stores `Candidate #C-2048`, etc.; `AnonymousCandidateCard`, `CandidatePoolTable`, provider candidate pages display `candidate.candidateToken` | Provider data comments explicitly forbid names, raw student IDs, emails, phone, addresses, exact GPA, and raw financial values; scan found provider UI uses token/banded/aggregate copy | `src/config/privacy.ts` and `src/config/tokenFormats.ts` | Low |
| Staff masked profiles | `src/data/mock/staffData.ts` `Student #S-1847`; `MaskedStudentProfileCard`; staff matching pages | Staff sees token plus GPA range and financial percentile; masked by design but still sensitive | `src/config/privacy.ts`; token helper later | Low to medium |
| Staff application detail | `src/app/staff/applications/[id]/page.tsx` derives `Student #S-${app.student_id.slice(-4)}` but also shows `Application -- {app.student_id}` | Raw student ID is visible on staff application surfaces; this may be intended for staff, but should be documented as a sensitive route | `formatStudentToken` and future staff access policy | Medium |
| Staff student profile | `src/app/staff/students/[id]/page.tsx` displays student name, student ID, and email | Raw identity is visible on this route despite page subtitle saying masked PII | Future staff policy/masking review before changes | High |
| Staff follow-up | `src/app/staff/follow-up/page.tsx` inline data includes raw student IDs and names | Raw identity visible in staff follow-up task list | Future privacy map review; do not touch until staff workflow is approved | High |
| Disclosure requests | `src/data/mock/staffData.ts` has candidate tokens and `fieldsToDisclose` including `name`, `email`, `phone`, `student_id`, `gpa`; `DisclosureRequestCard` displays requested fields | Correctly tokenized before decision, but requested fields are sensitive | `src/config/privacy.ts` and `src/config/sensitiveActions.ts` later | High |
| Admin audit/security | `src/data/mock/adminData.ts` includes student tokens, user names, emails, actor names, IPs, export destinations | Admin views intentionally expose audit/security context; exports include more risk | `src/config/privacy.ts`, `exportAllowlist.ts`, `sensitiveActions.ts` | High |
| Provider privacy notices | `ProviderPrivacyNotice`, provider dashboard/candidates/impact pages | Good explicit no-identity language | `src/config/privacy.ts` for future copy/source of truth | Low |
| Student privacy notices | `StudentPrivacyNotice`, `MatchingExplanationCard`, submit modal, student pages | Student sees own data only in current student pages | `src/config/privacy.ts` for future copy alignment | Low |
| Shared privacy primitive | `src/components/ui/index.tsx` `PrivacyNotice` | Visual primitive only, no policy logic | Keep as primitive; policy should live in services/config later | Low |

### Privacy Findings

- Provider Phase 4 privacy boundary is currently strong in mock data and UI copy.
- Staff and admin routes deliberately expose more sensitive information, but the enforcement point is not centralized.
- Token strings are mostly stored directly in mock data. One route constructs a student token by slicing a raw ID.
- Raw identity surfaces should not be altered until staff/admin access rules and route smoke tests exist.

## 4. Sensitive Action Usage Inventory

| Action | Current locations | Reason behavior | Audit warning behavior | Suggested future config source | Migration risk |
|---|---|---|---|---|---|
| Shortlist request | `ShortlistRequestModal`, `ShortlistReasonField`, provider candidates page | Required; min 10 characters; mock-only submit | Warm privacy copy, no `AuditWarningCard` | `shortlist_request` in `src/config/sensitiveActions.ts` | Low to medium |
| Matching override | `MatchOverrideModal`, staff matching review pages, `mockAuditEvents` | Required; min 20 characters | Uses `AuditWarningCard` | `matching_override` | High |
| Disclosure approval | `DisclosureApprovalModal`, staff disclosure requests page, `mockStaffDisclosureRequests` | Approval modal currently does not collect a reason even though warning says reason is required | Uses `AuditWarningCard`; irreversible warning | `disclosure_approval` | High |
| Disclosure rejection | `DisclosureRejectionModal`, staff disclosure requests page | Required; min 15 characters | Uses `AuditWarningCard` | `disclosure_rejection` | Medium |
| Role change | `RoleAssignmentPanel`, admin role assignment data | Required; min 20 characters | Uses `AdminAuditWarningCard` | `role_change` | High |
| Scope change | Admin access/permission surfaces; `mockAdminData` includes `scope_change` events | Some mock reason data exists; runtime behavior is component-local | Admin warning components exist | `scope_change` | High |
| Export report | `src/app/admin/export/page.tsx`, `ExportEventCard`, `mockExportEvents` | Runtime export has no reason prompt; mock monitoring has audit IDs | Export monitoring shows risk, but export page itself has no allowlist/reason enforcement | `export_report` and `src/config/exportAllowlist.ts` | High |
| Sync retry | Admin integration health mock data includes retry-like actions; no clear runtime retry control in checked scope | Not centralized | Needs confirmation | `sync_retry` | Medium |
| Document rejection/replacement | `DocumentVerificationPanel`, `mockDocumentStates`, `mockAuditEvents` | Required text, but no shared min-length rule | Uses `AuditWarningCard` in panel area | `document_rejection`, `document_replacement_request` | Medium |
| Manual data correction | Staff data quality and admin audit data mention manual correction/override concepts | Not centralized | Audit events exist in mock data | `manual_data_correction` | High |

### Sensitive Action Findings

- Reason-required behavior exists, but each component owns its own validation length and copy.
- Some sensitive actions show audit warnings without using a shared policy source.
- Disclosure approval is the riskiest mismatch: the UI warning says reason is required, but the modal approval action does not collect one today. This should be fixed only in a later approved behavior-change phase.

## 5. Export Allowlist Inventory

| Surface | Currently displayed/exported fields | Aggregate-only visible? | Alignment with `src/config/exportAllowlist.ts` | Migration risk |
|---|---|---|---|---|
| `src/app/admin/export/page.tsx` users export | `id`, `name_th`, `name_en`, `email`, `role`, `is_active`, `created_at` | No | Includes fields listed in `NEVER_EXPORT_FIELDS` draft for broad export; requires policy decision | High |
| `src/app/admin/export/page.tsx` applications export | `id`, `scholarship_id`, `scholarship`, `student_id`, `status`, `match_score`, `applied_at`, `updated_at` | No | Exposes raw `student_id`; should eventually use token/allowlist policy | High |
| `src/app/admin/export/page.tsx` scholarships export | `id`, `title_en`, `type`, `amount`, `num_awards`, `deadline`, `status`, `provider` | Mostly non-personal | Mostly aligns with admin-safe/public scholarship fields | Low |
| `src/app/admin/export/page.tsx` audit export | `id`, `actor`, `role`, `action`, `entity`, `entity_id`, `ip`, `created_at` | No | Includes actor and IP; should require reason/audit allowlist before production | High |
| `src/components/admin/ExportEventCard.tsx` | `exportType`, `dataLevel`, `recordCount`, destination, IP, filters | Monitoring-only, not an export action | Good candidate to use export-risk config later | Medium |
| `src/app/provider/impact/page.tsx` | Aggregate metrics, cohort bands, department bands, provider scholarship funding summary | Yes | Aligns with aggregate export concept; no download action | Low |
| `src/app/provider/insights/page.tsx` | Aggregate applicant stats and GPA bands | Yes | Aligns with aggregate-only expectation; legacy route should be reviewed with Phase 4 provider pages | Low |
| `src/app/provider/outcomes/page.tsx` | Aggregate outcomes | Yes | Aligns with aggregate-only expectation; no download action | Low |
| ESQ dashboard/history | Announcement and aggregate review surfaces | Partially | Needs future ESQ aggregate/report allowlist review | Medium |

### Export Findings

- The admin export page is the highest-risk config target and should not be wired in Phase 2C without approval.
- Provider impact/report-like routes are mostly aggregate-only and safer, but they do not currently use `exportAllowlist.ts`.
- The export allowlist should become enforceable only after tests define expected exported columns and sensitive-action reason/audit behavior.

## Recommended Phase 2C

Recommended first runtime migration target: **A. Token formatting utility adoption**.

### Why This Is Safest

- Token formatting has a small output surface and can be verified with exact string comparisons.
- It does not affect route access, auth, navigation, export behavior, disclosure decisions, or status colors.
- The app already uses the desired formats: `Candidate #C-XXXX` and `Student #S-XXXX`.
- `src/config/tokenFormats.ts` is pure and has no React, browser, data, or auth dependencies.

### Suggested Phase 2C Scope

1. Add a small verification table or test-free smoke checklist for expected outputs:
   - `formatCandidateToken('2048')` -> `Candidate #C-2048`
   - `formatStudentToken('650912345')` -> `Student #S-2345`
   - Existing already-formatted token-like IDs should not be reformatted unless explicitly intended.
2. Replace only generated token formatting first:
   - `src/app/staff/applications/[id]/page.tsx` currently creates `Student #S-${app.student_id.slice(-4)}`.
3. Do not rewrite mock data token literals yet.
4. Do not touch provider candidate data, disclosure decisions, exports, or staff raw-ID display in the same commit.
5. Run route smoke checks for:
   - `/staff/applications/[id]`
   - `/staff/matching-review`
   - `/staff/disclosure-requests`
   - `/provider/scholarships/[scholarshipId]/candidates`

### Why Other Candidates Wait

- **StatusBadge tone helper:** medium risk; labels and warning colors could shift across student, provider, staff, admin, and ESQ screens.
- **Role label/home route config adoption:** medium risk; a mismatch can break login redirects, sidebars, or mobile navigation.
- **Sensitive action config adoption:** high risk; it can change modal validation, reason requirements, and approval behavior.
- **Export allowlist enforcement:** high risk; it changes downloadable fields and needs explicit approval.

## No Behavior Changes Confirmation

- No runtime behavior changed in Phase 2B.
- No routes changed.
- No auth logic changed.
- No role guards changed.
- No export behavior changed.
- No disclosure behavior changed.
- No provider, staff, admin, or ESQ privacy behavior changed.
- This phase produced inventory and migration planning only.

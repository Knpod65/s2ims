# S²IMS Architecture Renovation Plan

## Goal

Renovate the S²IMS code structure while preserving current behavior.

The aim is to make the codebase easier to maintain, safer for PDPA-sensitive development, and clearer for future phases. This plan adapts the architecture lessons from PROJELEARNT without rewriting S²IMS or forcing a Laravel structure onto a Next.js app.

## Non-Goals

- No full rewrite.
- No database redesign unless approved.
- No feature expansion unless requested.
- No UI rebrand unless requested.
- No behavior changes without approval.
- No auth behavior changes without approval.
- No route changes without approval.
- No backend/API integration unless approved.

## Guiding Architecture Model

Target flow for future renovations:

`Route/Page -> Middleware/Auth -> Validation -> Service -> Data Access/API -> Component/View -> Audit Log if sensitive`

How to interpret this in S²IMS:

- Route/Page: `src/app/**/page.tsx`
- Middleware/Auth: future `middleware.ts`, current `AppShell requiredRole`, future permission helpers
- Validation: schema or typed validation functions
- Service: domain logic and workflow orchestration
- Data Access/API: future API/database client or mock repository boundary
- Component/View: React components focused on display and interaction
- Audit Log: central audit function for export, reveal, approval, update, and role changes

## Phase 0: Safety Baseline

- Confirm git clean state.
- Create renovation branch.
- Record current build/lint/test status.
- Record route/page inventory.
- Record auth/data flow inventory.
- Confirm no production-like behavior is changed.
- Confirm all work is documentation-only until approved.

Current baseline captured:

- Branch created: `audit/architecture-renovation-plan`
- `npm install`: completed, reported npm audit vulnerabilities
- `npm run lint`: blocked by Next ESLint setup prompt
- `npm run build`: passed
- `npm run typecheck`: not defined
- `npm test`: not defined

## Phase 1: Documentation And Map

Create durable architecture documentation:

- Route map by role.
- Component map by domain and shared usage.
- Role/permission map.
- Personal data exposure map.
- Dashboard/page dependency map.
- Mock data ownership map.
- Sensitive action map, including export, reveal, disclosure, shortlist, role assignment, and status override.

Deliverables:

- `docs/architecture/route-map.md`
- `docs/architecture/component-map.md`
- `docs/architecture/role-permission-map.md`
- `docs/architecture/personal-data-exposure-map.md`
- `docs/architecture/page-dependency-map.md`

Risk: Low. Documentation only.

## Phase 2: DRY Config Cleanup

Centralize repeated constants and options without changing behavior:

- Centralize roles.
- Centralize statuses.
- Centralize labels.
- Centralize navigation.
- Centralize PDPA/privacy options.
- Centralize table column definitions where appropriate.
- Centralize status badge color mapping.
- Centralize copy for sensitive warnings where appropriate.

Suggested files:

- `src/config/roles.ts`
- `src/config/statuses.ts`
- `src/config/privacy.ts`
- `src/config/navigation.ts` or evolve `src/lib/navigation.ts`
- `src/config/table-columns.ts`

Acceptance:

- Existing routes still render the same.
- Status labels remain unchanged unless explicitly approved.
- No auth or workflow behavior changes.

Risk: Low to medium. Keep changes incremental.

## Phase 3: Service Layer Extraction

Identify repeated business logic and extract it gradually.

Rules:

- Do not move everything at once.
- Start with read-only selectors and pure functions.
- Keep old code paths until verified.
- Preserve mock data behavior.
- Add tests or smoke checks before extracting risky workflow logic.

Suggested services:

- `StudentProfileService`
- `ScholarshipService`
- `MatchingService`
- `DashboardStatsService`
- `AuthAccessService`
- `AuditLogService`
- `PrivacyMaskingService`
- `ProviderScholarshipService`
- `ApplicationService`
- `ExportService`

Good first extraction candidates:

- Dashboard aggregate calculations.
- Scholarship lookup and filtering.
- Provider candidate pool selectors.
- Status label/color mapping.
- Privacy-safe display formatting.

Risk: Medium. Requires careful review to avoid behavior drift.

## Phase 4: Auth And Access Control Renovation

Document and centralize access control before changing behavior.

Tasks:

- Document current roles.
- Document route access by role.
- Document action-level permissions.
- Review current `AppShell requiredRole` behavior.
- Review protected pages.
- Review admin/staff/provider/student access boundaries.
- Create friendly unauthorized handling.
- Propose `middleware.ts` only after documenting expected behavior.

Possible future helpers:

- `canAccessRoute(role, pathname)`
- `canPerform(role, action)`
- `assertRole(role, requiredRole)`
- `getRoleHome(role)`

Do not implement real auth or server sessions without approval.

Risk: High if behavior changes, low if documentation-only.

## Phase 5: UI Component Renovation

Improve consistency while preserving the approved Foundation visual system.

Targets:

- Shared layout shell.
- Shared topbar/sidebar patterns.
- Shared table component.
- Shared form field component.
- Shared status badge component.
- Shared empty/loading/error states.
- Shared privacy/audit warning patterns.
- Consistent spacing, scrolling, and sticky CTA rules.

Suggested approach:

- Start with shared field and table primitives.
- Migrate one low-risk page at a time.
- Compare before/after screenshots.
- Do not redesign flows unless requested.

Risk: Medium. UI refactors can accidentally alter user-facing behavior.

## Phase 6: PDPA And Audit Layer

Build a privacy architecture before real data exists.

Tasks:

- Identify personal data fields.
- Define masking rules by role and action.
- Review export risks.
- Define sensitive access events.
- Log create/update/delete/export/role changes.
- Log identity reveal and disclosure approval events.
- Document retention/privacy rules.
- Add privacy-safe display utilities.

Suggested future services:

- `PrivacyMaskingService`
- `AuditLogService`
- `SensitiveAccessService`
- `ExportPolicyService`

Priority sensitive areas:

- Admin export.
- Staff student profile.
- Staff application detail.
- Disclosure request approval/rejection.
- Provider candidate pool.
- Role assignment and permission changes.

Risk: High if connected to real data. Treat as a formal design phase.

## Phase 7: Tests And Verification

Add safety checks after the architecture boundaries are approved.

Targets:

- Build tests.
- Route smoke tests.
- Role access tests.
- Masking tests.
- Dashboard stat tests.
- No 500/blank page checks.
- Provider-to-Student import boundary test or ESLint rule.
- Export privacy tests.

Suggested scripts after approval:

- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run smoke`

Do not add testing dependencies without approval.

Risk: Low to medium, depending on tooling.

## Acceptance Criteria

- App still builds.
- App still runs.
- Existing routes still work.
- Auth behavior still works as currently designed.
- No known behavior regression.
- Documentation explains architecture clearly.
- Duplicated logic is reduced gradually.
- Roles and PDPA exposure are clearer.
- UI structure is more consistent.
- Provider privacy boundary remains intact.
- Sensitive workflows have documented audit expectations.

## Suggested First Refactor After Approval

Recommended safest first implementation phase:

Phase 1 documentation and maps.

Reason:

- It is low risk.
- It does not change behavior.
- It makes later refactors reviewable.
- It creates a shared map of routes, components, roles, personal data exposure, and sensitive actions before touching code.

Suggested first approved task:

Create `docs/architecture/route-map.md`, `docs/architecture/component-map.md`, and `docs/architecture/personal-data-exposure-map.md`.

Do not implement this yet without approval.


# Config Centralization Phase 2A

## Purpose

Renovation Phase 2A adds read-only configuration references for S²IMS roles, statuses, privacy categories, sensitive actions, token formats, and export allowlist drafts. This is an additive documentation and typing pass only. It does not change runtime behavior, routes, auth, role guards, UI components, or data flow.

The goal is to make future renovation safer by naming the policy surface before wiring it into the app.

## Files Created

| File | Purpose |
|---|---|
| `src/config/roles.ts` | Documents current role keys, display labels, theme names, home routes, route prefixes, audience type, and data visibility boundaries. |
| `src/config/statuses.ts` | Central draft registry for application, document, scholarship, shortlist, review, disclosure, audit-risk, and data-freshness statuses. |
| `src/config/privacy.ts` | Defines privacy categories, sensitive field groups, role-safe field sets, and cross-role visibility notes. |
| `src/config/sensitiveActions.ts` | Defines sensitive actions that should require reason and/or audit when later enforced. |
| `src/config/tokenFormats.ts` | Documents Candidate, Student, and Audit token formats with pure helper functions for future migration. |
| `src/config/exportAllowlist.ts` | Draft allowlist for aggregate, provider-safe, staff-review, and admin-audit exports, including never-export fields. |

## What Was Intentionally Not Wired Yet

- Existing navigation in `src/lib/navigation.ts` was not replaced.
- Existing status badges, tables, cards, or page logic were not changed.
- Existing auth context, role guards, and middleware behavior were not changed.
- Existing mock data was not changed.
- Existing export, disclosure, shortlist, or document workflows were not changed.
- No ESLint rules, backend APIs, database schema, or service layer were added.

## Future Migration Sequence

1. Compare current hard-coded role and status labels against the new config files.
2. Add small unit checks or route smoke checks before replacing any runtime values.
3. Migrate shared badge/status display to read from `src/config/statuses.ts`.
4. Migrate role-aware navigation only after confirming it is behavior-identical.
5. Introduce privacy masking helpers using `src/config/privacy.ts` and `src/config/tokenFormats.ts`.
6. Introduce policy/service checks for sensitive actions using `src/config/sensitiveActions.ts`.
7. Apply export allowlists only after export requirements and audit logging are approved.

## Risks Avoided

- Avoided changing role guard behavior before the access model is tested.
- Avoided changing route structure or user-facing navigation.
- Avoided mixing policy enforcement into visual components.
- Avoided adding a backend or database layer during a config-only phase.
- Avoided broad rewrites while S²IMS is still using mock data and prototype flows.

## Relationship To PROJELEARNT Lessons

- **Config-driven PDPA:** Privacy categories, safe fields, token formats, and export allowlists are named centrally before enforcement.
- **Middleware / Policy later:** Sensitive actions and allowed role drafts prepare a future policy layer without changing auth now.
- **Service layer later:** Central configs will give future services stable vocabulary for roles, statuses, masking, exports, and audit events.
- **Audit / Masking later:** Reason-required actions, token formats, and never-export fields define the future audit and masking boundaries.
- **DRY gradually:** Status and role values are documented in one place first, then can be migrated safely after route and UI checks.

## Build Verification

Phase 2A should pass `npm run build` with no application behavior changes.

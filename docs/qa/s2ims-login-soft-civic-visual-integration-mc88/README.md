# MC88 Login Visual Integration QA README

This QA README records the review checklist for the MC88 login-only Soft Civic visual integration slice.

Steps for QA reviewer:
1. Confirm only `src/app/login/page.tsx` changed in runtime scope.
2. Confirm the login page uses `PageHeader`, `SafetyBanner`, `SectionHeader`, and `RoleBadge`.
3. Confirm the local mock auth flow is unchanged.
4. Re-run validation: `npm run build`, `npm run check:tokens`, and `npm run check:audit-events`.
5. Confirm route smoke still passes for the login and governed routes.
6. Review the design docs and daily report for scope and safety notes.
7. Record the QA result in `docs/design/S2IMS_LOGIN_SOFT_CIVIC_VISUAL_INTEGRATION_MC88_QA_SUMMARY.md`.

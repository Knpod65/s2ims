# MC88 Login Soft Civic Visual Integration Post-Merge QA README

This QA README records the post-merge review for the MC88 login-only Soft Civic visual integration slice.

Steps for QA reviewer:
1. Confirm MC88 is merged to `main`.
2. Confirm only `src/app/login/page.tsx` changed in runtime scope.
3. Confirm the login page still uses `PageHeader`, `SafetyBanner`, `SectionHeader`, and `RoleBadge`.
4. Re-run validation: `npm run build`, `npm run check:tokens`, and `npm run check:audit-events`.
5. Confirm route smoke still passes for the login and governed routes.
6. Review the merge checkpoint and post-merge daily report for a stable, login-only scope.
7. Record the result in `docs/design/S2IMS_LOGIN_SOFT_CIVIC_VISUAL_INTEGRATION_MC88_POST_MERGE_QA_SUMMARY.md`.

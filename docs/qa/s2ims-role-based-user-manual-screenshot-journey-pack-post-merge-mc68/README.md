# MC68 Post-Merge QA README

This QA README records the post-merge review for the MC68 role-based user manual and screenshot journey pack after merge to `main`.

Steps for QA reviewer:
1. Confirm MC68 is merged to `main`.
2. Confirm the documentation package is complete and docs-only.
3. Re-run validation: `npm run build`, `npm run check:tokens`, and `npm run check:audit-events`.
4. Confirm the 25 screenshots exist under `docs/screenshots/mc68-role-based-user-manual/` and remain mock/demo/synthetic only.
5. Review the role-based manual, route inventory, journey map, capture plan, evidence index, and handoff guide for completeness and safety wording.
6. Record the outcome in `docs/architecture/S2IMS_ROLE_BASED_USER_MANUAL_MC68_POST_MERGE_QA_SUMMARY.md`.

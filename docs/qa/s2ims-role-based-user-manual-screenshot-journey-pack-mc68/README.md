# MC68 QA README

This QA README documents the checklist to validate the MC68 role-based user manual and screenshot journey pack.

Steps for QA reviewer:
1. Checkout branch `architecture/s2ims-role-based-user-manual-screenshot-journey-pack-mc68`.
2. Confirm only docs-only changes are present.
3. Re-run validations: `npm run build`, `npm run check:tokens`, and `npm run check:audit-events`.
4. Confirm the 25 screenshots exist under `docs/screenshots/mc68-role-based-user-manual/` and are mock/demo/synthetic only.
5. Review the manual, route inventory, journey map, screenshot capture plan, evidence index, and handoff guide for completeness and safety language.
6. Record QA confirmations in `docs/architecture/S2IMS_ROLE_BASED_USER_MANUAL_MC68_QA_SUMMARY.md`.

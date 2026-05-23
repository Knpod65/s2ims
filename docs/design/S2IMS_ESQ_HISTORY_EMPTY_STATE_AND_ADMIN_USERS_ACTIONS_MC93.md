# S2IMS ESQ History Empty State And Admin Users Actions MC93

**Date**: 2026-05-21

## ESQ History

`/esq/history` now presents ESQ output as recommendation history rather than approval history.

Changes:
- Page title changed to Recommendation History.
- Banner states "Recommendation — not an approval."
- AP-11 context is visible in the banner.
- Table section is labeled with `SectionHeader`.
- Empty history renders a rich `EmptyState` explaining what will appear later.
- Status text is mapped away from approval wording for ESQ history rows.

Behavior preserved:
- Existing `mockAnnouncements` data source remains.
- Existing table layout remains for non-empty data.
- No sign-off, official evidence, audit write, or AP-11 action was added.

## Admin Users

`/admin/users` now makes mock action boundaries explicit.

Changes:
- Page-level `SafetyBanner` states user management is prototype-only.
- Export remains visible but disabled with AP-10C hint.
- Add User remains visible but disabled with prototype-only hint.
- Edit remains visible per row but disabled with no-real-mutation hint.
- Role and status display use shared `RoleBadge` and `StatusBadge`.

Behavior preserved:
- Existing `mockUsers` data source remains.
- No mutation handlers were added.
- No backend/API calls, persistence, or audit writes were added.
- No AP-10C or AP-11 gates were opened.

## Disabled Action Rule

MC93 follows the governance rule that disabled actions stay visible and receive a reason. The implementation clarifies prototype boundaries without hiding controls or implying production capability.

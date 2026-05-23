# S2IMS MC93 QA Checklist

**Date**: 2026-05-21  
**Milestone**: MC93

## Provider Scholarship Form

- [ ] `/provider/scholarships/new` renders.
- [ ] Basic information, amount/deadline, and eligibility/document groups use clear section headers.
- [ ] Required field guidance is visible and bilingual-ready.
- [ ] Empty required fields still block submit.
- [ ] Save draft still shows mock draft feedback.
- [ ] Valid submit still shows mock staff-review state.
- [ ] Page and form copy do not imply real persistence or publication.

## ESQ History

- [ ] `/esq/history` renders.
- [ ] Page title uses recommendation language, not approval language.
- [ ] Banner states "Recommendation — not an approval."
- [ ] AP-11 remains blocked.
- [ ] Empty state is polished if no history rows exist.
- [ ] Existing mock history rows still render when present.
- [ ] No official evidence or sign-off implication appears.

## Admin Users

- [ ] `/admin/users` renders.
- [ ] Page banner states user management is prototype-only.
- [ ] Export is visible but disabled with AP-10C hint.
- [ ] Add User is visible but disabled with prototype-only hint.
- [ ] Row Edit controls are visible but disabled with prototype-only hint.
- [ ] Role and status badges render clearly.
- [ ] No real account mutation is implied.

## Regression Checks

- [ ] Login role colors still work.
- [ ] Topbar notification read-state remains reactive.
- [ ] `/admin/master-data/import-preview` Confirm Import remains disabled.
- [ ] `/admin/audit-log` still shows mock/demo audit records only.
- [ ] AP-10B / AP-10C / AP-11 remain blocked.
- [ ] No package, tools, or scripts changes.
- [ ] `npm run build` passes 42/42.
- [ ] `npm run check:tokens` passes 4/4.
- [ ] `npm run check:audit-events` passes 502/502.

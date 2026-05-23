# S²IMS Login Visual Integration QA Checklist MC88

## Visual Checks
- [ ] `PageHeader` is visible on `/login`.
- [ ] `SafetyBanner` is visible and clearly states the prototype/mock-auth boundary.
- [ ] `SectionHeader` is visible above the role cards.
- [ ] `RoleBadge` appears on the selected role.
- [ ] `Button` visual polish remains consistent for the language toggle and login button.
- [ ] `StatusBadge` still marks the selected role state.

## Behavior Checks
- [ ] The language toggle still switches Thai/English copy.
- [ ] Role selection still changes the active card state.
- [ ] The login button still requires a selected role.
- [ ] The login redirect still uses the existing role-home routing.
- [ ] No new UI action changes the existing mock auth behavior.

## Auth-Flow Checks
- [ ] The page remains local mock auth only.
- [ ] No persistence was added.
- [ ] No backend/API call was added.
- [ ] No audit write was added.
- [ ] No official evidence language was introduced.

## Accessibility Checks
- [ ] Headings remain semantic and readable.
- [ ] The safety notice is presented as persistent text, not hidden behind interaction.
- [ ] The selected role has a non-color signal.
- [ ] Buttons remain keyboard reachable.
- [ ] Thai/English copy remains legible.

## Bilingual Checks
- [ ] New `PageHeader` copy supports Thai and English.
- [ ] New `SafetyBanner` copy supports Thai and English.
- [ ] `SectionHeader` copy supports Thai and English.
- [ ] Existing login prototype copy remains bilingual.

## Governance Checks
- [ ] Confirm Import remains disabled.
- [ ] AP-10B remains blocked.
- [ ] AP-10C remains blocked.
- [ ] AP-11 remains blocked.
- [ ] No governed route was modified.
- [ ] No new evidence or approval claims were introduced.

## Regression Checks
- [ ] `npm run build` passes.
- [ ] `npm run check:tokens` passes.
- [ ] `npm run check:audit-events` passes.
- [ ] Localhost route smoke passes for the login and governed routes.
- [ ] Unrelated untracked files remain untouched.

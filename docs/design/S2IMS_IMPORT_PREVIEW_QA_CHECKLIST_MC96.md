# S²IMS Import Preview Safety Polish QA Checklist — MC96

**Use this checklist on every commit and before merge in the MC96 branch and any follow-up work on the import preview page.**

## Preview-Only State
- [ ] Permanent `SafetyBanner` (tone="preview") is the first content element below PageHeader.
- [ ] Banner explicitly states "AP-10B Gate — Preview Only", "synthetic/mock data only", "no persistence", "no backend/API import", "no official evidence".
- [ ] No wording anywhere implies production import or real data will be saved.

## Confirm Import (AP-10B)
- [ ] Confirm Import button/control is visible (never hidden).
- [ ] Button is disabled (`disabled` + `aria-disabled`).
- [ ] Shared `DisabledActionHint` with `apCode="AP-10B"` is immediately adjacent and clearly states the governance blocker.
- [ ] No code path enables or bypasses the disabled state.

## AP-10C / AP-11
- [ ] Any export or decision controls on the page (if present) are visibly disabled with correct hint.
- [ ] No approval/sign-off language appears.

## Validation Summary & Sheet Detection
- [ ] Sections are grouped under `SectionHeader` for scannability.
- [ ] Status badges use the correct preview/blocked colors from the design system.
- [ ] Error/warning/manual-mapping rows are clearly distinguishable without relying on color alone.

## Reset Preview
- [ ] "Reset preview" control is present and clearly labeled as UI-only.
- [ ] Clicking it discards local preview state only (no API, no audit write, no persistence).

## Technical Safety (static + runtime)
- [ ] `npm run build` passes (42/42).
- [ ] `npm run check:tokens` passes (4/4).
- [ ] `npm run check:audit-events` passes (502/502).
- [ ] No new `fetch`, `axios`, `/api/`, `localStorage`/`sessionStorage` writes for production data.
- [ ] No `AuditService`, `writeAudit`, or repository calls added.
- [ ] `git diff --name-only` shows only the import-preview page (or approved supporting shared files).

## Regression (MC91–MC95 surfaces)
- [ ] `/admin/audit-log` evidence boundary (MC94) not regressed.
- [ ] `/staff/applications` work queue (MC95) not regressed.
- [ ] `/admin/dashboard`, provider, ESQ, login role theme (MC92–MC93) not regressed.
- [ ] `/login` and Topbar notifications (MC91) not regressed.

## Manual Visual (localhost)
- Open http://localhost:3000/admin/master-data/import-preview (or current dev port).
- Banner is impossible to miss.
- Confirm Import is visibly disabled with reason.
- No production or "ready to import" implication.
- Thai/English layout is clean.
- Keyboard focus reaches all interactive elements.

**Any "No" = do not merge. Fix and re-validate.**

This checklist, together with the copy guide, must be re-run before every PR that touches the import preview flow.

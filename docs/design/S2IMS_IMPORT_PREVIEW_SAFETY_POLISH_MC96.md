# S²IMS Import Preview Safety Polish — MC96

**Branch**: feature/s2ims-import-preview-safety-polish-mc96  
**Date**: 2026-05-23  
**Scope**: `/admin/master-data/import-preview` page only (governance-critical AP-10B surface)

## Summary

MC96 strengthens the visual safety boundary on the master data import preview page using the shared Soft Civic primitives shipped in MC87–MC95. The page now makes the "preview-only / synthetic / no persistence / AP-10B blocked" state impossible to miss while preserving 100% of the existing validation, filtering, sheet detection, manual mapping, and disabled Confirm Import behavior.

## Page Changed

| Route | Change |
|------|--------|
| `/admin/master-data/import-preview` | Replaced custom amber SafetyBanner with shared `SafetyBanner` (tone="preview", AP-10B), wrapped Confirm Import disabled gate with shared `DisabledActionHint` (AP-10B), added `SectionHeader` grouping for scannability, reinforced synthetic/no-persistence/no-official-evidence language. |

## Safety & Governance Improvements

- Permanent shared `SafetyBanner` (magenta-violet preview tone) at the very top with explicit "AP-10B Gate — Preview Only", "synthetic/mock data only", "no persistence", "no backend/API import", "no official evidence", and "Confirm Import remains disabled".
- Confirm Import button remains visibly disabled (never hidden) and is now paired with the shared `DisabledActionHint` clearly stating the AP-10B governance blocker.
- AP-10B / AP-10C / AP-11 status is now scannable via the banner + hint pattern consistent with MC94 (audit-log) and MC95 (staff queue).
- Validation summary and sheet detection sections grouped under `SectionHeader` for better hierarchy.
- All existing acknowledgment checkboxes and "Reset preview" (UI-only) behavior preserved exactly.

## Behavior Preserved (Non-Negotiable)

- `parseMasterDataImportWorkbook` and all validation/filtering logic untouched.
- Confirm Import remains a no-op (visible but disabled).
- No fetch, no persistence, no audit write, no export, no official evidence creation.
- Future source types remain blocked with "Blocked until future governance approval".
- Student PII import explicitly blocked.
- No change to route protection or data semantics.

## Validation Results

- `npm run build`: 42/42 (passed after prop fix on DisabledActionHint).
- `npm run check:tokens`: 4/4.
- `npm run check:audit-events`: 502/502.
- Static safety: only `src/app/admin/master-data/import-preview/page.tsx` edited; no package/tools changes; no new API/persistence/audit calls.
- Localhost smoke (dev server on :3000): import-preview route reachable; related MC91–MC95 routes (audit-log, staff applications, login, dashboard) not regressed by this change.

## Final Safety Statement

MC96 polishes the import preview safety boundary only. It preserves preview-only / synthetic / no-persistence behavior, does not enable Confirm Import, does not enable persistence/import/export/audit writes/official evidence, and does not open AP-10B/AP-10C/AP-11.

Next recommended milestone: MC97 (or any follow-up) can continue applying the same primitives to remaining Tier-1 surfaces if needed; the import-preview page is now aligned with the post-MC95 Soft Civic + governance pattern.

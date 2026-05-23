# S²IMS Import Preview AP Boundary and Copy Guide — MC96

**Purpose**: Authoritative approved/forbidden language and visual treatment for the `/admin/master-data/import-preview` page and any future references to the master data import preview flow.

## Approved Language (use these)

**Banner / Header level**
- "AP-10B Gate — Preview Only"
- "This page parses .xlsx files in browser memory for validation preview only. No data is persisted, no import session is created, no audit events are written, and no official evidence is produced."
- "Synthetic / mock data only"
- "No persistence"
- "No backend/API import"
- "No official evidence"
- "Confirm Import remains disabled"

**Confirm Import gate**
- "Confirm Import is blocked pending AP-10B governance approval. This page performs validation preview only."
- "Confirm Import disabled in MC54" (or current milestone)
- "Preview state is discarded on reset or page reload. No import session is created."

**Future / blocked sources**
- "Blocked until future governance approval."
- "Student PII import is not allowed in this flow."

**General**
- "Preview only"
- "This does not open AP-10B"
- "This does not create official evidence"
- "This import is master-data seed only"

## Forbidden Language (never use)

- "Import complete"
- "Production import"
- "Data persisted / saved to system"
- "Official evidence created"
- "Approved"
- "Sign-off recorded"
- "Audit evidence created"
- "Export ready"
- "Ready for production"
- Any phrasing that implies the preview leads directly to real import or governance approval without the AP-10B process.

## Visual Treatment (post-MC96)

- Use shared `<SafetyBanner tone="preview" apCodes={['AP-10B']} ... />` at the top of the page (first content after PageHeader).
- Use shared `<DisabledActionHint apCode="AP-10B" reason="..." > <disabled-button ... /> </DisabledActionHint>` for the Confirm Import control.
- Keep the disabled button visible (never hidden or removed from DOM).
- Use `StatusBadge status="preview"` for badges.
- Use `SectionHeader` for logical groups (Workbook Preview, Validation Summary, Confirm Import Gate).

## AP-10C / AP-11 Context

- Export on this page (if any) must also be visibly disabled with AP-10C hint (consistent with MC94).
- No approval/sign-off language or controls (AP-11) may appear.

## Thai/English

All approved phrases above have natural Thai equivalents that must be used in bilingual UI. The structure (banner first, hint immediately with the disabled control, no color-only signaling) must be preserved in both languages.

This guide must be followed in any future polish or extension of the import preview flow.

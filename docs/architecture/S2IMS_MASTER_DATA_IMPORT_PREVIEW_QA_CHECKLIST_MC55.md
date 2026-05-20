# S2IMS Master Data Import Preview QA Checklist - MC55

## Purpose
Actionable checklist for QA validation of the MC54 preview-only master data import runtime (applies to MC55 planning checks). This checklist is docs-only and must be executed as part of the MC55 QA checkpoint.

## Route checks
- [ ] `/admin/master-data/import-preview` is hidden from navigation and only reachable via admin-shell guard
- [ ] Route is not listed in sidebar/topbar/mobile navigation
- [ ] No public links point to the route

## Upload / File picker checks
- [ ] Accepts only `.xlsx` and optionally CSV files
- [ ] Rejects files with size > 10 MB (soft warn at 5 MB)
- [ ] Rejects files with more than 10,000 rows or 200 columns per sheet
- [ ] Provides clear error messages for unsupported file types

## Parsing checks
- [ ] Parser catches malformed files and surfaces safe user error
- [ ] Hidden sheets are detected and not silently imported
- [ ] Formula cells are read as raw text and not evaluated
- [ ] Merged cells are detected and normalized or flagged
- [ ] Embedded objects are ignored and raise a warning
- [ ] Unicode and Thai/English name normalization applied

## Validation checks
- [ ] Duplicate `cmu_mail` detection blocks confirmation
- [ ] `cmu_mail` format validation (regex and domain hints)
- [ ] Required name fields validation
- [ ] Forbidden column detection (block on PII columns)
- [ ] Unresolved manual mapping queue items count displayed
- [ ] Warnings vs Errors clearly distinguished

## Forbidden column checks
- [ ] Detect explicit forbidden columns (national_id, bank_account, phone, student_id, raw_document, etc.)
- [ ] Detect alias names via fuzzy match (e.g., id_card, cid, passport_no)
- [ ] Block preview confirmation if forbidden columns present

## UI copy checks
- [ ] Preview page includes visible "Preview only" and "Not official evidence" labels
- [ ] Confirm Import button is disabled and visually indicated as disabled
- [ ] Clear preview action available and clears in-memory data

## Accessibility checks
- [ ] All interactive controls reachable by keyboard
- [ ] ARIA labels for file picker, preview table, warnings/errors
- [ ] Screen reader compatibility for error/warning messages

## No-persistence / No-backend checks
- [ ] No network requests triggered by file parsing or preview actions
- [ ] No usage of localStorage/sessionStorage/IndexedDB for parsed data
- [ ] No background upload endpoints called

## No-audit-write checks
- [ ] Confirm no audit-write invocation in the import-preview component or helper code

## Confirm-import-disabled checks
- [ ] Confirm Import button is disabled and does not perform any action
- [ ] No import session record is created in runtime

## Dependency checks
- [ ] Document exceljs@4.4.0 usage and recorded audit findings in dependency register
- [ ] Confirm no dependency changes were made in this branch

## AP-gate checks
- [ ] AP-10B remains blocked and no owner/approval is recorded

## Sign-off
- QA reviewer(s):
- Date:
- Notes:

# S2IMS Master Data Import Preview QA Hardening Plan - MC55

## 1. Purpose

Document QA hardening requirements for the MC54 preview-only master data import runtime. This is a documentation-only planning package. No runtime code changes, no dependency upgrades, no npm audit fixes, no persistence, and no AP-10B gate changes are performed in MC55.

## 2. Current Runtime Inventory

- Route: `/admin/master-data/import-preview` (hidden admin-only route)
- Component: `src/components/assignment/MasterDataImportPreview.tsx`
- Helpers: `src/lib/master-data-import/*` (types, normalization, validator, excelParser)
- Dependency: `exceljs@4.4.0` (used for browser parsing via ArrayBuffer)
- Validation baseline: Build 42/42, Tokens 4/4, Audit/event checks 502/502, Routes 7×200 OK
- Confirm Import gate: present but disabled (no-op) in MC54

## 3. Safety Boundary

MC54 runtime guarantees (must remain enforced):
- Preview-only: all parsing and normalization happens in browser-memory only
- No upload-to-server behavior or upload endpoints
- No persistence in DB or browser storage
- No backend/API endpoints added
- No audit writes
- No official evidence created
- Confirm Import remains disabled until governance-approved AP-10B resolution

## 4. File Size and Memory Safety

Recommendations (QA hardening):
- Max file size threshold (client-side): 10 MB soft limit. Show warning above 5 MB and block above 10 MB by default.
- Max row threshold: 10,000 rows across all sheets (soft warning at 2,000 rows; block at 10,000 rows). For larger sources recommend offline pre-processing.
- Max columns threshold: 200 columns per sheet; unusual column counts should flag for review.
- Fail-fast on oversized files: detect file size and abort parsing early with user-facing error.
- Clear preview memory behavior: provide explicit "Clear preview" action that drops all in-memory parsed data and releases ArrayBuffer references.
- No browser storage: ensure no use of localStorage/sessionStorage/IndexedDB for parsed source or previews.
- Progressive parsing: where possible, parse sheets incrementally rather than reading full workbook into memory at once.

Rationale: Browser memory is limited and Excel files may contain large numbers of cells or heavy objects (images, formulas). Hard limits protect clients from out-of-memory and unresponsive behavior.

## 5. Excel Parsing Risk

MC54 uses exceljs@4.4.0 with ArrayBuffer parsing in the browser. QA must harden for parsing risk classes:
- Malformed workbook files causing parser exceptions: catch errors and show safe error UI (no stack trace leakage).
- Hidden sheets: detect and list hidden sheets; do not auto-include hidden sheets in previews unless admin explicitly toggles them.
- Formula cells: treat formulas as raw text values in preview; do not evaluate formulas.
- Merged cells: detect merged regions and normalize to per-row values where applicable or flag for manual review.
- Unexpected data types (dates, numbers, booleans): normalize consistently and show parsing warnings for ambiguous types.
- Encoding and Thai/English name normalization: ensure unicode normalization and trimming. Document expected encodings (UTF-8 recommended) and reject files with unsupported encodings.
- Embedded objects (images, OLE objects): strip and ignore these during parsing; show a warning if such objects were found.
- Large workbook memory impact: detect workbook metadata (sheet count, cell count estimate) before parsing full data to decide whether to accept or block.

## 6. Formula Injection / Unsafe Cell Content

Prevent formula-injection and unsafe cell content exposure:
- Never evaluate formulas. Always read formula cells as text, and display them literally (e.g., "=SUM(A1:A10)").
- When exporting or copying preview rows to CSV/HTML, prefix values that start with `=`, `+`, `-`, or `@` with a single quote or safe marker to avoid interpretation in spreadsheet clients.
- Escape all cell display content before rendering in the DOM. Do not use innerHTML.
- Disallow rendering raw HTML or script-like content from cells. Sanitize values and render as text nodes.
- For any export functionality (planned future), implement spreadsheet-safe escaping and a clear warning banner about formula content.

## 7. Forbidden Column / PII Hardening

Explicit forbidden columns (detect and block in preview stage):
- national_id
- citizen_id
- id_card
- bank_account
- account_number
- phone
- mobile
- health
- medical_record
- signature
- family_income
- student_id
- student_number
- raw_document
- raw_attachment

Hardening rules:
- If forbidden columns are present, block preview confirmation and surface a clear error explaining the PDPA/legal restriction.
- Implement fuzzy detection of similar column names (e.g., `id_no`, `idcard`, `cid`, `personal_id`) using a small alias list.
- If column names contain likely PII tokens (e.g., `ssn`, `passport`, `bank`), mark as sensitive and require removal prior to preview confirmation.
- Unknown columns that look like contact or ID fields should be flagged with a warning and recommended removal before future import.

## 8. Validation Model Hardening

Harden the following validation behaviors in preview:
- Duplicate cmu_mail: exact-match duplicates are blocking until resolved.
- Invalid cmu_mail: fail email regex check and show row-level error.
- Missing full_name or given_name/family_name: blocking error.
- Unknown sheet type: require admin confirmation before mapping.
- Staff/Teacher overlap: show a warning with possible role conflict and require admin decision.
- Inactive employment_status: warn but not block (configurable). If policy requires, make inactive records blocking.
- Unresolved mapping queue: items must be resolved or explicitly deferred with admin acknowledgement before any future confirm.
- No student PII import: any row that appears to be student data (student_id, enrollment_id) must be blocked from preview ingested as master.

QA Hardening suggestions:
- Add strict regex checks for `cmu_mail` domain pattern (e.g., ends with `@cmu.ac.th` or company-accepted domains), but allow configurable exceptions for verified cases.
- Normalize emails (lowercasing, trim) before duplicate detection.
- Enforce deterministic deduplication and a preview of merge outcomes rather than silent merges.

## 9. Route Exposure Checks

Confirm and document the following route exposure rules:
- `/admin/master-data/import-preview` is hidden from sidebar/topbar/mobile navigation.
- Page remains reachable only by admin-guarded routes; verify server/auth guard present.
- No external provider access or unauthenticated access allowed; review auth middleware.
- No links or referrals to this route from public pages or marketing pages.

QA checks:
- Verify navigation config excludes this route.
- Verify route imports are limited to admin app shell only.

## 10. Confirm Import Gate

Confirm import gate behavior:
- Confirm Import remains disabled (no-op) in MC54 and must remain disabled in MC55 artifacts.
- Any future enablement requires AP-10B governance approval and passing the Before-Persistence checklist.
- Confirm Import must be gated behind explicit approvals, owner/approver assignment, retention policy, and audit-write policy.

## 11. Dependency Risk Plan

Inventory & context:
- `exceljs@4.4.0` used in MC54 for browser parsing.
- `npm install exceljs@4.4.0` reported audit findings during MC54 implementation; MC54 intentionally did not run fixes.

Constraints for MC55:
- Do NOT run `npm audit fix` or upgrade dependencies in this documentation package.
- Do NOT change package.json or package-lock.json.

Risk classification guidance:
- Low: informational findings, no known exploit in browser-only usage.
- Medium: findings with moderate severity but low exploitability in client-only context.
- High: findings with clear exploit vectors usable in the browser parsing context (e.g., remote code execution via parsing library callbacks, filesystem access in node-only contexts not present in browser). Treat as high if proof-of-concept affects library behavior used in browser.
- Blocked: vulnerability that cannot be mitigated by configuration and requires immediate shutdown of the preview runtime until a patched dependency is applied.

Actions:
- Document exact `npm audit` findings in a separate dependency risk register (MC55 dependency register) with CVE IDs where present.
- Conduct a security triage: assess exploitability in client-side ArrayBuffer parsing and whether the vulnerability requires server-side capabilities to be exploitable.
- If a finding is High/Blocked, plan a security hotfix branch and consider disabling the preview page until patched.
- Do not run quick-fix upgrades on `main`; instead open a dedicated dependency-risk branch for security upgrades with full QA and approvals.

## 12. Before-Persistence Checklist

All items must be satisfied before any persistence/import confirmation is implemented:
- AP-10B owners identified and assigned (7 owners)
- AP-10B approvals collected (7 approvals) or explicit governance override documented
- PDPA/legal review complete with documented retention and PII handling rules
- Audit write policy approved and evidence rules defined
- Persistence schema design approved (tables, constraints, indexes, migration plan)
- Retention policy and deletion/archival strategy approved
- Import session model defined and rollback plan approved
- Responsible person assignment integration design approved
- Official evidence rules defined and sign-off collected if evidence creation is required
- QA and security reviews complete (dependency risk resolved or mitigations documented)

## 13. AP-10B Blocked-Gate Reminder

MC55 is a planning-only package. AP-10B remains blocked; do NOT open or clear blockers as part of MC55.

## 14. Post-Merge Operational Notes

- Create QA artifacts summarizing test results and validations.
- Record any dependency audit findings in the dependency risk register.
- Recommend a follow-up security review branch (MC56) for dependency upgrades and triage.

---

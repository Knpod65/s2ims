# S2IMS ExcelJS Dependency Security Review Plan - MC56

## 1. Purpose

Document a dependency security review and mitigation plan specific to `exceljs` usage in the MC54 preview-only master data import runtime. MC56 is documentation-only: it will not change dependencies, run `npm audit fix`, modify runtime code, or alter runtime behavior.

## 2. Current Dependency Context

- Direct dependency: `exceljs@4.4.0` (loaded in browser via ArrayBuffer parsing)
- Usage scope: parsing `.xlsx` files client-side in `/admin/master-data/import-preview`
- No upload-to-server, no persistence, no backend/API, no audit writes, Confirm Import disabled

## 3. Dependency Inventory
- Direct: exceljs@4.4.0
- Transitive: see package-lock.json (do not modify here)
- Areas of exposure: browser ArrayBuffer parsing path only; build-time dependencies that affect bundle should be noted

## 4. Audit Finding Triage Process
1. Capture current `npm audit --json` output in a secure review branch (do not run fix on `main`).
2. For each advisory:
   a. Record package, version, advisory ID/CVE, severity
   b. Trace vulnerable call path from package-lock
   c. Determine whether vulnerable API is used by browser parsing flow
   d. Assess exploitability from a crafted workbook in browser-only environment
   e. Classify as Low/Medium/High/Critical/Blocked
   f. Record available patch versions and changelog notes
3. Produce a small security triage report for governance review

## 5. Severity Model
- Low: informational, trivial or requires significant preconditions not present in browser parse
- Medium: exploitable but mitigable through sandboxing/limits
- High: exploitable via crafted workbook leading to client compromise or data leak in the browser
- Critical: direct code execution or same-origin token exfiltration via browser parsing
- Blocked: vulnerability reachable via preview path and cannot be mitigated without dependency change or disabling feature

## 6. Exploitability Assessment Model
- Reachability: can the vulnerable function be reached by `exceljs` when parsing a crafted workbook in the browser? (Yes/No)
- Preconditions: does exploit require server-side capabilities? (e.g., filesystem, process spawning)
- Impact surface: memory exhaustion, XSS-like DOM injection, leakage of local-sensitive values, crash/DoS
- Likelihood: probability given untrusted workbook upload in admin context
- Mitigation available: configuration or runtime guard

## 7. Mitigation Options
- Non-code mitigations (immediate): file-size, row-count, column-count limits; block hidden sheets; formula handling rules; forbidden column detection
- Containment: restrict route access to a smaller admin group, add manual review controls
- Patch/upgrade: move to patched `exceljs` release in a dedicated upgrade branch
- Replace: evaluate alternative browser parsing libraries with smaller attack surface
- Defer: disable preview route if Blocked severity discovered until patched

## 8. Upgrade Decision Tree
- If findings are Low: monitor and schedule regular upgrade
- If Medium: implement non-code mitigations and plan patch branch
- If High: create an upgrade branch and security regression tests; restrict route until patch applied
- If Critical/Blocked: disable preview feature and open emergency upgrade branch; escalate to governance

## 9. Package-Change Branch Policy
- Branch name format: `security/dependency-upgrade/exceljs-<target-version>-mcXX`
- Branch must include: package.json diff, package-lock diff, build/test validation, parser regression tests, security triage notes
- PR must reference CVEs/fixes and include mitigation matrix
- No force merges; require two security reviewers + product owner approval

## 10. Test Plan for Dependency Upgrade
- Unit tests for parser normalization/validator
- Regression scenarios:
  - Empty workbook
  - Staff sheet
  - Teacher sheet
  - Combined personnel file
  - Duplicate cmu_mail
  - Missing cmu_mail
  - Invalid email
  - Forbidden columns
  - Large file thresholds
  - Formula cells (should remain text)
  - Hidden sheet handling
  - Thai/English name normalization
- Performance tests for parsing up to soft/hard limits
- Browser manual tests: confirm preview UI, clear preview, Confirm Import disabled

## 11. Rollback Plan
- If upgrade causes issues, revert PR; restore package-lock
- Re-run build and regression tests
- Re-open triage ticket with fail cause and mitigation

## 12. Before-Runtime-Hardening Checklist
- Audit triage completed and documented
- File-size and row-count thresholds decided and documented
- Formula handling policy decided (display-only)
- Forbidden column detection patterns finalized
- Route access re-validated
- AP-10B gate remains blocked

## 13. AP-10B Blocked-Gate Reminder
- MC56 is docs-only and must not open or clear AP-10B
- Any runtime or dependency change that affects evidence/persistence requires AP-10B resolution

## 14. Deliverables & Next Steps
- Produce `npm audit --json` export in secure review branch (not on main)
- Security triage report mapping advisories to exploitability in browser parse path
- If any High/Critical/Blocked findings, plan an urgent security upgrade branch
- Otherwise, schedule patching in regular dependency maintenance window and track via NEXT_RENOVATION_STEPS

--

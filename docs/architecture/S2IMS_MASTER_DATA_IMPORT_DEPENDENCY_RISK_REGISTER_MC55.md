# S2IMS Master Data Import Dependency Risk Register - MC55

## Purpose
Document dependency inventory and risk handling guidance for the MC54 master data import preview runtime. This register records known findings and recommended actions for maintainers and security reviewers.

## Dependency Inventory
- exceljs@4.4.0 — used in browser parsing for MC54 via ArrayBuffer
- transitive dependencies: see package-lock.json (do NOT modify in MC55)

## Known Notes
- `npm install exceljs@4.4.0` reported audit findings during MC54 implementation. MC54 intentionally did not run `npm audit fix`.
- MC55 will document audit findings and a review path but must not change dependencies or run fixes on `main`.

## Risk Classification Model
- Low: informational or moderate CVSS with unlikely client-side exploitability
- Medium: CVSS moderate with possible exploitability in client parsing context
- High: CVSS high, plausible client-side exploitability that affects parsing code
- Blocked: vulnerability requires immediate mitigation and prevents safe preview usage

## Example Register Entry (template)
- dependency: exceljs
- version: 4.4.0
- CVE/issue: <CVE-ID or advisory link>
- audit-level: moderate/high/critical
- exploitability in browser parse: low/medium/high (assessed by security team)
- planned action: triage, patch, backport, or isolate
- notes: do not run `npm audit fix` on main; create dedicated dependency-risk branch

## Recommended Review Actions
1. Run `npm audit --json` in a secure environment to capture the list of advisories and CVE IDs (do not apply fixes on `main`).
2. For each advisory, perform exploitability analysis focused on browser `ArrayBuffer` parsing usage:
   - Determine whether attack requires server-side capabilities (e.g., filesystem, child_process).
   - Determine whether attack can be triggered by a crafted `.xlsx` file processed in client memory.
3. Prioritize advisories by severity and browser-exploitability to classify each Low/Medium/High/Blocked.
4. For High/Blocked findings, consider disabling the preview route until a security branch patches or mitigates the issue.
5. For Medium findings, document mitigation controls (limits on file size, input validation, sandboxing) and schedule a patch branch.
6. For Low findings, continue monitoring and schedule upgrade in regular dependency maintenance window.

## Forbidden Actions (MC55 scope)
- Do not run `npm audit fix` on `main`.
- Do not upgrade exceljs on `main` in this package.
- Do not change package.json or package-lock.json in MC55.

## Future dependency update branch recommendation
- Open a branch `security/dependency-upgrade/exceljs-<target>` to test upgrades and fixes.
- Include security tests and a change log of fixed advisories.
- Run full QA and security review before merging upgrade branch to main.
- If a patched version is not available, consider vendor-patching or an isolation strategy until patching is possible.


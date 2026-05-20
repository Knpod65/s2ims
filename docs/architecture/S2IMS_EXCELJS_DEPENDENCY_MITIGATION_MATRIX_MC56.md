# S2IMS ExcelJS Dependency Mitigation Matrix - MC56

## Purpose

Document mitigation strategies and implementation milestones for potential exceljs-related risks discovered during MC54/MC55 planning.

| Risk Area | Exposure | Mitigation | Implementation Milestone | Current Status | Decision Needed |
|---|---:|---|---|---|---|
| Vulnerable transitive dependency | Build/runtime | Upgrade dependency in dedicated branch; apply security patch | security/dependency-upgrade/exceljs-<ver>-mc56 | documented only | Review advisory list |
| Malicious workbook | Browser parse | File-size/row-count limits; fail-fast parse; sanitize cell content | MC55 hardening (docs) → runtime guard in future branch | documented only | Decide thresholds |
| Formula cell injection | Browser parse | Treat formula cells as text; escape on export; prefix `"'"` on CSV export | Implement UI sanitizer in upgrade branch | documented only | Confirm policy |
| Hidden sheet parsing | Browser parse | Hide by default; require toggle to include | Future runtime feature | documented only | Confirm UX toggle behavior |
| Memory exhaustion | Browser parse | Row/column limits; incremental parsing; abort on OOM | Runtime hardening branch | documented only | Confirm limits and testing plan |
| Large row count | Browser parse | Soft/Hard thresholds (2k warning, 10k block) | Runtime limits enforcement | documented only | Threshold sign-off |
| Unexpected cell types | Parsing | Normalize types; warnings for ambiguous types | Parser regression test suite | documented only | Test cases needed |
| Encoding issues (Thai/EN) | Parsing | Unicode normalization, trim, replace invalid chars | Parser normalization tests | documented only | Confirm rules |
| Browser-only route exposure | Route config | Confirm auth/guard; restrict admin role list | Security review | documented only | Confirm admin roles |
| Future server upload risk | Backend | Limit server-side upload; validate server parsing separately | Server hardening branch | not applicable in MC56 | N/A |
| Persistence / Official evidence | DB/audit | AP-10B gating; require approvals before persistence | Governance branch | blocked | AP-10B resolution |

Notes: All mitigation items are documented only in MC56. Implementation requires separate runtime/upgrade branches and governance approvals.

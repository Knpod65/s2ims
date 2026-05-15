Audit Admin Comparison Debug Panel Stage 4 Production Safety AP-9G

1. Production-disabled-by-default rules

All AP-9G feature flags must default to false in DEFAULT_AUDIT_PERSISTENCE_CONFIG at all times. No flag may default to true in any production build. The component must return null — with no DOM trace — in the default configuration. This rule applies to all environments unless an explicit staging-only override is in place for an approved review session.

A change to DEFAULT_AUDIT_PERSISTENCE_CONFIG that sets any AP-9G flag to true is a blocking violation and must not be merged to main.

2. Required default flag values

| Flag | Required default | Location |
|------|-----------------|----------|
| adminDebugPanelEnabled | false | DEFAULT_AUDIT_PERSISTENCE_CONFIG in src/lib/audit/storage/auditPersistenceConfig.ts |
| prototypeMetricsEnabled | false | DEFAULT_AUDIT_PERSISTENCE_CONFIG in src/lib/audit/storage/auditPersistenceConfig.ts |
| adminComparisonStagingReviewEnabled | false | DEFAULT_AUDIT_PERSISTENCE_CONFIG in src/lib/audit/storage/auditPersistenceConfig.ts |
| prototypeEnabled | false | DEFAULT_AUDIT_PERSISTENCE_CONFIG in src/lib/audit/storage/auditPersistenceConfig.ts |
| shadowWrites | false | DEFAULT_AUDIT_PERSISTENCE_CONFIG in src/lib/audit/storage/auditPersistenceConfig.ts |
| readFromPrototype | false | DEFAULT_AUDIT_PERSISTENCE_CONFIG in src/lib/audit/storage/auditPersistenceConfig.ts |

3. Forbidden production states

The following states must never occur in production:

- Panel visible to any non-admin role
- Stage 3 aggregate path active without both prototypeMetricsEnabled and adminComparisonStagingReviewEnabled set to true via an explicit staging-only override
- Any AP-9G flag set to true in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- Comparison data visible in any export, download, CSV, or clipboard operation
- PII in any UI surface, log line, analytics event, or session note
- "Not official audit evidence" note absent from any enabled panel render
- Admin Audit Log table showing comparison data from the prototype read path
- Official audit CSV export containing comparison rows or prototype read data

4. What must never be shown in production (or any environment)

The following data classes must never appear in any render path of the debug panel, in any log, in any analytics event, or in any session notes:

- actorId (actor identifier from any audit event)
- targetId (target entity identifier from any audit event)
- reason (reason text from any audit event)
- metadata values (any field under event.metadata)
- raw event IDs (sourceEventId, prototypeEventId, or any internal event UUID)
- student ID (in any format: raw, tokenized, or partial)
- national ID (in any format: raw, masked, or partial)
- email address
- phone number
- bank account number
- IP address
- file names or file paths from uploaded documents
- OCR text or extracted document content
- uploaded document identifiers or storage keys

5. What may be shown only after explicit staging-only enablement

The following data classes may appear in the Stage 3 aggregate render path only during an approved, staging-only, assigned-reviewer session:

- createdAt (timestamp of the comparison run — no actor or target timestamp)
- safeMessage (pre-sanitized safe summary string from the comparison metrics store)
- status (comparison status: matched, mismatched, or failed)
- sourceCount (count of source audit entries in the comparison run)
- prototypeCount (count of prototype read entries in the comparison run)
- mismatchCount (count of mismatched entries in the comparison run)
- Aggregate totals: total runs, matched count, mismatched count, failed count

All of the above are subject to the approval gate defined in AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_APPROVAL_GATE_AP9G.md.

6. PII safety rules

- Any field not on the permitted list in section 5 must be masked or omitted entirely
- The note "Prototype reads are diagnostic — not official audit evidence" is mandatory in all states where the panel renders any content
- Any PII discovered in the UI, logs, screenshots, session notes, or analytics — regardless of source — triggers immediate rollback per the procedure in AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_ROLLOUT_AND_ROLLBACK_AP9G.md
- Session notes from any staging review must use aggregate-only language and must not include any value from the forbidden list in section 4
- Screenshots taken during staging reviews must not contain any value from the forbidden list

7. Export restrictions

- No export, CSV, download, or clipboard copy of any comparison data is permitted
- The official Admin Audit Log CSV export path (exportAuditCSV in src/app/admin/audit-log/page.tsx) must remain unchanged and must include only the official display rows
- Any future export feature must go through a separate PR and approval process that explicitly excludes comparison or prototype read data
- The debug panel must not add any export action, button, or keyboard shortcut

8. Logging restrictions

- No PII (as defined in section 4) may appear in console logs, server logs, Next.js server-side logs, or analytics events emitted by the debug panel or its comparison service
- Log lines related to the comparison panel must use aggregate counts and status codes only
- Any log line containing a value from the forbidden list in section 4 is a PII incident

9. Incident triggers

The following conditions trigger an immediate incident response and rollback:

- PII found in any surface (UI, console, server log, analytics, screenshot, or session note)
- Panel visible to a non-admin session in any environment
- Comparison data appearing in any export, CSV, download, clipboard, or log
- Build, token, or audit checks failing after any flag change
- Route smoke returning non-200 for any of the five required routes after any flag change
- Any gate condition removed, reordered, or weakened in the component
- "Not official evidence" note absent from any enabled render

Rollback procedure: see AUDIT_ADMIN_COMPARISON_DEBUG_PANEL_STAGE4_ROLLOUT_AND_ROLLBACK_AP9G.md.

10. Production readiness checklist

Before any Stage 4 runtime PR is considered production-ready, all of the following must be confirmed:

- [ ] adminDebugPanelEnabled defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] prototypeMetricsEnabled defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] adminComparisonStagingReviewEnabled defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] prototypeEnabled defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] shadowWrites defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] readFromPrototype defaults false in DEFAULT_AUDIT_PERSISTENCE_CONFIG
- [ ] Role guard (role !== 'admin' → null) is first check in component
- [ ] Enabled guard (!enabled → null) is second check in component
- [ ] Stage 3 gate requires both prototypeMetricsEnabled and stagingReviewEnabled
- [ ] No PII in any render path (all items in section 4 confirmed absent)
- [ ] "Not official evidence" note present in all non-null render states
- [ ] Official Admin Audit Log CSV export unchanged
- [ ] No comparison data in any log or analytics event
- [ ] All 5 approvals obtained (engineering, privacy/PDPA, product/admin owner, QA, rollback owner)
- [ ] Rollback tested in staging before production merge

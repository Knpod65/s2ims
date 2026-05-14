# Audit Prototype Integration QA Checklist AP-9B

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-integration-plan-ap9b`

Use checkbox-style sections for review.

---

## A. Docs-Only Safety

- [ ] No runtime code modified (`src/*` untouched)
- [ ] No scripts modified (`scripts/*` untouched)
- [ ] No `package.json` modified
- [ ] No backend/API routes added
- [ ] No database migrations created
- [ ] No mock fixtures mutated (`src/data/mock/audit-logs.ts` untouched)
- [ ] No Staff callbacks modified
- [ ] No Staff verify action wired
- [ ] No reason validation changed
- [ ] No `ReasonRequiredModal` introduced
- [ ] No notification behavior changed
- [ ] No PII exposed in any file
- [ ] No `src/app/*` files modified
- [ ] No `src/components/*` files modified
- [ ] No `real_persisted` mode introduced
- [ ] AP-9B runtime not started
- [ ] AP-10 not started

## B. Feature Flag Matrix

- [ ] All flags defined with explicit defaults
- [ ] All flags default to `false`
- [ ] Master switch (`auditPrototypeEnabled`) gates all other flags
- [ ] Flag naming convention is consistent (`auditPrototype*`)
- [ ] Laravel/PHP config mapping provided for all flags
- [ ] Environment variable equivalents defined
- [ ] Forbiddden flag combinations documented
- [ ] Flag dependencies are explicit (shadow write → read compare → admin visible)

## C. Shadow Write Strategy

- [ ] Source-of-truth rule documented (`sharedMockWriter` is primary)
- [ ] Write sequence documented (primary → shadow)
- [ ] Error handling defined (non-blocking, log only)
- [ ] Privacy gates before shadow write documented
- [ ] Duplicate prevention mechanism documented
- [ ] Metrics to collect during shadow writes defined
- [ ] Rollback behavior for disabling shadow writes documented

## D. Read Comparison Strategy

- [ ] Comparison dimensions defined (count, IDs, types, roles, tokens, mode, metadata, timestamps, presenter output)
- [ ] Mismatch categories defined with severity levels
- [ ] Admin display safety confirmed (no switch to prototype reads)
- [ ] Debug output rules documented (no PII in logs)
- [ ] Comparison requires shadow write data to exist first
- [ ] Privacy rules for comparison output defined
- [ ] Rollback behavior for disabling comparison documented

## E. Privacy Gates

- [ ] Forbidden data classes documented (raw student ID, NID, email, phone, bank, IP, file names, OCR text)
- [ ] Safe data classes documented (display tokens, roles, types, codes, routes, severity, mode)
- [ ] Metadata allowlist referenced from `FORBIDDEN_AUDIT_METADATA_KEYS`
- [ ] Reason text handling: stored separately, access controlled, redacted in export
- [ ] IP handling: no raw IP, optional salted hash only
- [ ] Role visibility matrix for 6 roles defined
- [ ] Shadow write privacy gates documented (5 gates)
- [ ] Read comparison privacy gates documented (5 gates)
- [ ] Display presenter safety confirmed (single formatting boundary)

## F. Rollback Readiness

- [ ] Rollback triggers defined with severity levels
- [ ] Immediate rollback actions documented (disable flags)
- [ ] Post-rollback verification checklist defined
- [ ] Prototype storage clearing procedure documented
- [ ] Mock-only path preserved through rollback
- [ ] Incident notes template provided

## G. Monitoring Readiness

- [ ] Monitoring signals identified with thresholds
- [ ] Diagnostic message format defined (`[AUDIT PROTOTYPE]` prefix)
- [ ] Metrics collection opt-in (disabled by default)
- [ ] Developer-visible diagnostics separated from user-visible output

## H. Laravel/PHP Mapping

- [ ] Config keys mapped to `config/audit.php`
- [ ] Environment variables mapped for all flags
- [ ] Master switch (`enabled`) from AP-9A carries forward
- [ ] All new flags have PHP equivalents
- [ ] Mappings consistent with AP-8B schema and AP-9A contracts

## I. Existing Runtime Preservation

- [ ] `sharedMockWriter` remains active write path
- [ ] `mockAuditWriter` remains unchanged
- [ ] `adminAuditDisplayAdapter` remains active read path
- [ ] `AuditDisplayPresenter` remains single formatting boundary
- [ ] Staff document reject/replacement callbacks unchanged
- [ ] Admin audit log page unchanged
- [ ] Notification behavior unchanged
- [ ] Reason validation unchanged

## J. Integration Readiness

- [ ] Phased rollout sequence defined (monitoring → shadow → compare → admin visible)
- [ ] Each phase has entry criteria and exit criteria
- [ ] QA gates defined for each phase transition
- [ ] Rollback tested at each phase
- [ ] Privacy review required before first flag enabled
- [ ] Compliance review path defined

## K. Final Approval Checklist

- [ ] Reviewer has read all 8 AP-9B documentation files
- [ ] Reviewer has verified no forbidden files were modified
- [ ] Reviewer has confirmed build passes 40/40
- [ ] Reviewer has confirmed token check passes 4/4
- [ ] Reviewer has confirmed audit/notification checks pass 92/92
- [ ] Reviewer has confirmed route smoke tests pass (5/5)
- [ ] Reviewer has confirmed dev log is clean
- [ ] Reviewer has confirmed feature flags default to disabled
- [ ] Reviewer approves proceeding to future runtime phase (AP-9C or later)
- [ ] All A–J sections reviewed and checked
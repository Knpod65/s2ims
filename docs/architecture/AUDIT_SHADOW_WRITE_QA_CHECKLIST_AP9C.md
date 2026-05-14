# Audit Shadow Write QA Checklist AP-9C

**Planned on 2026-05-14.**

Branch: `architecture/audit-shadow-write-runtime-plan-ap9c`

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
- [ ] AP-9C runtime not started
- [ ] AP-10 not started

## B. Source-of-Truth Preservation

- [ ] `sharedMockWriter` remains the authoritative write path
- [ ] `sharedMockWriter` is never replaced or modified
- [ ] Shadow write is secondary (executes after primary write)
- [ ] Primary write must succeed before shadow write is attempted
- [ ] Shadow write failure does not affect primary write result

## C. Feature Flag Gates

- [ ] All flags defined with explicit defaults
- [ ] All flags default to `false`
- [ ] `auditPrototypeEnabled` gates all prototype behavior
- [ ] `auditPrototypeShadowWriteEnabled` required for shadow writes
- [ ] `auditPrototypeMetricsEnabled` opt-in for metrics
- [ ] Read comparison flags (`readFromPrototype`, `adminCompareVisible`) not active in AP-9C
- [ ] Forbidden flag combinations documented
- [ ] Flag dependencies are explicit
- [ ] Laravel/PHP config mapping provided for all flags
- [ ] Environment variable equivalents defined

## D. Shadow Write Sequence

- [ ] Source-of-truth rule documented (`sharedMockWriter` is primary)
- [ ] Write sequence documented (primary first, shadow second)
- [ ] Error handling defined (non-blocking, log only)
- [ ] Privacy gates before shadow write documented
- [ ] Duplicate prevention mechanism documented
- [ ] Metrics to collect during shadow writes defined
- [ ] Rollback behavior for disabling shadow writes documented
- [ ] Try/catch wrapping required at each insertion point

## E. Callback Mapping

- [ ] Candidate actions identified (document reject, replacement request)
- [ ] Excluded actions documented (verify, admin, provider, system events)
- [ ] Existing callback signatures not changed
- [ ] Existing toast behavior not changed
- [ ] Reason validation not changed
- [ ] Shadow write inserted after successful primary write
- [ ] Shadow write failure does not block UI flow
- [ ] Existing `sharedMockAuditWriter` import not replaced

## F. Privacy Gates

- [ ] Forbidden data classes documented (raw student ID, NID, email, phone, bank, IP, file names, OCR text)
- [ ] Safe data classes documented (display tokens, roles, types, codes, routes, severity, mode)
- [ ] Metadata allowlist referenced from `FORBIDDEN_AUDIT_METADATA_KEYS`
- [ ] Reason text handling: stored separately, access controlled
- [ ] IP handling: no raw IP, optional salted hash only
- [ ] Shadow write privacy gates documented (7 gates in sequence)
- [ ] Display presenter safety confirmed (single formatting boundary)
- [ ] No PII in log messages or metrics

## G. Failure Handling

- [ ] Failure classes defined with severity levels
- [ ] Non-blocking behavior documented for all failure types
- [ ] Try/catch wrapping at each insertion point
- [ ] No retry loops
- [ ] No notification side effects on failure
- [ ] Logging rules defined (`[AUDIT PROTOTYPE]` prefix)
- [ ] Metrics rules defined (aggregate, PII-free, opt-in)

## H. Admin Display Preservation

- [ ] Admin UI does not switch to prototype reads
- [ ] `adminAuditDisplayAdapter` remains active read path
- [ ] `AuditDisplayPresenter` remains single formatting boundary
- [ ] No prototype banner or indicator in UI
- [ ] No Admin UI flag indicates prototype data presence

## I. Staff Workflow Preservation

- [ ] Staff reject callback signature unchanged
- [ ] Staff replacement request callback signature unchanged
- [ ] Staff verify action not wired
- [ ] Toast behavior unchanged
- [ ] Reason validation unchanged
- [ ] `ReasonRequiredModal` not introduced
- [ ] Notification behavior unchanged

## J. Laravel/PHP Mapping

- [ ] Config keys mapped to `config/audit.php`
- [ ] Environment variables mapped for all flags
- [ ] Master switch (`enabled`) from AP-9A carries forward
- [ ] All new flags have PHP equivalents
- [ ] Mappings consistent with AP-8B schema and AP-9A contracts

## K. Rollback Readiness

- [ ] Rollback triggers defined with severity levels
- [ ] Immediate rollback actions documented (disable flags)
- [ ] Post-rollback verification checklist defined
- [ ] Mock-only path preserved through rollback
- [ ] Incident notes template available

## L. Final Approval Checklist

- [ ] Reviewer has read all 6 AP-9C documentation files
- [ ] Reviewer has verified no forbidden files were modified
- [ ] Reviewer has confirmed build passes 40/40
- [ ] Reviewer has confirmed token check passes 4/4
- [ ] Reviewer has confirmed audit/notification checks pass 92/92
- [ ] Reviewer has confirmed route smoke tests pass (5/5)
- [ ] Reviewer has confirmed dev log is clean
- [ ] Reviewer has confirmed feature flags default to disabled
- [ ] Reviewer approves proceeding to future runtime phase (AP-9D)
- [ ] All A–K sections reviewed and checked
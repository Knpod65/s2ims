# Audit Prototype Rollback and Monitoring AP-9B

**Planned on 2026-05-14.**

Branch: `architecture/audit-prototype-integration-plan-ap9b`

## Purpose

Define monitoring signals, rollback triggers, and incident response procedures for future prototype persistence integration.

## Monitoring Goals

- Detect data integrity issues before users are affected.
- Identify shadow write failures quickly.
- Ensure privacy guards are not bypassed.
- Provide visibility into prototype storage health.
- Enable rapid rollback with minimal blast radius.

## Signals to Monitor

| Signal | Source | Alert Threshold | Severity |
|--------|--------|----------------|----------|
| Shadow write error count | Application log / metrics | > 0 per minute | Warning |
| Rejected unsafe metadata count | Application log / metrics | > 0 per minute | Critical |
| Duplicate ID detection | Prototype storage / repository | > 0 per hour | Warning |
| Read comparison mismatch count | Comparison logger | > 1% of events | Warning |
| Prototype storage count divergence | Prototype storage / mock writer | > 0 (growth gap) | Warning |
| Shadow write latency | Metrics | > 500ms P95 | Warning |
| Unexpected persistence mode | Application log | Any occurrence | Critical |
| PII guard violation attempt | Privacy gate log | Any occurrence | Critical |
| Build/check failure | CI/CD pipeline | Any failure | Critical |
| Route returning non-200 | Route smoke tests | Any route | Critical |
| Hydration error | Application log | Any occurrence | Critical |

## Rollback Triggers

Any of the following should trigger immediate rollback:

| Trigger | Condition | Severity |
|---------|-----------|----------|
| PII guard violation | Forbidden metadata key detected in shadow write | Critical |
| `real_persisted` attempt | Any code path attempts real_persisted mode | Critical |
| Repeated shadow write failures | > 10 failures in 1 minute | High |
| Admin display mismatch | > 5% mismatch rate in read comparison | High |
| Route/UI regression | Any smoke route returns non-200 | Critical |
| Build/check failure | Any CI check fails post-deployment | Critical |
| Duplicate audit rows | Duplicate IDs detected in prototype storage | High |
| Unexpected data in prototype | Data in prototype that doesn't match mock source | Medium |
| Dev log warnings/errors | New errors or warnings after enabling flags | Medium |

## Rollback Actions

### Immediate Actions

1. Set all prototype feature flags to `false` in config.
2. Restart application if config requires restart.
3. Verify `sharedMockWriter` path is functioning:
   - Staff actions still record to mock writer.
   - Admin display shows mock + fixture data.
   - All routes return 200 OK.

### Secondary Actions

4. Clear in-memory prototype storage (safe, does not affect mock data):
   - Call `PrototypeAuditPersistenceService.clearPrototypeEventsForTesting()`.
5. Validate full check suite:
   - `npm run build` (40/40)
   - `npm run check:tokens` (4/4)
   - `npm run check:audit-events` (92/92)
6. Run route smoke tests (all 5 routes → 200 OK).
7. Verify dev log is clean.

### Post-Rollback

8. Document incident:
   - What triggered the rollback.
   - Duration of the incident.
   - Any data integrity issues discovered.
   - Resolution steps taken.
9. Review whether prototype integration is safe to retry.
10. Update AP-9B plan with lessons learned.

## Post-Rollback Verification

After rollback, confirm:

- [ ] All feature flags are `false`.
- [ ] `sharedMockWriter` is the sole write path.
- [ ] Admin display reads from `adminAuditDisplayAdapter` only.
- [ ] Prototype storage is empty (cleared).
- [ ] Build passes 40/40.
- [ ] All 92 checks pass.
- [ ] Route smoke tests pass.
- [ ] Dev log is clean.
- [ ] No residual PII in any log or storage.

## Developer-Visible Diagnostics

When `auditPrototypeMetricsEnabled` is `true`:

- Console log: `[AUDIT PROTOTYPE] Shadow write: success|failure [reason]`
- Console log: `[AUDIT PROTOTYPE] Read comparison: N matches, M mismatches`
- Console log: `[AUDIT PROTOTYPE] Metadata rejected: K forbidden keys`
- Console log: `[AUDIT PROTOTYPE] Duplicate detected: eventId=...`
- All diagnostic messages prefixed with `[AUDIT PROTOTYPE]` for filtering.

## User-Visible Behavior

- **No user-visible changes** during any phase of AP-9B integration.
- Admin display shows only mock + fixture data until a future phase explicitly changes this.
- No "prototype" banner or label appears in production UI.
- No notification behavior changes.
- No Staff workflow changes.
- If `adminCompareVisible` is enabled in staging, comparison data is visible only to admin roles and is clearly labeled as diagnostic.

## Incident Notes Template

```
Incident: AP-9B Prototype Integration Issue
Date: [YYYY-MM-DD HH:MM]
Trigger: [What triggered the issue]
Flags active: [list of enabled flags]
Impact: [What was affected]
Duration: [How long the issue persisted]
Resolution: [What was done to resolve]
Rollback performed: [Yes/No]
Data integrity check: [Pass/Fail]
Follow-up actions: [List of actions]
```

## QA Checklist

- [ ] All monitoring signals are logged when flags are enabled.
- [ ] Rollback triggers are documented and tested.
- [ ] Rollback actions restore mock-only path without data loss.
- [ ] Post-rollback verification ensures system integrity.
- [ ] Diagnostic messages are prefixed with `[AUDIT PROTOTYPE]`.
- [ ] No user-visible behavior changes during any flag combination.
- [ ] Incident notes template is available for field use.
- [ ] All existing 92 audit checks pass after rollback procedure.
- [ ] Route smoke tests pass after rollback procedure.
- [ ] Dev log is clean after rollback procedure.
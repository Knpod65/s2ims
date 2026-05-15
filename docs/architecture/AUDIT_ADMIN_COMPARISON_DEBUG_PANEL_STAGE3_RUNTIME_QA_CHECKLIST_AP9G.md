# Audit Admin Comparison Debug Panel Stage 3 Runtime QA Checklist AP-9G

A. Docs-only safety

- [ ] No `src/*` changes in this planning phase.
- [ ] No `scripts/*` changes.
- [ ] No `package.json` changes.
- [ ] Runtime not started in this branch (docs-only).

B. Runtime scope

- [ ] Panel is staging-only in design.
- [ ] Panel is Admin-only in design.
- [ ] Observability is aggregate-only in design.

C. Feature flags

- [ ] All required flags documented and default false.
- [ ] Fail-closed behavior documented.

D. Admin-only access

- [ ] Admin role required for visibility.
- [ ] Assigned reviewers only.

E. Non-admin blocking

- [ ] Non-admin sessions produce no DOM trace.

F. Privacy and PII

- [ ] Forbidden data classes documented and absent from outputs.
- [ ] Screenshots/notes must be aggregate-only.

G. Observability

- [ ] Allowed metrics documented.
- [ ] Forbidden metrics documented.
- [ ] Logs and console outputs aggregate-only.

H. UI display safety

- [ ] No row-level identifiers shown.
- [ ] No export, CSV, or clipboard of comparison row-level data.

I. Source-of-truth boundary

- [ ] Admin Audit Log remains authoritative.
- [ ] Prototype reads are diagnostic only.

J. Export boundary

- [ ] No export changes for comparison data.

K. Rollback readiness

- [ ] Rollback triggers defined.
- [ ] Rollback actions documented and tested in staging rehearsal.

L. Validation

- [ ] `npm run build` passes (40/40)
- [ ] `npm run check:tokens` passes (4/4)
- [ ] `npm run check:audit-events` passes (137/137)
- [ ] Five smoke routes return 200 OK
- [ ] Dev log clean

M. Final approval

- [ ] Stage 3 runtime implementation only after explicit approval and a separate implementation branch.
- [ ] AP-10 not started as part of this work.

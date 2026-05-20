# S2IMS ExcelJS Future Upgrade Checklist - MC56

## Purpose
Checklist for a future branch that upgrades or patches exceljs. This checklist is a planning artifact only — not permission to upgrade on `main`.

### Pre-upgrade checks
- [ ] Capture `npm audit --json` output and advisory list in the upgrade branch
- [ ] Identify target exceljs version with fixes for listed advisories
- [ ] Review changelog and breaking changes for exceljs upgrade
- [ ] Identify transitive dependency changes
- [ ] Prepare test matrix (see MC56 test plan)

### Package diff checks
- [ ] package.json updated with target version only
- [ ] package-lock.json updated accordingly
- [ ] No unrelated package upgrades included

### Build checks
- [ ] `npm run build` passes
- [ ] Type checks / lint clean

### Import preview checks
- [ ] Parser regression test suite passes
- [ ] Manual test scenarios pass in browser
- [ ] Soft/hard file size limits respected
- [ ] Hidden sheets behavior validated
- [ ] Formula handling preserved as text
- [ ] Forbidden columns detection intact

### Security audit checks
- [ ] `npm audit` shows advisories resolved or reclassified
- [ ] Security triage report updated with pre/post-upgrade results

### Rollback checklist
- [ ] Tag previous package-lock and package.json
- [ ] Provide rollback PR to revert changes
- [ ] Re-run regression tests on rollback

### Approval note
- [ ] Security reviewers approve upgrade
- [ ] Product owner signs off
- [ ] Governance/PDPA notified if required


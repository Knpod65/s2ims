# Audit Production Persistence Sign-Off Packet Checklist AP-10B

## 1. Purpose

This checklist ensures that all required documents and validations are assembled before sign-off collection begins. No owner should be asked to sign off until every item on this checklist is complete.

## 2. Required Architecture Documents

| # | Document | Status | Notes |
|---|----------|--------|-------|
| 1 | `AUDIT_PRODUCTION_PERSISTENCE_PLAN_AP10.md` | ✅ Complete | AP-10A production persistence plan |
| 2 | `AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md` | ✅ Complete | Database model (sections 2–8 critical) |
| 3 | `AUDIT_PRODUCTION_PERSISTENCE_PRIVACY_PDPA_AP10.md` | ✅ Complete | Privacy/PDPA model (sections 2–10) |
| 4 | `AUDIT_PRODUCTION_PERSISTENCE_ROLLOUT_AND_ROLLBACK_AP10.md` | ✅ Complete | Rollout and rollback plan (sections 5–7 critical) |
| 5 | `AUDIT_PRODUCTION_PERSISTENCE_QA_CHECKLIST_AP10.md` | ✅ Complete | QA checklist (all sections) |
| 6 | `AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_AUTHORIZATION_AP10B.md` | ✅ Complete | AP-10B authorization framework |
| 7 | `AUDIT_PRODUCTION_PERSISTENCE_SCHEMA_REVIEW_CRITERIA_AP10B.md` | ✅ Complete | Per-owner review criteria |
| 8 | `AUDIT_PRODUCTION_PERSISTENCE_EVIDENCE_PACK_AP10B.md` | ✅ Complete | Evidence pack index |
| 9 | `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_SIGNOFF_TEMPLATE_AP10B.md` | ✅ Complete | Sign-off template for 7 owners |
| 10 | `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_EVIDENCE_TRACKER_AP10B.md` | ✅ Complete | Evidence tracker |
| 11 | `AUDIT_PRODUCTION_PERSISTENCE_EVIDENCE_PACK_AP10B_QA_SUMMARY.md` | ✅ Complete | QA summary (post-merge) |
| 12 | `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_COLLECTION_AP10B.md` | ✅ Complete | This approval collection doc |
| 13 | `AUDIT_PRODUCTION_PERSISTENCE_APPROVAL_OWNER_MATRIX_AP10B.md` | ✅ Complete | Owner matrix |
| 14 | Proposed schema design document | ❌ **Not yet created** | **Must be created before sign-offs begin** |

## 3. Validation Evidence

| # | Check | Expected Result | Status |
|---|-------|-----------------|--------|
| 1 | `npm run build` | 40/40 routes, 0 type errors | ⏳ Must be fresh (< 7 days) |
| 2 | `npm run check:tokens` | 4/4 passed | ⏳ Must be fresh (< 7 days) |
| 3 | `npm run check:audit-events` | 139/139 minimum | ⏳ Must be fresh (< 7 days) |
| 4 | Route: /admin/audit-log | 200 OK | ⏳ Must be fresh (< 7 days) |
| 5 | Route: /admin/dashboard | 200 OK | ⏳ Must be fresh (< 7 days) |
| 6 | Route: /staff/applications/app_001 | 200 OK | ⏳ Must be fresh (< 7 days) |
| 7 | Route: /staff/applications/app_002 | 200 OK | ⏳ Must be fresh (< 7 days) |
| 8 | Dev log | Clean (no errors/warnings/hydration) | ⏳ Must be fresh (< 7 days) |

## 4. Privacy Evidence

| # | Item | Status |
|---|------|--------|
| 1 | Forbidden PII classes documented (no raw national ID, email, phone, bank, IP, file names, OCR) | ✅ Documented |
| 2 | Pseudonymization strategy defined (actorId/targetId as hash/token) | ✅ Documented |
| 3 | Retention schedule defined (3yr access, 7yr modification, 90d staging, 7yr erasure log) | ✅ Documented |
| 4 | Erasure procedure compatible (in-place suppression, skeletal record preserved) | ✅ Documented |
| 5 | Breach notification workflow (72-hour PDPC) documented | ✅ Documented |
| 6 | Cross-border restriction (Thailand-region only) documented | ✅ Documented |
| 7 | Logging/export restrictions for PDPA-sensitive data | ✅ Documented |
| 8 | DPO review of schema design completed | ❌ Pending |

## 5. Legal Evidence

| # | Item | Status |
|---|------|--------|
| 1 | Retention period compliance (Thai regulatory: 3yr access, 7yr modification) | ✅ Documented |
| 2 | Regulatory basis for each retention period | ✅ Documented |
| 3 | Export policy (official store only, no prototype data) | ✅ Documented |
| 4 | Evidence admissibility boundary (audit trail continuity) | ✅ Documented |
| 5 | Cross-border transfer restriction confirmed | ✅ Documented |
| 6 | Legal owner written sign-off | ❌ Pending |

## 6. Rollback Evidence

| # | Item | Status |
|---|------|--------|
| 1 | Rollback owner named and contact method established | ❌ Pending |
| 2 | Rollback procedure reviewed (flag-based disable, no DDL revert) | ✅ Documented |
| 3 | Target rollback time < 5 minutes confirmed | ✅ Documented |
| 4 | Staging rollback test planned | ❌ Pending |
| 5 | Post-rollback validation procedure defined | ✅ Documented |
| 6 | Communication route established | ❌ Pending |

## 7. Owner Sign-Off Checklist

| # | Owner | Sign-Off Template | Sign-Off Completed |
|---|-------|-------------------|--------------------|
| 1 | Engineering | ✅ Template created | ❌ Not collected |
| 2 | DPO | ✅ Template created | ❌ Not collected |
| 3 | Legal | ✅ Template created | ❌ Not collected |
| 4 | Privacy/PDPA | ✅ Template created | ❌ Not collected |
| 5 | Product/Admin | ✅ Template created | ❌ Not collected |
| 6 | QA | ✅ Template created | ❌ Not collected |
| 7 | Rollback | ✅ Template created | ❌ Not collected |

## 8. Completion Criteria

Before sign-off collection is considered valid:

- [ ] All 14 architecture documents in section 2 are present (including schema design document)
- [ ] All 8 validation checks in section 3 pass and are fresh (< 7 days)
- [ ] All 8 privacy evidence items addressed
- [ ] All 6 legal evidence items addressed
- [ ] All 6 rollback evidence items addressed
- [ ] All 7 owners are named in the owner matrix
- [ ] 7/7 sign-offs collected using the standardized template
- [ ] All 9 blocking conditions are false
- [ ] QA validates the complete sign-off packet

## 9. Safety Reminder

This checklist is for documentation and approval tracking only. It does not authorize:
- Phase (c) implementation
- Schema migration or SQL creation
- Runtime implementation
- Persistence activation (prototype or real)
- Any changes to src/*, scripts/*, or package.json
- Any changes to Admin UI, routes, or notifications
- Any PII exposure

## 10. Recommended Next Step

1. Create the schema design document
2. Name all 7 approval owners in the owner matrix
3. Refresh all validation checks (must be within 7-day window)
4. Distribute the sign-off packet to all owners
5. Collect written sign-offs
6. Update the evidence tracker
7. Verify all 9 blocking conditions are false
8. Only then: authorize Phase (c) branch creation

**Do not begin sign-off collection until this checklist is fully complete.**
**Do not start AP-10C. Do not start AP-11.**
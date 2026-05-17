# S²IMS Candidate Review Demo Safe Mock Data Spec MC19

## Purpose

This document specifies what constitutes safe mock data for the future S²IMS Candidate Review Diagnostic Preview Demo Page. All data used in the demo page must conform to this spec. Real student, personnel, or scholarship data must never appear in demo fixtures.

This document is planning-only. No runtime or fixture files are created here.

---

## Allowed Demo Fields

The following fields may appear in demo fixture objects, with the constraints shown:

| Field | Allowed Values | Notes |
|-------|---------------|-------|
| `candidateId` | `"demo-advisor-001"`, `"demo-advisor-002"`, `"demo-staff-001"`, `"demo-staff-002"`, etc. | Must use `demo-` prefix |
| Display name / label | `"Advisor Demo 1"`, `"Advisor Demo 2"`, `"Staff Demo 1"`, etc. | Generic, non-identifying |
| `poolType` | `"advisor"` or `"staff"` | From `CombinedCandidatePoolItem` union |
| `roleCategory` | `"advisor_demo"`, `"staff_demo"` | Clearly demo strings, not real role codes |
| `actorRole` | `"system_preview"` | Safe literal in `CandidateReviewAuditEvent["actorRole"]` union |
| `workflowContext` | `"candidate_review"` | Safe value in `CandidateReviewAuditEvent["workflowContext"]` union |
| `safeReasonCode` | `"demo_shortlist"`, `"demo_skip"`, `"demo_more_context"` | No PII, no real reason codes containing personal data |
| `previousReviewState` | Any `CandidateReviewState` value | Safe — no PII |
| `nextReviewState` | Any `CandidateReviewState` value | Safe — no PII |
| `eventName` | Any `CandidateReviewAuditEventName` value | Safe — event name only |

### Allowed Event Names (from `CandidateReviewAuditEventName`)

- `"candidate.review.shortlisted"`
- `"candidate.review.skipped"`
- `"candidate.review.more_context_requested"`
- `"candidate.review.rejected_for_assignment"`
- `"candidate.review.manually_selected"`
- `"candidate.review.state_cleared"`
- `"candidate.review.entered_in_error"`

---

## Forbidden Demo Fields

The following fields must NEVER appear in demo fixtures, even with fake values, because their presence in the component signals that real data might be used:

| Field | Reason Forbidden |
|-------|-----------------|
| `studentId`, `rawStudentId` | PII — student identifier |
| `nationalId` | PII — government ID |
| `mobile`, `phone` | PII — contact info |
| `email`, `personalEmail`, `rawEmail`, `privateEmail` | PII — contact info |
| `remark`, `freeTextReason`, `reasonText`, `safeNoteCategory` (with PII content) | May contain PII |
| `bankAccount`, `accountNumber` | Financial PII |
| `approvalStatus`, `approvedBy`, `approvedAt` | Governance status |
| `scholarshipDecision`, `scholarshipType`, `scholarshipAmount` | Official outcome |
| `assignedBy`, `assignedAt` | Official assignment record |
| `ap10bApproval`, `authorityEvidence`, `authorityVerifiedBy` | AP-10B governance |
| `advisorName`, `teacherName`, `personnelId` | Real personnel identifiers |

---

## Example Safe Advisor Candidate

```
{
  candidateId: "demo-advisor-001",
  poolType: "advisor",
  roleCategory: "advisor_demo",
  // Display label only — not a real name field
  displayLabel: "Advisor Demo 1",
}
```

Demo preview event for this candidate:

```
{
  eventName: "candidate.review.shortlisted",
  candidateId: "demo-advisor-001",
  poolType: "advisor",
  roleCategory: "advisor_demo",
  actorRole: "system_preview",
  workflowContext: "candidate_review",
  previousReviewState: "not_reviewed",
  nextReviewState: "shortlisted",
  safeReasonCode: "demo_shortlist",
  createdAt: "2026-05-17T00:00:00.000Z",
  source: "candidate_review_local_state",
}
```

---

## Example Safe Staff Candidate

```
{
  candidateId: "demo-staff-001",
  poolType: "staff",
  roleCategory: "staff_demo",
  displayLabel: "Staff Demo 1",
}
```

Demo preview event for this candidate:

```
{
  eventName: "candidate.review.skipped",
  candidateId: "demo-staff-001",
  poolType: "staff",
  roleCategory: "staff_demo",
  actorRole: "system_preview",
  workflowContext: "candidate_review",
  previousReviewState: "not_reviewed",
  nextReviewState: "skipped",
  safeReasonCode: "demo_skip",
  createdAt: "2026-05-17T00:00:00.000Z",
  source: "candidate_review_local_state",
}
```

---

## Example Safe No-Op Preview Result

The demo page calls `buildCandidateReviewAuditNoopPreview` with safe demo input. The result always has:

```
{
  event: { ...safe event fields above... },
  mode: "noop",
  persisted: false,
  written: false,
  exported: false,
  notified: false,
  officialEvidence: false,
  diagnosticOnly: true,
  discardedAfterPreview: true,
  message: "Diagnostic preview only. Not saved. Not official evidence.",
}
```

All false flags and `diagnosticOnly: true` are enforced by `assertSafeCandidateReviewAuditNoopResult` (MC12).

---

## Example Unsafe Data — Must NOT Be Used

The following examples illustrate what MUST NOT appear in demo fixtures:

```
// FORBIDDEN — real-looking student ID
{ candidateId: "S-1234" }

// FORBIDDEN — national ID
{ nationalId: "1234567890123" }

// FORBIDDEN — email
{ email: "student@example.com" }

// FORBIDDEN — phone
{ mobile: "0812345678" }

// FORBIDDEN — scholarship decision
{ scholarshipDecision: "approved" }

// FORBIDDEN — AP-10B data
{ ap10bApproval: { approvedBy: "advisor_001", approvedAt: "2026-05-17" } }

// FORBIDDEN — real role category that leaks personnel structure
{ roleCategory: "lecturer_faculty_of_engineering" }
```

---

## Privacy Review Checklist

Before merging any future demo fixture file, verify:

- [ ] All `candidateId` values use `demo-` prefix
- [ ] No `studentId`, `rawStudentId`, `nationalId` fields present
- [ ] No `mobile`, `phone`, `email` variants present
- [ ] No `remark`, `freeTextReason`, `reasonText` fields with non-safe content
- [ ] No `bankAccount` or financial fields present
- [ ] No `approvalStatus`, `approvedBy`, `scholarshipDecision` fields present
- [ ] No `assignedBy`, `assignedAt` fields present
- [ ] No `ap10bApproval`, `authorityEvidence` fields present
- [ ] `actorRole` is `"system_preview"`
- [ ] `workflowContext` is `"candidate_review"` or another safe demo value
- [ ] `roleCategory` contains `"_demo"` suffix or is otherwise clearly non-real
- [ ] No real personnel names appear as field values
- [ ] Grep confirms no `nationalId`, `mobile`, `email`, `bankAccount` in demo fixture

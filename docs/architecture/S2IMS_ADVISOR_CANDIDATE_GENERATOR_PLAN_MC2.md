# S²IMS Advisor Candidate Generator Plan MC2

## 1. Purpose

MC2 plans a future Personnel-based advisor/faculty reviewer candidate generator for S²IMS. It builds directly on the MC1 candidate pool runtime (`src/lib/assignment/`) but remains documentation-only in this phase.

MC2 defines how Personnel CSV records can be used to suggest advisor and faculty reviewer candidates for scholarship workflow steps. These candidates are workflow suggestions only:

- They are NOT automatic assignments.
- They are NOT approvals.
- They are NOT AP-10B governance owners.
- They do NOT authorize scholarship decisions.
- They do NOT expose raw student IDs or unnecessary PII.

A staff member must manually confirm any suggested advisor candidate before that candidate participates in a scholarship review. The system never auto-assigns.

## 2. Scope

### In Scope

- Personnel-based advisor candidate generation rules
- Department/program matching model
- Scholarship workflow contexts for advisor candidates
- Advisor review statuses (see Section 7)
- Safe output fields for the `AdvisorCandidate` type
- Privacy restrictions (mobile, personal email, remark, student ID)
- Manual confirmation model
- MC1 boundary and reuse requirements
- QA requirements for a future MC2 runtime

### Out of Scope

- Runtime implementation (separate branch and task)
- UI/UX implementation
- Backend API implementation
- Database or persistence implementation
- Automatic advisor assignment
- Advisor approval collection
- AP-10B governance (blocked)
- AP-10C (blocked)
- AP-11 (blocked)

## 3. Personnel Source Fields

Personnel records come from Personnel CSV (45 faculty/teacher records). All fields are optional at the source level.

| Field | Type | Use in MC2 |
|-------|------|-----------|
| `teacher_id` | string | → `sourceId` (internal only) |
| `title` | string | → part of `displayName` |
| `name` | string | → part of `displayName` |
| `surname` | string | → part of `displayName` |
| `department` | string | → program matching, `department` field |
| `ext` | string | Internal only — not shown in advisor context |
| `mobile` | string | **FORBIDDEN** — must not be copied or displayed |
| `cmu_mail` | string | → `officialEmail` (lowercase + trim; shown only where role-authorized) |
| `email` | string | **FORBIDDEN** — personal email must not display by default |
| `remark` | string | **FORBIDDEN** — internal only; must not be copied |

Rules:
- `teacher_id` is used as `sourceId`. It is not shown in the UI.
- `title`, `name`, `surname` are joined to form `displayName`. If all empty, use `"Unknown Candidate"`.
- `department` supports program-matching logic.
- `cmu_mail` is stored as `officialEmail` after lowercase + trim. Shown only where the requesting role is authorized.
- `mobile` must be stripped at normalization. Never copied to the output object.
- Personal `email` must not display by default. Never copied to the output object.
- `remark` is internal only. Never copied to the output object.

## 4. AdvisorCandidate Type

The following is the proposed normalized output type for MC2. This type is distinct from MC1's `MockAssignmentCandidatePoolItem` — it uses advisor-specific vocabulary and a single `assignmentContext` field (not an array) because each suggestion targets one specific advisor workflow step.

```ts
type AdvisorCandidate = {
  candidateId: string;
  sourceType: "personnel";
  sourceId: string;
  displayName: string;
  department: string;
  advisorRole:
    | "academic_advisor"
    | "program_reviewer"
    | "faculty_reviewer"
    | "scholarship_academic_reviewer";
  officialEmail?: string;
  assignmentContext:
    | "advisor_review"
    | "scholarship_academic_review"
    | "program_eligibility_review"
    | "student_follow_up";
  status:
    | "suggested"
    | "pending_confirmation"
    | "assigned"
    | "rejected"
    | "inactive";
  confidence: "mock" | "rule_based" | "manual";
  isMock: true;
  autoAssigned: false;
  privacyLevel: "safe_display";
};
```

### Type Notes

- `autoAssigned: false` — literal `false`, not computed. The system never auto-assigns an advisor.
- `isMock: true` — literal `true`. All MC2 candidates must carry this flag.
- `officialEmail` is optional — only populated when `cmu_mail` is present and the requesting role is authorized to see it.
- `status: "suggested"` is the initial status of all generated candidates. Staff must confirm before a candidate is `"assigned"`.
- `assignmentContext` is a single value (not an array). Each suggestion targets one specific workflow context.
- No `mobile`, no `email`, no `personalEmail`, no `remark` fields on the output type.

### advisorRole Mapping

| Department | advisorRole |
|-----------|------------|
| GOV | academic_advisor |
| PA | academic_advisor |
| IA | academic_advisor |
| STB | academic_advisor (visiting/external — requires manual confirmation) |
| (fallback) | faculty_reviewer |

When academic endorsement is required for a scholarship program, `advisorRole` may be `scholarship_academic_reviewer`. This must be explicitly triggered by scholarship criteria, not inferred from department alone.

### assignmentContext Mapping

| Department / Condition | assignmentContext |
|-----------------------|-----------------|
| GOV / PA / IA / STB (advisory) | `advisor_review` |
| Scholarship requiring academic endorsement | `scholarship_academic_review` |
| Program eligibility check required | `program_eligibility_review` |
| Student follow-up required | `student_follow_up` |
| Fallback / staff override | `advisor_review` |

## 5. Matching Rules

The MC2 generator uses the following matching rules to suggest advisor candidates from Personnel records:

1. **Department matching**: Map department code (GOV / PA / IA / STB) to `academic_advisor`. All other departments fall back to `faculty_reviewer`.
2. **Program matching**: Where a student's program or faculty is known, match personnel from the same department as a preferred candidate. This is a rule-based suggestion — not a guaranteed match.
3. **Scholarship criteria matching**: Where the scholarship requires academic endorsement, suggest candidates with `advisorRole: "scholarship_academic_reviewer"`. This must be explicitly declared in the scholarship definition — not inferred.
4. **Manual staff selection fallback**: When no rule-based match is available, or when the student's program is unknown, the system suggests a pool of available personnel and staff selects manually.

### Matching Constraints

- Do NOT infer sensitive student attributes from Personnel data.
- Do NOT use GPA, financial need, disability status, or private student attributes for advisor matching unless explicitly authorized in a later privacy-reviewed phase.
- Do NOT cross-reference student records to Personnel records without explicit role authorization.
- Student ID must be masked in all contexts visible to advisor candidates.

## 6. Advisor Review Flow

Two supported patterns, carried forward from `S2IMS_ADVISOR_REVIEW_WORKFLOW_PLAN.md`:

### Option A — Advisor-First

```
Student submits application
  → advisor candidate suggested (status: "suggested")
  → staff confirms advisor (status: "pending_confirmation" → "assigned")
  → advisor reviews application (status: "advisor_recommended" or "advisor_needs_more_info" or "advisor_declined")
  → scholarship staff reviews
  → committee/admin decision
```

### Option B — Staff-First

```
Student submits application
  → scholarship staff pre-screens
  → advisor review triggered only if required by scholarship criteria
    → advisor candidate suggested (status: "suggested")
    → staff confirms advisor
    → advisor recommendation
  → scholarship staff final review
  → committee/admin decision
```

In both options:
- The advisor candidate starts as `"suggested"` and requires staff confirmation.
- The system never auto-assigns.
- An advisor recommendation does not automatically approve or reject the scholarship.
- Staff and committee review remains separate from advisor review.

## 7. Advisor Review Statuses

These statuses describe the state of an advisor's participation in a scholarship application review. They are distinct from the `AdvisorCandidate.status` field (which describes the candidate suggestion lifecycle).

| Status | Meaning |
|--------|---------|
| `not_required` | No advisor review is required for this application |
| `pending_advisor_review` | An advisor has been assigned and review is pending |
| `advisor_recommended` | Advisor has reviewed and recommends the application |
| `advisor_needs_more_info` | Advisor has reviewed and requests more information |
| `advisor_declined` | Advisor has declined to review or declined to recommend |
| `released_to_scholarship_staff` | Advisor review is complete; scholarship staff may proceed |

### Important Disclaimers

- `advisor_recommended` does NOT mean the scholarship is approved. Scholarship approval is a separate decision by staff and/or committee/admin.
- `advisor_declined` does NOT automatically reject the scholarship. Staff and committee retain independent review authority.
- `released_to_scholarship_staff` does NOT mean the advisor approved. It means the advisor phase is complete.
- No advisor status transition creates AP-10B governance evidence.

For the full status transition table, see `S2IMS_ADVISOR_REVIEW_STATUS_MODEL_MC2.md`.

## 8. Privacy Rules

| Rule | Requirement |
|------|------------|
| Student ID | Must be masked in all advisor-visible contexts |
| Mobile (`mobile`) | Must not be displayed — FORBIDDEN at normalization |
| Personal email (`email`) | Must not display by default — FORBIDDEN at normalization |
| Remark (`remark`) | Internal only — must not be copied to output |
| `officialEmail` | Shown only where the requesting role is authorized to see it |
| Advisor view | Advisor sees only role-authorized student context (name, application summary, scholarship type) |
| Status transitions | Only safe status transitions may be logged; sensitive student attributes must not appear in audit logs |
| AP-10B evidence | No advisor candidate generation or status transition creates AP-10B governance evidence |

Additional rules for the future runtime implementation:
- The privacy guard `assertSafeCandidatePoolItem` (from `src/lib/assignment/candidatePoolPrivacy.ts`) pattern must be extended for `AdvisorCandidate` — an `assertSafeAdvisorCandidate` function should check for forbidden keys at runtime before any object is returned.
- STB personnel require an additional note: "Manual confirmation required for visiting/external faculty."
- `autoAssigned: false` must be checked at runtime — throw if any code path attempts to set this to `true`.

## 9. Manual Confirmation Rules

1. Generated advisor candidates have `status: "suggested"` — they are not active participants until staff confirms.
2. Staff confirms the candidate, moving status to `"pending_confirmation"` and then `"assigned"`.
3. No auto-assignment occurs at any step. The system suggests; the staff decides.
4. Staff may override a suggested candidate with a different personnel record. The override must be auditable in future implementation.
5. Override ≠ approval. Overriding the suggested candidate does not approve the scholarship.
6. Override reason must be safe and role-scoped — no sensitive student data in override reason fields.
7. Staff may reject a suggested candidate (`status: "rejected"`) without providing a detailed reason visible to the candidate.
8. A rejected candidate may be re-suggested in a later round if staff initiates.

## 10. MC1 Boundary

MC2 is a planning document. The MC1 runtime (`src/lib/assignment/`) remains the only implemented TypeScript for candidate pool operations.

`AdvisorCandidate` is a distinct type from MC1's `MockAssignmentCandidatePoolItem`:
- MC1 type uses `selectionStatus` (selection vocabulary) and `selectableContexts` (array).
- MC2 type uses `status` (suggestion vocabulary) and `assignmentContext` (single value).
- MC2 adds `autoAssigned: false` as a literal field on the item itself (MC1 only has `autoAssignedCount: 0` at the summary level).

The future MC2 runtime implementation must:
- Reuse MC1 privacy utilities from `src/lib/assignment/candidatePoolPrivacy.ts`:
  - `buildDisplayName` — for `displayName`
  - `normalizeOfficialEmail` — for `officialEmail`
  - `createCandidateId` — for `candidateId`
  - `normalizeUnitOrDepartment` — for `department`
- Extend `assertSafeCandidatePoolItem` pattern into an `assertSafeAdvisorCandidate` function.
- Not modify any existing MC1 files without a separate review and QA cycle.
- Not break the existing `MockAssignmentCandidatePoolItem` contract.

## 11. QA Checklist

A future QA checkpoint for MC2 runtime implementation must verify:

- [ ] Docs-only scope confirmed — no runtime code changed in this phase
- [ ] MC1 boundary preserved — `src/lib/assignment/` unchanged
- [ ] No auto-assignment — `autoAssigned: false` is a literal; no code path sets it to `true`
- [ ] No PII exposed — mobile, personal email, remark not copied to output
- [ ] Personnel source mapping reviewed — department codes correctly mapped
- [ ] `AdvisorCandidate` type has no forbidden fields
- [ ] Advisor review statuses reviewed — transition table correct
- [ ] `assertSafeAdvisorCandidate` runtime guard implemented and tested
- [ ] Student ID masked in advisor-visible contexts
- [ ] AP-10B unaffected — 0/7 owners, 0/7 approvals, 9/9 blockers active
- [ ] AP-10C blocked
- [ ] AP-11 blocked
- [ ] Build passes — 0 type errors
- [ ] Token check passes — 4/4
- [ ] Audit event check passes — 139/139
- [ ] Route smoke — 5×200 OK
- [ ] Dev log clean

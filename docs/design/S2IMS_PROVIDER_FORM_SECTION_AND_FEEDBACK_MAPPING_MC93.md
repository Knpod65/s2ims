# S2IMS Provider Form Section And Feedback Mapping MC93

**Date**: 2026-05-21  
**Route**: `/provider/scholarships/new`  
**Component**: `ProviderScholarshipForm`

## Before / After

| Area | Before | After |
|------|--------|-------|
| Basic information | Raw card heading and fields | Shared `SectionHeader`, student-facing description guidance, bilingual required hints for Thai/English titles. |
| Amount and deadline | Raw heading and numeric/date fields | Shared `SectionHeader`, clearer guidance for amount, award count, and deadline review purpose. |
| Eligibility and documents | Raw heading and helper text only on documents | Shared `SectionHeader`, GPA/year examples, document builder retains no-backend-write message. |
| Submit state | Disabled button only when invalid | Disabled/ready hint explains required fields or mock-only submission with no backend write. |

## Section Headers

- Basic scholarship information: explains name, provider identity, and student-facing description.
- Amount, awards, and deadline: explains staff review readiness.
- Eligibility and required documents: explains student-facing eligibility and document preparation.

## Help Text And Feedback

- Title fields now explicitly say they are required for bilingual display.
- Amount and award count clarify minimum valid values.
- Deadline notes mock review usage.
- GPA and academic year fields include examples and constraints.
- Submit hint remains visible whether valid or invalid.

## Behavior Preserved

- `savedDraft` state remains local.
- `submitted` state remains local.
- Existing validation rules remain unchanged.
- Submit still only moves to mock staff-review state when valid.
- No persistence, API, audit event, or publication behavior was added.

## Remaining Gaps

- Edit route save feedback remains a future polish target.
- Form field abstraction remains deferred; MC93 only improves current structure and guidance.

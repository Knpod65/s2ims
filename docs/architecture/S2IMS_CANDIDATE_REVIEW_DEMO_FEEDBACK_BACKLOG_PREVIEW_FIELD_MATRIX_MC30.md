# S²IMS Candidate Review Demo Feedback Backlog Preview Field Matrix MC30

## Purpose

This matrix defines which MC29 feedback backlog sample fields may appear in a future read-only backlog preview UI.

The preview is mock planning visibility only. Displaying a field must not imply approval, assignment, official evidence, AP-10B sign-off, production readiness, scholarship decision, persistence, or audit write behavior.

## Allowed Field Matrix

| Field | Display Status | Display Guidance | Boundary |
|-------|----------------|------------------|----------|
| `backlogId` | Allowed | Show as mock backlog item ID. | Not official evidence. |
| `sourceSessionId` | Allowed | Show as mock demo session ID. | Not real stakeholder record. |
| `stakeholderGroup` | Allowed | Show stakeholder group category only. | No real person names. |
| `category` | Allowed | Show as planning category. | Not approval category. |
| `priority` | Allowed | Show as planning priority. | Not production readiness approval. |
| `summary` | Allowed | Show safe short summary from MC29 only. | No PII or approval wording. |
| `safetyConcern` | Allowed | Show as planning risk marker. | Not incident or official evidence. |
| `proposedBranchType` | Allowed | Show as planning branch suggestion. | Not branch approval. |
| `ap10bImpact` | Allowed | Show `none` or `governance_sensitive`. | Does not change AP-10B gate. |
| `status` | Allowed | Show backlog planning status. | Not workflow decision. |
| `nonApprovalConfirmed` | Required safety flag | Show `true`. | Confirms non-approval boundary. |
| `isMock` | Required safety flag | Show `true`. | Confirms mock-only data. |
| `officialEvidence` | Required safety flag | Show `false`. | Confirms no official evidence. |
| `approvalCollected` | Required safety flag | Show `false`. | Confirms no approval collection. |
| `persisted` | Required safety flag | Show `false`. | Confirms not persisted. |
| `exported` | Required safety flag | Show `false`. | Confirms not exported. |
| `notified` | Required safety flag | Show `false`. | Confirms no notification. |

## Forbidden Field Matrix

| Field / Content | Display Status | Reason |
|-----------------|----------------|--------|
| real names | Forbidden | PII and real stakeholder data are out of scope. |
| personal contact information | Forbidden | Contact data must not appear in mock planning UI. |
| mobile / phone | Forbidden | Contact PII. |
| email / personal email / raw email / private email | Forbidden | Contact PII and raw identity data. |
| national ID | Forbidden | Sensitive identity data. |
| raw student ID / student ID | Forbidden | Raw student identity data. |
| teacher ID | Forbidden | Raw personnel identity data. |
| bank or financial data | Forbidden | Sensitive financial data. |
| private remarks | Forbidden | Private notes are not safe display fields. |
| hardship details | Forbidden | Sensitive personal context. |
| signatures | Forbidden | Could imply sign-off. |
| approval status / approved by | Forbidden | Approval collection is out of scope. |
| assigned by / assigned at | Forbidden | Assignment workflow is out of scope. |
| scholarship decision | Forbidden | Scholarship decisions are out of scope. |
| AP-10B sign-off | Forbidden | AP-10B governance is unchanged. |
| authority verification | Forbidden | Authority evidence is out of scope. |
| official audit evidence | Forbidden | Preview items are not official evidence. |

## Required Status Labels

Future preview UI must show:
- `Read-only planning preview`
- `Uses safe mock sample data only`
- `Not saved`
- `Not submitted`
- `Not official evidence`
- `Not an approval`
- `Not an assignment`
- `No AP-10B gate change`

## Grouping and Filtering Fields

Allowed grouping/filtering fields:
- `category`
- `priority`
- `status`
- `proposedBranchType`
- `ap10bImpact`
- `safetyConcern`

Forbidden grouping/filtering fields:
- any PII field
- any approval field
- any assignment field
- scholarship decision fields
- official evidence fields beyond fixed false safety flags

## QA Notes

- Future implementation must use MC29 sample runtime output only.
- Future implementation must not add fields to MC29 samples for UI convenience.
- Future implementation must not derive hidden approval or assignment states.
- Future implementation must not persist filters or UI state.
- Future implementation must not call backend/API.

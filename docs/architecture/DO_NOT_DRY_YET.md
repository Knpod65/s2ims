# Do Not DRY Yet

## Purpose

Some areas in the codebase look like repetition but should **not** be refactored
into shared abstractions yet. This document lists those areas, explains why they
should remain separate for now, identifies what decision is needed before
consolidation can safely happen, and describes what future primitive might
eventually support it.

"Looks like repetition" is not sufficient justification to share code.
Role-specific behavior, governance boundaries, and unresolved product decisions
are all valid reasons to keep things separate.

---

## 1. Student "Needs replacement" vs Staff "Rejected"

**What it looks like:** Both map from the same data key (`rejected`) to a label.
Looks like a duplicated label lookup.

**Why it must stay separate:** The labels are intentionally different by role:
- Student-facing: "Needs replacement" — recovery-oriented, invites action
- Staff-facing: "Rejected" — operational status, communicates formal decision

Sharing a single label function would require passing a role parameter, which
increases coupling between the student and staff display layers. The current
per-role config pattern in `documentStatusDisplay.ts` is the correct approach.

**Decision needed before consolidating:** None. This is a finalized product decision.
The two labels should remain in separate role-namespaced config sections indefinitely.

**Future primitive:** A multi-role display adapter could eventually hold both, but
they would remain separate config entries within it.

---

## 2. Student "Ready to add" vs Staff "Missing"

**What it looks like:** Both map from the data key `missing` to a label.

**Why it must stay separate:** Same principle as above. Student sees an invitation;
staff sees a compliance gap. Framing differs by audience and intent.

**Decision needed:** None. Finalized.

**Future primitive:** Same multi-role document adapter.

---

## 3. Student "Unsupported file type" vs Staff "Invalid File Type"

**What it looks like:** Both map from `invalid_file_type`.

**Why it must stay separate:** Student sees a user-error framing; staff sees a
technical classification. The difference in tone is intentional.

**Decision needed:** None. Finalized.

---

## 4. Student `verification_pending` vs Staff `pending`

**What it looks like:** Both keys represent "awaiting staff review."
Looks like a naming inconsistency that should be unified.

**Why it must stay separate:** The two keys come from different type definitions
(`StudentDocumentState` vs `DocumentVerificationState`). These types are owned
by different role layers and currently have no shared schema.

Unifying the key would require:
- Changing the type definition in one or both interfaces
- Ensuring all mock data is updated consistently
- Confirming no backend contract depends on either key name

**Decision needed:** Backend schema agreement. Until a real API exists and a shared
document status type is defined, the keys should remain as-is and be handled
separately per role surface.

**Future primitive:** A unified backend document type could replace both with a
single canonical status key. The display adapters would then map from that single
key to role-specific labels.

---

## 5. Provider Candidate `#C-XXXX` vs Staff Student `#S-XXXX`

**What it looks like:** Both are masked identity tokens rendered with `font-mono`.
Looks like a single `<TokenDisplay>` component could handle both.

**Why it must stay separate (for now):** The tokens are governed by separate
privacy policies:
- Providers must see only `Candidate #C-XXXX` — never student name or ID
- Staff may see `Student #S-XXXX` — a different namespace with different disclosure rules

Sharing display logic is safe (see `DRY_REFACTOR_ROADMAP.md` DRY-3D for the
`<TokenDisplay>` primitive). But the format constants themselves (`formatCandidateToken`,
`formatStudentToken`) must remain separate functions with separate prefixes.
Do not create a generic `formatToken(type, id)` that accepts role as a parameter —
this would obscure the privacy boundary.

**Decision needed:** None for display unification. The formatting functions must stay
separate.

---

## 6. Provider Privacy Notice vs Staff Operational Audit Notice

**What it looks like:** Both are notice components with amber/blue tones and bilingual
text. Looks like a shared `<Notice>` wrapper would clean this up.

**Why it must stay separate:** The content and intent differ by role:
- Provider privacy notice: candidate anonymity, what fields are hidden, why
- Staff audit notice: governance obligations, reason requirements, audit trail consequences

The primitive `<PrivacyNotice>` already exists in `src/components/ui/index.tsx` and can
wrap both. But the **copy/content** should not be shared. Each role has its own
governance framing.

**Decision needed:** None. Normalize wrapper implementation (see DRY-3C in roadmap) but
keep content separate.

---

## 7. Executive (ESQ) Aggregate-Only Views

**What it looks like:** ESQ dashboard uses aggregate counts and hides individual records.
Some of that filtering logic looks like it could be shared with admin views.

**Why it must stay separate:** ESQ access to aggregate data is a privacy policy decision.
ESQ must never see individual student identifiers. Admin may see them (with audit logging).
Sharing the filtering logic between ESQ and admin could accidentally expose individual
records to ESQ if a developer modifies a shared utility without considering both consumers.

**Decision needed:** Privacy policy confirmation that ESQ and admin aggregate views
should never share data access logic.

**Future primitive:** A `privacyService.getAggregateView(role, data)` function could
eventually enforce this boundary programmatically, but it must not be used until the
privacy boundary is tested and auditable.

---

## 8. Admin Raw Evidence / Audit Fields

**What it looks like:** Admin audit log view shows raw identifiers, IP addresses,
reason strings. Staff disclosure modals also show reason strings. Looks like a shared
"detail row" component could handle both.

**Why it must stay separate:** Admin sees raw evidence; staff sees operational summaries.
If a shared component is built that renders raw data, it could be accidentally reused
in a non-admin surface and expose PII.

**Decision needed:** Privacy boundary review confirming that no shared component
should render raw `student_id`, IP, or full audit reason strings without an admin
role check.

---

## 9. Disclosure Approval vs Disclosure Rejection

**What it looks like:** `DisclosureApprovalModal.tsx` and `DisclosureRejectionModal.tsx`
are structurally similar. Looks like a single `DisclosureModal` with an `action` prop
would remove duplication.

**Why it must stay separate:** The two flows have different governance requirements:
- Approval: no reason required, shows fields to be disclosed
- Rejection: reason required, shows `AuditWarningCard`, reason must meet minimum length

Merging into one component with conditional logic based on `action` prop would make it
harder to add independent governance requirements to each path in the future (for example,
adding a 48-hour hold for approvals but not rejections).

**Decision needed:** Product decision on whether approval and rejection flows will ever
share governance requirements. Until confirmed, keep separate.

---

## 10. Export Warning vs Shortlist Reason

**What it looks like:** Both are reason-capture textareas with governance framing.

**Why it must stay separate:** The two flows have different risk levels, different
audiences, and different audit implications:
- Export warning: Admin/staff action, high risk, external-facing consequences
- Shortlist reason: Provider action, lower risk, internal matching record

`SENSITIVE_ACTION_POLICY_PHASE_2E.md` defines separate minimum lengths for each.
A shared textarea component is fine (see DRY-5C), but the content, policy, and
minimum length must remain independently configurable per action key.

**Decision needed:** None for the shared textarea primitive. The policy per action
must remain separate.

---

## 11. Application Statuses — All Role Surfaces

**What it looks like:** Application statuses appear in student views, staff views, and
provider views. Looks like a single adapter could serve all three.

**Why it must stay separate now:** Two problems:

1. Two incompatible key systems exist: `UNDER_REVIEW` (uppercase, from one data source)
   vs `in_review` (snake_case, from another). These must be resolved before any adapter
   is built, or the adapter will silently fail for one of the sources.

2. Product wording for application statuses has not been finalized by role. The student-
   facing wording, staff-facing wording, and provider-facing wording may differ
   (similar to document status). Adapting before wording is finalized would require
   re-migration.

**Decision needed:**
- Resolve the `UNDER_REVIEW` vs `in_review` key inconsistency (see `STATUS_USAGE_INVENTORY_PHASE_2F.md`)
- Finalize role-specific label wording for application statuses

**Future primitive:** A role-namespaced application status adapter, modeled on the
document status adapter pattern.

---

## 12. Document Statuses — Staff Side (Before Policy Approval)

**What it looks like:** Staff labels are embedded inline in `DocumentVerificationPanel.tsx`.
Looks like they should already be extracted to `documentStatusDisplay.ts`.

**Why it must wait:** Staff document status display cannot be extracted until the label
decisions in `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md` are approved. Extracting inline
labels without confirming they are correct would canonize potentially wrong values.

**Decision needed:** Review and approval of `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md`
label table.

**Future primitive:** `STAFF_DOCUMENT_STATUS_DISPLAY` config section in
`src/config/documentStatusDisplay.ts`.

---

## Summary

| Area | Reason to keep separate | Decision needed |
|------|------------------------|----------------|
| `rejected` label by role | Intentional wording difference | None — finalized |
| `missing` label by role | Intentional wording difference | None — finalized |
| `invalid_file_type` label by role | Intentional tone difference | None — finalized |
| `pending` vs `verification_pending` | Different type definitions, no shared schema | Backend schema agreement |
| Candidate token vs student token format | Separate privacy namespaces | None — keep separate functions |
| Provider vs staff notice content | Different governance framing | None — keep content separate |
| ESQ aggregate vs admin raw views | Privacy policy boundary | Privacy policy confirmation |
| Admin raw evidence fields | PII exposure risk | Privacy boundary review |
| Disclosure approval vs rejection flows | Different governance requirements per path | Product decision on future divergence |
| Export warning vs shortlist reason | Different risk levels and policies | None — keep policy per action |
| Application statuses | Key inconsistency + unfinalized wording | Key resolution + product wording sign-off |
| Staff document statuses (inline) | Policy not yet approved | Approve `STAFF_DOCUMENT_STATUS_POLICY_PLAN.md` |

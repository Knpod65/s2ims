# Sensitive Action Policy (Phase 2E)

## Purpose

Define policy guardrails for sensitive-action reason capture and audit warning behavior before implementation refactors.

This phase is policy-only. No UI behavior is changed here.

## Definition: Sensitive Action

A sensitive action is any action that can:

- reveal identity or protected fields,
- change governance decisions (approve/reject/override),
- change access boundaries (role/scope/permission),
- export operational or audit data,
- materially alter review outcomes or compliance evidence.

## When Reason Is Required

Reason is required when an action:

- changes someone’s access or visibility,
- overrides a system- or workflow-derived decision,
- rejects, discloses, or manually corrects reviewed records,
- triggers data export from non-public/admin surfaces.

Reason is optional only for low-risk operational retries where no governance decision is changed (for example, sync retry), but audit logging remains required.

## When Audit Warning Is Required

Show audit warning whenever action has any of:

- `requiresAudit = true`,
- irreversible or hard-to-reverse consequences,
- identity exposure risk,
- role/scope/permission impact,
- export side effects.

Audit warning should appear before the reason field or submit button.

## When Confirmation Checkbox Is Required

Require explicit confirmation checkbox for high/critical risk actions:

- identity reveal,
- disclosure approval,
- role/scope change,
- high-sensitivity export.

Checkbox intent:

- confirms user reviewed consequences,
- confirms reason is accurate,
- confirms action may be auditable and irreversible.

## Recommended Minimum Reason Length by Risk Level

- low: 10 characters
- medium: 20 characters
- high: 30 characters
- critical: 40 characters

Additional guidance:

- Use trimmed length.
- Enforce character counter + validation message.
- Avoid allowing submit before threshold is met.

## Recommended Warning Tone

Tone should be:

- factual,
- non-threatening,
- governance-oriented,
- clear on consequences.

Preferred style:

- “This action is audit logged and may affect visibility/access.”
- “Provide a clear, evidence-based reason for this decision.”

Avoid style:

- blame-heavy copy,
- vague fear language,
- ambiguous non-actionable warnings.

## Role-Specific Examples

### Provider shortlist request

- Action: `shortlist_request`
- Reason required: Yes
- Audit warning: Yes
- Suggested min length: 20 (medium)

### Staff matching override

- Action: `matching_override`
- Reason required: Yes
- Audit warning: Yes
- Suggested min length: 30 (high)

### Staff disclosure approval/rejection

- Actions: `disclosure_approval`, `disclosure_rejection`
- Reason required: Yes (both)
- Audit warning: Yes
- Suggested min length:
  - approval: 30 (high)
  - rejection: 20 (medium)

### Admin role/scope change

- Actions: `role_change`, `scope_change`
- Reason required: Yes
- Audit warning: Yes
- Confirmation checkbox: Required
- Suggested min length:
  - role_change: 40 (critical)
  - scope_change: 30 (high)

### Admin export

- Action: `export_report`
- Reason required: Yes
- Audit warning: Yes
- Confirmation checkbox: Recommended for sensitive datasets
- Suggested min length: 30 (high)

### Sync retry

- Action: `sync_retry`
- Reason required: Optional (config default false)
- Audit warning: Yes
- Suggested min length: 0, with optional note field

### Document rejection/replacement

- Actions: `document_rejection`, `document_replacement_request`
- Reason required: Yes
- Audit warning: Yes
- Suggested min length: 20 (medium)

## Actions That Should NOT Require Reason

- Student submitting their own application.
- Student saving draft.
- Student uploading document mock.

These are user-owned routine actions, not governance overrides.

## Future Migration Plan for ReasonRequiredModal

Future standardization should route reason validation, warning copy, and min-length rules through `src/config/sensitiveActions.ts` and a shared modal primitive.

Migration constraints:

- Keep existing labels/colors/routes unchanged unless explicitly approved.
- Migrate one flow at a time with behavior equivalence checks.
- Add regression checks for reason-required gating before each rollout.

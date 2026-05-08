# ReasonRequiredModal Proposal (Phase 2E)

## Status

Proposal only. No implementation in this phase.

## Goal

Define a shared modal contract for sensitive actions so reason validation and audit-warning behavior can be standardized later without altering governance intent.

## Proposed Shared Component API

```ts
type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

interface ReasonRequiredModalProps {
  actionKey: string
  title: string
  description?: string
  minLength: number
  riskLevel: RiskLevel
  auditWarning: string
  confirmLabel?: string
  onConfirm: (reason: string) => void
}
```

### Prop meanings

- `actionKey`: canonical policy key (for example from `SensitiveActionKey`).
- `title`: concise action title shown in modal header.
- `description`: contextual summary of what the action changes.
- `minLength`: reason threshold from policy/config.
- `riskLevel`: drives warning emphasis and default copy tone.
- `auditWarning`: explicit warning body text displayed before input.
- `confirmLabel`: optional override for button label.
- `onConfirm(reason)`: callback only after local validation passes.

## How It Would Use `src/config/sensitiveActions.ts` Later

Planned integration (future phase):

1. Resolve action config by `actionKey` from `SENSITIVE_ACTION_CONFIG`.
2. Derive `requiresReason`, `requiresAudit`, and default risk/warning copy.
3. Map policy risk level to min-length defaults.
4. Render consistent warning + counter + disabled state.

Important:

- Keep escape hatches for route-specific display text.
- Do not mutate existing action payload contracts.

## Proposed Migration Sequence

1. Provider `ShortlistRequestModal`
2. Staff `MatchOverrideModal`
3. Staff `DisclosureApprovalModal` / `DisclosureRejectionModal`
4. Admin role/scope/export modals

Why this order:

- Start with a low-risk provider flow.
- Then converge the most inconsistent staff flows.
- Then move to high-impact admin surfaces.

## Risks

- Validation drift during mixed old/new modal coexistence.
- Copy regressions in TH/EN warning text.
- Inconsistent min-length behavior if action config is partially adopted.
- Hidden dependency on current route-specific submit handlers.
- False assumption that all flows are true modal submits (some are inline panels today).

## Mitigations

- Migrate one action flow per PR.
- Snapshot warning/validation behavior before and after migration.
- Keep fallback route-specific labels and placeholders.
- Add lightweight checks for actionKey-to-config coverage.

## Non-Goals (Phase 2E)

- No modal/component refactor implementation.
- No route wiring changes.
- No auth/guard/export behavior changes.

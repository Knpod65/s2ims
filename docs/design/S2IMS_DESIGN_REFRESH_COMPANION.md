# S2IMS Design Refresh Companion

Date: 2026-05-11
Scope: companion note for future design and implementation prompts. No runtime UI changes.

## What The Existing Implementation Still Gets Right

The current implementation has strong foundations that should be preserved:
- Stable role-based shell and navigation.
- Clear separation between Student, Provider, Staff, Admin, and ESQ surfaces.
- PDPA-aware privacy language.
- Provider candidate tokenization and masking.
- Staff audit warnings for sensitive actions.
- Disclosure workflow safeguards.
- Status labels that have been incrementally centralized.
- Thai and English language support.
- Consistent spacing, typography, buttons, badges, and responsive behavior.
- Build and token validation discipline.

The refresh should build on these foundations rather than discard them.

## What Needs Evolution

The implementation now needs a stronger product interaction layer. Many routes contain the right data and controls, but the page shape is still generic.

Needs evolution:
- Dashboards should become role-specific command centers.
- Student flows should become guided journeys.
- Provider flows should become portfolio and decision workspaces.
- Staff flows should become triage and evidence consoles.
- Admin flows should become governance and control surfaces.
- Executive flows should become aggregate strategy rooms.
- Matching, status, and document experiences should show reasoning and recovery paths, not only labels and cards.

## Pattern Fatigue That Appeared After Implementation

The most visible fatigue comes from:
- white rounded cards on nearly every screen
- repeated KPI grids
- generic badge/pill usage
- card-wrapped tables
- repeated heading, subtitle, action, grid structure
- modals used for decisions that need evidence context
- role colors applied as trim rather than interaction model
- mobile pages becoming long stacks of similar blocks

This is common after a system reaches broad feature coverage. Shared primitives made the app coherent, but now the app needs more specialized task surfaces.

## How Future Implementation Prompts Should Change

Future prompts should specify the surface type, not just the page or component.

Better prompt framing:
- "Create a student journey rail for application readiness."
- "Create a provider criteria tuning cockpit."
- "Create a staff document evidence workbench."
- "Create an admin export governance panel."
- "Create an executive aggregate insight board."

Avoid prompt framing like:
- "Make a nicer dashboard."
- "Add cards for these metrics."
- "Create a table and modal."
- "Modernize the UI."
- "Use the role color more."

Future prompts should include:
- role
- task
- primary action
- evidence needed
- privacy and audit boundaries
- statuses involved
- mobile states
- Thai/English text risks
- exact behavior that must remain unchanged
- screenshot QA expectations

## Keeping Governance And Privacy Strong

The refresh must not make governance feel like decoration. Privacy and audit controls should be woven into the workflow.

Guidance:
- Provider candidate review should keep token-only identity at the center of the workbench.
- Staff review should keep audit reason capture near the decision controls.
- Disclosure decisions should keep risk, purpose, and audit trail visible before approval.
- Export flows should show scope, sensitivity, and audit consequences before action.
- Executive screens should never introduce individual case inspection.
- Student document recovery should use supportive wording while preserving accurate state.

## Relationship To The Earlier Implementation Spec

The earlier implementation spec remains useful for:
- product scope
- role boundaries
- navigation structure
- data privacy expectations
- feature inventory
- multilingual support
- governance intent

It needs evolution for:
- role-specific interaction models
- alternatives to repeated cards
- stronger mobile task hierarchy
- workbench patterns
- screenshot QA requirements
- explicit rules against generic SaaS layouts

## Companion Recommendation

Before any major visual refresh, choose one contained workflow and prove the new design language there. The best first candidate is the Student application readiness and document recovery flow because it can introduce journey and recovery patterns while preserving current behavior, upload logic, document keys, and approved student-facing wording.

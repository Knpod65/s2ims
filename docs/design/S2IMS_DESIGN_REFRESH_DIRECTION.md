# S2IMS Design Refresh Direction

Date: 2026-05-11
Scope: design direction only. No runtime UI changes.

## Design Thesis

S2IMS should feel less like a generic SaaS dashboard and more like a set of role-specific workspaces for education access, scholarship governance, privacy-preserving review, and institutional decision making.

The next design phase should not add decorative polish. It should change the shape of work on each screen.

## A. From Cards Everywhere To Task Surfaces

### Dashboard As Command Center

Dashboards should not be piles of stats, recent activity, and quick actions. Each dashboard should answer: "What needs my attention now, and what can I safely do next?"

Direction:
- Student dashboard becomes a guided opportunity and readiness journey.
- Provider dashboard becomes a portfolio health and candidate readiness workspace.
- Staff dashboard becomes an operations command center with queues and exceptions.
- Admin dashboard becomes a control room for risk, access, system health, and exports.
- Executive dashboard becomes an aggregate intelligence room.

### Application Flow As Guided Journey

Application pages should feel like a path through eligibility, documents, readiness, review, and submission. A student should understand what is complete, what is blocked, what can be recovered, and what action matters next.

Direction:
- Replace disconnected summary cards with a journey rail.
- Convert document problems into recovery panels.
- Show readiness as a path, not only a percent.
- Keep one primary action per screen.

### Matching Explanation As Transparent Reasoning

Matching explanation should not read like KPI boxes. It should show why a scholarship appears, what criteria influenced the score, what is missing, and what changed since the last update.

Direction:
- Use a reasoning canvas with ranked factors.
- Separate hard eligibility, soft match, confidence, and missing data.
- Preserve privacy and avoid overpromising deterministic matching.

### Provider Candidate Review As Decision Workspace

Provider candidate pages should feel like a privacy-preserving decision workbench, not a table/card dump.

Direction:
- Keep token-only candidate identity.
- Use a split-pane layout: queue, evidence, comparison, decision rail.
- Make shortlist state visible without turning it into the whole interaction.
- Keep candidate selection logic unchanged during visual refresh.

### Staff Review As Operations Console

Staff screens should support triage, exception handling, evidence review, and auditable decisions. The interface should emphasize queues, severity, reasons, and audit trails.

Direction:
- Replace generic tables with priority queues.
- Use evidence workbenches for applications and documents.
- Keep audit warnings in the decision path.
- Keep staff severity colors stable until staff semantics are reviewed.

## B. Role-Based Interaction Models

### Student

Model: supportive journey.

Student screens should prioritize:
- progress narrative
- opportunity unlocks
- guided next best action
- less dashboard clutter
- recovery-oriented wording
- clear document readiness
- confidence-building explanations

Primary patterns:
- journey rail
- readiness path
- opportunity unlock panel
- document recovery panel
- match reasoning canvas

### Provider

Model: portfolio workspace.

Provider screens should prioritize:
- criteria tuning cockpit
- candidate pool intelligence
- decision queue with privacy boundaries
- shortlist review rail
- impact storytelling
- scholarship portfolio health

Primary patterns:
- criteria cockpit
- candidate decision workbench
- pool impact meter
- privacy-preserving candidate queue
- impact story board

### Staff

Model: operations command center.

Staff screens should prioritize:
- queue triage
- exception handling
- audit-first actions
- document and review workbench
- clear reason capture
- operational status clarity

Primary patterns:
- staff triage board
- document evidence workbench
- review action rail
- audit decision panel
- exception queue

### Executive

Model: strategic intelligence room.

Executive screens should prioritize:
- aggregate-only story
- trends and scenarios
- policy levers
- equity signals
- funding impact
- no individual case UI

Primary patterns:
- policy scenario panel
- aggregate insight board
- equity signal map
- funding impact narrative

### Admin

Model: control room.

Admin screens should prioritize:
- system health
- risk and access governance
- audit evidence surfaces
- export controls
- permission change review

Primary patterns:
- access risk console
- export governance panel
- system health strip
- permission change workbench

## C. Visual Pattern Breakers

### Timeline Rail

Use for student application progress, document recovery, status history, and staff review chronology. A timeline rail should replace isolated status cards when sequence matters.

### Split-Pane Workbench

Use for staff document review, provider candidate review, and application review. One pane holds the queue or item list; the other holds evidence, decision controls, and audit context.

### Command Center Grid

Use for dashboards only when each region represents a live work area, not a decorative metric tile. The grid should include queues, blockers, system signals, and next actions.

### Progressive Disclosure Sections

Use when a user needs to move from summary to evidence without losing context. This is preferable to stacking many cards or launching modals too early.

### Contextual Side Panel

Use for policy, privacy, audit history, or relevant details that should remain attached to the current decision. Side panels should replace passive sidebar card piles.

### Decision Canvas

Use for matching explanations and provider candidate comparison. It should show factors, tradeoffs, confidence, missing data, and decision consequences.

### Criteria Cockpit

Use for provider scholarship criteria. It should make hard constraints, soft weights, match preview, fairness signals, and save state feel like one tuning surface.

### Status Rail

Use where state progression matters. A rail can show pending, verification, recovery, approval, closure, or blocked states without turning each into a separate card.

### Evidence Drawer

Use for staff, provider, admin, and disclosure workflows where evidence should stay near the decision. This is preferable to generic modals for evidence-heavy actions.

### Journey Map

Use for student dashboards, recommendations, application detail, and readiness. It should help students understand where they are and what unlocks next.

### Priority Queue

Use for staff applications, disclosure requests, OCR review, ESQ approval, and admin risk review. Priority queues should replace table-first triage.

### Policy Simulation Panel

Use for executive and admin strategy surfaces. It should remain aggregate-only and show scenario impacts without individual cases.

### Impact Story Board

Use for provider impact and executive reporting. It should turn aggregate outcomes into a structured story, not a set of disconnected metric cards.

### Checklist-To-Action Layout

Use for student readiness and document pages. Checklist items should lead directly to recovery or completion action.

### One-Primary-Action-Per-Screen Rule

Every workflow screen should make the primary next action obvious. Secondary actions can exist, but they should not compete with the main task.

## D. Design Constraints

The refresh must preserve:
- role themes
- PDPA masking
- provider token-only privacy boundaries
- staff audit warnings
- disclosure safeguards
- aggregate-only executive rules
- accessibility
- Thai and English layout support
- status semantics and approved wording decisions
- keyboard and mobile usability

The refresh must avoid:
- overusing glassmorphism
- adding decoration without task purpose
- using gradients as decoration only
- making everything a card
- replacing governance specificity with generic alert boxes
- hiding critical audit or privacy context
- creating visually impressive but passive dashboards

## Recommended First Refresh Area

Start with the student application readiness and document recovery flow. It is visible, contained, and strongly benefits from a journey model. It can introduce `ApplicationReadinessPath` and `DocumentRecoveryPanel` while preserving existing upload behavior, document keys, attention logic, and student-facing recovery wording.

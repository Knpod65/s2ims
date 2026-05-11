# UI Pattern Fatigue Audit

Date: 2026-05-11
Branch: `design/pattern-fatigue-audit`
Scope: documentation and design audit only. No runtime UI, route, data, auth, export, disclosure, or backend behavior was changed.

## Purpose

S2IMS has a functional, role-aware interface, but many screens now feel like variations of the same SaaS page: page header, KPI cards, rounded white cards, status badges, list/table, modal. This audit identifies the repeated patterns that create that fatigue and recommends which patterns should stay, evolve, or retire before future UI refresh work begins.

The goal is not cosmetic polish. The goal is to move from generic layout repetition to role-specific task surfaces.

## Representative Areas Inspected

Student routes inspected:
- `/student/dashboard`
- `/student/profile`
- `/student/profile/completion`
- `/student/recommendations`
- `/student/recommendations/explanation`
- `/student/applications`
- `/student/applications/[applicationId]`
- `/student/applications/[applicationId]/documents`
- `/student/scholarships/[scholarshipId]`
- `/student/scholarships/[scholarshipId]/apply`

Provider routes inspected:
- `/provider/dashboard`
- `/provider/scholarships`
- `/provider/scholarships/new`
- `/provider/scholarships/[scholarshipId]/edit`
- `/provider/scholarships/[scholarshipId]/criteria`
- `/provider/scholarships/[scholarshipId]/candidates`
- `/provider/candidates`
- `/provider/impact`

Staff routes inspected:
- `/staff/dashboard`
- `/staff/applications`
- `/staff/applications/[id]`
- `/staff/matching-review`
- `/staff/disclosure-requests`
- `/staff/data-quality`
- `/staff/ocr`

Admin and ESQ routes inspected:
- `/admin/dashboard`
- `/admin/export`
- `/admin/audit-log`
- `/admin/users`
- `/esq/dashboard`
- `/esq/history`

Shared components inspected:
- `src/components/ui/index.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/layout/MobileBottomNav.tsx`
- Major student, provider, staff, admin, and ESQ components referenced by the routes above.

## Repeated Visual Patterns

| Pattern | Where It Appears | Why It Feels Generic | Severity |
| --- | --- | --- | --- |
| Page header plus subtitle plus action cluster | Most student, provider, staff, admin, and ESQ routes | Creates the same first impression regardless of role or task urgency | Medium |
| KPI grids with `StatCard` | Student dashboard, staff dashboard, admin dashboard, ESQ dashboard, provider impact | Makes dashboards feel like metric piles instead of decision surfaces | High |
| White rounded cards as default container | Nearly every route and major component | Turns distinct workflows into visually interchangeable blocks | High |
| Nested mini-card grids inside larger cards | Student profile, application detail, readiness, matching explanation, provider scholarship cards | Adds visual weight without clarifying the task | High |
| Generic status badges and pills | Applications, documents, scholarships, candidate pools, disclosure, audit, ESQ | Useful but overused as decoration instead of workflow state | Medium |
| Card-wrapped tables | Staff applications, admin users, admin audit log, ESQ history, provider candidate pool desktop | Tables communicate storage, not review or action priority | High |
| Right sidebar stacks of cards | Student dashboard/detail pages, provider criteria, staff application detail | Important secondary context becomes another pile of panels | Medium |
| Quick action card rows | Student dashboard, staff dashboard, provider dashboard, admin dashboard | "Quick actions" repeat the same generic pattern instead of exposing role-specific next work | High |
| Accordion cards for review | Staff matching review, disclosure requests, document verification | Better than flat tables, but repeated accordion structure makes review work feel generic | Medium |
| Modal-first decisions | Disclosure approval/rejection, match override, candidate request | Decision context is separated from evidence and can feel transactional | Medium |
| Sticky bottom action bars | Student application and documents flows | Helpful on mobile, but risks competing with page-level task hierarchy | Low |
| Role color as border, dot, or pill | App shell, status badges, stat cards, notices | Role identity is present, but often mechanical rather than task-defining | Medium |

## Why The UI Feels Repetitive

The app has a strong shared component vocabulary, but that vocabulary is currently doing too much. `PageHeader`, `.card`, `StatCard`, `StatusBadge`, grid layouts, and modal decisions appear across roles with only changed copy, counts, and role colors.

This creates four fatigue effects:
- The first screen of each role feels structurally similar even when the role's work is different.
- Complex workflows are represented as stacked information rather than shaped task surfaces.
- Role colors signal ownership but rarely change interaction model.
- Governance and privacy surfaces are strong, but they often sit beside generic cards instead of shaping the whole workflow.

## Patterns That Should Stay

These patterns are useful and should remain part of the system:
- `AppShell`, `Sidebar`, `Topbar`, and `MobileBottomNav` as stable navigation infrastructure.
- Role themes, role badges, and role-aware colors.
- PDPA and privacy notices, especially provider token-only boundaries.
- Audit warnings and irreversible-action warnings.
- `StatusBadge` for compact state labels where state is not the primary task.
- `PageHeader` for simple administrative pages and low-complexity screens.
- Sticky mobile primary actions where they support a single clear next step.
- Tokenized student references and masked identity display.

## Patterns That Should Evolve

These patterns should remain available, but future UI work should change their role:
- Dashboards should evolve from KPI grids into command centers, journeys, or decision queues.
- Matching explanations should evolve from score cards into transparent reasoning canvases.
- Provider candidate pages should evolve from tables/cards into a decision workbench.
- Staff review pages should evolve from accordions and side cards into evidence workbenches.
- Export and audit pages should evolve from tables into governance review surfaces.
- Right sidebars should become contextual side panels with evidence, risks, and next actions.
- Modals should be reserved for confirmations, not full decision workflows with evidence.

## Patterns That Should Be Retired Or Used Rarely

These patterns are the main sources of generic SaaS fatigue:
- KPI grids that do not answer a clear decision question.
- Generic "Overview", "Recent Activity", and "Quick Actions" sections without role-specific purpose.
- White rounded cards as the default answer for every section.
- Nested card-inside-card structures for routine details.
- Tables for triage or review work where priority, evidence, and action are more important than columns.
- Alerts that flatten governance, privacy, or audit risks into ordinary warning boxes.
- Decorative role-color trims that do not change behavior, hierarchy, or task focus.

## Role-Specific Fatigue Issues

### Student

Student screens should feel like a supportive journey, but many routes currently read as dashboard cards and checklists. The student experience needs clearer progress narrative, opportunity unlocks, document recovery guidance, and one obvious next best action.

Highest-fatigue examples:
- `/student/dashboard` combines metrics, recommendations, privacy, deadlines, and status cards without a strong journey path.
- `/student/recommendations` uses card grids where a reasoning canvas would better explain why opportunities match.
- Application detail and document pages use helpful content, but the experience still feels like stacked status panels.

### Provider

Provider screens should feel like a portfolio workspace and candidate decision environment. They currently rely heavily on scholarship cards, pool cards, criteria cards, candidate cards, and tables.

Highest-fatigue examples:
- `/provider/scholarships/[scholarshipId]/criteria` has the ingredients of a cockpit, but still presents them as card stacks.
- `/provider/scholarships/[scholarshipId]/candidates` mixes candidate cards, tables, summary cards, and modals instead of one coherent decision workbench.
- `/provider/impact` is aggregate-safe, but reads like metric cards and chart cards rather than an impact story.

### Staff

Staff screens should feel like operations consoles for triage, exception handling, document verification, and audit-first decisions. Several staff routes have the right data but still look like generic admin queues.

Highest-fatigue examples:
- `/staff/dashboard` is mostly stats plus quick action cards.
- `/staff/applications` is a card-wrapped table even though staff need triage signals.
- `/staff/applications/[id]` has strong privacy and document pieces, but evidence, decisions, and audit trails are separated into card columns.
- `/staff/ocr` is closest to a workbench and should be treated as a stronger pattern reference.

### Executive / ESQ

Executive screens must remain aggregate-only, but should feel like strategic intelligence rather than approval cards and history tables.

Highest-fatigue examples:
- `/esq/dashboard` combines stat cards, an alert, pending cards, and recent history cards.
- `/esq/history` is a card-wrapped table instead of an aggregate policy decision history surface.

### Admin

Admin screens should feel like a control room for access, system health, export governance, and audit evidence. Current pages are reliable but generic.

Highest-fatigue examples:
- `/admin/dashboard` uses StatCards and generic recent audit panels.
- `/admin/export` is a grid of export cards even though exports are high-governance actions.
- `/admin/audit-log` and `/admin/users` are useful but table-first.

## Mobile-Specific Fatigue Issues

Mobile navigation is stable and useful, but mobile pages often become long vertical stacks of similar cards. This creates fatigue faster on mobile than desktop.

Observed mobile risks:
- Important primary action can be buried below repeated cards.
- Sticky bottom actions can compete with page content when the screen lacks one clear task.
- Tables collapse into cards, which can preserve data but increase visual sameness.
- Accordions help density, but repeated accordion cards still feel generic without a triage model.
- Thai labels need careful wrapping in compact badges, buttons, and mobile cards.

Mobile direction:
- Prefer journey rails, priority queues, and progressive task sections over full desktop card stacks.
- Keep one primary action visible and explain what unlocks it.
- Use evidence drawers or inline reveal sections instead of modal-heavy decision flows where possible.

## Governance And Privacy Components That Must Not Be Diluted

The UI refresh should protect the strongest governance work already in the app:
- Provider candidate privacy boundary: token-only candidate references, no raw student names, emails, or IDs.
- Student privacy notices and PDPA copy.
- Staff audit warnings and identity-reveal workflows.
- Disclosure approval and rejection safeguards.
- Export governance warnings and audit evidence.
- Aggregate-only executive/ESQ surfaces.
- Status labels that prevent harmful wording, such as student-facing recovery wording for rejected documents.

These should become more central to task surfaces, not softer or more decorative.

## Top Pattern Fatigue Findings

1. Dashboards are too often KPI grids plus card piles, not role-specific command centers.
2. White rounded cards are the default container across nearly every role.
3. Tables are used where staff, admin, and provider users need triage or decision queues.
4. Provider candidate review needs a privacy-preserving workbench, not mixed cards, tables, and modals.
5. Student flows need stronger journey structure and fewer disconnected panels.
6. Matching explanations should show transparent reasoning, not just scores and badges.
7. Staff review pages separate evidence, action, notes, and audit context into too many independent cards.
8. Admin export and audit pages underplay governance by using generic table/card layouts.
9. Role color is applied consistently but mechanically, with limited effect on interaction model.
10. Mobile experiences turn desktop repetition into longer vertical card stacks.

## Audit Conclusion

S2IMS should keep its role shell, privacy boundaries, status clarity, and audit warnings. The next UI refresh should focus on replacing generic cards and tables with role-specific task surfaces, starting with a contained flow where behavior can remain unchanged while the interaction model becomes more distinctive.

# Do Not Generic UI Rules

Date: 2026-05-11
Purpose: rules for future implementation prompts and code generation so S2IMS avoids generic SaaS pattern drift.

## Core Rules

1. Do not default every section to a white rounded card.
2. Do not create KPI grids unless the metrics answer a real decision question.
3. Do not use generic "Overview", "Recent Activity", or "Quick Actions" sections unless they are tailored to the role and task.
4. Do not create a table when the user needs a decision queue.
5. Do not create a modal when the user needs an evidence drawer or workbench.
6. Do not use role color only as decoration.
7. Do not duplicate the same layout across Student, Provider, Staff, Admin, and Executive roles.
8. Do not flatten governance warnings into generic alert boxes.
9. Do not hide the primary action below repeated cards.
10. Do not create pretty but passive dashboards.

## Prompt Checklist For Future UI Work

Every future UI prompt should answer:
- What role is this for?
- What decision or task is the screen helping with?
- What is the one primary action?
- What evidence does the user need before acting?
- What privacy, PDPA, audit, or aggregate-only rules apply?
- What existing generic pattern is being replaced?
- What must remain behavior-identical?
- What mobile and Thai/English states must be checked?

## Acceptable Uses Of Cards

Cards are still acceptable for:
- repeated items in a list where each item has a clear independent action
- compact summary modules inside a larger workbench
- mobile-friendly chunks when a stronger layout would be too dense
- modal content that is truly confirmational
- privacy or audit notices that must remain visually distinct

Cards should not be the default page architecture.

## Better Defaults

Prefer:
- journey rail over progress card pile
- priority queue over table-first triage
- split-pane workbench over table plus modal
- evidence drawer over detached details modal
- decision canvas over KPI blocks
- contextual side panel over sidebar card stack
- command center over dashboard stat grid
- impact story board over metric cards
- policy simulation panel over static executive cards
- one-primary-action layout over scattered action buttons

## Governance Rules

Never weaken:
- provider candidate token-only privacy boundary
- staff audit warnings
- disclosure approval and rejection safeguards
- admin export governance
- executive aggregate-only constraints
- student-facing recovery wording for document problems
- Thai/English readability and wrapping

Governance UI should become more integrated with the workflow, not visually softer.

## Anti-Patterns To Flag In Review

Flag a design or PR when it:
- adds another dashboard row of four metrics without a decision purpose
- wraps a table in a card and calls it a workspace
- presents sensitive decisions in a generic confirmation modal without evidence
- repeats the same layout used by another role with only copy changes
- uses role color as a border or dot but does not change task hierarchy
- buries privacy or audit implications in small secondary text
- creates a long mobile scroll of visually identical blocks
- adds visual decoration that does not support comprehension or action

## Good Review Question

Ask: "If the role color and page title were removed, would this still feel like a Student, Provider, Staff, Executive, or Admin screen?"

If the answer is no, the design is probably too generic.

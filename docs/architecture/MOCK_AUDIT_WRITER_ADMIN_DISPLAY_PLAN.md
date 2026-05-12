# Mock Audit Writer Admin Display Plan

This document plans how the Admin audit log should present mock audit data once a mock writer exists. It is planning-only and does not change runtime behavior.

## 1. Admin Audit Log Goal

The Admin audit log must distinguish mock/demo audit data from real audit data.

That distinction is required so that administrators do not treat prototype rows as official compliance evidence.

## 2. Persistence Mode Badge Rules

Every audit row should carry a persistence badge.

Badge rules:

- `prototype_only` - "Prototype only"
- `mock_only` - "Mock event"
- `real_persisted` - "Official record"

Badge behavior:

- visible at row level
- color-coded but still text-labeled
- cannot be hidden by default for mock data
- should be used in filters and empty states as well

## 3. Filter Strategy

Future filters should include:

- persistence mode
- event type
- actor role
- target type
- date range
- privacy level

Mock/real separation should be a first-class filter, not a hidden implementation detail.

Recommended default views:

- `mock_only` enabled for demo and QA environments
- `real_persisted` enabled for production compliance environments
- mixed mode only when the page clearly warns that the data set contains both mock and real events

## 4. Export Warning

Mock audit data must not be exported as official audit evidence.

Required warning copy for mock exports:

- "Demo audit data only - not official persistence"
- "This export cannot be used as compliance evidence"

If a real export workflow is later added, it must be separated from mock export behavior and use the correct persistence badge in the exported file.

## 5. Mock Event Grouping

Mock events should be grouped so they do not look like official production rows.

Recommended grouping order:

1. Real persisted events
2. Mock-only events
3. Prototype-only rows or placeholders

Within each group, event type and timestamp sorting can continue normally.

If mock and real rows are mixed on one page, the page must show a clear banner saying the dataset includes demo records.

## 6. Metadata Display Rules

Metadata display must remain allowlisted and role-aware.

Rules:

- show only allowlisted metadata keys
- collapse or hide sensitive fields by default
- never render raw student identity in provider-facing views
- show aggregate or policy-level metadata for executive/ESQ views
- avoid raw payload dumps in any audit table cell
- label fields that come from mock-only fixtures so they are not mistaken for production evidence

## 7. Empty State Copy

Empty state copy should explain the current persistence mode.

Examples:

- `prototype_only`: "No prototype audit events yet"
- `mock_only`: "No mock audit events yet"
- `real_persisted`: "No audit records found"
- mixed mode: "No events match the selected filters"

## 8. Mixed Mock / Real State

If the page ever displays both mock and real data together, it must do all of the following:

- show a banner stating that the dataset is mixed
- show a badge on every row
- keep mock rows visually separated from real rows
- disable any export path that could imply official evidence unless the export explicitly filters to real persisted rows

The safest default is to avoid mixed mode entirely until a strong product reason exists.

## 9. Screenshot and QA Requirements For Future Runtime

When runtime wiring is eventually added, QA should verify:

- mock badge appears in the row list
- mock and real rows are visually distinct
- export warning appears whenever mock rows are visible
- filters correctly separate persistence modes
- metadata does not leak raw identity fields
- the empty state copy matches the selected mode
- screenshots clearly show the mock label in the admin audit view

## 10. Non-Goals

This plan does not:

- implement the mock writer
- change `src/data/mock/audit-logs.ts`
- add backend persistence
- change role or auth logic
- modify export behavior today

It only describes how the future Admin display should avoid misrepresenting mock data as official records.

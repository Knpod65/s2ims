# Mock Audit Writer Phase AP-4

## Purpose

AP-4 implements a pure/in-memory mock audit writer with deterministic tests and checks.

This phase remains foundation-only. It does not wire audit writing into UI or runtime workflows.

## Files Added

- `src/lib/audit/mockAuditWriter.ts`

## Files Modified

- `src/lib/audit/index.ts`
- `scripts/check-audit-events.mjs`

## What The Writer Does

The mock audit writer provides a pure in-memory store for validated audit events:

- Creates isolated writer instances with `createMockAuditWriter(options?)`
- Writes only `mock_only` events (rejects `prototype_only` and `real_persisted`)
- Stores events in memory without persistence, localStorage, or network calls
- Returns copies of events to prevent external mutation
- Supports filtering by event type, actor role, target type, severity, source route, and persistence mode
- Provides `write`, `writeMany`, `list`, `getById`, `clear`, `seed`, `snapshot`, and `count` methods
- Rejects duplicate IDs by default (configurable via `allowDuplicateIds` option)
- Preserves insertion order

## What The Writer Does Not Do

- Does not persist events to storage
- Does not mutate `src/data/mock/audit-logs.ts`
- Does not expose mutable internal state
- Does not accept `real_persisted` or `prototype_only` events
- Does not wire into UI or runtime workflows
- Does not add real audit persistence
- Does not add backend/API behavior
- Does not modify Staff/Student/Provider/Admin/ESQ workflows

## Why In-Memory Only

In-memory storage ensures:

- Deterministic tests without side effects
- No confusion about persistence boundaries
- Safe checkpoint and demo behavior
- Clear separation from future real persistence

## Why Rejection Of `real_persisted` and `prototype_only`

The writer only accepts `mock_only` events to:

- Maintain clear persistence mode boundaries per AP-3
- Prevent mock writer from being mistaken for real persistence
- Protect system-owner trust and user clarity

## How It Protects System-Owner Trust

- No persistent storage implies no official record
- Copy rules from AP-3 remain in effect
- Mock events must be labeled as such in any display
- No export/export behavior is implied

## How It Protects User Clarity

- No "logged" or "auditable" claims in mock-only context
- Clear distinction between prototype, mock, and real persistence
- No reason validation changes or ReasonRequiredModal introduction

## Checks Added

The check script now validates:

- writer starts empty
- write one mock event works
- list returns a copy (not internal state)
- snapshot returns correct count and copy
- count updates correctly
- getById finds and returns copies
- getById returns undefined for missing IDs
- clear works correctly
- seed replaces existing events
- writeMany handles multiple events
- filters work by eventType and actorRole
- insertion order is preserved
- input events are not mutated
- returned lists cannot mutate internal state
- duplicate IDs are rejected by default
- duplicate IDs allowed when configured
- `real_persisted` events are rejected
- `prototype_only` events are rejected
- unsafe metadata still rejected through builder
- mock audit log fixture not mutated

All 15 original checks continue to pass. New total: 37 checks.

## Limitations

- This is not a production audit service
- No real persistence exists
- No API or database contract is implemented
- No UI flow calls the writer
- No admin display changes yet

## Recommended Next Phase

Recommended next phase: AP-5 — Admin mock audit display planning, or a review checkpoint before any UI wiring.

Do not jump directly to real persistence, reason min-length enforcement, or `ReasonRequiredModal`. Those require separate product and persistence decisions.

## Confirmation

- No UI wiring was added.
- No real audit persistence was added.
- No reason validation behavior changed.
- No component or app page was modified.
- No runtime files changed except audit library.
# Mock Audit Writer Plan - AP-3

## 1. Purpose

AP-3 plans a mock audit writer before any implementation work begins.

The writer is not real persistence. It is a controlled prototype/demo mechanism that can support safe flows, screenshots, QA, and future contract validation without implying that S2IMS has an official audit system.

The goal is to prevent false audit claims while still allowing product and governance review. This protects staff users, admins, providers, executives, and the system owner by keeping mock behavior clearly labeled and separated from real persistence.

## 2. Current State

The audit foundation now exists in planning and builder form:

- AP-1 contract exists in `docs/architecture/AUDIT_PERSISTENCE_CONTRACT_PLAN.md`.
- AP-2 builder exists in `src/lib/audit/auditEventBuilder.ts` and passes checks through `npm run check:audit-events`.
- Prototype-safe audit warnings are already used in staff document review surfaces.
- No real audit persistence exists.
- No runtime UI wiring to the audit builder exists.
- No mock audit writer exists yet.
- The admin audit log page currently reads demo data from `src/data/mock/audit-logs.ts` and presents it as permanent, even though it is still mock-driven.
- Reason validation is unchanged.
- `ReasonRequiredModal` is not introduced.

## 3. Problem To Solve

If S2IMS starts writing mock audit events without clear boundaries, users may think:

- actions are officially logged
- audit records are permanent
- backend persistence already exists
- compliance requirements are already fulfilled

That is a governance and trust problem. It is especially risky for system owner trust and PDPA review because mock data can look authoritative even when it is not.

## 4. Mock Writer Definition

In this plan, a mock audit writer means a controlled, non-authoritative audit surface that can accept event objects for demo, prototype, and test purposes.

It must:

- write only to a controlled mock/demo surface
- not be official persistence
- not be backend-backed
- not be immutable
- not be legally sufficient audit evidence
- be useful for prototype QA, flow review, and future API contract validation

It must not:

- mutate the real runtime source of truth
- imply compliance completion
- claim permanence
- replace backend audit design work

## 5. Persistence Modes

| Mode | Where event lives | User-facing copy allowed | Admin-facing copy allowed | Export allowed? | Compliance claim allowed? | Suitable use cases | Not suitable use cases |
|---|---|---|---|---|---|---|---|
| `prototype_only` | In UI state only; no stored audit record | "This prototype captures the reason in the UI flow" | "Prototype audit awareness only" | No | No | Early UX review, screenshots, copy testing | Admin audit evidence, compliance review, official export |
| `mock_only` | Controlled mock store, fixture, or test-only memory | "Saved to demo audit trail" | "Mock event captured for prototype review" | Only as demo/export preview, never as evidence | No | QA, demo flows, builder checks, mock admin view | Production claims, compliance reporting, immutable recordkeeping |
| `real_persisted` | Backend-backed persistent audit store | "Recorded in audit log" | "Official audit record" | Yes, with policy controls | Yes, if policy and retention are approved | Production compliance, audit review, retention workflows | Prototype copy, demo-only workflows, unreviewed UI claims |

The critical boundary is that only `real_persisted` can support official compliance language.

## 6. Mock Writer Options

| Option | User clarity | Developer complexity | Safety | Testability | Risk of being mistaken for real persistence | Should use now? |
|---|---|---|---|---|---|---|
| Option A: In-memory session-only writer | High if clearly labeled | Low | High | High | Low if labels are strict | Not yet; reserve for AP-4 implementation planning |
| Option B: Static fixture update pattern | Medium | Low | Medium | Medium | Medium because fixture files look authoritative | No, because it blurs authored demo data and captured events |
| Option C: Local mock store with reset | High | Medium | High | High | Medium unless UI labels are explicit | Candidate for later AP-4 if labels and reset rules are strict |
| Option D: Mock API route | Medium | High | Medium | High | High because it resembles production API behavior | Not now; too easy to overstate persistence |
| Option E: Direct append to mock data file | Low | Low | Low | Low | Very high because it mutates repository data | No; do not use for mock writer events |

Recommendation:

- AP-3 should stay planning only.
- AP-4 should target a pure mock writer with in-memory or test-only behavior.
- Do not directly mutate `src/data/mock/audit-logs.ts` for captured events.
- Do not wire any writer into UI until copy rules and admin display rules are ready.

## 7. Mock Writer Contract

Future mock writer interface, conceptually:

- `writeMockAuditEvent(event)`
- `listMockAuditEvents(filter)`
- `clearMockAuditEvents()`
- `seedMockAuditEvents(events)`

### `writeMockAuditEvent(event)`

- Purpose: capture a single prototype or demo audit event.
- Inputs: a validated AP-1/AP-2 event object.
- Outputs: the stored mock event or a confirmation record.
- Safety constraints: must reject unsafe metadata; must label persistence mode as mock-only; must not write to real storage.
- Persistence mode: `mock_only`.
- Not allowed behavior: official audit claims, backend writes, immutable persistence claims.

### `listMockAuditEvents(filter)`

- Purpose: read mock events for demo admin views and QA.
- Inputs: role filter, event type filter, persistence mode filter, date range, and privacy-safe metadata filters.
- Outputs: filtered mock events.
- Safety constraints: never reveal raw PII beyond policy; never mix mock events with real events without an explicit label.
- Persistence mode: `mock_only`.
- Not allowed behavior: exporting as official evidence or bypassing role privacy rules.

### `clearMockAuditEvents()`

- Purpose: reset demo state for tests and QA.
- Inputs: none.
- Outputs: cleared state confirmation.
- Safety constraints: only available in test/demo context; never exposed as a user action in production-like flows.
- Persistence mode: `mock_only`.
- Not allowed behavior: deleting official audit records or suggesting retention policy control.

### `seedMockAuditEvents(events)`

- Purpose: load known demo data for screenshots, fixtures, and automated checks.
- Inputs: a controlled event list.
- Outputs: seeded mock store state.
- Safety constraints: all seeded events must be clearly labeled mock; do not use real user payloads.
- Persistence mode: `mock_only`.
- Not allowed behavior: pretending that seeded events are production-generated.

## 8. UI Copy Rules For Mock Writer

When a mock writer exists, copy must stay explicit about its limited scope.

Allowed copy:

- "Saved to demo audit trail"
- "Mock audit event captured for prototype review"
- "This is not an official audit record"
- "Real persistence is not connected yet"

Not allowed until real persistence exists:

- "Logged"
- "Official audit record"
- "Auditable"
- "Permanently recorded"
- "Compliant audit trail"
- "Backend audit record created"

## 9. Admin Audit Log Display Rules

Future admin audit views must clearly distinguish mock/demo events from real events.

Required behaviors:

- show a visual badge such as `Mock event`
- show a persistence mode column or filter
- use copy like "Demo audit event - not official persistence"
- do not export mock rows as official audit evidence
- keep mock and real events grouped separately
- warn when the display contains mock data
- render metadata through a safe allowlist

## 10. First Candidate Runtime Wiring Later

Candidate ordering for future wiring:

| Candidate action | User benefit | System owner benefit | Risk | Reason needed | Privacy sensitivity | Recommended order |
|---|---|---|---|---|---|---|
| staff document reject | High | High | Medium | Yes | Staff internal | 1 |
| staff document replacement request | High | High | Medium | Yes | Staff internal | 2 |
| staff document verify | Medium | Medium | Low | No | Lower | 6 |
| disclosure approval | Medium | High | High | Yes | Very high | 7 |
| disclosure rejection | Medium | High | High | Yes | Very high | 8 |
| match override | Medium | High | High | Yes | High | 5 |
| admin export | Medium | High | High | Yes | High | 9 |
| role assignment | Medium | High | High | Yes | High | 10 |
| provider shortlist request | Medium | Medium | High | Yes | High | 4 |

Recommendation: the safest first wiring candidate remains staff document rejection, followed by document replacement request, but only after mock writer copy rules and admin display rules are in place.

## 11. Privacy and Metadata Rules

Mock writer events must still obey AP-2 metadata validation.

Rules:

- reject unsafe metadata
- provider surfaces must not receive raw identity metadata
- executive/ESQ views should only see aggregate or policy-safe metadata
- admin views may see more, but only through an allowlist
- free text metadata must be controlled and limited
- reason text should not be duplicated into metadata unless specifically required and reviewed

## 12. System Owner Trust Rules

The owner-facing governance rule set is simple:

- never imply compliance before backend persistence exists
- never imply permanence before immutable storage exists
- label every mock audit surface
- checkpoint docs must say mock-only when they are mock-only
- PRs must state "no real persistence"
- screenshots and QA must include copy review

## 13. Migration Path To Real Persistence

Recommended stage sequence:

- AP-3: mock writer plan only
- AP-4: pure mock writer + tests only
- AP-5: admin mock audit display planning
- AP-6: first UI wiring to mock writer with visible mock labels
- AP-7: backend audit persistence design
- AP-8: real persistence implementation behind feature flag
- AP-9: copy migration from mock to real
- AP-10: export/review workflow and compliance validation

## 14. Risks

- mock logs mistaken as real
- staff overtrusting prototype behavior
- owner thinking audit compliance is done
- metadata privacy leak
- reason text leakage
- duplicate amber warning fatigue
- admin export misuse
- mixed mock and real events without clear labels
- tests passing while governance is still unclear

## 15. Recommended Next Phase

Recommended next phase: Option A - AP-4 pure mock writer + tests only, but only after this AP-3 plan is reviewed.

Why this is the safest next step:

- it keeps the boundary between planning and implementation explicit
- it allows deterministic tests without claiming real persistence
- it avoids direct mutation of `src/data/mock/audit-logs.ts`
- it postpones runtime wiring until the copy and admin display rules are settled

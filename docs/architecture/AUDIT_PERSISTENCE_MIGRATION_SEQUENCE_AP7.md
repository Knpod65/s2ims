# Audit Persistence Migration Sequence — AP-7

Date: 2026-05-13
Branch: `architecture/audit-persistence-strategy-plan`
Status: Planning only — no runtime code changed.

---

## Purpose

Defines the safe stage-by-stage sequence for migrating from mock-only audit events to
real audit persistence. Each stage has a clear scope, gate criteria, and rollback plan.

No stage may begin without explicit approval.

---

## Stage 0 — Mock-Only (Current State)

**Status:** Complete — merged on 2026-05-13.

**What exists:**

- `AuditEvent` DTO contract stable (`auditTypes.ts`)
- `buildAuditEvent` + specialized builders (`auditEventBuilder.ts`)
- `MockAuditWriter` in-memory implementation (`mockAuditWriter.ts`)
- `sharedMockAuditWriter` session singleton (`sharedMockWriter.ts`)
- `validateAuditMetadata` privacy guard (`auditMetadataRules.ts`)
- `getAdminAuditDisplayRows` presenter (`adminAuditDisplayAdapter.ts`)
- 42 contract checks passing (`check-audit-events.mjs`)
- Staff reject + replacement request wired to `sharedMockAuditWriter`
- Admin audit log displays fixture + demo + live writer events
- `AuditWarningCard` showing Stage 0 copy

**Persistence mode:** `mock_only` only.

**Rollback:** N/A — this is the current baseline.

**Gate to Stage 1:** AP-7 planning documents approved.

---

## Stage 1 — Contract + Tests

**Scope:** Define and test the `AuditWriterInterface` contract and the future `AuditRepository`
abstraction, without implementing the persistent writer.

**What to add:**

- `src/lib/audit/writers/AuditWriterInterface.ts` — shared interface (async-compatible)
- Expand `check-audit-events.mjs` to include interface conformance checks
- Confirm `MockAuditWriter` conforms to the new interface
- Document `AuditRepository` abstraction shape
- Add contract checks: writer returns copy, does not mutate input, throws on forbidden modes

**What must NOT change:**

- No persistent writer implementation
- No backend API routes
- No DB schema
- No UI changes
- No copy stage changes
- `sharedMockWriter.ts` unchanged

**Rollback:**

- Revert new interface file
- Remove new check-script entries
- `MockAuditWriter` behavior unchanged regardless

**Gate to Stage 2:** Stage 1 contract tests pass; interface reviewed and approved.

---

## Stage 2 — Repository Abstraction

**Scope:** Introduce the `AuditRepository` abstraction so the service layer depends on the
interface, not the implementation. Bind the mock implementation in dev/test. Do not implement
the persistent writer.

**What to add:**

- `src/lib/audit/repository/AuditRepository.ts` — abstraction + DI binding helper
- `src/lib/audit/services/auditService.ts` — orchestration service (mock-backed)
- Update `page.tsx` Staff callbacks to call `auditService` instead of `buildXxx` + `sharedMockAuditWriter` directly
- Add DI binding: dev/test → `MockAuditRepository`; future → `PersistentAuditRepository`

**What must NOT change:**

- Persistence remains `mock_only`
- Admin display unchanged
- No backend API
- No DB schema
- Copy stage unchanged (Stage 0)

**UI change:** Page callbacks become thinner — import `auditService` instead of builder + writer.
This is a DRY refactor with no behavioral change.

**Rollback:**

- Revert `page.tsx` to direct builder + writer calls (equivalent behavior)
- Remove service module
- Binding reverts to `sharedMockAuditWriter`

**Gate to Stage 3:** Service layer works; mock still passes 42 checks; page behavior identical.

---

## Stage 3 — Database Schema Planning

**Scope:** Design the database schema for the `audit_events` table. This is planning only — no
migration is created or run.

**What to plan:**

- Table name: `audit_events`
- Columns: `id` (UUID), `event_type`, `action_key`, `actor_id`, `actor_role`,
  `actor_display_name`, `target_type`, `target_id`, `target_display_token`,
  `target_privacy_level`, `reason` (text, nullable), `reason_required`, `reason_min_length`,
  `metadata` (JSON), `source_route`, `created_at` (server-set, immutable),
  `severity`, `policy_version`, `persistence_mode`, `created_by_server_at` (append-only marker)
- Indexes: `actor_id`, `actor_role`, `event_type`, `target_id`, `created_at`
- Partitioning: by `created_at` month (if high volume expected)
- Append-only enforcement: no `updated_at` column; no UPDATE queries allowed on this table
- Redaction: separate `audit_event_redactions` table — never modify the original row
- Retention: policy configurable per event type and severity

**Schema planning document:** Create `AUDIT_DB_SCHEMA_PLAN_AP7.md` (separate doc, not in this file).

**What must NOT happen:**

- No migration file created in this stage
- No DB connection wired
- No API route created

**Rollback:** N/A — docs only.

**Gate to Stage 4:** Schema reviewed and approved; retention/redaction policies decided.

---

## Stage 4 — Write-Through Shadow Mode

**Scope:** Write to both mock writer AND the persistent backend simultaneously, for a defined
period. The mock writer remains the display source. This allows comparison without migrating
the display layer.

**What to add:**

- Backend API: `POST /api/audit-events` — accepts `AuditEvent` payload
- Server validates forbidden metadata, sets server-side `createdAt`, generates server UUID
- `PersistentAuditWriter` implementation (async, API-backed)
- Shadow mode binding: `ShadowAuditRepository` wraps mock + persistent writers
- Admin display still reads from mock writer (no change to display yet)

**What must NOT change:**

- Admin display source unchanged (still mock)
- Copy stage unchanged (Stage 0/1)
- Reason validation unchanged
- `ReasonRequiredModal` not introduced
- Client `actorId` still placeholder in this stage (actor identity is a separate concern)

**Actor identity note:** Shadow mode uses `staff_demo_session` placeholder.
Real actor identity requires authenticated session integration — planned separately.

**Rollback:**

- Remove shadow binding; bind mock only
- Remove `PersistentAuditWriter`
- DB rows from shadow period are historical; may be purged or flagged as `shadow_test`

**Gate to Stage 5:** Shadow writes confirmed in DB; no DB errors; mock path unchanged.

---

## Stage 5 — Real Persisted Audit Display

**Scope:** Switch Admin display from mock writer to persistent API. This is the first stage
where `real_persisted` events appear in the Admin audit log.

**What to change:**

- `getAdminAuditDisplayRows` reads from `AuditRepository.query()` (API) instead of mock writer
- `AdminAuditDisplayRow.persistenceMode` shows `'real_persisted'` for new events
- Admin filter "Official persisted records" now shows real events (no longer empty state)
- Badge/label: `'real_persisted'` events labeled distinctly from `'mock_only'` events
- Actor identity must be real by this stage — `staff_demo_session` placeholder must be replaced

**What must NOT change:**

- Copy stage still needs explicit upgrade decision (see Stage 6)
- `AuditWarningCard` copy unchanged until Stage 6 approved
- Reason validation unchanged
- `ReasonRequiredModal` not introduced

**Rollback:**

- Revert adapter to mock writer source
- Display shows mock events only again
- Real events remain in DB but are not displayed

**Gate to Stage 6:** Real events appear in Admin display; actor identity confirmed real;
no PII leak in metadata; QA checklist complete.

---

## Stage 6 — Copy Stage Upgrade

**Scope:** Upgrade `AuditWarningCard` and related copy from Stage 0 to Stage 2.
This requires explicit product/legal approval.

**Stage 0 → Stage 2 copy changes:**

| Location | Stage 0 (current) | Stage 2 (planned) |
|----------|-------------------|-------------------|
| Staff document reject `AuditWarningCard` | "This prototype captures the staff reason in the UI flow, but real audit-log persistence is not connected yet." | "This rejection will be recorded in the audit log." |
| Staff document replacement `AuditWarningCard` | "This prototype captures the staff message in the UI flow, but real audit-log persistence is not connected yet." | "This replacement request will be recorded in the audit log." |
| Admin audit banner | "Admin audit review is currently showing N mock/demo records only." | "Admin audit log — showing official and demo audit records." |
| Official persisted filter label | "Official persisted records" (intentionally empty) | "Official persisted records" (now populated) |

**What must NOT change in this stage:**

- Reason validation (still deferred)
- `ReasonRequiredModal` (still deferred)
- Reason min-length (still deferred)

**Rollback:**

- Revert `AuditWarningCard` message props to Stage 0 copy
- Revert Admin banner copy
- No behavioral change on rollback

**Gate to Stage 7:** Copy change approved by product/legal; Stage 2 copy confirmed
not to overclaim (e.g., must not imply export/review workflow exists if it does not).

---

## Stage 7 — Reason Validation + ReasonRequiredModal

**Scope:** Enforce reason minimum lengths and introduce `ReasonRequiredModal` for sensitive
actions where reason is required. This stage is explicitly deferred until Stage 5 and Stage 6
are confirmed.

**Prerequisite gates:**

- Real persistence confirmed (Stage 5)
- Copy stage upgraded (Stage 6)
- Product/legal decision on which actions require `ReasonRequiredModal`
- `ReasonRequiredModal` design approved
- SW-3B/SD-3 requirements confirmed

**What to add:**

- Reason min-length enforcement per event type (20 chars for staff reject/replacement)
- `ReasonRequiredModal` component (if approved)
- `requiresReason` prop on `AuditWarningCard` now safe to use for document actions
- Update builder `reasonMinLength` from `1` to `20` for reject/replacement builders

**Rollback:**

- Revert `reasonMinLength` to `1` in builders
- Remove `ReasonRequiredModal` if introduced
- Revert `requiresReason` prop usage

**Gate:** Stage 5 + Stage 6 + explicit product approval for each action.

---

## Rollback Plan Summary

| Stage | Rollback action | Data impact |
|-------|----------------|-------------|
| 1 (Contract) | Revert interface file + checks | None |
| 2 (Repository) | Revert page callbacks to direct builder + writer | None |
| 3 (Schema plan) | N/A — docs only | None |
| 4 (Shadow mode) | Remove shadow writer; bind mock only | Shadow DB rows remain; may be purged |
| 5 (Real display) | Revert adapter to mock source | Real DB rows remain; not displayed |
| 6 (Copy) | Revert copy to Stage 0 | No behavioral change |
| 7 (Validation) | Revert reasonMinLength + remove modal | No data impact |

---

## Stage Gate Checklist (applies to all stages)

Before advancing any stage:

- [ ] Planning document for the stage is reviewed and approved
- [ ] `npm run build` passes 40/40
- [ ] `npm run check:tokens` passes 4/4
- [ ] `npm run check:audit-events` passes (current count or higher)
- [ ] Diff scope confirmed — no unexpected files changed
- [ ] No forbidden files modified (`src/data/mock/audit-logs.ts`, Provider/Student/ESQ flows)
- [ ] Route verification passes (all expected routes 200 OK)
- [ ] Dev log clean (no errors, hydration issues, chunk errors)
- [ ] Privacy boundary confirmed (no PII in metadata)
- [ ] Copy stage matches persistence state

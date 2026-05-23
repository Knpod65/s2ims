# S²IMS Mock Data Query Layer – Data Contract & PII Boundary Review MC98 (Batch 1 + Batch 2)

**Date:** 2026-05-23

## Core Principles (unchanged from plan)
- All query helpers are **view-layer derivations only**.
- They never introduce new PII fields.
- They never write to storage, audit, or backend.
- They accept data as arguments — the caller (page) owns the mock import.

## Batch 1 Boundaries (already validated)
- Staff applications: document verification states are already masked/aggregate.
- Student applications: personal readiness is per-student but limited to the authenticated user.
- No raw identifiers leaked beyond what the page already rendered.

## Batch 2 Boundaries (new)

**Provider Dashboard**
- `mockProviderScholarships`, `mockProviderImpactData` — explicitly aggregate, banded, no individual student data (per file header in providerData.ts).
- Helpers only filter by status/shortlistStatus — no new fields exposed.

**ESQ Dashboard**
- Announcements are governance/review artifacts, not student PII.
- Helpers preserve the "recommendation / review support" language contract established in MC97.
- No "approval" wording introduced.

**Public Scholarships Listing**
- Completely public, no authentication, no PII.
- Filter helper only operates on title + type (already public data).

## No Impact on AP Gates
- No changes to `/admin/master-data/import-preview` or Confirm Import.
- AP-10B / AP-10C / AP-11 remain fully blocked.

## Future Extraction Guardrails
When extending to student/dashboard or recommendations:
- Must keep all student-facing data behind the authenticated student role.
- Must not create helpers that could be misused to aggregate across students.

**Conclusion:** Batch 2 maintains the strict PII and governance boundaries defined for the entire MC98 effort. The query layer remains a safe, read-only, frontend-only abstraction over mock data.

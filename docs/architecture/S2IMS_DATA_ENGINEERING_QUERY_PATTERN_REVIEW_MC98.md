# S²IMS Mock Data Query Layer – Pattern Review MC98 (Batch 1 + Batch 2)

**Date:** 2026-05-23  
**Status:** Batch 2 complete

## Extracted Patterns (Batch 1 + 2)

**Common operations centralized:**
- Status-based filtering (`filter(s => s.status === 'XXX')`)
- Search + category/type filtering (case-insensitive title match + exact type)
- Count/aggregate derivations (pending, urgent, active, document issues, etc.)
- "Days until" deadline math (moved to utils in Batch 1)
- Action/urgent slicing with secondary filters

**Naming & Style Conventions Established:**
- `getXxx...` for derived single values or small aggregates
- `filterXxx...` or `listXxx...` for filtered/sliced arrays
- `*Summary` interfaces for grouped counts
- Constants for magic strings (`ACTION_NEEDED_STATUSES`, `BAD_DOCUMENT_STATES`, `STUDENT_APPLICATION_FILTERS`)
- All helpers take data as first argument(s)
- Only `type` imports from `@/data/mock/*`
- No mutation of inputs
- Return types are small, explicit interfaces

**Files Created So Far:**
- `utils.ts` — shared pure utilities
- `applications.ts` — staff + shared application logic
- `studentApplications.ts` — student application tracking
- `provider.ts` — provider dashboard filters
- `esq.ts` — ESQ review queue (with strong recommendation-not-approval guard)
- `scholarships.ts` — public listing filter

**Remaining High-Value Candidates (Batch 3 if needed):**
- `student/dashboard` + `student/recommendations` (deadline sorting, recommendation visibility)
- Deeper provider pages (candidate pools, impact)
- ESQ review detail pages (if more duplication appears)

**Why import-preview parser remains out of scope:**
- It is a complex, governance-critical parser with its own safety contract (AP-10B).
- MC96/MC97 already established strong boundaries around it.
- Adding it to the query layer would risk mixing parsing concerns with view-layer derivations.

## Lessons from Batch 1 & 2
- Start with the simplest filters/counts — they give the biggest readability win with zero risk.
- Always replicate the exact expression first, then extract.
- ESQ language must be audited on every change (recommendation/review support only).
- Public pages (no role) are the safest place to begin public-facing extraction.

This pattern is now the standard for all future mock data derivations in the S²IMS prototype.

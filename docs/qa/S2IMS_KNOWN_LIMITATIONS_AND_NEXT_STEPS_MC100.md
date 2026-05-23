# S²IMS MC100 Known Limitations and Next Steps

**Date:** 2026-05-23

## Known Limitations (Explicit and Documented)

- All data is synthetic mock / prototype data only
- No real backend, database, or persistence
- No real authentication or authorization
- Many actions (import, export, publication, approval, official decisions) are intentionally disabled pending governance approval (AP-10B, AP-10C, AP-11)
- ESQ actions are recommendations and review support only — never official approval or decisions
- Some routes return 500 or require specific mock login state when accessed without proper role context (expected in prototype)
- No production-grade error handling, logging, or monitoring
- No real file uploads or document processing
- Notification system is mock-only with no real delivery
- Query layer (MC98) is frontend-only derivation layer — not a real data layer

## What Is Safe for Controlled Internal Demo
- Navigating all major role dashboards and lists
- Viewing mock data, filters, and status flows
- Observing disabled action hints and SafetyBanners
- Demonstrating bilingual (Thai/English) Soft Civic patterns
- Showing recommendation language in ESQ flows
- Illustrating the query layer behavior preservation

## What Must Be Clearly Stated During Any Demo
- "This is a prototype using mock data only."
- "No real decisions, approvals, or data changes are possible."
- "Certain actions are intentionally blocked pending governance approval."
- "ESQ provides recommendations and review support only."

## Recommended Post-MC100 Path
1. Controlled internal demo sessions with governance observers
2. Governance owner review of all AP gate states and language
3. Decision on whether to pursue a production path (requires significant additional work outside current mock cycle)
4. If production path is approved: separate planning for real backend, real auth, real audit, and full governance sign-off

**MC100 Known Limitations Status:** Fully documented. Controlled demo use is appropriate under the stated constraints. Production use is not authorized.

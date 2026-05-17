Branch: architecture/s2ims-candidate-review-local-state-runtime-mc8
Purpose: MC8 local-only candidate review runtime for MC6 shell.

Files created/modified:
- src/lib/assignment/candidateReviewState.ts (created)
- src/components/assignment/CandidateSelectionReviewShell.tsx (modified)
- src/lib/assignment/index.ts (modified)
- scripts/check-audit-events.mjs (modified)
- docs/architecture/S2IMS_CANDIDATE_REVIEW_LOCAL_STATE_RUNTIME_MC8_SUMMARY.md (created)
- docs/architecture/NEXT_RENOVATION_STEPS.md (modified)

Checks to run:
- `npm run build`
- `npm run check:tokens`
- `node scripts/check-audit-events.mjs`

Validation: (fill after running build/checks)

Safety confirmations:
- No persistence, API, audit writes, assignment, approvals introduced.
- AP-10B: unchanged
- AP-10C/AP-11: blocked

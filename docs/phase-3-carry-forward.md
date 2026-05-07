Phase 3 Carry-Forward Notes (from Phase 2 Student Core — Aurora Blue)

Key items to reuse in Phase 3:

- MatchScoreRing: reuse the `MatchScoreRing` component for the scholarship detail match score visualization; ensure its interface remains consistent.
- EligibilityChecklist: reuse `EligibilityChecklist` for scholarship eligibility details — keep it as a hard eligibility gate / must-pass requirements UI.
- RecommendationCard style rules: preserve `RecommendationCard` spacing, typography and accent usage in list and detail views.
- MissingDataPrompt copy tone: maintain opportunity-framed, supportive copy for missing-data prompts rather than deficit/blame language.
- Aurora accent rules: carry forward the Aurora color accents and `role-*` tokens used for primary/gradient surfaces.
- Mobile sticky CTA safe-area: preserve the 48px bottom safe-area rule for sticky CTAs on mobile.

Notes
- Do not duplicate `EligibilityChecklist` semantics — it represents MUST-pass eligibility checks. For soft-fit explanations, use `FitBreakdown`.
- `MatchScoreRing` should be visually identical when reused; prefer prop-driven reuse over copy-paste.

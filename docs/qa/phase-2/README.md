Phase 2 Visual QA — Student Core (Aurora Blue)

This document lists the manual screenshot checklist and capture rules for Phase 2 visual QA.

Capture rules
- Use the production-like build of the app (local `npm run build` + `npm run dev`).
- For desktop captures use a 1440×900 or larger viewport. Prefer 1366×768+; annotate if different.
- For mobile captures set the viewport width to 375px and device pixel ratio 2 if available.
- Use both `th` and `en` locales for locale-specific screenshots where requested.
- Name files using the pattern: `phase2--<scope>--<route>--<viewport>--<locale>.png`.

Desktop checklist
- phase2--student-dashboard--desktop--en.png : /student/dashboard
- phase2--student-profile--desktop--en.png : /student/profile
- phase2--student-profile-completion--desktop--en.png : /student/profile/completion
- phase2--student-recommendations--desktop--en.png : /student/recommendations
- phase2--student-recommendations-expl--desktop--en.png : /student/recommendations/explanation
- phase2--student-recommendation-item-expl--desktop--en.png : /student/recommendations/[valid-scholarshipId]/explanation

Mobile (375px) checklist
- phase2--student-dashboard--mobile-375--en.png : /student/dashboard
- phase2--student-profile--mobile-375--en.png : /student/profile
- phase2--student-profile-completion--mobile-375--en.png : /student/profile/completion
- phase2--student-recommendations--mobile-375--en.png : /student/recommendations
- phase2--student-recommendations-expl--mobile-375--en.png : /student/recommendations/explanation
- phase2--student-recommendation-item-expl--mobile-375--en.png : /student/recommendations/[valid-scholarshipId]/explanation

TH locale checklist
- phase2--student-dashboard--desktop--th.png : /student/dashboard (Thai)
- phase2--student-recommendations-expl--desktop--th.png : /student/recommendations/explanation (Thai)
- phase2--student-profile-completion--desktop--th.png : /student/profile/completion (Thai)

Governance spot-check (light theme)
- phase2--staff-disclosure-requests--desktop--en.png : /staff/disclosure-requests
- phase2--provider-candidates--desktop--en.png : /provider/candidates
- phase2--esq-dashboard--desktop--en.png : /esq/dashboard
- phase2--admin-audit-log--desktop--en.png : /admin/audit-log

Governance verification notes
- Confirm audit warning light theme is visible where warnings appear.
- Confirm masked identity is rendered appropriately on light theme.
- Confirm aggregate-only badge is present where applicable.
- If a "reason-required" modal can be reached, capture its open state and note the flow.

If browser automation is available
- Capture with Playwright or Puppeteer and save screenshots to this folder with the filenames above.

If automation is NOT available
- Follow the steps above manually. Save screenshots into `docs/qa/phase-2/desktop` or `mobile-375` and `th-locale` folders.

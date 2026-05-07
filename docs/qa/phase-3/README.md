# Phase 3 QA Screenshots

This folder contains Phase 3 screenshot QA for Student scholarship detail, application tracker, and mock document upload flows.

## Capture Method

Screenshots were captured with the locally installed Google Chrome app through the Chrome DevTools Protocol. No Playwright, Puppeteer, backend, or new dependency was added.

## Dev-only State Override Decision

No query-param force overrides were added.

Reason: the existing Phase 3 mock data already exposes every required application and upload state:

- `missing`
- `uploading`
- `invalid_file_type`
- `verification_pending`
- `verified`
- `rejected`
- `needs_replacement`
- `revision_requested`

The submit confirmation modal is reachable through the mock edit flow by clicking the review/submit CTA.

## Locale Setup

English screenshots use:

`localStorage.setItem('s2ims_lang','en')`

Thai screenshots use:

`localStorage.setItem('s2ims_lang','th')`

All screenshots use:

`localStorage.setItem('s2ims_role','student')`

## Privacy Boundary Check

Provider routes must not import from `src/components/student/*`.

Manual check command:

`rg "components/student|@/components/student|\\.\\./.*components/student" src/app/provider src/components/provider`

Expected result: no matches.

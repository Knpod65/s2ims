# S²IMS Next Action Decision Gate

**Date**: 2026-05-21  
**Milestone**: MC75  
**Purpose**: Define the trigger conditions, required evidence, allowed/forbidden actions, and safety boundaries for each future milestone (MC76–MC82)

---

## Current State (as of MC75)

| Item | Status |
|------|--------|
| Documentation readiness | ~100% (all templates, standards, and planning docs complete) |
| Actual demo execution | 0% — no session held |
| Governance owner assignment | 0% — no owners designated |
| AP-10B | 🔒 BLOCKED |
| AP-10C | 🔒 BLOCKED |
| AP-11 | 🔒 BLOCKED |
| Wave 1 UX migration | 0% — awaiting explicit approval |
| Production deployment | 🔒 BLOCKED |

---

## Decision Gate Table: MC76–MC82

---

### MC76: Actual Controlled Demo Execution Report

| Attribute | Value |
|-----------|-------|
| **Trigger condition** | A real controlled demo session has been conducted with stakeholders present |
| **Required evidence** | Signed-in attendee list (participant IDs, no PII), facilitator confirmation that session was held, date and duration of session |
| **Allowed actions** | Fill in the demo execution report template; document which routes were shown; record stop conditions encountered (if any); note verbal feedback received |
| **Forbidden actions** | Claiming execution without evidence; recording feedback as if it were collected when it was not; writing PII in any report |
| **Route verification required** | ✅ Yes — confirm build 42/42 before and after any report-related docs are committed |
| **Safety boundary** | AP gates remain BLOCKED; no data actions; no persistence; no sign-off collected in MC76 |
| **Next gate** | MC77 (if feedback was formally collected); OR wait for feedback collection before proceeding |

---

### MC77: Stakeholder Feedback Synthesis

| Attribute | Value |
|-----------|-------|
| **Trigger condition** | Actual feedback forms have been completed by real session attendees |
| **Required evidence** | Completed feedback forms (with participant IDs, not PII); at least 3 responses; session report from MC76 |
| **Allowed actions** | Synthesize feedback into a structured report; extract themes; identify UX improvements; report governance readiness observations from attendees |
| **Forbidden actions** | Fabricating feedback; recording verbal impressions as formal feedback without attendee consent; drawing go/no-go conclusions from informal notes |
| **Route verification required** | ✅ Yes — standard validation before committing synthesis doc |
| **Safety boundary** | No governance decisions triggered by this milestone alone; AP gates remain BLOCKED; feedback synthesis is input to governance process, not the decision itself |
| **Next gate** | MC78 (governance owner assignment) and/or MC80 (UX improvements if approved) |

---

### MC78: Governance Owner Assignment Package

| Attribute | Value |
|-----------|-------|
| **Trigger condition** | Leadership has made decisions at the governance workshop (MC75 agenda) and candidate owners have indicated acceptance |
| **Required evidence** | Workshop summary document; named candidates for all 5 roles; written acceptance from each candidate (separate signed documents); provisional timelines |
| **Allowed actions** | Create formal governance owner assignment record; update governance checklist with owner names; schedule governance evidence check-in; distribute questionnaire sections to each owner |
| **Forbidden actions** | Self-assigning governance roles; claiming assignment without written acceptance; treating workshop discussion as formal assignment |
| **Route verification required** | ✅ Yes — standard validation |
| **Safety boundary** | Owner assignment does not open AP-10B; assigning owners is a precondition, not the activation decision; AP gates remain BLOCKED until go/no-go meeting |
| **Next gate** | MC79 (AP-10B readiness package — after owners complete their evidence sections) |

---

### MC79: AP-10B Readiness Package

| Attribute | Value |
|-----------|-------|
| **Trigger condition** | All 5 governance owners have been formally designated AND have completed their respective evidence sections in the governance checklist |
| **Required evidence** | All 8 evidence items produced (PDPA impact assessment, data retention policy, data contract, technical readiness report, rollback runbook tested, audit log verified, operator training record, go/no-go decision record) |
| **Allowed actions** | Compile all evidence into a readiness package; convene go/no-go meeting; document the go/no-go decision; if decision is YES, activate AP-10B in src/config; if decision is NO, document blockers |
| **Forbidden actions** | Opening AP-10B without all 25 checklist items confirmed; proceeding without all 5 owners designated; treating questionnaire completion as activation authority |
| **Route verification required** | ✅ Required — run full validation before and after any src/config change; confirm route count stable |
| **Safety boundary** | This is the ONLY milestone where AP-10B activation is permitted — and only after go/no-go decision is formally documented with all required evidence |
| **Next gate** | AP-10C (MC79b or separate milestone if applicable) and AP-11 (same) |

---

### MC80: Limited UX Wave 1 Migration

| Attribute | Value |
|-----------|-------|
| **Trigger condition** | Project Lead has given **explicit written approval** to begin Wave 1 page migration |
| **Required evidence** | Written approval referencing the Wave 1 plan (MC70/MC71 docs); specific pages authorized (e.g., "approve migration of /admin/dashboard and /staff/applications"); build baseline confirmed |
| **Allowed actions** | Migrate 3–5 approved pages to Button/StatusBadge components; update existing page.tsx files only; run build validation after each page; update NEXT_RENOVATION_STEPS with migration status |
| **Forbidden actions** | Migrating pages without explicit written approval; adding new routes; changing data handling; changing middleware; enabling any AP gate as part of migration |
| **Route verification required** | ✅ Required — before and after each page migration; confirm route count stable (expected 42/42 or approved new count) |
| **Safety boundary** | Visual-layer changes only; no change to data handling, persistence, or governance; AP gates unaffected; rollback: revert individual page.tsx to previous version |
| **Next gate** | MC81 (Figma frame production review if design session has occurred) |

---

### MC81: Figma Frame Production and Design Review

| Attribute | Value |
|-----------|-------|
| **Trigger condition** | A design review session has been completed where Figma frames have been evaluated against the redesign briefs (MC72 docs) |
| **Required evidence** | Design review session record; Figma frame export references; reviewer comments addressing each of the 57 design review checklist items (MC72) |
| **Allowed actions** | Document design review findings; update Figma design briefs with review decisions; create design-to-code mapping for Wave 2 preparation; note approved deviations from briefs |
| **Forbidden actions** | Creating or modifying Figma frames in this milestone (Figma work is pre-work for this milestone, not part of it); implementing code changes in this milestone |
| **Route verification required** | ✅ Yes (for any docs committed) |
| **Safety boundary** | Docs/design decision record only; no src changes; no runtime changes |
| **Next gate** | MC82 (Wave 2 migration, if approved) |

---

### MC82: Laravel/PHP Route Verification Standard (Separate Project)

| Attribute | Value |
|-----------|-------|
| **Trigger condition** | A **separate Laravel/PHP project** has been identified where route verification is needed |
| **Required evidence** | Confirmation that the target repo contains `artisan` and `laravel/framework` in composer.json |
| **Allowed actions** | Apply the Laravel/PHP section of the route verification standard (MC75 doc); run `php artisan route:list`, `composer validate`, `php artisan test`; document route inventory |
| **Forbidden actions** | Running Laravel commands in S²IMS (this is a Next.js repo — see route verification standard); applying this gate to S²IMS |
| **Route verification required** | ✅ For target Laravel repo — php artisan route:list; for S²IMS — standard Next.js validation |
| **Safety boundary** | S²IMS safety boundaries unaffected; this gate applies only to the separate Laravel target |
| **Next gate** | As applicable to the Laravel project |

---

## Decision Gate Summary

| MC | Name | Trigger | AP Gate Change | src Change |
|----|------|---------|----------------|-----------|
| MC76 | Demo execution report | Session held | ❌ None | ❌ None |
| MC77 | Feedback synthesis | Feedback forms completed | ❌ None | ❌ None |
| MC78 | Governance owner assignment | Workshop decisions made | ❌ None | ❌ None |
| MC79 | AP-10B readiness + activation | All 25 checklist items + go/no-go | ✅ AP-10B only (if approved) | ✅ src/config only |
| MC80 | Wave 1 UX migration | Explicit written approval | ❌ None | ✅ page.tsx only |
| MC81 | Figma design review | Design review session complete | ❌ None | ❌ None |
| MC82 | Laravel route verification | Separate Laravel repo identified | ❌ None (S²IMS) | ❌ None (S²IMS) |

---

## What Unlocks What

```
MC76 (demo session) ──────────────────────────────► MC77 (feedback)
                    \                                      \
                     ──────────────────────────────► MC78 (governance owners)
                                                          \
                                                    MC79 (AP-10B readiness)
                                                          \
                                                    AP-10B ACTIVATED (if go/no-go YES)
                                                          \
                                                    AP-10C / AP-11 (if applicable)

MC80 (Wave 1 migration) — independent; requires Project Lead written approval only
MC81 (Figma review) — independent; requires design review session only
MC82 (Laravel verification) — independent; requires separate Laravel repo
```

---

**Document**: MC75 planning — permanent decision gate reference.  
**AP gates remain BLOCKED until MC79 conditions are fully met.**  
**Date**: 2026-05-21

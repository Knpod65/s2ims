# Pattern Breaker Component Roadmap

Date: 2026-05-11
Scope: roadmap only. No runtime components were added.

## Purpose

This roadmap recommends gradual components and layout patterns that can replace repeated cards, tables, and generic dashboard sections with role-specific task surfaces.

Implementation should be incremental. Each component needs screenshot QA before merge, especially for mobile and Thai/English text.

## Phase Guidance

| Phase | Focus | Reason |
| --- | --- | --- |
| Phase 1 | Student readiness and document recovery | Contained, student-facing, low governance risk, high clarity gain |
| Phase 2 | Provider criteria and candidate decision workspaces | High value, must preserve privacy boundary |
| Phase 3 | Staff triage and document evidence workbench | Higher operational risk, needs audit/reason QA |
| Phase 4 | Admin export/access governance surfaces | High governance sensitivity |
| Phase 5 | Executive aggregate intelligence surfaces | Must preserve aggregate-only policy |

## Student Components

| Component | Purpose | Replaces | Role | Data Needed | Risk | Phase | Screenshot QA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `StudentJourneyRail` | Show the student's current path across profile, recommendations, applications, documents, and outcomes | Dashboard card stacks and disconnected progress cards | Student | Profile completion, applications, document readiness, recommendation availability | Medium | 1 | Required for dashboard and mobile |
| `OpportunityUnlockPanel` | Explain which opportunities are available, blocked, or close to unlocked | Recommendation cards and generic missing data panels | Student | Match score, eligibility gaps, missing data, deadlines | Medium | 1 | Required for recommendations and scholarship detail |
| `MatchReasoningCanvas` | Show transparent matching factors, confidence, missing data, and next actions | Matching KPI cards and breakdown mini-cards | Student | Fit factors, eligibility, soft weights, confidence, missing fields | Medium | 1 or 2 | Required for EN/TH and mobile |
| `ApplicationReadinessPath` | Convert readiness percent and checklist into a guided submission path | Readiness cards and separate checklist blocks | Student | Eligibility checks, documents, profile completion, submission status | Low | 1 | Required for apply and application detail |
| `DocumentRecoveryPanel` | Guide students through recoverable document problems without using punitive wording | Generic document status rows and warning cards | Student | Document status, replacement reason, upload eligibility, accepted file types | Medium | 1 | Required for documents page and TH wrapping |

## Provider Components

| Component | Purpose | Replaces | Role | Data Needed | Risk | Phase | Screenshot QA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `CriteriaTuningCockpit` | Combine hard constraints, soft weights, preview, fairness hints, and save state into one tuning surface | Criteria card stacks and right sidebar preview | Provider | Scholarship criteria, weights, match preview, candidate count, save state | Medium | 2 | Required for criteria route desktop/mobile |
| `CandidateDecisionWorkbench` | Support token-only candidate review, comparison, and shortlist decisions in one workspace | Candidate cards, tables, and request modals | Provider | Tokenized candidates, match factors, shortlist status, aggregate pool signals | High | 2 | Required for privacy boundary and no raw identity |
| `PoolImpactMeter` | Show readiness and value of a candidate pool without exposing identity | Pool summary cards and locked/ready cards | Provider | Candidate pool status, ready/locked state, aggregate counts, freshness | Medium | 2 | Required for candidates and scholarship pool routes |
| `ShortlistReviewRail` | Show shortlist request state, pending staff review, and decision history as a rail | Generic shortlist status badges and request panels | Provider | Shortlist request status, timestamps, reasons, staff review state | Medium | 2 | Required for pending/approved/not approved states |
| `ImpactStoryBoard` | Turn provider impact metrics into a narrative of funded cohorts and outcomes | Impact metric card grids and chart cards | Provider | Aggregate outcomes, departments, cohorts, funds, privacy-safe summaries | Medium | 2 or 5 | Required for aggregate-only display |

## Staff Components

| Component | Purpose | Replaces | Role | Data Needed | Risk | Phase | Screenshot QA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `StaffTriageBoard` | Prioritize applications, disclosures, OCR, and data quality exceptions | Dashboard stat cards and table-first queues | Staff | Queue counts, severity, SLA, blockers, assignment state | High | 3 | Required for staff dashboard and queue routes |
| `DocumentEvidenceWorkbench` | Review documents with evidence, status, reason capture, and audit context together | Document accordion cards and side panels | Staff | Document files, verification status, reasons, audit history, replacement rules | High | 3 | Required for all document states |
| `ReviewActionRail` | Keep staff decision actions attached to evidence and audit warnings | Detached action cards and modal-first review | Staff | Available actions, status transition rules, reasons, audit notes | High | 3 | Required for approval/rejection/replacement |
| `AuditDecisionPanel` | Make audit consequences explicit during sensitive staff actions | Generic warnings and confirmation modals | Staff | Actor, action, reason, target token, audit policy | High | 3 | Required for identity reveal and disclosure |
| `ExceptionQueue` | Group operational issues by severity and required action | Data-quality cards and generic issue lists | Staff | Severity, issue type, owner, status, deadline | Medium | 3 | Required for staff data quality mobile |

## Executive Components

| Component | Purpose | Replaces | Role | Data Needed | Risk | Phase | Screenshot QA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `PolicyScenarioPanel` | Explore aggregate policy or funding scenarios without individual case exposure | ESQ stat cards and approval cards | Executive | Aggregate cohorts, funding assumptions, scenario parameters | High | 5 | Required for aggregate-only review |
| `EquitySignalMap` | Show aggregate equity signals by cohort, region, department, or scholarship type | Disconnected metric/chart cards | Executive | Aggregated equity indicators, thresholds, trends | High | 5 | Required for no individual drilldown |
| `AggregateInsightBoard` | Present strategic trends, risk signals, and recommendations | Executive dashboard card piles | Executive | Aggregate trends, approvals, outcomes, policy alerts | High | 5 | Required for desktop/mobile |
| `FundingImpactNarrative` | Tell the story of funding outcomes over time | Recent history table and impact cards | Executive | Aggregate awards, cohorts, trends, outcomes | Medium | 5 | Required for history and dashboard |

## Admin Components

| Component | Purpose | Replaces | Role | Data Needed | Risk | Phase | Screenshot QA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `AccessRiskConsole` | Surface risky role changes, stale access, and permission issues | Admin dashboard stats and users table | Admin | Users, roles, last active, risk flags, audit events | High | 4 | Required for users/admin dashboard |
| `ExportGovernancePanel` | Make export purpose, scope, sensitivity, and audit record central to export actions | Export cards and generic warning blocks | Admin | Export config, sensitivity, allowed roles, audit requirements | High | 4 | Required for export route |
| `SystemHealthStrip` | Show high-signal operational status without another KPI grid | Dashboard stat cards | Admin | Job health, queue health, sync status, token check status | Medium | 4 | Required for admin dashboard |
| `PermissionChangeWorkbench` | Review role or permission changes with evidence and audit trail | User table plus action buttons | Admin | User role, requested change, actor, audit history, policy | High | 4 | Required for admin users route |

## Roadmap Rules

- Do not introduce these as decorative wrappers around existing cards.
- Each component must replace a generic pattern with a clearer task model.
- Each implementation phase should preserve data keys and behavior unless separately approved.
- Provider and executive components must pass privacy review before merge.
- Staff and admin components must pass audit/reason review before merge.
- Every component needs desktop, mobile, and Thai/English screenshot QA.

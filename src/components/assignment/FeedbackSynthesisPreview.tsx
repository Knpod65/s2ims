"use client";

import React, { useMemo } from "react";
import type {
  DemoFeedbackSynthesisItem,
  DemoFeedbackSynthesisSummary,
  DemoFeedbackSynthesisThemeCategory,
  DemoFeedbackSynthesisSeverity,
  DemoFeedbackSynthesisFollowUpType,
} from "@/lib/assignment/demoFeedbackSynthesis";
import {
  createDemoFeedbackSynthesisSamples,
  summarizeDemoFeedbackSynthesisSamples,
} from "@/lib/assignment/demoFeedbackSynthesisSamples";
import { summarizeDemoFeedbackSynthesisItems } from "@/lib/assignment/demoFeedbackSynthesis";

export type FeedbackSynthesisPreviewProps = {
  title?: string;
  description?: string;
  items?: DemoFeedbackSynthesisItem[];
  readonly?: boolean;
};

/* ================================================================== */
/*  Copy strings — hardcoded; no i18n / no external copy helper       */
/* ================================================================== */

const BANNER_COPY: readonly string[] = [
  "Demo only. Read-only preview.",
  "Uses safe mock data only.",
  "No real student or personnel data.",
  "Not saved. Not submitted. Not official evidence.",
  "Not an approval. Not an assignment. Not a scholarship decision.",
  "Does not change AP-10B governance status.",
] as const;

const SECTION_TITLE_DEFAULT = "Feedback Synthesis Preview";

const SECTION_DESCRIPTION_DEFAULT =
  "Safe mock synthesis output only. Nine sample items derived from MC41 runtime " +
  "and MC43 safe sample data. Not official evidence.";

const SUMMARY_SECTION_TITLE = "Aggregate Summary";

const SUMMARY_SECTION_DESCRIPTION =
  "Planning summary only. Read-only. Not official evidence.";

const GOV_SECTION_TITLE = "Governance-Sensitive Review Required";

const GOV_SECTION_PREAMBLE =
  "Items in this section require coordination with the governance team " +
  "before any planning action is taken.";

const GOV_SECTION_COPY =
  "These items reference governance processes. They do not grant approval.\n" +
  "They do not change AP-10B blockers. They are planning signals only.\n" +
  "Planning signals only. Not an approval. Not AP-10B evidence.";

const ITEM_SECTION_COPY =
  "Read-only mock item. Not official. Not approval-seeking. Not persisted.";

const EMPTY_STATE_HEADING = "No synthesis items available.";

const EMPTY_STATE_BODY =
  "This section displays safe mock synthesis items only.\n" +
  "This preview shows safe mock synthesis items only. No items are currently available in the planning dataset.";

const CLAIM_COPY =
  "It does not collect feedback, save data, submit data, approve decisions, assign candidates, create official evidence, or change AP-10B status.";

/* ================================================================== */
/*  Enum-to-label maps — local only; no i18n                           */
/* ================================================================== */

const THEME_CATEGORIES: readonly DemoFeedbackSynthesisThemeCategory[] = [
  "clarity_copy",
  "layout_navigation",
  "accessibility",
  "privacy_pdpa",
  "workflow_understanding",
  "training_support",
  "stakeholder_confusion_risk",
  "governance_sensitive",
  "out_of_scope",
] as const;

const THEME_LABEL: Record<DemoFeedbackSynthesisThemeCategory, string> = {
  clarity_copy: "Clarity / Copy",
  layout_navigation: "Layout / Navigation",
  accessibility: "Accessibility",
  privacy_pdpa: "Privacy / PDPA",
  workflow_understanding: "Workflow Understanding",
  training_support: "Training / Support",
  stakeholder_confusion_risk: "Stakeholder Confusion Risk",
  governance_sensitive: "Governance-Sensitive",
  out_of_scope: "Out of Scope",
} as const;

const SEVERITY_LEVELS: readonly DemoFeedbackSynthesisSeverity[] = [
  "low",
  "medium",
  "high",
  "blocked",
] as const;

const SEVERITY_LABEL: Record<DemoFeedbackSynthesisSeverity, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  blocked: "Blocked",
} as const;

const SEVERITY_CLASS: Record<DemoFeedbackSynthesisSeverity, string> = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-orange-100 text-orange-700",
  blocked: "bg-red-100 text-red-700",
} as const;

const FOLLOW_UP_TYPES: readonly DemoFeedbackSynthesisFollowUpType[] = [
  "docs_copy_update",
  "walkthrough_update",
  "ux_hardening_plan",
  "ux_hardening_runtime",
  "accessibility_plan",
  "accessibility_runtime",
  "demo_route_copy_polish",
  "governance_escalation_plan",
  "no_action",
] as const;

const FOLLOW_UP_LABEL: Record<DemoFeedbackSynthesisFollowUpType, string> = {
  docs_copy_update: "Docs / Copy Update",
  walkthrough_update: "Walkthrough Update",
  ux_hardening_plan: "UX Hardening Plan",
  ux_hardening_runtime: "UX Hardening Runtime",
  accessibility_plan: "Accessibility Plan",
  accessibility_runtime: "Accessibility Runtime",
  demo_route_copy_polish: "Demo Route Copy Polish",
  governance_escalation_plan: "Governance Escalation Plan",
  no_action: "No Action",
} as const;

const SECTION_LABEL: Record<
  DemoFeedbackSynthesisItem["affectedSection"],
  string
> = {
  candidate_review_preview: "Candidate Review Preview",
  feedback_backlog_preview: "Feedback Backlog Preview",
  combined_route: "Combined Route",
  general_demo: "General Demo",
} as const;

/* ================================================================== */
/*  Sub-components                                                    */
/* ================================================================== */

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-surface-low p-3">
      <dt className="text-xs font-semibold uppercase text-ink-3">{label}</dt>
      <dd className="mt-1 text-xl font-semibold text-ink-1">{value}</dd>
    </div>
  );
}

function SafeField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-ink-3">{label}</dt>
      <dd className="mt-0.5 text-ink-1">{value}</dd>
    </div>
  );
}

function SafetyFlag({ label, value }: { label: string; value: boolean }) {
  const chipClass = value
    ? "rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-200"
    : "rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 ring-1 ring-red-200";
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-ink-3">{label}</dt>
      <dd className="mt-0.5">
        <span className={chipClass}>
          {label}: {String(value)}
        </span>
      </dd>
    </div>
  );
}

/* ================================================================== */
/*  Zero-summary factory                                              */
/* ================================================================== */

function emptyThemeCategoryCounts()
  : Record<DemoFeedbackSynthesisThemeCategory, number> {
  return Object.fromEntries(
    THEME_CATEGORIES.map((c) => [c, 0])
  ) as Record<DemoFeedbackSynthesisThemeCategory, number>;
}

function emptySeverityCounts()
  : Record<DemoFeedbackSynthesisSeverity, number> {
  return Object.fromEntries(
    SEVERITY_LEVELS.map((s) => [s, 0])
  ) as Record<DemoFeedbackSynthesisSeverity, number>;
}

function emptyFollowUpTypeCounts()
  : Record<DemoFeedbackSynthesisFollowUpType, number> {
  return Object.fromEntries(
    FOLLOW_UP_TYPES.map((f) => [f, 0])
  ) as Record<DemoFeedbackSynthesisFollowUpType, number>;
}

function zeroSummary(): DemoFeedbackSynthesisSummary {
  return {
    total: 0,
    themeCategoryCounts: emptyThemeCategoryCounts(),
    severityCounts: emptySeverityCounts(),
    followUpTypeCounts: emptyFollowUpTypeCounts(),
    governanceSensitiveCount: 0,
    allPiiExcluded: true,
    allNonApprovalConfirmed: true,
    officialEvidenceCount: 0,
    approvalCollectedCount: 0,
    persistedCount: 0,
    exportedCount: 0,
    notifiedCount: 0,
  };
}

/* ================================================================== */
/*  Group builder                                                     */
/* ================================================================== */

type SynthesisGroup = {
  key: string;
  label: string;
  items: DemoFeedbackSynthesisItem[];
};

function groupsFrom(
  items: DemoFeedbackSynthesisItem[],
): SynthesisGroup[] {
  const gov = items.filter((i) => i.governanceSensitive);
  const govBlocked = gov.filter((i) => i.severity === "blocked");
  const high = items.filter(
    (i) => i.severity === "high" && !i.governanceSensitive,
  );
  const medium = items.filter(
    (i) => i.severity === "medium" && !i.governanceSensitive,
  );
  const low = items.filter(
    (i) => i.severity === "low" && !i.governanceSensitive,
  );

  const groups: SynthesisGroup[] = [];
  if (govBlocked.length > 0) {
    groups.push({
      key: "gov",
      label: GOV_SECTION_TITLE,
      items: govBlocked,
    });
  }
  if (high.length > 0) {
    groups.push({
      key: "high",
      label: "High Priority (UX / Accessibility)",
      items: high,
    });
  }
  if (medium.length > 0) {
    groups.push({
      key: "medium",
      label: "Medium Priority (Planning / Docs)",
      items: medium,
    });
  }
  if (low.length > 0) {
    groups.push({
      key: "low",
      label: "Low Priority Items",
      items: low,
    });
  }
  return groups;
}

/* ================================================================== */
/*  Main component                                                     */
/* ================================================================== */

export default function FeedbackSynthesisPreview({
  title,
  description,
  items: externalItems,
  readonly = true,
}: FeedbackSynthesisPreviewProps) {
  /* Default data source: MC43 safe sample runtime only */
  const resolvedItems: DemoFeedbackSynthesisItem[] = useMemo(
    () => externalItems ?? createDemoFeedbackSynthesisSamples(),
    [externalItems],
  );

  /* Aggregate summary from MC41/MC43 helpers */
  const summary: DemoFeedbackSynthesisSummary = useMemo(
    () =>
      resolvedItems.length > 0
        ? summarizeDemoFeedbackSynthesisItems(resolvedItems)
        : zeroSummary(),
    [resolvedItems],
  );

  const groups = groupsFrom(resolvedItems);

  const showSummary = resolvedItems.length > 0;
  const showItemList = resolvedItems.length > 0 && groups.length > 0;
  const showEmptyState = resolvedItems.length === 0;

  return (
    <section
      className="space-y-6 rounded-lg border border-line bg-white p-6 shadow-card"
      aria-label="Feedback synthesis preview section"
    >
      {/* --- Demo notice banner --- */}
      <div role="note" aria-live="polite" aria-label="Demo notice">
        {BANNER_COPY.map((line, idx) => (
          <p key={idx} className={idx === 0 ? "font-semibold" : undefined}>
            {line}
          </p>
        ))}
      </div>

      {/* --- Explanatory claim --- */}
      <p className="text-sm text-ink-2" aria-label="Component scope statement">
        {CLAIM_COPY}
      </p>

      {/* --- Heading --- */}
      <div className="space-y-1">
        <h2 className="text-lg font-semibold text-ink-1">
          {title || SECTION_TITLE_DEFAULT}
        </h2>
        <p className="text-sm text-ink-2">
          {description || SECTION_DESCRIPTION_DEFAULT}
        </p>
      </div>

      {/* --- Aggregate summary --- */}
      {showSummary && (
        <div role="region" aria-label="Aggregate summary panel">
          <h3 className="text-base font-semibold text-ink-1">
            {SUMMARY_SECTION_TITLE}
          </h3>
          <p className="mt-1 text-sm text-ink-2">
            {SUMMARY_SECTION_DESCRIPTION}
          </p>

          <dl
            className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
            aria-label="Aggregate summary counts"
          >
            <SummaryTile label="Total items" value={summary.total} />

            <SummaryTile
              label="Theme categories covered"
              value={Object.values(summary.themeCategoryCounts).filter(
                (n) => n > 0,
              ).length}
            />

            <div className="rounded-md border border-line bg-surface-low p-3">
              <dt className="text-xs font-semibold uppercase text-ink-3">
                By severity
              </dt>
              <dd className="mt-1 space-y-0.5 text-xs text-ink-2">
                {SEVERITY_LEVELS.map((sev) => (
                  <span key={sev} className="block">
                    {SEVERITY_LABEL[sev]}: {summary.severityCounts[sev]}
                  </span>
                ))}
              </dd>
            </div>

            <div className="rounded-md border border-line bg-surface-low p-3">
              <dt className="text-xs font-semibold uppercase text-ink-3">
                By follow-up type
              </dt>
              <dd className="mt-1 space-y-0.5 text-xs text-ink-2">
                {FOLLOW_UP_TYPES.map((fut) => (
                  <span key={fut} className="block">
                    {FOLLOW_UP_LABEL[fut]}: {summary.followUpTypeCounts[fut]}
                  </span>
                ))}
              </dd>
            </div>

            <SummaryTile
              label="Governance-sensitive items"
              value={summary.governanceSensitiveCount}
            />
          </dl>

          {/* Safety / evidence flags */}
          <div
            className="mt-3 rounded-md border border-line bg-white p-3"
            aria-label="Safety and evidence flags summary"
          >
            <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
              <SafetyFlag
                label="allPiiExcluded"
                value={summary.allPiiExcluded}
              />
              <SafetyFlag
                label="allNonApprovalConfirmed"
                value={summary.allNonApprovalConfirmed}
              />
              <span className="font-mono text-xs text-ink-2">
                officialEvidenceCount: {summary.officialEvidenceCount}
              </span>
              <span className="font-mono text-xs text-ink-2">
                approvalCollectedCount: {summary.approvalCollectedCount}
              </span>
              <span className="font-mono text-xs text-ink-2">
                persistedCount: {summary.persistedCount}
              </span>
              <span className="font-mono text-xs text-ink-2">
                exportedCount: {summary.exportedCount}
              </span>
              <span className="font-mono text-xs text-ink-2">
                notifiedCount: {summary.notifiedCount}
              </span>
              </div>
          </div>
        </div>
      )}

      {/* --- Empty state --- */}
      {showEmptyState && (
        <div
          className="rounded-md border border-dashed border-line bg-surface-low p-4 text-sm text-ink-2"
          aria-label="Feedback synthesis preview empty state"
        >
          <p className="font-semibold text-ink-1">{EMPTY_STATE_HEADING}</p>
          <p className="mt-1 whitespace-pre-line">{EMPTY_STATE_BODY}</p>
        </div>
      )}

      {/* --- Item list --- */}
      {showItemList && (
        <div
          className="space-y-6"
          aria-label="Feedback synthesis items grouped by severity"
        >
          {groups.map((group) => (
            <section
              key={group.key}
              className="space-y-3"
              aria-label={group.label}
            >
              <h3 className="text-base font-semibold text-ink-1">
                {group.label}
              </h3>

              {group.key === "gov" && (
                <div
                  className="rounded-md border border-red-200 bg-red-50 p-4"
                  role="note"
                  aria-label="Governance-sensitive section preamble"
                >
                  <p className="font-semibold text-red-800">
                    {GOV_SECTION_PREAMBLE}
                  </p>
                  <p className="mt-1 whitespace-pre-line text-sm text-red-700">
                    {GOV_SECTION_COPY}
                  </p>
                </div>
              )}

              <div
                className="space-y-3"
                aria-label={`${group.label} items`}
              >
                {group.items.map((item) => (
                  <article
                    key={item.synthesisId}
                    className={`rounded-md border p-4 ${
                      group.key === "gov"
                        ? "border-red-200 bg-red-50"
                        : "border-line bg-surface-low"
                    }`}
                    aria-label={`Feedback synthesis item ${item.synthesisId}`}
                  >
                    <div className="space-y-3">
                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            SEVERITY_CLASS[item.severity]
                          }`}
                          aria-label={`Severity: ${SEVERITY_LABEL[item.severity]}`}
                        >
                          {SEVERITY_LABEL[item.severity]}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink-2 ring-1 ring-line">
                          {THEME_LABEL[item.themeCategory]}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink-2 ring-1 ring-line">
                          {FOLLOW_UP_LABEL[item.suggestedFollowUpType]}
                        </span>
                      </div>

                      {/* Summary */}
                      <div>
                        <h4 className="text-sm font-semibold text-ink-1">
                          {item.summary}
                        </h4>
                        <p className="mt-1 text-xs text-ink-3">
                          {ITEM_SECTION_COPY}
                        </p>
                      </div>

                      {/* Detail fields */}
                      <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <SafeField
                          label="Synthesis ID"
                          value={item.synthesisId}
                        />
                        <SafeField
                          label="Source session"
                          value={item.sourceSessionId}
                        />
                        <SafeField
                          label="Affected section"
                          value={SECTION_LABEL[item.affectedSection]}
                        />
                      </dl>

                      {/* Safety flags — all 8 visible; false values in red */}
                      <dl
                        className="grid grid-cols-2 gap-2 rounded-md border border-line bg-white p-3 text-xs sm:grid-cols-4"
                        aria-label={`Safety flags for ${item.synthesisId}`}
                      >
                        <SafetyFlag
                          label="piiExcluded"
                          value={item.piiExcluded}
                        />
                        <SafetyFlag
                          label="nonApprovalConfirmed"
                          value={item.nonApprovalConfirmed}
                        />
                        <SafetyFlag
                          label="officialEvidence"
                          value={item.officialEvidence}
                        />
                        <SafetyFlag
                          label="approvalCollected"
                          value={item.approvalCollected}
                        />
                        <SafetyFlag
                          label="persisted"
                          value={item.persisted}
                        />
                        <SafetyFlag
                          label="exported"
                          value={item.exported}
                        />
                        <SafetyFlag
                          label="notified"
                          value={item.notified}
                        />
                        <SafetyFlag label="isMock" value={item.isMock} />
                      </dl>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </section>
  );
}

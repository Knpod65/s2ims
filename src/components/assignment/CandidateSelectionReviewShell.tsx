import React, { useMemo, useState } from "react";
import type { CombinedCandidatePoolItem } from "@/lib/assignment";
import {
  CandidateReviewState,
  CandidateReviewAction,
  createCandidateReviewStateTransition,
} from "@/lib/assignment/candidateReviewState";
import {
  buildCandidateReviewAuditNoopPreview,
  type CandidateReviewAuditNoopWiringResult,
} from "@/lib/assignment/candidateReviewAuditNoopWiring";

export type CandidateSelectionReviewShellProps = {
  candidates: CombinedCandidatePoolItem[];
  title?: string;
  description?: string;
  readonly?: boolean;
};

const warningCopy =
  "Suggested candidates are workflow suggestions only. Selecting or reviewing a candidate does not approve a scholarship, assign a person, or collect AP-10B approval.";

const runtimeWarningCopy =
  "Review actions are local UI signals only. They do not assign, approve, reject scholarships, persist data, or collect AP-10B approvals.";

const auditPreviewWarningCopy =
  "Audit preview is diagnostic only. It is not saved, not submitted, not official evidence, and not an approval or assignment.";

const previewSafetyBadges = [
  "Not saved",
  "Not submitted",
  "Not official evidence",
  "Not an approval",
  "Not an assignment",
  "Local UI signal only",
];

function formatLabel(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatContextList(contexts: string[]): string {
  if (contexts.length === 0) return "No context";
  return contexts.map(formatLabel).join(", ");
}

function formatStateLabel(s: CandidateReviewState) {
  return s
    .split("_")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

export default function CandidateSelectionReviewShell({
  candidates,
  title = "Candidate Selection Review",
  description = "Review safe advisor and staff candidate suggestions from the combined candidate pool.",
  readonly = true,
}: CandidateSelectionReviewShellProps) {
  const advisorCount = candidates.filter(
    (candidate) => candidate.poolType === "advisor"
  ).length;
  const staffCount = candidates.filter(
    (candidate) => candidate.poolType === "staff"
  ).length;

  // Local-only review state map: candidateId -> CandidateReviewState
  const initialMap = useMemo(
    () =>
      Object.fromEntries(
        candidates.map((c) => [c.candidateId, "not_reviewed" as CandidateReviewState])
      ),
    [candidates]
  );
  const [reviewStateMap, setReviewStateMap] = useState<Record<string, CandidateReviewState>>(initialMap);
  const [auditPreview, setAuditPreview] = useState<CandidateReviewAuditNoopWiringResult | null>(null);

  function applyAction(
    candidateId: string,
    action: CandidateReviewAction,
    candidate: CombinedCandidatePoolItem,
    safeReasonCode?: string
  ) {
    const prev = reviewStateMap[candidateId] ?? ("not_reviewed" as CandidateReviewState);
    const transition = createCandidateReviewStateTransition({
      candidateId,
      previousState: prev,
      actionType: action,
      safeReasonCode,
    });
    setReviewStateMap((s) => ({ ...s, [candidateId]: transition.nextState }));
    try {
      const preview = buildCandidateReviewAuditNoopPreview({
        transition,
        poolType: candidate.poolType,
        roleCategory: candidate.roleCategory,
        actorRole: "system_preview",
        workflowContext: "candidate_review",
      });
      setAuditPreview(preview);
    } catch {
      setAuditPreview(null);
    }
  }

  return (
    <section className="space-y-4 rounded-lg border border-line bg-white p-4 shadow-card">
      <div className="space-y-2">
        <div>
          <p className="text-xs font-semibold uppercase text-ink-3">
            S²IMS MC6 UI Shell
          </p>
          <h2 className="text-lg font-semibold text-ink-1">{title}</h2>
          <p className="mt-1 text-sm text-ink-2">{description}</p>
        </div>
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          {warningCopy}
          <p className="mt-2 font-semibold">
            No candidate is auto-assigned. Nothing is selected by default.
          </p>
          <p className="mt-2 text-sm text-amber-900">{runtimeWarningCopy}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile label="Total candidates" value={candidates.length} />
        <SummaryTile label="Advisor candidates" value={advisorCount} />
        <SummaryTile label="Staff candidates" value={staffCount} />
        <SummaryTile label="Auto-assigned" value={0} />
      </div>

      {candidates.length === 0 ? (
        <div className="rounded-md border border-dashed border-line bg-surface-low p-4 text-sm text-ink-2">
          No suggested candidates are available for review. Nothing is selected
          by default.
        </div>
      ) : (
        <div className="grid gap-3">
          {candidates.map((candidate) => {
            const state = reviewStateMap[candidate.candidateId] ?? "not_reviewed";
            return (
              <article
                key={candidate.candidateId}
                className="rounded-md border border-line bg-surface-low p-4"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-role-tint px-2.5 py-1 text-xs font-semibold uppercase text-role">
                        {candidate.poolType}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink-2 ring-1 ring-line">
                        {formatLabel(candidate.status)}
                      </span>
                      <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink-2 ring-1 ring-line">
                        {candidate.isMock ? "Mock suggestion" : "Suggestion"}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-semibold text-ink-1">
                        {candidate.displayName}
                      </h3>
                      <p className="text-sm text-ink-2">{candidate.roleLabel}</p>
                    </div>

                    <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                      <SafeField label="Role category" value={formatLabel(candidate.roleCategory)} />
                      <SafeField label="Unit/department" value={candidate.unitOrDepartment} />
                      <SafeField label="Assignment contexts" value={formatContextList(candidate.assignmentContexts)} />
                      <SafeField label="Confidence" value={formatLabel(candidate.confidence)} />
                      <SafeField label="Privacy level" value={formatLabel(candidate.privacyLevel)} />
                      {candidate.officialEmail ? (
                        <SafeField label="Official email" value={candidate.officialEmail} />
                      ) : null}
                    </dl>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2 items-center">
                    <span className="rounded-full bg-surface-low px-2 py-1 text-xs text-ink-3 ring-1 ring-line">
                      {formatStateLabel(state)}
                    </span>

                    {readonly ? (
                      <>
                        <ShellButton label="Review" readonly={readonly} />
                        <ShellButton label="Shortlist" readonly={readonly} />
                        <ShellButton label="Skip" readonly={readonly} />
                      </>
                    ) : (
                      <>
                        <ActionButton label="Shortlist" onClick={() => applyAction(candidate.candidateId, "shortlist_candidate", candidate)} />
                        <ActionButton label="Skip" onClick={() => applyAction(candidate.candidateId, "skip_candidate", candidate)} />
                        <ActionButton label="Needs more context" onClick={() => applyAction(candidate.candidateId, "request_more_context", candidate)} />
                        <ActionButton label="Reject for assignment" onClick={() => applyAction(candidate.candidateId, "reject_for_assignment", candidate)} />
                        <ActionButton label="Select for review" onClick={() => applyAction(candidate.candidateId, "manually_select_candidate", candidate)} />
                        <ActionButton label="Clear" onClick={() => applyAction(candidate.candidateId, "clear_review_state", candidate)} />
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <div
        className="space-y-3 rounded-md border border-line bg-surface-low p-4"
        aria-live="polite"
        aria-label="Diagnostic preview status"
      >
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">Diagnostic preview</p>
          <p className="mt-1">{auditPreviewWarningCopy}</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-wide">
            Local UI signal only
          </p>
          <div className="mt-3 flex flex-wrap gap-2" aria-label="Diagnostic preview safety labels">
            {previewSafetyBadges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
        {auditPreview ? (
          <div className="space-y-2">
            <div>
              <h3 className="text-sm font-semibold text-ink-1">Diagnostic preview</h3>
              <p className="mt-1 text-xs text-ink-3">
                These flags confirm that no data was persisted, no audit was written, and no official evidence was created.
              </p>
            </div>
            <dl className="grid gap-1 text-sm sm:grid-cols-2">
              <PreviewField label="Event" value={auditPreview.event.eventName} />
              <PreviewField label="Pool type" value={auditPreview.event.poolType} />
              <PreviewField label="Role category" value={auditPreview.event.roleCategory} />
              <PreviewField label="Workflow context" value={auditPreview.event.workflowContext} />
              <PreviewField label="Previous state" value={auditPreview.event.previousReviewState} />
              <PreviewField label="Next state" value={auditPreview.event.nextReviewState} />
              {auditPreview.event.safeReasonCode ? (
                <PreviewField label="Reason code" value={auditPreview.event.safeReasonCode} />
              ) : null}
              <PreviewField label="Mode" value={auditPreview.mode} />
              <PreviewField label="persisted: false" value={String(auditPreview.persisted)} />
              <PreviewField label="written: false" value={String(auditPreview.written)} />
              <PreviewField label="exported: false" value={String(auditPreview.exported)} />
              <PreviewField label="notified: false" value={String(auditPreview.notified)} />
              <PreviewField label="officialEvidence: false" value={String(auditPreview.officialEvidence)} />
              <PreviewField label="diagnosticOnly: true" value={String(auditPreview.diagnosticOnly)} />
              <PreviewField label="discardedAfterPreview: true" value={String(auditPreview.discardedAfterPreview)} />
            </dl>
            <p className="text-xs text-ink-3">{auditPreview.message}</p>
            <button
              type="button"
              onClick={() => setAuditPreview(null)}
              className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-1 hover:bg-surface-hover"
              title="Removes the preview from your local browser state. No data is deleted from the server."
            >
              Clear diagnostic preview
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink-2">
            No diagnostic preview has been generated. Review actions remain local UI signals only.
          </p>
        )}
      </div>
    </section>
  );
}

function SummaryTile({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-line bg-surface-low p-3">
      <p className="text-xs font-semibold uppercase text-ink-3">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-ink-1">{value}</p>
    </div>
  );
}

function SafeField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-ink-3">{label}</dt>
      <dd className="mt-0.5 break-words text-ink-1">{value}</dd>
    </div>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-ink-3">{label}</dt>
      <dd className="mt-0.5 break-words text-ink-1">{value}</dd>
    </div>
  );
}

function ShellButton({ label, readonly }: { label: string; readonly: boolean }) {
  return (
    <button
      type="button"
      disabled
      aria-disabled="true"
      className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-3 opacity-70"
      title={
        readonly
          ? "Review actions are disabled in the MC6 UI shell."
          : "Action wiring is outside MC6 scope."
      }
    >
      {label}
    </button>
  );
}

function ActionButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-1 hover:bg-surface-hover"
    >
      {label}
    </button>
  );
}

import type { CombinedCandidatePoolItem } from "@/lib/assignment";

export type CandidateSelectionReviewShellProps = {
  candidates: CombinedCandidatePoolItem[];
  title?: string;
  description?: string;
  readonly?: boolean;
};

const warningCopy =
  "Suggested candidates are workflow suggestions only. Selecting or reviewing a candidate does not approve a scholarship, assign a person, or collect AP-10B approval.";

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
          {candidates.map((candidate) => (
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

                <div className="flex shrink-0 flex-wrap gap-2">
                  <ShellButton label="Review" readonly={readonly} />
                  <ShellButton label="Shortlist" readonly={readonly} />
                  <ShellButton label="Skip" readonly={readonly} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
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

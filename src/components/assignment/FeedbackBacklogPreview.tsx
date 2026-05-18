import type {
  DemoFeedbackBacklogItem,
  DemoFeedbackBacklogSamplesSummary,
} from "@/lib/assignment";
import {
  createDemoFeedbackBacklogSamples,
  summarizeDemoFeedbackBacklogSamples,
} from "@/lib/assignment";

export type FeedbackBacklogPreviewProps = {
  title?: string;
  description?: string;
  items?: DemoFeedbackBacklogItem[];
  readonly?: boolean;
};

const safetyLabels = [
  "Read-only planning preview",
  "Uses safe mock sample data only",
  "Not saved",
  "Not submitted",
  "Not official evidence",
  "Not an approval",
  "Not an assignment",
  "No AP-10B gate change",
];

const boundaryCopy =
  "Feedback backlog preview items are mock planning artifacts only. They are not approvals, assignments, scholarship decisions, AP-10B evidence, authority verification, production readiness approval, or official audit evidence.";

const emptyStateCopy =
  "No demo feedback backlog preview items are available. This preview uses safe mock sample data only and does not collect or save feedback.";

function formatLabel(value: string): string {
  return value
    .split("_")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function summarizeItems(items: DemoFeedbackBacklogItem[]): DemoFeedbackBacklogSamplesSummary {
  const categories = Array.from(new Set(items.map((item) => item.category)));
  const priorities = Array.from(new Set(items.map((item) => item.priority)));
  const governanceSensitiveCount = items.filter(
    (item) => item.ap10bImpact === "governance_sensitive"
  ).length;

  return {
    total: items.length,
    categories,
    priorities,
    governanceSensitiveCount,
    nonApprovalConfirmed: true,
    officialEvidence: false,
    approvalCollected: false,
    persisted: false,
    exported: false,
    notified: false,
    planningOnly: true,
  };
}

function groupItemsByCategory(items: DemoFeedbackBacklogItem[]) {
  return items.reduce<Record<string, DemoFeedbackBacklogItem[]>>((groups, item) => {
    const group = groups[item.category] ?? [];
    return {
      ...groups,
      [item.category]: [...group, item],
    };
  }, {});
}

export default function FeedbackBacklogPreview({
  title = "Demo feedback backlog preview",
  description = "Read-only planning preview of safe mock feedback backlog sample items.",
  items,
  readonly = true,
}: FeedbackBacklogPreviewProps) {
  const backlogItems = items ?? createDemoFeedbackBacklogSamples();
  const summary = items ? summarizeItems(backlogItems) : summarizeDemoFeedbackBacklogSamples();
  const groupedItems = groupItemsByCategory(backlogItems);
  const safetyConcernCount = backlogItems.filter((item) => item.safetyConcern).length;

  return (
    <section
      className="space-y-4 rounded-lg border border-line bg-white p-4 shadow-card"
      aria-label="Read-only demo feedback backlog preview"
    >
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase text-ink-3">
          S²IMS MC31 Preview Runtime
        </p>
        <h2 className="text-lg font-semibold text-ink-1">{title}</h2>
        <p className="text-sm text-ink-2">{description}</p>
      </div>

      <div
        className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
        aria-label="Feedback backlog preview safety boundary"
      >
        <p className="font-semibold">Read-only planning preview</p>
        <p className="mt-1">{boundaryCopy}</p>
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Preview safety labels">
          {safetyLabels.map((label) => (
            <span
              key={label}
              className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-amber-900 ring-1 ring-amber-200"
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      <dl
        className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5"
        aria-label="Feedback backlog preview summary"
      >
        <SummaryTile label="Total items" value={summary.total} />
        <SummaryTile label="Safety concerns" value={safetyConcernCount} />
        <SummaryTile label="Governance-sensitive" value={summary.governanceSensitiveCount} />
        <SummaryTile label="Categories" value={summary.categories.length} />
        <SummaryTile label="Priorities" value={summary.priorities.length} />
      </dl>

      {backlogItems.length === 0 ? (
        <div
          className="rounded-md border border-dashed border-line bg-surface-low p-4 text-sm text-ink-2"
          aria-label="Feedback backlog preview empty state"
        >
          {emptyStateCopy}
        </div>
      ) : (
        <div className="space-y-4" aria-label="Feedback backlog items grouped by category">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <section key={category} className="space-y-3" aria-label={`${formatLabel(category)} backlog group`}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-ink-1">{formatLabel(category)}</h3>
                <span className="rounded-full bg-surface-low px-2.5 py-1 text-xs font-semibold text-ink-3 ring-1 ring-line">
                  {categoryItems.length} item{categoryItems.length === 1 ? "" : "s"}
                </span>
              </div>
              <div className="grid gap-3">
                {categoryItems.map((item) => (
                  <article
                    key={item.backlogId}
                    className="rounded-md border border-line bg-surface-low p-4"
                    aria-label={`Read-only backlog item ${item.backlogId}`}
                  >
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-role-tint px-2.5 py-1 text-xs font-semibold text-role">
                          {formatLabel(item.priority)}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink-2 ring-1 ring-line">
                          {formatLabel(item.status)}
                        </span>
                        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-semibold text-ink-2 ring-1 ring-line">
                          {item.safetyConcern ? "Safety concern: true" : "Safety concern: false"}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-semibold text-ink-1">{item.summary}</h4>
                        <p className="mt-1 text-xs text-ink-3">
                          Mock planning item only. No feedback is collected or saved.
                        </p>
                      </div>

                      <dl className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                        <SafeField label="Backlog ID" value={item.backlogId} />
                        <SafeField label="Source session" value={item.sourceSessionId} />
                        <SafeField label="Stakeholder group" value={formatLabel(item.stakeholderGroup)} />
                        <SafeField label="Category" value={formatLabel(item.category)} />
                        <SafeField label="Priority" value={formatLabel(item.priority)} />
                        <SafeField label="Proposed branch type" value={formatLabel(item.proposedBranchType)} />
                        <SafeField label="AP-10B impact" value={formatLabel(item.ap10bImpact)} />
                        <SafeField label="Planning status" value={formatLabel(item.status)} />
                        <SafeField label="Read-only" value={readonly ? "true" : "true"} />
                      </dl>

                      <dl
                        className="grid gap-2 rounded-md border border-line bg-white p-3 text-sm sm:grid-cols-2 lg:grid-cols-4"
                        aria-label={`Safety flags for ${item.backlogId}`}
                      >
                        <SafetyFlag label="nonApprovalConfirmed" value={item.nonApprovalConfirmed} />
                        <SafetyFlag label="isMock" value={item.isMock} />
                        <SafetyFlag label="officialEvidence" value={item.officialEvidence} />
                        <SafetyFlag label="approvalCollected" value={item.approvalCollected} />
                        <SafetyFlag label="persisted" value={item.persisted} />
                        <SafetyFlag label="exported" value={item.exported} />
                        <SafetyFlag label="notified" value={item.notified} />
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
  return (
    <div>
      <dt className="text-xs font-semibold uppercase text-ink-3">{label}</dt>
      <dd className="mt-0.5 font-mono text-xs text-ink-1">
        {label}: {String(value)}
      </dd>
    </div>
  );
}

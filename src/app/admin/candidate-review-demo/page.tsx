import {
  createCandidateReviewDemoCandidates,
  assertSafeCandidateReviewDemoData,
} from "@/lib/assignment/candidateReviewDemoData";
import CandidateSelectionReviewShell from "@/components/assignment/CandidateSelectionReviewShell";
import { FeedbackBacklogPreview } from "@/components/assignment";

export default function CandidateReviewDemoPage() {
  const candidates = createCandidateReviewDemoCandidates();
  assertSafeCandidateReviewDemoData(candidates);

  return (
    <main className="space-y-8 p-6">
      <header aria-label="Demo page header">
        <h1 className="text-2xl font-semibold text-ink-1">
          Candidate Review Demo — Combined Preview
        </h1>
        <p className="mt-1 text-sm text-ink-2">Read-only combined demo preview.</p>
      </header>

      <div
        role="note"
        aria-label="Demo notice"
        className="rounded border border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-900"
      >
        <p className="font-semibold">
          Demo only. Diagnostic preview only. Uses safe mock data.
        </p>
        <p>No real student or personnel data.</p>
        <p>Not saved. Not submitted. Not official evidence.</p>
        <p>Not an approval. Not an assignment. Not a scholarship decision.</p>
        <p className="mt-2">
          This page is a read-only demo using safe mock data only. It does not save. It does not submit. It does not approve. It does not assign. It does not export. It does not notify. It does not create official evidence. It is not AP-10B evidence and does not change governance status.
        </p>
      </div>

      <section aria-label="Candidate review diagnostic preview section">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink-1">
            Candidate Review Diagnostic Preview
          </h2>
          <p className="mt-1 text-sm text-ink-2">
            Local review signal only. No scholarship decision. No candidate assignment.
          </p>
        </div>
        <CandidateSelectionReviewShell
          candidates={candidates}
          title="Candidate Review — Diagnostic Preview Demo"
          description="Demo only. Uses safe mock data. Not an official workflow. Not saved. Not official evidence."
          readonly={true}
        />
      </section>

      <section aria-label="Feedback backlog preview section">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-ink-1">Feedback Backlog Preview</h2>
          <p className="mt-1 text-sm text-ink-2">
            Planning preview only. Mock backlog items only. No feedback collection. No production backlog.
          </p>
        </div>
        <FeedbackBacklogPreview
          title="Demo backlog preview"
          description="Safe mock data only. Read-only. Not saved. Not submitted. Not official evidence. Not approval. Not assignment. Not AP-10B evidence. No real stakeholder/student/personnel data."
        />
      </section>
    </main>
  );
}

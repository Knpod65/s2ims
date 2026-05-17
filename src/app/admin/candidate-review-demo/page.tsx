import {
  createCandidateReviewDemoCandidates,
  assertSafeCandidateReviewDemoData,
} from "@/lib/assignment/candidateReviewDemoData";
import CandidateSelectionReviewShell from "@/components/assignment/CandidateSelectionReviewShell";

export default function CandidateReviewDemoPage() {
  const candidates = createCandidateReviewDemoCandidates();
  assertSafeCandidateReviewDemoData(candidates);

  return (
    <main className="p-6">
      <div
        role="note"
        aria-label="Demo notice"
        className="mb-6 rounded border border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-900"
      >
        <p className="font-semibold">
          Demo only. Diagnostic preview only. Uses safe mock data.
        </p>
        <p>No real student or personnel data.</p>
        <p>Not saved. Not submitted. Not official evidence.</p>
        <p>Not an approval. Not an assignment. Not a scholarship decision.</p>
      </div>
      <CandidateSelectionReviewShell
        candidates={candidates}
        title="Candidate Review — Diagnostic Preview Demo"
        description="Demo only. Uses safe mock data. Not an official workflow. Not saved. Not official evidence."
        readonly={true}
      />
    </main>
  );
}

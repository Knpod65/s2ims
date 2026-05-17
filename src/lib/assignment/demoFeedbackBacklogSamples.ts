import type {
  DemoFeedbackBacklogInput,
  DemoFeedbackBacklogItem,
  DemoFeedbackCategory,
  DemoFeedbackPriority,
} from "./demoFeedbackBacklog";
import {
  assertSafeDemoFeedbackBacklogItem,
  createDemoFeedbackBacklogItems,
} from "./demoFeedbackBacklog";

export type DemoFeedbackBacklogSamplesSummary = {
  total: number;
  categories: DemoFeedbackCategory[];
  priorities: DemoFeedbackPriority[];
  governanceSensitiveCount: number;
  nonApprovalConfirmed: true;
  officialEvidence: false;
  approvalCollected: false;
  persisted: false;
  exported: false;
  notified: false;
  planningOnly: true;
};

const REQUIRED_SAMPLE_CATEGORIES: DemoFeedbackCategory[] = [
  "ux_clarity",
  "copy_content",
  "accessibility",
  "privacy_pdpa",
  "workflow_understanding",
  "training_readiness",
  "risk_concern",
  "future_enhancement",
  "out_of_scope_governance",
];

export const DEMO_FEEDBACK_BACKLOG_SAMPLE_INPUTS: DemoFeedbackBacklogInput[] = [
  {
    sourceSessionId: "demo-session-001",
    stakeholderGroup: "scholarship_staff_group",
    category: "ux_clarity",
    summary: "Clarify that diagnostic preview is not retained.",
    safetyConcern: false,
    proposedBranchType: "copy_polish_runtime",
    ap10bImpact: "none",
    nonApprovalConfirmed: true,
  },
  {
    sourceSessionId: "demo-session-001",
    stakeholderGroup: "admin_demo_review_group",
    category: "copy_content",
    summary: "Improve copy explaining local review signal.",
    safetyConcern: false,
    proposedBranchType: "copy_polish_docs",
    ap10bImpact: "none",
    nonApprovalConfirmed: true,
  },
  {
    sourceSessionId: "demo-session-001",
    stakeholderGroup: "accessibility_review_group",
    category: "accessibility",
    summary: "Add clearer keyboard focus guidance for demo review.",
    safetyConcern: true,
    proposedBranchType: "accessibility_polish_runtime",
    ap10bImpact: "none",
    nonApprovalConfirmed: true,
  },
  {
    sourceSessionId: "demo-session-002",
    stakeholderGroup: "privacy_review_group",
    category: "privacy_pdpa",
    summary: "Clarify that mock data contains no real records.",
    safetyConcern: true,
    proposedBranchType: "privacy_wording_clarification",
    ap10bImpact: "none",
    nonApprovalConfirmed: true,
  },
  {
    sourceSessionId: "demo-session-002",
    stakeholderGroup: "advisor_review_group",
    category: "workflow_understanding",
    summary: "Explain false flags in simpler wording.",
    safetyConcern: false,
    proposedBranchType: "future_planning_doc",
    ap10bImpact: "none",
    nonApprovalConfirmed: true,
  },
  {
    sourceSessionId: "demo-session-002",
    stakeholderGroup: "scholarship_staff_group",
    category: "training_readiness",
    summary: "Add training note for demo facilitators.",
    safetyConcern: false,
    proposedBranchType: "training_doc_update",
    ap10bImpact: "none",
    nonApprovalConfirmed: true,
  },
  {
    sourceSessionId: "demo-session-003",
    stakeholderGroup: "admin_demo_review_group",
    category: "risk_concern",
    summary: "Review concern about wording that may imply readiness.",
    safetyConcern: true,
    proposedBranchType: "copy_polish_runtime",
    ap10bImpact: "none",
    nonApprovalConfirmed: true,
  },
  {
    sourceSessionId: "demo-session-003",
    stakeholderGroup: "advisor_review_group",
    category: "future_enhancement",
    summary: "Consider future layout polish for backlog grouping.",
    safetyConcern: false,
    proposedBranchType: "future_planning_doc",
    ap10bImpact: "none",
    nonApprovalConfirmed: true,
  },
  {
    sourceSessionId: "demo-session-003",
    stakeholderGroup: "privacy_review_group",
    category: "out_of_scope_governance",
    summary: "Governance-sensitive comment requires separate planning review.",
    safetyConcern: true,
    proposedBranchType: "no_branch",
    ap10bImpact: "governance_sensitive",
    nonApprovalConfirmed: true,
  },
];

export function createDemoFeedbackBacklogSamples(): DemoFeedbackBacklogItem[] {
  const items = createDemoFeedbackBacklogItems(DEMO_FEEDBACK_BACKLOG_SAMPLE_INPUTS);
  assertSafeDemoFeedbackBacklogSamples(items);
  return items;
}

export function assertSafeDemoFeedbackBacklogSamples(items: DemoFeedbackBacklogItem[]): void {
  if (items.length !== DEMO_FEEDBACK_BACKLOG_SAMPLE_INPUTS.length) {
    throw new Error("Demo feedback backlog sample count mismatch");
  }

  const categories = new Set(items.map((item) => item.category));
  const missingCategory = REQUIRED_SAMPLE_CATEGORIES.find((category) => !categories.has(category));
  if (missingCategory) {
    throw new Error(`Missing demo feedback backlog sample category: ${missingCategory}`);
  }

  items.forEach((item) => assertSafeDemoFeedbackBacklogItem(item));
}

export function summarizeDemoFeedbackBacklogSamples(): DemoFeedbackBacklogSamplesSummary {
  const samples = createDemoFeedbackBacklogSamples();
  const categories = Array.from(new Set(samples.map((item) => item.category)));
  const priorities = Array.from(new Set(samples.map((item) => item.priority)));
  const governanceSensitiveCount = samples.filter(
    (item) => item.ap10bImpact === "governance_sensitive"
  ).length;

  return {
    total: samples.length,
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

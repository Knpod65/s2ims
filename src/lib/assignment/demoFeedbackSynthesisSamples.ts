import type {
  DemoFeedbackSynthesisInput,
  DemoFeedbackSynthesisItem,
  DemoFeedbackSynthesisThemeCategory,
  DemoFeedbackSynthesisSummary,
} from "./demoFeedbackSynthesis";
import {
  assertSafeDemoFeedbackSynthesisItem,
  createDemoFeedbackSynthesisItems,
  summarizeDemoFeedbackSynthesisItems,
} from "./demoFeedbackSynthesis";

export type DemoFeedbackSynthesisSamplesSummary = {
  total: number;
  themeCategoryCovered: DemoFeedbackSynthesisThemeCategory[];
  governanceSensitiveCount: number;
  allPiiExcluded: true;
  allNonApprovalConfirmed: true;
  officialEvidenceCount: 0;
  approvalCollectedCount: 0;
  persistedCount: 0;
  exportedCount: 0;
  notifiedCount: 0;
  planningOnly: true;
};

const REQUIRED_SAMPLE_CATEGORIES: DemoFeedbackSynthesisThemeCategory[] = [
  "clarity_copy",
  "layout_navigation",
  "accessibility",
  "privacy_pdpa",
  "workflow_understanding",
  "training_support",
  "stakeholder_confusion_risk",
  "governance_sensitive",
  "out_of_scope",
];

export const DEMO_FEEDBACK_SYNTHESIS_SAMPLE_INPUTS: DemoFeedbackSynthesisInput[] = [
  {
    sessionId: "demo-session-syn-001",
    reviewerCategory: "candidate_review_group",
    sectionReviewed: "general_demo",
    feedbackTheme: "Clarify copy wording for the preview feature.",
    confusionRisk: "low priority note",
    suggestedFollowUp: "docs_copy_update",
    governanceSensitive: false,
    nonApprovalConfirmed: true,
  },
  {
    sessionId: "demo-session-syn-002",
    reviewerCategory: "ux_review_group",
    sectionReviewed: "combined_route",
    feedbackTheme: "Improve the layout and navigation between sections.",
    confusionRisk: "visual spacing note",
    suggestedFollowUp: "ux_hardening_plan",
    governanceSensitive: false,
    nonApprovalConfirmed: true,
  },
  {
    sessionId: "demo-session-syn-003",
    reviewerCategory: "accessibility_review_group",
    sectionReviewed: "combined_route",
    feedbackTheme: "Add keyboard focus guidance for demo users.",
    confusionRisk: "accessibility note",
    suggestedFollowUp: "accessibility_plan",
    governanceSensitive: false,
    nonApprovalConfirmed: true,
  },
  {
    sessionId: "demo-session-syn-004",
    reviewerCategory: "privacy_review_group",
    sectionReviewed: "general_demo",
    feedbackTheme: "Clarify that mock data contains no real records.",
    confusionRisk: "data boundary note",
    suggestedFollowUp: "demo_route_copy_polish",
    governanceSensitive: false,
    nonApprovalConfirmed: true,
  },
  {
    sessionId: "demo-session-syn-005",
    reviewerCategory: "workflow_review_group",
    sectionReviewed: "candidate_review_preview",
    feedbackTheme: "Explain the workflow process for false safety flags.",
    confusionRisk: "process clarity note",
    suggestedFollowUp: "docs_copy_update",
    governanceSensitive: false,
    nonApprovalConfirmed: true,
  },
  {
    sessionId: "demo-session-syn-006",
    reviewerCategory: "training_review_group",
    sectionReviewed: "feedback_backlog_preview",
    feedbackTheme: "Add facilitator training walkthrough content.",
    confusionRisk: "support readiness note",
    suggestedFollowUp: "walkthrough_update",
    governanceSensitive: false,
    nonApprovalConfirmed: true,
  },
  {
    sessionId: "demo-session-syn-007",
    reviewerCategory: "risk_review_group",
    sectionReviewed: "feedback_backlog_preview",
    feedbackTheme: "Reduce confusion between demo and production backlog.",
    confusionRisk: "boundary alert note",
    suggestedFollowUp: "docs_copy_update",
    governanceSensitive: false,
    nonApprovalConfirmed: true,
  },
  {
    sessionId: "demo-session-syn-008",
    reviewerCategory: "governance_review_group",
    sectionReviewed: "general_demo",
    feedbackTheme: "Escalate governance blocker for separate planning review.",
    confusionRisk: "governance planning signal",
    suggestedFollowUp: "governance_escalation_plan",
    governanceSensitive: true,
    nonApprovalConfirmed: true,
  },
  {
    sessionId: "demo-session-syn-009",
    reviewerCategory: "general_review_group",
    sectionReviewed: "general_demo",
    feedbackTheme: "Request is unrelated and out of scope.",
    confusionRisk: "scope boundary note",
    suggestedFollowUp: "no_action",
    governanceSensitive: false,
    nonApprovalConfirmed: true,
  },
];

export function createDemoFeedbackSynthesisSamples(): DemoFeedbackSynthesisItem[] {
  const items = createDemoFeedbackSynthesisItems(DEMO_FEEDBACK_SYNTHESIS_SAMPLE_INPUTS);
  assertSafeDemoFeedbackSynthesisSamples(items);
  return items;
}

export function assertSafeDemoFeedbackSynthesisSamples(items: DemoFeedbackSynthesisItem[]): void {
  if (items.length !== DEMO_FEEDBACK_SYNTHESIS_SAMPLE_INPUTS.length) {
    throw new Error("Demo feedback synthesis sample count mismatch");
  }

  const categories = new Set(items.map((item) => item.themeCategory));
  const missingCategory = REQUIRED_SAMPLE_CATEGORIES.find((category) => !categories.has(category));
  if (missingCategory) {
    throw new Error(`Missing demo feedback synthesis sample category: ${missingCategory}`);
  }

  items.forEach((item) => assertSafeDemoFeedbackSynthesisItem(item));
}

export function summarizeDemoFeedbackSynthesisSamples(): DemoFeedbackSynthesisSamplesSummary {
  const samples = createDemoFeedbackSynthesisSamples();
  const themeCategoryCovered = Array.from(new Set(samples.map((item) => item.themeCategory))) as DemoFeedbackSynthesisThemeCategory[];
  const governanceSensitiveCount = samples.filter((item) => item.governanceSensitive).length;

  return {
    total: samples.length,
    themeCategoryCovered,
    governanceSensitiveCount,
    allPiiExcluded: true,
    allNonApprovalConfirmed: true,
    officialEvidenceCount: 0,
    approvalCollectedCount: 0,
    persistedCount: 0,
    exportedCount: 0,
    notifiedCount: 0,
    planningOnly: true,
  };
}

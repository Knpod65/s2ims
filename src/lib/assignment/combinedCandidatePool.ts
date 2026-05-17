import type {
  AdvisorCandidatePoolItem,
  AdvisorCandidatePoolBuildResult,
} from "./advisorCandidateGenerator";
import { assertSafeAdvisorCandidate } from "./advisorCandidateGenerator";
import type {
  StaffCandidatePoolItem,
  StaffCandidatePoolBuildResult,
} from "./staffCandidateGenerator";
import { assertSafeStaffCandidate } from "./staffCandidateGenerator";

export type CombinedCandidatePoolItem =
  | (AdvisorCandidatePoolItem & { poolType: "advisor" })
  | (StaffCandidatePoolItem & { poolType: "staff" });

export type CombinedCandidatePoolBuildResult = {
  items: CombinedCandidatePoolItem[];
  advisorCandidateCount: number;
  staffCandidateCount: number;
  candidateCount: number;
  autoAssignedCount: 0;
  unsafeRecordCount: number;
  poolTypes: Array<"advisor" | "staff">;
};

export function assertSafeCombinedCandidate(
  candidate: CombinedCandidatePoolItem
): void {
  const rec = candidate as Record<string, unknown>;
  if (rec["poolType"] !== "advisor" && rec["poolType"] !== "staff") {
    throw new Error("Unsafe combined candidate");
  }
  if (candidate.autoAssigned !== false) {
    throw new Error("Unsafe combined candidate");
  }
  if (candidate.isMock !== true) {
    throw new Error("Unsafe combined candidate");
  }
  if (candidate.status !== "suggested") {
    throw new Error("Unsafe combined candidate");
  }
  if (candidate.poolType === "advisor") {
    assertSafeAdvisorCandidate(candidate);
  } else {
    assertSafeStaffCandidate(candidate);
  }
}

export function combineCandidatePools(input: {
  advisorPool?: AdvisorCandidatePoolBuildResult;
  staffPool?: StaffCandidatePoolBuildResult;
}): CombinedCandidatePoolBuildResult {
  const advisorItems: Array<AdvisorCandidatePoolItem & { poolType: "advisor" }> =
    [];
  const staffItems: Array<StaffCandidatePoolItem & { poolType: "staff" }> = [];
  let unsafeRecordCount = 0;

  for (const item of input.advisorPool?.items ?? []) {
    const combined: AdvisorCandidatePoolItem & { poolType: "advisor" } = {
      ...item,
      poolType: "advisor",
    };
    assertSafeCombinedCandidate(combined);
    advisorItems.push(combined);
  }
  unsafeRecordCount += input.advisorPool?.unsafeRecordCount ?? 0;

  for (const item of input.staffPool?.items ?? []) {
    const combined: StaffCandidatePoolItem & { poolType: "staff" } = {
      ...item,
      poolType: "staff",
    };
    assertSafeCombinedCandidate(combined);
    staffItems.push(combined);
  }
  unsafeRecordCount += input.staffPool?.unsafeRecordCount ?? 0;

  const items: CombinedCandidatePoolItem[] = [...advisorItems, ...staffItems];

  const poolTypes: Array<"advisor" | "staff"> = [];
  if (input.advisorPool !== undefined) poolTypes.push("advisor");
  if (input.staffPool !== undefined) poolTypes.push("staff");

  return {
    items,
    advisorCandidateCount: advisorItems.length,
    staffCandidateCount: staffItems.length,
    candidateCount: items.length,
    autoAssignedCount: 0,
    unsafeRecordCount,
    poolTypes,
  };
}

export function filterCombinedCandidatesByPoolType(
  items: CombinedCandidatePoolItem[],
  poolType: "advisor" | "staff"
): CombinedCandidatePoolItem[] {
  return items.filter((item) => item.poolType === poolType);
}

export function summarizeCombinedCandidatePool(
  result: CombinedCandidatePoolBuildResult
): {
  candidateCount: number;
  advisorCandidateCount: number;
  staffCandidateCount: number;
  autoAssignedCount: 0;
  poolTypes: Array<"advisor" | "staff">;
} {
  return {
    candidateCount: result.candidateCount,
    advisorCandidateCount: result.advisorCandidateCount,
    staffCandidateCount: result.staffCandidateCount,
    autoAssignedCount: 0,
    poolTypes: result.poolTypes,
  };
}

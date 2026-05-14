// ---------------------------------------------------------------------------
// Audit Read Comparison Guards — AP-9F
// ---------------------------------------------------------------------------
// Centralized gating logic for read comparison eligibility.
// Evaluates feature flags, event presence, persistence mode safety,
// and metadata privacy rules.
// Does not throw for normal disabled/skipped states; returns structured result.
// ---------------------------------------------------------------------------

import type { AuditEvent } from '../auditTypes'
import { FORBIDDEN_AUDIT_METADATA_KEYS } from '../auditMetadataRules'
import type { AuditReadComparisonInput, AuditReadComparisonStatus } from './auditReadComparisonTypes'

// ---------------------------------------------------------------------------
// Guard result
// ---------------------------------------------------------------------------

export interface AuditReadComparisonGuardResult {
  allowed: boolean
  status: AuditReadComparisonStatus
  safeMessage: string
}

// ---------------------------------------------------------------------------
// PII-forbidden metadata keys for comparison (union with FORBIDDEN_AUDIT_METADATA_KEYS)
// ---------------------------------------------------------------------------

const COMPARISON_UNSAFE_METADATA_KEYS = new Set<string>([
  ...FORBIDDEN_AUDIT_METADATA_KEYS,
  'studentId',
  'rawStudentId',
  'nationalId',
  'email',
  'phone',
  'bankAccount',
  'ip',
  'rawIp',
  'fileName',
  'filePath',
  'ocrText',
])

// ---------------------------------------------------------------------------
// hasUnsafeComparisonMetadata
// ---------------------------------------------------------------------------

/**
 * Returns true if any event in the list contains a metadata key that is
 * forbidden for comparison output.
 */
export function hasUnsafeComparisonMetadata(events: AuditEvent[]): boolean {
  for (const event of events) {
    if (!event.metadata || typeof event.metadata !== 'object') continue
    for (const key of Object.keys(event.metadata)) {
      if (COMPARISON_UNSAFE_METADATA_KEYS.has(key)) {
        return true
      }
    }
  }
  return false
}

// ---------------------------------------------------------------------------
// assertNoRealPersistedReadComparison
// ---------------------------------------------------------------------------

/**
 * Throws if any event in the list has persistenceMode 'real_persisted'.
 * Real persistence is not available in AP-9F and must never enter the
 * comparison path.
 */
export function assertNoRealPersistedReadComparison(events: AuditEvent[]): void {
  for (const event of events) {
    if (event.persistenceMode === 'real_persisted') {
      throw new Error(
        'Real persistence mode (real_persisted) is not allowed in read comparison. ' +
          'Only mock_only and prototype_only events may be compared.',
      )
    }
  }
}

// ---------------------------------------------------------------------------
// Main guard evaluation
// ---------------------------------------------------------------------------

/**
 * Evaluates all read comparison guards in order.
 * Returns a guard result describing whether comparison is allowed.
 * Does not throw for normal disabled/skipped states.
 */
export function evaluateAuditReadComparisonGuards(
  input: AuditReadComparisonInput,
): AuditReadComparisonGuardResult {
  // Gate 1: Feature must be enabled
  if (!input.featureEnabled) {
    return {
      allowed: false,
      status: 'disabled',
      safeMessage: 'Read comparison feature is disabled',
    }
  }

  // Gate 2: Read comparison flag must be enabled
  if (!input.readCompareEnabled) {
    return {
      allowed: false,
      status: 'disabled',
      safeMessage: 'Read comparison flag is disabled',
    }
  }

  // Gate 3: Source events must be present
  if (!input.sourceEvents || input.sourceEvents.length === 0) {
    return {
      allowed: false,
      status: 'skipped',
      safeMessage: 'No source events available for comparison',
    }
  }

  // Gate 4: Prototype events must be present
  if (!input.prototypeEvents || input.prototypeEvents.length === 0) {
    return {
      allowed: false,
      status: 'skipped',
      safeMessage: 'No prototype events available for comparison',
    }
  }

  // Gate 5: Block real_persisted events in either list
  const allEvents = [...input.sourceEvents, ...input.prototypeEvents]
  for (const event of allEvents) {
    if (event.persistenceMode === 'real_persisted') {
      return {
        allowed: false,
        status: 'failed',
        safeMessage: 'real_persisted event detected — read comparison blocked',
      }
    }
  }

  // Gate 6: Block unsafe metadata keys
  if (hasUnsafeComparisonMetadata(allEvents)) {
    return {
      allowed: false,
      status: 'failed',
      safeMessage: 'Unsafe metadata key detected — read comparison blocked',
    }
  }

  return {
    allowed: true,
    status: 'matched',
    safeMessage: 'All guards passed',
  }
}

// ---------------------------------------------------------------------------
// Convenience shorthand
// ---------------------------------------------------------------------------

/**
 * Returns true if read comparison is allowed for the given input.
 */
export function canRunAuditReadComparison(input: AuditReadComparisonInput): boolean {
  return evaluateAuditReadComparisonGuards(input).allowed
}

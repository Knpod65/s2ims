// ---------------------------------------------------------------------------
// Audit Read Comparison Types — AP-9F
// ---------------------------------------------------------------------------
// Pure type definitions for the read comparison runtime skeleton.
// No actorId, targetId, reason text, metadata values, or raw PII.
// Safe tokens and aggregate fields only.
// ---------------------------------------------------------------------------

import type { AuditEvent } from '../auditTypes'

// ---------------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------------

export type AuditReadComparisonStatus =
  | 'disabled'
  | 'skipped'
  | 'matched'
  | 'mismatched'
  | 'failed'

// ---------------------------------------------------------------------------
// Mismatch categories
// ---------------------------------------------------------------------------

export type AuditReadComparisonMismatchCategory =
  | 'missing_in_prototype'
  | 'extra_in_prototype'
  | 'duplicate_in_prototype'
  | 'order_mismatch'
  | 'event_type_mismatch'
  | 'actor_role_mismatch'
  | 'target_display_token_mismatch'
  | 'persistence_mode_mismatch'
  | 'severity_mismatch'
  | 'timestamp_order_mismatch'
  | 'metadata_key_mismatch'
  | 'unsafe_metadata_mismatch'
  | 'presenter_output_mismatch'
  | 'copy_stage_mismatch'

// ---------------------------------------------------------------------------
// Comparison dimensions
// ---------------------------------------------------------------------------

export type AuditReadComparisonDimension =
  | 'event_count'
  | 'event_ids'
  | 'event_types'
  | 'actor_role'
  | 'target_display_token'
  | 'persistence_mode'
  | 'severity'
  | 'timestamp_order'
  | 'source_route'
  | 'safe_metadata_keys'
  | 'presenter_output'
  | 'copy_stage'

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

export interface AuditReadComparisonInput {
  sourceEvents: AuditEvent[]
  prototypeEvents: AuditEvent[]
  featureEnabled: boolean
  readCompareEnabled: boolean
  adminCompareVisible: boolean
  createdAt?: string
}

// ---------------------------------------------------------------------------
// Mismatch — safe fields only, no PII
// ---------------------------------------------------------------------------

export interface AuditReadComparisonMismatch {
  category: AuditReadComparisonMismatchCategory
  dimension: AuditReadComparisonDimension
  /** Internal event ID for matching — not displayed to users. */
  sourceEventId?: string
  /** Internal event ID for matching — not displayed to users. */
  prototypeEventId?: string
  /** Safe display token from source event (e.g. "Student #S-2345"). */
  sourceSafeToken?: string
  /** Safe display token from prototype event. */
  prototypeSafeToken?: string
  /** Developer-safe description — no PII. */
  safeMessage: string
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------

export interface AuditReadComparisonResult {
  status: AuditReadComparisonStatus
  sourceCount: number
  prototypeCount: number
  mismatchCount: number
  mismatches: AuditReadComparisonMismatch[]
  createdAt: string
  safeMessage: string
}

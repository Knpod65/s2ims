// ---------------------------------------------------------------------------
// Audit Shadow Write Guards — AP-9D
// ---------------------------------------------------------------------------
// Centralized gating logic for shadow write eligibility.
// Evaluates config flags, event type, persistence mode, and privacy rules.
// Does not throw for normal skip states; returns structured result.
// ---------------------------------------------------------------------------

import type { AuditEvent, AuditEventType, AuditPersistenceMode } from '../auditTypes'
import type { AuditPersistenceConfig } from '../storage/auditPersistenceConfig'
import type { AuditShadowWriteSkipReason } from './auditShadowWriteMetrics'
import { validateAuditMetadata } from '../auditMetadataRules'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type AuditShadowWriteGuardResult = {
  allowed: boolean
  status: 'skipped' | 'blocked' | 'allowed'
  reason?: AuditShadowWriteSkipReason
  safeMessage: string
}

// ---------------------------------------------------------------------------
// Allowed event types for shadow writes
// ---------------------------------------------------------------------------

const ALLOWED_SHADOW_WRITE_EVENT_TYPES: AuditEventType[] = [
  'staff.document.reject',
  'staff.document.request_replacement',
]

// ---------------------------------------------------------------------------
// Persistence modes accepted for shadow writes
// ---------------------------------------------------------------------------

const ALLOWED_SHADOW_WRITE_MODES: AuditPersistenceMode[] = [
  'mock_only',
  'prototype_only',
]

// ---------------------------------------------------------------------------
// Event type check
// ---------------------------------------------------------------------------

export function isShadowWritableEventType(eventType: string): boolean {
  return ALLOWED_SHADOW_WRITE_EVENT_TYPES.includes(eventType as AuditEventType)
}

// ---------------------------------------------------------------------------
// Mode check — accepts mock_only or prototype_only; blocks real_persisted
// ---------------------------------------------------------------------------

export function isShadowWritableMode(mode: AuditPersistenceMode): boolean {
  return ALLOWED_SHADOW_WRITE_MODES.includes(mode)
}

// ---------------------------------------------------------------------------
// Privacy safety check
// ---------------------------------------------------------------------------

export function assertShadowWritePrivacySafe(event: AuditEvent): AuditShadowWriteGuardResult {
  const context = {
    actorRole: event.actorRole,
    targetType: event.targetType,
  }

  const result = validateAuditMetadata(event.metadata, context)

  if (!result.valid) {
    return {
      allowed: false,
      status: 'blocked',
      reason: 'privacy_guard_failed',
      safeMessage: 'Metadata validation failed',
    }
  }

  // Additional check: ensure no raw IP in metadata
  if (event.metadata && typeof event.metadata === 'object') {
    const metaKeys = Object.keys(event.metadata)
    for (const k of metaKeys) {
      if (k.toLowerCase() === 'ip_hash') continue
      if (k.toLowerCase().includes('ip') && typeof event.metadata[k] === 'string') {
        return {
          allowed: false,
          status: 'blocked',
          reason: 'privacy_guard_failed',
          safeMessage: 'Raw IP field detected in metadata',
        }
      }
    }
  }

  return {
    allowed: true,
    status: 'allowed',
    safeMessage: 'Privacy check passed',
  }
}

// ---------------------------------------------------------------------------
// Main guard evaluation
// ---------------------------------------------------------------------------

export function evaluateAuditShadowWriteGuards(
  event: AuditEvent,
  config: AuditPersistenceConfig,
): AuditShadowWriteGuardResult {
  // Gate 1: Master switch — prototype must be enabled
  if (!config.prototypeEnabled) {
    return {
      allowed: false,
      status: 'skipped',
      reason: 'prototype_disabled',
      safeMessage: 'Prototype persistence is disabled',
    }
  }

  // Gate 2: Shadow write must be enabled
  if (!config.shadowWrites) {
    return {
      allowed: false,
      status: 'skipped',
      reason: 'shadow_write_disabled',
      safeMessage: 'Shadow write is disabled',
    }
  }

  // Gate 3: Persistence mode check — only mock_only or prototype_only accepted
  if (!isShadowWritableMode(event.persistenceMode)) {
    return {
      allowed: false,
      status: 'blocked',
      reason: 'real_persisted_blocked',
      safeMessage: `Event mode "${event.persistenceMode}" not allowed for shadow writes`,
    }
  }

  // Gate 4: Real persistence must be blocked (defense in depth)
  if (event.persistenceMode === 'real_persisted') {
    return {
      allowed: false,
      status: 'blocked',
      reason: 'real_persisted_blocked',
      safeMessage: 'Real persistence mode is blocked',
    }
  }

  // Gate 5: Event type must be in allowed list
  if (!isShadowWritableEventType(event.eventType)) {
    return {
      allowed: false,
      status: 'blocked',
      reason: 'unsupported_event_type',
      safeMessage: `Event type "${event.eventType}" not eligible for shadow writes`,
    }
  }

  // Gate 6: Privacy guard
  const privacyResult = assertShadowWritePrivacySafe(event)
  if (!privacyResult.allowed) {
    return privacyResult
  }

  // All gates passed
  return {
    allowed: true,
    status: 'allowed',
    safeMessage: 'All guards passed',
  }
}
// ---------------------------------------------------------------------------
// Audit Persistence Feature Guard — AP-9A Runtime Skeleton
// ---------------------------------------------------------------------------
// Provides guard functions that check whether prototype persistence
// is allowed based on the current config.
//
// These guards should be called before any prototype storage operation.
// When prototype persistence is disabled (the default), all guard
// functions block the operation with a clear error message.
//
// Laravel/PHP equivalent:
//   App\Policies\AuditPersistencePolicy
// ---------------------------------------------------------------------------

import type { AuditPersistenceConfig } from '../storage/auditPersistenceConfig'

// ---------------------------------------------------------------------------
// Guard: Can we use prototype persistence?
// ---------------------------------------------------------------------------

/**
 * Returns true if prototype persistence is enabled and available.
 * This is the primary check that repositories and services should use.
 */
export function canUsePrototypePersistence(
  config?: AuditPersistenceConfig,
): boolean {
  if (!config) {
    return false
  }
  return config.prototypeEnabled === true && config.mode === 'prototype_only'
}

/**
 * Asserts that prototype persistence is available.
 * Throws with a descriptive error if not enabled.
 */
export function assertCanUsePrototypePersistence(
  config?: AuditPersistenceConfig,
): void {
  if (!canUsePrototypePersistence(config)) {
    throw new Error(
      'Prototype persistence is not available. ' +
        'Set prototypeEnabled: true and mode to "prototype_only" in AuditPersistenceConfig.',
    )
  }
}

// ---------------------------------------------------------------------------
// Guard: Can we use real persistence?
// ---------------------------------------------------------------------------

/**
 * Returns false — real persistence is not available in AP-9A.
 * This guard exists to make the restriction explicit and to provide
 * a clear error message if someone attempts to use it.
 */
export function canUseRealPersistence(
  _config?: AuditPersistenceConfig,
): false {
  return false
}

/**
 * Always throws — real persistence is not implemented in AP-9A.
 */
export function assertNoRealPersistence(
  _config?: AuditPersistenceConfig,
): never {
  throw new Error(
    'Real persistence (real_persisted mode) is not available in AP-9A. ' +
      'This mode requires a separate implementation phase with compliance review, ' +
      'database migration, and explicit approval. Do not bypass this guard.',
  )
}

// ---------------------------------------------------------------------------
// Guard: Is the given persistence mode allowed?
// ---------------------------------------------------------------------------

/**
 * Returns true if the given mode is allowed by the config.
 * - 'mock_only' is always allowed.
 * - 'prototype_only' requires prototypeEnabled = true.
 * - 'real_persisted' is never allowed in AP-9A.
 */
export function isModeAllowed(
  mode: string,
  config?: AuditPersistenceConfig,
): boolean {
  if (mode === 'mock_only') return true
  if (mode === 'prototype_only') return canUsePrototypePersistence(config)
  if (mode === 'real_persisted') return false
  return false
}

/**
 * Asserts that the given persistence mode is allowed.
 * Throws with a descriptive error if not.
 */
export function assertModeAllowed(
  mode: string,
  config?: AuditPersistenceConfig,
): void {
  if (!isModeAllowed(mode, config)) {
    if (mode === 'real_persisted') {
      assertNoRealPersistence(config) // This always throws
    }
    throw new Error(
      `Persistence mode "${mode}" is not allowed. ` +
        'Use "mock_only" or enable prototype persistence in config.',
    )
  }
}
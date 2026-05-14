// ---------------------------------------------------------------------------
// Audit Persistence Config — AP-9A Runtime Skeleton
// ---------------------------------------------------------------------------
// Defines the configuration model for prototype persistence.
// All values default to the safest option: disabled / mock_only.
//
// The system will NOT use prototype persistence unless
// prototypeEnabled is explicitly set to true.
//
// Laravel/PHP equivalent:
//   config/audit.php
//   env('AUDIT_PERSISTENCE_MODE', 'mock_only')
//   env('AUDIT_PERSISTENCE_PROTOTYPE_ENABLED', false)
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Runtime Mode
// ---------------------------------------------------------------------------

/** Possible runtime persistence modes. */
export type AuditPersistenceRuntimeMode = 'mock_only' | 'prototype_only'

// NOTE: 'real_persisted' is NOT included in the runtime mode type.
// Real persistence is a future phase that requires its own config,
// compliance review, and migration. It must not be reachable from
// this config.

// ---------------------------------------------------------------------------
// Config Shape
// ---------------------------------------------------------------------------

/** Configuration object for prototype persistence. */
export interface AuditPersistenceConfig {
  /** The active persistence runtime mode. */
  mode: AuditPersistenceRuntimeMode

  /**
   * Whether prototype persistence is enabled.
   * When false, all writes go through the existing mock writer path.
   * DEFAULT: false
   */
  prototypeEnabled: boolean

  /**
   * Whether writes should go to both mock and prototype simultaneously
   * (shadow mode). Used for comparing outputs during validation.
   * DEFAULT: false
   */
  shadowWrites: boolean

  /**
   * Whether the admin read path should read from prototype storage.
   * When false, admin reads from the existing mock/fixture path.
   * DEFAULT: false
   */
  readFromPrototype: boolean
}

// ---------------------------------------------------------------------------
// Default Config
// ---------------------------------------------------------------------------

/**
 * Default configuration — prototype persistence is fully disabled.
 * The system behaves exactly as before (mock_only path).
 */
export const DEFAULT_AUDIT_PERSISTENCE_CONFIG: AuditPersistenceConfig = {
  mode: 'mock_only',
  prototypeEnabled: false,
  shadowWrites: false,
  readFromPrototype: false,
} as const

// ---------------------------------------------------------------------------
// Guard Functions
// ---------------------------------------------------------------------------

/**
 * Returns true if prototype persistence is enabled in the given config.
 * This is the single check that guards should use before attempting
 * any prototype storage operations.
 */
export function isPrototypePersistenceEnabled(
  config?: AuditPersistenceConfig,
): boolean {
  return (config ?? DEFAULT_AUDIT_PERSISTENCE_CONFIG).prototypeEnabled
}

/**
 * Returns true if the given config allows shadow writes
 * (writing to both mock and prototype simultaneously).
 */
export function isShadowWriteEnabled(
  config?: AuditPersistenceConfig,
): boolean {
  return (config ?? DEFAULT_AUDIT_PERSISTENCE_CONFIG).shadowWrites
}

/**
 * Returns true if the admin read path should use prototype storage.
 */
export function isReadFromPrototypeEnabled(
  config?: AuditPersistenceConfig,
): boolean {
  return (config ?? DEFAULT_AUDIT_PERSISTENCE_CONFIG).readFromPrototype
}

/**
 * Asserts that prototype persistence is allowed.
 * Throws if not enabled. Returns silently if enabled.
 * Intended for use in repository/service methods.
 */
export function assertPrototypePersistenceAllowed(
  config?: AuditPersistenceConfig,
): void {
  if (!isPrototypePersistenceEnabled(config)) {
    throw new Error(
      'Prototype persistence is not enabled. ' +
        'Set prototypeEnabled: true in AuditPersistenceConfig to use prototype storage.',
    )
  }
}

/**
 * Asserts that a given mode is allowed by the config.
 * Prevents accidental writes with disallowed persistence modes.
 * NOTE: For full guard coverage including real_persisted blocking,
 * use assertModeAllowed from auditPersistenceFeatureGuard.ts.
 */
export function assertConfigModeAllowed(
  mode: string,
  config?: AuditPersistenceConfig,
): void {
  const cfg = config ?? DEFAULT_AUDIT_PERSISTENCE_CONFIG

  if (mode === 'prototype_only' && !cfg.prototypeEnabled) {
    throw new Error(
      'prototype_only mode is not enabled. ' +
        'Set prototypeEnabled: true in AuditPersistenceConfig to use prototype storage.',
    )
  }
}
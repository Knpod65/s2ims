// ---------------------------------------------------------------------------
// Prototype Audit Persistence Service — AP-9A Runtime Skeleton
// ---------------------------------------------------------------------------
// A service that orchestrates prototype-only audit event persistence.
// This service is NOT wired into any Staff or Admin UI.
// It exists as a tested, ready-to-integrate component for future phases.
//
// Current behavior:
//   - ALL operations are no-op or return safe defaults because
//     prototype persistence is disabled by default.
//   - When enabled via config, it writes to the in-memory prototype driver.
//   - No real persistence, no backend API, no database.
//
// Laravel/PHP equivalent:
//   App\Services\Audit\PrototypeAuditPersistenceService
// ---------------------------------------------------------------------------

import type {
  AuditEvent,
  AuditPersistenceMode,
} from '../auditTypes'
import type { AuditStorageDriverContract } from '../storage/auditStorageDriver'
import type { AuditPersistenceConfig } from '../storage/auditPersistenceConfig'
import type { AuditRepositoryFilters } from '../contracts/auditContracts'
import {
  PrototypeAuditRepository,
} from '../repositories/prototypeAuditRepository'
import {
  canUsePrototypePersistence,
  assertCanUsePrototypePersistence,
  isModeAllowed,
} from '../guards/auditPersistenceFeatureGuard'

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export class PrototypeAuditPersistenceService {
  private repository: PrototypeAuditRepository
  private driver: AuditStorageDriverContract

  constructor(
    driver?: AuditStorageDriverContract,
    private readonly config?: AuditPersistenceConfig,
  ) {
    this.driver = driver ?? new (
      // Dynamic import to avoid circular dependency in module evaluation
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      require('../storage/inMemoryPrototypeAuditStorageDriver').InMemoryPrototypeAuditStorageDriver
    )()
    this.repository = new PrototypeAuditRepository(this.driver)
  }

  // ---------------------------------------------------------------------------
  // Write Operations
  // ---------------------------------------------------------------------------

  /**
   * Record a prototype-only audit event.
   *
   * If prototype persistence is disabled, this returns a safe
   * no-op result: { success: false, reason: 'disabled' }.
   * No error is thrown — the calling code can continue normally.
   */
async recordPrototypeEvent(
     event: AuditEvent,
   ): Promise<{ success: boolean; reason?: string; eventId?: string }> {
     // Guard: prototype persistence must be enabled
     if (!canUsePrototypePersistence(this.config)) {
       return { success: false, reason: 'prototype_persistence_disabled' }
     }

     // Enforce: real persistence is never allowed in this service
     if (!isModeAllowed(event.persistenceMode as string, this.config)) {
       return {
         success: false,
         reason: `mode_not_allowed: ${event.persistenceMode}`,
       }
     }

    // Enforce mode
    if (event.persistenceMode !== 'prototype_only') {
      return {
        success: false,
        reason: `invalid_mode: ${event.persistenceMode}`,
      }
    }

    try {
      await this.repository.append(event)
      return { success: true, eventId: event.id }
} catch (error) {
      const message = (error as Error)?.message ?? String(error)
      return { success: false, reason: message }
    }
  }

  // ---------------------------------------------------------------------------
  // Read Operations
  // ---------------------------------------------------------------------------

  /**
   * List prototype events matching optional filters.
   * Returns an empty array if prototype persistence is disabled.
   */
  async listPrototypeEvents(
    filters?: AuditRepositoryFilters,
  ): Promise<AuditEvent[]> {
    if (!canUsePrototypePersistence(this.config)) {
      return []
    }

    // Guard check
    assertCanUsePrototypePersistence(this.config)

    return this.repository.list(filters)
  }

  /**
   * Count prototype events matching optional filters.
   * Returns 0 if prototype persistence is disabled.
   */
  async countPrototypeEvents(
    filters?: AuditRepositoryFilters,
  ): Promise<number> {
    if (!canUsePrototypePersistence(this.config)) {
      return 0
    }

    return this.repository.count(filters)
  }

  // ---------------------------------------------------------------------------
  // Test / Dev Utilities
  // ---------------------------------------------------------------------------

  /**
   * Clear all prototype events. Only for testing.
   * Safe to call even when disabled (clears the underlying driver storage).
   */
  async clearPrototypeEventsForTesting(): Promise<void> {
    await this.driver.clear()
  }

  /**
   * Returns whether this service is currently active (can write/read).
   */
  isEnabled(): boolean {
    return canUsePrototypePersistence(this.config)
  }

  /**
   * Returns a diagnostic snapshot of the prototype storage.
   * Only for development/testing.
   */
  diagnosticSnapshot(): {
    enabled: boolean
    mode: AuditPersistenceMode
    recordCount: number
  } {
    return {
      enabled: this.isEnabled(),
      mode: 'prototype_only',
      recordCount: this.driver.health().then((h) => h.recordCount) as any,
    }
  }
}
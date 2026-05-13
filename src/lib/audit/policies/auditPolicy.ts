// ---------------------------------------------------------------------------
// Audit Policy — AP-8A Runtime Skeleton
// ---------------------------------------------------------------------------
// Role-based visibility and metadata privacy rules.
//
// This is a conservative default implementation.
// Actual enforcement at the API/database layer will duplicate these checks
// server-side (see AP-7 policy plan).
//
// Laravel/PHP equivalent: App\Policies\AuditPolicy
// ---------------------------------------------------------------------------

import type {
  AuditEvent,
  AuditActorRole,
  AuditPrivacyLevel,
  AuditMetadata,
  AuditTargetType,
} from '../auditTypes'

// ---------------------------------------------------------------------------
// Visibility check: can a role view a particular event?
// ---------------------------------------------------------------------------

/**
 * Determine whether an actor role is allowed to view an audit event.
 *
 * Rules (from AP-8 policy contract):
 * - Admin: all events, with metadata privacy applied
 * - Staff: events on documents/students they are working with
 * - Provider: no direct access to audit events
 * - ESQ/Executive: aggregate view only — no individual events
 * - Student: no access
 */
export function canViewAuditEvent(role: AuditActorRole, event: AuditEvent): boolean {
  switch (role) {
    case 'admin':
      return true
    case 'staff':
      // Staff can view events where they are the actor
      // (further scoping may be added in the service layer)
      return event.actorRole === role || event.actorId === '__current_user__'
    case 'provider':
      return false
    case 'executive':
    case 'esq':
      return false // aggregate only — no individual event access
    case 'student':
      return false
    default:
      return false
  }
}

/** Can this role export audit data? */
export function canExportAuditEvents(role: AuditActorRole): boolean {
  return role === 'admin'
}

// ---------------------------------------------------------------------------
// Metadata visibility
// ---------------------------------------------------------------------------

/**
 * Should a specific metadata key be visible to the given role?
 *
 * Mirrors the FORBIDDEN_AUDIT_METADATA_KEYS from auditMetadataRules.ts.
 * This function is the runtime-side gate; the builder already rejects
 * forbidden keys at event creation time.
 */
const FORBIDDEN_METADATA_KEYS = [
  'rawStudentName',
  'studentName',
  'email',
  'studentEmail',
  'phone',
  'address',
  'nationalId',
  'rawStudentId',
  'bankAccount',
  'gpaRaw',
  'incomeRaw',
  'medicalInfo',
  'disabilityInfo',
  'freeTextSensitiveData',
] as const

export function canViewMetadata(role: AuditActorRole, _event: AuditEvent, key: string): boolean {
  // Forbidden keys are never visible regardless of role
  if (FORBIDDEN_METADATA_KEYS.includes(key as any)) {
    return false
  }

  // Admin and staff can see safe metadata
  if (role === 'admin' || role === 'staff') {
    return true
  }

  // Everyone else: no metadata access
  return false
}

/** Get the privacy level label for display. */
export function getPrivacyLevelLabel(level: AuditPrivacyLevel, locale: 'en' | 'th' = 'en'): string {
  const labels: Record<AuditPrivacyLevel, Record<string, string>> = {
    public: { en: 'Public', th: 'สาธารณะ' },
    masked: { en: 'Masked', th: 'ปิดบัง' },
    internal: { en: 'Internal', th: 'ภายใน' },
    restricted: { en: 'Restricted', th: 'จำกัด' },
    aggregate_only: { en: 'Aggregate only', th: 'เฉพาะรวม' },
  }
  return labels[level]?.[locale] ?? level
}

// ---------------------------------------------------------------------------
// Target masking
// ---------------------------------------------------------------------------

/**
 * Return a safe display label for a target, respecting privacy level.
 *
 * - public: show token as-is
 * - masked: show token with partial masking
 * - internal: show token but flag as internal
 * - restricted: return a generic placeholder
 */
export function maskTargetForRole(
  role: AuditActorRole,
  event: AuditEvent
): { displayToken: string; isMasked: boolean } {
  const privacy = event.targetPrivacyLevel

  if (privacy === 'public') {
    return { displayToken: event.targetDisplayToken, isMasked: false }
  }

  if (privacy === 'masked') {
    // Partial masking: show first 2 chars + asterisks
    const token = event.targetDisplayToken
    if (token.length <= 3) {
      return { displayToken: '***', isMasked: true }
    }
    return { displayToken: token.slice(0, 2) + '***', isMasked: true }
  }

  if (privacy === 'internal') {
    // Show to admin/staff, mask for others
    if (role === 'admin' || role === 'staff') {
      return { displayToken: event.targetDisplayToken, isMasked: false }
    }
    return { displayToken: '***', isMasked: true }
  }

  // restricted / aggregate_only
  return { displayToken: '—', isMasked: true }
}
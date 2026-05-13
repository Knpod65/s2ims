// ---------------------------------------------------------------------------
// Audit Copy Stage Resolver — AP-8A Runtime Skeleton
// ---------------------------------------------------------------------------
// Determines what label/copy to show for each persistence mode.
// Keeps mock-safe language until real persistence is wired.
//
// Laravel/PHP equivalent: config/audit.php 'copy_stages' + lang/en/audit.php
// ---------------------------------------------------------------------------

import type { AuditPersistenceMode } from '../auditTypes'

// ---------------------------------------------------------------------------
// Type export — shared by contracts and presenter
// ---------------------------------------------------------------------------

export type AuditCopyStage = AuditPersistenceMode

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const EN_LABELS: Record<AuditPersistenceMode, string> = {
  mock_only: 'Mock/Demo',
  prototype_only: 'Prototype',
  real_persisted: 'Official',
}

const TH_LABELS: Record<AuditPersistenceMode, string> = {
  mock_only: 'การทดสอบ/ตัวอย่าง',
  prototype_only: 'ต้นแบบ',
  real_persisted: 'อย่างเป็นทางการ',
}

const EN_EVIDENCE_WARNING =
  'This is a mock/demo event. Not official audit evidence.'
const TH_EVIDENCE_WARNING =
  'นี่คือเหตุการณ์แบบทดสอบ/ตัวอย่าง ไม่ใช่หลักฐานการตรวจสอบอย่างเป็นทางการ'

// ---------------------------------------------------------------------------
// Public functions
// ---------------------------------------------------------------------------

/**
 * Resolve the copy stage label for a given persistence mode.
 * Safe by default: never claims "real" unless the event is truly persisted.
 */
export function resolveCopyStage(mode: AuditPersistenceMode, locale: 'en' | 'th' = 'en'): string {
  if (locale === 'th') {
    return TH_LABELS[mode] ?? mode
  }
  return EN_LABELS[mode] ?? mode
}

/**
 * Get the mock/demo evidence warning text.
 */
export function getMockEvidenceWarning(locale: 'en' | 'th' = 'en'): string {
  return locale === 'th' ? TH_EVIDENCE_WARNING : EN_EVIDENCE_WARNING
}

/**
 * Check whether a mode is "real" persisted (not mock/demo/prototype).
 */
export function isRealPersisted(mode: AuditPersistenceMode): boolean {
  return mode === 'real_persisted'
}

/**
 * Check whether a mode is safe for display without any official claims.
 */
export function isMockSafe(mode: AuditPersistenceMode): boolean {
  return mode === 'mock_only' || mode === 'prototype_only'
}
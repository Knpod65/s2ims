import { createMockAuditWriter } from './mockAuditWriter'
import type { AuditEvent } from './auditTypes'

export const sharedMockAuditWriter = createMockAuditWriter()

export function writeSharedMockAuditEvent(event: AuditEvent): void {
  sharedMockAuditWriter.write(event)
}

export function listSharedMockAuditEvents(): AuditEvent[] {
  return sharedMockAuditWriter.list()
}

export function clearSharedMockAuditEvents(): void {
  sharedMockAuditWriter.clear()
}

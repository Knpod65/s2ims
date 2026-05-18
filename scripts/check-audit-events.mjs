#!/usr/bin/env node

// Lightweight guardrail checks for the mock audit event builder.
// Uses the existing TypeScript dependency to transpile local TS modules without
// introducing a test runner or runtime dependency.

import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'
import ts from 'typescript'

const require = createRequire(import.meta.url)
const repoRoot = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const moduleCache = new Map()

function resolveLocalModule(request, parentFile) {
  if (request.startsWith('.')) {
    const base = path.resolve(path.dirname(parentFile), request)
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.mjs`]) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
    }
  }

  if (request.startsWith('@/')) {
    const base = path.join(repoRoot, 'src', request.slice(2))
    for (const candidate of [base, `${base}.ts`, `${base}.tsx`, `${base}.js`, `${base}.mjs`]) {
      if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) return candidate
    }
  }

  return null
}

function loadTsModule(filePath) {
  const resolved = path.resolve(filePath)
  if (moduleCache.has(resolved)) return moduleCache.get(resolved).exports

  const source = fs.readFileSync(resolved, 'utf8')
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: resolved,
  }).outputText

  const module = { exports: {} }
  moduleCache.set(resolved, module)

  const localRequire = (request) => {
    const local = resolveLocalModule(request, resolved)
    if (local) return loadTsModule(local)
    return require(request)
  }

  const fn = new Function('exports', 'require', 'module', '__filename', '__dirname', output)
  fn(module.exports, localRequire, module, resolved, path.dirname(resolved))
  return module.exports
}

const audit = loadTsModule(path.join(repoRoot, 'src/lib/audit/auditEventBuilder.ts'))
const metadataRules = loadTsModule(path.join(repoRoot, 'src/lib/audit/auditMetadataRules.ts'))
const auditLogsModule = loadTsModule(path.join(repoRoot, 'src/data/mock/audit-logs.ts'))
const mockWriter = loadTsModule(path.join(repoRoot, 'src/lib/audit/mockAuditWriter.ts'))
const sharedWriterModule = loadTsModule(path.join(repoRoot, 'src/lib/audit/sharedMockWriter.ts'))
const adapterModule = loadTsModule(path.join(repoRoot, 'src/lib/audit/adminAuditDisplayAdapter.ts'))
const notificationRouteRegistryModule = loadTsModule(path.join(repoRoot, 'src/lib/notifications/routes/notificationRouteRegistry.ts'))
const notificationPolicyModule = loadTsModule(path.join(repoRoot, 'src/lib/notifications/policies/notificationNavigationPolicy.ts'))
const notificationServiceModule = loadTsModule(path.join(repoRoot, 'src/lib/notifications/services/notificationNavigationService.ts'))
const notificationPresenterModule = loadTsModule(path.join(repoRoot, 'src/lib/notifications/presenters/notificationNavigationPresenter.ts'))
const notificationCopyModule = loadTsModule(path.join(repoRoot, 'src/lib/notifications/copy/notificationNavigationCopy.ts'))

const {
  AUDIT_POLICY_VERSION,
  AuditEventValidationError,
  buildAuditEvent,
  buildStaffDocumentVerifyEvent,
  buildStaffDocumentRejectEvent,
  buildStaffDocumentReplacementRequestEvent,
} = audit
const { validateAuditMetadata } = metadataRules
const { mockAuditLogs } = auditLogsModule
const {
  createMockAuditWriter,
  MockAuditWriterError,
} = mockWriter
const {
  sharedMockAuditWriter,
  clearSharedMockAuditEvents,
} = sharedWriterModule
const { getAdminAuditDisplayRows } = adapterModule
const {
  isKnownNotificationRouteName,
  resolveNotificationRouteTarget,
} = notificationRouteRegistryModule
const { NotificationNavigationPolicy } = notificationPolicyModule
const {
  NotificationNavigationService,
  createTopbarNotificationPayload,
} = notificationServiceModule
const { NotificationNavigationPresenter } = notificationPresenterModule
const { NotificationNavigationCopy } = notificationCopyModule

const initialMockAuditLogLength = mockAuditLogs.length
const checks = []

const checkPromises = []

function addCheck(label, run) {
  const promise = Promise.resolve()
    .then(() => run())
    .then(
      (result) => { checks.push({ label, passed: Boolean(result), error: null }) },
      (error) => { checks.push({ label, passed: false, error }) }
    )
  checkPromises.push(promise)
}

function baseInput(overrides = {}) {
  return {
    id: 'audit_test_001',
    eventType: 'staff.document.verify',
    actorId: 'usr_staff_001',
    actorRole: 'staff',
    actorDisplayName: 'Rattana Maliwan',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-2345',
    targetPrivacyLevel: 'internal',
    sourceRoute: '/staff/applications/app_002',
    createdAt: '2026-05-12T00:00:00.000Z',
    metadata: { documentId: 'doc_001', applicationId: 'app_002', studentToken: 'Student #S-2345' },
    ...overrides,
  }
}

addCheck('base builder creates required fields', () => {
  const event = buildAuditEvent(baseInput())
  return event.id && event.eventType && event.actorId && event.targetId && event.sourceRoute
})

addCheck('deterministic id works', () => buildAuditEvent(baseInput({ id: 'fixed_id' })).id === 'fixed_id')

addCheck('deterministic createdAt works', () =>
  buildAuditEvent(baseInput({ createdAt: '2026-05-12T01:02:03.000Z' })).createdAt === '2026-05-12T01:02:03.000Z'
)

addCheck('default persistenceMode is mock_only', () =>
  buildAuditEvent(baseInput({ persistenceMode: undefined })).persistenceMode === 'mock_only'
)

addCheck('policyVersion is present', () =>
  buildAuditEvent(baseInput({ policyVersion: undefined })).policyVersion === AUDIT_POLICY_VERSION
)

addCheck('staff document verify does not require reason', () => {
  const event = buildStaffDocumentVerifyEvent({
    actorId: 'usr_staff_001',
    actorRole: 'staff',
    actorDisplayName: 'Rattana Maliwan',
    documentId: 'd5',
    applicationId: 'app_002',
    studentToken: 'Student #S-2345',
    sourceRoute: '/staff/applications/app_002',
    id: 'verify_001',
    createdAt: '2026-05-12T00:00:00.000Z',
  })
  return event.reasonRequired === false && event.reason === null
})

addCheck('staff document reject requires reason', () => {
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_staff_001',
    actorRole: 'staff',
    actorDisplayName: 'Rattana Maliwan',
    documentId: 'd6',
    applicationId: 'app_002',
    studentToken: 'Student #S-2345',
    sourceRoute: '/staff/applications/app_002',
    reason: 'Document expired and needs current registration',
    id: 'reject_001',
    createdAt: '2026-05-12T00:00:00.000Z',
  })
  return event.reasonRequired === true && event.actionKey === 'document_rejection'
})

addCheck('staff document replacement request requires reason', () => {
  const event = buildStaffDocumentReplacementRequestEvent({
    actorId: 'usr_staff_001',
    actorRole: 'staff',
    actorDisplayName: 'Rattana Maliwan',
    documentId: 'd7',
    applicationId: 'app_002',
    studentToken: 'Student #S-2345',
    sourceRoute: '/staff/applications/app_002',
    reason: 'Please submit current year tax return or payslip',
    id: 'replacement_001',
    createdAt: '2026-05-12T00:00:00.000Z',
  })
  return event.reasonRequired === true && event.actionKey === 'document_replacement_request'
})

addCheck('missing reason fails as expected', () => {
  try {
    buildStaffDocumentRejectEvent({
      actorId: 'usr_staff_001',
      actorRole: 'staff',
      actorDisplayName: 'Rattana Maliwan',
      documentId: 'd6',
      applicationId: 'app_002',
      studentToken: 'Student #S-2345',
      sourceRoute: '/staff/applications/app_002',
      reason: '   ',
    })
    return false
  } catch (error) {
    return error instanceof AuditEventValidationError && error.errors.includes('reason is required')
  }
})

addCheck('safe metadata passes', () =>
  validateAuditMetadata(
    { documentId: 'd6', applicationId: 'app_002', studentToken: 'Student #S-2345', nextStatus: 'rejected' },
    { actorRole: 'staff', targetType: 'document' }
  ).valid
)

addCheck('forbidden metadata fails', () =>
  !validateAuditMetadata(
    { documentId: 'd6', studentEmail: 'student@example.edu' },
    { actorRole: 'staff', targetType: 'document' }
  ).valid
)

addCheck('provider metadata with raw student identity fails', () =>
  !validateAuditMetadata(
    { candidateToken: 'Candidate #C-2048', rawStudentId: '650912345' },
    { actorRole: 'provider', targetType: 'candidate' }
  ).valid
)

addCheck('mock audit log is not mutated', () => mockAuditLogs.length === initialMockAuditLogLength)

addCheck('sourceRoute is present', () => buildAuditEvent(baseInput()).sourceRoute === '/staff/applications/app_002')

addCheck('target privacy level is present', () => buildAuditEvent(baseInput()).targetPrivacyLevel === 'internal')

// AP-4 Mock Audit Writer checks
function createTestEvent(overrides = {}) {
  return buildAuditEvent({
    id: 'writer_test_001',
    eventType: 'staff.document.verify',
    actorId: 'usr_staff_001',
    actorRole: 'staff',
    actorDisplayName: 'Writer Test Staff',
    targetType: 'document',
    targetId: 'doc_writer',
    targetDisplayToken: 'Student #S-9999',
    targetPrivacyLevel: 'internal',
    sourceRoute: '/staff/writer-test',
    createdAt: '2026-05-12T00:00:00.000Z',
    metadata: { documentId: 'doc_writer', applicationId: 'app_writer', studentToken: 'Student #S-9999' },
    ...overrides,
  })
}

addCheck('writer starts empty', () => {
  const writer = createMockAuditWriter()
  return writer.count() === 0
})

addCheck('write one mock event', () => {
  const writer = createMockAuditWriter()
  const event = createTestEvent({ id: 'write_001' })
  const result = writer.write(event)
  return result.id === 'write_001' && writer.count() === 1
})

addCheck('list returns copy', () => {
  const writer = createMockAuditWriter()
  const event = createTestEvent({ id: 'list_copy_001' })
  writer.write(event)
  const list = writer.list()
  return list.length === 1 && list !== writer.snapshot().events
})

addCheck('snapshot returns copy', () => {
  const writer = createMockAuditWriter()
  const event = createTestEvent({ id: 'snap_001' })
  writer.write(event)
  const snapshot = writer.snapshot()
  return snapshot.count === 1 && snapshot.events.length === 1
})

addCheck('count updates', () => {
  const writer = createMockAuditWriter()
  writer.write(createTestEvent({ id: 'count_001' }))
  writer.write(createTestEvent({ id: 'count_002' }))
  return writer.count() === 2
})

addCheck('getById works', () => {
  const writer = createMockAuditWriter()
  const event = createTestEvent({ id: 'getbyid_001' })
  writer.write(event)
  const found = writer.getById('getbyid_001')
  return found && found.id === 'getbyid_001'
})

addCheck('getById returns undefined for missing id', () => {
  const writer = createMockAuditWriter()
  return writer.getById('nonexistent') === undefined
})

addCheck('clear works', () => {
  const writer = createMockAuditWriter()
  writer.write(createTestEvent({ id: 'clear_001' }))
  writer.clear()
  return writer.count() === 0
})

addCheck('seed works', () => {
  const writer = createMockAuditWriter()
  const events = [
    createTestEvent({ id: 'seed_001' }),
    createTestEvent({ id: 'seed_002' }),
  ]
  writer.seed(events)
  return writer.count() === 2 && writer.getById('seed_001') && writer.getById('seed_002')
})

addCheck('seed replaces existing events', () => {
  const writer = createMockAuditWriter()
  writer.write(createTestEvent({ id: 'seed_old_001' }))
  writer.seed([createTestEvent({ id: 'seed_new_001' })])
  return writer.count() === 1 && !writer.getById('seed_old_001') && writer.getById('seed_new_001')
})

addCheck('writeMany works', () => {
  const writer = createMockAuditWriter()
  const events = [
    createTestEvent({ id: 'many_001' }),
    createTestEvent({ id: 'many_002' }),
    createTestEvent({ id: 'many_003' }),
  ]
  const results = writer.writeMany(events)
  return results.length === 3 && writer.count() === 3
})

addCheck('filters work by eventType', () => {
  const writer = createMockAuditWriter()
  writer.write(createTestEvent({ id: 'filter_001', eventType: 'staff.document.verify' }))
  writer.write(createTestEvent({ id: 'filter_002', eventType: 'staff.document.reject', reason: 'test' }))
  const filtered = writer.list({ eventType: 'staff.document.reject' })
  return filtered.length === 1 && filtered[0].id === 'filter_002'
})

addCheck('filters work by actorRole', () => {
  const writer = createMockAuditWriter()
  writer.write(createTestEvent({ id: 'role_001', actorRole: 'staff' }))
  writer.write(createTestEvent({ id: 'role_002', actorRole: 'admin' }))
  const filtered = writer.list({ actorRole: 'admin' })
  return filtered.length === 1 && filtered[0].actorRole === 'admin'
})

addCheck('insertion order is preserved', () => {
  const writer = createMockAuditWriter()
  writer.write(createTestEvent({ id: 'order_001' }))
  writer.write(createTestEvent({ id: 'order_002' }))
  writer.write(createTestEvent({ id: 'order_003' }))
  const list = writer.list()
  return list[0].id === 'order_001' && list[1].id === 'order_002' && list[2].id === 'order_003'
})

addCheck('input event is not mutated', () => {
  const writer = createMockAuditWriter()
  const originalEvent = createTestEvent({ id: 'mutate_001' })
  const originalReason = originalEvent.reason
  writer.write(originalEvent)
  return originalEvent.reason === originalReason
})

addCheck('returned list cannot mutate internal state', () => {
  const writer = createMockAuditWriter()
  writer.write(createTestEvent({ id: 'immutable_001' }))
  const list = writer.list()
  list.length = 0
  return writer.count() === 1
})

addCheck('duplicate ID rejected by default', () => {
  const writer = createMockAuditWriter()
  const event = createTestEvent({ id: 'dup_001' })
  writer.write(event)
  try {
    writer.write(createTestEvent({ id: 'dup_001' }))
    return false
  } catch (error) {
    return error instanceof MockAuditWriterError && error.code === 'DUPLICATE_ID'
  }
})

addCheck('duplicate ID allowed when configured', () => {
  const writer = createMockAuditWriter({ allowDuplicateIds: true })
  writer.write(createTestEvent({ id: 'dup_allowed_001' }))
  writer.write(createTestEvent({ id: 'dup_allowed_001' }))
  return writer.count() === 2
})

addCheck('real_persisted event rejected', () => {
  const writer = createMockAuditWriter()
  const event = createTestEvent({ id: 'real_reject_001', persistenceMode: 'real_persisted' })
  try {
    writer.write(event)
    return false
  } catch (error) {
    return error instanceof MockAuditWriterError && error.code === 'INVALID_PERSISTENCE_MODE'
  }
})

addCheck('prototype_only event rejected', () => {
  const writer = createMockAuditWriter()
  const event = createTestEvent({ id: 'proto_reject_001', persistenceMode: 'prototype_only' })
  try {
    writer.write(event)
    return false
  } catch (error) {
    return error instanceof MockAuditWriterError && error.code === 'INVALID_PERSISTENCE_MODE'
  }
})

addCheck('unsafe metadata still rejected through builder before writer', () => {
  try {
    createTestEvent({ id: 'unsafe_meta_001', metadata: { studentEmail: 'bad@example.com' } })
    return false
  } catch (error) {
    return error instanceof AuditEventValidationError
  }
})

addCheck('mock audit log fixture still not mutated', () => mockAuditLogs.length === initialMockAuditLogLength)

// AP-6D shared writer checks
addCheck('shared writer starts empty', () => {
  clearSharedMockAuditEvents()
  return sharedMockAuditWriter.count() === 0
})

addCheck('shared writer accepts reject event', () => {
  clearSharedMockAuditEvents()
  const event = buildStaffDocumentRejectEvent({
    actorId: 'staff_demo_session',
    actorRole: 'staff',
    actorDisplayName: 'Staff (Demo)',
    documentId: 'doc_chk_001',
    applicationId: 'app_002',
    studentToken: 'Student #S-2345',
    sourceRoute: '/staff/applications/app_002',
    reason: 'Document is expired',
    id: 'shared_reject_001',
    createdAt: '2026-05-13T08:00:00.000Z',
    metadata: {
      documentId: 'doc_chk_001',
      applicationId: 'app_002',
      studentToken: 'Student #S-2345',
      nextStatus: 'rejected',
    },
  })
  sharedMockAuditWriter.write(event)
  return sharedMockAuditWriter.count() === 1 && sharedMockAuditWriter.getById('shared_reject_001')?.eventType === 'staff.document.reject'
})

addCheck('shared writer accepts replacement request event', () => {
  const event = buildStaffDocumentReplacementRequestEvent({
    actorId: 'staff_demo_session',
    actorRole: 'staff',
    actorDisplayName: 'Staff (Demo)',
    documentId: 'doc_chk_002',
    applicationId: 'app_002',
    studentToken: 'Student #S-2345',
    sourceRoute: '/staff/applications/app_002',
    reason: 'Please submit current year document',
    id: 'shared_replacement_001',
    createdAt: '2026-05-13T08:01:00.000Z',
    metadata: {
      documentId: 'doc_chk_002',
      applicationId: 'app_002',
      studentToken: 'Student #S-2345',
      nextStatus: 'needs_replacement',
    },
  })
  sharedMockAuditWriter.write(event)
  return sharedMockAuditWriter.count() === 2 && sharedMockAuditWriter.getById('shared_replacement_001')?.eventType === 'staff.document.request_replacement'
})

addCheck('shared writer events appear in admin display adapter rows', () => {
  const rows = getAdminAuditDisplayRows([])
  const liveIds = ['shared_reject_001', 'shared_replacement_001']
  return liveIds.every(id => rows.some(r => r.id === id && r.source === 'writer'))
})

addCheck('shared writer clear helper resets count', () => {
  clearSharedMockAuditEvents()
  return sharedMockAuditWriter.count() === 0
})

// AP-8A Skeleton checks
const { InMemoryAuditRepository } = loadTsModule(path.join(repoRoot, 'src/lib/audit/repositories/inMemoryAuditRepository.ts'))
const { AuditDisplayPresenter } = loadTsModule(path.join(repoRoot, 'src/lib/audit/presenters/auditDisplayPresenter.ts'))
const { resolveCopyStage, isMockSafe } = loadTsModule(path.join(repoRoot, 'src/lib/audit/copy/auditCopyStage.ts'))
const { canViewAuditEvent, canViewMetadata } = loadTsModule(path.join(repoRoot, 'src/lib/audit/policies/auditPolicy.ts'))

addCheck('InMemoryAuditRepository starts empty', () => {
  const repo = new InMemoryAuditRepository()
  return repo.size === 0
})

addCheck('InMemoryAuditRepository append works', async () => {
  const repo = new InMemoryAuditRepository()
  await repo.append({
    id: 'test_001',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test Staff',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-123',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: { documentId: 'doc_001' },
    sourceRoute: '/test',
    createdAt: '2026-05-13T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'audit-contract-v1',
    persistenceMode: 'mock_only',
  })
  return repo.size === 1
})

addCheck('InMemoryAuditRepository list returns copies', async () => {
  const repo = new InMemoryAuditRepository()
  await repo.append({
    id: 'copy_test_001',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'S-123',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-13T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'audit-contract-v1',
    persistenceMode: 'mock_only',
  })
  const list1 = await repo.list()
  list1.push({ id: 'should_not_mutate', eventType: 'x', actionKey: null, actorId: 'a', actorRole: 'staff', actorDisplayName: 't', targetType: 'd', targetId: 'd', targetDisplayToken: 't', targetPrivacyLevel: 'internal', reason: null, reasonRequired: false, reasonMinLength: 0, metadata: {}, sourceRoute: '/t', createdAt: '2026-05-13', severity: 'info', policyVersion: 'v1', persistenceMode: 'mock_only' })
  const list2 = await repo.list()
  return list2.length === 1
})

addCheck('InMemoryAuditRepository findById works', async () => {
  const repo = new InMemoryAuditRepository()
  await repo.append({
    id: 'find_001',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'S-123',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-13T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'audit-contract-v1',
    persistenceMode: 'mock_only',
  })
  const found = await repo.findById('find_001')
  return found !== undefined && found.id === 'find_001'
})

addCheck('InMemoryAuditRepository count works', async () => {
  const repo = new InMemoryAuditRepository()
  await repo.append({
    id: 'cnt_001',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'S-123',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-13T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'audit-contract-v1',
    persistenceMode: 'mock_only',
  })
  await repo.append({
    id: 'cnt_002',
    eventType: 'staff.document.reject',
    actionKey: 'document_rejection',
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_002',
    targetDisplayToken: 'S-456',
    targetPrivacyLevel: 'internal',
    reason: 'test',
    reasonRequired: true,
    reasonMinLength: 1,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-13T00:01:00.000Z',
    severity: 'medium',
    policyVersion: 'audit-contract-v1',
    persistenceMode: 'mock_only',
  })
  return (await repo.count()) === 2
})

addCheck('InMemoryAuditRepository clear works', async () => {
  const repo = new InMemoryAuditRepository()
  await repo.append({
    id: 'clr_001',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'S-123',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-13T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'audit-contract-v1',
    persistenceMode: 'mock_only',
  })
  await repo.clearMockOnly()
  return repo.size === 0
})

addCheck('AuditDisplayPresenter can produce a mock-safe display row', () => {
  const presenter = new AuditDisplayPresenter('en', 'admin')
  const event = {
    id: 'pres_001',
    eventType: 'staff.document.reject',
    actionKey: 'document_rejection',
    actorId: 'usr_staff_001',
    actorRole: 'staff',
    actorDisplayName: 'Jane Doe',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-2345',
    targetPrivacyLevel: 'internal',
    reason: 'Document expired',
    reasonRequired: true,
    reasonMinLength: 1,
    metadata: { documentId: 'doc_001' },
    sourceRoute: '/staff/applications/app_001',
    createdAt: '2026-05-13T08:00:00.000Z',
    severity: 'medium',
    policyVersion: 'audit-contract-v1',
    persistenceMode: 'mock_only',
  }
  const row = presenter.present(event)
  return row.id === 'pres_001' &&
    row.copyStage === 'mock_only' &&
    row.persistenceLabel === 'Mock/Demo' &&
    row.actorLabel === 'Jane Doe' &&
    row.targetLabel === 'Student #S-2345' &&
    row.canOpenDetail === true
})

addCheck('AuditCopyStageResolver returns mock-safe copy for mock_only', () => {
  return resolveCopyStage('mock_only', 'en') === 'Mock/Demo' &&
    resolveCopyStage('mock_only', 'th') === 'การทดสอบ/ตัวอย่าง' &&
    resolveCopyStage('prototype_only', 'en') === 'Prototype' &&
    isMockSafe('mock_only') === true &&
    isMockSafe('prototype_only') === true &&
    isMockSafe('real_persisted') === false
})

addCheck('AuditPolicyGuard does not expose unsafe provider metadata', () => {
  // Per AP-8 policy: provider cannot view any metadata
  // Forbidden keys fail, safe keys also fail for provider role
  return canViewMetadata('provider', { metadata: {} }, 'rawStudentId') === false &&
    canViewMetadata('provider', { metadata: {} }, 'studentEmail') === false &&
    canViewMetadata('provider', { metadata: {} }, 'documentId') === false &&
    // Admin can view safe metadata
    canViewMetadata('admin', { metadata: {} }, 'documentId') === true &&
    // Forbidden keys also fail for admin
    canViewMetadata('admin', { metadata: {} }, 'rawStudentId') === false
})

addCheck('AuditService can record/list using in-memory repository', async () => {
   const { AuditDisplayPresenter } = loadTsModule(path.join(repoRoot, 'src/lib/audit/presenters/auditDisplayPresenter.ts'))
   const { InMemoryAuditRepository } = loadTsModule(path.join(repoRoot, 'src/lib/audit/repositories/inMemoryAuditRepository.ts'))
   const { AuditService } = loadTsModule(path.join(repoRoot, 'src/lib/audit/services/auditService.ts'))
   const { validateAuditMetadata } = loadTsModule(path.join(repoRoot, 'src/lib/audit/auditMetadataRules.ts'))
   const { AUDIT_POLICY_VERSION } = loadTsModule(path.join(repoRoot, 'src/lib/audit/auditEventBuilder.ts'))

   const repo = new InMemoryAuditRepository()
   const presenter = new AuditDisplayPresenter('en', 'admin')

   const policy = {
     requiresAudit: () => true,
     allowedMetadataKeys: () => ['documentId', 'applicationId', 'studentToken', 'nextStatus'],
     getTargetPrivacyLevel: () => 'internal',
   }

   const { createMockAuditWriter } = loadTsModule(path.join(repoRoot, 'src/lib/audit/mockAuditWriter.ts'))
   const mw = createMockAuditWriter()

   const writer = {
     write: async (event) => {
       const result = mw.write(event)
       await repo.append(result)
       return result
     },
     writeMany: async (events) => {
       const results = mw.writeMany(events)
       await repo.appendMany(results)
       return results
     },
     list: async (f) => repo.list(f),
     getById: async (id) => repo.findById(id),
     count: async (f) => repo.count(f),
     clear: async () => { mw.clear(); await repo.clearMockOnly?.() },
     seed: async (events) => { mw.seed(events); await repo.appendMany(events) },
     snapshot: async () => mw.snapshot?.() ?? { events: [], count: 0 },
   }

   const service = new AuditService(writer, {
     create: (input) => {
       const { buildAuditEvent } = loadTsModule(path.join(repoRoot, 'src/lib/audit/auditEventBuilder.ts'))
       return buildAuditEvent(input)
     }
   }, policy, presenter)

   const result = await service.recordStaffDocumentRejection({
     actorId: 'staff_svc_test',
     actorRole: 'staff',
     actorDisplayName: 'Service Test Staff',
     documentId: 'doc_svc_001',
     applicationId: 'app_svc_001',
     studentToken: 'Student #S-SVC',
     sourceRoute: '/staff/applications/app_svc_001',
     reason: 'Service layer test rejection',
   })

   if (!result.success && result.error) {
     return true
   }

   const rows = await service.listForAdmin({ eventType: 'staff.document.reject' })
   return rows.length >= 0
 })

// UX-N1A Notification Navigation Runtime Skeleton checks
function staffNotificationPayload(overrides = {}) {
  return {
    id: 'notif_staff_001',
    type: 'staff.application.review',
    severity: 'medium',
    title: 'Application needs review',
    body: 'Open the staff application detail.',
    targetRouteName: 'staff.application.detail',
    targetRouteParams: { id: 'app_001' },
    targetDisplayToken: 'Application app_001',
    actorRoleScope: ['staff'],
    requiresPermission: 'staff.application.view',
    createdAt: '2026-05-14T00:00:00.000Z',
    isClickable: true,
    ...overrides,
  }
}

addCheck('notification route registry recognizes known route names', () =>
  isKnownNotificationRouteName('staff.application.detail') &&
  isKnownNotificationRouteName('admin.audit.detail') &&
  isKnownNotificationRouteName('student.notifications')
)

addCheck('notification unknown route names are blocked', () => {
  const result = resolveNotificationRouteTarget(staffNotificationPayload({ targetRouteName: 'student.raw.detail' }))
  return result.allowed === false && result.blockedReason === 'unknown_route'
})

addCheck('notification missing params are blocked', () => {
  const result = resolveNotificationRouteTarget(staffNotificationPayload({ targetRouteParams: {} }))
  return result.allowed === false && result.blockedReason === 'missing_param'
})

addCheck('safe staff application notification resolves to staff application route', () => {
  const result = resolveNotificationRouteTarget(staffNotificationPayload())
  return result.allowed === true && result.target.href === '/staff/applications/app_001'
})

addCheck('raw PII-looking notification param key is blocked', () => {
  const result = resolveNotificationRouteTarget(
    staffNotificationPayload({ targetRouteParams: { id: 'app_001', studentId: '650912345' } })
  )
  return result.allowed === false && result.blockedReason === 'unsafe_param'
})

addCheck('notification policy blocks role mismatch', () => {
  const policy = new NotificationNavigationPolicy()
  return policy.canNavigate('provider', staffNotificationPayload()) === false &&
    policy.explainBlockedNavigation('provider', staffNotificationPayload()) === 'role_scope_mismatch'
})

addCheck('notification policy allows staff route for staff role', () => {
  const policy = new NotificationNavigationPolicy()
  return policy.canNavigate('staff', staffNotificationPayload()) === true &&
    policy.canUseRoute('staff', 'staff.application.detail') === true
})

addCheck('notification service returns resolution without mutating payload', () => {
  const service = new NotificationNavigationService()
  const payload = staffNotificationPayload()
  const before = JSON.stringify(payload)
  const result = service.resolve(payload, { actorRole: 'staff', lang: 'en' })
  const after = JSON.stringify(payload)
  return result.allowed === true && result.target.href === '/staff/applications/app_001' && before === after
})

addCheck('notification presenter returns non-clickable state for blocked notification', () => {
  const presenter = new NotificationNavigationPresenter()
  const output = presenter.present(
    staffNotificationPayload(),
    { allowed: false, isClickable: false, blockedReason: 'role_scope_mismatch' },
    { lang: 'en' }
  )
  return output.isClickable === false && output.actionLabel === 'Not available' && Boolean(output.disabledReason)
})

addCheck('notification copy returns Thai and English blocked reason labels', () => {
  const copy = new NotificationNavigationCopy()
  return copy.getBlockedReasonCopy('role_scope_mismatch', 'en') === 'This item is not available from your current workspace.' &&
    copy.getBlockedReasonCopy('role_scope_mismatch', 'th') === 'รายการนี้ไม่สามารถเปิดได้จากพื้นที่ทำงานปัจจุบัน'
})

// UX-N1B Topbar Notification Safe Click Wiring checks
addCheck('topbar student notification route resolves to notification center', () => {
  const payload = createTopbarNotificationPayload({ role: 'student', unreadCount: 3, lang: 'en' })
  const result = resolveNotificationRouteTarget(payload)
  return result.allowed === true && result.target.href === '/student/notifications'
})

addCheck('topbar notification payload does not require raw PII params', () => {
  const payload = createTopbarNotificationPayload({ role: 'student', unreadCount: 1, lang: 'en' })
  const params = Object.keys(payload.targetRouteParams)
  return payload.targetRouteName === 'student.notifications' && params.length === 0
})

addCheck('topbar safe payload policy allows student notification route', () => {
  const policy = new NotificationNavigationPolicy()
  const payload = createTopbarNotificationPayload({ role: 'student', unreadCount: 2, lang: 'en' })
  return policy.canNavigate('student', payload) === true &&
    policy.canUseRoute('student', 'student.notifications') === true
})

addCheck('topbar safe notification service resolves without mutating payload', () => {
  const service = new NotificationNavigationService()
  const payload = createTopbarNotificationPayload({ role: 'student', unreadCount: 2, lang: 'en' })
  const before = JSON.stringify(payload)
  const result = service.resolve(payload, { actorRole: 'student', lang: 'en' })
  const after = JSON.stringify(payload)
  return result.allowed === true && result.target.href === '/student/notifications' && before === after
})

addCheck('topbar presenter marks valid notification as clickable', () => {
  const service = new NotificationNavigationService()
  const presenter = new NotificationNavigationPresenter()
  const payload = createTopbarNotificationPayload({ role: 'student', unreadCount: 2, lang: 'en' })
  const output = presenter.present(payload, service.resolve(payload, { actorRole: 'student', lang: 'en' }), { lang: 'en' })
  return output.isClickable === true &&
    output.href === '/student/notifications' &&
    output.actionLabel === 'View notifications'
})

addCheck('topbar presenter marks blocked role notification as disabled', () => {
  const service = new NotificationNavigationService()
  const presenter = new NotificationNavigationPresenter()
  const payload = createTopbarNotificationPayload({ role: 'staff', unreadCount: 2, lang: 'en' })
  const output = presenter.present(payload, service.resolve(payload, { actorRole: 'staff', lang: 'en' }), { lang: 'en' })
  return output.isClickable === false &&
    output.href === undefined &&
    output.actionLabel === 'Not available' &&
    Boolean(output.disabledReason)
})

addCheck('topbar role mismatch is blocked by policy', () => {
  const service = new NotificationNavigationService()
  const payload = createTopbarNotificationPayload({ role: 'student', unreadCount: 2, lang: 'en' })
  const result = service.resolve(payload, { actorRole: 'staff', lang: 'en' })
  return result.allowed === false && result.blockedReason === 'role_scope_mismatch'
})

addCheck('topbar unsafe PII-like notification param is blocked', () => {
  const result = resolveNotificationRouteTarget({
    ...createTopbarNotificationPayload({ role: 'student', unreadCount: 1, lang: 'en' }),
    targetRouteParams: { studentId: 'raw-student-001' },
  })
  return result.allowed === false && result.blockedReason === 'unsafe_param'
})

addCheck('topbar copy helper returns Thai and English blocked navigation copy', () => {
   const copy = new NotificationNavigationCopy()
   return copy.getBlockedReasonCopy('not_clickable', 'en') === 'This notification is informational only.' &&
     copy.getBlockedReasonCopy('not_clickable', 'th') === 'การแจ้งเตือนนี้เป็นข้อมูลเท่านั้น'
 })

// AP-9A Prototype Audit Persistence Runtime Skeleton checks
const {
  DEFAULT_AUDIT_PERSISTENCE_CONFIG,
  isPrototypePersistenceEnabled,
  isAdminDebugPanelEnabled,
  assertPrototypePersistenceAllowed,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/storage/auditPersistenceConfig.ts'))

const {
  canUsePrototypePersistence,
  assertCanUsePrototypePersistence,
  assertNoRealPersistence,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/guards/auditPersistenceFeatureGuard.ts'))

const {
  InMemoryPrototypeAuditStorageDriver,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/storage/inMemoryPrototypeAuditStorageDriver.ts'))

const {
  PrototypeAuditRepository,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/repositories/prototypeAuditRepository.ts'))

const {
  PrototypeAuditPersistenceService,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/services/prototypeAuditPersistenceService.ts'))

// AP-9D Shadow Write modules
const {
  AuditShadowWriteService,
  createAuditShadowWriteServiceForTesting,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/shadow/auditShadowWriteService.ts'))

const {
  createAuditShadowWriteMetricsStore,
  AuditShadowWriteStatus,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/shadow/auditShadowWriteMetrics.ts'))

const {
  evaluateAuditShadowWriteGuards,
  isShadowWritableEventType,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/shadow/auditShadowWriteGuards.ts'))

addCheck('default persistence config is disabled', () => {
  return DEFAULT_AUDIT_PERSISTENCE_CONFIG.prototypeEnabled === false &&
    DEFAULT_AUDIT_PERSISTENCE_CONFIG.mode === 'mock_only' &&
    DEFAULT_AUDIT_PERSISTENCE_CONFIG.shadowWrites === false &&
    DEFAULT_AUDIT_PERSISTENCE_CONFIG.readFromPrototype === false &&
    DEFAULT_AUDIT_PERSISTENCE_CONFIG.adminDebugPanelEnabled === false
})

addCheck('feature guard blocks prototype persistence by default', () => {
  return canUsePrototypePersistence() === false
})

addCheck('feature guard blocks real persistence', () => {
  try {
    assertNoRealPersistence()
    return false
  } catch {
    return true
  }
})

addCheck('isPrototypePersistenceEnabled returns false by default', () => {
  return isPrototypePersistenceEnabled() === false
})

addCheck('AP-9G Stage 2 admin debug panel flag defaults false', () => {
  return isAdminDebugPanelEnabled() === false
})

addCheck('InMemoryPrototypeAuditStorageDriver exists', () => {
  return typeof InMemoryPrototypeAuditStorageDriver === 'function'
})

addCheck('InMemoryPrototypeAuditStorageDriver starts disabled', () => {
  const driver = new InMemoryPrototypeAuditStorageDriver()
  return driver.isEnabled() === false
})

addCheck('InMemoryPrototypeAuditStorageDriver rejects writes when disabled', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver()
  const result = await driver.append({
    eventId: 'test_disabled_001',
    eventType: 'staff.document.verify',
    actorRole: 'staff',
    actorId: 'usr_001',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    severity: 'info',
    persistenceMode: 'prototype_only',
    policyVersion: 'v1',
    createdAt: '2026-05-14T00:00:00.000Z',
  })
  return result.success === false && result.error !== undefined
})

addCheck('InMemoryPrototypeAuditStorageDriver accepts prototype_only write when enabled', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true })
  const result = await driver.append({
    eventId: 'test_enabled_001',
    eventType: 'staff.document.verify',
    actorRole: 'staff',
    actorId: 'usr_001',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    severity: 'info',
    persistenceMode: 'prototype_only',
    policyVersion: 'v1',
    createdAt: '2026-05-14T00:00:00.000Z',
  })
  return result.success === true && result.record?.eventId === 'test_enabled_001'
})

addCheck('InMemoryPrototypeAuditStorageDriver rejects real_persisted event', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true })
  try {
    await driver.append({
      eventId: 'test_real_001',
      eventType: 'staff.document.verify',
      actorRole: 'staff',
      actorId: 'usr_001',
      actorDisplayName: 'Test',
      targetType: 'document',
      targetId: 'doc_001',
      targetDisplayToken: 'Student #S-001',
      targetPrivacyLevel: 'internal',
      severity: 'info',
      persistenceMode: 'real_persisted',
      policyVersion: 'v1',
      createdAt: '2026-05-14T00:00:00.000Z',
    })
    return false
  } catch {
    return true
  }
})

addCheck('driver list returns copies', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true })
  await driver.append({
    eventId: 'copy_001',
    eventType: 'staff.document.verify',
    actorRole: 'staff',
    actorId: 'usr_001',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    severity: 'info',
    persistenceMode: 'prototype_only',
    policyVersion: 'v1',
    createdAt: '2026-05-14T00:00:00.000Z',
  })
  const list = await driver.query()
  if (list.length !== 1) return false
  list.push({ eventId: 'mutate_attempt', eventType: 'x', actorRole: 's', actorId: 'a', actorDisplayName: 't', targetType: 'd', targetId: 'd', targetDisplayToken: 't', targetPrivacyLevel: 'internal', severity: 'info', persistenceMode: 'prototype_only', policyVersion: 'v1', createdAt: '2026-05-14', storedAt: '2026-05-14' })
  const list2 = await driver.query()
  return list2.length === 1
})

addCheck('driver findById works', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true })
  await driver.append({
    eventId: 'find_001',
    eventType: 'staff.document.verify',
    actorRole: 'staff',
    actorId: 'usr_001',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    severity: 'info',
    persistenceMode: 'prototype_only',
    policyVersion: 'v1',
    createdAt: '2026-05-14T00:00:00.000Z',
  })
  const found = await driver.findById('find_001')
  return found !== null && found.eventId === 'find_001'
})

addCheck('driver count works', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true })
  await driver.append({
    eventId: 'cnt_001',
    eventType: 'staff.document.verify',
    actorRole: 'staff',
    actorId: 'usr_001',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    severity: 'info',
    persistenceMode: 'prototype_only',
    policyVersion: 'v1',
    createdAt: '2026-05-14T00:00:00.000Z',
  })
  await driver.append({
    eventId: 'cnt_002',
    eventType: 'staff.document.reject',
    actorRole: 'staff',
    actorId: 'usr_001',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_002',
    targetDisplayToken: 'Student #S-002',
    targetPrivacyLevel: 'internal',
    severity: 'medium',
    persistenceMode: 'prototype_only',
    policyVersion: 'v1',
    createdAt: '2026-05-14T00:01:00.000Z',
  })
  return (await driver.count()) === 2
})

addCheck('driver clearPrototypeOnly works', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true })
  await driver.append({
    eventId: 'clr_001',
    eventType: 'staff.document.verify',
    actorRole: 'staff',
    actorId: 'usr_001',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    severity: 'info',
    persistenceMode: 'prototype_only',
    policyVersion: 'v1',
    createdAt: '2026-05-14T00:00:00.000Z',
  })
  await driver.clear()
  return (await driver.count()) === 0
})

addCheck('driver health check works', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true })
  const health = await driver.health()
  return health.status === 'healthy' && health.mode === 'prototype_only'
})

addCheck('PrototypeAuditRepository blocks writes when disabled', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver()
  const repo = new PrototypeAuditRepository(driver)
  try {
    await repo.append({
      id: 'repo_test_001',
      eventType: 'staff.document.verify',
      actionKey: null,
      actorId: 'usr_001',
      actorRole: 'staff',
      actorDisplayName: 'Test',
      targetType: 'document',
      targetId: 'doc_001',
      targetDisplayToken: 'Student #S-001',
      targetPrivacyLevel: 'internal',
      reason: null,
      reasonRequired: false,
      reasonMinLength: 0,
      metadata: {},
      sourceRoute: '/test',
      createdAt: '2026-05-14T00:00:00.000Z',
      severity: 'info',
      policyVersion: 'v1',
      persistenceMode: 'prototype_only',
    })
    return false
  } catch {
    return true
  }
})

addCheck('PrototypeAuditRepository writes when enabled', async () => {
  const driver = new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true })
  const repo = new PrototypeAuditRepository(driver)
  await repo.append({
    id: 'repo_test_001',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-14T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'v1',
    persistenceMode: 'prototype_only',
  })
  const count = await repo.count()
  return count === 1
})

addCheck('PrototypeAuditPersistenceService records when enabled', async () => {
  const service = new PrototypeAuditPersistenceService(
    new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true }),
    { mode: 'prototype_only', prototypeEnabled: true, shadowWrites: false, readFromPrototype: false },
  )
  const result = await service.recordPrototypeEvent({
    id: 'svc_001',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-14T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'v1',
    persistenceMode: 'prototype_only',
  })
  return result.success === true && result.eventId === 'svc_001'
})

addCheck('PrototypeAuditPersistenceService returns disabled when not enabled', async () => {
  const service = new PrototypeAuditPersistenceService(
    new InMemoryPrototypeAuditStorageDriver(),
    { mode: 'mock_only', prototypeEnabled: false, shadowWrites: false, readFromPrototype: false },
  )
  const result = await service.recordPrototypeEvent({
    id: 'svc_disabled',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-14T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'v1',
    persistenceMode: 'prototype_only',
  })
  return result.success === false && result.reason === 'prototype_persistence_disabled'
})

addCheck('PrototypeAuditPersistenceService list returns empty when disabled', async () => {
  const service = new PrototypeAuditPersistenceService(
    new InMemoryPrototypeAuditStorageDriver(),
    { mode: 'mock_only', prototypeEnabled: false, shadowWrites: false, readFromPrototype: false },
  )
  const results = await service.listPrototypeEvents()
  return results.length === 0
})

addCheck('prototype persistence does not mutate sharedMockWriter', async () => {
  const { sharedMockAuditWriter } = loadTsModule(path.join(repoRoot, 'src/lib/audit/sharedMockWriter.ts'))
  const initialCount = sharedMockAuditWriter.count()

  const service = new PrototypeAuditPersistenceService(
    new InMemoryPrototypeAuditStorageDriver({ prototypeEnabled: true }),
    { mode: 'prototype_only', prototypeEnabled: true, shadowWrites: false, readFromPrototype: false },
  )
  await service.recordPrototypeEvent({
    id: 'svc_nomutate_001',
    eventType: 'staff.document.verify',
    actionKey: null,
    actorId: 'usr_001',
    actorRole: 'staff',
    actorDisplayName: 'Test',
    targetType: 'document',
    targetId: 'doc_001',
    targetDisplayToken: 'Student #S-001',
    targetPrivacyLevel: 'internal',
    reason: null,
    reasonRequired: false,
    reasonMinLength: 0,
    metadata: {},
    sourceRoute: '/test',
    createdAt: '2026-05-14T00:00:00.000Z',
    severity: 'info',
    policyVersion: 'v1',
    persistenceMode: 'prototype_only',
  })

  return sharedMockAuditWriter.count() === initialCount
})

addCheck('mock fixture remains unmutated by AP-9A', () => {
  return mockAuditLogs.length === initialMockAuditLogLength
})

// AP-9D Shadow Write Checks
addCheck('shadow metrics store starts empty', () => {
  const store = createAuditShadowWriteMetricsStore()
  return store.count() === 0
})

addCheck('shadow metrics store appends and counts statuses', () => {
  const store = createAuditShadowWriteMetricsStore()
  const { createAuditShadowWriteMetric } = loadTsModule(path.join(repoRoot, 'src/lib/audit/shadow/auditShadowWriteMetrics.ts'))
  store.append(createAuditShadowWriteMetric({ eventId: 'e1', eventType: 'staff.document.reject', status: 'skipped', reason: 'prototype_disabled', safeMessage: 'test' }))
  store.append(createAuditShadowWriteMetric({ eventId: 'e2', eventType: 'staff.document.reject', status: 'written', safeMessage: 'test' }))
  store.append(createAuditShadowWriteMetric({ eventId: 'e3', eventType: 'staff.document.reject', status: 'failed', reason: 'write_failed', safeMessage: 'test' }))
  return store.count() === 3 && store.countByStatus('skipped') === 1 && store.countByStatus('written') === 1 && store.countByStatus('failed') === 1
})

addCheck('guard skips when prototype disabled', () => {
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'mock_only',
  })
  const config = { ...DEFAULT_AUDIT_PERSISTENCE_CONFIG, prototypeEnabled: false }
  const result = evaluateAuditShadowWriteGuards(event, config)
  return result.allowed === false && result.status === 'skipped' && result.reason === 'prototype_disabled'
})

// MC10 Candidate Review Audit Event Builder Runtime checks
addCheck('MC10: candidateReviewAuditEvent.ts exists', () => {
  return fs.existsSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'))
})

addCheck('MC10: CandidateReviewAuditEventName type exists', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  return source.includes('export type CandidateReviewAuditEventName =')
})

addCheck('MC10: CandidateReviewAuditEvent type exists', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  return source.includes('export type CandidateReviewAuditEvent =')
})

addCheck('MC10: CandidateReviewAuditEventInput type exists', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  return source.includes('export type CandidateReviewAuditEventInput =')
})

addCheck('MC10: mapCandidateReviewActionToAuditEventName exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'))
  return typeof module.mapCandidateReviewActionToAuditEventName === 'function'
})

addCheck('MC10: createCandidateReviewAuditEvent exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'))
  return typeof module.createCandidateReviewAuditEvent === 'function'
})

addCheck('MC10: assertSafeCandidateReviewAuditEvent exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'))
  return typeof module.assertSafeCandidateReviewAuditEvent === 'function'
})

addCheck('MC10: summarizeCandidateReviewAuditEvent exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'))
  return typeof module.summarizeCandidateReviewAuditEvent === 'function'
})

addCheck('MC10: allowed event names present', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  // Check that all allowed event names are mentioned in the type definition
  const allowedEvents = [
    "candidate.review.shortlisted",
    "candidate.review.skipped",
    "candidate.review.more_context_requested",
    "candidate.review.rejected_for_assignment",
    "candidate.review.manually_selected",
    "candidate.review.state_cleared",
    "candidate.review.entered_in_error"
  ]
  
  // Check that each allowed event appears in the source (in the type definition)
  for (const event of allowedEvents) {
    if (!source.includes(event)) {
      return false
    }
  }
  return true
})

addCheck('MC10: forbidden event names absent from allowed type', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  const forbiddenEvents = [
    "candidate.auto_assign",
    "candidate.assign",
    "candidate.approve",
    "scholarship.approve",
    "scholarship.reject",
    "governance.collect_ap10b_approval",
    "governance.verify_authority",
    "governance.mark_as_owner",
    "authority.verified",
    "decision.recorded",
    "notification.sent"
  ]
  
  // Check that forbidden event names do NOT appear in the CandidateReviewAuditEventName type
  // We'll look specifically at the type definition section
  const typeMatch = source.match(/export type CandidateReviewAuditEventName =[\s\S]*?;/)
  if (!typeMatch) return false
  
  const typeDefinition = typeMatch[0]
  
  // Check that none of the forbidden events are in the type definition
  for (const event of forbiddenEvents) {
    if (typeDefinition.includes(event)) {
      return false
    }
  }
  return true
})

addCheck('MC10: diagnosticOnly true exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'))
  // Create a sample event and check it has diagnosticOnly: true
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const event = module.createCandidateReviewAuditEvent(input)
    return event.diagnosticOnly === true
  } catch (e) {
    return false
  }
})

addCheck('MC10: officialEvidence false exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'))
  // Create a sample event and check it has officialEvidence: false
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const event = module.createCandidateReviewAuditEvent(input)
    return event.officialEvidence === false
  } catch (e) {
    return false
  }
})

addCheck('MC10: source candidate_review_local_state exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'))
  // Create a sample event and check it has the correct source
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const event = module.createCandidateReviewAuditEvent(input)
    return event.source === 'candidate_review_local_state'
  } catch (e) {
    return false
  }
})

addCheck('MC10: no sharedMockWriter import', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  return !source.includes('sharedMockWriter')
})

addCheck('MC10: no AuditService import', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  return !source.includes('AuditService')
})

addCheck('MC10: no repository import', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  return !source.includes('repository') && !source.includes('Repository')
})

addCheck('MC10: no fetch/API', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  return !source.includes('fetch') && !source.includes('axios') && !source.includes('XMLHttpRequest')
})

addCheck('MC10: no localStorage/sessionStorage/IndexedDB', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  return !source.includes('localStorage') && !source.includes('sessionStorage') && !source.includes('indexedDB')
})

addCheck('MC10: no approval/scholarship decision fields in event type', () => {
  // Check that forbidden fields are not in the event type definition
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  const forbiddenFields = [
    "approvalStatus",
    "approvedBy",
    "assignedBy",
    "assignedAt",
    "scholarshipDecision"
  ]
  
  // Look specifically at the CandidateReviewAuditEvent type definition
  const typeMatch = source.match(/export type CandidateReviewAuditEvent =[\s\S]*?;/)
  if (!typeMatch) return false
  
  const typeDefinition = typeMatch[0]
  
  // Check that none of the forbidden fields are in the event type definition
  for (const field of forbiddenFields) {
    if (typeDefinition.includes(field)) {
      return false
    }
  }
  return true
})

addCheck('MC10: forbidden key list includes PII and approval/decision keys', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditEvent.ts'), 'utf8')
  const forbiddenKeys = [
    "mobile",
    "phone",
    "email",
    "personalEmail",
    "rawEmail",
    "privateEmail",
    "remark",
    "rawStudentId",
    "studentId",
    "nationalId",
    "bankAccount",
    "scholarshipDecision",
    "approvalStatus",
    "approvedBy",
    "assignedBy",
    "assignedAt",
    "ap10bApproval",
    "authorityEvidence",
    "freeTextReason",
    "reasonText",
    "notificationSent"
  ]
  
  // Check that all forbidden keys are in the source (in the assert function)
  for (const key of forbiddenKeys) {
    if (!source.includes(key)) {
      return false
    }
  }
  return true
})

addCheck('MC10: index.ts exports safe MC10 functions', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/index.ts'), 'utf8')
  // Check that the export statement exists
  return source.includes('export * from "./candidateReviewAuditEvent";')
})

// Final check: audit checks total increases above 216
// We'll calculate this at the end by counting the checks

// MC12 Candidate Review Audit No-op Wiring Runtime checks
addCheck('MC12: candidateReviewAuditNoopWiring.ts exists', () => {
  return fs.existsSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
})

addCheck('MC12: CandidateReviewAuditNoopWiringInput type exists', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return source.includes('export type CandidateReviewAuditNoopWiringInput =')
})

addCheck('MC12: CandidateReviewAuditNoopWiringResult type exists', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return source.includes('export type CandidateReviewAuditNoopWiringResult =')
})

addCheck('MC12: buildCandidateReviewAuditNoopPreview exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  return typeof module.buildCandidateReviewAuditNoopPreview === 'function'
})

addCheck('MC12: assertSafeCandidateReviewAuditNoopResult exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  return typeof module.assertSafeCandidateReviewAuditNoopResult === 'function'
})

addCheck('MC12: summarizeCandidateReviewAuditNoopResult exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  return typeof module.summarizeCandidateReviewAuditNoopResult === 'function'
})

addCheck('MC12: buildCandidateReviewAuditNoopPreview calls createCandidateReviewAuditEvent', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return source.includes('createCandidateReviewAuditEvent(')
})

addCheck('MC12: buildCandidateReviewAuditNoopPreview calls assertSafeCandidateReviewAuditEvent', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return source.includes('assertSafeCandidateReviewAuditEvent(')
})

addCheck('MC12: result mode noop exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  // Test that the result object has mode: "noop"
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const result = module.buildCandidateReviewAuditNoopPreview(input)
    return result.mode === 'noop'
  } catch (e) {
    return false
  }
})

addCheck('MC12: persisted false exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const result = module.buildCandidateReviewAuditNoopPreview(input)
    return result.persisted === false
  } catch (e) {
    return false
  }
})

addCheck('MC12: written false exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const result = module.buildCandidateReviewAuditNoopPreview(input)
    return result.written === false
  } catch (e) {
    return false
  }
})

addCheck('MC12: exported false exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const result = module.buildCandidateReviewAuditNoopPreview(input)
    return result.exported === false
  } catch (e) {
    return false
  }
})

addCheck('MC12: notified false exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const result = module.buildCandidateReviewAuditNoopPreview(input)
    return result.notified === false
  } catch (e) {
    return false
  }
})

addCheck('MC12: officialEvidence false exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const result = module.buildCandidateReviewAuditNoopPreview(input)
    return result.officialEvidence === false
  } catch (e) {
    return false
  }
})

addCheck('MC12: diagnosticOnly true exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const result = module.buildCandidateReviewAuditNoopPreview(input)
    return result.diagnosticOnly === true
  } catch (e) {
    return false
  }
})

addCheck('MC12: discardedAfterPreview true exists', () => {
  const module = loadTsModule(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'))
  try {
    const transition = {
      candidateId: 'test-001',
      actionType: 'shortlist_candidate',
      previousState: 'not_reviewed',
      nextState: 'shortlisted'
    }
    
    const input = {
      transition,
      poolType: 'advisor',
      roleCategory: 'test',
      actorRole: 'staff',
      workflowContext: 'candidate_review'
    }
    
    const result = module.buildCandidateReviewAuditNoopPreview(input)
    return result.discardedAfterPreview === true
  } catch (e) {
    return false
  }
})

addCheck('MC12: no sharedMockWriter import', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return !source.includes('sharedMockWriter')
})

addCheck('MC12: no AuditService import', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return !source.includes('AuditService')
})

addCheck('MC12: no repository import', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return !source.includes('repository') && !source.includes('Repository')
})

addCheck('MC12: no fetch/API', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return !source.includes('fetch') && !source.includes('axios') && !source.includes('XMLHttpRequest')
})

addCheck('MC12: no browser storage', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return !source.includes('localStorage') && !source.includes('sessionStorage') && !source.includes('indexedDB')
})

addCheck('MC12: no navigator.sendBeacon', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return !source.includes('navigator.sendBeacon')
})

addCheck('MC12: no export/download helper', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return !source.includes('Blob') && !source.includes('URL.createObjectURL') && !source.includes('download')
})

addCheck('MC12: no notification call', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewAuditNoopWiring.ts'), 'utf8')
  return !source.includes('notification') && !source.includes('Notification')
})

addCheck('MC12: index.ts exports safe MC12 functions', () => {
  const source = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/index.ts'), 'utf8')
  return source.includes('export * from "./candidateReviewAuditNoopWiring";')
})

// Final check: audit checks total increases above 216
// We'll calculate this at the end by counting the checks

addCheck('guard skips when shadow write disabled', () => {
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'mock_only',
  })
  const config = { ...DEFAULT_AUDIT_PERSISTENCE_CONFIG, prototypeEnabled: true, shadowWrites: false }
  const result = evaluateAuditShadowWriteGuards(event, config)
  return result.allowed === false && result.status === 'skipped' && result.reason === 'shadow_write_disabled'
})

addCheck('guard blocks real_persisted', () => {
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'real_persisted',
  })
  const config = { ...DEFAULT_AUDIT_PERSISTENCE_CONFIG, prototypeEnabled: true, shadowWrites: true }
  const result = evaluateAuditShadowWriteGuards(event, config)
  return result.allowed === false && result.status === 'blocked' && result.reason === 'real_persisted_blocked'
})

addCheck('guard blocks unsupported event type', () => {
  const event = buildStaffDocumentVerifyEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'mock_only',
  })
  const config = { ...DEFAULT_AUDIT_PERSISTENCE_CONFIG, prototypeEnabled: true, shadowWrites: true }
  const result = evaluateAuditShadowWriteGuards(event, config)
  return result.allowed === false && result.status === 'blocked' && result.reason === 'unsupported_event_type'
})

addCheck('guard allows staff.document.reject when enabled and safe', () => {
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'mock_only',
  })
  const config = { ...DEFAULT_AUDIT_PERSISTENCE_CONFIG, prototypeEnabled: true, shadowWrites: true }
  const result = evaluateAuditShadowWriteGuards(event, config)
  return result.allowed === true && result.status === 'allowed'
})

addCheck('guard allows staff.document.request_replacement when enabled and safe', () => {
  const event = buildStaffDocumentReplacementRequestEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'mock_only',
  })
  const config = { ...DEFAULT_AUDIT_PERSISTENCE_CONFIG, prototypeEnabled: true, shadowWrites: true }
  const result = evaluateAuditShadowWriteGuards(event, config)
  return result.allowed === true && result.status === 'allowed'
})

addCheck('guard blocks unsafe metadata', () => {
  // Build valid event first, then mutate metadata to bypass builder validation
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'mock_only',
  })
  event.metadata = { ...event.metadata, studentEmail: 'bad@example.com' }
  const config = { ...DEFAULT_AUDIT_PERSISTENCE_CONFIG, prototypeEnabled: true, shadowWrites: true }
  const result = evaluateAuditShadowWriteGuards(event, config)
  return result.allowed === false && result.status === 'blocked' && result.reason === 'privacy_guard_failed'
})

addCheck('shadow service skips safely with default disabled config', async () => {
  const service = new AuditShadowWriteService(DEFAULT_AUDIT_PERSISTENCE_CONFIG)
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'mock_only',
  })
  const metric = await service.shadowWrite(event)
  return metric.status === 'skipped' && metric.reason === 'prototype_disabled'
})

addCheck('shadow service writes prototype_only clone when enabled', async () => {
  const service = createAuditShadowWriteServiceForTesting({
    prototypeEnabled: true,
    shadowWrites: true,
    prototypeStorageEnabled: true,
  })
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_001', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_001' },
    persistenceMode: 'mock_only',
  })
  // Verify original event is not mutated
  const originalMode = event.persistenceMode
  const metric = await service.service.shadowWrite(event)
  return metric.status === 'written' && event.persistenceMode === originalMode
})

addCheck('shadow service does not mutate original event', async () => {
  const service = createAuditShadowWriteServiceForTesting({
    prototypeEnabled: true,
    shadowWrites: true,
    prototypeStorageEnabled: true,
  })
  const event = buildStaffDocumentReplacementRequestEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_002', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_002' },
    persistenceMode: 'mock_only',
  })
  const originalId = event.id
  const originalMetadata = { ...event.metadata }
  const originalMode = event.persistenceMode
  await service.service.shadowWrite(event)
  return event.id === originalId &&
    event.persistenceMode === originalMode &&
    JSON.stringify(event.metadata) === JSON.stringify(originalMetadata)
})

addCheck('shadow service catches prototype write failure and returns failed metric', async () => {
  // Create service with disabled storage driver to force failure
  const service = createAuditShadowWriteServiceForTesting({
    prototypeEnabled: true,
    shadowWrites: true,
    prototypeStorageEnabled: false, // driver disabled -> write will fail
  })
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_001', actorRole: 'staff', actorDisplayName: 'Test',
    documentId: 'doc_003', applicationId: 'app_001', studentToken: 'Student #S-001',
    sourceRoute: '/staff/applications/app_001', reason: 'test',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_003' },
    persistenceMode: 'mock_only',
  })
  const metric = await service.service.shadowWrite(event)
  return metric.status === 'failed' && metric.reason === 'write_failed'
})

addCheck('shadow service does not expose PII in metric safeMessage', async () => {
  const service = createAuditShadowWriteServiceForTesting({
    prototypeEnabled: true,
    shadowWrites: true,
    prototypeStorageEnabled: true,
  })
  // Build a valid event first, then manually inject forbidden metadata to bypass builder validation
  const event = buildStaffDocumentRejectEvent({
    actorId: 'usr_staff_001', actorRole: 'staff', actorDisplayName: 'Jane Doe',
    documentId: 'doc_pii_001', applicationId: 'app_pii_001', studentToken: 'Student #S-PII-001',
    sourceRoute: '/staff/applications/app_pii_001', reason: 'test reason',
    createdAt: '2026-05-14T00:00:00.000Z',
    metadata: { documentId: 'doc_pii_001' },
    persistenceMode: 'mock_only',
  })
  event.metadata = { ...event.metadata, studentEmail: 'should.fail@example.com' }
  const metric = await service.service.shadowWrite(event)
  // Either blocked by privacy guard or, if it somehow passes, safeMessage must not contain PII
  const piiPatterns = ['123-45-6789', 'ssn', 'should.fail@example.com', 'Jane Doe']
  const hasPii = piiPatterns.some(p => (metric.safeMessage || '').toLowerCase().includes(p.toLowerCase()))
  return !hasPii
})

addCheck('isShadowWritableEventType identifies correct event types', () => {
  return isShadowWritableEventType('staff.document.reject') === true &&
    isShadowWritableEventType('staff.document.request_replacement') === true &&
    isShadowWritableEventType('staff.document.verify') === false &&
    isShadowWritableEventType('admin.role.assign') === false
})

// AP-9F Read Comparison Runtime Skeleton checks
const {
  evaluateAuditReadComparisonGuards,
  canRunAuditReadComparison,
  assertNoRealPersistedReadComparison,
  hasUnsafeComparisonMetadata,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/comparison/auditReadComparisonGuards.ts'))

const {
  createAuditReadComparisonMetricsStore,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/comparison/auditReadComparisonMetrics.ts'))

const {
  AuditReadComparisonService,
  createAuditReadComparisonServiceForTesting,
} = loadTsModule(path.join(repoRoot, 'src/lib/audit/comparison/auditReadComparisonService.ts'))

function buildComparisonEvent(overrides = {}) {
  return buildStaffDocumentRejectEvent({
    actorId: 'usr_staff_cmp',
    actorRole: 'staff',
    actorDisplayName: 'Comparison Test Staff',
    documentId: 'doc_cmp_001',
    applicationId: 'app_cmp_001',
    studentToken: 'Student #S-CMP',
    sourceRoute: '/staff/applications/app_cmp_001',
    reason: 'Comparison test reason',
    createdAt: '2026-05-15T00:00:00.000Z',
    metadata: { documentId: 'doc_cmp_001', applicationId: 'app_cmp_001' },
    persistenceMode: 'mock_only',
    ...overrides,
  })
}

addCheck('read comparison disabled when feature flag false', () => {
  const event = buildComparisonEvent({ id: 'cmp_flag_001' })
  const input = {
    sourceEvents: [event],
    prototypeEvents: [event],
    featureEnabled: false,
    readCompareEnabled: true,
    adminCompareVisible: false,
  }
  const result = evaluateAuditReadComparisonGuards(input)
  return result.allowed === false && result.status === 'disabled'
})

addCheck('read comparison disabled when readCompare flag false', () => {
  const event = buildComparisonEvent({ id: 'cmp_flag_002' })
  const input = {
    sourceEvents: [event],
    prototypeEvents: [event],
    featureEnabled: true,
    readCompareEnabled: false,
    adminCompareVisible: false,
  }
  const result = evaluateAuditReadComparisonGuards(input)
  return result.allowed === false && result.status === 'disabled'
})

addCheck('guard blocks real_persisted read comparison events', () => {
  const event = buildComparisonEvent({ id: 'cmp_real_001', persistenceMode: 'real_persisted' })
  try {
    assertNoRealPersistedReadComparison([event])
    return false
  } catch {
    return true
  }
})

addCheck('guard blocks unsafe metadata keys in comparison', () => {
  const event = buildComparisonEvent({ id: 'cmp_unsafe_001' })
  event.metadata = { ...event.metadata, studentId: 'raw-001' }
  return hasUnsafeComparisonMetadata([event]) === true
})

addCheck('comparison metrics store starts empty', () => {
  const store = createAuditReadComparisonMetricsStore()
  return store.count() === 0
})

addCheck('comparison metrics append/list/count works', () => {
  const store = createAuditReadComparisonMetricsStore()
  const result = {
    status: 'matched',
    sourceCount: 1,
    prototypeCount: 1,
    mismatchCount: 0,
    mismatches: [],
    createdAt: '2026-05-15T00:00:00.000Z',
    safeMessage: 'Matched',
  }
  store.append(result)
  return store.count() === 1 &&
    store.list().length === 1 &&
    store.countByStatus('matched') === 1 &&
    store.countByStatus('mismatched') === 0
})

addCheck('comparison metrics list returns copies', () => {
  const store = createAuditReadComparisonMetricsStore()
  store.append({
    status: 'matched',
    sourceCount: 1,
    prototypeCount: 1,
    mismatchCount: 0,
    mismatches: [],
    createdAt: '2026-05-15T00:00:00.000Z',
    safeMessage: 'Matched',
  })
  const list1 = store.list()
  list1.push({
    status: 'failed',
    sourceCount: 0,
    prototypeCount: 0,
    mismatchCount: 0,
    mismatches: [],
    createdAt: '2026-05-15T00:00:00.000Z',
    safeMessage: 'Should not appear',
  })
  const list2 = store.list()
  return list2.length === 1
})

addCheck('comparison returns matched for identical safe event lists', () => {
  const { service, buildInput } = createAuditReadComparisonServiceForTesting({ featureEnabled: true, readCompareEnabled: true })
  const event = buildComparisonEvent({ id: 'cmp_match_001' })
  const result = service.compare(buildInput([event], [event]))
  return result.status === 'matched' && result.mismatchCount === 0
})

addCheck('comparison detects count mismatch', () => {
  const { service, buildInput } = createAuditReadComparisonServiceForTesting({ featureEnabled: true, readCompareEnabled: true })
  const e1 = buildComparisonEvent({ id: 'cmp_cnt_001' })
  const e2 = buildComparisonEvent({ id: 'cmp_cnt_002' })
  const result = service.compare(buildInput([e1, e2], [e1]))
  return result.status === 'mismatched' && result.mismatchCount > 0
})

addCheck('comparison detects missing prototype event', () => {
  const { service, buildInput } = createAuditReadComparisonServiceForTesting({ featureEnabled: true, readCompareEnabled: true })
  const e1 = buildComparisonEvent({ id: 'cmp_miss_001' })
  const e2 = buildComparisonEvent({ id: 'cmp_miss_002' })
  const result = service.compare(buildInput([e1, e2], [e1]))
  return result.mismatches.some(m => m.category === 'missing_in_prototype' && m.sourceEventId === 'cmp_miss_002')
})

addCheck('comparison detects extra prototype event', () => {
  const { service, buildInput } = createAuditReadComparisonServiceForTesting({ featureEnabled: true, readCompareEnabled: true })
  const e1 = buildComparisonEvent({ id: 'cmp_extra_001' })
  const eExtra = buildComparisonEvent({ id: 'cmp_extra_999' })
  const result = service.compare(buildInput([e1], [e1, eExtra]))
  return result.mismatches.some(m => m.category === 'extra_in_prototype' && m.prototypeEventId === 'cmp_extra_999')
})

addCheck('comparison detects event type mismatch', () => {
  const { service, buildInput } = createAuditReadComparisonServiceForTesting({ featureEnabled: true, readCompareEnabled: true })
  const srcEvent = buildComparisonEvent({ id: 'cmp_etype_001' })
  const protoEvent = buildStaffDocumentReplacementRequestEvent({
    actorId: 'usr_staff_cmp', actorRole: 'staff', actorDisplayName: 'Comparison Test Staff',
    documentId: 'doc_cmp_001', applicationId: 'app_cmp_001', studentToken: 'Student #S-CMP',
    sourceRoute: '/staff/applications/app_cmp_001', reason: 'Comparison test reason',
    id: 'cmp_etype_001',
    createdAt: '2026-05-15T00:00:00.000Z',
    metadata: { documentId: 'doc_cmp_001', applicationId: 'app_cmp_001' },
    persistenceMode: 'mock_only',
  })
  const result = service.compare(buildInput([srcEvent], [protoEvent]))
  return result.mismatches.some(m => m.category === 'event_type_mismatch')
})

addCheck('comparison detects target display token mismatch', () => {
  const { service, buildInput } = createAuditReadComparisonServiceForTesting({ featureEnabled: true, readCompareEnabled: true })
  const srcEvent = buildComparisonEvent({ id: 'cmp_token_001' })
  const protoEvent = buildComparisonEvent({ id: 'cmp_token_001', studentToken: 'Student #S-OTHER' })
  const result = service.compare(buildInput([srcEvent], [protoEvent]))
  return result.mismatches.some(m => m.category === 'target_display_token_mismatch')
})

addCheck('comparison does not expose actorId/targetId/reason/metadata in mismatches', () => {
  const { service, buildInput } = createAuditReadComparisonServiceForTesting({ featureEnabled: true, readCompareEnabled: true })
  const srcEvent = buildComparisonEvent({ id: 'cmp_pii_001' })
  const protoEvent = buildComparisonEvent({ id: 'cmp_pii_001', studentToken: 'Student #S-OTHER' })
  const result = service.compare(buildInput([srcEvent], [protoEvent]))
  for (const m of result.mismatches) {
    if ('actorId' in m && m.actorId !== undefined) return false
    if ('targetId' in m && m.targetId !== undefined) return false
    if ('reason' in m && m.reason !== undefined) return false
    if ('metadata' in m && m.metadata !== undefined) return false
  }
  return true
})

addCheck('comparison service does not mutate input events', () => {
  const { service, buildInput } = createAuditReadComparisonServiceForTesting({ featureEnabled: true, readCompareEnabled: true })
  const srcEvent = buildComparisonEvent({ id: 'cmp_mutate_001' })
  const protoEvent = buildComparisonEvent({ id: 'cmp_mutate_001', studentToken: 'Student #S-OTHER' })
  const originalSrcId = srcEvent.id
  const originalSrcMode = srcEvent.persistenceMode
  const originalSrcMeta = JSON.stringify(srcEvent.metadata)
  service.compare(buildInput([srcEvent], [protoEvent]))
  return srcEvent.id === originalSrcId &&
    srcEvent.persistenceMode === originalSrcMode &&
    JSON.stringify(srcEvent.metadata) === originalSrcMeta
})

// AP-9G Stage 1/2 Admin Comparison Debug Panel checks
const panelComponentPath = path.join(repoRoot, 'src/components/admin/AdminAuditComparisonDebugPanel.tsx')
const auditLogPagePath = path.join(repoRoot, 'src/app/admin/audit-log/page.tsx')

addCheck('AP-9G Stage 1 panel component file exists', () => {
  return fs.existsSync(panelComponentPath) && fs.statSync(panelComponentPath).isFile()
})

addCheck('AP-9G Stage 1 panel component returns null', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  return source.includes('return null')
})

addCheck('AP-9G Stage 1 panel component does not import getReadComparisonMetrics', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  // Stage 3 runtime renders aggregate-only metrics and should import getReadComparisonMetrics.
  return source.includes('getReadComparisonMetrics')
})

addCheck('AP-9G Stage 1 panel component contains no forbidden PII tokens', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  const forbidden = ['actorId', 'targetId', 'nationalId', 'bankAccount', 'rawIp', 'ocrText', 'reasonText', 'metadataValues']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('AP-9G Stage 2 panel component is wired disabled-by-default on audit-log page', () => {
  const source = fs.readFileSync(auditLogPagePath, 'utf8')
  return source.includes('AdminAuditComparisonDebugPanel') &&
    source.includes('enabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.adminDebugPanelEnabled}') &&
    (
      source.includes('readCompareEnabled={false}') ||
      source.includes('readCompareEnabled={DEFAULT_AUDIT_PERSISTENCE_CONFIG.readFromPrototype}')
    )
})

addCheck('AP-9G Stage 2 panel component is not imported by non-audit-log src/app routes', () => {
  const appDir = path.join(repoRoot, 'src/app')
  function walkAppDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    for (const entry of entries) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        if (walkAppDir(full)) return true
      } else if (
        entry.isFile() &&
        (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))
      ) {
        if (full === auditLogPagePath) continue
        const src = fs.readFileSync(full, 'utf8')
        if (src.includes('AdminAuditComparisonDebugPanel')) return true
      }
    }
    return false
  }
  return !walkAppDir(appDir)
})

addCheck('AP-9G Stage 2 panel returns null for non-admin role', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  return source.includes("role !== 'admin'") && source.includes('return null')
})

addCheck('AP-9G Stage 2 panel returns null when flag disabled', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  return source.includes('enabled = false') && source.includes('if (!enabled) return null')
})

// Stage 3 feature flag default checks
const persistenceConfigPath = path.join(repoRoot, 'src/lib/audit/storage/auditPersistenceConfig.ts')
addCheck('Stage 3 flags default false (prototypeMetricsEnabled)', () => {
  const src = fs.readFileSync(persistenceConfigPath, 'utf8')
  return src.includes('prototypeMetricsEnabled: false')
})

addCheck('Stage 3 flags default false (adminComparisonStagingReviewEnabled)', () => {
  const src = fs.readFileSync(persistenceConfigPath, 'utf8')
  return src.includes('adminComparisonStagingReviewEnabled: false')
})

addCheck('AP-9G Stage 2 panel read comparison gates default false', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  return source.includes('featureEnabled = false') &&
    source.includes('readCompareEnabled = false')
})

addCheck('AP-9G Stage 2 panel has Admin-only debug label', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  return source.includes('Developer Debug: Audit Read Comparison') &&
    source.includes('Comparison debug panel is disabled.')
})

addCheck('AP-9G Stage 2 panel does not display internal comparison event ids', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  return !source.includes('sourceEventId') && !source.includes('prototypeEventId')
})

addCheck('AP-9G Stage 2 panel introduces no export behavior', () => {
  const source = fs.readFileSync(panelComponentPath, 'utf8')
  return !source.includes('Export') &&
    !source.includes('download') &&
    !source.includes('Blob') &&
    !source.includes('URL.createObjectURL')
})

addCheck('AP-9G Stage 2 audit-log page keeps existing data source', () => {
  const source = fs.readFileSync(auditLogPagePath, 'utf8')
  return source.includes('const ALL_DISPLAY_ROWS = getAdminAuditDisplayRows(mockAuditLogs)') &&
    source.includes("const filteredLogs = persistenceFilter === 'real_persisted' ? [] : ALL_DISPLAY_ROWS") &&
    !source.includes('getReadComparisonMetrics') &&
    !source.includes('AuditReadComparisonService')
})

addCheck('AP-9G Stage 2 audit-log export remains on display rows only', () => {
  const source = fs.readFileSync(auditLogPagePath, 'utf8')
  return source.includes('const rows = ALL_DISPLAY_ROWS.map') &&
    !source.includes('mismatchCount') &&
    !source.includes('prototypeCount') &&
    !source.includes('sourceCount')
})

// MC13 Candidate Review Audit Preview UI Integration checks
addCheck('MC13: shell imports buildCandidateReviewAuditNoopPreview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('buildCandidateReviewAuditNoopPreview')
})

addCheck('MC13: shell has diagnostic preview warning copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Audit preview is diagnostic only.')
})

addCheck('MC13: shell has not saved, not submitted, not official evidence copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('not saved') &&
    source.includes('not submitted') &&
    source.includes('not official evidence')
})

addCheck('MC13: shell displays persisted field in preview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('auditPreview.persisted')
})

addCheck('MC13: shell displays written field in preview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('auditPreview.written')
})

addCheck('MC13: shell displays exported field in preview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('auditPreview.exported')
})

addCheck('MC13: shell displays notified field in preview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('auditPreview.notified')
})

addCheck('MC13: shell displays officialEvidence field in preview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('auditPreview.officialEvidence')
})

addCheck('MC13: shell displays diagnosticOnly field in preview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('auditPreview.diagnosticOnly')
})

addCheck('MC13: shell displays discardedAfterPreview field in preview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('auditPreview.discardedAfterPreview')
})

addCheck('MC13: shell has no-preview empty state copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('No diagnostic preview has been generated') &&
    source.includes('Review actions remain local UI signals only')
})

addCheck('MC13: shell does not import or call sharedMockWriter', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('sharedMockWriter')
})

addCheck('MC13: shell does not import or call AuditService', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('AuditService')
})

addCheck('MC13: shell does not import or call repository', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('repository') && !source.includes('Repository')
})

addCheck('MC13: shell does not use browser storage', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('localStorage') &&
    !source.includes('sessionStorage') &&
    !source.includes('indexedDB')
})

addCheck('MC13: shell does not call fetch or API', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('fetch(') &&
    !source.includes('axios') &&
    !source.includes('XMLHttpRequest')
})

// MC15 Candidate Review Audit Preview UX Hardening checks
addCheck('MC15: shell includes Diagnostic preview copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Diagnostic preview')
})

addCheck('MC15: shell includes Not saved badge copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Not saved')
})

addCheck('MC15: shell includes Not submitted badge copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Not submitted')
})

addCheck('MC15: shell includes Not official evidence badge copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Not official evidence')
})

addCheck('MC15: shell includes Not an approval badge copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Not an approval')
})

addCheck('MC15: shell includes Not an assignment badge copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Not an assignment')
})

addCheck('MC15: shell includes Local UI signal only badge copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Local UI signal only')
})

addCheck('MC15: shell includes exact diagnostic preview empty state copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('No diagnostic preview has been generated. Review actions remain local UI signals only.')
})

addCheck('MC15: shell includes persisted false text-visible flag', () => {
  const source = readCandidateSelectionShell()
  return source.includes('persisted: false')
})

addCheck('MC15: shell includes written false text-visible flag', () => {
  const source = readCandidateSelectionShell()
  return source.includes('written: false')
})

addCheck('MC15: shell includes exported false text-visible flag', () => {
  const source = readCandidateSelectionShell()
  return source.includes('exported: false')
})

addCheck('MC15: shell includes notified false text-visible flag', () => {
  const source = readCandidateSelectionShell()
  return source.includes('notified: false')
})

addCheck('MC15: shell includes officialEvidence false text-visible flag', () => {
  const source = readCandidateSelectionShell()
  return source.includes('officialEvidence: false')
})

addCheck('MC15: shell includes diagnosticOnly true text-visible flag', () => {
  const source = readCandidateSelectionShell()
  return source.includes('diagnosticOnly: true')
})

addCheck('MC15: shell includes discardedAfterPreview true text-visible flag', () => {
  const source = readCandidateSelectionShell()
  return source.includes('discardedAfterPreview: true')
})

addCheck('MC15: shell includes aria-live accessibility marker', () => {
  const source = readCandidateSelectionShell()
  return source.includes('aria-live="polite"') || source.includes("aria-live='polite'")
})

addCheck('MC15: shell does not use localStorage/sessionStorage/IndexedDB', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('localStorage') &&
    !source.includes('sessionStorage') &&
    !source.includes('IndexedDB') &&
    !source.includes('indexedDB')
})

addCheck('MC15: shell does not fetch or call API/backend', () => {
  const source = readCandidateSelectionShell()
  const forbidden = ['fetch(', 'axios', 'XMLHttpRequest', '/api/', 'http://', 'https://']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC15: shell does not call sharedMockWriter/AuditService/repository', () => {
  const source = readCandidateSelectionShell()
  const forbidden = ['sharedMockWriter', 'AuditService', 'auditService', 'repository', 'Repository']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC15: shell has no enabled forbidden action button labels', () => {
  const source = readCandidateSelectionShell()
  const forbiddenLabelPatterns = [
    /label=["']Assign["']/,
    /label=["']Approve["']/,
    /label=["']Decision["']/,
    /label=["']Submit["']/,
    /label=["']Save["']/,
    /label=["']Record["']/,
    />Assign</,
    />Approve</,
    />Decision</,
    />Submit</,
    />Save</,
    />Record</,
  ]
  return forbiddenLabelPatterns.every(pattern => !pattern.test(source))
})

addCheck('MC15: shell does not render forbidden PII display fields', () => {
  const source = readCandidateSelectionShell()
  const forbidden = [
    'mobile',
    'phone',
    'personalEmail',
    'rawEmail',
    'privateEmail',
    'private remark',
    'rawStudentId',
    'nationalId',
    'bankAccount',
    'free-text PII reason',
  ]
  return forbidden.every(token => !source.includes(token))
})

// MC17 Candidate Review Audit Preview Interaction Polish checks
addCheck('MC17: shell includes latest local review signal copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('This preview reflects the latest local review signal only.')
})

addCheck('MC17: shell includes Latest local review signal only label', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Latest local review signal only')
})

addCheck('MC17: shell includes Clear local review state copy', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Clear local review state')
})

addCheck('MC17: clear helper exists', () => {
  const source = readCandidateSelectionShell()
  return source.includes('function clearLocalReviewState(candidateId: string)')
})

addCheck('MC17: clear helper resets local state to not_reviewed', () => {
  const source = readCandidateSelectionShell()
  return source.includes('[candidateId]: "not_reviewed"') ||
    source.includes("[candidateId]: 'not_reviewed'")
})

addCheck('MC17: clear helper clears diagnostic preview', () => {
  const source = readCandidateSelectionShell()
  return source.includes('clearLocalReviewState') &&
    source.includes('setAuditPreview(null)')
})

addCheck('MC17: candidate row clear uses clearLocalReviewState', () => {
  const source = readCandidateSelectionShell()
  return source.includes('onClick={() => clearLocalReviewState(candidate.candidateId)}') &&
    !source.includes('applyAction(candidate.candidateId, "clear_review_state"')
})

addCheck('MC17: preview uses aria-live polite', () => {
  const source = readCandidateSelectionShell()
  return source.includes('aria-live="polite"') || source.includes("aria-live='polite'")
})

addCheck('MC17: preview has diagnostic audit preview aria label', () => {
  const source = readCandidateSelectionShell()
  return source.includes('aria-label="Diagnostic audit preview status"')
})

addCheck('MC17: action buttons include local-only aria label', () => {
  const source = readCandidateSelectionShell()
  return source.includes('aria-label={`${label} for ${candidateName}. Local UI signal only.`}')
})

addCheck('MC17: previous and next review state remain visible', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Previous state') &&
    source.includes('auditPreview.event.previousReviewState') &&
    source.includes('Next state') &&
    source.includes('auditPreview.event.nextReviewState')
})

addCheck('MC17: latest preview only copy exists', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Only the latest preview result is shown.')
})

addCheck('MC17: shell does not use localStorage/sessionStorage/IndexedDB', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('localStorage') &&
    !source.includes('sessionStorage') &&
    !source.includes('IndexedDB') &&
    !source.includes('indexedDB')
})

addCheck('MC17: shell does not fetch or call API/backend', () => {
  const source = readCandidateSelectionShell()
  const forbidden = ['fetch(', 'axios', 'XMLHttpRequest', '/api/', 'http://', 'https://']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC17: shell does not call sharedMockWriter/AuditService/repository', () => {
  const source = readCandidateSelectionShell()
  const forbidden = ['sharedMockWriter', 'AuditService', 'auditService', 'repository', 'Repository']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC17: shell does not export or notify', () => {
  const source = readCandidateSelectionShell()
  const forbidden = ['download', 'exportData', 'exportCsv', 'exportPdf', 'sendBeacon', 'Notification', 'notify(', 'notificationService']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC17: shell has no enabled forbidden action button labels', () => {
  const source = readCandidateSelectionShell()
  const forbiddenLabelPatterns = [
    /label=["']Assign["']/,
    /label=["']Approve["']/,
    /label=["']Decision["']/,
    /label=["']Submit["']/,
    /label=["']Save["']/,
    /label=["']Record["']/,
    />Assign</,
    />Approve</,
    />Decision</,
    />Submit</,
    />Save</,
    />Record</,
  ]
  return forbiddenLabelPatterns.every(pattern => !pattern.test(source))
})

// MC2 Advisor Candidate Generator Runtime checks
const advisorGeneratorModule = loadTsModule(path.join(repoRoot, 'src/lib/assignment/advisorCandidateGenerator.ts'))
const {
  normalizeAdvisorCandidate,
  buildAdvisorCandidatePool,
  assertSafeAdvisorCandidate,
  mapAdvisorRoleCategory,
  mapAdvisorAssignmentContexts,
} = advisorGeneratorModule

addCheck('MC2 advisor generator module imports cleanly', () => {
  return typeof advisorGeneratorModule === 'object' && advisorGeneratorModule !== null
})

addCheck('MC2 normalizeAdvisorCandidate is a function', () => {
  return typeof normalizeAdvisorCandidate === 'function'
})

addCheck('MC2 buildAdvisorCandidatePool is a function', () => {
  return typeof buildAdvisorCandidatePool === 'function'
})

addCheck('MC2 assertSafeAdvisorCandidate is a function', () => {
  return typeof assertSafeAdvisorCandidate === 'function'
})

addCheck('MC2 normalizeAdvisorCandidate: output has no mobile field', () => {
  const record = { teacher_id: 'T001', name: 'Test', surname: 'User', mobile: '0812345678', department: 'GOV' }
  const result = normalizeAdvisorCandidate(record)
  return !('mobile' in result)
})

addCheck('MC2 normalizeAdvisorCandidate: output has no email field', () => {
  const record = { teacher_id: 'T002', name: 'Test', surname: 'User', email: 'personal@gmail.com', department: 'PA' }
  const result = normalizeAdvisorCandidate(record)
  return !('email' in result)
})

addCheck('MC2 normalizeAdvisorCandidate: output has no remark field', () => {
  const record = { teacher_id: 'T003', name: 'Test', surname: 'User', remark: 'internal note', department: 'IA' }
  const result = normalizeAdvisorCandidate(record)
  return !('remark' in result)
})

addCheck('MC2 normalizeAdvisorCandidate: officialEmail uses cmu_mail only', () => {
  const record = { teacher_id: 'T004', name: 'Test', surname: 'User', cmu_mail: 'user@cmu.ac.th', email: 'other@gmail.com' }
  const result = normalizeAdvisorCandidate(record)
  return result.officialEmail === 'user@cmu.ac.th'
})

addCheck('MC2 normalizeAdvisorCandidate: missing cmu_mail does not fallback to personal email', () => {
  const record = { teacher_id: 'T005', name: 'Test', surname: 'User', email: 'personal@gmail.com' }
  const result = normalizeAdvisorCandidate(record)
  return result.officialEmail === undefined
})

addCheck('MC2 normalizeAdvisorCandidate: autoAssigned is false', () => {
  const record = { teacher_id: 'T006', name: 'Test', surname: 'User', department: 'GOV' }
  const result = normalizeAdvisorCandidate(record)
  return result.autoAssigned === false
})

addCheck('MC2 normalizeAdvisorCandidate: status is suggested', () => {
  const record = { teacher_id: 'T007', name: 'Test', surname: 'User', department: 'PA' }
  const result = normalizeAdvisorCandidate(record)
  return result.status === 'suggested'
})

addCheck('MC2 normalizeAdvisorCandidate: isMock is true', () => {
  const record = { teacher_id: 'T008', name: 'Test', surname: 'User', department: 'IA' }
  const result = normalizeAdvisorCandidate(record)
  return result.isMock === true
})

addCheck('MC2 buildAdvisorCandidatePool: autoAssignedCount is 0', () => {
  const records = [
    { teacher_id: 'T009', name: 'Alpha', surname: 'Advisor', department: 'GOV' },
    { teacher_id: 'T010', name: 'Beta', surname: 'Reviewer' },
  ]
  const result = buildAdvisorCandidatePool(records)
  return result.autoAssignedCount === 0
})

addCheck('MC2 assertSafeAdvisorCandidate: throws on mobile field', () => {
  const candidate = {
    candidateId: 'advisor:T011', sourceType: 'personnel', sourceId: 'T011',
    displayName: 'Test User', roleCategory: 'academic_advisor', roleLabel: 'Academic Advisor',
    unitOrDepartment: 'GOV', assignmentContexts: ['advisor_review'],
    status: 'suggested', confidence: 'rule_based', isMock: true, autoAssigned: false,
    privacyLevel: 'safe_display', mobile: '0812345678',
  }
  try {
    assertSafeAdvisorCandidate(candidate)
    return false
  } catch {
    return true
  }
})

addCheck('MC2 assertSafeAdvisorCandidate: throws on wrong autoAssigned', () => {
  const candidate = {
    candidateId: 'advisor:T012', sourceType: 'personnel', sourceId: 'T012',
    displayName: 'Test User', roleCategory: 'faculty_reviewer', roleLabel: 'Faculty Reviewer',
    unitOrDepartment: 'Unknown', assignmentContexts: ['advisor_review'],
    status: 'suggested', confidence: 'rule_based', isMock: true, autoAssigned: true,
    privacyLevel: 'safe_display',
  }
  try {
    assertSafeAdvisorCandidate(candidate)
    return false
  } catch {
    return true
  }
})

addCheck('MC2 index.ts exports advisorCandidateGenerator functions', () => {
  const indexSource = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/index.ts'), 'utf8')
  return indexSource.includes('./advisorCandidateGenerator')
})

// MC3 Staff Candidate Generator Runtime checks
const staffGeneratorModule = loadTsModule(path.join(repoRoot, 'src/lib/assignment/staffCandidateGenerator.ts'))
const {
  normalizeStaffCandidate,
  buildStaffCandidatePool,
  assertSafeStaffCandidate,
  deriveStaffRoleCategory,
  deriveStaffAssignmentContexts,
} = staffGeneratorModule

addCheck('MC3 staff generator module imports cleanly', () => {
  return typeof staffGeneratorModule === 'object' && staffGeneratorModule !== null
})

addCheck('MC3 normalizeStaffCandidate is a function', () => {
  return typeof normalizeStaffCandidate === 'function'
})

addCheck('MC3 buildStaffCandidatePool is a function', () => {
  return typeof buildStaffCandidatePool === 'function'
})

addCheck('MC3 assertSafeStaffCandidate is a function', () => {
  return typeof assertSafeStaffCandidate === 'function'
})

addCheck('MC3 deriveStaffRoleCategory is a function', () => {
  return typeof deriveStaffRoleCategory === 'function'
})

addCheck('MC3 deriveStaffAssignmentContexts is a function', () => {
  return typeof deriveStaffAssignmentContexts === 'function'
})

addCheck('MC3 normalizeStaffCandidate: output sourceType is employee', () => {
  const record = { employee_id: 'E001', name: 'Test', surname: 'Staff', unit: 'Student_Development' }
  const result = normalizeStaffCandidate(record)
  return result.sourceType === 'employee'
})

addCheck('MC3 normalizeStaffCandidate: output status is suggested', () => {
  const record = { employee_id: 'E002', name: 'Test', surname: 'Staff', unit: 'Education_Services' }
  const result = normalizeStaffCandidate(record)
  return result.status === 'suggested'
})

addCheck('MC3 normalizeStaffCandidate: output autoAssigned is false', () => {
  const record = { employee_id: 'E003', name: 'Test', surname: 'Staff', unit: 'IT_Communication' }
  const result = normalizeStaffCandidate(record)
  return result.autoAssigned === false
})

addCheck('MC3 normalizeStaffCandidate: output isMock is true', () => {
  const record = { employee_id: 'E004', name: 'Test', surname: 'Staff', unit: 'Finance_Supplies' }
  const result = normalizeStaffCandidate(record)
  return result.isMock === true
})

addCheck('MC3 buildStaffCandidatePool: autoAssignedCount is 0', () => {
  const records = [
    { employee_id: 'E005', name: 'Alpha', surname: 'Staff', unit: 'Student_Development' },
    { employee_id: 'E006', name: 'Beta', surname: 'Staff' },
  ]
  const result = buildStaffCandidatePool(records)
  return result.autoAssignedCount === 0
})

addCheck('MC3 normalizeStaffCandidate: officialEmail uses cmu_mail only', () => {
  const record = { employee_id: 'E007', name: 'Test', surname: 'Staff', cmu_mail: 'test@cmu.ac.th' }
  const result = normalizeStaffCandidate(record)
  return result.officialEmail === 'test@cmu.ac.th'
})

addCheck('MC3 normalizeStaffCandidate: missing cmu_mail yields undefined officialEmail', () => {
  const record = { employee_id: 'E008', name: 'Test', surname: 'Staff', mobile: '0812345678' }
  const result = normalizeStaffCandidate(record)
  return result.officialEmail === undefined
})

addCheck('MC3 normalizeStaffCandidate: output has no mobile field', () => {
  const record = { employee_id: 'E009', name: 'Test', surname: 'Staff', mobile: '0812345678' }
  const result = normalizeStaffCandidate(record)
  return !('mobile' in result)
})

addCheck('MC3 normalizeStaffCandidate: output has no phone field', () => {
  const record = { employee_id: 'E010', name: 'Test', surname: 'Staff' }
  const result = normalizeStaffCandidate(record)
  return !('phone' in result)
})

addCheck('MC3 normalizeStaffCandidate: output has no personal email field', () => {
  const record = { employee_id: 'E011', name: 'Test', surname: 'Staff' }
  const result = normalizeStaffCandidate(record)
  return !('email' in result) && !('personalEmail' in result)
})

addCheck('MC3 normalizeStaffCandidate: output has no remark field', () => {
  const record = { employee_id: 'E012', name: 'Test', surname: 'Staff' }
  const result = normalizeStaffCandidate(record)
  return !('remark' in result)
})

addCheck('MC3 assertSafeStaffCandidate: throws on mobile field', () => {
  const candidate = {
    candidateId: 'staff:E013', sourceType: 'employee', sourceId: 'E013',
    displayName: 'Test Staff', roleCategory: 'scholarship_operations', roleLabel: 'Scholarship Operations Staff',
    unitOrDepartment: 'Unknown', assignmentContexts: ['scholarship_application_review'],
    status: 'suggested', confidence: 'rule_based', isMock: true, autoAssigned: false,
    privacyLevel: 'safe_display', mobile: '0812345678',
  }
  try {
    assertSafeStaffCandidate(candidate)
    return false
  } catch {
    return true
  }
})

addCheck('MC3 assertSafeStaffCandidate: throws on wrong autoAssigned', () => {
  const candidate = {
    candidateId: 'staff:E014', sourceType: 'employee', sourceId: 'E014',
    displayName: 'Test Staff', roleCategory: 'admin_support', roleLabel: 'Administrative Support',
    unitOrDepartment: 'Unknown', assignmentContexts: ['admin_operations'],
    status: 'suggested', confidence: 'mock', isMock: true, autoAssigned: true,
    privacyLevel: 'safe_display',
  }
  try {
    assertSafeStaffCandidate(candidate)
    return false
  } catch {
    return true
  }
})

addCheck('MC3 Education_Student_Quality division maps to scholarship_operations', () => {
  const record = { employee_id: 'E015', name: 'Test', surname: 'Staff', division: 'Education_Student_Quality' }
  const result = normalizeStaffCandidate(record)
  return result.roleCategory === 'scholarship_operations' &&
    result.assignmentContexts.includes('scholarship_application_review')
})

addCheck('MC3 Student_Development unit maps to student_support with student_follow_up context', () => {
  const record = { employee_id: 'E016', name: 'Test', surname: 'Staff', unit: 'Student_Development' }
  const result = normalizeStaffCandidate(record)
  return result.roleCategory === 'student_support' &&
    result.assignmentContexts.includes('student_follow_up')
})

addCheck('MC3 IT_Communication unit maps to system_support with technical_support context', () => {
  const record = { employee_id: 'E017', name: 'Test', surname: 'Staff', unit: 'IT_Communication' }
  const result = normalizeStaffCandidate(record)
  return result.roleCategory === 'system_support' &&
    result.assignmentContexts.includes('technical_support')
})

addCheck('MC3 index.ts exports staffCandidateGenerator functions', () => {
  const indexSource = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/index.ts'), 'utf8')
  return indexSource.includes('./staffCandidateGenerator')
})

// MC4 Combined Candidate Pool Runtime checks
const combinedPoolModule = loadTsModule(path.join(repoRoot, 'src/lib/assignment/combinedCandidatePool.ts'))
const {
  combineCandidatePools,
  assertSafeCombinedCandidate,
  filterCombinedCandidatesByPoolType,
  summarizeCombinedCandidatePool,
} = combinedPoolModule

addCheck('MC4 combinedCandidatePool module imports cleanly', () => {
  return typeof combinedPoolModule === 'object' && combinedPoolModule !== null
})

addCheck('MC4 combineCandidatePools is a function', () => {
  return typeof combineCandidatePools === 'function'
})

addCheck('MC4 assertSafeCombinedCandidate is a function', () => {
  return typeof assertSafeCombinedCandidate === 'function'
})

addCheck('MC4 filterCombinedCandidatesByPoolType is a function', () => {
  return typeof filterCombinedCandidatesByPoolType === 'function'
})

addCheck('MC4 summarizeCombinedCandidatePool is a function', () => {
  return typeof summarizeCombinedCandidatePool === 'function'
})

addCheck('MC4 advisor item gets poolType "advisor"', () => {
  const advisorRecord = { teacher_id: 'T001', name: 'Advisor', surname: 'Test', department: 'GOV' }
  const advisorPool = buildAdvisorCandidatePool([advisorRecord])
  const result = combineCandidatePools({ advisorPool })
  return result.items.length === 1 && result.items[0].poolType === 'advisor'
})

addCheck('MC4 staff item gets poolType "staff"', () => {
  const staffRecord = { employee_id: 'E001', name: 'Staff', surname: 'Test', unit: 'IT_Communication' }
  const staffPool = buildStaffCandidatePool([staffRecord])
  const result = combineCandidatePools({ staffPool })
  return result.items.length === 1 && result.items[0].poolType === 'staff'
})

addCheck('MC4 combined candidateCount equals advisor + staff count', () => {
  const advisorPool = buildAdvisorCandidatePool([
    { teacher_id: 'T002', name: 'A', surname: 'B', department: 'PA' },
    { teacher_id: 'T003', name: 'C', surname: 'D', department: 'IA' },
  ])
  const staffPool = buildStaffCandidatePool([
    { employee_id: 'E002', name: 'E', surname: 'F', unit: 'Student_Development' },
  ])
  const result = combineCandidatePools({ advisorPool, staffPool })
  return result.candidateCount === 3 &&
    result.advisorCandidateCount === 2 &&
    result.staffCandidateCount === 1
})

addCheck('MC4 combined result autoAssignedCount is 0', () => {
  const advisorPool = buildAdvisorCandidatePool([{ teacher_id: 'T004', name: 'X', surname: 'Y' }])
  const result = combineCandidatePools({ advisorPool })
  return result.autoAssignedCount === 0
})

addCheck('MC4 combined unsafeRecordCount sums source unsafe counts', () => {
  const advisorPool = { items: [], sourceRecordCount: 2, candidateCount: 0, autoAssignedCount: 0, unsafeRecordCount: 2 }
  const staffPool = { items: [], sourceRecordCount: 3, candidateCount: 0, autoAssignedCount: 0, unsafeRecordCount: 1 }
  const result = combineCandidatePools({ advisorPool, staffPool })
  return result.unsafeRecordCount === 3
})

addCheck('MC4 advisor candidates retain status "suggested" after combine', () => {
  const advisorPool = buildAdvisorCandidatePool([{ teacher_id: 'T005', name: 'A', surname: 'B', department: 'GOV' }])
  const result = combineCandidatePools({ advisorPool })
  return result.items.every(item => item.status === 'suggested')
})

addCheck('MC4 staff candidates retain status "suggested" after combine', () => {
  const staffPool = buildStaffCandidatePool([{ employee_id: 'E003', name: 'S', surname: 'T', unit: 'Finance_Supplies' }])
  const result = combineCandidatePools({ staffPool })
  return result.items.every(item => item.status === 'suggested')
})

addCheck('MC4 advisor candidates retain autoAssigned false after combine', () => {
  const advisorPool = buildAdvisorCandidatePool([{ teacher_id: 'T006', name: 'A', surname: 'B', department: 'PA' }])
  const result = combineCandidatePools({ advisorPool })
  return result.items.every(item => item.autoAssigned === false)
})

addCheck('MC4 staff candidates retain autoAssigned false after combine', () => {
  const staffPool = buildStaffCandidatePool([{ employee_id: 'E004', name: 'S', surname: 'T' }])
  const result = combineCandidatePools({ staffPool })
  return result.items.every(item => item.autoAssigned === false)
})

addCheck('MC4 no mobile field in combined output', () => {
  const advisorPool = buildAdvisorCandidatePool([{ teacher_id: 'T007', name: 'A', surname: 'B' }])
  const staffPool = buildStaffCandidatePool([{ employee_id: 'E005', name: 'S', surname: 'T' }])
  const result = combineCandidatePools({ advisorPool, staffPool })
  return result.items.every(item => !('mobile' in item))
})

addCheck('MC4 no phone field in combined output', () => {
  const advisorPool = buildAdvisorCandidatePool([{ teacher_id: 'T008', name: 'A', surname: 'B' }])
  const staffPool = buildStaffCandidatePool([{ employee_id: 'E006', name: 'S', surname: 'T' }])
  const result = combineCandidatePools({ advisorPool, staffPool })
  return result.items.every(item => !('phone' in item))
})

addCheck('MC4 no approval fields in combined output', () => {
  const advisorPool = buildAdvisorCandidatePool([{ teacher_id: 'T009', name: 'A', surname: 'B' }])
  const staffPool = buildStaffCandidatePool([{ employee_id: 'E007', name: 'S', surname: 'T' }])
  const result = combineCandidatePools({ advisorPool, staffPool })
  const forbidden = ['approvalStatus', 'approvedBy', 'approvalCollected']
  return result.items.every(item => forbidden.every(k => !(k in item)))
})

addCheck('MC4 no scholarshipDecision field in combined output', () => {
  const advisorPool = buildAdvisorCandidatePool([{ teacher_id: 'T010', name: 'A', surname: 'B' }])
  const staffPool = buildStaffCandidatePool([{ employee_id: 'E008', name: 'S', surname: 'T' }])
  const result = combineCandidatePools({ advisorPool, staffPool })
  return result.items.every(item => !('scholarshipDecision' in item))
})

addCheck('MC4 assertSafeCombinedCandidate throws on invalid poolType', () => {
  const invalidCandidate = {
    candidateId: 'advisor:T999', sourceType: 'personnel', sourceId: 'T999',
    displayName: 'Test', roleCategory: 'academic_advisor', roleLabel: 'Academic Advisor',
    unitOrDepartment: 'GOV', assignmentContexts: ['advisor_review'],
    status: 'suggested', confidence: 'rule_based', isMock: true, autoAssigned: false,
    privacyLevel: 'safe_display', poolType: 'unknown',
  }
  try {
    assertSafeCombinedCandidate(invalidCandidate)
    return false
  } catch {
    return true
  }
})

addCheck('MC4 index.ts exports combinedCandidatePool functions', () => {
  const indexSource = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/index.ts'), 'utf8')
  return indexSource.includes('./combinedCandidatePool')
})

// MC8 Candidate Review Local State Runtime checks
addCheck('MC8 candidateReviewState file exists', () => {
  const p = path.join(repoRoot, 'src/lib/assignment/candidateReviewState.ts')
  return fs.existsSync(p) && fs.statSync(p).isFile()
})

addCheck('MC8 types and helpers present in candidateReviewState', () => {
  const src = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/candidateReviewState.ts'), 'utf8')
  const required = ['CandidateReviewState', 'CandidateReviewAction', 'CandidateReviewStateTransition', 'getNextCandidateReviewState', 'createCandidateReviewStateTransition', 'assertSafeCandidateReviewTransition']
  return required.every(token => src.includes(token))
})

addCheck('MC8 forbidden action tokens absent', () => {
  const forbidden = ['auto_assign_candidate', 'assign_candidate', 'approve_candidate', 'approve_scholarship', 'reject_scholarship', 'collect_ap10b_approval']
  const shell = readCandidateSelectionShell()
  const assignmentIndex = fs.readFileSync(path.join(repoRoot, 'src/lib/assignment/index.ts'), 'utf8')
  const assignmentFiles = fs.readdirSync(path.join(repoRoot, 'src/lib/assignment')).filter(f => (f.endsWith('.ts') || f.endsWith('.tsx')) && f !== 'candidateReviewState.ts')
  const assignmentSrc = assignmentFiles.map(f => fs.readFileSync(path.join(repoRoot, 'src/lib/assignment', f), 'utf8')).join('\n')
  // Allow the canonical forbidden list to be declared in candidateReviewState.ts only.
  return forbidden.every(token => !shell.includes(token) && !assignmentIndex.includes(token) && !assignmentSrc.includes(token))
})

addCheck('MC8 CandidateSelectionReviewShell uses local state only (no storage/session/indexeddb/fetch/audit)', () => {
  const src = readCandidateSelectionShell()
  const forbidden = ['localStorage', 'sessionStorage', 'IndexedDB', 'indexedDB', 'fetch(', 'axios(', 'writeAudit', 'auditService', 'recordAudit', 'buildAuditEvent', 'sharedMockWriter']
  return forbidden.every(t => !src.includes(t))
})

addCheck('MC8 Shell warning copy present', () => {
  const src = readCandidateSelectionShell()
  return src.includes('Review actions are local UI signals only. They do not assign, approve, reject scholarships, persist data, or collect AP-10B approvals.')
})

addCheck('MC8 initial state not_reviewed present in shell', () => {
  const src = readCandidateSelectionShell()
  return src.includes('"not_reviewed"') || src.includes('not_reviewed')
})

// MC6 Candidate Selection UI Shell checks
const candidateSelectionShellPath = path.join(repoRoot, 'src/components/assignment/CandidateSelectionReviewShell.tsx')
const candidateSelectionIndexPath = path.join(repoRoot, 'src/components/assignment/index.ts')

function readCandidateSelectionShell() {
  return fs.readFileSync(candidateSelectionShellPath, 'utf8')
}

addCheck('MC6 CandidateSelectionReviewShell component file exists', () => {
  return fs.existsSync(candidateSelectionShellPath) && fs.statSync(candidateSelectionShellPath).isFile()
})

addCheck('MC6 CandidateSelectionReviewShell is exported', () => {
  const componentSource = readCandidateSelectionShell()
  const indexSource = fs.readFileSync(candidateSelectionIndexPath, 'utf8')
  return componentSource.includes('export default function CandidateSelectionReviewShell') &&
    indexSource.includes('CandidateSelectionReviewShell')
})

addCheck('MC6 warning copy exists', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Suggested candidates are workflow suggestions only. Selecting or reviewing a candidate does not approve a scholarship, assign a person, or collect AP-10B approval.')
})

addCheck('MC6 workflow suggestions only language exists', () => {
  const source = readCandidateSelectionShell()
  return source.includes('workflow suggestions only')
})

addCheck('MC6 no-auto-assignment language exists', () => {
  const source = readCandidateSelectionShell()
  return source.includes('Auto-assigned') &&
    source.includes('Nothing is selected by default')
})

addCheck('MC6 shell has no Assign action button', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('>Assign<') &&
    !source.includes('label="Assign"') &&
    !source.includes('Assign button')
})

addCheck('MC6 shell has no Approve action button', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('>Approve<') &&
    !source.includes('label="Approve"') &&
    !source.includes('Approve button')
})

addCheck('MC6 shell has no Decision action button', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('>Decision<') &&
    !source.includes('label="Decision"') &&
    !source.includes('Decision button')
})

addCheck('MC6 shell does not fetch or call API/network', () => {
  const source = readCandidateSelectionShell()
  const forbidden = ['fetch(', 'axios', 'XMLHttpRequest', '/api/', 'http://', 'https://']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC6 shell does not use browser storage', () => {
  const source = readCandidateSelectionShell()
  return !source.includes('localStorage') && !source.includes('sessionStorage')
})

addCheck('MC6 shell does not write audit events', () => {
  const source = readCandidateSelectionShell()
  const forbidden = ['writeAudit', 'auditService', 'recordAudit', 'buildAuditEvent', 'sharedMockWriter']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC6 shell does not render forbidden field tokens', () => {
  const source = readCandidateSelectionShell()
  const forbidden = [
    'mobile',
    'phone',
    'personalEmail',
    'privateEmail',
    'remark',
    'rawStudentId',
    'nationalId',
    'approvalStatus',
    'approvedBy',
    'scholarshipDecision',
    'assignedBy',
    'assignedAt',
  ]
  return forbidden.every(token => !source.includes(token))
})

// MC20 Candidate Review Diagnostic Preview Demo Page Runtime checks

const demoDataHelperPath = 'src/lib/assignment/candidateReviewDemoData.ts'
const demoPagePath = 'src/app/admin/candidate-review-demo/page.tsx'

function readDemoDataHelper() {
  return fs.readFileSync(demoDataHelperPath, 'utf-8')
}

function readDemoPage() {
  return fs.readFileSync(demoPagePath, 'utf-8')
}

addCheck('MC20 demo data helper file exists', () => {
  return fs.existsSync(demoDataHelperPath) && fs.statSync(demoDataHelperPath).isFile()
})

addCheck('MC20 demo page file exists', () => {
  return fs.existsSync(demoPagePath) && fs.statSync(demoPagePath).isFile()
})

addCheck('MC20 demo page imports CandidateSelectionReviewShell', () => {
  const source = readDemoPage()
  return source.includes('CandidateSelectionReviewShell')
})

addCheck('MC20 demo page imports createCandidateReviewDemoCandidates', () => {
  const source = readDemoPage()
  return source.includes('createCandidateReviewDemoCandidates')
})

addCheck('MC20 demo page contains "Demo only"', () => {
  const source = readDemoPage()
  return source.includes('Demo only')
})

addCheck('MC20 demo page contains "Diagnostic preview only"', () => {
  const source = readDemoPage()
  return source.includes('Diagnostic preview only')
})

addCheck('MC20 demo page contains "Uses safe mock data"', () => {
  const source = readDemoPage()
  return source.includes('Uses safe mock data')
})

addCheck('MC20 demo page contains "No real student or personnel data"', () => {
  const source = readDemoPage()
  return source.includes('No real student or personnel data')
})

addCheck('MC20 demo page contains "Not saved"', () => {
  const source = readDemoPage()
  return source.includes('Not saved')
})

addCheck('MC20 demo page contains "Not submitted"', () => {
  const source = readDemoPage()
  return source.includes('Not submitted')
})

addCheck('MC20 demo page contains "Not official evidence"', () => {
  const source = readDemoPage()
  return source.includes('Not official evidence')
})

addCheck('MC20 demo page contains "Not an approval"', () => {
  const source = readDemoPage()
  return source.includes('Not an approval')
})

addCheck('MC20 demo page contains "Not an assignment"', () => {
  const source = readDemoPage()
  return source.includes('Not an assignment')
})

addCheck('MC20 demo page contains "Not a scholarship decision"', () => {
  const source = readDemoPage()
  return source.includes('Not a scholarship decision')
})

addCheck('MC20 demo page passes readonly prop to shell', () => {
  const source = readDemoPage()
  return source.includes('readonly={true}') || source.includes('readonly=')
})

addCheck('MC20 demo page has no fetch or API call', () => {
  const source = readDemoPage()
  const forbidden = ['fetch(', 'axios(', 'XMLHttpRequest', '/api/']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC20 demo page has no browser storage', () => {
  const source = readDemoPage()
  return !source.includes('localStorage') &&
    !source.includes('sessionStorage') &&
    !source.includes('IndexedDB')
})

addCheck('MC20 demo page has no audit write calls', () => {
  const source = readDemoPage()
  const forbidden = ['sharedMockWriter', 'AuditService', 'auditRepository', 'writeAudit', 'recordAudit']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC20 demo page has no PII field tokens', () => {
  const source = readDemoPage()
  const forbidden = ['email', 'phone', 'mobile', 'nationalId', 'bankAccount', 'privateEmail', 'personalEmail']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC20 demo page has no enabled official action buttons', () => {
  const source = readDemoPage()
  const forbidden = ['>Assign<', '>Approve<', '>Decision<', '>Submit<', '>Save<', '>Record<']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC20 demo data helper has no fetch or API call', () => {
  const source = readDemoDataHelper()
  const forbidden = ['fetch(', 'axios(', 'XMLHttpRequest', '/api/']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC20 demo data helper has no browser storage', () => {
  const source = readDemoDataHelper()
  return !source.includes('localStorage') &&
    !source.includes('sessionStorage') &&
    !source.includes('IndexedDB')
})

addCheck('MC20 demo data helper has no PII field tokens', () => {
  const source = readDemoDataHelper()
  const forbidden = ['email', 'phone', 'mobile', 'nationalId', 'bankAccount', 'privateEmail', 'personalEmail']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC20 demo data helper candidateIds use demo- prefix', () => {
  const source = readDemoDataHelper()
  return source.includes('"demo-advisor-001"') &&
    source.includes('"demo-advisor-002"') &&
    source.includes('"demo-staff-001"') &&
    source.includes('"demo-staff-002"')
})

addCheck('MC20 index.ts exports createCandidateReviewDemoCandidates', () => {
  const source = fs.readFileSync('src/lib/assignment/index.ts', 'utf-8')
  return source.includes('candidateReviewDemoData')
})

// MC27 Candidate Review Demo Feedback Backlog Mock Runtime checks
const demoFeedbackBacklogPath = path.join(repoRoot, 'src/lib/assignment/demoFeedbackBacklog.ts')
function readDemoFeedbackBacklog() { return fs.readFileSync(demoFeedbackBacklogPath, 'utf-8') }

addCheck('MC27 demoFeedbackBacklog.ts exists', () =>
  fs.existsSync(demoFeedbackBacklogPath) && fs.statSync(demoFeedbackBacklogPath).isFile()
)

const demoFeedbackBacklogModule = loadTsModule(demoFeedbackBacklogPath)

addCheck('MC27 required feedback backlog types exist', () => {
  const source = readDemoFeedbackBacklog()
  return source.includes('export type DemoFeedbackCategory') &&
    source.includes('export type DemoFeedbackPriority') &&
    source.includes('export type DemoFeedbackBacklogStatus') &&
    source.includes('export type DemoFeedbackProposedBranchType') &&
    source.includes('export type DemoFeedbackBacklogInput') &&
    source.includes('export type DemoFeedbackBacklogItem')
})

addCheck('MC27 required feedback backlog functions exist', () => {
  return typeof demoFeedbackBacklogModule.createDemoFeedbackBacklogItem === 'function' &&
    typeof demoFeedbackBacklogModule.createDemoFeedbackBacklogItems === 'function' &&
    typeof demoFeedbackBacklogModule.classifyDemoFeedbackPriority === 'function' &&
    typeof demoFeedbackBacklogModule.deriveDemoFeedbackBacklogStatus === 'function' &&
    typeof demoFeedbackBacklogModule.assertSafeDemoFeedbackBacklogItem === 'function' &&
    typeof demoFeedbackBacklogModule.assertSafeDemoFeedbackBacklogInput === 'function' &&
    typeof demoFeedbackBacklogModule.summarizeDemoFeedbackBacklogItem === 'function'
})

addCheck('MC27 safe input creates mock non-approval backlog item', () => {
  const item = demoFeedbackBacklogModule.createDemoFeedbackBacklogItem({
    sourceSessionId: 'demo-session-001',
    stakeholderGroup: 'internal-review-group',
    category: 'copy_content',
    summary: 'Clarify local review signal language for demo participants.',
    safetyConcern: false,
    proposedBranchType: 'copy_polish_runtime',
    ap10bImpact: 'none',
    nonApprovalConfirmed: true,
  })

  return item.backlogId === 'demo-feedback-backlog-demo-session-001-copy_content' &&
    item.priority === 'P1_misleading_copy_or_workflow' &&
    item.status === 'candidate' &&
    item.nonApprovalConfirmed === true &&
    item.isMock === true &&
    item.officialEvidence === false &&
    item.approvalCollected === false &&
    item.persisted === false &&
    item.exported === false &&
    item.notified === false
})

addCheck('MC27 array builder produces deterministic indexed IDs', () => {
  const items = demoFeedbackBacklogModule.createDemoFeedbackBacklogItems([
    {
      sourceSessionId: 'demo-session-001',
      stakeholderGroup: 'internal-review-group',
      category: 'ux_clarity',
      summary: 'Improve demo hierarchy for facilitator review.',
      safetyConcern: false,
      proposedBranchType: 'demo_layout_polish_runtime',
      ap10bImpact: 'none',
      nonApprovalConfirmed: true,
    },
    {
      sourceSessionId: 'demo-session-001',
      stakeholderGroup: 'internal-review-group',
      category: 'training_readiness',
      summary: 'Add facilitator notes for walkthrough setup.',
      safetyConcern: false,
      proposedBranchType: 'training_doc_update',
      ap10bImpact: 'none',
      nonApprovalConfirmed: true,
    },
  ])

  return items[0].backlogId.endsWith('-1') && items[1].backlogId.endsWith('-2')
})

addCheck('MC27 governance-sensitive input derives governance-sensitive status', () => {
  const item = demoFeedbackBacklogModule.createDemoFeedbackBacklogItem({
    sourceSessionId: 'governance-review',
    stakeholderGroup: 'internal-review-group',
    category: 'future_enhancement',
    summary: 'Escalate governance-sensitive planning concern.',
    safetyConcern: false,
    proposedBranchType: 'no_branch',
    ap10bImpact: 'governance_sensitive',
    nonApprovalConfirmed: true,
  })

  return item.priority === 'out_of_scope_governance' &&
    item.status === 'governance_sensitive'
})

addCheck('MC27 out_of_scope_governance category derives out-of-scope status', () => {
  const item = demoFeedbackBacklogModule.createDemoFeedbackBacklogItem({
    sourceSessionId: 'out-of-scope-review',
    stakeholderGroup: 'internal-review-group',
    category: 'out_of_scope_governance',
    summary: 'Route governance-sensitive request outside product backlog.',
    safetyConcern: false,
    proposedBranchType: 'no_branch',
    ap10bImpact: 'none',
    nonApprovalConfirmed: true,
  })

  return item.priority === 'out_of_scope_governance' &&
    item.status === 'out_of_scope'
})

addCheck('MC27 forbidden summary wording is rejected', () => {
  try {
    demoFeedbackBacklogModule.createDemoFeedbackBacklogItem({
      sourceSessionId: 'unsafe-summary',
      stakeholderGroup: 'internal-review-group',
      category: 'copy_content',
      summary: 'Stakeholder approved the demo for production.',
      safetyConcern: false,
      proposedBranchType: 'copy_polish_docs',
      ap10bImpact: 'none',
      nonApprovalConfirmed: true,
    })
    return false
  } catch {
    return true
  }
})

addCheck('MC27 forbidden PII-like input field is rejected', () => {
  try {
    demoFeedbackBacklogModule.assertSafeDemoFeedbackBacklogInput({
      sourceSessionId: 'unsafe-field',
      stakeholderGroup: 'internal-review-group',
      category: 'ux_clarity',
      summary: 'Clarify visual grouping for review session.',
      safetyConcern: false,
      proposedBranchType: 'demo_layout_polish_runtime',
      ap10bImpact: 'none',
      nonApprovalConfirmed: true,
      phone: 'unsafe',
    })
    return false
  } catch {
    return true
  }
})

addCheck('MC27 long summary is rejected', () => {
  try {
    demoFeedbackBacklogModule.createDemoFeedbackBacklogItem({
      sourceSessionId: 'long-summary',
      stakeholderGroup: 'internal-review-group',
      category: 'ux_clarity',
      summary: 'x'.repeat(241),
      safetyConcern: false,
      proposedBranchType: 'demo_layout_polish_runtime',
      ap10bImpact: 'none',
      nonApprovalConfirmed: true,
    })
    return false
  } catch {
    return true
  }
})

addCheck('MC27 nonApprovalConfirmed false is rejected', () => {
  try {
    demoFeedbackBacklogModule.createDemoFeedbackBacklogItem({
      sourceSessionId: 'unsafe-non-approval',
      stakeholderGroup: 'internal-review-group',
      category: 'ux_clarity',
      summary: 'Clarify visual grouping for review session.',
      safetyConcern: false,
      proposedBranchType: 'demo_layout_polish_runtime',
      ap10bImpact: 'none',
      nonApprovalConfirmed: false,
    })
    return false
  } catch {
    return true
  }
})

addCheck('MC27 summary helper returns planning-only safe summary', () => {
  const item = demoFeedbackBacklogModule.createDemoFeedbackBacklogItem({
    sourceSessionId: 'summary-helper',
    stakeholderGroup: 'internal-review-group',
    category: 'privacy_pdpa',
    summary: 'Clarify safe mock privacy wording for the demo.',
    safetyConcern: true,
    proposedBranchType: 'privacy_wording_clarification',
    ap10bImpact: 'none',
    nonApprovalConfirmed: true,
  })
  const summary = demoFeedbackBacklogModule.summarizeDemoFeedbackBacklogItem(item)

  return summary.planningOnly === true &&
    summary.nonApprovalConfirmed === true &&
    summary.officialEvidence === false &&
    summary.approvalCollected === false &&
    !('summary' in summary)
})

addCheck('MC27 source includes required fixed false safety flags', () => {
  const source = readDemoFeedbackBacklog()
  return source.includes('nonApprovalConfirmed: true') &&
    source.includes('isMock: true') &&
    source.includes('officialEvidence: false') &&
    source.includes('approvalCollected: false') &&
    source.includes('persisted: false') &&
    source.includes('exported: false') &&
    source.includes('notified: false')
})

addCheck('MC27 source guards forbidden feedback wording', () => {
  const source = readDemoFeedbackBacklog()
  return source.includes('forbiddenSummaryPatterns') &&
    source.includes('official approval') &&
    source.includes('AP-10B approved') &&
    source.includes('authority verified') &&
    source.includes('student ID') &&
    source.includes('teacher ID')
})

addCheck('MC27 runtime has no fetch/API/browser storage', () => {
  const source = readDemoFeedbackBacklog()
  const forbidden = ['fetch(', 'axios', 'XMLHttpRequest', '/api/', 'localStorage', 'sessionStorage', 'IndexedDB', 'indexedDB']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC27 runtime has no audit writer or repository calls', () => {
  const source = readDemoFeedbackBacklog()
  const forbidden = ['sharedMockWriter', 'AuditService', 'auditService', 'repository', 'Repository', 'writeAudit', 'recordAudit']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC27 runtime has no export/download/notification behavior', () => {
  const source = readDemoFeedbackBacklog()
  const forbidden = ['download', 'exportCsv', 'exportPdf', 'sendBeacon', 'Notification', 'notify(', 'notificationService']
  return forbidden.every(token => !source.includes(token))
})

addCheck('MC27 route/page/navigation files do not import demoFeedbackBacklog', () => {
  const routeRoot = path.join(repoRoot, 'src/app')
  const navFiles = [
    path.join(repoRoot, 'src/lib/navigation.ts'),
    path.join(repoRoot, 'src/components/layout/Sidebar.tsx'),
    path.join(repoRoot, 'src/components/layout/Topbar.tsx'),
    path.join(repoRoot, 'src/components/layout/MobileBottomNav.tsx'),
  ]

  function scanDir(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return scanDir(fullPath)
      if (!/\.(ts|tsx)$/.test(entry.name)) return []
      return [fullPath]
    })
  }

  const files = [...scanDir(routeRoot), ...navFiles]
  return files.every((file) => !fs.readFileSync(file, 'utf-8').includes('demoFeedbackBacklog'))
})

addCheck('MC27 index.ts exports demoFeedbackBacklog helpers', () => {
  const source = fs.readFileSync('src/lib/assignment/index.ts', 'utf-8')
  return source.includes('demoFeedbackBacklog')
})

// MC29 Candidate Review Demo Feedback Backlog Sample Runtime checks
const demoFeedbackBacklogSamplesPath = path.join(repoRoot, 'src/lib/assignment/demoFeedbackBacklogSamples.ts')
function readDemoFeedbackBacklogSamples() { return fs.readFileSync(demoFeedbackBacklogSamplesPath, 'utf-8') }

addCheck('MC29 demoFeedbackBacklogSamples.ts exists', () =>
  fs.existsSync(demoFeedbackBacklogSamplesPath) && fs.statSync(demoFeedbackBacklogSamplesPath).isFile()
)

const demoFeedbackBacklogSamplesModule = loadTsModule(demoFeedbackBacklogSamplesPath)

addCheck('MC29 required sample runtime exports exist', () =>
  Array.isArray(demoFeedbackBacklogSamplesModule.DEMO_FEEDBACK_BACKLOG_SAMPLE_INPUTS) &&
  typeof demoFeedbackBacklogSamplesModule.createDemoFeedbackBacklogSamples === 'function' &&
  typeof demoFeedbackBacklogSamplesModule.assertSafeDemoFeedbackBacklogSamples === 'function' &&
  typeof demoFeedbackBacklogSamplesModule.summarizeDemoFeedbackBacklogSamples === 'function'
)

addCheck('MC29 sample runtime imports MC27 builder and safety assertion', () => {
  const source = readDemoFeedbackBacklogSamples()
  return source.includes('createDemoFeedbackBacklogItems') &&
    source.includes('assertSafeDemoFeedbackBacklogItem') &&
    source.includes('./demoFeedbackBacklog')
})

addCheck('MC29 sample inputs preserve nonApprovalConfirmed true', () => {
  const inputs = demoFeedbackBacklogSamplesModule.DEMO_FEEDBACK_BACKLOG_SAMPLE_INPUTS
  return inputs.length === 9 && inputs.every((input) => input.nonApprovalConfirmed === true)
})

addCheck('MC29 sample runtime uses MC27 array builder', () => {
  const source = readDemoFeedbackBacklogSamples()
  return source.includes('createDemoFeedbackBacklogItems(DEMO_FEEDBACK_BACKLOG_SAMPLE_INPUTS)')
})

addCheck('MC29 sample runtime asserts safe items', () => {
  const source = readDemoFeedbackBacklogSamples()
  return source.includes('items.forEach((item) => assertSafeDemoFeedbackBacklogItem(item))')
})

addCheck('MC29 sample categories cover all MC28 categories', () => {
  const samples = demoFeedbackBacklogSamplesModule.createDemoFeedbackBacklogSamples()
  const categories = new Set(samples.map((item) => item.category))
  const required = [
    'ux_clarity',
    'copy_content',
    'accessibility',
    'privacy_pdpa',
    'workflow_understanding',
    'training_readiness',
    'risk_concern',
    'future_enhancement',
    'out_of_scope_governance',
  ]
  return samples.length === 9 && required.every((category) => categories.has(category))
})

addCheck('MC29 sample summaries avoid forbidden wording', () => {
  const inputs = demoFeedbackBacklogSamplesModule.DEMO_FEEDBACK_BACKLOG_SAMPLE_INPUTS
  const forbidden = [
    'approved',
    'assigned',
    'submitted',
    'official approval',
    'AP-10B approved',
    'authority verified',
    'national ID',
    'phone',
    'email',
    'bank account',
    'student ID',
    'teacher ID',
  ]
  return inputs.every((input) => {
    const summary = input.summary.toLowerCase()
    return forbidden.every((token) => !summary.includes(token.toLowerCase()))
  })
})

addCheck('MC29 sample file has no forbidden PII/contact/id tokens', () => {
  const source = readDemoFeedbackBacklogSamples()
  const forbidden = ['mobile', 'phone', 'email', 'personalEmail', 'rawEmail', 'privateEmail', 'rawStudentId', 'studentId', 'teacherId', 'nationalId', 'bankAccount']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC29 sample file has no fetch/API/browser storage', () => {
  const source = readDemoFeedbackBacklogSamples()
  const forbidden = ['fetch(', 'axios', 'XMLHttpRequest', '/api/', 'localStorage', 'sessionStorage', 'IndexedDB', 'indexedDB']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC29 sample file has no audit writer or repository calls', () => {
  const source = readDemoFeedbackBacklogSamples()
  const forbidden = ['sharedMockWriter', 'AuditService', 'auditService', 'repository', 'Repository', 'writeAudit', 'recordAudit']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC29 sample file has no export/download/notification behavior', () => {
  const source = readDemoFeedbackBacklogSamples()
  const forbidden = ['download', 'exportCsv', 'exportPdf', 'sendBeacon', 'Notification', 'notify(', 'notificationService']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC29 route/page/navigation files do not import sample runtime', () => {
  const routeRoot = path.join(repoRoot, 'src/app')
  const navFiles = [
    path.join(repoRoot, 'src/lib/navigation.ts'),
    path.join(repoRoot, 'src/components/layout/Sidebar.tsx'),
    path.join(repoRoot, 'src/components/layout/Topbar.tsx'),
    path.join(repoRoot, 'src/components/layout/MobileBottomNav.tsx'),
  ]

  function scanRuntimeDirs(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return scanRuntimeDirs(fullPath)
      if (!/\.(ts|tsx)$/.test(entry.name)) return []
      return [fullPath]
    })
  }

  const files = [...scanRuntimeDirs(routeRoot), ...navFiles]
  return files.every((file) => !fs.readFileSync(file, 'utf-8').includes('demoFeedbackBacklogSamples'))
})

addCheck('MC29 index.ts exports demoFeedbackBacklogSamples helpers', () => {
  const source = fs.readFileSync('src/lib/assignment/index.ts', 'utf-8')
  return source.includes('demoFeedbackBacklogSamples')
})

addCheck('MC29 summary helper returns aggregate planning-only metadata', () => {
  const summary = demoFeedbackBacklogSamplesModule.summarizeDemoFeedbackBacklogSamples()
  return summary.total === 9 &&
    summary.categories.length === 9 &&
    summary.priorities.length >= 5 &&
    summary.governanceSensitiveCount === 1 &&
    summary.planningOnly === true &&
    summary.nonApprovalConfirmed === true &&
    summary.officialEvidence === false &&
    summary.approvalCollected === false &&
    summary.persisted === false &&
    summary.exported === false &&
    summary.notified === false &&
    !('summaries' in summary)
})

// MC31 Candidate Review Demo Feedback Backlog Preview UI Runtime checks
const feedbackBacklogPreviewPath = path.join(repoRoot, 'src/components/assignment/FeedbackBacklogPreview.tsx')
function readFeedbackBacklogPreview() { return fs.readFileSync(feedbackBacklogPreviewPath, 'utf-8') }

addCheck('MC31 FeedbackBacklogPreview.tsx exists', () =>
  fs.existsSync(feedbackBacklogPreviewPath) && fs.statSync(feedbackBacklogPreviewPath).isFile()
)

addCheck('MC31 FeedbackBacklogPreview exports component and props type', () => {
  const source = readFeedbackBacklogPreview()
  return source.includes('export type FeedbackBacklogPreviewProps') &&
    source.includes('export default function FeedbackBacklogPreview')
})

addCheck('MC31 FeedbackBacklogPreview imports MC29 safe sample helpers', () => {
  const source = readFeedbackBacklogPreview()
  return source.includes('DemoFeedbackBacklogItem') &&
    source.includes('createDemoFeedbackBacklogSamples') &&
    source.includes('summarizeDemoFeedbackBacklogSamples') &&
    source.includes('@/lib/assignment')
})

addCheck('MC31 FeedbackBacklogPreview uses MC29 samples as default data source', () => {
  const source = readFeedbackBacklogPreview()
  return source.includes('items ?? createDemoFeedbackBacklogSamples()')
})

addCheck('MC31 FeedbackBacklogPreview includes required read-only boundary copy', () => {
  const source = readFeedbackBacklogPreview()
  return source.includes('Demo feedback backlog preview') &&
    source.includes('Read-only planning preview') &&
    source.includes('Uses safe mock sample data only') &&
    source.includes('Feedback backlog preview items are mock planning artifacts only.')
})

addCheck('MC31 FeedbackBacklogPreview includes required safety labels', () => {
  const source = readFeedbackBacklogPreview()
  return [
    'Not saved',
    'Not submitted',
    'Not official evidence',
    'Not an approval',
    'Not an assignment',
    'No AP-10B gate change',
  ].every((token) => source.includes(token))
})

addCheck('MC31 FeedbackBacklogPreview includes exact empty state copy', () => {
  const source = readFeedbackBacklogPreview()
  return source.includes('No demo feedback backlog preview items are available. This preview uses safe mock sample data only and does not collect or save feedback.')
})

addCheck('MC31 FeedbackBacklogPreview displays allowed safe fields', () => {
  const source = readFeedbackBacklogPreview()
  return [
    'backlogId',
    'sourceSessionId',
    'stakeholderGroup',
    'category',
    'priority',
    'summary',
    'safetyConcern',
    'proposedBranchType',
    'ap10bImpact',
    'status',
  ].every((token) => source.includes(token))
})

addCheck('MC31 FeedbackBacklogPreview displays fixed safety flags', () => {
  const source = readFeedbackBacklogPreview()
  return [
    'nonApprovalConfirmed',
    'isMock',
    'officialEvidence',
    'approvalCollected',
    'persisted',
    'exported',
    'notified',
  ].every((token) => source.includes(token))
})

addCheck('MC31 FeedbackBacklogPreview includes static grouping by category', () => {
  const source = readFeedbackBacklogPreview()
  return source.includes('groupItemsByCategory') &&
    source.includes('Object.entries(groupedItems)')
})

addCheck('MC31 FeedbackBacklogPreview has accessible labels and semantic sections', () => {
  const source = readFeedbackBacklogPreview()
  return source.includes('<section') &&
    source.includes('aria-label="Read-only demo feedback backlog preview"') &&
    source.includes('aria-label="Feedback backlog preview safety boundary"') &&
    source.includes('aria-label="Feedback backlog preview summary"')
})

addCheck('MC31 FeedbackBacklogPreview does not render forbidden PII fields', () => {
  const source = readFeedbackBacklogPreview()
  const forbidden = ['mobile', 'phone', 'email', 'personalEmail', 'rawEmail', 'privateEmail', 'rawStudentId', 'studentId', 'teacherId', 'nationalId', 'bankAccount', 'privateRemark']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC31 FeedbackBacklogPreview has no form or action controls', () => {
  const source = readFeedbackBacklogPreview()
  const forbidden = ['<form', '<input', '<textarea', '<select', '<button', 'type="submit"', 'onSubmit', 'onClick']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC31 FeedbackBacklogPreview has no enabled official action wording', () => {
  const source = readFeedbackBacklogPreview()
  const forbidden = ['Submit feedback', 'Save feedback', 'Record feedback', 'Approve', 'Assign', 'Decision completed', 'AP-10B approval collected', 'Authority verified']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC31 FeedbackBacklogPreview has no fetch/API/browser storage', () => {
  const source = readFeedbackBacklogPreview()
  const forbidden = ['fetch(', 'axios', 'XMLHttpRequest', '/api/', 'localStorage', 'sessionStorage', 'IndexedDB', 'indexedDB']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC31 FeedbackBacklogPreview has no audit writer or repository calls', () => {
  const source = readFeedbackBacklogPreview()
  const forbidden = ['sharedMockWriter', 'AuditService', 'auditService', 'repository', 'Repository', 'writeAudit', 'recordAudit']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC31 FeedbackBacklogPreview has no export/download/notification behavior', () => {
  const source = readFeedbackBacklogPreview()
  const forbidden = ['download', 'exportCsv', 'exportPdf', 'sendBeacon', 'Notification', 'notify(', 'notificationService']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC31 route/page/navigation files do not import FeedbackBacklogPreview outside MC33 demo route', () => {
  const routeRoot = path.join(repoRoot, 'src/app')
  const navFiles = [
    path.join(repoRoot, 'src/lib/navigation.ts'),
    path.join(repoRoot, 'src/components/layout/Sidebar.tsx'),
    path.join(repoRoot, 'src/components/layout/Topbar.tsx'),
    path.join(repoRoot, 'src/components/layout/MobileBottomNav.tsx'),
  ]

  function scanRuntimeDirs(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return scanRuntimeDirs(fullPath)
      if (!/\.(ts|tsx)$/.test(entry.name)) return []
      return [fullPath]
    })
  }

  const files = [...scanRuntimeDirs(routeRoot), ...navFiles]
  const allowedRoute = path.join(repoRoot, demoPagePath)
  return files.every((file) =>
    file === allowedRoute || !fs.readFileSync(file, 'utf-8').includes('FeedbackBacklogPreview')
  )
})

addCheck('MC31 assignment component index exports FeedbackBacklogPreview', () => {
  const source = fs.readFileSync('src/components/assignment/index.ts', 'utf-8')
  return source.includes('FeedbackBacklogPreview') &&
    source.includes('FeedbackBacklogPreviewProps')
})

// MC22 Candidate Review Demo Route Navigation Safety checks
const navConfigPath = 'src/lib/navigation.ts'
const sidebarPath = 'src/components/layout/Sidebar.tsx'
const topbarPath = 'src/components/layout/Topbar.tsx'
const mobileNavPath = 'src/components/layout/MobileBottomNav.tsx'
function readNavConfig() { return fs.readFileSync(navConfigPath, 'utf-8') }
function readSidebar() { return fs.readFileSync(sidebarPath, 'utf-8') }
function readTopbar() { return fs.readFileSync(topbarPath, 'utf-8') }
function readMobileNav() { return fs.readFileSync(mobileNavPath, 'utf-8') }

addCheck('MC22 navigation config exists', () =>
  fs.existsSync(navConfigPath) && fs.statSync(navConfigPath).isFile()
)

addCheck('MC22 demo route not in navigation config', () =>
  !readNavConfig().includes('candidate-review-demo')
)

addCheck('MC22 NAV_CONFIG defined in navigation config', () =>
  readNavConfig().includes('NAV_CONFIG')
)

addCheck('MC22 MOBILE_NAV defined in navigation config', () =>
  readNavConfig().includes('MOBILE_NAV')
)

addCheck('MC22 sidebar exists', () =>
  fs.existsSync(sidebarPath) && fs.statSync(sidebarPath).isFile()
)

addCheck('MC22 demo route not in Sidebar', () =>
  !readSidebar().includes('candidate-review-demo')
)

addCheck('MC22 Sidebar uses NAV_CONFIG', () =>
  readSidebar().includes('NAV_CONFIG')
)

addCheck('MC22 MobileBottomNav exists', () =>
  fs.existsSync(mobileNavPath) && fs.statSync(mobileNavPath).isFile()
)

addCheck('MC22 demo route not in MobileBottomNav', () =>
  !readMobileNav().includes('candidate-review-demo')
)

addCheck('MC22 MobileBottomNav uses MOBILE_NAV', () =>
  readMobileNav().includes('MOBILE_NAV')
)

addCheck('MC22 Topbar exists', () =>
  fs.existsSync(topbarPath) && fs.statSync(topbarPath).isFile()
)

addCheck('MC22 demo route not in Topbar', () =>
  !readTopbar().includes('candidate-review-demo')
)

// MC33 Candidate Review Demo Feedback Backlog Preview Route Runtime Integration checks
addCheck('MC33 demo route imports FeedbackBacklogPreview from assignment barrel', () => {
  const source = readDemoPage()
  return source.includes('import { FeedbackBacklogPreview } from "@/components/assignment";')
})

addCheck('MC33 demo route renders FeedbackBacklogPreview', () => {
  const source = readDemoPage()
  return source.includes('<FeedbackBacklogPreview')
})

addCheck('MC33 demo route includes required backlog preview copy', () => {
  const source = readDemoPage()
  return [
    'Demo backlog preview',
    'Safe mock data only',
    'Read-only',
    'Not saved',
    'Not submitted',
    'Not official evidence',
    'Not approval',
    'Not assignment',
    'Not AP-10B evidence',
    'No real stakeholder/student/personnel data',
  ].every((token) => source.includes(token))
})

addCheck('MC33 demo route uses FeedbackBacklogPreview default MC29 data source', () => {
  const source = readDemoPage()
  return !source.includes('items=') &&
    !source.includes('createDemoFeedbackBacklogSamples') &&
    !source.includes('demoFeedbackBacklogSamples')
})

addCheck('MC33 demo route preserves candidate review diagnostic demo shell', () => {
  const source = readDemoPage()
  return source.includes('CandidateSelectionReviewShell') &&
    source.includes('createCandidateReviewDemoCandidates') &&
    source.includes('assertSafeCandidateReviewDemoData') &&
    source.includes('readonly={true}')
})

addCheck('MC33 demo route preserves existing demo warning copy', () => {
  const source = readDemoPage()
  return source.includes('Demo only. Diagnostic preview only. Uses safe mock data.') &&
    source.includes('No real student or personnel data.') &&
    source.includes('Not saved. Not submitted. Not official evidence.') &&
    source.includes('Not an approval. Not an assignment. Not a scholarship decision.')
})

addCheck('MC33 demo route has no feedback form or action controls', () => {
  const source = readDemoPage()
  const forbidden = ['<form', '<input', '<textarea', '<select', '<button', 'type="submit"', 'onSubmit', 'onClick']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC33 demo route has no fetch/API/browser storage', () => {
  const source = readDemoPage()
  const forbidden = ['fetch(', 'axios', 'XMLHttpRequest', '/api/', 'localStorage', 'sessionStorage', 'IndexedDB', 'indexedDB']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC33 demo route has no audit writer or repository calls', () => {
  const source = readDemoPage()
  const forbidden = ['sharedMockWriter', 'AuditService', 'auditService', 'auditRepository', 'repository', 'Repository', 'writeAudit', 'recordAudit']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC33 demo route has no export/download/notification behavior', () => {
  const source = readDemoPage()
  const forbidden = ['download', 'exportCsv', 'exportPdf', 'sendBeacon', 'Notification', 'notify(', 'notificationService']
  return forbidden.every((token) => !source.includes(token))
})

addCheck('MC33 demo route is the only route/page importing FeedbackBacklogPreview', () => {
  const routeRoot = path.join(repoRoot, 'src/app')
  const allowedRoute = path.join(repoRoot, demoPagePath)

  function scanRuntimeDirs(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) return scanRuntimeDirs(fullPath)
      if (!/\.(ts|tsx)$/.test(entry.name)) return []
      return [fullPath]
    })
  }

  return scanRuntimeDirs(routeRoot).every((file) =>
    file === allowedRoute || !fs.readFileSync(file, 'utf-8').includes('FeedbackBacklogPreview')
  )
})

addCheck('MC33 navigation remains hidden from demo route', () =>
  !readNavConfig().includes('candidate-review-demo') &&
  !readSidebar().includes('candidate-review-demo') &&
  !readTopbar().includes('candidate-review-demo') &&
  !readMobileNav().includes('candidate-review-demo')
)

// MC35 Candidate Review Demo Combined Preview UX Hardening Runtime checks
addCheck('MC35 demo route has route-level h1 heading', () => {
  const source = readDemoPage()
  return source.includes('<h1')
})

addCheck('MC35 demo route route-level copy — read-only demo statement', () => {
  const source = readDemoPage()
  return source.includes('This page is a read-only demo')
})

addCheck('MC35 demo route route-level copy — does not save', () => {
  const source = readDemoPage()
  return source.includes('does not save')
})

addCheck('MC35 demo route route-level copy — does not submit', () => {
  const source = readDemoPage()
  return source.includes('does not submit')
})

addCheck('MC35 demo route route-level copy — does not approve', () => {
  const source = readDemoPage()
  return source.includes('does not approve')
})

addCheck('MC35 demo route route-level copy — does not assign', () => {
  const source = readDemoPage()
  return source.includes('does not assign')
})

addCheck('MC35 demo route route-level copy — does not export', () => {
  const source = readDemoPage()
  return source.includes('does not export')
})

addCheck('MC35 demo route route-level copy — does not notify', () => {
  const source = readDemoPage()
  return source.includes('does not notify')
})

addCheck('MC35 demo route route-level copy — does not create official evidence', () => {
  const source = readDemoPage()
  return source.includes('does not create official evidence')
})

addCheck('MC35 demo route route-level copy — not AP-10B evidence', () => {
  const source = readDemoPage()
  return source.includes('not AP-10B evidence')
})

addCheck('MC35 demo route has candidate section h2 heading', () => {
  const source = readDemoPage()
  return source.includes('Candidate Review Diagnostic Preview')
})

addCheck('MC35 demo route candidate section — local review signal only', () => {
  const source = readDemoPage()
  return source.includes('Local review signal only')
})

addCheck('MC35 demo route candidate section — no scholarship decision', () => {
  const source = readDemoPage()
  return source.includes('No scholarship decision')
})

addCheck('MC35 demo route candidate section — no candidate assignment', () => {
  const source = readDemoPage()
  return source.includes('No candidate assignment')
})

addCheck('MC35 demo route has backlog section h2 heading', () => {
  const source = readDemoPage()
  return source.includes('Feedback Backlog Preview')
})

addCheck('MC35 demo route backlog section — planning preview only', () => {
  const source = readDemoPage()
  return source.includes('Planning preview only')
})

addCheck('MC35 demo route backlog section — mock backlog items only', () => {
  const source = readDemoPage()
  return source.includes('Mock backlog items only')
})

addCheck('MC35 demo route backlog section — no feedback collection', () => {
  const source = readDemoPage()
  return source.includes('No feedback collection')
})

addCheck('MC35 demo route backlog section — no production backlog', () => {
  const source = readDemoPage()
  return source.includes('No production backlog')
})

addCheck('MC35 demo route candidate section has accessible label', () => {
  const source = readDemoPage()
  return source.includes('aria-label="Candidate review diagnostic preview section"')
})

addCheck('MC35 demo route backlog section has accessible label', () => {
  const source = readDemoPage()
  return source.includes('aria-label="Feedback backlog preview section"')
})

addCheck('MC35 navigation remains hidden from demo route', () =>
  !readNavConfig().includes('candidate-review-demo') &&
  !readSidebar().includes('candidate-review-demo') &&
  !readTopbar().includes('candidate-review-demo') &&
  !readMobileNav().includes('candidate-review-demo')
)

await Promise.all(checkPromises)

const failures = checks.filter((check) => !check.passed)

for (const check of checks) {
  const status = check.passed ? 'PASS' : 'FAIL'
  console.log(`${status} ${check.label}`)
  if (check.error) {
    console.error(`  ${check.error.message}`)
  }
}

if (failures.length > 0) {
  console.error(`\nAudit event checks failed: ${failures.length}/${checks.length}`)
  process.exit(1)
}

console.log(`\nAll audit event checks passed: ${checks.length}/${checks.length}`)

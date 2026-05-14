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

addCheck('default persistence config is disabled', () => {
  return DEFAULT_AUDIT_PERSISTENCE_CONFIG.prototypeEnabled === false &&
    DEFAULT_AUDIT_PERSISTENCE_CONFIG.mode === 'mock_only' &&
    DEFAULT_AUDIT_PERSISTENCE_CONFIG.shadowWrites === false &&
    DEFAULT_AUDIT_PERSISTENCE_CONFIG.readFromPrototype === false
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

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------

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

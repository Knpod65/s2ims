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

const initialMockAuditLogLength = mockAuditLogs.length
const checks = []

function addCheck(label, run) {
  try {
    const result = run()
    checks.push({ label, passed: Boolean(result), error: null })
  } catch (error) {
    checks.push({ label, passed: false, error })
  }
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

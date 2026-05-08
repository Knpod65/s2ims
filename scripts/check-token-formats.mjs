#!/usr/bin/env node

// Lightweight guardrail checks for token display formatting.
// Intentionally duplicates minimal logic to avoid TS runtime/tooling changes.

const TOKEN_SUFFIX_LENGTH = 4;
const CANDIDATE_TOKEN_PREFIX = 'Candidate #C-';
const STUDENT_TOKEN_PREFIX = 'Student #S-';

function normalizeTokenSuffix(id) {
  const cleaned = String(id).replace(/[^a-zA-Z0-9]/g, '');
  return cleaned.slice(-TOKEN_SUFFIX_LENGTH).toUpperCase().padStart(TOKEN_SUFFIX_LENGTH, '0');
}

function formatCandidateToken(id) {
  return `${CANDIDATE_TOKEN_PREFIX}${normalizeTokenSuffix(id)}`;
}

function formatStudentToken(id) {
  return `${STUDENT_TOKEN_PREFIX}${normalizeTokenSuffix(id)}`;
}

const checks = [
  {
    label: 'formatCandidateToken("2048")',
    actual: formatCandidateToken('2048'),
    expected: 'Candidate #C-2048',
  },
  {
    label: 'formatCandidateToken("C-2048")',
    actual: formatCandidateToken('C-2048'),
    expected: 'Candidate #C-2048',
  },
  {
    label: 'formatStudentToken("650912345")',
    actual: formatStudentToken('650912345'),
    expected: 'Student #S-2345',
  },
  {
    label: 'formatStudentToken("S-2345")',
    actual: formatStudentToken('S-2345'),
    expected: 'Student #S-2345',
  },
];

const failures = checks.filter(c => c.actual !== c.expected);

for (const c of checks) {
  const status = c.actual === c.expected ? 'PASS' : 'FAIL';
  console.log(`${status} ${c.label} -> ${c.actual}`);
}

if (failures.length > 0) {
  console.error('\nToken formatting checks failed. Expected outputs changed:');
  for (const f of failures) {
    console.error(`- ${f.label}: expected "${f.expected}", got "${f.actual}"`);
  }
  process.exit(1);
}

console.log('\nAll token formatting checks passed.');

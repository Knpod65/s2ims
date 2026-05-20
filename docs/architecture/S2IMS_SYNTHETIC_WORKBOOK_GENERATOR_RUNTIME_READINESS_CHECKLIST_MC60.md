# S2IMS Synthetic Workbook Generator Runtime Readiness Checklist MC60

## Purpose
Prepare a checklist to validate readiness for implementing a generator script in MC61.

## Before creating script
- Confirm governance owners and security lead availability
- Confirm MC56/MC58 security triage findings are addressed
- Define approved output directory and fixture policy

## Before generating files
- Require deterministic seed in script
- Require configuration validation (no forbidden domains)
- Include manifest generation and hash reporting

## Before committing fixtures
- Security review signed off
- Governance approval (AP-10B) obtained
- QA acceptance of sample generated files

## Before using files in manual test
- Run local build and audit checks (42/42, 4/4, 502/502)
- Validate that import-preview handles files as expected in manual runs
- Record test runs and evidence (screenshots) in worksheet

## Security checks
- No real domain or id patterns allowed
- Forbidden headers only appear when explicitly requested and values are synthetic placeholders

## Governance checks
- Document approvals and attestation in commit message when fixtures are committed

## Stop conditions
- Any step reveals real PII in generated outputs
- Any step requires changes to src/ or scripts not approved

## Explicit approval required for MC61
- Security lead and governance owner approvals required prior to any script implementation

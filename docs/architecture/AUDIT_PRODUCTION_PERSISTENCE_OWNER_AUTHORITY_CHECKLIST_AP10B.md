# Audit Production Persistence Owner Authority Checklist AP-10B

## 1. Purpose

This checklist verifies whether candidate owners have the authority required for their assigned AP-10B approval role.

Authority verification is not approval collection.
Authority verification does not authorize AP-10C.
Authority verification only determines whether a candidate may later receive the sign-off packet.

## 2. Universal Authority Checklist

For each candidate owner, verify:

- [ ] Full name recorded
- [ ] Unit/department recorded
- [ ] Role/title recorded
- [ ] AP-10B owner role mapped
- [ ] Authority basis documented
- [ ] Contact channel recorded
- [ ] Availability confirmed
- [ ] Conflict of interest checked
- [ ] Backup/delegate documented or explicitly not applicable
- [ ] Candidate understands this is not approval collection
- [ ] Candidate understands AP-10C remains blocked
- [ ] Candidate understands approval later requires written sign-off
- [ ] QA reviewed the owner record

## 3. Role-Specific Checks

### 3.1 Engineering

- [ ] Candidate can review architecture and implementation feasibility
- [ ] Candidate can review schema constraints
- [ ] Candidate can review checksum/hash design
- [ ] Candidate can review rollback feasibility
- [ ] Candidate can block AP-10C if implementation risk is unresolved

### 3.2 DPO

- [ ] Candidate can review lawful basis
- [ ] Candidate can review retention
- [ ] Candidate can review erasure compatibility
- [ ] Candidate can review breach notification
- [ ] Candidate can block AP-10C if privacy basis is unresolved

### 3.3 Legal

- [ ] Candidate can review legal retention requirements
- [ ] Candidate can review evidence handling constraints
- [ ] Candidate can review cross-border restrictions
- [ ] Candidate can review export restrictions
- [ ] Candidate can block AP-10C if legal compliance is unresolved

### 3.4 Privacy/PDPA

- [ ] Candidate can review PII classification
- [ ] Candidate can review metadata/logging restrictions
- [ ] Candidate can review pseudonymization
- [ ] Candidate can review access boundaries
- [ ] Candidate can block AP-10C if PDPA controls are insufficient

### 3.5 Product/Admin

- [ ] Candidate can review Admin evidence boundary
- [ ] Candidate can review operational impact
- [ ] Candidate can review official audit log interpretation
- [ ] Candidate can review export/user impact
- [ ] Candidate can block AP-10C if operational risk is unresolved

### 3.6 QA

- [ ] Candidate can review validation evidence
- [ ] Candidate can review checklist completeness
- [ ] Candidate can review regression scope
- [ ] Candidate can review test freshness
- [ ] Candidate can block AP-10C if QA evidence is incomplete

### 3.7 Rollback

- [ ] Candidate can own rollback procedure
- [ ] Candidate can verify rollback timing
- [ ] Candidate can verify rollback communication path
- [ ] Candidate can confirm rollback test readiness
- [ ] Candidate can block AP-10C if rollback readiness is incomplete

## 4. Authority Verification Result

Allowed values:
- Verified
- Not verified
- Needs replacement
- More evidence required

## 5. Current Status

Current status:
- Authority verified: 0/7
- More evidence required: 7/7
- AP-10C remains blocked
- AP-11 remains blocked

Audit Production Persistence Privacy PDPA AP-10

1. Thailand PDPA alignment

The AP-10 production audit persistence layer is designed in alignment with the Thailand Personal Data Protection Act B.E. 2562 (2019) and its subsequent implementing regulations. The following provisions are directly applicable:

| Provision | Subject |
|-----------|---------|
| Section 26 | Sensitive personal data — heightened protection obligations |
| Section 27 | Data minimization — collect only what is necessary for the stated purpose |
| Section 30 | Data subject access rights — right to receive information about personal data held |
| Section 33 | Erasure and restriction rights — right to request deletion or restriction of processing |
| Section 37 | Data breach notification — obligation to notify PDPC within 72 hours |
| Section 40 | DPO designation requirement — appointment and contact details |
| Section 41 | DPO duties — monitoring compliance, advising on PDPA obligations |

This document is a planning-phase privacy model. It defines what must be true before production persistence is activated. No runtime implementation exists yet. All requirements in this document become binding conditions for phase (c) onward.

2. Data minimization

Principle: the production audit store must collect only the personal data fields strictly necessary to fulfil the audit purpose (access control verification, fraud detection, regulatory compliance). Any field not required for these purposes must be excluded.

Minimization review:
- The required fields list in AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 2 is the complete permitted set.
- Any addition to the required fields list requires a written DPO review before the field is added to the schema.
- The minimization posture must be reviewed annually and after any significant change to the audit scope.
- "Convenient for debugging" is not a sufficient basis for storing additional fields.

3. PII fields in production audit records

Direct identifiers (must never be stored raw):
- National ID numbers, passport numbers, foreign national IDs
- Email addresses
- Phone numbers
- Bank account or financial identifiers
- IP addresses (when linkable to an individual)

Indirect identifiers requiring pseudonymization:
- `actorId`: must be stored as a one-way hash or token. The mapping table (token → real identity) is held separately and access-controlled.
- `targetId`: must be stored as a one-way hash or token. Same separation as `actorId`.

Potentially sensitive free text:
- `reason`: may contain indirect PII (e.g., references to a named individual, a document number, a situation). `reason` text must not be full-text indexed in production. Any export that includes `reason` fields requires DPO review.

Non-PII fields (permitted without pseudonymization):
- `eventId`, `actorRole`, `targetType`, `action`, `createdAt`, `environment`, `sessionId`, `checksumHash`

4. Lawful basis

Two lawful bases apply to the production audit store:

- Legal obligation (PDPA Section 24(3)): collection and retention of audit records is required to satisfy regulatory obligations for access logging and compliance reporting. This basis applies to all standard access and data modification events.
- Legitimate interest (PDPA Section 24(5)): audit records support fraud prevention and access control enforcement. This basis applies to supplementary event types not covered by legal obligation. A legitimate interest assessment (LIA) must be documented and approved by the DPO before production activation.

The lawful basis for each event type must be explicitly documented in the DPO's privacy notice before production persistence is activated. A basis of "we might need it later" is not permitted.

5. Retention and deletion schedule

| Record type | Retention | Trigger for deletion |
|-------------|-----------|---------------------|
| Standard access/view events | 3 years from `createdAt` | Automated schedule + DPO approval per batch |
| Data modification events | 7 years from `createdAt` | Automated schedule + DPO approval per batch |
| PDPA-sensitive events | Up to 7 years; erasure on request | PDPA Article 33 erasure request or schedule |
| Staging events | 90 days maximum | Automated; no DPO approval required for staging |
| Erasure log entries | 7 years | Regulatory minimum; same approval as core events |

Deletion procedure:
- Physical row deletion is prohibited on the core event table. In-place suppression only (see AUDIT_PRODUCTION_PERSISTENCE_DATABASE_MODEL_AP10.md section 6).
- Batch deletions require DPO written approval with the batch ID and affected `eventId` count (not raw IDs).
- Retention schedule review: annually, documented in aggregate form.

6. Subject access requests (PDPA Section 30)

Procedure for processing a data subject access request (DSAR):

1. Verify requestor identity using an independent identity verification step — not the audit system itself.
2. Query the production event store by `actorId` token for events where the requestor is the actor (what did this person do?).
3. Query by `targetId` token for events where the requestor is the subject of actions (what was done to this person?).
4. Return an aggregate summary in Thai and English: event types, date ranges, counts. Raw event payloads (especially `reason` text) are not returned directly without DPO review.
5. Log the DSAR and its response as an audit event in the production store.
6. Respond within 30 days of receipt of the verified request.
7. If the request requires disclosure of another individual's data (e.g., the actor's identity is another person), apply redaction before responding.

The DSAR procedure must be documented in the organization's PDPA privacy notice before production persistence is activated.

7. Erasure and restriction (PDPA Section 33)

Erasure procedure (in-place suppression):
- Suppress PII fields: `actorId`, `targetId`, `reason`, `sessionId` — replaced with erasure token.
- Preserve skeletal record: `eventId`, `action`, `createdAt`, `environment` remain intact.
- Recompute `checksumHash` over the suppressed record. Preserve original `checksumHash` in the erasure log.
- Log the erasure event: batch ID, DPO approval reference, affected `eventId` list (hashed, not raw), date of erasure, operator identity.

Restriction procedure:
- Flag the record with `restricted: true`.
- Restricted records are excluded from standard Admin review queries.
- Restricted records may only be accessed by DPO or authorized legal counsel via a separate, audited access path.
- Restriction does not suppress PII fields — it prevents routine access.

Conditions for erasure:
- The data is no longer necessary for the purpose for which it was collected.
- The data subject withdraws consent (where consent is the lawful basis).
- The data subject objects to processing under legitimate interest and there are no overriding legitimate grounds.
- The retention period has expired.

Conditions for restriction:
- The accuracy of the data is contested.
- The processing is unlawful but the data subject requests restriction rather than erasure.
- The organization no longer needs the data but the data subject requires it for legal claims.

Erasure must not break audit trail continuity. The skeletal record with suppressed fields is the mechanism for continuity.

8. Cross-border data transfer

Audit log data containing personal data may not be transferred outside Thailand without all of the following:

- Explicit written DPO authorization specifying the destination, purpose, and data categories.
- An adequacy decision (PDPC-recognized) for the destination country, or standard contractual clauses approved by the DPO and legal counsel.
- Legal review confirming no regulatory prohibition on the transfer.
- Documentation of the transfer logged as an audit event.

Cloud storage and backup:
- All production event store data must be hosted in Thailand-region storage.
- Backup storage must also be confirmed as Thailand-region only.
- Any cloud provider used must provide written confirmation of Thailand-region data residency before production activation.

Prohibition:
- Audit log data must not be replicated to a foreign region, even temporarily, without the full authorization chain above.
- Monitoring pipelines that receive aggregate metrics must be confirmed as not transmitting individual event data outside Thailand.

9. Data breach and incident response

Incident trigger: any confirmed or suspected exposure of personal data from the production audit store.

Immediate actions (within 1 hour of discovery):
1. Disable the affected persistence write path by setting the relevant flag to `false` in the staging config override.
2. Notify the DPO.
3. Assess scope using aggregate-only data — no additional PII access during the initial assessment.
4. Preserve incident log in aggregate-only language — no PII in the incident report.

PDPC notification threshold (within 72 hours of discovery):
- More than 50 data subjects are affected, or
- Sensitive personal data (Section 26) is involved (regardless of count), or
- The breach is likely to result in high risk to affected individuals.

If the threshold is met, submit notification to the Office of the PDPC within 72 hours of discovery.

Incident report requirements:
- Aggregate-only language: affected event count (not individual IDs), event type categories, date range.
- No PII in the incident report document.
- Root cause and remediation steps in technical language.
- DPO sign-off on the incident report before it is filed.

Post-incident:
- Do not re-enable the affected persistence path until the root cause is identified and remediated.
- Conduct a full privacy review before re-enabling.

10. DPO sign-off requirement

Production persistence cannot be activated under any circumstances without a written DPO sign-off confirming all of the following:

- Data minimization: the required fields list has been reviewed and confirmed to be the minimum necessary.
- Lawful basis: the basis for each event type is documented in the privacy notice.
- Retention schedule: retention periods are defined and the automated deletion trigger is in place.
- Erasure procedure: in-place suppression has been tested and the erasure log format is approved.
- Breach notification procedure: the 72-hour PDPC notification procedure is documented and the responsible contacts are identified.
- Cross-border transfer restriction: Thailand-region hosting is confirmed in writing from the cloud provider.
- Privacy notice: the organization's PDPA privacy notice has been updated to reflect the audit persistence system.
- DSAR procedure: the subject access request procedure is documented and the 30-day response window is achievable.

The DPO sign-off must be in writing (email or signed document) and must reference this document by name and version (AP-10 planning phase). It must be obtained before any phase (c) implementation begins, not after.

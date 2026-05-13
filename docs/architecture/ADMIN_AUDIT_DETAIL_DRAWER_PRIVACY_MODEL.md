# Admin Audit Event Detail Drawer Privacy Model (AP-6B)

## Purpose
This document outlines the privacy model for the Admin Audit Event Detail Drawer. It defines which fields an Admin may see, which should be tokenized, which metadata keys are safe or blocked, and how to render sensitive metadata safely. It also considers provider/executive boundaries and future RBAC splits.

## Core Principles
- **Minimum Necessary**: Display only the information needed for the Admin to understand the event context.
- **Tokenization of Identifiers**: Replace raw IDs with tokens (e.g., `S-123`, `ST-456`) unless the Admin has a specific need for raw IDs (not in this phase).
- **Metadata Filtering**: Apply privacy rules to metadata keys to prevent leakage of sensitive information.
- **Contextual Awareness**: The target's privacy level dictates the level of detail shown for the target and its associated metadata.
- **Consistency**: Apply the same privacy rules to both mock and official persisted events.

## Field Visibility by Role (Admin Viewer)
This section assumes the viewer is an Admin. Future phases may differentiate between Admin and Staff viewers.

### Always Visible (Non-Sensitive)
- **Event ID**: The audit event's UUID or identifier (e.g., `evt_abc123`). This is not considered sensitive.
- **Timestamp**: When the event occurred.
- **Event Type**: The type of audit event (e.g., `STAFF_DOCUMENT_VERIFY`).
- **Policy Version**: The audit policy version.
- **Action**: A human-readable description of the action (e.g., "Verified document").
- **Persistence Mode**: One of `mock_only`, `real_persisted`, `prototype_only`.

### Tokenized or Alternative Representation
- **Actor ID**: Show as actor token (e.g., `ST-456` for staff, `PR-789` for provider). Do not show raw IDs (e.g., database primary keys).
- **Actor Role**: The role of the actor (e.g., `staff`, `provider`, `system`).
- **Actor Name**: Only show if the target's privacy level permits and if the name is considered non-sensitive in context. Otherwise, show token only or "[Name withheld]".
- **Target ID**: Show as target token (e.g., `S-123` for student, `DOC-456` for document). Do not show raw IDs.
- **Target Type**: The type of target (e.g., `student`, `document`, `scholarship`).
- **Target Name**: Only show if the target's privacy level permits (e.g., for public targets) and if the name is non-sensitive. Otherwise, show token only or "[Name withheld]".

### Conditionally Visible (Based on Target Privacy Level)
The target's privacy level (from the audit event's `targetPrivacyLevel` field) determines what additional details can be shown.

#### Public Target (`public`)
- **Target Name**: May be shown if it is already public information (e.g., a public scholarship name).
- **Metadata**: Show all non-sensitive metadata keys. Apply standard metadata privacy rules (see below).

#### Sensitive Target (`sensitive`)
- **Target Name**: Do not show; show token only or "[Target]".
- **Metadata**: 
  - Tokenize or hash any identifier-like values (e.g., if a metadata value looks like an ID, show a token).
  - Show only metadata keys that are marked as safe in `auditMetadataRules.ts`.
  - For unsafe metadata keys, apply the blocked key rule.

#### Restricted Target (`restricted`)
- **Target Name**: Do not show; show token only or "[Target]".
- **Metadata**: 
  - Show only non-identifying metadata (e.g., counts, timestamps, non-ID strings).
  - Block any metadata that could be used to identify an individual or sensitive information.
  - Use the blocked key rule for sensitive keys.

## Metadata Privacy Rules
These rules are based on `src/lib/audit/auditMetadataRules.ts` (as of the current codebase) and should be kept in sync.

### Safe Metadata Keys (`SAFE_METADATA_KEYS`)
These keys are considered safe to display as-is (assuming their values are already non-sensitive or have been sanitized upstream).
- Examples: `policyVersion`, `sourceRoute`, `documentType` (if non-sensitive), `outcome` (if non-sensitive).

### Blocked Metadata Keys (`BLOCKED_METADATA_KEYS`)
These keys must never be displayed in their raw form. Instead, display the placeholder "[Hidden by privacy rule]".
- Examples: `rawStudentId`, `providerApiKey`, `internalNotes`, `ssn`, `emailAddress`, `phoneNumber`.

### Other Metadata Keys
For keys not in `SAFE_METADATA_KEYS` or `BLOCKED_METADATA_KEYS`, apply a default safety rule:
- If the key name suggests it is an identifier (e.g., ends with `Id`, `Key`, `Token`) or the value looks like an identifier (e.g., alphanumeric string of certain length), tokenize the value.
- Otherwise, display the value as-is but consider it for redaction if it contains PII (this phase does not implement advanced PII detection; rely on the blocked list and tokenization of ID-like values).

## Rendering Sensitive Metadata Safely
- **Tokenization**: Replace identifiers with a consistent token format (e.g., `S-###` for student IDs, `ST-###` for staff tokens). Use a mapping or hashing function that is deterministic but not reversible.
- **Hashing**: For non-tokenizable sensitive data, show a hash (e.g., SHA-256 truncated) if needed for correlation, but note that this is not typically useful for Admins. Prefer tokenization for consistency with ID display.
- **Redaction**: Show "[Hidden by privacy rule]" for blocked keys.
- **Partial Display**: In some cases, show only the last 4 characters of an identifier (if useful for debugging) but this is not the default.

## Provider/Executive Boundaries
- **Provider Viewers**: In the future, providers may see a subset of audit events (e.g., related to their own scholarships). Their privacy model may differ (e.g., they might see student names for their own applicants). This is out of scope for AP-6B (Admin-only).
- **Executive Viewers**: Executives may see more detailed information (e.g., aggregated data) but not necessarily raw audit event details. This is also out of scope.
- For AP-6B, we assume the Admin viewer and apply the rules above.

## Future RBAC Split for Admin vs Staff Viewer
- **Staff Viewers**: When viewing audit events (e.g., in their own dashboard), Staff may see more context about their own actions but less about others. This requires a separate privacy model.
- **Admin Viewers**: As defined above, Admins see events across the system but with privacy protections for targets.
- The drawer component should be designed to accept a `viewerRole` prop (or similar) that influences the privacy model applied. For AP-6B, we hardcode the Admin model.

## Examples of Safe and Unsafe Drawer Payloads

### Safe Payload (Mock Event)
```json
{
  "id": "evt_123",
  "timestamp": "2026-05-10T14:30:00Z",
  "eventType": "STAFF_DOCUMENT_VERIFY",
  "policyVersion": "1.0",
  "actorId": "ST-456",
  "actorRole": "staff",
  "actorName": "Jane Doe", // Assume public or permitted
  "targetId": "S-789",
  "targetType": "student",
  "targetName": "John Smith", // Assume public or permitted (e.g., directory info)
  "targetPrivacyLevel": "public",
  "action": "Verified document",
  "reason": "Document matches application",
  "persistenceMode": "mock_only",
  "metadata": {
    "documentId": "DOC-101", // Tokenized ID, safe to show
    "verificationOutcome": "matched",
    "policyVersion": "1.0"
  }
}
```

### Unsafe Payload (Raw Data That Should Be Sanitized)
```json
{
  "id": "evt_123",
  "timestamp": "2026-05-10T14:30:00Z",
  "eventType": "STAFF_DOCUMENT_REJECT",
  "policyVersion": "1.0",
  "actorId": "staff-789-db", // Raw ID -> should be tokenized to ST-789 or similar
  "actorRole": "staff",
  "actorName": "Jane Doe",
  "targetId": "student-456-db", // Raw ID -> should be tokenized to S-456
  "targetType": "student",
  "targetName": "John Smith",
  "targetPrivacyLevel": "sensitive",
  "action": "Rejected document",
  "reason": "Document forged",
  "persistenceMode": "mock_only",
  "metadata": {
    "rawStudentId": "student-456-db", // Blocked key -> show "[Hidden by privacy rule]"
    "internalNotes": "Check for forgery", // Blocked key -> show "[Hidden by privacy rule]"
    "documentId": "doc-101-db", // Looks like an ID -> should be tokenized (e.g., DOC-101)
    "ssn": "123-45-6789" // Blocked key -> show "[Hidden by privacy rule]"
  }
}
```

After applying privacy rules, the unsafe payload should render as:
- Actor ID: `ST-789` (or similar token)
- Target ID: `S-456` (or similar token)
- Metadata:
  - `rawStudentId`: "[Hidden by privacy rule]"
  - `internalNotes`: "[Hidden by privacy rule]"
  - `documentId`: `DOC-101` (tokenized)
  - `ssn`: "[Hidden by privacy rule]"

## Implementation Notes
- Centralize privacy rule logic in `src/lib/audit/auditMetadataRules.ts` (or a new privacy utils file) and use it in the drawer component.
- The drawer component should receive the full audit event and the target's privacy level (or compute it from the event).
- For each field, apply the appropriate rule based on the field type and the privacy model.
- Ensure that the same rules are applied to both mock and official persisted events.
- Test with a variety of audit events from the mock fixture to ensure compliance.

# Admin Audit Event Detail Drawer Copy Rules (AP-6B)

## Purpose
This document defines the copy (text content) to be used in the Admin Audit Event Detail Drawer. It ensures consistent, accurate, and safe messaging that distinguishes between mock/demo data and (future) official persisted records, while avoiding any implication of real audit persistence for mock events.

## Mock-Only Drawer Copy
For events with persistence mode `mock_only`:

### General Mock Identification
- **Drawer Title**: "Audit Event Detail (Mock/Demo)"
- **Persistence Section Header**: "Evidence Status"
- **Persistence Status Message**: "This is a mock/demo event. Not official audit evidence."
- **Alternative Mock Messages**:
  - "This event is part of the mock/demo dataset."
  - "For demonstration purposes only. Not real audit persistence."
  - "Mock data - does not represent actual system events."

### Section Labels (Keep consistent with official copy)
- Event Identity
- Actor
- Target
- Action/Reason
- Persistence/Evidence
- Metadata

### Field-Level Copy
- **Missing Event ID**: "Event ID not available"
- **Missing Timestamp**: "Timestamp not available"
- **Missing Actor/Target**: "[Actor/Target] not available"
- **Missing Reason**: "Reason not provided"
- **Empty Metadata**: "No additional metadata"
- **Missing Metadata Value**: "[Value not available]"
- **Hidden Metadata (by privacy rule)**: "[Hidden by privacy rule]"

## Official Persisted Drawer Copy (Future)
For events with persistence mode `real_persisted` (to be implemented in later phases):

### General Official Identification
- **Drawer Title**: "Audit Event Detail"
- **Persistence Section Header**: "Evidence Status"
- **Persistence Status Message**: "This is an official persisted audit event."
- **Alternative Official Messages**:
  - "This event is part of the persisted audit trail."
  - "Real audit persistence - official system event."
  - "Persisted audit record - official evidence."

### Section Labels (Same as mock copy)
- Event Identity
- Actor
- Target
- Action/Reason
- Persistence/Evidence
- Metadata

### Field-Level Copy (Same as mock copy for consistency)
- **Missing Event ID**: "Event ID not available"
- **Missing Timestamp**: "Timestamp not available"
- **Missing Actor/Target**: "[Actor/Target] not available"
- **Missing Reason**: "Reason not provided"
- **Empty Metadata**: "No additional metadata"
- **Missing Metadata Value**: "[Value not available]"
- **Hidden Metadata (by privacy rule)**: "[Hidden by privacy rule]"

## Prototype-Only Copy
For events with persistence mode `prototype_only`:
- **Persistence Status Message**: "This is a prototype event. Not official audit evidence."
- **Drawer Title**: "Audit Event Detail (Prototype)"

## Prohibited Phrases
These phrases must not appear in any drawer copy (mock, official, or prototype) as they overstate the evidentiary weight or compliance status of the event:

### Evidence/Validation Implications
- "Verified"
- "Confirmed"
- "Validated"
- "Certified"
- "Approved"
- "Authorized"
- "Legally binding"
- "Compliant with"
- "Meets requirements of"
- "Satisfies"
- "Fulfills"
- "Attests to"
- "Witnesses"
- "Ensures"
- "Guarantees"

### Persistence Implications (for mock/prototype)
- "Persisted"
- "Stored"
- "Saved"
- "Recorded in system"
- "Official record"
- "System of record"
- "Permanent record"
- "Archived"

### Action Implications
- "Action completed"
- "Task finished"
- "Process finalized"
- "Workflow concluded"

### Data Integrity Implications
- "Data integrity verified"
- "Information accurate"
- "Details confirmed"
- "Record is complete"
- "No missing information"

## Copy for “Not Official Evidence”
Use these exact phrases to clearly communicate the non-evidentiary nature of mock/demo data:

- "This is a mock/demo event. Not official audit evidence."
- "This event is part of the mock/demo dataset and does not represent real audit persistence."
- "For demonstration purposes only. Not an official audit record."
- "Mock data - cannot be used as audit evidence."
- "This is simulated data for UI demonstration."

## Copy for “Metadata Hidden by Privacy Rule”
Use this exact phrase when a metadata key is blocked by privacy rules:

- "[Hidden by privacy rule]"

### Alternative (if space constrained):
- "[Private]"
- "[Restricted]"

## Copy for “Reason Missing”
Use these event-type-aware phrases when reason is expected but missing:

- **General**: "Reason not provided"
- **Document Rejection**: "No reason provided for rejection"
- **Document Replacement Request**: "No reason provided for replacement request"
- **Other Action Types**: Follow the pattern "[Action] reason not provided"

## Copy for “Target Token Only”
When target details are unavailable due to privacy rules or missing data, use:

- **Target ID only**: "Target: [TOKEN_FORMAT]" (e.g., "Target: S-1234")
- **Target Type + ID**: "[TARGET_TYPE] [TOKEN_FORMAT]" (e.g., "Student S-1234")
- **When even token is unavailable**: "Target not available"

## Thai/English Copy Guidance
If bilingual copy is needed in the future:

### English Primary, Thai Secondary
- Use English as the primary language for all drawer copy.
- Consider Thai translations for public-facing terms if the Admin UI supports language switching.
- Technical terms (like "mock", "persisted", "metadata") may remain in English.

### Suggested Thai Translations (if needed)
- "Not official audit evidence" → "ไม่ใช่หลักฐานการตรวจสอบอย่างเป็นทางการ"
- "Mock/demo event" → "เหตุการณ์จำลอง/สาธิต"
- "Reason not provided" → "ไม่ได้ระบุเหตุผล"
- "Hidden by privacy rule" → "ถูกซ่อนโดยกฎความเป็นส่วนตัว"
- "No additional metadata" → "ไม่มีข้อมูลเมตาเพิ่มเติม"

## Copy Implementation Notes
- All copy should be centralized in a constants or i18n file for easy maintenance and translation.
- Avoid hardcoding strings directly in components.
- Use descriptive keys for copy lookup (e.g., `COPY.DRAWER.TITLE_MOCK`, `COPY.DRAWER.PERSISTENCE_MOCK`).
- Ensure copy updates are reflected in both mock and official persisted versions where appropriate.
- Review copy with compliance/legal team if this drawer is ever used in regulated contexts.

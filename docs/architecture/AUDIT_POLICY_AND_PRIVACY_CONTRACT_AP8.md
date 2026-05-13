# Audit Policy and Privacy Contract AP-8

## 1. Purpose
Define the policy and privacy rules that govern audit event creation, storage, and display. This contract ensures that sensitive information is not exposed in audit events and that appropriate access controls are maintained.

## 2. Current Metadata Rule State
The current `src/lib/audit/auditMetadataRules.ts` defines:
- `SAFE_METADATA_KEYS`: Keys that are safe to log without restriction (e.g., `policyVersion`, `sourceRoute`).
- `BLOCKED_METADATA_KEYS`: Keys that must never be logged (e.g., `rawStudentId`, `ssn`, `providerApiKey`, `internalNotes`).

These rules are enforced in the `auditEventBuilder.ts` before an event can be created.

## 3. Policy Layers
### Metadata Key Policy
- Only metadata keys in `SAFE_METADATA_KEYS` or explicitly allowed by the action's policy can be included in an audit event.
- Keys that look like identifiers (e.g., `*Id`, `*Token`) may be auto-blocked unless explicitly whitelisted.
- Forbidden keys are rejected during event construction.

### Role Visibility Policy
- **Admin**: Can view audit events across all contexts but with metadata privacy rules applied.
- **Staff**: Can view audit events related to their own actions and to students/documents they have accessed.
- **Provider**: Can view audit events related to their scholarships and candidates.
- **ESQ/Executive**: Aggregate-only view; no raw data access.
- **Student**: Cannot view audit events directly.

### Target Privacy Policy
- **Public**: Target information (name, ID) can be displayed as-is or tokenized.
- **Sensitive**: Target ID is tokenized; name is hidden or tokenized.
- **Restricted**: Only non-identifying information is shown; metadata is heavily filtered.

### Provider/Executive Aggregate Boundary
- Providers cannot see raw student identifiers in audit events.
- Executive/ESQ reports must not expose individual student data; only aggregated statistics are shown.

### Admin Full Visibility with Masking Rules
- Admins can see the full audit trail but with metadata privacy rules applied.
- Raw student IDs are always tokenized (e.g., `S-123`).
- Blocked metadata keys are replaced with "[Hidden by privacy rule]".

### Staff Scoped Visibility
- Staff can view audit events for actions they performed or on documents/students they are working with.
- Reason for action may be visible if the action is directly related to their workflow.

## 4. Forbidden Metadata Keys
From `auditMetadataRules.ts`:
- `rawStudentId` - contains raw student identifier
- `rawProviderId` - contains raw provider identifier
- `rawActorId` - contains raw actor identifier
- `providerApiKey` - sensitive API credential
- `internalNotes` - internal comments that may contain sensitive info
- `ssn` - social security number
- `emailAddress` - student/provider email
- `phoneNumber` - phone number
- `address` - physical address

## 5. Safe Metadata Examples
- `policyVersion`: The audit policy version (e.g., "1.0")
- `sourceRoute`: The route that triggered the event (e.g., "/staff/applications/app_001")
- `documentId`: Tokenized document ID (e.g., "DOC-101")
- `verificationOutcome`: Outcome of document verification (e.g., "matched", "rejected")
- `scholarshipId`: Tokenized scholarship ID (e.g., "SCH-501")

## 6. Unsafe Metadata Examples
- `studentId`: Raw student database ID (should be tokenized as `targetToken` instead)
- `providerName`: Full provider name (should be tokenized unless explicitly safe)
- `staffNotes`: Free-form staff comments about a student/document (may contain PII)

## 7. Role-Based Visibility Matrix
| Role | Can View Actor | Can View Target | Can View Reason | Can View Metadata | Can Export | Masking Required |
|------|-------------|----------------|---------------|-----------------|------------|------------------|
| Admin | Yes | Yes (tokenized) | Yes | Yes (filtered) | Yes (filtered) | Target ID → Token, blocked keys → [Hidden] |
| Staff | Yes (if involved) | Yes (if involved, tokenized) | Yes (if own action) | Yes (filtered) | No | Same as Admin |
| Provider | No | No | No | No | No | N/A |
| ESQ/Executive | Aggregate only | Aggregate only | Aggregate only | Aggregate only | Aggregate only | Aggregate only |
| Student | No | No | No | No | No | N/A |

## 8. Laravel/PHP Mapping
| S2IMS Concept | Laravel/PHP Equivalent |
|--------------|----------------------|
| `AuditPolicyGuard` | `App\Policies\AuditPolicy` |
| `AuditMetadataSanitizer` | `App\Services\Audit\AuditMetadataSanitizer` |
| Metadata rule constants | `config/audit.php` or `App\Data\Audit\MetadataRules.php` |
| Policy check | `AuditPolicy::requiresAudit()` and `AuditPolicy::allowedMetadataKeys()` |
| Resource masking | `App\Http\Resources\AuditEventResource` applies `AuditMetadataSanitizer` |
| Policy enforcement | Laravel Policy middleware or custom gate checks |

```php
// Example: AuditPolicy
namespace App\Policies;

final class AuditPolicy
{
    public function requiresAudit(User $user, string $actionType): bool
    {
        return in_array($actionType, config('audit.sensitive_actions'));
    }

    public function view(User $user, AuditEvent $event): bool
    {
        return match($user->role) {
            'admin' => true,
            'staff' => $event->actor->id === $user->id,
            default => false,
        };
    }

    public function viewMetadata(User $user, AuditEvent $event, string $key): bool
    {
        if (in_array($key, config('audit.blocked_metadata_keys'))) {
            return false;
        }
        return true;
    }
}
```

## 9. UI Copy Implications
- Do not claim that mock events are "real" or "official" audit records.
- Use copy such as "This is a mock/demo event. Not official audit evidence."
- In the Admin drawer and table, show the persistence mode (Mock/Demo, Official, etc.).
- Do not claim compliance until real persistence is verified and tested.

## 10. Notification Issue Relationship
If notifications are linked to audit events in the future:
- The notification payload must use tokenized identifiers (e.g., `targetToken: "S-123"` not `studentId: 456`).
- The notification click route must be scoped by role (e.g., staff can only see notifications for their own actions).
- The notification action (click) must respect the same privacy rules as viewing an audit event.

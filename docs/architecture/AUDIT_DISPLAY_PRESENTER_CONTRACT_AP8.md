# Audit Display Presenter Contract AP-8

## 1. Purpose
Define the contract for converting stored audit events into UI-ready display rows for the Admin audit log table, Admin drawer, and CSV exports. The presenter separates display concerns from storage concerns.

## 2. Current adminAuditDisplayAdapter Role
The `src/lib/audit/adminAuditDisplayAdapter.ts` currently maps mock audit log rows to Admin display rows. It:
- Formats timestamps
- Tokenizes actor and target IDs
- Applies persistence mode labels
- Prepares severity labels

This adapter is specific to the Admin context and will evolve into the `AdminAuditDisplayPresenter`.

## 3. Future Presenter Responsibility
The `AuditDisplayPresenter` will:
- Accept an `AuditEvent` from the repository (not the raw stored data).
- Convert the event into a `AuditDisplayRow` type suitable for UI rendering.
- Handle localization (Thai/English labels).
- Apply copy-stage resolution for persistence mode labels.
- Ensure no PII leaks through the presenter.

The presenter must not:
- Write events to the repository
- Validate input or reason
- Sanitize metadata after the repository has already accepted it
- Decide on persistence mode (that is stored in the event)

## 4. Display Row Shape
```typescript
type AuditDisplayRow = {
  id: string; // event ID
  createdAt: string; // ISO formatted date/time
  actorLabel: string; // e.g., "ST-456" or "Jane Doe" if allowed by privacy rules
  actorRoleLabel: string; // localized role name, e.g., "Staff"
  actionLabel: string; // localized action, e.g., "Rejected document"
  targetLabel: string; // e.g., "S-123" or document name if allowed
  sourceLabel: string; // source route or role, e.g., "Staff Application"
  persistenceLabel: string; // localized, e.g., "Mock/Demo"
  severityLabel: string; // localized, e.g., "Info", "Warning"
  routeHref?: string; // link to detail view (if applicable)
  canOpenDetail: boolean; // whether the detail drawer is available
  copyStage: 'mock_only' | 'real_persisted' | 'prototype_only'; // for conditional rendering
};
```

## 5. Source/Persistence Label Rules
- `mock_only`: Display "Mock/Demo" or localized equivalent.
- `real_persisted`: Display "Official" or localized equivalent.
- `prototype_only`: Display "Prototype" or localized equivalent.
- The label text is determined by a `AuditCopyStageResolver` and must not be hardcoded in the presenter.

## 6. Thai/English Label Boundary
- Labels are stored in a copy configuration or localization file.
- The presenter uses a `t` function (translation function) to retrieve localized strings.
- Example: `t('audit.persistence.mock_only')` returns "Mock/Demo" (EN) or "การทดสอบ/ตัวอย่าง" (TH).

## 7. Drawer Display Contract
The Admin drawer uses a `AuditDisplayRow` but may need additional fields:
- Extended metadata (with privacy-appropriate filtering).
- Full reason text (if applicable).
- Source route details.

These can be added as optional fields in a `AuditDrawerDisplayRow` that extends `AuditDisplayRow`.

## 8. CSV/Export Display Contract
For CSV export, the presenter must:
- Include columns: ID, Created At, Actor, Actor Role, Action, Target, Source, Persistence, Severity, Reason (if available).
- Tokenize all identifiers (no raw IDs).
- Mask blocked metadata keys.
- Use locale-appropriate headers (e.g., "Actor" / "ผู้กระทำ").
- Include a row indicating if the event is mock/demo.

## 9. Presenter Must Not
- Write events to the repository
- Validate input or reason
- Sanitize raw metadata after the repository has already accepted unsafe metadata
- Claim persistence ("real", "official") unless the event's persistence mode is `real_persisted`
- Include blocked metadata keys

## 10. Laravel/PHP Equivalent
| S2IMS Concept | Laravel/PHP Equivalent |
|-------------|----------------------|
| `AdminAuditDisplayPresenter` | `App\Http\Resources\AuditEventResource` |
| `AuditDisplayRow` | Properties returned by `AuditEventResource::toArray()` |
| Localization | `lang/en/audit.php` and `lang/th/audit.php` |
| Collection | `App\Http\Resources\AuditEventCollection` |

```php
// Example: AuditEventResource
namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

final class AuditEventResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'createdAt' => $this->createdAt->toISOString(),
            'actorLabel' => $this->actor->token, // tokenized
            'actorRoleLabel' => __('audit.roles.' . $this->actor->role),
            'actionLabel' => __('audit.actions.' . $this->action->type),
            'targetLabel' => $this->target->token,
            'sourceLabel' => $this->sourceRoute,
            'persistenceLabel' => __('audit.persistence.' . $this->persistenceMode),
            'severityLabel' => __('audit.severity.' . $this->severity),
            'routeHref' => $this->detailRoute,
            'canOpenDetail' => true,
            'copyStage' => $this->persistenceMode,
        ];
    }
}
```

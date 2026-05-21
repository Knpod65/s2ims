# /bilingual-check — Thai/English Copy Consistency

**Purpose**: Audit Thai and English copy consistency across S²IMS pages for bilingual compliance.

**When to use**: Before shipping any user-facing page, or when reviewing copy in page.tsx or component files.

**Files to read**:
1. The page/component specified by the user
2. `docs/design/S2IMS_DESIGN_SYSTEM_DIRECTION_MC69.md` — bilingual rules section
3. Similar pages for cross-reference (e.g., other role dashboards)

**Files NOT to touch**: Read-only.

**Behavior**:
1. Scan the specified file(s) for Thai string literals and English labels
2. Check: are Thai strings used consistently alongside English equivalents?
3. Check: are labels, empty states, error messages, and status labels bilingual?
4. Flag: Thai-only labels without English fallback, English-only labels that should have Thai, inconsistent transliteration

**Output format**:
```
## Bilingual Check: [scope]

### Coverage
- Total text strings: [N]
- Thai: [N] | English: [N] | Mixed: [N]

### Issues
- [file:line]: Thai-only label "[text]" — add English
- [file:line]: English-only "[text]" — consider Thai equivalent
- [file:line]: Inconsistent: "[Thai]" vs "[Thai in similar page]"

### Copy Recommendations
- [label]: Thai "[TH]" / English "[EN]"
```

**Token-saving rules**: Scope to the specified file — do not scan all 54 pages.

**Safety boundaries**: Read-only. Do NOT modify any source files.

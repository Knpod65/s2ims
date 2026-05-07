StudentPrivacyNotice: reuse decision

Summary
- After review, `StudentPrivacyNotice` remains a separate component.

Reasons
- The foundation `PrivacyNotice` primitive (src/components/ui/index.tsx) uses a simple emoji-based icon and a tightly-coupled layout that other UI surfaces depend on.
- `StudentPrivacyNotice` uses a distinct Shield icon, stronger visual role accent, and slightly larger typography and spacing to communicate PDPA/governance context specifically within student flows.
- Changing the UI primitive to accept a custom icon or variant is a non-trivial public API change that risks visual regressions in other areas.

Decision
- Keep `StudentPrivacyNotice` separate to avoid broad changes to the UI primitive. Documented here so Phase 3 can consider adding an `icon`/`variant` prop to the foundation primitive if desired.

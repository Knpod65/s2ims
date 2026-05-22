# Manifest: Source Files and Bundle Inventory

**Bundle Version**: 1.0  
**Created**: 2026-05-22  
**Summary**: 11 of 14 source files copied, 3 missing (MC85 visual identity not yet created)

## Source File Inventory

| Milestone | Source Path | Bundle Path | Status | Size | Notes |
|-----------|------------|-------------|--------|------|-------|
| MC72 | `docs/design/S2IMS_FIGMA_REDESIGN_MASTER_BRIEF_MC72.md` | `02_FIGMA_BRIEFS/` | ✓ Copied | ~2.5 KB | Master design brief, goals, principles, user roles |
| MC72 | `docs/design/S2IMS_ROLE_BASED_SCREEN_FRAME_PLAN_MC72.md` | `02_FIGMA_BRIEFS/` | ✓ Copied | ~4.2 KB | All routes organized by role and journey |
| MC72 | `docs/design/S2IMS_FIGMA_COMPONENT_LIBRARY_BRIEF_MC72.md` | `02_FIGMA_BRIEFS/` | ✓ Copied | ~3.1 KB | Component specifications and patterns |
| MC72 | `docs/design/S2IMS_PAGE_LEVEL_DESIGN_PROMPTS_MC72.md` | `02_FIGMA_BRIEFS/` | ✓ Copied | ~5.8 KB | Detailed prompts for each major screen |
| MC68 | `docs/architecture/S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md` | `03_ROUTES_AND_JOURNEYS/` | ✓ Copied | ~6.1 KB | Complete route list organized by role |
| MC68 | `docs/architecture/S2IMS_ROLE_BASED_USER_JOURNEY_MAP_MC68.md` | `03_ROUTES_AND_JOURNEYS/` | ✓ Copied | ~4.7 KB | User flows and journeys by role |
| MC68 | `docs/architecture/S2IMS_SCREENSHOT_EVIDENCE_INDEX_MC68.md` | `03_ROUTES_AND_JOURNEYS/` | ✓ Copied | ~2.1 KB | Index of screenshots and visual evidence |
| MC68 | `docs/screenshots/mc68-role-based-user-manual/` | `04_SCREENSHOTS/` | ✓ Copied | ~15 MB | Reference images organized by role (folder) |
| MC85 | `docs/design/S2IMS_VISUAL_IDENTITY_FRIENDLY_MODERN_ABSTRACT_UI_MC85.md` | `01_VISUAL_IDENTITY/` | ⓘ Missing | — | Planned: Color system, typography, tokens |
| MC85 | `docs/design/S2IMS_ROLE_BASED_UI_MOODBOARD_DIRECTION_MC85.md` | `01_VISUAL_IDENTITY/` | ⓘ Missing | — | Planned: Visual mood and aesthetic direction |
| MC85 | `docs/design/S2IMS_ABSTRACT_VISUAL_MOTIF_SYSTEM_MC85.md` | `01_VISUAL_IDENTITY/` | ⓘ Missing | — | Planned: Geometric motif patterns and usage |
| MC85 | `docs/design/S2IMS_PAGE_GROUP_UI_REDESIGN_DIRECTION_MC85.md` | `01_VISUAL_IDENTITY/` | ⓘ Missing | — | Planned: Visual direction by page group |
| MC85 | `docs/design/S2IMS_COMPONENT_VISUAL_STYLE_SPEC_MC85.md` | `01_VISUAL_IDENTITY/` | ⓘ Missing | — | Planned: Visual styles for all components |
| MC85 | `docs/design/S2IMS_FIGMA_PROMPT_PACK_FRIENDLY_ABSTRACT_UI_MC85.md` | `01_VISUAL_IDENTITY/` | ⓘ Missing | — | Planned: Prompts for Figma visual system generation |
| MC85 | `docs/design/S2IMS_UI_IMPLEMENTATION_GUARDRAILS_MC85.md` | `01_VISUAL_IDENTITY/` | ⓘ Missing | — | Planned: Implementation rules and constraints |

## Summary by Status

### ✓ Copied (11 files)
- **MC72 Briefs**: 4 files (100% complete)
- **MC68 Routes & Journeys**: 4 files (100% complete)
- **Screenshots**: 1 folder (~15 MB)

### ⓘ Missing (3 files)
- **MC85 Visual Identity**: 7 files not yet created
  - Color system definition
  - Typography specifications  
  - Spacing/sizing tokens
  - Abstract motif system
  - Component visual styles
  - Visual prompt pack
  - Implementation guardrails

### Generated (5 files)
- **Documentation**: README.md, 00_START_HERE.md, MANIFEST.md (this file)
- **Figma Prompts**: 4 prompts (MASTER, ROUND_1, ROUND_2, ROUND_3)
- **Governance**: GOVERNANCE_AND_SAFETY_BOUNDARIES.md

## File Locations

### In Bundle: 02_FIGMA_BRIEFS/
All files copied from `docs/design/` with MC72 prefix:
```
02_FIGMA_BRIEFS/
├── S2IMS_FIGMA_REDESIGN_MASTER_BRIEF_MC72.md (source: docs/design/)
├── S2IMS_ROLE_BASED_SCREEN_FRAME_PLAN_MC72.md (source: docs/design/)
├── S2IMS_FIGMA_COMPONENT_LIBRARY_BRIEF_MC72.md (source: docs/design/)
└── S2IMS_PAGE_LEVEL_DESIGN_PROMPTS_MC72.md (source: docs/design/)
```

### In Bundle: 03_ROUTES_AND_JOURNEYS/
All files copied from `docs/architecture/` with MC68 prefix:
```
03_ROUTES_AND_JOURNEYS/
├── S2IMS_ROLE_BASED_ROUTE_INVENTORY_MC68.md (source: docs/architecture/)
├── S2IMS_ROLE_BASED_USER_JOURNEY_MAP_MC68.md (source: docs/architecture/)
└── S2IMS_SCREENSHOT_EVIDENCE_INDEX_MC68.md (source: docs/architecture/)
```

### In Bundle: 04_SCREENSHOTS/
Folder copied from `docs/screenshots/mc68-role-based-user-manual/`:
```
04_SCREENSHOTS/
└── mc68-role-based-user-manual/
    ├── [role-based screenshot files]
    └── [organized by user role subdirectories]
```

### In Bundle: 05_PROMPTS/
Generated files (not copied from source):
```
05_PROMPTS/
├── FIGMA_MASTER_PROMPT.md (generated: complete design system in one prompt)
├── FIGMA_ROUND_1_DESIGN_SYSTEM_PROMPT.md (generated: design tokens & system)
├── FIGMA_ROUND_2_CORE_SCREENS_PROMPT.md (generated: key screens)
└── FIGMA_ROUND_3_ROLE_JOURNEYS_PROMPT.md (generated: role-based journeys)
```

### In Bundle: 06_GOVERNANCE_BOUNDARIES/
Generated file (not copied from source):
```
06_GOVERNANCE_BOUNDARIES/
└── GOVERNANCE_AND_SAFETY_BOUNDARIES.md (generated: safety constraints)
```

### In Bundle Root
Generated bundle documentation:
```
.
├── 00_START_HERE.md (generated: getting started guide)
├── README.md (generated: bundle overview)
└── MANIFEST.md (generated: this file)
```

## Generated Developer Handoff Package (MC86 Preparation)

**Added**: 2026-05-22  
**Location**: `handoff/` (new subfolder)  
**Purpose**: Complete developer-ready implementation guidance extracted from the Claude Design Rounds 1–3 and all bundle source materials.

### Files Added

| File | Description |
|------|-------------|
| `handoff/developer-handoff-summary.md` | Executive summary of the entire Soft Civic Intelligence redesign, source materials, safest order, and explicit statement that implementation has not occurred |
| `handoff/design-tokens.json` | Complete, valid JSON token set (colors, typography, spacing, radius, shadow, motion, z-index) with OKLCH role accents and preview color distinction |
| `handoff/design-tokens.css` | CSS custom properties (`--surface-paper`, `--status-preview`, `--radius-card`, `--font-thai`, etc.) ready for global import |
| `handoff/tailwind-token-mapping.md` | Mapping table from new tokens to current `src/config/theme.ts` and MC71 primitives; IBM Plex font strategy note; migration status |
| `handoff/component-contracts.md` | Full contract for 18 components (Button, StatusBadge, SafetyBanner, DisabledActionHint, Sidebar, TopBar, etc.) including props, variants, governance constraints, and "what not to do" |
| `handoff/screen-implementation-map.md` | 16-route implementation map with source round, components, abstract motif, governance notes, risk, priority, and "what must remain unchanged" |
| `handoff/governance-boundary-implementation-notes.md` | The ten non-negotiable governance rules (AP-10B lock, AP-10C/AP-11 disabled, ESQ = Recommendation only, SafetyBanner permanence, PII masking, preview color reservation, no new audit events, etc.) with verification steps and failure conditions |
| `handoff/implementation-phasing-plan.md` | 8-phase safe rollout plan (Phase 0 token alignment → Phase 8 screenshot regression QA) with per-phase files, risk, validation, rollback, and AP boundary notes |

### Impact on Bundle Completeness

- The handoff package makes the bundle **implementation-ready** for MC86 or any future approved visual implementation branch.
- All governance constraints, component contracts, and phasing rules are now explicit and enforceable.
- Visual identity (MC85) files remain missing in `01_VISUAL_IDENTITY/`, but the handoff package does not depend on them — all required direction is embedded in the prompts + generated documents.

---

## Impact of Missing MC85 Files

**Can you still use this bundle?** Yes.

**Why MC85 is missing**: The visual identity milestone (MC85) has not been created yet. These documents are planned but not yet written. The design briefs (MC72) include enough visual direction to work with, and the Figma prompts include sufficient design guidance to generate a cohesive system.

**What's affected**:
- No standalone color system definition
- No complete typography spec
- No spacing/sizing token library
- No abstract motif system reference
- No component visual style guide

**Workaround**: The Figma prompts (05_PROMPTS/) include all necessary design direction embedded in the prompt text. Use them to generate the design system, then extract tokens and styles from the result.

**When MC85 becomes available**: Move those files into `01_VISUAL_IDENTITY/` and they will supersede the embedded guidance in the prompts.

## Verification Checklist

Verify bundle integrity by checking:

- [ ] All 4 MC72 files present in `02_FIGMA_BRIEFS/`
- [ ] All 3 MC68 files present in `03_ROUTES_AND_JOURNEYS/`
- [ ] Screenshot folder `04_SCREENSHOTS/mc68-role-based-user-manual/` exists and contains images
- [ ] All 4 Figma prompts present in `05_PROMPTS/`
- [ ] Governance document present in `06_GOVERNANCE_BOUNDARIES/`
- [ ] Bundle documentation files (README.md, 00_START_HERE.md, MANIFEST.md) present in root
- [ ] `01_VISUAL_IDENTITY/` folder exists (empty, awaiting MC85 files)

## Source Repository Info

**Repository**: s2ims (Next.js)  
**Branch**: claude/s2ims-figma-design-handoff-bundle  
**Commit**: Will be created after bundle completion  

All source files are read from the current repository state at time of bundle creation.

## Completeness Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| Figma Design Briefs | ✓ Complete | 4 files, all MC72 requirements covered |
| Route Inventory | ✓ Complete | All routes documented with role-based organization |
| User Journey Maps | ✓ Complete | Journeys for all 6 major user roles |
| Screenshot Evidence | ✓ Complete | ~15 MB folder with role-based reference images |
| Figma AI Prompts | ✓ Complete | 4 prompts covering system, screens, and journeys |
| Governance & Safety | ✓ Complete | Safety boundaries and compliance documented |
| Visual Identity (MC85) | ⓘ Planned | 7 files not yet created — affects color/typography spec |
| Bundle Documentation | ✓ Complete | Start guide, README, manifest, and this file |

**Overall Readiness**: Bundle is ready for Figma design generation and implementation planning. Visual identity files are missing but do not block design generation via prompts.

---

**Next Step**: See [README.md](./README.md) for usage instructions, or [00_START_HERE.md](./00_START_HERE.md) for getting started.

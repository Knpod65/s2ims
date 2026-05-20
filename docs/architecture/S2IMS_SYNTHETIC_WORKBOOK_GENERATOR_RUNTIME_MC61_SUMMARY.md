# S2IMS Synthetic Workbook Generator runtime MC61 — summary

This document records the implementation of a local-only synthetic workbook generator for S2IMS master data import preview QA.

Key points
- Script: tools/generate-synthetic-master-data-workbooks.mjs
- Output: artifacts/synthetic-master-data-workbooks/*.xlsx (local-only)
- Default rows per workbook: 50
- Deterministic seed: 12345 (mulberry32)
- All emails use example.test domain
- Script performs in-memory safety scan and aborts on forbidden domains
- Generated .xlsx files must NOT be committed; artifacts/ is gitignored

Safety
- No real data used
- No runtime/src/package.json changes
- Confirm Import remains disabled
- No persistence/backend/API/audit writes
- AP-10B/AP-10C/AP-11 remain blocked

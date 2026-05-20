# S2IMS Import Preview Manual Test Evidence Rules — MC62

Allowed evidence:
- Screenshots (PNG/JPEG) of preview UI with synthetic data
- Short validation summary text
- Route smoke results and build/check outputs

Forbidden evidence:
- Excel files (.xlsx/.csv) containing generated workbooks
- Screenshots containing real PII
- Audit logs indicating official evidence
- Any approval or signature artifacts

Storage:
- Store screenshots in QA evidence store (external to repo) with reference links in QA summary
- Do not commit evidence to repository unless approved by governance

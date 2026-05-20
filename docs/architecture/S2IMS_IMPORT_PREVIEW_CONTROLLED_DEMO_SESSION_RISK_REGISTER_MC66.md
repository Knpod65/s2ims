# S2IMS Import Preview Controlled Demo Session Risk Register — MC66

## Purpose
Document potential risks for controlled internal demo sessions and mitigations.

| Risk | Category | Impact | Likelihood | Mitigation | Stop Trigger |
|------|----------|--------:|-----------:|-----------|--------------|
| Real PII displayed | Privacy | High | Low | Use synthetic data only; pre-screen artifacts | Abort session
| Confusion about Confirm Import | Governance | High | Low | Safety copy and facilitator script; visible disabled state | Abort session
| Generated file committed accidentally | Process | High | Low | Ensure .gitignore; pre-commit checks | Stop and revert
| Mistaken approval language | Governance | Medium | Medium | No-approval copy; facilitator training | Mark and escalate
| Audit writes observed | Security | High | Low | Monitor audit script; do not enable persistence | Abort and notify security


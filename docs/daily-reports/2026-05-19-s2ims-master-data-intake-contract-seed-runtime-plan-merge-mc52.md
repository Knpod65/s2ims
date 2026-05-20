Branch: main

Merge: architecture/s2ims-master-data-intake-contract-seed-runtime-plan-mc52

Package commit: 4aa35df

QA commit: 6abf202

Merge commit: afaf40a

Validation results:
- Build: 41/41
- Tokens: 4/4
- Audit checks: 490/490
- Routes: 6×200 OK

Notes:
- Docs-only confirmation: all changes limited to docs/
- Staff_Master contract: confirmed in docs/architecture/S2IMS_MASTER_DATA_INTAKE_CONTRACT_MC52.md
- Teacher_Master contract: covered in same contract
- Account_Profile contract: accounted for via cmu_mail/email guidance
- Responsible_Person_Assignment contract: docs/architecture/S2IMS_ADMIN_RESPONSIBLE_PERSON_REGISTRY_PLAN_MC52.md
- cmu_mail join-key guidance: present in contract and source-file requirements
- Source file requirements: docs/architecture/S2IMS_SOURCE_FILE_REQUIREMENTS_MC52.md
- Admin registry: docs/architecture/S2IMS_ADMIN_RESPONSIBLE_PERSON_REGISTRY_PLAN_MC52.md
- No runtime implementation, no data import, no persistence, no audit writes
- AP-10B remains closed; AP-10C/AP-11 blocked

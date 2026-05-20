# S2IMS Source File Requirements - MC52

Formats supported (planning-only): CSV (UTF-8), XLSX

Required Columns for Staff_Master/Teacher_Master:
- cmu_mail (string, recommended join key)
- full_name (string)
- given_name (string)
- family_name (string)
- email (string)
- role (staff|teacher|admin)
- department (string)
- employment_status (active|inactive|on_leave)

Encoding:
- UTF-8 recommended; BOM discouraged

Size Limits:
- Soft limit: 10,000 rows for preview UI; larger files require offline processing

PII Redaction Rules:
- Do not include student PII (student_id, student_email, student_name)
- Any PII fields beyond staff/teacher must be removed before upload

Join Key Guidance:
- Prefer cmu_mail as primary join key; if missing, include source_row and source_file_id to assist manual reconciliation

Deduplication Strategy:
- Exact match on cmu_mail -> merge
- Else fuzzy match on normalized full_name + department -> flag for review

Sample snippet:
cmu_mail,full_name,given_name,family_name,email,role,department,employment_status
j.smith@cmu.ac.th,John Smith,John,Smith,j.smith@cmu.ac.th,teacher,Computer Science,active

---

#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import ExcelJS from 'exceljs';

// Deterministic PRNG (mulberry32)
function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_ROWS = 50;
const OUT_DIR = path.resolve(process.cwd(), 'artifacts', 'synthetic-master-data-workbooks');

function ensureOutDir() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function safeEmail(prefix, i) {
  return `${prefix}${String(i).padStart(3, '0')}@example.test`;
}

function assertNoForbidden(value) {
  if (!value || typeof value !== 'string') return;
  const forbidden = ['@cmu.ac.th', '@pol.cmu.ac.th'];
  for (const f of forbidden) {
    if (value.includes(f)) {
      throw new Error(`Forbidden domain found in generated value: ${value}`);
    }
  }
}

function scanWorkbookForUnsafeStrings(wb) {
  const unsafeTokens = ['@cmu.ac.th', '@pol.cmu.ac.th'];
  for (const ws of wb.worksheets) {
    for (let r = 1; r <= ws.rowCount; r++) {
      const row = ws.getRow(r);
      row.eachCell({ includeEmpty: false }, (cell) => {
        const v = cell.value;
        if (typeof v === 'string') {
          for (const t of unsafeTokens) if (v.includes(t)) throw new Error(`Unsafe token ${t} found in cell ${ws.name}!${cell.address}`);
        } else if (v && typeof v === 'object' && v.formula) {
          for (const t of unsafeTokens) if (String(v.formula).includes(t)) throw new Error(`Unsafe token ${t} found in formula in ${ws.name}!${cell.address}`);
        }
      });
    }
  }
}

async function writeWorkbook(filename, buildFn) {
  const wb = new ExcelJS.Workbook();
  await buildFn(wb);
  scanWorkbookForUnsafeStrings(wb);
  const outPath = path.join(OUT_DIR, filename);
  await wb.xlsx.writeFile(outPath);
  return { filename, path: outPath, rows: wb.worksheets.reduce((s, w) => s + Math.max(0, w.rowCount - 1), 0) };
}

async function buildStaffMaster(wb, rows, rng) {
  const ws = wb.addWorksheet('staff');
  const headers = ['cmu_mail', 'first_name_en', 'last_name_en', 'position', 'department'];
  ws.addRow(headers);
  for (let i = 1; i <= rows; i++) {
    const email = safeEmail('staff', i);
    ws.addRow([email, `StaffFirst${i}`, `StaffLast${i}`, `StaffRole${(i%5)+1}`, `Dept${(i%3)+1}`]);
  }
}

async function buildTeacherMaster(wb, rows, rng) {
  const ws = wb.addWorksheet('teacher');
  const headers = ['cmu_mail', 'first_name_en', 'last_name_en', 'subject', 'employment_type'];
  ws.addRow(headers);
  for (let i = 1; i <= rows; i++) {
    const email = safeEmail('teacher', i);
    ws.addRow([email, `TeacherFirst${i}`, `TeacherLast${i}`, `Subject${(i%6)+1}`, i%2===0 ? 'full-time' : 'part-time']);
  }
}

async function buildCombined(wb, rows, rng) {
  const s1 = wb.addWorksheet('staff');
  s1.addRow(['cmu_mail','first_name_en']);
  for (let i=1;i<=Math.ceil(rows/2);i++) s1.addRow([safeEmail('staff', i), `StaffFirst${i}`]);
  const s2 = wb.addWorksheet('teacher');
  s2.addRow(['cmu_mail','first_name_en']);
  for (let i=1;i<=Math.floor(rows/2);i++) s2.addRow([safeEmail('teacher', i), `TeacherFirst${i}`]);
}

async function buildDuplicateEmail(wb, rows, rng) {
  const ws = wb.addWorksheet('staff');
  ws.addRow(['cmu_mail','first_name_en']);
  for (let i=1;i<=rows;i++) {
    const email = i===rows ? safeEmail('staff', 1) : safeEmail('staff', i);
    ws.addRow([email, `StaffFirst${i}`]);
  }
}

async function buildMissingEmail(wb, rows, rng) {
  const ws = wb.addWorksheet('teacher');
  ws.addRow(['cmu_mail','first_name_en']);
  for (let i=1;i<=rows;i++) {
    const email = i%5===0 ? '' : safeEmail('teacher', i);
    ws.addRow([email, `TeacherFirst${i}`]);
  }
}

async function buildInvalidEmail(wb, rows, rng) {
  const ws = wb.addWorksheet('staff');
  ws.addRow(['cmu_mail','first_name_en']);
  for (let i=1;i<=rows;i++) {
    const email = i%7===0 ? `invalid-email-${i}` : safeEmail('staff', i);
    ws.addRow([email, `StaffFirst${i}`]);
  }
}

async function buildForbiddenColumns(wb, rows, rng) {
  const ws = wb.addWorksheet('staff');
  // intentionally include forbidden header names as test case (values synthetic)
  const headers = ['cmu_mail','first_name_en','national_id','bank_account'];
  ws.addRow(headers);
  for (let i=1;i<=rows;i++) ws.addRow([safeEmail('staff', i), `StaffFirst${i}`, `0000000000${i}`, `BANK${i}`]);
}

async function buildFormulaCells(wb, rows, rng) {
  const ws = wb.addWorksheet('staff');
  ws.addRow(['cmu_mail','score_a','score_b','total']);
  for (let i=1;i<=rows;i++) {
    const email = safeEmail('staff', i);
    ws.addRow([email, i%10, (i*2)%10]);
  }
  // set formula in total column
  for (let r=2;r<=rows+1;r++) {
    const cell = ws.getCell(`D${r}`);
    cell.value = { formula: `B${r}+C${r}`, result: 0 };
  }
}

async function buildRowLimitWarning(wb, rows, rng) {
  const ws = wb.addWorksheet('staff');
  ws.addRow(['cmu_mail','first_name_en']);
  for (let i=1;i<=rows;i++) ws.addRow([safeEmail('staff', i), `StaffFirst${i}`]);
}

async function buildUnknownSheet(wb, rows, rng) {
  const ws = wb.addWorksheet('nonsense_sheet');
  ws.addRow(['some_field','other_field']);
  for (let i=1;i<=rows;i++) ws.addRow([`val${i}`, `valB${i}`]);
}

async function buildThEnNames(wb, rows, rng) {
  const ws = wb.addWorksheet('staff');
  ws.addRow(['cmu_mail','given_name_th','family_name_th','given_name_en','family_name_en']);
  for (let i=1;i<=rows;i++) ws.addRow([safeEmail('staff', i), `ThGiven${i}`, `ThFamily${i}`, `EnGiven${i}`, `EnFamily${i}`]);
}

async function main() {
  const args = process.argv.slice(2);
  const rowsArgIndex = args.indexOf('--rows');
  const seedArgIndex = args.indexOf('--seed');
  const rows = rowsArgIndex !== -1 ? Number(args[rowsArgIndex+1]) || DEFAULT_ROWS : DEFAULT_ROWS;
  const seed = seedArgIndex !== -1 ? Number(args[seedArgIndex+1]) || 12345 : 12345;
  const rng = mulberry32(seed);

  ensureOutDir();

  const tasks = [
    ['synthetic_staff_master_valid.xlsx', (wb)=>buildStaffMaster(wb, rows, rng)],
    ['synthetic_teacher_master_valid.xlsx', (wb)=>buildTeacherMaster(wb, rows, rng)],
    ['synthetic_personnel_combined_valid.xlsx', (wb)=>buildCombined(wb, rows, rng)],
    ['synthetic_staff_duplicate_email.xlsx', (wb)=>buildDuplicateEmail(wb, rows, rng)],
    ['synthetic_teacher_missing_email.xlsx', (wb)=>buildMissingEmail(wb, rows, rng)],
    ['synthetic_invalid_email.xlsx', (wb)=>buildInvalidEmail(wb, rows, rng)],
    ['synthetic_forbidden_columns.xlsx', (wb)=>buildForbiddenColumns(wb, Math.min(rows,10), rng)],
    ['synthetic_formula_cells.xlsx', (wb)=>buildFormulaCells(wb, Math.min(rows,20), rng)],
    ['synthetic_row_limit_warning.xlsx', (wb)=>buildRowLimitWarning(wb, Math.min(rows, 500), rng)],
    ['synthetic_unknown_sheet.xlsx', (wb)=>buildUnknownSheet(wb, Math.min(rows,10), rng)],
    ['synthetic_th_en_names.xlsx', (wb)=>buildThEnNames(wb, rows, rng)]
  ];

  const results = [];
  for (const [name, fn] of tasks) {
    try {
      const res = await writeWorkbook(name, fn);
      results.push(res);
      console.log(`Generated: ${res.filename} (${res.rows} rows)`);
    } catch (err) {
      console.error(`Failed to generate ${name}:`, err.message);
      // clean up if file exists
      const p = path.join(OUT_DIR, name);
      try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch(e){}
      process.exit(2);
    }
  }

  console.log('---');
  console.log(`Workbook count: ${results.length}`);
  const totalRows = results.reduce((s,r)=>s+r.rows,0);
  console.log(`Total rows (approx): ${totalRows}`);
  console.log('synthetic data only: all emails use example.test domain and no forbidden domains present');
  console.log(JSON.stringify({ files: results.map(r=>r.filename), count: results.length, rowsPerWorkbook: rows, seed }, null, 2));
}

main().catch(err=>{ console.error(err); process.exit(1); });

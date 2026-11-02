/**
 * ระบบยืนยันชั่วโมงปฏิบัติงาน TA — คณะรัฐศาสตร์และรัฐประศาสนศาสตร์
 * Login ด้วย OTP ทางอีเมล: นักศึกษา (ยืนยัน/รายงาน) + เจ้าหน้าที่ (ดูสถานะ/รับแจ้งเตือน)
 *
 * ข้อมูลทั้งหมดอยู่ใน Google Sheet (Script Property: SHEET_ID) แยกแท็บตามหน้าที่ — ไม่ฝังข้อมูลในโค้ด
 *   Config    key | value                      (staff_emails, term, ...)
 *   Students  student_id | name | email
 *   Hours     student_id | round1 | round2
 *   Responses student_id | status | message | at      (คำตอบล่าสุดของนักศึกษา)
 *   Replies   student_id | reply | at                 (เจ้าหน้าที่ตอบกลับ)
 *   Log       at | actor | action | student_id | detail
 */
const TAB = { CONFIG: 'Config', STUDENTS: 'Students', HOURS: 'Hours', RESP: 'Responses', REPLY: 'Replies', LOG: 'Log' };
const COLS = {
  Config: ['key', 'value'],
  Students: ['student_id', 'name', 'email'],
  Hours: ['student_id', 'round1', 'round2'],
  Responses: ['student_id', 'status', 'message', 'at'],
  Replies: ['student_id', 'reply', 'at'],
  Log: ['at', 'actor', 'action', 'student_id', 'detail']
};
/** ค่าเริ่มต้นที่ setup() เขียนลงแท็บ Config ครั้งแรกเท่านั้น (หลังจากนั้นแก้ในชีต) */
const CONFIG_SEED = {
  staff_emails: 'rungtiwa.p@cmu.ac.th',
  term: 'ภาคการศึกษาที่ 1 ปีการศึกษา 2569',
  otp_ttl_sec: '600', otp_max_tries: '5', otp_cooldown_sec: '60', msg_max: '1000',
  import_hours_tab: 'Sheet1', import_students_tab: 'studentnow'
};
const ST = { PENDING: '', CONFIRMED: 'confirmed', REPORTED: 'reported', RESOLVED: 'resolved' };
const SESSION_TTL = 21600; // 6 ชม. (สูงสุดของ CacheService)

/* ---------- Web app ---------- */
function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('ยืนยันชั่วโมง TA')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* ---------- Setup / import (รันจาก editor) ---------- */
/** สร้างแท็บ+หัวคอลัมน์ที่ยังไม่มี และเติมค่า Config ที่ยังไม่มี */
function setup() {
  Object.keys(COLS).forEach(name => {
    let sh = ss_().getSheetByName(name);
    if (!sh) sh = ss_().insertSheet(name);
    if (sh.getLastRow() === 0) sh.appendRow(COLS[name]);
  });
  const have = rows_(TAB.CONFIG).map(r => r.key);
  Object.keys(CONFIG_SEED).forEach(k => {
    if (have.indexOf(k) < 0) sheet_(TAB.CONFIG).appendRow([k, CONFIG_SEED[k]]);
  });
}

/**
 * นำเข้ารายชื่อ+ชั่วโมงจากแท็บที่วางไฟล์ต้นฉบับไว้ (import_hours_tab) และอีเมลจาก import_students_tab
 * จับหัวคอลัมน์จากข้อความ (รหัส / ชื่อ / รอบที่ 1 / รอบที่ 2 / อีเมล) — รันซ้ำได้ (upsert ตามรหัส)
 */
function importRoster() {
  setup();
  const h = findTable_(cfg_('import_hours_tab'), { id: /รหัส/, name: /ชื่อ/, r1: /รอบที่\s*1/, r2: /รอบที่\s*2/ });
  const e = findTable_(cfg_('import_students_tab'), { id: /รหัส|student.?id|^id$/i, email: /mail|อีเมล|เมล/i });
  const emails = {};
  e.rows.forEach(r => { const id = String(r.id).trim(), m = normEmail_(r.email); if (id && m) emails[id] = m; });
  const students = rows_(TAB.STUDENTS), hours = rows_(TAB.HOURS);
  const sIdx = indexBy_(students, 'student_id'), hIdx = indexBy_(hours, 'student_id');
  const num = v => { const n = parseFloat(v); return isNaN(n) ? 0 : n; };
  const out = { imported: 0, noEmail: [] };
  h.rows.forEach(r => {
    const id = String(r.id).trim();
    if (!/^\d+$/.test(id)) return;
    const name = String(r.name).replace(/\u00a0/g, ' ').trim();
    upsert_(TAB.STUDENTS, sIdx, id, [id, name, emails[id] || (sIdx[id] ? sIdx[id].email : '')]);
    upsert_(TAB.HOURS, hIdx, id, [id, num(r.r1), num(r.r2)]);
    if (!emails[id] && !(sIdx[id] && sIdx[id].email)) out.noEmail.push(id);
    out.imported++;
  });
  Logger.log('นำเข้า %s รายการ; ไม่พบอีเมล: %s', out.imported, out.noEmail.join(', ') || '-');
  return out;
}

/* ---------- Auth (OTP) ---------- */
function requestOtp(email) {
  email = normEmail_(email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: 'invalid_email' };
  const cache = CacheService.getScriptCache(), cool = cfgNum_('otp_cooldown_sec', 60), ttl = cfgNum_('otp_ttl_sec', 600);
  if (cache.get('cool:' + email)) return { ok: false, error: 'cooldown' };
  cache.put('cool:' + email, '1', cool);
  // ตอบเหมือนกันเสมอ เพื่อไม่เปิดเผยว่าอีเมลนี้อยู่ในระบบหรือไม่
  if (roleOf_(email)) {
    const code = randomCode_(), salt = Utilities.getUuid();
    cache.put('otp:' + email, JSON.stringify({ h: hash_(salt, code), salt: salt, tries: 0 }), ttl);
    MailApp.sendEmail({
      to: email,
      subject: 'รหัส OTP สำหรับยืนยันชั่วโมง TA: ' + code,
      htmlBody: '<p>รหัส OTP ของคุณคือ</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">' + code +
        '</p><p>รหัสใช้ได้ ' + (ttl / 60) + ' นาที อย่าแจ้งรหัสนี้แก่ผู้อื่น<br>' +
        'Your one-time code is valid for ' + (ttl / 60) + ' minutes.</p>',
      name: 'S²IMS — TA Hours'
    });
    log_(email, 'otp_sent', '', '');
  }
  return { ok: true, ttl: ttl, cooldown: cool };
}

function verifyOtp(email, code) {
  email = normEmail_(email); code = String(code || '').trim();
  const cache = CacheService.getScriptCache(), max = cfgNum_('otp_max_tries', 5);
  const raw = cache.get('otp:' + email);
  if (!raw) return { ok: false, error: 'expired' };
  const rec = JSON.parse(raw);
  if (rec.tries >= max) { cache.remove('otp:' + email); return { ok: false, error: 'locked' }; }
  if (hash_(rec.salt, code) !== rec.h) {
    rec.tries++;
    cache.put('otp:' + email, JSON.stringify(rec), cfgNum_('otp_ttl_sec', 600));
    return { ok: false, error: 'wrong', left: max - rec.tries };
  }
  cache.remove('otp:' + email);
  const role = roleOf_(email);
  if (!role) return { ok: false, error: 'expired' };
  const token = Utilities.getUuid() + Utilities.getUuid();
  cache.put('sess:' + token, JSON.stringify({ email: email, role: role }), SESSION_TTL);
  log_(email, 'login', '', role);
  return { ok: true, token: token, role: role };
}

function logout(token) { CacheService.getScriptCache().remove('sess:' + token); return { ok: true }; }

/* ---------- Student API ---------- */
function getMe(token) {
  const s = auth_(token);
  if (!s) return { ok: false, error: 'session' };
  if (s.role === 'staff') return { ok: true, role: 'staff', email: s.email, term: cfg_('term') };
  const st = studentByEmail_(s.email);
  if (!st) return { ok: false, error: 'not_found' };
  return { ok: true, role: 'student', email: s.email, term: cfg_('term'), record: view_(st, joined_()) };
}

function confirmHours(token) {
  return withStudent_(token, function (st, s) {
    saveResponse_(st.student_id, ST.CONFIRMED, '');
    log_(s.email, 'confirm', st.student_id, '');
  });
}

function reportHours(token, message) {
  message = String(message || '').trim();
  if (message.length < 5) return { ok: false, error: 'msg_short' };
  if (message.length > cfgNum_('msg_max', 1000)) return { ok: false, error: 'msg_long' };
  return withStudent_(token, function (st, s) {
    saveResponse_(st.student_id, ST.REPORTED, message);
    log_(s.email, 'report', st.student_id, message);
    notifyStaff_(view_(st, joined_()), message);
  });
}

/* ---------- Staff API ---------- */
function staffList(token) {
  const s = auth_(token);
  if (!s || s.role !== 'staff') return { ok: false, error: 'forbidden' };
  const j = joined_();
  const rows = rows_(TAB.STUDENTS).filter(r => r.student_id !== '').map(st => Object.assign(view_(st, j), { hasEmail: !!normEmail_(st.email) }));
  const c = { total: rows.length, confirmed: 0, reported: 0, resolved: 0, pending: 0 };
  rows.forEach(r => { c[r.status || 'pending']++; });
  return { ok: true, rows: rows, counts: c, term: cfg_('term') };
}

function staffResolve(token, studentId, reply) {
  const s = auth_(token);
  if (!s || s.role !== 'staff') return { ok: false, error: 'forbidden' };
  reply = String(reply || '').trim().slice(0, cfgNum_('msg_max', 1000));
  studentId = String(studentId);
  return locked_(function () {
    if (!studentById_(studentId)) return { ok: false, error: 'not_found' };
    const resp = indexBy_(rows_(TAB.RESP), 'student_id')[studentId];
    saveResponse_(studentId, ST.RESOLVED, resp ? resp.message : '');
    upsert_(TAB.REPLY, indexBy_(rows_(TAB.REPLY), 'student_id'), studentId, [studentId, reply, new Date()]);
    log_(s.email, 'resolve', studentId, reply);
    return { ok: true };
  });
}

/* ---------- Internals ---------- */
function withStudent_(token, fn) {
  const s = auth_(token);
  if (!s || s.role !== 'student') return { ok: false, error: 'forbidden' };
  return locked_(function () {
    const st = studentByEmail_(s.email);
    if (!st) return { ok: false, error: 'not_found' };
    fn(st, s);
    return { ok: true };
  });
}
function locked_(fn) { const l = LockService.getScriptLock(); l.waitLock(10000); try { return fn(); } finally { l.releaseLock(); } }

function saveResponse_(id, status, message) {
  upsert_(TAB.RESP, indexBy_(rows_(TAB.RESP), 'student_id'), id, [id, status, message, new Date()]);
}

/** รวมข้อมูลจากแท็บต่าง ๆ เป็นแถวเดียวต่อนักศึกษา (เฉพาะตอนอ่าน) */
function joined_() {
  return { hours: indexBy_(rows_(TAB.HOURS), 'student_id'), resp: indexBy_(rows_(TAB.RESP), 'student_id'), reply: indexBy_(rows_(TAB.REPLY), 'student_id') };
}
function view_(st, j) {
  const id = String(st.student_id), hr = j.hours[id] || {}, rp = j.resp[id] || {}, ry = j.reply[id] || {};
  const n = v => { const x = parseFloat(v); return isNaN(x) ? 0 : x; };
  const iso = d => (d instanceof Date ? d.toISOString() : '');
  const r1 = n(hr.round1), r2 = n(hr.round2);
  const replied = ry.at instanceof Date && rp.at instanceof Date && ry.at >= rp.at;
  return {
    id: id, name: String(st.name), r1: r1, r2: r2, total: r1 + r2,
    status: String(rp.status || ''), msg: String(rp.message || ''), at: iso(rp.at),
    reply: replied ? String(ry.reply || '') : ''
  };
}

function notifyStaff_(v, message) {
  const url = ScriptApp.getService().getUrl();
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  MailApp.sendEmail({
    to: staffEmails_().join(','),
    subject: '[TA] นักศึกษารายงานชั่วโมงไม่ถูกต้อง: ' + v.name,
    htmlBody: '<p><b>' + esc(v.name) + '</b> (' + esc(v.id) + ') รายงานว่าชั่วโมงไม่ถูกต้อง</p>' +
      '<p>รอบที่ 1: ' + v.r1 + ' · รอบที่ 2: ' + v.r2 + ' · รวม ' + v.total + ' ชม.</p>' +
      '<blockquote>' + esc(message).replace(/\n/g, '<br>') + '</blockquote>' +
      '<p><a href="' + url + '">เปิดระบบเพื่อดำเนินการ</a></p>',
    name: 'S²IMS — TA Hours'
  });
}

/* ---- sheet helpers (ทุกแท็บ: แถว 1 = หัวคอลัมน์) ---- */
function ss_() {
  const id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  return id ? SpreadsheetApp.openById(id) : SpreadsheetApp.getActive();
}
function sheet_(name) { const sh = ss_().getSheetByName(name); if (!sh) throw new Error('ไม่พบแท็บ ' + name + ' — รัน setup() ก่อน'); return sh; }
function rows_(name) {
  const v = sheet_(name).getDataRange().getValues();
  const head = v[0] || [];
  return v.slice(1).map((r, i) => { const o = { _row: i + 2 }; head.forEach((h, c) => { o[String(h).trim()] = r[c] == null ? '' : r[c]; }); return o; });
}
function indexBy_(rows, key) { const m = {}; rows.forEach(r => { const k = String(r[key]).trim(); if (k) m[k] = r; }); return m; }
function upsert_(name, idx, key, values) {
  const sh = sheet_(name);
  if (idx[key]) { sh.getRange(idx[key]._row, 1, 1, values.length).setValues([values]); }
  else { sh.appendRow(values); idx[key] = { _row: sh.getLastRow() }; }
}
/** หาแถวหัวตารางในแท็บนำเข้า (ภายใน 15 แถวแรก) ตาม regex ของแต่ละคอลัมน์ */
function findTable_(tab, pats) {
  const sh = ss_().getSheetByName(tab);
  if (!sh) throw new Error('ไม่พบแท็บนำเข้า ' + tab);
  const v = sh.getDataRange().getValues(), keys = Object.keys(pats);
  for (let r = 0; r < Math.min(v.length, 15); r++) {
    const idx = {};
    keys.forEach(k => { const i = v[r].findIndex(c => pats[k].test(String(c))); if (i >= 0) idx[k] = i; });
    if (Object.keys(idx).length === keys.length) {
      return { rows: v.slice(r + 1).map(row => { const o = {}; keys.forEach(k => { o[k] = row[idx[k]]; }); return o; }) };
    }
  }
  throw new Error('แท็บ ' + tab + ': ไม่พบหัวคอลัมน์ที่ต้องการ');
}

/* ---- config / lookups ---- */
function cfg_(key) { const r = rows_(TAB.CONFIG).filter(x => x.key === key)[0]; return r ? String(r.value) : ''; }
function cfgNum_(key, def) { const n = parseFloat(cfg_(key)); return isNaN(n) ? def : n; }
function staffEmails_() { return cfg_('staff_emails').split(/[,;\s]+/).map(normEmail_).filter(Boolean); }
function studentByEmail_(email) { return rows_(TAB.STUDENTS).filter(r => normEmail_(r.email) === email)[0]; }
function studentById_(id) { return rows_(TAB.STUDENTS).filter(r => String(r.student_id) === id)[0]; }
function roleOf_(email) {
  if (staffEmails_().indexOf(email) >= 0) return 'staff';
  return studentByEmail_(email) ? 'student' : null;
}
function auth_(token) {
  if (!token) return null;
  const raw = CacheService.getScriptCache().get('sess:' + token);
  return raw ? JSON.parse(raw) : null;
}
function normEmail_(v) { return String(v || '').trim().toLowerCase(); }
function randomCode_() {
  const n = parseInt(Utilities.getUuid().replace(/-/g, '').slice(0, 8), 16);
  return ('000000' + (n % 1000000)).slice(-6);
}
function hash_(salt, code) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, salt + ':' + code)
    .map(b => ('0' + (b & 0xff).toString(16)).slice(-2)).join('');
}
function log_(actor, action, id, detail) {
  try { sheet_(TAB.LOG).appendRow([new Date(), actor, action, id, detail]); } catch (e) {}
}

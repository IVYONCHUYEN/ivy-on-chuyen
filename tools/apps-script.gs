/**
 * IVY GIFTED – lưu tiến độ học sinh vào Google Sheet.
 * Cách dùng: script.google.com → Dự án mới → dán toàn bộ file này → Triển khai → Ứng dụng web
 *   (Thực thi với: Tôi · Ai có quyền truy cập: Bất kỳ ai) → sao chép URL /exec.
 * Lần chạy đầu tiên script tự tạo bảng tính "IVY GIFTED – Tiến độ học sinh" trong Drive của bạn.
 */
const TEACHER_KEY = 'DOI-MA-NAY';      // Mã đăng nhập dashboard giáo viên – đặt mã riêng, không chia sẻ
const SHEET_NAME = 'IVY GIFTED – Tiến độ học sinh';
const HEAD = ['Thời gian', 'Mã HS', 'Họ tên', 'Lớp', 'Loại', 'Buổi', 'Điểm', 'Tổng', 'Chi tiết', 'Nội dung'];

function book_() {
  const props = PropertiesService.getScriptProperties();
  let id = props.getProperty('SHEET_ID');
  if (id) { try { return SpreadsheetApp.openById(id); } catch (e) {} }
  const ss = SpreadsheetApp.create(SHEET_NAME);
  const sh = ss.getSheets()[0];
  sh.setName('Sự kiện');
  sh.appendRow(HEAD);
  sh.setFrozenRows(1);
  sh.getRange(1, 1, 1, HEAD.length).setFontWeight('bold').setBackground('#9b1c1c').setFontColor('#ffffff');
  props.setProperty('SHEET_ID', ss.getId());
  return ss;
}

function out_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents || '{}'); } catch (x) { return out_({ ok: false, error: 'Dữ liệu không hợp lệ' }); }
  if (body.action) {
    try { return out_(api_(body)); } catch (err) { return out_({ ok: false, error: String(err && err.message || err) }); }
  }
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const list = Array.isArray(body.events) ? body.events : [body];
    const sh = book_().getSheetByName('Sự kiện');
    const cache = {};
    const rows = list.slice(0, 200).map(ev => {
      // Học sinh đã đăng nhập: lấy mã, tên, lớp từ tài khoản (không tin dữ liệu trình duyệt gửi lên)
      if (ev.tok) {
        const u = cache[ev.tok] !== undefined ? cache[ev.tok] : (cache[ev.tok] = verify_(ev.tok));
        if (u && u.r === 's') { const st = studentById_(u.id); if (st) { ev.sid = st.id; ev.name = st.name; ev.cls = (classById_(st.classId) || {}).name || ''; } }
      }
      return [
        ev.t ? new Date(ev.t) : new Date(),
        String(ev.sid || '').slice(0, 40), String(ev.name || '').slice(0, 80), String(ev.cls || '').slice(0, 60),
        String(ev.type || '').slice(0, 20), String(ev.code || '').slice(0, 10),
        ev.score === undefined ? '' : Number(ev.score), ev.total === undefined ? '' : Number(ev.total),
        ev.detail ? JSON.stringify(ev.detail).slice(0, 2000) : '', String(ev.text || '').slice(0, 20000)
      ];
    });
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEAD.length).setValues(rows);
    return out_({ ok: true, n: rows.length });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function events_() {
  const values = book_().getSheetByName('Sự kiện').getDataRange().getValues();
  values.shift();
  return values.map(r => ({
    t: r[0] instanceof Date ? r[0].toISOString() : r[0], sid: r[1], name: r[2], cls: r[3], type: r[4], code: r[5],
    score: r[6] === '' ? null : r[6], total: r[7] === '' ? null : r[7],
    detail: r[8] ? (function () { try { return JSON.parse(r[8]); } catch (x) { return null; } })() : null, text: r[9]
  }));
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'ping') return out_({ ok: true });
  if (p.action === 'grade') return out_(grade_(p));
  if (p.key !== TEACHER_KEY) return out_({ ok: false, error: 'Sai mã giáo viên' });
  return out_({ ok: true, sheetUrl: book_().getUrl(), events: events_() });
}

/* ===================== TÀI KHOẢN: quản trị · giáo viên · học sinh ===================== */
const T_HEAD = ['Mã GV', 'Họ tên', 'Mã đăng nhập (băm)', 'Đuôi mã', 'Trạng thái', 'Ngày tạo'];
const C_HEAD = ['Mã lớp', 'Tên lớp', 'Mã GV', 'Bài public (JSON)', 'Ngày tạo'];
const S_HEAD = ['Mã HS', 'Họ tên', 'Mã lớp', 'Tên đăng nhập', 'Mật khẩu (băm)', 'Muối', 'Trạng thái', 'Ngày tạo', 'Đăng nhập gần nhất'];

function tab_(name, head) {
  const ss = book_(); let sh = ss.getSheetByName(name);
  if (!sh) {
    sh = ss.insertSheet(name); sh.appendRow(head); sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, head.length).setFontWeight('bold').setBackground('#9b1c1c').setFontColor('#ffffff');
  }
  return sh;
}
function rows_(name, head) { const v = tab_(name, head).getDataRange().getValues(); v.shift(); return v; }
function teachers_() { return rows_('Giáo viên', T_HEAD).filter(r => r[0]).map(r => ({ id: String(r[0]), name: r[1], hash: r[2], tail: r[3], status: r[4] || 'active', created: r[5] })); }
function classes_() { return rows_('Lớp', C_HEAD).filter(r => r[0]).map(r => ({ id: String(r[0]), name: r[1], teacherId: String(r[2] || ''), pub: (function () { try { return JSON.parse(r[3] || '[]'); } catch (e) { return []; } })(), created: r[4] })); }
function students_() { return rows_('Học sinh', S_HEAD).filter(r => r[0]).map(r => ({ id: String(r[0]), name: r[1], classId: String(r[2]), user: String(r[3]), hash: r[4], salt: r[5], status: r[6] || 'active', created: r[7], last: r[8] })); }
function classById_(id) { return classes_().filter(c => c.id === String(id))[0] || null; }
function studentById_(id) { return students_().filter(s => s.id === String(id))[0] || null; }
function findRow_(name, head, id) {
  const sh = tab_(name, head); const v = sh.getRange(1, 1, sh.getLastRow(), 1).getValues();
  for (let i = 1; i < v.length; i++) if (String(v[i][0]) === String(id)) return { sh: sh, row: i + 1 };
  return null;
}

function secret_() {
  const p = PropertiesService.getScriptProperties(); let s = p.getProperty('TOKEN_SECRET');
  if (!s) { s = Utilities.getUuid() + Utilities.getUuid(); p.setProperty('TOKEN_SECRET', s); }
  return s;
}
function b64_(bytes) { return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, ''); }
function sign_(payload) {
  const body = b64_(Utilities.newBlob(JSON.stringify(payload)).getBytes());
  return body + '.' + b64_(Utilities.computeHmacSha256Signature(body, secret_()));
}
function verify_(tok) {
  try {
    const parts = String(tok || '').split('.'); if (parts.length !== 2) return null;
    if (b64_(Utilities.computeHmacSha256Signature(parts[0], secret_())) !== parts[1]) return null;
    const p = JSON.parse(Utilities.newBlob(Utilities.base64DecodeWebSafe(parts[0] + '==='.slice((parts[0].length + 3) % 4))).getDataAsString());
    if (!p.exp || p.exp < Date.now()) return null;
    // tài khoản bị khoá / xoá thì token mất hiệu lực
    if (p.r === 't') { const t = teachers_().filter(x => x.id === p.id)[0]; if (!t || t.status !== 'active' || t.hash.slice(0, 8) !== p.v) return null; }
    if (p.r === 's') { const st = studentById_(p.id); if (!st || st.status !== 'active' || String(st.hash).slice(0, 8) !== p.v) return null; }
    return p;
  } catch (e) { return null; }
}
function hash_(text, salt) { return b64_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, String(salt || '') + '|' + String(text))); }
function rnd_(n, abc) { abc = abc || 'abcdefghjkmnpqrstuvwxyz23456789'; let s = ''; for (let i = 0; i < n; i++) s += abc[Math.floor(Math.random() * abc.length)]; return s; }
function nid_(p) { return p + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyMMdd') + rnd_(4, '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ'); }
const DAY = 86400000;

function profile_(u) {
  if (u.r === 'a') return { role: 'admin', id: 'admin', name: 'Quản trị viên' };
  if (u.r === 't') { const t = teachers_().filter(x => x.id === u.id)[0]; return { role: 'teacher', id: t.id, name: t.name }; }
  const st = studentById_(u.id), c = classById_(st.classId) || { name: '', pub: [] };
  const t = teachers_().filter(x => x.id === c.teacherId)[0];
  return { role: 'student', id: st.id, name: st.name, user: st.user, classId: st.classId, className: c.name, teacherName: t ? t.name : '', pub: c.pub };
}
function need_(u, roles) { if (!u || roles.indexOf(u.r) < 0) throw new Error('Phiên đăng nhập hết hạn hoặc không có quyền. Hãy đăng nhập lại.'); }
function ownClass_(u, classId) {
  const c = classById_(classId); if (!c) throw new Error('Không tìm thấy lớp');
  if (u.r === 't' && c.teacherId !== u.id) throw new Error('Lớp này không thuộc giáo viên đang đăng nhập');
  return c;
}

function api_(b) {
  const a = b.action;
  if (a === 'login') return login_(b);
  const u = verify_(b.token);
  if (a === 'me') { need_(u, ['a', 't', 's']); return { ok: true, user: profile_(u) }; }
  if (a === 'honors') { need_(u, ['a', 't', 's']); return honorsFor_(u); }
  const lock = LockService.getScriptLock(); lock.waitLock(20000);
  try {
    if (a === 'data') { need_(u, ['a', 't']); return data_(u); }
    if (a === 'createTeacher') { need_(u, ['a']); return createTeacher_(b); }
    if (a === 'teacher') { need_(u, ['a']); return teacherOp_(b); }
    if (a === 'createClass') { need_(u, ['a', 't']); return createClass_(u, b); }
    if (a === 'class') { need_(u, ['a', 't']); return classOp_(u, b); }
    if (a === 'setPublic') { need_(u, ['a', 't']); return setPublic_(u, b); }
    if (a === 'addStudents') { need_(u, ['a', 't']); return addStudents_(u, b); }
    if (a === 'student') { need_(u, ['a', 't']); return studentOp_(u, b); }
    if (a === 'honor') { need_(u, ['a', 't']); return honorOp_(u, b); }
    return { ok: false, error: 'Không rõ thao tác' };
  } finally { lock.releaseLock(); }
}

function login_(b) {
  if (b.role === 'a') {
    if (String(b.key || '') !== TEACHER_KEY) return { ok: false, error: 'Sai mã quản trị' };
    const u = { r: 'a', id: 'admin', exp: Date.now() + 30 * DAY };
    return { ok: true, token: sign_(u), user: profile_(u) };
  }
  if (b.role === 't') {
    const code = String(b.code || '').trim().toUpperCase();
    const t = teachers_().filter(x => x.hash === hash_(code, x.id))[0];
    if (!t) return { ok: false, error: 'Mã giáo viên không đúng' };
    if (t.status !== 'active') return { ok: false, error: 'Tài khoản giáo viên đang bị khoá' };
    const u = { r: 't', id: t.id, v: t.hash.slice(0, 8), exp: Date.now() + 30 * DAY };
    return { ok: true, token: sign_(u), user: profile_(u) };
  }
  const user = String(b.user || '').trim().toLowerCase(), pass = String(b.pass || '').trim();
  const st = students_().filter(x => x.user.toLowerCase() === user)[0];
  if (!st || st.hash !== hash_(pass, st.salt)) return { ok: false, error: 'Sai mã học sinh hoặc mật khẩu' };
  if (st.status !== 'active') return { ok: false, error: 'Tài khoản đang bị khoá, em hỏi giáo viên nhé' };
  const r = findRow_('Học sinh', S_HEAD, st.id); if (r) r.sh.getRange(r.row, 9).setValue(new Date());
  const u = { r: 's', id: st.id, v: String(st.hash).slice(0, 8), exp: Date.now() + 120 * DAY };
  return { ok: true, token: sign_(u), user: profile_(u) };
}

function data_(u) {
  const T = teachers_(), C = classes_(), S = students_();
  const myC = u.r === 'a' ? C : C.filter(c => c.teacherId === u.id);
  const cid = {}; myC.forEach(c => cid[c.id] = 1);
  const myS = S.filter(s => cid[s.classId]);
  const sid = {}; myS.forEach(s => sid[s.id] = 1);
  const ev = events_().filter(e => u.r === 'a' || sid[e.sid]);
  const tn = {}; T.forEach(t => tn[t.id] = t.name);
  return {
    ok: true, user: profile_(u), sheetUrl: u.r === 'a' ? book_().getUrl() : '',
    teachers: u.r === 'a' ? T.map(t => ({ id: t.id, name: t.name, tail: t.tail, status: t.status, created: t.created })) : [],
    classes: myC.map(c => ({ id: c.id, name: c.name, teacherId: c.teacherId, teacherName: tn[c.teacherId] || (c.teacherId ? '' : 'Quản trị viên'), pub: c.pub, created: c.created })),
    students: myS.map(s => ({ id: s.id, name: s.name, classId: s.classId, user: s.user, status: s.status, created: s.created, last: s.last })),
    events: ev,
    honors: honors_().filter(h => u.r === 'a' || cid[h.classId]).map(h => ({ id: h.id, sid: h.sid, code: h.code, t: h.t }))
  };
}

function createTeacher_(b) {
  const name = String(b.name || '').trim().slice(0, 80); if (!name) return { ok: false, error: 'Nhập tên giáo viên' };
  const id = nid_('GV'), code = 'GV-' + rnd_(4, '23456789ABCDEFGHJKLMNPQRSTUVWXYZ') + '-' + rnd_(4, '23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
  tab_('Giáo viên', T_HEAD).appendRow([id, name, hash_(code, id), code.slice(-4), 'active', new Date()]);
  return { ok: true, id: id, name: name, code: code };
}
function teacherOp_(b) {
  const r = findRow_('Giáo viên', T_HEAD, b.id); if (!r) return { ok: false, error: 'Không tìm thấy giáo viên' };
  if (b.op === 'regen') {
    const code = 'GV-' + rnd_(4, '23456789ABCDEFGHJKLMNPQRSTUVWXYZ') + '-' + rnd_(4, '23456789ABCDEFGHJKLMNPQRSTUVWXYZ');
    r.sh.getRange(r.row, 3, 1, 2).setValues([[hash_(code, b.id), code.slice(-4)]]); return { ok: true, code: code };
  }
  if (b.op === 'disable' || b.op === 'enable') { r.sh.getRange(r.row, 5).setValue(b.op === 'disable' ? 'locked' : 'active'); return { ok: true }; }
  if (b.op === 'rename') { r.sh.getRange(r.row, 2).setValue(String(b.name || '').slice(0, 80)); return { ok: true }; }
  if (b.op === 'delete') {
    if (classes_().some(c => c.teacherId === String(b.id))) return { ok: false, error: 'Giáo viên còn lớp. Chuyển hoặc xoá lớp trước.' };
    r.sh.deleteRow(r.row); return { ok: true };
  }
  return { ok: false, error: 'Không rõ thao tác' };
}
function createClass_(u, b) {
  const name = String(b.name || '').trim().slice(0, 60); if (!name) return { ok: false, error: 'Nhập tên lớp' };
  const tid = u.r === 't' ? u.id : String(b.teacherId || '');
  const id = nid_('L');
  tab_('Lớp', C_HEAD).appendRow([id, name, tid, '[]', new Date()]);
  return { ok: true, id: id };
}
function classOp_(u, b) {
  const c = ownClass_(u, b.id); const r = findRow_('Lớp', C_HEAD, c.id);
  if (b.op === 'rename') { r.sh.getRange(r.row, 2).setValue(String(b.name || '').slice(0, 60)); return { ok: true }; }
  if (b.op === 'teacher' && u.r === 'a') { r.sh.getRange(r.row, 3).setValue(String(b.teacherId || '')); return { ok: true }; }
  if (b.op === 'delete') {
    if (students_().some(s => s.classId === c.id)) return { ok: false, error: 'Lớp còn học sinh. Xoá hoặc chuyển học sinh trước.' };
    r.sh.deleteRow(r.row); return { ok: true };
  }
  return { ok: false, error: 'Không rõ thao tác' };
}
function setPublic_(u, b) {
  const c = ownClass_(u, b.classId); const r = findRow_('Lớp', C_HEAD, c.id);
  const codes = (Array.isArray(b.codes) ? b.codes : []).map(x => String(x).slice(0, 12)).slice(0, 400);
  r.sh.getRange(r.row, 4).setValue(JSON.stringify(codes)); return { ok: true, pub: codes };
}
function addStudents_(u, b) {
  const c = ownClass_(u, b.classId);
  const names = (Array.isArray(b.names) ? b.names : []).map(n => String(n).trim().slice(0, 80)).filter(Boolean).slice(0, 100);
  if (!names.length) return { ok: false, error: 'Nhập ít nhất một tên học sinh' };
  const used = {}; students_().forEach(s => used[s.user.toLowerCase()] = 1);
  const sh = tab_('Học sinh', S_HEAD), out = [], rows = [];
  names.forEach(n => {
    let user; do { user = 'hs' + rnd_(5, '0123456789'); } while (used[user]); used[user] = 1;
    const pass = rnd_(6), salt = rnd_(8), id = nid_('HS');
    rows.push([id, n, c.id, user, hash_(pass, salt), salt, 'active', new Date(), '']);
    out.push({ id: id, name: n, user: user, pass: pass });
  });
  sh.getRange(sh.getLastRow() + 1, 1, rows.length, S_HEAD.length).setValues(rows);
  return { ok: true, students: out, className: c.name };
}
function studentOp_(u, b) {
  const st = studentById_(b.id); if (!st) return { ok: false, error: 'Không tìm thấy học sinh' };
  ownClass_(u, st.classId);
  const r = findRow_('Học sinh', S_HEAD, st.id);
  if (b.op === 'reset') { const pass = rnd_(6), salt = rnd_(8); r.sh.getRange(r.row, 5, 1, 2).setValues([[hash_(pass, salt), salt]]); return { ok: true, user: st.user, pass: pass, name: st.name }; }
  if (b.op === 'disable' || b.op === 'enable') { r.sh.getRange(r.row, 7).setValue(b.op === 'disable' ? 'locked' : 'active'); return { ok: true }; }
  if (b.op === 'rename') { r.sh.getRange(r.row, 2).setValue(String(b.name || '').slice(0, 80)); return { ok: true }; }
  if (b.op === 'move') { ownClass_(u, b.classId); r.sh.getRange(r.row, 3).setValue(String(b.classId)); return { ok: true }; }
  if (b.op === 'delete') { r.sh.deleteRow(r.row); return { ok: true }; }
  return { ok: false, error: 'Không rõ thao tác' };
}

/* ===== Chấm câu viết lại bằng Gemini (khi đáp án của học sinh khác key) =====
 * Cần thuộc tính tập lệnh GEMINI_API_KEY (Cài đặt dự án → Thuộc tính tập lệnh).
 * Kết quả được lưu ở trang "Chấm AI" để giáo viên xem lại, và dùng lại cho cùng một câu trả lời. */
const AI_DAILY_LIMIT = 1500;
const AI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'];
const AI_HEAD = ['Thời gian', 'Mã', 'Câu gốc', 'Yêu cầu', 'Đáp án mẫu', 'Câu học sinh', 'Kết quả', 'Lý do'];

/* Tự tìm các mẫu Gemini "flash" đang dùng được (lưu 1 ngày); mẫu chạy tốt gần nhất được thử trước (AI_GOOD). */
function models_(key) {
  const props = PropertiesService.getScriptProperties();
  const saved = props.getProperty('AI_MODEL_LIST');
  if (saved) { try { const s = JSON.parse(saved); if (Date.now() - s.t < 86400000 && s.list.length) return s.list; } catch (e) {} }
  let list = [];
  try {
    const r = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200&key=' + encodeURIComponent(key), { muteHttpExceptions: true });
    if (r.getResponseCode() === 200) {
      list = (JSON.parse(r.getContentText()).models || [])
        .filter(x => (x.supportedGenerationMethods || []).indexOf('generateContent') >= 0)
        .map(x => x.name.replace(/^models\//, ''))
        .filter(n => /flash/.test(n) && !/tts|image|audio|live|embed|exp|preview|thinking|8b/.test(n));
      const ver = n => parseFloat((n.match(/gemini-(\d+(?:\.\d+)?)/) || [0, 0])[1]);
      list.sort((x, y) => (ver(y) - ver(x)) || (/lite/.test(x) - /lite/.test(y)) || (/latest/.test(y) - /latest/.test(x)));
    }
  } catch (e) {}
  if (!list.length) list = AI_MODELS.slice();
  list = list.slice(0, 4);
  props.setProperty('AI_MODEL_LIST', JSON.stringify({ t: Date.now(), list: list }));
  return list;
}

function aiSheet_() {
  const ss = book_();
  let sh = ss.getSheetByName('Chấm AI');
  if (!sh) {
    sh = ss.insertSheet('Chấm AI');
    sh.appendRow(AI_HEAD); sh.setFrozenRows(1);
    sh.getRange(1, 1, 1, AI_HEAD.length).setFontWeight('bold').setBackground('#9b1c1c').setFontColor('#ffffff');
  }
  return sh;
}

function normA_(t) {
  return String(t || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/[“”"]/g, '').replace(/[.,!?;:]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function grade_(p) {
  const key = PropertiesService.getScriptProperties().getProperty('GEMINI_API_KEY');
  if (!key) return { ok: false, error: 'Chưa cài GEMINI_API_KEY' };
  const q = String(p.q || '').slice(0, 600), hint = String(p.h || '').slice(0, 200), r = String(p.r || '').slice(0, 600);
  let ans = []; try { ans = JSON.parse(p.a || '[]').slice(0, 8).map(x => String(x).slice(0, 400)); } catch (e) {}
  if (!q || !r || r.split(/\s+/).length < 2) return { ok: false, error: 'Thiếu dữ liệu' };
  const id = Utilities.base64EncodeWebSafe(Utilities.computeDigest(Utilities.DigestAlgorithm.MD5, normA_(q) + '|' + normA_(hint) + '|' + normA_(r)));
  const cache = CacheService.getScriptCache();
  const hit = cache.get('g' + id);
  if (hit) return JSON.parse(hit);
  const sh = aiSheet_();
  const f = sh.getRange('B:B').createTextFinder(id).matchEntireCell(true).findNext();
  if (f) {
    const row = sh.getRange(f.getRow(), 7, 1, 2).getValues()[0];
    const res = { ok: true, correct: row[0] === 'Đúng', reason: row[1], cached: true };
    cache.put('g' + id, JSON.stringify(res), 21600);
    return res;
  }
  const props = PropertiesService.getScriptProperties();
  const day = 'AI-' + Utilities.formatDate(new Date(), 'Asia/Ho_Chi_Minh', 'yyyy-MM-dd');
  const used = Number(props.getProperty(day) || 0);
  if (used >= AI_DAILY_LIMIT) return { ok: false, error: 'Hết lượt chấm AI hôm nay' };
  props.setProperty(day, String(used + 1));

  const prompt = [
    'You are a strict but fair examiner for a Vietnamese gifted high-school English entrance exam (sentence transformation).',
    'Decide if the STUDENT sentence is an acceptable answer.',
    'Accept ONLY if ALL hold: (1) grammatically correct standard English; (2) keeps the same meaning as the ORIGINAL (no information added, lost or changed; same tense/time reference where relevant);',
    '(3) follows the REQUIREMENT: it must begin with the given beginning, or contain the given keyword unchanged in form; (4) it is a complete sentence;',
    '(5) no spelling mistakes in words. Ignore capitalisation, final punctuation, curly vs straight quotes and contractions.',
    'The reference answers are examples only — other correct transformations must be accepted.',
    'ORIGINAL: ' + q,
    'REQUIREMENT: ' + (hint || '(none)'),
    'REFERENCE ANSWERS: ' + (ans.join(' | ') || '(none)'),
    'STUDENT: ' + r,
    'Reply as JSON: {"correct": true|false, "reason": "<one short sentence in Vietnamese explaining the verdict; if wrong, name the error>"}'
  ].join('\n');
  let res = null, lastErr = '';
  const T0 = Date.now();
  const GOOD = PropertiesService.getScriptProperties().getProperty('AI_GOOD');
  let ML = models_(key); if (GOOD) ML = [GOOD].concat(ML.filter(x => x !== GOOD));
  for (const m of ML) {
    if (Date.now() - T0 > 40000) break;
    try {
      const call = think => {
        const gc = { temperature: 0, maxOutputTokens: 400, responseMimeType: 'application/json', responseSchema: { type: 'OBJECT', properties: { correct: { type: 'BOOLEAN' }, reason: { type: 'STRING' } }, required: ['correct', 'reason'] } };
        if (think) gc.thinkingConfig = /gemini-[3-9]/.test(m) ? { thinkingLevel: 'low' } : { thinkingBudget: 0 };
        return UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + m + ':generateContent?key=' + encodeURIComponent(key), {
          method: 'post', contentType: 'application/json', muteHttpExceptions: true,
          payload: JSON.stringify({ contents: [{ role: 'user', parts: [{ text: prompt }] }], generationConfig: gc })
        });
      };
      let resp = call(true);
      if (resp.getResponseCode() === 400) resp = call(false);
      if (resp.getResponseCode() !== 200) { lastErr += m + ': ' + resp.getResponseCode() + ' ' + resp.getContentText().slice(0, 120) + ' | '; if (resp.getResponseCode() === 404) PropertiesService.getScriptProperties().deleteProperty('AI_MODEL_LIST'); continue; }
      const txt = JSON.parse(resp.getContentText()).candidates[0].content.parts.map(x => x.text || '').join('');
      const j = JSON.parse(txt.replace(/^```(json)?|```$/g, '').trim());
      res = { ok: true, correct: j.correct === true, reason: String(j.reason || '').slice(0, 300), model: m };
      if (m !== GOOD) PropertiesService.getScriptProperties().setProperty('AI_GOOD', m);
      break;
    } catch (e) { lastErr += m + ': ' + e + ' | '; }
  }
  if (!res) return { ok: false, error: 'AI lỗi: ' + lastErr };
  sh.appendRow([new Date(), id, q, hint, ans.join(' | '), r, res.correct ? 'Đúng' : 'Sai', res.reason]);
  cache.put('g' + id, JSON.stringify(res), 21600);
  return res;
}

/* Bấm ▶ Chạy với hàm kiemTraAI để cấp quyền gọi Gemini và thử chấm một câu. Xem kết quả ở Nhật ký thực thi. */
function kiemTraAI() {
  ScriptApp.requireScopes(ScriptApp.AuthMode.FULL, ['https://www.googleapis.com/auth/script.external_request']);
  const t0 = Date.now();
  const r = grade_({ q: 'Without her advice, I would have bought the wrong size.', h: 'But...', a: JSON.stringify(['But for her advice, I would have bought the wrong size.']), r: 'But for the advice she gave me, I would have bought the wrong size.' });
  Logger.log(JSON.stringify(r) + ' · ' + (Date.now() - t0) + ' ms');
}


/* ===================== VINH DANH BÀI LUẬN XUẤT SẮC =====================
   Giáo viên chọn bài luận đã nộp (tab "Bài luận" ở trang Quản lý) → chấm theo 4 tiêu chí, trích câu hay
   (bắt buộc là câu có thật trong bài) và nhận xét. Học sinh đã đăng nhập xem ở cột phải trang học. */
const H_HEAD = ['Mã', 'Ngày duyệt', 'Mã HS', 'Tên hiển thị', 'Lớp', 'Mã lớp', 'Buổi', 'Thời gian nộp', 'Số từ',
  'Điểm (/10)', 'Tiêu chí (JSON)', 'Trích dẫn (JSON)', 'Nhận xét', 'Giáo viên', 'Phạm vi', 'Đề bài', 'Bài viết'];
const H_CRIT = ['nd', 'bc', 'tv', 'ng']; // Nội dung · Bố cục & liên kết · Từ vựng · Ngữ pháp

function honors_() {
  return rows_('Vinh danh', H_HEAD).filter(r => r[0]).map(r => {
    const j = x => { try { return JSON.parse(x || 'null'); } catch (e) { return null; } };
    const iso = x => x instanceof Date ? x.toISOString() : String(x || '');
    return { id: String(r[0]), approved: iso(r[1]), sid: String(r[2]), name: r[3], cls: r[4], classId: String(r[5]), code: r[6],
      t: iso(r[7]), words: Number(r[8]) || 0, score: Number(r[9]) || 0, crit: j(r[10]) || {}, quotes: j(r[11]) || [],
      comment: r[12], teacher: r[13], scope: r[14] || 'all', prompt: r[15], text: r[16] };
  });
}

function honorsFor_(u) {
  const cache = CacheService.getScriptCache();
  let list; const hit = cache.get('honors');
  if (hit) list = JSON.parse(hit);
  else {
    list = honors_().sort((x, y) => (y.approved > x.approved ? 1 : -1)).slice(0, 40);
    try { cache.put('honors', JSON.stringify(list), 600); } catch (e) {}
  }
  if (u.r === 's') { const st = studentById_(u.id); list = list.filter(h => h.scope !== 'class' || (st && h.classId === st.classId)); }
  return { ok: true, honors: list.map(h => { const o = Object.assign({}, h); delete o.classId; return o; }) };
}

function honorOp_(u, b) {
  const op = b.op;
  if (op === 'remove') {
    const r = findRow_('Vinh danh', H_HEAD, b.id); if (!r) throw new Error('Không tìm thấy bài vinh danh');
    const cls = String(r.sh.getRange(r.row, 6).getValue()); if (u.r === 't') ownClass_(u, cls);
    r.sh.deleteRow(r.row); CacheService.getScriptCache().remove('honors'); return { ok: true };
  }
  const st = studentById_(b.sid); if (!st) throw new Error('Không tìm thấy học sinh');
  const c = ownClass_(u, st.classId);
  // Lấy bài từ dữ liệu đã nộp (không tin nội dung trình duyệt gửi lên)
  const ev = events_().filter(e => e.type === 'essay' && String(e.sid) === st.id && e.code === b.code && e.t === b.t)[0];
  if (!ev) throw new Error('Không tìm thấy bài luận đã nộp');
  const text = String(ev.text || '');
  const crit = {}; H_CRIT.forEach(k => { const v = Number((b.crit || {})[k]); if (!(v >= 0 && v <= 10)) throw new Error('Điểm tiêu chí phải từ 0 đến 10'); crit[k] = Math.round(v * 4) / 4; });
  const score = b.score !== undefined && b.score !== '' ? Math.round(Number(b.score) * 4) / 4 : Math.round(H_CRIT.reduce((s, k) => s + crit[k], 0) / 4 * 4) / 4;
  if (!(score >= 0 && score <= 10)) throw new Error('Điểm tổng phải từ 0 đến 10');
  const norm = x => String(x).replace(/[’‘]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim();
  const nt = norm(text);
  const quotes = (b.quotes || []).slice(0, 3).map(q => ({ q: norm(q.q || '').slice(0, 400), note: String(q.note || '').slice(0, 200) })).filter(q => q.q);
  if (!quotes.length) throw new Error('Cần ít nhất 1 câu trích dẫn từ bài làm làm bằng chứng');
  quotes.forEach(q => { if (nt.indexOf(q.q) < 0) throw new Error('Câu trích không có trong bài: “' + q.q.slice(0, 60) + '…”'); });
  const teacher = u.r === 'a' ? 'Quản trị viên' : ((teachers_().filter(x => x.id === u.id)[0] || {}).name || '');
  const row = [b.id || nid_('VD'), new Date(), st.id, String(b.name || st.name).slice(0, 60), c.name, c.id, ev.code, new Date(ev.t), Number(ev.score) || (text.match(/\S+/g) || []).length,
    score, JSON.stringify(crit), JSON.stringify(quotes), String(b.comment || '').slice(0, 600), teacher, b.scope === 'class' ? 'class' : 'all',
    String(b.prompt || '').slice(0, 600), text.slice(0, 20000)];
  const sh = tab_('Vinh danh', H_HEAD);
  const old = b.id ? findRow_('Vinh danh', H_HEAD, b.id) : null;
  if (old) sh.getRange(old.row, 1, 1, H_HEAD.length).setValues([row]); else sh.appendRow(row);
  CacheService.getScriptCache().remove('honors');
  return { ok: true, id: row[0] };
}

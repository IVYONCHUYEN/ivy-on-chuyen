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
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const body = JSON.parse(e.postData.contents || '{}');
    const list = Array.isArray(body.events) ? body.events : [body];
    const sh = book_().getSheetByName('Sự kiện');
    const rows = list.slice(0, 200).map(ev => [
      ev.t ? new Date(ev.t) : new Date(),
      String(ev.sid || '').slice(0, 40), String(ev.name || '').slice(0, 80), String(ev.cls || '').slice(0, 60),
      String(ev.type || '').slice(0, 20), String(ev.code || '').slice(0, 10),
      ev.score === undefined ? '' : Number(ev.score), ev.total === undefined ? '' : Number(ev.total),
      ev.detail ? JSON.stringify(ev.detail).slice(0, 2000) : '', String(ev.text || '').slice(0, 20000)
    ]);
    if (rows.length) sh.getRange(sh.getLastRow() + 1, 1, rows.length, HEAD.length).setValues(rows);
    return out_({ ok: true, n: rows.length });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (p.action === 'ping') return out_({ ok: true });
  if (p.action === 'grade') return out_(grade_(p));
  if (p.key !== TEACHER_KEY) return out_({ ok: false, error: 'Sai mã giáo viên' });
  const ss = book_();
  const values = ss.getSheetByName('Sự kiện').getDataRange().getValues();
  values.shift();
  const events = values.map(r => ({
    t: r[0] instanceof Date ? r[0].toISOString() : r[0], sid: r[1], name: r[2], cls: r[3], type: r[4], code: r[5],
    score: r[6] === '' ? null : r[6], total: r[7] === '' ? null : r[7],
    detail: r[8] ? (function () { try { return JSON.parse(r[8]); } catch (x) { return null; } })() : null, text: r[9]
  }));
  return out_({ ok: true, sheetUrl: ss.getUrl(), events: events });
}


/* ===== Chấm câu viết lại bằng Gemini (khi đáp án của học sinh khác key) =====
 * Cần thuộc tính tập lệnh GEMINI_API_KEY (Cài đặt dự án → Thuộc tính tập lệnh).
 * Kết quả được lưu ở trang "Chấm AI" để giáo viên xem lại, và dùng lại cho cùng một câu trả lời. */
const AI_DAILY_LIMIT = 1500;
const AI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.5-flash-lite'];
const AI_HEAD = ['Thời gian', 'Mã', 'Câu gốc', 'Yêu cầu', 'Đáp án mẫu', 'Câu học sinh', 'Kết quả', 'Lý do'];

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
  for (const m of AI_MODELS) {
    try {
      const resp = UrlFetchApp.fetch('https://generativelanguage.googleapis.com/v1beta/models/' + m + ':generateContent?key=' + encodeURIComponent(key), {
        method: 'post', contentType: 'application/json', muteHttpExceptions: true,
        payload: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0, responseMimeType: 'application/json' }
        })
      });
      if (resp.getResponseCode() !== 200) { lastErr = m + ': ' + resp.getResponseCode(); continue; }
      const txt = JSON.parse(resp.getContentText()).candidates[0].content.parts.map(x => x.text || '').join('');
      const j = JSON.parse(txt.replace(/^```(json)?|```$/g, '').trim());
      res = { ok: true, correct: j.correct === true, reason: String(j.reason || '').slice(0, 300) };
      break;
    } catch (e) { lastErr = m + ': ' + e; }
  }
  if (!res) return { ok: false, error: 'AI lỗi: ' + lastErr };
  sh.appendRow([new Date(), id, q, hint, ans.join(' | '), r, res.correct ? 'Đúng' : 'Sai', res.reason]);
  cache.put('g' + id, JSON.stringify(res), 21600);
  return res;
}

/* Bấm ▶ Chạy với hàm kiemTraAI để cấp quyền gọi Gemini và thử chấm một câu. Xem kết quả ở Nhật ký thực thi. */
function kiemTraAI() {
  const r = grade_({ q: 'Save some money now, or you will regret it.', h: 'If...', a: JSON.stringify(["If you don't save some money now, you will regret it."]), r: 'If you do not save any money now, you will regret it.' });
  Logger.log(JSON.stringify(r));
}

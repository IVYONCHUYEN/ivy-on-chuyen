/**
 * IVY GIFTED – lưu tiến độ học sinh vào Google Sheet.
 * Cách dùng: script.google.com → Dự án mới → dán toàn bộ file này → Triển khai → Ứng dụng web
 *   (Thực thi với: Tôi · Ai có quyền truy cập: Bất kỳ ai) → sao chép URL /exec.
 * Lần chạy đầu tiên script tự tạo bảng tính "IVY GIFTED – Tiến độ học sinh" trong Drive của bạn.
 */
const TEACHER_KEY = 'ivy2027';          // Mã đăng nhập dashboard giáo viên – đổi nếu muốn
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

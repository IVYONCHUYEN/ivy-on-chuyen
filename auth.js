/* IVY GIFTED – đăng nhập (quản trị · giáo viên · học sinh) và quyền xem bài Public/Private.
   Phiên đăng nhập lưu ở localStorage "ivy-auth" = {token, user}. Máy chủ: Apps Script (window.IVY_API). */
(function () {
  const K = "ivy-auth";
  const get = () => { try { return JSON.parse(localStorage.getItem(K) || "null") } catch (e) { return null } };
  const save = v => { try { v ? localStorage.setItem(K, JSON.stringify(v)) : localStorage.removeItem(K) } catch (e) {} };
  function api() { try { return window.IVY_API || (window.top && window.top.IVY_API) || "" } catch (e) { return window.IVY_API || "" } }
  async function call(action, payload) {
    const url = api(); if (!url) throw new Error("Chưa kết nối máy chủ");
    const s = get();
    const r = await fetch(url, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(Object.assign({ action, token: s && s.token }, payload || {})) });
    const j = await r.json();
    if (!j.ok) { const e = new Error(j.error || "Lỗi máy chủ"); e.server = true; throw e; }
    return j;
  }
  function syncTrack(u) {
    // học sinh: dùng mã tài khoản làm mã gửi tiến độ; giáo viên/quản trị: không gửi tiến độ
    try {
      if (u && u.role === "student") localStorage.setItem("ivy-student", JSON.stringify({ sid: u.id, name: u.name, cls: u.className || "", code: "" }));
      else localStorage.removeItem("ivy-student");
      if (u) localStorage.setItem("ivy-name", JSON.stringify(u.name));
    } catch (e) {}
  }
  async function login(role, a, b) {
    const j = await call("login", role === "s" ? { role, user: a, pass: b } : role === "t" ? { role, code: a } : { role, key: a });
    save({ token: j.token, user: j.user, at: Date.now() }); syncTrack(j.user); return j.user;
  }
  async function refresh() {
    const s = get(); if (!s) return null;
    try { const j = await call("me"); s.user = j.user; s.at = Date.now(); save(s); syncTrack(j.user); return j.user; }
    catch (e) { if (e.server) { save(null); syncTrack(null); return null; } return s.user; } // mất mạng: dùng bản lưu
  }
  function logout() { save(null); syncTrack(null); try { localStorage.removeItem("ivy-outbox") } catch (e) {} }
  const user = () => (get() || {}).user || null;
  const token = () => (get() || {}).token || "";
  const staff = () => { const u = user(); return !!u && (u.role === "teacher" || u.role === "admin") };
  function canSee(code) {
    const u = user(); if (!u) return false;
    if (u.role !== "student") return true;
    return (u.pub || []).indexOf(code) >= 0;
  }
  window.IVY_AUTH = { call, login, refresh, logout, user, token, staff, canSee, get };
})();

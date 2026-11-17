/* IVY GIFTED – chặn mở trực tiếp bài chưa được giáo viên Public (dùng cho buoi-1, buoi-2, de-on-1). */
(function () {
  const me = document.currentScript, codes = (me.getAttribute("data-codes") || "").split(",").filter(Boolean);
  let u = null; try { u = (JSON.parse(localStorage.getItem("ivy-auth") || "null") || {}).user || null } catch (e) {}
  const ok = u && (u.role !== "student" || codes.some(c => (u.pub || []).indexOf(c) >= 0));
  if (!ok) location.replace(me.src.replace(/guard\.js.*$/, "") + "chua-mo.html" + (u ? "?l=1" : ""));
})();

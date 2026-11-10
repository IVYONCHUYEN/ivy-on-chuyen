/* IVY GIFTED – chấm câu viết lại khác đáp án mẫu bằng AI (qua Apps Script, không lộ khoá API). */
(function () {
  const api = () => window.IVY_API || (window.top !== window && (() => { try { return window.top.IVY_API } catch (e) { return "" } })()) || "";
  const LS = "ivy-ai-cache";
  let mem = {};
  try { mem = JSON.parse(localStorage.getItem(LS) || "{}") } catch (e) { mem = {} }
  const n = t => String(t || "").toLowerCase().replace(/[’‘`]/g, "'").replace(/[“”"]/g, "").replace(/[.,!?;:]+/g, " ").replace(/\s+/g, " ").trim();
  function save() { try { const k = Object.keys(mem); if (k.length > 400) k.slice(0, k.length - 400).forEach(x => delete mem[x]); localStorage.setItem(LS, JSON.stringify(mem)) } catch (e) {} }
  /* o = {q: câu gốc, h: yêu cầu (bắt đầu bằng / từ khoá), a: [đáp án mẫu], r: câu học sinh}
     → Promise<{correct, reason} | null>  (null = không chấm được, giữ kết quả theo key) */
  function check(o) {
    const url = api();
    if (!url || !o.r || n(o.r).split(" ").length < 2) return Promise.resolve(null);
    const id = n(o.q) + "|" + n(o.h) + "|" + n(o.r);
    if (mem[id]) return Promise.resolve(mem[id]);
    const qs = new URLSearchParams({ action: "grade", q: o.q || "", h: o.h || "", a: JSON.stringify((o.a || []).slice(0, 8)), r: o.r });
    const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), 25000);
    return fetch(url + "?" + qs.toString(), { signal: ctl.signal }).then(r => r.json()).then(j => {
      clearTimeout(t);
      if (!j || !j.ok) return null;
      const res = { correct: !!j.correct, reason: j.reason || "" };
      mem[id] = res; save(); return res;
    }).catch(() => { clearTimeout(t); return null });
  }
  window.IVY_AI = { check };
})();

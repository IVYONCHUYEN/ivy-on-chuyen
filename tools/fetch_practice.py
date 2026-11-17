"""Tải toàn bộ thư mục Drive 'Listening Practice' (Test 1..33): liệt kê qua embeddedfolderview, xuất Docs (html+txt), tải PDF/audio."""
import os, re, json, html, time, urllib.request, http.cookiejar
ROOT = "1Atu0voX9DrCZmMyn5sOJzDVf0rmKMIJM"
OUT = "tools/raw/practice"; AUD = "audio/drive"
os.makedirs(OUT, exist_ok=True); os.makedirs(AUD, exist_ok=True)
cj = http.cookiejar.CookieJar(); op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
op.addheaders = [("User-Agent", "Mozilla/5.0")]
def get(url):
    for i in range(4):
        try:
            with op.open(url, timeout=180) as r: return r.read(), r.headers.get("Content-Type", "")
        except Exception as e:
            print("retry", url, e); time.sleep(3 + 5 * i)
    return None, ""
def listdir(fid):
    data, _ = get(f"https://drive.google.com/embeddedfolderview?id={fid}#list")
    if not data: return []
    h = data.decode("utf-8", "ignore"); out = []
    for m in re.finditer(r'<div class="flip-entry" id="entry-([\w-]+)".*?<a href="([^"]+)".*?<div class="flip-entry-title">(.*?)</div>', h, re.S):
        eid, href, title = m.group(1), html.unescape(m.group(2)), html.unescape(m.group(3)).strip()
        kind = "folder" if "/folders/" in href else "doc" if "/document/" in href else "sheet" if "/spreadsheets/" in href else "file"
        out.append({"id": eid, "title": title, "kind": kind})
    return out
man = {}
for f in listdir(ROOT):
    if f["kind"] != "folder": continue
    m = re.search(r"(\d+)", f["title"]);
    if not m: continue
    n = int(m.group(1)); d = f"{OUT}/{n:02d}"; os.makedirs(d, exist_ok=True)
    items = listdir(f["id"]); man[n] = {"folder": f["id"], "items": items}
    for it in items:
        fid = it["id"]
        if it["kind"] == "doc":
            for fmt in ("html", "txt"):
                p = f"{d}/{fid}.{fmt}"
                if os.path.exists(p): continue
                data, _ = get(f"https://docs.google.com/document/d/{fid}/export?format={fmt}")
                if data and b"accounts.google.com" not in data[:3000]: open(p, "wb").write(data)
                else: it["bad"] = 1
        elif it["kind"] == "file":
            low = it["title"].lower()
            if low.endswith((".mp3", ".m4a", ".wav", ".mp4")):
                p = f"{AUD}/{fid}.mp3"
            else:
                p = f"{d}/{fid}.bin"
            if os.path.exists(p): continue
            data, ct = get(f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t")
            if not data or b"<html" in data[:400].lower(): it["bad"] = 1; continue
            open(p, "wb").write(data)
    print(n, len(items), [i["title"] for i in items])
json.dump(man, open(f"{OUT}/manifest.json", "w"), ensure_ascii=False, indent=1)

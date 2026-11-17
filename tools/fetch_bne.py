#!/usr/bin/env python3
"""IVY GIFTED – lấy "Bài đọc hôm nay" từ https://breakingnewsenglish.com/ (chạy hằng ngày bằng GitHub Actions).

Chỉ lưu tiêu đề, ngày, chủ đề, 2 câu mở đầu (trích ngắn) và đường link các level để học sinh bấm sang
trang gốc đọc toàn bài – không chép lại toàn văn. Kết quả: data/daily-reading.js (window.IVY_DAILY).
Chỉ dùng thư viện chuẩn của Python.
"""
import html, json, os, re, sys, time, urllib.request
from datetime import datetime, timezone, timedelta

BASE = "https://breakingnewsenglish.com/"
OUT = os.path.join(os.path.dirname(__file__), "..", "data", "daily-reading.js")
UA = "Mozilla/5.0 (compatible; IVY-GIFTED-daily-reading/1.0; +https://ivyonchuyen.github.io/ivy-on-chuyen/)"
KEEP = 60          # số bài giữ trong lịch sử
MAX_FETCH = 20     # số trang bài học tải mỗi lần chạy
VN = timezone(timedelta(hours=7))


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "en"})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode(r.headers.get_content_charset() or "utf-8", "replace")


def text(s):
    s = re.sub(r"(?is)<(script|style)[^>]*>.*?</\1>", " ", s)
    s = re.sub(r"(?i)<br\s*/?>", "\n", s)
    s = re.sub(r"<[^>]+>", " ", s)
    s = html.unescape(s).replace("\xa0", " ")
    return re.sub(r"[ \t\r\f\v]+", " ", s).strip()


LINK = re.compile(r'(?is)<a\b[^>]*href="(?:https?://(?:www\.)?breakingnewsenglish\.com/)?/?(\d{4})/(\d{6})-([a-z0-9-]+?)\.html"[^>]*>(.*?)</a>')


def lessons_from_home(page):
    found = {}
    for yymm, ymd, slug, inner in LINK.findall(page):
        if not ymd.startswith(yymm):
            continue
        base = slug
        while True:  # bỏ hậu tố level: -4, -5, -4l, -r, -reading-200-4 …
            m = re.search(r"-(?:[0-6]|[0-6]l|l|r|reading-\d+(?:-\d)?)$", base)
            if not m:
                break
            base = base[: m.start()]
        key = ymd + "-" + base
        t = text(inner)
        it = found.setdefault(key, {"ymd": ymd, "yymm": yymm, "slug": base, "title": ""})
        # tiêu đề = dòng chữ dài nhất trỏ tới bài (bỏ chữ "Level 4", "Easier"…)
        if len(t) > len(it["title"]) and not re.match(r"(?i)^(level|easier|harder|listen|read|more)\b", t):
            it["title"] = t
    return sorted(found.values(), key=lambda x: x["ymd"], reverse=True)


def article(page):
    """Tách bài đọc: các đoạn văn ngay sau tiêu đề 'The Reading'."""
    i = page.lower().find("the reading")
    if i < 0:
        return "", ""
    head = text(page[i:i + 400].split("</h")[0])
    topic = re.sub(r"(?i)^the reading\s*(/\s*listening)?\s*[-–:]\s*", "", head)
    topic = re.sub(r"(?i)\s*[-–]\s*level\s*\d.*$", "", topic).strip()
    seg = page[i:i + 30000]
    paras = []
    for m in re.finditer(r"(?is)<p\b[^>]*>(.*?)</p>|<h[1-6]\b", seg):
        if m.group(0).lower().startswith("<h") and m.start() > 0:
            if paras:
                break
            continue
        t = text(m.group(1) or "")
        if len(t.split()) >= 12:
            paras.append(t)
        elif paras:
            break
    if not paras:  # bố cục khác: lấy các dòng dài liên tiếp
        lines = [l.strip() for l in text(seg).split("\n")]
        for l in lines[1:]:
            if len(l.split()) >= 12:
                paras.append(l)
            elif paras:
                break
    return topic, "\n\n".join(paras)


def excerpt(body, max_words=55):
    sents = re.split(r"(?<=[.!?])\s+(?=[A-Z\"“])", body.replace("\n", " "))
    out = []
    for s in sents:
        if out and len(" ".join(out + [s]).split()) > max_words:
            break
        out.append(s)
        if len(out) >= 2:
            break
    return " ".join(out).strip()


def load_old():
    try:
        s = open(OUT, encoding="utf-8").read()
        return json.loads(s[s.index("{"): s.rindex("}") + 1])
    except Exception:
        return {"items": []}


def main():
    old = load_old()
    before = json.dumps(old.get("items", []), sort_keys=True)  # ảnh chụp trước khi sửa
    items = {x["id"]: json.loads(json.dumps(x)) for x in old.get("items", [])}
    home = get(BASE)
    news = lessons_from_home(home)
    if not news:
        print("Không tìm thấy bài nào trên trang chủ – giữ nguyên dữ liệu cũ", file=sys.stderr)
        return 1
    for n in news[:20]:
        lid = n["ymd"] + "-" + n["slug"]
        url = f"{BASE}{n['yymm']}/{n['ymd']}-{n['slug']}"
        it = items.get(lid) or {"id": lid}
        it.update({
            "date": f"20{n['ymd'][:2]}-{n['ymd'][2:4]}-{n['ymd'][4:]}",
            "title": n["title"] or it.get("title") or n["slug"].replace("-", " ").capitalize(),
            "url": url + ".html",
            "base": url,
        })
        items[lid] = it
    fetched = 0
    for it in sorted(items.values(), key=lambda x: x["date"], reverse=True):
        if (it.get("excerpt") and it.get("kind")) or fetched >= MAX_FETCH or not it.get("base"):
            continue
        url = it["base"]
        # Bài "Harder": Level 4 (-4), 5 (-5), 6 (gốc). Bài "Easier": Level 0–2 (-0…-2), 3 (gốc).
        for kind, lv, u in (("harder", 4, url + "-4.html"), ("easier", 3, url + ".html")):
            try:
                page = get(u)
            except Exception as e:
                print("lỗi tải", u, e, file=sys.stderr)
                continue
            topic, body = article(page)
            if not body:
                continue
            if len(it["title"].split()) < 4:  # tiêu đề trang chủ thiếu → lấy tiêu đề h2/h3 đầu tiên của bài
                for h in re.findall(r"(?is)<h[23]\b[^>]*>(.*?)</h[23]>", page):
                    h = text(h)
                    if len(h.split()) >= 4 and not h.lower().startswith("the reading"):
                        it["title"] = h
                        break
            m = re.search(r"(?i)level\s*(\d)", page[page.lower().find("the reading"):][:300])
            lv = int(m.group(1)) if m else lv
            if kind == "harder":
                it["levels"] = {"4": url + "-4.html", "5": url + "-5.html", "6": url + ".html"}
                it["listen"] = url + "-4l.html"
            else:
                it["levels"] = {"2": url + "-2.html", "3": url + ".html"}
                it.pop("listen", None)
            it.update(kind=kind, level=lv, topic=topic, excerpt=excerpt(body), words=len(body.split()))
            break
        fetched += 1
        time.sleep(1.5)
    keep = sorted(items.values(), key=lambda x: x["date"], reverse=True)[:KEEP]
    data = {"source": "Breaking News English (breakingnewsenglish.com)",
            "updated": datetime.now(VN).strftime("%Y-%m-%d %H:%M"), "items": keep}
    js = ("/* Tự động tạo bởi tools/fetch_bne.py – không sửa tay. Nguồn: https://breakingnewsenglish.com/ */\n"
          "window.IVY_DAILY=" + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    # chỉ ghi khi nội dung bài thay đổi (bỏ qua dòng giờ cập nhật) để không tạo commit thừa
    if before == json.dumps(keep, sort_keys=True):
        print("Không có bài mới")
        return 0
    open(OUT, "w", encoding="utf-8").write(js)
    print(f"Đã lưu {len(keep)} bài · mới nhất: {keep[0]['date']} {keep[0]['title']} · tải {fetched} trang")
    return 0


if __name__ == "__main__":
    sys.exit(main())

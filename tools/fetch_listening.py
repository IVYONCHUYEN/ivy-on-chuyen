"""Tải đề/đáp án (Google Docs, PDF) và audio Listening từ Drive (link công khai) về repo."""
import os, re, sys, time, urllib.request, http.cookiejar
OUT = "tools/raw/listening"; AUD = "audio/drive"
os.makedirs(OUT, exist_ok=True); os.makedirs(AUD, exist_ok=True)
cj = http.cookiejar.CookieJar(); op = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))
op.addheaders = [("User-Agent", "Mozilla/5.0")]
def get(url):
    for i in range(4):
        try:
            with op.open(url, timeout=120) as r: return r.read(), r.headers.get("Content-Type", "")
        except Exception as e:
            print("retry", url, e); time.sleep(3 + 5 * i)
    return None, ""
def drive_file(fid):
    data, ct = get(f"https://drive.usercontent.google.com/download?id={fid}&export=download&confirm=t")
    if data and b"<html" in data[:400].lower(): return None, ct
    return data, ct
audio_ids = set(); bad = []
for line in open("tools/listening_sources.txt"):
    if not line.strip(): continue
    kind, fid = line.split()
    if kind == "doc":
        for fmt in ("html", "txt"):
            p = f"{OUT}/{fid}.{fmt}"
            if os.path.exists(p): continue
            data, ct = get(f"https://docs.google.com/document/d/{fid}/export?format={fmt}")
            if not data or b"accounts.google.com" in data[:3000]: bad.append(fid); break
            open(p, "wb").write(data)
        p = f"{OUT}/{fid}.html"
        if os.path.exists(p):
            h = open(p, encoding="utf-8", errors="ignore").read()
            for m in re.finditer(r"drive\.google\.com(?:/file/d/|%2Ffile%2Fd%2F|/open\?id=)([\w-]{20,})", h): audio_ids.add(m.group(1))
    else:
        p = f"{OUT}/{fid}.bin"
        if not os.path.exists(p) and not os.path.exists(f"{AUD}/{fid}.mp3"):
            data, ct = drive_file(fid)
            if not data: bad.append(fid); continue
            if data[:3] == b"ID3" or data[:2] in (b"\xff\xfb", b"\xff\xf3", b"\xff\xf2") or "audio" in ct:
                open(f"{AUD}/{fid}.mp3", "wb").write(data)
            else:
                open(p, "wb").write(data)
for aid in sorted(audio_ids):
    p = f"{AUD}/{aid}.mp3"
    if os.path.exists(p): continue
    data, ct = drive_file(aid)
    if not data: bad.append(aid); continue
    open(p, "wb").write(data)
open(f"{OUT}/_report.txt", "w").write("audio_ids " + " ".join(sorted(audio_ids)) + "\nbad " + " ".join(bad) + "\n")
print("audio", len(audio_ids), "bad", bad)

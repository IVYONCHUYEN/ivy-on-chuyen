"""Chép lời audio bằng Gemini (cho bài nghe không có đáp án / chép chính tả)."""
import os, sys, time, json
from google import genai
from google.genai import types
client = genai.Client(api_key=os.environ["GEMINI_API_KEY"], http_options=types.HttpOptions(api_version="v1beta", timeout=180000))
OUT = "tools/raw/listening"
names = [m.name.replace("models/", "") for m in client.models.list()]
cand = [n for n in names if "flash" in n and not any(x in n for x in ("tts", "image", "live", "embed", "lite", "exp", "preview", "audio"))]
def ver(n):
    import re
    m = re.search(r"gemini-(\d+(?:\.\d+)?)", n); return float(m.group(1)) if m else 0
cand.sort(key=ver, reverse=True); cand = cand[:5] or ["gemini-2.5-flash"]
if "gemini-3.6-flash" in cand: cand.remove("gemini-3.6-flash"); cand.insert(0, "gemini-3.6-flash")
print("models", cand, flush=True)
PROMPT = ("Transcribe this English listening recording exactly, word for word (verbatim), with correct punctuation. "
          "Put each speaker turn on a new line, prefixed with the speaker's name or role if it is clear (e.g. 'Interviewer:'), otherwise no prefix. "
          "Do not add any commentary, headings or timestamps.")
for fid in [l.strip() for l in open("tools/transcribe_ids.txt") if l.strip()]:
    p = f"{OUT}/tr_{fid}.txt"
    if os.path.exists(p): continue
    data = open(f"audio/drive/{fid}.mp3", "rb").read()
    done = False
    for m in cand:
        for attempt in range(2):
            try:
                r = client.models.generate_content(model=m, contents=[types.Part.from_bytes(data=data, mime_type="audio/mpeg"), PROMPT],
                                                   config=types.GenerateContentConfig(temperature=0))
                open(p, "w").write(r.text.strip() + "\n"); print("ok", fid, m, len(r.text), flush=True); os.system(f"git add {p} && git commit -qm 'transcript {fid}' && git pull -q --rebase && git push -q"); done = True; break
            except Exception as e:
                print("err", fid, m, str(e)[:200], flush=True); time.sleep(5)
                if "404" in str(e) or "not found" in str(e).lower(): break
        if done: break

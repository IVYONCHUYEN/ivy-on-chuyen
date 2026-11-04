"""Tạo audio giọng người thật bằng Gemini TTS cho toàn bộ web.

Tìm mọi file */audio/words.txt, tạo <slug>.mp3 cho các từ chưa có audio.
Để tiết kiệm lượt dùng miễn phí, mỗi lần gọi Gemini đọc một nhóm từ,
rồi cắt theo khoảng lặng; nếu cắt không khớp thì đọc lại từng từ.
Chạy tự động bằng GitHub Actions. Muốn tạo lại một từ: xoá file mp3.
"""
import glob, os, re, subprocess, sys, tempfile, time, wave

from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
if not API_KEY:
    sys.exit("Thiếu GEMINI_API_KEY trong Settings → Secrets → Actions.")

VOICE = os.environ.get("TTS_VOICE", "Kore")
BATCH = int(os.environ.get("TTS_BATCH", "12"))
MAX_MIN = int(os.environ.get("TTS_MAX_MINUTES", "300"))
MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts",
          "gemini-2.5-flash-tts", "gemini-2.5-pro-preview-tts"]
ONE = ["Read aloud in a clear, warm, natural British English teacher voice:",
       "Say clearly in British English:"]
MANY = ("Read the following English vocabulary items aloud, one by one, in a clear, warm, "
        "natural British English teacher voice. Say each item exactly once, then pause "
        "silently for two full seconds before the next one. Do not say numbers or any other words.\n\n")

client = genai.Client(api_key=API_KEY)
_made = 0


def checkpoint(force=False):
    """Lưu audio lên repo định kỳ để không mất kết quả nếu lần chạy bị dừng."""
    global _made
    if not force and _made < 30:
        return
    _made = 0
    try:
        subprocess.run(["git", "add", "-A", "*.mp3"], check=True)
        if subprocess.run(["git", "diff", "--cached", "--quiet"]).returncode == 0:
            return
        subprocess.run(["git", "commit", "-q", "-m", "Thêm audio Gemini"], check=True)
        subprocess.run(["git", "pull", "-q", "--rebase"], check=True)
        subprocess.run(["git", "push", "-q"], check=True)
        if os.environ.get("REPO"):
            subprocess.run(["gh", "api", "-X", "POST", f"repos/{os.environ['REPO']}/pages/builds"],
                           capture_output=True)
        print("— đã lưu audio lên repo —")
    except Exception as e:
        print("  không lưu được:", e)
T0 = time.time()


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def voice(name):
    return types.VoiceConfig(prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=name))


def tts(prompt, model, speakers=None):
    if speakers:
        sc = types.SpeechConfig(multi_speaker_voice_config=types.MultiSpeakerVoiceConfig(
            speaker_voice_configs=[types.SpeakerVoiceConfig(speaker=k, voice_config=voice(v))
                                   for k, v in speakers]))
    else:
        sc = types.SpeechConfig(voice_config=voice(VOICE))
    r = client.models.generate_content(
        model=model, contents=prompt,
        config=types.GenerateContentConfig(response_modalities=["AUDIO"], speech_config=sc))
    return b"".join(p.inline_data.data for p in r.candidates[0].content.parts
                    if getattr(p, "inline_data", None))


def write_wav(pcm, path):
    with wave.open(path, "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(24000); f.writeframes(pcm)


def encode(src, out, start=None, end=None):
    cmd = ["ffmpeg", "-y", "-loglevel", "error"]
    if start is not None:
        cmd += ["-ss", f"{start:.3f}", "-to", f"{end:.3f}"]
    trim = "silenceremove=start_periods=1:start_threshold=-45dB"
    cmd += ["-i", src, "-af", f"{trim},areverse,{trim},areverse,loudnorm=I=-16",
            "-ar", "44100", "-b:a", "96k", out]
    subprocess.run(cmd, check=True)


def speech_segments(wav):
    p = subprocess.run(["ffmpeg", "-i", wav, "-af", "silencedetect=noise=-40dB:d=0.6",
                        "-f", "null", "-"], capture_output=True, text=True)
    dur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration",
                                "-of", "csv=p=0", wav], capture_output=True, text=True).stdout)
    starts = [float(x) for x in re.findall(r"silence_start: ([\d.]+)", p.stderr)]
    ends = [float(x) for x in re.findall(r"silence_end: ([\d.]+)", p.stderr)]
    segs, cur = [], 0.0
    for s, e in zip(starts, ends + [dur] * (len(starts) - len(ends))):
        if s - cur > 0.15:
            segs.append((cur, s))
        cur = e
    if dur - cur > 0.15:
        segs.append((cur, dur))
    return [(max(0, a - 0.08), b + 0.08) for a, b in segs]


class OutOfQuota(Exception):
    pass


models = list(MODELS)


def call(prompt, speakers=None):
    """Gọi Gemini, tự đợi khi bị giới hạn theo phút, đổi model khi hết lượt trong ngày."""
    last = ""
    for attempt in range(8):
        if not models:
            raise OutOfQuota()
        m = models[0]
        try:
            return tts(prompt, m, speakers)
        except Exception as e:
            last = str(e)
            print("  …", m, last[:160])
            if "404" in last or "NOT_FOUND" in last or (
                    "429" in last and ("PerDay" in last or "per day" in last.lower())):
                print("  → bỏ model", m); models.pop(0); continue
            time.sleep(65 if "429" in last else 5)
    raise RuntimeError(last)


def one(word, out):
    for k in range(3):
        try:
            with tempfile.TemporaryDirectory() as d:
                w = os.path.join(d, "a.wav"); write_wav(call(f"{ONE[k % 2]} {word}"), w)
                encode(w, out)
            print("✓", out)
            global _made
            _made += 1
            return True
        except OutOfQuota:
            raise
        except Exception as e:
            print("  lỗi", word, str(e)[:120])
    print("✗", word); return False


def batch(items):
    words = [w for w, _ in items]
    with tempfile.TemporaryDirectory() as d:
        w = os.path.join(d, "b.wav")
        write_wav(call(MANY + "\n".join(words)), w)
        segs = speech_segments(w)
        if len(segs) != len(items):
            print(f"  nhóm {len(items)} từ cắt ra {len(segs)} đoạn → đọc từng từ")
            return False
        for (a, b), (word, out) in zip(segs, items):
            encode(w, out, a, b); print("✓", out)
            global _made
            _made += 1
    return True


def do_group(grp):
    """Đọc cả nhóm; nếu cắt không khớp thì chia đôi nhóm (đỡ tốn lượt hơn đọc từng từ)."""
    if len(grp) == 1:
        one(*grp[0]); time.sleep(6); return
    ok = False
    try:
        ok = batch(grp)
    except OutOfQuota:
        raise
    except Exception as e:
        print("  nhóm lỗi:", str(e)[:150])
    if not ok:
        h = len(grp) // 2
        time.sleep(6); do_group(grp[:h]); do_group(grp[h:])


jobs, seen = [], set()
for wl in sorted(glob.glob("**/audio/words.txt", recursive=True)):
    d = os.path.dirname(wl)
    for w in open(wl, encoding="utf-8").read().splitlines():
        w = w.strip()
        out = os.path.join(d, slug(w) + ".mp3")
        if w and out not in seen and not os.path.exists(out):
            seen.add(out); jobs.append((w, out))
listen = [t for t in sorted(glob.glob("audio/listen/*.txt"))
          if not os.path.exists(t[:-4] + ".mp3")]
print(f"Cần tạo {len(jobs)} file audio từ vựng, {len(listen)} bài nghe | giọng {VOICE}")


def do_listen(txt):
    lines = open(txt, encoding="utf-8").read().strip().splitlines()
    speakers = None
    if lines and lines[0].startswith("#speakers:"):
        speakers = [tuple(x.strip().split("=")) for x in lines[0][10:].split(",")]
        lines = lines[1:]
    body = "\n".join(lines)
    if speakers:
        prompt = ("TTS the following conversation between " + " and ".join(k for k, _ in speakers) +
                  ". Speak naturally, at a normal pace, like a real recorded English listening test:\n" + body)
    else:
        prompt = ("Read the following aloud naturally, at a normal pace, like a real recorded "
                  "English listening test (British English):\n" + body)
    with tempfile.TemporaryDirectory() as d:
        w = os.path.join(d, "l.wav"); write_wav(call(prompt, speakers), w)
        subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", w, "-af", "loudnorm=I=-16",
                        "-ar", "44100", "-b:a", "64k", txt[:-4] + ".mp3"], check=True)
    print("✓", txt[:-4] + ".mp3")
    global _made
    _made += 10
    checkpoint()

try:
    for t in listen:
        if time.time() - T0 > MAX_MIN * 60:
            break
        try:
            do_listen(t)
        except OutOfQuota:
            raise
        except Exception as e:
            print("  bài nghe lỗi", t, str(e)[:150])
        time.sleep(8)
    i = 0
    while i < len(jobs):
        if time.time() - T0 > MAX_MIN * 60:
            print("Hết thời gian của lần chạy này, lần sau làm tiếp."); break
        grp = jobs[i:i + BATCH]
        do_group(grp)
        i += len(grp)
        checkpoint()
        time.sleep(8)
except OutOfQuota:
    print("Mọi model đều hết lượt miễn phí hôm nay, lần chạy tự động sau sẽ làm tiếp.")
checkpoint(force=True)
left = sum(1 for _, o in jobs if not os.path.exists(o))
left2 = sum(1 for t in listen if not os.path.exists(t[:-4] + ".mp3"))
print(f"Còn thiếu {left} file từ vựng, {left2} bài nghe.")

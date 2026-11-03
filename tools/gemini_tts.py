"""Tạo audio giọng người thật bằng Gemini TTS cho mọi buổi học.

Với mỗi thư mục buoi-*/audio/ có file words.txt, script tạo <slug>.mp3
cho các từ chưa có audio. Chạy tự động bằng GitHub Actions.
Muốn tạo lại một từ: xoá file mp3 của từ đó.
"""
import glob, os, re, subprocess, sys, time, wave

from google import genai
from google.genai import types

API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
if not API_KEY:
    sys.exit("Thiếu GEMINI_API_KEY trong Settings → Secrets → Actions.")

VOICE = os.environ.get("TTS_VOICE", "Kore")
STYLES = ["Read aloud in a clear, warm, natural British English teacher voice:",
          "Say clearly in British English:"]
MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts",
          "gemini-2.5-flash-tts", "gemini-2.5-pro-preview-tts"]

client = genai.Client(api_key=API_KEY)


def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")


def tts(text, model, style=0):
    r = client.models.generate_content(
        model=model,
        contents=f"{STYLES[style % len(STYLES)]} {text}",
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=VOICE)))))
    return r.candidates[0].content.parts[0].inline_data.data


def to_mp3(pcm, out):
    wav = out[:-4] + ".wav"
    with wave.open(wav, "wb") as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(24000); f.writeframes(pcm)
    trim = "silenceremove=start_periods=1:start_threshold=-45dB"
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav,
                    "-af", f"{trim},areverse,{trim},areverse,loudnorm=I=-16",
                    "-ar", "44100", "-b:a", "96k", out], check=True)
    os.remove(wav)


jobs = []
for wl in sorted(glob.glob("buoi-*/audio/words.txt")):
    d = os.path.dirname(wl)
    for w in open(wl, encoding="utf-8").read().splitlines():
        w = w.strip()
        if w and not os.path.exists(os.path.join(d, slug(w) + ".mp3")):
            jobs.append((w, os.path.join(d, slug(w) + ".mp3")))
print(f"Cần tạo {len(jobs)} file audio")
if not jobs:
    sys.exit(0)

model = None
for m in MODELS:
    try:
        tts("hello", m); model = m; break
    except Exception as e:
        print("Bỏ qua", m, "→", str(e)[:150])
if not model:
    sys.exit("Không model Gemini TTS nào dùng được với API key này.")
print("Dùng model:", model, "| giọng:", VOICE)

fail = 0
for w, out in jobs:
    for attempt in range(8):
        try:
            to_mp3(tts(w, model, attempt), out); print("✓", out); break
        except Exception as e:
            msg = str(e)
            print("…thử lại", w, msg[:150])
            if "429" in msg and ("PerDay" in msg or "per day" in msg.lower()):
                print("Hết lượt miễn phí trong ngày, lần chạy tự động sau sẽ làm tiếp.")
                sys.exit(0)
            time.sleep(65 if "429" in msg else 5)
    else:
        fail += 1; print("✗ Không tạo được", w)
    time.sleep(21)
print(f"Xong. Lỗi: {fail}")

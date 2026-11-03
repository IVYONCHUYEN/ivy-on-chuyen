# ============================================================
#  IVY ÔN CHUYÊN – Tạo audio giọng người thật bằng Gemini TTS
#  Chạy trên Google Colab: dán toàn bộ vào 1 ô rồi bấm ▶
# ============================================================

# 1) Dán API key lấy từ https://aistudio.google.com/apikey vào đây
API_KEY = "DAN_API_KEY_VAO_DAY"

# 2) Giọng đọc (có thể đổi): Kore, Puck, Charon, Aoede, Leda, Orus, Zephyr...
VOICE = "Kore"

# 3) Cách đọc – viết bằng tiếng Anh cho Gemini hiểu
STYLE = ("Say this English word clearly and naturally, like a friendly British "
         "English teacher pronouncing a vocabulary item for students. "
         "Say it only once, no extra words:")

# 4) Danh sách từ của buổi học (Buổi 2 · Technology & innovation)
WORDS = ["cutting-edge", "breakthrough", "artificial intelligence", "automation",
         "obsolete", "user-friendly", "gadget", "innovative", "data breach",
         "cybersecurity", "tech-savvy", "revolutionise", "rely on", "drawback",
         "state-of-the-art"]

# Thử lần lượt các model TTS, dùng cái đầu tiên chạy được
MODELS = ["gemini-3.1-flash-tts-preview", "gemini-2.5-flash-preview-tts",
          "gemini-2.5-flash-tts"]

# ------------------------------------------------------------
import subprocess, sys, os, re, time, wave, shutil
subprocess.run([sys.executable, "-m", "pip", "install", "-q", "-U", "google-genai"])
from google import genai
from google.genai import types

client = genai.Client(api_key=API_KEY)
os.makedirs("audio", exist_ok=True)

def slug(t):
    return re.sub(r"[^a-z0-9]+", "-", t.lower()).strip("-")

def tts(text, model):
    r = client.models.generate_content(
        model=model,
        contents=f"{STYLE} {text}",
        config=types.GenerateContentConfig(
            response_modalities=["AUDIO"],
            speech_config=types.SpeechConfig(
                voice_config=types.VoiceConfig(
                    prebuilt_voice_config=types.PrebuiltVoiceConfig(voice_name=VOICE)))))
    return r.candidates[0].content.parts[0].inline_data.data

model = None
for m in MODELS:
    try:
        tts("hello", m); model = m; break
    except Exception as e:
        print("Không dùng được", m, "→", str(e)[:120])
if not model:
    raise SystemExit("Không model TTS nào chạy được. Kiểm tra lại API key.")
print("Dùng model:", model)

for w in WORDS:
    name = slug(w)
    for lan in range(3):
        try:
            pcm = tts(w, model)
            with wave.open(f"audio/{name}.wav", "wb") as f:
                f.setnchannels(1); f.setsampwidth(2); f.setframerate(24000)
                f.writeframes(pcm)
            subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", f"audio/{name}.wav",
                            "-af", "silenceremove=start_periods=1:start_threshold=-45dB,areverse,"
                                   "silenceremove=start_periods=1:start_threshold=-45dB,areverse",
                            "-b:a", "96k", f"audio/{name}.mp3"], check=True)
            os.remove(f"audio/{name}.wav")
            print("✓", w); break
        except Exception as e:
            print("…thử lại", w, str(e)[:100]); time.sleep(8)
    time.sleep(2)

shutil.make_archive("audio_buoi2", "zip", "audio")
from google.colab import files
files.download("audio_buoi2.zip")
print("Xong! File audio_buoi2.zip đang được tải về máy.")

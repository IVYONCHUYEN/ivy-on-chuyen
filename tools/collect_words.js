// Gom toàn bộ từ vựng trong data/*.js vào audio/words.txt để GitHub tự tạo audio Gemini.
// Chạy: node tools/collect_words.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const words = new Set();
for (const f of fs.readdirSync(path.join(root, "data")).filter(f => /^B\d+\.js$/.test(f)).sort()) {
  const window = {};
  new Function("window", fs.readFileSync(path.join(root, "data", f), "utf8"))(window);
  for (const w of window.LESSON.vocab) words.add(w[0].replace(/\(.*?\)/g, "").replace(/\s*[→/]\s*/g, ", ").replace(/\s+/g, " ").trim());
  for (const sec of window.LESSON.practice) if (sec.audio && sec.script) {
    fs.mkdirSync(path.join(root, "audio", "listen"), { recursive: true });
    const head = sec.speakers ? "#speakers: " + sec.speakers + "\n" : "";
    const f2 = path.join(root, "audio", "listen", sec.audio + ".txt");
    const body = head + sec.script.trim() + "\n";
    if (!fs.existsSync(f2) || fs.readFileSync(f2, "utf8") !== body) fs.writeFileSync(f2, body);
  }
}
fs.mkdirSync(path.join(root, "audio"), { recursive: true });
fs.writeFileSync(path.join(root, "audio", "words.txt"), [...words].join("\n") + "\n");
console.log(words.size + " từ → audio/words.txt");

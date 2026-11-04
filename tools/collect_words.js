// Gom toàn bộ từ vựng trong data/*.js vào audio/words.txt để GitHub tự tạo audio Gemini.
// Chạy: node tools/collect_words.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const words = new Set();
for (const f of fs.readdirSync(path.join(root, "data")).filter(f => /^B\d+\.js$/.test(f)).sort()) {
  const window = {};
  new Function("window", fs.readFileSync(path.join(root, "data", f), "utf8"))(window);
  for (const w of window.LESSON.vocab) words.add(w[0].replace(/\(.*?\)/g, "").replace(/\s+/g, " ").trim());
}
fs.mkdirSync(path.join(root, "audio"), { recursive: true });
fs.writeFileSync(path.join(root, "audio", "words.txt"), [...words].join("\n") + "\n");
console.log(words.size + " từ → audio/words.txt");

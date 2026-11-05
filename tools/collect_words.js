// Gom toàn bộ từ vựng trong data/*.js vào audio/words.txt để GitHub tự tạo audio Gemini.
// Chạy: node tools/collect_words.js
const fs = require("fs"), path = require("path");
const root = path.join(__dirname, "..");
const words = new Set();
const index = {};
for (const f of fs.readdirSync(path.join(root, "data")).filter(f => /^B\d+\.js$/.test(f)).sort()) {
  const window = {};
  new Function("window", fs.readFileSync(path.join(root, "data", f), "utf8"))(window);
  const L = window.LESSON;
  index[L.code] = { t: L.title, p: L.topic || "", w: L.vocab.map(v => v[0] + " — " + v[2]) };
  for (const w of window.LESSON.vocab) words.add(w[0].replace(/\(.*?\)/g, "").replace(/\s*[→/]\s*/g, ", ").replace(/\s+/g, " ").trim());
  for (const sec of window.LESSON.practice) if (sec.audio && sec.script) {
    fs.mkdirSync(path.join(root, "audio", "listen"), { recursive: true });
    const head = sec.speakers ? "#speakers: " + sec.speakers + "\n" : "";
    const f2 = path.join(root, "audio", "listen", sec.audio + ".txt");
    const body = head + sec.script.trim() + "\n";
    if (!fs.existsSync(f2) || fs.readFileSync(f2, "utf8") !== body) fs.writeFileSync(f2, body);
  }
}
for (const [code, dir] of [["B01", "buoi-1"], ["B02", "buoi-2"]]) {
  const html = fs.readFileSync(path.join(root, dir, "index.html"), "utf8");
  const m = html.match(/const (?:WORDS|W)\s*=\s*(\[[\s\S]*?\n\]);/);
  if (m) { const arr = eval(m[1]); index[code] = { t: "", p: "", w: arr.map(v => v[0] + " — " + (code === "B01" ? v[2] : v[2])) }; }
}
fs.writeFileSync(path.join(root, "data", "index.js"), "window.IVY_INDEX=" + JSON.stringify(index) + ";\n");
fs.mkdirSync(path.join(root, "audio"), { recursive: true });
fs.writeFileSync(path.join(root, "audio", "words.txt"), [...words].join("\n") + "\n");
console.log(words.size + " từ → audio/words.txt");

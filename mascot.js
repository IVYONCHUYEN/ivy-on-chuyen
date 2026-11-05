/* IVY GIFTED – nhân vật hướng dẫn “Gifty” (chú cú đỏ) và nền trời.
   Dùng: IVY_MASCOT.svg(pose)  với pose: wave | book | listen | write | idea | timer | cheer
         IVY_MASCOT.sky()      nền trời (SVG, đặt làm lớp nền)
         IVY_MASCOT.poseFor(lesson) chọn tư thế theo nội dung buổi học */
(function(){
const R="#b42323", R2="#8a1717", CREAM="#fde8d0", FACE="#fff7ee", EYE="#2b1b17", BEAK="#f59e0b", LEAF="#22a35a", GOLD="#f4b400";
function base(){return `
 <ellipse cx="100" cy="206" rx="52" ry="7" fill="#000" opacity=".10"/>
 <path d="M58 70 L66 38 L86 60 Z" fill="${R2}"/><path d="M142 70 L134 38 L114 60 Z" fill="${R2}"/>
 <ellipse cx="100" cy="132" rx="62" ry="70" fill="${R}"/>
 <ellipse cx="100" cy="150" rx="40" ry="46" fill="${CREAM}"/>
 <path d="M82 138q6 6 12 0M106 138q6 6 12 0M88 156q6 6 12 0M100 172q6 6 12 0M76 170q6 6 12 0" stroke="#e9b98f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
 <circle cx="77" cy="100" r="25" fill="${FACE}"/><circle cx="123" cy="100" r="25" fill="${FACE}"/>
 <circle cx="79" cy="101" r="14" fill="${EYE}"/><circle cx="121" cy="101" r="14" fill="${EYE}"/>
 <circle cx="84" cy="96" r="5" fill="#fff"/><circle cx="126" cy="96" r="5" fill="#fff"/><circle cx="76" cy="106" r="2" fill="#fff"/><circle cx="118" cy="106" r="2" fill="#fff"/>
 <path d="M93 115 L107 115 L100 127 Z" fill="${BEAK}"/>
 <ellipse cx="62" cy="122" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/><ellipse cx="138" cy="122" rx="8" ry="5" fill="#ff8fa3" opacity=".7"/>
 <path d="M86 197q-6 8 4 8h6q4-4 0-8zM104 197q-4 8 4 8h6q8 0 2-8z" fill="${BEAK}"/>
 <g transform="translate(100 52)"><path d="M-40 0 L0 -18 L40 0 L0 18 Z" fill="#1f2937"/><rect x="-22" y="2" width="44" height="14" rx="4" fill="#111827"/><path d="M0 0 L30 6 L30 24" stroke="${GOLD}" stroke-width="3" fill="none"/><circle cx="30" cy="27" r="5" fill="${GOLD}"/></g>
 <path d="M100 196 q-3 -10 0 -18" stroke="none"/>
 <g transform="translate(100 186) rotate(-20)"><path d="M0 0 C-10 -8 -6 -22 0 -26 C6 -22 10 -8 0 0Z" fill="${LEAF}"/><path d="M0 -2 L0 -22" stroke="#15803d" stroke-width="1.5"/></g>`}
const wingL=`<path d="M42 118 C24 140 28 176 50 186 C58 160 56 136 42 118Z" fill="${R2}"/>`;
const wingR=`<path d="M158 118 C176 140 172 176 150 186 C142 160 144 136 158 118Z" fill="${R2}"/>`;
const wingRup=`<path d="M156 120 C176 104 186 80 180 62 C164 74 150 96 150 118Z" fill="${R2}"/>`;
const wingLup=`<path d="M44 120 C24 104 14 80 20 62 C36 74 50 96 50 118Z" fill="${R2}"/>`;
const sparkle=(x,y,s)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="${GOLD}"/>`;
const P={
 wave:()=>wingL+wingRup+base()+sparkle(182,48,1)+sparkle(30,40,.7),
 book:()=>wingL+wingR+base()+`<g transform="translate(100 168)"><path d="M-46 -20 L0 -12 L0 26 L-46 18Z" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><path d="M46 -20 L0 -12 L0 26 L46 18Z" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><path d="M-38 -10l30 5M-38 -2l30 5M-38 6l30 5M38 -10l-30 5M38 -2l-30 5M38 6l-30 5" stroke="#94a3b8" stroke-width="2"/><path d="M-50 -18 L-46 -20 L-46 18 L0 26 L46 18 L46 -20 L50 -18 L50 22 L0 30 L-50 22Z" fill="#2563eb"/></g><ellipse cx="52" cy="168" rx="11" ry="9" fill="${R2}"/><ellipse cx="148" cy="168" rx="11" ry="9" fill="${R2}"/>`,
 listen:()=>wingL+wingR+base()+`<path d="M50 96 C50 40 150 40 150 96" stroke="#334155" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="38" y="88" width="18" height="30" rx="8" fill="#2563eb"/><rect x="144" y="88" width="18" height="30" rx="8" fill="#2563eb"/><g fill="#2563eb"><path d="M170 70q8 -4 10 4q-6 2 -6 10l-4 -14z"/><circle cx="170" cy="86" r="5"/><path d="M182 104q8 -4 10 4q-6 2 -6 10l-4 -14z"/><circle cx="182" cy="120" r="5"/></g>`,
 write:()=>wingL+wingRup+base()+`<g transform="translate(176 54) rotate(30)"><rect x="-6" y="-4" width="12" height="70" rx="2" fill="${GOLD}"/><rect x="-6" y="-14" width="12" height="12" rx="3" fill="#f472b6"/><path d="M-6 66 L6 66 L0 80Z" fill="#fde68a"/><path d="M-2 74 L2 74 L0 80Z" fill="#111"/></g><rect x="62" y="160" width="76" height="40" rx="4" fill="#fff" stroke="#cbd5e1" stroke-width="2"/><path d="M70 172h50M70 182h40M70 192h56" stroke="#94a3b8" stroke-width="2"/>`,
 idea:()=>wingL+wingRup+base()+`<g transform="translate(178 40)"><circle r="16" fill="#fde047"/><path d="M-8 14h16v8h-16z" fill="#94a3b8"/><path d="M-5 -2l5 8l5 -8" stroke="#ca8a04" stroke-width="2" fill="none"/><path d="M0 -26v-8M-20 -18l-6 -6M20 -18l6 -6M-26 0h-8M26 0h8" stroke="${GOLD}" stroke-width="3" stroke-linecap="round"/></g>`,
 timer:()=>wingL+wingR+base()+`<g transform="translate(100 170)"><circle r="24" fill="#fff" stroke="#334155" stroke-width="5"/><rect x="-5" y="-34" width="10" height="8" rx="2" fill="#334155"/><path d="M0 0 L0 -15 M0 0 L10 6" stroke="${R}" stroke-width="3.5" stroke-linecap="round"/><circle r="3" fill="#334155"/></g><ellipse cx="68" cy="170" rx="11" ry="9" fill="${R2}"/><ellipse cx="132" cy="170" rx="11" ry="9" fill="${R2}"/>`,
 cheer:()=>wingLup+wingRup+base()+`<g transform="translate(100 10)"><path d="M-20 0h40v6c0 16-8 26-20 28c-12-2-20-12-20-28z" fill="${GOLD}"/><path d="M-20 6c-12 0-12 16 2 16M20 6c12 0 12 16-2 16" stroke="${GOLD}" stroke-width="4" fill="none"/><rect x="-5" y="33" width="10" height="8" fill="${GOLD}"/><rect x="-14" y="40" width="28" height="6" rx="2" fill="#b45309"/></g>`+sparkle(40,30,1)+sparkle(165,26,1.1)+sparkle(186,70,.7)+sparkle(18,74,.7)
};
function svg(pose,cls){const f=P[pose]||P.wave;return `<svg class="${cls||"gifty"}" viewBox="-10 -10 220 230" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Gifty – cú hướng dẫn của IVY GIFTED">${f()}</svg>`}
function sky(){
 const petals=[[8,22,-20],[18,64,30],[30,12,10],[44,80,-35],[58,28,25],[66,70,-15],[74,16,40],[82,52,-30],[90,30,15],[95,78,-25],[38,46,20],[52,58,-10],[12,40,35],[86,86,10]];
 return `<svg class="ivy-sky" viewBox="0 0 1000 400" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
 <defs><linearGradient id="skyg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fc3f4"/><stop offset=".55" stop-color="#d9e6fb"/><stop offset="1" stop-color="#f6e3f1"/></linearGradient>
 <radialGradient id="sun" cx=".62" cy=".42" r=".5"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
 <filter id="blur"><feGaussianBlur stdDeviation="10"/></filter><filter id="blur2"><feGaussianBlur stdDeviation="2"/></filter></defs>
 <rect width="1000" height="400" fill="url(#skyg)"/><rect width="1000" height="400" fill="url(#sun)"/>
 <g fill="#fff" opacity=".85" filter="url(#blur)"><ellipse cx="560" cy="300" rx="260" ry="60"/><ellipse cx="820" cy="250" rx="200" ry="50"/><ellipse cx="300" cy="120" rx="160" ry="34"/><ellipse cx="700" cy="90" rx="140" ry="28"/></g>
 <g opacity=".55" filter="url(#blur2)"><g fill="#d8d4f3"><rect x="40" y="120" width="46" height="280"/><rect x="100" y="70" width="40" height="330"/><rect x="150" y="150" width="60" height="250"/><rect x="0" y="210" width="40" height="190"/></g>
 <g fill="#f0a5b8"><path d="M36 122 L63 60 L90 122Z"/><path d="M96 72 L120 6 L144 72Z"/><path d="M146 152 L180 96 L214 152Z"/></g>
 <g fill="#b9b3e6"><rect x="58" y="160" width="10" height="16" rx="5"/><rect x="114" y="110" width="10" height="16" rx="5"/><rect x="172" y="190" width="12" height="18" rx="6"/></g></g>
 <g fill="#f4a7bf" opacity=".75"><ellipse cx="940" cy="40" rx="110" ry="60" filter="url(#blur)"/><ellipse cx="880" cy="0" rx="120" ry="50" filter="url(#blur)"/></g>
 <g fill="#f7a8c0">${petals.map(p=>`<ellipse cx="${p[0]*10}" cy="${p[1]*4}" rx="7" ry="3.5" transform="rotate(${p[2]} ${p[0]*10} ${p[1]*4})" opacity=".85"/>`).join("")}</g>
 <g fill="#fff" opacity=".7"><circle cx="760" cy="150" r="4"/><circle cx="420" cy="60" r="3"/><circle cx="880" cy="320" r="3"/><circle cx="240" cy="330" r="2.5"/></g>
 </svg>`}
function poseFor(L){
 const t=((L.title||"")+" "+(L.theoryTitle||"")).toLowerCase();
 if((L.practice||[]).some(s=>s.audio)||/listening|nghe/.test(t)) return "listen";
 if(/chữa|mock|đề |đề$|sprint|bấm giờ|150 phút/.test(t)) return "timer";
 if(/ôn giai đoạn|tổng kết|làm lại|chiến lược/.test(t)) return "cheer";
 if(/bài luận|viết|writing/.test(t)) return "write";
 if(/đọc|reading|tiêu đề|điền câu/.test(t)) return "book";
 if(/từ vựng|idiom|phrasal|collocation|cấu tạo từ|giới từ|lexico/.test(t)) return "book";
 return "idea";
}
const LINES={wave:"Chào em! Mình là Gifty, cùng học nhé!",book:"Mở sách ra nào! Mình đọc và học từ cùng nhau nhé.",listen:"Đeo tai nghe lên nhé – nghe 2 lần như phòng thi!",write:"Cầm bút lên! Viết thật cẩn thận, soát lỗi cuối bài nhé.",idea:"Mẹo hay đây! Đọc lý thuyết rồi làm ngay bài tập nhé.",timer:"Bấm giờ thôi! Làm như thi thật, rồi chữa thật kỹ.",cheer:"Em làm tốt lắm! Ôn lại một vòng là chắc điểm."};
window.IVY_MASCOT={svg,sky,poseFor,line:p=>LINES[p]||LINES.wave};
})();

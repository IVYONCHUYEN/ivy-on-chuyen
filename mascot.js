/* IVY GIFTED – nhân vật hướng dẫn “Violet” (cô bạn tóc tím, cầm sách/đũa phép) và nền trời.
   Dùng: IVY_MASCOT.svg(pose)  với pose: wave | book | listen | write | idea | timer | cheer
         IVY_MASCOT.sky()      nền trời (SVG, đặt làm lớp nền)
         IVY_MASCOT.poseFor(lesson) chọn tư thế theo nội dung buổi học */
(function(){
const R="#b42323", R2="#8a1717", GOLD="#f4b400", LEAF="#22a35a";
const SKIN="#ffe4d6", HAIR="#8b5cf6", HAIR2="#6d28d9", HAIRL="#c4b5fd", IRIS="#6d28d9", DARK="#3b0764";
const hairBack=`<path d="M48 92 C36 30 184 30 172 92 L176 150 C182 176 170 196 152 198 C160 182 152 170 146 166 L74 166 C68 170 60 182 68 198 C50 196 38 176 44 150 Z" fill="${HAIR2}"/>
 <path d="M44 150 C38 172 46 190 60 198 C54 186 54 172 58 162Z M176 150 C182 172 174 190 160 198 C166 186 166 172 162 162Z" fill="${HAIR}"/>`;
const body=`<path d="M80 140 L140 140 L158 192 L62 192Z" fill="${R}"/>
 <path d="M80 140 L62 192 L76 192 L92 146Z M140 140 L158 192 L144 192 L128 146Z" fill="${R2}"/>
 <path d="M92 138 L110 158 L128 138Z" fill="#fff"/>
 <path d="M102 156 L110 162 L118 156 L114 168 L110 164 L106 168Z" fill="${GOLD}"/>
 <path d="M66 188 L154 188 L166 214 L54 214Z" fill="#ede4ff"/><path d="M60 206 L160 206" stroke="#c4b5fd" stroke-width="3"/>
 <rect x="93" y="212" width="12" height="16" rx="4" fill="#fff"/><rect x="115" y="212" width="12" height="16" rx="4" fill="#fff"/>
 <ellipse cx="98" cy="229" rx="10" ry="5" fill="${DARK}"/><ellipse cx="122" cy="229" rx="10" ry="5" fill="${DARK}"/>`;
const head=`<ellipse cx="110" cy="98" rx="52" ry="48" fill="${SKIN}"/>
 <ellipse cx="90" cy="102" rx="13" ry="15" fill="#fff"/><ellipse cx="130" cy="102" rx="13" ry="15" fill="#fff"/>
 <ellipse cx="91" cy="104" rx="10" ry="12.5" fill="${IRIS}"/><ellipse cx="129" cy="104" rx="10" ry="12.5" fill="${IRIS}"/>
 <ellipse cx="91" cy="106" rx="5" ry="6.5" fill="${DARK}"/><ellipse cx="129" cy="106" rx="5" ry="6.5" fill="${DARK}"/>
 <circle cx="95" cy="99" r="4" fill="#fff"/><circle cx="133" cy="99" r="4" fill="#fff"/><circle cx="87" cy="110" r="2" fill="#fff"/><circle cx="125" cy="110" r="2" fill="#fff"/>
 <path d="M76 92 Q90 82 104 90 M116 90 Q130 82 144 92" stroke="${DARK}" stroke-width="3" fill="none" stroke-linecap="round"/>
 <ellipse cx="76" cy="122" rx="9" ry="5" fill="#ff8fab" opacity=".55"/><ellipse cx="144" cy="122" rx="9" ry="5" fill="#ff8fab" opacity=".55"/>
 <path d="M103 124 Q110 133 117 124 Z" fill="#c2185b"/><path d="M106 128 Q110 131 114 128" stroke="#ff8fab" stroke-width="2" fill="none"/>`;
const hairFront=`<path d="M54 98 C48 40 172 40 166 98 C160 78 150 70 138 72 C134 60 122 58 112 66 C104 56 90 58 84 68 C72 66 60 76 54 98Z" fill="${HAIR}"/>
 <path d="M54 98 C50 112 52 132 60 146 C58 128 60 112 64 100Z M166 98 C170 112 168 132 160 146 C162 128 160 112 156 100Z" fill="${HAIR}"/>
 <path d="M76 56 C90 44 112 42 128 48" stroke="${HAIRL}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>
 <g transform="translate(150 62) rotate(35)"><path d="M0 0 C-11 -8 -7 -24 0 -28 C7 -24 11 -8 0 0Z" fill="${LEAF}"/><path d="M0 -3 L0 -24" stroke="#15803d" stroke-width="1.6"/></g>
 <circle cx="140" cy="60" r="3.5" fill="${GOLD}"/>`;
const shadow=`<ellipse cx="110" cy="232" rx="56" ry="7" fill="#000" opacity=".10"/>`;
const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="7.5" fill="${SKIN}"/>`;
const arm=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${R}" stroke-width="15" stroke-linecap="round"/>`+hand(x2,y2);
const armDownL=arm(80,150,70,184), armDownR=arm(140,150,150,184);
const sparkle=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="${c||GOLD}"/>`;
const wand=(x,y,ang)=>`<g transform="translate(${x} ${y}) rotate(${ang})"><rect x="-3" y="-58" width="6" height="60" rx="3" fill="#7c3a1a"/><rect x="-3.5" y="-20" width="7" height="8" rx="2" fill="${GOLD}"/><path transform="translate(0 -66) scale(1.5)" d="M0 -10 L3 -3 L10 -2 L5 3 L6 10 L0 6 L-6 10 L-5 3 L-10 -2 L-3 -3Z" fill="${GOLD}" stroke="#fff" stroke-width="1"/></g>`;
const book=`<g transform="translate(110 178)"><path d="M-46 -18 L0 -10 L0 26 L-46 18Z" fill="#fff" stroke="#ddd6fe" stroke-width="2"/><path d="M46 -18 L0 -10 L0 26 L46 18Z" fill="#fff" stroke="#ddd6fe" stroke-width="2"/><path d="M-38 -8l30 5M-38 0l30 5M-38 8l30 5M38 -8l-30 5M38 0l-30 5M38 8l-30 5" stroke="#a78bfa" stroke-width="2"/><path d="M-50 -16 L-46 -18 L-46 18 L0 26 L46 18 L46 -18 L50 -16 L50 22 L0 30 L-50 22Z" fill="${HAIR2}"/></g>`;
const base=(arms,front,back)=>shadow+hairBack+(back||"")+body+arms+head+hairFront+(front||"");
const P={
 wave:()=>base(armDownL+arm(140,150,176,112),wand(178,108,18)+sparkle(204,40,.9)+sparkle(30,46,.7,"#f9a8d4")),
 idea:()=>base(armDownL+arm(140,150,178,106),wand(180,102,8)+sparkle(196,22,1.1)+sparkle(214,52,.7,"#f9a8d4")+sparkle(170,14,.6,"#c4b5fd")+`<path d="M184 30 q14 -6 22 4" stroke="#fde68a" stroke-width="3" fill="none" stroke-dasharray="3 5"/>`),
 book:()=>base(arm(80,150,66,178)+arm(140,150,154,178),book+hand(64,178)+hand(156,178)),
 listen:()=>base(armDownL+armDownR,`<path d="M52 100 C50 34 170 34 168 100" stroke="#334155" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="40" y="92" width="18" height="30" rx="8" fill="${R}"/><rect x="162" y="92" width="18" height="30" rx="8" fill="${R}"/><g fill="${HAIR2}"><path d="M188 64q8 -4 10 4q-6 2 -6 10l-4 -14z"/><circle cx="188" cy="80" r="5"/><path d="M198 100q8 -4 10 4q-6 2 -6 10l-4 -14z"/><circle cx="198" cy="116" r="5"/></g>`),
 write:()=>base(arm(80,150,72,178)+arm(140,150,176,118),`<g transform="translate(178 112) rotate(25)"><rect x="-5" y="-58" width="10" height="58" rx="2" fill="${GOLD}"/><rect x="-5" y="-68" width="10" height="11" rx="3" fill="#f472b6"/><path d="M-5 0 L5 0 L0 12Z" fill="#fde68a"/><path d="M-2 7 L2 7 L0 12Z" fill="#111"/></g><rect x="44" y="160" width="46" height="52" rx="4" fill="#fff" stroke="#ddd6fe" stroke-width="2"/><path d="M52 172h30M52 182h26M52 192h30M52 202h20" stroke="#a78bfa" stroke-width="2"/>`+hand(72,178)),
 timer:()=>base(arm(80,150,92,176)+arm(140,150,128,176),`<g transform="translate(110 178)"><circle r="22" fill="#fff" stroke="#334155" stroke-width="5"/><rect x="-5" y="-31" width="10" height="7" rx="2" fill="#334155"/><path d="M0 0 L0 -13 M0 0 L9 5" stroke="${R}" stroke-width="3.5" stroke-linecap="round"/><circle r="3" fill="#334155"/></g>`+hand(90,178)+hand(130,178)),
 cheer:()=>base(arm(80,150,44,112)+arm(140,150,176,112),`<g transform="translate(184 92)"><path d="M-16 0h32v5c0 13-6 21-16 23c-10-2-16-10-16-23z" fill="${GOLD}"/><path d="M-16 5c-10 0-10 13 2 13M16 5c10 0 10 13-2 13" stroke="${GOLD}" stroke-width="3.5" fill="none"/><rect x="-4" y="27" width="8" height="7" fill="${GOLD}"/><rect x="-11" y="33" width="22" height="5" rx="2" fill="#b45309"/></g>`+sparkle(40,90,1,"#f9a8d4")+sparkle(206,60,1)+sparkle(30,60,.6)+sparkle(160,70,.6,"#c4b5fd"))
};
function svg(pose,cls){const f=P[pose]||P.wave;return `<svg class="${cls||"gifty"}" viewBox="0 0 230 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Violet – cô bạn hướng dẫn của IVY GIFTED">${f()}</svg>`}
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
const LINES={wave:"Chào em! Mình là Violet, cùng học nhé!",book:"Mở sách ra nào! Mình đọc và học từ cùng nhau nhé.",listen:"Đeo tai nghe lên nhé – nghe 2 lần như phòng thi!",write:"Cầm bút lên! Viết thật cẩn thận, soát lỗi cuối bài nhé.",idea:"Phép thuật ngữ pháp đây! Đọc lý thuyết rồi làm bài ngay nhé.",timer:"Bấm giờ thôi! Làm như thi thật, rồi chữa thật kỹ.",cheer:"Em làm tốt lắm! Ôn lại một vòng là chắc điểm."};
window.IVY_MASCOT={svg,sky,poseFor,line:p=>LINES[p]||LINES.wave};
})();

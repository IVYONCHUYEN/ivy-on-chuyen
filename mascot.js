/* IVY GIFTED – nhân vật hướng dẫn “Violet” (cô bạn tóc tím, cầm sách/đũa phép) và nền trời.
   Dùng: IVY_MASCOT.svg(pose)  với pose: wave | book | listen | write | idea | timer | cheer
         IVY_MASCOT.sky()      nền trời (SVG, đặt làm lớp nền)
         IVY_MASCOT.poseFor(lesson) chọn tư thế theo nội dung buổi học */
(function(){
const R="#b42323", R2="#8a1717", GOLD="#f4b400", LEAF="#22a35a";
const SKIN="#ffe4d6", HAIR="#8b5cf6", HAIR2="#6d28d9", HAIRL="#c4b5fd", IRIS="#6d28d9", DARK="#3b0764";
let UID=0;
const hairBack=(u)=>`<path d="M46 100 C34 34 186 34 174 100 C178 124 176 146 182 166 C188 184 178 200 162 202 C170 190 166 178 156 172 C160 186 152 196 140 196 C146 186 144 176 138 170 L82 170 C76 176 74 186 80 196 C68 196 60 186 64 172 C54 178 50 190 58 202 C42 200 32 184 38 166 C44 146 42 124 46 100Z" fill="url(#hg${u})" stroke="#4c1d95" stroke-width="2" stroke-linejoin="round"/>`;
const defs=(u)=>`<defs>
 <linearGradient id="hg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a78bfa"/><stop offset=".55" stop-color="#7c3aed"/><stop offset="1" stop-color="#5b21b6"/></linearGradient>
 <linearGradient id="ir${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b0764"/><stop offset=".45" stop-color="#6d28d9"/><stop offset="1" stop-color="#c4b5fd"/></linearGradient>
 <radialGradient id="ck${u}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff8fab" stop-opacity=".75"/><stop offset="1" stop-color="#ff8fab" stop-opacity="0"/></radialGradient>
 </defs>`;
const eye=(x,u,flip)=>{const f=flip?-1:1;return `<g transform="translate(${x} 110)">
 <ellipse rx="15" ry="18" fill="#fff"/>
 <ellipse cy="1" rx="13" ry="16.5" fill="url(#ir${u})"/>
 <ellipse cy="3" rx="7" ry="9" fill="#2e1065"/>
 <ellipse cy="10" rx="9" ry="4" fill="#ddd6fe" opacity=".55"/>
 <circle cx="${5*f}" cy="-7" r="5.5" fill="#fff"/><circle cx="${-6*f}" cy="8" r="2.6" fill="#fff"/>
 <path transform="translate(${-5*f} -2) scale(.45)" d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5Z" fill="#fff"/>
 <path d="M${-17*f} -6 C${-12*f} -21 ${12*f} -23 ${17*f} -10 L${21*f} -14" stroke="#2e1065" stroke-width="4.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M${15*f} -9 L${20*f} -5" stroke="#2e1065" stroke-width="2.6" stroke-linecap="round"/>
 <path d="M${-9*f} 18 Q0 21 ${9*f} 18" stroke="#6d28d9" stroke-width="1.6" fill="none" stroke-linecap="round" opacity=".7"/>
</g>`};
const head=(u)=>`<path d="M54 98 C54 58 166 58 166 98 C166 130 142 150 110 150 C78 150 54 130 54 98Z" fill="${SKIN}" stroke="#e7b49d" stroke-width="1.6"/>
 <ellipse cx="76" cy="128" rx="14" ry="9" fill="url(#ck${u})"/><ellipse cx="144" cy="128" rx="14" ry="9" fill="url(#ck${u})"/>
 <path d="M70 128l3 -4M76 129l3 -4M82 128l3 -4M138 128l3 -4M144 129l3 -4M150 128l3 -4" stroke="#f472b6" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>
 ${eye(87,u,true)}${eye(133,u,false)}
 <path d="M109 125 q1 1.5 2 0" stroke="#d99a83" stroke-width="1.6" fill="none" stroke-linecap="round"/>
 <path d="M101 133 q4.5 5 9 0 q4.5 5 9 0" stroke="#9f1239" stroke-width="2.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 <path d="M106 135.5 q4 4 8 0" fill="#fb7185" opacity=".8"/>`;
const hairFront=(u)=>`<path d="M50 108 C44 56 80 36 110 36 C140 36 176 56 170 108 C166 96 160 86 154 80 L151 92 C147 84 141 76 134 72 L131 86 C127 78 121 72 114 68 L112 84 C108 76 102 70 96 68 L92 84 C88 76 84 72 78 72 L73 90 C69 84 63 84 58 86 Z" fill="url(#hg${u})" stroke="#4c1d95" stroke-width="2" stroke-linejoin="round"/>
 <path d="M50 104 C44 124 48 146 58 160 C60 150 58 132 64 118 C62 112 58 108 50 104Z" fill="url(#hg${u})" stroke="#4c1d95" stroke-width="2" stroke-linejoin="round"/>
 <path d="M170 104 C176 124 172 146 162 160 C160 150 162 132 156 118 C158 112 162 108 170 104Z" fill="url(#hg${u})" stroke="#4c1d95" stroke-width="2" stroke-linejoin="round"/>
 <path d="M72 58 C86 46 104 42 120 44" stroke="#ede9fe" stroke-width="5" fill="none" stroke-linecap="round" opacity=".75"/>
 <path d="M128 46 l6 2 M138 50 l5 3" stroke="#ede9fe" stroke-width="4" stroke-linecap="round" opacity=".75"/>
 <path d="M84 56 C86 64 88 70 92 76 M118 50 C120 58 122 64 126 70 M146 62 C148 68 150 72 152 78" stroke="#5b21b6" stroke-width="1.4" fill="none" opacity=".5"/>
 <path d="M110 38 C108 22 124 14 132 22 C126 22 118 26 116 38" fill="url(#hg${u})" stroke="#4c1d95" stroke-width="2" stroke-linejoin="round"/>
 <g transform="translate(156 66) rotate(38)"><path d="M0 0 C-12 -9 -8 -26 0 -30 C8 -26 12 -9 0 0Z" fill="${LEAF}" stroke="#14532d" stroke-width="1.4"/><path d="M0 -3 L0 -26 M0 -12 l-5 -5 M0 -18 l5 -5" stroke="#14532d" stroke-width="1.3"/></g>
 <path transform="translate(66 70) rotate(-15) scale(.9)" d="M0 -10 L3 -3 L10 -2 L5 3 L6 10 L0 6 L-6 10 L-5 3 L-10 -2 L-3 -3Z" fill="${GOLD}" stroke="#b45309" stroke-width="1"/>`;
const body=`<path d="M80 140 L140 140 L158 192 L62 192Z" fill="${R}"/>
 <path d="M80 140 L62 192 L76 192 L92 146Z M140 140 L158 192 L144 192 L128 146Z" fill="${R2}"/>
 <path d="M92 138 L110 158 L128 138Z" fill="#fff"/>
 <path d="M102 156 L110 162 L118 156 L114 168 L110 164 L106 168Z" fill="${GOLD}"/>
 <path d="M66 188 L154 188 L166 214 L54 214Z" fill="#ede4ff"/><path d="M60 206 L160 206" stroke="#c4b5fd" stroke-width="3"/>
 <rect x="93" y="212" width="12" height="16" rx="4" fill="#fff"/><rect x="115" y="212" width="12" height="16" rx="4" fill="#fff"/>
 <ellipse cx="98" cy="229" rx="10" ry="5" fill="${DARK}"/><ellipse cx="122" cy="229" rx="10" ry="5" fill="${DARK}"/>`;
const shadow=`<ellipse cx="110" cy="232" rx="56" ry="7" fill="#000" opacity=".10"/>`;
const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="7.5" fill="${SKIN}"/>`;
const arm=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${R}" stroke-width="15" stroke-linecap="round"/>`+hand(x2,y2);
const armDownL=arm(80,150,70,184), armDownR=arm(140,150,150,184);
const sparkle=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="${c||GOLD}"/>`;
const wand=(x,y,ang)=>`<g transform="translate(${x} ${y}) rotate(${ang})"><rect x="-3" y="-58" width="6" height="60" rx="3" fill="#7c3a1a"/><rect x="-3.5" y="-20" width="7" height="8" rx="2" fill="${GOLD}"/><path transform="translate(0 -66) scale(1.5)" d="M0 -10 L3 -3 L10 -2 L5 3 L6 10 L0 6 L-6 10 L-5 3 L-10 -2 L-3 -3Z" fill="${GOLD}" stroke="#fff" stroke-width="1"/></g>`;
const book=`<g transform="translate(110 178)"><path d="M-46 -18 L0 -10 L0 26 L-46 18Z" fill="#fff" stroke="#ddd6fe" stroke-width="2"/><path d="M46 -18 L0 -10 L0 26 L46 18Z" fill="#fff" stroke="#ddd6fe" stroke-width="2"/><path d="M-38 -8l30 5M-38 0l30 5M-38 8l30 5M38 -8l-30 5M38 0l-30 5M38 8l-30 5" stroke="#a78bfa" stroke-width="2"/><path d="M-50 -16 L-46 -18 L-46 18 L0 26 L46 18 L46 -18 L50 -16 L50 22 L0 30 L-50 22Z" fill="${HAIR2}"/></g>`;
const base=(arms,front,back)=>{const u=++UID;return defs(u)+shadow+hairBack(u)+(back||"")+body+arms+head(u)+hairFront(u)+(front||"")};
const P={
 wave:()=>base(armDownL+arm(140,150,176,112),wand(178,108,18)+sparkle(204,40,.9)+sparkle(30,46,.7,"#f9a8d4")),
 idea:()=>base(armDownL+arm(140,150,178,106),wand(180,102,8)+sparkle(196,22,1.1)+sparkle(214,52,.7,"#f9a8d4")+sparkle(170,14,.6,"#c4b5fd")+`<path d="M184 30 q14 -6 22 4" stroke="#fde68a" stroke-width="3" fill="none" stroke-dasharray="3 5"/>`),
 book:()=>base(arm(80,150,66,178)+arm(140,150,154,178),book+hand(64,178)+hand(156,178)),
 listen:()=>base(armDownL+armDownR,`<path d="M46 106 C44 26 176 26 174 106" stroke="#334155" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="34" y="98" width="20" height="32" rx="9" fill="${R}" stroke="#7f1d1d" stroke-width="2"/><rect x="166" y="98" width="20" height="32" rx="9" fill="${R}" stroke="#7f1d1d" stroke-width="2"/><g fill="${HAIR2}"><path d="M188 64q8 -4 10 4q-6 2 -6 10l-4 -14z"/><circle cx="188" cy="80" r="5"/><path d="M198 100q8 -4 10 4q-6 2 -6 10l-4 -14z"/><circle cx="198" cy="116" r="5"/></g>`),
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

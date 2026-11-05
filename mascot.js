/* IVY GIFTED – nhân vật hướng dẫn “Violet” (cô bạn tóc đỏ IVY, ôm gấu trúc đỏ, cầm sách/đũa phép) và nền trời.
   Dùng: IVY_MASCOT.svg(pose)  với pose: wave | book | listen | write | idea | timer | cheer
         IVY_MASCOT.sky()      nền trời (SVG, đặt làm lớp nền)
         IVY_MASCOT.poseFor(lesson) chọn tư thế theo nội dung buổi học */
(function(){
const GOLD="#f6b93b", LEAF="#3fb36b";
const SKIN="#fff1ea", SKINL="#ebb9a6", HL="#8f78d9", RED="#e0525b", REDD="#c43d47";
let UID=0;
const defs=u=>`<defs>
 <linearGradient id="hg${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f08585"/><stop offset=".5" stop-color="#d84848"/><stop offset="1" stop-color="#b42323"/></linearGradient>
 <linearGradient id="ir${u}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4b2f73"/><stop offset=".55" stop-color="#7b55b3"/><stop offset="1" stop-color="#c9a8ec"/></linearGradient>
 <radialGradient id="ck${u}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ff9fb8" stop-opacity=".8"/><stop offset="1" stop-color="#ff9fb8" stop-opacity="0"/></radialGradient>
</defs>`;
const L=`stroke="#a52a2a" stroke-width="1.8" stroke-linejoin="round"`;
/* tóc phía sau: bồng, xoăn sóng, đuôi tóc lượn */
const hairBack=u=>`<path d="M115 30 C60 30 34 66 40 106 C32 120 28 136 34 150 C26 160 32 174 46 176 C52 186 66 184 70 174 C74 180 82 180 86 172 L144 172 C148 180 156 180 160 174 C164 184 178 186 184 176 C198 174 204 160 196 150 C202 136 198 120 190 106 C196 66 170 30 115 30Z" fill="url(#hg${u})" ${L}/>
 <path d="M46 132 C40 146 44 160 52 168 M184 132 C190 146 186 160 178 168 M62 118 C56 132 58 146 66 156 M168 118 C174 132 172 146 164 156" stroke="#ffc9c9" stroke-width="3" fill="none" stroke-linecap="round" opacity=".7"/>`;
/* thân: áo blouse trắng tay phồng + yếm đỏ + váy xoè viền bèo */
const body=`<path d="M86 150 C86 146 144 146 144 150 L150 192 L80 192Z" fill="#fff" stroke="${SKINL}" stroke-width="1.5"/>
 <path d="M92 156 L138 156 L146 194 L84 194Z" fill="#fff6ec" stroke="#e7c9b3" stroke-width="1.5" stroke-linejoin="round"/>
 <path d="M100 148 L115 162 L130 148" fill="#fff" stroke="${SKINL}" stroke-width="1.5" stroke-linejoin="round"/>
 <path d="M106 160 C100 154 100 168 106 164 L115 162 L124 164 C130 168 130 154 124 160 L115 162Z" fill="${RED}" stroke="${REDD}" stroke-width="1"/><path d="M70 210 C100 216 130 216 160 210" stroke="${RED}" stroke-width="3" fill="none"/>
 <path d="M80 190 C70 206 66 214 64 220 C78 226 152 226 166 220 C164 214 160 206 150 190Z" fill="#fff6ec" stroke="#e7c9b3" stroke-width="1.5" stroke-linejoin="round"/>
 <path d="M64 220 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 12 0 q6 7 12 0 q4 6 10 0" fill="#fff" stroke="#e7c9b3" stroke-width="1.4"/>
 <path d="M100 222 v12 M130 222 v12" stroke="${SKIN}" stroke-width="13" stroke-linecap="round"/><path d="M100 222 v12 M130 222 v12" stroke="${SKINL}" stroke-width="1" opacity="0"/>
 <ellipse cx="99" cy="238" rx="9" ry="5" fill="${RED}" stroke="${REDD}" stroke-width="1.4"/><ellipse cx="131" cy="238" rx="9" ry="5" fill="${RED}" stroke="${REDD}" stroke-width="1.4"/>
 <circle cx="84" cy="156" r="12" fill="#fff" stroke="${SKINL}" stroke-width="1.5"/><circle cx="146" cy="156" r="12" fill="#fff" stroke="${SKINL}" stroke-width="1.5"/>`;
const shadow=`<ellipse cx="115" cy="242" rx="58" ry="6" fill="#6b4fb8" opacity=".12"/>`;
const eye=(x,u,outer)=>{const o=outer;return `<g transform="translate(${x} 116)">
 <ellipse rx="14" ry="15.5" fill="#fff"/>
 <ellipse cy="1.5" rx="12.5" ry="14" fill="url(#ir${u})"/>
 <ellipse cy="3" rx="6" ry="7" fill="#3a2258"/>
 <circle cx="${-4*o}" cy="-5" r="5" fill="#fff"/><circle cx="${5*o}" cy="7" r="2.4" fill="#fff"/><circle cx="${-1*o}" cy="9" r="1.2" fill="#fff" opacity=".8"/>
 <path d="M${-15*o} -3 C${-10*o} -16 ${10*o} -17 ${15*o} -6" stroke="#4a2f6b" stroke-width="3.6" fill="none" stroke-linecap="round"/>
 <path d="M${14*o} -6 l${5*o} -3 M${15*o} -3 l${5*o} 0 M${13*o} -9 l${3*o} -5" stroke="#4a2f6b" stroke-width="1.8" stroke-linecap="round"/>
 <path d="M${-8*o} 16 q${8*o} 3 ${16*o} -2" stroke="#b07a8e" stroke-width="1.2" fill="none" stroke-linecap="round"/>
</g>`};
const eyeHappy=(x,o)=>`<g transform="translate(${x} 118)"><path d="M-13 3 Q0 -12 13 3" stroke="#4a2f6b" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M${13*o} 3 l${5*o} -2 M${12*o} 0 l${5*o} -4" stroke="#4a2f6b" stroke-width="1.8" stroke-linecap="round"/></g>`;
const eyeX=(x,o)=>`<g transform="translate(${x} 116)"><path d="M${-11*o} -9 L${9*o} 0 L${-11*o} 9" stroke="#4a2f6b" stroke-width="3.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
const eyeFocus=(x,u,o)=>eye(x,u,o)+`<g transform="translate(${x} 116)"><path d="M-17 -19 L17 -19 L17 -2 C8 -7 -8 -7 -17 -2Z" fill="${SKIN}"/><path d="M${-15*o} -2 C${-8*o} -8 ${8*o} -8 ${15*o} -3 l${4*o} -2" stroke="#4a2f6b" stroke-width="3.4" fill="none" stroke-linecap="round"/></g>`;
const eyeSpark=(x,u,o)=>eye(x,u,o)+`<path transform="translate(${x+3} 118) scale(.8)" d="M0 -10 L2.5 -2.5 L10 0 L2.5 2.5 L0 10 L-2.5 2.5 L-10 0 L-2.5 -2.5Z" fill="#fff"/>`;
const MOUTH={
 w:`<path d="M109 140 q3 3 6 0 q3 3 6 0" stroke="#c0566e" stroke-width="1.8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
 open:`<path d="M107 138 Q115 149 123 138Z" fill="#c0566e" stroke="#a8435a" stroke-width="1.2" stroke-linejoin="round"/><path d="M110 143 q5 4 10 0" fill="#ff9fb3"/>`,
 big:`<path d="M105 136 Q115 152 125 136Z" fill="#c0566e" stroke="#a8435a" stroke-width="1.2" stroke-linejoin="round"/><path d="M109 144 q6 5 12 0" fill="#ff9fb3"/>`,
 o:`<ellipse cx="115" cy="142" rx="4" ry="5" fill="#c0566e" stroke="#a8435a" stroke-width="1.2"/>`,
 calm:`<path d="M110 140 q5 4 10 0" stroke="#c0566e" stroke-width="2" fill="none" stroke-linecap="round"/>`,
 smug:`<path d="M109 140 q6 5 12 -1" stroke="#c0566e" stroke-width="2" fill="none" stroke-linecap="round"/><path d="M118 141 q2 3 4 0" fill="#ff9fb3"/>`
};
const BROW={
 n:`<path d="M106 100 q-5 -3 -11 -2 M124 100 q5 -3 11 -2" stroke="#c46a6a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
 up:`<path d="M106 96 q-5 -4 -11 -2 M124 96 q5 -4 11 -2" stroke="#c46a6a" stroke-width="1.6" fill="none" stroke-linecap="round"/>`,
 firm:`<path d="M105 101 l-11 -3 M125 101 l11 -3" stroke="#c46a6a" stroke-width="1.8" fill="none" stroke-linecap="round"/>`
};
const FACES={
 smile:u=>BROW.n+eye(92,u,-1)+eye(138,u,1)+MOUTH.w,
 happy:u=>BROW.up+eyeHappy(92,-1)+eyeHappy(138,1)+MOUTH.open,
 wink:u=>BROW.n+eye(92,u,-1)+eyeHappy(138,1)+MOUTH.smug,
 focus:u=>BROW.firm+eyeFocus(92,u,-1)+eyeFocus(138,u,1)+MOUTH.calm,
 surprised:u=>BROW.up+eye(92,u,-1)+eye(138,u,1)+MOUTH.o+`<path d="M168 92 q5 6 0 10 q-4 -4 0 -10Z" fill="#9fd3ff"/>`,
 excited:u=>BROW.up+eyeX(92,-1)+eyeX(138,1)+MOUTH.big,
 starry:u=>BROW.up+eyeSpark(92,u,-1)+eyeSpark(138,u,1)+MOUTH.open
};
/* đầu: mặt tròn má phúng phính, tai nhỏ; biểu cảm thay đổi */
const head=(u,face)=>`<ellipse cx="58" cy="118" rx="7" ry="10" fill="${SKIN}" stroke="${SKINL}" stroke-width="1.5"/><ellipse cx="172" cy="118" rx="7" ry="10" fill="${SKIN}" stroke="${SKINL}" stroke-width="1.5"/>
 <path d="M60 104 C60 66 170 66 170 104 C170 136 146 156 115 156 C84 156 60 136 60 104Z" fill="${SKIN}" stroke="${SKINL}" stroke-width="1.6"/>
 <ellipse cx="80" cy="134" rx="14" ry="9" fill="url(#ck${u})"/><ellipse cx="150" cy="134" rx="14" ry="9" fill="url(#ck${u})"/>
 <path d="M73 133l3 -4M79 134l3 -4M85 133l3 -4M143 133l3 -4M149 134l3 -4M155 133l3 -4" stroke="#f48fb1" stroke-width="1.3" stroke-linecap="round" opacity=".7"/>
 <circle cx="115" cy="132" r="1.3" fill="#f2a2a2"/>
 ${(FACES[face]||FACES.smile)(u)}`;
/* tóc phía trước: mái thưa rẽ ngôi, lọn hai bên xoăn sóng, sợi tóc dựng */
const bow=`<g transform="translate(72 56) rotate(-18)">
 <path d="M0 0 C-12 -16 -30 -12 -28 2 C-26 14 -10 12 0 0Z" fill="#fff" stroke="${REDD}" stroke-width="1.8" stroke-linejoin="round"/>
 <path d="M0 0 C12 -16 30 -12 28 2 C26 14 10 12 0 0Z" fill="#fff" stroke="${REDD}" stroke-width="1.8" stroke-linejoin="round"/>
 <path d="M-4 3 L-12 20 L-6 18 L-3 24Z M4 3 L12 20 L6 18 L3 24Z" fill="#fff" stroke="${REDD}" stroke-width="1.5" stroke-linejoin="round"/>
 <circle cx="-16" cy="-4" r="2" fill="${RED}"/><circle cx="-20" cy="4" r="1.6" fill="${RED}"/><circle cx="16" cy="-4" r="2" fill="${RED}"/><circle cx="20" cy="4" r="1.6" fill="${RED}"/>
 <ellipse rx="6" ry="7" fill="${RED}" stroke="${REDD}" stroke-width="1.5"/>
</g>`;
const hairFront=u=>`<path d="M115 34 C78 34 56 58 58 96 C64 86 72 78 82 74 C80 84 82 92 86 98 C92 84 102 70 115 60 C128 70 138 84 144 98 C148 92 150 84 148 74 C158 78 166 86 172 96 C174 58 152 34 115 34Z" fill="url(#hg${u})" ${L}/>
 <path d="M115 60 C110 76 108 92 110 104 C106 96 104 86 106 76Z" fill="url(#hg${u})" ${L}/>
 <path d="M115 60 C120 76 122 92 120 104 C124 96 126 86 124 76Z" fill="url(#hg${u})" ${L}/>
 <path d="M58 92 C46 106 56 120 48 134 C42 146 48 160 60 164 C54 154 62 148 60 138 C66 126 62 112 70 102Z" fill="url(#hg${u})" ${L}/>
 <path d="M172 92 C184 106 174 120 182 134 C188 146 182 160 170 164 C176 154 168 148 170 138 C164 126 168 112 160 102Z" fill="url(#hg${u})" ${L}/>
 <path d="M76 52 C88 42 102 39 112 40" stroke="#fff" stroke-width="4.5" fill="none" stroke-linecap="round" opacity=".75"/>
 <path d="M124 41 l7 2 M136 45 l6 3" stroke="#fff" stroke-width="3.5" fill="none" stroke-linecap="round" opacity=".75"/>
 <path d="M84 60 C82 70 84 78 88 84 M146 60 C148 70 146 78 142 84 M54 120 C50 130 54 140 50 150 M176 120 C180 130 176 140 180 150" stroke="#ffd3d3" stroke-width="2" fill="none" stroke-linecap="round" opacity=".8"/>
 <path d="M113 36 C108 18 126 12 130 22 C122 20 116 26 118 36" fill="url(#hg${u})" ${L}/>
 <g transform="translate(160 66) rotate(36)"><path d="M0 0 C-11 -9 -8 -25 0 -29 C8 -25 11 -9 0 0Z" fill="${LEAF}" stroke="#23804b" stroke-width="1.3"/><path d="M0 -3 L0 -25 M0 -11 l-5 -5 M0 -17 l5 -5" stroke="#23804b" stroke-width="1.1"/></g>
 ${bow}`;
const hand=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" fill="${SKIN}" stroke="${SKINL}" stroke-width="1.5"/>`;
const arm=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1} L${x2} ${y2}" stroke="${SKINL}" stroke-width="11" stroke-linecap="round"/><path d="M${x1} ${y1} L${x2} ${y2}" stroke="${SKIN}" stroke-width="8.5" stroke-linecap="round"/>`+hand(x2,y2);
const armDownL=arm(82,160,76,188), armDownR=arm(148,160,154,188);
const sparkle=(x,y,s,c)=>`<path transform="translate(${x} ${y}) scale(${s})" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="${c||GOLD}"/>`;
const wand=(x,y,ang)=>`<g transform="translate(${x} ${y}) rotate(${ang})"><rect x="-3" y="-58" width="6" height="60" rx="3" fill="#a77ad6" stroke="${HL}" stroke-width="1"/><rect x="-3.5" y="-20" width="7" height="7" rx="2" fill="${GOLD}"/><path transform="translate(0 -66) scale(1.5)" d="M0 -10 L3 -3 L10 -2 L5 3 L6 10 L0 6 L-6 10 L-5 3 L-10 -2 L-3 -3Z" fill="${GOLD}" stroke="#fff" stroke-width="1"/></g>`;
const book=`<g transform="translate(115 186)"><path d="M-44 -16 L0 -9 L0 24 L-44 17Z" fill="#fff" stroke="#d8ccf7" stroke-width="2"/><path d="M44 -16 L0 -9 L0 24 L44 17Z" fill="#fff" stroke="#d8ccf7" stroke-width="2"/><path d="M-36 -7l28 5M-36 1l28 5M-36 9l28 5M36 -7l-28 5M36 1l-28 5M36 9l-28 5" stroke="#b49cf2" stroke-width="2"/><path d="M-48 -14 L-44 -16 L-44 17 L0 24 L44 17 L44 -16 L48 -14 L48 21 L0 28 L-48 21Z" fill="#9d83e6"/></g>`;
const redPanda=`<g transform="translate(115 184)">
 <path d="M24 10 C44 6 52 -10 44 -22 C40 -16 34 -8 22 -4Z" fill="#c8572b" stroke="#8a3a1c" stroke-width="1.5"/>
 <path d="M30 4 l6 -8 M38 -4 l5 -7 M44 -14 l3 -5" stroke="#f3d1b0" stroke-width="3" stroke-linecap="round"/>
 <ellipse cx="0" cy="12" rx="24" ry="20" fill="#c8572b" stroke="#8a3a1c" stroke-width="1.5"/>
 <ellipse cx="-14" cy="28" rx="8" ry="6" fill="#5a2a1e"/><ellipse cx="14" cy="28" rx="8" ry="6" fill="#5a2a1e"/>
 <path d="M-26 -22 C-34 -38 -18 -42 -14 -30Z M26 -22 C34 -38 18 -42 14 -30Z" fill="#c8572b" stroke="#8a3a1c" stroke-width="1.5"/>
 <path d="M-24 -26 C-28 -34 -20 -36 -18 -30Z M24 -26 C28 -34 20 -36 18 -30Z" fill="#fff"/>
 <ellipse cx="0" cy="-12" rx="26" ry="21" fill="#d2632f" stroke="#8a3a1c" stroke-width="1.5"/>
 <path d="M-20 -6 C-22 2 -10 4 -4 -2 C-8 -8 -16 -10 -20 -6Z M20 -6 C22 2 10 4 4 -2 C8 -8 16 -10 20 -6Z" fill="#fff"/>
 <ellipse cx="0" cy="-4" rx="9" ry="7" fill="#fff"/>
 <path d="M-14 -22 q4 -3 8 0 M14 -22 q-4 -3 -8 0" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
 <path d="M-15 -14 C-12 -6 -6 -8 -6 -12 C-8 -16 -12 -18 -15 -14Z M15 -14 C12 -6 6 -8 6 -12 C8 -16 12 -18 15 -14Z" fill="#7a3418"/>
 <circle cx="-10" cy="-12" r="3.4" fill="#2b1712"/><circle cx="10" cy="-12" r="3.4" fill="#2b1712"/><circle cx="-9" cy="-13" r="1.2" fill="#fff"/><circle cx="11" cy="-13" r="1.2" fill="#fff"/>
 <ellipse cx="0" cy="-6" rx="3" ry="2.2" fill="#2b1712"/><path d="M-3 -2 q3 3 6 0" stroke="#2b1712" stroke-width="1.3" fill="none" stroke-linecap="round"/>
 <ellipse cx="-17" cy="-4" rx="4" ry="2.4" fill="#ff9fb8" opacity=".7"/><ellipse cx="17" cy="-4" rx="4" ry="2.4" fill="#ff9fb8" opacity=".7"/>
</g>`;
let FACE="smile";
const base=(arms,front,back,top)=>{const u=++UID;return defs(u)+shadow+hairBack(u)+(back||"")+body+arms+head(u,FACE)+hairFront(u)+(top||"")+(front||"")};
const P={
 wave:()=>base(arm(82,160,92,186)+arm(148,160,138,186),redPanda+hand(91,186)+hand(139,186)+sparkle(196,58,.9)+sparkle(32,62,.7,"#f9a8d4")+sparkle(184,92,.5,"#f9a8d4")),
 idea:()=>base(armDownL,wand(184,112,8)+sparkle(200,30,1.1)+sparkle(218,60,.7,"#f9a8d4")+sparkle(172,20,.6,"#c4b5fd")+`<path d="M188 36 q14 -6 22 4" stroke="#fde68a" stroke-width="3" fill="none" stroke-dasharray="3 5"/>`,"",arm(148,160,182,116)),
 book:()=>base(arm(82,160,72,184)+arm(148,160,158,184),book+hand(70,184)+hand(160,184)),
 listen:()=>base(armDownL+armDownR,`<path d="M52 116 C48 26 182 26 178 116" stroke="#6b5a8e" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="40" y="104" width="20" height="32" rx="9" fill="${RED}" stroke="${REDD}" stroke-width="2"/><rect x="170" y="104" width="20" height="32" rx="9" fill="${RED}" stroke="${REDD}" stroke-width="2"/><g fill="#9d83e6"><path d="M196 70q8 -4 10 4q-6 2 -6 10l-4 -14z"/><circle cx="196" cy="86" r="5"/><path d="M206 106q8 -4 10 4q-6 2 -6 10l-4 -14z"/><circle cx="206" cy="122" r="5"/></g>`),
 write:()=>base(arm(82,160,74,184),`<g transform="translate(182 120) rotate(25)"><rect x="-5" y="-58" width="10" height="58" rx="2" fill="${GOLD}"/><rect x="-5" y="-68" width="10" height="11" rx="3" fill="#f9a8d4"/><path d="M-5 0 L5 0 L0 12Z" fill="#fde68a"/><path d="M-2 7 L2 7 L0 12Z" fill="#444"/></g><rect x="44" y="166" width="46" height="52" rx="4" fill="#fff" stroke="#d8ccf7" stroke-width="2"/><path d="M52 178h30M52 188h26M52 198h30M52 208h20" stroke="#b49cf2" stroke-width="2"/>`+hand(74,184),"",arm(148,160,180,126)),
 timer:()=>base(arm(82,160,96,184)+arm(148,160,134,184),`<g transform="translate(115 186)"><circle r="21" fill="#fff" stroke="#6b5a8e" stroke-width="4.5"/><rect x="-5" y="-30" width="10" height="7" rx="2" fill="#6b5a8e"/><path d="M0 0 L0 -12 M0 0 L9 5" stroke="${RED}" stroke-width="3.5" stroke-linecap="round"/><circle r="3" fill="#6b5a8e"/></g>`+hand(95,186)+hand(135,186)),
 cheer:()=>base("",`<g transform="translate(190 100)"><path d="M-16 0h32v5c0 13-6 21-16 23c-10-2-16-10-16-23z" fill="${GOLD}"/><path d="M-16 5c-10 0-10 13 2 13M16 5c10 0 10 13-2 13" stroke="${GOLD}" stroke-width="3.5" fill="none"/><rect x="-4" y="27" width="8" height="7" fill="${GOLD}"/><rect x="-11" y="33" width="22" height="5" rx="2" fill="#c98a12"/></g>`+sparkle(40,100,1,"#f9a8d4")+sparkle(212,66,1)+sparkle(30,70,.6)+sparkle(164,76,.6,"#c4b5fd"),"",arm(82,160,48,124)+arm(148,160,182,124))
};
const POSE_FACE={wave:"happy",idea:"wink",book:"smile",listen:"focus",write:"focus",timer:"surprised",cheer:"excited"};
function svg(pose,cls,face){const f=P[pose]||P.wave;FACE=face||POSE_FACE[pose]||"smile";return `<svg class="${cls||"gifty"}" viewBox="10 4 220 246" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Violet – cô bạn hướng dẫn của IVY GIFTED">${f()}</svg>`}
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
const LINES={wave:"Chào em! Mình là Violet, còn đây là bạn gấu trúc đỏ Ivy!",book:"Mở sách ra nào! Mình đọc và học từ cùng nhau nhé.",listen:"Đeo tai nghe lên nhé – nghe 2 lần như phòng thi!",write:"Cầm bút lên! Viết thật cẩn thận, soát lỗi cuối bài nhé.",idea:"Phép thuật ngữ pháp đây! Đọc lý thuyết rồi làm bài ngay nhé.",timer:"Bấm giờ thôi! Làm như thi thật, rồi chữa thật kỹ.",cheer:"Em làm tốt lắm! Ôn lại một vòng là chắc điểm."};
window.IVY_MASCOT={svg,sky,poseFor,line:p=>LINES[p]||LINES.wave,faces:Object.keys(FACES)};
})();

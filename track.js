/* IVY GIFTED – gửi tiến độ học sinh về Google Sheet của giáo viên.
   Địa chỉ máy chủ lưu ở config.js (window.IVY_API). Chưa có địa chỉ thì sự kiện được giữ
   trong hàng đợi trên máy và tự gửi khi có kết nối. */
(function(){
const K_ME="ivy-student", K_Q="ivy-outbox";
const get=(k,d)=>{try{const v=localStorage.getItem(k);return v===null?d:JSON.parse(v)}catch(e){return d}};
const set=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
function me(){return get(K_ME,null)}
function setMe(p){const cur=me()||{};const v={sid:cur.sid||("hs-"+Math.random().toString(36).slice(2,10)),name:(p.name||"").trim(),cls:(p.cls||"").trim(),code:(p.code||"").trim()};set(K_ME,v);try{localStorage.setItem("ivy-name",JSON.stringify(v.name))}catch(e){}return v}
let busy=false;
function api(){try{return window.IVY_API||(window.top&&window.top.IVY_API)||""}catch(e){return window.IVY_API||""}}
function flush(){
  const url=api(); if(!url||busy) return;
  const q=get(K_Q,[]); if(!q.length) return;
  busy=true; const batch=q.slice(0,50);
  fetch(url,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({events:batch})})
   .then(()=>{const now=get(K_Q,[]);set(K_Q,now.slice(batch.length));busy=false;if(now.length>batch.length)setTimeout(flush,500)})
   .catch(()=>{busy=false});
}
function send(ev){
  const p=me(); if(!p) return false;
  const q=get(K_Q,[]);
  q.push(Object.assign({t:new Date().toISOString(),sid:p.sid,name:p.name,cls:p.code?p.cls+" · "+p.code:p.cls},ev));
  set(K_Q,q.slice(-500)); flush(); return true;
}
window.addEventListener("online",flush);
setTimeout(flush,1500);
window.IVY_TRACK={me,setMe,send,flush,pending:()=>get(K_Q,[]).length};
})();

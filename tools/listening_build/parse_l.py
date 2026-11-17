import re, json, sys, html as H
import os; R=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','raw','listening'))+'/'
def txt(fid): return open(R+fid+'.txt',encoding='utf-8-sig',errors='ignore').read().replace('\r','')
def audios(fid):
    h=open(R+fid+'.html',encoding='utf-8',errors='ignore').read(); out=[]
    for m in re.finditer(r'<a[^>]+href="([^"]+)"[^>]*>(.*?)</a>',h,re.S):
        u=H.unescape(m.group(1)); mm=re.search(r'(?:file/d/|%2Ffile%2Fd%2F|id=|id%3D)([\w-]{20,})',u)
        if mm and mm.group(1) not in out: out.append(mm.group(1))
    return out
def split3(t):
    m=re.search(r'\n\s*Answers?\b[^\n]*\n',t)
    q=t[:m.start()] if m else t; rest=t[m.end():] if m else ''
    m2=re.search(r'\n\s*Audio\s*script\s*:?\s*\n',rest,re.I) or re.search(r'\n\s*Audio\s*script\s*:?\s*\n','\n'+rest,re.I)
    if m2: ans=rest[:m2.start()]; scr=rest[m2.end():]
    else: ans=rest; scr=''
    return q,ans,scr
def clean_lines(q):
    L=[l.strip() for l in q.split('\n')]
    return [l for l in L if l and not re.fullmatch(r'_+',l) and l!='IVY GIFTED - LISTENING' and not re.search(r'\.mp3$',l)]
def alts(a):
    a=a.strip().strip('.').strip()
    out=[]
    for p in re.split(r'\s*/\s*|\s+OR\s+|\s+or\s+(?=\()',a):
        p=p.strip()
        if not p: continue
        full=re.sub(r'[()]','',p); full=re.sub(r'\s+',' ',full).strip()
        short=re.sub(r'\([^)]*\)','',p); short=re.sub(r'\s+',' ',short).strip()
        for x in (full,short):
            if x and x not in out: out.append(x)
    return out
def answers(ans,nums):
    t=' '+re.sub(r'\s+',' ',ans)+' '; res={}; pos=0
    for i,n in enumerate(nums):
        m=re.search(rf'(?:^|(?<=\s)){n}\s',t[pos:])
        if not m: return None
        st=pos+m.end()
        if i+1<len(nums):
            m2=re.search(rf'(?<=\s){nums[i+1]}\s',t[st:])
            if not m2: return None
            en=st+m2.start()
        else: en=len(t)
        res[n]=t[st:en].strip(); pos=en
    return res
BL=r'[‘\'"]?\s*[…\.·_]{3,}\s*[’\'"]?'
def gap(fid):
    t=txt(fid); q,a,s=split3(t); L=clean_lines(q)
    items=[];intro=[];nums=[]
    for l in L:
        ms=list(re.finditer(r'\(\s*(\d+)\s*\)\s*'+BL,l))
        if not ms:
            m=re.search(r'\(\s*(\d+)\s*\)',l)
            if m and re.search(r'[…_]{3,}',l): ms=[m]
        if ms:
            for m in ms:
                n=int(m.group(1)); nums.append(n)
            stem=re.sub(r'\(\s*(\d+)\s*\)\s*'+BL,lambda m:'(%s) ___'%m.group(1),l)
            items.append([stem,[int(m.group(1)) for m in ms]])
        elif not items: intro.append(l)
        else: items[-1][0]+=' '+l  # continuation
    A=answers(a,nums) if a.strip() else None
    return dict(intro=intro,items=items,nums=nums,ans=A,script=s.strip(),audio=audios(fid))
def mcq(fid):
    t=txt(fid); q,a,s=split3(t); L=[l for l in (x.rstrip() for x in q.split('\n'))]
    intro=[];items=[];cur=None
    for raw in L:
        l=raw.strip()
        if not l or l=='IVY GIFTED - LISTENING' or l.endswith('.mp3') or re.fullmatch(r'_+',l): continue
        m=re.match(r'^(\d{1,2})[\.\)]?\s+(.+)$',l)
        o=re.match(r'^([A-D])[\.\)]?\s+(.+)$',l)
        if o and cur is not None:
            cur['o'].append(o.group(2).strip()); continue
        if m and (cur is None or len(cur['o'])>=2 or not cur['o']) and not re.match(r'^\d+\s*-\s*\d+',l):
            cur={'n':int(m.group(1)),'s':m.group(2).strip(),'o':[]}; items.append(cur); continue
        if cur is None: intro.append(l)
        elif not cur['o']: cur['s']+=' '+l
        else: cur['o'][-1]+=' '+l
    nums=[c['n'] for c in items]
    A=answers(a,nums) if a.strip() else None
    return dict(intro=intro,items=items,nums=nums,ans=A,script=s.strip(),audio=audios(fid))
if __name__=='__main__':
    k,f=sys.argv[1],sys.argv[2]
    r=(gap if k=='gap' else mcq)(f); print(json.dumps(r,ensure_ascii=False,indent=1)[:3000])

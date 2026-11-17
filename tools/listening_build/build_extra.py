import json,re,sys,os
sys.path.insert(0,os.path.dirname(__file__))
from gen_l import *
from parse_l import R
INDEX.clear()
def tr(i): return open(R+'tr_'+i+'.txt').read()
# ---- Dictations ----
s=open(ROOT+'index.html').read()
DCT=re.findall(r'\["(Dictation[^"]*)","([\w-]+)"\]',s)
def chunks_of(passage):
    out=[]
    for sent in re.split(r'(?<=[.!?])\s+',passage.strip()):
        w=sent.split()
        if len(w)<=10: out.append(sent); continue
        parts=re.split(r'(?<=,)\s+',sent); buf=''
        for p in parts:
            if buf and len((buf+' '+p).split())>10: out.append(buf); buf=p
            else: buf=(buf+' '+p).strip()
        if buf: out.append(buf)
    return out
for k,(name,aid) in enumerate(DCT):
    lines=[re.sub(r'^(Narrator|Speaker\s*\d*)\s*:\s*','',l).strip() for l in tr(aid).split('\n') if l.strip()]
    lines=[l for l in lines if not re.search(r'(Skills? test|Dictation\.?$|Listen to the whole recording|You are going to|You will hear a recording)',l,re.I)]
    passage=max(lines,key=lambda l:len(l.split()))
    rest=[]
    for l in lines:
        if l!=passage and l in passage and l not in rest: rest.append(l)
    ch=rest if len(rest)>=3 else chunks_of(passage)
    out=[]
    for c in ch:
        w=c.split()
        while len(w)>12:
            mid=len(w)//2; cut=None
            for d in range(0,5):
                for j in (mid-d,mid+d):
                    if 3<j<len(w)-2 and w[j].lower().strip(',') in ('that','or','than','by','when','because','and','but','to','with','which','who','of','in','on'): cut=j; break
                if cut: break
            cut=cut or mid
            out.append(' '.join(w[:cut])); w=w[cut:]
        out.append(' '.join(w))
    ch=[]
    for c in out:
        if c not in ch: ch.append(c)
    secs=[dict(type='dict',title='Chép chính tả',intro='Nghe cả bài một lần, sau đó nghe lại và chép từng đoạn vào ô tương ứng. Mỗi đoạn đúng từ 85% số từ trở lên được tính là đúng. Chú ý viết đúng chính tả và dấu câu.',src=f'audio/drive/{aid}.mp3',script=passage,items=[[c] for c in ch],_aud=aid)]
    write(f'LD-{k+1}',name,'Luyện nghe chép chính tả – nền cho Part 1–2 (điền từ).',secs,'Nền cho P1–P2 (chép chính tả)',['dict'],None)
# ---- ONE WORD ONLY ----
OW='1ETaBfHS75ooRQSlUOlKli2yT1NvAPG1A'
ows=[("People tell me I should (1) ___ in on it, sell up and move out to the country.",["cash"]),
 ("(2) ___ have gone up so much around here that I could get a lovely place somewhere rural.",["Prices"]),
 ("I don't know though, it had never really (3) ___ to me before.",["occurred"]),
 ("I mean, now I don't even know my (4) ___’ names and they don't know mine.",["neighbours","neighbors"]),
 ("So I'm not sure if I should (5) ___ around now.",["stick"]),
 ("There was a time around here that you could leave your front door open morning, (6) ___ and night.",["noon"]),
 ("Kids just played in the street (7) ___ and only came home when it got dark or their dinner was on the table.",["unsupervised"]),
 ("Everybody knew everybody else... and their (8) ___... so it wasn't all great!",["business"]),
 ("Mrs Peters at number 36, she was (9) ___ just last Thursday.",["mugged"]),
 ("50 pounds and her mobile phone she (10) ___.",["lost"])]
secs=[dict(type='gap',title='Điền MỘT từ',intro='Nghe hai người nói về khu phố của họ. Điền đúng MỘT từ vào mỗi chỗ trống.',src=f'audio/drive/{OW}.mp3',script=tr(OW).replace('Speaker 1:','Người 1:').replace('Speaker 2:','Người 2:'),items=[[a,more(b),''] for a,b in ows],_aud=OW)]
write('L1W','Listening: ONE WORD ONLY','Nghe và điền MỘT từ – dạng Part 1 của đề chuyên.',secs,'P1 hoàn thành ≤ 1 từ',['gf'],None)
# ---- B2-Practice 1 (câu hỏi soạn từ bản ghi) ----
A1='1mVh92RB05sxc7BaVNuEcd93fRgEG7mav'
q=[("Before going to Africa, Elizabeth worked in a (9) ___.",["travel agency"]),
 ("Elizabeth first found out about volunteering from a (10) ___ at the dentist's.",["poster"]),
 ("The training weekend in London is called (11) ___.",["Changes"]),
 ("Elizabeth has a degree in (12) ___.",["economics"]),
 ("In Africa, she trained local farmers in the (13) ___ of their produce.",["marketing"]),
 ("The course at the training centre lasted (14) ___ instead of four.",["three weeks","3 weeks"]),
 ("For local trips, Elizabeth rode a (15) ___.",["motorbike","motorcycle"]),
 ("Back in England, Elizabeth found the (16) ___ especially overwhelming.",["supermarkets","supermarket"]),
 ("Elizabeth now runs her own business selling African (17) ___.",["furniture"]),
 ("Elizabeth now makes more time for (18) ___, her favourite hobby.",["gardening"])]
secs=[dict(type='gap',title='Part 2 · Điền từ (tối đa 3 từ)',intro='You will hear an interview with Elizabeth Holmes, who spent two years in Africa as a volunteer. For questions 9-18, complete the sentences with a word or short phrase.',src=f'audio/drive/{A1}.mp3',script=tr(A1),items=[[a,more(b),''] for a,b in q],_aud=A1)]
write('LB2-01','B2-Practice 1','Luyện nghe chuẩn B2 – Điền từ (tối đa 3 từ). Câu hỏi do IVY soạn theo bản ghi âm.',secs,'P2 điền ≤ 3 từ',['gf'],None)
print([x['code'] for x in INDEX],[x['n'] for x in INDEX])

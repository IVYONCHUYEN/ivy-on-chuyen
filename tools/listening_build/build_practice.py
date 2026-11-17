import re,json,sys,os
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import parse_l, gen_l
from gen_l import *
RAW=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','raw','practice'))+'/'
man=json.load(open(RAW+'manifest.json'))
ok=[];bad=[]
FIX={'13y6MsLfWJWkqJzW3iAXgUNb7wEzg92CoADCVbVE7bAE':lambda t:t.replace('13 (two) compartment','14 (two) compartment').replace('13 solid/firm bottom','13 solid bottom / firm bottom'),
 '1u5dm8hhCCtbf1QkQZpqtFGyuReUEmpA_Q3ZRiccM7jY':lambda t:t.replace('Au24','24'),
 '130xnNuXgbggmRad6E2m2v5a2vUpe2Lm0vYyPQ68Jpao':lambda t:t.replace('costs (11) £','costs £ (11) '),
 '13y6MsLfWJWkqJzW3iAXgUNb7wEzg92CoADCVbVE7bAE_':None,
 '1KtiCp2T4gpRIBoLCRA-yRnSzI1BlkBBHMYiX-yfIe00':lambda t:t.replace('costs (11) £','costs £ (11) ')}
_txt=parse_l.txt
parse_l.txt=lambda fid:FIX.get(fid,lambda x:x)(_txt(fid))
for n in range(1,34):
    d=man[str(n)]; parse_l.R=RAW+'%02d/'%n
    docs=[i for i in d['items'] if i['kind']=='doc']; mp3=[i for i in d['items'] if i['title'].lower().endswith('.mp3')]
    def key(kind):
        for i in docs:
            t=i['title'].lower()
            if 'key' in t and kind(t): return i['id']
    def qdoc(kind):
        for i in docs:
            t=i['title'].lower()
            if 'key' not in t and kind(t): return i['id']
    def anstext(fid):
        t=parse_l.txt(fid); t=FIX.get(fid,lambda x:x)(t)
        t=re.split(r'\n\s*Audio\s*script',t,flags=re.I)[0]
        m=re.search(r'Answers?\b[^\n]*\n',t)
        if m: t=t[m.end():]
        else: t=t.split('____')[-1] if '____' in t else t
        return t
    def get(fn,kind):
        k=key(kind); r=fn(k)
        bad=len(set(r['nums']))!=len(r['nums'])
        if not r['items'] or r['ans'] is None or bad:
            q=qdoc(kind)
            if q and (not r['items'] or bad):
                r2=fn(q); r['items']=r2['items']; r['nums']=r2['nums']; r['intro']=r2['intro']
            r['ans']=parse_l.answers(anstext(k),r['nums'])
            if not r['script']:
                t=parse_l.txt(k); m=re.search(r'\n\s*Audio\s*script\s*:?\s*\n',t,re.I)
                if m: r['script']=t[m.end():].strip()
        if r['ans']:
            for x in r['ans']: r['ans'][x]=re.split(r'\s*_{4,}',r['ans'][x])[0].strip()
        if not r['script']:
            t=parse_l.txt(k); m=re.search(r'Listening Transcript\s*\n(.*?)\n\s*Listening Questions',t,re.S)
            if m: r['script']=m.group(1).strip()
        return r
    def aud(pat):
        for i in mp3:
            if re.search(pat,i['title'].lower()): return i['id']
    secs=[];parts=[];types=[]
    try:
        k=key(lambda t:'gap' in t)
        if k:
            g=get(gap,lambda t:'gap' in t); g['audio']=[aud(r'^b2-test-\d+-2')]
            gs=gap_section(g,'x')
            for it in gs['items']: it[1]=[a for a in it[1] if '(' not in a and ')' not in a] or it[1]
            secs.append(gs); gs['title']=('Part 2 · Điền từ (tối đa 3 từ)');
            if 0: secs.append(gap_section(g,'Part 2 · Điền từ (tối đa 3 từ)')); types.append('gf'); parts.append('P2 điền ≤ 3 từ')
        k=key(lambda t:'mcq' in t)
        if k:
            m=get(mcq,lambda t:'mcq' in t); m['audio']=[aud(r'^b2-test-\d+-4')]
            yn=['YES','NO'] if all(not c['o'] for c in m['items']) else None
            secs.append(mcq_section(m,'Part 4 · '+('Đúng / Sai (YES / NO)' if yn else 'Trắc nghiệm A, B, C'),yn)); types.append('tf' if yn else 'mcq'); parts.append('P4 YES/NO' if yn else 'P3 trắc nghiệm')
        k=key(lambda t:'t/f' in t)
        if k:
            m=get(mcq,lambda t:'t/f' in t); m['audio']=[aud(r'^b1-test')]
            for c in m['items']: c['o']=[]; c['s']=re.sub(r'(\s+[AB])+$','',c['s'])
            secs.append(mcq_section(m,'B1 · Đúng / Sai (YES / NO)',['A – YES','B – NO'])); types.append('tf'); parts.append('B1 True/False')
        for s in secs:
            if s['type']=='mcq' and s['items'] and len(s['items'][0][1])==4: s['title']=s['title'].replace('A, B, C','A, B, C, D')
            if not s['_aud'] or not os.path.exists(gen_l.ROOT+'audio/drive/%s.mp3'%s['_aud']): raise Exception('audio thiếu')
            if not s['items']: raise Exception('rỗng')
        write('LP-%02d'%n,'Listening Practice %d'%n,'Luyện nghe – '+' + '.join(x['title'].split(' · ')[1] for x in secs)+'.',secs,' · '.join(parts),types,None)
        ok.append((n,[len(s['items']) for s in secs]))
    except Exception as e:
        import traceback; bad.append((n,repr(e)))
print('OK',ok); print('BAD',bad)
json.dump(INDEX,open('/tmp/lp_index.json','w'),ensure_ascii=False)

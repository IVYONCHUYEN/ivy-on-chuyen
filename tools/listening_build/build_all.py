import re,json,sys
sys.path.insert(0,'.')
from gen_l import *
s=open(ROOT+'index.html').read()
a=s.index('const B2 = {');b=s.index('function b2Item')
B2={int(n):dict(re.findall(r'(\w+):"([\w-]+)"',body)) for n,body in re.findall(r'(\d+):\{([^}]*)\}',s[a:b])}
for n,d in sorted(B2.items()):
    if n==1: continue
    secs=[];types=[];parts=[]
    if 'kgf' in d:
        g=gap(d['kgf']); secs.append(gap_section(g,'Part 2 · Điền từ (tối đa 3 từ)')); types.append('gf'); parts.append('P2 điền ≤ 3 từ')
    if 'kmcq' in d:
        m=mcq(d['kmcq'])
        yn=['YES','NO'] if all(not c['o'] for c in m['items']) else None
        secs.append(mcq_section(m,'Part 4 · '+('Đúng / Sai (YES / NO)' if yn else 'Trắc nghiệm A, B, C'),yn)); types.append('tf' if yn else 'mcq'); parts.append('P4 YES/NO' if yn else 'P3 trắc nghiệm')
    write('LB2-%02d'%n,'B2-Practice %d'%n,'Luyện nghe chuẩn B2 – '+' + '.join(x['title'].split(' · ')[1] for x in secs)+'.',secs,' · '.join(parts),types,None)
# TF B1-11
m=mcq('10ys57Ka5lgQa5Tx3Pzcmscl6KYywYabB8ZEMKyIxStA')
for c in m['items']: c['o']=[]
sec=mcq_section(m,'Part 4 · Đúng / Sai (YES / NO)',['A – YES','B – NO'])
write('LB1-11','B1-Practice 11: True/False','Nghe hội thoại và quyết định câu đúng (YES) hay sai (NO).',[sec],'P4 True/False','tf'.split(),None)
json.dump(INDEX,open('index_part1.json','w'),ensure_ascii=False)
for x in INDEX: print(x)

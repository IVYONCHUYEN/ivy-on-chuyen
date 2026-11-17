import re, json, sys, os, subprocess
sys.path.insert(0,'.')
from parse_l import gap, mcq, txt, audios, alts, split3
import os; ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))+'/'
def dur(aid):
    try: return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',ROOT+'audio/drive/'+aid+'.mp3']).strip())
    except Exception: return 240.0
def esc(t): return t.replace('&','&amp;').replace('<','&lt;').replace('>','&gt;')
NUM={'1':'one','2':'two','3':'three','4':'four','5':'five','6':'six','7':'seven','8':'eight','9':'nine','10':'ten','11':'eleven','12':'twelve','15':'fifteen','20':'twenty','30':'thirty','40':'forty','50':'fifty','100':'a hundred'}
def more(alist):
    out=[]
    def add(x):
        x=re.sub(r'\s+',' ',x).strip()
        if x and x not in out: out.append(x)
    for a in alist:
        add(a)
        m=re.match(r'^(a|an|the)\s+(.+)$',a,re.I)
        if m: add(m.group(2))
        if '.' in a: add(a.replace('.',''))
        m=re.match(r'^(\d+)\s+(.+)$',a)
        if m and m.group(1) in NUM: add(NUM[m.group(1)]+' '+m.group(2))
        m=re.match(r'^([a-z]+)\s+(.+)$',a)
        if m and m.group(1) in NUM.values(): add({v:k for k,v in NUM.items()}[m.group(1)]+' '+m.group(2))
    return out
def fixstem0(s): return re.sub(r'\s*___\s*',' ___ ',s).replace(' ___ .',' ___.').replace(' ___ ,',' ___,').strip()
def fixstem(s):
    s=re.sub(r'\s*and\s+[…\.·_]{3,}',' ',s); s=re.sub(r'[…·]{2,}|\.{4,}',' ',s)
    return fixstem0(s)
def gap_section(g, title):
    items=[]
    for stem,ns in g['items']:
        n=ns[0]; a=g['ans'][n] if g['ans'] else None
        if a is None: raise Exception('no ans')
        items.append([fixstem(stem), more(alts(a)), ''])
    intro=' '.join(esc(x) for x in g['intro'])
    return dict(type='gap',title=title,intro=intro,src='audio/drive/%s.mp3'%g['audio'][0],script=g['script'],items=items,_aud=g['audio'][0])
YESNO={'YES':0,'NO':1,'TRUE':0,'FALSE':1,'T':0,'F':1,'A':0,'B':1}
def mcq_section(m, title, yesno=None):
    items=[]
    for c in m['items']:
        a=m['ans'][c['n']].strip().upper().strip('.')
        if yesno:
            items.append([esc(c['s']), yesno, YESNO[a], ''])
        else:
            items.append([esc(c['s']), [esc(o) for o in c['o']], 'ABCD'.index(a[0]), ''])
    intro=' '.join(esc(x) for x in m['intro'])
    return dict(type='mcq',title=title,intro=intro,src='audio/drive/%s.mp3'%m['audio'][0],script=m['script'],items=items,_aud=m['audio'][0])
def minutes(secs):
    t=0
    for s in secs:
        t+=dur(s['_aud'])*1.6+len(s['items'])*20
    return max(5,int(-(-t//60)))
def write(code,title,sub,secs,part,types,phase):
    mins=minutes(secs)
    for s in secs: s.pop('_aud',None)
    L=dict(code=code,title=title,sub=sub,listening=True,phase='Listening',minutes=mins,practice=secs)
    open(ROOT+'data/listening/%s.js'%code,'w').write('window.LESSON='+json.dumps(L,ensure_ascii=False)+';\n')
    INDEX.append(dict(code=code,title=title,part=part,types=types,phase=phase,n=sum(len(s['items']) for s in secs),min=L['minutes']))
minutes_cache={}; INDEX=[]
os.makedirs(ROOT+'data/listening',exist_ok=True)

import json,glob,re
import os; ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))+'/'
idx={}
for f in sorted(glob.glob(ROOT+'data/listening/L*.js')):
    t=open(f).read(); L=json.loads(t[len('window.LESSON='):].rstrip().rstrip(';'))
    idx[L['code']]=dict(title=L['title'],n=sum(len(s['items']) for s in L['practice']),min=L['minutes'])
open(ROOT+'data/listening/index.js','w').write('window.IVY_LISTEN='+json.dumps(idx,ensure_ascii=False)+';\n')
print(len(idx),list(idx)[:5])

import json,glob,re
import os; ROOT=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..'))+'/'
idx={}
for f in sorted(glob.glob(ROOT+'data/listening/LP-*.js')):
    t=open(f).read(); L=json.loads(t[len('window.LESSON='):].rstrip().rstrip(';'))
    types=[]
    for s in L['practice']:
        ty='gf' if s['type']=='gap' else ('tf' if len(s['items'][0][1])==2 else 'mcq')
        if ty not in types: types.append(ty)
    idx[L['code']]=dict(title=L['title'],n=sum(len(s['items']) for s in L['practice']),min=L['minutes'],types=types,
        part=' · '.join(s['title'].replace(' · ',' ') for s in L['practice']))
open(ROOT+'data/listening/index.js','w').write('window.IVY_LISTEN='+json.dumps(idx,ensure_ascii=False)+';\n')
print(len(idx),idx['LP-23'])

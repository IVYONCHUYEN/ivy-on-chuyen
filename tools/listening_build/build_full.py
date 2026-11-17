import json,sys
sys.path.insert(0,'.')
from gen_l import *
INDEX.clear()
def G(stem,ans): return [stem,more(ans),'']
def M(stem,opts,a): return [stem,opts,'ABC'.index(a),'']
TF=['TRUE','FALSE']
def T(stem,a): return [stem,TF,0 if a=='T' else 1,'']
A1='1VmJ1-rtZMVMzsm6v0Scqck8GcldlhDJY'; A2='1eX9PGZpkILq6sSZXr6Y3f4dNc3S7qRma'
same='Tiếp tục nghe cùng file audio ở Part 1.'
t1=[
 dict(type='gap',title='Part 1 · Điền MỘT từ',intro='You will hear a museum director called Carl Halford talking about the museum where he works. Complete the sentences with ONE WORD ONLY.',src=f'audio/drive/{A1}.mp3',items=[
  G("Carl says that the museum was last renovated in the year (1) ___.",["1973","nineteen seventy-three"]),
  G("Carl says that improvements in the (2) ___ in museums often go unnoticed.",["lighting","lights"]),
  G("There are now a total of (3) ___ exhibits which visitors can see in the museum.",["429"]),
  G("The exhibits are now arranged according to their (4) ___.",["age"]),
  G("One of Carl's favourite pieces is a 4,500-year-old cup with a design of a (5) ___ on the bottom.",["leaf"]),
  G("Carl describes a strange farm model in the museum that features (6) ___ and a farmer.",["cows","two cows"]),
  G("Some visitors to the museum are frightened by the (7) ___ of one large statue.",["eyes"]),
  G("Carl also describes a vase which shows a man fighting with a (8) ___.",["monster"]),
  G("Carl finds it surprising that one of the coins in the museum has such (9) ___ decoration.",["detailed"]),
  G("One simple exhibit that Carl likes is a plain stone with a picture of a (10) ___ on it.",["fish"])]),
 dict(type='mcq',title='Part 2 · Trắc nghiệm A, B, C',intro='You will hear two students talking to their tutor about the nursing course. '+same,items=[
  M("How old are the students on the nursing program?",["They are teenagers.","They are in their twenties.","They belong to different age groups."],'C'),
  M("What do the speakers say about the group project?",["It helps to improve relationships among different classmates.","It helps to develop problem solving skills.","It provides a supportive learning environment."],'A'),
  M("Which part of the program surprised Paul?",["There’s a number of essays to write.","There’s a lot of practical work.","There's an internship provided."],'A'),
  M("What do they feel about learning law?",["It is essential training.","It is too theoretical.","It takes up too much time."],'A'),
  M("What is one of the suggestions offered by the speakers?",["get help for nursing problems","be well prepared","get feedback from teaching staff"],'C')]),
 dict(type='mcq',title='Part 3 · TRUE / FALSE',intro='You will hear a college lecturer being interviewed about the subject of her new book. '+same,items=[
  T("Pat’s book has already been published for 3 months.",'F'),
  T("According to Pat’s book, boys always keep quiet when a girl is speaking in the classroom.",'F'),
  T("Pat thinks boys not only dominate the classroom verbally, but physically as well.",'T'),
  T("Pat deems that girls should go to single-sex schools so that they will have a chance to develop their potential.",'T'),
  T("Margaret Thatcher went to a co-educational school when she was a kid.",'F')]),
 dict(type='gap',title='Part 4 · Điền tối đa BA từ',intro='You will listen to a short telephone conversation between a student and a director of a theatre school. Complete the notes with NO MORE THAN THREE WORDS. '+same,items=[
  G("1950: Awarded His Majesty’s (21) ___ Excellence.",["Certificate of"]),
  G("1975: (22) ___ Ambleside School of Dance …",["merged with"]),
  G("… to become the largest (23) ___ school in the country.",["performance arts","performing arts"]),
  G("1993: Founder, Rosemary Elizabeth English, (24) ___.",["passed away"]),
  G("Her (25) ___ was for the school to become a charitable trust.",["dying wish"])])]
t2=[
 dict(type='gap',title='Part 1 · Điền MỘT từ',intro='THE HISTORY OF COFFEE. Complete the notes below. Write ONE WORD ONLY for each answer.',src=f'audio/drive/{A2}.mp3',items=[
  G("1623: In Constantinople, the ruler ordered the (1) ___ of every coffee house.",["destruction"]),
  G("Coffee shops were compared to (2) ___.",["universities"]),
  G("They played an important part in social and (3) ___ changes.",["political"]),
  G("Types of coffee were often named according to the (4) ___ they came from.",["port","ports"]),
  G("In Brazil and the Caribbean, most cultivation depended on (5) ___.",["slaves","slavery"]),
  G("In Java, coffee was used as a form of (6) ___.",["taxation"]),
  G("Coffee became almost as important as (7) ___.",["sugar"]),
  G("The move towards the consumption of (8) ___ in Britain did not also take place in the USA.",["tea"]),
  G("Prices dropped because of improvements in (9) ___.",["transportation"]),
  G("Industrial workers found coffee helped them to work at (10) ___.",["night"])]),
 dict(type='mcq',title='Part 2 · Trắc nghiệm A, B, C',intro='Listen to a conversation and choose the correct letter A, B or C. '+same,items=[
  M("What is the man's destination?",["Salt Lake City, USA","New York City, USA","Helsinki, Finland"],'C'),
  M("When is the man's departure date?",["the twenty-ninth","the twenty-second","the twenty-third"],'B'),
  M("What is the flight number for the second half of the man’s journey?",["555","90","1070"],'B'),
  M("How long is the man's layover between flights?",["less than an hour","less than two hours","less than three hours"],'B'),
  M("What request did the man make regarding his flight?",["He asked for a specially-prepared dinner.","He wanted an aisle seat.","He asked for a seat near the front of the plane."],'A')]),
 dict(type='mcq',title='Part 3 · TRUE / FALSE',intro='You will hear a conversation between a girl, Claire, and a boy, Tom, about a football tour. '+same,items=[
  T("Claire has read about the football tour in a newspaper.",'F'),
  T("Claire is worried about being the youngest member of the team.",'F'),
  T("Tom feels that schoolwork is more important than sports training.",'T'),
  T("Claire intends to study at a university next year.",'F'),
  T("Claire thinks it's important to win every game on the tour.",'F')]),
 dict(type='gap',title='Part 4 · Điền tối đa BA từ và/hoặc một số',intro='Part of a science TV programme for young people explaining what meteors are. You will hear it TWICE. '+same,items=[
  G("‘Meteors’ is another name for (21) ___.",["shooting stars"]),
  G("You can think of meteors as a group of (22) ___.",["insects"]),
  G("The circular path the Earth travels around the Sun is called its (23) ___.",["orbit"]),
  G("A meteor travels very fast – a hundred times faster than (24) ___.",["a jet plane"]),
  G("Because of the heat, the meteor becomes less hard, (25) ___ and then burns.",["melts"])])]
for code,title,secs,aid in [('LFULL-1','Đề đầu vào Chuyên 1 – Listening',t1,A1),('LFULL-2','Đề đầu vào Chuyên 2 – Listening',t2,A2)]:
    L=dict(code=code,title=title,sub='Phần Listening đủ 4 part (25 câu) của đề thi thử. Một file audio cho cả bài, nghe như thi thật.',listening=True,phase='Listening',minutes=int(dur(aid)//60)+5,practice=secs)
    open(ROOT+'data/listening/%s.js'%code,'w').write('window.LESSON='+json.dumps(L,ensure_ascii=False)+';\n')
    INDEX.append(dict(code=code,title=title,part='Đủ 4 phần Listening (25 câu)',types=['full'],phase=None,n=25,min=L['minutes']))
json.dump(INDEX,open('index_full.json','w'),ensure_ascii=False); print(INDEX)

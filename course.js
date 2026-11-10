/* Lộ trình 90 buổi + lịch học – dùng chung cho dashboard giáo viên (trích từ index.html). */
(function(){
const PHASES = [
 {n:0, name:"Chẩn đoán & định hướng", short:"GĐ0", goal:"Xếp Mức 1–5 từng kỹ năng", lexico:"Lập sổ từ cá nhân: ghi từ theo cụm, kèm họ từ và ví dụ."},
 {n:1, name:"Nền B2: ngữ pháp lõi + dạng bài cơ bản", short:"GĐ1", goal:"≥ 4,5 điểm", lexico:"Collocation động từ + danh từ; họ từ với hậu tố và tiền tố phủ định."},
 {n:2, name:"Chuyên đề nâng cao + Lexico", short:"GĐ2", goal:"≥ 5,5 điểm", lexico:"10 phrasal verb hoặc idiom mỗi ngày; collocation trạng từ + tính từ."},
 {n:3, name:"Luyện sâu dạng bài chuẩn C1", short:"GĐ3", goal:"≥ 6,5 điểm", lexico:"Ôn vòng toàn bộ cụm đã học; cấu tạo từ khó (involuntarily, resilient…)."},
 {n:4, name:"Luyện đề & tối ưu điểm", short:"GĐ4", goal:"≥ 7,0 ổn định", lexico:"Lexico sprint: 300 cụm hay ra trong đề các tỉnh."}
];
// [code, phase, content, exam task]  — "MTx" rows are Mock Tests (Sunday, not a lesson)
const S = [
["B00",0,"Mock Test 0: đề Hưng Yên năm gần nhất, đủ 150 phút","Xếp Mức 1–5 từng kỹ năng"],
["B01",0,"Giới thiệu đề, cách chấm, chiến lược; lập sổ lỗi và sổ từ","Sổ lỗi, sổ từ cá nhân"],
["B02",0,"Từ loại & phân tích cấu trúc câu dài","Nền cho Word Form và sửa lỗi"],
["B03",0,"Kỹ năng paraphrase trong Nghe và Đọc","Nền cho Listening, Reading"],
["B04",1,"Thì 1: hiện tại, hoàn thành","Listening P2 điền ≤ 3 từ"],
["B05",1,"Thì 2: quá khứ, tương lai, by the time","Lexico P3 sửa lỗi (lỗi thì)"],
["B06",1,"Hoà hợp chủ – vị","Lexico P3"],
["B07",1,"Cấu tạo từ 1: hậu tố, vị trí từ loại","Lexico P2 cấu tạo từ trong đoạn"],
["B08",1,"Cấu tạo từ 2: tiền tố phủ định, từ ghép","Reading P1 điền 1 từ"],
["B09",1,"Dạng động từ 1: to V / V-ing","Listening P1 hoàn thành bảng"],
["B10",1,"Dạng động từ 2 + thể sai khiến","Collocation 1: động từ + danh từ"],
["B11",1,"Bị động, bị động kép","Writing P1 viết lại câu"],
["B12",1,"Câu điều kiện 0–3, hỗn hợp","Writing P1"],
["B13",1,"Câu ước & giả định","Lexico P1 trắc nghiệm"],
["B14",1,"Câu gián tiếp + động từ tường thuật","Writing P1–P2"],
["B15",1,"Mệnh đề quan hệ","Lexico P3, Reading P2"],
["B16",1,"Rút gọn mệnh đề, phân từ","Reading P2 chọn cụm/mệnh đề"],
["B17",1,"So sánh","Writing P1"],
["B18",1,"Viết đoạn: câu chủ đề, ý hỗ trợ","Viết đoạn 150 từ"],
["B19",1,"Đọc hiểu 1: chi tiết, từ trong ngữ cảnh","Reading P3"],
["B20",1,"True/False/Not Given","Listening P4"],
["B21",1,"Bài luận Opinion 1: bố cục 4 đoạn","Writing P3"],
["MT1",1,"Mock Test 1","Đủ 150 phút"],
["B22",1,"Chữa MT1: Listening + Lexico","Chữa đề 4 vòng"],
["B23",1,"Chữa MT1: Reading + Writing","Cập nhật sổ lỗi"],
["B24",1,"Mạo từ & lượng từ","Reading P1"],
["B25",1,"Giới từ 1: giới từ đi kèm","Lexico P1"],
["B26",1,"Bài luận Problems & Solutions 1","Writing P3"],
["B27",1,"Ôn giai đoạn 1","Mini test + làm lại câu sai"],
["B28",2,"Động từ khuyết thiếu: khả năng, bắt buộc, suy đoán","Lexico P1"],
["B29",2,"Modal hoàn thành (must/can't/needn't have)","Writing P1"],
["B30",2,"Mệnh đề trạng ngữ & liên từ","Reading P4 điền câu"],
["B31",2,"Nhượng bộ (Adj/Adv + as), song hành","Lexico P3"],
["B32",2,"Nối tiêu đề 1: câu chủ đề, tiêu đề bẫy","Reading P5"],
["B33",2,"Đọc hiểu 2: suy luận, quy chiếu, ý chính","Reading P3"],
["MT2",2,"Mock Test 2","Đủ 150 phút"],
["B34",2,"Chữa MT2: Listening + Lexico","Chữa đề 4 vòng"],
["B35",2,"Chữa MT2: Reading + Writing","Cập nhật sổ lỗi"],
["B36",2,"Giới từ 2: cụm giới từ cố định","Reading P1"],
["B37",2,"Đảo ngữ 1: Only / Not until / Hardly / No sooner","Writing P1"],
["B38",2,"Đảo ngữ 2: điều kiện đảo, so/such, but for","Writing P1"],
["B39",2,"Câu chẻ, nhấn mạnh, mệnh đề danh ngữ","Writing P1"],
["B40",2,"Phrasal verb 1: theo động từ gốc","Writing P2 viết lại với từ khoá"],
["B41",2,"Phrasal verb 2: theo tiểu từ","Lexico P1"],
["B42",2,"Collocation 2: trạng từ + tính từ, tính từ + danh từ","Reading P2 chọn từ điền đoạn"],
["B43",2,"Idiom 1","Writing P2"],
["B44",2,"Idiom 2 + câu giao tiếp, câu hỏi đuôi","Lexico P1"],
["B45",2,"Cấu tạo từ nâng cao","Lexico P2"],
["B46",2,"Listening trắc nghiệm: bẫy, thái độ người nói","Listening P3"],
["B47",2,"Bài luận Opinion 2: lập luận, phản đề","Writing P3"],
["MT3",2,"Mock Test 3","Đủ 150 phút"],
["B48",2,"Chữa MT3: Listening + Lexico","Chữa đề 4 vòng"],
["B49",2,"Chữa MT3: Reading + Writing","Cập nhật sổ lỗi"],
["B50",2,"Điền câu 2: liên kết ngầm, mức C1","Reading P4"],
["B51",2,"Bài luận Problems & Solutions 2","Writing P3"],
["B52",2,"Lexico tổng hợp từ đề các tỉnh","Lexico P1–P3"],
["B53",2,"Ôn giai đoạn 2","Làm lại câu sai trong sổ lỗi"],
["B54",3,"Listening P1–P2 chuyên sâu","Nghe 2 lần như đề thật"],
["B55",3,"Listening P3–P4 chuyên sâu","Câu NOT TRUE, ý kiến từng người"],
["B56",3,"Reading P1–P2 chuẩn C1","Đề CAE + đề các tỉnh"],
["B57",3,"Reading P3 bài học thuật","Suy luận, tóm tắt đoạn"],
["B58",3,"Nối tiêu đề 2","Bài dài, 8 tiêu đề"],
["B59",3,"Writing P1–P2 tổng hợp 1","50 câu viết lại"],
["MT4",3,"Mock Test 4","Đủ 150 phút"],
["B60",3,"Chữa MT4","Chữa đề 4 vòng"],
["B61",3,"Chữa MT4 + giao bài Tết","2 đề full + 2 bài luận"],
["B62",3,"Chữa bài Tết + Lexico P1","Sau Tết"],
["B63",3,"Lexico P2–P3 nâng cao","Cấu tạo từ + sửa lỗi"],
["B64",3,"Reading P4–P5 bấm giờ","20 phút cho hai phần"],
["B65",3,"Bài luận: dàn ý nhanh 15 chủ đề","5 phút mỗi dàn ý"],
["B66",3,"Writing P1–P2 tổng hợp 2","50 câu viết lại"],
["B67",3,"Listening đủ 4 phần, bấm giờ","25 câu"],
["B68",3,"Reading đủ 5 phần, 55 phút","30 câu"],
["MT5",3,"Mock Test 5","Đủ 150 phút"],
["B69",3,"Chữa MT5","Chữa đề 4 vòng"],
["B70",3,"Chữa MT5 + chia nhóm theo điểm yếu","Nhóm Nghe / Đọc / Lexico / Viết"],
["B71",3,"Ôn ngữ pháp nền qua sửa lỗi","Thì, bị động, S–V, MĐQH"],
["B72",3,"Bài luận 35 phút + viết lại bản 2","Writing P3"],
["B73",3,"Đề Hưng Yên năm gần nhất, đủ 150 phút","So với Mock Test 0"],
["B74",4,"Chữa đề Hưng Yên","Phân tích từng câu theo dạng"],
["B75",4,"Đề chuyên tỉnh khác: Listening + Lexico","Nam Định, Hải Dương, Bắc Ninh…"],
["B76",4,"Đề chuyên tỉnh khác: Reading + Writing","Bấm giờ"],
["MT6",4,"Mock Test 6","Đủ 150 phút"],
["B77",4,"Chữa MT6","Chữa đề 4 vòng"],
["B78",4,"Lấp lỗ hổng theo nhóm 1","Theo sổ lỗi"],
["B79",4,"Lexico sprint 1: 300 cụm hay ra","Kiểm tra nhanh 100 câu"],
["B80",4,"Listening sprint","2 đề"],
["B81",4,"Reading sprint","55 phút"],
["B82",4,"Bài luận bấm giờ + chấm chéo","35 phút"],
["MT7",4,"Mock Test 7","Đủ 150 phút"],
["B83",4,"Chữa MT7","Chữa đề 4 vòng"],
["B84",4,"Làm lại câu sai sau 7–14 ngày","Từ sổ lỗi MT6–MT7"],
["B85",4,"Đề dự đoán 1","Đủ 150 phút"],
["B86",4,"Chữa đề dự đoán + Lexico sprint 2","—"],
["MT8",4,"Mock Test 8 – tổng duyệt","Đúng giờ thi thật"],
["B87",4,"Chữa MT8","—"],
["B88",4,"Chiến lược phòng thi, phân bổ 150 phút","—"],
["B89",4,"Tổng kết, ôn nhẹ","Giữ sức trước thi"]
];

/* ---------- DATES: Tue/Thu from 30/6/2026, skip Tết weeks ---------- */
const START = new Date(2026,5,30); // Tue
const SKIP_WEEKS = [31,32]; // week index of 2/2 and 9/2/2027
const EXAM = new Date(2027,4,24);
function addDays(d,n){const x=new Date(d);x.setDate(x.getDate()+n);return x}
const sessions=[]; let lessonIdx=0, week=0, slot=0;
S.forEach(r=>{
  const isMT = r[0].startsWith("MT");
  if(isMT){
    // Sunday after the previous lesson
    const prev = sessions.filter(s=>!s.mt).slice(-1)[0];
    const d = addDays(prev.date, 7 - prev.date.getDay()); // next Sunday
    sessions.push({code:r[0],phase:r[1],title:r[2],task:r[3],mt:true,date:d,week:prev.week});
    return;
  }
  while(SKIP_WEEKS.includes(week)){week++;}
  const d = addDays(START, week*7 + (slot?2:0));
  sessions.push({code:r[0],phase:r[1],title:r[2],task:r[3],mt:false,date:d,week:week,idx:lessonIdx});
  lessonIdx++; slot++; if(slot===2){slot=0;week++;}
});
const lessons = sessions.filter(s=>!s.mt);
window.IVY_COURSE={PHASES,sessions,lessons,EXAM:new Date(2027,4,24)};
})();

# IVY ÔN CHUYÊN ANH

Website ôn thi vào lớp 10 chuyên Anh (Hưng Yên) – lộ trình 90 buổi, 5 giai đoạn, 9 Mock Test.

**Trang web:** https://ivyonchuyen.github.io/ivy-on-chuyen/

## Cấu trúc

| Đường dẫn | Nội dung |
|---|---|
| `index.html` | Trang chủ: Hôm nay · **Vào học** (chọn buổi và học ngay trong trang) · Lộ trình · Listening · Vocab |
| `buoi-1/` | B00–B01 · Mock Test 0 chẩn đoán |
| `buoi-2/` | B02 · Từ loại |
| `lesson.html?b=B03` … `B89` | Khung bài học dùng chung; nội dung ở `data/Bxx.js` |
| `de-on-1/` | Đề ôn Chuyên Anh số 1 (làm online, dùng cho MT1) |
| `audio/` | Audio từ vựng (`audio/<slug>.mp3`) và bài nghe (`audio/listen/L-Bxx-n.mp3`) |

## Thêm hoặc sửa một buổi

1. Sửa/tạo `data/Bxx.js` (từ vựng, lý thuyết, luyện tập, bài về nhà).
2. Chạy `node tools/collect_words.js` để cập nhật danh sách từ và lời thoại bài nghe.
3. Đẩy lên `main`. GitHub Actions (`Tạo audio Gemini`) tự gọi Gemini TTS tạo audio còn thiếu,
   tự lưu vào repo; nếu hết lượt miễn phí trong ngày, lần chạy tự động sau (mỗi 3 giờ) sẽ làm tiếp.
   Trong lúc chờ, trang dùng giọng đọc của trình duyệt.

Cần secret `GEMINI_API_KEY` trong Settings → Secrets and variables → Actions.

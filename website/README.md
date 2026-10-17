# Website thuyết trình, Nhóm 2

Tiểu luận: *Phân tích sự khác biệt về chế độ kế toán và BCTC Ban Quản lý dự án (TT 195/2012/TT-BTC) và BCTC doanh nghiệp (TT 200/2014/TT-BTC)*.

## Mở trang

Cách dễ nhất: mở **`nhom2-thuyet-trinh.html`**, một file duy nhất đã nhúng sẵn CSS, JS, số liệu và ảnh báo cáo gốc. Để ở đâu cũng chạy được.

Bản nhiều file: mở `index.html` khi các thư mục `css/`, `js/`, `assets/` nằm cạnh nó. Không cần cài đặt, chạy được offline. Khi có mạng, trang tải font Sora và Inter từ Google Fonts; khi không có mạng, trang dùng font hệ thống.

## Hai chế độ xem

| Nút / phím | Tác dụng |
|---|---|
| **Đọc đầy đủ** (mặc định) | Mỗi tiểu mục có lớp trình bày (một hình chính và ba ý chính lấy từ bài) và lớp **Chi tiết** (mọi dòng so sánh, bảng, số và chip nguồn). |
| **Trình chiếu** | Chỉ lớp trình bày, mỗi tiểu mục một màn 16:9. `↓` `→` `PageDown` `Space` sang màn sau, `↑` `←` `PageUp` lùi lại, `Esc` thoát. |
| `F` | Toàn màn hình |
| `R` hoặc thêm `?review=1` vào đường dẫn | **Chế độ rà soát** (chỉ dành cho nhóm): hiện ghi chú nội bộ, công thức số tính thêm (viền đứt), chỗ làm tròn, chỗ lệch với bài, danh sách chip nguồn. Người xem bình thường không thấy. |
| **In / PDF** | A4 ngang. Trong hộp thoại in: bật "Background graphics", tắt "Headers and footers". Mỗi đối tượng chỉ in một dạng (thường là bảng). |

Đối tượng có nhiều dạng (Bảng 1.1, 1.2, 1.5, 2.2, 3.1, Hình 1.1–1.4, nhiệm vụ và yêu cầu ở 1.1.4) có nút chuyển "Sơ đồ / Bảng / Hình trong bài". Hình do web vẽ ghi mã "Minh họa x-A … (minh họa)", không mượn số hình của bài.

Chip nguồn BQLDA ("B01 tr.2", "B04 V.06 tr.6"…) bấm để mở đúng trang scan; Phụ lục 3 có đủ 12 trang. Chip Hòa Phát ghi số trang theo chú dẫn của bài; chỗ bài không ghi trang thì ghi "Bài, mục x.y".

## Cấu trúc nội dung (bản 4)

- `js/content.js`: các hàng so sánh chia đôi (trái BQLDA, phải Doanh nghiệp) và `KEYS` (ba ý chính mỗi tiểu mục, lấy từ câu kết luận trong bài).
- `js/viz.js`: hình chính và hình phụ của từng tiểu mục.
- `js/review.js`: nội dung Chế độ rà soát.
- `content/phan_mo_dau.md`, `content/phu_luc_1.md`: phần nhóm tự viết. Mục trống thì web ẩn.
- `can_sua_trong_bai.md`: những chỗ bài cần sửa (web không tự sửa lặng lẽ).
- `assets/`: ảnh WebP (logo, Hình 1.1–1.4 và 2.1–2.8 trích từ bài, 12 trang BCTC BQLDA).

Sau khi sửa: `python3 website/tools/build_single.py` (tự sinh `js/md.js` và file một trang `nhom2-thuyet-trinh.html`, khoảng 2,2 MB).
Xuất PDF: `NODE_PATH=$(npm root -g) node website/tools/export_pdf.js` → `nhom2-thuyet-trinh.pdf` (không có đầu trang, chân trang).

## Sửa số liệu

Toàn bộ số liệu nằm trong `js/data.js`. Quy ước làm tròn toàn trang ở `fmt` (BQLDA: tỷ đồng 3 chữ số thập phân; %: 1 chữ số).

- Số của BQLDA ghi bằng **đồng**, chép nguyên từ BCTC scan.
- Số của Hòa Phát ghi bằng **tỷ đồng**, đúng như bài.

Trang tự định dạng số theo kiểu Việt Nam. Mỗi chỗ hiển thị số trong `index.html` là một thẻ có thuộc tính `data-v="đường.dẫn"` (đường dẫn tới số trong `data.js`) và `data-d` (số chữ số thập phân).

## Kiểm tra

```bash
node website/tests/check-data.js                                   # đối chiếu nội bộ: cân đối, tổng cộng, tỷ lệ %, thác nước, quy ước làm tròn
NODE_PATH=$(npm root -g) node website/tests/verify-page.js /tmp    # mọi số trên trang = data.js (cần Playwright)
NODE_PATH=$(npm root -g) node website/tests/check-outline.js       # đủ mọi mục; trái luôn là BQLDA; không còn ghi chú nội bộ; số hiệu Hình/Bảng không trùng; ảnh scan mở được
```

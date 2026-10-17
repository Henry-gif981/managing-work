# Website thuyết trình, Nhóm 2

Tiểu luận: *Phân tích sự khác biệt về chế độ kế toán và BCTC Ban Quản lý dự án (TT 195/2012/TT-BTC) và BCTC doanh nghiệp (TT 200/2014/TT-BTC)*.

## Mở trang

Cách dễ nhất: mở **`nhom2-thuyet-trinh.html`**, một file duy nhất đã nhúng sẵn CSS, JS, số liệu và ảnh báo cáo gốc. Để ở đâu cũng chạy được.

Bản nhiều file: mở `index.html` khi các thư mục `css/`, `js/`, `assets/` nằm cạnh nó. Không cần cài đặt, chạy được offline. Khi có mạng, trang tải font Sora và Inter từ Google Fonts; khi không có mạng, trang dùng font hệ thống.

## Trình chiếu

| Phím / nút | Tác dụng |
|---|---|
| Nút **Trình chiếu** | Bật hoặc tắt chế độ trình chiếu. Mỗi tiểu mục được tự chia thành các màn 16:9, nhãn dạng "2.2.2 (1/3)", tối đa 4 hàng so sánh mỗi màn. |
| Nút **Mục lục** | Mở danh sách tiểu mục của từng chương để nhảy nhanh |
| `F` | Bật hoặc tắt toàn màn hình. Khi vào toàn màn hình, chế độ trình chiếu cũng tự bật. |
| `↓` `→` `PageDown` `Space` | Sang trang sau (khi trình chiếu) |
| `↑` `←` `PageUp` | Lùi lại (khi trình chiếu) |
| `→` `←` khi xem tự do | Nhảy giữa các tiểu mục |
| `Esc` | Thoát trình chiếu |
| Nút **In / lưu PDF** | In với bố cục gọn, khổ A4 ngang. Bản in giữ bố cục chia đôi BQLDA / Doanh nghiệp và đủ mọi hàng so sánh. |

## Cấu trúc nội dung (bản 3)

Trang đi đúng thứ tự bài: Danh mục từ viết tắt, Phần mở đầu, Chương 1 (1.1.1–1.3.3), Chương 2 (2.1.1–2.5), Chương 3 (3.1–3.3), Kết luận, Phụ lục, Tài liệu tham khảo.

- Đồ họa đại diện: **BQLDA là “dòng vốn một chiều”** (chủ đầu tư → TK 336 → BQLDA → bình TK 241 → bàn giao, không xác định lãi lỗ); **doanh nghiệp là “vòng kết quả khép kín”** (vốn → đầu tư, sản xuất → doanh thu → kết quả → lợi nhuận giữ lại, tâm là lãi, lỗ). Icon ống dẫn và vòng tròn đánh dấu hai bên ở mọi nơi.
- Mỗi tiểu mục mở đầu bằng một hình hoặc biểu đồ (`js/viz.js`, chỉ SVG/CSS, số lấy từ `data.js`). Rê chuột hoặc Tab vào thanh, ô, đoạn để xem số chính xác và nguồn.
- Chữ chi tiết của bài nằm ở lớp thứ hai: nút “Xem chi tiết theo bài”, bấm tên hàng so sánh để mở phần diễn giải, hoặc “Mở tất cả chi tiết”. Khi in, mọi lớp tự mở.
- Số do nhóm tính thêm (tỷ lệ %, số đầu năm suy ngược, số dư chữ T) ghi công thức trong `data.js` (nhóm `calc`, `tAcc`) và gắn chip viền đứt “tính từ số liệu bài”, dấu * trên biểu đồ.
- Mọi so sánh trực tiếp dùng bố cục chia đôi: **trái BQLDA (TT 195), phải Doanh nghiệp (TT 200 / Hòa Phát)**.
- Các hàng so sánh nằm trong `js/content.js`. Trong câu chữ, số được viết dạng `{đường.dẫn|số lẻ}` và lấy từ `data.js`.
- Ảnh báo cáo gốc (Hình 2.1–2.8 trích từ bài, các trang BCTC BQLDA) nằm trong `assets/`, mở bằng nút "Xem báo cáo gốc".
- Sau khi sửa, chạy `python3 website/tools/build_single.py` để đóng gói lại file một trang.

## Sửa số liệu

Toàn bộ số liệu nằm trong `js/data.js`:

- Số của BQLDA ghi bằng **đồng**, chép nguyên từ BCTC scan.
- Số của Hòa Phát ghi bằng **tỷ đồng**, đúng như bài.

Trang tự định dạng số theo kiểu Việt Nam. Mỗi chỗ hiển thị số trong `index.html` là một thẻ có thuộc tính `data-v="đường.dẫn"` (đường dẫn tới số trong `data.js`) và `data-d` (số chữ số thập phân).

## Kiểm tra

```bash
node website/tests/check-data.js                                   # đối chiếu nội bộ: cân đối, tổng cộng, tỷ lệ %
NODE_PATH=$(npm root -g) node website/tests/verify-page.js /tmp    # mọi số trên trang = data.js (cần Playwright)
NODE_PATH=$(npm root -g) node website/tests/check-outline.js       # đủ mọi mục; trái luôn là BQLDA; hình đứng đầu tiểu mục; không còn đồ họa cũ
```

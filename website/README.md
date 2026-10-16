# Website thuyết trình, Nhóm 2

Tiểu luận: *Phân tích sự khác biệt về chế độ kế toán và BCTC Ban Quản lý dự án (TT 195/2012/TT-BTC) và BCTC doanh nghiệp (TT 200/2014/TT-BTC)*.

## Mở trang

Mở `index.html` bằng trình duyệt. Không cần cài đặt, chạy được offline. Khi có mạng, trang tải font Sora và Inter từ Google Fonts; khi không có mạng, trang dùng font hệ thống.

## Trình chiếu

| Phím / nút | Tác dụng |
|---|---|
| Nút **Trình chiếu** | Bật hoặc tắt chế độ trình chiếu. Mỗi phần được chia thành các trang 16:9 vừa một màn hình. |
| `F` | Bật hoặc tắt toàn màn hình. Khi vào toàn màn hình, chế độ trình chiếu cũng tự bật. |
| `↓` `→` `PageDown` `Space` | Sang trang sau (khi trình chiếu) |
| `↑` `←` `PageUp` | Lùi lại (khi trình chiếu) |
| `→` `←` khi xem tự do | Nhảy giữa các phần 00–10 |
| `Esc` | Thoát trình chiếu |
| Nút **In / lưu PDF** | In với bố cục gọn, khổ A4 ngang. Trên bản in, mọi tab và cả hai cột BQLDA / Doanh nghiệp đều hiện đủ. |

## Sửa số liệu

Toàn bộ số liệu nằm trong `js/data.js`:

- Số của BQLDA ghi bằng **đồng**, chép nguyên từ BCTC scan.
- Số của Hòa Phát ghi bằng **tỷ đồng**, đúng như bài.

Trang tự định dạng số theo kiểu Việt Nam. Mỗi chỗ hiển thị số trong `index.html` là một thẻ có thuộc tính `data-v="đường.dẫn"` (đường dẫn tới số trong `data.js`) và `data-d` (số chữ số thập phân).

## Kiểm tra

```bash
node website/tests/check-data.js                                   # đối chiếu nội bộ: cân đối, tổng cộng, tỷ lệ %
NODE_PATH=$(npm root -g) node website/tests/verify-page.js /tmp    # mọi số trên trang = data.js (cần Playwright)
```

# Nội dung do nhóm tự viết

- `phan_mo_dau.md`: ba mục của Phần mở đầu. Mục nào trống thì web ẩn.
- `phu_luc_1.md` (chưa có): Phụ lục 1 "Bảng tổng hợp 24 điểm khác biệt trọng tâm". Khi tạo file này, web tự hiện Phụ lục 1.

Định dạng: mỗi mục bắt đầu bằng `## Tiêu đề`; đoạn văn cách nhau một dòng trống; `- ` là gạch đầu dòng; bảng dùng cú pháp `| a | b |`.
Sau khi sửa, chạy `python3 website/tools/build_single.py` (tự sinh lại `js/md.js` và file một trang).

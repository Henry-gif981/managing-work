/*
 * CHẾ ĐỘ RÀ SOÁT (bản 4, mục B). Chỉ hiện khi bấm phím R hoặc mở trang với ?review=1.
 * Người xem bình thường không thấy gì trong file này.
 */
window.REVIEW = {
  // Công thức của số tính thêm (đường dẫn trong data.js → công thức)
  calc: {
    "calc.bqTsnhTienPct": "4.164.850.000 / 11.947.250.000 = 34,9%",
    "calc.bqTsnhPhaiThu": "B01 mã 130 = trả trước cho người bán 3.200.000.000 + phải thu khác 347.400.000",
    "calc.bqTsnhPhaiThuPct": "3.547.400.000 / 11.947.250.000 = 29,7%",
    "calc.bqTsnhHtkPct": "1.895.000.000 / 11.947.250.000 = 15,9%",
    "calc.bqTsnhGtgtPct": "2.340.000.000 / 11.947.250.000 = 19,6%",
    "calc.hpTsnhConLai": "86.674 − 6.887,6 − 18.974,7 − 4.352,1 − 46.091,2",
    "calc.hpTsConLai": "224.490 − (67.244,2 + 63.655,9 + 46.091,2 + 18.974,7 + 6.887,6 + 4.352,1)",
    "calc.bqNoPtnbPct": "9.820.000.000 / 10.746.300.000 = 91,4%",
    "calc.bqNoKhacPct": "100 − 91,4",
    "calc.bqNoKhac": "10.746.300.000 − 9.820.000.000",
    "calc.hpNoVayPct": "82.963 / 109.842 = 75,5%",
    "calc.hpNoKhacPct": "100 − 75,5",
    "calc.hpNoKhac": "109.842 − 82.963",
    "calc.hpSauBhQl": "18.497,5 − 2.337,3 − 1.545,5",
    "calc.hpSauTaiChinh": "14.614,7 + 2.618,9 − 3.966,6",
    "calc.hpVcshLamTron": "114.647,5 − (102.836,4 + 12.020,0 + 233,1 − 433,1 − 6,3 − 2,6 − 0,1) = 0,1 (chênh lệch do các khoản làm tròn đến 0,1 tỷ)",
    "calc.f03aPct": "số dư cuối năm từng hạng mục / 186.742.500.000",
    "calc.f03bPct": "giá trị từng nội dung / 4.582.450.000",
    "tAcc": "Số dư cộng dồn các bút toán của Bảng 1.5 (triệu đồng)"
  },
  notes: [
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Danh mục từ viết tắt: bài mới có tiêu đề, chưa có nội dung. Bảng viết tắt trên web liệt kê các viết tắt xuất hiện trên trang; nhóm rà lại và chép vào bài." },
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Phần mở đầu: bài mới có ba tiêu đề. Web chỉ hiện mục nào có nội dung trong content/phan_mo_dau.md (hiện cả ba mục trống nên phần này đang ẩn). Mục 3 trong bài có sẵn ghi chú trong ngoặc: “đối chiếu văn bản, so sánh bút toán, minh họa bằng số liệu mẫu”." },
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Bảng 3.2: bài đặt cột “Tư duy Doanh nghiệp (TT 200)” trước; trên trang, BQLDA luôn ở bên trái." },
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Mục 3.2 của bài ghi “Nợ phải trả (chủ yếu là TK 336) lên tới 188,71 tỷ đồng”. Theo B01-CĐT, nợ phải trả là 10,746 tỷ; 188,717 tỷ là nguồn vốn đầu tư (TK 3361, mã 410, mục B). Web dùng số theo B01 và không nhắc lại câu của bài." },
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Mục 3.2 của bài ghi 69,73 tỷ chi phí phát sinh; B03 là 69.738.950.000 đồng, hiển thị 69,739 tỷ." },
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Chip nguồn: “B01 tr.2” là biểu và trang trong BCTC BQLDA (bấm để mở trang scan); “Hòa Phát tr.44” là trang BCTC Hòa Phát mà bài trích dẫn (không có bản scan để mở); “Bài, mục x.y” là chỗ bài không ghi trang." },
    { g: "Làm tròn", t: "Quy ước toàn trang (data.js → fmt): số BQLDA hiển thị theo tỷ đồng với 3 chữ số thập phân; số Hòa Phát giữ số chữ số thập phân như bài; tỷ lệ % 1 chữ số thập phân." },
    { g: "Làm tròn", t: "Vốn chủ sở hữu Hòa Phát đầu năm dùng số gốc 102.836,4 tỷ (B01 Hòa Phát 1/1/2024: 102.836.419.239.379 đồng; Hình 2.7). Các khoản biến động làm tròn đến 0,1 tỷ nên biểu đồ có dòng “Khác (chênh lệch làm tròn)” 0,1 tỷ." },
    { g: "Làm tròn", t: "F02 vốn vay: 51.249.900.000 + 36.500.000.000 − 1.622.450.000 = 86.127.450.000 (86,127 tỷ). Ba thành phần làm tròn 3 chữ số (51,250; 36,500; 1,622) cộng ra 86,128." },
    { g: "Làm tròn", t: "Hòa Phát: vốn chủ sở hữu ghi 114.647 (Bảng 2.2, làm tròn tỷ) và 114.647,5 (mục 2.3.1). Web giữ đúng từng chỗ như bài." },
    { g: "Khấu hao Hòa Phát (hai phạm vi)", t: "6.915,7 tỷ là “khấu hao và phân bổ” (lưu chuyển tiền tệ tr.12, thuyết minh tr.61), dùng ở mục 2.2.3. 6.810,7 tỷ là “khấu hao TSCĐ hữu hình trong năm” (thuyết minh 11, tr.41), dùng ở mục 2.5." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 1.3.2: bỏ câu giải thích thời hạn 30 ngày “vì báo cáo của BQLDA là đầu vào để chủ đầu tư tổng hợp” (chưa có căn cứ)." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 2.2.4: Hòa Phát không có phải trả nội bộ — web ghi “Không có trên báo cáo hợp nhất”, bỏ lý do “không có chủ đầu tư”." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 2.2.7: thay câu “Nguyên nhân là mẫu biểu” bằng “Mẫu B01-CĐT có phần chỉ tiêu ngoài bảng; mẫu B01-DN/HN (hợp nhất) không có dòng này”." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 2.4.1: tỷ lệ 23,6% / 76,4% trộn số tăng XDCB với chi phí trong kỳ; chỉ giữ ở lớp chi tiết kèm chú thích." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 2.4.1: các thành phần doanh thu thuần trong bài cộng ra 138.846,7, lệch 8,4 tỷ so với 138.855,1; web chỉ hiện tổng." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 2.5: bàn giao 30/10/2015, quyết định phê duyệt quyết toán 12/11/2015; web hiện cả hai ngày, không khẳng định ngày ghi bút toán." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Bảng 1.3: bỏ “(xem lưu ý ở mục 1.2.4)” vì mục 1.2.4 không có lưu ý này." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Chữ “hiện hành” khi nói về Thông tư 195 và 200 được thay bằng “áp dụng cho kỳ báo cáo được phân tích (2015 và 2024)”." }
  ]
};

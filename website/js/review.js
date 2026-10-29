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
    "calc.hpTsConLai": "81.793,077 − (80.585,847 + 382,020 + 319,258 + 281,047 + 92,443 + 59,554) = 72,908",
    "calc.hpPct": "Tỷ trọng Hòa Phát: khoản mục / tổng tài sản 81.793,077 (Bảng 2.2), / tài sản ngắn hạn 1.015,072 (2.2.2), / nợ phải trả 1.012,890 (2.2.4); làm tròn 1 chữ số, XDCB 3 chữ số, hàng tồn kho 2 chữ số",
    "calc.hpNoConLai": "Nợ phải trả 1.012,890 − quỹ khen thưởng, phúc lợi 938,462 = 74,428 (hiệu số, không phải chỉ tiêu trên báo cáo)",
    "calc.hpXdcbTang": "XDCB cuối năm 5,560 − đầu năm 0,878 = 4,682",
    "calc.hpMuaTSCD": "LCTT mã 21: −18,154 = tăng nguyên giá TSCĐ hữu hình 13,472 + tăng XDCB 4,682",
    "calc.hpGopVon": "LCTT mã 25: chi góp vốn vào công ty con 11.290,000",
    "calc.hpChoVay": "Cho vay ngắn hạn 196,900 + dài hạn 19,000 = 215,900 (tm 6)",
    "calc.hpTlConLai": "Thanh lý, xóa sổ TSCĐ hữu hình: nguyên giá 17,598 − hao mòn 16,506 = 1,092",
    "calc.hpLnstLanDtt": "Lợi nhuận sau thuế 10.247,400 / doanh thu thuần 336,838 ≈ 30,4 lần",
    "calc.hpQuyMoLan": "Tổng tài sản Hòa Phát 81.793,077 / BQLDA 199,464 ≈ 410",
    "calc.bqNoPtnbPct": "9.820.000.000 / 10.746.300.000 = 91,4%",
    "calc.bqNoKhacPct": "100 − 91,4",
    "calc.bqNoKhac": "10.746.300.000 − 9.820.000.000",
    "calc.hpSauBhQl": "Lợi nhuận gộp 67,667 − bán hàng 0,003 − quản lý 121,220 = −53,556 (âm)",
    "calc.f03aPct": "số dư cuối năm từng hạng mục / 186.742.500.000",
    "calc.f03bPct": "giá trị từng nội dung / 4.582.450.000",
    "tAcc": "Số dư cộng dồn các bút toán của Bảng 1.5 (triệu đồng)"
  },
  notes: [
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Bảng 3.2: bài đặt cột “Tư duy Doanh nghiệp (TT 200)” trước; trên trang, BQLDA luôn ở bên trái." },
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Mục 3.2 của bài ghi “Nợ phải trả (chủ yếu là TK 336) lên tới 188,71 tỷ đồng”. Theo B01-CĐT, nợ phải trả là 10,746 tỷ; 188,717 tỷ là nguồn vốn đầu tư (TK 3361, mã 410, mục B). Web dùng số theo B01 và không nhắc lại câu của bài." },
    { g: "Ghi chú nội bộ (trước đây hiện trên trang)", t: "Mục 3.2 của bài ghi 69,73 tỷ chi phí phát sinh; B03 là 69.738.950.000 đồng, hiển thị 69,739 tỷ." },
    { g: "Quy ước chip nguồn", t: "“B01 tr.2” là biểu và trang trong BCTC BQLDA (bấm để mở trang scan); “Hòa Phát tr.N, tm X” là trang in N (1–39) và thuyết minh X (1–28) trong BCTC riêng Hòa Phát 2024 (bấm để mở ảnh trang; trang PDF = trang in + 1); “Bài, mục x.y” là chỗ bài không ghi trang." },
    { g: "Làm tròn", t: "Quy ước toàn trang (data.js → fmt): số BQLDA và Hòa Phát hiển thị theo tỷ đồng, thường 3 chữ số thập phân; tỷ lệ % tính bằng code, 1 chữ số thập phân." },
    { g: "Khấu hao Hòa Phát (hai phạm vi)", t: "46,968 tỷ là “khấu hao và phân bổ” (LCTT mã 02, tr.10; tm 25), dùng ở mục 2.2.3. 32,359 tỷ là “khấu hao TSCĐ hữu hình trong năm” (tm 8, tr.21), dùng ở mục 2.5." },
    { g: "Lệch giữa bài và BCTC riêng", t: "Mục 2.2.4: bài ghi quỹ khen thưởng, phúc lợi chiếm 92,6% nợ phải trả; tính từ 938,462 / 1.012,890 là 92,7%. Web dùng 92,7%." },
    { g: "Lệch giữa bài và BCTC riêng", t: "Các mã 21–27 của LCTT (hoạt động đầu tư) nằm ở trang in 10, không phải tr.11; chip trên web ghi tr.10." },
    { g: "Lệch giữa bài và BCTC riêng", t: "Mục 3.2 và Kết luận của bài còn dùng số vốn chủ sở hữu và lợi nhuận chưa phân phối của BCTC hợp nhất cũ; web dùng số BCTC riêng 80.780 và 16.029." },
    { g: "Lệch giữa bài và BCTC riêng", t: "Phần mở đầu và TLTK của bài còn ghi “BCTC hợp nhất”; web ghi BCTC riêng. TLTK [7] bài ghi năm 2016, web ghi 2015 (năm của bộ BCTC BQLDA)." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 2.2.7 (chỉ tiêu ngoài bảng) bài mới đã bỏ; web vẫn giữ, chờ nhóm quyết định." },
    { g: "Làm tròn", t: "F02 vốn vay: 51.249.900.000 + 36.500.000.000 − 1.622.450.000 = 86.127.450.000 (86,127 tỷ). Ba thành phần làm tròn 3 chữ số (51,250; 36,500; 1,622) cộng ra 86,128." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 1.3.2: bỏ câu giải thích thời hạn 30 ngày “vì báo cáo của BQLDA là đầu vào để chủ đầu tư tổng hợp” (chưa có căn cứ)." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Mục 2.5: bàn giao 30/10/2015, quyết định phê duyệt quyết toán 12/11/2015; web hiện cả hai ngày, không khẳng định ngày ghi bút toán." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Bảng 1.3: bỏ “(xem lưu ý ở mục 1.2.4)” vì mục 1.2.4 không có lưu ý này." },
    { g: "Lệch với bài, web diễn đạt trung tính", t: "Chữ “hiện hành” khi nói về Thông tư 195 và 200 được thay bằng “áp dụng cho kỳ báo cáo được phân tích (2015 và 2024)”." }
  ]
};

/*
 * NỘI DUNG CÁC "SÂN KHẤU" CHIA ĐÔI (trái: BQLDA, TT 195 · phải: Doanh nghiệp, TT 200 / Hòa Phát).
 * Nguồn câu chữ: baocao.pdf, theo đúng thứ tự tiểu mục. Số liệu KHÔNG gõ tay ở đây mà tham chiếu data.js:
 *   {bq.b01.tien|3}         → số trong data.js, 3 chữ số thập phân (BQLDA tự đổi đồng → tỷ)
 *   {bq.b01.tienMat|1|trieu} → đổi sang triệu đồng
 *   {t:bq.f03b.soQd}        → chuỗi chữ trong data.js
 * Mỗi hàng: { k: nhãn khoản mục, bq: thẻ trái, dn: thẻ phải }.
 * Thẻ: { m: số/ý chính (in lớn), d: mô tả, s: chip nguồn } hoặc { none: lý do } khi bên đó "Không có".
 */
window.CONTENT = {
  /* ---------- Chương 1, mục 1.3.2 ---------- */
  b14: {
    id: "b14",
    generic: true,
    title: "Bảng 1.4. So sánh tổng quát chế độ kế toán BQLDA và chế độ kế toán doanh nghiệp",
    rows: [
      { k: "Đối tượng áp dụng",
        bq: { d: "Chủ đầu tư có thành lập BQLDA và các BQLDA có tổ chức kế toán riêng." },
        dn: { d: "Doanh nghiệp thuộc mọi lĩnh vực, mọi thành phần kinh tế." } },
      { k: "1. Mục đích hạch toán",
        bq: { d: "Phản ánh nguồn vốn đầu tư và chi phí thực hiện đầu tư; quyết toán vốn, bàn giao tài sản. BQLDA không tự xác định kết quả kinh doanh: doanh thu, thu nhập khác, chênh lệch tỷ giá được kết chuyển về chủ đầu tư." },
        dn: { d: "Phản ánh toàn bộ hoạt động sản xuất kinh doanh; xác định kết quả kinh doanh và tình hình tài chính để cung cấp cho chủ sở hữu, nhà đầu tư, cơ quan nhà nước." } },
      { k: "2. Hệ thống tài khoản",
        bq: { d: "Dựa trên hệ thống tài khoản doanh nghiệp, có sửa đổi, bổ sung, đổi tên (Phụ lục 1a): TK 241 “Chi phí đầu tư xây dựng”, TK 154 “Chi phí sản xuất thử dở dang”, TK 336 (4 TK cấp 2), TK 642 “Chi phí BQLDAĐT”, TK 152 (7 TK cấp 2). Sửa, bổ sung tài khoản cấp 1, cấp 2 phải được Bộ Tài chính chấp thuận bằng văn bản." },
        dn: { d: "Hệ thống tài khoản theo Thông tư 200: loại 1 đến 9 và ngoài bảng (loại 0); TK 241 “Xây dựng cơ bản dở dang” (2411, 2412, 2413); TK 411, 421, 511, 632, 641, 642, 911…" } },
      { k: "3. Nghiệp vụ đặc thù",
        bq: { d: "Nhận vốn đầu tư (TK 336); tập hợp chi phí theo dự án, công trình (TK 241); phân bổ chi phí BQLDA; vật liệu, thiết bị giao nhà thầu; chạy thử, sản xuất thử; thanh toán nội bộ (TK 136, 336); quyết toán và bàn giao công trình." },
        dn: { d: "Bán hàng, cung cấp dịch vụ; ghi nhận doanh thu và giá vốn; chi phí bán hàng, quản lý; khấu hao, dự phòng; thuế thu nhập doanh nghiệp; phân phối lợi nhuận; hợp nhất (nếu có)." } },
      { k: "4. Hệ thống báo cáo tài chính",
        bq: { d: "B01-CĐT Bảng cân đối kế toán; B02-CĐT Nguồn vốn đầu tư; B03-CĐT Thực hiện đầu tư xây dựng; B04-CĐT Thuyết minh; 5 phụ biểu F02, F03A, F03B, F03C, F03D." },
        dn: { d: "B01-DN Bảng cân đối kế toán; B02-DN Kết quả hoạt động kinh doanh; B03-DN Lưu chuyển tiền tệ; B09-DN Thuyết minh; báo cáo giữa niên độ." } },
      { k: "5. Thời hạn lập, nộp báo cáo tài chính",
        bq: { m: "Quý {thoiHan.bq.quy|0} ngày · năm {thoiHan.bq.nam|0} ngày", d: "Kể từ ngày kết thúc kỳ." },
        dn: { m: "Quý {thoiHan.dn.quy|0} ngày · năm {thoiHan.dn.nam|0} ngày", d: "Quý {thoiHan.dnRieng.quy|0} ngày với công ty mẹ, tổng công ty nhà nước; năm {thoiHan.dnRieng.nam|0} ngày với doanh nghiệp tư nhân, công ty hợp danh." } },
      { k: "Nơi nhận báo cáo",
        bq: { d: "BQLDA cấp trên, chủ đầu tư, cấp trên của chủ đầu tư; cơ quan thống kê (chỉ báo cáo năm)." },
        dn: { d: "Nơi nhận theo Điều 110 Thông tư 200, tùy loại hình doanh nghiệp." } }
    ]
  },

  flow: {
    id: "flow",
    generic: true,
    title: "Hình 1.3. So sánh dòng hạch toán của BQLDA và doanh nghiệp",
    rows: [
      { k: "Bước 1", bq: { m: "Nhận vốn đầu tư từ chủ đầu tư", d: "Nợ TK 111, 112 / Có TK 336" }, dn: { m: "Huy động vốn chủ sở hữu, vốn vay", d: "Nợ TK 111, 112 / Có TK 411, 341" } },
      { k: "Bước 2", bq: { m: "Tập hợp chi phí đầu tư xây dựng", d: "Nợ TK 241 / Có TK 111, 112, 331" }, dn: { m: "Đầu tư xây dựng cơ bản (nếu có)", d: "Nợ TK 241 / Có TK 111, 112, 331" } },
      { k: "Bước 3", bq: { m: "Chi phí hoạt động của BQLDA", d: "Nợ TK 642 <svg class='ic ar' role='img' aria-label='sang'><use href='#i-arrow-r'/></svg> phân bổ: Nợ TK 241 / Có TK 642" }, dn: { m: "Doanh thu và chi phí kinh doanh", d: "Có TK 511; Nợ TK 632, 641, 642" } },
      { k: "Bước 4", bq: { m: "Quyết toán vốn đầu tư được duyệt", d: "Nợ TK 336 / Có TK 241 (bàn giao tài sản)" }, dn: { m: "Cuối kỳ kết chuyển", d: "Xác định kết quả (TK 911), lãi chuyển sang TK 421" } },
      { k: "Bước 5: kết quả cuối cùng", bq: { m: "Không xác định lãi, lỗ", d: "Báo cáo nguồn vốn và thực hiện đầu tư (B02, B03/CĐT)" }, dn: { m: "Xác định lãi, lỗ", d: "Bảng cân đối kế toán, KQHĐKD, lưu chuyển tiền tệ (B01 – B03, B09/DN)" } }
    ]
  },

  b15: {
    id: "b15",
    generic: true,
    title: "Bảng 1.5. Minh họa hạch toán cùng một chuỗi nghiệp vụ (đơn vị: triệu đồng)",
    rows: [
      { k: "1. Nhận nguồn vốn {viDu.nhanVon|0}",
        bq: { m: "Nợ TK 112 / Có TK 336 (3361): {viDu.nhanVon|0}", d: "Chủ đầu tư cấp vốn." },
        dn: { m: "Nợ TK 112 / Có TK 341: {viDu.nhanVon|0}", d: "Doanh nghiệp vay ngân hàng." } },
      { k: "2. Nghiệm thu khối lượng xây lắp {viDu.nghiemThu|0}, chưa thanh toán",
        bq: { m: "Nợ TK 241 / Có TK 331: {viDu.nghiemThu|0}" },
        dn: { m: "Nợ TK 241 (2412) / Có TK 331: {viDu.nghiemThu|0}" } },
      { k: "3. Lương nhân viên quản lý {viDu.luong|0}",
        bq: { m: "Nợ TK 642 / Có TK 334: {viDu.luong|0}", d: "Phân bổ vào dự án: Nợ TK 241 / Có TK 642: {viDu.luong|0}" },
        dn: { m: "Nợ TK 642 / Có TK 334: {viDu.luong|0}", d: "Tính vào chi phí kỳ." } },
      { k: "4. Công trình hoàn thành, bàn giao",
        bq: { m: "Nợ TK 336 / Có TK 241: {viDu.banGiaoBq|0}", d: "Quyết toán được duyệt. Không ghi nhận lãi, lỗ." },
        dn: { m: "Nợ TK 211 / Có TK 241: {viDu.banGiaoDn|0}", d: "Nhận tài sản đưa vào sử dụng. Chi phí {viDu.chiPhiKy|0} nằm trong lãi, lỗ của kỳ." } }
    ]
  },

  /* ---------- Chương 2 ---------- */
  s212: {
    id: "s212",
    title: "Vốn cấp thêm và tiến độ thực hiện (mục 2.1.2)",
    rows: [
      { k: "Vốn cấp thêm trong năm",
        bq: { m: "{bq.b02.tang|3} tỷ", d: "Chủ đầu tư cấp thêm trong năm 2015: {bq.b02.tangTien|3} tỷ bằng tiền và {bq.b02.tangVatTu|3} tỷ bằng vật tư, thiết bị.", s: "B02 tr.3" },
        dn: { m: "Vốn tự tích lũy (lợi nhuận)", d: "Vốn chủ sở hữu tăng chủ yếu từ lợi nhuận (xem mục 2.3)." } },
      { k: "Lũy kế vốn đầu tư thực hiện",
        bq: { m: "{bq.b03.luyKe|2} tỷ", d: "Từ khởi công đến 31/12/2015, đạt {bq.b03.tyLe|1}% tổng mức đầu tư {bq.b03.tongMuc|0} tỷ. Khớp với số dư chi phí xây dựng dở dang ({bq.b01.tk241|3} tỷ) cộng giá trị hạng mục đã quyết toán, bàn giao ({bq.b03.quyetToan|3} tỷ).", s: "B03 tr.4; B04 VI.1" },
        dn: { none: "Không có khái niệm tổng mức của công ty mẹ (mục 2.3.2)." } }
    ]
  },

  b32: {
    id: "b32",
    generic: true,
    title: "Bảng 3.2. Các điểm khác biệt cốt lõi về nhận thức khi phân tích BCTC BQLDA",
    heads: ["Thực tế tại BQLDA (TT 195)", "Tư duy Doanh nghiệp (TT 200)"],
    rows: [
      { k: "Cơ cấu tài sản",
        bq: { d: "Tài sản chủ yếu là giá trị công trình đang hình thành; chi phí XDCB dở dang chiếm tỷ trọng tuyệt đối." },
        dn: { d: "Tài sản đa dạng, phục vụ hoạt động sản xuất kinh doanh (tiền, hàng tồn kho, tài sản cố định)." } },
      { k: "Cơ cấu nguồn vốn",
        bq: { d: "Không ghi nhận vốn chủ sở hữu; toàn bộ nguồn lực cấp phát được theo dõi dưới dạng phải trả nội bộ (TK 336)." },
        dn: { d: "Phân tách rõ ràng giữa nợ phải trả và vốn chủ sở hữu (bao gồm vốn góp và lợi nhuận tích lũy)." } },
      { k: "Hiệu quả hoạt động",
        bq: { d: "Đánh giá thông qua Báo cáo thực hiện đầu tư (B03-CĐT) dựa trên tiến độ giải ngân và tuân thủ tổng mức đầu tư." },
        dn: { d: "Sử dụng Báo cáo kết quả hoạt động kinh doanh (B02-DN) để xác định doanh thu, chi phí, lợi nhuận." } }
    ]
  },

  b21: {
    id: "b21",
    title: "Bảng 2.1. Thông tin chung về hai bộ Báo cáo tài chính được phân tích",
    rows: [
      { k: "Đơn vị", bq: { m: "BQLDA Nhà máy Chế biến Nông sản Đồng Bằng" }, dn: { m: "Công ty CP Tập đoàn Hòa Phát (BCTC riêng)" } },
      { k: "Chủ thể lập báo cáo", bq: { d: "Đơn vị trực thuộc chủ đầu tư, có tổ chức kế toán riêng" }, dn: { d: "Công ty mẹ, pháp nhân riêng, không hợp nhất công ty con", s: "Hòa Phát tr.12, tm 1" } },
      { k: "Chế độ kế toán áp dụng",
        bq: { d: "Thông tư 195/2012/TT-BTC; nội dung không được hướng dẫn thì theo Luật Kế toán và chế độ kế toán doanh nghiệp (thuyết minh B04 nêu Quyết định 15/2006/QĐ-BTC và Thông tư 244/2009/TT-BTC)", s: "B04 III.1 tr.5" },
        dn: { d: "Chế độ kế toán doanh nghiệp theo Thông tư 200/2014/TT-BTC; mẫu B01, B02, B03, B09-DN", s: "Hòa Phát tr.6" } },
      { k: "Kỳ báo cáo, ngày lập", bq: { m: "Năm 2015", d: "Lập ngày {t:bq.info.ngayLapBCTC}", s: "B01 tr.2" }, dn: { m: "Năm 2024", d: "Ký ngày {t:hp.ngayKy}; kiểm toán: Công ty TNHH KPMG (báo cáo số {t:hp.soBCKT})", s: "Hòa Phát tr.5" } },
      { k: "Bộ báo cáo", bq: { d: "B01, B02, B03, B04-CĐT; phụ biểu F02, F03A, F03B, F03C, F03D-CĐT", s: "tr.1" }, dn: { d: "Bảng cân đối kế toán riêng, Báo cáo kết quả hoạt động kinh doanh riêng, Báo cáo lưu chuyển tiền tệ riêng (phương pháp gián tiếp), Thuyết minh" } },
      { k: "Hoạt động chính", bq: { d: "Quản lý dự án đầu tư xây dựng" }, dn: { d: "Cho thuê văn phòng, quảng cáo, mua bán thép, đầu tư tài chính; {hp.nhanVien|0} nhân viên", s: "Hòa Phát tr.12, tm 1.2, 1.4" } },
      { k: "Tổng tài sản cuối kỳ", bq: { m: "{bq.b01.tongTS|3} tỷ đồng", s: "B01 tr.2" }, dn: { m: "{hp.tongTS|3} tỷ đồng", s: "Hòa Phát tr.7" } }
    ]
  },

  b22: {
    id: "b22",
    title: "Bảng 2.2. Quy mô và cơ cấu Bảng cân đối kế toán",
    rows: [
      { k: "Tài sản ngắn hạn", bq: { m: "{bq.b01.tsnh|3} tỷ", d: "{bq.b01.pct.tsnh|1}% tổng tài sản", s: "B01 tr.2" }, dn: { m: "{hp.tsnh|3} tỷ", d: "{calc.hpPct.tsnh|1}% tổng tài sản", s: "Hòa Phát tr.6" } },
      { k: "Tài sản dài hạn", bq: { m: "{bq.b01.tsdh|3} tỷ", d: "{bq.b01.pct.tsdh|1}% tổng tài sản", s: "B01 tr.2" }, dn: { m: "{hp.tsdh|3} tỷ", d: "{calc.hpPct.tsdh|1}% tổng tài sản; đầu tư vào công ty con {calc.hpPct.ctyCon|1}%", s: "Hòa Phát tr.7" } },
      { k: "Trong đó: xây dựng cơ bản dở dang", bq: { m: "{bq.b01.tk241|3} tỷ", d: "{bq.b01.pct.tk241|1}% tổng tài sản", s: "B01 mã 230" }, dn: { m: "{hp.xdcb|3} tỷ", d: "{calc.hpPct.xdcb|3}% tổng tài sản (mã 242)", s: "Hòa Phát tr.7" } },
      { k: "Tổng tài sản", bq: { m: "{bq.b01.tongTS|3} tỷ", d: "100%", s: "B01 tr.2" }, dn: { m: "{hp.tongTS|3} tỷ", d: "100%", s: "Hòa Phát tr.7" } },
      { k: "Nợ phải trả", bq: { m: "{bq.b01.no|3} tỷ", d: "{bq.b01.pct.no|1}% tổng nguồn vốn", s: "B01 mã 300" }, dn: { m: "{hp.no|3} tỷ", d: "{calc.hpPct.no|1}% tổng nguồn vốn", s: "Hòa Phát tr.8" } },
      { k: "Nguồn vốn đầu tư (BQLDA) / Vốn chủ sở hữu (Hòa Phát)", bq: { m: "{bq.b01.nvdt|3} tỷ", d: "{bq.b01.pct.nvdt|1}% tổng nguồn vốn", s: "B01 mã 410" }, dn: { m: "{hp.vcsh|3} tỷ", d: "{calc.hpPct.vcsh|1}% tổng nguồn vốn", s: "Hòa Phát tr.8" } }
    ],
    why: "Ở BQLDA, hơn 93% tổng tài sản là chi phí đầu tư xây dựng dở dang và gần 95% nguồn vốn là nguồn vốn đầu tư do chủ đầu tư cấp; Bảng cân đối kế toán về cơ bản là hình ảnh của một dự án đang thi công. Ở Hòa Phát, {calc.hpPct.ctyCon|1}% tổng tài sản là khoản đầu tư vào công ty con, xây dựng cơ bản dở dang chỉ {calc.hpPct.xdcb|3}%; vốn chủ sở hữu chiếm {calc.hpPct.vcsh|1}% tổng nguồn vốn. Báo cáo riêng phản ánh pháp nhân công ty mẹ, không cộng gộp tài sản, nợ phải trả, doanh thu hay chi phí của các công ty con. Số liệu chỉ để minh họa cách ghi nhận và trình bày, không dùng để so sánh quy mô."
  },

  s221: {
    id: "s221",
    title: "2.2.1. Cơ cấu chung",
    rows: [
      { k: "Tài sản dài hạn", bq: { m: "{bq.b01.pct.tsdh|1}%", d: "{bq.b01.tsdh|2} tỷ đồng: tài sản của Ban hầu như chỉ là công trình đang hình thành.", s: "B01 tr.2" }, dn: { m: "{calc.hpPct.tsdh|1}%", d: "{hp.tsdh|3} tỷ đồng, chủ yếu là khoản đầu tư vào công ty con.", s: "Hòa Phát tr.7" } },
      { k: "Khoản mục lớn nhất", bq: { m: "TK 241: {bq.b01.tk241|2} tỷ", d: "{bq.b01.pct.tk241|1}% tổng tài sản", s: "B01 mã 230" }, dn: { m: "Đầu tư vào công ty con", d: "{hp.dauTuCtyCon|3} tỷ ({calc.hpPct.ctyCon|1}% tổng tài sản); xây dựng cơ bản dở dang chỉ {hp.xdcb|3} tỷ ({calc.hpPct.xdcb|3}%).", s: "Hòa Phát tr.7, tm 11.2" } },
      { k: "Nợ phải trả", bq: { m: "{bq.b01.pct.no|1}%", d: "{bq.b01.no|2} tỷ đồng, gần như toàn là nợ nhà thầu.", s: "B01 mã 300" }, dn: { m: "{calc.hpPct.no|1}%", d: "{hp.no|3} tỷ đồng, toàn bộ là nợ ngắn hạn, không có khoản vay; quỹ khen thưởng, phúc lợi chiếm {calc.hpPct.quyKTPL|1}%.", s: "Hòa Phát tr.8" } },
      { k: "Phần nguồn vốn còn lại", bq: { m: "{bq.b01.pct.nvdt|1}%", d: "Vốn đầu tư do chủ đầu tư cấp {bq.b01.nvdt|2} tỷ đồng: vốn được giao để quản lý rồi quyết toán.", s: "B01 mã 410" }, dn: { m: "{calc.hpPct.vcsh|1}%", d: "Vốn chủ sở hữu {hp.vcsh|3} tỷ đồng: vốn góp, quỹ và lợi nhuận sau thuế chưa phân phối của công ty mẹ.", s: "Hòa Phát tr.8" } }
    ]
  },

  s222: {
    id: "s222",
    title: "2.2.2. So sánh các TK đầu 1: Tài sản ngắn hạn",
    rows: [
      { k: "Tiền",
        bq: { m: "{bq.b01.tien|3} tỷ", d: "Tiền mặt {bq.b01.tienMat|1|trieu} triệu; tiền gửi NH Ngoại thương (TK vốn đầu tư) {bq.b01.nhNgoaiThuong|2|trieu} triệu; tiền gửi NH Công thương (TK hoạt động Ban QLDA) {bq.b01.nhCongThuong|1|trieu} triệu. Tiền vốn đầu tư không thuộc về Ban nên Ban mở tài khoản riêng cho vốn dự án và cho chi phí hoạt động.", s: "B04 V.01 tr.5" },
        dn: { m: "{hp.tien|3} tỷ", d: "Tiền mặt {hp.tienMat|3}; tiền gửi ngân hàng {hp.tienGui|3}; tương đương tiền {hp.tuongDuongTien|3} tỷ (lãi {hp.laiTDTtu|1}%–{hp.laiTDTden|2}%/năm). Đầu năm {hp.tienDau|3} tỷ.", s: "Hòa Phát tr.18, tm 4.1" } },
      { k: "Đầu tư tài chính (mã 120)",
        bq: { none: "Ban không được dùng vốn đầu tư để sinh lời; lãi tiền gửi nhàn rỗi ghi TK 3368 rồi nộp chủ đầu tư.", s: "B04 IV.7 tr.5" },
        dn: { m: "{hp.dauTuTC|3} tỷ", d: "Đầu tư nắm giữ đến ngày đáo hạn: tiền gửi có kỳ hạn gốc trên 3 tháng, lãi {hp.laiDTTCtu|1}%–{hp.laiDTTCden|1}%/năm (đầu năm {hp.laiDTTCtuDau|1}%–{hp.laiDTTCdenDau|1}%); đầu năm {hp.dauTuTCDau|3} tỷ.", s: "Hòa Phát tr.24, tm 11.1" } },
      { k: "Phải thu khách hàng (mã 131)",
        bq: { none: "Ban không bán hàng nên không phát sinh phải thu thương mại." },
        dn: { m: "{hp.phaiThuKH|3} tỷ", d: "{hp.phaiThuKHPctCtyCon|1}% là phải thu các công ty con và bên liên quan: doanh thu của công ty mẹ chủ yếu là dịch vụ cung cấp cho công ty con.", s: "Hòa Phát tr.18, tm 5" } },
      { k: "Phải thu khác (mã 138)",
        bq: { m: "{bq.b01.phaiThuKhac|1|trieu} triệu", d: "Tạm ứng cán bộ (TK 141) {bq.b01.tamUng|0|trieu} triệu và phải thu khác (TK 1388) {bq.b01.tk1388|1|trieu} triệu. Ban chỉ có tạm ứng nội bộ.", s: "B04 V.03 tr.6" },
        dn: { m: "{hp.phaiThuKhac|3} tỷ", d: "Mã 136: lãi dự thu {hp.ptkLaiDuThu|3}; thanh toán hộ bên liên quan {hp.ptkThanhToanHo|3}; khác {hp.ptkKhac|3} (tỷ đồng).", s: "Hòa Phát tr.20, tm 7.1" } },
      { k: "Phải thu về cho vay ngắn hạn (mã 135)",
        bq: { none: "Không có: Ban không được dùng vốn đầu tư để sinh lời." },
        dn: { m: "{hp.choVayNH|3} tỷ", d: "Cho các công ty con vay, không có bảo đảm, rút gốc linh hoạt; thêm {hp.choVayDH|3} tỷ cho vay dài hạn. B01 riêng không có dòng dự phòng phải thu khó đòi.", s: "Hòa Phát tr.19, tm 6" } },
      { k: "Thuế GTGT được khấu trừ (mã 152)",
        bq: { m: "{bq.b01.gtgt|2} tỷ", d: "“Đã lập bảng kê và chưa chuyển cho Chủ đầu tư”. Ban không có doanh thu chịu thuế nên không tự khấu trừ; định kỳ chuyển thuế đầu vào cho chủ đầu tư (Nợ TK 336 (3368) / Có TK 133, B04 mục IV.6).", s: "B04 V.05 tr.6" },
        dn: { m: "{hp.gtgt|3} tỷ", d: "Khấu trừ với thuế GTGT đầu ra của chính công ty mẹ.", s: "Hòa Phát tr.6" } },
      { k: "Chi phí trả trước ngắn hạn (mã 151)",
        bq: { none: "Chi phí của Ban đi thẳng vào TK 241 hoặc TK 642, trên bảng không có dòng chi phí trả trước." },
        dn: { m: "{hp.cpTraTruocNH|3} tỷ", d: "Quảng cáo {hp.cpttQuangCao|3}; thuê văn phòng {hp.cpttThueVP|3}; khác {hp.cpttKhac|3} (tỷ đồng).", s: "Hòa Phát tr.25, tm 12.1" } },
      { k: "Trả trước cho người bán (mã 132)",
        bq: { m: "{bq.b01.traTruoc|1} tỷ", d: "Tạm ứng thi công nhà xưởng cho CP Xây lắp số 5 ({bq.b01.traTruocXayLap5|1} tỷ) và tạm ứng mua thiết bị cho Cơ điện Việt Long ({bq.b01.traTruocVietLong|1} tỷ); gắn với hợp đồng xây lắp, thiết bị của dự án và được trừ dần khi nghiệm thu khối lượng.", s: "B04 V.02 tr.5" },
        dn: { m: "{hp.traTruocNH|3} tỷ", d: "Chỉ có trả trước ngắn hạn.", s: "Hòa Phát tr.6" } },
      { k: "Hàng tồn kho (mã 140)",
        bq: { m: "{bq.b01.htk|3} tỷ", d: "Toàn bộ là vật tư, thiết bị, công cụ chờ đưa vào công trình: vật liệu TK 1521 {bq.b01.vatLieu|3}; thiết bị TK 1523 {bq.b01.thietBi|3}; công cụ dụng cụ TK 153 {bq.b01.ccdc|3}. Ghi theo giá gốc, xuất kho bình quân gia quyền, kê khai thường xuyên (mục IV.2, tr.5). Không có thành phẩm và không bán ra ngoài.", s: "B04 V.04 tr.6" },
        dn: { m: "{hp.htk|3} tỷ", d: "Đầu năm không có; báo cáo không thuyết minh chi tiết.", s: "Hòa Phát tr.6" } }
    ],
    why: "Khác biệt cốt lõi không nằm ở số dư mà ở mục đích sử dụng: Ban kiểm soát nguồn lực được giao để thực hiện dự án, còn công ty mẹ theo dõi tài sản và vốn lưu động phát sinh từ hoạt động của chính mình. Báo cáo riêng của Hòa Phát có đầu tư tài chính ngắn hạn, khoản cho công ty con vay và chi phí trả trước; đây là những khoản mục cần đọc theo quan hệ tài chính của pháp nhân công ty mẹ.",
    figs: [
      { n: "Hình 2.1", t: "Tài sản ngắn hạn và các khoản phải thu", bq: "assets/h2-1-bq.webp", dn: "assets/h2-1-hp.webp" }
    ]
  },

  s223: {
    id: "s223",
    title: "2.2.3. Các TK đầu 2: Tài sản dài hạn",
    intro: "Ở tài sản dài hạn, BQLDA chỉ giữ lượng tài sản nhỏ phục vụ bộ máy quản lý; tài sản hình thành từ dự án vẫn nằm ở chi phí đầu tư xây dựng dở dang cho đến khi được quyết toán và bàn giao. Trên báo cáo riêng của Hòa Phát, TK 241 chỉ phản ánh chi phí xây dựng cơ bản dở dang của chính công ty mẹ; khoản đầu tư vào công ty con được ghi riêng (TK 221) và là giá trị khoản đầu tư của công ty mẹ, không phải tài sản chi tiết của các công ty con.",
    rows: [
      { k: "TSCĐ hữu hình (TK 211, 214)",
        bq: { m: "{bq.b01.tscd|3} tỷ", d: "= nguyên giá {bq.b01.nguyenGia|3} − hao mòn {bq.b01.haoMon|3}; gồm phương tiện vận tải và thiết bị quản lý. Tài sản của Ban chỉ phục vụ bộ máy quản lý, không tạo ra doanh thu; nhà xưởng, kho, hệ thống xử lý nước thải của dự án không nằm ở đây vì thuộc về chủ đầu tư.", s: "B01 tr.2, B04 V.06 tr.6" },
        dn: { m: "{hp.tscdhh|3} tỷ", d: "= nguyên giá {hp.nguyenGia|3} − hao mòn {hp.haoMon|3}; gồm nhà cửa, máy móc, phương tiện vận tải, thiết bị văn phòng; thêm TSCĐ vô hình {hp.tsVoHinh|3} tỷ.", s: "Hòa Phát tr.7, tr.21, tm 8" } },
      { k: "Khấu hao",
        bq: { m: "{bq.b01.khauHaoNam|3} tỷ/năm", d: "Phương tiện vận tải {bq.b01.khNamPTVT|0} năm, thiết bị quản lý {bq.b01.khNamTBQLtu|0} đến {bq.b01.khNamTBQLden|0} năm. Khấu hao không đi vào chi phí kinh doanh mà phân bổ vào TK 642 rồi tính vào giá trị công trình.", s: "B04 IV.3 tr.5; F03D mục 10" },
        dn: { m: "{hp.khauHaoPhanBo|3} tỷ", d: "Khấu hao và phân bổ (lưu chuyển tiền tệ, mã 02) tính vào chi phí kỳ, làm giảm lợi nhuận; nhà cửa {hp.khNhaCua|0} năm, máy móc {hp.khMayMocTu|0} đến {hp.khMayMocDen|0} năm, phương tiện {hp.khPTVTtu|0} đến {hp.khPTVTden|0} năm (tm 3.6, tr.14).", s: "Hòa Phát tr.10, tr.33, tm 25" } },
      { k: "Tài sản đã hết khấu hao còn sử dụng",
        bq: { none: "Ban thành lập năm 2013 nên tài sản còn mới.", s: "B04 V.06 tr.6" },
        dn: { m: "{hp.tsHetKH|3} tỷ", d: "Nguyên giá TSCĐ hữu hình đã khấu hao hết vẫn đang dùng (đầu năm {hp.tsHetKHDau|3} tỷ); vô hình {hp.tsHetKHVoHinh|3} tỷ.", s: "Hòa Phát tr.21, tr.22, tm 8, 9" } },
      { k: "Chi phí đầu tư xây dựng dở dang (TK 241, mã 230)",
        bq: { m: "{bq.b01.tk241|2} tỷ", d: "Chiếm {bq.b01.pct.tk241|1}% tổng tài sản.", s: "B01 tr.2, V.07" },
        dn: { m: "{hp.xdcb|3} tỷ", d: "Chi phí xây dựng cơ bản dở dang (mã 242), chiếm {calc.hpPct.xdcb|3}% tổng tài sản; đầu năm {hp.xdcbDau|3} tỷ.", s: "Hòa Phát tr.7" } },
      { k: "Tài sản vô hình, bất động sản đầu tư, đầu tư tài chính dài hạn, chi phí trả trước dài hạn",
        bq: { none: "BQLDA chỉ tồn tại trong vòng đời của dự án." },
        dn: { m: "{hp.tsVoHinh|3} · {hp.bdsDauTu|3} · {hp.dauTuCtyCon|1} · {hp.cpTraTruocDH|3}", d: "Tỷ đồng, theo thứ tự: tài sản vô hình; bất động sản đầu tư; đầu tư tài chính dài hạn (vào công ty con); chi phí trả trước dài hạn.", s: "Hòa Phát tr.7" } },
      { k: "Tài sản thuế hoãn lại; lợi thế thương mại",
        bq: { none: "BQLDA không có tài sản này nên không phát sinh." },
        dn: { none: "Không ghi nhận: chưa ghi nhận {hp.thueHLChuaGN|3} tỷ tài sản thuế thu nhập hoãn lại; lợi thế thương mại chỉ có ở BCTC hợp nhất, báo cáo riêng không có.", s: "Hòa Phát tr.34, tm 26.3" } }
    ],
    why: "Ở cả hai báo cáo, TK 241 đều là nơi vốn hóa chi phí: chi phí để tạo ra tài sản dùng nhiều năm không đi qua lợi nhuận mà làm tăng tài sản. Nhưng chức năng của tài khoản này đối với hai BCTC hoàn toàn khác nhau (xem bốn điểm bên dưới). Cần phân biệt chi phí hình thành công trình của Ban với tài sản và khoản đầu tư được công ty mẹ nắm giữ. Cùng phương pháp khấu hao đường thẳng, nhưng nơi khấu hao đi đến khác nhau: Hòa Phát vào chi phí làm giảm lợi nhuận, BQLDA vào giá trị công trình.",
    figs: [
      { n: "Hình 2.2", t: "Tài sản dài hạn và chi phí đầu tư xây dựng dở dang", bq: "assets/h2-2-bq.webp", dn: "assets/h2-2-hp.webp" }
    ]
  },

  s223b: {
    id: "s223b",
    title: "Đối với riêng TK 241: bốn điểm khác",
    rows: [
      { k: "Tỷ trọng", bq: { m: "{bq.b01.pct.tk241|1}%", d: "TK 241 gần như là toàn bộ tài sản của Ban.", s: "B01 tr.2" }, dn: { m: "{calc.hpPct.xdcb|3}%", d: "Chỉ {hp.xdcb|3} tỷ (mã 242), rất nhỏ so với tổng tài sản.", s: "Hòa Phát tr.7" } },
      { k: "Mục đích",
        bq: { m: "Bàn giao {bq.f03b.duyet|2} tỷ", d: "Công trình hoàn thành thì ghi giảm TK 241, đồng thời giảm TK 3361, rồi bàn giao cho chủ đầu tư (nhà bảo vệ, hàng rào, cổng). Ban không giữ lại tài sản nên không có gì để khấu hao.", s: "F03B tr.10" },
        dn: { m: "Tăng TSCĐ {hp.tangNG|3} tỷ", d: "Nguyên giá TSCĐ hữu hình tăng trong năm; tài sản hoàn thành được ghi vào TSCĐ và tiếp tục khấu hao.", s: "Hòa Phát tr.21, tm 8" } },
      { k: "Mức độ chi tiết",
        bq: { m: "6 nội dung chi phí", d: "Theo dõi theo dự án, công trình, hạng mục: xây dựng {bq.b03.items.0.cuoi|2}; thiết bị {bq.b03.items.1.cuoi|2}; bồi thường, hỗ trợ, tái định cư {bq.b03.items.2.cuoi|2}; quản lý dự án {bq.b03.items.3.cuoi|2}; tư vấn {bq.b03.items.4.cuoi|2}; chi phí khác {bq.b03.items.5.cuoi|2} (tỷ đồng).", s: "B03 tr.4" },
        dn: { m: "Một chỉ tiêu tổng hợp", d: "{hp.xdcb|3} tỷ trên mã 242, không thuyết minh theo công trình hay nội dung chi phí.", s: "Hòa Phát tr.7" } },
      { k: "Chi phí quản lý",
        bq: { m: "TK 642: {bq.f03d.ps2015|3} tỷ", d: "Chi phí hoạt động của Ban cuối kỳ được phân bổ hết vào TK 241 nên TK 642 không còn số dư.", s: "F03D mã 21, 22 tr.12" },
        dn: { m: "{hp.cpQLDN|3} tỷ", d: "Chi phí quản lý doanh nghiệp đi thẳng vào kết quả kinh doanh.", s: "Hòa Phát tr.9" } }
    ]
  },

  s224: {
    id: "s224",
    title: "2.2.4. Các TK đầu 3: Nợ phải trả và nguồn vốn đầu tư",
    intro: "Ở Ban, TK 331 phản ánh công nợ với nhà thầu xây dựng, đơn vị cơ điện, tư vấn và nhà cung cấp; nguồn vốn chủ đầu tư cấp được theo dõi riêng qua TK 3361, không đồng nhất với khoản vay do Ban tự huy động. Ở công ty mẹ Hòa Phát, toàn bộ nợ phải trả là nợ ngắn hạn, phần lớn là quỹ khen thưởng, phúc lợi; tại 31/12/2024 Bảng cân đối kế toán riêng không có chỉ tiêu vay.",
    rows: [
      { k: "Phải trả người bán (TK 331)",
        bq: { m: "{bq.b01.ptnb|2} tỷ", d: "CP Xây lắp số 5 {bq.b01.ptnbXayLap5|2}; Cơ điện Việt Long {bq.b01.ptnbVietLong|2}; Tư vấn Thiết kế Xây dựng Miền Tây {bq.b01.ptnbMienTay|2}; nhà cung cấp khác {bq.b01.ptnbKhac|1}. Nợ nhà thầu xây lắp, thiết bị, tư vấn và sẽ được vốn hóa vào TK 241.", s: "B04 V.08 tr.6" },
        dn: { m: "{hp.ptnb|3} tỷ", d: "Chỉ có ngắn hạn; chủ yếu mua dịch vụ quảng cáo, công nghệ thông tin; bên liên quan {hp.ptnbBLQ|3} tỷ.", s: "Hòa Phát tr.26, tm 13" } },
      { k: "Thuế và các khoản phải nộp Nhà nước (TK 333)",
        bq: { m: "{bq.b01.thueTNCN|1|trieu} triệu", d: "Chỉ có thuế thu nhập cá nhân (TK 3335). Ban chỉ khấu trừ thuế tại nguồn của người lao động; không có thuế TNDN vì không có lợi nhuận.", s: "B04 V.09 tr.6" },
        dn: { m: "{hp.thuePhaiNop|3} tỷ", d: "Thuế GTGT {hp.thueGTGTPN|3} và thuế thu nhập cá nhân {hp.thueTNCNPN|3} tỷ.", s: "Hòa Phát tr.27, tm 14" } },
      { k: "Phải trả người lao động (TK 334)",
        bq: { m: "{bq.b01.ptld|1|trieu} triệu", d: "Khác nhau chủ yếu do quy mô nhân sự: Ban có {bq.info.nhanSu2015|0} người (B04 mục I.4).", s: "B01 tr.2" },
        dn: { m: "{hp.ptld|3} tỷ", d: "Công ty mẹ có {hp.nhanVien|0} nhân viên, so với {t:bq.info.nhanSu2015} người của Ban.", s: "Hòa Phát tr.8, tr.12" } },
      { k: "Chi phí phải trả",
        bq: { none: "Trên B01 của Ban không có dòng này vì chi phí được ghi theo thực tế phát sinh vào TK 241.", s: "B04 mục IV.4" },
        dn: { m: "{hp.cpPhaiTra|3} tỷ", d: "Chi phí phải trả ngắn hạn.", s: "Hòa Phát tr.8" } },
      { k: "Phải trả nội bộ (TK 336)",
        bq: { m: "{bq.b01.noiBo3368|0|trieu} triệu", d: "TK 3368: lãi tiền gửi phải nộp chủ đầu tư.", s: "B04 V.10 tr.6" },
        dn: { none: "Không có chỉ tiêu này trên B01 riêng; công nợ với công ty con (pháp nhân độc lập) được trình bày là phải thu, phải trả bên liên quan (tm 5, 7, 13).", s: "Hòa Phát tr.8" } },
      { k: "Phải trả khác (TK 338)",
        bq: { m: "{bq.b01.phaiTraKhac|1|trieu} triệu", d: "Kinh phí công đoàn (3382), BHXH (3383), BHYT (3384), BHTN (3389).", s: "B04 V.11 tr.6–7" },
        dn: { m: "{hp.phaiTraKhac|3} tỷ", d: "Ngắn hạn: cổ tức phải trả {hp.coTucPhaiTra|3} tỷ và các khoản phải trả khác {hp.ptkConLai|3} tỷ.", s: "Hòa Phát tr.28, tm 15" } },
      { k: "Quỹ khen thưởng, phúc lợi",
        bq: { m: "{bq.b01.quyKTPL|0|trieu} triệu", d: "Do chủ đầu tư cấp: {bq.b01.quyDau|0|trieu} + {bq.b01.quyCap|0|trieu} − {bq.b01.quyChi|0|trieu} triệu. Cùng nằm trong nợ phải trả nhưng Ban được cấp.", s: "B04 V.12 tr.7" },
        dn: { m: "{hp.quyKTPL|3} tỷ", d: "Trích từ lợi nhuận sau thuế {hp.trichQuy|3} tỷ, sử dụng {hp.suDungKTPL|3} tỷ; chiếm {calc.hpPct.quyKTPL|1}% nợ phải trả.", s: "Hòa Phát tr.28, tm 16" } },
      { k: "Vay ngắn hạn, dài hạn",
        bq: { none: "Chủ đầu tư là bên đứng tên vay (Hợp đồng tín dụng số {t:bq.info.hopDongTinDung}, F02 tr.8) rồi cấp lại cho Ban; Ban ghi nhận là vốn đầu tư (TK 3361), không ghi nợ vay.", s: "F02 tr.8" },
        dn: { none: "B01 riêng không có chỉ tiêu vay; năm 2024 không vay mới, không trả nợ gốc (năm 2023 vay {hp.vay2023|0} tỷ, trả gốc {hp.traGoc2023|1} tỷ).", s: "Hòa Phát tr.8, tr.11" } },
      { k: "Nguồn vốn đầu tư (TK 3361, mã 410)",
        bq: { m: "{bq.b01.nvdt|2} tỷ", d: "Ghi vào TK 336, chi tiết TK 3361 “Phải trả nội bộ về vốn đầu tư xây dựng”, khi nhận tiền, vật tư, thiết bị hoặc khi chủ đầu tư thanh toán thẳng cho nhà thầu (B04 mục IV.5). Lên bảng ở mã 410, dòng “B - Nguồn vốn đầu tư”, đặt ở vị trí tương ứng với phần “Vốn chủ sở hữu” của doanh nghiệp.", s: "B01 tr.2" },
        dn: { m: "Vốn chủ sở hữu ở đầu 4", d: "Vị trí tương ứng trên bảng là phần Vốn chủ sở hữu.", s: "Hòa Phát tr.8" } }
    ],
    why: "Nguồn vốn đầu tư không phải là vốn chủ sở hữu, vì ba lý do: (1) Ban là đơn vị trực thuộc, được thành lập theo Quyết định 45/QĐ-HĐQT của chủ đầu tư và chỉ có tư cách quản lý, không sở hữu vốn (B04 mục I.1); (2) vốn phải được dùng đúng dự án, quyết toán và bàn giao cho chủ đầu tư, đó là nghĩa vụ chứ không phải tài sản ròng của Ban; (3) vốn không có quyền phân phối: không có lợi nhuận giữ lại, quỹ hay cổ tức, công trình quyết toán xong thì vốn giảm cùng lúc với tài sản (Nợ TK 3361 / Có TK 241, B04 mục IV.4).",
    figs: [
      { n: "Hình 2.3", t: "Các khoản nợ phải trả", bq: "assets/h2-3-bq.webp", dn: "assets/h2-3-hp.webp" },
      { n: "Hình 2.4", t: "Nguồn vốn đầu tư của Ban và vốn chủ sở hữu công ty Hòa Phát", bq: "assets/h2-4-bq.webp", dn: "assets/h2-4-hp.webp" }
    ]
  },

  s225: {
    id: "s225",
    title: "2.2.5. Các TK đầu 4: Vốn chủ sở hữu",
    intro: "Sự khác biệt về vốn chủ sở hữu phản ánh bản chất pháp lý và kinh tế của hai đơn vị. BQLDA không có quyền sở hữu độc lập đối với nguồn vốn được giao nên không hình thành vốn cổ phần, quỹ từ lợi nhuận hay lợi nhuận chưa phân phối; các khoản này hiện diện ở Hòa Phát vì đây là doanh nghiệp hoạt động vì lợi ích của cổ đông.",
    rows: [
      { k: "Vốn đầu tư của chủ sở hữu (TK 411)",
        bq: { none: "Vốn nằm ở TK 3361 thuộc đầu 3. Ban không có chủ sở hữu riêng nên không có vốn cổ phần." },
        dn: { m: "{hp.vonCoPhan|3} tỷ", d: "Vốn cổ phần: 6.396.250.200 cổ phiếu, mệnh giá 10.000 đồng; trong năm phát hành {hp.cpPhatHanhCoTuc|0} cổ phiếu trả cổ tức.", s: "Hòa Phát tr.30, tm 18" } },
      { k: "Thặng dư vốn cổ phần",
        bq: { none: "Chỉ có ở công ty cổ phần nên BCTC BQLDA không có phần này." },
        dn: { m: "0 cuối năm", d: "Đầu năm {hp.thangDuDauNam|3} tỷ, đã chuyển thành vốn cổ phần khi trả cổ tức bằng cổ phiếu.", s: "Hòa Phát tr.29, tm 17" } },
      { k: "Quỹ đầu tư phát triển (TK 418)",
        bq: { none: "Đây là quỹ trích từ lợi nhuận nên BQLDA cũng không có." },
        dn: { m: "{hp.quyDTPT|3} tỷ", d: "Đầu năm {hp.quyDTPTDau|3} tỷ; sử dụng {hp.suDungQuyDTPT|3} tỷ trong năm. Lợi nhuận sau thuế chưa phân phối {hp.lnChuaPP|3} tỷ.", s: "Hòa Phát tr.8, tr.29, tm 17" } }
    ],
    why: "Tương tự những TK đầu 4 khác, vì Ban không có cổ đông, không có lợi nhuận và không chia cổ tức nên đầu 4 của BQLDA hoàn toàn trống. Vốn của Ban chỉ tăng khi chủ đầu tư cấp thêm (năm 2015: {bq.b02.tangTien|2} tỷ bằng tiền và {bq.b02.tangVatTu|1} tỷ bằng vật tư, thiết bị) và chỉ giảm khi quyết toán, bàn giao ({bq.b02.giam|2} tỷ) (B02 tr.3). Báo cáo riêng Hòa Phát trình bày vốn chủ sở hữu qua TK 411, thặng dư, quỹ và TK 421: quyền lợi của cổ đông và kết quả tích lũy tại pháp nhân công ty mẹ. Vì vậy không nên xem nguồn vốn đầu tư của Ban và vốn chủ sở hữu Hòa Phát là hai khoản mục tương đương chỉ vì cùng nằm ở phía nguồn vốn."
  },

  s226: {
    id: "s226",
    title: "2.2.6. Các TK đầu 5 đến đầu 9: Doanh thu, chi phí và xác định kết quả",
    intro: "Bảng cân đối chỉ ghi số dư, nhưng các tài khoản này lý giải vì sao hai bảng khác nhau: ở doanh nghiệp, cuối kỳ chúng được kết chuyển vào kết quả kinh doanh rồi vào lợi nhuận chưa phân phối (TK 421, đầu 4); BQLDA không thực hiện theo cơ chế này. Chi phí của Ban được tập hợp để xác định giá trị đầu tư và quyết toán công trình, còn doanh nghiệp ghi nhận doanh thu, giá vốn, chi phí để xác định lợi nhuận.",
    rows: [
      { k: "Đầu 5: Doanh thu",
        bq: { none: "Không có doanh thu. Lãi tiền gửi từ vốn đầu tư ghi TK 3368 và nộp chủ đầu tư.", s: "B04 mục IV.7" },
        dn: { m: "{hp.dtt|3} tỷ", d: "Doanh thu thuần; doanh thu tài chính {hp.dtTaiChinh|3} tỷ. Doanh thu của công ty con không cộng gộp vào báo cáo riêng.", s: "Hòa Phát tr.9" } },
      { k: "Đầu 6: Chi phí",
        bq: { m: "TK 642: {bq.f03d.ps2015|3} tỷ", d: "Chi phí Ban QLDA, cuối kỳ kết chuyển hết vào TK 241.", s: "F03D tr.12" },
        dn: { m: "Giá vốn {hp.giaVon|3} tỷ", d: "Bán hàng {hp.cpBanHang|3}; quản lý doanh nghiệp (cũng TK 642) {hp.cpQLDN|3}; tài chính {hp.cpTaiChinh|0}.", s: "Hòa Phát tr.9" } },
      { k: "Đầu 7: Thu nhập khác",
        bq: { none: "Không có." },
        dn: { m: "{hp.thuNhapKhac|3} tỷ", s: "Hòa Phát tr.9" } },
      { k: "Đầu 8: Chi phí khác, thuế thu nhập doanh nghiệp",
        bq: { none: "Thuế TNDN không phát sinh. F03C “chi phí khác” là một nội dung của chi phí đầu tư (xem mục 2.4)." },
        dn: { m: "Chi phí khác {hp.cpKhac|3} tỷ", d: "Chi phí thuế thu nhập doanh nghiệp {hp.thueTNDN|0}.", s: "Hòa Phát tr.9" } },
      { k: "Đầu 9: Xác định kết quả",
        bq: { none: "“Ban QLDA không xác định kết quả kinh doanh riêng”.", s: "B04 mục IV.7" },
        dn: { m: "LNST {hp.lnst|1} tỷ", d: "Lợi nhuận sau thuế, kết chuyển vào TK 421.", s: "Hòa Phát tr.9" } },
      { k: "Chênh lệch tỷ giá",
        bq: { m: "Chuyển cho chủ đầu tư", d: "TK 3362.", s: "B04 mục IV.1" },
        dn: { m: "Vào kết quả kinh doanh", d: "Ghi vào kết quả kinh doanh riêng; năm 2024 chỉ có lãi tỷ giá {hp.laiTyGiaDong|0} đồng.", s: "Hòa Phát tr.13, tr.32, tm 3.1, 23" } }
    ],
    why: "Ở mỗi đầu tài khoản, hai đơn vị khác nhau về mục tiêu ghi nhận và nhu cầu thông tin quản trị. Đáng chú ý nhất là TK 642 có cùng số hiệu nhưng đi hai đường khác nhau: ở Hòa Phát, chi phí quản lý doanh nghiệp kết chuyển vào kết quả kinh doanh và làm giảm lợi nhuận; ở BQLDA, chi phí quản lý dự án kết chuyển vào TK 241 và làm tăng giá trị tài sản bàn giao. Chênh lệch tỷ giá cũng vậy: ở Hòa Phát đi vào kết quả kinh doanh, còn ở BQLDA được chuyển cho chủ đầu tư (TK 3362).",
    figs: [
      { n: "Hình 2.5", t: "Doanh thu và việc không trình bày doanh thu bán hàng ở BQLDA", bq: "assets/h2-5-bq.webp", dn: "assets/h2-5-hp.webp" },
      { n: "Hình 2.6", t: "Các chi phí đầu tư và chi phí hoạt động", bq: "assets/h2-6-bq.webp", dn: "assets/h2-6-hp.webp" },
      { n: "Hình 2.7", t: "Các chỉ tiêu thu nhập khác", bq: "assets/h2-7-bq.webp", dn: "assets/h2-7-hp.webp" },
      { n: "Hình 2.8", t: "Các khoản chi phí dự án và chi phí khác", bq: "assets/h2-8-bq.webp", dn: "assets/h2-8-hp.webp" },
      { n: "Hình 2.9", t: "Quyết toán đầu tư và kết quả kinh doanh", bq: "assets/h2-9-bq.webp", dn: "assets/h2-9-hp.webp" }
    ]
  },

  s227: {
    id: "s227",
    title: "2.2.7. Các chỉ tiêu ngoài bảng (TK đầu 0)",
    rows: [
      { k: "Ngoại tệ các loại (mã 007)",
        bq: { m: "{bq.b01.usdCuoi|0} USD", d: "Đầu năm {bq.b01.usdDau|0} USD; in ngay dưới bảng cân đối, phần “Các chỉ tiêu ngoài bảng cân đối kế toán”.", s: "B01 tr.2" },
        dn: { m: "{hp.usd|0} USD", d: "Tương đương {hp.usdTrieu|1} triệu đồng; không có trên Bảng cân đối kế toán, chỉ được liệt kê ở thuyết minh 4.2.", s: "Hòa Phát tr.18, tm 4.2" } },
      { k: "Tài sản nhận giữ hộ (mã 002)",
        bq: { m: "Không có số dư", d: "Vẫn có dòng trên bảng.", s: "B01 tr.2" },
        dn: { none: "Mẫu B01-DN không có dòng này; các khoản ngoài bảng được nêu ở thuyết minh 20 (cam kết thuê hoạt động {hp.camKetThue|3} tỷ).", s: "Hòa Phát tr.31, tm 20" } }
    ],
    why: "Khác biệt do mẫu biểu: mẫu B01-CĐT có phần chỉ tiêu ngoài bảng; mẫu B01-DN không có dòng này."
  },

  s231: {
    id: "s231",
    title: "2.3.1. Đối chiếu số liệu: cùng là vốn nhưng biến động theo hai cách khác nhau",
    rows: [
      { k: "Tăng trong năm",
        bq: { m: "+{bq.b02.tang|3} tỷ", d: "Chủ đầu tư cấp bằng tiền {bq.b02.tangTien|3} (mã 03), bằng vật tư, thiết bị {bq.b02.tangVatTu|3} (mã 04).", s: "B02 tr.3" },
        dn: { m: "+{hp.lnst|1} tỷ", d: "Lợi nhuận sau thuế, trong đó {calc.hpPct.lnCtyConLnst|2}% là lợi nhuận được chia từ công ty con (tm 23); không có đợt góp vốn mới của cổ đông.", s: "Hòa Phát tr.29, tm 17" } },
      { k: "Giảm trong năm",
        bq: { m: "−{bq.b02.giam|3} tỷ", d: "Kết chuyển do quyết toán, bàn giao công trình (mã 06); hoàn trả vốn cho chủ đầu tư: không phát sinh (mã 07).", s: "B02 tr.3" },
        dn: { m: "−{hp.vcshTrichQuy|2} tỷ", d: "Trích quỹ khen thưởng, phúc lợi; −{hp.suDungQuyDTPT|3} tỷ sử dụng quỹ đầu tư phát triển. Trả cổ tức bằng tiền {hp.coTucTraTienTrieu|3} triệu không làm giảm vốn chủ sở hữu vì là thanh toán cổ tức phải trả (tm 15).", s: "Hòa Phát tr.29, tm 17" } },
      { k: "Chuyển trong nội bộ vốn (tổng không đổi)",
        bq: { none: "Không có." },
        dn: { m: "Cổ tức bằng cổ phiếu {hp.coTucCPPct|0}%", d: "{hp.coTucCP|3} tỷ chuyển từ thặng dư vốn ({hp.coTucTuThangDu|3}) và lợi nhuận chưa phân phối ({hp.coTucTuLNCPP|3}) sang vốn cổ phần.", s: "Hòa Phát tr.29, tm 17–19" } },
      { k: "Số dư cuối năm",
        bq: { m: "{bq.b02.cuoi|3} tỷ", d: "Khớp mã 410 trên B01 và F02.", s: "B02 tr.3" },
        dn: { m: "{hp.vcsh|3} tỷ", d: "Đầu năm {hp.vcshDau|3} tỷ, tăng {calc.hpPct.vcshTang|1}% (vốn BQLDA tăng {calc.hpPct.bqVonTang|1}%). Khớp mã 400 trên B01.", s: "Hòa Phát tr.8, tr.29, tm 17" } }
    ],
    why: "Hai báo cáo có thể cùng thể hiện số đầu kỳ, tăng, giảm và cuối kỳ nhưng không cùng bản chất kinh tế: báo cáo biến động vốn của BQLDA phản ánh luồng vốn được chủ đầu tư giao và giá trị công trình đã bàn giao; vốn chủ sở hữu của công ty mẹ Hòa Phát tăng nhờ lợi nhuận sau thuế, mà lợi nhuận này gần như toàn bộ là cổ tức, lợi nhuận được chia từ công ty con, rồi giảm do trích quỹ. Ở mỗi dòng, hai đơn vị khác nhau về mục tiêu ghi nhận và nhu cầu thông tin quản trị."
  },

  s232: {
    id: "s232",
    title: "2.3.2. Điểm khác biệt và lý do",
    intro: "Khác biệt về cơ chế vốn còn thể hiện ở cách phân loại và đối chiếu. BQLDA phải tách nguồn cấp bằng tiền với vật tư, thiết bị và đối chiếu số dư với chủ đầu tư; công ty mẹ Hòa Phát trình bày vốn chủ sở hữu theo từng cột trên thuyết minh 17 và giải trình dòng tiền qua báo cáo lưu chuyển tiền tệ riêng.",
    rows: [
      { k: "Số khoản được theo dõi",
        bq: { m: "Một (TK 3361)", d: "Chia thành “bằng tiền” và “bằng vật tư, thiết bị”. Ban chỉ có một nguồn vốn là chủ đầu tư cấp, không có lợi nhuận hay quỹ." },
        dn: { m: "Bốn cột", d: "Vốn cổ phần, thặng dư vốn cổ phần, quỹ đầu tư phát triển, lợi nhuận sau thuế chưa phân phối.", s: "Hòa Phát tr.29, tm 17" } },
      { k: "Nguyên nhân tăng",
        bq: { m: "Chủ đầu tư cấp", d: "Theo các quyết định giao vốn. Vốn của Ban là nguồn “được giao”.", s: "F02 tr.8" },
        dn: { m: "Lợi nhuận tự tạo ra", d: "Lợi nhuận sau thuế {hp.lnst|1} tỷ, chủ yếu từ cổ tức, lợi nhuận được chia từ công ty con ({hp.lnCtyCon|1} tỷ); vốn phần lớn là nguồn “tự tích lũy”.", s: "Hòa Phát tr.29, tr.32, tm 17, 23" } },
      { k: "Nguyên nhân giảm",
        bq: { m: "Bàn giao công trình", d: "Cho chủ đầu tư (nhà bảo vệ, hàng rào, cổng: {bq.f03b.duyet|2} tỷ) hoặc hoàn trả vốn dư. Ban “hoàn” vốn bằng cách bàn giao tài sản." },
        dn: { m: "Phân phối lợi nhuận", d: "Trích quỹ khen thưởng, phúc lợi {hp.vcshTrichQuy|2} tỷ và sử dụng quỹ đầu tư phát triển {hp.suDungQuyDTPT|3} tỷ.", s: "Hòa Phát tr.29, tm 17" } },
      { k: "Hình thức vốn",
        bq: { m: "Tách bằng tiền và bằng vật tư", d: "B02 mã 03, 04; F02 hai cột tăng. Chủ đầu tư có thể cấp thiết bị hoặc trả thẳng cho nhà thầu nên Ban phải tách để theo dõi.", s: "B02, F02" },
        dn: { none: "Không tách trong bảng thay đổi vốn chủ sở hữu." } },
      { k: "Phân loại theo nguồn",
        bq: { m: "{bq.f02.pctVcsh|1}% / {bq.f02.pctVay|1}%", d: "F02: vốn chủ sở hữu do chủ đầu tư cấp {bq.f02.vcsh.cuoi|2} tỷ; vốn vay thương mại do chủ đầu tư vay rồi cấp lại {bq.f02.vay.cuoi|2} tỷ. Nghĩa vụ trả nợ vay của dự án thuộc chủ đầu tư (Hợp đồng tín dụng số {t:bq.info.hopDongTinDung}) nên Ban ghi như vốn đầu tư.", s: "F02 tr.8" },
        dn: { m: "{calc.hpPct.vcsh|1}% / {calc.hpPct.no|1}%", d: "Vốn chủ sở hữu chiếm {calc.hpPct.vcsh|1}% nguồn vốn, nợ phải trả chỉ {calc.hpPct.no|1}%; B01 riêng không có chỉ tiêu vay.", s: "Hòa Phát tr.8" } },
      { k: "Dòng tiền liên quan đến vốn",
        bq: { m: "Không có LCTT", d: "Không có Báo cáo lưu chuyển tiền tệ; chỉ thấy phần cấp bằng tiền {bq.b02.tangTien|3} tỷ trên B02.", s: "B02 tr.3" },
        dn: { m: "Hoạt động tài chính", d: "Chỉ trả cổ tức {hp.coTucTraTienTrieu|3} triệu ({hp.lcttTC|3} tỷ). Hoạt động đầu tư +{hp.lcttDT|3} tỷ: thu lãi, cổ tức và lợi nhuận được chia {hp.m27|3} tỷ, chi góp vốn vào công ty con {calc.hpGopVon|3} tỷ. Tiền từ {hp.tienDau|3} lên {hp.tien|3} tỷ.", s: "Hòa Phát tr.10, tr.11" } },
      { k: "Tổng mức và tiến độ",
        bq: { m: "{bq.b03.luyKe|2} / {bq.b03.tongMuc|0} tỷ", d: "Có “tổng mức đầu tư được duyệt” {bq.b03.tongMuc|0} tỷ, lũy kế vốn thực hiện {bq.b03.luyKe|2} tỷ, đạt {bq.b03.tyLe|1}%.", s: "B03 mã 20–22; B04 VI.1" },
        dn: { none: "Không có khái niệm tổng mức của công ty mẹ." } },
      { k: "Xác nhận số dư",
        bq: { m: "Hai bên xác nhận", d: "Đối chiếu công nợ nội bộ với chủ đầu tư tại 31/12/2015, hai bên xác nhận không chênh lệch. Ban chỉ có một đối tác là chủ đầu tư nên xác nhận hai chiều là đủ.", s: "B04 V.10" },
        dn: { m: "Kiểm toán độc lập", d: "KPMG, báo cáo kiểm toán số {t:hp.soBCKT}, ngày 24/3/2025.", s: "Hòa Phát tr.5" } },
      { k: "Đối chiếu chéo giữa các báo cáo",
        bq: { m: "Ghi chú ngay trên B02", d: "Số cuối năm khớp B01 (mã 410) và F02; số 188.717.450.000 xuất hiện ở B01 tr.2, B02 tr.3, F02 tr.8, B04 V.10. BQLDA ghi thành ghi chú ngay trên báo cáo.", s: "B02 tr.3" },
        dn: { m: "Khớp chéo", d: "80.780.186.578.052 đồng khớp B01 tr.8 và thuyết minh 17 tr.29; cột “thuyết minh” trên B01 dẫn mã 410 → tm 17, 411 → tm 18, 322 → tm 16.", s: "Hòa Phát tr.8, tr.29" } }
    ],
    why: "Tóm lại, cả hai bên đều trả lời câu hỏi “vốn đến từ đâu và đã dùng thế nào”, nhưng BQLDA trả lời theo quan hệ chủ đầu tư và ban quản lý (cấp vốn, quyết toán, bàn giao), còn công ty mẹ Hòa Phát trả lời theo quan hệ công ty và cổ đông (lợi nhuận, cổ tức, trích quỹ)."
  },

  s241: {
    id: "s241",
    title: "2.4.1. So sánh Mẫu số B03-CĐT với Báo cáo kết quả hoạt động kinh doanh riêng",
    rows: [
      { k: "Doanh thu",
        bq: { none: "Không có doanh thu. “Sản phẩm” của Ban là công trình bàn giao cho chủ đầu tư theo giá trị quyết toán, không có giá bán. Ban không bán gì ra ngoài nên không có đầu ra để đo lãi lỗ.", s: "F03B tr.10" },
        dn: { m: "{hp.dtt|3} tỷ", d: "Doanh thu thuần = cung cấp dịch vụ {hp.dtDichVu|3} + cho thuê bất động sản đầu tư {hp.dtChoThueBDS|3} − chiết khấu {hp.dtGiamTru|3}.", s: "Hòa Phát tr.32, tm 21" } },
      { k: "Giá vốn",
        bq: { none: "Tương ứng gần nhất là giá trị quyết toán hạng mục bàn giao {bq.f03b.duyet|2} tỷ, nhưng nó đi ra khỏi sổ chứ không thành giá vốn: Ban giao công trình đi nên giá trị đó không “tiêu hao”.", s: "F03B tr.10" },
        dn: { m: "{hp.giaVon|3} tỷ", d: "Dịch vụ {hp.gvDichVu|3}; bất động sản đầu tư {hp.gvBDS|3}; lợi nhuận gộp {hp.lnGop|3} tỷ (biên {calc.hpPct.bienGop|1}%).", s: "Hòa Phát tr.32, tm 22" } },
      { k: "Chi phí xây dựng, thiết bị, tư vấn, bồi thường",
        bq: { m: "{bq.b03.ps|2} tỷ", d: "Phát sinh, ghi tăng TK 241: xây dựng {bq.b03.items.0.ps|2}; thiết bị {bq.b03.items.1.ps|2}; tư vấn {bq.b03.items.4.ps|2}; bồi thường, hỗ trợ, tái định cư {bq.b03.items.2.ps|2}; quản lý dự án {bq.b03.items.3.ps|2}; khác {bq.b03.items.5.ps|2}. Toàn bộ chi phí đi vào đây.", s: "B03 tr.4" },
        dn: { m: "+{calc.hpXdcbTang|3} tỷ", d: "XDCB dở dang tăng từ {hp.xdcbDau|3} lên {hp.xdcb|3} tỷ; tiền chi mua sắm TSCĐ và tài sản dài hạn khác {calc.hpMuaTSCD|3} tỷ (= {hp.tangNG|3} + {calc.hpXdcbTang|3}). Đầu tư xây dựng chỉ là hoạt động rất nhỏ; vốn mở rộng được góp vào công ty con và ghi là đầu tư tài chính.", s: "Hòa Phát tr.7, tr.10" } },
      { k: "Chi phí quản lý",
        bq: { m: "{bq.f03d.ps2015|3} tỷ", d: "Chi phí Ban QLDA (TK 642), cuối kỳ phân bổ hết vào TK 241 (Nợ TK 241 / Có TK 642), không còn số dư. Làm tăng giá trị tài sản bàn giao.", s: "F03D mã 21, 22 tr.12" },
        dn: { m: "{hp.cpQLDN|3} tỷ", d: "Chi phí quản lý doanh nghiệp, đi thẳng vào kết quả kinh doanh và làm giảm lợi nhuận.", s: "Hòa Phát tr.9, tr.33, tm 24" } },
      { k: "Chi phí bán hàng",
        bq: { none: "BCTC BQLDA không có chi phí này." },
        dn: { m: "{hp.cpBanHang|3} tỷ", d: "Mã 25 trên báo cáo kết quả kinh doanh riêng.", s: "Hòa Phát tr.9" } },
      { k: "Hoạt động tài chính",
        bq: { m: "Quản lý hộ", d: "Lãi tiền gửi từ vốn nhàn rỗi ghi TK 3368 và nộp chủ đầu tư; chênh lệch tỷ giá ghi TK 3362 (B04 mục IV.1, IV.7, tr.5). Chi phí đi vay đủ điều kiện vốn hóa do chủ đầu tư chuyển (TK 3363): năm 2015 không phát sinh (B04 mục VI.3, tr.7). Ban không giữ lãi hay lỗ tài chính của vốn.", s: "B04 tr.5, tr.7" },
        dn: { m: "{hp.dtTaiChinh|1} / {hp.cpTaiChinh|0} tỷ", d: "Công ty mẹ là bên nhận cổ tức, gửi tiền và cho công ty con vay (dư nợ {calc.hpChoVay|1} tỷ): lợi nhuận được chia từ công ty con {hp.lnCtyCon|3}, lãi tiền gửi và cho vay {hp.laiTienGuiChoVay|3}. Chi phí tài chính bằng 0 do không vay.", s: "Hòa Phát tr.9, tr.32, tm 23" } },
      { k: "Chi phí khác",
        bq: { m: "{bq.f03c.ps|3} tỷ", d: "F03C: phát sinh trong năm gồm bảo hiểm công trình, thẩm định, lễ khởi công, đào tạo… Đây là chi phí đầu tư, tính vào TK 241.", s: "F03C tr.11" },
        dn: { m: "{hp.cpKhac|3} tỷ", d: "So với thu nhập khác {hp.thuNhapKhac|3}, kết quả khác +{hp.kqKhac|3} tỷ; đi vào kết quả kinh doanh. Thu nhập khác gần trùng tiền thu thanh lý TSCĐ (LCTT mã 22): đây là suy luận, báo cáo không nêu.", s: "Hòa Phát tr.9, tr.10" } },
      { k: "Thuế thu nhập doanh nghiệp",
        bq: { none: "Ban không có lợi nhuận nên không có thuế TNDN; thuế duy nhất là thuế thu nhập cá nhân khấu trừ {bq.b01.thueTNCN|1|trieu} triệu.", s: "B04 V.09 tr.6" },
        dn: { m: "{hp.thueTNDN|0} tỷ", d: "Năm 2023: {hp.thueTNDN2023|3} tỷ. Thuế suất {hp.thueSuat|0}%; cổ tức {hp.coTucKhongChiuThue|1} tỷ không chịu thuế, dùng {hp.loTinhThueDung|1} tỷ lỗ tính thuế; chưa ghi nhận {hp.thueHLChuaGN|3} tỷ tài sản thuế hoãn lại.", s: "Hòa Phát tr.34, tm 26" } },
      { k: "Chỉ tiêu cuối cùng",
        bq: { m: "Không xác định lãi, lỗ", d: "Chỉ tiêu bổ sung: tổng mức đầu tư được duyệt {bq.b03.tongMuc|0} tỷ, lũy kế vốn đầu tư thực hiện {bq.b03.luyKe|2} tỷ ({bq.b03.tyLe|1}%), giá trị đã quyết toán, bàn giao {bq.b03.quyetToan|2} tỷ. BQLDA đo tiến độ.", s: "B03 mã 20 đến 23, tr.4" },
        dn: { m: "LNST {hp.lnst|1} tỷ", d: "Lợi nhuận trước thuế và sau thuế cùng {hp.lnst|3} tỷ, gấp khoảng {calc.hpLnstLanDtt|1} lần doanh thu thuần nên không đọc như biên lợi nhuận kinh doanh. Công ty mẹ đo kết quả.", s: "Hòa Phát tr.9" } }
    ],
    why: "Báo cáo thực hiện đầu tư của BQLDA không phải phiên bản rút gọn của báo cáo kết quả kinh doanh: một bên đo tiến độ và cơ cấu chi phí đầu tư, bên còn lại đo kết quả kinh doanh. Các tên gọi giống nhau như TK 642 hoặc “chi phí khác” không bảo đảm cùng cách ghi nhận hoặc cùng tác động lên lợi nhuận. Ở công ty mẹ Hòa Phát, lợi nhuận gộp {hp.lnGop|3} tỷ không bù nổi chi phí quản lý {hp.cpQLDN|3} tỷ nên hoạt động bán hàng, dịch vụ thuần túy lỗ khoảng {calc.hpSauBhQlAbs|3} tỷ; chính doanh thu tài chính (cổ tức công ty con) tạo ra lợi nhuận. Chi phí chỉ đi vào lợi nhuận khi nó mang lại lợi ích trong kỳ; BQLDA không có doanh thu nên không có lợi nhuận để chi phí “tiêu hao” vào (B04 mục IV.7, tr.5)."
  },

  s242: {
    id: "s242",
    title: "2.4.2. Phụ biểu F03A so với Thuyết minh xây dựng cơ bản dở dang",
    rows: [
      { k: "Đơn vị theo dõi",
        bq: { m: "6 công trình, hạng mục và 1 dòng chi phí chung toàn dự án", d: "Ban chỉ có một dự án nên chi tiết đến hạng mục.", s: "F03A tr.9" },
        dn: { m: "Một chỉ tiêu tổng hợp", d: "XDCB dở dang {hp.xdcb|3} tỷ (mã 242), không thuyết minh theo công trình.", s: "Hòa Phát tr.7" } },
      { k: "Trạng thái hoàn thành",
        bq: { m: "Thể hiện rõ", d: "Đang thi công hay đã bàn giao. Người đọc của Ban cần biết hạng mục nào có thể quyết toán.", s: "F03A tr.9" },
        dn: { m: "Chỉ tổng tăng TSCĐ", d: "Chỉ thấy tổng tăng nguyên giá TSCĐ hữu hình {hp.tangNG|3} tỷ.", s: "Hòa Phát tr.21, tm 8" } }
    ],
    why: "Cách phân loại chi tiết phản ánh khác biệt về nhu cầu quản trị: BQLDA cần xác định từng hạng mục nào đang thi công, hạng mục nào đủ điều kiện bàn giao và phần chi phí nào còn chờ phân bổ; với công ty mẹ Hòa Phát, xây dựng cơ bản chỉ là khoản rất nhỏ nên được trình bày bằng một chỉ tiêu tổng hợp."
  },

  s25: {
    id: "s25",
    title: "2.5. Quyết toán vốn đầu tư công trình hoàn thành (F03B-CĐT) so với ghi nhận tài sản cố định",
    rows: [
      { k: "Tập hợp chi phí",
        bq: { m: "TK 241 chi tiết", d: "Theo dự án, công trình, hạng mục và 6 nội dung chi phí.", s: "B04 mục IV.4, tr.5" },
        dn: { m: "TK 241", d: "XDCB dở dang {hp.xdcb|3} tỷ, không khấu hao khi đang xây dựng (tm 3.9, tr.15); nguyên giá TSCĐ gồm giá mua và chi phí liên quan trực tiếp (tm 3.6, tr.14).", s: "Hòa Phát tr.7, tr.14, tr.15" } },
      { k: "Căn cứ chuyển khỏi TK 241",
        bq: { m: "QĐ {t:bq.f03b.soQd}", d: "Bàn giao ngày {t:bq.f03b.ngayBanGiao}; quyết định phê duyệt quyết toán số {t:bq.f03b.soQd} ngày {t:bq.f03b.ngayQd}. Bút toán kết chuyển chỉ ghi khi báo cáo quyết toán được duyệt (B04 IV.4), tức sau ngày bàn giao. Ban phải được chủ đầu tư duyệt quyết toán.", s: "F03B tr.10; B04 VI.2" },
        dn: { m: "Đưa tài sản vào hoạt động", d: "Không có bước duyệt quyết toán của bên thứ ba trên báo cáo; công ty mẹ tự ghi nhận khi tài sản sẵn sàng sử dụng." } },
      { k: "Giá trị chuyển",
        bq: { m: "{bq.f03b.duyet|3} tỷ", d: "Xây dựng {bq.f03b.xd|3}; thiết bị {bq.f03b.tb|3}; quản lý dự án {bq.f03b.ql|3}; tư vấn {bq.f03b.tv|3}; khác {bq.f03b.khac|3}. Giá trị đề nghị bằng giá trị được duyệt, chênh lệch {bq.f03b.chenhLech|0}. Ban chỉ có một đích là bàn giao.", s: "F03B tr.10" },
        dn: { m: "{hp.tangNG|3} tỷ TSCĐ HH", d: "Phương tiện vận tải {hp.tangPTVT|3}; thiết bị văn phòng {hp.tangTBVP|3}; máy móc, thiết bị {hp.tangMMTB|3}. Bất động sản đầu tư không đổi, nguyên giá {hp.bdsNguyenGia|3} tỷ (tm 10).", s: "Hòa Phát tr.21, tr.23, tm 8, 10" } },
      { k: "Bút toán",
        bq: { m: "Nợ TK 336 (3361) / Có TK 241", d: "Một bên giảm nguồn vốn.", s: "F03B; B04 IV.4" },
        dn: { m: "Nợ TK 211 (hoặc 213, 242) / Có TK 241", d: "Một bên tăng tài sản." } },
      { k: "Tác động lên báo cáo",
        bq: { m: "Cùng giảm {bq.b02.giam|3} tỷ", d: "Nguồn vốn đầu tư (B02) và chi phí dở dang (B03) cùng giảm; tài sản ròng của Ban không đổi (tài sản và nguồn vốn cùng giảm); không có lãi lỗ." },
        dn: { m: "Tổng tài sản không đổi", d: "Tài sản dài hạn đổi từ XDCB dở dang sang TSCĐ tại thời điểm chuyển. Cả hai bên đều không phát sinh lãi lỗ lúc chuyển, nhưng chuyển xong thì số phận khác nhau." } },
      { k: "Sau khi hoàn thành",
        bq: { m: "Không còn trên sổ", d: "Không còn tài sản trên sổ của Ban; Ban không khấu hao tài sản bàn giao." },
        dn: { m: "{hp.tscdhh|3} tỷ còn lại", d: "TSCĐ hữu hình nguyên giá {hp.nguyenGia|3} tỷ, hao mòn lũy kế {hp.haoMon|3} tỷ; khấu hao năm {hp.khauHao|3} tỷ theo tm 3.6 (nhà cửa {hp.khNhaCua|0} năm, máy móc {hp.khMayMocTu|0} đến {hp.khMayMocDen|0} năm). Bất động sản đầu tư khấu hao {hp.khBDS|3} tỷ/năm; tài sản vô hình {hp.khVoHinh|3} tỷ; TSCĐ hết khấu hao vẫn dùng {hp.tsHetKH|3} tỷ. Khấu hao đi vào chi phí kỳ và làm giảm lợi nhuận.", s: "Hòa Phát tr.14, tr.21–23, tm 3.6, 8–10" } },
      { k: "Chi phí quản lý dự án",
        bq: { m: "{bq.f03b.ql|3} tỷ", d: "Nằm trong giá trị quyết toán của hạng mục; chi phí quản lý của Ban cũng bị gạch ra khỏi sổ.", s: "F03B tr.10" },
        dn: { none: "Không tách riêng; công ty mẹ đưa chi phí quản lý doanh nghiệp {hp.cpQLDN|3} tỷ vào kết quả kinh doanh.", s: "Hòa Phát tr.9" } },
      { k: "Khoản không được duyệt, xóa sổ",
        bq: { m: "Không có", d: "F03B và B04 V.07 nêu rõ không có chi phí bị duyệt loại phải thu hồi (TK 1388); số dư TK 1388 {bq.b01.tk1388|1|trieu} triệu (V.03) là phải thu khác, không liên quan quyết toán. Ở Ban có bên duyệt nên chi phí bị loại sẽ thành khoản phải thu.", s: "F03B tr.10; B04 tr.6" },
        dn: { m: "Thanh lý, xóa sổ", d: "TSCĐ hữu hình nguyên giá {hp.tlNguyenGia|3}, hao mòn {hp.tlHaoMon|3} (giá trị còn lại {calc.hpTlConLai|3} tỷ); xóa sổ phần mềm {hp.xoaPhanMem|3} tỷ. Do thanh lý, hư hỏng, hết giá trị sử dụng chứ không phải chi phí bị từ chối.", s: "Hòa Phát tr.21, tr.22, tm 8, 9" } }
    ],
    why: "Sau thời điểm chuyển, BQLDA không tiếp tục ghi nhận công trình đã bàn giao, trong khi doanh nghiệp tiếp tục theo dõi nguyên giá, hao mòn và khấu hao."
  }
};

/*
 * BA Ý CHÍNH CỦA LỚP TRÌNH BÀY (bản 4, mục E). Mỗi ý lấy từ câu kết luận, câu nhận xét trong chính tiểu mục đó của bài
 * (các câu "Như vậy", "Nhận xét", "Điều này cho thấy", "Tóm lại"…), chỉ rút gọn, không thêm nhận định mới.
 */
window.KEYS = {
  "1-1-1": [
    "Dự án là tập hợp các hoạt động có liên quan với nhau, thực hiện trong khoảng thời gian xác định, với nguồn lực giới hạn, nhằm tạo ra một kết quả cụ thể.",
    "Dự án có năm đặc điểm cơ bản; mỗi đặc điểm kéo theo một yêu cầu riêng đối với tổ chức kế toán.",
    "Có thời hạn xác định nên kế toán theo dõi lũy kế từ khởi công đến khi hoàn thành, không chỉ theo từng năm tài chính."
  ],
  "1-1-2": [
    "Mỗi cách phân loại cho biết cơ quan nào quản lý, nguồn vốn nào được dùng, và do đó quy định kế toán, báo cáo nào phải tuân thủ.",
    "Theo nguồn vốn: quyết định cơ chế cấp vốn, thanh toán, kiểm soát chi và hình thức quyết toán.",
    "Cách phân loại theo chủ thể quản lý là cơ sở trực tiếp để chọn chế độ kế toán."
  ],
  "1-1-3": [
    "Chu trình dự án gồm ba giai đoạn: chuẩn bị đầu tư, thực hiện đầu tư, kết thúc xây dựng và đưa dự án vào khai thác sử dụng.",
    "Ở mỗi giai đoạn, công việc quản lý dự án luôn đi kèm một nhiệm vụ cụ thể của kế toán.",
    "Thực hiện đầu tư phát sinh nhiều nghiệp vụ nhất (nhận vốn, thanh toán nhà thầu, nghiệm thu khối lượng), là trọng tâm hạch toán."
  ],
  "1-1-4": [
    "Kế toán dự án thu thập, xử lý, kiểm tra, phân tích và cung cấp thông tin về nguồn vốn, tình hình sử dụng vốn và kết quả thực hiện của dự án.",
    "Nguồn vốn chủ yếu do chủ đầu tư hoặc nhà nước cấp nên trọng tâm là quản lý vốn chứ không phải lợi nhuận.",
    "Số liệu phải chi tiết theo từng dự án, nguồn vốn và nội dung chi phí; không dồn chung các dự án."
  ],
  "1-2-1": [
    "Kế toán dự án vận hành trong ba lớp văn bản: luật và nghị định; thông tư về chế độ kế toán của Bộ Tài chính; quy định về quản lý, thanh toán và quyết toán vốn đầu tư.",
    "Thông tư 195/2012/TT-BTC là chế độ kế toán BQLDA, trọng tâm so sánh.",
    "Thông tư 200/2014/TT-BTC là chế độ kế toán doanh nghiệp, trọng tâm so sánh."
  ],
  "1-2-2": [
    "Thông tư 195/2012/TT-BTC ban hành ngày 15/11/2012, có hiệu lực từ 01/01/2013, thay thế Quyết định 214/2000/QĐ-BTC.",
    "Hệ thống tài khoản dựa trên hệ thống tài khoản doanh nghiệp, được sửa đổi, bổ sung, đổi tên cho phù hợp hoạt động đầu tư.",
    "Thời hạn nộp: báo cáo quý chậm nhất {thoiHan.bq.quy|0} ngày, báo cáo năm chậm nhất {thoiHan.bq.nam|0} ngày kể từ ngày kết thúc kỳ."
  ],
  "1-2-3": [
    "Thông tư 200/2014/TT-BTC ban hành ngày 22/12/2014, áp dụng cho năm tài chính bắt đầu từ ngày 01/01/2015.",
    "Hoạt động đầu tư xây dựng của doanh nghiệp được theo dõi trên TK 241 “Xây dựng cơ bản dở dang” (2411, 2412, 2413).",
    "Thời hạn nộp: báo cáo quý chậm nhất {thoiHan.dn.quy|0} ngày ({thoiHan.dnRieng.quy|0} ngày với công ty mẹ, tổng công ty nhà nước); báo cáo năm chậm nhất {thoiHan.dn.nam|0} ngày ({thoiHan.dnRieng.nam|0} ngày với doanh nghiệp tư nhân, công ty hợp danh)."
  ],
  "1-2-4": [
    "Hai chế độ không loại trừ nhau mà bổ sung cho nhau.",
    "Nội dung nào không được hướng dẫn riêng thì thực hiện theo Luật Kế toán và chế độ kế toán doanh nghiệp.",
    "Việc chọn chế độ phụ thuộc vào việc đơn vị có thành lập BQLDA và tổ chức bộ máy kế toán riêng hay không."
  ],
  "1-3-1": [
    "Việc so sánh giới hạn ở kế toán của BQLDA theo Thông tư 195 và kế toán của doanh nghiệp theo Thông tư 200.",
    "Hai chế độ có cùng “gốc” vì Thông tư 195 xây dựng trên chế độ kế toán doanh nghiệp.",
    "Khác biệt nằm ở mục đích, tài khoản đặc thù, nghiệp vụ và báo cáo, không nằm ở các nguyên tắc kế toán cơ bản."
  ],
  "1-3-2": [
    "Năm tiêu chí so sánh: mục đích hạch toán; hệ thống tài khoản; nghiệp vụ kế toán đặc thù; hệ thống báo cáo tài chính; thời hạn lập và nộp báo cáo.",
    "Với BQLDA, vốn đi từ chủ đầu tư, được tập hợp thành chi phí đầu tư trên TK 241 và kết thúc bằng quyết toán, bàn giao tài sản; với doanh nghiệp, hạch toán đi qua doanh thu và chi phí, kết thúc ở lãi, lỗ.",
    "Chi phí quản lý ở BQLDA được phân bổ vào giá trị công trình, còn ở doanh nghiệp nó đi vào chi phí kỳ và ảnh hưởng trực tiếp đến lợi nhuận."
  ],
  "2-1-1": [
    "Ban là đơn vị trực thuộc chủ đầu tư, có tổ chức công tác kế toán riêng và lập báo cáo tài chính riêng gửi chủ đầu tư.",
    "Tổng mức đầu tư được duyệt {bq.info.tongMuc|0} tỷ đồng, thời gian thực hiện từ năm {t:bq.info.namBatDau} đến năm {t:bq.info.namKetThuc}.",
    "Ban không hoạt động như một doanh nghiệp sản xuất kinh doanh nhằm tạo lợi nhuận cho chính đơn vị."
  ],
  "2-1-2": [
    "Ở BQLDA, hơn 93% tổng tài sản là chi phí đầu tư xây dựng dở dang và gần 95% nguồn vốn là nguồn vốn đầu tư do chủ đầu tư cấp.",
    "Ở công ty mẹ Hòa Phát, xây dựng cơ bản dở dang chỉ chiếm {calc.hpPct.xdcb|3}% tổng tài sản; vốn chủ sở hữu chiếm {calc.hpPct.vcsh|1}% nguồn vốn.",
    "BQLDA phản ánh nguồn vốn và chi phí hình thành dự án, doanh nghiệp phản ánh toàn bộ tài sản, nguồn vốn và kết quả hoạt động kinh doanh."
  ],
  "2-2-1": [
    "Tài sản dài hạn chiếm {bq.b01.pct.tsdh|1}% tổng tài sản của BQLDA so với {calc.hpPct.tsdh|1}% của công ty mẹ Hòa Phát, nhưng bản chất khác: của Ban là công trình đang hình thành, của Hòa Phát là khoản đầu tư vào công ty con.",
    "Khoản mục lớn nhất của Ban là TK 241 ({bq.b01.pct.tk241|1}%); ở Hòa Phát là đầu tư vào công ty con ({calc.hpPct.ctyCon|1}%). Báo cáo riêng không cộng gộp tài sản, nợ, doanh thu, chi phí của công ty con.",
    "Một bên là vốn được giao để quản lý rồi quyết toán, một bên là vốn thuộc sở hữu của cổ đông."
  ],
  "2-2-2": [
    "Điểm khác biệt cốt lõi của tài sản ngắn hạn không nằm đơn thuần ở quy mô mà ở mục đích tồn tại của từng khoản mục.",
    "BQLDA giữ tiền, khoản tạm ứng và vật tư để phục vụ một dự án cụ thể; công ty mẹ Hòa Phát theo dõi vốn lưu động phát sinh từ hoạt động của chính mình.",
    "Ban không bán hàng nên không phát sinh phải thu thương mại."
  ],
  "2-2-3": [
    "BQLDA chỉ giữ lượng tài sản nhỏ phục vụ bộ máy quản lý; tài sản hình thành từ dự án nằm ở chi phí đầu tư xây dựng dở dang cho đến khi được quyết toán và bàn giao.",
    "Cùng phương pháp đường thẳng nhưng khấu hao đi đến nơi khác nhau: ở Hòa Phát vào chi phí làm giảm lợi nhuận, ở BQLDA vào giá trị công trình.",
    "TK 241 gần như là toàn bộ tài sản của Ban ({bq.b01.pct.tk241|1}%), còn ở Hòa Phát chỉ chiếm {calc.hpPct.xdcb|3}%."
  ],
  "2-2-4": [
    "Nợ của BQLDA chủ yếu gắn với nhà thầu và hoạt động triển khai dự án; nợ của công ty mẹ Hòa Phát toàn bộ là ngắn hạn, {calc.hpPct.quyKTPL|1}% là quỹ khen thưởng, phúc lợi, không có vay.",
    "BQLDA không ghi nhận khoản vay do chủ đầu tư đứng tên vay rồi cấp lại như nghĩa vụ vay của chính Ban.",
    "Nguồn vốn đầu tư không phải là vốn chủ sở hữu: Ban chỉ có tư cách quản lý, vốn phải quyết toán và bàn giao, không có quyền phân phối."
  ],
  "2-2-5": [
    "BQLDA không có quyền sở hữu độc lập đối với nguồn vốn được giao nên không hình thành vốn cổ phần, quỹ từ lợi nhuận hay lợi nhuận chưa phân phối.",
    "Vốn của Ban chỉ tăng khi chủ đầu tư cấp thêm và chỉ giảm khi quyết toán, bàn giao.",
    "Vốn của Hòa Phát biến động theo kết quả kinh doanh, cổ tức và quyết định của cổ đông."
  ],
  "2-2-6": [
    "Ở doanh nghiệp, cuối kỳ các tài khoản này được kết chuyển vào kết quả kinh doanh rồi vào lợi nhuận chưa phân phối; BQLDA không thực hiện theo cơ chế này.",
    "TK 642 có cùng số hiệu nhưng đi hai đường: ở Hòa Phát làm giảm lợi nhuận; ở BQLDA kết chuyển vào TK 241 và làm tăng giá trị tài sản bàn giao.",
    "Chênh lệch tỷ giá ở Hòa Phát đi vào kết quả kinh doanh, ở BQLDA được chuyển cho chủ đầu tư (TK 3362)."
  ],
  "2-2-7": [
    "BQLDA in ngay dưới bảng cân đối phần “Các chỉ tiêu ngoài bảng cân đối kế toán”.",
    "Hòa Phát không có phần này trên Bảng cân đối kế toán; ngoại tệ chỉ được liệt kê ở thuyết minh 4.2.",
    "Mẫu B01-CĐT có phần chỉ tiêu ngoài bảng; mẫu B01-DN không có dòng này."
  ],
  "2-3-1": [
    "B02-CĐT theo dõi biến động của đúng một tài khoản, TK 3361, từ {bq.b02.dau|3} tỷ lên {bq.b02.cuoi|3} tỷ.",
    "Hai báo cáo có thể cùng thể hiện số đầu kỳ, tăng, giảm và cuối kỳ nhưng không cùng bản chất kinh tế.",
    "Vốn BQLDA tăng {calc.hpPct.bqVonTang|1}% nhờ chủ đầu tư cấp; vốn Hòa Phát tăng {calc.hpPct.vcshTang|1}% nhờ lợi nhuận, gần như toàn bộ là lợi nhuận được chia từ công ty con."
  ],
  "2-3-2": [
    "BQLDA phải tách nguồn cấp bằng tiền với vật tư, thiết bị và đối chiếu số dư với chủ đầu tư; Hòa Phát trình bày vốn chủ sở hữu theo bốn cột và được kiểm toán độc lập.",
    "Vốn của Ban là nguồn “được giao”, vốn của Hòa Phát phần lớn là nguồn “tự tích lũy”.",
    "BQLDA trả lời theo quan hệ chủ đầu tư – ban quản lý (cấp vốn, quyết toán, bàn giao), Hòa Phát theo quan hệ công ty – cổ đông (góp vốn, lợi nhuận, cổ tức)."
  ],
  "2-4-1": [
    "Điểm khác cốt lõi không nằm ở tên báo cáo mà ở đích đến của chi phí.",
    "Trên B03-CĐT, toàn bộ {bq.b03.ps|3} tỷ chi phí phát sinh năm 2015 đi vào tài sản (TK 241); Hòa Phát trừ chi phí vào doanh thu, lợi nhuận sau thuế {hp.lnst|1} tỷ chủ yếu đến từ cổ tức công ty con.",
    "BQLDA đo tiến độ, Hòa Phát đo kết quả."
  ],
  "2-4-2": [
    "BQLDA cần theo dõi không chỉ tổng chi phí dở dang mà còn trạng thái hoàn thành, phần chi phí dùng chung và giá trị đã bàn giao.",
    "Ban chỉ có một dự án nên chi tiết đến hạng mục; công ty mẹ Hòa Phát chỉ trình bày một chỉ tiêu XDCB dở dang tổng hợp.",
    "Ở Hòa Phát chỉ thấy XDCB dở dang {hp.xdcb|3} tỷ và tổng tăng nguyên giá TSCĐ hữu hình {hp.tangNG|3} tỷ."
  ],
  "2-5": [
    "Cùng sự kiện “công trình hoàn thành” nhưng kết cục khác hẳn: BQLDA xóa {bq.f03b.duyet|3} tỷ khỏi sổ vì đã bàn giao cho chủ đầu tư.",
    "Hòa Phát ghi tăng {hp.tangNG|3} tỷ tài sản cố định hữu hình rồi tiếp tục khấu hao.",
    "Hòa Phát tiếp tục theo dõi nguyên giá, hao mòn và khấu hao; Ban chỉ có một đích là bàn giao."
  ],
  "3-1": [
    "Điểm nổi bật của Thông tư 195 là khả năng giám sát chi tiết nguồn vốn so với tổng mức đầu tư được duyệt.",
    "Kế toán BQLDA phải phân bổ toàn bộ chi phí hoạt động (TK 642) vào giá trị dự án: năm 2015 là {bq.f03d.ps2015|3} tỷ đồng.",
    "Nếu tiêu thức phân bổ không phù hợp với thực tế thi công, giá trị quyết toán của từng hạng mục công trình sẽ bị phản ánh sai lệch."
  ],
  "3-2": [
    "BQLDA không ghi nhận vốn chủ sở hữu; tài sản chủ yếu tập trung ở chi phí đầu tư xây dựng dở dang ({bq.b01.pct.tk241|1}% tổng tài sản).",
    "BQLDA không lập Báo cáo lưu chuyển tiền tệ: người đọc dùng B02-CĐT kết hợp B03-CĐT để theo dõi luân chuyển vốn.",
    "Hiệu quả của BQLDA được đánh giá qua tiến độ giải ngân và sự tuân thủ dự toán, thay vì các chỉ số tỷ suất sinh lời thông thường."
  ],
  "kl": [
    "Chế độ kế toán luôn phản ánh đúng chức năng, nhiệm vụ và bản chất hoạt động của đơn vị.",
    "Kế toán của Ban tập trung vào kiểm soát nguồn cấp phát (TK 336) và tập hợp chi phí đầu tư xây dựng (TK 241); doanh nghiệp đo lường chu kỳ kinh doanh qua doanh thu, chi phí và kết quả hoạt động kinh doanh.",
    "Bộ Tài chính đã ban hành Thông tư 99/2025/TT-BTC (hiệu lực từ 01/01/2026) thay thế cả Thông tư 195/2012/TT-BTC và Thông tư 200/2014/TT-BTC."
  ]
};

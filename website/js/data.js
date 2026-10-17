/*
 * TOÀN BỘ SỐ LIỆU CỦA WEBSITE — sửa số ở đây, trang tự cập nhật.
 *
 * Quy ước đơn vị:
 *  - bq.*  (BQLDA Đồng Bằng 2015): ĐỒNG, chép nguyên từ BCTC scan (bctc_bqlda.pdf).
 *          Trang hiển thị theo tỷ đồng, làm tròn nửa lên trên số nguyên đồng.
 *  - hp.*  (Tập đoàn Hòa Phát hợp nhất 2024): TỶ ĐỒNG, đúng như bài (baocao.pdf).
 *          Không có BCTC Hòa Phát gốc, nên mọi chip nguồn ghi "theo bài".
 *  - pct:  tỷ lệ % đúng như bài / BCTC (1 chữ số thập phân).
 *  - Số trang "tr." của BQLDA là số trang trong bctc_bqlda.pdf;
 *    số trang của Hòa Phát là số trang BCTC Hòa Phát mà bài trích dẫn.
 */
window.DATA = {
  meta: {
    truong: "NATIONAL ECONOMICS UNIVERSITY",
    vien: "SCHOOL OF ADVANCED EDUCATION PROGRAMS",
    mon: "Kế toán dự án đầu tư xây dựng",
    deTai:
      "Phân tích sự khác biệt về chế độ kế toán và báo cáo tài chính Ban Quản lý dự án giữa Thông tư 195/2012/TT-BTC và báo cáo tài chính Doanh nghiệp sử dụng Thông tư 200/2014/TT-BTC",
    nhom: "Nhóm 2",
    nam: 2026,
    thanhVien: [
      { ten: "Đỗ Thị Tiểu Luận", msv: "11230353" },
      { ten: "Đặng Việt Hoàng", msv: "11232291" },
      { ten: "Dương Gia Khánh", msv: "11231085" },
      { ten: "Đỗ Minh Việt", msv: "11236876" }
    ]
  },

  /* ---------------- BQLDA Nhà máy Chế biến Nông sản Đồng Bằng ---------------- */
  bq: {
    info: {
      quyetDinh: "45/QĐ-HĐQT",
      ngayThanhLap: "05/03/2013",
      nhanSu2015: 24,
      nhanSu2014: 22,
      tongMuc: 312000000000,
      namBatDau: 2013,
      namKetThuc: 2016,
      diaDiem: "KCN Trà Nóc, Cần Thơ",
      ngayLapBCTC: "20/01/2016",
      hopDongTinDung: "07/2013/HĐTD"
    },

    /* B01-CĐT, 31/12/2015 (tr.2) và thuyết minh B04-CĐT (tr.5–7) */
    b01: {
      tsnh: 11947250000,
      tien: 4164850000,
      tienMat: 38500000,
      nhNgoaiThuong: 3802150000, // TK vốn đầu tư
      nhCongThuong: 324200000, // TK hoạt động Ban
      traTruoc: 3200000000,
      traTruocXayLap5: 1900000000,
      traTruocVietLong: 1300000000,
      phaiThuKhac: 347400000,
      tamUng: 285000000,
      tk1388: 62400000,
      htk: 1895000000,
      vatLieu: 350000000,
      thietBi: 1500000000,
      ccdc: 45000000,
      gtgt: 2340000000,
      tsdh: 187516500000,
      tscd: 774000000,
      nguyenGia: 1260000000,
      haoMon: 486000000,
      khauHaoNam: 134000000,
      khNamPTVT: 10, // phương tiện vận tải: 10 năm (B04 IV.3)
      khNamTBQLtu: 3,
      khNamTBQLden: 5,
      tk241: 186742500000,
      tongTS: 199463750000,
      no: 10746300000,
      ptnb: 9820000000,
      ptnbXayLap5: 4650000000,
      ptnbVietLong: 2730000000,
      ptnbMienTay: 1240000000,
      ptnbKhac: 1200000000,
      thueTNCN: 128600000,
      ptld: 215400000,
      noiBo3368: 412000000,
      phaiTraKhac: 74300000,
      quyKTPL: 96000000,
      quyDau: 84000000,
      quyCap: 120000000,
      quyChi: 108000000,
      nvdt: 188717450000,
      tongNV: 199463750000,
      usdCuoi: 5420,
      usdDau: 8150,
      pct: { tsnh: 6.0, tsdh: 94.0, tk241: 93.6, no: 5.4, nvdt: 94.6 }
    },

    /* B02-CĐT (tr.3): TK 3361 */
    b02: {
      dau: 129449900000,
      tang: 63850000000,
      tangTien: 60650000000,
      tangVatTu: 3200000000,
      giam: 4582450000,
      cuoi: 188717450000
    },

    /* F02-CĐT (tr.8): chi tiết theo nguồn */
    f02: {
      vcsh: { dau: 78200000000, tangTien: 24150000000, tangVatTu: 3200000000, giam: 2960000000, cuoi: 102590000000 },
      vay: { dau: 51249900000, tangTien: 36500000000, tangVatTu: 0, giam: 1622450000, cuoi: 86127450000 },
      pctVcsh: 54.4,
      pctVay: 45.6
    },

    /* B03-CĐT (tr.4): TK 241 theo nội dung chi phí */
    b03: {
      dau: 121586000000,
      ps: 69738950000,
      giam: 4582450000,
      cuoi: 186742500000,
      tongMuc: 312000000000,
      luyKe: 191324950000,
      tyLe: 61.3,
      quyetToan: 4582450000,
      items: [
        { key: "xd", ten: "Xây dựng", dau: 74912000000, ps: 41236800000, giam: 3120000000, cuoi: 113028800000 },
        { key: "tb", ten: "Thiết bị", dau: 28640000000, ps: 15482300000, giam: 640000000, cuoi: 43482300000 },
        { key: "bt", ten: "Bồi thường, hỗ trợ, tái định cư", dau: 6830000000, ps: 2915000000, giam: 0, cuoi: 9745000000 },
        { key: "ql", ten: "Quản lý dự án", dau: 3915000000, ps: 2146450000, giam: 210000000, cuoi: 5851450000 },
        { key: "tv", ten: "Tư vấn đầu tư xây dựng", dau: 5468000000, ps: 5873200000, giam: 412450000, cuoi: 10928750000 },
        { key: "kh", ten: "Chi phí khác", dau: 1821000000, ps: 2085200000, giam: 200000000, cuoi: 3706200000 }
      ]
    },

    /* F03A-CĐT (tr.9): theo hạng mục công trình */
    f03a: {
      items: [
        { ten: "Nhà xưởng chế biến chính", dau: 51300000000, ps: 31250000000, giam: 0, cuoi: 82550000000, xd: 52400000000, tb: 30150000000, bt: 0, ql: 0, tv: 0, kh: 0 },
        { ten: "Kho lạnh và kho thành phẩm", dau: 19800000000, ps: 10482300000, giam: 0, cuoi: 30282300000, xd: 21350000000, tb: 8932300000, bt: 0, ql: 0, tv: 0, kh: 0 },
        { ten: "Hệ thống xử lý nước thải", dau: 9100000000, ps: 9578800000, giam: 0, cuoi: 18678800000, xd: 14278800000, tb: 4400000000, bt: 0, ql: 0, tv: 0, kh: 0 },
        { ten: "Hạ tầng kỹ thuật (đường nội bộ, cấp điện, cấp thoát nước)", dau: 8250000000, ps: 8250000000, giam: 0, cuoi: 16500000000, xd: 16500000000, tb: 0, bt: 0, ql: 0, tv: 0, kh: 0 },
        { ten: "Nhà điều hành và công trình phụ trợ", dau: 3900000000, ps: 4600000000, giam: 0, cuoi: 8500000000, xd: 8500000000, tb: 0, bt: 0, ql: 0, tv: 0, kh: 0 },
        { ten: "Chi phí chung toàn dự án (chưa phân bổ cho hạng mục)", dau: 25136000000, ps: 5095400000, giam: 0, cuoi: 30231400000, xd: 0, tb: 0, bt: 9745000000, ql: 5851450000, tv: 10928750000, kh: 3706200000 },
        { ten: "Nhà bảo vệ, hàng rào, cổng (đã hoàn thành, bàn giao)", dau: 4100000000, ps: 482450000, giam: 4582450000, cuoi: 0, xd: 0, tb: 0, bt: 0, ql: 0, tv: 0, kh: 0, banGiao: true }
      ]
    },

    /* F03B-CĐT (tr.10) */
    f03b: {
      hangMuc: "Nhà bảo vệ, hàng rào, cổng",
      ngayBanGiao: "30/10/2015",
      soQd: "128/QĐ-HĐQT",
      ngayQd: "12/11/2015",
      deNghi: 4582450000,
      duyet: 4582450000,
      chenhLech: 0,
      xd: 3120000000,
      tb: 640000000,
      ql: 210000000,
      tv: 412450000,
      khac: 200000000
    },

    /* F03C-CĐT (tr.11) */
    f03c: { dau: 1821000000, ps: 2085200000, giam: 200000000, cuoi: 3706200000 },

    /* F03D-CĐT (tr.12): TK 642 */
    f03d: {
      ps2015: 2146450000,
      ps2014: 2010300000,
      phanBo: 2146450000,
      conLai: 0,
      luong: 1018400000,
      baoHiem: 206900000,
      khauHao: 134000000
    }
  },

  /* ---------------- Tập đoàn Hòa Phát hợp nhất 31/12/2024 (theo bài, tỷ đồng) ---------------- */
  hp: {
    ngayKy: "24/03/2025",
    tongTS: 224490,
    tsnh: 86674,
    tsdh: 137815,
    xdcb: 63655.9,
    tscdhh: 67244.2,
    htk: 46091.2,
    no: 109842,
    vay: 82963.1,
    vayNH: 55882.7,
    vayDH: 27080.4,
    vcsh: 114647, // bài ghi 114.647 khi làm tròn tỷ
    vcshChiTiet: 114647.5, // bài ghi 114.647,5 khi có 1 chữ số thập phân
    lnChuaPP: 49599,
    pct: { tsnh: 38.6, tsdh: 61.4, xdcb: 28.4, tscd: 30.0, htk: 20.5, no: 48.9, vcsh: 51.1 },

    // Tài sản ngắn hạn (đầu 1)
    tien: 6887.6,
    tienMat: 13.8,
    tienGui: 2905.7,
    tuongDuongTien: 3968.1,
    dauTuTC: 18974.7,
    phaiThuKH: 4352.1,
    phaiThuKhac: 1249.0,
    duPhongPTKD: 159.99,
    gtgt: 6636.7,
    cpTraTruocNH: 426.1,
    traTruocNH: 2118.8,
    traTruocDH: 82.8,
    htkGoc: 46192.3,
    htkDuPhong: 101.1,

    // Tài sản dài hạn (đầu 2)
    nguyenGia: 108146.6,
    haoMon: 40902.4,
    khauHaoPhanBo: 6915.7,
    tsHetKH: 11515,
    tsDoDangDH: 63750.7,
    tsVoHinh: 184.2,
    bdsDauTu: 559.6,
    dauTuDH: 136.5,
    cpTraTruocDH: 4269.1,
    tsThueHoanLai: 254.7,
    loiTheTM: 63.6,
    duAnDungQuat: 60108.1,

    // Nợ phải trả (đầu 3)
    ptnbNH: 14046.8,
    ptnbDH: 6283.6,
    thuePhaiNop: 1743.4,
    ptld: 890.9,
    cpPhaiTraNH: 682.1,
    cpPhaiTraDH: 1143.7,
    phaiTraKhac: 188.1,
    quyKTPL: 1027.3,

    // Vốn chủ sở hữu (đầu 4)
    vonCoPhan: 63962.5,
    thangDuDauNam: 3211.6,
    quyDTPT: 794.8,

    // Kết quả kinh doanh (đầu 5–9)
    dtt: 138855.1,
    dtTaiChinh: 2618.9,
    giaVon: 120357.6,
    lnGop: 18497.5,
    bienGop: 13.3,
    cpBanHang: 2337.3,
    cpQLDN: 1545.5,
    cpTaiChinh: 3966.6,
    thuNhapKhac: 1159.8,
    cpKhac: 733.3,
    thueTNDN: 1673.5,
    lnTruocThue: 13693.5,
    lnst: 12020.0,
    lnstPct: 8.7,
    laiTyGia: 1319.8,
    loTyGia: 1473.2,

    // Biến động vốn chủ sở hữu (tm 26)
    gopVonCDKKS: 233.1,
    trichQuy: 433.1,

    // Ngoài bảng
    usd: 14517852,
    usdTy: 366.6,

    // XDCB dở dang (tm 14)
    xdcbTang: 39906.8,
    laiVayVonHoa: 1310.4,
    chuyenTSCD: 2925.6,
    khauHao: 6810.7,
    xoaSoXDCB: 16.1,

    // Chi tiết khác theo bài (mục 2.2–2.5)
    laiDTTCtu: 1.9, laiDTTCden: 6.7, // %/năm, tiền gửi kỳ hạn gốc trên 3 tháng
    laiTDTtu: 1.6, laiTDTden: 5.5, // %/năm, tương đương tiền
    pthMarcegaglia: 482.4, pthHPTrading: 558.7, pthHoaSen: 218.6,
    ptkLaiTienGui: 409.6, ptkKyCuoc: 350.2, ptkThueNK: 176.3, ptkBoiThuong: 125.7,
    htkDiDuong: 5559.0, htkNVL: 20324.5, htkThanhPham: 12155.7, htkDoDang: 4048.6,
    khNhaCuaTu: 5, khNhaCuaDen: 50, khMayMocTu: 1, khMayMocDen: 25,
    duAnDungQuatPct: 94.4, duAnContainer: 2232.0, duAnOngThep: 585.1, duAnNongNghiep: 326.2, duAnHaiDuong: 143,
    dtBanHang: 137852.9, dtDichVu: 725.5, dtChoThueDat: 1826.7, dtChoThueBDS: 147.9, dtGiamTru: 1706.3,
    gvThanhPham: 118828.1,
    bhVanChuyen: 563.2, bhXuatKhau: 1017.4, bhNhanVien: 209.3,
    dtcLaiTienGui: 1258.7, cptcDiVay: 2287.4,
    cpkGiaVonDienNuoc: 552.7, cpkBoiThuong: 97.2,
    thueHienHanh: 1765.8, thueHoanLai: -92.3, thueSuatHieuDung: 12.2,
    cdkksCoTuc: 6.3, suDungQuy: 2.6, traVonCDKKS: 0.1,
    coTucCP: 5814.6, coTucCPPct: 10, coTucTuThangDu: 3211.6, coTucTuLNCPP: 2603.1, hoanNhapQuyDTPT: 20.8,
    lcttThuDiVay: 174466.0, lcttTraNoGoc: 156878.9, lcttTraCoTuc: 5.0,
    chuyenTSCDVoHinh: 9.6, chuyenCPTTDH: 557.2, chuyenCPTTNH: 105.3,

    // Ước tính trong bài: tỷ lệ chi phí đi vào tài sản / kết quả kinh doanh
    ratioTaiSan: 23.6,
    ratioKetQua: 76.4
  },

  /* ============ SỐ TÍNH THÊM TỪ SỐ LIỆU CỦA BÀI / BCTC (bản 3) ============
   * Mỗi số dưới đây KHÔNG có sẵn trong bài: được tính bằng phép tính ghi ở chú thích.
   * Trên trang, số tính thêm luôn đi kèm chip "tính từ số liệu bài". */
  calc: {
    // 2.2.2: cơ cấu TSNH BQLDA = khoản mục / TSNH 11.947.250.000 (B01)
    bqTsnhTienPct: 34.9,      // 4.164.850.000 / 11.947.250.000
    bqTsnhPhaiThu: 3547400000, // B01 mã 130 = trả trước 3,2 + phải thu khác 0,3474 (có sẵn trên B01)
    bqTsnhPhaiThuPct: 29.7,   // 3.547.400.000 / 11.947.250.000
    bqTsnhHtkPct: 15.9,       // 1.895.000.000 / 11.947.250.000
    bqTsnhGtgtPct: 19.6,      // 2.340.000.000 / 11.947.250.000
    // 2.2.2: TSNH Hòa Phát, phần còn lại = 86.674 − 6.887,6 − 18.974,7 − 4.352,1 − 46.091,2
    hpTsnhConLai: 10368.4,
    // 2.2.1: tài sản Hòa Phát ngoài 6 khoản bài nêu = 224.490 − (67.244,2 + 63.655,9 + 46.091,2 + 18.974,7 + 6.887,6 + 4.352,1)
    hpTsConLai: 17284.3,
    // 2.2.4: cơ cấu nợ
    bqNoPtnbPct: 91.4,        // 9.820.000.000 / 10.746.300.000
    bqNoKhacPct: 8.6,         // 100 − 91,4
    bqNoKhac: 926300000,      // 10.746.300.000 − 9.820.000.000
    hpNoVayPct: 75.5,         // 82.963 / 109.842
    hpNoKhacPct: 24.5,        // 100 − 75,5
    hpNoKhac: 26879,          // 109.842 − 82.963
    // 2.4.1: các bậc trung gian của chuỗi kết quả kinh doanh Hòa Phát
    hpSauBhQl: 14614.7,       // 18.497,5 − 2.337,3 − 1.545,5
    hpSauTaiChinh: 13267.0,   // 14.614,7 + 2.618,9 − 3.966,6
    // 2.3.1: vốn chủ sở hữu Hòa Phát đầu năm suy ngược từ cuối năm và các khoản bài nêu
    // = 114.647,5 − 12.020,0 − 233,1 + 433,1 + 6,3 + 2,6 + 0,1  (Hình 2.7 của bài in 102.836,4; lệch 0,1 do làm tròn)
    hpVcshDauTinh: 102836.5,
    // 2.4.2: tỷ trọng từng hạng mục F03A trong số dư cuối năm 186.742.500.000
    f03aPct: [44.2, 16.2, 10.0, 8.8, 4.6, 16.2, 0],
    // 2.5: tỷ trọng cơ cấu giá trị quyết toán trong 4.582.450.000
    f03bPct: { xd: 68.1, tb: 14.0, ql: 4.6, tv: 9.0, khac: 4.4 }
  },

  /* Bảng 1.5: số dư lũy kế sau từng bước (cộng dồn các bút toán của bài, triệu đồng). Dương = dư Nợ, âm = dư Có. */
  tAcc: {
    bq: {
      tk: ["112", "336", "241", "331", "334", "642"],
      steps: [
        { "112": 2000, "336": -2000, "241": 0, "331": 0, "334": 0, "642": 0 },
        { "112": 2000, "336": -2000, "241": 1000, "331": -1000, "334": 0, "642": 0 },
        { "112": 2000, "336": -2000, "241": 1050, "331": -1000, "334": -50, "642": 0 },
        { "112": 2000, "336": -950, "241": 0, "331": -1000, "334": -50, "642": 0 }
      ]
    },
    dn: {
      tk: ["112", "341", "241", "331", "334", "642", "211"],
      steps: [
        { "112": 2000, "341": -2000, "241": 0, "331": 0, "334": 0, "642": 0, "211": 0 },
        { "112": 2000, "341": -2000, "241": 1000, "331": -1000, "334": 0, "642": 0, "211": 0 },
        { "112": 2000, "341": -2000, "241": 1000, "331": -1000, "334": -50, "642": 50, "211": 0 },
        { "112": 2000, "341": -2000, "241": 0, "331": -1000, "334": -50, "642": 50, "211": 1000 }
      ]
    }
  },

  /* Ước tính tương ứng của BQLDA */
  bqRatio: { taiSan: 100, ketQua: 0 },

  /* Thời hạn nộp BCTC (số ngày kể từ ngày kết thúc kỳ) */
  thoiHan: {
    bq: { quy: 20, nam: 30 },
    dn: { quy: 20, nam: 90 },
    dnRieng: { quy: 45, nam: 30 }
  },

  /* Ví dụ hạch toán (Bảng 1.5, triệu đồng) */
  viDu: { nhanVon: 2000, nghiemThu: 1000, luong: 50, banGiaoBq: 1050, banGiaoDn: 1000, chiPhiKy: 50 }
};

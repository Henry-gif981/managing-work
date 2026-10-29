/*
 * TOÀN BỘ SỐ LIỆU CỦA WEBSITE — sửa số ở đây, trang tự cập nhật.
 *
 * Quy ước đơn vị:
 *  - bq.*  (BQLDA Đồng Bằng 2015): ĐỒNG, chép nguyên từ BCTC scan (bctc_bqlda.pdf).
 *          Trang hiển thị theo tỷ đồng, làm tròn nửa lên trên số nguyên đồng.
 *  - hp.*  (Công ty CP Tập đoàn Hòa Phát, BCTC riêng năm 2024): TỶ ĐỒNG, chép từ BCTC riêng đã kiểm toán.
 *          Chip nguồn ghi "Hòa Phát tr.N" hoặc "tm X, tr.N" với N là trang in (1–39).
 *  - pct:  tỷ lệ % của BQLDA đúng như bài; tỷ lệ % của Hòa Phát tính bằng code (calc.hp*), 1 chữ số thập phân.
 *  - Số trang "tr." của BQLDA là số trang trong bctc_bqlda.pdf;
 *    số trang của Hòa Phát là trang in của BCTC riêng (trang PDF = trang in + 1).
 */
window.DATA = {
  /* QUY ƯỚC LÀM TRÒN TOÀN TRANG (bản 4, mục A7). Đổi ở đây là đổi toàn trang.
   *  bqDec: số chữ số thập phân khi hiển thị số BQLDA theo tỷ đồng (gốc là đồng).
   *  pctDec: số chữ số thập phân của mọi tỷ lệ %.
   *  Số Hòa Phát giữ đúng số chữ số thập phân như bài (đặt bằng data-d ở từng chỗ). */
  fmt: { bqDec: 3, pctDec: 1 },

  meta: {
    truong: "NATIONAL ECONOMICS UNIVERSITY",
    vien: "SCHOOL OF ADVANCED EDUCATION PROGRAMS",
    mon: "Kế toán dự án đầu tư xây dựng",
    deTai:
      "Phân tích sự khác biệt về chế độ kế toán và báo cáo tài chính Ban Quản lý dự án giữa Thông tư 195/2012/TT-BTC và báo cáo tài chính Doanh nghiệp sử dụng Thông tư 200/2014/TT-BTC",
    nhom: "Nhóm 2",
    nam: 2026,
    giangVien: "PGS.TS. Nguyễn La Soa",
    thanhVien: [
      { ten: "Đỗ Thị Tiểu Luận", msv: "11230353" },
      { ten: "Đặng Việt Hoàng", msv: "11232291" },
      { ten: "Dương Gia Khánh", msv: "11231085" },
      { ten: "Đỗ Minh Việt", msv: "11236876" },
      { ten: "Đỗ Bảo Ngọc", msv: "11236548" }
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

  /* ---------------- Hòa Phát: BCTC riêng (công ty mẹ) 31/12/2024, tỷ đồng ---------------- */
  /* Công ty CP Tập đoàn Hòa Phát, BÁO CÁO TÀI CHÍNH RIÊNG năm 2024 (công ty mẹ, không hợp nhất công ty con),
   * đã kiểm toán bởi Công ty TNHH KPMG (báo cáo kiểm toán số 22-02-00117-25-1, ngày 24/3/2025).
   * Đơn vị: tỷ đồng, làm tròn 3 chữ số thập phân từ số đồng trên BCTC. Trang = trang in (1–39);
   * trang PDF = trang in + 1. tm = số thuyết minh (1–28). Các tỷ lệ % tính bằng code ở cuối file. */
  hp: {
    ngayKy: "24/03/2025",
    soBCKT: "22-02-00117-25-1",
    nhanVien: 154, nhanVienDau: 127, ctyConCap1: 5, // tm 1.4, tr.12

    // B01 riêng (tr.6–8): 31/12/2024 | 1/1/2024
    tongTS: 81793.077, tongTSDau: 71986.602,
    tsnh: 1015.072, tsnhDau: 1952.863,
    tien: 319.258, tienDau: 140.728, tienMat: 0.383, tienGui: 46.075, tuongDuongTien: 272.800, // tm 4.1, tr.18
    laiTDTtu: 4.2, laiTDTden: 4.75, // %/năm, tương đương tiền (tm 4.1)
    dauTuTC: 281.047, dauTuTCDau: 1723.200, // tm 11.1, tr.24
    laiDTTCtu: 4.6, laiDTTCden: 5.4, laiDTTCtuDau: 5.5, laiDTTCdenDau: 9.2,
    phaiThuNH: 382.020, phaiThuNHDau: 60.798,
    phaiThuKH: 146.311, phaiThuKHPctCtyCon: 99.3, // tm 5, tr.18
    traTruocNH: 19.125,
    choVayNH: 196.900, choVayDH: 19.000, // tm 6, tr.19
    phaiThuKhac: 19.683, ptkLaiDuThu: 9.885, ptkThanhToanHo: 7.548, ptkKhac: 2.250, // tm 7.1, tr.20
    htk: 0.722, htkDau: 0,
    tsnhKhac: 32.026, cpTraTruocNH: 29.956, gtgt: 0.923, thuePhaiThu: 1.147,
    cpttQuangCao: 11.388, cpttThueVP: 13.710, cpttKhac: 4.859, // tm 12.1, tr.25
    tsdh: 80778.004, tsdhDau: 70033.739,
    phaiThuDH: 23.095, phaiThuDHDau: 238.495,
    tscd: 67.613, tscdDau: 89.972,
    tscdhh: 59.554, nguyenGia: 186.038, haoMon: 126.483, tsVoHinh: 8.059,
    bdsDauTu: 92.443, bdsDauTuDau: 105.404, bdsNguyenGia: 259.227, // tm 10, tr.23
    xdcb: 5.560, xdcbDau: 0.878, // mã 242
    dauTuCtyCon: 80585.847, dauTuCtyConDau: 69595.845, // tm 11.2, tr.24–25
    cpTraTruocDH: 3.445, cpTraTruocDHDau: 3.145,
    no: 1012.890, noDau: 1185.507, // mã 300 = 310 (toàn bộ ngắn hạn, không có vay)
    ptnb: 20.303, ptnbBLQ: 0.756, // tm 13, tr.26
    thuePhaiNop: 11.898, thueGTGTPN: 9.141, thueTNCNPN: 2.757, // tm 14, tr.27
    ptld: 8.110, cpPhaiTra: 0.481, dtChuaTH: 3.151,
    phaiTraKhac: 30.485, coTucPhaiTra: 0.752, coTucPhaiTraDau: 0.850, ptkConLai: 29.733, // tm 15, tr.28
    quyKTPL: 938.462, quyKTPLDau: 1118.614, trichQuy: 265.750, suDungKTPL: 445.903, // tm 16, tr.28
    vcsh: 80780.187, vcshDau: 70801.095,
    vonCoPhan: 63962.502, vonCoPhanDau: 58147.857,
    thangDu: 0, thangDuDauNam: 3211.560,
    quyDTPT: 788.438, quyDTPTDau: 790.997,
    lnChuaPP: 16029.247, lnChuaPPDau: 8650.681,

    // B02 riêng (tr.9): năm 2024 | 2023
    dtBH: 336.845, dtGiamTru: 0.006, dtt: 336.838, dtt2023: 269.468,
    dtDichVu: 293.240, dtChoThueBDS: 43.605, // tm 21, tr.32
    giaVon: 269.172, giaVon2023: 146.764, gvDichVu: 256.210, gvBDS: 12.961, // tm 22, tr.32
    lnGop: 67.667, lnGop2023: 122.704,
    dtTaiChinh: 10300.211, dtTaiChinh2023: 2753.143,
    lnCtyCon: 10242.531, lnCtyCon2023: 2483.067, laiTienGuiChoVay: 57.680, laiTyGiaDong: 88322, // tm 23, tr.32
    cpTaiChinh: 0, cpTaiChinh2023: 144.038, laiVay2023: 143.338,
    cpBanHang: 0.003, cpQLDN: 121.220, cpQLDN2023: 225.534,
    qlMuaNgoai: 43.565, qlKhauHao: 21.862, qlNhanVien: 14.676, qlPhanBo: 1.255, qlKiemToan: 0.999, qlKhac: 38.864, // tm 24, tr.33
    lnThuanHDKD: 10246.655, // mã 30
    thuNhapKhac: 1.951, cpKhac: 1.206, kqKhac: 0.746,
    lnTruocThue: 10247.400, thueTNDN: 0, thueTNDN2023: 18.436, lnst: 10247.400,
    thueSuat: 20, coTucKhongChiuThue: 2048.506, loTinhThueDung: 10.097, thueHLChuaGN: 15.188, loTinhThueChuaDung: 75.940, // tm 26, tr.34

    // B03 riêng (tr.10–11, năm 2024; tiền ra ghi số âm)
    khauHaoPhanBo: 46.968, // mã 02
    lcttKD: -583.973, lcttDT: 762.602, lcttTC: -0.098, tienThuan: 178.530,
    m21: -18.154, m22: 1.951, m23: -1774.797, m24: 3235.450, m25: -11290.000, m26: 299.998, m27: 10308.153,
    coTucTraTienTrieu: 98.469, // mã 36: trả cổ tức 98,469 triệu đồng
    vay2023: 760.000, traGoc2023: 4593.308,

    // Thuyết minh
    vcshTrichQuy: 265.750, suDungQuyDTPT: 2.559, // tm 17, tr.29
    coTucCP: 5814.645, coTucCPPct: 10, coTucTuThangDu: 3211.560, coTucTuLNCPP: 2603.085, cpPhatHanhCoTuc: 581464500, // tm 17–19
    tangNG: 13.472, tangPTVT: 10.486, tangTBVP: 2.242, tangMMTB: 0.744, // tm 8, tr.21
    khauHao: 32.359, tlNguyenGia: 17.598, tlHaoMon: 16.506, tsHetKH: 38.860, tsHetKHDau: 48.842,
    xoaPhanMem: 1.040, khVoHinh: 2.379, tsHetKHVoHinh: 17.865, // tm 9, tr.22
    khBDS: 12.961, // tm 10, tr.23
    khNhaCua: 10, khMayMocTu: 3, khMayMocDen: 10, khPTVTtu: 6, khPTVTden: 10, khTBVPtu: 3, khTBVPden: 10, khBDSNam: 20, // tm 3.6, 3.8
    usd: 407, usdTrieu: 9.309, // tm 4.2
    camKetThue: 336.347, camKetThueDau: 411.869 // tm 20, tr.31
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
    // 2.2.4: cơ cấu nợ
    bqNoPtnbPct: 91.4,        // 9.820.000.000 / 10.746.300.000
    bqNoKhacPct: 8.6,         // 100 − 91,4
    bqNoKhac: 926300000,      // 10.746.300.000 − 9.820.000.000
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

/* SỐ TÍNH THÊM CỦA HÒA PHÁT: tính bằng code từ số trên BCTC riêng (không gõ tay), tỷ lệ % làm tròn 1 chữ số thập phân
 * (trừ các tỷ lệ rất nhỏ hoặc sát 100% cần thêm chữ số để không hiện thành 0,0% hay 100,0%).
 * Trên trang, số tính thêm đi kèm chú thích "tính từ số liệu trên báo cáo" và viền đứt ở Chế độ rà soát. */
(function (D) {
  var h = D.hp, c = D.calc, b01 = D.bq.b01;
  function rd(x, n) { var k = Math.pow(10, n); return Math.round(x * k) / k; }
  function pct(a, t, n) { return rd((a / t) * 100, n == null ? 1 : n); }
  c.hpPct = {
    tsnh: pct(h.tsnh, h.tongTS), tsdh: pct(h.tsdh, h.tongTS),
    ctyCon: pct(h.dauTuCtyCon, h.tongTS), xdcb: pct(h.xdcb, h.tongTS, 3),
    no: pct(h.no, h.tongTS), vcsh: pct(h.vcsh, h.tongTS),
    // cơ cấu tài sản ngắn hạn
    phaiThuNH: pct(h.phaiThuNH, h.tsnh), tien: pct(h.tien, h.tsnh), dauTuTC: pct(h.dauTuTC, h.tsnh),
    tsnhKhac: pct(h.tsnhKhac, h.tsnh), htk: pct(h.htk, h.tsnh, 2),
    // cơ cấu nợ phải trả
    quyKTPL: pct(h.quyKTPL, h.no), noConLai: pct(h.no - h.quyKTPL, h.no),
    // biến động vốn
    vcshTang: pct(h.vcsh - h.vcshDau, h.vcshDau), bqVonTang: pct(D.bq.b02.cuoi - D.bq.b02.dau, D.bq.b02.dau),
    // kết quả kinh doanh
    bienGop: pct(h.lnGop, h.dtt), lnCtyConLnst: pct(h.lnCtyCon, h.lnst, 2), lnCtyConDttc: pct(h.lnCtyCon, h.dtTaiChinh),
    tangPTVT: pct(h.tangPTVT, h.tangNG),
    // ước tính thô của bài: chi phí 2024 đi vào tài sản (tiền chi mua sắm TSCĐ, mã 21) và vào kết quả kinh doanh
    vaoTaiSan: pct(-h.m21, -h.m21 + h.giaVon + h.cpQLDN + h.cpBanHang + h.cpKhac + h.cpTaiChinh),
    vaoKetQua: pct(h.giaVon + h.cpQLDN + h.cpBanHang + h.cpKhac + h.cpTaiChinh, -h.m21 + h.giaVon + h.cpQLDN + h.cpBanHang + h.cpKhac + h.cpTaiChinh)
  };
  c.hpLnstLanDtt = rd(h.lnst / h.dtt, 1);              // lợi nhuận sau thuế gấp bao nhiêu lần doanh thu thuần
  c.hpQuyMoLan = Math.round(h.tongTS / (b01.tongTS / 1e9)); // tổng tài sản Hòa Phát / tổng tài sản BQLDA
  c.hpNoConLai = rd(h.no - h.quyKTPL, 3);             // nợ phải trả ngoài quỹ khen thưởng, phúc lợi
  c.hpTsConLai = rd(h.tongTS - (h.dauTuCtyCon + h.phaiThuNH + h.tien + h.dauTuTC + h.bdsDauTu + h.tscdhh), 3);
  c.hpSauBhQl = rd(h.lnGop - h.cpBanHang - h.cpQLDN, 3); // âm: hoạt động bán hàng, dịch vụ chưa bù chi phí quản lý
  c.hpXdcbTang = rd(h.xdcb - h.xdcbDau, 3);
  c.hpTlConLai = rd(h.tlNguyenGia - h.tlHaoMon, 3);   // giá trị còn lại của TSCĐ hữu hình thanh lý, xóa sổ
  c.hpGopVon = -h.m25;                                 // tiền chi góp vốn vào công ty con (LCTT mã 25)
  c.hpMuaTSCD = -h.m21;                                // tiền chi mua sắm TSCĐ, tài sản dài hạn khác (mã 21)
  c.hpSauBhQlAbs = -c.hpSauBhQl;
  c.hpChoVay = rd(h.choVayNH + h.choVayDH, 3);        // dư nợ cho công ty con vay, ngắn và dài hạn
  c.hpVcshKhacLNCPP = rd(h.vcsh - h.lnChuaPP, 3);
  c.hpTsKhacCtyCon = rd(h.tongTS - h.dauTuCtyCon, 3);
  c.hpPctTsKhacCtyCon = rd(100 - c.hpPct.ctyCon, 1);
})(window.DATA);

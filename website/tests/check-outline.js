// Đối chiếu trang với "Bảng đối chiếu nội dung phải có" (yeu_cau_chinh_sua.md, mục 3)
// và các quy tắc bố cục chia đôi. Chạy: NODE_PATH=$(npm root -g) node website/tests/check-outline.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const PAGE = process.env.PAGE || 'index.html';

// Mỗi dòng: [mục, [các đoạn chữ phải có mặt trên trang]]
const CHECKLIST = [
  ['Danh mục từ viết tắt (nhóm bổ sung)', ['Danh mục từ viết tắt', 'BQLDA', 'BCTC', 'CĐT', 'TSCĐ', 'XDCB', 'TNDN', 'GTGT', 'Nhóm bổ sung']],
  ['Phần mở đầu: 3 tiêu đề', ['Lý do chọn đề tài'.toUpperCase(), 'MỤC TIÊU, ĐỐI TƯỢNG VÀ PHẠM VI NGHIÊN CỨU', 'PHƯƠNG PHÁP NGHIÊN CỨU', 'Đối chiếu văn bản', 'So sánh bút toán', 'Minh họa bằng số liệu mẫu']],
  ['Ch.1 đoạn dẫn + 3 phần', ['cùng dùng phương pháp ghi sổ kép', 'MỤC 1.1', 'MỤC 1.2', 'MỤC 1.3']],
  ['1.1.1 + Bảng 1.1', ['1.1.1', 'Tập hợp các hoạt động có liên quan với nhau', 'Tập hợp các đề xuất bỏ vốn trung hạn hoặc dài hạn', 'Bảng 1.1', 'Có mục tiêu rõ ràng', 'Có thời hạn xác định', 'Mang tính duy nhất', 'Nguồn lực giới hạn', 'Có tính bất định, rủi ro']],
  ['1.1.2 + Bảng 1.2 (5 tiêu thức) + câu chốt', ['1.1.2', 'Bảng 1.2', 'Theo nguồn vốn', 'Theo quy mô, tính chất', 'Theo lĩnh vực', 'Theo tính chất đầu tư', 'Theo chủ thể quản lý', 'cơ sở trực tiếp để chọn chế độ kế toán']],
  ['1.1.3 + Hình 1.1 + 3 ý', ['1.1.3', 'Hình 1.1', 'Chuẩn bị đầu tư', 'Thực hiện đầu tư', 'Kết thúc xây dựng, đưa vào khai thác', 'phát sinh ít nghiệp vụ nhưng quyết định tính hợp lệ', 'phát sinh nhiều nghiệp vụ nhất', 'lập báo cáo quyết toán vốn đầu tư dự án hoàn thành, xác định giá trị tài sản hình thành']],
  ['1.1.4 khái niệm, đặc điểm, 7 nhiệm vụ, 5 yêu cầu', ['1.1.4', 'KHÁI NIỆM', 'ĐẶC ĐIỂM', '7 NHIỆM VỤ', '5 YÊU CẦU', 'Tổ chức chứng từ, tài khoản, sổ kế toán', 'Cung cấp thông tin cho chủ đầu tư', 'Trung thực, đầy đủ, chính xác', 'Kịp thời', 'Rõ ràng, dễ hiểu', 'Chi tiết theo từng dự án, nguồn vốn và nội dung chi phí', 'Tuân thủ']],
  ['1.2.1 ba lớp + Bảng 1.3', ['1.2.1', 'LỚP 1', 'LỚP 2', 'LỚP 3', 'Bảng 1.3', 'Luật Kế toán số 88/2015/QH13', 'Nghị định 174/2016/NĐ-CP', 'Thông tư 79/2019/TT-BTC', 'Vai trò trong đề tài']],
  ['1.2.2 TT 195', ['1.2.2', '15/11/2012', '01/01/2013', 'QĐ 214/2000/QĐ-BTC', 'Chủ đầu tư không thành lập BQLDA', 'HỆ THỐNG TÀI KHOẢN', 'TK 154 thành “Chi phí sản xuất thử dở dang”', 'thêm bốn tài khoản cấp 2', 'NGHIỆP VỤ ĐẶC THÙ', 'BÁO CÁO TÀI CHÍNH', 'THỜI HẠN NỘP']],
  ['1.2.3 TT 200', ['1.2.3', '22/12/2014', '01/01/2015', 'TT 244/2009/TT-BTC', 'Thông tư 133/2016/TT-BTC', 'Thông tư 75/2015/TT-BTC', 'Thông tư 53/2016/TT-BTC', '2411, 2412, 2413', 'B09-DN']],
  ['1.2.4 + Hình 1.2', ['1.2.4', 'Hình 1.2', 'Ban quản lý dự án có tổ chức kế toán riêng', 'Chủ đầu tư có thành lập Ban quản lý dự án', 'Chủ đầu tư không thành lập BQLDA', 'Bổ sung TK cấp 2 của TK 136 (1362, 1363) theo TT 195', 'Lập thêm B02, B03/CĐT và 4 phụ biểu', 'phù hợp với hướng dẫn của Bộ Tài chính']],
  ['1.3.1 phạm vi', ['1.3.1', 'ĐỐI TƯỢNG (i)', 'ĐỐI TƯỢNG (ii)', 'Cùng “gốc”', 'hành chính sự nghiệp, thuế và kiểm toán']],
  ['1.3.2 tiêu chí, Bảng 1.4, Hình 1.3, Bảng 1.5, Hình 1.4', ['1.3.2', 'Bảng 1.4', 'Đối tượng áp dụng', 'Nơi nhận báo cáo', 'Điều 110 Thông tư 200', 'Hình 1.3', 'Bước 5', 'Bảng 1.5', 'ĐIỂM CẦN CHÚ Ý 1', 'ĐIỂM CẦN CHÚ Ý 2', 'Hình 1.4', 'Trường hợp riêng của doanh nghiệp']],
  ['1.3.3 năm ý', ['1.3.3', 'GIỐNG NHAU', 'KHÁC NHAU CỐT LÕI', 'HỆ QUẢ KHI HẠCH TOÁN', 'HỆ QUẢ KHI LẬP BÁO CÁO', 'ĐIỀU KIỆN ÁP DỤNG']],
  ['Mốc TT 99/2025 trên dòng thời gian', ['Bài, mục 1.2; mốc 2025 theo mục 3.3 và Kết luận', 'Thông tư 99/2025/TT-BTC']],
  ['2.1.1 + Bảng 2.1', ['2.1.1', '45/QĐ-HĐQT', '05/03/2013', 'con dấu', 'tài khoản tiền gửi riêng', 'Khu công nghiệp Trà Nóc', 'Ban không hoạt động như một doanh nghiệp sản xuất kinh doanh', 'Bảng 2.1', 'Chủ thể lập báo cáo', 'Chế độ kế toán áp dụng', 'Kỳ báo cáo, ngày lập', 'Bộ báo cáo', 'Hoạt động chính', 'Tổng tài sản cuối kỳ']],
  ['2.1.2 bộ BCTC, số liệu, Bảng 2.2, nhận xét', ['2.1.2', 'B01-CĐT', 'B02-CĐT', 'B03-CĐT', 'B04-CĐT', 'F02-CĐT', 'F03A-CĐT', 'F03B-CĐT', 'F03C-CĐT', 'F03D-CĐT', '191,32', '186,743', '4,582', 'Bảng 2.2', 'Vì sao khác:', 'hình ảnh của một dự án đang thi công']],
  ['2.2 mở đầu', ['B01-CĐT vẫn là một bảng cân đối đúng nghĩa', '199,46', 'TK 3361 thuộc đầu 3']],
  ['2.2.1 cơ cấu chung', ['2.2.1', 'Cơ cấu chung', 'Tài sản dài hạn', 'Khoản mục lớn nhất', 'Phần nguồn vốn còn lại']],
  ['2.2.2 chín khoản mục + hình', ['2.2.2', 'Tiền (mã 110)', 'Đầu tư tài chính (mã 120)', 'Phải thu khách hàng (mã 131)', 'Phải thu khác (mã 138)', 'Dự phòng phải thu khó đòi', 'Thuế GTGT được khấu trừ', 'Chi phí trả trước ngắn hạn', 'Trả trước cho người bán', 'Hàng tồn kho (mã 140)', 'Hình 2.1', 'Hình 2.2', 'Hình 2.3']],
  ['2.2.3 TK đầu 2 + TK 241 bốn điểm + hình', ['2.2.3', 'TSCĐ hữu hình (TK 211, 214)', 'Khấu hao', 'Tài sản đã hết khấu hao còn sử dụng', 'Chi phí đầu tư xây dựng dở dang (TK 241', 'Tài sản vô hình, bất động sản đầu tư', 'Tài sản thuế hoãn lại', 'Đối với riêng TK 241', 'Tỷ trọng', 'Mục đích', 'Mức độ chi tiết', 'Chi phí quản lý', 'Hình 2.4', 'Hình 2.5']],
  ['2.2.4 TK đầu 3 + 3 lý do + hình', ['2.2.4', 'Phải trả người bán (TK 331)', 'Thuế và các khoản phải nộp Nhà nước', 'Phải trả người lao động', 'Chi phí phải trả', 'Phải trả nội bộ (TK 336)', 'Phải trả khác (TK 338)', 'Quỹ khen thưởng, phúc lợi', 'Vay ngắn hạn, dài hạn', 'Nguồn vốn đầu tư (TK 3361, mã 410)', 'không phải là vốn chủ sở hữu, vì ba lý do', 'Hình 2.6', 'Hình 2.7']],
  ['2.2.5 TK đầu 4', ['2.2.5', 'Vốn đầu tư của chủ sở hữu (TK 411)', 'Thặng dư vốn cổ phần', 'Quỹ đầu tư phát triển (TK 418)', 'đầu 4 của BQLDA hoàn toàn trống', 'chỉ giảm khi quyết toán, bàn giao']],
  ['2.2.6 TK đầu 5–9', ['2.2.6', 'Bảng cân đối chỉ ghi số dư', 'Đầu 5: Doanh thu', 'Đầu 6: Chi phí', 'Đầu 7: Thu nhập khác', 'Đầu 8: Chi phí khác', 'Đầu 9: Xác định kết quả', 'TK 642 có cùng số hiệu nhưng đi hai đường khác nhau', 'TK 3362']],
  ['2.2.7 ngoài bảng', ['2.2.7', 'Ngoại tệ các loại (mã 007)', 'Tài sản nhận giữ hộ (mã 002)', 'Nguyên nhân là mẫu biểu']],
  ['2.3.1 đối chiếu + Hình 2.8 + nhận xét', ['2.3.1', 'Tăng trong năm', 'Giảm trong năm', 'Chuyển trong nội bộ vốn', 'Cổ tức bằng cổ phiếu', 'hoàn nhập quỹ đầu tư phát triển', 'Số dư cuối năm', 'Hình 2.8', 'không cùng bản chất kinh tế']],
  ['2.3.2 chín dòng + Tóm lại', ['2.3.2', 'Số khoản được theo dõi', 'Nguyên nhân tăng', 'Nguyên nhân giảm', 'Hình thức vốn', 'Phân loại theo nguồn', 'Dòng tiền liên quan đến vốn', 'Tổng mức và tiến độ', 'Xác nhận số dư', 'Đối chiếu chéo giữa các báo cáo', 'Tóm lại']],
  ['2.4.1 B03 vs KQHĐKD', ['2.4.1', 'đích đến của chi phí', 'Doanh thu', 'Giá vốn', 'Chi phí xây dựng, thiết bị, tư vấn, bồi thường', 'Chi phí bán hàng', 'Hoạt động tài chính', 'Chi phí khác', 'Thuế thu nhập doanh nghiệp', 'Chỉ tiêu cuối cùng', '23,6', '76,4', '100%', '0%']],
  ['2.4.2 F03A', ['2.4.2', 'Nhà xưởng chế biến chính', 'Kho lạnh và kho thành phẩm', 'Hệ thống xử lý nước thải', 'Hạ tầng kỹ thuật', 'Nhà điều hành và công trình phụ trợ', 'Chi phí chung toàn dự án', 'Nhà bảo vệ, hàng rào, cổng', 'Trong đó cuối năm', 'Đơn vị theo dõi', 'Trạng thái hoàn thành', 'nhu cầu quản trị']],
  ['2.5 F03B tám dòng', ['2.5', 'Cùng sự kiện “công trình hoàn thành” nhưng kết cục khác hẳn', 'Tập hợp chi phí', 'Căn cứ chuyển khỏi TK 241', 'Giá trị chuyển', 'Bút toán', 'Tác động lên báo cáo', 'Sau khi hoàn thành', 'Chi phí quản lý dự án', 'Khoản không được duyệt, xóa sổ', 'Điểm quyết định thời điểm ghi giảm TK 241']],
  ['3.1 Bảng 3.1 + 2 đoạn', ['3.1', 'Bảng 3.1', 'Quản trị chi phí (TK 241)', 'Quản lý nguồn vốn (TK 336)', 'Phân bổ chi phí BQLDA (TK 642)', 'ĐIỂM NỔI BẬT', 'ĐIỂM HẠN CHẾ']],
  ['3.2 Bảng 3.2 + 2 khác biệt + Đính chính', ['3.2', 'Bảng 3.2', 'Cơ cấu tài sản', 'Cơ cấu nguồn vốn', 'Hiệu quả hoạt động', 'KHÁC BIỆT 1', 'KHÁC BIỆT 2', 'Đính chính so với bài']],
  ['3.3 kiến nghị', ['3.3', 'ĐỐI VỚI NGƯỜI LÀM KẾ TOÁN VÀ NGƯỜI ĐỌC BÁO CÁO TÀI CHÍNH', 'ĐỐI VỚI CƠ QUAN QUẢN LÝ NHÀ NƯỚC', 'Thông tư 99/2025/TT-BTC', 'TK 3361', 'TK 3368', 'F03A, F03B', 'chưa hoàn tất thủ tục ghi tăng tài sản cố định']],
  ['Kết luận 3 đoạn', ['Kết luận', 'chế độ kế toán luôn phản ánh đúng chức năng', 'Tài khoản 336', 'thích ứng nhanh chóng với cơ chế hạch toán hợp nhất']],
  ['Phụ lục 3 tiêu đề', ['Phụ lục 1', 'Phụ lục 2', 'Phụ lục 3', 'xem bài đầy đủ']],
  ['Tài liệu tham khảo 6', ['Luật Kế toán số 88/2015/QH13.', 'Nghị định số 174/2016/NĐ-CP', 'Thông tư số 195/2012/TT-BTC', 'Thông tư số 200/2014/TT-BTC', 'Thông tư số 79/2019/TT-BTC', 'Thông tư số 99/2025/TT-BTC']]
];

let lostB3 = 0;
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  await page.goto('file://' + path.join(__dirname, '..', PAGE));
  await page.evaluate(() => {
    window.__finalize();
    // mở lớp chi tiết thứ hai để đọc đủ chữ của bài
    document.querySelectorAll('details').forEach(d => { d.open = true; });
    document.querySelectorAll('.srow.closed').forEach(r => r.classList.remove('closed'));
    document.querySelectorAll('[data-model-r], [data-spoke-p]').forEach(p => { p.hidden = false; });
  });
  const text = await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '));
  let missing = 0;
  CHECKLIST.forEach(([name, needles]) => {
    const miss = needles.filter(n => !text.includes(n));
    if (miss.length) missing++;
    console.log(`${miss.length ? 'THIẾU' : 'CÓ   '} ${name}${miss.length ? ' → ' + miss.join(' | ') : ''}`);
  });
  // Bố cục: BQLDA luôn bên trái
  const sides = await page.evaluate(() => {
    const bad = [];
    document.querySelectorAll('.srow').forEach(r => {
      const a = r.querySelector('.scard.bq'), b = r.querySelector('.scard.dn');
      if (!a || !b || a.getBoundingClientRect().left >= b.getBoundingClientRect().left) bad.push(r.querySelector('.srow-k').textContent);
    });
    document.querySelectorAll('.split-pair').forEach(p => {
      const [x, y] = p.children;
      if (!x.classList.contains('side-bq') || !y.classList.contains('side-dn')) bad.push('split-pair');
    });
    document.querySelectorAll('.split-head').forEach(hd => {
      if (hd.firstElementChild.className !== 'bq' || hd.lastElementChild.className !== 'dn') bad.push('split-head');
    });
    return { rows: document.querySelectorAll('.srow').length, bad };
  });
  console.log(`\nChia đôi: ${sides.rows} hàng; đảo bên: ${sides.bad.length ? sides.bad.join(', ') : 'không có'}`);
  // Ảnh báo cáo gốc có file thật
  const imgs = await page.evaluate(() => {
    const list = [];
    Object.values(window.CONTENT).forEach(st => (st.figs || []).forEach(f => list.push(f.bq, f.dn)));
    return list;
  });
  const src = fs.readFileSync(path.join(__dirname, '../js/main.js'), 'utf8');
  (src.match(/assets\/[a-z0-9-]+\.jpg/g) || []).forEach(x => imgs.push(x));
  const lost = imgs.filter(f => !f.startsWith('data:') && !fs.existsSync(path.join(__dirname, '..', f)));
  console.log(`Ảnh gốc: ${imgs.length} tham chiếu, thiếu file: ${lost.length ? lost.join(', ') : 'không'}`);
  // Bản 3: đồ họa mới, hình là điểm nhìn đầu tiên, không còn Tóm tắt chương
  const b3 = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('[data-viz]').forEach(v => { if (v.children.length === 0) out.push('viz rỗng ' + v.dataset.viz); });
    document.querySelectorAll('.sub').forEach(sub => {
      const v = sub.querySelector(':scope > .viz');
      if (!v) return;
      const head = sub.querySelector(':scope > .sub-head');
      let el = head.nextElementSibling;
      if (el !== v) out.push('hình không đứng đầu ' + sub.id);
    });
    document.querySelectorAll('[role="img"]').forEach(el => { if (!el.getAttribute('aria-label')) out.push('thiếu aria-label ' + (el.closest('[data-viz]') || {}).dataset?.viz); });
    const body = document.body.innerText;
    if (/Tóm tắt chương/.test(body)) out.push('còn "Tóm tắt chương" trên trang');
    document.querySelectorAll('.sub').forEach(sub => {
      if (/đối chiếu hiệu lực/i.test(sub.innerText) && !['m-3-3', 'm-kl'].includes(sub.id)) out.push('câu đối chiếu hiệu lực TT 99 nằm ở ' + sub.id);
    });
    if (!document.querySelector('#heroGraphics .g-pipe') || !document.querySelector('#heroGraphics .g-loop')) out.push('thiếu đồ họa hero');
    return { out, viz: document.querySelectorAll('[data-viz]').length, tips: document.querySelectorAll('[data-tip]').length };
  });
  const srcAll = ['index.html', 'js/main.js', 'js/viz.js', 'js/content.js', 'css/style.css'].map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
  ['i-crane', 'i-factory', 'i-building', 'i-trend', '"i-target"', '#i-target"', 'hero-art', 'duo-art', 'Tóm tắt chương'].forEach(k => { if (srcAll.includes(k)) b3.out.push('mã nguồn còn ' + k); });
  console.log(`Bản 3: ${b3.viz} khung hình, ${b3.tips} điểm có tooltip; ${b3.out.length ? 'LỖI: ' + b3.out.join('; ') : 'không còn đồ họa cũ, hình đứng đầu mỗi tiểu mục, không còn Tóm tắt chương'}`);
  lostB3 = b3.out.length;
  await browser.close();
  console.log(missing || sides.bad.length || lost.length || lostB3 ? `\n${missing} mục thiếu` : '\nĐủ mọi mục trong bảng đối chiếu.');
  process.exit(missing || sides.bad.length || lost.length || lostB3 ? 1 : 0);
})();

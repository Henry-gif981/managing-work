// Đối chiếu trang với "Bảng đối chiếu nội dung phải có" (yeu_cau_chinh_sua.md, mục 3)
// và các quy tắc bố cục chia đôi. Chạy: NODE_PATH=$(npm root -g) node website/tests/check-outline.js
const path = require('path');
const fs = require('fs');
const { chromium } = require('playwright');
const PAGE = process.env.PAGE || 'index.html';

// Mỗi dòng: [mục, [các đoạn chữ phải có mặt trên trang]]
const CHECKLIST = [
  ['Danh mục từ viết tắt', ['Danh mục từ viết tắt', 'BQLDA', 'BCTC', 'CĐT', 'TSCĐ', 'XDCB', 'GTGT', 'ODA', 'QH13', 'B01-DN, B02-DN, B03-DN, B09-DN']],
  ['Ch.1 đoạn dẫn + 3 phần', ['cùng dùng phương pháp ghi sổ kép', 'MỤC 1.1', 'MỤC 1.2', 'MỤC 1.3']],
  ['1.1.1 + Bảng 1.1', ['1.1.1', 'Tập hợp các hoạt động có liên quan với nhau', 'Tập hợp các đề xuất bỏ vốn trung hạn hoặc dài hạn', 'Bảng 1.1', 'Có mục tiêu rõ ràng', 'Có thời hạn xác định', 'Mang tính duy nhất', 'Nguồn lực giới hạn', 'Có tính bất định, rủi ro']],
  ['1.1.2 + Bảng 1.2 (5 tiêu thức) + câu chốt', ['1.1.2', 'Bảng 1.2', 'Theo nguồn vốn', 'Theo quy mô, tính chất', 'Theo lĩnh vực', 'Theo tính chất đầu tư', 'Theo chủ thể quản lý', 'cơ sở trực tiếp để chọn chế độ kế toán']],
  ['1.1.3 + Hình 1.1 + 3 ý', ['1.1.3', 'Hình 1.1', 'Chuẩn bị đầu tư', 'Thực hiện đầu tư', 'Kết thúc xây dựng, đưa vào khai thác', 'phát sinh ít nghiệp vụ nhưng quyết định tính hợp lệ', 'phát sinh nhiều nghiệp vụ nhất', 'lập báo cáo quyết toán vốn đầu tư dự án hoàn thành, xác định giá trị tài sản hình thành']],
  ['1.1.4 khái niệm, đặc điểm, 7 nhiệm vụ, 5 yêu cầu', ['1.1.4', 'KHÁI NIỆM', 'ĐẶC ĐIỂM', '7 NHIỆM VỤ', '5 YÊU CẦU', 'Tổ chức chứng từ, tài khoản, sổ kế toán', 'Cung cấp thông tin cho chủ đầu tư', 'Trung thực, đầy đủ, chính xác', 'Kịp thời', 'Rõ ràng, dễ hiểu', 'Chi tiết theo từng dự án, nguồn vốn và nội dung chi phí', 'Tuân thủ']],
  ['1.2.1 ba lớp + Bảng 1.3', ['1.2.1', 'LỚP 1', 'LỚP 2', 'LỚP 3', 'Bảng 1.3', 'Luật Kế toán số 88/2015/QH13', 'Nghị định 174/2016/NĐ-CP', 'Thông tư 79/2019/TT-BTC', 'Vai trò trong đề tài']],
  ['1.2.2 TT 195', ['1.2.2', '15/11/2012', '01/01/2013', 'QĐ 214/2000/QĐ-BTC', 'Chủ đầu tư không thành lập BQLDA', 'HỆ THỐNG TÀI KHOẢN', 'TK 154 thành “Chi phí sản xuất thử dở dang”', 'thêm bốn tài khoản cấp 2', 'NGHIỆP VỤ ĐẶC THÙ', 'BÁO CÁO TÀI CHÍNH', 'THỜI HẠN NỘP']],
  ['1.2.3 TT 200', ['1.2.3', '22/12/2014', '01/01/2015', 'TT 244/2009/TT-BTC', 'Thông tư 133/2016/TT-BTC', 'Thông tư 75/2015/TT-BTC', 'Thông tư 53/2016/TT-BTC', '2411, 2412, 2413', 'B09-DN']],
  ['1.2.4 + Hình 1.2', ['1.2.4', 'Hình 1.2', 'Ban quản lý dự án (có tổ chức kế toán riêng)', 'Chủ đầu tư có thành lập Ban quản lý dự án', 'Chủ đầu tư không thành lập BQLDA', 'Bổ sung TK cấp 2 của TK 136 (1362, 1363) theo Thông tư 195', 'B02-CĐT Nguồn vốn đầu tư', 'B04-CĐT Thuyết minh báo cáo tài chính', 'Lập thêm B02-CĐT (Nguồn vốn đầu tư', 'và 4 phụ biểu', 'phù hợp với hướng dẫn của Bộ Tài chính']],
  ['1.3.1 phạm vi', ['1.3.1', 'ĐỐI TƯỢNG (i)', 'ĐỐI TƯỢNG (ii)', 'Cùng “gốc”', 'hành chính sự nghiệp, thuế và kiểm toán']],
  ['1.3.2 tiêu chí, Bảng 1.4, Hình 1.3, Bảng 1.5, Hình 1.4', ['1.3.2', 'Bảng 1.4', 'Đối tượng áp dụng', 'Nơi nhận báo cáo', 'Điều 110 Thông tư 200', 'Hình 1.3', 'Bước 5', 'Bảng 1.5', 'ĐIỂM CẦN CHÚ Ý 1', 'ĐIỂM CẦN CHÚ Ý 2', 'Hình 1.4', 'Trường hợp riêng của doanh nghiệp']],
  ['Mốc TT 99/2025 trên dòng thời gian', ['Mốc thời gian các thông tư', 'Thông tư 99/2025/TT-BTC', 'Bài, mục 3.3']],
  ['2.1.1 + Bảng 2.1', ['2.1.1', '45/QĐ-HĐQT', '05/03/2013', 'con dấu', 'tài khoản tiền gửi riêng', 'Khu công nghiệp Trà Nóc', 'Ban không hoạt động như một doanh nghiệp sản xuất kinh doanh', 'Bảng 2.1', 'Chủ thể lập báo cáo', 'Chế độ kế toán áp dụng', 'Kỳ báo cáo, ngày lập', 'Bộ báo cáo', 'Hoạt động chính', 'Tổng tài sản cuối kỳ']],
  ['2.1.2 bộ BCTC, số liệu, Bảng 2.2, nhận xét', ['2.1.2', 'B01-CĐT', 'B02-CĐT', 'B03-CĐT', 'B04-CĐT', 'F02-CĐT', 'F03A-CĐT', 'F03B-CĐT', 'F03C-CĐT', 'F03D-CĐT', '191,325', '186,743', '4,582', 'Bảng 2.2', 'Vì sao khác:', 'hình ảnh của một dự án đang thi công']],
  ['2.2 mở đầu', ['B01-CĐT vẫn là một bảng cân đối đúng nghĩa', '199,46', 'TK 3361 thuộc đầu 3']],
  ['2.2.1 cơ cấu chung', ['2.2.1', 'Cơ cấu chung', 'Tài sản dài hạn', 'Khoản mục lớn nhất', 'Phần nguồn vốn còn lại']],
  ['2.2.2 chín khoản mục + hình', ['2.2.2', 'Tiền', 'Đầu tư tài chính (mã 120)', 'Phải thu khách hàng (mã 131)', 'Phải thu khác (mã 138)', 'Phải thu về cho vay ngắn hạn (mã 135)', 'Thuế GTGT được khấu trừ', 'Chi phí trả trước ngắn hạn', 'Trả trước cho người bán', 'Hàng tồn kho (mã 140)', 'Hình 2.1']],
  ['2.2.3 TK đầu 2 + TK 241 bốn điểm + hình', ['2.2.3', 'TSCĐ hữu hình (TK 211, 214)', 'Khấu hao', 'Tài sản đã hết khấu hao còn sử dụng', 'Chi phí đầu tư xây dựng dở dang (TK 241', 'Tài sản vô hình, bất động sản đầu tư', 'Tài sản thuế hoãn lại', 'Đối với riêng TK 241', 'Tỷ trọng', 'Mục đích', 'Mức độ chi tiết', 'Chi phí quản lý', 'Hình 2.2']],
  ['2.2.4 TK đầu 3 + 3 lý do + hình', ['2.2.4', 'Phải trả người bán (TK 331)', 'Thuế và các khoản phải nộp Nhà nước', 'Phải trả người lao động', 'Chi phí phải trả', 'Phải trả nội bộ (TK 336)', 'Phải trả khác (TK 338)', 'Quỹ khen thưởng, phúc lợi', 'Vay ngắn hạn, dài hạn', 'Nguồn vốn đầu tư (TK 3361, mã 410)', 'không phải là vốn chủ sở hữu, vì ba lý do', 'Hình 2.3', 'Hình 2.4']],
  ['2.2.5 TK đầu 4', ['2.2.5', 'Vốn đầu tư của chủ sở hữu (TK 411)', 'Thặng dư vốn cổ phần', 'Quỹ đầu tư phát triển (TK 418)', 'đầu 4 của BQLDA hoàn toàn trống', 'chỉ giảm khi quyết toán, bàn giao']],
  ['2.2.6 TK đầu 5–9', ['2.2.6', 'Bảng cân đối chỉ ghi số dư', 'Đầu 5: Doanh thu', 'Đầu 6: Chi phí', 'Đầu 7: Thu nhập khác', 'Đầu 8: Chi phí khác', 'Đầu 9: Xác định kết quả', 'TK 642 có cùng số hiệu nhưng đi hai đường khác nhau', 'TK 3362', 'Hình 2.5', 'Hình 2.6', 'Hình 2.7', 'Hình 2.8', 'Hình 2.9']],
  ['2.2.7 ngoài bảng', ['2.2.7', 'Ngoại tệ các loại (mã 007)', 'giữ hộ', 'mẫu B01-DN không có dòng này']],
  ['2.3.1 đối chiếu + nhận xét', ['2.3.1', 'Tăng trong năm', 'Giảm trong năm', 'Chuyển trong nội bộ vốn', 'Cổ tức bằng cổ phiếu', 'Số dư cuối năm', 'không cùng bản chất kinh tế']],
  ['2.3.2 chín dòng + Tóm lại', ['2.3.2', 'Số khoản được theo dõi', 'Nguyên nhân tăng', 'Nguyên nhân giảm', 'Hình thức vốn', 'Phân loại theo nguồn', 'Dòng tiền liên quan đến vốn', 'Tổng mức và tiến độ', 'Xác nhận số dư', 'Đối chiếu chéo giữa các báo cáo', 'Tóm lại']],
  ['2.4.1 B03 vs KQHĐKD', ['2.4.1', 'đích đến của chi phí', 'Doanh thu', 'Giá vốn', 'Chi phí xây dựng, thiết bị, tư vấn, bồi thường', 'Chi phí bán hàng', 'Hoạt động tài chính', 'Chi phí khác', 'Thuế thu nhập doanh nghiệp', 'Chỉ tiêu cuối cùng', '100%', '0%']],
  ['2.4.2 F03A', ['2.4.2', 'Nhà xưởng chế biến chính', 'Kho lạnh và kho thành phẩm', 'Hệ thống xử lý nước thải', 'Hạ tầng kỹ thuật', 'Nhà điều hành và công trình phụ trợ', 'Chi phí chung toàn dự án', 'Nhà bảo vệ, hàng rào, cổng', 'Trong đó cuối năm', 'Đơn vị theo dõi', 'Trạng thái hoàn thành', 'nhu cầu quản trị']],
  ['2.5 F03B tám dòng', ['2.5', 'Cùng sự kiện “công trình hoàn thành” nhưng kết cục khác hẳn', 'Tập hợp chi phí', 'Căn cứ chuyển khỏi TK 241', 'Giá trị chuyển', 'Bút toán', 'Tác động lên báo cáo', 'Sau khi hoàn thành', 'Chi phí quản lý dự án', 'Khoản không được duyệt, xóa sổ', '30/10/2015', '12/11/2015']],
  ['3.1 Bảng 3.1 + 2 đoạn', ['3.1', 'Bảng 3.1', 'Quản trị chi phí (TK 241)', 'Quản lý nguồn vốn (TK 336)', 'Phân bổ chi phí BQLDA (TK 642)', 'ĐIỂM NỔI BẬT', 'ĐIỂM HẠN CHẾ']],
  ['3.2 Bảng 3.2 (3 hàng) + 2 khác biệt', ['3.2', 'Bảng 3.2', 'Cơ cấu tài sản', 'Cơ cấu nguồn vốn', 'Hiệu quả hoạt động', 'KHÁC BIỆT 1', 'KHÁC BIỆT 2']],
  ['3.3 kiến nghị', ['3.3', 'ĐỐI VỚI NGƯỜI LÀM KẾ TOÁN VÀ NGƯỜI ĐỌC BÁO CÁO TÀI CHÍNH', 'ĐỐI VỚI CƠ QUAN QUẢN LÝ NHÀ NƯỚC', 'Thông tư 99/2025/TT-BTC', 'TK 3361', 'TK 3368', 'F03A, F03B', 'chưa hoàn tất thủ tục ghi tăng tài sản cố định']],
  ['Kết luận 3 đoạn', ['Kết luận', 'chế độ kế toán luôn phản ánh đúng chức năng', 'Tài khoản 336', 'thích ứng nhanh chóng với cơ chế hạch toán thống nhất']],
  ['Phụ lục 1 (duy nhất)', ['Phụ lục 1: Bộ BCTC mẫu đầy đủ (TT 195/2012/TT-BTC)', 'B01-CĐT · Bảng cân đối kế toán (tr.2)', 'F03D-CĐT · Chi phí Ban QLDA (tr.12)', 'Báo cáo tài chính gốc để đối chiếu cho Chương 2']],
  ['Tài liệu tham khảo 8', ['Luật Kế toán số 88/2015/QH13.', 'Nghị định số 174/2016/NĐ-CP', 'Thông tư số 195/2012/TT-BTC', 'Thông tư số 200/2014/TT-BTC', 'Thông tư số 79/2019/TT-BTC', 'Thông tư số 99/2025/TT-BTC', 'BCTC Ban quản lý dự án Nhà máy Chế biến Nông sản Đồng Bằng, năm 2015', 'Báo cáo tài chính riêng cho năm kết thúc ngày 31/12/2024, đã kiểm toán bởi Công ty TNHH KPMG']]
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
    document.querySelectorAll('[data-spoke-p]').forEach(p => { p.hidden = false; });
    document.querySelectorAll('.dual').forEach(d => d.removeAttribute('data-view'));
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
    // bìa: không còn khối đồ họa, thẻ số và Minh họa 0-A; Kết luận và Phụ lục vẫn đủ hình
    const hero = document.getElementById('s00');
    if (hero.querySelector('.g-pipe, .g-loop, .stat, #heroGraphics')) out.push('bìa còn đồ họa hoặc thẻ số');
    if (/Minh họa 0-A/.test(body)) out.push('còn Minh họa 0-A');
    ['m-kl'].forEach(id => { const s = document.getElementById(id); if (!s.querySelector('.g-pipe') || !s.querySelector('.g-loop')) out.push(id + ' thiếu đồ họa dòng vốn hoặc vòng kết quả'); });
    return { out, viz: document.querySelectorAll('[data-viz]').length, tips: document.querySelectorAll('[data-tip]').length };
  });
  const srcAll = ['index.html', 'js/main.js', 'js/viz.js', 'js/content.js', 'css/style.css'].map(f => fs.readFileSync(path.join(__dirname, '..', f), 'utf8')).join('\n');
  ['i-crane', 'i-factory', 'i-building', 'i-trend', '"i-target"', '#i-target"', 'hero-art', 'duo-art', 'Tóm tắt chương'].forEach(k => { if (srcAll.includes(k)) b3.out.push('mã nguồn còn ' + k); });
  console.log(`Bản 3: ${b3.viz} khung hình, ${b3.tips} điểm có tooltip; ${b3.out.length ? 'LỖI: ' + b3.out.join('; ') : 'không còn đồ họa cũ, hình đứng đầu mỗi tiểu mục, không còn Tóm tắt chương'}`);
  lostB3 = b3.out.length;
  // Bản 4: chế độ xem bình thường (lớp trình bày + chi tiết, mỗi đối tượng một dạng mặc định), không bật rà soát
  await page.reload();
  await page.evaluate(() => window.__finalize());
  await page.waitForFunction(() => [...document.images].every(i => i.hasAttribute('data-src') || i.complete), null, { timeout: 30000 });
  const b4 = await page.evaluate(() => {
    const out = [];
    const body = document.body.innerText;
    ['Nhóm bổ sung', 'theo bài', 'tính từ số liệu bài', 'Đính chính so với bài', 'hiểu lầm', 'hiện hành', 'xem bài đầy đủ', 'Sáu ống', 'Một ống', 'dấu * là số tính'].forEach(w => { if (body.includes(w)) out.push('còn chữ “' + w + '”'); });
    // số hiệu Hình/Bảng của bài chỉ xuất hiện một lần làm nhãn đối tượng
    const labels = [...document.querySelectorAll('.dual-cap, .stage-title, .tcap, .fig-thumb .ft-cap b')].map(e => (e.textContent.match(/^(Hình|Bảng) \d\.\d/) || [])[0]).filter(Boolean);
    const seen = {}; labels.forEach(l => { seen[l] = (seen[l] || 0) + 1; });
    Object.keys(seen).forEach(k => { if (seen[k] > 1) out.push(k + ' trùng ' + seen[k] + ' lần'); });
    const want = ['Bảng 1.1', 'Bảng 1.2', 'Bảng 1.3', 'Bảng 1.4', 'Bảng 1.5', 'Bảng 2.1', 'Bảng 2.2', 'Bảng 3.1', 'Bảng 3.2', 'Hình 1.1', 'Hình 1.2', 'Hình 1.3', 'Hình 1.4', 'Hình 2.1', 'Hình 2.2', 'Hình 2.3', 'Hình 2.4', 'Hình 2.5', 'Hình 2.6', 'Hình 2.7', 'Hình 2.8', 'Hình 2.9'];
    want.forEach(w => { if (!seen[w]) out.push('thiếu nhãn ' + w); });
    // bản 8: hình web vẽ chỉ ghi tên, không mã "Minh họa X-Y", không "(minh họa)"; tên không trùng; mã nội bộ chỉ ở Chế độ rà soát
    const names = {};
    document.querySelectorAll('.viz-title').forEach(t => {
      const nm = [...t.childNodes].filter(n => !(n.classList && n.classList.contains('mh-tag'))).map(n => n.textContent).join('').trim();
      if (!nm) out.push('hình không có tên ' + t.dataset.mh);
      names[nm] = (names[nm] || 0) + 1;
      if (!t.dataset.mh) out.push('hình thiếu mã nội bộ: ' + nm.slice(0, 40));
    });
    Object.keys(names).forEach(k => { if (names[k] > 1) out.push('tên hình trùng: ' + k); });
    document.querySelectorAll('[data-viz]').forEach(v => { if (v.children.length && !v.querySelector('.viz-title')) out.push('khối hình không có tên: ' + v.dataset.viz); });
    if (/Minh họa\s*[0-9A-Z]+-[A-Z]|\(minh họa\)/.test(body)) out.push('còn “Minh họa X-Y” hoặc “(minh họa)”');
    const codes = body.match(/\b(?:[0-9]|KL|PL)-[A-Z]\b/g);
    if (codes) out.push('còn mã hình trên giao diện thường: ' + codes.slice(0, 5).join(', '));
    if (/Hình 2\.8 trực quan|Bảng 2\.2 trực quan/.test(body)) out.push('còn nhãn “trực quan” mượn số');
    // mỗi tiểu mục: đúng 1 hình chính + 3 ý chính
    document.querySelectorAll('.lp').forEach(lp => {
      const n = lp.querySelectorAll(':scope > .viz, :scope > .dual, :scope > .stage').length;
      if (n !== 1) out.push(lp.parentElement.id + ': lớp trình bày có ' + n + ' hình');
      const k = lp.querySelectorAll('.keys li').length;
      const wantK = lp.parentElement.id === 'm-3-3' ? 0 : 3; // bản 5 mục 12: 3.3 bỏ 3 ý dưới hình
      if (k !== wantK) out.push(lp.parentElement.id + ': ' + k + ' ý chính');
    });
    const thumbs = document.querySelectorAll('.fig-thumb').length;
    if (thumbs !== 9) out.push('ảnh Hình 2.x: ' + thumbs + '/9');
    const scans = document.querySelectorAll('[data-scan]').length;
    const links = document.querySelectorAll('.src-link').length;
    const pages = document.querySelectorAll('#pgal .pg').length;
    if (pages !== 12) out.push('Phụ lục 1: ' + pages + '/12 trang');
    const broken = [...document.images].filter(i => !i.hasAttribute('data-src') && (!i.complete || !i.naturalWidth)).map(i => i.getAttribute('alt') || i.src.slice(0, 40));
    if (broken.length) out.push('ảnh lỗi: ' + broken.join('; '));
    if (!document.querySelector('.hero-logo') || !/Giảng viên:/.test(body)) out.push('bìa thiếu logo hoặc dòng Giảng viên');
    if (/61,3/.test(document.getElementById('m-kl').innerText)) out.push('Kết luận còn 61,3%');
    return { out, thumbs, scans, links, pages };
  });
  console.log(`Bản 4: ${b4.thumbs} ảnh Hình 2.x, ${b4.scans} hình scan Hình 1.x, ${b4.links} chip mở được trang scan, ${b4.pages} trang Phụ lục 1; ${b4.out.length ? 'LỖI: ' + b4.out.join('; ') : 'đạt'}`);
  lostB3 += b4.out.length;
  // Bản 5: số trong tab ẩn hiện ngay, chip Hòa Phát mở trang BCTC, trang cảm ơn, không còn 23,6 / 76,4
  const b5 = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.cu').forEach(el => { if (!/\d/.test(el.textContent)) out.push('số trống ' + (el.closest('.sub') || {}).id); });
    const hp = [...document.querySelectorAll('.src.hp')].filter(c => !c.closest('.tip-src'));
    const linked = hp.filter(c => c.classList.contains('hp-link'));
    hp.filter(c => /tr\.\d/.test(c.textContent) && !c.classList.contains('hp-link')).forEach(c => out.push('chip Hòa Phát không bấm được: ' + c.textContent));
    linked.forEach(c => c.dataset.hp.split(',').forEach(n => { if (!window.HP_PAGES[n]) out.push('thiếu ảnh trang ' + n); }));
    const body = document.body.innerText;
    if (/23,6|76,4/.test(body)) out.push('còn 23,6 / 76,4');
    if (!/PGS\.TS\. Nguyễn La Soa/.test((document.querySelector('.hero-gv') || {}).innerText || '')) out.push('bìa thiếu tên giảng viên');
    const th = document.getElementById('ch5');
    if (!th || !/Xin chân thành cảm ơn/.test(th.innerText) || !/Nguyễn La Soa/.test(th.innerText)) out.push('thiếu trang cảm ơn');
    return { out, hp: hp.length, linked: linked.length };
  });
  console.log(`Bản 5: ${b5.linked}/${b5.hp} chip Hòa Phát mở được trang BCTC; ${b5.out.length ? 'LỖI: ' + b5.out.join('; ') : 'đạt'}`);
  lostB3 += b5.out.length;
  // Bản 6 + 7: 1-E ba mốc, tên đủ chín báo cáo, Hình 1.2 có heading A/B/C, không còn 1.3.3, Phụ lục giữa 2.1 và 2.2, chỉ Montserrat
  const b6 = await page.evaluate(() => {
    const out = [];
    const tl = [...document.querySelectorAll('[data-viz="1-2-1"] .tl .yr')].map(e => e.textContent).join(',');
    if (tl !== '2012,2019,2025') out.push('Minh họa 1-E: ' + tl);
    const rl = [...document.querySelectorAll('[data-viz="1-2-2"] .rlist li')].map(li => li.textContent);
    ['B01-CĐTBảng cân đối kế toán', 'B02-CĐTNguồn vốn đầu tư', 'B03-CĐTThực hiện đầu tư xây dựng', 'B04-CĐTThuyết minh báo cáo tài chính', 'F02-CĐTChi tiết nguồn vốn đầu tư',
      'F03A-CĐTThực hiện đầu tư theo dự án, công trình, hạng mục công trình', 'F03B-CĐTQuyết toán vốn đầu tư theo dự án, công trình, hạng mục công trình hoàn thành bàn giao sử dụng',
      'F03C-CĐTChi phí khác', 'F03D-CĐTChi phí Ban quản lý dự án đầu tư'].forEach(n => { if (!rl.some(t => t.startsWith(n))) out.push('1.2.2 thiếu ' + n); });
    if (document.querySelectorAll('#m-1-2-4 h3.dtree-h').length !== 3) out.push('Hình 1.2 thiếu heading A, B, C');
    if (/Phụ lục 1a/.test(document.getElementById('m-1-2-4').innerText)) out.push('Hình 1.2 còn Phụ lục 1a');
    if (document.querySelector('#m-1-2-4 img')) out.push('Hình 1.2 còn ảnh raster');
    if (/1\.3\.3/.test(document.documentElement.innerHTML)) out.push('còn chữ 1.3.3');
    const pl = document.getElementById('m-pl');
    if (!pl.previousElementSibling.matches('#ch2 .sec-head') || pl.nextElementSibling.id !== 'm-2-1-1') out.push('Phụ lục không nằm ngay sau tiêu đề Chương 2, trước 2.1');
    if (document.getElementById('pl2') || /Phụ lục 2/.test(document.body.innerText)) out.push('còn Phụ lục 2');
    if (document.querySelector('#ch4 .pl')) out.push('còn phụ lục ở cuối');
    if (document.querySelectorAll('#m-pl .pl').length !== 1 || /Phụ lục [34]/.test(document.body.innerText)) out.push('Phụ lục phải chỉ còn một (Phụ lục 1)');
    return out;
  });
  const fam = srcAll.match(/font-family:[^;]*;|--f-(head|body):[^;]*;/g) || [];
  fam.filter(f => !/Montserrat|var\(--f-/.test(f) || /Inter|Sora|Jakarta|system-ui/.test(f)).forEach(f => b6.push('phông khác: ' + f));
  if (/fonts\.googleapis/.test(srcAll)) b6.push('còn link Google Fonts');
  console.log(`Bản 6+7: ${b6.length ? 'LỖI: ' + b6.join('; ') : 'đạt'}`);
  lostB3 += b6.length;
  // Bản 9: số Hòa Phát theo BCTC riêng; không còn số, thuật ngữ hợp nhất cũ; chip trong phạm vi 40 trang
  const b9 = await page.evaluate(() => {
    const out = [];
    const body = document.body.innerText;
    ['/HN', 'Marcegaglia', 'Dung Quất', 'tập đoàn kinh doanh', 'chuỗi sản xuất', 'Công ty mẹ và các công ty con', 'nhóm A/B', '(nhóm A)', '(nhóm B)', '(nhóm C)', '(nhóm D)'].forEach(w => { if (body.includes(w)) out.push('còn “' + w + '”'); });
    ['224.490', '224,49', '114.647', '109.842', '86.674', '137.815', '138.855', '120.357', '12.020', '13.693', '63.655', '63.656', '2.925', '6.887', '46.091', '82.963', '55.882', '27.080', '49.599', '1.545', '2.337', '3.966', '2.618', '1.673', '1.159', '733,3', '6.915', '6.810', '108.146', '40.902', '11.515', '18.974', '4.352', '1.249', '159,99', '6.636', '2.118', '14.046', '1.743', '890,9', '1.027,3', '794,8', '102.836', '174.466', '233,1', '39.906'].forEach(w => { if (body.includes(w)) out.push('còn số cũ ' + w); });
    (body.match(/[^.\n]*hợp nhất[^.\n]*/g) || []).filter(x => !/không hợp nhất|chỉ có ở BCTC hợp nhất|hợp nhất \(nếu có\)|\(mẫu “-DN\/HN”\)|^\s*Hợp nhất\s*$/.test(x) && !/^HN/.test(x.trim())).forEach(x => out.push('còn “hợp nhất”: ' + x.trim().slice(0, 60)));
    document.querySelectorAll('.src.hp').forEach(c => {
      (c.textContent.match(/tr\.\s?(\d+)/g) || []).forEach(m => { if (+m.replace(/\D/g, '') > 39) out.push('chip trang > 39: ' + c.textContent); });
      (c.textContent.match(/tm (\d+)/g) || []).forEach(m => { if (+m.replace(/\D/g, '') > 28) out.push('chip tm > 28: ' + c.textContent); });
    });
    if (document.querySelector('.src.bai') && /Hòa Phát, theo bài/.test(body)) out.push('còn chip “Hòa Phát, theo bài”');
    if (!document.querySelector('#m-2-4-1 .wf-row.is-neg')) out.push('waterfall KQKD không có bậc âm');
    if (document.querySelectorAll('#m-2-3-2 .pipes6 .pp').length !== 4) out.push('2.3.2 không đủ bốn cột');
    return out;
  });
  console.log(`Bản 9 (BCTC riêng): ${b9.length ? 'LỖI: ' + b9.join('; ') : 'đạt'}`);
  lostB3 += b9.length;
  const md = fs.readFileSync(path.join(__dirname, '../content/phan_mo_dau.md'), 'utf8');
  ['## 1. Lý do chọn đề tài', '## 2. Mục tiêu, đối tượng và phạm vi nghiên cứu', '## 3. Phương pháp nghiên cứu', '## 4. Kết cấu của đề tài'].forEach(h => { if (!md.includes(h)) { console.log('content/phan_mo_dau.md thiếu ' + h); lostB3++; } });
  await browser.close();
  console.log(missing || sides.bad.length || lost.length || lostB3 ? `\n${missing} mục thiếu` : '\nĐủ mọi mục trong bảng đối chiếu.');
  process.exit(missing || sides.bad.length || lost.length || lostB3 ? 1 : 0);
})();

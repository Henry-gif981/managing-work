// Xuất PDF bản Trình chiếu: mỗi slide một trang 1920 × 1080 px, có bộ đếm "n / N" trong slide,
// không đầu trang/chân trang của trình duyệt. Tự kiểm tra từng slide không tràn khung.
// Chạy: NODE_PATH=$(npm root -g) node website/tools/export_pdf.js [vào.html] [ra.pdf]
const path = require("path");
const { chromium } = require("playwright");
(async () => {
  const root = path.join(__dirname, "..");
  const src = path.resolve(root, process.argv[2] || "nhom2-thuyet-trinh.html");
  const out = path.resolve(root, process.argv[3] || "nhom2-thuyet-trinh.pdf");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto("file://" + src, { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: "print", reducedMotion: "reduce" });
  const n = await page.evaluate(() => window.__printPrep());
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(600);
  // kiểm tra: mỗi slide đúng 1920 × 1080, nội dung (sau khi co) không vượt khung
  const bad = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("main > .slide").forEach((s, i) => {
      const r = s.getBoundingClientRect(), p = s.querySelector(".panel").getBoundingClientRect();
      if (Math.round(r.width) !== 1920 || Math.round(r.height) !== 1080) out.push(i + 1 + ": khung " + r.width + "×" + r.height);
      if (p.bottom > r.bottom + 1 || p.right > r.right + 1 || p.top < r.top - 1) out.push(i + 1 + ": tràn khung (" + Math.round(p.height) + "px)");
    });
    return out;
  });
  await page.pdf({ path: out, width: "1920px", height: "1080px", preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  await browser.close();
  console.log(out + " · " + n + " slide" + (bad.length ? "\nLỖI:\n  " + bad.join("\n  ") : " · không slide nào tràn"));
  process.exit(bad.length ? 1 : 0);
})();

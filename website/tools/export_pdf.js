// Xuất bản in PDF của trang (A4 ngang, bật nền, TẮT đầu trang/chân trang nên không lộ đường dẫn file).
// Chạy: NODE_PATH=$(npm root -g) node website/tools/export_pdf.js   →  website/nhom2-thuyet-trinh.pdf
// Cần Playwright (Chromium). Mặc định in file một trang nhom2-thuyet-trinh.html.
const path = require("path");
const { chromium } = require("playwright");
(async () => {
  const root = path.join(__dirname, "..");
  const src = path.join(root, process.argv[2] || "nhom2-thuyet-trinh.html");
  const out = path.join(root, process.argv[3] || "nhom2-thuyet-trinh.pdf");
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto("file://" + src, { waitUntil: "load" });
  await page.evaluate(() => (document.fonts ? document.fonts.ready : null));
  await page.evaluate(() => window.__finalize && window.__finalize());
  await page.emulateMedia({ media: "print" });
  await page.waitForTimeout(400);
  await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true, displayHeaderFooter: false });
  await browser.close();
  console.log(out);
})();

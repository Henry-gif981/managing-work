/* Nhóm 2 — điều khiển website: điền số liệu từ data.js, biểu đồ, tương tác, trình chiếu. */
(function () {
  "use strict";

  var D = window.DATA;
  var doc = document;
  var root = doc.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- Định dạng số kiểu Việt Nam ---------------- */

  function get(path) {
    return path.split(".").reduce(function (o, k) {
      return o == null ? undefined : o[k];
    }, D);
  }

  // Chia số nguyên đồng cho 10^k và làm tròn nửa lên, tính hoàn toàn trên số nguyên
  // (tránh lỗi dấu phẩy động: 69.738.950.000 → 69,74 chứ không 69,73).
  function roundDiv(v, div) {
    var q = Math.floor(v / div);
    var r = v - q * div;
    return 2 * r >= div ? q + 1 : q;
  }

  function group(s) {
    return s.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  // scale: "ty" (đồng → tỷ), "trieu" (đồng → triệu), "none" (giữ nguyên)
  function fmt(v, d, scale) {
    var neg = v < 0;
    v = Math.abs(v);
    var n;
    if (scale === "ty" || scale === "trieu") {
      var exp = scale === "ty" ? 9 : 6;
      n = roundDiv(Math.round(v), Math.pow(10, exp - d));
    } else {
      n = Math.round(v * Math.pow(10, d) + 1e-9 * (v ? 1 : 0));
    }
    var s = String(n);
    while (s.length < d + 1) s = "0" + s;
    var ip = d ? s.slice(0, s.length - d) : s;
    var fp = d ? s.slice(s.length - d) : "";
    return (neg ? "−" : "") + group(ip) + (fp ? "," + fp : "");
  }

  function scaleOf(el, path, v) {
    var s = el.getAttribute("data-s");
    if (s === "dong") return "none";
    if (s) return s;
    if (path.indexOf("bq.") === 0 && Number.isInteger(v) && Math.abs(v) >= 1e6) return "ty";
    return "none";
  }

  function decimalsOf(el, path) {
    var d = el.getAttribute("data-d");
    if (d !== null) return parseInt(d, 10);
    return path.indexOf("hp.") === 0 || /pct|tyLe|ratio/i.test(path) ? 1 : 3;
  }

  function spec(el) {
    var path = el.getAttribute("data-v");
    var v = get(path);
    if (typeof v !== "number") {
      console.warn("Thiếu số liệu:", path);
      return null;
    }
    return { v: v, d: decimalsOf(el, path), s: scaleOf(el, path, v) };
  }

  function fillNumbers(scope) {
    (scope || doc).querySelectorAll("[data-v]").forEach(function (el) {
      var sp = spec(el);
      if (sp) el.textContent = fmt(sp.v, sp.d, sp.s);
    });
    (scope || doc).querySelectorAll("[data-t]").forEach(function (el) {
      var t = get(el.getAttribute("data-t"));
      if (t != null) el.textContent = String(t);
    });
  }

  function fillWidths(scope) {
    (scope || doc).querySelectorAll("[data-wp]").forEach(function (el) {
      var w = get(el.getAttribute("data-wp"));
      el.style.setProperty("--w", w + "%");
      if (el.classList.contains("sbar-seg") && w < 9) el.classList.add("narrow");
      else if (el.classList.contains("sbar-seg") && w < 40) el.classList.add("mid");
    });
    (scope || doc).querySelectorAll("[data-wrest]").forEach(function (el) {
      var parts = el.getAttribute("data-wrest").split(",");
      var w = parts.reduce(function (acc, p, i) {
        var v = get(p.trim());
        return i === 0 ? v : acc - v;
      }, 0);
      el.style.setProperty("--w", Math.max(0, w) + "%");
    });
  }

  /* ---------------- Dựng nội dung từ data ---------------- */

  function h(tag, attrs, html) {
    var el = doc.createElement(tag);
    if (attrs)
      Object.keys(attrs).forEach(function (k) {
        el.setAttribute(k, attrs[k]);
      });
    if (html != null) el.innerHTML = html;
    return el;
  }
  function vspan(path, d, extra) {
    return '<span data-v="' + path + '" data-d="' + d + '"' + (extra || "") + "></span>";
  }

  function buildMembers() {
    var ul = doc.getElementById("members");
    D.meta.thanhVien.forEach(function (m) {
      ul.appendChild(h("li", null, "<b>" + m.ten + "</b><span>" + m.msv + "</span>"));
    });
  }

  function buildNav() {
    var list = doc.getElementById("navList");
    chapters.forEach(function (s) {
      var li = h("li");
      var a = h("a", { href: "#" + s.id }, "<b>" + s.dataset.no + "</b><span>" + s.dataset.title + "</span>");
      a.setAttribute("aria-label", s.dataset.title);
      li.appendChild(a);
      list.appendChild(li);
    });
    // Mục lục: danh sách tiểu mục theo chương
    var toc = doc.getElementById("toc");
    chapters.forEach(function (s) {
      toc.appendChild(h("h4", null, s.dataset.no + " · " + s.dataset.title));
      s.querySelectorAll(".sub").forEach(function (sub) {
        var no = sub.dataset.sub || "";
        toc.appendChild(h("a", { href: "#" + sub.id, "data-for": sub.id }, "<b>" + no + "</b><span>" + sub.dataset.subtitle + "</span>"));
      });
    });
    var btn = doc.getElementById("btnToc");
    function setToc(open) {
      toc.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    }
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      setToc(toc.hidden);
    });
    toc.addEventListener("click", function (e) {
      if (e.target.closest("a")) setToc(false);
    });
    doc.addEventListener("click", function (e) {
      if (!toc.hidden && !e.target.closest("#toc")) setToc(false);
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !toc.hidden) {
        setToc(false);
        btn.focus();
      }
    });
  }

  /* ---------- Sân khấu chia đôi: dựng từ window.CONTENT ---------- */

  // {đường.dẫn|số lẻ|thang} → thẻ số data-v; {t:đường.dẫn} → chữ data-t
  function tpl(str) {
    if (str == null) return "";
    return String(str).replace(/\{(t:)?([a-zA-Z0-9_.]+)(?:\|(\d+))?(?:\|(\w+))?\}/g, function (m, isText, path, d, sc) {
      if (isText) return '<span data-t="' + path + '"></span>';
      return '<span data-v="' + path + '" data-d="' + (d || 0) + '"' + (sc ? ' data-s="' + sc + '"' : "") + "></span>";
    });
  }

  function chipClass(src) {
    if (/Hòa Phát|theo bài/.test(src)) return "src hp";
    return "src";
  }

  function card(side, c) {
    var label = side === "bq" ? "BQLDA" : "Doanh nghiệp";
    var src = c.s ? '<span class="' + (side === "dn" && !/^(B0|F0)/.test(c.s) ? "src hp" : chipClass(c.s)) + '">' + c.s + "</span>" : "";
    if (c.none != null) {
      return '<div class="scard ' + side + ' none"><span class="side">' + label + "</span>" + src +
        '<div class="m">Không có</div><p class="d">' + tpl(c.none) + "</p></div>";
    }
    return '<div class="scard ' + side + '"><span class="side">' + label + "</span>" + src +
      (c.m ? '<div class="m">' + tpl(c.m) + "</div>" : "") + (c.d ? '<p class="d">' + tpl(c.d) + "</p>" : "") + "</div>";
  }

  function stageHead(st) {
    var l = st.heads ? st.heads[0] : st.generic ? "BQLDA · TT 195/2012" : "BQLDA · TT 195/2012 · Đồng Bằng 2015";
    var r = st.heads ? st.heads[1] : st.generic ? "Doanh nghiệp · TT 200/2014" : "Doanh nghiệp · TT 200/2014 · Hòa Phát 2024";
    return '<div class="split-head"><span class="bq">' + l + '</span><span class="vs">so với</span><span class="dn">' + r + "</span></div>";
  }

  function renderStages() {
    doc.querySelectorAll(".stage[data-stage]").forEach(function (el) {
      var st = window.CONTENT[el.getAttribute("data-stage")];
      if (!st) {
        console.warn("Thiếu nội dung sân khấu:", el.getAttribute("data-stage"));
        return;
      }
      var sub = el.closest(".sub");
      var dupTitle = sub && sub.dataset.sub && st.title.indexOf(sub.dataset.sub + ".") === 0;
      var html = (dupTitle ? "" : '<p class="stage-title">' + st.title + "</p>") + (st.note ? '<p class="stage-note">' + st.note + "</p>" : "");
      html += stageHead(st);
      if (st.intro) html += '<p class="why-band intro" style="margin:12px 12px 0">' + tpl(st.intro) + "</p>";
      html += '<div class="srows">';
      st.rows.forEach(function (r) {
        html += '<div class="srow"><div class="srow-k">' + tpl(r.k) + "</div>" + card("bq", r.bq) + card("dn", r.dn) + "</div>";
      });
      html += "</div>";
      if (st.why) html += '<div class="why-band"><b>Vì sao khác:</b> ' + tpl(st.why) + "</div>";
      if (st.figs) {
        html += '<div class="fig-row">' + st.figs.map(function (f, i) {
          return '<button type="button" class="btn-src" data-fig="' + st.id + ":" + i + '">' + f.n + ": xem báo cáo gốc</button>";
        }).join("") + "</div>";
      }
      el.innerHTML = html;
    });
  }

  /* ---------- Biểu đồ gương ---------- */
  function butterfly(box, rows, max, unit) {
    var html = "";
    rows.forEach(function (r) {
      html += '<div class="bf-row"><div class="bf-side bq">' + r.bq.map(function (b) {
        return '<div class="bf-bar"><span class="bf-fill' + (b.hatch ? " hatch" : "") + '" style="--w:' + ((get(b.p) / max) * 100).toFixed(2) + '%"></span><span class="bf-v">' + vspan(b.p, b.d) + unit + (b.lab ? " " + b.lab : "") + "</span></div>";
      }).join("") + '</div><div class="bf-k">' + r.k + '</div><div class="bf-side dn">' + r.dn.map(function (b) {
        return '<div class="bf-bar"><span class="bf-fill' + (b.hatch ? " hatch" : "") + '" style="--w:' + ((get(b.p) / max) * 100).toFixed(2) + '%"></span><span class="bf-v">' + vspan(b.p, b.d) + unit + (b.lab ? " " + b.lab : "") + "</span></div>";
      }).join("") + "</div></div>";
    });
    html += '<div class="bf-axis"><span><b>' + max + "</b><b>0</b></span><span></span><span><b>0</b><b>" + max + "</b></span></div>";
    box.innerHTML = html;
    box.classList.add("reveal");
  }

  function buildDeadline() {
    butterfly(doc.querySelector("#chartDeadline .bfly"), [
      { k: "Báo cáo quý", bq: [{ p: "thoiHan.bq.quy", d: 0 }], dn: [{ p: "thoiHan.dn.quy", d: 0 }, { p: "thoiHan.dnRieng.quy", d: 0, hatch: true, lab: "(*)" }] },
      { k: "Báo cáo năm", bq: [{ p: "thoiHan.bq.nam", d: 0 }], dn: [{ p: "thoiHan.dn.nam", d: 0 }, { p: "thoiHan.dnRieng.nam", d: 0, hatch: true, lab: "(*)" }] }
    ], 90, " ngày");
  }

  function buildB22() {
    butterfly(doc.querySelector("#chartB22 .bfly"), [
      { k: "Tài sản ngắn hạn", bq: [{ p: "bq.b01.pct.tsnh", d: 1 }], dn: [{ p: "hp.pct.tsnh", d: 1 }] },
      { k: "Tài sản dài hạn", bq: [{ p: "bq.b01.pct.tsdh", d: 1 }], dn: [{ p: "hp.pct.tsdh", d: 1 }] },
      { k: "Trong đó: XDCB dở dang", bq: [{ p: "bq.b01.pct.tk241", d: 1 }], dn: [{ p: "hp.pct.xdcb", d: 1 }] },
      { k: "Nợ phải trả", bq: [{ p: "bq.b01.pct.no", d: 1 }], dn: [{ p: "hp.pct.no", d: 1 }] },
      { k: "Nguồn vốn đầu tư / Vốn chủ sở hữu", bq: [{ p: "bq.b01.pct.nvdt", d: 1 }], dn: [{ p: "hp.pct.vcsh", d: 1 }] }
    ], 100, "%");
  }

  function hbarsInto(id, rows, cls) {
    var box = doc.getElementById(id);
    var max = Math.max.apply(null, rows.map(function (r) { return Math.abs(get(r.p)); }));
    rows.forEach(function (r) {
      var v = get(r.p);
      var row = h("div", { class: "hbar" });
      row.innerHTML = "<span>" + r.lab + "</span>" +
        '<span class="hbar-track"><span class="hbar-fill' + (r.neg ? " neg" : "") + '" style="--w:' + Math.max(0.6, (Math.abs(v) / max) * 100).toFixed(2) + '%"></span></span>' +
        '<span class="hbar-v">' + (r.neg ? "−" : r.plus ? "+" : "") + vspan(r.p, r.d) + "</span>";
      box.appendChild(row);
    });
  }

  function buildHPCharts() {
    hbarsInto("chartHPEquity", [
      { lab: "Lợi nhuận thuần", p: "hp.lnst", d: 1, plus: true },
      { lab: "Cổ đông không kiểm soát góp vốn", p: "hp.gopVonCDKKS", d: 1, plus: true },
      { lab: "Trích quỹ khen thưởng, phúc lợi", p: "hp.trichQuy", d: 1, neg: true },
      { lab: "Công ty con trả cổ tức cho CĐKKS", p: "hp.cdkksCoTuc", d: 1, neg: true },
      { lab: "Sử dụng quỹ", p: "hp.suDungQuy", d: 1, neg: true },
      { lab: "Trả lại vốn cho CĐKKS", p: "hp.traVonCDKKS", d: 1, neg: true }
    ]);
    hbarsInto("chartHPCost", [
      { lab: "Giá vốn", p: "hp.giaVon", d: 1 },
      { lab: "Chi phí tài chính", p: "hp.cpTaiChinh", d: 1 },
      { lab: "Chi phí bán hàng", p: "hp.cpBanHang", d: 1 },
      { lab: "Chi phí quản lý doanh nghiệp", p: "hp.cpQLDN", d: 1 },
      { lab: "Chi phí khác", p: "hp.cpKhac", d: 1 }
    ]);
  }

  // Thanh tiêu đề: thêm nhãn ngắn cho màn hình nhỏ (hai chip nhỏ)
  function shortHeads() {
    doc.querySelectorAll(".split-head").forEach(function (hd) {
      [["bq", "BQLDA · TT 195"], ["dn", "Doanh nghiệp · TT 200"]].forEach(function (x) {
        var el = hd.querySelector("." + x[0]);
        if (el && !el.querySelector(".l")) el.innerHTML = '<i class="l">' + el.innerHTML + '</i><i class="s">' + x[1] + "</i>";
      });
    });
  }

  function buildCostBars() {
    var box = doc.getElementById("chartCost");
    var items = D.bq.b03.items;
    var max = Math.max.apply(null, items.map(function (i) { return i.ps; }));
    items.forEach(function (it, idx) {
      var row = h("div", { class: "hbar" });
      row.innerHTML =
        "<span>" + it.ten + "</span>" +
        '<span class="hbar-track"><span class="hbar-fill" style="--w:' + ((it.ps / max) * 100).toFixed(2) + '%"></span></span>' +
        '<span class="hbar-v">' + vspan("bq.b03.items." + idx + ".ps", 3) + "</span>";
      box.appendChild(row);
    });
  }

  function buildF03BBars() {
    var box = doc.getElementById("chartF03B");
    var f = D.bq.f03b;
    var rows = [["xd", "Xây dựng"], ["tb", "Thiết bị"], ["ql", "Quản lý dự án"], ["tv", "Tư vấn"], ["khac", "Chi phí khác"]];
    var max = Math.max.apply(null, rows.map(function (r) { return f[r[0]]; }));
    rows.forEach(function (r) {
      var row = h("div", { class: "hbar" });
      row.innerHTML =
        "<span>" + r[1] + "</span>" +
        '<span class="hbar-track"><span class="hbar-fill" style="--w:' + ((f[r[0]] / max) * 100).toFixed(2) + '%"></span></span>' +
        '<span class="hbar-v">' + vspan("bq.f03b." + r[0], 3) + "</span>";
      box.appendChild(row);
    });
  }

  function buildF03A() {
    var t = doc.getElementById("tblF03A");
    var tb = t.querySelector("tbody");
    var tf = t.querySelector("tfoot");
    var cols = ["dau", "ps", "giam", "cuoi", "xd", "tb", "bt", "ql", "tv", "kh"];
    function cell(path, v) {
      return '<td class="n">' + (v === 0 ? "–" : vspan(path, 3)) + "</td>";
    }
    D.bq.f03a.items.forEach(function (it, i) {
      var p = "bq.f03a.items." + i + ".";
      var tr = h("tr", it.banGiao ? { class: "done" } : null);
      tr.innerHTML = '<th scope="row">' + it.ten + (it.banGiao ? ' <span class="pill pill-soft" style="height:22px;font-size:11.5px">Đã bàn giao <span data-t="bq.f03b.ngayBanGiao"></span></span>' : "") + "</th>" +
        cols.map(function (c) { return cell(p + c, it[c]); }).join("");
      tb.appendChild(tr);
    });
    var b3 = {};
    D.bq.b03.items.forEach(function (x, i) { b3[x.key] = "bq.b03.items." + i + ".cuoi"; });
    tf.innerHTML = '<tr><td>Cộng (khớp B03-CĐT)</td>' +
      ["bq.b03.dau", "bq.b03.ps", "bq.b03.giam", "bq.b03.cuoi", b3.xd, b3.tb, b3.bt, b3.ql, b3.tv, b3.kh].map(function (p) {
        return '<td class="n">' + vspan(p, 3) + "</td>";
      }).join("") + "</tr>";
  }

  /* ---------- Lightbox: ảnh báo cáo gốc ---------- */
  var GALLERY = {
    b01: [["assets/bctc-b01.jpg", "B01-CĐT · Bảng cân đối kế toán (tr.2)"]],
    b02: [["assets/bctc-b02.jpg", "B02-CĐT · Nguồn vốn đầu tư (tr.3)"]],
    b03: [["assets/bctc-b03.jpg", "B03-CĐT · Thực hiện đầu tư xây dựng (tr.4)"]],
    b04: [["assets/bctc-b04-1.jpg", "B04-CĐT · Thuyết minh (tr.5)"], ["assets/bctc-b04-2.jpg", "B04-CĐT · Thuyết minh (tr.6)"], ["assets/bctc-b04-3.jpg", "B04-CĐT · Thuyết minh (tr.7)"]],
    f02: [["assets/bctc-f02.jpg", "F02-CĐT · Chi tiết nguồn vốn đầu tư (tr.8)"]],
    f03a: [["assets/bctc-f03a.jpg", "F03A-CĐT · Thực hiện đầu tư theo hạng mục (tr.9)"]],
    f03b: [["assets/bctc-f03b.jpg", "F03B-CĐT · Quyết toán công trình hoàn thành (tr.10)"]],
    f03c: [["assets/bctc-f03c.jpg", "F03C-CĐT · Chi phí khác (tr.11)"]],
    f03d: [["assets/bctc-f03d.jpg", "F03D-CĐT · Chi phí Ban QLDA (tr.12)"]]
  };
  var lbState = { list: [], i: 0, opener: null };

  function lbShow() {
    var it = lbState.list[lbState.i];
    var body = doc.getElementById("lbBody");
    doc.getElementById("lbTitle").textContent = it.title;
    var many = lbState.list.length > 1;
    doc.getElementById("lbCount").textContent = many ? lbState.i + 1 + " / " + lbState.list.length : "";
    doc.getElementById("lbPrev").hidden = doc.getElementById("lbNext").hidden = !many;
    body.className = "lb-body" + (it.dn ? "" : " one");
    body.innerHTML = '<figure class="bq"><figcaption>' + it.capBq + '</figcaption><img src="' + it.bq + '" alt="' + it.capBq + '"></figure>' +
      (it.dn ? '<figure class="dn"><figcaption>' + it.capDn + '</figcaption><img src="' + it.dn + '" alt="' + it.capDn + '"></figure>' : "");
  }

  function lbOpen(list, i, opener) {
    var dlg = doc.getElementById("lightbox");
    lbState = { list: list, i: i || 0, opener: opener };
    lbShow();
    if (dlg.showModal) dlg.showModal();
    else dlg.setAttribute("open", "");
  }

  function initLightbox() {
    var dlg = doc.getElementById("lightbox");
    doc.addEventListener("click", function (e) {
      var f = e.target.closest("[data-fig]");
      var g = e.target.closest("[data-gallery]");
      if (f) {
        var parts = f.getAttribute("data-fig").split(":");
        var figs = window.CONTENT[parts[0]].figs;
        lbOpen(figs.map(function (x) {
          return { title: x.n + ". " + x.t, bq: x.bq, dn: x.dn, capBq: "BQLDA Đồng Bằng 2015 (trái)", capDn: "Hòa Phát 2024 (phải)" };
        }), +parts[1], f);
      } else if (g) {
        lbOpen(GALLERY[g.getAttribute("data-gallery")].map(function (x) {
          return { title: "Bản gốc BCTC BQLDA: " + x[1], bq: x[0], capBq: x[1] };
        }), 0, g);
      }
    });
    function step(d) {
      lbState.i = (lbState.i + d + lbState.list.length) % lbState.list.length;
      lbShow();
    }
    doc.getElementById("lbPrev").addEventListener("click", function () { step(-1); });
    doc.getElementById("lbNext").addEventListener("click", function () { step(1); });
    doc.getElementById("lbClose").addEventListener("click", function () { dlg.close(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
      e.stopPropagation();
    });
    dlg.addEventListener("close", function () { if (lbState.opener) lbState.opener.focus(); });
  }

  var SVGNS = "http://www.w3.org/2000/svg";
  function svgEl(tag, attrs, text) {
    var el = doc.createElementNS(SVGNS, tag);
    Object.keys(attrs || {}).forEach(function (k) {
      el.setAttribute(k, attrs[k]);
    });
    if (text != null) el.textContent = text;
    return el;
  }

  // Thác nước TK 3361: 129,45 → +63,85 → −4,58 → 188,72
  function buildWaterfall() {
    var box = doc.getElementById("chartWaterfall");
    var b = D.bq.b02;
    var W = 560, H = 300, top = 28, bottom = 52, left = 12, right = 12;
    var maxV = b.dau + b.tang; // đỉnh cao nhất
    var y = function (v) { return top + (H - top - bottom) * (1 - v / maxV); };
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, "aria-hidden": "true" });
    var bars = [
      { lab: "Đầu năm", from: 0, to: b.dau, path: "bq.b02.dau", cls: "#0d3b84", sign: "" },
      { lab: "Tăng trong năm", from: b.dau, to: b.dau + b.tang, path: "bq.b02.tang", cls: "#1c6fe0", sign: "+" },
      { lab: "Giảm (quyết toán)", from: b.dau + b.tang, to: b.cuoi, path: "bq.b02.giam", cls: "#8db8f1", sign: "−" },
      { lab: "Cuối năm", from: 0, to: b.cuoi, path: "bq.b02.cuoi", cls: "#0d3b84", sign: "" }
    ];
    var slot = (W - left - right) / bars.length;
    var bw = slot * 0.56;
    svg.appendChild(svgEl("line", { x1: left, x2: W - right, y1: y(0), y2: y(0), class: "axis" }));
    bars.forEach(function (br, i) {
      var x = left + slot * i + (slot - bw) / 2;
      var y1 = y(Math.max(br.from, br.to)), y2 = y(Math.min(br.from, br.to));
      var r = svgEl("rect", { x: x, y: y1, width: bw, height: Math.max(2, y2 - y1), rx: 6, fill: br.cls, class: "wf-bar" });
      r.style.transitionDelay = i * 0.18 + "s";
      svg.appendChild(r);
      if (i < bars.length - 1) {
        var nx = left + slot * (i + 1) + (slot - bw) / 2;
        svg.appendChild(svgEl("line", { x1: x + bw, x2: nx, y1: y(br.to), y2: y(br.to), stroke: "#9aa8bf", "stroke-dasharray": "4 4" }));
      }
      var val = svgEl("text", { x: x + bw / 2, y: y1 - 8, "text-anchor": "middle", "font-size": 16, "font-weight": 700, fill: "#0f1e3a" });
      val.appendChild(svgEl("tspan", {}, br.sign));
      var tsp = svgEl("tspan", { "data-v": br.path, "data-d": "2" });
      val.appendChild(tsp);
      svg.appendChild(val);
      var lab = svgEl("text", { x: x + bw / 2, y: H - bottom + 22, "text-anchor": "middle", "font-size": 13, fill: "#44526b" }, br.lab);
      svg.appendChild(lab);
    });
    box.appendChild(svg);
  }

  // Donut F02: 54,4% / 45,6%
  function buildDonut() {
    var box = doc.getElementById("chartDonut");
    var f = D.bq.f02;
    var r = 80, c = 2 * Math.PI * r;
    var svg = svgEl("svg", { viewBox: "0 0 200 200", "aria-hidden": "true" });
    svg.appendChild(svgEl("circle", { cx: 100, cy: 100, r: r, fill: "none", stroke: "#e8eef8", "stroke-width": 26 }));
    var a = (f.pctVcsh / 100) * c, b2 = (f.pctVay / 100) * c, gap = 3;
    var s1 = svgEl("circle", { cx: 100, cy: 100, r: r, fill: "none", stroke: "#0d3b84", "stroke-width": 26, class: "seg", transform: "rotate(-90 100 100)" });
    s1.style.setProperty("--l", a - gap + "px");
    var s2 = svgEl("circle", { cx: 100, cy: 100, r: r, fill: "none", stroke: "#8db8f1", "stroke-width": 26, class: "seg", transform: "rotate(-90 100 100)", "stroke-dashoffset": -a });
    s2.style.setProperty("--l", b2 - gap + "px");
    [s1, s2].forEach(function (s) { s.style.setProperty("--c", c + "px"); });
    svg.appendChild(s1);
    svg.appendChild(s2);
    var t1 = svgEl("text", { x: 100, y: 98, "text-anchor": "middle", "font-size": 22, "font-weight": 800, fill: "#0d3b84" });
    t1.appendChild(svgEl("tspan", { "data-v": "bq.b02.cuoi", "data-d": "2" }));
    svg.appendChild(t1);
    svg.appendChild(svgEl("text", { x: 100, y: 120, "text-anchor": "middle", "font-size": 12, fill: "#44526b" }, "tỷ đồng, TK 3361"));
    box.appendChild(svg);
  }

  /* ---------------- Count-up ---------------- */

  function countUp(el) {
    if (el.dataset.counted) return;
    el.dataset.counted = "1";
    var sp = spec(el);
    if (!sp || reduceMotion) return;
    var dur = 1200, t0 = null;
    function frame(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var e = 1 - Math.pow(1 - p, 3);
      var cur = sp.s === "none" ? sp.v * e : Math.round(sp.v * e);
      if (el.dataset.final) return;
      el.textContent = p < 1 ? fmt(cur, sp.d, sp.s) : fmt(sp.v, sp.d, sp.s);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------------- Reveal khi cuộn ---------------- */

  function initReveal() {
    var targets = doc.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach(function (t) { t.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          en.target.querySelectorAll(".cu").forEach(countUp);
          if (en.target.classList.contains("cu")) countUp(en.target);
          io.unobserve(en.target);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
    );
    targets.forEach(function (t) { io.observe(t); });
  }

  function finalizeAll() {
    doc.querySelectorAll(".reveal").forEach(function (t) { t.classList.add("in"); });
    doc.querySelectorAll(".cu").forEach(function (el) {
      el.dataset.counted = "1";
      el.dataset.final = "1";
    });
    fillNumbers();
  }

  /* ---------------- Toggle BQLDA / Doanh nghiệp ---------------- */

  function initSegs() {
    doc.querySelectorAll(".seg[data-target]").forEach(function (seg) {
      var target = doc.getElementById(seg.getAttribute("data-target"));
      seg.addEventListener("click", function (e) {
        var btn = e.target.closest("button");
        if (!btn) return;
        var mode = btn.getAttribute("data-show");
        seg.querySelectorAll("button").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b === btn));
        });
        if (target.tagName === "TABLE") {
          target.classList.toggle("cols-hide-dn", mode === "bq");
          target.classList.toggle("cols-hide-bq", mode === "dn");
        } else {
          target.setAttribute("data-mode", mode);
        }
        if (present) fitPanels();
      });
    });
  }

  /* ---------------- Tabs ---------------- */

  function initTabs() {
    doc.querySelectorAll('[role="tablist"]').forEach(function (list) {
      var tabs = Array.prototype.slice.call(list.querySelectorAll('[role="tab"]'));
      function select(tab, focus) {
        tabs.forEach(function (t) {
          var on = t === tab;
          t.setAttribute("aria-selected", String(on));
          t.tabIndex = on ? 0 : -1;
          doc.getElementById(t.getAttribute("aria-controls")).hidden = !on;
        });
        if (focus) tab.focus();
        if (present) fitPanels();
      }
      list.addEventListener("click", function (e) {
        var t = e.target.closest('[role="tab"]');
        if (t) select(t);
      });
      list.addEventListener("keydown", function (e) {
        var i = tabs.indexOf(doc.activeElement);
        if (i < 0) return;
        var n = null;
        if (e.key === "ArrowRight") n = tabs[(i + 1) % tabs.length];
        if (e.key === "ArrowLeft") n = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === "Home") n = tabs[0];
        if (e.key === "End") n = tabs[tabs.length - 1];
        if (n) {
          e.preventDefault();
          e.stopPropagation();
          select(n, true);
        }
      });
    });
  }

  /* ---------------- Nav, tiến độ cuộn ---------------- */

  // sections: bìa + 5 phần (Mở đầu, Chương 1–3, Kết luận). Khi trình chiếu có thêm các trang tách (.page).
  var sections = Array.prototype.slice.call(doc.querySelectorAll("main > .slide"));
  var chapters = sections.filter(function (s) { return s.classList.contains("chapter"); });
  var currentIdx = 0;
  var shownKey = null;

  function slides() {
    return Array.prototype.slice.call(doc.querySelectorAll("main > .slide"));
  }

  function chapterOf(slide) {
    if (slide.classList.contains("chapter")) return slide;
    if (slide.dataset.chapter) return doc.getElementById(slide.dataset.chapter);
    return null;
  }

  function updateScroll() {
    var max = root.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    doc.getElementById("progress").style.transform = "scaleX(" + p.toFixed(4) + ")";
    var line = window.innerHeight * 0.35;
    var list = slides();
    var idx = 0;
    list.forEach(function (s, i) {
      if (s.getBoundingClientRect().top <= line) idx = i;
    });
    currentIdx = idx;
    var slide = list[idx];
    var ch = chapterOf(slide);
    var sub = null;
    if (ch) {
      if (slide.dataset.subref) sub = doc.getElementById(slide.dataset.subref);
      else if (!present) {
        ch.querySelectorAll(".sub").forEach(function (s) {
          if (s.getBoundingClientRect().top <= line) sub = s;
        });
      }
    }
    var key = (ch ? ch.id : "hero") + "|" + (sub ? sub.id : "");
    if (key === shownKey) return;
    shownKey = key;
    doc.querySelectorAll("#navList a").forEach(function (a) {
      if (ch && a.getAttribute("href") === "#" + ch.id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    doc.querySelectorAll("#toc a").forEach(function (a) {
      if (sub && a.getAttribute("data-for") === sub.id) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    doc.getElementById("navNo").textContent = ch ? ch.dataset.title : "Bìa";
    doc.getElementById("navTitle").textContent = sub ? " · " + (sub.dataset.sub && sub.dataset.sub !== ch.dataset.title ? sub.dataset.sub + " " : "") + sub.dataset.subtitle : "";
  }

  function goTo(i) {
    var list = slides();
    i = Math.max(0, Math.min(list.length - 1, i));
    currentIdx = i;
    list[i].scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
  }

  /* ---------------- Chế độ trình chiếu ---------------- */

  var present = false;
  var presentFromFullscreen = false;
  var movedNodes = [];
  var MAX_ROWS = 4;

  // Di chuyển (không sao chép) để tab, nút vẫn chạy; ghi lại vị trí gốc để trả về khi thoát.
  function move(node, target) {
    if (!node.__ph) {
      var ph = doc.createComment("vị trí gốc");
      node.parentNode.insertBefore(ph, node);
      node.__ph = ph;
      movedNodes.push(node);
    }
    target.appendChild(node);
  }

  function availHeight() {
    return window.innerHeight - parseFloat(getComputedStyle(root).getPropertyValue("--nav-h")) - 36;
  }

  function newPage(ch, sub, after) {
    var page = h("section", {
      class: "slide page",
      "data-chapter": ch.id,
      "data-subref": sub.id,
      "aria-label": ch.dataset.title + (sub.dataset.sub ? ", " + sub.dataset.sub : "") + " " + sub.dataset.subtitle
    });
    var panel = h("div", { class: "panel" }, '<p class="page-head"><b>' + (sub.dataset.sub || "") + "</b><span>" + sub.dataset.subtitle + "</span><em></em></p>");
    page.appendChild(panel);
    after.parentNode.insertBefore(page, after.nextSibling);
    return { el: page, panel: panel };
  }

  function makeShell(stage) {
    var sh = h("div", { class: "stage shell" });
    stage.querySelectorAll(":scope > .stage-title, :scope > .stage-note, :scope > .split-head").forEach(function (c) {
      sh.appendChild(c.cloneNode(true));
    });
    sh.appendChild(h("div", { class: "srows" }));
    return sh;
  }

  function buildPages() {
    var limit = availHeight();
    chapters.forEach(function (ch) {
      var last = ch;
      Array.prototype.slice.call(ch.querySelectorAll(":scope > .panel > .sub")).forEach(function (sub) {
        var pages = [];
        var cur, box;
        function fits() { return cur.panel.offsetHeight <= limit - 14; }
        function nextPage() {
          cur = newPage(ch, sub, last);
          last = cur.el;
          pages.push(cur);
          box = h("div", { class: "sub-cont" });
          cur.panel.appendChild(box);
        }
        cur = newPage(ch, sub, last);
        last = cur.el;
        pages.push(cur);
        var kids = Array.prototype.slice.call(sub.children);
        move(sub, cur.panel);
        box = sub;
        kids.forEach(function (k) {
          var isHead = k.classList.contains("sub-head") || k.classList.contains("part-head");
          if (isHead) return;
          if (box !== sub) move(k, box);
          if (k.classList.contains("stage")) {
            var rows = Array.prototype.slice.call(k.querySelectorAll(":scope > .srows > .srow"));
            if (fits() && rows.length <= MAX_ROWS) return;
            var tail = Array.prototype.slice.call(k.children).filter(function (c) {
              return (c.classList.contains("why-band") && !c.classList.contains("intro")) || c.classList.contains("fig-row");
            });
            var hold = h("div");
            rows.concat(tail).forEach(function (r) { move(r, hold); });
            if (!fits() && box.children.length > (box === sub ? 2 : 1)) {
              nextPage();
              move(k, box);
            }
            var shell = k, n = 0;
            rows.forEach(function (r) {
              move(r, shell.querySelector(":scope > .srows"));
              n++;
              if (n === 1 && !fits() && shell === k && box.children.length > (box === sub ? 2 : 1)) {
                // ngay hàng đầu đã tràn: đưa cả sân khấu sang màn mới
                nextPage();
                move(k, box);
              } else if (n > MAX_ROWS || (!fits() && n > 1)) {
                nextPage();
                shell = makeShell(k);
                box.appendChild(shell);
                move(r, shell.querySelector(":scope > .srows"));
                n = 1;
              }
            });
            tail.forEach(function (t) {
              move(t, shell);
              if (!fits()) {
                nextPage();
                move(t, box);
              }
            });
          } else if (!fits() && box.children.length > (box === sub ? 2 : 1)) {
            nextPage();
            move(k, box);
          }
        });
        if (pages.length > 1) {
          pages.forEach(function (pg, i) {
            pg.panel.querySelector(".page-head em").textContent = "(" + (i + 1) + "/" + pages.length + ")";
          });
        }
      });
    });
  }

  function unbuildPages() {
    movedNodes.forEach(function (n) {
      n.__ph.parentNode.insertBefore(n, n.__ph);
      n.__ph.remove();
      delete n.__ph;
    });
    movedNodes = [];
    doc.querySelectorAll("main > .slide.page").forEach(function (p) { p.remove(); });
  }

  // Khi một khối đơn lẻ vẫn cao hơn màn hình, thu nhỏ panel (nới rộng tương ứng để dàn ngang trước).
  function fitPanels() {
    slides().forEach(function (s) {
      var p = s.querySelector(".panel");
      p.style.zoom = "";
      p.style.width = "";
      if (!present) return;
      var availH = s.clientHeight - 36;
      var availW = s.clientWidth - 2 * parseFloat(getComputedStyle(s).paddingLeft || 0);
      var baseW = p.offsetWidth;
      if (p.offsetHeight <= availH) return;
      var lo = 0.45, hi = 1, best = lo;
      for (var n = 0; n < 12; n++) {
        var z = (lo + hi) / 2;
        p.style.width = Math.min(availW / z, baseW / z) + "px";
        if (p.offsetHeight * z <= availH) {
          best = z;
          lo = z;
        } else hi = z;
      }
      p.style.width = Math.min(availW / best, baseW / best) + "px";
      p.style.zoom = best.toFixed(3);
    });
  }

  function setPresent(on) {
    var cur = slides()[currentIdx] || sections[0];
    var target = cur.dataset.subref || (cur.classList.contains("page") ? cur.dataset.chapter : cur.id);
    if (on === present) return;
    present = on;
    root.classList.toggle("present", on);
    if (on) {
      finalizeAll();
      buildPages();
    } else {
      unbuildPages();
    }
    doc.getElementById("btnPresent").setAttribute("aria-pressed", String(on));
    fitPanels();
    // Font web tải xong sau thì chữ đổi kích thước: phân trang lại một lần nữa.
    if (on && doc.fonts && doc.fonts.status !== "loaded") doc.fonts.ready.then(onResize);
    shownKey = null;
    var el = doc.getElementById(target);
    if (on && el && el.classList.contains("sub")) el = el.closest(".slide");
    if (el) el.scrollIntoView({ block: "start" });
    updateScroll();
  }

  var resizeTimer = null;
  function onResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (present) {
        // phân trang lại theo kích thước màn hình mới
        var cur = slides()[currentIdx];
        var ref = cur && (cur.dataset.subref || cur.id);
        unbuildPages();
        buildPages();
        fitPanels();
        var el = ref && doc.getElementById(ref);
        if (el) (el.closest(".slide") || el).scrollIntoView({ block: "start" });
      }
      updateScroll();
    }, 150);
  }

  function toggleFullscreen() {
    if (!doc.fullscreenElement) {
      if (root.requestFullscreen) {
        root.requestFullscreen().then(function () {
          if (!present) {
            presentFromFullscreen = true;
            setPresent(true);
          }
        }).catch(function () {});
      }
    } else if (doc.exitFullscreen) {
      doc.exitFullscreen();
    }
  }

  doc.addEventListener("fullscreenchange", function () {
    if (!doc.fullscreenElement && presentFromFullscreen) {
      presentFromFullscreen = false;
      setPresent(false);
    } else {
      onResize();
    }
  });

  function onKey(e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (doc.getElementById("lightbox").open) return;
    var t = e.target;
    if (t.closest && t.closest('[role="tablist"], input, textarea, select, #toc')) return;
    var k = e.key;
    if (k === "f" || k === "F") {
      e.preventDefault();
      toggleFullscreen();
      return;
    }
    if (k === "Escape" && present && !doc.fullscreenElement) {
      setPresent(false);
      return;
    }
    var next = k === "ArrowRight" || (present && (k === "ArrowDown" || k === "PageDown" || k === " "));
    var prev = k === "ArrowLeft" || (present && (k === "ArrowUp" || k === "PageUp"));
    if (next || prev) {
      e.preventDefault();
      if (present) {
        goTo(currentIdx + (next ? 1 : -1));
      } else {
        // Ngoài trình chiếu: ← → nhảy giữa các tiểu mục
        var anchors = [sections[0]].concat(Array.prototype.slice.call(doc.querySelectorAll(".chapter, .sub")));
        var line = window.innerHeight * 0.35, ai = 0;
        anchors.forEach(function (a, i) { if (a.getBoundingClientRect().top <= line + 2) ai = i; });
        var tgt = anchors[Math.max(0, Math.min(anchors.length - 1, ai + (next ? 1 : -1)))];
        tgt.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }
    }
  }

  /* ---------------- In ---------------- */

  var presentBeforePrint = false;
  window.addEventListener("beforeprint", function () {
    finalizeAll();
    presentBeforePrint = present;
    if (present) setPresent(false);
  });
  window.addEventListener("afterprint", function () {
    if (presentBeforePrint) setPresent(true);
  });

  /* ---------------- Khởi động ---------------- */

  buildMembers();
  buildNav();
  renderStages();
  buildCostBars();
  buildF03BBars();
  buildF03A();
  buildWaterfall();
  buildDonut();
  buildDeadline();
  buildB22();
  buildHPCharts();
  shortHeads();
  fillNumbers();
  fillWidths();

  // Số đếm: trước khi vào khung nhìn hiển thị 0, rồi đếm lên.
  if (!reduceMotion && "IntersectionObserver" in window) {
    doc.querySelectorAll(".cu").forEach(function (el) {
      var sp = spec(el);
      if (sp) el.textContent = fmt(0, sp.d, sp.s);
    });
  }
  initReveal();
  initSegs();
  initTabs();
  initLightbox();

  doc.getElementById("btnPresent").addEventListener("click", function () { setPresent(!present); });
  doc.getElementById("btnFull").addEventListener("click", toggleFullscreen);
  doc.getElementById("btnPrint").addEventListener("click", function () {
    finalizeAll();
    window.print();
  });
  doc.addEventListener("keydown", onKey);

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      updateScroll();
    });
  }, { passive: true });
  window.addEventListener("resize", onResize);
  updateScroll();

  // Cho bản kiểm thử: hiện mọi thứ ở trạng thái cuối.
  window.__finalize = finalizeAll;
  window.__fmt = fmt;
})();

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
    sections.forEach(function (s) {
      var li = h("li");
      var a = h("a", { href: "#" + s.id }, "<b>" + s.dataset.no + "</b><span>" + s.dataset.title + "</span>");
      a.setAttribute("aria-label", s.dataset.no + ". " + s.dataset.title);
      li.appendChild(a);
      list.appendChild(li);
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
    var items = D.bq.f03a.items;
    var total = D.bq.b03.cuoi;
    function cell(path, v) {
      return '<td class="n">' + (v === 0 ? "–" : vspan(path, 3)) + "</td>";
    }
    items.forEach(function (it, i) {
      var p = "bq.f03a.items." + i + ".";
      var tr = h("tr");
      var pctW = ((it.cuoi / total) * 100).toFixed(2);
      tr.innerHTML =
        '<th scope="row">' + it.ten + (it.banGiao ? ' <span class="pill pill-soft" style="height:22px;font-size:11.5px">Đã bàn giao 30/10/2015</span>' : "") + "</th>" +
        cell(p + "dau", it.dau) + cell(p + "ps", it.ps) + cell(p + "giam", it.giam) + cell(p + "cuoi", it.cuoi) +
        '<td class="bar-cell"><div class="meter"><span style="--w:' + pctW + '%"></span></div></td>';
      tb.appendChild(tr);
    });
    // ngày bàn giao lấy từ data
    tb.querySelectorAll(".pill").forEach(function (p) {
      p.textContent = "Đã bàn giao " + D.bq.f03b.ngayBanGiao;
    });
    var b = "bq.b03.";
    tf.innerHTML =
      '<tr><td>Cộng (khớp B03-CĐT)</td><td class="n">' + vspan(b + "dau", 3) + '</td><td class="n">' + vspan(b + "ps", 3) +
      '</td><td class="n">' + vspan(b + "giam", 3) + '</td><td class="n">' + vspan(b + "cuoi", 3) + "</td><td></td></tr>";
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

  // Cột nhóm: thời hạn nộp BCTC
  function buildDeadline() {
    var box = doc.getElementById("chartDeadline");
    var T = D.thoiHan;
    var W = 560, H = 300, top = 30, bottom = 64, left = 40, right = 10;
    var maxV = 100;
    var y = function (v) { return top + (H - top - bottom) * (1 - v / maxV); };
    var svg = svgEl("svg", { viewBox: "0 0 " + W + " " + H, "aria-hidden": "true" });
    var defs = svgEl("defs");
    var pat = svgEl("pattern", { id: "hatch", width: 8, height: 8, patternUnits: "userSpaceOnUse", patternTransform: "rotate(45)" });
    pat.appendChild(svgEl("rect", { width: 8, height: 8, fill: "#d2e4fb" }));
    pat.appendChild(svgEl("line", { x1: 0, y1: 0, x2: 0, y2: 8, stroke: "#1c6fe0", "stroke-width": 3 }));
    defs.appendChild(pat);
    svg.appendChild(defs);
    [0, 30, 60, 90].forEach(function (g) {
      svg.appendChild(svgEl("line", { x1: left, x2: W - right, y1: y(g), y2: y(g), class: g ? "gridl" : "axis" }));
      svg.appendChild(svgEl("text", { x: left - 8, y: y(g) + 4, "text-anchor": "end", "font-size": 11, fill: "#64728a" }, String(g)));
    });
    var groups = [["quy", "Báo cáo quý"], ["nam", "Báo cáo năm"]];
    var series = [
      { k: "bq", fill: "#0d3b84", lab: "BQLDA (TT 195)" },
      { k: "dn", fill: "#1c6fe0", lab: "Doanh nghiệp (TT 200)" },
      { k: "dnRieng", fill: "url(#hatch)", lab: "DN, trường hợp riêng" }
    ];
    var gw = (W - left - right) / groups.length, bw = 52, gapB = 10;
    groups.forEach(function (g, gi) {
      var startX = left + gw * gi + (gw - (bw * 3 + gapB * 2)) / 2;
      series.forEach(function (s, si) {
        var v = T[s.k][g[0]];
        var x = startX + si * (bw + gapB);
        var r = svgEl("rect", { x: x, y: y(v), width: bw, height: y(0) - y(v), rx: 5, fill: s.fill, class: "wf-bar", stroke: s.k === "dnRieng" ? "#1c6fe0" : "none" });
        r.style.transitionDelay = (gi * 3 + si) * 0.08 + "s";
        svg.appendChild(r);
        var t = svgEl("text", { x: x + bw / 2, y: y(v) - 7, "text-anchor": "middle", "font-size": 13, "font-weight": 700, fill: "#0f1e3a" });
        t.appendChild(svgEl("tspan", { "data-v": "thoiHan." + s.k + "." + g[0], "data-d": "0" }));
        t.appendChild(svgEl("tspan", {}, " ngày"));
        svg.appendChild(t);
      });
      svg.appendChild(svgEl("text", { x: left + gw * gi + gw / 2, y: y(0) + 20, "text-anchor": "middle", "font-size": 13, "font-weight": 600, fill: "#0f1e3a" }, g[1]));
    });
    var lx = left;
    series.forEach(function (s) {
      svg.appendChild(svgEl("rect", { x: lx, y: H - 22, width: 12, height: 12, rx: 3, fill: s.fill, stroke: s.k === "dnRieng" ? "#1c6fe0" : "none" }));
      svg.appendChild(svgEl("text", { x: lx + 18, y: H - 12, "font-size": 12, fill: "#44526b" }, s.lab));
      lx += s.lab.length * 6.6 + 40;
    });
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

  // sections: 11 phần gốc (00–10). Khi trình chiếu, các phần dài được tách thêm trang (.page).
  var sections = Array.prototype.slice.call(doc.querySelectorAll("main > .slide"));
  var currentIdx = 0; // vị trí trong danh sách slide đang hiển thị (gồm cả trang tách)
  var shownNo = null; // số phần đang hiện trên nav

  function slides() {
    return Array.prototype.slice.call(doc.querySelectorAll("main > .slide"));
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
    var s = list[idx];
    if (s.dataset.no === shownNo) return;
    shownNo = s.dataset.no;
    doc.querySelectorAll("#navList a").forEach(function (a) {
      if (a.getAttribute("href") === "#s" + shownNo) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
    doc.getElementById("navNo").textContent = s.dataset.no;
    doc.getElementById("navTitle").textContent = s.dataset.title;
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

  // Tách mỗi .block của một phần thành một trang 16:9 riêng. Nút DOM được DI CHUYỂN (không sao chép)
  // nên tab, toggle vẫn hoạt động; khi thoát trình chiếu, mọi nút trở về chỗ cũ.
  function buildPages() {
    sections.forEach(function (sec) {
      var panel = sec.querySelector(".panel");
      var last = sec;
      var curPanel = null;
      var part = 1;
      Array.prototype.slice.call(panel.children).forEach(function (k) {
        if (k.classList.contains("block")) {
          part++;
          var page = h("section", {
            class: "slide page",
            "data-no": sec.dataset.no,
            "data-title": sec.dataset.title,
            "aria-label": sec.dataset.no + ". " + sec.dataset.title + ", phần " + part
          });
          curPanel = h("div", { class: "panel" }, '<p class="page-head"><b>' + sec.dataset.no + "</b>" + sec.dataset.title + "</p>");
          page.appendChild(curPanel);
          last.parentNode.insertBefore(page, last.nextSibling);
          last = page;
        }
        if (curPanel) {
          var ph = doc.createComment("vị trí gốc");
          k.parentNode.insertBefore(ph, k);
          curPanel.appendChild(k);
          movedNodes.push([k, ph]);
        }
      });
    });
  }

  function unbuildPages() {
    movedNodes.forEach(function (m) {
      m[1].parentNode.insertBefore(m[0], m[1]);
      m[1].remove();
    });
    movedNodes = [];
    doc.querySelectorAll("main > .slide.page").forEach(function (p) { p.remove(); });
  }

  // Thu nhỏ panel cho vừa khung; panel được nới rộng tương ứng để nội dung dàn ngang trước khi thu nhỏ.
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
    var no = (slides()[currentIdx] || sections[0]).dataset.no;
    present = on;
    if (on) {
      finalizeAll();
      buildPages();
    } else {
      unbuildPages();
    }
    root.classList.toggle("present", on);
    doc.getElementById("btnPresent").setAttribute("aria-pressed", String(on));
    fitPanels();
    shownNo = null;
    doc.getElementById("s" + no).scrollIntoView({ block: "start" });
    updateScroll();
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
      setTimeout(fitPanels, 50);
    }
  });

  function onKey(e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    var t = e.target;
    if (t.closest && t.closest('[role="tablist"], input, textarea, select')) return;
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
        // Ngoài trình chiếu: ← → nhảy giữa 11 phần gốc
        var no = (slides()[currentIdx] || sections[0]).dataset.no;
        var si = sections.findIndex(function (x) { return x.dataset.no === no; });
        var target = sections[Math.max(0, Math.min(sections.length - 1, si + (next ? 1 : -1)))];
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
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
  buildCostBars();
  buildF03BBars();
  buildF03A();
  buildWaterfall();
  buildDonut();
  buildDeadline();
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
  window.addEventListener("resize", function () {
    fitPanels();
    updateScroll();
  });
  updateScroll();

  // Cho bản kiểm thử: hiện mọi thứ ở trạng thái cuối.
  window.__finalize = finalizeAll;
  window.__fmt = fmt;
})();

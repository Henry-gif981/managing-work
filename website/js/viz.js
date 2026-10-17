/* Bản 3: đồ họa và biểu đồ. Mọi số lấy từ data.js qua thẻ data-v; main.js điền số sau khi dựng.
 * Quy ước: navy = BQLDA (ống dẫn một chiều), xanh sáng = Doanh nghiệp (vòng kết quả khép kín). */
(function () {
  "use strict";
  var D = window.DATA;
  var doc = document;
  var CALC = "tính từ số liệu bài";

  function get(p) {
    return p.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, D);
  }
  function v(p, d, s, extra) {
    return '<span data-v="' + p + '" data-d="' + (d == null ? 3 : d) + '"' + (s ? ' data-s="' + s + '"' : "") + (extra || "") + "></span>";
  }
  function t(p) { return '<span data-t="' + p + '"></span>'; }
  function chip(src, kind) {
    var cls = kind === "calc" ? "src calc" : kind === "hp" || /Hòa Phát|theo bài/.test(src) ? "src hp" : kind === "bai" ? "src bai" : "src";
    return '<span class="' + cls + '">' + src + "</span>";
  }
  function calcChip() { return chip(CALC, "calc"); }
  function ic(name) { return '<svg class="ic" aria-hidden="true"><use href="#' + name + '"/></svg>'; }
  function bqVal(p) { return get(p) / 1e9; } // đồng → tỷ, chỉ để tính hình học

  /* ---------- Tooltip ---------- */
  var tipN = 0;
  function tip(html) {
    var id = "tip" + ++tipN;
    var div = doc.createElement("div");
    div.id = id;
    div.className = "tip-src";
    div.innerHTML = html;
    doc.getElementById("tipStore").appendChild(div);
    return ' data-tip="' + id + '" tabindex="0"';
  }
  function initTips() {
    var box = doc.getElementById("tooltip");
    function show(el) {
      var src = doc.getElementById(el.getAttribute("data-tip"));
      if (!src) return;
      box.innerHTML = src.innerHTML;
      box.hidden = false;
      var r = el.getBoundingClientRect();
      var bw = box.offsetWidth, bh = box.offsetHeight;
      var x = Math.min(window.innerWidth - bw - 8, Math.max(8, r.left + r.width / 2 - bw / 2));
      var y = r.top - bh - 10;
      if (y < 60) y = r.bottom + 10;
      box.style.transform = "translate(" + x + "px," + y + "px)";
    }
    function hide() { box.hidden = true; }
    doc.addEventListener("mouseover", function (e) { var el = e.target.closest("[data-tip]"); if (el) show(el); });
    doc.addEventListener("mouseout", function (e) { if (e.target.closest("[data-tip]")) hide(); });
    doc.addEventListener("focusin", function (e) { var el = e.target.closest("[data-tip]"); if (el) show(el); });
    doc.addEventListener("focusout", hide);
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- Đồ họa đại diện ---------- */
  // BQLDA: dòng vốn một chiều. opts.mini: bản thu nhỏ; opts.steps: đánh số 5 bước (Hình 1.3)
  function pipeSVG(opts) {
    opts = opts || {};
    var id = opts.id || "";
    var lvl = get("bq.b03.tyLe") / 100;
    var tankH = 160, tankY = 40, water = tankH * lvl;
    var step = function (n, x, y) {
      return opts.steps ? '<g class="stepb"><circle cx="' + x + '" cy="' + y + '" r="15"/><text x="' + x + '" y="' + (y + 6) + '" text-anchor="middle">' + n + "</text></g>" : "";
    };
    var seg = function (d) { return '<path d="' + d + '" class="pipe"/><path d="' + d + '" class="pipe-core" marker-end="url(#ah' + id + ')"/>'; };
    return '<svg class="g-pipe' + (opts.mini ? " mini" : "") + '" viewBox="0 0 760 316" role="img" aria-label="Dòng vốn một chiều của BQLDA: chủ đầu tư cấp vốn qua TK 336, tập hợp vào TK 241, quyết toán bàn giao cho chủ đầu tư, không xác định lãi lỗ.">' +
      '<defs><linearGradient id="gw' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3f68ad"/><stop offset="1" stop-color="#0d3b84"/></linearGradient>' +
      '<marker id="ah' + id + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#0d3b84"/></marker></defs>' +
      // Chủ đầu tư (nguồn)
      '<rect x="6" y="52" width="160" height="' + (opts.mini ? 120 : 130) + '" rx="14" class="n-box"/>' +
      '<text x="86" y="' + (opts.mini ? 118 : 82) + '" class="t-h" text-anchor="middle">Chủ đầu tư</text>' +
      (opts.mini ? "" : '<text x="86" y="110" class="t-s" text-anchor="middle">VCSH <tspan data-v="bq.f02.vcsh.cuoi" data-d="3"></tspan></text><text x="86" y="134" class="t-s" text-anchor="middle">Vay cấp lại <tspan data-v="bq.f02.vay.cuoi" data-d="3"></tspan></text><text x="86" y="164" class="t-xs" text-anchor="middle">tỷ đồng · F02</text>') +
      // ống TK 336
      seg("M166 112 H286") + '<text x="226" y="92" class="t-s b" text-anchor="middle">TK 336 (3361)</text>' +
      // BQLDA
      '<circle cx="324" cy="112" r="36" class="n-fill"/><text x="324" y="118" class="t-w" text-anchor="middle">BQLDA</text>' +
      seg("M360 112 H390") +
      // bình TK 241
      '<rect x="394" y="' + tankY + '" width="126" height="' + tankH + '" rx="12" class="tank"/>' +
      '<rect class="water" x="396" y="' + (tankY + tankH - water) + '" width="122" height="' + (water - 2) + '" rx="10" fill="url(#gw' + id + ')"/>' +
      '<text x="457" y="30" class="t-h" text-anchor="middle">TK 241</text>' +
      (opts.mini ? '<text x="457" y="' + (tankY + tankH - 30) + '" class="t-w big keep" text-anchor="middle"><tspan data-v="bq.b03.tyLe" data-d="1"></tspan>%</text>' :
        '<text x="457" y="' + (tankY + tankH - 44) + '" class="t-w big" text-anchor="middle"><tspan data-v="bq.b03.tyLe" data-d="1"></tspan>%</text><text x="457" y="' + (tankY + tankH - 18) + '" class="t-w sm" text-anchor="middle"><tspan data-v="bq.b03.luyKe" data-d="2"></tspan> / <tspan data-v="bq.b03.tongMuc" data-d="0"></tspan> tỷ</text>') +
      // cửa ra quyết toán
      seg("M520 172 H610") +
      (opts.mini ? '<text x="565" y="156" class="t-s b" text-anchor="middle">Bàn giao</text>' : '<text x="565" y="138" class="t-s b" text-anchor="middle">Quyết toán,</text><text x="565" y="157" class="t-s b" text-anchor="middle">bàn giao</text><text x="565" y="236" class="t-xs" text-anchor="middle">Nợ 336 / Có 241</text>') +
      '<rect x="614" y="122" width="140" height="96" rx="14" class="n-box"/>' +
      '<text x="684" y="' + (opts.mini ? 166 : 150) + '" class="t-h sm" text-anchor="middle">Chủ đầu tư</text><text x="684" y="' + (opts.mini ? 188 : 172) + '" class="t-h sm" text-anchor="middle">nhận tài sản</text>' +
      (opts.mini ? "" : '<text x="684" y="200" class="t-s" text-anchor="middle"><tspan data-v="bq.f03b.duyet" data-d="3"></tspan> tỷ (2015)</text>') +
      // dải kết quả
      '<rect x="6" y="252" width="748" height="56" rx="12" class="res"/><text x="380" y="287" class="t-res" text-anchor="middle">Không xác định lãi, lỗ</text>' +
      step(1, 226, 134) + step(2, 457, 220) + step(3, 324, 166) + step(4, 565, 106) + step(5, 680, 280) +
      // hạt dòng chảy (chạy một lần khi vào khung nhìn)
      [0, 0.5, 1].map(function (dl) {
        return '<circle r="5" class="dot" style="animation-delay:' + dl + 's"><animateMotion dur="2.6s" begin="indefinite" fill="remove" path="M166 112 H390 M520 172 H610" data-delay="' + dl + '"/></circle>';
      }).join("") + "</svg>";
  }

  // Doanh nghiệp: vòng kết quả khép kín
  function loopSVG(opts) {
    opts = opts || {};
    var cx = 320, cy = 178, r = 132;
    var nodes = [
      ["Vốn", "TK 411, 341"],
      ["Đầu tư, sản xuất", "TK 241, 211, 632"],
      ["Doanh thu", "TK 511"],
      ["Kết quả", "TK 911"],
      ["LN giữ lại", "TK 421"]
    ];
    var pts = nodes.map(function (n, i) {
      var a = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    var arcs = "";
    for (var i = 0; i < 5; i++) {
      var a1 = -Math.PI / 2 + (i * 2 * Math.PI) / 5 + 0.36, a2 = -Math.PI / 2 + ((i + 1) * 2 * Math.PI) / 5 - 0.36;
      arcs += '<path d="M' + (cx + r * Math.cos(a1)).toFixed(1) + " " + (cy + r * Math.sin(a1)).toFixed(1) + " A" + r + " " + r + " 0 0 1 " + (cx + r * Math.cos(a2)).toFixed(1) + " " + (cy + r * Math.sin(a2)).toFixed(1) + '" class="arc" marker-end="url(#lh' + (opts.id || "") + ')"/>';
    }
    var boxes = pts.map(function (p, i) {
      var w = opts.mini ? 116 : 140, hgt = opts.mini ? 40 : 52;
      return '<g class="lnode"><rect x="' + (p[0] - w / 2) + '" y="' + (p[1] - hgt / 2) + '" width="' + w + '" height="' + hgt + '" rx="12"/>' +
        '<text x="' + p[0] + '" y="' + (p[1] + (opts.mini ? 6 : -2)) + '" text-anchor="middle" class="t-h sm">' + nodes[i][0] + "</text>" +
        (opts.mini ? "" : '<text x="' + p[0] + '" y="' + (p[1] + 17) + '" text-anchor="middle" class="t-xs">' + nodes[i][1] + "</text>") +
        (opts.steps ? '<g class="stepb dn"><circle cx="' + (p[0] - w / 2 + 2) + '" cy="' + (p[1] - hgt / 2 + 2) + '" r="14"/><text x="' + (p[0] - w / 2 + 2) + '" y="' + (p[1] - hgt / 2 + 8) + '" text-anchor="middle">' + (i + 1) + "</text></g>" : "") + "</g>";
    }).join("");
    var circle = "M" + cx + " " + (cy - r) + " A" + r + " " + r + " 0 1 1 " + (cx - 0.01) + " " + (cy - r) + " Z";
    return '<svg class="g-loop' + (opts.mini ? " mini" : "") + '" viewBox="0 0 640 372" role="img" aria-label="Vòng kết quả khép kín của doanh nghiệp: vốn, đầu tư và sản xuất, doanh thu, kết quả, lợi nhuận giữ lại quay về vốn; tâm là lãi, lỗ.">' +
      '<defs><marker id="lh' + (opts.id || "") + '" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto"><path d="M0 0L10 5L0 10z" fill="#1c6fe0"/></marker></defs>' +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="ring"/>' + arcs +
      '<circle cx="' + cx + '" cy="' + cy + '" r="' + (opts.mini ? 64 : 52) + '" class="lcore"/><text x="' + cx + '" y="' + (cy + (opts.mini ? 11 : 7)) + '" text-anchor="middle" class="t-w ' + (opts.mini ? "big keep" : "big") + '">Lãi, lỗ</text>' +
      boxes +
      (opts.mini ? "" : '<text x="' + (pts[2][0] + 6) + '" y="' + (pts[2][1] + 52) + '" text-anchor="middle" class="t-s dn">DTT <tspan data-v="hp.dtt" data-d="1"></tspan> tỷ</text>' +
        '<text x="' + (pts[3][0] - 6) + '" y="' + (pts[3][1] + 52) + '" text-anchor="middle" class="t-s dn">LNST <tspan data-v="hp.lnst" data-d="1"></tspan> tỷ</text>') +
      [0, 0.8, 1.6].map(function (dl) {
        return '<circle r="5" class="dot dn" style="animation-delay:' + dl + 's"><animateMotion dur="3.2s" begin="indefinite" fill="remove" path="' + circle + '" data-delay="' + dl + '"/></circle>';
      }).join("") + "</svg>";
  }

  function heroGraphics() {
    var el = doc.getElementById("heroGraphics");
    if (!el) return;
    el.innerHTML =
      '<figure class="gpanel bq reveal"><figcaption>' + ic("i-pipe") + "<b>BQLDA · TT 195/2012</b><span>Dòng vốn một chiều: hạch toán <em>vốn</em></span></figcaption>" + pipeSVG({ id: "h" }) +
      '<p class="gnote">Số liệu BQLDA Đồng Bằng 2015 ' + chip("F02 tr.8 · B03 tr.4 · F03B tr.10") + "</p></figure>" +
      '<span class="vs-pill">so với</span>' +
      '<figure class="gpanel dn reveal"><figcaption>' + ic("i-loop") + "<b>Doanh nghiệp · TT 200/2014</b><span>Vòng kết quả khép kín: hạch toán <em>kết quả</em></span></figcaption>" + loopSVG({ id: "h" }) +
      '<p class="gnote">Số liệu Hòa Phát 2024 ' + chip("Hòa Phát, theo bài", "hp") + "</p></figure>";
  }

  function duoMini() {
    var el = doc.getElementById("duoMini");
    if (!el) return;
    el.innerHTML =
      '<article class="duo2 bq"><div class="duo2-art">' + pipeSVG({ mini: true, id: "m1" }) + '<p class="mini-chain bq">Chủ đầu tư → TK 336 → BQLDA → TK 241 → bàn giao · không xác định lãi, lỗ</p></div><div class="duo2-body"><span class="duo2-k">' + ic("i-pipe") + 'BQLDA ĐỒNG BẰNG · 2015</span><span class="duo2-v"><b class="cu" data-v="bq.b01.tongTS" data-d="3"></b><small>tỷ đồng tổng tài sản</small></span>' + chip("B01 tr.2") + "</div></article>" +
      '<article class="duo2 dn"><div class="duo2-art">' + loopSVG({ mini: true, id: "m1" }) + '<p class="mini-chain dn">Vốn → đầu tư, sản xuất → doanh thu → kết quả → LN giữ lại → vốn</p></div><div class="duo2-body"><span class="duo2-k">' + ic("i-loop") + 'TẬP ĐOÀN HÒA PHÁT · 2024</span><span class="duo2-v"><b class="cu" data-v="hp.tongTS" data-d="0"></b><small>tỷ đồng tổng tài sản</small></span>' + chip("Hòa Phát, theo bài", "hp") + "</div></article>";
  }

  /* ---------- Thành phần biểu đồ ---------- */

  // Thác nước ngang. steps: {lab, p, d, kind: start|up|down|total, calc, src, s(scale)}
  function waterfall(el, cfg) {
    var run = 0, rows = [], max = 0;
    cfg.steps.forEach(function (s) {
      var x = cfg.bq ? bqVal(s.p) : get(s.p);
      var from, to;
      if (s.kind === "start" || s.kind === "total") { from = 0; to = x; run = x; }
      else if (s.kind === "up") { from = run; to = run + x; run = to; }
      else { from = run; to = run - x; run = to; }
      max = Math.max(max, from, to);
      rows.push({ s: s, from: from, to: to });
    });
    var html = '<div class="wf' + (cfg.bq ? " bq" : " dn") + '" role="img" aria-label="' + cfg.aria + '">';
    rows.forEach(function (r) {
      var lo = Math.min(r.from, r.to), hi = Math.max(r.from, r.to);
      var sign = r.s.kind === "up" ? "+" : r.s.kind === "down" ? "−" : "";
      var val = sign + v(r.s.p, r.s.d, r.s.s);
      html += '<div class="wf-row k-' + r.s.kind + (r.s.calc ? " is-calc" : "") + '"><span class="wf-lab">' + r.s.lab + "</span>" +
        '<span class="wf-track"><span class="wf-bar"' + tip("<b>" + r.s.lab + "</b><br>" + val + " " + (cfg.unit || "tỷ đồng") + "<br>" + (r.s.calc ? calcChip() : chip(r.s.src || cfg.src)) ) +
        ' style="left:' + ((lo / max) * 100).toFixed(2) + "%;width:" + Math.max(0.5, ((hi - lo) / max) * 100).toFixed(2) + '%"></span></span>' +
        '<span class="wf-val">' + val + (r.s.calc ? ' <i class="calc-dot" title="' + CALC + '">*</i>' : "") + "</span></div>";
    });
    html += "</div>";
    el.innerHTML = (cfg.title ? '<p class="viz-title">' + cfg.title + "</p>" : "") + html +
      '<p class="viz-foot">' + (cfg.unit || "Tỷ đồng") + ". " + (cfg.note || "") + " " + chip(cfg.src, cfg.bq ? "" : "hp") + (rows.some(function (r) { return r.s.calc; }) ? " " + calcChip() + ' <span class="tiny muted">(dấu * là số tính)</span>' : "") + "</p>";
  }

  // Thanh xếp chồng ngang. segs: {lab, p, d, s, cls, calc, src}; total: tổng để tính bề rộng
  function stack(el, cfg) {
    var tot = cfg.total;
    var html = '<div class="stk-track" role="img" aria-label="' + cfg.aria + '">';
    cfg.segs.forEach(function (s) {
      var x = cfg.bq ? bqVal(s.p) : get(s.p);
      var w = (x / tot) * 100;
      html += '<span class="stk-seg ' + s.cls + (w < 12 ? " narrow" : "") + '" style="--w:' + w.toFixed(2) + '%"' +
        tip("<b>" + s.lab + "</b><br>" + v(s.p, s.d, s.s) + " " + (cfg.unit || "tỷ đồng") + (s.pct ? " · " + v(s.pct, 1) + "%" : "") + "<br>" + (s.calc ? calcChip() : chip(s.src || cfg.src))) +
        "><span>" + (s.pct ? v(s.pct, 1) + "%" : cfg.unit === "%" ? v(s.p, s.d) + "%" : "") + "</span></span>";
    });
    html += "</div><div class=\"stk-key\">" + cfg.segs.map(function (s) {
      return '<span><i class="' + s.cls + '"></i>' + s.lab + ": <b>" + v(s.p, s.d, s.s) + (cfg.unit === "%" ? "%" : "") + "</b>" + (s.pct ? " (" + v(s.pct, 1) + "%" + (s.calc || s.pctCalc ? "*" : "") + ")" : "") + "</span>";
    }).join("") + "</div>";
    el.innerHTML = (cfg.title ? '<p class="viz-title">' + cfg.title + "</p>" : "") + html;
  }

  // Treemap squarified. items: {lab, p, d, s, cls, note}
  function squarify(vals, x, y, w, h) {
    var out = [], rest = vals.slice();
    function worst(row, len) {
      var s = row.reduce(function (a, b) { return a + b.a; }, 0);
      var mx = Math.max.apply(null, row.map(function (r) { return r.a; })), mn = Math.min.apply(null, row.map(function (r) { return r.a; }));
      return Math.max((len * len * mx) / (s * s), (s * s) / (len * len * mn));
    }
    while (rest.length) {
      var len = Math.min(w, h), row = [rest[0]], i = 1;
      while (i < rest.length && worst(row.concat(rest[i]), len) <= worst(row, len)) { row.push(rest[i]); i++; }
      rest = rest.slice(row.length);
      var sum = row.reduce(function (a, b) { return a + b.a; }, 0);
      if (w >= h) {
        var cw = sum / h, cy = y;
        row.forEach(function (r) { var rh = r.a / cw; out.push({ it: r.it, x: x, y: cy, w: cw, h: rh }); cy += rh; });
        x += cw; w -= cw;
      } else {
        var ch = sum / w, cx = x;
        row.forEach(function (r) { var rw = r.a / ch; out.push({ it: r.it, x: cx, y: y, w: rw, h: ch }); cx += rw; });
        y += ch; h -= ch;
      }
    }
    return out;
  }
  function treemap(el, cfg) {
    var items = cfg.items.map(function (it) { return { it: it, val: cfg.bq ? bqVal(it.p) : get(it.p) }; }).filter(function (x) { return x.val > 0; });
    items.sort(function (a, b) { return b.val - a.val; });
    var tot = items.reduce(function (a, b) { return a + b.val; }, 0);
    var W = 100, H = 62;
    var rects = squarify(items.map(function (x) { return { a: (x.val / tot) * W * H, it: x.it }; }), 0, 0, W, H);
    var html = '<div class="tm" role="img" aria-label="' + cfg.aria + '" style="aspect-ratio:' + W + "/" + H + '">';
    rects.forEach(function (r) {
      var big = r.w * r.h > 380;
      html += '<div class="tm-cell ' + r.it.cls + (big ? "" : " small") + '" style="left:' + r.x + "%;top:" + (r.y / H) * 100 + "%;width:" + r.w + "%;height:" + (r.h / H) * 100 + '%"' +
        tip("<b>" + r.it.lab + "</b><br>" + v(r.it.p, r.it.d, r.it.s) + " " + (cfg.unit || "tỷ đồng") + (r.it.note ? "<br>" + r.it.note : "") + "<br>" + (r.it.calc ? calcChip() : chip(r.it.src || cfg.src))) + ">" +
        (big ? "<b>" + r.it.lab + "</b><span>" + v(r.it.p, r.it.d, r.it.s) + (r.it.calc ? "*" : "") + "</span>" + (r.it.note ? "<em>" + r.it.note + "</em>" : "") : "") + "</div>";
    });
    html += "</div>";
    var smalls = rects.filter(function (r) { return r.w * r.h <= 380; });
    el.innerHTML = (cfg.title ? '<p class="viz-title">' + cfg.title + "</p>" : "") + html +
      (smalls.length ? '<div class="stk-key">' + smalls.map(function (r) { return '<span><i class="' + r.it.cls + '"></i>' + r.it.lab + ": <b>" + v(r.it.p, r.it.d, r.it.s) + "</b>" + (r.it.calc ? "*" : "") + "</span>"; }).join("") + "</div>" : "") +
      '<p class="viz-foot">' + (cfg.unit || "Tỷ đồng") + ". " + chip(cfg.src, cfg.bq ? "" : "hp") + (cfg.items.some(function (i) { return i.calc; }) ? " " + calcChip() : "") + "</p>";
  }

  // Donut. segs: {lab, p, d, color}
  function donut(el, cfg) {
    var r = 70, c = 2 * Math.PI * r, off = 0;
    var tot = cfg.segs.reduce(function (a, s) { return a + get(s.p); }, 0);
    var svg = '<svg viewBox="0 0 200 200" role="img" aria-label="' + cfg.aria + '"><circle cx="100" cy="100" r="' + r + '" fill="none" stroke="#e8eef8" stroke-width="30"/>';
    cfg.segs.forEach(function (s) {
      var l = (get(s.p) / tot) * c;
      svg += '<circle cx="100" cy="100" r="' + r + '" fill="none" stroke="' + s.color + '" stroke-width="30" stroke-dasharray="' + Math.max(0, l - 2) + " " + c + '" stroke-dashoffset="' + -off + '" transform="rotate(-90 100 100)"' +
        tip("<b>" + s.lab + "</b><br>" + v(s.p, s.d) + "%<br>" + chip(cfg.src, cfg.hp ? "hp" : "")) + "/>";
      off += l;
    });
    svg += '<text x="100" y="94" text-anchor="middle" class="d-c1">' + cfg.center[0] + '</text><text x="100" y="124" text-anchor="middle" class="d-c2">' + cfg.center[1] + "</text></svg>";
    el.innerHTML = '<div class="dn2">' + svg + '<div class="stk-key col">' + cfg.segs.map(function (s) {
      return '<span><i style="background:' + s.color + '"></i>' + s.lab + ": <b>" + v(s.p, s.d) + "%</b></span>";
    }).join("") + "</div></div>";
  }

  // Sơ đồ dòng (Sankey đơn giản): nhiều nhánh → một đích, hoặc một nguồn → nhiều đích (dir: "in" | "out")
  function flow(el, cfg) {
    var H = cfg.height || 300, gap = 6;
    var vals = cfg.items.map(function (it) { return cfg.bq ? bqVal(it.p) : get(it.p); });
    var tot = vals.reduce(function (a, b) { return a + b; }, 0);
    var avail = H - gap * (vals.length - 1);
    var hs = vals.map(function (x) { return Math.max(46, (x / tot) * avail); });
    var k = avail / hs.reduce(function (a, b) { return a + b; }, 0);
    hs = hs.map(function (x) { return x * k; });
    var y = 0, segs = "", ribbons = "", ty = 0;
    var out = cfg.dir === "out";
    cfg.items.forEach(function (it, i) {
      var th = (vals[i] / tot) * H;
      segs += '<div class="fl-seg ' + (it.cls || "") + '" style="top:' + y + "px;height:" + hs[i] + 'px"' +
        tip("<b>" + it.lab + "</b><br>" + v(it.p, it.d, it.s) + " tỷ đồng" + (it.pct ? " · " + v(it.pct, 1) + "%" : "") + "<br>" + (it.calc ? calcChip() : chip(it.src || cfg.src))) + "><b>" + it.lab + "</b><span>" + v(it.p, it.d, it.s) + (it.pct ? " · " + v(it.pct, 1) + "%" + (cfg.pctCalc ? "*" : "") : "") + "</span></div>";
      var y1 = y, y2 = y + hs[i], t1 = ty, t2 = ty + th;
      var a = out ? [100, t1, t2, 0, y1, y2] : [0, y1, y2, 100, t1, t2];
      ribbons += '<path class="rib ' + (it.cls || "") + '" d="M' + a[0] + " " + a[1] + " C50 " + a[1] + " 50 " + a[4] + " " + a[3] + " " + a[4] + " L" + a[3] + " " + a[5] + " C50 " + a[5] + " 50 " + a[2] + " " + a[0] + " " + a[2] + 'Z"/>';
      y += hs[i] + gap;
      ty += th;
    });
    var target = '<div class="fl-target ' + (cfg.side || "") + '" style="height:' + H + 'px"><b>' + cfg.target[0] + "</b><span>" + cfg.target[1] + "</span></div>";
    var left = out ? target : '<div class="fl-col" style="height:' + H + 'px">' + segs + "</div>";
    var right = out ? '<div class="fl-col" style="height:' + H + 'px">' + segs + "</div>" : target;
    el.innerHTML = (cfg.title ? '<p class="viz-title">' + cfg.title + "</p>" : "") +
      '<div class="fl ' + (cfg.side || "") + '" role="img" aria-label="' + cfg.aria + '">' + left + '<svg class="fl-mid" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none" style="height:' + H + 'px">' + ribbons + "</svg>" + right + "</div>" +
      (cfg.foot ? '<p class="viz-foot">' + cfg.foot + "</p>" : "");
  }

  /* ---------- Hình theo tiểu mục ---------- */
  var V = {};
  function put(key, html) {
    var el = doc.querySelector('[data-viz="' + key + '"]');
    if (el) el.innerHTML = html;
    return el;
  }
  function splitWrap(l, r, heads) {
    heads = heads || ["BQLDA · TT 195/2012 · Đồng Bằng 2015", "Doanh nghiệp · TT 200/2014 · Hòa Phát 2024"];
    return '<div class="vsplit"><div class="split-head"><span class="bq">' + ic("i-pipe") + heads[0] + '</span><span class="vs">so với</span><span class="dn">' + ic("i-loop") + heads[1] + '</span></div><div class="vsplit-body"><div class="vs-l">' + l + '</div><div class="vs-r">' + r + "</div></div></div>";
  }

  // 1.1.1: năm đặc điểm → hệ quả
  V["1-1-1"] = function () {
    var rows = [
      ["i-target2", "Có mục tiêu rõ ràng", "Tạo ra một công trình, sản phẩm hoặc dịch vụ cụ thể.", "Tập hợp chi phí theo từng dự án để đối chiếu với mục tiêu và tổng mức đầu tư."],
      ["i-calendar", "Có thời hạn xác định", "Có điểm bắt đầu và kết thúc, thường kéo dài nhiều năm.", "Theo dõi lũy kế từ khởi công đến khi hoàn thành, không chỉ theo từng năm tài chính."],
      ["i-unique", "Mang tính duy nhất", "Khác nhau về quy mô, địa điểm, thiết kế.", "Mở sổ chi tiết riêng theo dự án, công trình, hạng mục công trình."],
      ["i-wallet", "Nguồn lực giới hạn", "Vốn, nhân lực, thời gian bị ràng buộc bởi kế hoạch được duyệt.", "Kiểm soát chi theo dự toán, kế hoạch vốn và hợp đồng."],
      ["i-alert", "Có tính bất định, rủi ro", "Giá cả, tiến độ, điều kiện thi công có thể thay đổi.", "Theo dõi điều chỉnh dự toán, chi phí phát sinh, thiệt hại và khoản không được duyệt quyết toán."]
    ];
    put("1-1-1", '<p class="viz-title">Mỗi đặc điểm của dự án kéo theo một yêu cầu kế toán (Bảng 1.1)</p><div class="feat">' + rows.map(function (r) {
      return '<div class="feat-row"><div class="feat-a">' + ic(r[0]) + "<b>" + r[1] + "</b><span>" + r[2] + '</span></div><span class="feat-arrow">' + ic("i-arrow-r") + '</span><div class="feat-b"><span class="tagc t-co">Hệ quả kế toán</span>' + r[3] + "</div></div>";
    }).join("") + "</div>");
  };

  // 1.1.2: sơ đồ nan hoa
  V["1-1-2"] = function () {
    var spokes = [
      ["Theo nguồn vốn", "Vốn ngân sách nhà nước (đầu tư công); vốn ODA, vay ưu đãi; vốn tín dụng nhà nước; vốn doanh nghiệp; vốn tư nhân; vốn hỗn hợp.", "Quyết định cơ chế cấp vốn, thanh toán, kiểm soát chi và hình thức quyết toán."],
      ["Theo quy mô, tính chất", "Dự án quan trọng quốc gia; dự án nhóm A, B, C.", "Quyết định cấp phê duyệt, mức độ thẩm định và yêu cầu báo cáo."],
      ["Theo lĩnh vực", "Dân dụng, công nghiệp, giao thông, nông nghiệp – thủy lợi, công nghệ thông tin…", "Quyết định cơ cấu chi phí (thiết bị, đền bù, tái định cư…)."],
      ["Theo tính chất đầu tư", "Đầu tư mới, mở rộng, cải tạo – nâng cấp.", "Ảnh hưởng đến việc xác định giá trị tài sản hình thành qua đầu tư."],
      ["Theo chủ thể quản lý", "Chủ đầu tư trực tiếp quản lý; BQLDA chuyên ngành, khu vực; thuê tư vấn quản lý dự án.", "Quyết định đơn vị nào tổ chức kế toán và áp dụng chế độ kế toán nào."]
    ];
    var html = '<p class="viz-title">Năm tiêu thức phân loại dự án; “chủ thể quản lý” là cơ sở chọn chế độ kế toán (Bảng 1.2)</p><div class="spoke"><div class="spoke-wheel">' +
      '<div class="spoke-hub">Dự án</div>' + spokes.map(function (s, i) {
        return '<button type="button" class="spoke-n' + (i === 4 ? " key" : "") + '" style="--i:' + i + '" data-spoke="' + i + '" aria-pressed="' + (i === 4) + '">' + s[0] + (i === 4 ? "<em>cơ sở chọn chế độ kế toán</em>" : "") + "</button>";
      }).join("") + '</div><div class="spoke-info" aria-live="polite">' + spokes.map(function (s, i) {
        return '<div class="spoke-p" data-spoke-p="' + i + '"' + (i === 4 ? "" : " hidden") + '><b>' + s[0] + '</b><p><span class="tagc t-co">Các loại</span> ' + s[1] + '</p><p><span class="tagc t-ts">Ý nghĩa với kế toán</span> ' + s[2] + "</p></div>";
      }).join("") + "</div></div>";
    put("1-1-2", html);
  };

  // 1.1.3: hai làn bơi
  V["1-1-3"] = function () {
    var g = [["GIAI ĐOẠN 1", "Chuẩn bị đầu tư"], ["GIAI ĐOẠN 2", "Thực hiện đầu tư"], ["GIAI ĐOẠN 3", "Kết thúc xây dựng, đưa vào khai thác"]];
    var ql = [["Nghiên cứu sự cần thiết và quy mô đầu tư", "Lập báo cáo nghiên cứu tiền khả thi, khả thi", "Thẩm định, phê duyệt chủ trương và quyết định đầu tư"], ["Giải phóng mặt bằng, lựa chọn nhà thầu, ký hợp đồng", "Thi công xây lắp, mua sắm và lắp đặt thiết bị", "Giám sát, nghiệm thu khối lượng từng giai đoạn"], ["Nghiệm thu, bàn giao công trình", "Chạy thử, vận hành thử, bảo hành", "Đưa dự án vào khai thác, sử dụng"]];
    var kt = [["Mở sổ chi tiết theo dõi chi phí chuẩn bị đầu tư", "Theo dõi dự toán, kế hoạch vốn được giao", "Lập chứng từ, hồ sơ ban đầu theo từng dự án"], ["Tiếp nhận, quản lý và thanh toán vốn đầu tư", "Hạch toán chi phí xây lắp, thiết bị, tư vấn, quản lý dự án", "Theo dõi tạm ứng, thanh toán với nhà thầu"], ["Lập báo cáo quyết toán vốn đầu tư dự án hoàn thành", "Xác định giá trị tài sản hình thành, bàn giao", "Lập báo cáo tài chính, lưu trữ hồ sơ"]];
    var note = ["Phát sinh ít nghiệp vụ nhưng quyết định tính hợp lệ của hồ sơ", "Nhiều nghiệp vụ nhất, trọng tâm hạch toán", "Kết thúc bằng quyết toán, bàn giao"];
    var html = '<p class="viz-title">Hình 1.1. Ở mỗi giai đoạn, công việc quản lý dự án luôn đi kèm một nhiệm vụ kế toán</p><div class="swim"><div class="swim-h"></div>' +
      g.map(function (x, i) { return '<div class="swim-h st' + i + (i === 1 ? " hot" : "") + '"><small>' + x[0] + "</small><b>" + x[1] + "</b></div>"; }).join("") +
      '<div class="swim-lab">Công việc quản lý dự án</div>' + ql.map(function (l, i) { return '<ul class="swim-c' + (i === 1 ? " hot" : "") + '">' + l.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }).join("") +
      '<div class="swim-lab acc">Nhiệm vụ của kế toán dự án</div>' + kt.map(function (l, i) { return '<ul class="swim-c acc' + (i === 1 ? " hot" : "") + '">' + l.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }).join("") +
      '<div class="swim-lab"></div>' + note.map(function (n, i) { return '<div class="swim-note' + (i === 1 ? " hot" : "") + '">' + (i === 1 ? ic("i-alert") : "") + n + "</div>"; }).join("") + "</div>";
    put("1-1-3", html);
  };

  // 1.1.4: bảy nhiệm vụ thành cụm, năm yêu cầu thành chip
  V["1-1-4"] = function () {
    var tasks = [["i-book", "Tổ chức sổ", "Chứng từ, tài khoản, sổ chi tiết theo dự án, công trình, hạng mục"], ["i-pipe", "Phản ánh vốn", "Vốn nhận được (cả lũy kế từ khởi công) và việc sử dụng vốn"], ["i-layers", "Tập hợp chi phí", "Theo 6 nội dung: xây dựng, thiết bị, bồi thường – hỗ trợ – tái định cư, quản lý dự án, tư vấn, khác"], ["i-check", "Kiểm tra, giám sát", "Dự toán, định mức, hợp đồng, chế độ thanh toán; phát hiện chi sai, chi vượt"], ["i-users", "Công nợ", "Thanh toán với nhà thầu, nhà cung cấp, đơn vị nội bộ"], ["i-file", "Lập báo cáo", "BCTC, báo cáo quyết toán; xác định giá trị tài sản bàn giao"], ["i-share", "Cung cấp thông tin", "Chủ đầu tư, cơ quan cấp vốn, tổ chức tài trợ, cho vay, cơ quan quản lý"]];
    var req = ["Trung thực, đầy đủ, chính xác", "Kịp thời", "Rõ ràng, dễ hiểu, so sánh được", "Chi tiết theo dự án, nguồn vốn, nội dung chi phí", "Tuân thủ chế độ"];
    put("1-1-4", '<p class="viz-title">Bảy nhiệm vụ, năm yêu cầu của kế toán dự án</p><div class="tasks">' + tasks.map(function (x, i) {
      return '<div class="task"><span class="task-n">' + (i + 1) + "</span>" + ic(x[0]) + "<b>" + x[1] + "</b><span>" + x[2] + "</span></div>";
    }).join("") + '</div><div class="reqs">' + req.map(function (r) { return '<span class="req">' + ic("i-check") + r + "</span>"; }).join("") + "</div>");
  };

  // 1.2.2 / 1.2.3: cây tài khoản và bộ báo cáo
  function tree195() {
    return '<div class="atree bq"><p class="atree-h">' + ic("i-pipe") + 'Hệ thống tài khoản TT 195 (Phụ lục 1a)</p><ul>' +
      '<li><b>TK 241</b><span class="ren">→ “Chi phí đầu tư xây dựng”</span></li>' +
      '<li><b>TK 154</b><span class="ren">→ “Chi phí sản xuất thử dở dang”</span></li>' +
      '<li><b>TK 642</b><span class="ren">→ “Chi phí Ban quản lý dự án đầu tư”</span></li>' +
      '<li><b>TK 336</b> “Phải trả nội bộ” <span class="ren">thêm 4 TK cấp 2</span><ul><li>3361 Vốn đầu tư xây dựng</li><li>3362 Chênh lệch tỷ giá</li><li>3363 Chi phí đi vay đủ điều kiện vốn hóa</li><li>3368 Phải trả nội bộ khác</li></ul></li></ul>' +
      '<p class="atree-h">Bộ báo cáo</p><div class="rbox"><span class="r main">B01</span><span class="r main">B02</span><span class="r main">B03</span><span class="r main">B04</span><span class="r">F02</span><span class="r">F03A</span><span class="r">F03B</span><span class="r">F03C</span><span class="r">F03D</span></div>' +
      '<p class="tiny muted">-CĐT · 4 biểu chính + 5 phụ biểu · nộp quý <span data-v="thoiHan.bq.quy" data-d="0"></span>, năm <span data-v="thoiHan.bq.nam" data-d="0"></span> ngày</p></div>';
  }
  function tree200() {
    return '<div class="atree dn"><p class="atree-h">' + ic("i-loop") + 'Hệ thống tài khoản TT 200</p><ul>' +
      '<li><b>Loại 1–9</b> trong bảng, <b>loại 0</b> ngoài bảng</li>' +
      '<li><b>TK 241</b><span class="ren">“Xây dựng cơ bản dở dang”</span><ul><li>2411 · 2412 · 2413</li></ul></li>' +
      '<li><b>TK 411, 421</b> vốn chủ sở hữu, lợi nhuận</li>' +
      '<li><b>TK 511, 632, 641, 642</b> doanh thu, chi phí</li>' +
      '<li><b>TK 911</b> xác định kết quả</li></ul>' +
      '<p class="atree-h">Bộ báo cáo</p><div class="rbox"><span class="r main dn">B01</span><span class="r main dn">B02</span><span class="r main dn">B03</span><span class="r main dn">B09</span><span class="r dn">Giữa niên độ</span></div>' +
      '<p class="tiny muted">-DN · B02 là kết quả kinh doanh, B03 là lưu chuyển tiền tệ · nộp quý <span data-v="thoiHan.dn.quy" data-d="0"></span>, năm <span data-v="thoiHan.dn.nam" data-d="0"></span> ngày</p></div>';
  }
  V["1-2-2"] = function () { put("1-2-2", '<p class="viz-title">TT 195 đổi tên, bổ sung tài khoản cho hoạt động đầu tư</p>' + tree195()); };
  V["1-2-3"] = function () {
    put("1-2-3", '<p class="viz-title">Đặt song song: cây tài khoản và bộ báo cáo của hai chế độ</p>' + splitWrap(tree195(), tree200(), ["BQLDA · TT 195/2012", "Doanh nghiệp · TT 200/2014"]));
  };

  // 1.2.4: cây quyết định
  V["1-2-4"] = function () {
    var m = [
      ["A", "Ban quản lý dự án có tổ chức kế toán riêng", "bq", ["Áp dụng TT 195/2012/TT-BTC", "Hệ thống tài khoản theo Phụ lục 1a (đã sửa đổi, bổ sung)", "BCTC đặc thù: B01 – B04/CĐT và các phụ biểu"]],
      ["B", "Chủ đầu tư có thành lập Ban quản lý dự án", "dn", ["Áp dụng chế độ kế toán doanh nghiệp (TT 200/2014)", "Bổ sung TK cấp 2 của TK 136 (1362, 1363) theo TT 195", "Nhận, tổng hợp BCTC của BQLDA"]],
      ["C", "Chủ đầu tư không thành lập BQLDA", "dn", ["Hạch toán chung hệ thống sổ của doanh nghiệp (TT 200/2014, TK 241)", "Mở sổ chi tiết theo dự án", "Lập thêm B02, B03/CĐT và 4 phụ biểu"]]
    ];
    put("1-2-4", '<p class="viz-title">Hình 1.2. Bấm vào một mô hình để xem chế độ kế toán, tài khoản và báo cáo tương ứng</p><div class="dtree"><div class="dtree-root">Đơn vị thực hiện dự án đầu tư (doanh nghiệp / chủ đầu tư)</div><div class="dtree-q">Có thành lập BQLDA và tổ chức bộ máy kế toán riêng không?</div><div class="dtree-opts">' +
      m.map(function (x, i) {
        return '<button type="button" class="dtree-o ' + x[2] + '" data-model="' + i + '" aria-pressed="' + (i === 0) + '"><b>' + x[0] + "</b>" + x[1] + "</button>";
      }).join("") + '</div><div class="dtree-res" aria-live="polite">' + m.map(function (x, i) {
        return '<div class="dtree-r ' + x[2] + '" data-model-r="' + i + '"' + (i === 0 ? "" : " hidden") + '><span class="tagc ' + (x[2] === "bq" ? "t-bq" : "t-dn") + '">' + ic(x[2] === "bq" ? "i-pipe" : "i-loop") + (x[2] === "bq" ? "Chế độ BQLDA" : "Chế độ doanh nghiệp") + "</span><ul class=\"ticks" + (x[2] === "dn" ? " dn" : "") + '">' + x[3].map(function (y) { return "<li>" + y + "</li>"; }).join("") + "</ul></div>";
      }).join("") + '</div><div class="dtree-foot">Nội dung chưa được hướng dẫn riêng → thực hiện theo Luật Kế toán và chế độ kế toán doanh nghiệp hiện hành (TT 200/2014)</div></div>');
  };

  // 1.3.1: cùng gốc
  V["1-3-1"] = function () {
    put("1-3-1", '<p class="viz-title">Hai chế độ cùng một gốc; khác biệt nằm ở phần sửa đổi, bổ sung cho hoạt động đầu tư</p><div class="root3"><div class="root3-top">Chế độ kế toán doanh nghiệp<br><small>(khi TT 195 ban hành: Quyết định 15/2006/QĐ-BTC)</small></div><div class="root3-arms"><div class="arm bq">' + ic("i-pipe") + "<b>(i) Kế toán BQLDA, TT 195/2012</b><span>Phần cho chủ đầu tư là doanh nghiệp và BQLDA của doanh nghiệp. Sửa đổi, bổ sung: mục đích, tài khoản đặc thù, nghiệp vụ, báo cáo.</span></div>" +
      '<div class="arm dn">' + ic("i-loop") + "<b>(ii) Kế toán doanh nghiệp, TT 200/2014</b><span>Nguyên tắc kế toán cơ bản giữ chung.</span></div></div><div class=\"root3-out\">" + ic("i-x") + " Ngoài phạm vi: BQLDA thuộc đơn vị hành chính sự nghiệp, thuế, kiểm toán</div></div>");
  };

  // 1.3.2: Hình 1.3 bằng hai đồ họa có đánh số bước
  V["1-3-2-flow"] = function () {
    put("1-3-2-flow", '<p class="viz-title">Hình 1.3. Năm bước hạch toán: BQLDA đi một chiều tới quyết toán, doanh nghiệp quay vòng tới lãi, lỗ</p>' +
      splitWrap(pipeSVG({ steps: true, id: "s" }), loopSVG({ steps: true, id: "s" }), ["BQLDA · TT 195/2012", "Doanh nghiệp · TT 200/2014"]));
  };

  // 1.3.2: Bảng 1.5 dạng chữ T động
  V["1-3-2-t"] = function () {
    var steps = ["1. Nhận nguồn vốn 2.000", "2. Nghiệm thu xây lắp 1.000", "3. Lương quản lý 50", "4. Hoàn thành, bàn giao"];
    function side(k) {
      var tks = D.tAcc[k].tk;
      return '<div class="tgrid">' + tks.map(function (tk) {
        return '<div class="tacc" data-tk="' + tk + '"><b>TK ' + tk + '</b><div class="tacc-t"><span class="no"></span><span class="co"></span></div></div>';
      }).join("") + "</div>";
    }
    put("1-3-2-t", '<p class="viz-title">Bảng 1.5 dạng chữ T: kéo thanh để chạy bốn nghiệp vụ, xem số dư lũy kế từng tài khoản (triệu đồng)</p>' +
      '<div class="tctl"><input type="range" min="1" max="4" step="1" value="1" id="tRange" aria-label="Chọn bước nghiệp vụ"><div class="tsteps">' + steps.map(function (s, i) { return '<button type="button" data-tstep="' + (i + 1) + '">' + s + "</button>"; }).join("") + "</div></div>" +
      splitWrap(side("bq"), side("dn"), ["BQLDA · TT 195/2012", "Doanh nghiệp · TT 200/2014"]) +
      '<div class="tres"><div class="tres-b bq">' + ic("i-pipe") + '<b>Lãi, lỗ: không xác định</b><span>Bước 4 ghi Nợ 336 / Có 241: <span data-v="viDu.banGiaoBq" data-d="0"></span> được “giải phóng” khỏi nguồn vốn.</span></div>' +
      '<div class="tres-b dn">' + ic("i-loop") + '<b>Lãi, lỗ: chi phí <span data-v="viDu.chiPhiKy" data-d="0"></span> vào kết quả kỳ</b><span>TK 642 dư Nợ <span data-v="viDu.chiPhiKy" data-d="0"></span>, kết chuyển vào TK 911; TK 211 nhận <span data-v="viDu.banGiaoDn" data-d="0"></span>.</span></div></div>' +
      '<p class="viz-foot">Số dư cộng dồn từ các bút toán trong Bảng 1.5 của bài. ' + calcChip() + "</p>");
  };

  /* ---------- Chương 2 ---------- */
  V["2-1-1"] = function () {
    var dauY = get("bq.info.namBatDau"), cuoiY = get("bq.info.namKetThuc");
    var pos = function (y, m) { return (((y - dauY) * 12 + m) / ((cuoiY - dauY + 1) * 12)) * 100; };
    put("2-1-1", '<p class="viz-title">Hồ sơ đơn vị: dự án 2013–2016, đến cuối 2015 đã thực hiện 61,3% tổng mức</p><div class="prof">' +
      '<div class="prof-time"><p class="prof-h">Thời gian thực hiện ' + chip("B04 I.3 tr.5") + '</p><div class="ptl"><span class="ptl-bar"></span>' +
      [dauY, dauY + 1, dauY + 2, cuoiY].map(function (y) { return '<span class="ptl-y" style="left:' + pos(y, 0) + '%">' + y + "</span>"; }).join("") +
      '<span class="ptl-m a" style="left:' + pos(2013, 2) + '%"' + tip("<b>Thành lập Ban</b><br>QĐ " + t("bq.info.quyetDinh") + " ngày " + t("bq.info.ngayThanhLap") + "<br>" + chip("B04 I.1 tr.5")) + "><i></i>Thành lập<br>" + t("bq.info.ngayThanhLap") + "</span>" +
      '<span class="ptl-m b" style="left:' + pos(2015, 10) + '%"' + tip("<b>Bàn giao nhà bảo vệ, hàng rào, cổng</b><br>" + t("bq.f03b.ngayBanGiao") + "<br>" + chip("F03B tr.10")) + "><i></i>Bàn giao<br>" + t("bq.f03b.ngayBanGiao") + "</span>" +
      '<span class="ptl-m c" style="left:' + pos(2015, 12) + '%"><i></i>Kỳ báo cáo<br>31/12/2015</span></div></div>' +
      '<div class="prof-ring"' + tip("<b>Lũy kế vốn đầu tư thực hiện</b><br>" + v("bq.b03.luyKe", 2) + " / " + v("bq.b03.tongMuc", 0) + " tỷ đồng<br>" + chip("B03 mã 20–22 tr.4")) + '><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" class="rg-bg"/><circle cx="60" cy="60" r="48" class="rg-fg" style="--p:' + get("bq.b03.tyLe") + '"/></svg><b><span data-v="bq.b03.tyLe" data-d="1"></span>%</b><span>' + v("bq.b03.luyKe", 2) + " / " + v("bq.b03.tongMuc", 0) + " tỷ</span>" + chip("B03 tr.4") + "</div>" +
      '<div class="prof-staff"><p class="prof-h">Nhân sự bình quân ' + chip("B04 I.4 tr.5") + '</p><div class="pst"><span>2014</span><span class="pst-bar"><i style="--w:' + (get("bq.info.nhanSu2014") / get("bq.info.nhanSu2015")) * 100 + '%"></i></span><b>' + v("bq.info.nhanSu2014", 0) + ' người</b></div><div class="pst"><span>2015</span><span class="pst-bar"><i style="--w:100%"></i></span><b>' + v("bq.info.nhanSu2015", 0) + " người</b></div></div></div>" +
      '<p class="viz-title" style="margin-top:var(--s-5)">Hai đơn vị, hai mô hình</p><div class="duo2-row" id="duoMini"></div>');
    duoMini();
  };

  V["2-1-2"] = function () {
    function col(side, title, segs, aria) {
      return '<div class="c100"><p class="c100-h">' + title + '</p><div class="c100-bar" role="img" aria-label="' + aria + '">' + segs.map(function (s) {
        return '<span class="c100-s ' + s.cls + (get(s.pct) < 12 ? " thin" : "") + '" data-abs="' + s.abs + '" style="--h:' + get(s.pct) + '%"' + tip("<b>" + s.lab + "</b><br>" + v(s.p, s.d) + " tỷ đồng · " + v(s.pct, 1) + "%<br>" + chip(side === "bq" ? "B01 tr.2" : "Hòa Phát, theo bài", side === "bq" ? "" : "hp")) + "><b>" + v(s.pct, 1) + "%</b><small>" + s.lab + "</small></span>";
      }).join("") + '</div><p class="c100-foot">' + segs.filter(function (s) { return get(s.pct) < 12; }).map(function (s) { return s.lab + " " + v(s.pct, 1) + "%"; }).join("") + "</p></div>";
    }
    var tB = get("bq.b01.tongTS") / 1e9, tH = get("hp.tongTS");
    var l = '<div class="c100-pair" data-side="bq">' +
      col("bq", "Tài sản", [{ lab: "Ngắn hạn", p: "bq.b01.tsnh", d: 3, pct: "bq.b01.pct.tsnh", cls: "t3", abs: get("bq.b01.tsnh") / 1e9 }, { lab: "Dài hạn", p: "bq.b01.tsdh", d: 3, pct: "bq.b01.pct.tsdh", cls: "t1", abs: get("bq.b01.tsdh") / 1e9 }], "BQLDA: tài sản ngắn hạn 6,0%, dài hạn 94,0%") +
      col("bq", "Nguồn vốn", [{ lab: "Nợ phải trả", p: "bq.b01.no", d: 3, pct: "bq.b01.pct.no", cls: "t3", abs: get("bq.b01.no") / 1e9 }, { lab: "Nguồn vốn đầu tư", p: "bq.b01.nvdt", d: 3, pct: "bq.b01.pct.nvdt", cls: "t1", abs: get("bq.b01.nvdt") / 1e9 }], "BQLDA: nợ 5,4%, nguồn vốn đầu tư 94,6%") +
      '<div class="dn-mini" data-viz-donut="bq"></div></div>';
    var r = '<div class="c100-pair" data-side="dn">' +
      col("dn", "Tài sản", [{ lab: "Ngắn hạn", p: "hp.tsnh", d: 0, pct: "hp.pct.tsnh", cls: "d3", abs: get("hp.tsnh") }, { lab: "Dài hạn", p: "hp.tsdh", d: 0, pct: "hp.pct.tsdh", cls: "d1", abs: get("hp.tsdh") }], "Hòa Phát: tài sản ngắn hạn 38,6%, dài hạn 61,4%") +
      col("dn", "Nguồn vốn", [{ lab: "Nợ phải trả", p: "hp.no", d: 0, pct: "hp.pct.no", cls: "d3", abs: get("hp.no") }, { lab: "Vốn chủ sở hữu", p: "hp.vcsh", d: 0, pct: "hp.pct.vcsh", cls: "d1", abs: get("hp.vcsh") }], "Hòa Phát: nợ 48,9%, vốn chủ sở hữu 51,1%") +
      '<div class="dn-mini" data-viz-donut="dn"></div></div>';
    put("2-1-2", '<div class="viz-bar"><p class="viz-title">Bảng 2.2 trực quan: BQLDA gần như toàn bộ là TK 241 và vốn được giao; Hòa Phát cân bằng hơn</p><div class="seg" role="group" aria-label="Thang đo" data-scale-toggle><button type="button" data-scale="pct" aria-pressed="true">Tỷ trọng</button><button type="button" data-scale="abs" aria-pressed="false">Tuyệt đối</button></div></div>' +
      splitWrap(l, r) + '<p class="viz-foot" data-abs-note hidden>Thang tuyệt đối dùng chung cho hai bên (tối đa ' + v("hp.tongTS", 0) + ' tỷ): cột BQLDA gần như không thấy vì quy mô chỉ bằng khoảng một phần nghìn.</p>');
    donut(doc.querySelector('[data-viz-donut="bq"]'), { aria: "BQLDA nguồn vốn: nợ 5,4%, nguồn vốn đầu tư 94,6%", src: "B01 tr.2", center: ["Nguồn vốn", "BQLDA"], segs: [{ lab: "Nguồn vốn đầu tư", p: "bq.b01.pct.nvdt", d: 1, color: "#0d3b84" }, { lab: "Nợ phải trả", p: "bq.b01.pct.no", d: 1, color: "#9db6dd" }] });
    donut(doc.querySelector('[data-viz-donut="dn"]'), { aria: "Hòa Phát nguồn vốn: nợ 48,9%, vốn chủ sở hữu 51,1%", src: "Hòa Phát, theo bài", hp: true, center: ["Nguồn vốn", "Hòa Phát"], segs: [{ lab: "Vốn chủ sở hữu", p: "hp.pct.vcsh", d: 1, color: "#1c6fe0" }, { lab: "Nợ phải trả", p: "hp.pct.no", d: 1, color: "#a9c9f5" }] });
    var maxAbs = tH;
    var tg = doc.querySelector("[data-scale-toggle]");
    tg.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var abs = b.getAttribute("data-scale") === "abs";
      tg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      doc.querySelectorAll(".c100-s").forEach(function (s) {
        s.style.setProperty("--h", abs ? (parseFloat(s.getAttribute("data-abs")) / maxAbs) * 100 + "%" : s.getAttribute("data-pct-h"));
      });
      doc.querySelector("[data-abs-note]").hidden = !abs;
    });
    doc.querySelectorAll(".c100-s").forEach(function (s) { s.setAttribute("data-pct-h", s.style.getPropertyValue("--h")); });
  };

  V["2-2-1"] = function () {
    var l = '<div data-tm="bq"></div>', r = '<div data-tm="dn"></div>';
    put("2-2-1", '<p class="viz-title">Cơ cấu tài sản: BQLDA gần như chỉ một ô TK 241; Hòa Phát chia thành nhiều ô</p>' + splitWrap(l, r));
    treemap(doc.querySelector('[data-tm="bq"]'), { bq: true, src: "B01 tr.2", aria: "Treemap tài sản BQLDA: TK 241 chiếm 93,6%", items: [
      { lab: "TK 241 chi phí đầu tư XD dở dang", p: "bq.b01.tk241", d: 3, cls: "t1", note: v("bq.b01.pct.tk241", 1) + "% tổng tài sản" },
      { lab: "Tiền", p: "bq.b01.tien", d: 3, cls: "t2" }, { lab: "Trả trước người bán", p: "bq.b01.traTruoc", d: 3, cls: "t2" },
      { lab: "Thuế GTGT được khấu trừ", p: "bq.b01.gtgt", d: 3, cls: "t3" }, { lab: "Hàng tồn kho", p: "bq.b01.htk", d: 3, cls: "t3" },
      { lab: "TSCĐ hữu hình", p: "bq.b01.tscd", d: 3, cls: "t3" }, { lab: "Phải thu khác", p: "bq.b01.phaiThuKhac", d: 3, cls: "t3" }] });
    treemap(doc.querySelector('[data-tm="dn"]'), { src: "Hòa Phát, theo bài", aria: "Treemap tài sản Hòa Phát: TSCĐ hữu hình, XDCB dở dang, hàng tồn kho, đầu tư tài chính, tiền, phải thu khách hàng và phần còn lại", items: [
      { lab: "TSCĐ hữu hình", p: "hp.tscdhh", d: 1, cls: "d1", note: v("hp.pct.tscd", 1) + "%" }, { lab: "XDCB dở dang", p: "hp.xdcb", d: 1, cls: "d2", note: v("hp.pct.xdcb", 1) + "%" },
      { lab: "Hàng tồn kho", p: "hp.htk", d: 1, cls: "d2", note: v("hp.pct.htk", 1) + "%" }, { lab: "Đầu tư tài chính NH", p: "hp.dauTuTC", d: 1, cls: "d3" },
      { lab: "Tiền", p: "hp.tien", d: 1, cls: "d3" }, { lab: "Phải thu khách hàng", p: "hp.phaiThuKH", d: 1, cls: "d3" },
      { lab: "Còn lại (tính)", p: "calc.hpTsConLai", d: 1, cls: "d4", calc: true }] });
  };

  V["2-2-2"] = function () {
    put("2-2-2", '<p class="viz-title">Tài sản ngắn hạn: BQLDA giữ tiền, tạm ứng, vật tư cho một dự án; Hòa Phát giữ tài sản lưu động cho chuỗi sản xuất</p>' + splitWrap('<div data-stk="bq"></div>', '<div data-stk="dn"></div>'));
    stack(doc.querySelector('[data-stk="bq"]'), { bq: true, total: get("bq.b01.tsnh") / 1e9, src: "B01 tr.2", title: "BQLDA: " + v("bq.b01.tsnh", 3) + " tỷ", aria: "Cơ cấu tài sản ngắn hạn BQLDA", segs: [
      { lab: "Tiền", p: "bq.b01.tien", d: 3, pct: "calc.bqTsnhTienPct", cls: "t1", pctCalc: true },
      { lab: "Phải thu (trả trước 3,2 + khác 0,347)", p: "calc.bqTsnhPhaiThu", d: 3, s: "ty", pct: "calc.bqTsnhPhaiThuPct", cls: "t2", pctCalc: true, src: "B01 mã 130" },
      { lab: "Thuế GTGT được khấu trừ", p: "bq.b01.gtgt", d: 3, pct: "calc.bqTsnhGtgtPct", cls: "t4", pctCalc: true },
      { lab: "Hàng tồn kho", p: "bq.b01.htk", d: 3, pct: "calc.bqTsnhHtkPct", cls: "t3", pctCalc: true }] });
    stack(doc.querySelector('[data-stk="dn"]'), { total: get("hp.tsnh"), src: "Hòa Phát, theo bài", title: "Hòa Phát: " + v("hp.tsnh", 0) + " tỷ", aria: "Cơ cấu tài sản ngắn hạn Hòa Phát", segs: [
      { lab: "Hàng tồn kho", p: "hp.htk", d: 1, cls: "d1" }, { lab: "Đầu tư tài chính", p: "hp.dauTuTC", d: 1, cls: "d2" },
      { lab: "Tiền", p: "hp.tien", d: 1, cls: "d3" }, { lab: "Phải thu khách hàng", p: "hp.phaiThuKH", d: 1, cls: "d5" },
      { lab: "Còn lại (tính)", p: "calc.hpTsnhConLai", d: 1, cls: "d4", calc: true }] });
    doc.querySelector('[data-stk="bq"]').insertAdjacentHTML("beforeend", '<p class="viz-foot">Tỷ lệ % là số tính trên tổng TSNH ' + calcChip() + "</p>");
  };

  V["2-2-3"] = function () {
    put("2-2-3", '<p class="viz-title">TSCĐ hữu hình: còn lại = nguyên giá − hao mòn; khấu hao đi hai đường khác nhau</p>' + splitWrap(
      '<div data-wf="tscd-bq"></div><div class="dflow bq"><p class="viz-title sm">Khấu hao đi về đâu</p><span class="df-n">' + v("bq.b01.khauHaoNam", 3) + " tỷ</span>" + ic("i-arrow-r") + '<span class="df-n">TK 642</span>' + ic("i-arrow-r") + '<span class="df-n">TK 241</span>' + ic("i-arrow-r") + '<span class="df-n end">Giá trị công trình</span><span class="tagc t-ts">Vào tài sản</span>' + chip("F03D mục 10") + "</div>",
      '<div data-wf="tscd-dn"></div><div class="dflow dn"><p class="viz-title sm">Khấu hao đi về đâu</p><span class="df-n">' + v("hp.khauHaoPhanBo", 1) + " tỷ</span>" + ic("i-arrow-r") + '<span class="df-n">Chi phí kỳ</span>' + ic("i-arrow-r") + '<span class="df-n end">Giảm lợi nhuận</span><span class="tagc t-ln">Vào lợi nhuận</span>' + chip("Hòa Phát tr.12", "hp") + "</div>"));
    waterfall(doc.querySelector('[data-wf="tscd-bq"]'), { bq: true, src: "B04 V.06 tr.6", aria: "TSCĐ hữu hình BQLDA: nguyên giá 1,260 trừ hao mòn 0,486 còn 0,774 tỷ", steps: [
      { lab: "Nguyên giá", p: "bq.b01.nguyenGia", d: 3, kind: "start" }, { lab: "Hao mòn lũy kế", p: "bq.b01.haoMon", d: 3, kind: "down" }, { lab: "Giá trị còn lại", p: "bq.b01.tscd", d: 3, kind: "total" }] });
    waterfall(doc.querySelector('[data-wf="tscd-dn"]'), { src: "Hòa Phát tr.41", aria: "TSCĐ hữu hình Hòa Phát: nguyên giá 108.146,6 trừ hao mòn 40.902,4 còn 67.244,2 tỷ", steps: [
      { lab: "Nguyên giá", p: "hp.nguyenGia", d: 1, kind: "start" }, { lab: "Hao mòn lũy kế", p: "hp.haoMon", d: 1, kind: "down" }, { lab: "Giá trị còn lại", p: "hp.tscdhh", d: 1, kind: "total" }] });
  };

  V["2-2-4"] = function () {
    put("2-2-4", '<p class="viz-title">Nợ của BQLDA gần như toàn là nợ nhà thầu; nợ của Hòa Phát chủ yếu là vay ngân hàng</p>' + splitWrap('<div data-stk="no-bq"></div>', '<div data-stk="no-dn"></div>') +
      '<p class="viz-title" style="margin-top:var(--s-5)">Vốn đầu tư chảy vào TK 3361 từ hai nguồn của chủ đầu tư (F02)</p><div data-flow="3361"></div>' +
      '<p class="viz-title" style="margin-top:var(--s-5)">Ba lý do nguồn vốn đầu tư không phải vốn chủ sở hữu</p><div class="why3"><div>' + ic("i-users") + "<b>Chỉ có tư cách quản lý</b><span>Đơn vị trực thuộc, lập theo QĐ " + t("bq.info.quyetDinh") + ", không sở hữu vốn</span></div><div>" + ic("i-key") + "<b>Nghĩa vụ quyết toán, bàn giao</b><span>Vốn dùng đúng dự án rồi bàn giao cho chủ đầu tư</span></div><div>" + ic("i-x") + "<b>Không có quyền phân phối</b><span>Không lợi nhuận giữ lại, quỹ hay cổ tức</span></div></div>");
    stack(doc.querySelector('[data-stk="no-bq"]'), { bq: true, total: get("bq.b01.no") / 1e9, src: "B04 V.08 tr.6", title: "BQLDA: nợ phải trả " + v("bq.b01.no", 3) + " tỷ", aria: "BQLDA: phải trả người bán 91,4% nợ phải trả", segs: [
      { lab: "Phải trả người bán", p: "bq.b01.ptnb", d: 2, pct: "calc.bqNoPtnbPct", cls: "t1", pctCalc: true }, { lab: "Còn lại", p: "calc.bqNoKhac", d: 3, s: "ty", pct: "calc.bqNoKhacPct", cls: "t3", calc: true }] });
    stack(doc.querySelector('[data-stk="no-dn"]'), { total: get("hp.no"), src: "Hòa Phát tr.8", title: "Hòa Phát: nợ phải trả " + v("hp.no", 0) + " tỷ", aria: "Hòa Phát: nợ vay 75,5% nợ phải trả", segs: [
      { lab: "Vay ngân hàng", p: "hp.vay", d: 0, pct: "calc.hpNoVayPct", cls: "d1", pctCalc: true }, { lab: "Còn lại", p: "calc.hpNoKhac", d: 0, pct: "calc.hpNoKhacPct", cls: "d3", calc: true }] });
    doc.querySelector('[data-stk="no-bq"]').insertAdjacentHTML("beforeend", '<p class="viz-foot">Tỷ lệ % ở hai bên là số tính ' + calcChip() + "</p>");
    flow(doc.querySelector('[data-flow="3361"]'), { bq: true, side: "bq", src: "F02 tr.8", height: 200, target: ["TK 3361 nguồn vốn đầu tư", v("bq.b02.cuoi", 3) + " tỷ · B01 mã 410"], aria: "Hai nguồn vốn chảy vào TK 3361",
      items: [{ lab: "Vốn chủ sở hữu của chủ đầu tư cấp", p: "bq.f02.vcsh.cuoi", d: 3, pct: "bq.f02.pctVcsh", cls: "t1" }, { lab: "Vốn vay thương mại do chủ đầu tư vay, cấp lại", p: "bq.f02.vay.cuoi", d: 3, pct: "bq.f02.pctVay", cls: "t2" }],
      foot: "Hợp đồng tín dụng số " + t("bq.info.hopDongTinDung") + ": nghĩa vụ trả nợ thuộc chủ đầu tư. " + chip("F02 tr.8") });
  };

  V["2-2-5"] = function () {
    put("2-2-5", '<p class="viz-title">Đầu 4: BQLDA trống hoàn toàn; Hòa Phát có vốn cổ phần, quỹ, lợi nhuận chưa phân phối</p>' + splitWrap(
      '<div class="empty4">' + ic("i-x") + "<b>Đầu 4 trống</b><span>Không vốn cổ phần, không quỹ, không lợi nhuận chưa phân phối</span></div>" +
      '<div class="capline"><p class="viz-title sm">Vốn BQLDA (TK 3361) chỉ đổi theo hai cách</p><div class="cl-row"><span class="tagc t-tang">Tăng</span>Chủ đầu tư cấp thêm <b>+' + v("bq.b02.tang", 2) + ' tỷ</b></div><div class="cl-row"><span class="tagc t-giam">Giảm</span>Quyết toán, bàn giao <b>−' + v("bq.b02.giam", 2) + " tỷ</b></div>" + chip("B02 tr.3") + "</div>",
      '<div data-tm="eq-dn"></div>'));
    treemap(doc.querySelector('[data-tm="eq-dn"]'), { src: "Hòa Phát, theo bài", aria: "Các khoản vốn chủ sở hữu Hòa Phát bài nêu", items: [
      { lab: "Vốn cổ phần (TK 411)", p: "hp.vonCoPhan", d: 1, cls: "d1" }, { lab: "Lợi nhuận chưa phân phối", p: "hp.lnChuaPP", d: 0, cls: "d2" }, { lab: "Quỹ đầu tư phát triển (TK 418)", p: "hp.quyDTPT", d: 1, cls: "d3" }] });
  };

  V["2-2-6"] = function () {
    var steps = [
      ["Đầu 5 · Doanh thu", "Doanh thu thuần " + v("hp.dtt", 1)],
      ["Đầu 6 · Chi phí", "Giá vốn " + v("hp.giaVon", 1) + "; BH " + v("hp.cpBanHang", 1) + "; QLDN " + v("hp.cpQLDN", 1) + "; TC " + v("hp.cpTaiChinh", 1)],
      ["Đầu 7 · Thu nhập khác", v("hp.thuNhapKhac", 1)],
      ["Đầu 8 · Chi phí khác, thuế TNDN", v("hp.cpKhac", 1) + "; thuế " + v("hp.thueTNDN", 1)],
      ["Đầu 9 · Xác định kết quả", "LNST " + v("hp.lnst", 1)]
    ];
    var l = '<div class="ladder bq">' + steps.map(function (s) { return '<div class="ld-step empty"><b>' + s[0] + "</b><span>" + ic("i-x") + "Không phát sinh</span></div>"; }).join("") + '<div class="ld-stop">' + ic("i-pipe") + "<span>Chi phí dừng ở TK 241: " + v("bq.f03d.ps2015", 3) + " tỷ chi phí Ban (TK 642) phân bổ hết vào TK 241</span>" + chip("F03D tr.12") + "</div></div>";
    var r = '<div class="ladder dn">' + steps.map(function (s, i) { return '<div class="ld-step"><b>' + s[0] + "</b><span>" + s[1] + " tỷ</span></div>"; }).join("") + '<div class="ld-stop dn">' + ic("i-loop") + "Kết chuyển vào TK 421 " + chip("Hòa Phát, theo bài", "hp") + "</div></div>";
    put("2-2-6", '<p class="viz-title">Bậc thang kết quả: BQLDA dừng ở TK 241; Hòa Phát đi hết tới lợi nhuận sau thuế</p>' + splitWrap(l, r) +
      '<p class="viz-title" style="margin-top:var(--s-5)">TK 642: cùng số hiệu, hai đường đi</p><div class="branch"><div class="br-src">TK 642<small>chi phí quản lý</small></div><div class="br-arms"><div class="br bq"><span class="br-arrow"></span><b>Nợ TK 241 / Có TK 642</b><span>' + v("bq.f03d.ps2015", 3) + ' tỷ → giá trị công trình tăng</span><span class="tagc t-ts">Vào tài sản</span></div><div class="br dn"><span class="br-arrow"></span><b>Nợ TK 911 / Có TK 642</b><span>' + v("hp.cpQLDN", 1) + ' tỷ → lợi nhuận giảm</span><span class="tagc t-ln">Vào lợi nhuận</span></div></div></div>' +
      '<div class="branch"><div class="br-src">Chênh lệch tỷ giá</div><div class="br-arms"><div class="br bq"><span class="br-arrow"></span><b>TK 3362</b><span>chuyển cho chủ đầu tư</span><span class="tagc t-cdt">Chuyển cho chủ đầu tư</span></div><div class="br dn"><span class="br-arrow"></span><b>Kết quả kinh doanh</b><span>lãi ' + v("hp.laiTyGia", 1) + "; lỗ " + v("hp.loTyGia", 1) + ' tỷ</span><span class="tagc t-ln">Vào lợi nhuận</span></div></div></div>');
  };

  V["2-2-7"] = function () {
    put("2-2-7", '<p class="viz-title">Ngoài bảng: BQLDA báo cáo ngay trên bảng cân đối; Hòa Phát chỉ ở thuyết minh</p>' + splitWrap(
      '<div class="tiles"><div class="tile"' + tip("<b>Ngoại tệ (mã 007)</b><br>Cuối năm " + v("bq.b01.usdCuoi", 0) + " USD, đầu năm " + v("bq.b01.usdDau", 0) + " USD<br>" + chip("B01 tr.2")) + '><span class="tagc t-co">Có, trên B01</span><b>' + v("bq.b01.usdCuoi", 0) + " USD</b><span>Đầu năm " + v("bq.b01.usdDau", 0) + ' USD</span><span class="mini-bars"><i style="--w:' + (get("bq.b01.usdDau") / get("bq.b01.usdDau")) * 100 + '%"></i><i style="--w:' + (get("bq.b01.usdCuoi") / get("bq.b01.usdDau")) * 100 + '%"></i></span></div><div class="tile"><span class="tagc t-co">Có dòng, không số dư</span><b>Tài sản nhận giữ hộ</b><span>Mã 002</span></div></div>',
      '<div class="tiles"><div class="tile"><span class="tagc t-kh">Không trên B01</span><b>' + v("hp.usd", 0) + " USD</b><span>≈ " + v("hp.usdTy", 1) + ' tỷ đồng, thuyết minh 5.1</span></div><div class="tile"><span class="tagc t-kh">Không có dòng</span><b>Tài sản nhận giữ hộ</b><span>Mẫu B01-DN/HN không có</span></div></div>'));
  };

  V["2-3-1"] = function () {
    put("2-3-1", '<p class="viz-title">Hình 2.8 trực quan: vốn BQLDA đổi do cấp vốn và bàn giao; vốn Hòa Phát đổi do lợi nhuận và phân phối</p>' + splitWrap('<div data-wf="3361"></div>', '<div data-wf="vcsh"></div><div class="intra"><span class="tagc t-co">Chuyển nội bộ, tổng không đổi</span><span>Cổ tức bằng cổ phiếu ' + v("hp.coTucCPPct", 0) + "%: " + v("hp.coTucCP", 1) + " tỷ (thặng dư " + v("hp.coTucTuThangDu", 1) + " + LNCPP " + v("hp.coTucTuLNCPP", 1) + ") → vốn cổ phần; hoàn nhập quỹ ĐTPT " + v("hp.hoanNhapQuyDTPT", 1) + " tỷ → LNCPP</span></div>"));
    waterfall(doc.querySelector('[data-wf="3361"]'), { bq: true, src: "B02 tr.3", aria: "Thác nước TK 3361: đầu năm 129,45, tăng 63,85, giảm 4,58, cuối năm 188,72 tỷ", steps: [
      { lab: "Đầu năm", p: "bq.b02.dau", d: 2, kind: "start" }, { lab: "Cấp bằng tiền", p: "bq.b02.tangTien", d: 2, kind: "up" }, { lab: "Cấp bằng vật tư, thiết bị", p: "bq.b02.tangVatTu", d: 2, kind: "up" },
      { lab: "Quyết toán, bàn giao", p: "bq.b02.giam", d: 2, kind: "down" }, { lab: "Cuối năm", p: "bq.b02.cuoi", d: 2, kind: "total" }] });
    waterfall(doc.querySelector('[data-wf="vcsh"]'), { src: "Hòa Phát tr.55, theo bài", note: "Đầu năm suy ngược từ cuối năm và các khoản bài nêu (Hình 2.7 của bài in 102.836,4; lệch 0,1 do làm tròn).", aria: "Thác nước vốn chủ sở hữu Hòa Phát năm 2024", steps: [
      { lab: "Đầu năm (tính bù)", p: "calc.hpVcshDauTinh", d: 1, kind: "start", calc: true }, { lab: "Lợi nhuận thuần", p: "hp.lnst", d: 1, kind: "up" }, { lab: "CĐKKS góp vốn", p: "hp.gopVonCDKKS", d: 1, kind: "up" },
      { lab: "Trích quỹ KTPL", p: "hp.trichQuy", d: 1, kind: "down" }, { lab: "Cổ tức cho CĐKKS", p: "hp.cdkksCoTuc", d: 1, kind: "down" }, { lab: "Sử dụng quỹ", p: "hp.suDungQuy", d: 1, kind: "down" },
      { lab: "Trả vốn CĐKKS", p: "hp.traVonCDKKS", d: 1, kind: "down" }, { lab: "Cuối năm", p: "hp.vcshChiTiet", d: 1, kind: "total" }] });
  };

  V["2-3-2"] = function () {
    var six = ["Vốn cổ phần", "Thặng dư", "Chênh lệch tỷ giá", "Quỹ đầu tư phát triển", "LN chưa phân phối", "Lợi ích CĐKKS"];
    put("2-3-2", '<p class="viz-title">F02 tách hai nguồn; Hòa Phát theo dõi sáu cột vốn</p>' + splitWrap(
      '<div data-wf="f02a"></div><div data-wf="f02b"></div><div class="pipes1"><p class="viz-title sm">Một ống: TK 3361</p><span class="pp bq">' + ic("i-pipe") + "TK 3361 · bằng tiền / bằng vật tư, thiết bị</span></div>",
      '<div class="pipes6"><p class="viz-title sm">Sáu ống vốn chủ sở hữu ' + chip("Hòa Phát tr.55", "hp") + "</p>" + six.map(function (s) { return '<span class="pp dn">' + ic("i-loop") + s + "</span>"; }).join("") + "</div>") +
      '<p class="viz-title" style="margin-top:var(--s-5)">Đối chiếu chéo: cùng một số xuất hiện ở bốn chỗ</p>' + splitWrap(
        '<div class="xcheck bq"><div class="xc-hub">' + v("bq.b02.cuoi", 0, "dong") + ' đ</div><span class="xc-n n1">B01 mã 410 · tr.2</span><span class="xc-n n2">B02 · tr.3</span><span class="xc-n n3">F02 · tr.8</span><span class="xc-n n4">B04 V.10</span><svg class="xc-l" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 50 L14 16 M50 50 L86 16 M50 50 L14 84 M50 50 L86 84"/></svg></div><p class="tiny muted">Ghi chú ngay trên B02: “Số dư cuối năm khớp B01 (mã 410) và F02” ' + chip("B02 tr.3") + "</p>",
        '<div class="xcheck dn"><div class="xc-hub">' + v("hp.vcsh", 0) + ' tỷ</div><span class="xc-n n1">B01 · tr.9</span><span class="xc-n n2">Thuyết minh 26 · tr.55</span><svg class="xc-l" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 50 L14 16 M50 50 L86 16"/></svg></div><p class="tiny muted">Đối chiếu chéo nhưng không ghi chú trên báo cáo ' + chip("Hòa Phát, theo bài", "hp") + "</p>"));
    waterfall(doc.querySelector('[data-wf="f02a"]'), { bq: true, src: "F02 tr.8", title: "Vốn chủ sở hữu của chủ đầu tư cấp", aria: "F02 vốn chủ sở hữu: đầu năm 78,200, tăng 24,150 và 3,200, giảm 2,960, cuối 102,590 tỷ", steps: [
      { lab: "Đầu năm", p: "bq.f02.vcsh.dau", d: 3, kind: "start" }, { lab: "Tăng bằng tiền", p: "bq.f02.vcsh.tangTien", d: 3, kind: "up" }, { lab: "Tăng bằng vật tư", p: "bq.f02.vcsh.tangVatTu", d: 3, kind: "up" },
      { lab: "Giảm (quyết toán)", p: "bq.f02.vcsh.giam", d: 3, kind: "down" }, { lab: "Cuối năm", p: "bq.f02.vcsh.cuoi", d: 3, kind: "total" }] });
    waterfall(doc.querySelector('[data-wf="f02b"]'), { bq: true, src: "F02 tr.8", title: "Vốn vay thương mại do chủ đầu tư vay, cấp lại", aria: "F02 vốn vay: đầu năm 51,250, tăng 36,500, giảm 1,622, cuối 86,127 tỷ", steps: [
      { lab: "Đầu năm", p: "bq.f02.vay.dau", d: 3, kind: "start" }, { lab: "Tăng bằng tiền", p: "bq.f02.vay.tangTien", d: 3, kind: "up" },
      { lab: "Giảm (quyết toán)", p: "bq.f02.vay.giam", d: 3, kind: "down" }, { lab: "Cuối năm", p: "bq.f02.vay.cuoi", d: 3, kind: "total" }] });
  };

  V["2-4-1"] = function () {
    put("2-4-1", '<p class="viz-title">BQLDA: 100% chi phí vào tài sản. Hòa Phát: chi phí trừ dần từ doanh thu tới lợi nhuận sau thuế</p>' + splitWrap(
      '<div class="onebar"><span class="ob-bar"' + tip("<b>Chi phí phát sinh 2015</b><br>" + v("bq.b03.ps", 2) + " tỷ đồng → TK 241<br>" + chip("B03 tr.4")) + '><b>' + v("bq.b03.ps", 2) + ' tỷ</b> chi phí phát sinh 2015</span>' + ic("i-arrow-r") + '<span class="ob-to">TK 241<small>số dư ' + v("bq.b03.cuoi", 2) + ' tỷ</small></span></div><p class="ob-note"><span class="tagc t-kh">Không có doanh thu</span><span class="tagc t-kh">Không có lợi nhuận</span><span class="tagc t-ts">Vào tài sản 100%</span></p>' +
      '<div data-stk="ratio-bq"></div><div class="hbars mirror" id="chartCost" role="img" aria-label="Chi phí đầu tư phát sinh năm 2015 theo 6 nội dung, tỷ đồng."></div>',
      '<div data-wf="kq"></div><div data-stk="ratio-dn"></div>'));
    waterfall(doc.querySelector('[data-wf="kq"]'), { src: "Hòa Phát tr.10, theo bài", title: "Chuỗi kết quả kinh doanh hợp nhất 2024, cộng khớp từng bước", aria: "Thác nước kết quả kinh doanh Hòa Phát từ doanh thu thuần 138.855,1 đến lợi nhuận sau thuế 12.020,0 tỷ", steps: [
      { lab: "Doanh thu thuần", p: "hp.dtt", d: 1, kind: "start" }, { lab: "Giá vốn", p: "hp.giaVon", d: 1, kind: "down" }, { lab: "Lợi nhuận gộp", p: "hp.lnGop", d: 1, kind: "total" },
      { lab: "Chi phí bán hàng", p: "hp.cpBanHang", d: 1, kind: "down" }, { lab: "Chi phí quản lý DN", p: "hp.cpQLDN", d: 1, kind: "down" }, { lab: "Sau bán hàng, quản lý", p: "calc.hpSauBhQl", d: 1, kind: "total", calc: true },
      { lab: "Doanh thu tài chính", p: "hp.dtTaiChinh", d: 1, kind: "up" }, { lab: "Chi phí tài chính", p: "hp.cpTaiChinh", d: 1, kind: "down" }, { lab: "Sau hoạt động tài chính", p: "calc.hpSauTaiChinh", d: 1, kind: "total", calc: true },
      { lab: "Thu nhập khác", p: "hp.thuNhapKhac", d: 1, kind: "up" }, { lab: "Chi phí khác", p: "hp.cpKhac", d: 1, kind: "down" }, { lab: "Lợi nhuận trước thuế", p: "hp.lnTruocThue", d: 1, kind: "total" },
      { lab: "Thuế TNDN", p: "hp.thueTNDN", d: 1, kind: "down" }, { lab: "Lợi nhuận sau thuế", p: "hp.lnst", d: 1, kind: "total" }] });
    stack(doc.querySelector('[data-stk="ratio-bq"]'), { total: 100, src: "B03 tr.4", title: "Chi phí đi về đâu", aria: "BQLDA: 100% vào tài sản, 0% vào kết quả", segs: [{ lab: "Vào tài sản", p: "bqRatio.taiSan", d: 0, cls: "t1" }, { lab: "Vào kết quả kinh doanh", p: "bqRatio.ketQua", d: 0, cls: "t3" }], unit: "%" });
    stack(doc.querySelector('[data-stk="ratio-dn"]'), { total: 100, src: "Bài, mục 2.4.1 (ước tính thô)", title: "Chi phí đi về đâu (ước tính thô của bài)", aria: "Hòa Phát: khoảng 23,6% vào tài sản, 76,4% vào kết quả kinh doanh", segs: [{ lab: "Vào tài sản (vốn hóa XDCB " + v("hp.xdcbTang", 1) + " tỷ)", p: "hp.ratioTaiSan", d: 1, cls: "d1" }, { lab: "Vào kết quả kinh doanh", p: "hp.ratioKetQua", d: 1, cls: "d3" }], unit: "%" });
  };

  V["2-4-2"] = function () {
    var items = D.bq.f03a.items.map(function (it, i) {
      var cls = it.banGiao ? "t4" : i === 5 ? "t2" : "t1";
      var st = it.banGiao ? "Đã bàn giao" : i === 5 ? "Chi phí chung chưa phân bổ" : "Đang thi công";
      return { lab: it.ten.replace(/ \(.*\)/, ""), p: "bq.f03a.items." + i + ".cuoi", d: 3, cls: cls, note: st + " · " + v("calc.f03aPct." + i, 1) + "%*" };
    });
    var hpList = [["Dung Quất", "hp.duAnDungQuat", "hp.duAnDungQuatPct"], ["Container", "hp.duAnContainer"], ["Ống thép", "hp.duAnOngThep"], ["Nông nghiệp", "hp.duAnNongNghiep"]];
    var max = get("hp.duAnDungQuat");
    put("2-4-2", '<p class="viz-title">BQLDA theo dõi 7 hạng mục của một dự án kèm trạng thái; Hòa Phát theo dõi các dự án lớn</p>' + splitWrap(
      '<div data-tm="f03a"></div><div class="stk-key"><span><i class="t1"></i>Đang thi công</span><span><i class="t2"></i>Chi phí chung chưa phân bổ</span><span class="done-key">Đã bàn giao: Nhà bảo vệ, hàng rào, cổng (cuối năm 0; đã bàn giao ' + v("bq.f03b.duyet", 3) + " tỷ ngày " + t("bq.f03b.ngayBanGiao") + ")</span></div>",
      '<div class="hbars dn-bars">' + hpList.map(function (x) {
        return '<div class="hbar"><span>' + x[0] + (x[2] ? " (" + v(x[2], 1) + "% XDCB)" : "") + '</span><span class="hbar-track"><span class="hbar-fill" style="--w:' + Math.max(0.8, (get(x[1]) / max) * 100) + '%"' + tip("<b>" + x[0] + "</b><br>" + v(x[1], 1) + " tỷ đồng<br>" + chip("Hòa Phát tr.44, tm 14", "hp")) + '></span></span><span class="hbar-v">' + v(x[1], 1) + "</span></div>";
      }).join("") + '</div><p class="viz-foot">Tỷ đồng · chỉ thấy phần đã chuyển sang TSCĐ (' + v("hp.chuyenTSCD", 1) + " tỷ) " + chip("Hòa Phát tr.44", "hp") + "</p>"));
    treemap(doc.querySelector('[data-tm="f03a"]'), { bq: true, src: "F03A tr.9", aria: "Treemap bảy hạng mục F03A theo số dư cuối năm, tổng 186,743 tỷ", items: items });
  };

  V["2-5"] = function () {
    put("2-5", '<p class="viz-title">Đi ra khỏi TK 241: BQLDA bàn giao một đích; Hòa Phát chuyển sang nhiều loại tài sản rồi khấu hao tiếp</p>' + splitWrap('<div data-flow="f03b"></div>', '<div data-flow="xdcb"></div>') +
      '<p class="viz-title" style="margin-top:var(--s-5)">Sau khi hoàn thành</p>' + splitWrap(
        '<div class="after bq"><span class="af-a">Bàn giao ' + t("bq.f03b.ngayBanGiao") + '</span><span class="af-line stop"></span><span class="af-end">' + ic("i-x") + "Dừng: không còn trên sổ, không khấu hao</span></div>",
        '<div class="after dn"><span class="af-a">Đưa vào sử dụng</span><span class="af-line go"></span><span class="af-end go">' + ic("i-arrow-r") + "<span>Khấu hao " + v("hp.khauHao", 1) + " tỷ trong năm → chi phí kỳ</span>" + chip("Hòa Phát tr.41", "hp") + "</span></div>"));
    var f = D.bq.f03b;
    flow(doc.querySelector('[data-flow="f03b"]'), { bq: true, side: "bq", src: "F03B tr.10", pctCalc: true, target: ["Bàn giao cho chủ đầu tư", "Nợ 3361 / Có 241 · " + v("bq.f03b.duyet", 3) + " tỷ"], aria: "Giá trị quyết toán 4,582 tỷ tách thành năm nội dung cùng chảy tới bàn giao cho chủ đầu tư",
      items: [{ lab: "Xây dựng", p: "bq.f03b.xd", d: 3, pct: "calc.f03bPct.xd", cls: "t1" }, { lab: "Thiết bị", p: "bq.f03b.tb", d: 3, pct: "calc.f03bPct.tb", cls: "t2" }, { lab: "Tư vấn", p: "bq.f03b.tv", d: 3, pct: "calc.f03bPct.tv", cls: "t3" }, { lab: "Quản lý dự án", p: "bq.f03b.ql", d: 3, pct: "calc.f03bPct.ql", cls: "t3" }, { lab: "Khác", p: "bq.f03b.khac", d: 3, pct: "calc.f03bPct.khac", cls: "t3" }],
      foot: "% là số tính trong tổng 4,582 tỷ " + calcChip() + " " + chip("F03B tr.10") });
    flow(doc.querySelector('[data-flow="xdcb"]'), { side: "dn", dir: "out", src: "Hòa Phát tr.44", target: ["XDCB hoàn thành", "Nợ 211 (213, 242) / Có 241"], aria: "XDCB Hòa Phát chuyển thành TSCĐ hữu hình, vô hình và chi phí trả trước",
      items: [{ lab: "TSCĐ hữu hình", p: "hp.chuyenTSCD", d: 1, cls: "d1" }, { lab: "Chi phí trả trước dài hạn", p: "hp.chuyenCPTTDH", d: 1, cls: "d2" }, { lab: "Chi phí trả trước ngắn hạn", p: "hp.chuyenCPTTNH", d: 1, cls: "d3" }, { lab: "TSCĐ vô hình", p: "hp.chuyenTSCDVoHinh", d: 1, cls: "d3" }],
      foot: "Tỷ đồng; độ dày chỉ so trong từng bên " + chip("Hòa Phát tr.44", "hp") });
  };

  /* ---------- Chương 3 ---------- */
  V["3-1"] = function () {
    var a = [["Quản trị chi phí (TK 241)", "Kiểm soát chi tiết nguồn vốn theo dự toán; 6 nội dung chi phí rõ ràng", "Khối lượng chứng từ lớn; dễ sai sót khi tập hợp chi phí chung chưa phân bổ"],
      ["Quản lý nguồn vốn (TK 336)", "Minh bạch dòng vốn cấp bằng tiền hoặc vật tư; thuận lợi đối chiếu quyết toán", "Ghi giảm nguồn vốn khi bàn giao (Nợ 336 / Có 241) phức tạp nếu có chi phí không được duyệt"],
      ["Phân bổ chi phí BQLDA (TK 642)", "Đúng bản chất: chi phí Ban là bộ phận cấu thành giá trị tài sản đầu tư", "Tiêu thức phân bổ vào TK 241 có thể làm lệch giá trị từng hạng mục"]];
    put("3-1", '<p class="viz-title">Bảng 3.1: ưu điểm và hạn chế cân cho từng khía cạnh</p><div class="scales">' + a.map(function (x) {
      return '<div class="scale"><b class="sc-k">' + x[0] + '</b><div class="sc-beam"><span class="sc-pivot"></span></div><div class="sc-pans"><div class="sc-pan plus"><span class="tagc t-tang">' + ic("i-check") + "Ưu điểm</span>" + x[1] + '</div><div class="sc-pan minus"><span class="tagc t-giam">' + ic("i-alert") + "Hạn chế</span>" + x[2] + "</div></div></div>";
    }).join("") + "</div>");
  };

  V["3-2"] = function () {
    var rows = [
      ["TK 241 · " + v("bq.b01.tk241", 3) + " tỷ", ["Tài sản dở dang của doanh nghiệp, sẽ thành TSCĐ và khấu hao", "dn"], ["Công trình đang hình thành, sẽ bàn giao cho chủ đầu tư; " + v("bq.b01.pct.tk241", 1) + "% tổng tài sản", "bq"]],
      ["Nợ phải trả · " + v("bq.b01.no", 3) + " tỷ", ["Gộp " + v("bq.b01.nvdt", 3) + " tỷ của TK 3361 vào nợ → tưởng Ban nợ rất lớn", "dn"], ["Chỉ " + v("bq.b01.no", 3) + " tỷ, gần như toàn là nợ nhà thầu", "bq"]],
      ["TK 336 (3361) · " + v("bq.b01.nvdt", 3) + " tỷ", ["Một khoản nợ phải trả", "dn"], ["Nguồn vốn đầu tư nhận từ chủ đầu tư (mã 410, mục B)", "bq"]],
      ["Vốn chủ sở hữu", ["Thiếu vốn chủ sở hữu → tưởng đơn vị mất vốn", "dn"], ["Không ghi nhận vốn chủ sở hữu là đúng bản chất: Ban chỉ nhận vốn để hình thành tài sản", "bq"]]
    ];
    put("3-2", '<div class="viz-bar"><p class="viz-title">Đọc B01-CĐT bằng hai tư duy: vì sao người đọc dễ hiểu lầm</p><div class="seg" role="group" aria-label="Cách đọc" data-read-toggle><button type="button" data-read="dn" aria-pressed="true">Đọc bằng tư duy doanh nghiệp</button><button type="button" data-read="bq" aria-pressed="false">Đọc đúng bản chất BQLDA</button></div></div>' +
      '<div class="b01m" data-read="dn"><p class="b01m-h">B01-CĐT thu nhỏ · 31/12/2015 ' + chip("B01 tr.2") + "</p>" + rows.map(function (r) {
        return '<div class="b01m-r"><b>' + r[0] + '</b><span class="rd dn">' + ic("i-alert") + r[1][0] + '</span><span class="rd bq">' + ic("i-check") + r[2][0] + "</span></div>";
      }).join("") + "</div>");
    var tg = doc.querySelector("[data-read-toggle]");
    tg.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      tg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      doc.querySelector(".b01m").setAttribute("data-read", b.getAttribute("data-read"));
    });
  };

  V["3-3"] = function () {
    var l1 = ["Xác định đúng mô hình tổ chức thực hiện dự án", "Tập trung luồng vốn: Có TK 336 → Nợ TK 241 → Nợ 336 / Có 241", "Phối hợp bộ phận kỹ thuật về khối lượng nghiệm thu", "Tiêu thức phân bổ TK 642 hợp lý, giảm rủi ro xuất toán"];
    var l2 = ["Hướng dẫn chuyển đổi số dư TK 3361, TK 3368", "Số hóa, tự động trích xuất F03A, F03B", "Đẩy nhanh thẩm tra, phê duyệt quyết toán", "Xử lý công trình đã khai thác chưa ghi tăng TSCĐ"];
    put("3-3", '<p class="viz-title">Lộ trình kiến nghị hai làn, cùng hướng tới Thông tư 99/2025/TT-BTC</p><div class="road"><div class="road-lane bq"><b class="road-k">' + ic("i-users") + "Người làm kế toán, người đọc BCTC</b>" + l1.map(function (x, i) { return '<span class="road-s"><i>' + (i + 1) + "</i>" + x + "</span>"; }).join("") + '</div><div class="road-lane dn"><b class="road-k">' + ic("i-book") + "Cơ quan quản lý nhà nước</b>" + l2.map(function (x, i) { return '<span class="road-s"><i>' + (i + 1) + "</i>" + x + "</span>"; }).join("") + '</div><div class="road-goal"><b>TT 99/2025/TT-BTC</b><span>ban hành 27/10/2025</span><span>hiệu lực 01/01/2026</span><span>thay TT 195 và TT 200</span></div></div>');
  };

  V["kl"] = function () {
    put("kl", '<div class="klg">' + '<div class="klg-c bq">' + pipeSVG({ mini: true, id: "k" }) + '<p class="mini-chain bq">Chủ đầu tư → TK 336 → BQLDA → TK 241 → bàn giao · không xác định lãi, lỗ</p>' + "<b>BQLDA: kiểm soát nguồn cấp phát (TK 336) và tập hợp chi phí đầu tư (TK 241)</b></div>" + '<div class="klg-c dn">' + loopSVG({ mini: true, id: "k" }) + '<p class="mini-chain dn">Vốn → đầu tư, sản xuất → doanh thu → kết quả → LN giữ lại → vốn</p>' + "<b>Doanh nghiệp: đo chu kỳ kinh doanh qua doanh thu, chi phí, kết quả</b></div></div>");
  };

  /* ---------- Tương tác ---------- */
  function initInteractions() {
    doc.addEventListener("click", function (e) {
      var sp = e.target.closest("[data-spoke]");
      if (sp) {
        var i = sp.getAttribute("data-spoke");
        doc.querySelectorAll("[data-spoke]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === sp)); });
        doc.querySelectorAll("[data-spoke-p]").forEach(function (p) { p.hidden = p.getAttribute("data-spoke-p") !== i; });
      }
      var md = e.target.closest("[data-model]");
      if (md) {
        var j = md.getAttribute("data-model");
        doc.querySelectorAll("[data-model]").forEach(function (b) { b.setAttribute("aria-pressed", String(b === md)); });
        doc.querySelectorAll("[data-model-r]").forEach(function (p) { p.hidden = p.getAttribute("data-model-r") !== j; });
      }
      var ts = e.target.closest("[data-tstep]");
      if (ts) setTStep(+ts.getAttribute("data-tstep"));
    });
    var rg = doc.getElementById("tRange");
    if (rg) rg.addEventListener("input", function () { setTStep(+rg.value); });
    setTStep(1);
  }

  function setTStep(n) {
    var rg = doc.getElementById("tRange");
    if (!rg) return;
    rg.value = n;
    doc.querySelectorAll("[data-tstep]").forEach(function (b) { b.setAttribute("aria-pressed", String(+b.getAttribute("data-tstep") === n)); });
    ["bq", "dn"].forEach(function (k) {
      var prev = n > 1 ? D.tAcc[k].steps[n - 2] : null, cur = D.tAcc[k].steps[n - 1];
      doc.querySelectorAll('[data-viz="1-3-2-t"] .vs-' + (k === "bq" ? "l" : "r") + " .tacc").forEach(function (box) {
        var tk = box.getAttribute("data-tk"), val = cur[tk];
        var path = "tAcc." + k + ".steps." + (n - 1) + "." + tk;
        var span = '<span data-v="' + path + '" data-d="0" data-abs></span>';
        box.querySelector(".no").innerHTML = val > 0 ? span : "";
        box.querySelector(".co").innerHTML = val < 0 ? span : "";
        box.classList.toggle("zero", val === 0);
        box.classList.toggle("changed", prev ? prev[tk] !== val : val !== 0);
      });
    });
    doc.querySelectorAll(".tres-b").forEach(function (b) { b.classList.toggle("on", n === 4); });
    if (window.__fill) window.__fill(doc.querySelector('[data-viz="1-3-2-t"]'));
  }

  // Hạt dòng chảy: chạy một lần khi đồ họa vào khung nhìn
  function initParticles(reduce) {
    if (reduce || !("IntersectionObserver" in window)) return;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        en.target.classList.add("flowing");
        en.target.querySelectorAll("animateMotion").forEach(function (a) {
          setTimeout(function () { try { a.beginElement(); } catch (e) {} }, parseFloat(a.getAttribute("data-delay")) * 1000);
        });
      });
    }, { threshold: 0.4 });
    doc.querySelectorAll(".g-pipe, .g-loop").forEach(function (g) { io.observe(g); });
  }

  window.VIZ = {
    build: function () {
      heroGraphics();
      Object.keys(V).forEach(function (k) { if (doc.querySelector('[data-viz="' + k + '"]')) V[k](); });
    },
    init: function (reduce) {
      initTips();
      initInteractions();
      initParticles(reduce);
    }
  };
})();

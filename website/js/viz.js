/* Bản 3: đồ họa và biểu đồ. Mọi số lấy từ data.js qua thẻ data-v; main.js điền số sau khi dựng.
 * Quy ước: navy = BQLDA (ống dẫn một chiều), xanh sáng = Doanh nghiệp (vòng kết quả khép kín). */
(function () {
  "use strict";
  var D = window.DATA;
  var doc = document;
  // Dòng chú thích trung tính dưới biểu đồ có số tính thêm (công thức chỉ hiện ở Chế độ rà soát)
  var CALC_NOTE = "Tỷ trọng, số trung gian tính từ số liệu trên báo cáo.";

  function get(p) {
    return p.split(".").reduce(function (o, k) { return o == null ? undefined : o[k]; }, D);
  }
  function v(p, d, s, extra) {
    return '<span data-v="' + p + '" data-d="' + (d == null ? 3 : d) + '"' + (s ? ' data-s="' + s + '"' : "") + (extra || "") + "></span>";
  }
  function t(p) { return '<span data-t="' + p + '"></span>'; }
  function chip(src, kind) {
    var cls = kind === "hp" || /^Hòa Phát/.test(src) ? "src hp" : /^Bài/.test(src) ? "src bai" : "src";
    return '<span class="' + cls + '">' + src + "</span>";
  }
  function calcNote() { return '<span class="calc-note">' + CALC_NOTE + "</span>"; }
  var BAI = function (m) { return chip("Bài, mục " + m, "bai"); };
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
    return '<svg class="g-pipe' + (opts.mini ? " mini" : "") + '" viewBox="0 0 760 316" role="img" aria-label="BQLDA hạch toán vốn: chủ đầu tư cấp vốn qua TK 336, tập hợp vào TK 241, quyết toán bàn giao cho chủ đầu tư, không xác định lãi lỗ.">' +
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
      (opts.noPct ? "" : '<rect class="water" x="396" y="' + (tankY + tankH - water) + '" width="122" height="' + (water - 2) + '" rx="10" fill="url(#gw' + id + ')"/>') +
      '<text x="457" y="30" class="t-h" text-anchor="middle">TK 241</text>' +
      (opts.mini ? (opts.noPct ? "" : '<text x="457" y="' + (tankY + tankH - 30) + '" class="t-w big keep" text-anchor="middle"><tspan data-v="bq.b03.tyLe" data-d="1"></tspan>%</text>') :
        (opts.noPct ? '<text x="457" y="' + (tankY + tankH / 2 - 6) + '" class="t-s b" text-anchor="middle">Chi phí</text><text x="457" y="' + (tankY + tankH / 2 + 16) + '" class="t-s b" text-anchor="middle">đầu tư</text><text x="457" y="' + (tankY + tankH / 2 + 38) + '" class="t-s b" text-anchor="middle">xây dựng</text>' :
        '<text x="457" y="' + (tankY + tankH - 44) + '" class="t-w big" text-anchor="middle"><tspan data-v="bq.b03.tyLe" data-d="1"></tspan>%</text><text x="457" y="' + (tankY + tankH - 18) + '" class="t-w sm" text-anchor="middle"><tspan data-v="bq.b03.luyKe" data-d="3"></tspan> tỷ</text>')) +
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
    return '<svg class="g-loop' + (opts.mini ? " mini" : "") + '" viewBox="0 0 640 372" role="img" aria-label="Doanh nghiệp hạch toán kết quả: vốn, đầu tư và sản xuất, doanh thu, kết quả, lợi nhuận giữ lại rồi trở lại vốn; trọng tâm là lãi, lỗ.">' +
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
        '<span class="wf-track"><span class="wf-bar"' + tip("<b>" + r.s.lab + "</b><br>" + val + " " + (cfg.unit || "tỷ đồng") + (r.s.dong ? "<br>" + v(r.s.p, 0, "dong") + " đồng" : "") + "<br>" + chip(r.s.src || cfg.src)) +
        ' style="left:' + ((lo / max) * 100).toFixed(2) + "%;width:" + Math.max(0.5, ((hi - lo) / max) * 100).toFixed(2) + '%"></span></span>' +
        '<span class="wf-val">' + val + "</span></div>";
    });
    html += "</div>";
    el.innerHTML = (cfg.title ? '<p class="viz-sub">' + cfg.title + "</p>" : "") + html +
      '<p class="viz-foot">' + (cfg.unit || "Tỷ đồng") + ". " + (cfg.note || "") + " " + chip(cfg.src, cfg.bq ? "" : "hp") + (rows.some(function (r) { return r.s.calc; }) ? " " + calcNote() : "") + "</p>";
  }

  // Thanh xếp chồng ngang. segs: {lab, p, d, s, cls, calc, src}; total: tổng để tính bề rộng
  function stack(el, cfg) {
    var tot = cfg.total;
    var html = '<div class="stk-track" role="img" aria-label="' + cfg.aria + '">';
    cfg.segs.forEach(function (s) {
      var x = cfg.bq ? bqVal(s.p) : get(s.p);
      var w = (x / tot) * 100;
      html += '<span class="stk-seg ' + s.cls + (w < 12 ? " narrow" : "") + '" style="--w:' + w.toFixed(2) + '%"' +
        tip("<b>" + s.lab + "</b><br>" + v(s.p, s.d, s.s) + " " + (cfg.unit || "tỷ đồng") + (s.pct ? " · " + v(s.pct, 1) + "%" : "") + "<br>" + chip(s.src || cfg.src)) +
        "><span>" + (s.pct ? v(s.pct, 1) + "%" : cfg.unit === "%" ? v(s.p, s.d) + "%" : "") + "</span></span>";
    });
    html += "</div><div class=\"stk-key\">" + cfg.segs.map(function (s) {
      return '<span><i class="' + s.cls + '"></i>' + s.lab + ": <b>" + v(s.p, s.d, s.s) + (cfg.unit === "%" ? "%" : "") + "</b>" + (s.pct ? " (" + v(s.pct, 1) + "%)" : "") + "</span>";
    }).join("") + "</div>";
    var anyCalc = cfg.segs.some(function (s) { return s.calc || s.pctCalc; });
    el.innerHTML = (cfg.title ? '<p class="viz-sub">' + cfg.title + "</p>" : "") + html +
      (cfg.noFoot ? "" : '<p class="viz-foot">' + (cfg.foot ? cfg.foot + " " : "") + chip(cfg.src, cfg.bq ? "" : "hp") + (anyCalc ? " " + calcNote() : "") + "</p>");
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
    rects.forEach(function (r, k) {
      var big = r.w * r.h > 380;
      html += '<div class="tm-cell ' + r.it.cls + (big ? "" : " small") + '" data-k="' + k + '" style="left:' + r.x + "%;top:" + (r.y / H) * 100 + "%;width:" + r.w + "%;height:" + (r.h / H) * 100 + '%"' +
        tip("<b>" + r.it.lab + "</b><br>" + v(r.it.p, r.it.d, r.it.s) + " " + (cfg.unit || "tỷ đồng") + (r.it.note ? "<br>" + r.it.note : "") + "<br>" + chip(r.it.src || cfg.src)) + ">" +
        (big ? "<b>" + r.it.lab + "</b><span>" + v(r.it.p, r.it.d, r.it.s) + "</span>" + (r.it.note ? "<em>" + r.it.note + "</em>" : "") : "") + "</div>";
    });
    html += "</div>";
    // chú giải có đủ các ô; ô đủ chỗ ghi chữ bên trong thì ẩn dòng chú giải của nó (fitTreemaps)
    el.innerHTML = (cfg.title ? '<p class="viz-sub">' + cfg.title + "</p>" : "") + html +
      '<div class="stk-key tm-key">' + rects.map(function (r, k) { return '<span data-k="' + k + '"' + (r.w * r.h > 380 ? " hidden" : "") + '><i class="' + r.it.cls + '"></i>' + r.it.lab + ": <b>" + v(r.it.p, r.it.d, r.it.s) + "</b></span>"; }).join("") + "</div>" +
      '<p class="viz-foot">' + (cfg.unit || "Tỷ đồng") + ". " + chip(cfg.src, cfg.bq ? "" : "hp") + (cfg.items.some(function (i) { return i.calc || i.pctCalc; }) ? " " + calcNote() : "") + "</p>";
  }

  // Ô treemap nào không đủ chỗ cho chữ (màn hẹp, phông rộng) thì bỏ chữ trong ô, hiện dòng chú giải bên dưới.
  function fitTreemaps() {
    doc.querySelectorAll(".tm").forEach(function (tm) {
      var key = tm.parentNode.querySelector(".tm-key");
      if (!key || !tm.offsetWidth) return;
      tm.querySelectorAll(".tm-cell:not(.small)").forEach(function (c) {
        c.classList.remove("clip");
        var over = c.scrollHeight > c.clientHeight + 1 || c.scrollWidth > c.clientWidth + 1;
        c.classList.toggle("clip", over);
        var leg = key.querySelector('[data-k="' + c.getAttribute("data-k") + '"]');
        if (leg) leg.hidden = !over;
      });
    });
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

  // Sơ đồ dòng (Sankey đơn giản): nhiều nhánh → một đích ("in") hoặc một nguồn → nhiều đích ("out").
  // Mỗi nhánh là một thanh mảnh có chiều cao tỷ lệ (tối thiểu MINB px); nhãn đặt ngoài dải luồng, cách nhau
  // ít nhất một dòng chữ, nối với thanh bằng đường dẫn nhỏ. Thứ tự cố định theo giá trị giảm dần.
  function flow(el, cfg) {
    var MINB = 6, GAP = 6, LH = 54, LG = 6;
    var items = cfg.items.slice().sort(function (a, b) { return (cfg.bq ? bqVal(b.p) : get(b.p)) - (cfg.bq ? bqVal(a.p) : get(a.p)); });
    var vals = items.map(function (it) { return cfg.bq ? bqVal(it.p) : get(it.p); });
    var tot = vals.reduce(function (a, b) { return a + b; }, 0);
    var n = items.length;
    var H = Math.max(cfg.height || 240, n * (LH + LG));
    var avail = H - GAP * (n - 1);
    var hs = vals.map(function (x) { return Math.max(MINB, (x / tot) * avail); });
    var k = avail / hs.reduce(function (a, b) { return a + b; }, 0);
    hs = hs.map(function (x) { return x * k; });
    var y = 0, ty = 0, bars = "", ribs = "", leads = "", labs = "", prevBottom = -LG;
    var out = cfg.dir === "out";
    items.forEach(function (it, i) {
      var th = (vals[i] / tot) * H;
      var y1 = y, y2 = y + hs[i], mid = (y1 + y2) / 2;
      bars += '<span class="flb ' + (it.cls || "") + '" style="top:' + y1 + "px;height:" + hs[i] + 'px"></span>';
      var a = out ? [0, ty, ty + th, 100, y1, y2] : [100, ty, ty + th, 0, y1, y2];
      ribs += '<path class="rib ' + (it.cls || "") + '" d="M' + a[0] + " " + a[1] + " C50 " + a[1] + " 50 " + a[4] + " " + a[3] + " " + a[4] + " L" + a[3] + " " + a[5] + " C50 " + a[5] + " 50 " + a[2] + " " + a[0] + " " + a[2] + 'Z"/>';
      var ly = Math.min(Math.max(mid - LH / 2, prevBottom + LG), H - (n - i) * (LH + LG) + LG);
      prevBottom = ly + LH;
      var lm = ly + LH / 2;
      leads += '<path d="M' + (out ? 0 : 100) + " " + mid + " C50 " + mid + " 50 " + lm + " " + (out ? 100 : 0) + " " + lm + '"/>';
      labs += '<div class="fll ' + (it.cls || "") + '" style="top:' + ly + "px;height:" + LH + 'px"' +
        tip("<b>" + it.lab + "</b><br>" + v(it.p, it.d, it.s) + " tỷ đồng" + (it.pct ? " · " + v(it.pct, 1) + "%" : "") + (it.dong ? "<br>" + v(it.p, 0, "dong") + " đồng" : "") + "<br>" + chip(it.src || cfg.src)) +
        '><i></i><span><b>' + it.lab + "</b><em>" + v(it.p, it.d, it.s) + (it.pct ? " · " + v(it.pct, 1) + "%" : "") + "</em></span></div>";
      y += hs[i] + GAP;
      ty += th;
    });
    var target = '<div class="fl-target ' + (cfg.side || "") + '" style="height:' + H + 'px"><b>' + cfg.target[0] + "</b><span>" + cfg.target[1] + "</span></div>";
    var ribSvg = '<svg class="fl-rib" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none" style="height:' + H + 'px">' + ribs + "</svg>";
    var barCol = '<div class="fl-bars" style="height:' + H + 'px">' + bars + "</div>";
    var leadSvg = '<svg class="fl-lead" viewBox="0 0 100 ' + H + '" preserveAspectRatio="none" style="height:' + H + 'px">' + leads + "</svg>";
    var labCol = '<div class="fl-labs" style="height:' + H + 'px">' + labs + "</div>";
    var parts = out ? [target, ribSvg, barCol, leadSvg, labCol] : [labCol, leadSvg, barCol, ribSvg, target];
    el.innerHTML = (cfg.title ? '<p class="viz-sub">' + cfg.title + "</p>" : "") +
      '<div class="fl2 ' + (out ? "out " : "in ") + (cfg.side || "") + '" role="img" aria-label="' + cfg.aria + '">' + parts.join("") + "</div>" +
      (cfg.foot ? '<p class="viz-foot">' + cfg.foot + "</p>" : "");
  }

  /* ---------- Hình theo tiểu mục ----------
   * [data-viz="k"]       : hình chính của lớp trình bày (đúng một hình)
   * [data-viz="k-more"]  : hình phụ, nằm trong lớp chi tiết
   * Tiêu đề hình (.viz-title) được main.js đánh mã "Minh họa x-A ... (minh họa)". */
  var V = {};
  function slot(key) { return doc.querySelector('[data-viz="' + key + '"]'); }
  function put(key, html) {
    var el = slot(key);
    if (el) el.innerHTML = html;
    return el;
  }
  function title(t) { return '<p class="viz-title">' + t + "</p>"; }
  function splitWrap(l, r, heads) {
    heads = heads || ["BQLDA · TT 195/2012 · Đồng Bằng 2015", "Doanh nghiệp · TT 200/2014 · Hòa Phát 2024"];
    return '<div class="vsplit"><div class="split-head"><span class="bq">' + ic("i-pipe") + heads[0] + '</span><span class="vs">so với</span><span class="dn">' + ic("i-loop") + heads[1] + '</span></div><div class="vsplit-body"><div class="vs-l">' + l + '</div><div class="vs-r">' + r + "</div></div></div>";
  }
  var H2 = ["BQLDA · TT 195/2012", "Doanh nghiệp · TT 200/2014"];

  // 1.1.1: năm đặc điểm → hệ quả (Bảng 1.1, dạng sơ đồ)
  V["1-1-1"] = function () {
    var rows = [
      ["i-target2", "Có mục tiêu rõ ràng", "Mỗi dự án nhằm tạo ra một công trình, sản phẩm hoặc dịch vụ cụ thể.", "Tập hợp chi phí theo từng dự án để đối chiếu với mục tiêu và tổng mức đầu tư."],
      ["i-calendar", "Có thời hạn xác định", "Có điểm bắt đầu và kết thúc, thường kéo dài nhiều năm.", "Theo dõi lũy kế từ khởi công đến khi hoàn thành, không chỉ theo từng năm tài chính."],
      ["i-unique", "Mang tính duy nhất", "Mỗi dự án khác nhau về quy mô, địa điểm, thiết kế.", "Mở sổ chi tiết riêng theo dự án, công trình, hạng mục công trình."],
      ["i-wallet", "Nguồn lực giới hạn", "Vốn, nhân lực, thời gian bị ràng buộc bởi kế hoạch được duyệt.", "Kiểm soát chi theo dự toán, kế hoạch vốn và hợp đồng."],
      ["i-alert", "Có tính bất định, rủi ro", "Giá cả, tiến độ, điều kiện thi công có thể thay đổi.", "Theo dõi điều chỉnh dự toán, chi phí phát sinh, thiệt hại và khoản không được duyệt quyết toán."]
    ];
    put("1-1-1", title("Đặc điểm của dự án và hệ quả đối với kế toán") + '<div class="feat">' + rows.map(function (r) {
      return '<div class="feat-row"><div class="feat-a">' + ic(r[0]) + "<b>" + r[1] + "</b><span>" + r[2] + '</span></div><span class="feat-arrow">' + ic("i-arrow-r") + '</span><div class="feat-b"><span class="tagc t-co">Hệ quả đối với kế toán</span>' + r[3] + "</div></div>";
    }).join("") + "</div>");
  };

  // 1.1.2: sơ đồ nan hoa (Bảng 1.2, dạng sơ đồ)
  V["1-1-2"] = function () {
    var spokes = [
      ["Theo nguồn vốn", "Vốn ngân sách nhà nước (đầu tư công); vốn ODA, vay ưu đãi; vốn tín dụng nhà nước; vốn doanh nghiệp; vốn tư nhân; vốn hỗn hợp.", "Quyết định cơ chế cấp vốn, thanh toán, kiểm soát chi và hình thức quyết toán."],
      ["Theo quy mô, tính chất", "Dự án quan trọng quốc gia; dự án nhóm A, B, C.", "Quyết định cấp phê duyệt, mức độ thẩm định và yêu cầu báo cáo."],
      ["Theo lĩnh vực", "Dân dụng, công nghiệp, giao thông, nông nghiệp – thủy lợi, công nghệ thông tin…", "Quyết định cơ cấu chi phí (thiết bị, đền bù, tái định cư…)."],
      ["Theo tính chất đầu tư", "Đầu tư mới, mở rộng, cải tạo – nâng cấp.", "Ảnh hưởng đến việc xác định giá trị tài sản hình thành qua đầu tư."],
      ["Theo chủ thể quản lý", "Chủ đầu tư trực tiếp quản lý; BQLDA chuyên ngành, khu vực; thuê tư vấn quản lý dự án.", "Quyết định đơn vị nào tổ chức kế toán và áp dụng chế độ kế toán nào."]
    ];
    put("1-1-2", title("Các tiêu thức phân loại dự án") + '<div class="spoke"><div class="spoke-wheel">' +
      '<div class="spoke-hub">Dự án</div>' + spokes.map(function (s, i) {
        return '<button type="button" class="spoke-n' + (i === 4 ? " key" : "") + '" style="--i:' + i + '" data-spoke="' + i + '" aria-pressed="' + (i === 4) + '">' + s[0] + "</button>";
      }).join("") + '</div><div class="spoke-info" aria-live="polite">' + spokes.map(function (s, i) {
        return '<div class="spoke-p" data-spoke-p="' + i + '"' + (i === 4 ? "" : " hidden") + '><b>' + s[0] + '</b><p><span class="tagc t-co">Các loại dự án</span> ' + s[1] + '</p><p><span class="tagc t-ts">Ý nghĩa đối với kế toán</span> ' + s[2] + "</p></div>";
      }).join("") + "</div></div>");
  };

  // 1.1.3: hai làn (Hình 1.1, dạng vẽ lại)
  V["1-1-3"] = function () {
    var g = [["GIAI ĐOẠN 1", "Chuẩn bị đầu tư"], ["GIAI ĐOẠN 2", "Thực hiện đầu tư"], ["GIAI ĐOẠN 3", "Kết thúc xây dựng, đưa vào khai thác"]];
    var ql = [["Nghiên cứu sự cần thiết và quy mô đầu tư", "Lập báo cáo nghiên cứu tiền khả thi, khả thi", "Thẩm định, phê duyệt chủ trương và quyết định đầu tư"], ["Giải phóng mặt bằng, lựa chọn nhà thầu, ký hợp đồng", "Thi công xây lắp, mua sắm và lắp đặt thiết bị", "Giám sát, nghiệm thu khối lượng từng giai đoạn"], ["Nghiệm thu, bàn giao công trình", "Chạy thử, vận hành thử, bảo hành", "Đưa dự án vào khai thác, sử dụng"]];
    var kt = [["Mở sổ chi tiết theo dõi chi phí chuẩn bị đầu tư", "Theo dõi dự toán, kế hoạch vốn được giao", "Lập chứng từ, hồ sơ ban đầu theo từng dự án"], ["Tiếp nhận, quản lý và thanh toán vốn đầu tư", "Hạch toán chi phí xây lắp, thiết bị, tư vấn, quản lý dự án", "Theo dõi tạm ứng, thanh toán với nhà thầu"], ["Lập báo cáo quyết toán vốn đầu tư dự án hoàn thành", "Xác định giá trị tài sản hình thành, bàn giao", "Lập báo cáo tài chính, lưu trữ hồ sơ"]];
    put("1-1-3", title("Chu trình dự án và nhiệm vụ của kế toán ở từng giai đoạn") + '<div class="swim"><div class="swim-h"></div>' +
      g.map(function (x, i) { return '<div class="swim-h st' + i + (i === 1 ? " hot" : "") + '"><small>' + x[0] + "</small><b>" + x[1] + "</b></div>"; }).join("") +
      '<div class="swim-lab">Công việc quản lý dự án</div>' + ql.map(function (l, i) { return '<ul class="swim-c' + (i === 1 ? " hot" : "") + '">' + l.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }).join("") +
      '<div class="swim-lab acc">Nhiệm vụ của kế toán dự án</div>' + kt.map(function (l, i) { return '<ul class="swim-c acc' + (i === 1 ? " hot" : "") + '">' + l.map(function (x) { return "<li>" + x + "</li>"; }).join("") + "</ul>"; }).join("") + "</div>");
  };

  // 1.1.4: bảy nhiệm vụ, năm yêu cầu (dạng sơ đồ)
  V["1-1-4"] = function () {
    var tasks = [["i-book", "Tổ chức chứng từ, tài khoản, sổ", "Chi tiết theo dự án, công trình, hạng mục công trình"], ["i-pipe", "Phản ánh nguồn vốn", "Nguồn vốn đầu tư nhận được (kể cả lũy kế từ khởi công) và việc sử dụng vốn"], ["i-layers", "Tập hợp chi phí đầu tư", "Xây dựng, thiết bị, bồi thường – hỗ trợ – tái định cư, quản lý dự án, tư vấn, chi phí khác"], ["i-check", "Kiểm tra, giám sát", "Dự toán, định mức, hợp đồng và chế độ thanh toán; phát hiện chi sai, chi vượt"], ["i-users", "Theo dõi công nợ", "Thanh toán với nhà thầu, nhà cung cấp và các đơn vị nội bộ"], ["i-file", "Lập báo cáo", "BCTC, báo cáo quyết toán vốn đầu tư dự án hoàn thành; xác định giá trị tài sản hình thành để bàn giao"], ["i-share", "Cung cấp thông tin", "Chủ đầu tư, cơ quan cấp vốn, tổ chức tài trợ hoặc cho vay, cơ quan quản lý nhà nước"]];
    var req = ["Trung thực, đầy đủ, chính xác", "Kịp thời", "Rõ ràng, dễ hiểu, có thể so sánh", "Chi tiết theo từng dự án, nguồn vốn, nội dung chi phí", "Tuân thủ chế độ kế toán và quy định quản lý đầu tư xây dựng"];
    put("1-1-4", title("Nhiệm vụ và yêu cầu đối với kế toán dự án") + '<div class="tasks">' + tasks.map(function (x, i) {
      return '<div class="task"><span class="task-n">' + (i + 1) + "</span>" + ic(x[0]) + "<b>" + x[1] + "</b><span>" + x[2] + "</span></div>";
    }).join("") + '</div><div class="reqs">' + req.map(function (r) { return '<span class="req">' + ic("i-check") + r + "</span>"; }).join("") + "</div>");
  };

  // 1.2.2 / 1.2.3: cây tài khoản và bộ báo cáo
  // danh sách báo cáo: mã, tên đầy đủ (theo tiêu đề biểu), chức năng (bài, mục 2.1.2); x[3] = báo cáo chính
  function rlist(side, rows) {
    return '<ul class="rlist ' + side + '">' + rows.map(function (x) {
      return '<li class="' + (x[3] ? "rl-main" : "rl-extra") + '"><span class="rl-code">' + x[0] + '</span><span class="rl-t"><b>' + x[1] + "</b>" + (x[2] ? "<small>" + x[2] + "</small>" : "") + "</span></li>";
    }).join("") + "</ul>";
  }
  function tree195(short) {
    return '<div class="atree bq"><p class="atree-h">' + ic("i-pipe") + "Hệ thống tài khoản Thông tư 195</p><ul>" +
      '<li><b>TK 241</b><span class="ren"><svg class="ic ar" role="img" aria-label="sang"><use href="#i-arrow-r"/></svg> “Chi phí đầu tư xây dựng”</span></li>' +
      '<li><b>TK 154</b><span class="ren"><svg class="ic ar" role="img" aria-label="sang"><use href="#i-arrow-r"/></svg> “Chi phí sản xuất thử dở dang”</span></li>' +
      '<li><b>TK 642</b><span class="ren"><svg class="ic ar" role="img" aria-label="sang"><use href="#i-arrow-r"/></svg> “Chi phí Ban quản lý dự án đầu tư”</span></li>' +
      '<li><b>TK 336</b> “Phải trả nội bộ” <span class="ren">thêm bốn tài khoản cấp 2</span><ul><li>Vốn đầu tư xây dựng</li><li>Chênh lệch tỷ giá</li><li>Chi phí đi vay đủ điều kiện vốn hóa</li><li>Phải trả nội bộ khác</li></ul></li></ul>' +
      '<p class="atree-h">Báo cáo tài chính</p>' + rlist(short ? "bq short" : "bq", [
        ["B01-CĐT", "Bảng cân đối kế toán", "Tài sản và nguồn vốn của Ban tại thời điểm cuối kỳ", 1],
        ["B02-CĐT", "Nguồn vốn đầu tư", "Hình thành và biến động của nguồn vốn đầu tư", 1],
        ["B03-CĐT", "Thực hiện đầu tư xây dựng", "Thực hiện đầu tư xây dựng theo nội dung chi phí (TK 241)", 1],
        ["B04-CĐT", "Thuyết minh báo cáo tài chính", "Thuyết minh bổ sung cho các chỉ tiêu trên báo cáo", 1],
        ["F02-CĐT", "Chi tiết nguồn vốn đầu tư", "Chi tiết theo từng nguồn hình thành"],
        ["F03A-CĐT", "Thực hiện đầu tư theo dự án, công trình, hạng mục công trình", "Chi tiết theo dự án, công trình, hạng mục"],
        ["F03B-CĐT", "Quyết toán vốn đầu tư theo dự án, công trình, hạng mục công trình hoàn thành bàn giao sử dụng", "Quyết toán vốn đầu tư công trình, hạng mục hoàn thành bàn giao"],
        ["F03C-CĐT", "Chi phí khác", "Chi phí khác"],
        ["F03D-CĐT", "Chi phí Ban quản lý dự án đầu tư", "Chi phí Ban quản lý dự án"]]) +
      '<p class="tiny muted">-CĐT · nộp quý ' + v("thoiHan.bq.quy", 0) + " ngày, năm " + v("thoiHan.bq.nam", 0) + " ngày</p></div>";
  }
  function tree200() {
    return '<div class="atree dn"><p class="atree-h">' + ic("i-loop") + "Hệ thống tài khoản Thông tư 200</p><ul>" +
      "<li><b>Loại 1 đến 9</b> trong bảng, <b>loại 0</b> ngoài bảng</li>" +
      '<li><b>TK 241</b><span class="ren">“Xây dựng cơ bản dở dang”</span><ul><li>2411 · 2412 · 2413</li></ul></li>' +
      "<li><b>TK 411, 421, 511, 632, 641, 642, 911…</b></li></ul>" +
      '<p class="atree-h">Báo cáo tài chính năm</p>' + rlist("dn", [
        ["B01-DN", "Bảng cân đối kế toán", "", 1], ["B02-DN", "Báo cáo kết quả hoạt động kinh doanh", "", 1],
        ["B03-DN", "Báo cáo lưu chuyển tiền tệ", "", 1], ["B09-DN", "Bản thuyết minh báo cáo tài chính", "", 1]]) +
      '<p class="tiny muted">Có thêm báo cáo tài chính giữa niên độ.</p>' +
      '<p class="tiny muted">-DN · nộp quý ' + v("thoiHan.dn.quy", 0) + " ngày, năm " + v("thoiHan.dn.nam", 0) + " ngày</p></div>";
  }
  V["1-2-2"] = function () { put("1-2-2", title("Hệ thống tài khoản và báo cáo tài chính theo Thông tư 195") + tree195()); };
  V["1-2-3"] = function () { put("1-2-3", title("Hệ thống tài khoản và báo cáo tài chính của hai chế độ") + splitWrap(tree195(true), tree200(), H2)); };

  // 1.2.4: ba lựa chọn (Hình 1.2, dựng lại bằng chữ thật; tên lựa chọn là heading)
  V["1-2-4"] = function () {
    var cdtBc = "B01-CĐT Bảng cân đối kế toán; B02-CĐT Nguồn vốn đầu tư; B03-CĐT Thực hiện đầu tư xây dựng; B04-CĐT Thuyết minh báo cáo tài chính; kèm các phụ biểu (mã F02, F03A, F03B, F03C, F03D-CĐT)";
    var m = [
      ["A", "Ban quản lý dự án (có tổ chức kế toán riêng)", "bq", ["Áp dụng Thông tư 195/2012/TT-BTC", "Báo cáo tài chính: " + cdtBc]],
      ["B", "Chủ đầu tư có thành lập Ban quản lý dự án", "dn", ["Áp dụng chế độ kế toán doanh nghiệp (Thông tư 200/2014/TT-BTC)", "Bổ sung TK cấp 2 của TK 136 (1362, 1363) theo Thông tư 195", "Nhận, tổng hợp báo cáo tài chính của BQLDA"]],
      ["C", "Chủ đầu tư không thành lập BQLDA", "dn", ["Hạch toán chung hệ thống sổ của doanh nghiệp (Thông tư 200/2014, TK 241)", "Mở sổ chi tiết theo dự án", "Lập thêm B02-CĐT (Nguồn vốn đầu tư: hình thành và biến động của nguồn vốn đầu tư), B03-CĐT (Thực hiện đầu tư xây dựng: thực hiện đầu tư theo nội dung chi phí TK 241) và 4 phụ biểu"]]
    ];
    put("1-2-4", title("Lựa chọn chế độ kế toán theo mô hình tổ chức thực hiện dự án") + '<div class="dtree"><div class="dtree-root">Đơn vị thực hiện dự án đầu tư (doanh nghiệp / chủ đầu tư)</div><div class="dtree-opts">' +
      m.map(function (x) {
        return '<div class="dtree-col ' + x[2] + '"><h3 class="dtree-h" id="m-1-2-4-' + x[0].toLowerCase() + '"><span class="dtree-k">' + x[0] + "</span>" + x[1] + '</h3><ul class="ticks' + (x[2] === "dn" ? " dn" : "") + '">' + x[3].map(function (y) { return "<li>" + y + "</li>"; }).join("") + "</ul></div>";
      }).join("") + '</div><div class="dtree-foot">Nội dung chưa được hướng dẫn riêng <svg class="ic ar" role="img" aria-label="sang"><use href="#i-arrow-r"/></svg> thực hiện theo Luật Kế toán và chế độ kế toán doanh nghiệp (Thông tư 200/2014)</div></div>');
  };

  // 1.3.1: cùng gốc
  V["1-3-1"] = function () {
    put("1-3-1", title("Phạm vi so sánh: hai chế độ cùng “gốc”") + '<div class="root3"><div class="root3-top">Chế độ kế toán doanh nghiệp<br><small>(khi Thông tư 195 ban hành: Quyết định 15/2006/QĐ-BTC)</small></div><div class="root3-arms"><div class="arm bq">' + ic("i-pipe") + "<b>(i) Kế toán của BQLDA theo Thông tư 195/2012/TT-BTC</b><span>Phần dành cho chủ đầu tư là doanh nghiệp và BQLDA của doanh nghiệp.</span></div>" +
      '<div class="arm dn">' + ic("i-loop") + "<b>(ii) Kế toán của doanh nghiệp theo Thông tư 200/2014/TT-BTC</b><span>Khác biệt nằm ở mục đích, tài khoản đặc thù, nghiệp vụ và báo cáo, không nằm ở các nguyên tắc kế toán cơ bản.</span></div></div><div class=\"root3-out\">" + ic("i-x") + " Ngoài phạm vi so sánh: kế toán BQLDA thuộc đơn vị hành chính sự nghiệp, thuế và kiểm toán</div></div>");
  };

  // 1.3.2: Hình 1.3 vẽ lại (đánh số bước) và Bảng 1.5 dạng chữ T
  V["1-3-2-flow"] = function () {
    put("1-3-2-flow", title("Dòng hạch toán của BQLDA và doanh nghiệp theo từng bước") +
      splitWrap(pipeSVG({ steps: true, id: "s" }), loopSVG({ steps: true, id: "s" }), H2));
  };
  V["1-3-2-t"] = function () {
    var steps = ["1. Nhận nguồn vốn 2.000", "2. Nghiệm thu xây lắp 1.000", "3. Lương nhân viên quản lý 50", "4. Hoàn thành, bàn giao"];
    function side(k) {
      return '<div class="tgrid">' + D.tAcc[k].tk.map(function (tk) {
        return '<div class="tacc" data-tk="' + tk + '"><b>TK ' + tk + '</b><div class="tacc-t"><span class="no"></span><span class="co"></span></div></div>';
      }).join("") + "</div>";
    }
    put("1-3-2-t", title("Số dư tài khoản sau từng nghiệp vụ của Bảng 1.5 (triệu đồng)") +
      '<div class="tctl"><input type="range" min="1" max="4" step="1" value="1" id="tRange" aria-label="Chọn bước nghiệp vụ"><div class="tsteps">' + steps.map(function (s, i) { return '<button type="button" data-tstep="' + (i + 1) + '">' + s + "</button>"; }).join("") + "</div></div>" +
      splitWrap(side("bq"), side("dn"), H2) +
      '<div class="tres"><div class="tres-b bq">' + ic("i-pipe") + '<b>Không ghi nhận lãi, lỗ</b><span>Quyết toán được duyệt: Nợ TK 336 / Có TK 241: ' + v("viDu.banGiaoBq", 0) + ".</span></div>" +
      '<div class="tres-b dn">' + ic("i-loop") + "<b>Chi phí " + v("viDu.chiPhiKy", 0) + " nằm trong lãi, lỗ của kỳ</b><span>Nhận tài sản đưa vào sử dụng: Nợ TK 211 / Có TK 241: " + v("viDu.banGiaoDn", 0) + ".</span></div></div>" +
      '<p class="viz-foot">Số dư cộng dồn từ các bút toán của Bảng 1.5. ' + calcNote() + "</p>");
  };

  /* ---------- Chương 2 ---------- */
  V["2-1-1"] = function () {
    var dauY = get("bq.info.namBatDau"), cuoiY = get("bq.info.namKetThuc");
    var pos = function (y, m) { return (((y - dauY) * 12 + m) / ((cuoiY - dauY + 1) * 12)) * 100; };
    put("2-1-1", title("BQLDA Đồng Bằng: thời gian thực hiện, tiến độ vốn và nhân sự") + '<div class="prof">' +
      '<div class="prof-time"><p class="prof-h">Thời gian thực hiện ' + chip("B04 I.3 tr.5") + '</p><div class="ptl"><span class="ptl-bar"></span>' +
      [dauY, dauY + 1, dauY + 2, cuoiY].map(function (y) { return '<span class="ptl-y" style="left:' + pos(y, 0) + '%">' + y + "</span>"; }).join("") +
      '<span class="ptl-m a" style="left:' + pos(2013, 2) + '%"' + tip("<b>Thành lập Ban</b><br>Quyết định " + t("bq.info.quyetDinh") + " ngày " + t("bq.info.ngayThanhLap") + "<br>" + chip("B04 I.1 tr.5")) + "><i></i>Thành lập<br>" + t("bq.info.ngayThanhLap") + "</span>" +
      '<span class="ptl-m c" style="left:' + pos(2015, 12) + '%"><i></i>Kỳ báo cáo<br>31/12/2015</span></div></div>' +
      '<div class="prof-ring"' + tip("<b>Lũy kế vốn đầu tư thực hiện</b><br>" + v("bq.b03.luyKe", 3) + " / " + v("bq.b03.tongMuc", 0) + " tỷ đồng<br>" + chip("B03 mã 20–22 tr.4")) + '><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" class="rg-bg"/><circle cx="60" cy="60" r="48" class="rg-fg" style="--p:' + get("bq.b03.tyLe") + '"/></svg><b><span data-v="bq.b03.tyLe" data-d="1"></span>%</b><span>' + v("bq.b03.luyKe", 3) + " / " + v("bq.b03.tongMuc", 0) + " tỷ</span>" + chip("B03 tr.4") + "</div>" +
      '<div class="prof-staff"><p class="prof-h">Cán bộ, nhân viên bình quân ' + chip("B04 I.4 tr.5") + '</p><div class="pst"><span>2014</span><span class="pst-bar"><i style="--w:' + (get("bq.info.nhanSu2014") / get("bq.info.nhanSu2015")) * 100 + '%"></i></span><b>' + v("bq.info.nhanSu2014", 0) + ' người</b></div><div class="pst"><span>2015</span><span class="pst-bar"><i style="--w:100%"></i></span><b>' + v("bq.info.nhanSu2015", 0) + " người</b></div></div></div>");
  };

  // 2.1.2: Bảng 2.2 dạng cột 100%
  V["2-1-2"] = function () {
    var hpSrc = "Bài, mục 2.1.2";
    function col(side, ttl, segs, aria) {
      return '<div class="c100"><p class="c100-h">' + ttl + '</p><div class="c100-bar" role="img" aria-label="' + aria + '">' + segs.map(function (s) {
        return '<span class="c100-s ' + s.cls + (get(s.pct) < 12 ? " thin" : "") + '" data-abs="' + s.abs + '" style="--h:' + get(s.pct) + '%"' + tip("<b>" + s.lab + "</b><br>" + v(s.p, s.d) + " tỷ đồng · " + v(s.pct, 1) + "%<br>" + chip(side === "bq" ? "B01 tr.2" : hpSrc)) + "><b>" + v(s.pct, 1) + "%</b><small>" + s.lab + "</small></span>";
      }).join("") + '</div><p class="c100-foot">' + segs.filter(function (s) { return get(s.pct) < 12; }).map(function (s) { return s.lab + " " + v(s.pct, 1) + "%"; }).join("") + "</p></div>";
    }
    var tH = get("hp.tongTS");
    var l = '<div class="c100-pair" data-side="bq">' +
      col("bq", "Tài sản", [{ lab: "Ngắn hạn", p: "bq.b01.tsnh", d: 3, pct: "bq.b01.pct.tsnh", cls: "t3", abs: get("bq.b01.tsnh") / 1e9 }, { lab: "Dài hạn", p: "bq.b01.tsdh", d: 3, pct: "bq.b01.pct.tsdh", cls: "t1", abs: get("bq.b01.tsdh") / 1e9 }], "BQLDA: tài sản ngắn hạn 6,0%, dài hạn 94,0%") +
      col("bq", "Nguồn vốn", [{ lab: "Nợ phải trả", p: "bq.b01.no", d: 3, pct: "bq.b01.pct.no", cls: "t3", abs: get("bq.b01.no") / 1e9 }, { lab: "Nguồn vốn đầu tư", p: "bq.b01.nvdt", d: 3, pct: "bq.b01.pct.nvdt", cls: "t1", abs: get("bq.b01.nvdt") / 1e9 }], "BQLDA: nợ phải trả 5,4%, nguồn vốn đầu tư 94,6%") + "</div>";
    var r = '<div class="c100-pair" data-side="dn">' +
      col("dn", "Tài sản", [{ lab: "Ngắn hạn", p: "hp.tsnh", d: 0, pct: "hp.pct.tsnh", cls: "d3", abs: get("hp.tsnh") }, { lab: "Dài hạn", p: "hp.tsdh", d: 0, pct: "hp.pct.tsdh", cls: "d1", abs: get("hp.tsdh") }], "Hòa Phát: tài sản ngắn hạn 38,6%, dài hạn 61,4%") +
      col("dn", "Nguồn vốn", [{ lab: "Nợ phải trả", p: "hp.no", d: 0, pct: "hp.pct.no", cls: "d3", abs: get("hp.no") }, { lab: "Vốn chủ sở hữu", p: "hp.vcsh", d: 0, pct: "hp.pct.vcsh", cls: "d1", abs: get("hp.vcsh") }], "Hòa Phát: nợ phải trả 48,9%, vốn chủ sở hữu 51,1%") + "</div>";
    put("2-1-2", '<div class="viz-bar">' + title("Cơ cấu Bảng cân đối kế toán của hai đơn vị (% tổng tài sản, tổng nguồn vốn)") + '<div class="seg" role="group" aria-label="Thang đo" data-scale-toggle><button type="button" data-scale="pct" aria-pressed="true">Tỷ trọng</button><button type="button" data-scale="abs" aria-pressed="false">Tuyệt đối</button></div></div>' +
      splitWrap(l, r) + '<p class="viz-foot">' + chip("B01 tr.2") + " " + chip(hpSrc, "bai") + '<span data-abs-note hidden> · Thang tuyệt đối dùng chung cho hai bên (tối đa ' + v("hp.tongTS", 0) + " tỷ đồng).</span></p>");
    var tg = doc.querySelector("[data-scale-toggle]");
    tg.addEventListener("click", function (e) {
      var b = e.target.closest("button");
      if (!b) return;
      var abs = b.getAttribute("data-scale") === "abs";
      tg.querySelectorAll("button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
      doc.querySelectorAll(".c100-s").forEach(function (s) {
        s.style.setProperty("--h", abs ? (parseFloat(s.getAttribute("data-abs")) / tH) * 100 + "%" : s.getAttribute("data-pct-h"));
      });
      doc.querySelector("[data-abs-note]").hidden = !abs;
    });
    doc.querySelectorAll(".c100-s").forEach(function (s) { s.setAttribute("data-pct-h", s.style.getPropertyValue("--h")); });
  };

  V["2-2-1"] = function () {
    put("2-2-1", title("Cơ cấu tài sản: các khoản mục lớn của hai bảng cân đối") + splitWrap('<div data-tm="bq"></div>', '<div data-tm="dn"></div>'));
    treemap(doc.querySelector('[data-tm="bq"]'), { bq: true, src: "B01 tr.2", aria: "Cơ cấu tài sản BQLDA: TK 241 chiếm 93,6% tổng tài sản", items: [
      { lab: "TK 241 chi phí đầu tư xây dựng dở dang", p: "bq.b01.tk241", d: 3, cls: "t1", note: v("bq.b01.pct.tk241", 1) + "% tổng tài sản" },
      { lab: "Tiền", p: "bq.b01.tien", d: 3, cls: "t2" }, { lab: "Trả trước cho người bán", p: "bq.b01.traTruoc", d: 3, cls: "t2" },
      { lab: "Thuế GTGT được khấu trừ", p: "bq.b01.gtgt", d: 3, cls: "t3" }, { lab: "Hàng tồn kho", p: "bq.b01.htk", d: 3, cls: "t3" },
      { lab: "TSCĐ hữu hình", p: "bq.b01.tscd", d: 3, cls: "t3" }, { lab: "Phải thu khác", p: "bq.b01.phaiThuKhac", d: 3, cls: "t3" }] });
    treemap(doc.querySelector('[data-tm="dn"]'), { src: "Hòa Phát tr.6, tr.7", aria: "Cơ cấu tài sản Hòa Phát: TSCĐ hữu hình, XDCB dở dang, hàng tồn kho, đầu tư tài chính, tiền, phải thu khách hàng và phần còn lại", items: [
      { lab: "TSCĐ hữu hình", p: "hp.tscdhh", d: 1, cls: "d1", note: v("hp.pct.tscd", 1) + "%", src: "Hòa Phát tr.7, tr.41, tm 11" }, { lab: "XDCB dở dang", p: "hp.xdcb", d: 1, cls: "d2", note: v("hp.pct.xdcb", 1) + "%", src: "Hòa Phát tr.7, tr.44" },
      { lab: "Hàng tồn kho", p: "hp.htk", d: 1, cls: "d2", note: v("hp.pct.htk", 1) + "%", src: "Hòa Phát tr.39, tm 10.1" }, { lab: "Đầu tư tài chính ngắn hạn", p: "hp.dauTuTC", d: 1, cls: "d3", src: "Hòa Phát tr.37, tm 6" },
      { lab: "Tiền", p: "hp.tien", d: 1, cls: "d3", src: "Hòa Phát tr.6, tr.36, tm 5" }, { lab: "Phải thu khách hàng", p: "hp.phaiThuKH", d: 1, cls: "d3", src: "Hòa Phát tr.37, tm 7" },
      { lab: "Tài sản khác", p: "calc.hpTsConLai", d: 1, cls: "d4", calc: true }] });
  };

  V["2-2-2"] = function () {
    put("2-2-2", title("Cơ cấu tài sản ngắn hạn của hai đơn vị") + splitWrap('<div data-stk="bq"></div>', '<div data-stk="dn"></div>'));
    stack(doc.querySelector('[data-stk="bq"]'), { bq: true, total: get("bq.b01.tsnh") / 1e9, src: "B01 tr.2", title: "BQLDA: " + v("bq.b01.tsnh", 3) + " tỷ đồng", aria: "Cơ cấu tài sản ngắn hạn BQLDA", segs: [
      { lab: "Tiền", p: "bq.b01.tien", d: 3, pct: "calc.bqTsnhTienPct", cls: "t1", pctCalc: true },
      { lab: "Trả trước cho người bán và phải thu khác", p: "calc.bqTsnhPhaiThu", d: 3, s: "ty", pct: "calc.bqTsnhPhaiThuPct", cls: "t2", pctCalc: true, src: "B01 mã 130 tr.2" },
      { lab: "Thuế GTGT được khấu trừ", p: "bq.b01.gtgt", d: 3, pct: "calc.bqTsnhGtgtPct", cls: "t4", pctCalc: true },
      { lab: "Hàng tồn kho", p: "bq.b01.htk", d: 3, pct: "calc.bqTsnhHtkPct", cls: "t3", pctCalc: true }] });
    stack(doc.querySelector('[data-stk="dn"]'), { total: get("hp.tsnh"), src: "Hòa Phát tr.6", title: "Hòa Phát: " + v("hp.tsnh", 0) + " tỷ đồng", aria: "Cơ cấu tài sản ngắn hạn Hòa Phát", segs: [
      { lab: "Hàng tồn kho", p: "hp.htk", d: 1, cls: "d1", src: "Hòa Phát tr.39, tm 10.1" }, { lab: "Đầu tư tài chính", p: "hp.dauTuTC", d: 1, cls: "d2", src: "Hòa Phát tr.37, tm 6" },
      { lab: "Tiền", p: "hp.tien", d: 1, cls: "d3", src: "Hòa Phát tr.6, tr.36, tm 5" }, { lab: "Phải thu khách hàng", p: "hp.phaiThuKH", d: 1, cls: "d5", src: "Hòa Phát tr.37, tm 7" },
      { lab: "Tài sản ngắn hạn khác", p: "calc.hpTsnhConLai", d: 1, cls: "d4", calc: true }] });
  };

  V["2-2-3"] = function () {
    put("2-2-3", title("TSCĐ hữu hình và nơi khấu hao đi đến") + splitWrap(
      '<div data-wf="tscd-bq"></div><div class="dflow bq"><p class="viz-sub">Khấu hao năm</p><span class="df-n">' + v("bq.b01.khauHaoNam", 3) + " tỷ</span>" + ic("i-arrow-r") + '<span class="df-n">TK 642</span>' + ic("i-arrow-r") + '<span class="df-n end">Giá trị công trình (TK 241)</span><span class="tagc t-ts">Vào tài sản</span>' + chip("B04 IV.3 tr.5; F03D mục 10") + "</div>",
      '<div data-wf="tscd-dn"></div><div class="dflow dn"><p class="viz-sub">Khấu hao và phân bổ (lưu chuyển tiền tệ)</p><span class="df-n">' + v("hp.khauHaoPhanBo", 1) + " tỷ</span>" + ic("i-arrow-r") + '<span class="df-n">Chi phí kỳ</span>' + ic("i-arrow-r") + '<span class="df-n end">Giảm lợi nhuận</span><span class="tagc t-ln">Vào lợi nhuận</span>' + chip("Hòa Phát tr.12, tr.61", "hp") + "</div>"));
    waterfall(doc.querySelector('[data-wf="tscd-bq"]'), { bq: true, src: "B04 V.06 tr.6", aria: "TSCĐ hữu hình BQLDA: nguyên giá trừ hao mòn lũy kế bằng giá trị còn lại", steps: [
      { lab: "Nguyên giá", p: "bq.b01.nguyenGia", d: 3, kind: "start" }, { lab: "Hao mòn lũy kế", p: "bq.b01.haoMon", d: 3, kind: "down" }, { lab: "Giá trị còn lại", p: "bq.b01.tscd", d: 3, kind: "total" }] });
    waterfall(doc.querySelector('[data-wf="tscd-dn"]'), { src: "Hòa Phát tr.41, tm 11", aria: "TSCĐ hữu hình Hòa Phát: nguyên giá trừ hao mòn lũy kế bằng giá trị còn lại", steps: [
      { lab: "Nguyên giá", p: "hp.nguyenGia", d: 1, kind: "start" }, { lab: "Hao mòn lũy kế", p: "hp.haoMon", d: 1, kind: "down" }, { lab: "Giá trị còn lại", p: "hp.tscdhh", d: 1, kind: "total" }] });
  };

  V["2-2-4"] = function () {
    put("2-2-4", title("Cơ cấu nợ phải trả của hai đơn vị") + splitWrap('<div data-stk="no-bq"></div>', '<div data-stk="no-dn"></div>'));
    stack(doc.querySelector('[data-stk="no-bq"]'), { bq: true, total: get("bq.b01.no") / 1e9, src: "B04 V.08 tr.6", title: "BQLDA: nợ phải trả " + v("bq.b01.no", 3) + " tỷ đồng", aria: "Nợ phải trả BQLDA: phải trả người bán và các khoản khác", segs: [
      { lab: "Phải trả người bán", p: "bq.b01.ptnb", d: 3, pct: "calc.bqNoPtnbPct", cls: "t1", pctCalc: true }, { lab: "Các khoản nợ khác", p: "calc.bqNoKhac", d: 3, s: "ty", pct: "calc.bqNoKhacPct", cls: "t3", calc: true }] });
    stack(doc.querySelector('[data-stk="no-dn"]'), { total: get("hp.no"), src: "Hòa Phát tr.8", foot: "BCTC hợp nhất Hòa Phát 31/12/2024, Bảng cân đối kế toán, mã 300; vay = mã 320 và mã 338.", title: "Hòa Phát: nợ phải trả " + v("hp.no", 0) + " tỷ đồng", aria: "Nợ phải trả Hòa Phát: vay ngân hàng và các khoản khác", segs: [
      { lab: "Vay ngân hàng", p: "hp.vay", d: 0, pct: "calc.hpNoVayPct", cls: "d1", pctCalc: true }, { lab: "Còn lại", p: "calc.hpNoKhac", d: 0, pct: "calc.hpNoKhacPct", cls: "d3", calc: true }] });
  };
  V["2-2-5"] = function () {
    put("2-2-5", title("Các tài khoản đầu 4: BQLDA không có, Hòa Phát có vốn cổ phần, quỹ, lợi nhuận chưa phân phối") + splitWrap(
      '<div class="empty4">' + ic("i-x") + "<b>Đầu 4 hoàn toàn trống</b><span>Không có vốn cổ phần, quỹ từ lợi nhuận, lợi nhuận chưa phân phối</span></div>" +
      '<div class="capline"><p class="viz-sub">Vốn của Ban (TK 3361) năm 2015</p><div class="cl-row"><span class="tagc t-tang">Tăng</span>Chủ đầu tư cấp thêm <b>+' + v("bq.b02.tang", 3) + ' tỷ</b></div><div class="cl-row"><span class="tagc t-giam">Giảm</span>Quyết toán, bàn giao <b>−' + v("bq.b02.giam", 3) + " tỷ</b></div>" + chip("B02 tr.3") + "</div>",
      '<div data-tm="eq-dn"></div>'));
    treemap(doc.querySelector('[data-tm="eq-dn"]'), { src: "Hòa Phát tr.55", aria: "Các khoản vốn chủ sở hữu Hòa Phát được bài nêu", items: [
      { lab: "Vốn cổ phần (TK 411)", p: "hp.vonCoPhan", d: 1, cls: "d1", src: "Hòa Phát tr.56, tm 27" }, { lab: "Lợi nhuận chưa phân phối", p: "hp.lnChuaPP", d: 0, cls: "d2", src: "Hòa Phát tr.9" }, { lab: "Quỹ đầu tư phát triển (TK 418)", p: "hp.quyDTPT", d: 1, cls: "d3", src: "Hòa Phát tr.9" }] });
  };

  V["2-2-6"] = function () {
    var steps = [
      ["Đầu 5 · Doanh thu", "Doanh thu thuần " + v("hp.dtt", 1) + " tỷ", "Không có doanh thu"],
      ["Đầu 6 · Chi phí", "Giá vốn " + v("hp.giaVon", 1) + "; bán hàng " + v("hp.cpBanHang", 1) + "; quản lý " + v("hp.cpQLDN", 1) + "; tài chính " + v("hp.cpTaiChinh", 1) + " tỷ", "TK 642 " + v("bq.f03d.ps2015", 3) + " tỷ, kết chuyển hết vào TK 241"],
      ["Đầu 7 · Thu nhập khác", v("hp.thuNhapKhac", 1) + " tỷ", "Không có"],
      ["Đầu 8 · Chi phí khác, thuế TNDN", "Chi phí khác " + v("hp.cpKhac", 1) + "; thuế TNDN " + v("hp.thueTNDN", 1) + " tỷ", "Thuế TNDN không phát sinh"],
      ["Đầu 9 · Xác định kết quả", "Lợi nhuận sau thuế " + v("hp.lnst", 1) + " tỷ", "Không xác định kết quả kinh doanh riêng"]
    ];
    var l = '<div class="ladder bq">' + steps.map(function (s, i) { return '<div class="ld-step' + (i === 1 ? "" : " empty") + '"><b>' + s[0] + "</b><span>" + (i === 1 ? "" : ic("i-x")) + s[2] + "</span></div>"; }).join("") + chip("B04 mục IV.7; F03D tr.12") + "</div>";
    var r = '<div class="ladder dn">' + steps.map(function (s) { return '<div class="ld-step"><b>' + s[0] + "</b><span>" + s[1] + "</span></div>"; }).join("") + chip("Hòa Phát tr.10", "hp") + "</div>";
    put("2-2-6", title("Các tài khoản đầu 5 đến đầu 9 ở hai đơn vị") + splitWrap(l, r));
  };
  V["2-2-7"] = function () {
    put("2-2-7", title("Các chỉ tiêu ngoài bảng (TK đầu 0)") + splitWrap(
      '<div class="tiles"><div class="tile"' + tip("<b>Ngoại tệ các loại (mã 007)</b><br>Cuối năm " + v("bq.b01.usdCuoi", 0) + " USD, đầu năm " + v("bq.b01.usdDau", 0) + " USD<br>" + chip("B01 tr.2")) + '><span class="tagc t-co">Có, trên B01-CĐT</span><b>' + v("bq.b01.usdCuoi", 0) + " USD</b><span>Ngoại tệ các loại (mã 007); đầu năm " + v("bq.b01.usdDau", 0) + ' USD</span><span class="mini-bars"><i style="--w:100%"></i><i style="--w:' + (get("bq.b01.usdCuoi") / get("bq.b01.usdDau")) * 100 + '%"></i></span></div><div class="tile"><span class="tagc t-co">Có dòng, không có số dư</span><b>Tài sản nhận giữ hộ</b><span>Mã 002</span></div></div>',
      '<div class="tiles"><div class="tile"><span class="tagc t-kh">Không có trên B01</span><b>' + v("hp.usd", 0) + " USD</b><span>Tương đương " + v("hp.usdTy", 1) + ' tỷ đồng, thuyết minh 5.1</span>' + chip("Hòa Phát tr.36, tm 5.1", "hp") + '</div><div class="tile"><span class="tagc t-kh">Không có dòng này</span><b>Tài sản nhận giữ hộ</b><span>Mẫu B01-DN/HN (hợp nhất)</span></div></div>'));
  };

  V["2-3-1"] = function () {
    put("2-3-1", title("Biến động vốn trong năm: TK 3361 của BQLDA và vốn chủ sở hữu của Hòa Phát") + splitWrap('<div data-wf="3361"></div>', '<div data-wf="vcsh"></div>'));
    waterfall(doc.querySelector('[data-wf="3361"]'), { bq: true, src: "B02 tr.3", aria: "Biến động TK 3361 năm 2015: đầu năm, cấp bằng tiền, cấp bằng vật tư thiết bị, quyết toán bàn giao, cuối năm", steps: [
      { lab: "Đầu năm", p: "bq.b02.dau", d: 3, kind: "start", dong: true }, { lab: "Cấp bằng tiền (mã 03)", p: "bq.b02.tangTien", d: 3, kind: "up", dong: true }, { lab: "Cấp bằng vật tư, thiết bị (mã 04)", p: "bq.b02.tangVatTu", d: 3, kind: "up", dong: true },
      { lab: "Quyết toán, bàn giao (mã 06)", p: "bq.b02.giam", d: 3, kind: "down", dong: true }, { lab: "Cuối năm", p: "bq.b02.cuoi", d: 3, kind: "total", dong: true }] });
    waterfall(doc.querySelector('[data-wf="vcsh"]'), { src: "Hòa Phát tr.55, tm 26", note: "Đầu năm theo B01 Hòa Phát (Hình 2.7). Các khoản làm tròn đến 0,1 tỷ; dòng cuối gộp biến động khác và chênh lệch làm tròn.", aria: "Biến động vốn chủ sở hữu Hòa Phát năm 2024 từ đầu năm đến cuối năm", steps: [
      { lab: "Đầu năm", p: "hp.vcshDauNam", d: 1, kind: "start", src: "Hòa Phát tr.9; Hình 2.7" }, { lab: "Lợi nhuận thuần", p: "hp.lnst", d: 1, kind: "up" }, { lab: "Cổ đông không kiểm soát góp vốn", p: "hp.gopVonCDKKS", d: 1, kind: "up" },
      { lab: "Trích quỹ khen thưởng, phúc lợi", p: "hp.trichQuy", d: 1, kind: "down" }, { lab: "Công ty con trả cổ tức cho CĐKKS", p: "hp.cdkksCoTuc", d: 1, kind: "down" }, { lab: "Sử dụng quỹ", p: "hp.suDungQuy", d: 1, kind: "down" },
      { lab: "Trả lại vốn cho CĐKKS", p: "hp.traVonCDKKS", d: 1, kind: "down" }, { lab: "Biến động khác và chênh lệch làm tròn", p: "calc.hpVcshLamTron", d: 1, kind: "up", calc: true }, { lab: "Cuối năm", p: "hp.vcshChiTiet", d: 1, kind: "total" }] });
  };
  V["2-3-1-more"] = function () {
    put("2-3-1-more", '<div class="intra"><span class="tagc t-co">Chuyển trong nội bộ vốn (tổng không đổi)</span><span>Cổ tức bằng cổ phiếu ' + v("hp.coTucCPPct", 0) + "%: " + v("hp.coTucCP", 1) + " tỷ chuyển từ thặng dư vốn (" + v("hp.coTucTuThangDu", 1) + ") và lợi nhuận chưa phân phối (" + v("hp.coTucTuLNCPP", 1) + ") sang vốn cổ phần; hoàn nhập quỹ đầu tư phát triển " + v("hp.hoanNhapQuyDTPT", 1) + " tỷ sang lợi nhuận chưa phân phối.</span>" + chip("Hòa Phát tr.55, tr.56", "hp") + "</div>");
  };

  V["2-3-2"] = function () {
    var six = ["Vốn cổ phần", "Thặng dư", "Chênh lệch tỷ giá", "Quỹ đầu tư phát triển", "Lợi nhuận chưa phân phối", "Lợi ích cổ đông không kiểm soát"];
    put("2-3-2", title("Số khoản được theo dõi: một nguồn vốn tách hai nguồn hình thành, so với sáu cột vốn chủ sở hữu") + splitWrap(
      '<div data-wf="f02a"></div><div data-wf="f02b"></div><p class="viz-foot">Số làm tròn đến 0,001 tỷ nên tổng các thành phần có thể lệch 0,001.</p>',
      '<div class="pipes6"><p class="viz-sub">Sáu cột của bảng thay đổi vốn chủ sở hữu ' + chip("Hòa Phát tr.55", "hp") + "</p>" + six.map(function (s) { return '<span class="pp dn">' + s + "</span>"; }).join("") + "</div>"));
    waterfall(doc.querySelector('[data-wf="f02a"]'), { bq: true, src: "F02 tr.8", title: "Vốn chủ sở hữu do chủ đầu tư cấp", aria: "F02: vốn chủ sở hữu do chủ đầu tư cấp, đầu năm, tăng, giảm, cuối năm", steps: [
      { lab: "Đầu năm", p: "bq.f02.vcsh.dau", d: 3, kind: "start", dong: true }, { lab: "Tăng bằng tiền", p: "bq.f02.vcsh.tangTien", d: 3, kind: "up", dong: true }, { lab: "Tăng bằng vật tư, thiết bị", p: "bq.f02.vcsh.tangVatTu", d: 3, kind: "up", dong: true },
      { lab: "Giảm (quyết toán)", p: "bq.f02.vcsh.giam", d: 3, kind: "down", dong: true }, { lab: "Cuối năm", p: "bq.f02.vcsh.cuoi", d: 3, kind: "total", dong: true }] });
    waterfall(doc.querySelector('[data-wf="f02b"]'), { bq: true, src: "F02 tr.8", title: "Vốn vay thương mại do chủ đầu tư vay rồi cấp lại", aria: "F02: vốn vay do chủ đầu tư vay rồi cấp lại, đầu năm, tăng, giảm, cuối năm", steps: [
      { lab: "Đầu năm", p: "bq.f02.vay.dau", d: 3, kind: "start", dong: true }, { lab: "Tăng bằng tiền", p: "bq.f02.vay.tangTien", d: 3, kind: "up", dong: true },
      { lab: "Giảm (quyết toán)", p: "bq.f02.vay.giam", d: 3, kind: "down", dong: true }, { lab: "Cuối năm", p: "bq.f02.vay.cuoi", d: 3, kind: "total", dong: true }] });
  };
  V["2-3-2-more"] = function () {
    put("2-3-2-more", title("Đối chiếu chéo giữa các báo cáo") + splitWrap(
      '<div class="xcheck bq"><div class="xc-hub">' + v("bq.b02.cuoi", 0, "dong") + ' đ</div><span class="xc-n n1">B01 tr.2</span><span class="xc-n n2">B02 tr.3</span><span class="xc-n n3">F02 tr.8</span><span class="xc-n n4">B04 V.10</span><svg class="xc-l" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 50 L14 16 M50 50 L86 16 M50 50 L14 84 M50 50 L86 84"/></svg></div><p class="tiny muted">Có ghi chú ngay trên B02: số cuối năm khớp B01 (mã 410) và F02 ' + chip("B02 tr.3") + "</p>",
      '<div class="xcheck dn"><div class="xc-hub">' + v("hp.vcsh", 0) + ' tỷ</div><span class="xc-n n1">B01 tr.9</span><span class="xc-n n2">Thuyết minh 26 tr.55</span><svg class="xc-l" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M50 50 L14 16 M50 50 L86 16"/></svg></div><p class="tiny muted">Cả hai đều đối chiếu chéo, nhưng BQLDA ghi thành ghi chú ngay trên báo cáo ' + chip("Hòa Phát tr.9, tr.55", "hp") + "</p>"));
  };

  V["2-4-1"] = function () {
    put("2-4-1", title("Đích đến của chi phí: B03-CĐT so với Báo cáo kết quả hoạt động kinh doanh hợp nhất") + splitWrap(
      '<div class="onebar"><span class="ob-bar"' + tip("<b>Chi phí phát sinh năm 2015</b><br>" + v("bq.b03.ps", 3) + " tỷ đồng <svg class='ic ar' role='img' aria-label='sang'><use href='#i-arrow-r'/></svg> TK 241<br>" + v("bq.b03.ps", 0, "dong") + " đồng<br>" + chip("B03 tr.4")) + '><b>' + v("bq.b03.ps", 3) + ' tỷ</b> chi phí phát sinh năm 2015</span>' + ic("i-arrow-r") + '<span class="ob-to">TK 241<small>số dư cuối năm ' + v("bq.b03.cuoi", 3) + ' tỷ</small></span></div><p class="ob-note"><span class="tagc t-kh">Không có doanh thu</span><span class="tagc t-kh">Không có lợi nhuận</span><span class="tagc t-ts">Toàn bộ vào tài sản</span></p><p class="viz-foot">' + chip("B03 tr.4") + "</p>",
      '<div data-wf="kq"></div>'));
    waterfall(doc.querySelector('[data-wf="kq"]'), { src: "Hòa Phát tr.10", title: "Kết quả kinh doanh hợp nhất năm 2024", aria: "Kết quả kinh doanh Hòa Phát năm 2024 từ doanh thu thuần đến lợi nhuận sau thuế", steps: [
      { lab: "Doanh thu thuần", p: "hp.dtt", d: 1, kind: "start" }, { lab: "Giá vốn", p: "hp.giaVon", d: 1, kind: "down" }, { lab: "Lợi nhuận gộp", p: "hp.lnGop", d: 1, kind: "total" },
      { lab: "Chi phí bán hàng", p: "hp.cpBanHang", d: 1, kind: "down" }, { lab: "Chi phí quản lý doanh nghiệp", p: "hp.cpQLDN", d: 1, kind: "down" }, { lab: "Sau bán hàng, quản lý", p: "calc.hpSauBhQl", d: 1, kind: "total", calc: true },
      { lab: "Doanh thu tài chính", p: "hp.dtTaiChinh", d: 1, kind: "up" }, { lab: "Chi phí tài chính", p: "hp.cpTaiChinh", d: 1, kind: "down" }, { lab: "Sau hoạt động tài chính", p: "calc.hpSauTaiChinh", d: 1, kind: "total", calc: true },
      { lab: "Thu nhập khác", p: "hp.thuNhapKhac", d: 1, kind: "up" }, { lab: "Chi phí khác", p: "hp.cpKhac", d: 1, kind: "down" }, { lab: "Lợi nhuận trước thuế", p: "hp.lnTruocThue", d: 1, kind: "total" },
      { lab: "Thuế TNDN", p: "hp.thueTNDN", d: 1, kind: "down" }, { lab: "Lợi nhuận sau thuế", p: "hp.lnst", d: 1, kind: "total" }] });
  };
  V["2-4-1-more"] = function () {
    put("2-4-1-more", title("Chi phí phát sinh năm 2015 của BQLDA theo 6 nội dung (B03-CĐT)") + '<div class="hbars" id="chartCost" role="img" aria-label="Chi phí đầu tư phát sinh năm 2015 theo 6 nội dung, tỷ đồng."></div><p class="viz-foot">Tỷ đồng. ' + chip("B03 tr.4") + "</p>");
  };

  V["2-4-2"] = function () {
    var items = D.bq.f03a.items.map(function (it, i) {
      var cls = it.banGiao ? "t4" : i === 5 ? "t2" : "t1";
      var st = it.banGiao ? "Đã bàn giao" : i === 5 ? "Chi phí chung chưa phân bổ" : "Đang thi công";
      return { lab: it.ten.replace(/ \(.*\)/, ""), p: "bq.f03a.items." + i + ".cuoi", d: 3, cls: cls, note: st + " · " + v("calc.f03aPct." + i, 1) + "%", pctCalc: true };
    });
    var hpList = [["Dung Quất", "hp.duAnDungQuat", "hp.duAnDungQuatPct"], ["Container", "hp.duAnContainer"], ["Ống thép", "hp.duAnOngThep"], ["Nông nghiệp", "hp.duAnNongNghiep"]];
    var max = get("hp.duAnDungQuat");
    put("2-4-2", title("Đơn vị theo dõi chi phí dở dang: hạng mục của một dự án so với các dự án lớn") + splitWrap(
      '<div data-tm="f03a"></div><div class="stk-key"><span><i class="t1"></i>Đang thi công</span><span><i class="t2"></i>Chi phí chung chưa phân bổ</span><span class="done-key">Đã bàn giao: Nhà bảo vệ, hàng rào, cổng (số dư cuối năm 0)</span></div>',
      '<div class="hbars dn-bars">' + hpList.map(function (x) {
        return '<div class="hbar"><span>' + x[0] + (x[2] ? " (" + v(x[2], 1) + "% XDCB)" : "") + '</span><span class="hbar-track"><span class="hbar-fill" style="--w:' + Math.max(0.8, (get(x[1]) / max) * 100) + '%"' + tip("<b>" + x[0] + "</b><br>" + v(x[1], 1) + " tỷ đồng<br>" + chip("Hòa Phát tr.44, tm 14", "hp")) + '></span></span><span class="hbar-v">' + v(x[1], 1) + "</span></div>";
      }).join("") + '</div><p class="viz-foot">Tỷ đồng. Hòa Phát chỉ thấy phần đã chuyển sang tài sản cố định (' + v("hp.chuyenTSCD", 1) + " tỷ). " + chip("Hòa Phát tr.44, tm 14", "hp") + "</p>"));
    treemap(doc.querySelector('[data-tm="f03a"]'), { bq: true, src: "F03A tr.9", aria: "Bảy hạng mục F03A theo số dư cuối năm", items: items });
  };

  V["2-5"] = function () {
    put("2-5", title("Đi ra khỏi TK 241: BQLDA bàn giao một đích, Hòa Phát chuyển sang nhiều loại tài sản") + splitWrap('<div data-flow="f03b"></div>', '<div data-flow="xdcb"></div>'));
    flow(doc.querySelector('[data-flow="f03b"]'), { bq: true, side: "bq", src: "F03B tr.10", target: ["Bàn giao cho chủ đầu tư", "Nợ TK 336 (3361) / Có TK 241 · " + v("bq.f03b.duyet", 3) + " tỷ"], aria: "Giá trị quyết toán tách thành năm nội dung, cùng chuyển tới bàn giao cho chủ đầu tư",
      items: [{ lab: "Xây dựng", p: "bq.f03b.xd", d: 3, pct: "calc.f03bPct.xd", cls: "t1" }, { lab: "Thiết bị", p: "bq.f03b.tb", d: 3, pct: "calc.f03bPct.tb", cls: "t2" }, { lab: "Tư vấn", p: "bq.f03b.tv", d: 3, pct: "calc.f03bPct.tv", cls: "t3" }, { lab: "Quản lý dự án", p: "bq.f03b.ql", d: 3, pct: "calc.f03bPct.ql", cls: "t3" }, { lab: "Khác", p: "bq.f03b.khac", d: 3, pct: "calc.f03bPct.khac", cls: "t3" }],
      foot: "Tỷ đồng. " + calcNote() + " " + chip("F03B tr.10") });
    flow(doc.querySelector('[data-flow="xdcb"]'), { side: "dn", dir: "out", src: "Hòa Phát tr.44", target: ["XDCB hoàn thành chuyển đi", v("calc.hpChuyenTong", 1) + " tỷ · Nợ TK 211 (hoặc 213, 242) / Có TK 241"], aria: "XDCB Hòa Phát chuyển thành TSCĐ hữu hình, vô hình và chi phí trả trước",
      items: [{ lab: "TSCĐ hữu hình", p: "hp.chuyenTSCD", d: 1, cls: "d1" }, { lab: "Chi phí trả trước dài hạn", p: "hp.chuyenCPTTDH", d: 1, cls: "d2" }, { lab: "Chi phí trả trước ngắn hạn", p: "hp.chuyenCPTTNH", d: 1, cls: "d3" }, { lab: "TSCĐ vô hình", p: "hp.chuyenTSCDVoHinh", d: 1, cls: "d3" }],
      foot: "Tỷ đồng; tỷ lệ độ dày chỉ so trong từng bên, không so với bên BQLDA. " + calcNote() + " " + chip("Hòa Phát tr.44, tm 14", "hp") });
  };
  /* ---------- Chương 3 ---------- */
  V["3-1"] = function () {
    var a = [["Quản trị chi phí (TK 241)", "Kiểm soát chi tiết nguồn vốn theo dự toán. Phân loại rõ ràng chi phí theo 6 nội dung cơ bản.", "Khối lượng chứng từ lớn, đòi hỏi mức độ chi tiết cao, dễ phát sinh sai sót khi tập hợp chi phí chung chưa phân bổ."],
      ["Quản lý nguồn vốn (TK 336)", "Phản ánh minh bạch dòng vốn được cấp (bằng tiền hoặc vật tư), thuận lợi cho việc đối chiếu quyết toán.", "Ghi giảm nguồn vốn khi bàn giao (Nợ 336 / Có 241) có thể phức tạp nếu phát sinh chi phí không được duyệt quyết toán."],
      ["Phân bổ chi phí BQLDA (TK 642)", "Phản ánh đúng bản chất: chi phí hoạt động của BQLDA là một bộ phận cấu thành nên giá trị tài sản đầu tư.", "Tiêu thức phân bổ chi phí quản lý vào TK 241 cuối kỳ có thể ảnh hưởng đến độ chính xác của giá trị từng hạng mục."]];
    put("3-1", title("Ưu điểm và hạn chế theo từng khía cạnh") + '<div class="scales">' + a.map(function (x) {
      return '<div class="scale"><b class="sc-k">' + x[0] + '</b><div class="sc-beam"><span class="sc-pivot"></span></div><div class="sc-pans"><div class="sc-pan plus"><span class="tagc t-tang">' + ic("i-check") + "Ưu điểm</span>" + x[1] + '</div><div class="sc-pan minus"><span class="tagc t-giam">' + ic("i-alert") + "Hạn chế</span>" + x[2] + "</div></div></div>";
    }).join("") + "</div>");
  };

  // 3.2: Bảng 3.2 dạng hình (ba hàng của bài) và hai khác biệt
  function bar(segs, aria) {
    return '<div class="mbar" role="img" aria-label="' + aria + '">' + segs.map(function (g) {
      return '<span class="mbar-s ' + g.cls + '" style="--w:' + g.w + '%"' + tip("<b>" + g.lab + "</b><br>" + g.val + "<br>" + chip(g.src, /^Hòa Phát/.test(g.src) ? "hp" : "")) + "><b>" + g.txt + "</b></span>";
    }).join("") + "</div>";
  }
  V["3-2"] = function () {
    var srcHpTS = "Hòa Phát tr.6, tr.7", srcHpNV = "Hòa Phát tr.8, tr.9";
    var rows = [
      ["Cơ cấu tài sản",
        bar([{ lab: "Chi phí XDCB dở dang (TK 241)", val: v("bq.b01.tk241", 3) + " tỷ · " + v("bq.b01.pct.tk241", 1) + "% tổng tài sản", w: get("bq.b01.pct.tk241"), cls: "t1", txt: "TK 241 · " + v("bq.b01.pct.tk241", 1) + "%", src: "B01 tr.2" },
          { lab: "Các tài sản khác", val: v("bq.b01.tongTS", 3) + " tỷ tổng tài sản", w: 100 - get("bq.b01.pct.tk241"), cls: "t4", txt: "", src: "B01 tr.2" }], "BQLDA: chi phí XDCB dở dang chiếm 93,6% tổng tài sản") + '<p class="mcap">Tài sản chủ yếu là giá trị công trình đang hình thành ' + chip("B01 tr.2") + "</p>",
        bar([{ lab: "TSCĐ hữu hình", val: v("hp.tscdhh", 1) + " tỷ · " + v("hp.pct.tscd", 1) + "%", w: get("hp.pct.tscd"), cls: "d1", txt: "TSCĐ " + v("hp.pct.tscd", 1) + "%", src: srcHpTS },
          { lab: "XDCB dở dang", val: v("hp.xdcb", 1) + " tỷ · " + v("hp.pct.xdcb", 1) + "%", w: get("hp.pct.xdcb"), cls: "d2", txt: "XDCB " + v("hp.pct.xdcb", 1) + "%", src: srcHpTS },
          { lab: "Hàng tồn kho", val: v("hp.htk", 1) + " tỷ · " + v("hp.pct.htk", 1) + "%", w: get("hp.pct.htk"), cls: "d5", txt: "HTK " + v("hp.pct.htk", 1) + "%", src: srcHpTS },
          { lab: "Tài sản khác (còn lại, gồm tiền)", val: v("calc.hpPctTsConLai", 1) + "%", w: get("calc.hpPctTsConLai"), cls: "d4", txt: "còn lại", src: srcHpTS }], "Hòa Phát: TSCĐ 30,0%, XDCB 28,4%, hàng tồn kho 20,5%, còn lại") + '<p class="mcap">Tài sản đa dạng: tiền, hàng tồn kho, tài sản cố định ' + chip(srcHpTS, "hp") + "</p>"],
      ["Cơ cấu nguồn vốn",
        bar([{ lab: "Phải trả nội bộ (TK 336): nguồn vốn đầu tư", val: v("bq.b01.nvdt", 3) + " tỷ · " + v("bq.b01.pct.nvdt", 1) + "%", w: get("bq.b01.pct.nvdt"), cls: "t1", txt: "TK 336 · " + v("bq.b01.pct.nvdt", 1) + "%", src: "B01 tr.2" },
          { lab: "Nợ phải trả", val: v("bq.b01.no", 3) + " tỷ · " + v("bq.b01.pct.no", 1) + "%", w: get("bq.b01.pct.no"), cls: "t3", txt: "", src: "B01 tr.2" }], "BQLDA: nguồn vốn đầu tư 94,6%, không có vốn chủ sở hữu") + '<p class="mcap"><span class="tagc t-kh">Không có vốn chủ sở hữu</span> ' + chip("B01 tr.2") + "</p>",
        bar([{ lab: "Nợ phải trả", val: v("hp.no", 0) + " tỷ · " + v("hp.pct.no", 1) + "%", w: get("hp.pct.no"), cls: "d3", txt: "Nợ " + v("hp.pct.no", 1) + "%", src: srcHpNV },
          { lab: "Vốn chủ sở hữu", val: v("hp.vcsh", 0) + " tỷ · " + v("hp.pct.vcsh", 1) + "%", w: get("hp.pct.vcsh"), cls: "d1", txt: "VCSH " + v("hp.pct.vcsh", 1) + "%", src: srcHpNV }], "Hòa Phát: nợ phải trả 48,9%, vốn chủ sở hữu 51,1%") + '<p class="mcap">Vốn chủ sở hữu gồm vốn góp và lợi nhuận tích lũy ' + chip(srcHpNV, "hp") + "</p>"],
      ["Hiệu quả hoạt động",
        '<div class="mprog"' + tip("<b>Lũy kế vốn đầu tư thực hiện</b><br>" + v("bq.b03.luyKe", 3) + " / " + v("bq.b03.tongMuc", 3) + " tỷ · " + v("bq.b03.tyLe", 1) + "%<br>" + chip("B03 tr.4")) + '><span class="mprog-f" style="--w:' + get("bq.b03.tyLe") + '%"></span><b>' + v("bq.b03.luyKe", 3) + " / " + v("bq.b03.tongMuc", 3) + " tỷ · " + v("bq.b03.tyLe", 1) + '%</b></div><p class="mcap">B03-CĐT: tiến độ giải ngân và tuân thủ tổng mức đầu tư ' + chip("B03 tr.4") + "</p>",
        '<div class="mkq"><span' + tip("<b>Doanh thu thuần</b><br>" + v("hp.dtt", 1) + " tỷ<br>" + chip("Hòa Phát tr.10", "hp")) + '><small>Doanh thu thuần</small><b>' + v("hp.dtt", 1) + "</b></span>" + ic("i-arrow-r") + "<span" + tip("<b>Lợi nhuận sau thuế</b><br>" + v("hp.lnst", 1) + " tỷ<br>" + chip("Hòa Phát tr.10", "hp")) + '><small>Lợi nhuận sau thuế</small><b>' + v("hp.lnst", 1) + '</b></span></div><p class="mcap">B02-DN: doanh thu, chi phí, lợi nhuận (tỷ đồng) ' + chip("Hòa Phát tr.10", "hp") + "</p>"]
    ];
    var b32 = '<div class="b32v">' + rows.map(function (r) {
      return '<div class="b32-row"><b class="b32-k">' + r[0] + '</b><div class="b32-l">' + r[1] + '</div><div class="b32-r">' + r[2] + "</div></div>";
    }).join("") + "</div>";
    var kb1 = '<div class="kb kb1"><div class="kb-side bq"><p class="kb-h">BQLDA · B01-CĐT</p>' +
      bar([{ lab: "Nợ phải trả (đầu 3)", val: v("bq.b01.no", 3) + " tỷ · " + v("bq.b01.pct.no", 1) + "%", w: get("bq.b01.pct.no"), cls: "t3", txt: "", src: "B01 tr.2" },
        { lab: "Nguồn vốn đầu tư (TK 3361, mã 410, đầu 3)", val: v("bq.b01.nvdt", 3) + " tỷ · " + v("bq.b01.pct.nvdt", 1) + "%", w: get("bq.b01.pct.nvdt"), cls: "t1", txt: "Nguồn vốn đầu tư " + v("bq.b01.nvdt", 3) + " tỷ", src: "B01 tr.2" }], "BQLDA: nợ phải trả 10,746 tỷ, nguồn vốn đầu tư 188,717 tỷ") +
      '<p class="kb-k"><span class="tagc t-co">đầu 3</span> Nợ phải trả ' + v("bq.b01.no", 3) + " tỷ (" + v("bq.b01.pct.no", 1) + "%); nguồn vốn đầu tư (TK 3361, mã 410) " + v("bq.b01.nvdt", 3) + " tỷ (" + v("bq.b01.pct.nvdt", 1) + '%)</p><p class="kb-box">TK 241: ' + v("bq.b01.tk241", 3) + " tỷ, " + v("bq.b01.pct.tk241", 1) + "% tổng tài sản " + chip("B01 tr.2") + "</p></div>" +
      '<div class="kb-side dn"><p class="kb-h">Hòa Phát · Bảng cân đối kế toán</p>' +
      bar([{ lab: "Lợi nhuận chưa phân phối", val: v("hp.lnChuaPP", 0) + " tỷ", w: (get("hp.lnChuaPP") / get("hp.vcsh")) * 100, cls: "d2", txt: "LNCPP " + v("hp.lnChuaPP", 0), src: "Hòa Phát tr.9" },
        { lab: "Phần vốn chủ sở hữu còn lại", val: v("calc.hpVcshKhacLNCPP", 0) + " tỷ", w: (get("calc.hpVcshKhacLNCPP") / get("hp.vcsh")) * 100, cls: "d1", txt: "", src: "Hòa Phát tr.9" }], "Hòa Phát: vốn chủ sở hữu 114.647 tỷ, trong đó lợi nhuận chưa phân phối 49.599 tỷ") +
      '<p class="kb-k"><span class="tagc t-dn">đầu 4</span> Vốn chủ sở hữu ' + v("hp.vcsh", 0) + " tỷ, trong đó lợi nhuận chưa phân phối " + v("hp.lnChuaPP", 0) + " tỷ " + chip("Hòa Phát tr.9", "hp") + "</p></div></div>";
    var kb2 = '<div class="kb kb2"><p class="kb-h">BQLDA không lập báo cáo lưu chuyển tiền tệ: đọc B02-CĐT kết hợp B03-CĐT</p><div class="kb2-cols"><div class="kb2-c"' + tip("<b>Nguồn vốn cấp tăng năm 2015</b><br>" + v("bq.b02.tang", 3) + " tỷ<br>" + chip("B02 tr.3")) + '><small>Nguồn vốn cấp tăng (B02)</small><b>' + v("bq.b02.tang", 3) + ' tỷ</b>' + chip("B02 tr.3") + '</div><span class="kb2-eq">tương ứng</span><div class="kb2-c"' + tip("<b>Chi phí đầu tư phát sinh năm 2015</b><br>" + v("bq.b03.ps", 3) + " tỷ<br>" + chip("B03 tr.4")) + '><small>Chi phí đầu tư phát sinh (B03)</small><b>' + v("bq.b03.ps", 3) + ' tỷ</b>' + chip("B03 tr.4") + '</div><div class="kb2-ring"' + tip("<b>Tiến độ</b><br>" + v("bq.b03.luyKe", 3) + " / " + v("bq.b03.tongMuc", 3) + " tỷ<br>" + chip("B03 tr.4")) + '><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="48" class="rg-bg"/><circle cx="60" cy="60" r="48" class="rg-fg" style="--p:' + get("bq.b03.tyLe") + '"/></svg><b>' + v("bq.b03.tyLe", 1) + '%</b><small>tiến độ</small></div></div></div>';
    put("3-2", title("Bảng 3.2 dạng hình: ba góc độ đánh giá") + '<div class="b32-wrap"><div class="split-head"><span class="bq">' + ic("i-pipe") + 'Thực tế tại BQLDA (TT 195)</span><span class="vs">so với</span><span class="dn">' + ic("i-loop") + "Tư duy Doanh nghiệp (TT 200)</span></div>" + b32 + "</div>" +
      '<div class="kb-grid"><div>' + title("Khác biệt 1: cấu trúc Bảng cân đối kế toán") + kb1 + "</div><div>" + title("Khác biệt 2: phương pháp phân tích dòng tiền") + kb2 + "</div></div>");
  };

  V["3-3"] = function () {
    var l1 = ["Xác định chính xác mô hình tổ chức thực hiện dự án", "Tập trung vào luồng hạch toán quản trị vốn: Có TK 336 <svg class='ic ar' role='img' aria-label='sang'><use href='#i-arrow-r'/></svg> Nợ TK 241 <svg class='ic ar' role='img' aria-label='sang'><use href='#i-arrow-r'/></svg> Nợ TK 336 / Có TK 241", "Phối hợp với bộ phận kỹ thuật về tính hợp lệ của khối lượng nghiệm thu", "Xác định tiêu thức phân bổ chi phí BQLDA (TK 642) hợp lý"];
    var l2 = ["Hướng dẫn chuyển đổi số dư các tài khoản đặc thù (TK 3361, TK 3368)", "Số hóa, tự động trích xuất phụ biểu F03A, F03B", "Đẩy nhanh thẩm tra, phê duyệt quyết toán vốn đầu tư", "Xử lý công trình đã khai thác nhưng chưa ghi tăng tài sản cố định"];
    put("3-3", title("Kiến nghị theo hai nhóm đối tượng") + '<div class="road two"><div class="road-lane"><b class="road-k">' + ic("i-users") + "Người làm kế toán và người đọc BCTC</b>" + l1.map(function (x, i) { return '<span class="road-s"><i>' + (i + 1) + "</i>" + x + "</span>"; }).join("") + '</div><div class="road-lane"><b class="road-k">' + ic("i-book") + "Cơ quan quản lý nhà nước</b>" + l2.map(function (x, i) { return '<span class="road-s"><i>' + (i + 1) + "</i>" + x + "</span>"; }).join("") + "</div></div>");
  };

  V["kl"] = function () {
    put("kl", title("BQLDA và doanh nghiệp: hai mục tiêu, hai hệ thống kế toán") + '<div class="klg"><div class="klg-c bq">' + pipeSVG({ noPct: true, id: "k" }) + "<b>Ban Quản lý dự án: kiểm soát nguồn cấp phát (TK 336) và tập hợp chi phí đầu tư xây dựng (TK 241)</b></div>" + '<div class="klg-c dn">' + loopSVG({ id: "k" }) + "<b>Doanh nghiệp: đo lường chu kỳ kinh doanh qua doanh thu, chi phí và kết quả hoạt động kinh doanh</b></div></div>");
  };

  // Phụ lục 2: dùng lại sơ đồ dòng hạch toán
  V["pl2"] = function () {
    put("pl2", title("Sơ đồ luồng vốn và luồng hạch toán kế toán giữa chủ đầu tư và BQLDA") + splitWrap(pipeSVG({ steps: true, id: "p" }), loopSVG({ steps: true, id: "p" }), H2));
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
      Object.keys(V).forEach(function (k) { if (doc.querySelector('[data-viz="' + k + '"]')) V[k](); });
      fitTreemaps();
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitTreemaps);
      var rt;
      window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(fitTreemaps, 120); });
    },
    fit: fitTreemaps,
    init: function (reduce) {
      initTips();
      initInteractions();
      initParticles(reduce);
    }
  };
})();

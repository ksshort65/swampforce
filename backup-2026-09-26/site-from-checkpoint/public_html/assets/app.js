(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* Mobile nav */
  var toggle = $('#nav-toggle'), nav = $('#site-nav');
  if (toggle && nav) toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  /* Dropdowns: one open at a time, close on outside click */
  var drops = $$('.nav-drop');
  drops.forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) drops.forEach(function (o) { if (o !== d) o.open = false; }); });
  });
  document.addEventListener('click', function (ev) {
    drops.forEach(function (d) { if (d.open && !d.contains(ev.target)) d.open = false; });
  });

  /* Claim | record cards */
  $$('[data-frame-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var f = btn.closest('.frame'); if (!f) return;
      var open = f.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  });
  $$('[data-cite]').forEach(function (a) {
    a.addEventListener('click', function (ev) {
      var url = location.href.split('#')[0] + a.getAttribute('href');
      if (navigator.clipboard) { ev.preventDefault(); navigator.clipboard.writeText(url).then(function () { a.textContent = 'Link copied'; history.replaceState(null, '', a.getAttribute('href')); }); }
    });
  });
  $$('[data-print]').forEach(function (b) { b.addEventListener('click', function () { window.print(); }); });

  /* Tabs (rooms + sub-desks) */
  function showTab(tabbar, id) {
    var btns = $$('button[data-tab]', tabbar);
    var ids = btns.map(function (b) { return b.getAttribute('data-tab'); });
    btns.forEach(function (b) { b.classList.toggle('active', b.getAttribute('data-tab') === id); });
    ids.forEach(function (pid) { var p = document.getElementById(pid); if (p) p.classList.toggle('active', pid === id); });
    var panel = document.getElementById(id);
    if (panel) { animateBars(panel); runCounters(panel); resizeCharts(); }
  }
  $$('.tabs').forEach(function (tabbar) {
    $$('button[data-tab]', tabbar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        showTab(tabbar, btn.getAttribute('data-tab'));
        if (btn.getAttribute('data-tab').indexOf('tab-') === 0) history.replaceState(null, '', '#' + btn.getAttribute('data-tab').slice(4));
      });
    });
  });

  /* Fake News filters */
  var q = $('#q'), sel = { method: $('#filter-method'), evidence: $('#filter-evidence'), proof: $('#filter-proof'), term: $('#filter-term') };
  var countEl = $('#result-count'), empty = $('#empty-note');
  var frames = $$('.frame[data-case]');
  var onFakePage = !!$('#ledger');
  function norm(s) { return (s || '').toLowerCase(); }
  function syncChips() {
    $$('[data-chip-filter]').forEach(function (c) {
      var s = sel[c.getAttribute('data-chip-filter')];
      c.classList.toggle('active', !!s && s.value === c.getAttribute('data-chip-value'));
    });
  }
  function applyFilters() {
    if (!onFakePage) return;
    var qq = norm(q && q.value), shown = 0;
    frames.forEach(function (f) {
      var ok = !qq || norm(f.getAttribute('data-search')).indexOf(qq) !== -1;
      Object.keys(sel).forEach(function (k) { if (ok && sel[k] && sel[k].value && f.getAttribute('data-' + k) !== sel[k].value) ok = false; });
      f.style.display = ok ? '' : 'none';
      if (ok) shown++;
    });
    if (countEl) countEl.textContent = shown + ' of ' + frames.length + ' cases';
    if (empty) empty.hidden = shown !== 0;
    syncChips();
  }
  if (q) q.addEventListener('input', applyFilters);
  Object.keys(sel).forEach(function (k) { if (sel[k]) sel[k].addEventListener('change', applyFilters); });
  $$('[data-chip-filter]').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var s = sel[chip.getAttribute('data-chip-filter')], v = chip.getAttribute('data-chip-value');
      if (!s) return;
      s.value = (s.value === v) ? '' : v;
      applyFilters();
    });
  });
  var clearBtn = $('#clear-filters');
  if (clearBtn) clearBtn.addEventListener('click', function () {
    if (q) q.value = '';
    Object.keys(sel).forEach(function (k) { if (sel[k]) sel[k].value = ''; });
    applyFilters();
  });
  var expandBtn = $('#expand-all');
  if (expandBtn) expandBtn.addEventListener('click', function () {
    var open = expandBtn.getAttribute('data-open') !== '1';
    frames.forEach(function (f) { if (f.style.display !== 'none') f.classList.toggle('open', open); });
    expandBtn.setAttribute('data-open', open ? '1' : '0');
    expandBtn.textContent = open ? 'Close all' : 'Open all';
  });
  if (onFakePage) {
    var params = new URLSearchParams(location.search);
    Object.keys(sel).forEach(function (k) { if (params.get(k) && sel[k]) sel[k].value = params.get(k); });
    if (params.get('q') && q) q.value = params.get('q');
    applyFilters();
  }
  function filterTo(key, value) {
    if (onFakePage && sel[key]) {
      sel[key].value = value; applyFilters();
      var f = $('#filters'); if (f) f.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      location.href = 'fake-news.html?' + key + '=' + encodeURIComponent(value) + '#filters';
    }
  }

  /* Counters (on first view) */
  function animateCounter(el) {
    if (el.getAttribute('data-done')) return;
    el.setAttribute('data-done', '1');
    var target = parseFloat(el.getAttribute('data-count'));
    if (!isFinite(target)) return;
    var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
    var dec = parseInt(el.getAttribute('data-decimals') || '0', 10), t0 = null, dur = 1100;
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function fmt(v) { return pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf; }
    if (reduce) { el.textContent = fmt(target); return; }
    function tick(ts) {
      if (!t0) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(tick); else el.textContent = fmt(target);
    }
    requestAnimationFrame(tick);
  }
  function visible(el) { return el.offsetParent !== null; }
  function runCounters(root) { $$('[data-count]', root).forEach(function (el) { if (visible(el)) animateCounter(el); }); }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { animateCounter(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.3 });
    $$('[data-count]').forEach(function (el) { io.observe(el); });
  } else { runCounters(document); }

  /* Bars */
  function animateBars(root) {
    $$('.bar-fill[data-pct]', root).forEach(function (b) {
      var pct = Math.max(0, Math.min(100, parseFloat(b.getAttribute('data-pct') || '0')));
      requestAnimationFrame(function () { b.style.width = pct + '%'; });
    });
  }
  animateBars(document);

  /* Reveal on scroll */
  if ('IntersectionObserver' in window) {
    var rv = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); rv.unobserve(en.target); } });
    }, { threshold: 0.08 });
    $$('.card, .chart-card, .stat, .score-mod, .law-card, .read-card, .spine, .merch-band, .lawmaker-band').forEach(function (el) { el.classList.add('reveal'); rv.observe(el); });
  }

  /* Charts: data comes only from window.SF_CHARTS (documented figures) */
  var charts = [];
  function resizeCharts() { charts.forEach(function (c) { try { c.resize(); } catch (e) {} }); }
  function fmtVal(v, fmt) {
    switch (fmt) {
      case 'pct': return v + '%';
      case 'm': return v + 'M';
      case 'b': return '$' + v + 'B';
      case 'bn': return '$' + v.toLocaleString('en-US') + 'B';
      case 't': return '$' + v + 'T';
      case 'usd': return '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 });
      case 'int': return v.toLocaleString('en-US');
      default: return v.toLocaleString('en-US');
    }
  }
  function paint() {
    if (typeof Chart === 'undefined' || !window.SF_CHARTS) return;
    Chart.defaults.font.family = '"Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif';
    Chart.defaults.color = '#334155';
    window.SF_CHARTS.forEach(function (spec) {
      var el = document.getElementById(spec.id);
      if (!el) return;
      var type = spec.type === 'groupbar' ? 'bar' : spec.type;
      var datasets;
      if (spec.datasets) {
        datasets = spec.datasets.map(function (d) { return { label: d.label, data: d.data, backgroundColor: d.color, borderRadius: 6, maxBarThickness: 44 }; });
      } else {
        var cols = spec.colors || ['#0c2340'];
        var bg = spec.data.map(function (_, i) { return cols[i % cols.length]; });
        datasets = [{ data: spec.data, backgroundColor: bg, borderWidth: type === 'doughnut' ? 2 : 0, borderColor: '#fff', borderRadius: type === 'bar' ? 6 : 0, maxBarThickness: 44 }];
      }
      var horiz = !!spec.horizontal;
      var opts = {
        responsive: true, maintainAspectRatio: false,
        animation: { duration: 900, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: type === 'doughnut' || !!spec.datasets, position: 'bottom', labels: { boxWidth: 12, padding: 12, font: { size: 11 } } },
          tooltip: { callbacks: { label: function (ctx) {
            var v = ctx.parsed && typeof ctx.parsed === 'object' ? (horiz ? ctx.parsed.x : ctx.parsed.y) : ctx.parsed;
            return (ctx.dataset.label ? ctx.dataset.label + ': ' : (ctx.label ? ctx.label + ': ' : '')) + fmtVal(v, spec.fmt);
          } } }
        },
        onHover: function (ev, els) { if (spec.link) ev.native.target.style.cursor = els.length ? 'pointer' : 'default'; },
        onClick: function (ev, els) { if (spec.link && els.length) filterTo(spec.link.key, spec.link.values[els[0].index]); }
      };
      if (type === 'doughnut') { opts.cutout = '62%'; }
      else {
        opts.indexAxis = horiz ? 'y' : 'x';
        var valAxis = { beginAtZero: true, grid: { color: 'rgba(15,23,42,.06)' }, ticks: { font: { size: 11 }, callback: function (v) { return fmtVal(v, spec.fmt); } } };
        if (spec.max != null) valAxis.max = spec.max;
        var catAxis = { grid: { display: false }, ticks: { font: { size: 11 }, autoSkip: false } };
        opts.scales = horiz ? { x: valAxis, y: catAxis } : { x: catAxis, y: valAxis };
        if (spec.stacked) { valAxis.stacked = true; catAxis.stacked = true; }
      }
      charts.push(new Chart(el, { type: type, data: { labels: spec.labels, datasets: datasets }, options: opts }));
    });
  }
  if (document.readyState === 'complete') paint(); else window.addEventListener('load', paint);
  var drawer = document.getElementById('chart-drawer');
  if (drawer) {
    if (window.innerWidth < 700) drawer.open = false;
    drawer.addEventListener('toggle', function () { if (drawer.open) setTimeout(resizeCharts, 50); });
  }

  /* Deep links: #gop, #dem … or #case-12 */
  function handleHash() {
    if (!location.hash) return;
    var h = location.hash.slice(1);
    var btn = $('.tabs button[data-tab="tab-' + h + '"]');
    if (btn) { showTab(btn.closest('.tabs'), 'tab-' + h); return; }
    var el = document.getElementById(h);
    if (el && el.classList.contains('frame')) {
      el.classList.add('open');
      if (el.style.display === 'none') { if (clearBtn) clearBtn.click(); }
      setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
    }
    /* Target inside a hidden tab or a collapsed <details>: open it, then scroll to it. */
    if (el) {
      var tp = el.closest('.tab-panel');
      while (tp) {
        if (!tp.classList.contains('active')) { var tb = $('.tabs button[data-tab="' + tp.id + '"]'); if (tb) showTab(tb.closest('.tabs'), tp.id); }
        tp = tp.parentElement ? tp.parentElement.closest('.tab-panel') : null;
      }
      for (var d = el; d; d = d.parentElement) { if (d.tagName === 'DETAILS') d.open = true; }
      if (!el.classList.contains('frame')) setTimeout(function () { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 120);
    }
  }
  handleHash();
  window.addEventListener('hashchange', handleHash);
})();

/* Journal Listen button: browser speech only (no hosted audio). Hidden when unsupported. */
(function () {
  var bar = document.querySelector('.jr-listen');
  if (!bar || !('speechSynthesis' in window) || typeof SpeechSynthesisUtterance === 'undefined') return;
  bar.hidden = false;
  var synth = window.speechSynthesis, play = bar.querySelector('[data-say="play"]');
  function text() {
    var root = document.querySelector('.jr-short'); if (!root) return '';
    var parts = [];
    root.querySelectorAll('.jr-h1, .jr-card .jr-big, .jr-card blockquote, .jr-card-lbl, .jr-fact-sum, .jr-view-txt').forEach(function (el) {
      var t = el.textContent.replace(/\u2197/g, '').trim(); if (t) parts.push(t);
    });
    var v = root.querySelector('.jr-view-txt');
    if (v) parts.splice(parts.length - 1, 0, 'Our view.');
    return parts.join('. ').replace(/\.\s*\./g, '.');
  }
  function reset() { play.classList.remove('on'); play.textContent = '\u25b6 Play'; }
  bar.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-say]'); if (!b) return;
    var a = b.getAttribute('data-say');
    if (a === 'play') {
      if (synth.paused) { synth.resume(); play.classList.add('on'); return; }
      synth.cancel();
      var u = new SpeechSynthesisUtterance(text()); u.rate = 1; u.lang = 'en-US';
      u.onend = reset; u.onerror = reset;
      synth.speak(u); play.classList.add('on'); play.textContent = '\u25b6 Playing';
    } else if (a === 'pause') {
      if (synth.speaking && !synth.paused) { synth.pause(); play.textContent = '\u25b6 Resume'; play.classList.remove('on'); }
    } else { synth.cancel(); reset(); }
  });
  window.addEventListener('pagehide', function () { synth.cancel(); });
})();
/* Sortable tables (class="sortable"): tap a header to sort; numbers read from data-v. */
(function () {
  document.querySelectorAll('table.sortable').forEach(function (t) {
    t.querySelectorAll('thead th').forEach(function (th, i) {
      th.tabIndex = 0;
      function go() {
        var asc = th.getAttribute('aria-sort') !== 'ascending';
        t.querySelectorAll('thead th').forEach(function (x) { x.removeAttribute('aria-sort'); });
        th.setAttribute('aria-sort', asc ? 'ascending' : 'descending');
        var tb = t.tBodies[0], rows = Array.prototype.slice.call(tb.rows), num = th.dataset.sort === 'n';
        rows.sort(function (a, b) {
          var x = a.cells[i], y = b.cells[i];
          var r = num ? (parseFloat(x.dataset.v) - parseFloat(y.dataset.v)) : x.textContent.localeCompare(y.textContent);
          return asc ? r : -r;
        });
        rows.forEach(function (r) { tb.appendChild(r); });
      }
      th.addEventListener('click', go);
      th.addEventListener('keydown', function (ev) { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); go(); } });
    });
  });
})();

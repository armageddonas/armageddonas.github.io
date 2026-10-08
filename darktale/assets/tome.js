// Darktale wiki: menus, setting switch, talent trees, search.
(function () {
  'use strict';
  var html = document.documentElement;
  var ROOT = html.getAttribute('data-root') || '';
  var PHONE = window.matchMedia('(max-width: 760px)');
  var $ = function (s, el) { return (el || document).querySelector(s); };
  var $$ = function (s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); };

  // ---------- Setting preference ----------

  var KEY = 'darktale.setting';
  function getSetting() {
    var v = null;
    try { v = localStorage.getItem(KEY); } catch (e) {}
    return v === null ? html.getAttribute('data-default-setting') || '' : v;
  }
  function setSetting(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    applySetting();
  }
  function applySetting() {
    var cur = getSetting();
    $$('[data-setting-only]').forEach(function (el) {
      el.classList.toggle('show', el.getAttribute('data-setting-only') === cur);
    });
    // Core content a selected setting is incompatible with (the core pistol in Duskworld) is dimmed, not removed:
    // with several settings selected, another may still use it.
    var selected = cur ? cur.split(' ') : [];
    $$('[data-incompatible]').forEach(function (el) {
      var off = el.getAttribute('data-incompatible').split(' ');
      el.classList.toggle('is-incompatible', selected.some(function (k) { return off.indexOf(k) >= 0; }));
    });
    $$('[data-set-setting]').forEach(function (el) {
      var on = el.getAttribute('data-set-setting') === cur;
      el.setAttribute(el.tagName === 'BUTTON' ? 'aria-pressed' : 'aria-checked', on ? 'true' : 'false');
    });
    // Pages outside a setting follow the selected setting's palette (setting pages keep their own).
    if (!pageSetting) {
      if (cur) html.setAttribute('data-world', cur); else html.removeAttribute('data-world');
    }
    var label = $('[data-setting-label]');
    if (label) {
      var item = $('.setting-menu [data-set-setting="' + cur + '"]');
      label.textContent = item ? item.textContent : 'Rules only';
    }
  }
  var pageSetting = html.getAttribute('data-setting');
  if (pageSetting) { try { localStorage.setItem(KEY, pageSetting); } catch (e) {} }
  applySetting();
  // A page restored from the back/forward cache, or a change made in another tab, may be out of date.
  window.addEventListener('pageshow', function (e) { if (e.persisted) applySetting(); });
  window.addEventListener('storage', function (e) { if (e.key === KEY) applySetting(); });
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-set-setting]');
    if (!t) return;
    var v = t.getAttribute('data-set-setting');
    setSetting(v);
    if (t.tagName === 'A') {
      // Stay put when switching to rules only from a rules page.
      if (!v && !pageSetting) { e.preventDefault(); var d = t.closest('details'); if (d) d.open = false; }
    } else if (v && v !== pageSetting) {
      var link = $('.setting-menu [data-set-setting="' + v + '"]');
      if (link) location.href = link.href;
    } else if (!v && pageSetting) {
      location.href = ROOT + 'index.html';
    }
  });
  document.addEventListener('click', function (e) {
    $$('details.setting-switch[open]').forEach(function (d) { if (!d.contains(e.target)) d.open = false; });
  });

  // ---------- Overlays ----------

  var lastFocus = null;
  function openOverlay(id) {
    var ov = document.getElementById(id);
    if (!ov) return;
    lastFocus = document.activeElement;
    ov.hidden = false;
    document.body.classList.add('locked');
    var input = $('input', ov);
    if (id === 'search') { loadIndex(); setTimeout(function () { input && input.focus(); }, 30); }
    else { var cur = $('[aria-current="page"]', ov); if (cur) cur.scrollIntoView({ block: 'center' }); }
  }
  function closeOverlays() {
    $$('.overlay').forEach(function (o) { o.hidden = true; });
    document.body.classList.remove('locked');
    if (lastFocus) lastFocus.focus();
  }
  document.addEventListener('click', function (e) {
    var o = e.target.closest('[data-open]');
    if (o) { e.preventDefault(); openOverlay(o.getAttribute('data-open')); return; }
    if (e.target.closest('[data-close]')) { closeOverlays(); return; }
    var a = e.target.closest('.overlay a[href]');
    if (a && a.getAttribute('href').charAt(0) === '#') closeOverlays();
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeOverlays();
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) {
      var q = $('.search-form input');
      if (q && q.offsetParent) { e.preventDefault(); q.focus(); }
      else { e.preventDefault(); openOverlay('search'); }
    }
  });

  // ---------- Talent trees ----------

  function drawTree(tree) {
    if (!tree.offsetParent) return;
    var old = $('svg.tree-lines', tree);
    if (old) old.remove();
    var box = tree.getBoundingClientRect();
    var sx = tree.scrollLeft, sy = tree.scrollTop;
    function rect(el) {
      var r = el.getBoundingClientRect();
      return { l: r.left - box.left + sx, r: r.right - box.left + sx, t: r.top - box.top + sy, b: r.bottom - box.top + sy, cx: (r.left + r.right) / 2 - box.left + sx };
    }
    var nodes = {};
    $$('.talent', tree).forEach(function (el) { nodes[el.getAttribute('data-node')] = el; });
    var banner = rect($('.tree-banner', tree));
    var paths = [];
    var phone = PHONE.matches;

    if (!phone) {
      var gapRow = parseFloat(getComputedStyle(tree).rowGap) || 64;
      var gapCol = parseFloat(getComputedStyle(tree).columnGap) || 42;
      var cells = {};
      $$('.talent', tree).forEach(function (el) {
        var s = getComputedStyle(el);
        cells[s.getPropertyValue('--r').trim() + ':' + s.getPropertyValue('--c').trim()] = true;
      });
      var pos = function (el) {
        var s = getComputedStyle(el);
        return { r: +s.getPropertyValue('--r'), c: +s.getPropertyValue('--c') };
      };
      // Lanes: spread horizontal runs of different parents within the same gap.
      var lanes = {};
      var lane = function (gapKey, parentId) {
        var l = lanes[gapKey] || (lanes[gapKey] = []);
        if (l.indexOf(parentId) < 0) l.push(parentId);
        return l;
      };
      var edges = [];
      $$('.talent', tree).forEach(function (el) {
        var ps = (el.getAttribute('data-parents') || '').split(' ').filter(Boolean);
        if (!ps.length) {
          var c = rect(el);
          paths.push('M' + c.cx + ' ' + banner.b + 'V' + c.t);
        }
        ps.forEach(function (pid) { if (nodes[pid]) edges.push([nodes[pid], el]); });
      });
      edges.forEach(function (e) {
        var pp = pos(e[0]), cp = pos(e[1]);
        lane((pp.r) + 'b', e[0].id);
        if (cp.r - pp.r > 1) lane((cp.r - 1) + 'b', e[0].id);
      });
      var off = function (gapKey, id) {
        var l = lanes[gapKey] || [id];
        return (l.indexOf(id) - (l.length - 1) / 2) * 10;
      };
      edges.forEach(function (e) {
        var p = rect(e[0]), c = rect(e[1]);
        var pp = pos(e[0]), cp = pos(e[1]);
        var y1 = p.b + gapRow / 2 + off(pp.r + 'b', e[0].id);
        if (cp.r - pp.r === 1) {
          paths.push('M' + p.cx + ' ' + p.b + 'V' + y1 + 'H' + c.cx + 'V' + c.t);
          return;
        }
        var clear = function (col) {
          for (var r = pp.r + 1; r < cp.r; r++) if (cells[r + ':' + col]) return false;
          return true;
        };
        var y2 = c.t - gapRow / 2 + off((cp.r - 1) + 'b', e[0].id);
        if (clear(cp.c)) paths.push('M' + p.cx + ' ' + p.b + 'V' + y1 + 'H' + c.cx + 'V' + c.t);
        else if (clear(pp.c)) paths.push('M' + p.cx + ' ' + p.b + 'V' + y2 + 'H' + c.cx + 'V' + c.t);
        else {
          var gx = cp.c >= pp.c ? p.r + gapCol / 2 : p.l - gapCol / 2;
          paths.push('M' + p.cx + ' ' + p.b + 'V' + y1 + 'H' + gx + 'V' + y2 + 'H' + c.cx + 'V' + c.t);
        }
      });
    } else {
      // Phone: each parent has a rail down its left side, with a tick to each child.
      var kids = {};
      var railX = function (r) { return r.l + 14; };
      $$('.talent, .tree-link', tree).forEach(function (el) {
        var pid = el.getAttribute('data-phone-parent') || '__root';
        (kids[pid] = kids[pid] || []).push(el);
      });
      Object.keys(kids).forEach(function (pid) {
        var from = pid === '__root' ? banner : rect(nodes[pid] || $('.tree-banner', tree));
        var x = railX(from);
        var ys = kids[pid].map(function (el) { var r = rect(el); return { y: r.t + 24, l: r.l, dash: el.classList.contains('tree-link') }; });
        var last = Math.max.apply(null, ys.map(function (k) { return k.y; }));
        paths.push({ d: 'M' + x + ' ' + from.b + 'V' + last, dash: ys.every(function (k) { return k.dash; }) });
        ys.forEach(function (k) { paths.push({ d: 'M' + x + ' ' + k.y + 'H' + k.l, dash: k.dash }); });
      });
    }

    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'tree-lines');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('width', tree.scrollWidth);
    svg.setAttribute('height', tree.scrollHeight);
    paths.forEach(function (p) {
      var path = document.createElementNS(ns, 'path');
      path.setAttribute('d', typeof p === 'string' ? p : p.d);
      if (p.dash) path.setAttribute('class', 'dash');
      svg.appendChild(path);
    });
    tree.insertBefore(svg, tree.firstChild);
  }
  function drawAll() { $$('.tree').forEach(drawTree); }
  var raf = 0;
  function redraw() { cancelAnimationFrame(raf); raf = requestAnimationFrame(drawAll); }
  window.addEventListener('resize', redraw);
  if (PHONE.addEventListener) PHONE.addEventListener('change', redraw);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(redraw);
  window.addEventListener('load', redraw);
  redraw();

  // Tabs
  function showTab(id, focus) {
    var panel = document.getElementById(id);
    if (!panel || !panel.classList.contains('tree-panel')) return false;
    $$('.tree-panel').forEach(function (p) { if (p === panel) p.removeAttribute('data-hidden'); else p.setAttribute('data-hidden', ''); });
    $$('.tab').forEach(function (t) { t.setAttribute('aria-selected', t.getAttribute('data-tab') === id ? 'true' : 'false'); });
    redraw();
    if (focus) { var t = $('.tab[data-tab="' + id + '"]'); if (t) t.focus(); }
    return true;
  }
  document.addEventListener('click', function (e) {
    var t = e.target.closest('.tab');
    if (t) { showTab(t.getAttribute('data-tab')); history.replaceState(null, '', '#' + t.getAttribute('data-tab')); }
  });
  var tablist = $('.tabs');
  if (tablist) tablist.addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var tabs = $$('.tab', tablist);
    var i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    var n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length];
    showTab(n.getAttribute('data-tab'), true);
  });
  function followHash() {
    var id = decodeURIComponent(location.hash.slice(1));
    if (!id) return;
    if (showTab(id)) return;
    var el = document.getElementById(id);
    // A link straight to another setting's content (or to setting content while "Rules only" is selected)
    // reveals just that piece rather than leading to an empty spot.
    var hidden = el && el.closest('[data-setting-only]:not(.show)');
    if (hidden) { hidden.classList.add('show'); el.scrollIntoView(); }
    var panel = el && el.closest('.tree-panel');
    if (panel && panel.hasAttribute('data-hidden')) {
      showTab(panel.id);
      requestAnimationFrame(function () { el.scrollIntoView(); });
    }
  }
  window.addEventListener('hashchange', followHash);
  followHash();

  // ---------- Back to top ----------

  var topBtn = $('.back-top');
  if (topBtn) {
    var showTop = function () {
      // After 400px, or halfway down on shorter pages.
      var max = document.documentElement.scrollHeight - window.innerHeight;
      topBtn.classList.toggle('on', max > 0 && window.scrollY > Math.min(400, max / 2));
    };
    window.addEventListener('scroll', showTop, { passive: true });
    showTop();
    topBtn.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0 });
      if (location.hash) history.replaceState(null, '', location.pathname + location.search);
      var skip = $('.brand');
      if (skip) skip.focus({ preventScroll: true });
    });
  }

  // ---------- Scrollspy ----------

  var spies = $$('[data-spy]');
  if (spies.length && 'IntersectionObserver' in window) {
    var targets = spies.map(function (a) { return document.getElementById(a.getAttribute('data-spy')); }).filter(Boolean);
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { visible[en.target.id] = en.isIntersecting; });
      var shown = targets.filter(function (t) { return t.offsetParent || t.getClientRects().length; });
      var top = shown.filter(function (t) { return t.getBoundingClientRect().top < window.innerHeight * 0.35; }).pop() || shown[0];
      spies.forEach(function (a) { a.classList.toggle('active', top && a.getAttribute('data-spy') === top.id); });
    }, { rootMargin: '0px 0px -60% 0px' });
    targets.forEach(function (t) { io.observe(t); });
  }

  // ---------- Talent index filter ----------

  var tiInput = $('[data-ti-filter]');
  if (tiInput) {
    var voc = '';
    var rows = $$('.ti-table tbody tr');
    var count = $('[data-ti-count]');
    var apply = function () {
      var q = tiInput.value.trim().toLowerCase();
      var n = 0;
      rows.forEach(function (r) {
        var ok = (!voc || r.getAttribute('data-voc') === voc) && (!q || r.getAttribute('data-text').indexOf(q) >= 0);
        r.hidden = !ok;
        // Rows of another setting's vocations are hidden by the setting switch and aren't counted.
        if (ok && !(r.hasAttribute('data-setting-only') && !r.classList.contains('show'))) n++;
      });
      count.textContent = n + (n === 1 ? ' talent' : ' talents');
    };
    tiInput.addEventListener('input', apply);
    apply();
    $$('[data-filter-voc]').forEach(function (b) {
      b.addEventListener('click', function () {
        voc = b.getAttribute('data-filter-voc');
        $$('[data-filter-voc]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        apply();
      });
    });
  }

  // ---------- Search ----------

  var index = null, loading = [];
  // GM-only pages (a publish build's git-ignored overlay). Loaded only from a local copy, never from the
  // public site, so a published page never even asks for assets/gm.js.
  var LOCAL = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  var gmState = null, gmWaiting = [];
  function loadGm(cb) {
    if (!LOCAL) return cb(null);
    if (gmState) return cb(gmState.data);
    gmWaiting.push(cb);
    if (loadGm.started) return;
    loadGm.started = true;
    var done = function () { gmState = { data: window.DARKTALE_GM || null }; gmWaiting.forEach(function (f) { f(gmState.data); }); gmWaiting = []; };
    var s = document.createElement('script');
    s.src = ROOT + 'assets/gm.js';
    s.onload = done; s.onerror = done;
    document.head.appendChild(s);
  }
  loadGm(function (gm) {
    if (!gm) return;
    var here = html.getAttribute('data-page');
    gm.links.forEach(function (l) {
      $$('[data-gm-nav="' + l.setting + '"]').forEach(function (nav) {
        var a = document.createElement('a');
        a.href = ROOT + l.url;
        a.className = 'gm-link';
        a.textContent = l.navTitle || l.title;
        if (l.url === here) a.setAttribute('aria-current', 'page');
        var rules = $('a[href$="#rules"]', nav);
        nav.insertBefore(a, rules && rules.parentNode === nav ? rules : null);
      });
      $$('[data-gm-cards="' + l.setting + '"]').forEach(function (grid) {
        var a = document.createElement('a');
        a.href = ROOT + l.url;
        a.className = 'link-card gm-link';
        a.innerHTML = '<span class="eyebrow">' + esc(l.label) + '</span><b>' + esc(l.title) + '</b><span>' + esc(l.intro) + '</span>';
        grid.appendChild(a);
      });
    });
  });

  function loadIndex(cb) {
    if (index) { if (cb) cb(index); return; }
    if (cb) loading.push(cb);
    if (loadIndex.started) return;
    loadIndex.started = true;
    var s = document.createElement('script');
    s.src = ROOT + 'assets/search-index.js';
    s.onload = function () {
      loadGm(function (gm) {
        index = window.DARKTALE_SEARCH;
        if (gm) index.entries = index.entries.concat(gm.entries);
        loading.forEach(function (f) { f(index); }); loading = [];
      });
    };
    document.head.appendChild(s);
  }

  var TYPES = ['Rules', 'Talents', 'Traits', 'Conditions', 'Setting'];
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function highlight(text, words) {
    var out = esc(text);
    words.forEach(function (w) {
      if (w.length < 2) return;
      out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }
  function snippet(text, words) {
    var low = text.toLowerCase();
    var at = -1;
    words.some(function (w) { at = low.indexOf(w); return at >= 0; });
    if (at < 0) return text.slice(0, 160) + (text.length > 160 ? '…' : '');
    var start = Math.max(0, at - 60);
    var s = (start ? '…' : '') + text.slice(start, start + 180);
    return s + (start + 180 < text.length ? '…' : '');
  }
  function runSearch(q, filter) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    if (!words.length) return [];
    var cur = getSetting();
    var phrase = q.toLowerCase().trim();
    var results = [];
    index.entries.forEach(function (e) {
      var type = e[0], title = e[1], text = e[4], setting = e[5];
      if (setting && setting !== cur) return;
      var tl = title.toLowerCase(), xl = text.toLowerCase();
      var score = 0;
      for (var i = 0; i < words.length; i++) {
        var w = words[i];
        var inT = tl.indexOf(w) >= 0, inX = xl.indexOf(w) >= 0;
        if (!inT && !inX) return;
        score += inT ? 12 : 0;
        if (inX) score += Math.min(6, xl.split(w).length - 1);
      }
      if (tl === phrase) score += type === 'Rules' || type === 'Setting' ? 100 : 130;
      else if (tl.indexOf(phrase) === 0) score += 30;
      else if (tl.indexOf(phrase) >= 0) score += 15;
      if (xl.indexOf(phrase) >= 0) score += 4;
      if (type === 'Conditions' || type === 'Talents') score += 1;
      results.push({ e: e, score: score, exact: tl === phrase });
    });
    results.sort(function (a, b) { return b.score - a.score || a.e[1].length - b.e[1].length; });
    return results;
  }
  function renderResults(container, chips, q, filter, onFilter) {
    if (!q.trim()) { container.innerHTML = '<p class="muted">Search rules, talents, traits and conditions.</p>'; chips.innerHTML = ''; return; }
    var all = runSearch(q, filter);
    var counts = { All: all.length };
    all.forEach(function (r) { counts[r.e[0]] = (counts[r.e[0]] || 0) + 1; });
    chips.innerHTML = ['All'].concat(TYPES).filter(function (t) { return t === 'All' || counts[t]; }).map(function (t) {
      return '<button type="button" class="chip-btn" data-f="' + t + '" aria-pressed="' + (t === filter) + '">' + t + '<span class="n">' + (counts[t] || 0) + '</span></button>';
    }).join('');
    $$('button', chips).forEach(function (b) { b.addEventListener('click', function () { onFilter(b.getAttribute('data-f')); }); });
    var shown = all.filter(function (r) { return filter === 'All' || r.e[0] === filter; });
    if (!shown.length) { container.innerHTML = '<p class="muted">Nothing found for “' + esc(q) + '”.</p>'; return; }
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    var out = '';
    var feature = shown[0].exact ? shown[0] : null;
    if (feature) {
      var f = feature.e;
      out += '<a class="sr-feature" href="' + ROOT + f[3] + '"><span class="eyebrow">' + esc(f[0] === 'Conditions' ? 'Condition' : f[0]) + ' · exact match</span><span class="sr-title">' + esc(f[1]) + '</span><span class="sr-loc">' + esc(f[2]) + '</span><span class="sr-snip">' + highlight(snippet(f[4], words), words) + '</span></a>';
    }
    var groups = {};
    shown.slice(0, 80).forEach(function (r) { if (r !== feature) (groups[r.e[0]] = groups[r.e[0]] || []).push(r); });
    TYPES.forEach(function (t) {
      if (!groups[t]) return;
      out += '<div class="sr-group">' + t + '</div>';
      groups[t].slice(0, filter === 'All' ? 8 : 80).forEach(function (r) {
        var e = r.e;
        out += '<a class="sr-item" href="' + ROOT + e[3] + '"><span class="sr-loc">' + esc(e[2]) + '</span><span class="sr-title">' + highlight(e[1], words) + '</span><span class="sr-snip">' + highlight(snippet(e[4], words), words) + '</span></a>';
      });
    });
    container.innerHTML = out;
  }
  function bindSearch(input, scope) {
    var filter = 'All';
    var container = $('[data-search-results]', scope), chips = $('[data-search-chips]', scope);
    var go = function () {
      loadIndex(function () {
        renderResults(container, chips, input.value, filter, function (f) { filter = f; go(); });
      });
    };
    input.addEventListener('input', function () { filter = 'All'; go(); });
    return go;
  }
  var live = $('[data-live-search]');
  if (live) bindSearch(live, document.getElementById('search'));
  var pageInput = $('[data-search-page-input]');
  if (pageInput) {
    var q = new URLSearchParams(location.search).get('q') || '';
    pageInput.value = q;
    var top = $('.search-form input');
    if (top) top.value = q;
    var go = bindSearch(pageInput, $('.search-page'));
    go();
    pageInput.focus();
  }
})();

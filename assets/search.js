// Atwaira site-wide search. Searches the search indexes that each section publishes.
// To add a section: build it with its own search-index script and list it in SOURCES.
// An index script sets window[global] = { entries: [[type, title, location, url, text, setting], ...],
// settings: { key: { name } } }, with urls relative to the section's base folder.
(function () {
  'use strict';

  var SOURCES = [
    { name: 'Darktale', base: 'darktale/', script: 'darktale/assets/search-index.js', global: 'DARKTALE_SEARCH' },
  ];
  var TYPES = ['Rules', 'Talents', 'Traits', 'Conditions', 'Setting'];

  var input = document.querySelector('[data-site-search]');
  var panel = document.querySelector('[data-site-results]');
  if (!input || !panel) return;
  var chips = panel.querySelector('[data-chips]');
  var list = panel.querySelector('[data-list]');

  var entries = null, loading = null;
  function load(cb) {
    if (entries) return cb();
    if (loading) return loading.push(cb);
    loading = [cb];
    var left = SOURCES.length;
    var all = [];
    SOURCES.forEach(function (src) {
      var s = document.createElement('script');
      s.src = src.script;
      s.onload = s.onerror = function () {
        var idx = window[src.global];
        if (idx) idx.entries.forEach(function (e) {
          var setting = e[5] && idx.settings && idx.settings[e[5]] ? idx.settings[e[5]].name : '';
          all.push({ type: e[0], title: e[1], loc: e[2], url: src.base + e[3], text: e[4], section: setting || src.name, world: e[5] || '' });
        });
        if (--left === 0) { entries = all; loading.forEach(function (f) { f(); }); loading = null; }
      };
      document.head.appendChild(s);
    });
  }

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function mark(text, words) {
    var out = esc(text);
    words.forEach(function (w) {
      if (w.length < 2) return;
      out = out.replace(new RegExp('(' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>');
    });
    return out;
  }
  function snippet(text, words) {
    var low = text.toLowerCase(), at = -1;
    words.some(function (w) { at = low.indexOf(w); return at >= 0; });
    if (at < 0) return text.slice(0, 150) + (text.length > 150 ? '…' : '');
    var start = Math.max(0, at - 50);
    return (start ? '…' : '') + text.slice(start, start + 170) + (start + 170 < text.length ? '…' : '');
  }

  // Same ranking as the Darktale wiki: every word must match; title hits and exact titles rank first.
  function search(q) {
    var words = q.toLowerCase().split(/\s+/).filter(Boolean);
    var phrase = q.toLowerCase().trim();
    var out = [];
    entries.forEach(function (e) {
      var tl = e.title.toLowerCase(), xl = e.text.toLowerCase(), score = 0;
      for (var i = 0; i < words.length; i++) {
        var inT = tl.indexOf(words[i]) >= 0, inX = xl.indexOf(words[i]) >= 0;
        if (!inT && !inX) return;
        score += inT ? 12 : 0;
        if (inX) score += Math.min(6, xl.split(words[i]).length - 1);
      }
      if (tl === phrase) score += e.type === 'Rules' || e.type === 'Setting' ? 100 : 130;
      else if (tl.indexOf(phrase) === 0) score += 30;
      else if (tl.indexOf(phrase) >= 0) score += 15;
      if (xl.indexOf(phrase) >= 0) score += 4;
      out.push({ e: e, score: score, exact: tl === phrase });
    });
    out.sort(function (a, b) { return b.score - a.score || a.e.title.length - b.e.title.length; });
    return { results: out, words: words };
  }

  var filter = 'All';
  function render() {
    var q = input.value.trim();
    if (!q) { panel.hidden = true; return; }
    load(function () {
      var r = search(q), all = r.results, words = r.words;
      var counts = { All: all.length };
      all.forEach(function (x) { counts[x.e.type] = (counts[x.e.type] || 0) + 1; });
      if (filter !== 'All' && !counts[filter]) filter = 'All';
      chips.innerHTML = ['All'].concat(TYPES).filter(function (t) { return t === 'All' || counts[t]; }).map(function (t) {
        return '<button type="button" class="s-chip" data-f="' + t + '" aria-pressed="' + (t === filter) + '">' + t + ' <span>' + (counts[t] || 0) + '</span></button>';
      }).join('');
      var shown = all.filter(function (x) { return filter === 'All' || x.e.type === filter; }).slice(0, 40);
      if (!shown.length) {
        list.innerHTML = '<p class="s-empty">Nothing found for “' + esc(q) + '”.</p>';
      } else {
        list.innerHTML = shown.map(function (x, i) {
          var e = x.e;
          return '<a class="s-item' + (i === 0 && x.exact ? ' exact' : '') + '"' + (e.world ? ' data-world="' + esc(e.world) + '"' : '') + ' href="' + esc(e.url) + '">'
            + '<span class="s-meta"><span class="s-section">' + esc(e.section) + '</span> · ' + esc(e.type === 'Conditions' ? 'Condition' : e.type) + (i === 0 && x.exact ? ' · exact match' : '') + '</span>'
            + '<span class="s-title">' + mark(e.title, words) + '</span>'
            + '<span class="s-loc">' + esc(e.loc) + '</span>'
            + '<span class="s-snip">' + mark(snippet(e.text, words), words) + '</span></a>';
        }).join('');
      }
      panel.hidden = false;
    });
  }

  input.addEventListener('input', function () { filter = 'All'; render(); });
  input.addEventListener('focus', function () { load(function () {}); });
  input.form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = list.querySelector('a');
    if (first && !panel.hidden) location.href = first.href; else render();
  });
  chips.addEventListener('click', function (e) {
    var b = e.target.closest('[data-f]');
    if (b) { filter = b.getAttribute('data-f'); render(); }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && !/INPUT|TEXTAREA/.test(document.activeElement.tagName)) { e.preventDefault(); input.focus(); }
    if (e.key === 'Escape' && document.activeElement === input) { input.value = ''; panel.hidden = true; }
  });

  var q = new URLSearchParams(location.search).get('q');
  if (q) { input.value = q; render(); }
})();

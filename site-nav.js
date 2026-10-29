/* Shared site nav + theme switcher for every page in this folder.
   Usage, as the first thing in <body>:
     <nav id="sitenav" aria-label="Site">[optional page buttons, e.g. a sidebar toggle]</nav>
     <script src="site-nav.js"></script>
   Theme: "light" | "auto" | "dark", saved in localStorage under "site-theme". Pages style dark mode with
   @media (prefers-color-scheme: dark) :root:not([data-theme="light"]) and :root[data-theme="dark"]. */
(function () {
  'use strict';
  var KEY = 'site-theme';
  var PAGES = [
    ['index.html', 'Job tracker', 'Jobs'],
    ['dsa-interview-mastery.html', 'Data structures prep', 'DSA'],
    ['frontend-interview-prep.html', 'Frontend prep', 'Frontend']
  ];
  var THEMES = [['light', '☀', 'Light'], ['auto', '◐', 'Auto'], ['dark', '☾', 'Dark']];
  var root = document.documentElement;

  function load() {
    try {
      var v = localStorage.getItem(KEY);
      if (v === 'light' || v === 'dark' || v === 'auto') return v;
      var old = localStorage.getItem('dsa-mastery:theme');          // earlier per-page setting
      if (old) { old = JSON.parse(old); return old === 'light' || old === 'dark' ? old : 'auto'; }
    } catch (e) { /* storage unavailable */ }
    return 'auto';
  }
  function apply(v) {
    if (v === 'light' || v === 'dark') root.setAttribute('data-theme', v); else root.removeAttribute('data-theme');
  }
  var theme = load();
  apply(theme);

  var css = [
    ':root{--sitenav-h:48px}',
    '.sitenav{--sn-bg:#ffffff;--sn-fg:#1b1f27;--sn-muted:#5f6b7a;--sn-line:#e2e5ea;--sn-soft:#f1f3f6;--sn-acc:#c2410c;' +
      'position:sticky;top:0;z-index:60;height:var(--sitenav-h);box-sizing:border-box;background:var(--sn-bg);border-bottom:1px solid var(--sn-line);' +
      'font:500 13.5px/1 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--sn-fg)}',
    '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .sitenav{--sn-bg:#14181f;--sn-fg:#e7eaf0;--sn-muted:#9aa4b2;--sn-line:#2a313d;--sn-soft:#1f2530;--sn-acc:#fb923c}}',
    ':root[data-theme="dark"] .sitenav{--sn-bg:#14181f;--sn-fg:#e7eaf0;--sn-muted:#9aa4b2;--sn-line:#2a313d;--sn-soft:#1f2530;--sn-acc:#fb923c}',
    '.sn-in{height:100%;display:flex;align-items:center;gap:6px;padding:0 max(12px,env(safe-area-inset-left)) 0 max(12px,env(safe-area-inset-left))}',
    '.sn-slot{display:contents}',
    '.sitenav .sn-slot button{flex:none;width:34px;height:32px;padding:0;text-align:center;line-height:30px;border:1px solid var(--sn-line);border-radius:8px;background:var(--sn-soft);color:var(--sn-fg);font:16px/1 system-ui,sans-serif;cursor:pointer;margin-right:4px}',
    '.sn-links{display:flex;align-items:center;gap:2px;min-width:0;overflow-x:auto;scrollbar-width:none;white-space:nowrap;height:100%}',
    '.sn-links::-webkit-scrollbar{display:none}',
    '.sn-links a{display:inline-flex;align-items:center;height:100%;padding:0 10px;color:var(--sn-muted);text-decoration:none;border-bottom:2px solid transparent;box-sizing:border-box}',
    '.sn-links a:hover{color:var(--sn-fg);text-decoration:none}',
    '.sn-links a[aria-current="page"]{color:var(--sn-fg);border-bottom-color:var(--sn-acc);font-weight:600}',
    '.sn-theme{margin-left:auto;flex:none;display:inline-flex;padding:2px;border:1px solid var(--sn-line);border-radius:9px;background:var(--sn-soft)}',
    '.sn-theme button{display:inline-flex;align-items:center;gap:5px;border:0;background:none;color:var(--sn-muted);font:500 12.5px/1 system-ui,-apple-system,"Segoe UI",sans-serif;padding:6px 9px;border-radius:7px;cursor:pointer}',
    '.sn-theme button:hover{color:var(--sn-fg)}',
    '.sn-theme button[aria-pressed="true"]{background:var(--sn-bg);color:var(--sn-fg);box-shadow:0 1px 2px rgba(0,0,0,.12)}',
    '.sn-theme i{font-style:normal;font-size:13px}',
    '.sitenav a:focus-visible,.sitenav button:focus-visible{outline:2px solid var(--sn-acc);outline-offset:-2px}',
    '.sn-short{display:none}',
    '@media (max-width:560px){.sn-long{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}.sn-short{display:inline}}',
    '@media (max-width:720px){.sn-theme b{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}.sn-theme button{padding:6px 8px}.sn-links a{padding:0 8px}}'
  ].join('\n');
  var style = document.createElement('style');
  style.id = 'sitenav-style';
  style.textContent = css;
  (document.head || root).appendChild(style);

  var nav = document.getElementById('sitenav');
  if (!nav) return;
  var here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  var slot = document.createElement('span');
  slot.className = 'sn-slot';
  while (nav.firstChild) slot.appendChild(nav.firstChild);             // keep page-specific buttons (sidebar toggles)
  var links = document.createElement('div');
  links.className = 'sn-links';
  links.innerHTML = PAGES.map(function (p) {
    return '<a href="' + p[0] + '"' + (p[0] === here ? ' aria-current="page"' : '') + '><span class="sn-long">' + p[1] + '</span><span class="sn-short" aria-hidden="true">' + p[2] + '</span></a>';
  }).join('');
  var seg = document.createElement('div');
  seg.className = 'sn-theme';
  seg.setAttribute('role', 'group');
  seg.setAttribute('aria-label', 'Colour theme');
  seg.innerHTML = THEMES.map(function (t) {
    return '<button type="button" data-theme-set="' + t[0] + '" title="' + t[2] + ' theme' + (t[0] === 'auto' ? ' (follows your system)' : '') + '"><i aria-hidden="true">' + t[1] + '</i><b>' + t[2] + '</b></button>';
  }).join('');
  function sync() {
    var bs = seg.querySelectorAll('button');
    for (var i = 0; i < bs.length; i++) bs[i].setAttribute('aria-pressed', String(bs[i].getAttribute('data-theme-set') === theme));
  }
  seg.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-theme-set]');
    if (!b) return;
    theme = b.getAttribute('data-theme-set');
    try { localStorage.setItem(KEY, theme); } catch (err) { /* storage unavailable */ }
    apply(theme);
    sync();
  });
  window.addEventListener('storage', function (e) {                    // keep other open tabs in step
    if (e.key === KEY && e.newValue) { theme = e.newValue; apply(theme); sync(); }
  });
  var inner = document.createElement('div');
  inner.className = 'sn-in';
  inner.appendChild(slot);
  inner.appendChild(links);
  inner.appendChild(seg);
  nav.className = (nav.className ? nav.className + ' ' : '') + 'sitenav';
  nav.appendChild(inner);
  sync();
})();

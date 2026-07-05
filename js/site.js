// site.js — shared header injection for mysticscards.space
// Add a new page to the nav by editing NAV only. No other file needs touching.
(function () {
  'use strict';

  // ── Nav links — edit here to add/rename pages ────────────────────
  // "The Casting" (index.html) is the homepage — a swirling card-galaxy
  // menu, not itself listed here. Astrology is a thinned-out inline tool
  // inside Cards of Life (Tools → Astrology) — there is no standalone
  // astrology page in v2.
  var NAV = [
    { href: 'cardsoflife.html',   label: 'Cards of Life'  },
    { href: 'iching.html',        label: 'I Ching'        },
    { href: 'celestialkeys.html', label: 'Celestial Keys' },
  ];
  // ────────────────────────────────────────────────────────────────

  var page = window.location.pathname.split('/').pop() || 'index.html';

  var navHtml = NAV.map(function (l) {
    if (l.heading) {
      return '<span class="nav-heading">' + l.heading + '</span>';
    }
    return '<a href="' + l.href + '"' +
      (page === l.href ? ' class="active"' : '') + '>' +
      l.label + '</a>';
  }).join('');

  var headerHtml =
    '<header class="site-header" id="siteHeader">' +
      '<div class="sh-inner">' +
        '<a href="index.html" class="sh-logo">mysticscards<span class="suit">.space</span></a>' +
        '<button class="burger" id="burgerBtn" aria-label="Menu" ' +
            'aria-expanded="false" aria-controls="shNav">' +
          '<span class="burger-bars" aria-hidden="true"><span></span><span></span><span></span></span>' +
        '</button>' +
        '<nav class="sh-nav" id="shNav" aria-label="Primary">' + navHtml + '</nav>' +
      '</div>' +
    '</header>';

  // Inject synchronously — skip link + header appear before any page content
  var skipHtml = '<a href="#main" class="skip-link">Skip to content</a>';
  document.currentScript.insertAdjacentHTML('beforebegin', skipHtml + headerHtml);

  // Wire burger (elements exist now — injected above)
  var btn = document.getElementById('burgerBtn');
  var nav = document.getElementById('shNav');

  function closeNav() {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open');
    btn.classList.remove('is-open');   // burger bars unrotate back from ✕
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', function (e) {
    e.stopPropagation();
    var open = nav.classList.toggle('open');
    btn.classList.toggle('is-open', open);   // burger bars rotate into ✕
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    // On open, move focus into the menu so keyboard users land on the links.
    if (open) { var first = nav.querySelector('a'); if (first) first.focus(); }
  });

  // Close nav on any click inside it (covers page links and any extra
  // buttons a page appends to #shNav after this script runs)
  nav.addEventListener('click', closeNav);
  document.addEventListener('click', closeNav);

  // Escape closes the menu and returns focus to the trigger (a11y 2.1.2).
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) {
      closeNav();
      btn.focus();
    }
  });

  // Skip-link target: a focusable anchor right after the header, so keyboard
  // users can jump past the nav to the page content (a11y 2.4.1). Only added
  // if the page doesn't already define its own #main.
  var header = document.getElementById('siteHeader');
  if (header && !document.getElementById('main')) {
    header.insertAdjacentHTML('afterend', '<div id="main" tabindex="-1" class="main-anchor"></div>');
  }

  // Scroll shadow on the sticky header (.site-header.scrolled in site.css)
  window.addEventListener('scroll', function () {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }, { passive: true });

  // Offline support — register the service worker (sw.js at site root).
  // Works on https and localhost; silently skipped elsewhere (e.g. file://).
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* no-op */ });
    });
  }

  // ── Rich footer (injected) ───────────────────────────────────────
  // The footer markup (<footer class="site-footer"><div class="sf-inner">)
  // lives in each page but is empty. Fill it once, from the same NAV, so a
  // single edit covers every page. Pages with their own footer content
  // (e.g. iching's trigrams) are left untouched. Runs on DOMContentLoaded
  // because the footer sits at the end of <body>, after this script.
  // Footer mark = the same image as the favicon (the cash-coin fan badge), so the
  // two stay in sync from one source (assets/favicon.svg).
  // The homepage ("The Casting") uses a background-less fan so the casting
  // field's floating cards show through the gaps; every other page keeps the
  // badged favicon.
  var FAN = '<img src="' +
    (page === 'index.html' ? 'assets/footer-fan.svg' : 'assets/favicon.svg') +
    '" alt="" width="48" height="48">';

  // Mail icon (envelope) — the footer email link shows this instead of the text address.
  var MAIL_MARK =
    '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" ' +
    'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>' +
    '</svg>';

  // Discreet "hidden" hexagram mark on the left of the I Ching footer — a small
  // I Ching figure linking to the seedoracle (the unlisted bip39 oracle, kept
  // out of NAV). Hex 63 ䷾ Chi Chi — Fire under Water (After Completion).
  // Subtle by design but fully keyboard- + screen-reader-accessible. SVG: 6 rows
  // at y=0/3.6/7.2/10.8/14.4/18, each 2 high. SOLID = full width (x=0,w=18) /
  // BROKEN = two halves (x=0,w=7 + x=11,w=7). Top row of the SVG = top of the
  // hexagram (line 6); bottom row = line 1.
  var SEED_MARK =
    '<svg viewBox="0 0 18 20" aria-hidden="true">' +
      '<g fill="#c79a54">' +
        '<rect x="0" y="0"    width="7"  height="2" rx="1"/><rect x="11" y="0"    width="7"  height="2" rx="1"/>' +
        '<rect x="0" y="3.6"  width="18" height="2" rx="1"/>' +
        '<rect x="0" y="7.2"  width="7"  height="2" rx="1"/><rect x="11" y="7.2"  width="7"  height="2" rx="1"/>' +
        '<rect x="0" y="10.8" width="18" height="2" rx="1"/>' +
        '<rect x="0" y="14.4" width="7"  height="2" rx="1"/><rect x="11" y="14.4" width="7"  height="2" rx="1"/>' +
        '<rect x="0" y="18"   width="18" height="2" rx="1"/>' +
      '</g>' +
    '</svg>';

  // Matching calculator mark on the left of the Seed Oracle footer — a tiny
  // 3×4 keypad grid linking to the dozenal calculator (unlisted in NAV).
  // Same gold as the hexagram mark so the two tucked-corner marks read as a family.
  var CALC_MARK =
    '<svg viewBox="0 0 18 22" aria-hidden="true">' +
      '<g fill="#c79a54">' +
        '<circle cx="2.5"  cy="2.5"  r="1.4"/><circle cx="9"  cy="2.5"  r="1.4"/><circle cx="15.5" cy="2.5"  r="1.4"/>' +
        '<circle cx="2.5"  cy="8"    r="1.4"/><circle cx="9"  cy="8"    r="1.4"/><circle cx="15.5" cy="8"    r="1.4"/>' +
        '<circle cx="2.5"  cy="13.5" r="1.4"/><circle cx="9"  cy="13.5" r="1.4"/><circle cx="15.5" cy="13.5" r="1.4"/>' +
        '<circle cx="2.5"  cy="19"   r="1.4"/><circle cx="9"  cy="19"   r="1.4"/><circle cx="15.5" cy="19"   r="1.4"/>' +
      '</g>' +
    '</svg>';

  function buildFooter() {
    var inner = document.querySelector('.site-footer .sf-inner');
    if (!inner) return;                                       // no footer slot
    if (inner.children.length || inner.textContent.trim()) return; // custom footer — leave it

    inner.classList.add('sf-rich');
    // Discreet corner marks on the left of certain footers — tucked links
    // to pages kept out of the burger menu. .sf-seeds / .sf-seed describe
    // the LAYOUT slot (left-justified, small gold svg), not the content,
    // so both marks reuse the same classes.
    //   • I Ching footer     → hexagram → Seed Oracle
    //   • Seed Oracle footer  → keypad   → Calculator
    var leftSlot;
    if (page === 'iching.html') {
      leftSlot =
        '<span class="sf-seeds">' +
          '<a class="sf-seed" href="seedoracle.html" aria-label="Seed Oracle" title="Seed Oracle">' + SEED_MARK + '</a>' +
        '</span>';
    } else if (page === 'seedoracle.html') {
      leftSlot =
        '<span class="sf-seeds">' +
          '<a class="sf-seed" href="calculator.html" aria-label="Calculator" title="Calculator">' + CALC_MARK + '</a>' +
        '</span>';
    } else {
      leftSlot = '<span class="sf-spacer" aria-hidden="true"></span>';
    }
    // The email link is shown on every page EXCEPT the homepage, where it is
    // deliberately dropped (the fan mark stays centred via the grid's middle
    // column regardless).
    var emailSlot = (page === 'index.html') ? '' :
      '<a class="sf-email" href="mailto:mysticscards@proton.me" aria-label="Email mysticscards@proton.me" title="mysticscards@proton.me">' + MAIL_MARK + '</a>';
    inner.innerHTML =
      leftSlot +
      '<a class="sf-mark" href="index.html" aria-label="mysticscards.space home">' + FAN + '</a>' +
      emailSlot;
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildFooter);
  else buildFooter();

  // ── Section minimise/maximise (shared) ───────────────────────────
  // Any .page-section whose direct child is a .section-toggle button opts
  // in to collapsible behaviour. toggleSection(id) flips .section-open on
  // the section and persists the state to localStorage. Default = open,
  // UNLESS the section carries .section-start-closed (then it starts
  // collapsed on first visit) — either way a saved '0'/'1' wins once the
  // visitor has toggled it. CSS in site.css handles the grid-rows 0fr → 1fr
  // unfurl + chevron rotation.
  window.toggleSection = function (id) {
    var section = document.getElementById(id);
    if (!section) return;
    var open = section.classList.toggle('section-open');
    var btn  = section.querySelector(':scope > .section-toggle');
    if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    try { localStorage.setItem('mc-section-' + id, open ? '1' : '0'); } catch (e) {}
  };
  function _restoreSections() {
    document.querySelectorAll('.page-section').forEach(function (section) {
      if (!section.querySelector(':scope > .section-toggle')) return;
      var saved = null;
      try { saved = localStorage.getItem('mc-section-' + section.id); } catch (e) {}
      var startClosed = section.classList.contains('section-start-closed');
      var open = saved !== null ? (saved !== '0') : !startClosed;   // saved state wins; else start-closed opt-in
      section.classList.toggle('section-open', open);
      var btn = section.querySelector(':scope > .section-toggle');
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', _restoreSections);
  else _restoreSections();

  // ── Backup: export / import the site's saved data ─────────────────
  // One backup file covers every store (saved charts + saved readings),
  // whichever page it is exported from. Import MERGES by entry id, so
  // restoring an old file never deletes newer saves.
  var BACKUP_KEYS = ['astro_births_v1', 'iching_readings'];

  window.MCBackup = {
    export: function () {
      var out = { site: 'mysticscards.space', version: 1, exported: new Date().toISOString(), data: {} };
      BACKUP_KEYS.forEach(function (k) {
        try {
          var v = JSON.parse(localStorage.getItem(k));
          if (v) out.data[k] = v;
        } catch (e) {}
      });
      var stamp = out.exported.slice(0, 10).replace(/-/g, '');
      var a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(out, null, 2)], { type: 'application/json' }));
      a.download = 'mysticscards-backup-' + stamp + '.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(a.href);
    },

    // import(file, done) → done(addedCount) or done(-1) on a bad file
    import: function (file, done) {
      var reader = new FileReader();
      reader.onload = function () {
        var added = 0;
        try {
          var parsed = JSON.parse(reader.result);
          var data = parsed && parsed.data ? parsed.data : null;
          if (!data) { done(-1); return; }
          BACKUP_KEYS.forEach(function (k) {
            var incoming = data[k];
            if (!Array.isArray(incoming)) return;
            var current = [];
            try { current = JSON.parse(localStorage.getItem(k)) || []; } catch (e) {}
            var have = {};
            current.forEach(function (x) { have[x.id] = true; });
            incoming.forEach(function (x) {
              if (x && x.id != null && !have[x.id]) { current.push(x); added++; }
            });
            try { localStorage.setItem(k, JSON.stringify(current)); } catch (e) {}
          });
          done(added);
        } catch (e) { done(-1); }
      };
      reader.onerror = function () { done(-1); };
      reader.readAsText(file);
    }
  };
})();

// ── Keyboard access for clickable card / cell <div>s (a11y 2.1.1) ─────
// Several pages render cards and grid cells as <div>s with click handlers
// (an onclick attribute, a JS-assigned .onclick, or addEventListener). Such
// divs aren't natively focusable or key-operable. After each insertion we
// tag any that carry a handler (or the explicit .clickable marker) as
// role=button + tabindex=0, give them an aria-label from their title, then
// map Enter/Space to a real .click() — which also fires addEventListener
// handlers. A rAF defers tagging until property-assigned handlers attach.
// Elements that already manage their own keyboard support (e.g. the
// hexagram-grid .hex-ref-cell, which sets role/tabindex + its own keydown)
// are not in the scan set, so there is no double-activation.
(function () {
  'use strict';
  var SCAN = '.spread-card, .cal-day, .hex-tile';
  function clickable(el) {
    return el.getAttribute('onclick') || el.onclick || el.classList.contains('clickable');
  }
  function tag(el) {
    if (el._a11yCard || !clickable(el)) return;
    el._a11yCard = true;
    el.setAttribute('role', 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    if (!el.getAttribute('aria-label')) {
      var t = el.getAttribute('title');
      if (t) el.setAttribute('aria-label', t);
    }
  }
  function scan(node) {
    if (node.nodeType !== 1) return;
    if (node.matches && node.matches(SCAN)) tag(node);
    if (node.querySelectorAll) node.querySelectorAll(SCAN).forEach(tag);
  }
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target._a11yCard) {
      e.preventDefault();
      e.target.click();
    }
  });
  function start() {
    scan(document.body);
    new MutationObserver(function (muts) {
      muts.forEach(function (m) {
        m.addedNodes.forEach(function (n) {
          requestAnimationFrame(function () { scan(n); });
        });
      });
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();

// ── Smooth page transitions + link prefetch (shared) ─────────────────
// Same-origin navigations get a cross-fade: native cross-document View
// Transitions where supported (current Chrome/Safari), a deep-violet veil
// fallback elsewhere. Links are prefetched on first hover/focus so the next
// page is warm. The homepage coins run their own "cast", so they're left
// alone here. Everything is off under prefers-reduced-motion.
(function () {
  'use strict';
  var mm = window.matchMedia;
  var reduce = mm && mm('(prefers-reduced-motion: reduce)').matches;
  var nativeVT = ('onpagereveal' in window);   // cross-document View Transitions

  // A normal same-origin, same-tab navigation to a different page?
  function external(a) {
    if (!a) return true;
    if (a.target && a.target !== '_self') return true;
    if (a.hasAttribute('download')) return true;
    var raw = a.getAttribute('href') || '';
    if (!raw || raw.charAt(0) === '#') return true;
    if (/^(mailto:|tel:|sms:|javascript:|data:)/i.test(raw)) return true;
    var url;
    try { url = new URL(a.href, location.href); } catch (e) { return true; }
    if (url.origin !== location.origin) return true;
    if (url.href.split('#')[0] === location.href.split('#')[0]) return true;   // same document
    return false;
  }

  // Prefetch on first hover/focus (every regime — pure speed).
  var seen = {};
  function prefetch(a) {
    if (external(a) || seen[a.href]) return;
    seen[a.href] = true;
    var l = document.createElement('link'); l.rel = 'prefetch'; l.href = a.href;
    document.head.appendChild(l);
  }
  ['pointerover', 'focusin'].forEach(function (ev) {
    document.addEventListener(ev, function (e) {
      var a = e.target && e.target.closest && e.target.closest('a[href]');
      if (a) prefetch(a);
    }, { passive: true });
  });

  if (reduce || nativeVT) return;   // native View Transitions / reduced-motion handle the rest

  // Fallback for browsers without cross-document View Transitions: fade the
  // site's violet ground in, then navigate. Bulletproof — navigation always fires.
  var veil;
  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target && e.target.closest && e.target.closest('a[href]');
    if (!a || (a.closest && a.closest('.coins'))) return;   // the homepage coins run their own cast
    if (external(a)) return;
    var href = a.href;
    e.preventDefault();
    if (!veil) {
      veil = document.createElement('div');
      veil.className = 'pg-veil'; veil.setAttribute('aria-hidden', 'true');
      (document.body || document.documentElement).appendChild(veil);
    }
    requestAnimationFrame(function () { veil.classList.add('show'); });
    var done = false;
    function go() { if (done) return; done = true; location.href = href; }
    veil.addEventListener('transitionend', go, { once: true });
    setTimeout(go, 480);   // fail-safe — navigation always happens
  });
  // Restore from bfcache with the veil cleared (no stuck overlay on Back).
  window.addEventListener('pageshow', function () { if (veil) veil.classList.remove('show'); });
})();

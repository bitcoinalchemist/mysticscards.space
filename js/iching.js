// NOTE: Hexagrams here are identified strictly by their 6-bit binary value (0–63),
  // which is the value the encoding actually uses. This is NOT the same as the
  // traditional King Wen number — that is a separate philosophical ordering. We avoid
  // labelling by King Wen name to prevent conflating the two. A verified
  // binary-value → King Wen mapping can be added later if desired.

  // Render a hexagram as SVG given a 6-bit value (0-63)
  // Bit order: bit5=line6(top), bit0=line1(bottom)
  function hexagramSVG(val, size = 1, changing) {
    const lineH = 5 * size;
    const gap = 4 * size;
    const totalH = 6 * lineH + 5 * gap;
    const w = 36 * size;
    const segW = 14 * size;
    const breakW = 8 * size;
    const svgH = totalH;
    let paths = [];
    for (let i = 0; i < 6; i++) {
      // i=0 = bottom (line 1), i=5 = top (line 6)
      // bits string read left→right = lines 1→6, so bit0(LSB) = top, bit5(MSB) = bottom
      const bit = (val >> (5 - i)) & 1;
      const y = svgH - lineH - i * (lineH + gap);
      const isChanging = changing && changing.indexOf(i) !== -1;
      const fill = isChanging ? 'var(--gold)' : 'var(--yang)';
      if (bit === 1) {
        // Yang: solid bar
        paths.push(`<rect x="0" y="${y}" width="${w}" height="${lineH}" rx="${1.5*size}" fill="${fill}"/>`);
      } else {
        // Yin: broken bar
        paths.push(`<rect x="0" y="${y}" width="${segW}" height="${lineH}" rx="${1.5*size}" fill="${fill}"/>`);
        paths.push(`<rect x="${w - segW}" y="${y}" width="${segW}" height="${lineH}" rx="${1.5*size}" fill="${fill}"/>`);
      }
    }
    return `<svg width="${w}" height="${svgH}" viewBox="0 0 ${w} ${svgH}">${paths.join('')}</svg>`;
  }

  // Binary value (0-63, bit5=line1/bottom … bit0=line6/top) → King Wen number (1-64).
  // Derived from the trigram pairs of all 64 hexagrams; verified to be a bijection over 0-63.
  const VAL_TO_KW = [2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33,
                     7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44,
                     24, 27, 3, 42, 51, 21, 17, 25, 36, 22, 63, 37, 55, 30, 49, 13,
                     19, 41, 60, 61, 54, 38, 58, 10, 11, 26, 5, 9, 34, 14, 43, 1];

  // King Wen number → binary value (inverse of the above)
  const KW_TO_VAL = [];
  VAL_TO_KW.forEach(function (kw, v) { KW_TO_VAL[kw] = v; });

  // Build the 64-hexagram reference grid in the chosen sequence
  const grid = document.getElementById('hex-grid');
  function buildGrid(seq) {
    grid.innerHTML = '';
    const order = [];
    if (seq === 'kingwen') {
      for (let kw = 1; kw <= 64; kw++) order.push(KW_TO_VAL[kw]);
    } else {
      for (let v = 0; v < 64; v++) order.push(v);
    }
    order.forEach(function (v, i) {
      const bits = v.toString(2).padStart(6, '0');
      const kw = VAL_TO_KW[v];
      const cell = document.createElement('div');
      cell.className = 'hex-ref-cell cell-in';
      cell.style.setProperty('--i', i);   // per-cell stagger delay for cellIn
      cell.title = `King Wen ${kw} · Decimal ${v} · Binary ${bits}`;
      cell.dataset.val = v;
      cell.setAttribute('role', 'button');
      cell.tabIndex = 0;
      cell.setAttribute('aria-label', 'Hexagram, King Wen ' + kw);
      cell.innerHTML = `
        <div class="hex-ref-kw">${kw}</div>
        ${hexagramSVG(v, 0.5)}
        <div class="hex-ref-num" style="margin-top:4px">${v}</div>
        <div class="hex-ref-bits">${bits}</div>
      `;
      cell.addEventListener('click', function () { openHexPopup(v); });
      cell.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openHexPopup(v); }
      });
      grid.appendChild(cell);
    });
    applyGlow();
  }
  buildGrid('fuxi');

  // Sequence toggle — clicking opens the grid in that order; clicking the active button again closes it
  const seqToggle = document.getElementById('seqToggle');
  seqToggle.addEventListener('click', function (e) {
    var btn = e.target.closest('button');
    if (!btn) return;
    var hexGrid = document.getElementById('hex-grid');
    if (btn.classList.contains('active')) {
      btn.classList.remove('active');
      hexGrid.classList.remove('open');
    } else {
      seqToggle.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      buildGrid(btn.dataset.seq);
      hexGrid.classList.add('open');
    }
  });

  // Codes toggle — reveals the 0–63 value and the binary on every cell
  // (King Wen number is always shown). Off by default.
  document.getElementById('codesToggle').addEventListener('click', function () {
    var on = document.getElementById('hex-grid').classList.toggle('show-codes');
    this.classList.toggle('active', on);
    this.setAttribute('aria-pressed', on ? 'true' : 'false');
  });

  // ── Hexagram popup ──────────────────────────────────────
  var _hxKw = null;
  function escapeHtml(s) {
    return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }
  // Split an image line into two balanced lines: prefer a clause break (comma/period/
  // semicolon/em-dash) closest to the middle; otherwise the space closest to the middle.
  // Punctuation stays at the end of the first line; words after it begin the second.
  function splitImageLine(text) {
    text = String(text).trim();
    var mid = text.length / 2, best = -1, bestDist = Infinity, i, d;
    for (i = 0; i < text.length; i++) {
      if (',.;\u2014'.indexOf(text[i]) !== -1) {
        var at = i + 1;
        if (at < 6 || at > text.length - 4) continue; // skip trivial end splits
        d = Math.abs(at - mid);
        if (d < bestDist) { bestDist = d; best = at; }
      }
    }
    if (best === -1) {
      for (i = 0; i < text.length; i++) {
        if (text[i] === ' ') { d = Math.abs(i - mid); if (d < bestDist) { bestDist = d; best = i; } }
      }
    }
    if (best === -1) return [text, ''];
    return [text.slice(0, best).trim(), text.slice(best).trim()];
  }
  function imageLineHTML(text) {
    var p = splitImageLine(text);
    return '<span class="il-1">' + escapeHtml(p[0]) + '</span>' +
           (p[1] ? '<span class="il-2">' + escapeHtml(p[1]) + '</span>' : '');
  }
  // Cross-fade a popup's content region on step (‹ ›). Retriggered via the
  // codebase idiom (remove → reflow → add); .step-fade is opacity-only and
  // guarded for reduced motion in site.css. Accepts any number of elements.
  function stepFade() {
    for (var i = 0; i < arguments.length; i++) {
      var el = arguments[i];
      if (!el) continue;
      el.classList.remove('step-fade'); void el.offsetWidth; el.classList.add('step-fade');
    }
  }
  function openHexPopup(val) {
    var kw = VAL_TO_KW[val];
    var d = (typeof HEX_DATA !== 'undefined') ? HEX_DATA[kw] : null;
    if (!d) return;
    _hxKw = kw;
    // Already open → this is a ‹ › step; captured before we add .open below.
    var _hxStepping = document.getElementById('hxOverlay').classList.contains('open');
    document.getElementById('hxFig').innerHTML = hexagramSVG(val, 1.1);
    document.getElementById('hxFigNum').textContent = val + ' · ' + val.toString(2).padStart(6, '0');
    document.getElementById('hxKw').textContent = 'King Wen ' + kw;
    document.getElementById('hxName').textContent = d.name;
    document.getElementById('hxTrig').textContent = d.trig;
    document.getElementById('hxImage').innerHTML = imageLineHTML(d.image);
    var html = d.paras.map(function (p) { return '<p>' + escapeHtml(p) + '</p>'; }).join('') +
      '<div class="hx-shadow">' + escapeHtml(d.shadow) + '</div>' +
      '<div class="hx-keynote">' + escapeHtml(d.keynote) + '</div>';
    document.getElementById('hxContent').innerHTML = html;
    document.getElementById('hxContent').scrollTop = 0;
    var overlay = document.getElementById('hxOverlay');
    // Focus management: on first open (not when stepping prev/next) remember
    // the trigger and move focus into the dialog; close restores it.
    if (!overlay.classList.contains('open')) {
      _hxLastFocus = document.activeElement;
      overlay.classList.add('open');
      document.getElementById('hxPopup').focus();
    }
    // On step, blink the content region over (header + image + body); the
    // popup shell and its hxIn open animation stay put.
    if (_hxStepping) {
      stepFade(document.querySelector('.hx-header'),
               document.getElementById('hxImage'),
               document.getElementById('hxContent'));
    }
  }
  var _hxLastFocus = null;
  function closeHexPopup() {
    document.getElementById('hxOverlay').classList.remove('open');
    if (_hxLastFocus && document.contains(_hxLastFocus)) _hxLastFocus.focus();
    _hxLastFocus = null;
  }
  function stepHex(delta) {
    if (_hxKw == null) return;
    // Step in whichever sequence the grid is currently showing, so prev/next
    // matches the order the reader sees (Fu Xi = by binary value, King Wen = 1..64).
    var activeBtn = document.querySelector('#seqToggle button.active');
    var seq = activeBtn ? activeBtn.dataset.seq : 'kingwen';
    if (seq === 'fuxi') {
      var v = ((KW_TO_VAL[_hxKw] + delta) % 64 + 64) % 64;
      openHexPopup(v);
    } else {
      var nk = ((_hxKw - 1 + delta + 64) % 64) + 1; // wrap 1..64
      openHexPopup(KW_TO_VAL[nk]);
    }
  }
  // expose for handlers in the other script (cast results)
  window.openHexPopup = openHexPopup;

  // Glow the cast hexagram(s) in the reference grid (reapplied after each rebuild)
  var _castGlow = [];
  function applyGlow() {
    document.querySelectorAll('.hex-ref-cell.cast-glow').forEach(function (c) { c.classList.remove('cast-glow'); });
    (_castGlow || []).forEach(function (v) {
      var c = document.querySelector('.hex-ref-cell[data-val="' + v + '"]');
      if (c) { void c.offsetWidth; c.classList.add('cast-glow'); }
    });
  }
  window.setCastGlow = function (vals) { _castGlow = vals || []; applyGlow(); };

  // Inline answer HTML for the cast result panel (no popup)
  window.hexAnswerHTML = function (val) {
    var kw = VAL_TO_KW[val];
    var d = (typeof HEX_DATA !== 'undefined') ? HEX_DATA[kw] : null;
    if (!d) return '';
    return '<div class="cast-kw">King Wen ' + kw + '</div>' +
      '<div class="cast-name">' + escapeHtml(d.name) + '</div>' +
      '<div class="cast-trig">' + escapeHtml(d.trig) + '</div>' +
      '<div class="cast-image">' + imageLineHTML(d.image) + '</div>' +
      d.paras.map(function (p) { return '<p>' + escapeHtml(p) + '</p>'; }).join('') +
      '<div class="hx-shadow">' + escapeHtml(d.shadow) + '</div>' +
      '<div class="hx-keynote">' + escapeHtml(d.keynote) + '</div>';
  };

  // Backdrop click + × button close; the popup body itself stays put
  // (tap-anywhere-to-close was easy to trigger by accident on mobile —
  // the swipe-up gesture below + the × button replace it).
  var hxPopupEl = document.getElementById('hxPopup');
  var _hxTx = null, _hxTy = null, _hxStartScroll = 0, _hxSwiped = false;
  // Swipe left/right steps hexagrams; swipe up dismisses. Vertical-close fires
  // only when .hx-body didn't scroll across the gesture, so reading scrolls
  // never accidentally close the popup.
  var _hxBody = document.querySelector('.hx-body');
  hxPopupEl.addEventListener('touchstart', function (e) {
    _hxTx = e.touches[0].clientX;
    _hxTy = e.touches[0].clientY;
    _hxStartScroll = _hxBody ? _hxBody.scrollTop : 0;
    _hxSwiped = false;
  }, { passive: true });
  hxPopupEl.addEventListener('touchend', function (e) {
    if (_hxTx === null) return;
    var dx = e.changedTouches[0].clientX - _hxTx;
    var dy = e.changedTouches[0].clientY - _hxTy;
    var dScroll = (_hxBody ? _hxBody.scrollTop : 0) - _hxStartScroll;
    _hxTx = null; _hxTy = null;
    if (-dy > 60 && Math.abs(dy) > Math.abs(dx) && dScroll === 0) {
      _hxSwiped = true; closeHexPopup(); return;
    }
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      _hxSwiped = true; stepHex(dx < 0 ? 1 : -1);
    }
  });
  document.getElementById('hxClose').addEventListener('click', function (e) { e.stopPropagation(); closeHexPopup(); });
  document.getElementById('hxPrev').addEventListener('click', function (e) { e.stopPropagation(); stepHex(-1); });
  document.getElementById('hxNext').addEventListener('click', function (e) { e.stopPropagation(); stepHex(1); });
  document.getElementById('hxOverlay').addEventListener('click', function (e) {
    if (e.target === this) closeHexPopup();
  });
  document.addEventListener('keydown', function (e) {
    if (!document.getElementById('hxOverlay').classList.contains('open')) return;
    if (e.key === 'Escape') closeHexPopup();
    else if (e.key === 'ArrowLeft') stepHex(-1);
    else if (e.key === 'ArrowRight') stepHex(1);
    else if (e.key === 'Tab') {
      // Focus trap: keep Tab cycling inside the dialog
      var popup = document.getElementById('hxPopup');
      var f = Array.prototype.filter.call(
        popup.querySelectorAll('button, [tabindex]:not([tabindex="-1"])'),
        function (el) { return !el.hidden && !el.disabled; });
      if (!f.length) { e.preventDefault(); return; }
      var first = f[0], last = f[f.length - 1], a = document.activeElement;
      if (!popup.contains(a))                          { e.preventDefault(); first.focus(); }
      else if (e.shiftKey && (a === first || a === popup)) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && a === last)              { e.preventDefault(); first.focus(); }
    }
  });

  // Header — 8 trigrams (3-line figures), Fu Xi binary order 0–7
  function trigramSVG(val, size = 1) {
    const lineH = 5 * size, gap = 4 * size, w = 30 * size, segW = 11 * size;
    const totalH = 3 * lineH + 2 * gap;
    let paths = [];
    for (let i = 0; i < 3; i++) {
      const bit = (val >> (2 - i)) & 1;
      const y = totalH - lineH - i * (lineH + gap);
      if (bit === 1) {
        paths.push(`<rect x="0" y="${y}" width="${w}" height="${lineH}" rx="${1.5*size}" fill="var(--yang)"/>`);
      } else {
        paths.push(`<rect x="0" y="${y}" width="${segW}" height="${lineH}" rx="${1.5*size}" fill="var(--yang)"/>`);
        paths.push(`<rect x="${w - segW}" y="${y}" width="${segW}" height="${lineH}" rx="${1.5*size}" fill="var(--yang)"/>`);
      }
    }
    return `<svg width="${w}" height="${totalH}" viewBox="0 0 ${w} ${totalH}">${paths.join('')}</svg>`;
  }

// ── Oracle ──────────────────────────────────────────────
(function () {
  var SUITS = ['♠','♣','♥','♦'];
  var RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
  var COURTS = ['J','Q','K'];
  var RED_SUITS = ['♥','♦'];
  var SYM_TO_SUIT = {'♥':'hearts','♦':'diamonds','♣':'clubs','♠':'spades'};
  function findCardIdx(castCard) {
    var suit = SYM_TO_SUIT[castCard.suit];
    return CARDS.findIndex(function(c) { return c.rank === castCard.rank && c.suit === suit; });
  }

  function buildDeck() {
    var deck = [];
    SUITS.forEach(function(s) {
      RANKS.forEach(function(r) {
        deck.push({ suit: s, rank: r, red: RED_SUITS.includes(s), court: COURTS.includes(r) });
      });
    });
    return deck;
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  // Returns { yang: bool, changing: bool }
  function lineType(card) {
    if (card.court && !card.red) return { yang: false, changing: true };  // black court = old yin
    if (card.court && card.red)  return { yang: true,  changing: true };  // red court  = old yang
    if (!card.red)               return { yang: false, changing: false }; // black pip  = young yin
    return                              { yang: true,  changing: false }; // red pip    = young yang
  }

  // Build 6-bit hexagram value from 6 lines (index 0 = line 1 / bottom)
  // bit5=line1(bottom) … bit0=line6(top) matching hexagramSVG convention
  function hexVal(lines) {
    var v = 0;
    lines.forEach(function(l, i) {
      if (l.yang) v |= (1 << (5 - i));
    });
    return v;
  }

  function renderHexResult(el, val, role, changingLines) {
    var kw = (typeof VAL_TO_KW !== 'undefined') ? VAL_TO_KW[val] : '?';
    el.className = 'hex-result hex-tile';
    el.innerHTML =
      '<div class="kw">' + kw + '</div>' +
      hexagramSVG(val, 0.5, changingLines);
  }

  // The middle "Changing" tile: the cast hexagram with its still lines ghosted
  // (via .hex-changing) so the moving lines read in gold; captioned with the count.
  function renderChangingTile(el, val, changingLines) {
    var n = changingLines.length;
    el.className = 'hex-result hex-tile hex-changing';
    el.innerHTML =
      '<div class="kw">' + n + (n === 1 ? ' line' : ' lines') + '</div>' +
      hexagramSVG(val, 0.5, changingLines);
  }

  // ── Cast state ──
  var deck = null;
  var draws = [];   // line cards drawn this round, index 0 = line 1 (bottom)
  var lines = [];
  var pulls = [];   // aces set aside during the cast (suit-pulls)
  var deckPos = 0;  // next card in the shuffled deck (aces advance it too)
  var _question = '';
  var _lastPrimary = null, _lastSecondary = null, _lastChanging = null;

  function showAsked() {
    var a = document.getElementById('askedLine');
    if (_question) {
      a.innerHTML = '<span>You asked</span>';
      a.appendChild(document.createTextNode(_question));
      a.style.display = 'block';
    } else { a.style.display = 'none'; }
  }

  // ── Reading history (localStorage) ──────────────────────
  var HISTORY_KEY = 'iching_readings';

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch(e) { return []; }
  }

  function saveHistory(list) {
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(list)); } catch(e) {}
  }

  function formatHistDate(ts) {
    var d = new Date(ts);
    var now = new Date();
    var diffMs = now - d;
    var diffDays = Math.floor(diffMs / 86400000);
    if (diffDays === 0) return 'Today · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diffDays === 1) return 'Yesterday · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) +
           ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  function hexLabel(drawsArr) {
    var ls = drawsArr.map(lineType);
    var primary = hexVal(ls);
    var kwP = (typeof VAL_TO_KW !== 'undefined') ? VAL_TO_KW[primary] : '?';
    var changingIdx = ls.reduce(function(a,l,i){ if(l.changing) a.push(i); return a; }, []);
    if (!changingIdx.length) return 'KW ' + kwP;
    var changedLs = ls.map(function(l){ return l.changing ? {yang:!l.yang,changing:false} : l; });
    var secondary = hexVal(changedLs);
    var kwS = (typeof VAL_TO_KW !== 'undefined') ? VAL_TO_KW[secondary] : '?';
    return 'KW ' + kwP + ' → ' + kwS;
  }

  function renderHistPanel(msg) {
    var panel = document.getElementById('histPanel');
    var list = loadHistory();
    var items = list.length
      ? list.slice().reverse().map(function(r) {
          var q = r.question ? r.question : '(no question)';
          var qShort = q.length > 55 ? q.slice(0, 52) + '…' : q;
          return '<div class="hist-item" data-id="' + r.id + '">' +
            '<div class="hist-item-body">' +
              '<div class="hist-date">' + formatHistDate(r.ts) + '</div>' +
              '<div class="hist-q">' + escapeHtml(qShort) + '</div>' +
              '<div class="hist-hex">' + hexLabel(r.draws) +
                (r.pulls && r.pulls.length
                  ? ' · ' + r.pulls.map(function(L){ return 'A' + LETTER_SUIT[L.charAt(0)]; }).join(' ')
                  : '') + '</div>' +
            '</div>' +
            '<button class="hist-del" data-del="' + r.id + '" title="Delete">✕</button>' +
          '</div>';
        }).join('')
      : '<div class="hist-empty">No saved readings yet.</div>';

    // Backup footer — present even when empty (importing on a fresh device
    // is exactly the empty case). MCBackup (site.js) covers every saved
    // store site-wide (readings, birthdays, prefs, scores, progress — see
    // BACKUP_KEYS there), not just this page's readings.
    panel.innerHTML = items +
      '<div class="hist-foot">' +
        '<button type="button" id="ihExport">Export</button>' +
        '<button type="button" id="ihImport">Import</button>' +
        '<input type="file" id="ihImportFile" accept=".json,application/json" style="display:none">' +
        '<span class="hist-foot-msg">' + (msg || '') + '</span>' +
      '</div>';

    document.getElementById('ihExport').addEventListener('click', function(e) {
      e.stopPropagation();
      window.MCBackup.export();
    });
    document.getElementById('ihImport').addEventListener('click', function(e) {
      e.stopPropagation();
      document.getElementById('ihImportFile').click();
    });
    document.getElementById('ihImportFile').addEventListener('change', function() {
      var f = this.files[0];
      if (!f) return;
      window.MCBackup.import(f, function(added) {
        renderHistPanel(added < 0 ? 'could not read that file' :
          added === 0 ? 'nothing new to add' : '✓ ' + added + ' added');
      });
    });

    panel.querySelectorAll('.hist-item').forEach(function(item) {
      item.addEventListener('click', function(e) {
        if (e.target.closest('[data-del]')) return; // handled below
        var id = parseInt(item.getAttribute('data-id'));
        var entry = loadHistory().find(function(r){ return r.id === id; });
        if (entry) { restoreReading(entry); closeHistPanel(); }
      });
    });
    panel.querySelectorAll('[data-del]').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.stopPropagation();
        var id = parseInt(btn.getAttribute('data-del'));
        saveHistory(loadHistory().filter(function(r){ return r.id !== id; }));
        renderHistPanel();
      });
    });
  }

  function closeHistPanel() {
    document.getElementById('histPanel').classList.remove('open');
  }

  function saveReading() {
    // (called internally after each cast — does NOT save to history)
    // History saving is explicit via Save button.
  }

  function persistCurrentReading() {
    if (draws.length < 6) return;
    var list = loadHistory();
    var entry = { id: Date.now(), ts: Date.now(), question: _question, draws: draws };
    if (pulls.length) entry.pulls = pulls.map(function(c){
      return SUIT_LETTER[c.suit] + (c.pos != null ? (c.pos + 1) : '');
    });
    list.push(entry);
    saveHistory(list);
    var btn = document.getElementById('saveReadingBtn');
    btn.innerHTML = '✓';
    btn.disabled = true;
    setTimeout(function(){ btn.style.visibility = 'hidden'; btn.innerHTML = FLOPPY_SVG; btn.disabled = false; }, 1400);
  }

  // ── Shareable reading links ──────────────────────────────
  // A reading is fully defined by its 6 cards + question, encoded in the
  // URL hash: iching.html#r=JH.10S.3D.QC.7H.2S&q=encoded%20question
  // (card token = rank + suit letter, index 0 = line 1 / bottom)
  var SUIT_LETTER = { '♥':'H', '♦':'D', '♣':'C', '♠':'S' };
  var LETTER_SUIT = { 'H':'♥', 'D':'♦', 'C':'♣', 'S':'♠' };

  function readingURL() {
    if (draws.length < 6) return null;
    var r = draws.map(function(c){ return c.rank + SUIT_LETTER[c.suit]; }).join('.');
    var hash = '#r=' + r +
      (pulls.length ? '&a=' + pulls.map(function(c){
        return SUIT_LETTER[c.suit] + (c.pos != null ? (c.pos + 1) : '');
      }).join('.') : '') +
      (_question ? '&q=' + encodeURIComponent(_question) : '');
    return location.origin + location.pathname + hash;
  }

  function decodeHashReading() {
    var h = location.hash.replace(/^#/, '');
    if (!h) return null;
    var params = {};
    h.split('&').forEach(function(p) {
      var i = p.indexOf('=');
      if (i > 0) params[p.slice(0, i)] = p.slice(i + 1);
    });
    if (!params.r) return null;
    var toks = params.r.split('.');
    if (toks.length !== 6) return null;
    var ds = [];
    for (var i = 0; i < 6; i++) {
      var m = /^(A|[2-9]|10|J|Q|K)([HDCS])$/.exec(toks[i]);
      if (!m) return null;
      var suit = LETTER_SUIT[m[2]];
      ds.push({ suit: suit, rank: m[1], red: RED_SUITS.includes(suit), court: COURTS.includes(m[1]) });
    }
    var q = '';
    try { q = params.q ? decodeURIComponent(params.q) : ''; } catch(e) {}
    var ps = [];
    if (params.a) {
      params.a.split('.').forEach(function(L) {
        if (/^[HDCS][1-6]?$/.test(L)) ps.push(L);
      });
      if (ps.length > 4) ps = ps.slice(0, 4);
    }
    return { question: q, draws: ds, pulls: ps };
  }

  function copyShareLink() {
    var url = readingURL();
    if (!url) return;
    var done = function() {
      var btn = document.getElementById('shareBtn');
      var prev = btn.innerHTML;
      btn.innerHTML = '✓';
      btn.disabled = true;
      setTimeout(function(){ btn.innerHTML = prev; btn.disabled = false; }, 1400);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, function(){ legacyCopy(url); done(); });
    } else {
      legacyCopy(url); done();
    }
  }

  function legacyCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  }

  var _isRestoring = false;

  function restoreReading(saved) {
    _isRestoring = true;
    draws = saved.draws.slice();
    lines = draws.map(lineType);
    pulls = (saved.pulls || []).map(function(L) {
      var suit = LETTER_SUIT[L.charAt(0)];
      var pos = /^[1-6]$/.test(L.charAt(1)) ? parseInt(L.charAt(1), 10) - 1 : null;
      return { suit: suit, rank: 'A', red: RED_SUITS.includes(suit), court: false, pos: pos };
    });
    _question = saved.question || '';

    document.getElementById('questionInput').value = _question;
    showAsked();

    buildSlots();
    draws.forEach(function(card, idx) { fillSlot(idx, card, false); });

    document.getElementById('resultWrap').style.display = 'none';
    document.getElementById('governingLine').innerHTML = '';

    showResult();
    _isRestoring = false;

    // Hide save btn (already saved)
    document.getElementById('saveReadingBtn').style.visibility = 'hidden';
    window.scrollTo({ top: document.getElementById('oracle').offsetTop - 80, behavior: 'smooth' });
  }

  function startRound() {
    deck = shuffle(buildDeck());
    draws = [];
    lines = [];
    pulls = [];
    deckPos = 0;
    _question = document.getElementById('questionInput').value.trim();
    showAsked();
    buildSlots();
    document.getElementById('pullBanner').style.display = 'none';
    document.getElementById('pullBanner').innerHTML = '';
    document.getElementById('resultWrap').style.display = 'none';
    document.getElementById('governingLine').innerHTML = '';
    document.getElementById('saveReadingBtn').style.visibility = 'hidden';
    document.getElementById('shareBtn').style.visibility = 'hidden';
    // Drop any stale shared-reading hash so the URL matches the new cast
    if (location.hash) history.replaceState(null, '', location.pathname + location.search);
  }

  // ── Ruling / governing line (Alfred Huang – Wilhelm system) ──────────────
  // changingIdx: sorted indices 0–5, where 0 = bottom (line 1) … 5 = top (line 6).
  // Returns which single line governs and in which hexagram its text is read.
  // For 1–3 moving lines the text is read in the Cast hexagram; for 4–5 in the
  // “Becomes” hexagram. 0 or 6 moving lines fall back to the Judgment.
  function governingLine(changingIdx, primary, secondary) {
    var n = changingIdx.length;
    var parity = function (i) { return (primary >> (5 - i)) & 1; }; // 1 = yang, 0 = yin
    var still = [0,1,2,3,4,5].filter(function (i) { return changingIdx.indexOf(i) === -1; });
    if (n === 0) return { mode: 'judgment', src: 'primary' };
    if (n === 1) return { mode: 'line', line: changingIdx[0], src: 'primary' };
    if (n === 2) {
      var a = changingIdx[0], b = changingIdx[1], line;
      if (parity(a) !== parity(b)) line = (parity(a) === 0) ? a : b; // the yin line
      else line = a;                                                 // both alike → lower
      return { mode: 'line', line: line, src: 'primary' };
    }
    if (n === 3) return { mode: 'line', line: changingIdx[1], src: 'primary' };       // middle
    if (n === 4) return { mode: 'line', line: still[still.length - 1], src: 'relating' }; // upper still line
    if (n === 5) return { mode: 'line', line: still[0], src: 'relating' };            // sole still line
    // n === 6
    if (primary === 63) return { mode: 'special', text: 'Use Nine', src: 'primary' }; // Qian
    if (primary === 0)  return { mode: 'special', text: 'Use Six',  src: 'primary' }; // Kun
    return { mode: 'judgment', src: 'relating' };
  }

  function lineName(val, i) {
    var bit = (val >> (5 - i)) & 1;
    var pos = ['at the beginning','in the second place','in the third place',
               'in the fourth place','in the fifth place','at the top'][i];
    return (bit ? 'Nine' : 'Six') + ' ' + pos;
  }

  // Moving-line text for a hexagram value + line index (0 = bottom / line 1).
  function lineText(val, i) {
    var kw = (typeof VAL_TO_KW !== 'undefined') ? VAL_TO_KW[val] : null;
    var arr = (kw && typeof LINE_DATA !== 'undefined') ? LINE_DATA[kw] : null;
    return (arr && arr[i]) ? arr[i] : '';
  }

  // Expandable list of every moving line, read in the cast (primary) hexagram.
  // rulingIdx = the line that governs, if it is one of these primary lines (else -1).
  function movingLinesHTML(changingIdx, primary, rulingIdx) {
    var items = [5,4,3,2,1,0].map(function(i) {
      var isChanging = changingIdx.indexOf(i) !== -1;
      var isRuling = (i === rulingIdx);
      var cls = 'ml-item ' + (isChanging ? 'changing' : 'still') + (isRuling ? ' ruling' : '');
      var txt = lineText(primary, i) ? '<div class="ml-text">' + escapeHtml(lineText(primary, i)) + '</div>' : '';
      return '<div class="' + cls + '">' +
        '<div class="ml-label">' + lineName(primary, i) +
          (isRuling ? '<span class="ml-tag">rules</span>' : '') + '</div>' +
        txt +
      '</div>';
    }).join('');
    return '<div class="gl-more">' +
      '<button type="button" class="gl-toggle" aria-expanded="false">Show all lines</button>' +
      '<div class="gl-lineswrap"><div class="gl-linesmin">' +
        '<div class="gl-lines">' + items + '</div>' +
      '</div></div>' +
    '</div>';
  }

  function wireGlToggle(el) {
    var btn = el.querySelector('.gl-toggle');
    if (!btn) return;
    var more = el.querySelector('.gl-more');
    if (!more) return;
    btn.addEventListener('click', function () {
      var open = more.classList.toggle('open');   // CSS unfurls .gl-lineswrap 0fr→1fr
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Hide all lines' : 'Show all lines';
    });
  }

  var GL_RULE = {
    1: 'One moving line — it speaks directly.',
    2: 'Two moving lines — the yin line leads; if both are alike, the lower leads.',
    3: 'Three moving lines — the middle one rules.',
    4: 'Four moving lines — the upper of the two still lines rules, read in the “Becomes” hexagram.',
    5: 'Five moving lines — the single still line rules, read in the “Becomes” hexagram.'
  };

  function renderGoverningLine(changingIdx, primary, secondary) {
    var el = document.getElementById('governingLine');
    var n = changingIdx.length;
    var g = governingLine(changingIdx, primary, secondary);

    // Index (0-5) of the governing line within the cast hexagram, or -1 when it
    // is read in the relating hexagram (n=4,5) or is not a single line.
    var rulingIdx = (g.mode === 'line' && g.src === 'primary') ? g.line : -1;
    var moreHTML = movingLinesHTML(changingIdx, primary, rulingIdx);

    if (g.mode === 'judgment') {
      var msg = (g.src === 'primary')
        ? 'No moving lines — the reading rests on the hexagram’s Judgment as a whole.'
        : 'All six lines moving — the reading passes to the Judgment of the “Becomes” hexagram.';
      el.innerHTML = '<div class="gl-label">Ruling Line</div><div class="gl-note">' + msg + '</div>' + moreHTML;
      wireGlToggle(el);
      return;
    }
    if (g.mode === 'special') {
      el.innerHTML =
        '<div class="gl-label">Ruling Line</div>' +
        '<div class="gl-name">' + g.text + '</div>' +
        '<div class="gl-src">All lines moving · ' + (primary === 63 ? 'The Creative' : 'The Receptive') + '</div>' +
        '<div class="gl-note">Every line is moving, so the whole figure turns over; read it in the Judgment, then in what it becomes. The six lines below speak in turn.</div>' +
        moreHTML;
      wireGlToggle(el);
      return;
    }
    var srcVal = (g.src === 'relating') ? secondary : primary;
    var txt = lineText(srcVal, g.line);
    el.innerHTML =
      '<div class="gl-label">Ruling Line</div>' +
      '<div class="gl-name">' + lineName(srcVal, g.line) + '</div>' +
      '<div class="gl-src">Line ' + (g.line + 1) + ' · ' +
        (g.src === 'relating' ? '“Becomes” hexagram' : 'Cast hexagram') +
        ' · King Wen ' + VAL_TO_KW[srcVal] + '</div>' +
      '<div class="gl-desc' + (txt ? '' : ' placeholder') + '">' +
        (txt ? escapeHtml(txt) : 'Line text unavailable.') + '</div>' +
      '<div class="gl-rule">' + (GL_RULE[n] || '') + '</div>' +
      moreHTML;
    wireGlToggle(el);
  }

  // Card face rendering — matches quadration.html (pip layouts, serif corner ranks)
  var SUIT_CLASS = { '♥':'hearts', '♦':'diamonds', '♣':'clubs', '♠':'spades' };
  var PIP_LAYOUTS = {
    // Standardized vertical grid: top pip at 8%, bottom at 92% for every card, with
    // rows spaced evenly by count, so same-type columns line up across the deck.
    'A':  [[50,50,0]],
    '2':  [[50,8,0],[50,92,1]],
    '3':  [[50,8,0],[50,50,0],[50,92,1]],
    '4':  [[25,8,0],[75,8,0],[25,92,1],[75,92,1]],
    '5':  [[25,8,0],[75,8,0],[50,50,0],[25,92,1],[75,92,1]],
    '6':  [[25,8,0],[75,8,0],[25,50,0],[75,50,0],[25,92,1],[75,92,1]],
    '7':  [[25,8,0],[75,8,0],[50,29,0],[25,50,0],[75,50,0],[25,92,1],[75,92,1]],
    '8':  [[25,8,0],[75,8,0],[50,29,0],[25,50,0],[75,50,0],[50,71,1],[25,92,1],[75,92,1]],
    '9':  [[25,8,0],[75,8,0],[25,36,0],[75,36,0],[50,50,0],[25,64,1],[75,64,1],[25,92,1],[75,92,1]],
    '10': [[25,8,0],[75,8,0],[50,22,0],[25,36,0],[75,36,0],[25,64,1],[75,64,1],[50,78,1],[25,92,1],[75,92,1]]
  };

  // Per-court pip placement [x%, y%] (mirror rotated). Listed cards put the pip
  // beside the head; the rest use the default corner triangles.
  var COURT_PIP_DEFAULT = [31, 23.1];         // on the number-card grid: left column, top row; size from CSS (.court-pip)
  var COURT_PIP_POS = {};                      // e.g. QS: [33,22] to nudge one card

  function cardFaceHTML(card) {
    var rank = card.rank, sym = card.suit;
    var corners =
      '<div class="card-corner card-tl"><span class="cc-rank">' + rank + '</span></div>' +
      '<div class="card-corner card-br"><span class="cc-rank">' + rank + '</span></div>';
    if (['J','Q','K'].indexOf(rank) !== -1) {
      var suitLetter = sym === '♥' ? 'H' : sym === '♦' ? 'D' : sym === '♣' ? 'C' : 'S';
      var mark = (window.pipMark ? window.pipMark(sym) : sym);
      var pos = COURT_PIP_POS[rank + suitLetter] || COURT_PIP_DEFAULT;
      var courtPips =
        '<span class="court-pip" style="left:' + pos[0] + '%;top:' + pos[1] + '%">' + mark + '</span>' +
        '<span class="court-pip" style="left:' + (100 - pos[0]) + '%;top:' + (100 - pos[1]) + '%;transform:translate(-50%,-50%) rotate(180deg)">' + mark + '</span>';
      return corners + courtPips + '<img class="court-art" src="assets/cards/' + rank + suitLetter + '.webp" alt="' + rank + ' of ' + SUIT_CLASS[sym] + '">';
    }
    var layout = PIP_LAYOUTS[rank];
    if (!layout) return corners;
    var ace = rank === 'A';
    var mark = (window.pipMark ? window.pipMark(sym) : sym);
    return corners + '<div class="card-pips">' +
      layout.map(function (p) {
        return '<span class="pip' + (p[2] ? ' inv' : '') + (ace ? ' ace' : '') +
               '" style="left:' + p[0] + '%;top:' + p[1] + '%">' + mark + '</span>';
      }).join('') + '</div>';
  }

  // Six line slots, built up front so the cast layout is visible before any
  // draw and each card simply reveals into its place.
  var slotEls = [], slotNoEls = [], slotTypeEls = [];
  function buildSlots() {
    var row = document.getElementById('cardsRow');
    row.innerHTML = '';
    slotEls = []; slotNoEls = []; slotTypeEls = [];
    for (var i = 0; i < 6; i++) {
      var wrap = document.createElement('div');
      wrap.className = 'card-line';
      var no = document.createElement('div');
      no.className = 'cl-no';
      no.textContent = '';
      var el = document.createElement('div');
      el.className = 'spread-card slot';
      el.setAttribute('aria-hidden', 'true');
      var tp = document.createElement('div');
      tp.className = 'cl-type';
      tp.textContent = '';
      wrap.appendChild(no);
      wrap.appendChild(el);
      wrap.appendChild(tp);
      row.appendChild(wrap);
      slotEls.push(el); slotNoEls.push(no); slotTypeEls.push(tp);
    }
  }

  // Reveal a drawn card into its slot. The label above becomes the line's bit
  // (1 = yang, 0 = yin) so the row reads as the hexagram's binary lookup key.
  function fillSlot(idx, card, animate) {
    var el = slotEls[idx], no = slotNoEls[idx], tp = slotTypeEls[idx];
    if (!el) return;
    var lt = lineType(card);
    no.textContent = lt.yang ? '1' : '0';
    if (tp) {
      tp.innerHTML = lt.yang
        ? '<svg width="26" height="4" aria-hidden="true"><rect width="26" height="4" rx="1.5" fill="currentColor"/></svg>'
        : '<svg width="26" height="4" aria-hidden="true"><rect x="0" width="11" height="4" rx="1.5" fill="currentColor"/><rect x="15" width="11" height="4" rx="1.5" fill="currentColor"/></svg>';
      tp.className = 'cl-type' + (lt.changing ? ' changing' : '');
    }
    // No 'clickable' class and no handler — the cast cards are display-only
    // (the cast-card popup was removed 2026-07-06; the hexagram popup on the
    // sequence chart is the reading's detail view). Keeping 'clickable' off
    // also keeps site.js's a11y tagger from re-marking them as buttons.
    el.className = 'spread-card ck-host ' + SUIT_CLASS[card.suit] +
      (card.court ? ' changing' : '');
    el.title = 'Line ' + (idx + 1) + ' · ' + card.rank + card.suit;
    // 3D flip: card lands face-down (shared .card-back) and turns to reveal its
    // face. Without .dealing (restored readings) the flip rests front-up.
    el.innerHTML =
      '<div class="ck-flip' + (animate ? ' dealing' : '') + '">' +
        '<div class="ck-side ck-front">' + cardFaceHTML(card) + '</div>' +
        '<div class="ck-side ck-back"><div class="card-back"><span class="cb-coin"></span></div></div>' +
      '</div>';
  }

  // Aces: currently KEPT in the pack — a red ace reads as young yang, a black
  // ace as young yin, like any other pip. Flip KEEP_ACES to false to restore
  // the old behaviour where an ace steps aside as a "suit-pull" and the next
  // card fills the line. That version keeps the exact 3-coin line odds
  // (3/8, 3/8, 1/8, 1/8); keeping aces shifts young:changing slightly (40:12
  // instead of 36:12). TODO: revisit whether to pull aces again in future.
  var KEEP_ACES = true;
  function drawOne() {
    var card = deck[deckPos++];
    if (!KEEP_ACES) {
      while (card && card.rank === 'A') {
        card.pos = draws.length;   // 0-based line index the ace was drawn for
        pulls.push(card);
        card = deck[deckPos++];
      }
    }
    draws.push(card);
    lines.push(lineType(card));
    fillSlot(draws.length - 1, card, true);
  }

  // ── Ace suit-pulls ───────────────────────────────────────
  var SUIT_NAME = { '♥':'Hearts', '♦':'Diamonds', '♣':'Clubs', '♠':'Spades' };
  var PULL_TEXT = {
    '♥': 'The reading leans toward the heart. Feeling and the bonds between people carry weight here.',
    '♣': 'The reading leans toward the mind. Thought, speech, and what is being learned carry weight here.',
    '♦': 'The reading leans toward value. What things are worth, and what they cost, carries weight here.',
    '♠': 'The reading leans toward work and will. The body and its labor carry weight here.'
  };

  function renderPulls() {
    var el = document.getElementById('pullBanner');
    if (!pulls.length) { el.innerHTML = ''; el.style.display = 'none'; return; }
    el.innerHTML = pulls.map(function (c) {
      var pos = (c.pos != null && c.pos >= 0 && c.pos <= 5)
        ? '<span class="pull-pos">· drawn at line ' + (c.pos + 1) + '</span>' : '';
      return '<div class="pull-row">' +
        '<div class="spread-card pull-card visible ' + SUIT_CLASS[c.suit] + '">' + cardFaceHTML(c) + '</div>' +
        '<div class="pull-body">' +
          '<div class="pull-name">Ace of ' + SUIT_NAME[c.suit] + pos + '</div>' +
          '<div class="pull-desc">' + PULL_TEXT[c.suit] + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    el.style.display = 'flex';
  }

  function showResult() {
    var primary = hexVal(lines);
    var changingIdx = lines.reduce(function(a, l, i){ if(l.changing) a.push(i); return a; }, []);
    var hasChanging = changingIdx.length > 0;
    var changedLines = lines.map(function(l) {
      return l.changing ? { yang: !l.yang, changing: false } : l;
    });
    var secondary = hexVal(changedLines);

    _lastPrimary = primary; _lastSecondary = secondary; _lastChanging = changingIdx;

    var _rw = document.getElementById('resultWrap');
    _rw.style.display = 'flex';
    // Guarded fadeUp entrance so the result stage breathes in as one beat after
    // the last card lands (see castOne/castAll). .cast-figs.fade is reduced-motion-guarded.
    _rw.classList.remove('fade'); void _rw.offsetWidth; _rw.classList.add('fade');
    renderPulls();
    renderHexResult(document.getElementById('hexPrimary'), primary, 'Cast', changingIdx);

    var prim = document.getElementById('hexPrimary');
    prim.onclick = function () { selectReading('primary'); };

    var chg = document.getElementById('hexChanging');
    var sec = document.getElementById('hexSecondary');
    if (hasChanging) {
      // Middle tile = the changing lines (its own view); right tile = Becomes.
      document.getElementById('changingCol').style.display = 'flex';
      renderChangingTile(chg, primary, changingIdx);
      chg.onclick = function () { selectReading('lines'); };

      document.getElementById('becomesCol').style.display = 'flex';
      renderHexResult(sec, secondary, 'Becomes', null);
      sec.onclick = function () { selectReading('secondary'); };

      renderGoverningLine(changingIdx, primary, secondary);
    } else {
      document.getElementById('changingCol').style.display = 'none';
      chg.onclick = null;
      document.getElementById('becomesCol').style.display = 'none';
      sec.onclick = null;
      document.getElementById('governingLine').innerHTML = '';
    }

    selectReading('primary');   // default to the Cast hexagram

    if (window.setCastGlow) window.setCastGlow(hasChanging ? [primary, secondary] : [primary]);
    if (!_isRestoring) {
      var sBtn = document.getElementById('saveReadingBtn');
      sBtn.innerHTML = FLOPPY_SVG;
      sBtn.disabled = false;
      sBtn.style.visibility = 'visible';
    }
    // Share is available for any complete reading, fresh or restored
    document.getElementById('shareBtn').style.visibility = 'visible';
  }

  // Both tiles are clickable; clicking one loads its reading below and marks it active
  // Three mutually-exclusive views: the Cast hexagram, the changing lines (the →
  // button), and the Becomes hexagram. Only one is shown at a time.
  function selectReading(which) {
    var ot = document.getElementById('oracleText');
    var gl = document.getElementById('governingLine');
    if (which === 'lines') {
      ot.style.display = 'none';
      gl.classList.remove('gl-collapsed');
      gl.classList.remove('fade'); void gl.offsetWidth; gl.classList.add('fade');
    } else {
      var val = (which === 'secondary') ? _lastSecondary : _lastPrimary;
      if (val == null) return;
      gl.classList.add('gl-collapsed');
      ot.style.display = '';
      ot.innerHTML = (window.hexAnswerHTML ? window.hexAnswerHTML(val) : '');
      ot.classList.remove('fade'); void ot.offsetWidth; ot.classList.add('fade');
    }
    document.getElementById('hexPrimary').classList.toggle('active', which === 'primary');
    document.getElementById('hexSecondary').classList.toggle('active', which === 'secondary');
    var chg = document.getElementById('hexChanging');
    chg.classList.toggle('active', which === 'lines');
    chg.setAttribute('aria-pressed', which === 'lines' ? 'true' : 'false');
  }

  function updateButtons() {
    var label = (!deck || draws.length >= 6 || draws.length === 0) ? 'Cast a line' : 'Cast the next line';
    var b = document.getElementById('castOneBtn');
    b.title = label;
    b.setAttribute('aria-label', label);
  }

  // Run cb once the sixth card has finished dealing in, so the result reveals
  // as a deliberate beat AFTER the last card lands (the old fixed 360/390ms
  // timers could fire while the sixth card was still mid-flip). dealIn is .42s
  // (dealFade .25s under reduced motion) — both fire animationend; the timeout
  // is a belt-and-braces fallback so the result never stays hidden.
  function afterSixthDeal(cb) {
    var el = slotEls[5];
    var done = false;
    var fire = function () { if (done) return; done = true; cb(); };
    if (el) el.addEventListener('animationend', fire, { once: true });
    setTimeout(fire, 520);
  }

  // A touch of ceremony: shimmer the cast-icon sparkle in time with the press
  // (reuses castPulse's glow language; guarded for reduced motion in CSS).
  function sparkCast() {
    var s = document.querySelector('#castOneBtn .cast-spark');
    if (!s) return;
    s.classList.remove('spark'); s.getBoundingClientRect(); s.classList.add('spark');
  }

  function castOne() {
    if (!deck || draws.length >= 6) startRound();
    sparkCast();
    drawOne();
    if (draws.length === 6) { afterSixthDeal(showResult); }
    updateButtons();
  }

  function castAll() {
    if (!deck || draws.length >= 6) startRound();
    var oneBtn = document.getElementById('castOneBtn');
    var allBtn = document.getElementById('castAllBtn');
    oneBtn.disabled = true; allBtn.disabled = true;
    (function next(){
      if (draws.length >= 6) {
        afterSixthDeal(function(){
          showResult();
          oneBtn.disabled = false; allBtn.disabled = false;
          updateButtons();
        });
        return;
      }
      drawOne();
      setTimeout(next, 150);
    })();
  }

  var FLOPPY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" style="display:block;pointer-events:none"><path fill="currentColor" fill-rule="evenodd" d="M1 1H10L14 5V15H1ZM3 2H8V6.5H3ZM3 10.5H13V14H3Z"/></svg>';

  document.getElementById('castOneBtn').addEventListener('click', castOne);
  document.getElementById('castAllBtn').addEventListener('click', castAll);
  document.getElementById('saveReadingBtn').addEventListener('click', persistCurrentReading);
  document.getElementById('shareBtn').addEventListener('click', copyShareLink);
  document.getElementById('historyBtn').addEventListener('click', function(e) {
    e.stopPropagation();
    var panel = document.getElementById('histPanel');
    var opening = !panel.classList.contains('open');
    if (opening) renderHistPanel();
    panel.classList.toggle('open', opening);
  });
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.hist-wrap')) closeHistPanel();
  });
  document.getElementById('questionInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); castAll(); }
  });

  // (The cast-card popup — click a dealt card for its suit/rank reading — was
  // removed 2026-07-06; the cards are display-only. The hexagram popup opened
  // from the sequence chart is untouched.)

  // Show the six empty line slots up front (a shared reading below fills them).
  buildSlots();

  // ── Restore a shared reading from the URL hash, if present ──
  // (Explicitly shared links only — normal page loads still start clean.)
  (function() {
    var shared = decodeHashReading();
    if (!shared) return;
    restoreReading(shared);
    // A shared reading isn't in this visitor's history yet — allow saving it
    var sBtn = document.getElementById('saveReadingBtn');
    sBtn.innerHTML = FLOPPY_SVG;
    sBtn.disabled = false;
    sBtn.style.visibility = 'visible';
  })();

})();

(function(){
  var ft = document.getElementById('trigram-row');
  if (!ft || typeof trigramSVG !== 'function') return;

  // Keyed by the Fu Xi binary value (0–7) the header row uses; the SVG draws the
  // MSB as the bottom line, so these read bottom-to-top. Text: iching-eight-trigrams.
  var TRIGRAMS = {
    0:{en:'Earth',py:'Kūn',han:'坤',lines:'broken · broken · broken',image:'the earth, the field, what receives',attribute:'receptive, yielding, devoted',family:'the mother',direction:'southwest',season:'late summer into autumn',element:'earth',line:'Three open lines, and the whole weight of the ground in them.',text:'What carries and gives form to what Heaven begins. It does not lead, it sustains, and in sustaining it holds more than the force that started the thing. The earth says yes to the seed and grows it without being asked twice. Left without direction it loses itself and wanders, strong with nowhere to put the strength.'},
    1:{en:'Mountain',py:'Gèn',han:'艮',lines:'broken · broken · solid',image:'the mountain, the gate, the place of stopping',attribute:'still, resting, keeping',family:'the youngest son',direction:'northeast',season:'late winter into spring',element:'earth',line:'One firm line rests on top, and everything beneath it holds its peace.',text:'Stillness that is chosen, not stillness that is stuck. The mountain does not strain to stay; it simply does not move, and the quiet of it settles whatever comes near. There is a time to stop, and stopping then is its own kind of motion. Held past its hour, the stillness sours into a stubbornness that will not rise.'},
    2:{en:'Water',py:'Kǎn',han:'坎',lines:'broken · solid · broken',image:'water, the gorge, the pit, the deep',attribute:'dangerous, flowing, unstopping',family:'the middle son',direction:'north',season:'midwinter',element:'water',line:'A single firm line held inside the dark, and the dark does not put it out.',text:'The deep place and the danger in it, and the one thing that crosses the danger whole. Water fills each hollow as it comes to it and moves on, losing nothing of itself in the falling. The truth kept at the center is what carries you through. Fought against, the deep only pulls harder.'},
    3:{en:'Wind',py:'Xùn',han:'巽',lines:'broken · solid · solid',image:'wind, wood, the slow root, the gentle press',attribute:'penetrating, gradual, gentle',family:'the eldest daughter',direction:'southeast',season:'late spring into summer',element:'wood',line:'One soft line opens below, and the steady thing above leans down into it.',text:'What works by not forcing. Wind finds every gap and goes through it, and the root splits the stone by taking its time. Gentleness repeated, without break, gets where force cannot reach. Made too soft, it scatters and presses nowhere, all motion and no mark.'},
    4:{en:'Thunder',py:'Zhèn',han:'震',lines:'solid · broken · broken',image:'thunder, the sudden quake, the rousing shock',attribute:'arousing, moving, quickening',family:'the eldest son',direction:'east',season:'spring',element:'wood',line:'One hard line breaks open beneath two soft, and the ground moves.',text:'The shock that wakes what was sleeping. It comes from below and rises, terrible for a moment and then gone, leaving the air cleaner than it found it. Fear flares and passes, and what stayed standing through it stands truer. Mistaken for the disaster itself, it is only the noise that clears the way.'},
    5:{en:'Fire',py:'Lí',han:'離',lines:'solid · broken · solid',image:'fire, the sun, brightness, what clings to give light',attribute:'clinging, clear, radiant',family:'the middle daughter',direction:'south',season:'midsummer',element:'fire',line:'Two bright lines close around a hollow, and the hollow is where the light lives.',text:'Light that holds to something in order to shine. Fire has no body of its own, it clings to the wood and burns, and clarity is the same; it rests on what it lights and would go dark alone. Seeing clearly is the gift here. Fed too hard, the flame consumes its own footing and leaves ash.'},
    6:{en:'Lake',py:'Duì',han:'兌',lines:'solid · solid · broken',image:'the lake, the marsh, the open mouth, still water under open sky',attribute:'joyous, open, glad',family:'the youngest daughter',direction:'west',season:'autumn',element:'metal',line:'Two firm lines below, and one open above, the way still water lies open to the air.',text:'Gladness that comes from the inside and shows on the surface. The lake takes the sky into itself and gives it back as brightness, and true joy works the same, firm underneath and open on top. Pleasure shared this way strengthens what it touches. Open all the way down with nothing firm beneath, it slides into flattery and the gladness goes thin.'},
    7:{en:'Heaven',py:'Qián',han:'乾',lines:'solid · solid · solid',image:'heaven, the sky, pure force',attribute:'creative, strong, tireless',family:'the father',direction:'northwest',season:'late autumn into winter',element:'metal',line:'Three unbroken lines, and nothing in them that yields.',text:'The force that begins things and does not tire of beginning. It is the open sky over everything, the strength that holds without leaning on anything, the will that moves first and asks nothing to move it. When it overreaches it hardens into a strength that cannot bend, and breaks for it.'}
  };

  var detail = document.getElementById('tgDetail');
  var pop = document.getElementById('tgPop');
  var dwrap = pop ? pop.querySelector('.tg-detailwrap') : null;
  if (dwrap) dwrap.inert = true;   // collapsed panel is out of tab order / interaction
  var cur = -1, cells = [];
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };

  // Route every active-cell update through one helper that explicitly
  // clears ALL cells first, then sets the active one — defensive against
  // any stale .active state that a toggle pattern could miss (the same
  // fix applied to the cardsoflife planet popup).
  function setActiveCell(idx){
    cells.forEach(function(c){
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    if (idx >= 0 && cells[idx]){
      cells[idx].classList.add('active');
      cells[idx].setAttribute('aria-pressed', 'true');
    }
  }

  function show(v, scroll){
    var d = TRIGRAMS[v]; if (!d) return;
    var wasOpen = pop.classList.contains('open');  // open already → ‹ › step, not a first open
    cur = v;
    document.getElementById('tgFig').innerHTML  = trigramSVG(v, 2);
    document.getElementById('tgName').textContent = d.en;
    // Subtitle: pinyin · hanzi · yin/yang composition (bottom-up). Solid
    // lines = yang, broken = yin — replaces the old "broken · broken ·
    // broken (bottom-up)" wording with the I Ching-native pair.
    var yy = d.lines.replace(/broken/g, 'yin').replace(/solid/g, 'yang');
    document.getElementById('tgSub').textContent  = d.py + ' · ' + d.han + '  ·  ' + yy;
    document.getElementById('tgLine').textContent = d.line;
    document.getElementById('tgAttrs').innerHTML =
      '<dt>Image</dt><dd>' + esc(d.image) + '</dd>' +
      '<dt>Attribute</dt><dd>' + esc(d.attribute) + '</dd>' +
      '<dt>Family</dt><dd>' + esc(d.family) + '</dd>' +
      '<dt>Direction</dt><dd>' + esc(d.direction) + '</dd>' +
      '<dt>Season</dt><dd>' + esc(d.season) + '</dd>' +
      '<dt>Element</dt><dd>' + esc(d.element) + '</dd>';
    document.getElementById('tgPara').textContent = d.text;
    pop.classList.add('open');
    if (dwrap) dwrap.inert = false;
    setActiveCell(v);
    // First open unfurls the panel (grid-rows 0fr→1fr + the detail slide); a
    // step has already unfurled, so cross-fade the detail card instead of
    // jump-cutting. .step-fade is guarded for reduced motion in site.css.
    if (wasOpen) {
      var card = pop.querySelector('.tg-card');
      if (card) { card.classList.remove('step-fade'); void card.offsetWidth; card.classList.add('step-fade'); }
    }
    if (scroll) {
      var _red = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
      pop.scrollIntoView({ behavior: _red ? 'auto' : 'smooth', block: 'nearest' });
    }
  }
  function step(dir){ if (cur < 0) return; show((cur + dir + 8) % 8, false); }
  function hide(){
    pop.classList.remove('open');
    if (dwrap) dwrap.inert = true;
    setActiveCell(-1);
    cur = -1;
  }
  // Clicking a trigram toggles: open it, or minimise the panel if it's already active.
  function pick(val){ if (cur === val) hide(); else show(val, true); }

  for (var v = 0; v < 8; v++){
    (function(val){
      var wrap = document.createElement('div');
      wrap.className = 'tg-cell';
      wrap.style.cssText = 'display:flex; flex-direction:column; align-items:center; gap:4px; opacity:0.8;';
      wrap.innerHTML = trigramSVG(val, 1);
      wrap.setAttribute('role', 'button'); wrap.setAttribute('tabindex', '0');
      wrap.setAttribute('aria-pressed', 'false');
      wrap.setAttribute('aria-label', TRIGRAMS[val].en + ' — show meaning');
      wrap.addEventListener('click', function(){ pick(val); });
      wrap.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(val); return; }
        // Left/Right step between trigrams (Up/Down left alone so the page can scroll).
        // While the panel is open they mirror the ‹ › buttons; closed, they just rove focus.
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          e.preventDefault();
          var dir = e.key === 'ArrowRight' ? 1 : -1;
          var t = ((cur >= 0 ? cur : val) + dir + 8) % 8;
          if (cur >= 0) show(t, false);
          cells[t].focus();
        }
      });
      cells.push(wrap); ft.appendChild(wrap);
    })(v);
  }

  document.getElementById('tgPrev').addEventListener('click', function(){ step(-1); });
  document.getElementById('tgNext').addEventListener('click', function(){ step(1); });
  // Swipe left/right on the detail panel (mobile)
  var sx = null;
  detail.addEventListener('touchstart', function(e){ sx = e.changedTouches[0].clientX; }, { passive: true });
  detail.addEventListener('touchend', function(e){
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
  }, { passive: true });
})();

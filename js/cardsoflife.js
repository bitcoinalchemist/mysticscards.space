// ── Constants ────────────────────────────────────────────────────
const SUIT_ORDER    = ['hearts','clubs','diamonds','spades','joker'];
const MONTH_NAMES   = ['','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAYS_IN_MONTH = [0,31,29,31,30,31,30,31,31,30,31,30,31];

// Solar value formula: 55 − (2×month + day)
// A♥=1 … K♥=13, A♣=14 … K♣=26, A♦=27 … K♦=39, A♠=40 … K♠=52, Joker=0
function solarValue(month, day) {
  return 55 - (2 * month + day);
}

// Auto-generate every birth date for each card
(function buildDates() {
  const lists = Array.from({length: 52}, () => []);
  for (let m = 1; m <= 12; m++) {
    for (let d = 1; d <= DAYS_IN_MONTH[m]; d++) {
      const sv = solarValue(m, d);
      if (sv >= 1 && sv <= 52) lists[sv - 1].push(`${MONTH_NAMES[m]} ${d}`);
    }
  }
  CARDS.forEach((c, i) => { c.dates = lists[i].join(', '); });
})();


// Joker — outside the 52-card system
CARDS.push({
  rank:'✦', suit:'joker', sym:'✦', name:'The Joker', dates:'Dec 31',
    teaser:'Alpha and Omega, valued at zero, pure potential standing between the Ace of Hearts and the King of Spades and belonging to no suit at all. The whole task of a life lived here is discovering which card you are truly choosing to play, and why.',
  kws:['Wild card','5th element','Fool'],
  personality:'Alpha and Omega, the Joker carries the numeric value of zero — pure potential, and in a sense the highest card of all, its influence lying beyond what the system can contain. Standing at the midpoint between the Ace of Hearts and the King of Spades, you belong to no suit and no system: a shapeshifter who can be all things to all people.\n\nAn inventor, a healer, and a powerful agent of change, you are fascinating to others and a mystery even unto yourself. In the deck\'s calendar the Joker is the remainder, the one day the system needs but cannot hold; you exist above the Sun Line, beholden to no single planetary influence. The life task is to discover which card you are truly choosing to play, and why, embodying the open heart of the Ace alongside the disciplined mastery of the King.',
  strengths:['Extraordinary adaptability, genuinely able to inhabit any role, field, or environment','Remarkable creative potential, with a natural affinity for performance, music, and art','Personal magnetism that draws people in across every context and culture','Unconstrained by the fixed path of any single card; the full deck is available to you'],
  challenges:['The absence of a fixed identity can make sustained commitment feel genuinely elusive','Chameleon energy, when unconscious, can shade into dishonesty or shape-shifting for approval','Prestige and control are shadow poles worth examining honestly when they arise','Emotional insecurity, reflected in the 3 of Hearts, can cloud judgement and create mistrust','The freedom of this card is also its greatest responsibility: choose your card deliberately']
});

// ── Day selects ──────────────────────────────────────────────────
function populateDays(monthId, dayId) {
  function rebuild(m) {
    const sel = document.getElementById(dayId);
    const prev = sel.value;
    const days = m ? [0,31,29,31,30,31,30,31,31,30,31,30,31][m] : 31;
    sel.innerHTML = '<option value="">DD</option>';
    for (let d = 1; d <= days; d++) {
      const o = document.createElement('option');
      o.value = d; o.textContent = d;
      sel.appendChild(o);
    }
    if (prev && +prev <= days) sel.value = prev; // keep a still-valid selection
  }
  document.getElementById(monthId).addEventListener('change', function() {
    rebuild(parseInt(this.value) || 0);
  });
}
populateDays('fMonth',    'fDay');
populateDays('relMonth2', 'relDay2');

// Run the lookup only once the needed fields are complete — no nagging alerts
// if a day is chosen before a month (or vice-versa).
// (Section minimise/maximise — toggleSection + auto-restore live in
// js/site.js now, shared across pages. Any .page-section that opens with
// a direct .section-toggle child opts in.)

// Helpers — show / hide a result panel with entry / exit animations that
// reliably play. Going hidden → visible: add .visible, force a layout
// flush, then add .result-entry (the simultaneous display:none → block
// flip would otherwise skip the animation's first frame). Going visible
// → hidden: add .result-exit (the mirror animation), then strip .visible
// + .result-exit after it finishes. Both helpers cancel each other's
// pending timeouts so rapid wheel changes don't double-trigger.
// _suppressAutoExpand: set true while loading a saved birthday from Your
// Cards (loadBirth), so picking one there doesn't yank a collapsed Finder
// section back open (and the page-shift/scroll that comes with it). The
// Finder result still updates silently underneath — it's just not forced
// into view. Deliberate Finder-opening flows (share links, "Open full
// profile") are untouched.
let _suppressAutoExpand = false;
function _showResultEntry(el) {
  if (!el) return;
  // Auto-expand the parent section if it's collapsed — otherwise the
  // result animates inside an invisible accordion. Applies generically
  // to any .page-section ancestor that uses the section-toggle pattern.
  const section = el.closest && el.closest('.page-section');
  if (!_suppressAutoExpand && section && section.querySelector(':scope > .section-toggle') &&
      !section.classList.contains('section-open')) {
    toggleSection(section.id);
  }
  if (el._hideT) { clearTimeout(el._hideT); el._hideT = null; }
  el.classList.remove('result-exit');
  const wasVisible = el.classList.contains('visible');
  el.classList.add('visible');
  if (wasVisible) return;
  el.classList.remove('result-entry');
  void el.offsetWidth;       // ← layout flush so the next class change is a fresh start
  el.classList.add('result-entry');
  setTimeout(() => el.classList.remove('result-entry'), 800);
}
function _hideResultEntry(el) {
  if (!el || !el.classList.contains('visible')) return;
  el.classList.remove('result-entry');
  el.classList.add('result-exit');
  if (el._hideT) clearTimeout(el._hideT);
  el._hideT = setTimeout(() => {
    el.classList.remove('visible');
    el.classList.remove('result-exit');
    el._hideT = null;
  }, 400);
}

// ── Card resolution — wheels OR direct picker ────────────────────
// Each person's card can arrive two ways: a birthday on the wheels
// (date → solarValue → card) OR a direct Rank+Suit pick in the expand
// panel. _cpOverride{1,2} hold a directly-picked card index (or null when
// the wheels are the source). Picking a card sets the override and renders
// WITHOUT touching the wheels (they stay put — no surprising date jump);
// touching a date wheel clears that person's override so the wheels take
// over again. _resolveIdx returns the person's current card index from
// whichever source is active, or -1 if that person isn't set yet.
let _cpOverride1 = null, _cpOverride2 = null;
function _idxToSv(idx) { return idx >= 52 ? 0 : idx + 1; }   // joker (index 52) → solar value 0

// Dissolve a visible relationship reading back to person 1's solo card WITH the
// "union undone" exit animation (ghost result + partner cards float out, the
// solo card glides back to centre). Shared by BOTH ways a relationship ends:
//   • the − button (toggleSecond), and
//   • clearing person 2's date to "—" while the partner slot stays open
//     (maybeFindUnified) — which used to snap straight to the solo card.
// Safe/no-op if no relationship is on screen; _relDissolving guards re-entry.
let _relDissolving = false;
function _animateRelToSolo() {
  const rel = document.getElementById('relResult');
  if (_relDissolving || !rel.classList.contains('visible')) return;
  _relDissolving = true;
  const card1 = document.getElementById('relCard1');
  const cardR  = document.getElementById('relCardResult');
  const card2  = document.getElementById('relCard2');
  _flipRelExit({
    exitRect:    card1.getBoundingClientRect(),
    resultRect:  cardR.getBoundingClientRect(),
    partnerRect: card2.getBoundingClientRect(),
    resultEl: cardR, partnerEl: card2,
    finalize: () => { rel.classList.remove('visible'); _findBirthCard(); }
  });
  setTimeout(() => { _relDissolving = false; }, 800);
}
function _resolveIdx(person) {
  const override = person === 1 ? _cpOverride1 : _cpOverride2;
  if (override != null) return override;
  const monthId = person === 1 ? 'fMonth' : 'relMonth2';
  const dayId   = person === 1 ? 'fDay'   : 'relDay2';
  const m = parseInt(document.getElementById(monthId).value);
  const d = parseInt(document.getElementById(dayId).value);
  if (!m || !d) return -1;
  const sv = solarValue(m, d);
  return sv === 0 ? CARDS.length - 1 : sv - 1;   // Dec 31 → the Joker
}

function maybeFindUnified() {
  const i1 = _resolveIdx(1);
  // Person 1 not set (no birthday, no picked card) → hide the result,
  // UNLESS a card was loaded manually via the compare-card popup or a
  // share link (_loadedViaCard, kept from before). The user's manual
  // pick should survive wheel clears.
  if (i1 < 0) {
    if (!_loadedViaCard) {
      _hideResultEntry(document.getElementById('finderResult'));
      _hideResultEntry(document.getElementById('relResult'));
    }
    return;
  }
  // Two-person mode with BOTH people set → the relationship reading. With only
  // person 1 set (partner slot open but still empty), don't sit blank — show
  // person 1's solo card + info. Bonus: _findRelationship glides the visible
  // solo card into the left flanker, so completing the partner then animates
  // naturally from it.
  if (secondVisible && _resolveIdx(2) >= 0) {
    _findRelationship();
  } else if (secondVisible && document.getElementById('relResult').classList.contains('visible')) {
    // Partner slot still open but person 2 no longer resolves (date cleared to
    // "—") while a relationship is on screen → dissolve it back to the solo card
    // WITH the exit animation, instead of snapping straight to person 1's card.
    _animateRelToSolo();
  } else {
    _findBirthCard();
  }
}
// A genuine date change (wheel, saved-birthday load, share-link restore)
// hands control back to the wheels — clear that person's direct-pick
// override. Registered BEFORE maybeFindUnified so the override is cleared
// before the reading recomputes.
['fMonth', 'fDay'].forEach(id =>
  document.getElementById(id).addEventListener('change', () => { _cpOverride1 = null; }));
['relMonth2', 'relDay2'].forEach(id =>
  document.getElementById(id).addEventListener('change', () => { _cpOverride2 = null; }));
['fMonth', 'fDay', 'relMonth2', 'relDay2'].forEach(id =>
  document.getElementById(id).addEventListener('change', maybeFindUnified));
['fMonth', 'fDay'].forEach(id =>
  document.getElementById(id).addEventListener('change', renderPersonalCards));

// ── Scroll-wheel pickers ────────────────────────────────────────
// Visual wheels for Day + Month (self + partner). Each wheel is bound
// to a hidden <select> — scrolling the wheel sets the select's value
// and dispatches a change event (so maybeFindUnified / populateDays /
// share link all run as before). External changes to the select
// (e.g. populateDays clearing an out-of-range day) snap the wheel back.
const FW_MONTH_LABELS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const FW_ITEM_H = 32;
let _fwSyncing = false;
function fwBuild(wheelEl, items) {
  // Em-dash placeholder at data-i="-1" sits ABOVE the real items so the
  // wheel can start in an "unselected" state. Scrolling past it commits
  // a value (idx + 1); scrolling back to it clears the hidden select.
  let html = '<div class="fw-wheel-pad"></div>';
  html += '<div class="fw-wheel-item placeholder" data-i="-1">—</div>';
  for (let i = 0; i < items.length; i++) {
    html += '<div class="fw-wheel-item" data-i="' + i + '">' + items[i] + '</div>';
  }
  html += '<div class="fw-wheel-pad"></div>';
  wheelEl.innerHTML = html;
}
function fwCurrentItem(wheelEl) {
  // Find the .fw-wheel-item whose centre is closest to the wheel's centre.
  const wr = wheelEl.getBoundingClientRect();
  if (!wr.height) return null;
  const centreY = wr.top + wr.height / 2;
  const items = wheelEl.querySelectorAll('.fw-wheel-item');
  let best = null, bestDist = Infinity;
  items.forEach(it => {
    const r = it.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - centreY);
    if (d < bestDist) { bestDist = d; best = it; }
  });
  return best;
}
function fwMarkCurrent(wheelEl) {
  const cur = fwCurrentItem(wheelEl);
  if (!cur) return null;
  wheelEl.querySelectorAll('.fw-wheel-item').forEach(it => it.classList.toggle('is-current', it === cur));
  return +cur.dataset.i;
}
function fwScrollToIdx(wheelEl, idx) {
  // scrollTop so the item at dataset.i = idx sits in the centre band.
  // The placeholder lives at the top (DOM index 0 after the pad), so:
  //   idx = -1 (placeholder) → scrollTop 0
  //   idx =  0 (first item)  → scrollTop 32
  //   idx =  N               → scrollTop 32 * (N + 1)
  const target = (idx + 1) * FW_ITEM_H;
  wheelEl.scrollTop = target;
  requestAnimationFrame(() => fwMarkCurrent(wheelEl));
}
function fwBindWheel(wheelEl, items, selectId, opts) {
  opts = opts || {};
  // items: e.g. ['1','2',...,'31'] or FW_MONTH_LABELS — index → value+1.
  fwBuild(wheelEl, items);
  // Click an item → scroll it into the centre AND focus the wheel so the
  // user can immediately keep typing/keying.
  wheelEl.addEventListener('click', e => {
    wheelEl.focus();
    const it = e.target.closest('.fw-wheel-item');
    if (!it) return;
    fwScrollToIdx(wheelEl, +it.dataset.i);
  });
  // Keyboard input — three modes:
  //   • Arrow Up/Down step through items
  //   • Digits 0–9 build a number; we jump to that index (15 → day 15)
  //     and keep building (1 then 5 → 1 then 15). If the combined digits
  //     exceed the max, the new digit starts a fresh number. Buffer
  //     clears after ~900ms idle, Backspace pops the last digit.
  //   • Letters (months only, opts.letters): first letter cycles through
  //     matches (J → Jan, J → Jun, J → Jul, J → Jan…).
  let _buf = '';
  let _bufTimer = null;
  let _letterIdxs = {};
  function _clearBuf() { _buf = ''; _letterIdxs = {}; clearTimeout(_bufTimer); }
  function _scheduleClear() {
    clearTimeout(_bufTimer);
    _bufTimer = setTimeout(_clearBuf, 900);
  }
  wheelEl.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const cur = fwCurrentItem(wheelEl);
      // dataset.i goes from -1 (placeholder) to items.length - 1
      const curIdx = cur ? +cur.dataset.i : -1;
      const nextIdx = Math.max(-1, Math.min(items.length - 1, curIdx + (e.key === 'ArrowDown' ? 1 : -1)));
      fwScrollToIdx(wheelEl, nextIdx);
      _clearBuf();
      return;
    }
    if (e.key >= '0' && e.key <= '9') {
      e.preventDefault();
      const tryBuf = _buf + e.key;
      const n = parseInt(tryBuf) || 0;
      if (n >= 1 && n <= items.length) {
        _buf = tryBuf;
        fwScrollToIdx(wheelEl, n - 1);
      } else {
        _buf = e.key;
        const n2 = parseInt(_buf) || 0;
        if (n2 >= 1 && n2 <= items.length) fwScrollToIdx(wheelEl, n2 - 1);
      }
      _scheduleClear();
      return;
    }
    if (e.key === 'Backspace') {
      e.preventDefault();
      _buf = _buf.slice(0, -1);
      if (_buf) {
        const n = parseInt(_buf) || 0;
        if (n >= 1 && n <= items.length) fwScrollToIdx(wheelEl, n - 1);
      }
      _scheduleClear();
      return;
    }
    if (opts.letters && e.key.length === 1 && /[a-z]/i.test(e.key)) {
      e.preventDefault();
      const letter = e.key.toUpperCase();
      const matches = [];
      items.forEach((lbl, idx) => { if (String(lbl).toUpperCase().startsWith(letter)) matches.push(idx); });
      if (!matches.length) return;
      const last = _letterIdxs[letter];
      const nextIdx = last == null
        ? matches[0]
        : matches[(matches.indexOf(last) + 1) % matches.length];
      _letterIdxs[letter] = nextIdx;
      fwScrollToIdx(wheelEl, nextIdx);
      _scheduleClear();
      return;
    }
  });
  // Scroll-end → write value to the hidden select + dispatch change.
  // dataset.i === -1 is the em-dash placeholder; landing on it CLEARS
  // the select (so maybeFindUnified bails out and no card renders).
  let scrollTimer;
  wheelEl.addEventListener('scroll', () => {
    fwMarkCurrent(wheelEl);
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      const idx = fwMarkCurrent(wheelEl);
      if (idx == null) return;
      const value = idx < 0 ? '' : String(idx + 1);
      const sel = document.getElementById(selectId);
      if (sel && sel.value !== value) {
        _fwSyncing = true;
        sel.value = value;
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        _fwSyncing = false;
      }
    }, 90);
  });
  // External change → snap the wheel. Empty value → snap to placeholder.
  const sel = document.getElementById(selectId);
  if (sel) {
    sel.addEventListener('change', () => {
      if (_fwSyncing) return;
      const v = parseInt(sel.value) || 0;
      if (v > 0 && v <= items.length) fwScrollToIdx(wheelEl, v - 1);
      else                            fwScrollToIdx(wheelEl, -1);
    });
  }
  // Initial state — snap to the placeholder by default; only jump to a
  // real value if the select already holds one (e.g. share-link restore).
  const initV = parseInt(sel && sel.value) || 0;
  fwScrollToIdx(wheelEl, initV > 0 ? initV - 1 : -1);
}
function fwInitFinderWheels() {
  const days = Array.from({length: 31}, (_, i) => i + 1);
  fwBindWheel(document.getElementById('fDayWheel'),     days,             'fDay');
  fwBindWheel(document.getElementById('fMonthWheel'),   FW_MONTH_LABELS,  'fMonth',    { letters: true });
  fwBindWheel(document.getElementById('relDay2Wheel'),  days,             'relDay2');
  fwBindWheel(document.getElementById('relMonth2Wheel'),FW_MONTH_LABELS,  'relMonth2', { letters: true });
}
fwInitFinderWheels();

// ── Direct card picker (alternate to entering a birthday) ─────────
// The chevron chip beneath the +partner chip flips .finder-form.cp-on,
// which reveals a stacked Rank + Suit dropdown pair beneath the wheels for
// BOTH people — a direct replacement for the retired DD/MM dropdown mode.
// Choosing a rank AND a suit sets that person's _cpOverride and renders the
// reading straight away, WITHOUT moving the date wheels (they stay put — no
// surprising jump to an arbitrary birthday). The picker and the wheels are
// two independent ways to land a card; whichever was used last for a person
// wins (touching a date wheel clears that person's override). Person 2's
// picker opens the partner slot if needed, so picking two cards yields the
// relationship reading straight from the two chosen cards.
function toggleCardPicker() {
  const form = document.querySelector('.finder-form');
  if (!form) return;
  const on = !form.classList.contains('cp-on');
  form.classList.toggle('cp-on', on);
  const btn = document.getElementById('ddModeBtn');
  if (btn) btn.setAttribute('aria-expanded', on ? 'true' : 'false');
}
function _cpResolve(rankId, suitId) {
  var r = document.getElementById(rankId), s = document.getElementById(suitId);
  if (!r || !s || !r.value || !s.value || typeof CARDS === 'undefined') return -1;
  return CARDS.findIndex(function (c) { return c.rank === r.value && c.suit === s.value; });
}
function _cpTryLoad1() {
  var idx = _cpResolve('cpRankSel', 'cpSuitSel');
  if (idx < 0) return;                 // wait until BOTH rank and suit are chosen
  _cpOverride1 = idx;
  maybeFindUnified();
}
function _cpTryLoad2() {
  var idx = _cpResolve('cpRankSel2', 'cpSuitSel2');
  if (idx < 0) return;
  _cpOverride2 = idx;
  if (!secondVisible) toggleSecond();  // reveal the partner slot + enable the relationship path
  maybeFindUnified();
}
(function _initCardPicker() {
  var ids = [['cpRankSel', _cpTryLoad1], ['cpSuitSel', _cpTryLoad1],
             ['cpRankSel2', _cpTryLoad2], ['cpSuitSel2', _cpTryLoad2]];
  ids.forEach(function (pair) {
    var el = document.getElementById(pair[0]);
    if (el) el.addEventListener('change', pair[1]);
  });
})();


// ── Unified Finder ───────────────────────────────────────────────
let secondVisible = false;

let _browseVisible = false;
let _browseBuilt   = false;

// Year Calendar — top-level toggle section (under the Finder).
let _calVisible = false;
let _calBuilt   = false;
// (Year Calendar moved into the Tools section — now a tool panel built lazily by
//  _buildToolPanel('cal'); the old toggleCalendar/_calVisible flow is retired.)

let _browseSuit = null;
let _svFoundIdx = null;   // card index highlighted by the solar-value calculator

function setBrowseSuit(suit) {
  _browseSuit = _browseSuit === suit ? null : suit;
  ['hearts','clubs','diamonds','spades'].forEach(s => {
    const el = document.getElementById(`sf-${s}`);
    el.classList.toggle('active', _browseSuit === s);
    el.setAttribute('aria-pressed', _browseSuit === s ? 'true' : 'false');
  });
  _updateSuitMenuIcon();
  toggleSuitMenu(true);   // a choice was made (on or off) — close the menu
  _buildBrowseGrid();
}

// ── Suit filter: trigger icon + popup (was 4 always-visible chips) ──
// The icon shows a muted 2x2 "all suits" cluster when nothing is filtered,
// or the single active suit's own coloured pip once one is chosen — read
// straight off the sf-* buttons rather than a second hardcoded glyph map.
function _updateSuitMenuIcon() {
  const icon = document.getElementById('suitMenuIcon');
  const btn  = document.getElementById('suitMenuBtn');
  if (!icon) return;
  if (_browseSuit) {
    const glyph = document.getElementById(`sf-${_browseSuit}`).textContent;
    icon.className = 'suit-menu-icon suit-menu-icon--single';
    icon.innerHTML = `<span class="${_browseSuit}">${glyph}</span>`;
    if (btn) btn.setAttribute('aria-label', `Filter by suit — currently ${_browseSuit}`);
  } else {
    icon.className = 'suit-menu-icon';
    icon.innerHTML = ['hearts','clubs','diamonds','spades']
      .map(s => `<span class="${s}">${document.getElementById(`sf-${s}`).textContent}</span>`).join('');
    if (btn) btn.setAttribute('aria-label', 'Filter by suit');
  }
}
function toggleSuitMenu(forceClose) {
  const pop = document.getElementById('suitMenuPop'), btn = document.getElementById('suitMenuBtn');
  if (!pop || !btn) return;
  const willOpen = forceClose ? false : !pop.classList.contains('open');
  pop.classList.toggle('open', willOpen);
  btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  if (willOpen) {
    (document.getElementById(`sf-${_browseSuit}`) || document.getElementById('sf-hearts')).focus();
  }
}
document.addEventListener('click', e => {
  const menu = document.getElementById('suitMenu');
  if (menu && !menu.contains(e.target)) toggleSuitMenu(true);
});
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  const pop = document.getElementById('suitMenuPop');
  if (pop && pop.classList.contains('open')) { toggleSuitMenu(true); document.getElementById('suitMenuBtn').focus(); }
});

function _buildBrowseGrid() {
  const grid = document.getElementById('browseGrid');
  let html = '';

  // One cell = its solar value above the card. SV = index + 1 (1–52);
  // the Joker (index 52) sits outside the count at 0.
  function cell(idx) {
    const c       = CARDS[idx];
    const sv      = idx === 52 ? 0 : idx + 1;
    const suitCls = idx === 52 ? 'joker' : c.suit;
    const jk      = idx === 52 ? ' is-joker' : '';
    const found   = idx === _svFoundIdx ? ' sv-found' : '';
    return `<div class="browse-cell${jk}${found}" data-idx="${idx}"><span class="browse-sv">${sv}</span>`
         + `<div class="spread-card ${suitCls}" title="${c.name}" onclick="openCompareCard(${idx})">${spreadCardPips(c)}</div></div>`;
  }

  if (_browseSuit) {
    // Filtered: show matching cards in SV order (numerals reveal where the suit sits in the count)
    for (let i = 0; i < CARDS.length; i++) {
      if (CARDS[i].suit !== _browseSuit) continue;
      html += cell(i);
    }
    grid.style.gridTemplateColumns = 'repeat(7, 1fr)';
  } else {
    // Full planetary layout
    grid.style.gridTemplateColumns = '';
    // 7 planetary rows, SV order left → right (SV 1–49)
    for (let row = 0; row < 7; row++) {
      const base = row * 7;
      for (let col = 0; col < 7; col++) html += cell(base + col);
    }
    // Crown row: J♠ Q♠ K♠ centred (SV 50–52), Joker at far right
    html += `<div class="crown-row"><div></div><div></div>`;
    for (let i = 49; i <= 51; i++) html += cell(i);
    html += `<div></div>`;
    html += cell(52);
    html += `</div>`;
  }

  grid.innerHTML = html;
}

// ── Interactive solar-value calculator (All Cards) ───────────────
// Type a DD/MM; show the worked formula + resulting value and ring the card.
function svCalcUpdate() {
  const d = parseInt(document.getElementById('svDay').value, 10);
  const m = parseInt(document.getElementById('svMonth').value, 10);
  const fEl = document.getElementById('svFormula');
  const valid = Number.isInteger(m) && Number.isInteger(d) && m >= 1 && m <= 12 && d >= 1 && d <= 31;
  if (!valid) {
    fEl.innerHTML = 'Solar Value &nbsp;=&nbsp; <strong>55</strong> &nbsp;&minus;&nbsp; (2 &times; month &nbsp;+&nbsp; day)';
    _svHighlight(null);
    return;
  }
  const sv  = solarValue(m, d);            // 0..52 (0 = the Joker, Dec 31)
  const idx = sv === 0 ? 52 : sv - 1;
  const c   = CARDS[idx];
  fEl.innerHTML = `Solar Value &nbsp;=&nbsp; 55 &minus; (2 &times; ${m} + ${d}) &nbsp;=&nbsp; <strong>${sv}</strong> &nbsp;&rarr;&nbsp; <span class="sv-result-card">${c.name}</span>`;
  _svHighlight(idx);
}
function _svHighlight(idx) {
  _svFoundIdx = idx;
  // The found card must be visible: drop any suit filter so the full grid shows.
  if (idx != null && _browseSuit) {
    _browseSuit = null;
    ['hearts','clubs','diamonds','spades'].forEach(s => {
      const el = document.getElementById('sf-' + s);
      if (el) { el.classList.remove('active'); el.setAttribute('aria-pressed', 'false'); }
    });
    _updateSuitMenuIcon();   // the trigger icon must revert to the idle cluster too
    _buildBrowseGrid();   // rebuild re-applies .sv-found via _svFoundIdx
    return;
  }
  const grid = document.getElementById('browseGrid');
  if (!grid) return;
  grid.querySelectorAll('.browse-cell.sv-found').forEach(e => e.classList.remove('sv-found'));
  if (idx != null) {
    const cell = grid.querySelector(`.browse-cell[data-idx="${idx}"]`);
    if (cell) cell.classList.add('sv-found');
  }
}

// ── Planet info embed (top "Card Elements" → trigram-style expander) ──
// A planets row beneath the suits + numbers: click a glyph to drop that
// planet's reading from PLANET_DATA (js/planetdata.js). 7 planets + the Crown
// = 8, stepped with ‹ › / ← → / swipe, mirroring the suit/number rows above.
// The Quadration grid shows the same glyphs as static labels (no longer
// clickable) — the readings live here at the top of the page.
(function () {
  const pop = document.getElementById('plPop');
  const row = document.getElementById('planetRow');
  if (!pop || !row) return;
  // Row order, left → right: the seven planets (inner → outer), then the Crown.
  const ORDER = (window.PLANET_ORDER || ['Mercury','Venus','Mars','Jupiter','Saturn','Uranus','Neptune']).concat(['Crown']);
  const detail = document.getElementById('plDetail');
  const dwrap  = pop.querySelector('.pl-detailwrap');
  if (dwrap) dwrap.inert = true;
  let cur = -1;
  const esc = (s) => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');

  // Render the glyph row once from PLANET_DATA (the Quadration grid no longer
  // hosts the triggers — these buttons do).
  row.innerHTML = ORDER.map(function (name) {
    const d = (window.PLANET_DATA && window.PLANET_DATA[name]) || {};
    return '<button type="button" class="el-planet" role="listitem" data-planet="' + name +
      '" aria-pressed="false" aria-label="' + name + (d.epithet ? ' — ' + d.epithet : '') + '">' +
      (d.glyph || name) + '</button>';
  }).join('');

  // Centralise active-label updates so EVERY code path that changes the
  // current planet (click, swipe, keyboard) goes through the same code.
  // Defensive: re-queries the DOM each call (so a re-rendered grid still
  // gets the right label highlighted) and explicitly clears + sets — no
  // assumption that the prior state was correct.
  function setActiveLabel(name) {
    row.querySelectorAll('[data-planet]').forEach((el) => {
      const on = el.dataset.planet === name;
      el.classList.toggle('sel', on);
      el.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function show(name) {
    const d = window.PLANET_DATA && window.PLANET_DATA[name];
    if (!d) return;
    // Opening a planet closes any open suit/number detail (mutually exclusive).
    if (window.closeElementsDetail) window.closeElementsDetail();
    cur = ORDER.indexOf(name);
    // Olney voice swap: when the Card Elements toggle is on 'olney', render
    // Richmond's 1893 reading (his epithet / keywords / synopsis / stone+force
    // attrs / text) in place of the modern Sage one. Missing → falls back.
    var voice = (window.elementsVoice ? window.elementsVoice() : 'modern');
    var o = (voice === 'olney' && d.olney) ? d.olney : null;
    document.getElementById('plFig').textContent  = d.glyph || '';
    document.getElementById('plName').textContent = name;
    document.getElementById('plSub').textContent  = (o ? o.epithet : d.epithet) || '';
    // Keywords render as gold pills, mirroring the suit/number detail's .el-kws.
    document.getElementById('plKws').innerHTML =
      ((o ? o.keywords : d.keywords) || []).map((k) => '<span class="kw-tag">' + esc(k) + '</span>').join('');
    document.getElementById('plSyn').textContent  = (o ? o.synopsis : d.synopsis) || '';
    // Modern: Light / Shadow. Olney: his own attrs (Stone / Head force / etc).
    document.getElementById('plAttrs').innerHTML = o
      ? (o.attrs || []).map((a) => '<dt>' + esc(a[0]) + '</dt><dd>' + esc(a[1]) + '</dd>').join('')
      : ((d.light  ? '<dt>Light</dt><dd>'  + esc(d.light.join(', '))  + '</dd>' : '') +
         (d.shadow ? '<dt>Shadow</dt><dd>' + esc(d.shadow.join(', ')) + '</dd>' : ''));
    document.getElementById('plPara').innerHTML = ((o ? o.text : d.text) || []).map((p) => '<p>' + esc(p) + '</p>').join('');
    // Force a layout flush now that the content is in place, so the panel's
    // grid-template-rows 0fr→1fr open transition always animates from a committed
    // starting frame. Without this, the very first open after page load can
    // intermittently stay collapsed (a transition-start race when the element's
    // content changed in the same frame as the class toggle).
    void pop.offsetHeight;
    pop.classList.add('open');
    if (dwrap) dwrap.inert = false;
    setActiveLabel(name);
  }
  // Re-render the currently-open planet in place (used by the Modern/Olney toggle).
  window.rerenderPlanet = function () { if (cur >= 0) show(ORDER[cur]); };
  function step(dir) { if (cur < 0) return; show(ORDER[(cur + dir + ORDER.length) % ORDER.length]); }
  function hide() {
    pop.classList.remove('open');
    if (dwrap) dwrap.inert = true;
    setActiveLabel(null);   // null = no match → clears the selection from every glyph
    cur = -1;
  }
  // Fold the whole section up (hide the rows too) when the active glyph is
  // re-clicked — matches clicking the active suit / number.
  function foldUp() { if (window.collapseElements) window.collapseElements(); else hide(); }
  // Toggle: clicking the active planet folds the section up.
  window.openPlanet = function (name) { if (cur >= 0 && ORDER[cur] === name) foldUp(); else show(name); };
  // Exposed so the suit/number expander can close JUST this panel (keeping the
  // rows open) when a suit/number is selected.
  window.closePlanetPanel = hide;

  // Move focus to the active glyph so the gold ring follows as you step (mirrors
  // the suit/number rows).
  function focusActive() {
    if (cur < 0) return;
    const btn = row.querySelector('[data-planet="' + ORDER[cur] + '"]');
    if (btn) btn.focus({ preventScroll: true });
  }

  // Click a glyph to open / toggle that planet.
  row.addEventListener('click', (e) => {
    const b = e.target.closest('[data-planet]');
    if (b) window.openPlanet(b.dataset.planet);
  });

  // Swipe on the detail panel steps between planets.
  let sx = null;
  detail.addEventListener('touchstart', (e) => { sx = e.changedTouches[0].clientX; }, { passive: true });
  detail.addEventListener('touchend', (e) => {
    if (sx === null) return;
    const dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
  }, { passive: true });
  // ← / → step between planets (and Escape closes) while the panel is open.
  // Bound on document so it works regardless of focus; typing fields are ignored.
  document.addEventListener('keydown', (e) => {
    if (!pop.classList.contains('open') || cur < 0) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    if (e.key === 'ArrowLeft')  { e.preventDefault(); step(-1); focusActive(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(1); focusActive(); }
    else if (e.key === 'Escape') { e.preventDefault(); foldUp(); }
  });
})();

function toggleSecond() {
  secondVisible = !secondVisible;
  // Slide the partner slot open/closed by toggling .is-ghost — the CSS
  // transition on max-width + margin-left smoothly grows or collapses
  // the slot (and the form's fit-content width with it). The chip's
  // icon flips between "+" (invite) and "−" (remove).
  document.getElementById('person2Wrap').classList.toggle('is-ghost', !secondVisible);
  // The +/− icon is an SVG whose vertical stroke (.pt-v) is hidden by CSS when
  // the partner slot is open (:has(.person-partner:not(.is-ghost))), so it
  // becomes a minus — no textContent swap needed.
  const toggleBtn = document.getElementById('addSecondBtn');
  if (toggleBtn) {
    const label = secondVisible ? 'Remove the second person' : 'Add a second person for a relationship reading';
    toggleBtn.setAttribute('title', label);
    toggleBtn.setAttribute('aria-label', label);
  }
  // When CLOSING the relationship while a triptych is on screen, capture
  // ALL THREE cards' rects BEFORE hiding #relResult so _flipRelExit can:
  //   • glide person 1 back to centre (the existing FLIP)
  //   • float ghost copies of the result + partner cards and animate
  //     them out gracefully (result dissolves toward centre, partner
  //     slides off right with a slight tilt — "the union undone").
  const removingRel = !secondVisible &&
                      document.getElementById('relResult').classList.contains('visible');
  // Person 1 may come from the date wheels OR a direct Rank+Suit pick
  // (_cpOverride1), so gate on "person 1 resolves to a card" via _resolveIdx —
  // NOT on #fDay/#fMonth being filled. The card picker leaves those selects
  // empty, which used to make this guard fail and silently skip the whole
  // remove animation (the "reverse animation is gone" report — it only happened
  // when the reading came from the picker, since ADD isn't gated this way).
  const hasPerson1 = _resolveIdx(1) >= 0;
  if (removingRel && hasPerson1) { _animateRelToSolo(); return; }
  document.getElementById('relResult').classList.remove('visible');
  if (!secondVisible) {
    if (hasPerson1) {
      _findBirthCard();
    } else {
      document.getElementById('finderResult').classList.remove('visible');
    }
  } else {
    // We just OPENED. If both people already resolve (dates OR direct picks),
    // no change events will fire — trigger the find pipeline once to recompute
    // and reveal the relationship triptych.
    if (_resolveIdx(1) >= 0 && _resolveIdx(2) >= 0 && typeof findUnified === 'function') {
      findUnified();
    }
  }
}

function findUnified() {
  if (secondVisible) {
    _findRelationship();
  } else {
    _findBirthCard();
  }
}


// The reading shows by default on each new card; the minimise chevron in
// .result-actions collapses .result-body afterwards (matches the relationship
// card's collapse button). _finderExpand resets to expanded on a fresh card.
function _finderExpand() {
  const res = document.getElementById('finderResult');
  const btn = document.getElementById('rCollapse');
  if (res) res.classList.remove('collapsed');
  if (btn) {
    btn.setAttribute('aria-expanded', 'true');
    btn.setAttribute('aria-label', 'Minimise card details');
    btn.title = 'Minimise';
  }
}
function toggleFinderCollapse() {
  const res = document.getElementById('finderResult');
  const btn = document.getElementById('rCollapse');
  if (!res) return;
  const willCollapse = !res.classList.contains('collapsed');
  res.classList.toggle('collapsed', willCollapse);
  if (btn) {
    btn.setAttribute('aria-expanded', String(!willCollapse));
    btn.setAttribute('aria-label', willCollapse ? 'Expand card details' : 'Minimise card details');
    btn.title = willCollapse ? 'Expand' : 'Minimise';
  }
}

// Renders a resolved card into the Finder result panel — shared by
// _findBirthCard (picked via the date wheel) and loadCardInFinder (picked via
// a card elsewhere on the page: the compare popup's "Open full profile" link,
// or a #c= share-link restore on cold load). The two callers only differ in
// how they arrive at {c, idx} and in opts.fromCard: true for "came from
// elsewhere" (encodes the card, not the dropdown dates, into share links; the
// reload-to-finder affordance shows; the result scrolls into view since the
// Finder wasn't already on screen), false for "picked from the date wheel"
// (Finder is already visible, so no scroll needed).
function _renderFinderCard(c, idx, opts) {
  opts = opts || {};
  document.getElementById('relResult').classList.remove('visible');
  _loadedViaCard = !!opts.fromCard;
  _setReloadVisible(!!opts.fromCard);
  _updateOlneyTarget(idx);
  // Remember the pick and light up its seat in the Quadration grid (joker has no seat).
  _finderPick = c.suit === 'joker' ? null : { rank: c.rank, suit: c.suit };
  buildAnnualGrid(currentAge + 1);
  const rFace = document.getElementById('rFace');
  rFace.className = `spread-card result-pip-card ${c.suit}`;
  rFace.innerHTML = spreadCardPips(c);
  rFace.onclick   = () => openCompareCard(idx);
  document.getElementById('rName').textContent     = c.name;
  document.getElementById('rSubtitle').textContent =
    SUBTITLES[`${c.rank}_${c.suit}`] || (c.suit.charAt(0).toUpperCase() + c.suit.slice(1) + ' · ' + c.rank);
  document.getElementById('rVow').textContent =
    VOWS[`${c.rank}_${c.suit}`] ? `"${VOWS[`${c.rank}_${c.suit}`]}"` : '';
  document.getElementById('rKws').innerHTML        = c.kws.map(k => `<span class="kw-tag">${k}</span>`).join('');
  document.getElementById('rPersonality').innerHTML =
    c.personality.split('\n\n').map(p => `<p style="margin:0 0 .9em">${p}</p>`).join('');
  document.getElementById('rStrengths').innerHTML  =
    c.strengths.map(s => `<div class="sc-item"><span class="sc-dot-s">●</span>${s}</div>`).join('');
  document.getElementById('rChallenges').innerHTML =
    c.challenges.map(s => `<div class="sc-item"><span class="sc-dot-c">●</span>${s}</div>`).join('');
  if (window.elementsHighlight) window.elementsHighlight(c.rank, c.suit);
  _finderExpand();   // also clears finderResult's .collapsed — "Open full profile" shows details expanded
  renderLifeScriptInto(c,
    document.getElementById('rLifeScript'),
    document.getElementById('rLifeScriptWrap'),
    { showPlanetNames: true });
  _showResultEntry(document.getElementById('finderResult'));
  if (opts.fromCard) {
    // Scroll the CARD ROW (not the whole panel) so the card itself lands
    // at the top — the panel's padding-top would otherwise leave a sliver
    // of the finder visible above. .result-card-row's scroll-margin-top
    // keeps it clear of the sticky header.
    const cardRow = document.querySelector('#finderResult .result-card-row');
    (cardRow || document.getElementById('finderResult')).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
function _findBirthCard() {
  const idx = _resolveIdx(1);
  if (idx < 0) {
    document.getElementById('finderResult').classList.remove('visible');
    _finderPick = null; buildAnnualGrid(currentAge + 1); // clear the gold highlight
    return;
  }
  // fromCard:false for both sources — the picker renders the card quietly in
  // place, exactly like the wheels, with NO auto-scroll to the reading (the
  // scroll-into-view that fromCard:true triggers is unwanted here). "Open full
  // profile" / share-link restores keep their own fromCard:true path.
  _renderFinderCard(CARDS[idx], idx, { fromCard: false });
}

function _findRelationship() {
  // Each person resolves from the wheels OR a direct Rank+Suit pick.
  const i1 = _resolveIdx(1);
  const i2 = _resolveIdx(2);
  if (i1 < 0 || i2 < 0) { document.getElementById('relResult').classList.remove('visible'); return; }

  const sv1 = _idxToSv(i1);
  const sv2 = _idxToSv(i2);
  const resultEl = document.getElementById('relResult');
  const note     = document.getElementById('relNote');
  // FLIP-style transition: if the solo result card (#rFace) is visible
  // RIGHT NOW (i.e. user just added the second birthday), grab its rect
  // so we can later glide the relationship's left-flanker card from
  // centre → left to mirror the orrery's add-partner animation.
  const _soloVisible = document.getElementById('finderResult').classList.contains('visible');
  const _soloRect    = _soloVisible ? document.getElementById('rFace').getBoundingClientRect() : null;
  document.getElementById('finderResult').classList.remove('visible');
  _loadedViaCard = false;       // relationship lookup is date-driven — share by birthdays
  _setReloadVisible(false);

  // Reset equation visibility (may have been hidden by a prior Joker search)
  document.getElementById('relEqEquals').style.display  = '';
  document.getElementById('relCardResult').style.display = '';

  if (sv1 === 0 || sv2 === 0) {
    const jokerIdx  = CARDS.length - 1;
    const jokerCard = CARDS[jokerIdx];
    const jokerIsFirst = sv1 === 0;
    const otherSv   = jokerIsFirst ? sv2 : sv1;
    const otherIdx  = otherSv ? otherSv - 1 : jokerIdx;
    const otherCard = CARDS[otherIdx];

    // Show both input cards; hide the = result slot
    const rc1 = document.getElementById('relCard1');
    rc1.className = `spread-card ${jokerIsFirst ? jokerCard.suit : otherCard.suit}`;
    rc1.innerHTML = spreadCardPips(jokerIsFirst ? jokerCard : otherCard);
    rc1.onclick   = () => openCompareCard(jokerIsFirst ? jokerIdx : otherIdx);

    const rc2 = document.getElementById('relCard2');
    rc2.className = `spread-card ${jokerIsFirst ? otherCard.suit : jokerCard.suit}`;
    rc2.innerHTML = spreadCardPips(jokerIsFirst ? otherCard : jokerCard);
    rc2.onclick   = () => openCompareCard(jokerIsFirst ? otherIdx : jokerIdx);

    document.getElementById('relEqEquals').style.display  = 'none';
    document.getElementById('relCardResult').style.display = 'none';

    note.textContent = '✦  The Joker stands outside the 52-card solar system, so no combined relationship card can be calculated.';
    note.style.display = '';
    document.getElementById('relBond').style.display = 'none';

    const nameOther = otherSv && otherIdx !== jokerIdx ? otherCard.name : jokerCard.name;
    document.getElementById('relNamesPair').textContent  = `${jokerCard.name}  ×  ${nameOther}`;
    document.getElementById('relRName').textContent      = jokerCard.name;
    document.getElementById('relRSubtitle').textContent  = SUBTITLES[`${jokerCard.rank}_${jokerCard.suit}`] || 'The Joker · ✦';
    document.getElementById('relRVow').textContent =
      VOWS[`${jokerCard.rank}_${jokerCard.suit}`] ? `"${VOWS[`${jokerCard.rank}_${jokerCard.suit}`]}"` : '';
    document.getElementById('relRKws').innerHTML         = jokerCard.kws.map(k => `<span class="kw-tag">${k}</span>`).join('');
    document.getElementById('relRPlanets').textContent   = cardPlanetLabel(jokerIdx);
    _fillFinderMeta(jokerIdx, null, 'relRVals', 'relRDisplace');   // Joker: no combined card → clear vals + displacement
    _updateOlneyTarget(jokerIdx);   // Joker has no Richmond entry → hides both olney buttons
    document.getElementById('relRPersonality').innerHTML = jokerCard.personality.split('\n\n').map(p => `<p style="margin:0 0 .9em">${p}</p>`).join('');
    document.getElementById('relRStrengths').innerHTML   = jokerCard.strengths.map(s => `<div class="sc-item"><span class="sc-dot-s">●</span>${s}</div>`).join('');
    document.getElementById('relRChallenges').innerHTML  = jokerCard.challenges.map(s => `<div class="sc-item"><span class="sc-dot-c">●</span>${s}</div>`).join('');
    resultEl.querySelector('.rel-header').style.display = '';
    resultEl.querySelector('.result-body').style.display = '';
    document.getElementById('relConnections').style.display = 'none'; // Joker has no script
    _showResultEntry(resultEl);
    return;
  }

  note.style.display = 'none';
  resultEl.querySelector('.rel-header').style.display = '';

  let svComp = sv1 + sv2;
  if (svComp > 52) svComp -= 52;

  const c1   = CARDS[sv1 - 1];
  const c2   = CARDS[sv2 - 1];
  const cRel = CARDS[svComp - 1];
  const relIdx = svComp - 1;
  // Aim the Olney popup at the combined relationship card while this view
  // is up — clicking #relOlneyBtn opens Richmond's reading for cRel.
  _updateOlneyTarget(relIdx);

  // Bond text (REL_TEXT, js/cardsdata.js): when the result card has a
  // relationship-voiced entry it replaces the whole generic profile body;
  // until then the generic profile shows as a fallback.
  const bond   = (window.REL_TEXT || {})[`${cRel.rank}_${cRel.suit}`];
  const bondEl = document.getElementById('relBond');
  const bodyEl = resultEl.querySelector('.result-body');
  if (bond) {
    bondEl.innerHTML = `<p class="rel-bond-syn">${bond.syn}</p><p class="rel-bond-para">${bond.text}</p>`;
    bondEl.style.display = '';
    bodyEl.style.display = 'none';
  } else {
    bondEl.style.display = 'none';
    bodyEl.style.display = '';
  }

  const rc1 = document.getElementById('relCard1');
  rc1.className = `spread-card ${c1.suit}`;
  rc1.innerHTML = spreadCardPips(c1);
  rc1.onclick   = () => openCompareCard(sv1 - 1);

  const rc2 = document.getElementById('relCard2');
  rc2.className = `spread-card ${c2.suit}`;
  rc2.innerHTML = spreadCardPips(c2);
  rc2.onclick   = () => openCompareCard(sv2 - 1);

  const rcR = document.getElementById('relCardResult');
  rcR.className = `spread-card rel-result-pip ${cRel.suit}`;
  rcR.innerHTML = spreadCardPips(cRel);
  rcR.onclick   = () => openCompareCard(relIdx);

  document.getElementById('relNamesPair').textContent  = `${c1.name}  ×  ${c2.name}`;
  document.getElementById('relRName').textContent      = cRel.name;
  document.getElementById('relRSubtitle').textContent  =
    SUBTITLES[`${cRel.rank}_${cRel.suit}`] || (cRel.suit.charAt(0).toUpperCase() + cRel.suit.slice(1) + ' · ' + cRel.rank);
  document.getElementById('relRVow').textContent =
    VOWS[`${cRel.rank}_${cRel.suit}`] ? `"${VOWS[`${cRel.rank}_${cRel.suit}`]}"` : '';
  document.getElementById('relRKws').innerHTML         = cRel.kws.map(k => `<span class="kw-tag">${k}</span>`).join('');
  document.getElementById('relRPlanets').textContent   = cardPlanetLabel(relIdx);
  const Rrel = window.RICHMOND && window.RICHMOND[`${cRel.rank}_${cRel.suit}`];
  _fillFinderMeta(relIdx, Rrel, 'relRVals', 'relRDisplace');   // Solar/Spirit/Astral + displacement of the combined card
  document.getElementById('relRPersonality').innerHTML =
    cRel.personality.split('\n\n').map(p => `<p style="margin:0 0 .9em">${p}</p>`).join('');
  document.getElementById('relRStrengths').innerHTML   =
    cRel.strengths.map(s => `<div class="sc-item"><span class="sc-dot-s">●</span>${s}</div>`).join('');
  document.getElementById('relRChallenges').innerHTML  =
    cRel.challenges.map(s => `<div class="sc-item"><span class="sc-dot-c">●</span>${s}</div>`).join('');
  renderRelConnections(c1, c2);
  _showResultEntry(resultEl);
  if (_soloRect) _flipRelEntry(_soloRect);
}

// FLIP animation: glide the relationship's left-flanker card (#relCard1)
// from where the solo result card (#rFace) was sitting into its natural
// left-flanker position, then fade-in the centre result + right partner.
// Mirrors the orrery's add-partner slide. Skipped under reduced-motion.
function _flipRelEntry(srcRect) {
  const dst = document.getElementById('relCard1');
  if (!dst || !srcRect) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dstRect = dst.getBoundingClientRect();
  if (!dstRect.width) return;
  const dx = Math.round((srcRect.left + srcRect.width / 2) - (dstRect.left + dstRect.width / 2));
  const dy = Math.round((srcRect.top  + srcRect.height / 2) - (dstRect.top  + dstRect.height / 2));
  const scaleUp = srcRect.width / dstRect.width;
  // Pre-position the left flanker on top of the old solo card's footprint.
  dst.style.zIndex      = '5';
  dst.style.transition  = 'none';
  dst.style.translate   = dx + 'px ' + dy + 'px';
  dst.style.scale       = String(scaleUp);
  // The centre result + right partner ease in to make space.
  const mid = document.getElementById('relCardResult');
  const rgt = document.getElementById('relCard2');
  [mid, rgt].forEach(el => {
    if (!el) return;
    el.style.transition = 'none';
    el.style.opacity    = '0';
    el.style.transform  = 'scale(.85)';
  });
  dst.getBoundingClientRect();  // force layout sync before the transition runs
  requestAnimationFrame(() => {
    dst.style.transition = 'translate .6s cubic-bezier(.4,0,.2,1), scale .6s cubic-bezier(.4,0,.2,1)';
    dst.style.translate  = '0 0';
    dst.style.scale      = '1';
    [mid, rgt].forEach((el, i) => {
      if (!el) return;
      el.style.transition = 'opacity .5s ease ' + (.15 + i * .08) + 's, transform .5s cubic-bezier(.4,0,.2,1) ' + (.15 + i * .08) + 's';
      el.style.opacity    = '';
      el.style.transform  = '';
    });
  });
  setTimeout(() => {
    [dst, mid, rgt].forEach(el => {
      if (!el) return;
      el.style.removeProperty('transition');
      el.style.removeProperty('translate');
      el.style.removeProperty('scale');
      el.style.removeProperty('transform');
      el.style.removeProperty('opacity');
      el.style.removeProperty('z-index');
    });
  }, 800);
}

// Orchestrate the relationship-removal animation. Three things happen in
// concert:
//   1. The result card (centre) dissolves toward the centre — the union
//      undoing itself.
//   2. The partner card (right) slides off to the right with a small
//      tilt + fade — "the partner departing."
//   3. The solo card glides from person-1's left-flanker footprint back
//      to the centre, scaling up (the existing _flipSoloEntry).
// We CAN'T animate the result + partner cards in place because hiding
// #relResult collapses them; instead we clone them as fixed-position
// ghosts pinned to their captured rects, then animate the ghosts as the
// real triptych goes away. Reduced-motion users get an instant cut.
function _flipRelExit(opts) {
  const { exitRect, resultRect, partnerRect, resultEl, partnerEl, finalize } = opts;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !resultRect.width || !partnerRect.width) {
    finalize();
    if (exitRect) _flipSoloEntry(exitRect);
    return;
  }
  function ghostOf(src, rect) {
    const g = src.cloneNode(true);
    g.id = '';  // avoid duplicate IDs in the DOM
    g.style.cssText =
      'position: fixed;' +
      'left: ' + rect.left   + 'px;' +
      'top: '  + rect.top    + 'px;' +
      'width: '  + rect.width  + 'px;' +
      'height: ' + rect.height + 'px;' +
      'margin: 0;' +
      'z-index: 100;' +
      'pointer-events: none;' +
      'will-change: transform, opacity;';
    document.body.appendChild(g);
    return g;
  }
  const ghostResult  = ghostOf(resultEl,  resultRect);
  const ghostPartner = ghostOf(partnerEl, partnerRect);
  // Swap the real DOM and start person 1's glide-back-to-centre.
  finalize();
  if (exitRect) _flipSoloEntry(exitRect);
  // Animate the ghosts away on the next frame so the transitions register.
  requestAnimationFrame(() => {
    // Result card — fades + shrinks toward the centre (the union dissolving).
    ghostResult.style.transition  = 'transform .55s cubic-bezier(.4,0,.2,1), opacity .45s ease';
    ghostResult.style.transform   = 'scale(.5) translateY(-10px)';
    ghostResult.style.opacity     = '0';
    // Partner — slides off right with a small tilt, slight stagger.
    ghostPartner.style.transition = 'transform .6s cubic-bezier(.4,0,.2,1) .06s, opacity .5s ease .06s';
    ghostPartner.style.transform  = 'translateX(56px) scale(.78) rotate(8deg)';
    ghostPartner.style.opacity    = '0';
  });
  setTimeout(() => {
    ghostResult.remove();
    ghostPartner.remove();
  }, 750);
}

// Reverse of _flipRelEntry — when the user closes the relationship and
// the solo card returns to centre, glide #rFace from the left-flanker's
// (relCard1's) footprint into its natural centred position, scaling up
// as it goes. Called by _flipRelExit (above) as part of the wider
// remove-relationship animation. Skipped under reduced motion.
function _flipSoloEntry(srcRect) {
  const dst = document.getElementById('rFace');
  if (!dst || !srcRect) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const dstRect = dst.getBoundingClientRect();
  if (!dstRect.width) return;
  const dx = Math.round((srcRect.left + srcRect.width / 2) - (dstRect.left + dstRect.width / 2));
  const dy = Math.round((srcRect.top  + srcRect.height / 2) - (dstRect.top  + dstRect.height / 2));
  const scaleDown = srcRect.width / dstRect.width;  // < 1: solo card starts small
  dst.style.zIndex     = '5';
  dst.style.transition = 'none';
  dst.style.translate  = dx + 'px ' + dy + 'px';
  dst.style.scale      = String(scaleDown);
  dst.getBoundingClientRect();  // force layout sync before the transition runs
  requestAnimationFrame(() => {
    dst.style.transition = 'translate .6s cubic-bezier(.4,0,.2,1), scale .6s cubic-bezier(.4,0,.2,1)';
    dst.style.translate  = '0 0';
    dst.style.scale      = '1';
  });
  setTimeout(() => {
    dst.style.removeProperty('transition');
    dst.style.removeProperty('translate');
    dst.style.removeProperty('scale');
    dst.style.removeProperty('z-index');
  }, 800);
}

// Show whether either birth card sits in the other's life script. A card can
// be the other's planetary (Mercury…Neptune) card in 0, 1, or 2 directions;
// each found direction gets its own mini life-script grid with that seat lit.
function _shortCard(c) { return `${c.rank}${SPREAD_SYMS[c.suit]}`; }
function renderRelConnections(c1, c2) {
  const wrap = document.getElementById('relConnections');
  const host = document.getElementById('relConnBody');
  const conns = [];
  const a = lifeScriptConnection(c1, c2); // c2 sits in c1's script
  if (a) conns.push({ owner: c1, sitter: c2, planet: a.planet });
  const b = lifeScriptConnection(c2, c1); // c1 sits in c2's script
  if (b) conns.push({ owner: c2, sitter: c1, planet: b.planet });

  if (!conns.length) { wrap.style.display = 'none'; host.innerHTML = ''; return; }

  host.innerHTML = conns.map((cn, n) => {
    const sym = SPREAD_PLANET_SYM[cn.planet];
    const gloss = (window.PLANET_CONN_TEXT || {})[cn.planet] || '';
    return `<div class="rel-conn">
      <div class="rel-conn-title">
        <span class="rel-conn-glyph">${sym}</span>
        <b>${_shortCard(cn.sitter)}</b> is <b>${_shortCard(cn.owner)}</b>'s <b>${cn.planet}</b> Card
      </div>
      <div class="ls-grid rel-conn-grid" id="relConnGrid${n}"></div>
      <p class="rel-conn-gloss">${gloss}</p>
    </div>`;
  }).join('');

  conns.forEach((cn, n) => {
    renderLifeScriptInto(cn.owner, document.getElementById(`relConnGrid${n}`), null,
      { highlight: { rank: cn.sitter.rank, suit: cn.sitter.suit }, showPlanetNames: true });
  });
  wrap.style.display = '';
}

// ── Grid ─────────────────────────────────────────────────────────
let currentSuit = 'none';

// ── Card Subtitles ───────────────────────────────────────────────

// ── Nav ──────────────────────────────────────────────────────────
// (header scroll shadow now handled globally in js/site.js)



// Card chosen in the Birth Card Finder; its quadration seat is highlighted gold across every age.
let _finderPick = null; // { rank, suit } or null

// Keep the finder's life-script + relationship-connection mini-grids
// always at 75% of the Quadration grid's ACTUAL rendered width, no
// matter the viewport. We measure #annualGrid via a ResizeObserver
// and set --quadration-actual-w on documentElement; the CSS calc
// (max-width: calc(var(--quadration-actual-w) * 0.75)) does the rest.
function syncFinderGridsFromQuadration() {
  const ag = document.getElementById('annualGrid');
  if (!ag) return;
  const w = ag.getBoundingClientRect().width;
  if (w > 0) {
    document.documentElement.style.setProperty('--quadration-actual-w', w + 'px');
  }
}
(function _wireQuadrationWidthSync() {
  const ag = document.getElementById('annualGrid');
  if (!ag) return;
  if (typeof ResizeObserver === 'function') {
    // RO fires immediately on observe (size > 0) AND on every size change.
    new ResizeObserver(syncFinderGridsFromQuadration).observe(ag);
  }
  // Belt + braces: also listen to window resize, and run a few times as
  // the page settles (layout, fonts, lazy grid build) so the var has a
  // real value well before the life-script first renders. Also call sync
  // any time the finder result or relationship panel becomes visible —
  // ResizeObserver doesn't always fire reliably when a sibling's layout
  // changes the available width upstream.
  window.addEventListener('resize', syncFinderGridsFromQuadration);
  requestAnimationFrame(syncFinderGridsFromQuadration);
  setTimeout(syncFinderGridsFromQuadration, 50);
  setTimeout(syncFinderGridsFromQuadration, 200);
})();
// Sync immediately before either result panel becomes visible, so the
// 75% ratio is computed from the LATEST quadration width.
['finderResult', 'relResult'].forEach(id => {
  const el = document.getElementById(id);
  if (!el || typeof MutationObserver !== 'function') return;
  new MutationObserver(() => {
    if (el.classList.contains('visible')) syncFinderGridsFromQuadration();
  }).observe(el, { attributes: true, attributeFilter: ['class'] });
});

// Single FLIP grid shared by Annual / Spirit / Life (built lazily).
let _spreadCtl = null;
function ensureSpreadCtl() {
  if (!_spreadCtl) {
    // No onPlanetClick: the grid's planet glyphs render as static labels now —
    // the readings live in the planets row at the top of the page (#planetRow).
    _spreadCtl = buildSpreadGrid(document.getElementById('annualGrid'), {});
    // Sync immediately so the finder grids have a real measurement to
    // compute 75% from (rather than the CSS fallback) the first time
    // the life-script renders.
    syncFinderGridsFromQuadration();
  }
  return _spreadCtl;
}

// Render the Annual spread for a quadration index (age + 1). Re-seats the
// shared cards (FLIP), turns rings off, and re-applies the finder pick.
function buildAnnualGrid(age) {
  const ctl = ensureSpreadCtl();
  ctl.showRings(false);
  ctl.setDeck(deckAtAge(age));
  ctl.setPick(_finderPick ? _finderPick.rank : null, _finderPick ? _finderPick.suit : null);
  ctl.setScript(_finderPick ? _finderPick.rank : null, _finderPick ? _finderPick.suit : null);
  // Age 0 is the Life spread (deckAtAge(1)), where the seven life-script cards
  // are contiguous — flag the grid so .ls-pick gets its stronger age-0 pop.
  document.getElementById('annualGrid').classList.toggle('ls-lifespread', age === 1);
}

let currentAge = 0;
function ageDescription(age) {
  return `Age ${age}`;
}
function setAge(age) {
  age = Math.max(0, Math.min(89, Math.round(+age) || 0));
  currentAge = age;
  document.getElementById('ageInput').value = age;
  buildAnnualGrid(age + 1); // offset: age 0 = 1st quadration
  renderPersonalCards();
}

// ── Quadration view mode: Annual (age-driven) · Spirit · Life ──────
// All three views share one FLIP grid (#annualGrid), so every change —
// stepping ages, or switching to a master spread — animates. Spirit =
// deckAtAge(90), Life = deckAtAge(1); both show the fixed/semi rings and
// dim the (irrelevant) age selector. Clicking a card opens the compare
// popup; the per-card displacement note is queued for the popup.
let _qMode = 'annual';
let _qDisp = false;   // displacement chips on/off (shows BOTH sets) — remembered across mode switches
function qSyncDispBtn() {
  const b = document.getElementById('qDisp');
  if (!b) return;
  b.classList.toggle('on', _qDisp);
  b.setAttribute('aria-checked', _qDisp ? 'true' : 'false');
}
const QUAD_MODE_LABEL = { annual: 'Age', spirit: 'Spirit', life: 'Life' };
function qSetMode(m) {
  _qMode = m;
  document.getElementById('qAnnualBtn').classList.toggle('active', m === 'annual');
  document.getElementById('qSpiritBtn').classList.toggle('active', m === 'spirit');
  document.getElementById('qLifeBtn').classList.toggle('active', m === 'life');
  const cur = document.getElementById('qModeCurrent');
  if (cur) cur.textContent = QUAD_MODE_LABEL[m] || m;
  try { localStorage.setItem(QUAD_MODE_KEY, m); } catch (e) {}
  // Contextual rows: stepper (reserved slot) only in Age, displacement icon only in Life
  const wrap = document.querySelector('#spreads .age-controls-wrap');
  if (wrap) {
    wrap.classList.toggle('qm-annual', m === 'annual');
    wrap.classList.toggle('qm-spirit', m === 'spirit');
    wrap.classList.toggle('qm-life',   m === 'life');
  }
  qSyncDispBtn();
  const ctl = ensureSpreadCtl();
  ctl.showGhosts(_qDisp ? 'both' : null);   // before setDeck so FLIP measures the final layout (recomputed per mode)
  if (m === 'annual') {
    buildAnnualGrid(currentAge + 1);   // rings off + finder pick re-applied
  } else {
    ctl.showRings(true);
    ctl.setPick(_finderPick ? _finderPick.rank : null, _finderPick ? _finderPick.suit : null);
    // ORDER MATTERS — seat the deck FIRST, flag the spread, THEN lay the script.
    // setScript pins a .ls-back card-back overlay to each script card's CURRENT
    // seat. When it ran BEFORE the re-seat (as it used to), the backs stuck to
    // the old age-N seats while the cards moved to the life spread, so ~7 stray
    // backs riffled at scattered positions alongside the real 7 — the "random
    // flips" seen at any non-zero age (invisible at age 0 only because the deck
    // doesn't move). buildAnnualGrid already does setDeck→setScript; this makes
    // qSetMode match. animate:false snaps Life into place so the seven-card
    // riffle is the sole motion; Spirit keeps its animated re-seat.
    ctl.setDeck(m === 'spirit' ? deckAtAge(90) : deckAtAge(1), { animate: m !== 'life' });
    // The riffle (lsRiffle / lsTurnBack) is gated by .ls-lifespread — Life mode
    // IS the age-0 deck so keep the class on; Spirit (deckAtAge(90)) turns it off.
    document.getElementById('annualGrid').classList.toggle('ls-lifespread', m === 'life');
    ctl.setScript(_finderPick ? _finderPick.rank : null, _finderPick ? _finderPick.suit : null);
  }
}
function qToggleDisplace() {
  _qDisp = !_qDisp;   // both displacement chip sets, or none
  qSyncDispBtn();
  ensureSpreadCtl().showGhosts(_qDisp ? 'both' : null);
  try { localStorage.setItem(QUAD_DISP_KEY, _qDisp ? '1' : '0'); } catch (e) {}
}
// Alternate "pips-only" courts — pure CSS swap (body.pips-only); no re-render.
function qToggleAltCourts() {
  const on = document.body.classList.toggle('pips-only');
  const b = document.getElementById('qAlt');
  if (b) { b.classList.toggle('on', on); b.setAttribute('aria-checked', on ? 'true' : 'false'); }
  try { localStorage.setItem(QUAD_ALT_KEY, on ? '1' : '0'); } catch (e) {}
}

// ── Quadrations settings (gear popover) ─────────────────────────
// The Spirit/Age/Life view, Alternate court cards, Show displacements, and
// the card-size slider all live in the gear popover (only the age stepper
// stays outside it, in its own row — that's touched constantly, this is
// set-and-forget). All four persist to localStorage and restore on load.
const QUAD_ALT_KEY  = 'cardsoflife_altCourts';
const QUAD_DISP_KEY = 'cardsoflife_showDisp';
const QUAD_MODE_KEY = 'cardsoflife_quadMode';

// Card size: purely a CSS scale on #annualGrid (--quad-scale, applied in
// css/cardsoflife.css against --quadration-max-w) — no re-render needed. The
// existing ResizeObserver in syncFinderGridsFromQuadration picks up the new
// rendered width automatically, so the finder's life-script + relationship
// mini-grids stay proportional too.
const QUAD_SCALE_KEY = 'cardsoflife_quadScale';
const QUAD_SCALE_MIN = 60, QUAD_SCALE_MAX = 150;

// One-way migration: the site was briefly deployed as "Book of Life" (v2
// rebuild) before reverting to its original "Cards of Life" name. Carry
// forward anyone's settings saved under the interim bookoflife_* keys.
(function _migrateQuadKeys() {
  try {
    [
      ['cardsoflife_altCourts', 'bookoflife_altCourts'],
      ['cardsoflife_showDisp',  'bookoflife_showDisp'],
      ['cardsoflife_quadMode',  'bookoflife_quadMode'],
      ['cardsoflife_quadScale', 'bookoflife_quadScale'],
    ].forEach(([next, old]) => {
      if (localStorage.getItem(next) == null) {
        const v = localStorage.getItem(old);
        if (v != null) localStorage.setItem(next, v);
      }
    });
  } catch (e) {}
})();
function qSetCardSize(v) {
  v = Math.max(QUAD_SCALE_MIN, Math.min(QUAD_SCALE_MAX, Math.round(+v) || 100));
  const grid = document.getElementById('annualGrid');
  if (grid) grid.style.setProperty('--quad-scale', (v / 100).toFixed(2));
  const val = document.getElementById('qSizeVal');
  if (val) val.textContent = v + '%';
  const slider = document.getElementById('qSizeSlider');
  if (slider && +slider.value !== v) slider.value = v;
  try { localStorage.setItem(QUAD_SCALE_KEY, String(v)); } catch (e) {}
}
(function _initQuadCardSize() {
  let saved = 100;
  try {
    const raw = parseInt(localStorage.getItem(QUAD_SCALE_KEY), 10);
    if (raw >= QUAD_SCALE_MIN && raw <= QUAD_SCALE_MAX) saved = raw;
  } catch (e) {}
  qSetCardSize(saved);
})();

// Alt courts / displacements / view mode: restore AFTER buildAnnualGrid(1)
// has run (called from the boot sequence below), since showGhosts/setDeck
// need the grid controller. _qDisp is set directly (not via qToggleDisplace,
// which would flip it) and applied together with the restored mode by the
// final qSetMode call below — mirrors how qSetMode always pairs showGhosts
// with a setDeck, instead of calling showGhosts a second time here.
function _restoreQuadToggles() {
  try {
    if (localStorage.getItem(QUAD_ALT_KEY) === '1') {
      document.body.classList.add('pips-only');
      const b = document.getElementById('qAlt');
      if (b) { b.classList.add('on'); b.setAttribute('aria-checked', 'true'); }
    }
  } catch (e) {}
  try {
    if (localStorage.getItem(QUAD_DISP_KEY) === '1') {
      _qDisp = true;
      qSyncDispBtn();
    }
  } catch (e) {}
  let mode = 'annual';
  try {
    const raw = localStorage.getItem(QUAD_MODE_KEY);
    if (raw === 'spirit' || raw === 'annual' || raw === 'life') mode = raw;
  } catch (e) {}
  qSetMode(mode);   // applies the restored displacement state + deck together
}

// Inline accordion (mirrors toggleToolPanel below) rather than a popover —
// click the gear to open/close, no outside-click dismissal since the panel
// expands in normal document flow instead of floating over content. Escape
// still closes it though, matching every other transient panel on the page
// (birth panel, Olney popup, compare popup, planet panel) — bound on
// document so it works regardless of focus; typing fields are ignored.
(function _wireQuadSettingsPanel() {
  const btn = document.getElementById('qSettingsBtn');
  const panel = document.getElementById('qSettingsPanel');
  if (!btn || !panel) return;
  btn.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || !panel.classList.contains('open')) return;
    const t = e.target;
    if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
    panel.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  });
})();

// ── Personal Cards: Birth / Yearly / 52-day / Daily ──────────────
// All three derived cards use one rule: in deckAtAge(spread+1), find the
// birth card at position p and read the card at (p + 1 + posIdx) mod 52.
// The +1 matches the site's age offset (Age 0 = deckAtAge(1)).
function _pcReadCard(spreadIdx, birthCardIdx, posIdx) {
  const deck = deckAtAge(spreadIdx + 1);
  const p = deck.indexOf(birthCardIdx);
  return deck[(p + 1 + posIdx) % 52];
}

// View-date support: the personal-cards section can show cards "as of" any
// date, not just today. viewDate is a local-midnight epoch (ms). Age at that
// date is derived from the user's birth year, so jumping to 10 years ago
// renders the cards the user would have had then.
function _localMidnight(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}
let viewDate = _localMidnight(new Date());
function _isViewingToday() {
  return viewDate === _localMidnight(new Date());
}
function _lastBdayYearOf(refMs, m, d) {
  const t = new Date(refMs);
  const ty = t.getFullYear();
  const refUTC = Date.UTC(ty, t.getMonth(), t.getDate());
  return (Date.UTC(ty, m - 1, d) > refUTC) ? ty - 1 : ty;
}

function renderPersonalCards() {
  const row     = document.getElementById('pcardsRow');
  const empty   = document.getElementById('pcardsEmpty');
  const dateBar = document.getElementById('pcardsDateBar');
  if (!row || !empty) return;
  _PERIODS = null;   // cleared on the early-return paths below; set once we have cards
  const m = parseInt(document.getElementById('fMonth').value);
  const d = parseInt(document.getElementById('fDay').value);
  const placeholderLabels = ['Birth', '13-Year', '7-Year', 'Yearly', '52-Day', 'Daily'];
  const renderPlaceholders = () => placeholderLabels.map(label => `
    <div class="pcard">
      <div class="spread-card placeholder"></div>
      <div class="pcard-label">${label}</div>
      <div class="pcard-sub placeholder">&mdash;</div>
    </div>`).join('');
  if (!m || !d) {
    row.innerHTML = renderPlaceholders();
    empty.style.display = 'none';
    if (dateBar) dateBar.classList.remove('visible');
    return;
  }
  const sv = solarValue(m, d);
  if (sv === 0) { // Joker (Dec 31) — no seat in the spreads
    row.innerHTML = ''; empty.style.display = '';
    empty.textContent = 'The Joker (Dec 31) sits outside the 52-card spreads, so it has no Yearly, 52-day or Daily cards.';
    if (dateBar) dateBar.classList.remove('visible');
    return;
  }
  empty.style.display = 'none';
  if (dateBar) dateBar.classList.add('visible');
  const birthIdx = sv - 1;

  // Birth year is anchored from currentAge against today's real date.
  // Age-at-viewDate then derives from birth year + viewDate's last-birthday year.
  const realLbYear = _lastBdayYearOf(Date.now(), m, d);
  const birthYear  = realLbYear - currentAge;
  const viewLbYear = _lastBdayYearOf(viewDate, m, d);
  const age = Math.max(0, viewLbYear - birthYear);

  if (viewLbYear - birthYear < 0) {
    // viewDate is before birth — nothing to render.
    row.innerHTML = ''; empty.style.display = '';
    empty.textContent = 'That date is before this birthday.';
    return;
  }

  // Date math (UTC to avoid DST/timezone drift on day counts)
  const now = new Date(viewDate);
  const ty = now.getFullYear();
  const todayUTC = Date.UTC(ty, now.getMonth(), now.getDate());
  const lastBdayUTC   = Date.UTC(viewLbYear, m - 1, d);
  const daysSinceBday = Math.floor((todayUTC - lastBdayUTC) / 86400000);
  const birthUTC  = Date.UTC(birthYear, m - 1, d);
  const daysAlive = Math.floor((todayUTC - birthUTC) / 86400000);
  const weeksAlive = Math.floor(daysAlive / 7);
  const bornWD  = new Date(birthUTC).getUTCDay();    // 0=Sun … 6=Sat
  const todayWD = new Date(todayUTC).getUTCDay();

  // Spread + position for each card type
  const tSpread = Math.floor(age / 91),           tPos = Math.floor((age % 91) / 13);
  const cSpread = Math.floor(age / 49),           cPos = Math.floor((age % 49) / 7);
  const ySpread = Math.floor(age / 7),            yPos = age % 7;
  const fSpread = age,                            fPos = Math.min(Math.floor(daysSinceBday / 52), 6);
  const dSpread = ((weeksAlive % 90) + 90) % 90,  dPos = (todayWD - bornWD + 7) % 7;

  const tIdx = _pcReadCard(tSpread, birthIdx, tPos);
  const cIdx = _pcReadCard(cSpread, birthIdx, cPos);
  const yIdx = _pcReadCard(ySpread, birthIdx, yPos);
  const fIdx = _pcReadCard(fSpread, birthIdx, fPos);
  const dIdx = _pcReadCard(dSpread, birthIdx, dPos);
  // Stash the period readings for the popups + timeline nav (Daily / 52-Day).
  _PERIODS = {
    daily:    { idx: dIdx, planet: SPREAD_PLANETS[dPos] },
    period:   { idx: fIdx, planet: SPREAD_PLANETS[fPos] },
    year:     { idx: yIdx, planet: SPREAD_PLANETS[yPos] },
    seven:    { idx: cIdx, planet: SPREAD_PLANETS[cPos] },
    thirteen: { idx: tIdx, planet: SPREAD_PLANETS[tPos] },
  };
  _PERIOD_ANCHOR = { lbYear: viewLbYear, m: m, d: d, fPos: fPos, age: age, birthYear: birthYear };
  _PERIOD_AGE = age;                                                 // tag for year / chapter / era

  const tStart = Math.floor(age / 13) * 13, tEnd = tStart + 12;
  const cStart = Math.floor(age / 7) * 7,   cEnd = cStart + 6;

  const WD = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const cards = [
    { idx: birthIdx, label: 'Birth', sub: CARDS[birthIdx].name },
    { idx: tIdx, label: '13-Year', sub: SPREAD_PLANETS[tPos] + '<br>age ' + tStart + '–' + tEnd, read: 'thirteen' },
    { idx: cIdx, label: '7-Year', sub: SPREAD_PLANETS[cPos] + '<br>age ' + cStart + '–' + cEnd, read: 'seven' },
    { idx: yIdx, label: 'Yearly', sub: SPREAD_PLANETS[yPos] + '<br>age ' + age, read: 'year' },
    { idx: fIdx, label: '52-Day', sub: SPREAD_PLANETS[fPos] + '<br>period ' + (fPos + 1) + '/7', read: 'period' },
    { idx: dIdx, label: 'Daily',  sub: SPREAD_PLANETS[dPos] + '<br>' + WD[todayWD], read: 'daily' },
  ];

  row.innerHTML = cards.map(pc => {
    const c = CARDS[pc.idx];
    // Trial: the Daily and 52-Day cards open their period reading; the popup's
    // arrows/keys then walk the timeline (see _PERIODS / CC_PERIOD_NAV). The other
    // personal cards keep the plain card popup.
    const click = pc.read ? `openPeriodReading('${pc.read}')` : `openCompareCard(${pc.idx})`;
    return `<div class="pcard">
      <div class="spread-card ${c.suit}" title="${c.name}" onclick="${click}" style="cursor:pointer">${spreadCardPips(c)}</div>
      <div class="pcard-label">${pc.label}</div>
      <div class="pcard-sub">${pc.sub}</div>
    </div>`;
  }).join('');
}
function changeAge(d) {
  let a = currentAge + d;
  if (a > 89) a = 0;
  if (a < 0)  a = 89;
  setAge(a);
}

// ── Personal Cards: date nav ─────────────────────────────────────
function _formatViewDate(ms) {
  const d = new Date(ms);
  const wd = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()];
  const mo = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d.getMonth()];
  return `${wd}, ${d.getDate()} ${mo} ${d.getFullYear()}`;
}
function _isoFromMs(ms) {
  const d = new Date(ms);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
function renderPCardsDateBar() {
  const label = document.getElementById('pcardsDateLabel');
  const input = document.getElementById('pcardsDateInput');
  const today = document.getElementById('pcardsTodayBtn');
  if (!label || !input || !today) return;
  label.textContent = _formatViewDate(viewDate);
  input.value = _isoFromMs(viewDate);
  today.classList.toggle('visible', !_isViewingToday());
}
function setViewDate(ms) {
  viewDate = _localMidnight(new Date(ms));
  renderPCardsDateBar();
  renderPersonalCards();
}
function shiftViewDays(n) {
  const d = new Date(viewDate);
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0); // normalize across DST
  setViewDate(d.getTime());
}
function shiftViewYears(n) {
  const d = new Date(viewDate);
  d.setFullYear(d.getFullYear() + n);
  d.setHours(0, 0, 0, 0);
  setViewDate(d.getTime());
}
function shiftViewMonths(n) {
  // Step by whole months — clamp the day to the target month's last day so
  // e.g. Mar 31 → −1 month lands on Feb 28 (or 29), not the JS-default Mar 3.
  const d = new Date(viewDate);
  const targetDay = d.getDate();
  d.setDate(1);                                       // sidestep month overflow
  d.setMonth(d.getMonth() + n);
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(targetDay, lastDay));
  d.setHours(0, 0, 0, 0);
  setViewDate(d.getTime());
}

// ── Personal-card period popups: walk the timeline ───────────────
// The Daily and 52-Day cards open their reading and let the popup's ‹ › arrows
// (keys / swipe too) walk the timeline: each step shifts viewDate, which
// re-renders the personal cards (restashing _PERIODS) and we reopen the reading.
// Daily steps one day; the 52-Day card steps one period (52 days). Reuses the
// existing date math (shiftViewDays). _PERIODS holds the current reading per type.
var _PERIODS = null;
var _PERIOD_ANCHOR = null;   // { lbYear, m, d, fPos, age, birthYear } — period/age stepping
var _PERIOD_AGE = 0;         // age at viewDate — for the year / chapter / era tags
var _PERIOD_WORD = { daily: 'Today', period: 'This period', year: 'This year', seven: 'This chapter', thirteen: 'This era' };
function _periodTag(type) {
  if (_isViewingToday()) return _PERIOD_WORD[type] || '';
  if (type === 'daily') {
    const off = Math.round((viewDate - _localMidnight(new Date())) / 86400000);
    if (off === 1)  return 'Tomorrow';
    if (off === -1) return 'Yesterday';
  }
  if (type === 'year') return 'Age ' + _PERIOD_AGE;
  if (type === 'seven' || type === 'thirteen') {
    const span = type === 'thirteen' ? 13 : 7;
    const s = Math.floor(_PERIOD_AGE / span) * span;
    return 'Ages ' + s + '–' + (s + span - 1);
  }
  return _formatViewDate(viewDate);
}
// Local-midnight ms of the birthday at which the person is `age` (calendar year
// birthYear + age, on the birth month/day) — for the year / 7-year / 13-year nav.
function _bdayAtAgeMs(age) {
  const s = new Date(_PERIOD_ANCHOR.birthYear + age, _PERIOD_ANCHOR.m - 1, _PERIOD_ANCHOR.d);
  s.setHours(0, 0, 0, 0);
  return s.getTime();
}
// ── Period-reading data (lazy-loaded) ────────────────────────────
// The five reading files (daily/period/year/sevenyear/thirteenyear carddata,
// ~490KB together) are only consumed by the popup's {period,planet} lookup
// (_ccPeriodReading in cardsdata.js), so they load on demand instead of
// riding every page load — same pattern as _loadAstroScripts. Warmed on the
// first pointerover/touch of the Your Cards row; awaited by openPeriodReading.
var _periodDataPromise = null;
function _loadPeriodScripts() {
  if (_periodDataPromise) return _periodDataPromise;
  var scripts = ['js/dailycarddata.js', 'js/periodcarddata.js', 'js/yearcarddata.js',
                 'js/sevenyearcarddata.js', 'js/thirteenyearcarddata.js']
    .filter(function (src) { return !document.querySelector('script[src="' + src + '"]'); });
  _periodDataPromise = Promise.all(scripts.map(function (src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = src;
      s.onload = resolve;
      s.onerror = function () { reject(new Error('Failed to load ' + src)); };
      document.head.appendChild(s);
    });
  }));
  return _periodDataPromise;
}

function openPeriodReading(type) {
  const p = _PERIODS && _PERIODS[type];
  if (!p) return;
  const ctx = { period: type, planet: p.planet, label: _periodTag(type) };
  // Wait for the reading data before opening, so the popup never flashes the
  // plain personality text first. If a file fails to load (offline without the
  // SW cache), open the plain card popup rather than nothing.
  _loadPeriodScripts().then(
    function () { openCompareCard(p.idx, ctx); },
    function () { openCompareCard(p.idx, ctx); }
  );
}
function openDailyCard() { openPeriodReading('daily'); }   // back-compat alias
// Local-midnight ms for the start of 52-day period `pos` (0..6) in the personal
// year beginning on lbYear's birthday — that birthday + pos*52 days.
function _periodStartMs(lbYear, m, d, pos) {
  const s = new Date(lbYear, m - 1, d);
  s.setDate(s.getDate() + pos * 52);
  s.setHours(0, 0, 0, 0);
  return s.getTime();
}
// Called by the popup (ccNavCard) while a period reading is open. Daily steps one
// day. The 52-Day card steps to the adjacent 52-day period BOUNDARY, anchored to
// the birthday (wrapping across personal years) — not just +52 days from today.
window.CC_PERIOD_NAV = function (dir, ctx) {
  if (!ctx || !ctx.period) return;
  const a = _PERIOD_ANCHOR;
  const prev = viewDate;
  if (ctx.period === 'daily') {
    shiftViewDays(dir);
  } else if (ctx.period === 'period') {
    if (!a) return;
    const t = a.fPos + dir;
    setViewDate((t > 6) ? _periodStartMs(a.lbYear + 1, a.m, a.d, 0)   // → next year, period 1
              : (t < 0) ? _periodStartMs(a.lbYear - 1, a.m, a.d, 6)   // → prev year, period 7
              :           _periodStartMs(a.lbYear, a.m, a.d, t));
  } else if (ctx.period === 'year' || ctx.period === 'seven' || ctx.period === 'thirteen') {
    if (!a) return;
    const span = ctx.period === 'thirteen' ? 13 : ctx.period === 'seven' ? 7 : 1;
    const targetAge = Math.floor(a.age / span) * span + dir * span;   // boundary-anchored
    if (targetAge < 0) return;                                        // before birth — ignore
    setViewDate(_bdayAtAgeMs(targetAge));
  } else return;
  if (_PERIODS && _PERIODS[ctx.period]) openPeriodReading(ctx.period);
  else setViewDate(prev);   // reverted (before birth / no render)
};

// Warm the lazy period data the moment the visitor shows interest in the
// Your Cards row (hover / first touch), so the first tile click opens with
// the reading already in memory on most connections.
(function () {
  const row = document.getElementById('pcardsRow');
  if (!row) return;
  ['pointerover', 'touchstart'].forEach(ev =>
    row.addEventListener(ev, _loadPeriodScripts, { once: true, passive: true }));
})();

document.querySelectorAll('.pdate-nav').forEach(btn => {
  btn.addEventListener('click', () => {
    const dy = parseInt(btn.dataset.shiftYear  || '0', 10);
    const dm = parseInt(btn.dataset.shiftMonth || '0', 10);
    const dd = parseInt(btn.dataset.shiftDay   || '0', 10);
    if (dy) shiftViewYears(dy);
    if (dm) shiftViewMonths(dm);
    if (dd) shiftViewDays(dd);
  });
});
document.getElementById('pcardsTodayBtn').addEventListener('click', () => {
  setViewDate(Date.now());
});
(function () {
  const label = document.getElementById('pcardsDateLabel');
  const input = document.getElementById('pcardsDateInput');
  label.addEventListener('click', () => {
    if (typeof input.showPicker === 'function') {
      try { input.showPicker(); return; } catch (e) { /* fall through */ }
    }
    input.focus();
    input.click();
  });
  input.addEventListener('change', () => {
    if (!input.value) return;
    const [y, m, d] = input.value.split('-').map(Number);
    setViewDate(new Date(y, m - 1, d).getTime());
  });
})();
renderPCardsDateBar();

// ── Saved birthdays (localStorage) ─────────────────────────────────
const BIRTH_KEY = 'cardsoflife_births';
// Migration: the site was briefly deployed as "Book of Life" (v2 rebuild)
// before reverting to its original "Cards of Life" name. Carry saved births
// over from that interim localStorage key once, so nothing is lost.
try {
  if (localStorage.getItem(BIRTH_KEY) == null) {
    const _oldBirths = localStorage.getItem('bookoflife_births');
    if (_oldBirths != null) localStorage.setItem(BIRTH_KEY, _oldBirths);
  }
} catch (e) {}
const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function _escHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function loadBirths() {
  try { return JSON.parse(localStorage.getItem(BIRTH_KEY)) || []; } catch(e) { return []; }
}
function saveBirths(list) {
  try { localStorage.setItem(BIRTH_KEY, JSON.stringify(list)); } catch(e) {}
}
function _lastBdayYear(m, d) {
  const t = new Date();
  const ty = t.getFullYear();
  const todayUTC = Date.UTC(ty, t.getMonth(), t.getDate());
  return (Date.UTC(ty, m-1, d) > todayUTC) ? ty - 1 : ty;
}
function ageFromBirthYear(birthYear, m, d) { return _lastBdayYear(m, d) - birthYear; }
function birthYearFromAge(age, m, d)       { return _lastBdayYear(m, d) - age; }

// Which Finder slot the picker fills: 'self' (day/month + age) or 'partner'
// (relDay2/relMonth2 only — the partner has no age field, so its year is
// ignored). Set from the overlay's For toggle; only meaningful in two-person
// mode. Default 'self' covers solo mode and every existing caller.
let _bdayTarget = 'self';
function loadBirth(entry, target) {
  target = target || 'self';
  if (target === 'partner') {
    // Make sure the partner slot is open, then set its date the same way the
    // URL-restore does (value + change → maybeFindUnified recomputes).
    if (!secondVisible) toggleSecond();
    const M = document.getElementById('relMonth2');
    const D = document.getElementById('relDay2');
    M.value = String(entry.month); M.dispatchEvent(new Event('change'));
    D.value = String(entry.day);   D.dispatchEvent(new Event('change'));
    closeBirthPanel();
    return;
  }
  // Suppressed: selecting a saved birthday here shouldn't force a collapsed
  // Finder section open and jump the page to it (see _showResultEntry).
  _suppressAutoExpand = true;
  document.getElementById('fMonth').value = entry.month;
  document.getElementById('fMonth').dispatchEvent(new Event('change'));
  document.getElementById('fDay').value = entry.day;
  document.getElementById('fDay').dispatchEvent(new Event('change'));
  setAge(ageFromBirthYear(entry.year, entry.month, entry.day));
  _suppressAutoExpand = false;
  closeBirthPanel();
}
// The person's Birth Card as a mini parchment chip (rank + suit pip), from
// their birthday via solarValue → CARDS. Dec 31 is the Joker (sv 0) — a gold ✦.
function _birthChip(e) {
  const sv = solarValue(e.month, e.day);
  // CARDS is a bare global const from cardsdata.js (not on window), so guard by
  // name — an earlier window.CARDS check was always false → every chip fell back
  // to the ✦.
  if (sv > 0 && typeof CARDS !== 'undefined' && CARDS[sv - 1]) {
    const c = CARDS[sv - 1];
    const red = (c.suit === 'hearts' || c.suit === 'diamonds');
    return '<div class="bi-chip' + (red ? ' red' : '') + '">' + c.rank + c.sym + '</div>';
  }
  return '<div class="bi-chip" style="color:var(--gold)">&#10022;</div>';
}
function renderBirthPanel() {
  const panel = document.getElementById('birthPanel');
  const badge = document.getElementById('birthListBadge');
  const count = document.getElementById('bdayCount');
  const list = loadBirths();
  if (badge) {
    if (list.length) {
      badge.textContent = list.length > 99 ? '99+' : String(list.length);
      badge.classList.add('visible');
    } else {
      badge.textContent = '';
      badge.classList.remove('visible');
    }
  }
  if (count) count.textContent = list.length ? String(list.length) : '';
  if (!list.length) {
    panel.innerHTML = '<div class="birth-empty">No saved birthdays yet.</div>';
    return;
  }
  panel.innerHTML = list.map(e =>
    '<div class="birth-item" data-id="' + e.id + '">' +
      _birthChip(e) +
      '<div class="birth-item-body">' +
        '<div class="birth-name">' + _escHtml(e.name) + '</div>' +
        '<div class="birth-date">' + MONTHS_SHORT[e.month-1] + ' ' + e.day + ', ' + e.year +
          ' &middot; age ' + ageFromBirthYear(e.year, e.month, e.day) + '</div>' +
      '</div>' +
      '<button class="birth-del" data-del="' + e.id + '" title="Delete" aria-label="Delete ' + _escHtml(e.name) + '">&times;</button>' +
    '</div>'
  ).join('');
  panel.querySelectorAll('.birth-item').forEach(item => {
    item.addEventListener('click', e => {
      if (e.target.closest('[data-del]')) return;
      const id = +item.dataset.id;
      const entry = loadBirths().find(x => x.id === id);
      if (entry) loadBirth(entry, _bdayTarget);
    });
  });
  panel.querySelectorAll('[data-del]').forEach(b => {
    b.addEventListener('click', e => {
      e.stopPropagation();
      const id = +b.dataset.del;
      saveBirths(loadBirths().filter(x => x.id !== id));
      renderBirthPanel();
    });
  });
}
// The saved-birthdays list now lives in a body-level overlay (#bdayOverlay) so
// it escapes the Your Cards section's overflow:hidden (which clipped the old
// dropdown). openBirthPanel / closeBirthPanel keep their names — callers
// (loadBirth, saveManualBirth, openBirthAddPanel) are unchanged.
let _bdayReturnFocus = null;
// Point the picker at a slot and reflect it on the For toggle.
function _setBdayTarget(t) {
  _bdayTarget = (t === 'partner') ? 'partner' : 'self';
  const self = document.getElementById('bdayTargetSelf');
  const partner = document.getElementById('bdayTargetPartner');
  if (self) self.classList.toggle('is-active', _bdayTarget === 'self');
  if (partner) partner.classList.toggle('is-active', _bdayTarget === 'partner');
}
function openBirthPanel() {
  const ov = document.getElementById('bdayOverlay');
  renderBirthPanel();
  // The For: You/Partner toggle only appears in two-person mode. Default it to
  // the first EMPTY slot (so "I've set myself, now add my partner" needs no
  // thought), falling back to You.
  const tgt = document.getElementById('bdayTarget');
  if (typeof secondVisible !== 'undefined' && secondVisible) {
    if (tgt) tgt.hidden = false;
    const selfSet = document.getElementById('fMonth').value && document.getElementById('fDay').value;
    const partnerSet = document.getElementById('relMonth2').value && document.getElementById('relDay2').value;
    _setBdayTarget(!selfSet ? 'self' : (!partnerSet ? 'partner' : 'self'));
  } else {
    if (tgt) tgt.hidden = true;
    _setBdayTarget('self');
  }
  ov.classList.add('open');
  const close = document.getElementById('bdayClose');
  if (close) setTimeout(() => close.focus(), 0);
}
function closeBirthPanel() {
  const ov = document.getElementById('bdayOverlay');
  ov.classList.remove('open');
  closeBirthAddPanel();
  if (_bdayReturnFocus) { try { _bdayReturnFocus.focus(); } catch (_) {} _bdayReturnFocus = null; }
}

// ── Manual birthday entry (DD / MM / YYYY) ─────────────────────────
function openBirthAddPanel() {
  // (No longer closes the overlay — the add form now lives inside it.)
  // Pre-fill from the Finder when Day/Month are set, AND derive the year
  // from currentAge each time the panel opens — that way, picking an age
  // in the Quadration grid and then opening the add-birthday panel gives
  // you a sensible year (e.g. age 30 today → 1996). Always overwrites so
  // the year tracks the most recent age, even on a re-open.
  const dEl = document.getElementById('baDay');
  const mEl = document.getElementById('baMonth');
  const yEl = document.getElementById('baYear');
  const fD  = parseInt(document.getElementById('fDay').value, 10);
  const fM  = parseInt(document.getElementById('fMonth').value, 10);
  if (fD && fM) {
    dEl.value = String(fD).padStart(2, '0');
    mEl.value = String(fM).padStart(2, '0');
    const yr = currentAge > 0 ? birthYearFromAge(currentAge, fM, fD) : new Date().getFullYear();
    yEl.value = String(yr);
  }
  document.getElementById('birthAddPanel').classList.add('open');
  // Focus the first empty field, or the name if all date fields are filled.
  setTimeout(() => {
    const firstEmpty = ['baDay','baMonth','baYear','baName'].find(id => !document.getElementById(id).value);
    document.getElementById(firstEmpty || 'baName').focus();
  }, 0);
}
function closeBirthAddPanel() {
  document.getElementById('birthAddPanel').classList.remove('open');
  document.getElementById('birthAddError').textContent = '';
}
function saveManualBirth() {
  const dEl = document.getElementById('baDay');
  const mEl = document.getElementById('baMonth');
  const yEl = document.getElementById('baYear');
  const nEl = document.getElementById('baName');
  const err = document.getElementById('birthAddError');
  const d = parseInt(dEl.value, 10);
  const m = parseInt(mEl.value, 10);
  const y = parseInt(yEl.value, 10);
  const name = (nEl.value || '').trim();
  err.textContent = '';
  if (!name)                                     { err.textContent = 'Name is required.'; nEl.focus(); return; }
  if (!d || d < 1 || d > 31)                     { err.textContent = 'Day must be 1–31.'; dEl.focus(); return; }
  if (!m || m < 1 || m > 12)                     { err.textContent = 'Month must be 1–12.'; mEl.focus(); return; }
  const yMax = new Date().getFullYear();
  if (!y || y < 1900 || y > yMax)                { err.textContent = 'Year must be 1900–' + yMax + '.'; yEl.focus(); return; }
  const test = new Date(y, m - 1, d);
  if (test.getFullYear() !== y || test.getMonth() !== m - 1 || test.getDate() !== d) {
    err.textContent = 'Not a valid date.'; dEl.focus(); return;
  }
  // yMax above only bounds the YEAR to this calendar year, so a day/month later
  // than today within the current year (e.g. entering December while it's still
  // January) would otherwise slip through as a "birthday" that hasn't happened
  // yet — compare the full constructed date against today, not just the year.
  const today = new Date(); today.setHours(0, 0, 0, 0);
  if (test.getTime() > today.getTime()) {
    err.textContent = 'Birthday can’t be in the future.'; dEl.focus(); return;
  }
  const list = loadBirths();
  const entry = { id: Date.now(), name, day: d, month: m, year: y };
  list.push(entry);
  saveBirths(list);
  // Reset inputs
  dEl.value = ''; mEl.value = ''; yEl.value = ''; nEl.value = '';
  closeBirthAddPanel();
  renderBirthPanel();
  // Load into the finder so the result shows immediately
  loadBirth(entry);
}
// Auto-advance numeric inputs DD → MM → YYYY → name
(function () {
  const seq = ['baDay', 'baMonth', 'baYear', 'baName'];
  seq.slice(0, 3).forEach((id, i) => {
    const el = document.getElementById(id);
    el.addEventListener('input', () => {
      el.value = el.value.replace(/\D/g, '');
      const maxLen = el.getAttribute('maxlength') | 0;
      if (el.value.length >= maxLen) document.getElementById(seq[i + 1]).focus();
    });
  });
  // Enter inside any field submits
  ['baDay','baMonth','baYear','baName'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); saveManualBirth(); }
    });
  });
})();

// ── Export / import saved birthdays (file only; merge on import) ────
// Birthdays live in localStorage (per-browser, private, offline). Export writes
// a small wrapped JSON file so import can sanity-check it; import MERGES (adds
// new people, skips exact duplicates) so it can never silently wipe a list.
function exportBirths() {
  const payload = { app: 'mysticscards', type: 'birthdays', version: 1,
                    exported: new Date().toISOString(), births: loadBirths() };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mysticscards-birthdays-' + new Date().toISOString().slice(0, 10) + '.json';
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function _validBirth(o) {
  const yMax = new Date().getFullYear();
  return o && typeof o.name === 'string' && o.name.trim() &&
    Number.isInteger(o.day)   && o.day   >= 1    && o.day   <= 31 &&
    Number.isInteger(o.month) && o.month >= 1    && o.month <= 12 &&
    Number.isInteger(o.year)  && o.year  >= 1900 && o.year  <= yMax;
}
function _bdayToast(msg, isErr) {
  const note = document.querySelector('#bdayModal .bday-note');
  if (!note) return;
  if (note._orig == null) note._orig = note.textContent;
  note.textContent = msg;
  note.style.color = isErr ? '#e98a8a' : 'var(--gold-light)';
  clearTimeout(note._t);
  note._t = setTimeout(() => { note.textContent = note._orig; note.style.color = ''; }, 3500);
}
function importBirthsFromFile(ev) {
  const file = ev.target.files && ev.target.files[0];
  ev.target.value = '';            // let the same file be chosen again later
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    let data;
    try { data = JSON.parse(reader.result); }
    catch (_) { _bdayToast('That file isn’t valid JSON.', true); return; }
    const incoming = Array.isArray(data) ? data
      : (data && Array.isArray(data.births) ? data.births : null);
    if (!incoming) { _bdayToast('No birthdays found in that file.', true); return; }
    const clean = incoming.filter(_validBirth).map(o => ({
      id: Number.isFinite(o.id) ? o.id : Date.now() + Math.floor(Math.random() * 1e6),
      name: o.name.trim(), day: o.day, month: o.month, year: o.year
    }));
    if (!clean.length) { _bdayToast('No valid birthdays to import.', true); return; }
    const existing = loadBirths();
    const key = o => o.name.toLowerCase() + '|' + o.day + '|' + o.month + '|' + o.year;
    const seen = new Set(existing.map(key));
    let added = 0;
    clean.forEach(o => { if (!seen.has(key(o))) { seen.add(key(o)); existing.push(o); added++; } });
    saveBirths(existing);
    renderBirthPanel();
    _bdayToast(added ? ('Imported ' + added + (added === 1 ? ' birthday.' : ' birthdays.'))
                     : 'Everything in that file was already saved.', false);
  };
  reader.onerror = () => _bdayToast('Couldn’t read that file.', true);
  reader.readAsText(file);
}

// Row triggers open the overlay (Add also reveals the add form); the overlay's
// own toolbar handles add / import / export, and backdrop-click or Escape closes.
document.getElementById('birthAddBtn').addEventListener('click', () => {
  _bdayReturnFocus = document.getElementById('birthAddBtn');
  openBirthPanel(); openBirthAddPanel();
});
document.getElementById('birthListBtn').addEventListener('click', () => {
  _bdayReturnFocus = document.getElementById('birthListBtn');
  openBirthPanel();
});
document.getElementById('birthAddSave').addEventListener('click', saveManualBirth);
document.getElementById('bdayAddBtn').addEventListener('click', () => {
  const p = document.getElementById('birthAddPanel');
  p.classList.contains('open') ? closeBirthAddPanel() : openBirthAddPanel();
});
document.getElementById('bdayClose').addEventListener('click', closeBirthPanel);
document.getElementById('bdayOverlay').addEventListener('click', e => {
  if (e.target === e.currentTarget) closeBirthPanel();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('bdayOverlay').classList.contains('open')) {
    closeBirthPanel();
  }
});
document.getElementById('bdayExportBtn').addEventListener('click', exportBirths);
document.getElementById('bdayImportBtn').addEventListener('click', () =>
  document.getElementById('bdayImportFile').click());
document.getElementById('bdayImportFile').addEventListener('change', importBirthsFromFile);
// The Finder's divider picker opens the same overlay; in two-person mode the
// For toggle (set in openBirthPanel) decides which slot a pick fills.
const _finderPickBtn = document.getElementById('finderPickBtn');
if (_finderPickBtn) _finderPickBtn.addEventListener('click', () => {
  _bdayReturnFocus = _finderPickBtn;
  openBirthPanel();
});
['bdayTargetSelf', 'bdayTargetPartner'].forEach(id => {
  const b = document.getElementById(id);
  if (b) b.addEventListener('click', () => _setBdayTarget(b.dataset.target));
});
renderBirthPanel(); // initialize the badge/count

document.getElementById('ageDown').addEventListener('click', () => changeAge(-1));
document.getElementById('ageUp').addEventListener('click',   () => changeAge(+1));
document.getElementById('ageInput').addEventListener('input',  function() { if (this.value !== '') setAge(this.value); });
document.getElementById('ageInput').addEventListener('change', function() { setAge(this.value); });
document.getElementById('ageInput').addEventListener('keydown', function(e) {
  if (e.key==='ArrowUp')   { e.preventDefault(); changeAge(+1); }
  if (e.key==='ArrowDown') { e.preventDefault(); changeAge(-1); }
});

buildAnnualGrid(1); // render Life Spread on load
_restoreQuadToggles(); // restore Alt Courts / Show Displacements preferences
renderPersonalCards();

let _ccardIdx = -1;


// "Load" — highlight the card in the Quadration grid only (the shine + the
// age-0 life-script bounce), without rendering the full finder profile and
// without scrolling (the popup opens over the spread, so the highlight lands
// in place). Joker has no seat → no pick.
// IMPORTANT: do NOT call buildAnnualGrid here. That would re-deck to the current
// annual age (snapping Spirit/Life mode back to the Life spread, dropping the
// fixed rings) and re-toggle .ls-lifespread, firing the riffle anywhere age 0
// happens to be active. Instead, apply the pick + script in place. The riffle
// is CSS-gated by .ls-lifespread on the grid, so it'll only run if we're
// already on the Life spread — and if the user then switches to Life mode
// while .ls-pick is still on those cards, the keyframes start at that point.
function loadCardPick() {
  if (_ccardIdx < 0) return;
  closeCompareCard();
  const c = CARDS[_ccardIdx];
  _finderPick = c.suit === 'joker' ? null : { rank: c.rank, suit: c.suit };
  const ctl = ensureSpreadCtl();
  ctl.setPick(_finderPick ? _finderPick.rank : null, _finderPick ? _finderPick.suit : null);
  ctl.setScript(_finderPick ? _finderPick.rank : null, _finderPick ? _finderPick.suit : null);
}

// Reload chip — after the user has navigated away from their finder
// pick (via openCompareCard → Open full profile on a different card),
// the rReload chip becomes visible. Clicking it re-runs the finder
// pipeline from the CURRENT dropdown values, restoring either the
// solo birth card or the relationship triptych as appropriate.
function restoreFinderPick() {
  const m1 = parseInt(document.getElementById('fMonth').value);
  const d1 = parseInt(document.getElementById('fDay').value);
  const m2 = parseInt(document.getElementById('relMonth2').value);
  const d2 = parseInt(document.getElementById('relDay2').value);
  if (m1 && d1 && m2 && d2 && secondVisible && typeof _findRelationship === 'function') {
    _findRelationship();
  } else if (m1 && d1 && typeof _findBirthCard === 'function') {
    _findBirthCard();
  }
}
function _setReloadVisible(visible) {
  // Use the .is-inactive class (visibility: hidden) rather than the
  // [hidden] attribute (display: none) so the reload button always
  // reserves its slot in the result-actions row — that keeps the
  // olney / share / collapse buttons locked in place when reload
  // toggles on and off.
  const b1 = document.getElementById('rReload');
  const b2 = document.getElementById('relReload');
  if (b1) b1.classList.toggle('is-inactive', !visible);
  if (b2) b2.classList.toggle('is-inactive', !visible);
}

function loadCardInFinder() {
  if (_ccardIdx < 0) return;
  // Only run the close animation if the popup is actually open — this fn is
  // also reused by the hash-restore path on cold load (no popup to close).
  if (document.getElementById('ccardOverlay').classList.contains('open')) closeCompareCard();
  const idx = _ccardIdx;
  _renderFinderCard(CARDS[idx], idx, { fromCard: true });
}

// Click on the dark backdrop closes; clicks on the popup itself stay inside it
// (tap-anywhere-to-close was easy to trigger by accident on mobile — the swipe-up
// gesture below + the × button replace it).
document.getElementById('ccardOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeCompareCard();
});

// Mobile gestures on the popup: swipe LEFT/RIGHT steps to the next/previous
// card; swipe UP dismisses. The vertical-close fires only when the popup's
// scrollable body didn't move (scrollTop unchanged across the touch), so a
// normal scroll-up gesture inside .ccard-body never accidentally closes.
let _popupTouchX = 0, _popupTouchY = 0, _popupStartScroll = 0;
let _popupSwiped = false;
const _ccardPopup = document.querySelector('.ccard-popup');
const _ccardBody  = document.querySelector('.ccard-body');
_ccardPopup.addEventListener('touchstart', e => {
  _popupTouchX = e.touches[0].clientX;
  _popupTouchY = e.touches[0].clientY;
  _popupStartScroll = _ccardBody ? _ccardBody.scrollTop : 0;
  _popupSwiped = false;
}, { passive: true });
_ccardPopup.addEventListener('touchend', e => {
  const dx = e.changedTouches[0].clientX - _popupTouchX;
  const dy = e.changedTouches[0].clientY - _popupTouchY;
  const dScroll = (_ccardBody ? _ccardBody.scrollTop : 0) - _popupStartScroll;
  // Vertical swipe-up that didn't scroll the body → dismiss
  if (-dy > 60 && Math.abs(dy) > Math.abs(dx) && dScroll === 0) {
    _popupSwiped = true;
    closeCompareCard();
    return;
  }
  // Horizontal swipe → navigate
  if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy)) {
    _popupSwiped = true;
    ccNavCard(dx > 0 ? -1 : 1);
  }
}, { passive: true });

document.addEventListener('keydown', e => {
  if (!document.getElementById('ccardOverlay').classList.contains('open')) return;
  if (e.key === 'Escape') closeCompareCard();
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); ccNavCard(1); }
  if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); ccNavCard(-1); }
});

// ── Year Calendar ────────────────────────────────────────────────
const MONTH_FULL = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

function buildCalendar() {
  let html = '';
  const now = new Date();
  const tM = now.getMonth() + 1, tD = now.getDate();

  // Header row: blank day-label cell + 12 month names
  html += `<div class="cal-col-header"></div>`;
  for (let m = 1; m <= 12; m++) {
    const alt = (m % 2 === 0) ? ' cal-col-alt' : '';
    html += `<div class="cal-col-header${alt}">${MONTH_NAMES[m]}</div>`;
  }

  // 31 day rows
  for (let d = 1; d <= 31; d++) {
    html += `<div class="cal-month-label">${d}</div>`;

    for (let m = 1; m <= 12; m++) {
      const alt = (m % 2 === 0) ? ' cal-col-alt' : '';
      const maxDays = DAYS_IN_MONTH[m];
      if (d > maxDays) {
        html += `<div class="cal-cell-empty${alt}"></div>`;
        continue;
      }
      const sv = solarValue(m, d);
      const cardIdx = sv === 0 ? 52 : sv - 1;
      const c = CARDS[cardIdx];
      const isLeap = (m === 2 && d === 29);
      const isToday = (m === tM && d === tD);
      const SUIT_LETTER = { hearts:'♥', diamonds:'♦', clubs:'♣', spades:'♠' };
      const chip = c.suit === 'joker'
        ? `<div class="cal-chip joker"><span class="cal-token cal-token-joker">JOKER</span></div>`
        : `<div class="cal-chip ${c.suit}"><span class="cal-token">${c.rank}${SUIT_LETTER[c.suit]}</span></div>`;
      html += `<div class="cal-day${alt}${isLeap ? ' cal-leap' : ''}${isToday ? ' cal-today' : ''}" onclick="openModalFromCalendar(${cardIdx})" title="${c.name}${isToday ? ' · today' : ''}${isLeap ? ' (leap year)' : ''}">`;
      html += chip;
      html += `</div>`;
    }
  }

  document.getElementById('calGrid').innerHTML = html;
}

function openModalFromCalendar(idx) {
  openCompareCard(idx);
}

// ── Inline tool panels (expand in place rather than open a modal) ──
// Tools whose content is rendered by JS the first time they open.
var _toolBuilt = {};
function _buildToolPanel(key) {
  if (_toolBuilt[key]) return;
  if (key === 'browse')   _buildBrowseGrid();
  else if (key === 'cal')  buildCalendar();
  else if (key === 'astro') _initAstroPanel();
  _toolBuilt[key] = true;
}
function _syncToolPanelFromFinder(key) {
  var fD = parseInt((document.getElementById('fDay')   || {}).value, 10) || 0;
  var fM = parseInt((document.getElementById('fMonth') || {}).value, 10) || 0;
  // 'All Cards' (browse) intentionally does NOT inherit the finder date — its
  // solar-value calculator stays blank for free exploration.
  if (key === 'astro') {
    // Astrology — pre-fill DD / MM, and derive the year from currentAge
    // when the user has set one in the Quadration grid.
    var aDay   = document.getElementById('aDay');
    var aMonth = document.getElementById('aMonth');
    var aYear  = document.getElementById('aYear');
    if (aDay   && fD) aDay.value   = String(fD);
    if (aMonth && fM) aMonth.value = String(fM);
    if (aYear && fD && fM && typeof currentAge === 'number' && currentAge > 0
        && typeof birthYearFromAge === 'function') {
      aYear.value = String(birthYearFromAge(currentAge, fM, fD));
    }
  }
}
// Minimising the whole Tools section used to leave whichever tab was open
// still marked .open underneath (CSS has a min-height guard for the layout
// side-effect of this — see .tools-section.section-open:has(.tool-panel.open)
// in cardsoflife.css — but the tab itself just silently popped back open
// next time Tools was reopened). Called from the Tools header's onclick,
// right after the shared toggleSection('tools') runs, so section-open
// already reflects the new state by the time this checks it.
function onToolsSectionToggle() {
  var section = document.getElementById('tools');
  if (section && !section.classList.contains('section-open')) _closeAllToolPanels();
}
// .tool-panel normally animates its own open/close (grid-rows + opacity +
// margin, ~.35s) independently of the outer Tools section's collapse
// (grid-rows only, .4s, in site.css's shared .section-bodywrap/.section-
// bodymin). That's fine when only one is moving at a time, but closing the
// whole section while a panel is still open used to run BOTH at once —
// different durations, and the panel additionally fades + shifts margin
// where the outer wrapper doesn't — which read as a jarring double-collapse
// (content visibly dimming while still fully laid out, instead of the clean
// single fold every other section does). .no-anim (below) forces that one
// state change to be instant, so only the outer section's collapse is ever
// seen; toggleToolPanel clears it again so the panel's own animation is
// intact for ordinary tab switches/closes while Tools stays open.
function _closeAllToolPanels() {
  document.querySelectorAll('.tool-panel.open').forEach(function (p) {
    p.classList.add('no-anim');
    p.classList.remove('open');
    var btn = document.getElementById(p.id.replace(/Panel$/, 'ToolBtn'));
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
  var toolsPop = document.getElementById('toolsPop');
  if (toolsPop) toolsPop.classList.remove('open');
}
function toggleToolPanel(key) {
  var panel = document.getElementById(key + 'Panel');
  var btn   = document.getElementById(key + 'ToolBtn');
  if (!panel || !btn) return;
  panel.classList.remove('no-anim');   // restore normal animation for direct tab interaction
  var willOpen = !panel.classList.contains('open');
  // Accordion: at most one panel open — close any other before opening
  document.querySelectorAll('.tool-panel.open').forEach(function (p) {
    if (p === panel) return;
    p.classList.remove('open');
    var otherBtn = document.getElementById(p.id.replace(/Panel$/, 'ToolBtn'));
    if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
  });
  if (willOpen) {
    _buildToolPanel(key);
    // Every time a tool panel opens, copy the finder's current date
    // (and currentAge-derived year for astrology) into its inputs —
    // saves the user re-entering the same date they just picked.
    _syncToolPanelFromFinder(key);
  }
  panel.classList.toggle('open', willOpen);
  btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
  // Elevate the whole Tools pop-out while any panel is open (accordion → at most
  // one open, so willOpen is the pop's state: open on open/switch, collapse on close).
  var _toolsPop = document.getElementById('toolsPop');
  if (_toolsPop) _toolsPop.classList.toggle('open', willOpen);
  if (willOpen) {
    // Bring the selected tool up to the top of the viewport (respects the sticky
    // header via scroll-padding-top on <html>). The first pass animates; a second,
    // instant pass re-lands it after astrology's lazy-loaded engine reflows the
    // panel (which otherwise cancels the in-flight smooth scroll).
    setTimeout(function () { btn.scrollIntoView({ behavior: 'smooth',  block: 'start' }); }, 160);
    setTimeout(function () { btn.scrollIntoView({ behavior: 'instant', block: 'start' }); }, 650);
  }
}

// ── Shareable finder links ──────────────────────────────────────
// A lookup is encoded in the URL hash. Two forms:
//   cardsoflife.html#b=D.M          (single card, by birthday)
//   cardsoflife.html#b=D.M&b2=D.M   (relationship, both birthdays)
//   cardsoflife.html#c=CODE         (single card, by identity — for profiles
//                                   loaded from the compare popup with no date)
// CODE is rank + suit-letter (AH, 10S, KD, JC…) or JOKER. Day.Month order
// matches the Finder's dropdowns. A valid hash restores the lookup on load;
// changing the finder manually clears the hash.
let _restoringHash = false;
let _loadedViaCard = false;       // true when the finder is showing a card profile loaded by identity (no date)

const _SUIT_LETTER  = { hearts: 'H', diamonds: 'D', clubs: 'C', spades: 'S' };
const _SUIT_FROM_L  = { H: 'hearts', D: 'diamonds', C: 'clubs', S: 'spades' };
function _cardCode(idx) {
  const c = (idx != null && idx >= 0) ? CARDS[idx] : null;
  if (!c) return null;
  if (c.suit === 'joker') return 'JOKER';
  return c.rank + _SUIT_LETTER[c.suit];
}
function _cardIdxFromCode(code) {
  const s = String(code || '').toUpperCase();
  if (!s) return -1;
  if (s === 'JOKER') return CARDS.findIndex(c => c.suit === 'joker');
  const m = /^(10|[A2-9JQK])([HDCS])$/.exec(s);
  if (!m) return -1;
  return CARDS.findIndex(c => c.rank === m[1] && c.suit === _SUIT_FROM_L[m[2]]);
}

function finderURL() {
  // Card-only profile (loaded via "Open full profile" with no birthday): share by card identity.
  if (_loadedViaCard && _olneyIdx >= 0) {
    const code = _cardCode(_olneyIdx);
    return code ? location.origin + location.pathname + '#c=' + code : null;
  }
  const m1 = document.getElementById('fMonth').value;
  const d1 = document.getElementById('fDay').value;
  if (!m1 || !d1) return null;
  let hash = '#b=' + d1 + '.' + m1;
  if (secondVisible) {
    const m2 = document.getElementById('relMonth2').value;
    const d2 = document.getElementById('relDay2').value;
    if (!m2 || !d2) return null;
    hash += '&b2=' + d2 + '.' + m2;
  }
  return location.origin + location.pathname + hash;
}

// ── Olney view ───────────────────────────────────────────────────
// Richmond's per-card reading + his engraved "Grand Spread" plate, from
// window.RICHMOND (js/richmonddata.js). Layouts are filled in incrementally;
// cards without a transcribed spread show a "coming soon" note.
let _olneyIdx = -1;
const _SUIT_FROM_SYM = { '♥': 'hearts', '♣': 'clubs', '♦': 'diamonds', '♠': 'spades' };
const _OLNEY_PLANETS = ['Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune'];

// Engraved sunburst masthead for the Grand Spread plate — identical for every
// card, so the ray-fan is computed once. (Mirrors dev/olney-plate-mockup.html.)
const _OLNEY_RAYS = (function () {
  const cx = 100, cy = 120, n = 46; let s = '';
  for (let i = 0; i <= n; i++) {
    const a = Math.PI * (i / n);
    const inner = 20, outer = 96 + (Math.abs(i - n / 2) < 2 ? 12 : 0);
    const x1 = cx - Math.cos(a) * inner, y1 = cy - Math.sin(a) * inner;
    const x2 = cx - Math.cos(a) * outer, y2 = cy - Math.sin(a) * outer;
    s += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
  }
  return s;
})();
const _OLNEY_MAST =
  '<div class="olney-mast"><span class="olney-mast-t">The&nbsp;Mystic</span>' +
  '<svg class="olney-sunburst" viewBox="0 0 200 120" aria-hidden="true">' +
    `<g stroke="var(--plate-ink)" stroke-width="1.1" stroke-linecap="round">${_OLNEY_RAYS}</g>` +
    '<path d="M100 120 a16 16 0 0 1 -32 0 z" fill="var(--plate-ink)" stroke="var(--plate-ink)" stroke-width="1.5"/>' +
    '<path d="M100 120 a16 16 0 0 0 32 0" fill="none" stroke="var(--plate-ink)" stroke-width="1.5"/>' +
  '</svg><span class="olney-mast-t">Test&nbsp;Book.</span></div>';

// "10♠" → its CARDS entry (for spreadCardPips). Reads the leading card token,
// so a trailing note like "2♠ (under O.O.M.)" still resolves to 2♠.
function _cardFromToken(tok) {
  const m = String(tok).trim().match(/^(10|[A2-9JQK])\s*([♥♣♦♠])/);
  if (!m) return null;
  const suit = _SUIT_FROM_SYM[m[2]];
  return CARDS.find(c => c.rank === m[1] && c.suit === suit) || null;
}

function _olneyCellHTML(tok, cls) {
  const c = _cardFromToken(tok);
  if (!c) return `<div class="spread-card ${cls || ''}"></div>`;
  return `<div class="spread-card ${c.suit} ${cls || ''}" title="${c.name}">${spreadCardPips(c)}</div>`;
}

// Called when the finder shows a new card: remember it, render the Olney panel
// for it (rendered eagerly so the popup opens instantly), and reveal/hide the
// Olney popup button (the Joker has no Richmond entry).
function _updateOlneyTarget(idx) {
  _olneyIdx = idx;
  const c = CARDS[idx];
  const R = c && window.RICHMOND && window.RICHMOND[`${c.rank}_${c.suit}`];
  // Toggle the popup buttons in BOTH result sections (finder + relationship).
  // Joker has no entry, so hide them when R is missing. Visibility-based
  // (.is-inactive) rather than display:none so the share + collapse buttons
  // beside them don't shift when the olney button toggles on and off.
  const fBtn = document.getElementById('rOlneyBtn');
  const rBtn = document.getElementById('relOlneyBtn');
  if (fBtn) fBtn.classList.toggle('is-inactive', !R);
  if (rBtn) rBtn.classList.toggle('is-inactive', !R);
  if (R) _renderOlneyInto(R);
  // (Solar/Spirit/Astral + displacement now shown on the popup card only)
}

// Relationship meta: Richmond's Solar/Spirit/Astral values and displacement
// for the combined card. Used by the relationship view only.
function _fillFinderMeta(idx, R, valsId, dispId) {
  const valsEl = document.getElementById(valsId);
  if (valsEl) valsEl.innerHTML = R
    ? `Solar ${R.solar}&nbsp;·&nbsp;Spirit ${R.spirit}&nbsp;·&nbsp;Astral ${R.astral}`
    : '';
  const dEl = document.getElementById(dispId);
  if (dEl) {
    if (idx >= 52) { dEl.innerHTML = ''; }   // Joker — outside the spreads
    else {
      const dI = slDisplaces(idx), bI = slDisplacedBy(idx);
      if (dI === idx)      dEl.innerHTML = 'Fixed · keeps its seat in Spirit and Life';
      else if (dI === bI)  dEl.innerHTML = `Semi-fixed · trades seats with ${_ccCardToken(dI)}`;
      else                 dEl.innerHTML = `Displaces ${_ccCardToken(dI)} · displaced by ${_ccCardToken(bI)}`;
    }
  }
}

// Build Richmond's reading + Grand Spread into the inline #rOlneyPanel.
// Order: values, then his planet-by-planet delineation, then the Grand Spread.
function _renderOlneyInto(R) {
  let html = '';

  // Planet-by-planet delineation (top).
  if (R.planets) {
    const oc = CARDS[_olneyIdx];
    html += '<div class="olney-delin">';
    // Page header in the style of his book: running title, then the card face
    // itself, then its Solar / Spirit / Astral values (all centred), above the
    // planet-by-planet delineation.
    html += '<div class="olney-bookhead">' +
      '<div class="olney-booktitle">The Mystic Test Book</div>' +
      '<div class="olney-headrow">' +
        (oc ? `<div class="olney-cardface spread-card ${oc.suit}">${spreadCardPips(oc)}</div>` : '') +
        '<dl class="olney-vals">' +
          `<div><dt>Solar Value</dt><dd>${R.solar}</dd></div>` +
          `<div><dt>Spirit Value</dt><dd>${R.spirit}</dd></div>` +
          `<div><dt>Astral Number</dt><dd>${R.astral}</dd></div>` +
        '</dl>' +
      '</div>' +
    '</div>';
    for (const pl of _OLNEY_PLANETS) {
      if (R.planets[pl]) html += `<p class="olney-pl"><b>${pl}</b>${R.planets[pl]}</p>`;
    }
    html += '</div>';
  }

  // Grand Spread (below the delineation).
  html += '<div class="olney-spread">';
  if (R.spread) {
    const sp = R.spread;
    html += '<div class="olney-plate">';
    html += '<div class="olney-platehead">';
    html += _OLNEY_MAST;
    // Header band: the Grand-Spread / Quadrated-to-Time labels + Future/Past
    // flank the three sun cards (the middle card is this card itself).
    html += '<div class="olney-head">' +
      '<div class="olney-hside left"><div class="olney-hlabel">Grand Spread,<br>Solar.</div><div class="olney-horn">— o —</div><div class="olney-hfp">Future.</div></div>' +
      '<div class="olney-sun">' +
        sp.sun.map((t, i) => _olneyCellHTML(t, i === 1 ? 'olney-focus' : '')).join('') +
      '</div>' +
      '<div class="olney-hside right"><div class="olney-hlabel">Quadrated to<br>Time.</div><div class="olney-horn">— o —</div><div class="olney-hfp">Past.</div></div>' +
      '</div>';
    html += '</div>';   // .olney-platehead
    html += '<div class="olney-grid">';
    for (const pl of _OLNEY_PLANETS) {
      const row = (sp.lines && sp.lines[pl]) || [];
      html += '<div class="olney-row">' +
        row.map(t => _olneyCellHTML(t)).join('') +
        '</div>';
    }
    html += '</div>';
    html += '<div class="olney-spreadname">Independent Solar Spread</div>';
    html += '</div>';  // .olney-plate
  } else {
    html += '<div class="olney-note">Richmond\'s Grand Spread for this card hasn\'t been transcribed yet — coming soon.</div>';
  }
  html += '</div>';

  document.getElementById('rOlneyPanel').innerHTML = html;
}

// (Was: toggleFinderCollapse — the chevron next to Share. Retired since the
// About / Essence chip-row pattern already provides the "compact at rest"
// state by leaving both tabs closed.)
function toggleRelCollapse() {
  const res = document.getElementById('relResult');
  const btn = document.getElementById('relCollapse');
  if (!res) return;
  const willCollapse = !res.classList.contains('collapsed');
  res.classList.toggle('collapsed', willCollapse);
  if (btn) {
    btn.setAttribute('aria-expanded', String(!willCollapse));
    btn.setAttribute('aria-label', willCollapse ? 'Expand relationship details' : 'Minimise relationship details');
    btn.title = willCollapse ? 'Expand' : 'Minimise';
  }
}
// (The About/Essence chip-tab toggle was retired — the reading shows by default
// and the minimise chevron collapses it; Suit + Numerology moved to #elements.)

// Navigate prev/next card in the Olney popup — skips cards without Richmond data.
function olneyNavCard(dir) {
  if (_olneyIdx < 0) return;
  let next = _olneyIdx;
  for (let i = 0; i < 52; i++) {
    next = (next + dir + 52) % 52;          // wrap within the 52-card deck
    const c = CARDS[next];
    const R = window.RICHMOND && window.RICHMOND[`${c.rank}_${c.suit}`];
    if (R) {
      _updateOlneyTarget(next);
      // Scroll the Olney panel back to the top for the new card
      const inner = document.querySelector('.olney-book-inner');
      if (inner) inner.scrollTop = 0;
      return;
    }
  }
}

// Open the Olney 1893 popup. The panel was rendered eagerly in
// _updateOlneyTarget so the book opens instantly.
function openOlneyPopup() {
  const ov = document.getElementById('olneyOverlay');
  if (!ov) return;
  ov.hidden = false;
  // Force a paint before adding .open so the keyframe animation runs from frame 0
  // even if the overlay was just unhidden.
  void ov.offsetWidth;
  ov.classList.remove('closing');
  ov.classList.add('open');
}

function closeOlneyPopup() {
  const ov = document.getElementById('olneyOverlay');
  if (!ov || !ov.classList.contains('open')) return;
  const book = document.getElementById('olneyBook');
  ov.classList.add('closing');
  const done = () => {
    ov.classList.remove('open', 'closing');
    ov.hidden = true;
  };
  // Fall back to a timer if animationend doesn't fire (reduced motion strips the animation).
  let fired = false;
  const onEnd = () => { if (fired) return; fired = true; done(); };
  book.addEventListener('animationend', onEnd, { once: true });
  setTimeout(onEnd, 500);
}

// Click on the dark backdrop closes; clicks on the book itself stay inside it.
document.getElementById('olneyOverlay').addEventListener('click', function(e) {
  if (e.target === this) closeOlneyPopup();
});

// Mobile swipe gestures: up = close, left/right = navigate cards.
// Only fires when .olney-book-inner didn't scroll across the touch — so a
// normal swipe-up while reading scrolls the page (browser default).
(function olneySwipe() {
  const book  = document.getElementById('olneyBook');
  const inner = document.querySelector('.olney-book-inner');
  if (!book || !inner) return;
  let startX = 0, startY = 0, startScroll = 0;
  book.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    startScroll = inner.scrollTop;
  }, { passive: true });
  book.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    const dScroll = inner.scrollTop - startScroll;
    // Swipe up to close (existing)
    if (-dy > 60 && dScroll === 0 && Math.abs(dx) < Math.abs(dy)) { closeOlneyPopup(); return; }
    // Swipe left/right to navigate (horizontal must dominate vertical)
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      olneyNavCard(dx < 0 ? 1 : -1);   // swipe left = next, right = prev
    }
  }, { passive: true });
})();

// Escape closes; arrow keys navigate.
document.addEventListener('keydown', e => {
  if (!document.getElementById('olneyOverlay').classList.contains('open')) return;
  if (e.key === 'Escape') { closeOlneyPopup(); return; }
  if (e.key === 'ArrowLeft')  { olneyNavCard(-1); e.preventDefault(); }
  if (e.key === 'ArrowRight') { olneyNavCard(1);  e.preventDefault(); }
});

function copyFinderLink(btn) {
  const url = finderURL();
  if (!url) return;
  const done = () => {
    const prev = btn.innerHTML;
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"/></svg>';
    btn.classList.add('copied');
    btn.disabled = true;
    setTimeout(() => { btn.innerHTML = prev; btn.classList.remove('copied'); btn.disabled = false; }, 1400);
  };
  const legacy = () => {
    const ta = document.createElement('textarea');
    ta.value = url;
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch(e) {}
    document.body.removeChild(ta);
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(done, () => { legacy(); done(); });
  } else {
    legacy(); done();
  }
}

// Clear a stale shared-card hash whenever the finder is changed by hand
['fMonth', 'fDay', 'relMonth2', 'relDay2'].forEach(id =>
  document.getElementById(id).addEventListener('change', () => {
    if (!_restoringHash && location.hash) {
      history.replaceState(null, '', location.pathname + location.search);
    }
  }));

// Restore a shared lookup from the URL hash (runs once, after all init above)
(function restoreFinderHash() {
  const h = location.hash.replace(/^#/, '');
  if (!/(^|&)(b|c)=/.test(h)) return;
  const params = {};
  h.split('&').forEach(p => {
    const i = p.indexOf('=');
    if (i > 0) params[p.slice(0, i)] = p.slice(i + 1);
  });

  // #c=CODE — card-identity profile (no date). Mirrors loadCardInFinder.
  if (params.c) {
    const idx = _cardIdxFromCode(decodeURIComponent(params.c));
    if (idx < 0) return;
    _restoringHash = true;
    _ccardIdx = idx;            // loadCardInFinder reads from the compare-popup pointer
    loadCardInFinder();
    _restoringHash = false;
    return;
  }

  const parse = s => {
    const m = /^(\d{1,2})\.(\d{1,2})$/.exec(s || '');
    if (!m) return null;
    const d = +m[1], mo = +m[2];
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return { d, m: mo };
  };
  const p1 = parse(params.b);
  if (!p1) return;
  const p2 = params.b2 ? parse(params.b2) : null;
  if (params.b2 && !p2) return;
  _restoringHash = true;
  if (p2 && !secondVisible) toggleSecond();
  const set = (mid, did, p) => {
    const M = document.getElementById(mid), D = document.getElementById(did);
    M.value = String(p.m);
    M.dispatchEvent(new Event('change'));
    D.value = String(p.d);
    D.dispatchEvent(new Event('change'));
  };
  set('fMonth', 'fDay', p1);
  if (p2) set('relMonth2', 'relDay2', p2);
  _restoringHash = false;
})();

// ── Astrology tool (lazy-loaded) ─────────────────────────────────
var _astroReady = false;   // true once astronomy.js + astro-lite.js are loaded
var _astroExtras = false;  // Joker toggle state (show Moon/Pluto/nodes/Chiron)
var _astroChart = null;    // last computed personality chart
var _astroDesign = null;   // last computed design chart
var _astroCards = null;    // planet → card index map
var _astroHouses = null;  // whole-sign house cusps (when lat/lon available)
var _astroT = null;       // Astronomy.MakeTime for the last draw (for ayanamsa)
var _astroZodiac = 'tropical'; // 'tropical' | 'lahiri' (sidereal)

function _initAstroPanel() {
  // Populate day/month selects
  var ds = document.getElementById('aDay');
  var ms = document.getElementById('aMonth');
  if (!ds.options.length || ds.options.length <= 1) {
    ds.innerHTML = '<option value="">Day</option>';
    for (var d = 1; d <= 31; d++) ds.add(new Option(d, d));
  }
  if (!ms.options.length || ms.options.length <= 1) {
    ms.innerHTML = '<option value="">Month</option>';
    var MN = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    MN.forEach(function (n, i) { ms.add(new Option(n, i + 1)); });
  }
  // Populate timezone datalist
  try {
    var zones = Intl.supportedValuesOf('timeZone');
    var dl = document.getElementById('aTzList');
    if (dl && !dl.childElementCount) {
      zones.forEach(function (z) {
        var opt = document.createElement('option');
        opt.value = z;
        dl.appendChild(opt);
      });
    }
  } catch (e) {}
  // Pre-fill from the finder if a birthday is already set
  var fm = document.getElementById('fMonth');
  var fd = document.getElementById('fDay');
  if (fm && fm.value) document.getElementById('aMonth').value = fm.value;
  if (fd && fd.value) document.getElementById('aDay').value = fd.value;
}

function _loadAstroScripts() {
  if (_astroReady) return Promise.resolve();
  return new Promise(function (resolve, reject) {
    // Load astronomy.js first (the engine), then astro-lite.js, then ichingdata + linedata
    var scripts = ['js/astronomy.js', 'js/astro-lite.js', 'js/ichingdata.js', 'js/linedata.js', 'js/tzcoords.js'];
    var loaded = 0;
    // Check which are already loaded
    scripts = scripts.filter(function (src) {
      return !document.querySelector('script[src="' + src + '"]');
    });
    if (!scripts.length) { _astroReady = true; resolve(); return; }
    function next() {
      if (!scripts.length) { _astroReady = true; resolve(); return; }
      var s = document.createElement('script');
      s.src = scripts.shift();
      s.onload = function () { next(); };
      s.onerror = function () { reject(new Error('Failed to load ' + s.src)); };
      document.head.appendChild(s);
    }
    next();
  });
}

function astroLiteDraw() {
  var day   = parseInt(document.getElementById('aDay').value);
  var month = parseInt(document.getElementById('aMonth').value);
  var year  = parseInt(document.getElementById('aYear').value);
  var time  = document.getElementById('aTime').value || '12:00';
  var place = document.getElementById('aPlace').value.trim();
  if (!day || !month || !year) return;
  var hm = time.split(':');
  var hour = parseInt(hm[0]) || 12, min = parseInt(hm[1]) || 0;

  // Show loading, hide result
  document.getElementById('astroLoading').style.display = '';
  document.getElementById('astroResult').style.display  = 'none';

  _loadAstroScripts().then(function () {
    var A = window.AstroLite;
    if (!A) { document.getElementById('astroLoading').textContent = 'Error loading engine.'; return; }

    // Resolve timezone offset
    var offMin = 0, lonDeg = 0, latDeg = 0;
    if (place) {
      // Try IANA timezone
      try {
        var tz = place;
        // Try matching via tzcoords if available
        if (window.TZ_COORDS) {
          var lower = place.toLowerCase();
          var match = null;
          for (var k in window.TZ_COORDS) {
            if (k.toLowerCase() === lower || k.toLowerCase().indexOf(lower) >= 0) {
              match = k; break;
            }
          }
          if (match) {
            tz = match;
            latDeg = window.TZ_COORDS[match][0];
            lonDeg = window.TZ_COORDS[match][1];
          }
        }
        var testDate = new Date(Date.UTC(year, month - 1, day, hour, min));
        offMin = A.zoneOffsetMin(tz, testDate);
      } catch (e) {
        // If timezone resolution fails, use browser's guess
        offMin = -(new Date().getTimezoneOffset());
      }
    } else {
      offMin = -(new Date().getTimezoneOffset());
    }

    // Build UTC date
    var utcMs = Date.UTC(year, month - 1, day, hour, min) - offMin * 60000;
    var utcDate = new Date(utcMs);
    var t = Astronomy.MakeTime(utcDate);
    _astroT = t;

    // Compute charts
    _astroChart  = A.computeChart(utcDate);
    var dt = A.findDesignTime(t);
    _astroDesign = A.computeChart(dt.date);

    // Houses (Whole Sign — needs lat/lon)
    _astroHouses = (latDeg || lonDeg) ? A.computeHousesWhole(t, latDeg, lonDeg) : null;

    // Planet → card mapping via Life Script (same logic as astrology.html)
    _astroCards = {};

    // Solar time strip (centered, time-only) + full birth card centered below.
    // When a birthplace is given we can compute true local solar noon, so we
    // pull the birth card from the solar-date; without a place, we fall back
    // to the civil date and just say so in the strip.
    var bc, bci;
    if (lonDeg) {
      var sm = A.solarMidnights(t, lonDeg);
      var solarFrac = (t.ut - sm.prev.ut) / (sm.next.ut - sm.prev.ut);
      var noonLocal = A.localDateParts(sm.noon.date.getTime() + offMin * 60000);
      document.getElementById('aSolarStrip').innerHTML =
        'Solar time at birth <b>' + A.fmtHMS(solarFrac) + '</b>';
      bc = A.birthCard(noonLocal.m, noonLocal.d);
    } else {
      document.getElementById('aSolarStrip').textContent =
        'Enter a birthplace to see solar time.';
      bc = A.birthCard(month, day);
    }
    document.getElementById('aSolarStrip').style.display = '';

    // Render the full birth card (centered, beneath the solar time)
    bci = (typeof CARDS !== 'undefined') ? CARDS.indexOf(bc) : -1;
    if (bci < 0 && bc.suit === 'joker') bci = (typeof CARDS !== 'undefined') ? CARDS.length - 1 : -1;
    var bcEl = document.getElementById('aBirthCard');
    if (bcEl) {
      var clickAttr = (bci >= 0) ? ' onclick="openCompareCard(' + bci + ')" title="Open card profile"' : '';
      bcEl.innerHTML =
        '<div class="spread-card ' + bc.suit + '"' + clickAttr + '>' +
          (typeof spreadCardPips === 'function' ? spreadCardPips(bc) : '') +
        '</div>' +
        '<div class="astro-bc-name">' + bc.name + '</div>';
    }

    // Keep the (now-static) More toggle's pressed state in sync with _astroExtras
    var mb = document.getElementById('aMoreBtn');
    if (mb) mb.setAttribute('aria-pressed', _astroExtras ? 'true' : 'false');

    // Build planet → card map from Life Script (from the birth card we just resolved)
    if (bc && bc.suit !== 'joker' && typeof LIFE_SCRIPTS !== 'undefined') {
      var lsKey = bc.rank + '_' + bc.suit;
      var ls = LIFE_SCRIPTS[lsKey];
      if (ls) {
        for (var j = 0; j < 7; j++) {
          var cc = lsParseCard(ls[j]);
          _astroCards[SPREAD_PLANETS[j]] = CARDS.findIndex(function (x) { return x.rank === cc.rank && x.suit === cc.suit; });
        }
      }
    }

    // Render table
    _renderAstroTable();

    // Show result, hide loading
    document.getElementById('astroLoading').style.display = 'none';
    document.getElementById('astroResult').style.display  = '';
  }).catch(function (err) {
    document.getElementById('astroLoading').textContent = 'Error: ' + err.message;
  });
}

function _renderAstroTable() {
  var A = window.AstroLite;
  if (!A || !_astroChart) return;
  // Pick zodiac: tropical → equal 30° signs, no shift; sidereal → equal signs
  // but shift each planet lon by −ayanamsa. (13 True Sky retired — see
  // dev/retired-code/truesky-13.md to reinstate.)
  var ay = (_astroZodiac === 'lahiri' && _astroT) ? A.ayanamsa(_astroZodiac, _astroT) : 0;
  var sectors = A.tropicalSectors();
  var shift = function (lon) { return ((lon - ay) % 360 + 360) % 360; };

  var notExtra = function (p) { return A.EXTRA_BODIES.indexOf(p.name) === -1; };
  var pRows = _astroExtras ? _astroChart.slice()  : _astroChart.filter(notExtra);
  var dRows = _astroExtras ? _astroDesign.slice() : _astroDesign.filter(notExtra);
  // Earth joins extras
  if (_astroExtras) {
    pRows.splice(1, 0, { name: 'Earth', glyph: '⊕', lon: (_astroChart[0].lon + 180) % 360, retro: false });
    dRows.splice(1, 0, { name: 'Earth', glyph: '⊕', lon: (_astroDesign[0].lon + 180) % 360 });
  }

  var cards = _astroCards || {};
  var showHouse = !!_astroHouses;
  var head = '<thead><tr>' +
    '<th>Body</th><th>Mind</th><th>Planet</th>' +
    '<th>Sign</th>' +
    (showHouse ? '<th class="al-house">House</th>' : '') +
    '<th class="al-card-col">Card</th></tr></thead>';

  var body = pRows.map(function (p, i) {
    // Sign uses the active zodiac's sectors + shifted lon. Body/Mind gates
    // ride the same shift in sidereal (the 64-gate mandala is equal-spaced
    // like signs, so the ayanamsa offset applies cleanly). Houses are
    // Whole-Sign and so zodiac-invariant — the Asc and planets shift
    // together, the relative house number is unchanged across modes.
    var pPos = A.posIn(sectors, shift(p.lon));
    var dPos = A.posIn(sectors, shift(dRows[i].lon));
    var pg = A.gateOf(shift(p.lon)), dg = A.gateOf(shift(dRows[i].lon));
    // Card cell
    var cardTd;
    var ci = cards[p.name];
    if (ci != null && ci >= 0 && typeof CARDS !== 'undefined') {
      var c = CARDS[ci];
      cardTd = '<td class="al-card-col"><button type="button" class="al-cardchip ' + c.suit +
        '" title="Open card profile" onclick="openCompareCard(' + ci + ')">' + c.rank + c.sym + '</button></td>';
    } else {
      cardTd = '<td class="al-card-col"><span class="al-nocard">·</span></td>';
    }
    var houseTd = showHouse ? '<td class="al-house">' + A.houseOf(p.lon, _astroHouses.cusps) + '</td>' : '';
    return '<tr>' +
      '<td class="al-gate al-gate-body" role="button" tabindex="0" title="Read hexagram" data-gate="' + dg.gate + '" data-line="' + dg.line + '" data-label="Body" onclick="astroOpenHex(' + dg.gate + ',' + dg.line + ',\'Body\')">' +
        A.hexFigSVG(A.KW_TO_VAL[dg.gate], 0.4) + ' ' + dg.gate + '.' + dg.line + '</td>' +
      '<td class="al-gate al-gate-mind" role="button" tabindex="0" title="Read hexagram" data-gate="' + pg.gate + '" data-line="' + pg.line + '" data-label="Mind" onclick="astroOpenHex(' + pg.gate + ',' + pg.line + ',\'Mind\')">' +
        A.hexFigSVG(A.KW_TO_VAL[pg.gate], 0.4) + ' ' + pg.gate + '.' + pg.line + '</td>' +
      '<td class="al-planet"><span class="al-glyph">' + p.glyph + '</span>' + p.name + '</td>' +
      '<td class="al-sign">' + pPos.glyph + ' ' +
        '<span class="al-sign-full">' + pPos.name + '</span>' +
        '<span class="al-sign-short">' + pPos.name.slice(0, 3) + '</span>' +
        (p.retro ? '<span class="al-retro">℞</span>' : '') + '</td>' +
      houseTd + cardTd +
    '</tr>';
  }).join('');
  document.getElementById('aPlTable').innerHTML = head + '<tbody>' + body + '</tbody>';
}

function astroLiteToggleExtras() {
  _astroExtras = !_astroExtras;
  var btn = document.getElementById('aMoreBtn');
  if (btn) {
    btn.setAttribute('aria-expanded', _astroExtras ? 'true' : 'false');
    btn.setAttribute('aria-label', _astroExtras ? 'Show fewer planets' : 'Show more planets');
    btn.title = _astroExtras ? 'Show less' : 'Show more';
  }
  _renderAstroTable();
}

// Zodiac selector: 'tropical' | 'lahiri' (sidereal). Tropical anchors signs
// to the seasons; sidereal subtracts the ayanamsa so signs line up with the
// stars (~24°), the Vedic / Jyotish tradition. (13 True Sky retired 2026-06-26
// — code preserved in dev/retired-code/truesky-13.md.)
function astroLiteSetZodiac(mode) {
  _astroZodiac = mode;
  ['tropical', 'lahiri'].forEach(function (m) {
    var b = document.getElementById('aZod-' + m);
    if (b) b.setAttribute('aria-pressed', m === mode ? 'true' : 'false');
  });
  if (_astroChart) _renderAstroTable();
}

// Hexagram popup for astrology tool — reuses the existing hx-overlay if present,
// otherwise builds a simple one. ichingdata.js + linedata.js must be loaded.
function astroOpenHex(kw, line, label) {
  var d = (typeof HEX_DATA !== 'undefined') ? HEX_DATA[kw] : null;
  if (!d) return;
  var A = window.AstroLite;
  if (!A) return;
  // Check if the page already has a hex overlay (from iching or astrology)
  var overlay = document.getElementById('astroHxOverlay');
  if (!overlay) {
    // Build a minimal hex popup overlay
    var html = '<div class="hx-overlay" id="astroHxOverlay">' +
      '<div class="hx-popup">' +
        '<button class="hx-close" type="button" aria-label="Close" onclick="closeAstroHex()">✕</button>' +
        '<div class="hx-header">' +
          '<div class="hx-fig-svg" id="aHxFig"></div>' +
          '<div class="hx-meta">' +
            '<div class="hx-kw" id="aHxKw"></div>' +
            '<div class="hx-name" id="aHxName"></div>' +
          '</div>' +
        '</div>' +
        '<div class="hx-body" id="aHxBody"></div>' +
      '</div>' +
    '</div>';
    document.body.insertAdjacentHTML('beforeend', html);
    overlay = document.getElementById('astroHxOverlay');
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeAstroHex();
    });
  }
  document.getElementById('aHxFig').innerHTML = A.hexFigSVG(A.KW_TO_VAL[kw], 1.1);
  document.getElementById('aHxKw').textContent = (label ? label + ' · ' : '') + 'Gate ' + kw + ' · Line ' + line;
  document.getElementById('aHxName').textContent = d.name;
  // Build body: hexagram meaning + specific line
  var bodyHtml = '<div class="hx-reading">';
  if (d.text) bodyHtml += d.text.split('\n\n').map(function (p) { return '<p>' + p + '</p>'; }).join('');
  if (typeof LINE_DATA !== 'undefined' && LINE_DATA[kw] && LINE_DATA[kw][line]) {
    var ld = LINE_DATA[kw][line];
    bodyHtml += '<div class="hx-line-head">Line ' + line + '</div>';
    bodyHtml += ld.split('\n\n').map(function (p) { return '<p>' + p + '</p>'; }).join('');
  }
  bodyHtml += '</div>';
  document.getElementById('aHxBody').innerHTML = bodyHtml;
  overlay.classList.add('open');
}
function closeAstroHex() {
  var overlay = document.getElementById('astroHxOverlay');
  if (overlay) overlay.classList.remove('open');
}
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    var overlay = document.getElementById('astroHxOverlay');
    if (overlay && overlay.classList.contains('open')) { closeAstroHex(); e.stopPropagation(); }
  }
});

// ── Card Elements row: four suits (always) + thirteen numbers (revealed on
// suit-select). Click a glyph to drop its reading; ‹ › / ← → / swipe navigate.
// Sources: SUIT_MEANINGS + NUMEROLOGY (from cardsdata.js). Replaces the old
// Essence tab; a loaded card lights its suit (+ rank) here via elementsHighlight.
(function () {
  var SUIT_ORDER = ['hearts', 'clubs', 'diamonds', 'spades'];
  var RANK_ORDER = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  // Render all four suits as uniform SVG so they're the same size — the deck's
  // ♥/♦ are unicode and ♠/♣ are SVG, which render at different sizes. ♠/♣ reuse
  // the deck's own pip paths; ♥/♦ get matching paths filling the same 100×100 box.
  var EL_SUIT_SVG = {
    '♥': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,94 C14,66 5,50 5,32 C5,16 16,7 29,7 C40,7 47,15 50,25 C53,15 60,7 71,7 C84,7 95,16 95,32 C95,50 86,66 50,94 Z"/></svg>',
    '♦': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,6 L80,50 L50,94 L20,50 Z"/></svg>'
  };
  function elSuitGlyph(sym) {
    if ((sym === '♠' || sym === '♣') && window.SUIT_PIP_SVG && window.SUIT_PIP_SVG[sym]) return window.SUIT_PIP_SVG[sym];
    return EL_SUIT_SVG[sym] || sym;
  }
  var mode = null;   // 'suit' | 'num' | null
  var idx  = -1;     // index within the active list

  // Reading-voice state ('modern' | 'olney'), shared with the planet controller
  // via window.elementsVoice and persisted per-browser. Toggled by the .el-voice
  // segmented control (wired in init → initVoiceToggle).
  var voice = 'modern';
  try { if (localStorage.getItem('cardsoflife_voice') === 'olney') voice = 'olney'; } catch (e) {}
  window.elementsVoice = function () { return voice; };

  function $(id) { return document.getElementById(id); }
  function els() {
    return {
      pop: $('elements'), detail: $('elDetail'),
      suitRow: $('suitRow'), numRow: $('numRow'), planetRow: $('planetRow'),
      fig: $('elFig'), name: $('elName'), kws: $('elKws'),
      text: $('elText'), keynote: $('elKeynote')
    };
  }

  function renderRows() {
    var e = els(); if (!e.suitRow) return;
    if (typeof SUIT_MEANINGS !== 'undefined') {
      e.suitRow.innerHTML = SUIT_ORDER.map(function (s, i) {
        var m = SUIT_MEANINGS[s];
        var glyph = elSuitGlyph(m.sym);
        return '<button type="button" class="el-suit" role="listitem" data-suit="' + s +
          '" data-i="' + i + '" aria-label="' + m.label + '">' + glyph + '</button>';
      }).join('');
    }
    if (typeof NUMEROLOGY !== 'undefined') {
      e.numRow.innerHTML = RANK_ORDER.map(function (r, i) {
        return '<button type="button" class="el-num" role="listitem" data-rank="' + r +
          '" data-i="' + i + '" aria-label="' + (NUMEROLOGY[r] ? NUMEROLOGY[r].label : r) + '">' + r + '</button>';
      }).join('');
    }
  }

  function fill(kind, key) {
    var e = els();
    var d = kind === 'suit' ? SUIT_MEANINGS[key] : NUMEROLOGY[key];
    if (!d) return;
    // Olney voice: swap the reading (glyph + name stay from the base entry).
    var src = (voice === 'olney' && d.olney) ? d.olney : d;
    e.fig.textContent = kind === 'suit' ? d.sym : d.n;
    e.name.textContent = d.label;
    e.kws.innerHTML = (src.keywords || []).map(function (k) { return '<span class="kw-tag">' + k + '</span>'; }).join('');
    e.text.innerHTML = String(src.text || '').split('\n\n').map(function (p) { return '<p>' + p + '</p>'; }).join('');
    e.keynote.textContent = src.keynote || '';
  }

  function mark() {
    var e = els();
    e.suitRow.querySelectorAll('.el-suit').forEach(function (b) {
      b.classList.toggle('sel', mode === 'suit' && +b.dataset.i === idx);
    });
    e.numRow.querySelectorAll('.el-num').forEach(function (b) {
      b.classList.toggle('sel', mode === 'num' && +b.dataset.i === idx);
    });
  }

  // Selecting a suit reveals BOTH the number row and the planet row (the
  // planets behave like the A–K numbers — hidden until a suit is chosen).
  function revealRows(on) {
    var e = els();
    e.numRow.hidden = !on;
    if (e.planetRow) e.planetRow.hidden = !on;
    // The Claude | Olney voice toggle rides with the revealed rows — hidden in
    // the suits-only resting state, shown once a suit is picked.
    var v = document.getElementById('elVoice'); if (v) v.hidden = !on;
  }

  function open(m, i) {
    var e = els();
    // Opening a suit/number closes any open planet panel (mutually exclusive).
    if (window.closePlanetPanel) window.closePlanetPanel();
    mode = m; idx = i;
    if (m === 'suit') { fill('suit', SUIT_ORDER[i]); revealRows(true); }
    else { fill('num', RANK_ORDER[i]); }
    e.pop.classList.add('el-open');
    mark();
  }

  // Close just the suit/number detail card, leaving the revealed rows in place.
  // Used when a planet opens — the planet panel becomes the visible detail but
  // the number + planet rows stay open so you can keep browsing.
  function closePanelOnly() {
    var e = els();
    mode = null; idx = -1;
    e.pop.classList.remove('el-open');
    mark();
  }
  // Full reset: close the detail card AND the planet panel, and hide the number
  // + planet rows back to the suits-only resting state.
  function collapse() {
    closePanelOnly();
    revealRows(false);
    if (window.closePlanetPanel) window.closePlanetPanel();
  }
  // Exposed so the planet expander can coordinate with this controller:
  //   • opening a planet keeps the rows open (closePanelOnly)
  //   • Escape / clicking the active glyph folds everything up (collapse)
  window.closeElementsDetail = closePanelOnly;
  window.collapseElements    = collapse;

  function nav(dir) {
    if (mode == null) return;
    var len = mode === 'suit' ? SUIT_ORDER.length : RANK_ORDER.length;
    open(mode, (idx + dir + len) % len);
  }

  // Move focus to the active glyph so the gold focus-ring follows the selection
  // as you cycle (mirrors the I Ching trigrams, which focus each cell in turn).
  function focusActive() {
    var e = els();
    var btn = (mode === 'suit')
      ? e.suitRow.querySelector('.el-suit[data-i="' + idx + '"]')
      : e.numRow.querySelector('.el-num[data-i="' + idx + '"]');
    if (btn) btn.focus({ preventScroll: true });
  }

  // Public: light the loaded card's suit (and rank) in the rows, without opening.
  window.elementsHighlight = function (rank, suit) {
    var e = els(); if (!e.suitRow) return;
    e.suitRow.querySelectorAll('.el-suit').forEach(function (b) { b.classList.toggle('lit', b.dataset.suit === suit); });
    e.numRow.querySelectorAll('.el-num').forEach(function (b) { b.classList.toggle('lit', b.dataset.rank === rank); });
  };

  // Wire the Modern | Olney·1893 segmented control: reflect the persisted voice,
  // and on change persist + re-render whatever detail is open (suit / number via
  // fill, planet via window.rerenderPlanet).
  function initVoiceToggle() {
    var group = document.querySelector('#elements .el-voice');
    if (!group) return;
    function reflect() {
      group.querySelectorAll('.el-voice-btn').forEach(function (b) {
        var on = b.dataset.voice === voice;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', on ? 'true' : 'false');
      });
    }
    reflect();
    group.addEventListener('click', function (ev) {
      var btn = ev.target.closest('.el-voice-btn');
      if (!btn || btn.dataset.voice === voice) return;
      voice = btn.dataset.voice;
      try { localStorage.setItem('cardsoflife_voice', voice); } catch (e) {}
      reflect();
      if (mode === 'suit') fill('suit', SUIT_ORDER[idx]);
      else if (mode === 'num') fill('num', RANK_ORDER[idx]);
      if (window.rerenderPlanet) window.rerenderPlanet();
    });
  }

  function init() {
    var e = els(); if (!e.suitRow) return;
    renderRows();
    initVoiceToggle();
    e.suitRow.addEventListener('click', function (ev) {
      var b = ev.target.closest('.el-suit'); if (!b) return;
      var i = +b.dataset.i;
      if (mode === 'suit' && idx === i) collapse(); else open('suit', i);
    });
    e.numRow.addEventListener('click', function (ev) {
      var b = ev.target.closest('.el-num'); if (!b) return;
      var i = +b.dataset.i;
      if (mode === 'num' && idx === i) collapse(); else open('num', i);
    });
    var prev = e.pop.querySelector('.el-prev'), next = e.pop.querySelector('.el-next');
    if (prev) prev.addEventListener('click', function () { nav(-1); });
    if (next) next.addEventListener('click', function () { nav(1); });
    document.addEventListener('keydown', function (ev) {
      if (mode == null) return;
      var t = ev.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
        ev.preventDefault();
        nav(ev.key === 'ArrowRight' ? 1 : -1);
        focusActive();
      } else if (ev.key === 'Escape') { collapse(); }
    });
    var tx = null;
    e.detail.addEventListener('touchstart', function (ev) { tx = ev.touches[0].clientX; }, { passive: true });
    e.detail.addEventListener('touchend', function (ev) {
      if (tx == null) return;
      var dx = ev.changedTouches[0].clientX - tx; tx = null;
      if (Math.abs(dx) > 45) nav(dx < 0 ? 1 : -1);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

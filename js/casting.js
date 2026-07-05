/* ── The swirling field — cards held in a magnetic vortex ──────────
   Each card is a double-sided flipper: a front (a real court face or a
   generated pip card) and a patterned gold back. The field is a FORCE-
   HELD vortex around the coin menu: cards ride shell-grouped orbits
   with Kepler-style speeds (inner visibly faster), integrated per-frame
   so surges and mode changes flow smoothly. A clear central radius
   keeps the menu legible. Honours reduced-motion (static frame).

   The chosen motion character is COUNTER-ROTATION (TUNE.MODE = 3):
   alternating shells spin in opposite directions, like layered magnetic
   rings. (1 = steady single-direction vortex and 2 = vortex with surges
   remain selectable via TUNE.MODE for future tuning.)

   The field is MAGNETIC (pass 2): cards near the pointer are pushed
   aside and recover their orbits when it passes; the whole field leans
   subtly toward the pointer (parallax); a touch sends a travelling
   ripple through the deck. All of it off under reduced-motion. */

/* The site's four suit designs as inline SVG — MIRROR of window.SUIT_PIP_SVG
   in js/cardsdata.js (the homepage doesn't load that file, so this copy is
   kept in sync by hand). Used both by the mini card faces in the field and
   engraved into the Cards of Life coin. Fill is currentColor. */
var CASTING_SUIT_SVG = {
  '♠': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,8 C30,26 6,50 6,66 C6,82 22,90 36,82 C42,78 47,74 50,70 L40,95 L60,95 L50,70 C53,74 58,78 64,82 C78,90 94,82 94,66 C94,50 70,26 50,8 Z"/></svg>',
  '♥': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,86 C45,79 15,58 15,34 C15,22 24,14 35,14 C43,14 48,20 50,27 C52,20 57,14 65,14 C76,14 85,22 85,34 C85,58 55,79 50,86 Z"/></svg>',
  '♦': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,6 L86,50 L50,94 L14,50 Z"/></svg>',
  '♣': '<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="30" r="20"/><circle cx="27" cy="58" r="20"/><circle cx="73" cy="58" r="20"/><path d="M44,46 L40,96 L60,96 L56,46 Z"/></svg>'
};

(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var field = document.querySelector('.field');
  if (!field) return;

  /* ── TUNING (hand-tune here) ────────────────────────────────────── */
  var TUNE = {
    COUNT_DESKTOP: 48,      // cards in the field (≤52 so no duplicates)
    COUNT_MOBILE:  24,
    R_MIN: 230,             // clear central radius (px, desktop) — sacred
    R_SPAN: 380,            // R_MIN..R_MIN+R_SPAN = the orbit band
    SHELLS: 3,              // concentric shells (grouped tilt/character)
    W_INNER: 0.30,          // rad/s at the innermost radius (orbital pace)
    W_FALLOFF: 1.15,        // Kepler-ish exponent — higher = inner faster
    EASE_RATE: 1.2,         // how quickly speed/tilt ease to a new mode (1/s)
    BREATHE: 0.025,         // radius breathing amplitude (fraction of r)
    SURGE_RATE: 0.045,      // surges per second per card (mode 2)
    SURGE_LEN: 2.6,         // surge duration (s)
    SURGE_BOOST: 1.9,       // speed multiplier at surge peak
    SWOOP_SHARE: 0.12,      // fraction of cards allowed to swoop near camera
    SWOOP_Z: 260,           // extra z toward camera at surge peak (px)
    FLIP_SPEED_MULT: 1.25,  // pace-up of the existing flip behaviours
    MODE: 3,                // 1 steady vortex · 2 + surges · 3 counter-rotation (chosen)
    /* magnetic pointer response */
    MAG_RADIUS: 190,        // px — how close the pointer must be to disturb a card
    MAG_PUSH: 85,           // px — displacement at zero distance (falls off to 0)
    MAG_ATTACK: 7,          // how fast a card yields to the pointer (1/s)
    MAG_RELEASE: 2.5,       // how fast it settles back into orbit (1/s)
    PARALLAX_DEG: 5,        // max field lean toward the pointer (deg)
    /* touch ripple (a tap pulses a wavefront through the deck) */
    RIPPLE_SPEED: 520,      // px/s — wavefront speed
    RIPPLE_BAND: 95,        // px — wavefront thickness
    RIPPLE_PUSH: 90,        // px — push at the wavefront
    RIPPLE_LIFE: 1.15,      // s — ripple lifetime
    CAST_PULSE: 1.6,        // ripple strength multiplier when a coin is cast
    /* menu legibility — cards crossing the coin/caption band recede + fade */
    BAND_HALF_W: 380,       // px — half-width of the protected menu band
    BAND_TOP: -130,         // px — band top (relative to field centre)
    BAND_BOT: 195,          // px — band bottom (captions sit below the coins)
    BAND_DIM: 0.3,          // opacity multiplier while crossing the band
    BAND_RECEDE: 90,        // px — z push away from camera while crossing
    /* depth cues */
    DEPTH_SCALE: 0.2,       // extra scale range front-to-back (0 = flat)
    DEPTH_SAT: 0.25,        // extra colour saturation on near cards
    /* card body language */
    BANK_VEL: 0.055,        // deg per px/s — cards bank into their travel
    BANK_MAG: 0.05,         // deg per px of magnetic shove — torque lean
    BANK_MAX: 12,           // deg — banking clamp
    EDGE_DIM: 0.22,         // brightness dip when a card turns edge-on
    DISTURB_PUSH: 45,       // px of push that flips a disturbed card over
    DISTURB_DUR: 0.7,       // s — the disturbed flip
    DISTURB_COOLDOWN: 2.5   // s — min gap between one card's disturb flips
  };

  var SUITS = [
    { n: 'spades',   g: '♠' },
    { n: 'hearts',   g: '♥' },
    { n: 'diamonds', g: '♦' },
    { n: 'clubs',    g: '♣' }
  ];
  var COURTS = ['J', 'Q', 'K'];
  var NUMS = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
  var SUIT_KEY = { spades: 'S', hearts: 'H', diamonds: 'D', clubs: 'C' };

  // Pip layouts [x%, y%, inverted] — mirror of PIP_LAYOUTS in js/cardsdata.js,
  // kept in sync so the mini cards lay their pips out exactly like the real deck.
  var PIP_LAYOUTS = {
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
  // All four suits use the site's pip-svg glyphs (shared CASTING_SUIT_SVG above).
  var PIP_SVG = CASTING_SUIT_SVG;
  function pipMark(sym) { return PIP_SVG[sym] || sym; }

  // Build a real .spread-card face: serif corners + (court art + suit pip) OR the
  // correct per-rank pip layout for number cards. Mirrors spreadCardPips().
  function faceHTML(card) {
    var rank = card.rank, suit = card.suit, mark = pipMark(card.sym);
    var corners =
      '<div class="card-corner card-tl"><span class="cc-rank">' + rank + '</span></div>' +
      '<div class="card-corner card-br"><span class="cc-rank">' + rank + '</span></div>';
    if (rank === 'J' || rank === 'Q' || rank === 'K') {
      return corners +
        '<span class="court-pip" style="left:31%;top:23.1%">' + mark + '</span>' +
        '<span class="court-pip" style="left:69%;top:76.9%;transform:translate(-50%,-50%) rotate(180deg)">' + mark + '</span>' +
        '<img class="court-art" src="assets/cards/' + rank + SUIT_KEY[suit] + '.webp" alt="" loading="lazy">';
    }
    var aceLarge = (rank === 'A' && suit === 'spades');
    var pips = (PIP_LAYOUTS[rank] || []).map(function (p) {
      return '<span class="pip' + (p[2] ? ' inv' : '') + (aceLarge ? ' ace' : '') +
             '" style="left:' + p[0] + '%;top:' + p[1] + '%">' + mark + '</span>';
    }).join('');
    return corners + '<div class="card-pips">' + pips + '</div>';
  }

  // A full 52-card deck, shuffled, so each mini gets a DISTINCT card — with the
  // field count (≤48) below 52, no two of the same card are ever shown at once.
  var ALL_RANKS = NUMS.concat(COURTS);   // A–10, J, Q, K
  function buildDeck() {
    var d = [];
    for (var si = 0; si < SUITS.length; si++)
      for (var ri = 0; ri < ALL_RANKS.length; ri++)
        d.push({ rank: ALL_RANKS[ri], suit: SUITS[si].n, sym: SUITS[si].g });
    for (var i = d.length - 1; i > 0; i--) {   // Fisher–Yates shuffle
      var j = (Math.random() * (i + 1)) | 0, t = d[i]; d[i] = d[j]; d[j] = t;
    }
    return d;
  }

  function buildFront(card) {
    var side = document.createElement('div');
    side.className = 'side front';
    var sc = document.createElement('div');
    sc.className = 'spread-card ' + card.suit;
    sc.innerHTML = faceHTML(card);
    side.appendChild(sc);
    return side;
  }
  function buildBack() {
    var side = document.createElement('div');
    side.className = 'side card-back';
    var coin = document.createElement('span');
    coin.className = 'cb-coin';
    side.appendChild(coin);
    return side;
  }

  // Per-shell orbit planes: yaw offsets + flatness per shell. Every card in a
  // shell shares a plane so the field reads as nested rings; in the chosen
  // counter-rotation character (TUNE.MODE 3) direction alternates per shell.
  function shellYaw(shell)  { return [0.0, 0.9, 1.8][shell % 3]; }
  function shellFlat(shell) { return [0.58, 0.66, 0.74][shell % 3]; }
  function shellDir(shell)  { return TUNE.MODE === 3 ? (shell % 2 ? -1 : 1) : 1; }

  var small = window.innerWidth < 640;
  var COUNT = small ? TUNE.COUNT_MOBILE : TUNE.COUNT_DESKTOP;
  var sUnit = small ? 0.66 : 1;

  var deck = buildDeck();
  var minis = [];
  for (var i = 0; i < COUNT; i++) {
    var el = document.createElement('div');
    el.className = 'mini';
    var flip = document.createElement('div');
    flip.className = 'flip';
    var front = buildFront(deck[i % deck.length]), back = buildBack();
    flip.appendChild(front); flip.appendChild(back);
    el.appendChild(flip);
    field.appendChild(el);

    // Concentric orbit: clear centre out to the edges; shell = radius band.
    var frac = i / COUNT;                                   // even radial spread
    var r = (TUNE.R_MIN + (frac + (Math.random() - 0.5) * 0.12) * TUNE.R_SPAN) * sUnit;
    r = Math.max(TUNE.R_MIN * sUnit, r);
    var shell = Math.min(TUNE.SHELLS - 1, Math.floor(frac * TUNE.SHELLS));
    // Kepler-ish base angular speed — inner shells visibly faster.
    var wBase = TUNE.W_INNER / Math.pow(r / (TUNE.R_MIN * sUnit), TUNE.W_FALLOFF);
    minis.push({
      el: el, flip: flip, front: front, back: back,
      r: r, shell: shell, wBase: wBase,
      a: Math.random() * Math.PI * 2,          // integrated orbit angle
      w: 0,                                    // eased angular speed (rad/s)
      yaw: shellYaw(shell),                    // eased toward the mode's plane
      flat: shellFlat(shell),
      yawJit: (Math.random() - 0.5) * 0.25,    // small per-card plane jitter
      rz: (110 + r * 0.28) * sUnit,            // depth radius grows with r
      bob: 4 + Math.random() * 7,
      bobPhase: Math.random() * Math.PI * 2,
      tiltZ: (Math.random() * 2 - 1) * 9,
      breathe: Math.random() * Math.PI * 2,
      // Surges (mode 2): each card owns a Poisson-ish clock; swoopers also
      // push toward the camera at the surge peak.
      surgeAt: -1, surgeMul: 1, glow: 0,
      mx: 0, my: 0,                            // eased magnetic displacement
      dim: 1, dimT: 1,                         // eased menu-band legibility fade
      flickAt: -1, disturbT: -9,               // one-shot disturbed flip state
      swooper: Math.random() < TUNE.SWOOP_SHARE,
      // Three behaviours: ~52% gentle rockers (tilt only, face toward you); ~24%
      // full axis flips (front→back→front); ~24% "flicks" — a quick corner-to-
      // corner diagonal flip with a little spin, then a long rest (a magician's
      // flourish), so faces dominate but real flips + flicks still punctuate it.
      type: (Math.random() < 0.52 ? 'rocker' : Math.random() < 0.5 ? 'flip' : 'flick'),
      // ~50% of cards rest showing their gold back (the rest show a face), so the
      // field reads like a real shuffled spread instead of all faces forward.
      restBase: (Math.random() < 0.5 ? 180 : 0),
      amp: 22 + Math.random() * 30,
      flipSpeed: (0.6 + Math.random() * 0.7) * TUNE.FLIP_SPEED_MULT,
      flipRate: (0.10 + Math.random() * 0.13) * TUNE.FLIP_SPEED_MULT,
      flickRate: (0.05 + Math.random() * 0.06) * TUNE.FLIP_SPEED_MULT,
      diag: (Math.random() < 0.5 ? 1 : -1) * (45 + Math.random() * 10),
      flickSpin: 16 + Math.random() * 26,
      dir: Math.random() < 0.5 ? -1 : 1,       // flip direction (not orbit)
      flipPhase: Math.random(),
      flipX: Math.random() < 0.22,
      scale: 0.72 + Math.random() * 0.72
    });
  }

  // Smooth pulse 0→1→0 over [0,1] (sine bump).
  function bump(f) { return f <= 0 || f >= 1 ? 0 : Math.sin(f * Math.PI); }

  // Advance one card by dt seconds (integration + easing), then paint it at t.
  function step(o, dt, t) {
    // Ease angular speed toward the current mode's target (smooth mode swaps —
    // a counter-rotating shell visibly slows, pauses, and reverses).
    var target = o.wBase * shellDir(o.shell);
    o.w += (target - o.w) * Math.min(1, dt * TUNE.EASE_RATE);
    // Ease the orbit plane toward the shell's home too (mode tweaks tilt).
    var yawT = shellYaw(o.shell) + o.yawJit;
    o.yaw += (yawT - o.yaw) * Math.min(1, dt * TUNE.EASE_RATE * 0.6);

    // Surges — TUNE.MODE 2 only. Random ignition; smooth envelope on speed + glow.
    var sMul = 1, sBump = 0;
    if (TUNE.MODE === 2) {
      if (o.surgeAt < 0 && Math.random() < TUNE.SURGE_RATE * dt) o.surgeAt = t;
      if (o.surgeAt >= 0) {
        var f = (t - o.surgeAt) / TUNE.SURGE_LEN;
        if (f >= 1) { o.surgeAt = -1; }
        else { sBump = bump(f); sMul = 1 + (TUNE.SURGE_BOOST - 1) * sBump; }
      }
    }
    o.glow += (sBump - o.glow) * Math.min(1, dt * 4);

    o.a += o.w * sMul * dt;

    // ── Magnetic response — the pointer pushes nearby cards aside ──
    // Target displacement is a radial push away from the pointer with a
    // squared falloff; the card yields quickly (ATTACK) and settles back
    // into its orbit more slowly (RELEASE), so the recovery reads as the
    // field re-capturing the card. Touch ripples add a travelling push.
    var tx = 0, ty = 0;
    var breathe = 1 + Math.sin(t * 0.23 + o.breathe) * TUNE.BREATHE;
    var ox = Math.cos(o.a) * o.r * breathe;                     // orbital screen pos
    var oy = Math.sin(o.a) * o.r * breathe * o.flat;
    if (pointer.on) {
      var dx = ox - pointer.x, dy = oy - pointer.y;
      var d = Math.hypot(dx, dy);
      if (d < TUNE.MAG_RADIUS * sUnit) {
        var fall = 1 - d / (TUNE.MAG_RADIUS * sUnit);
        var push = TUNE.MAG_PUSH * sUnit * fall * fall;
        if (d > 0.5) { tx += dx / d * push; ty += dy / d * push; }
      }
    }
    for (var ri = 0; ri < ripples.length; ri++) {
      var rp = ripples[ri];
      var age = t - rp.t0;
      var rdx = ox - rp.x, rdy = oy - rp.y;
      var rd = Math.hypot(rdx, rdy);
      var front = age * TUNE.RIPPLE_SPEED * sUnit;              // wavefront radius
      var band = Math.max(0, 1 - Math.abs(rd - front) / (TUNE.RIPPLE_BAND * sUnit));
      var fade = 1 - age / TUNE.RIPPLE_LIFE;
      if (band > 0 && fade > 0 && rd > 0.5) {
        var rpush = TUNE.RIPPLE_PUSH * sUnit * band * band * fade * (rp.mult || 1);
        tx += rdx / rd * rpush; ty += rdy / rd * rpush;
      }
    }
    // A hard enough shove flips the card clean over (once, with a cooldown) —
    // brushing the pointer through the deck, or the cast pulse rolling past,
    // turns cards as it goes.
    if (Math.hypot(tx, ty) > TUNE.DISTURB_PUSH * sUnit &&
        t - o.disturbT > TUNE.DISTURB_COOLDOWN) {
      o.disturbT = t; o.flickAt = t;
    }

    var rate = (Math.abs(tx) + Math.abs(ty) > Math.abs(o.mx) + Math.abs(o.my))
      ? TUNE.MAG_ATTACK : TUNE.MAG_RELEASE;
    o.mx += (tx - o.mx) * Math.min(1, dt * rate);
    o.my += (ty - o.my) * Math.min(1, dt * rate);

    // Ease the menu-band fade toward the target paint() computed last frame.
    o.dim += (o.dimT - o.dim) * Math.min(1, dt * 3);

    paint(o, t);
  }

  function paint(o, t) {
    var breathe = 1 + Math.sin(t * 0.23 + o.breathe) * TUNE.BREATHE;
    var r = o.r * breathe;
    var x = Math.cos(o.a) * r + o.mx;
    var y = Math.sin(o.a) * r * o.flat + Math.sin(t * 1.4 + o.bobPhase) * o.bob + o.my;
    var z = Math.sin(o.a + o.yaw) * o.rz;
    if (o.swooper && o.glow > 0.01) z += o.glow * TUNE.SWOOP_Z * sUnit;   // swoop toward camera
    var depth = (Math.sin(o.a + o.yaw) * o.rz + o.rz) / (2 * o.rz);       // 0 far … 1 near

    // Menu legibility — while a card crosses the coin/caption band it fades
    // and recedes so the menu always reads. Target set here; eased in step()
    // (the static reduced-motion frame applies the target directly).
    var inBand = Math.abs(x) < TUNE.BAND_HALF_W * sUnit &&
                 y > TUNE.BAND_TOP * sUnit && y < TUNE.BAND_BOT * sUnit;
    o.dimT = inBand ? TUNE.BAND_DIM : 1;
    var dim = reduce ? o.dimT : o.dim;
    z -= (1 - dim) * TUNE.BAND_RECEDE;

    // ── Own-axis flip — TRUE 3D rotation. The .side faces carry
    // backface-visibility:hidden and .back2 is pre-rotated 180° (css), so a
    // real rotateY/rotate3d shows the right face with genuine perspective
    // foreshortening — no squeeze, no opacity swapping.
    var fdeg, flourish = 0, isFlick = (o.type === 'flick');
    if (o.type === 'rocker') {
      fdeg = o.restBase + o.amp * Math.sin(t * o.flipSpeed + o.flipPhase * 6.2832);
    } else if (o.type === 'flip') {
      var cyc = ((t * o.flipRate + o.flipPhase) % 1 + 1) % 1;
      var f = cyc < 0.4 ? cyc / 0.4 : 1;
      fdeg = o.restBase + (f * f * (3 - 2 * f)) * 360 * o.dir;
    } else { // flick — a quick corner-to-corner diagonal flip, then a long rest
      var cyc2 = ((t * o.flickRate + o.flipPhase) % 1 + 1) % 1;
      var f2 = cyc2 < 0.22 ? cyc2 / 0.22 : 1;          // the flip happens in the first ~22% of the cycle
      var e2 = f2 * f2 * (3 - 2 * f2);                 // smoothstep ease
      fdeg = o.restBase + e2 * 360 * o.dir;
      flourish = Math.sin(f2 * Math.PI) * o.flickSpin * o.dir;   // a little spin, peaks mid-flick
    }
    // One-shot disturbed flip (pointer brush / cast pulse) rides on top of
    // whatever the card's behaviour is doing — a clean extra 360 with a
    // small flourish, then it settles back into its cycle.
    if (o.flickAt >= 0) {
      var df = (t - o.flickAt) / TUNE.DISTURB_DUR;
      if (df >= 1) { o.flickAt = -1; }
      else {
        var de = df * df * (3 - 2 * df);
        fdeg += de * 360 * o.dir;
        flourish += Math.sin(df * Math.PI) * 14 * o.dir;
      }
    }
    var cos = Math.cos(fdeg * 0.0174533);
    if (isFlick) {
      // Real rotation about the card's corner-to-corner axis (in-plane).
      var rad = o.diag * 0.0174533;
      o.flip.style.transform = 'rotate(' + flourish.toFixed(1) + 'deg) rotate3d(' +
        Math.cos(rad).toFixed(3) + ',' + Math.sin(rad).toFixed(3) + ',0,' + fdeg.toFixed(1) + 'deg)';
    } else {
      o.flip.style.transform = (flourish ? 'rotate(' + flourish.toFixed(1) + 'deg) ' : '') +
        (o.flipX ? 'rotateX(' : 'rotateY(') + fdeg.toFixed(1) + 'deg)';
    }

    // ── Body language — cards BANK into their direction of travel (like a
    // leaf carried on a current) and lean away from a magnetic shove.
    var vx = -Math.sin(o.a) * r * o.w;                 // orbital velocity (px/s)
    var vy = Math.cos(o.a) * r * o.flat * o.w;
    function clampBank(v) { return Math.max(-TUNE.BANK_MAX, Math.min(TUNE.BANK_MAX, v)); }
    var bankY = clampBank(vx * TUNE.BANK_VEL + o.mx * TUNE.BANK_MAG);
    var bankX = clampBank(-(vy * TUNE.BANK_VEL + o.my * TUNE.BANK_MAG));

    var rotZ = Math.sin(t * 0.6 + o.bobPhase) * o.tiltZ;
    var scale = o.scale * (1 + (o.swooper ? o.glow * 0.22 : o.glow * 0.06))
              * (1 - TUNE.DEPTH_SCALE / 2 + depth * TUNE.DEPTH_SCALE);    // near = larger
    o.el.style.transform =
      'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,' + z.toFixed(1) + 'px)' +
      ' rotateX(' + bankX.toFixed(1) + 'deg) rotateY(' + bankY.toFixed(1) + 'deg)' +
      ' scale(' + scale.toFixed(3) + ') rotateZ(' + rotZ.toFixed(1) + 'deg)';

    o.el.style.opacity = ((0.4 + depth * 0.55 + o.glow * 0.1) * dim).toFixed(3);
    // Edge-on cards catch less light — the |cos| dip sells the turn.
    var edge = 1 - TUNE.EDGE_DIM * (1 - Math.abs(cos));
    o.el.style.filter = 'brightness(' + ((0.7 + depth * 0.38 + o.glow * 0.25) * edge).toFixed(2) +
      ') saturate(' + (0.9 + depth * TUNE.DEPTH_SAT).toFixed(2) + ')';
    o.el.style.zIndex = String(100 + Math.round(z));
  }

  if (reduce) { minis.forEach(function (o) { paint(o, 0); }); return; }

  // ── The pointer is part of the field ─────────────────────────────
  // Coordinates are relative to the field origin (50% x, 47% y of the
  // viewport — where the .mini slots anchor). Mouse sets a live magnet;
  // leaving the window releases it. Touch: the finger magnetises while
  // down, and each tap fires a travelling ripple through the deck.
  var pointer = { x: 0, y: 0, on: false };
  var ripples = [];
  function toField(cx, cy) {
    return { x: cx - window.innerWidth * 0.5, y: cy - window.innerHeight * 0.47 };
  }
  window.addEventListener('pointermove', function (e) {
    var p = toField(e.clientX, e.clientY);
    pointer.x = p.x; pointer.y = p.y; pointer.on = true;
  }, { passive: true });
  window.addEventListener('pointerdown', function (e) {
    var p = toField(e.clientX, e.clientY);
    pointer.x = p.x; pointer.y = p.y; pointer.on = true;
    if (e.pointerType !== 'mouse') {                     // touch/pen tap → ripple
      ripples.push({ x: p.x, y: p.y, t0: performance.now() / 1000 });
      if (ripples.length > 4) ripples.shift();
    }
  }, { passive: true });
  window.addEventListener('pointerup', function (e) {
    if (e.pointerType !== 'mouse') pointer.on = false;   // finger lifted — release
  }, { passive: true });
  document.addEventListener('pointerleave', function () { pointer.on = false; });
  window.addEventListener('blur', function () { pointer.on = false; });

  // Casting a coin disturbs the deck — a strong pulse from the centre out.
  // Called by the coin-cast handler below; absent under reduced-motion (this
  // IIFE returns early there), so callers must guard.
  window.CASTING_PULSE = function () {
    ripples.push({ x: 0, y: 0, t0: performance.now() / 1000, mult: TUNE.CAST_PULSE });
    if (ripples.length > 4) ripples.shift();
  };

  var last = null, raf, parX = 0, parY = 0;
  function frame(ts) {
    if (last === null) last = ts;
    var dt = Math.min(0.05, (ts - last) / 1000);   // clamp: tab restores, jank
    last = ts;
    var t = ts / 1000;
    // Cull spent ripples once, per frame.
    var now = t;
    for (var k = ripples.length - 1; k >= 0; k--)
      if (now - ripples[k].t0 > TUNE.RIPPLE_LIFE) ripples.splice(k, 1);
    // Field parallax — the whole vortex leans gently toward the pointer.
    var pxT = pointer.on ? (pointer.x / (window.innerWidth * 0.5)) : 0;
    var pyT = pointer.on ? (pointer.y / (window.innerHeight * 0.47)) : 0;
    parX += ((-pyT * TUNE.PARALLAX_DEG) - parX) * Math.min(1, dt * 2);
    parY += ((pxT * TUNE.PARALLAX_DEG) - parY) * Math.min(1, dt * 2);
    field.style.transform = 'rotateX(' + parX.toFixed(2) + 'deg) rotateY(' + parY.toFixed(2) + 'deg)';
    for (var i = 0; i < minis.length; i++) step(minis[i], dt, t);
    raf = requestAnimationFrame(frame);
  }
  raf = requestAnimationFrame(frame);
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { if (raf) cancelAnimationFrame(raf); raf = null; }
    else if (!raf) { last = null; raf = requestAnimationFrame(frame); }
  });
})();

/* ── Cast a coin to open its page ──────────────────────────────────
   Selecting a coin tosses + flips it (flashing the yin-yang reverse),
   then navigates once the cast completes. Honours reduced-motion (the
   link follows immediately) and keeps keyboard activation working. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // engrave the four suits into the Cards of Life (great) coin's gold field
  // only, using the site's own suit designs (CASTING_SUIT_SVG) so they match
  // the deck. Fill is currentColor → the engraved dark-gold set on .coin .face .s.
  document.querySelectorAll('.coins .coinwrap.great .coin .face.front').forEach(function (face) {
    [['t','♠'],['r','♥'],['b','♣'],['l','♦']].forEach(function (s) {
      var el = document.createElement('span');
      el.className = 's ' + s[0];
      el.setAttribute('aria-hidden', 'true');
      el.innerHTML = CASTING_SUIT_SVG[s[1]] || s[1];
      face.appendChild(el);
    });
  });
  // Each coin is a real link — cast it, then navigate once the toss lands.
  document.querySelectorAll('.coinwrap').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var href = a.getAttribute('href');
      if (!href || reduce) return;                 // let the browser navigate normally
      e.preventDefault();
      if (a.classList.contains('casting')) return;
      a.classList.add('casting');
      // the cast disturbs the deck — one pulse outward through the field
      if (window.CASTING_PULSE) window.CASTING_PULSE();
      // warm the destination while the coin spins, so it's ready as the cast lands
      var pf = document.createElement('link'); pf.rel = 'prefetch'; pf.href = href;
      document.head.appendChild(pf);
      var coin = a.querySelector('.coin');
      var done = false;
      function go() { if (done) return; done = true; window.location.href = href; }
      coin.addEventListener('animationend', go, { once: true });
      setTimeout(go, 560);                           // fail-safe if animationend is missed
    });
  });
  // Clear any stuck cast state on load AND on bfcache restore (back/forward) —
  // otherwise a coin you cast keeps its .casting class when the page is restored
  // from the back-forward cache, and the click handler's casting-guard makes that
  // same coin unclickable. Runs on every pageshow (initial + persisted restore).
  window.addEventListener('pageshow', function () {
    document.querySelectorAll('.coinwrap.casting').forEach(function (a) {
      a.classList.remove('casting');
    });
  });
})();

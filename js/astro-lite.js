// ── Astro-lite — mysticscards.space ─────────────────────────────────
// Lightweight astrology calculation core shared by cardsoflife (lazy)
// and astrology (eager). Depends on astronomy.js (Astronomy Engine)
// being loaded first. No rendering / DOM — pure data functions.
// Keep in sync with the inline copies in astrology.html.
(function () {
  'use strict';

  var SIGNS = [
    ['Aries','♈'], ['Taurus','♉'], ['Gemini','♊'], ['Cancer','♋'],
    ['Leo','♌'], ['Virgo','♍'], ['Libra','♎'], ['Scorpio','♏'],
    ['Sagittarius','♐'], ['Capricorn','♑'], ['Aquarius','♒'], ['Pisces','♓']
  ];

  var ASTRO_PLANETS = [
    ['Sun','☉'], ['Moon','☽'], ['Mercury','☿'], ['Venus','♀'], ['Mars','♂'],
    ['Jupiter','♃'], ['Saturn','♄'], ['Uranus','♅'], ['Neptune','♆'], ['Pluto','♇']
  ];

  var EXTRA_BODIES = ['Moon', 'Pluto', 'North Node', 'South Node', 'Chiron'];

  var MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

  // ── Gate order (I Ching hexagram mapping by ecliptic longitude) ──
  var GATE_ORDER = [41,19,13,49,30,55,37,63,22,36,25,17,21,51,42,3,27,24,2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,1,43,14,34,9,5,26,11,10,58,38,54,61,60];
  var VAL_TO_KW = [2, 23, 8, 20, 16, 35, 45, 12, 15, 52, 39, 53, 62, 56, 31, 33,
                   7, 4, 29, 59, 40, 64, 47, 6, 46, 18, 48, 57, 32, 50, 28, 44,
                   24, 27, 3, 42, 51, 21, 17, 25, 36, 22, 63, 37, 55, 30, 49, 13,
                   19, 41, 60, 61, 54, 38, 58, 10, 11, 26, 5, 9, 34, 14, 43, 1];
  var KW_TO_VAL = [];
  VAL_TO_KW.forEach(function (kw, v) { KW_TO_VAL[kw] = v; });

  // ── Ephemeris wrapper ───────────────────────────────────────
  function lonAt(name, t) {
    return Astronomy.Ecliptic(Astronomy.GeoVector(Astronomy.Body[name], t, true)).elon;
  }

  // ── Mean lunar node ─────────────────────────────────────────
  function meanNode(t) {
    var T = t.tt / 36525;
    return (((125.04452 - 1934.136261 * T + 0.0020708 * T * T + T * T * T / 450000) % 360) + 360) % 360;
  }

  // ── Chiron (2060 osculating elements, two-body Kepler) ──────
  var CHIRON = { a: 13.68426760850124, e: 0.3797656311453571, iDeg: 6.930574468846328,
    omDeg: 209.2961258613147, wDeg: 339.2878326589729, M0: 216.7198966018106,
    nDeg: 0.0194702593257484, epoch: 2461200.5 };
  var _D2R = Math.PI / 180, _EPS0 = 23.4392911 * _D2R;
  function _chironHelioEcl(jdTT) {
    var M = (CHIRON.M0 + CHIRON.nDeg * (jdTT - CHIRON.epoch)) * _D2R;
    var E = M;
    for (var k = 0; k < 60; k++) {
      var dE = (E - CHIRON.e * Math.sin(E) - M) / (1 - CHIRON.e * Math.cos(E));
      E -= dE; if (Math.abs(dE) < 1e-13) break;
    }
    var nu = 2 * Math.atan2(Math.sqrt(1 + CHIRON.e) * Math.sin(E / 2), Math.sqrt(1 - CHIRON.e) * Math.cos(E / 2));
    var r = CHIRON.a * (1 - CHIRON.e * Math.cos(E));
    var om = CHIRON.omDeg * _D2R, w = CHIRON.wDeg * _D2R, inc = CHIRON.iDeg * _D2R, u = w + nu;
    return {
      x: r * (Math.cos(om) * Math.cos(u) - Math.sin(om) * Math.sin(u) * Math.cos(inc)),
      y: r * (Math.sin(om) * Math.cos(u) + Math.cos(om) * Math.sin(u) * Math.cos(inc)),
      z: r * (Math.sin(u) * Math.sin(inc))
    };
  }
  function chironLon(t) {
    var jdTT = 2451545.0 + t.tt;
    var earth = Astronomy.HelioVector(Astronomy.Body.Earth, t);
    var ce = Math.cos(_EPS0), se = Math.sin(_EPS0), lt = 0, gx, gy, gz;
    for (var it = 0; it < 3; it++) {
      var h = _chironHelioEcl(jdTT - lt);
      var ex = h.x, ey = h.y * ce - h.z * se, ez = h.y * se + h.z * ce;
      gx = ex - earth.x; gy = ey - earth.y; gz = ez - earth.z;
      lt = Math.sqrt(gx * gx + gy * gy + gz * gz) * 0.0057755183;
    }
    var vec = (typeof Astronomy.Vector === 'function') ? new Astronomy.Vector(gx, gy, gz, t) : { x: gx, y: gy, z: gz, t: t };
    return Astronomy.Ecliptic(vec).elon;
  }

  // ── Compute full chart (planet longitudes + retrogrades) ────
  function computeChart(utcDate) {
    var t = Astronomy.MakeTime(utcDate);
    var chart = ASTRO_PLANETS.map(function (p) {
      var lon = lonAt(p[0], t);
      var retro = false;
      if (p[0] !== 'Sun' && p[0] !== 'Moon') {
        var d2 = lonAt(p[0], t.AddDays(0.5)) - lon;
        if (d2 > 180) d2 -= 360;
        if (d2 < -180) d2 += 360;
        retro = d2 < 0;
      }
      return { name: p[0], glyph: p[1], lon: lon, retro: retro };
    });
    var nn = meanNode(t);
    chart.push({ name: 'North Node', glyph: '☊', lon: nn, retro: false, noAspect: true });
    chart.push({ name: 'South Node', glyph: '☋', lon: (nn + 180) % 360, retro: false, noAspect: true });
    var chLon = chironLon(t);
    var chD = chironLon(t.AddDays(0.5)) - chLon;
    if (chD > 180) chD -= 360; if (chD < -180) chD += 360;
    chart.push({ name: 'Chiron', glyph: '⚷', lon: chLon, retro: chD < 0, noAspect: true });
    return chart;
  }

  // ── Design time (Sun 88° before birth position) ─────────────
  function findDesignTime(t) {
    var target = ((lonAt('Sun', t) - 88) % 360 + 360) % 360;
    var tt = t.AddDays(-88.5);
    for (var i = 0; i < 12; i++) {
      var diff = ((lonAt('Sun', tt) - target + 540) % 360) - 180;
      if (Math.abs(diff) < 1e-6) break;
      tt = tt.AddDays(-diff / 0.9856473);
    }
    return tt;
  }

  // ── Zodiac sectors (tropical) ───────────────────────────────
  function tropicalSectors() {
    return SIGNS.map(function (s, i) { return { start: i * 30, name: s[0], glyph: s[1] }; });
  }

  // Which sector holds longitude lon
  function posIn(sectors, lon) {
    var sec = sectors[sectors.length - 1];
    for (var i = 0; i < sectors.length; i++) {
      if (lon >= sectors[i].start) sec = sectors[i]; else break;
    }
    var within = ((lon - sec.start) % 360 + 360) % 360;
    var deg = Math.floor(within);
    var min = Math.round((within - deg) * 60);
    if (min === 60) { min = 0; deg++; }
    return { name: sec.name, glyph: sec.glyph, deg: deg, min: min };
  }

  // ── Sidereal zodiac ─────────────────────────────────────────
  // Sidereal longitude = tropical − ayanamsa. Anchored at J2000 and carried
  // by the IAU 2006 general precession rate; good to well under an arcminute
  // across 1700–2200, which is finer than the displayed degree+minute. To
  // render a sidereal chart: keep tropicalSectors() but pass a shifted lon
  // (((p.lon − ay) % 360 + 360) % 360) into posIn().
  var AYAN_J2000 = { lahiri: 23.85320, fagan: 24.73667 };
  var ZODIAC_NAME = { lahiri: 'Lahiri (Chitrapaksha)', fagan: 'Fagan-Bradley' };

  function ayanamsa(mode, t) {
    var T = t.tt / 36525; // Julian centuries TT since J2000
    return AYAN_J2000[mode] + (5028.796195 * T + 1.1054348 * T * T) / 3600;
  }

  // (13 True Sky retired 2026-06-26 — code preserved in dev/retired-code/truesky-13.md)

  // ── I Ching gate mapping ────────────────────────────────────
  function gateOf(lon) {
    var x = ((lon - 302) % 360 + 360) % 360;
    var idx = Math.floor(x / 5.625);
    var line = Math.min(6, Math.floor((x - idx * 5.625) / 0.9375) + 1);
    return { gate: GATE_ORDER[idx], line: line };
  }

  // ── Solar midnights (for solar time) ────────────────────────
  function solarMidnights(t, lonDeg) {
    var obs = new Astronomy.Observer(0, lonDeg, 0);
    var search = t.AddDays(-1.6);
    var prev = null, next = null;
    for (var i = 0; i < 5; i++) {
      var ev = Astronomy.SearchHourAngle(Astronomy.Body.Sun, obs, 12, search);
      if (ev.time.ut <= t.ut) { prev = ev.time; search = ev.time.AddDays(0.2); }
      else { next = ev.time; break; }
    }
    var noon = Astronomy.SearchHourAngle(Astronomy.Body.Sun, obs, 0, prev).time;
    return { prev: prev, next: next, noon: noon };
  }

  // ── Houses (Whole Sign — lite version) ───────────────────────
  var _DEG = Math.PI / 180;

  function meanObliquity(t) {
    var T = t.tt / 36525;
    return 23.439291111 - 0.013004167 * T - 1.6389e-7 * T * T + 5.0361e-7 * T * T * T;
  }

  function computeHousesWhole(t, latDeg, lonEastDeg) {
    var gast = Astronomy.SiderealTime(t);
    var ramc = (((gast + lonEastDeg / 15) * 15) % 360 + 360) % 360;
    var eps = meanObliquity(t);
    var rr = ramc * _DEG, er = eps * _DEG, lr = latDeg * _DEG;
    var asc = (Math.atan2(Math.cos(rr),
      -(Math.sin(rr) * Math.cos(er) + Math.tan(lr) * Math.sin(er))) / _DEG % 360 + 360) % 360;
    var base = Math.floor(asc / 30) * 30, cusps = [];
    for (var i = 0; i < 12; i++) cusps.push((base + i * 30) % 360);
    return { asc: asc, cusps: cusps };
  }

  function houseOf(lon, cusps) {
    for (var i = 0; i < 12; i++) {
      var a = cusps[i], b = cusps[(i + 1) % 12];
      var span = ((b - a) % 360 + 360) % 360 || 360;
      var d = ((lon - a) % 360 + 360) % 360;
      if (d < span) return i + 1;
    }
    return 1;
  }

  // ── Solar value → birth card ────────────────────────────────
  function birthCard(m, d) {
    var sv = 55 - (2 * m + d);
    if (sv >= 1 && sv <= 52 && typeof CARDS !== 'undefined') return CARDS[sv - 1];
    return { rank: '✦', suit: 'joker', sym: '✦', name: 'The Joker' };
  }

  // ── Small hexagram figure SVG ───────────────────────────────
  function hexFigSVG(val, size) {
    var lineH = 5 * size, gap = 4 * size, w = 36 * size, segW = 14 * size;
    var svgH = 6 * lineH + 5 * gap;
    var paths = [];
    for (var i = 0; i < 6; i++) {
      var bit = (val >> (5 - i)) & 1;
      var y = svgH - lineH - i * (lineH + gap);
      if (bit === 1) {
        paths.push('<rect x="0" y="' + y + '" width="' + w + '" height="' + lineH + '" rx="' + 1.5 * size + '" fill="var(--yang)"/>');
      } else {
        paths.push('<rect x="0" y="' + y + '" width="' + segW + '" height="' + lineH + '" rx="' + 1.5 * size + '" fill="var(--yang)"/>');
        paths.push('<rect x="' + (w - segW) + '" y="' + y + '" width="' + segW + '" height="' + lineH + '" rx="' + 1.5 * size + '" fill="var(--yang)"/>');
      }
    }
    return '<svg width="' + w + '" height="' + svgH + '" viewBox="0 0 ' + w + ' ' + svgH + '">' + paths.join('') + '</svg>';
  }

  // ── Formatting helpers ──────────────────────────────────────
  function fmtHMS(dayFrac) {
    var secs = Math.round(dayFrac * 86400);
    return String(Math.floor(secs / 3600)).padStart(2, '0') + ':' +
           String(Math.floor((secs % 3600) / 60)).padStart(2, '0') + ':' +
           String(secs % 60).padStart(2, '0');
  }
  function fmtClock(ms) {
    var dd = new Date(ms);
    return String(dd.getUTCHours()).padStart(2, '0') + ':' + String(dd.getUTCMinutes()).padStart(2, '0');
  }
  function localDateParts(ms) {
    var dd = new Date(ms);
    return { y: dd.getUTCFullYear(), m: dd.getUTCMonth() + 1, d: dd.getUTCDate() };
  }

  // ── Timezone offset from IANA name ──────────────────────────
  function zoneOffsetMin(tz, date) {
    var dtf = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hour12: false,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    var p = {};
    dtf.formatToParts(date).forEach(function (x) { p[x.type] = x.value; });
    return (Date.UTC(p.year, p.month - 1, p.day, p.hour % 24, p.minute, p.second) - date.getTime()) / 60000;
  }

  // ── Public API ──────────────────────────────────────────────
  window.AstroLite = {
    SIGNS: SIGNS,
    ASTRO_PLANETS: ASTRO_PLANETS,
    EXTRA_BODIES: EXTRA_BODIES,
    MONTHS: MONTHS,
    GATE_ORDER: GATE_ORDER,
    VAL_TO_KW: VAL_TO_KW,
    KW_TO_VAL: KW_TO_VAL,
    lonAt: lonAt,
    meanNode: meanNode,
    chironLon: chironLon,
    computeChart: computeChart,
    findDesignTime: findDesignTime,
    tropicalSectors: tropicalSectors,
    AYAN_J2000: AYAN_J2000,
    ZODIAC_NAME: ZODIAC_NAME,
    ayanamsa: ayanamsa,
    posIn: posIn,
    gateOf: gateOf,
    solarMidnights: solarMidnights,
    computeHousesWhole: computeHousesWhole,
    houseOf: houseOf,
    birthCard: birthCard,
    hexFigSVG: hexFigSVG,
    fmtHMS: fmtHMS,
    fmtClock: fmtClock,
    localDateParts: localDateParts,
    zoneOffsetMin: zoneOffsetMin
  };
})();

/*
 * dozenal.js — exact base-12 (dozenal) arithmetic core
 *
 * Every value is stored as an exact rational: a BigInt numerator over a
 * BigInt denominator. This means no floating-point error, ever. Parsing,
 * the four operations, and conversion between bases are all exact; the only
 * place approximation can occur is when an endlessly-repeating expansion is
 * printed, and even then we detect the repeat and mark it rather than guess.
 *
 * Digit symbols: 0-9, then A = ten, B = eleven (case-insensitive on input).
 */
(function (root) {
  "use strict";

  var DIGITS = "0123456789ABCDEF"; // index = digit value, up to base 16

  // ---- rational helpers ---------------------------------------------------

  function absBig(x) { return x < 0n ? -x : x; }

  function gcd(a, b) {
    a = absBig(a); b = absBig(b);
    while (b) { var t = a % b; a = b; b = t; }
    return a;
  }

  // Build a normalized rational: denominator > 0, gcd(n,d) = 1.
  function rat(n, d) {
    if (d === 0n) throw new Error("Division by zero");
    if (d < 0n) { n = -n; d = -d; }
    var g = gcd(n, d) || 1n;
    return { n: n / g, d: d / g };
  }

  // ---- parsing ------------------------------------------------------------

  function digitValue(ch) {
    var v = DIGITS.indexOf(ch.toUpperCase());
    return v;
  }

  // Parse a string in the given base (default 12) into a rational.
  function parse(str, base) {
    base = BigInt(base || 12);
    if (typeof str !== "string") throw new Error("parse expects a string");
    str = str.trim();
    if (str === "" || str === "-" || str === "+" || str === ".")
      throw new Error("Empty number");

    var sign = 1n;
    if (str[0] === "-") { sign = -1n; str = str.slice(1); }
    else if (str[0] === "+") { str = str.slice(1); }

    var parts = str.split(".");
    if (parts.length > 2) throw new Error("Too many radix points: " + str);
    var intPart = parts[0] || "";
    var fracPart = parts.length === 2 ? parts[1] : "";

    if (intPart === "" && fracPart === "") throw new Error("Empty number");

    var num = 0n;
    var i, dv;
    for (i = 0; i < intPart.length; i++) {
      dv = digitValue(intPart[i]);
      if (dv < 0 || BigInt(dv) >= base)
        throw new Error("Invalid digit '" + intPart[i] + "' for base " + base);
      num = num * base + BigInt(dv);
    }

    var den = 1n;
    for (i = 0; i < fracPart.length; i++) {
      dv = digitValue(fracPart[i]);
      if (dv < 0 || BigInt(dv) >= base)
        throw new Error("Invalid digit '" + fracPart[i] + "' for base " + base);
      num = num * base + BigInt(dv);
      den = den * base;
    }

    return rat(sign * num, den);
  }

  // ---- arithmetic ---------------------------------------------------------

  function add(a, b) { return rat(a.n * b.d + b.n * a.d, a.d * b.d); }
  function sub(a, b) { return rat(a.n * b.d - b.n * a.d, a.d * b.d); }
  function mul(a, b) { return rat(a.n * b.n, a.d * b.d); }
  function div(a, b) {
    if (b.n === 0n) throw new Error("Division by zero");
    return rat(a.n * b.d, a.d * b.n);
  }

  function isZero(a) { return a.n === 0n; }
  function equals(a, b) { return a.n === b.n && a.d === b.d; }
  function negate(a) { return { n: -a.n, d: a.d }; }

  // ---- formatting ---------------------------------------------------------

  // Convert a non-negative BigInt integer to a string in the given base.
  function intToBase(q, base) {
    if (q === 0n) return "0";
    var s = "";
    while (q > 0n) { s = DIGITS[Number(q % base)] + s; q = q / base; }
    return s;
  }

  /*
   * Render a rational in the given base.
   *   maxFracDigits — hard cap on fractional digits when an expansion neither
   *                   terminates nor repeats within the cap.
   * Repeating expansions are detected exactly and wrapped in parentheses,
   * e.g. 1/5 in base 12 -> "0.(2497)".
   */
  function format(a, base, maxFracDigits) {
    base = BigInt(base || 12);
    if (maxFracDigits == null) maxFracDigits = 24;

    var sign = a.n < 0n ? "-" : "";
    var n = absBig(a.n);
    var d = a.d;

    var intPart = n / d;
    var rem = n % d;

    var intStr = intToBase(intPart, base);
    if (rem === 0n) return sign + intStr;

    // Long division of rem/d in the target base, tracking remainders so a
    // repeating cycle can be identified the moment a remainder recurs.
    var seen = new Map();
    var digits = [];
    var repeatStart = -1;
    var truncated = false;

    while (rem !== 0n) {
      if (seen.has(rem.toString())) { repeatStart = seen.get(rem.toString()); break; }
      if (digits.length >= maxFracDigits) { truncated = true; break; }
      seen.set(rem.toString(), digits.length);
      rem = rem * base;
      digits.push(DIGITS[Number(rem / d)]);
      rem = rem % d;
    }

    var fracStr;
    if (repeatStart >= 0) {
      var nonRep = digits.slice(0, repeatStart).join("");
      var rep = digits.slice(repeatStart).join("");
      fracStr = nonRep + "(" + rep + ")";
    } else {
      fracStr = digits.join("") + (truncated ? "…" : "");
    }

    return sign + intStr + "." + fracStr;
  }

  function toBase12(a, maxFracDigits) { return format(a, 12, maxFracDigits); }
  function toBase10(a, maxFracDigits) { return format(a, 10, maxFracDigits); }

  var api = {
    rat: rat,
    parse: parse,
    add: add, sub: sub, mul: mul, div: div,
    negate: negate, isZero: isZero, equals: equals,
    format: format, toBase12: toBase12, toBase10: toBase10,
    DIGITS: DIGITS
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.Dozenal = api;
})(typeof self !== "undefined" ? self : this);

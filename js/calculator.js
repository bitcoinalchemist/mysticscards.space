(function () {
  "use strict";
  var D = window.Dozenal;
  var OPS = { add: D.add, sub: D.sub, mul: D.mul, div: D.div };
  var SYM = { add: "+", sub: "−", mul: "×", div: "÷" };

  var base = 12;
  var entry = "0";
  var acc = null;
  var pending = null;
  var waiting = false;
  var errored = false;

  var mainEl     = document.getElementById("calcMain");
  var mainTextEl = document.getElementById("calcMainText");
  var exprEl  = document.getElementById("expr");
  var convEl  = document.getElementById("conv");
  var conv2El = document.getElementById("conv2");
  var conv3El = document.getElementById("conv3");

  // Which digits are valid in each base
  var VALID = { 2: "01", 10: "0123456789", 12: "0123456789AB", 16: "0123456789ABCDEF" };
  // Conversion labels
  var LABELS = { 2: "bin", 10: "dec", 12: "doz", 16: "hex" };
  // For each base, the other 3 bases to show as conversions
  var CONV_BASES = { 2: [10, 12, 16], 10: [2, 12, 16], 12: [2, 10, 16], 16: [2, 10, 12] };

  function fmt(r, b) { return D.format(r, b || base); }

  // Scale the main display down until the value fits inside the fixed two-row
  // box (wrapping as needed), so the screen keeps a constant height no matter
  // how long the value gets — a full 128-bit binary number still fits.
  function fitMain() {
    mainEl.style.fontSize = "";                 // back to the CSS (responsive) size
    var size = parseFloat(getComputedStyle(mainEl).fontSize);
    var min = 11;
    while (mainTextEl.scrollHeight > mainEl.clientHeight && size > min) {
      size -= 1;
      mainEl.style.fontSize = size + "px";
    }
  }

  function shownRat() {
    if (waiting && acc !== null) return acc;
    try { return D.parse(entry, base); } catch (e) { return null; }
  }

  function render() {
    if (errored) {
      mainTextEl.textContent = "Error";
      mainEl.classList.add("error");
      fitMain();
      exprEl.innerHTML = "&nbsp;";
      convEl.innerHTML = "";
      conv2El.innerHTML = "";
      conv3El.innerHTML = "";
      highlightOp();
      return;
    }
    mainEl.classList.remove("error");
    mainTextEl.textContent = (waiting && acc !== null) ? fmt(acc) : entry;
    fitMain();

    if (acc !== null && pending !== null) {
      exprEl.textContent = fmt(acc) + " " + SYM[pending];
    } else {
      exprEl.innerHTML = "&nbsp;";
    }

    var r = shownRat();
    var cb = CONV_BASES[base];
    if (r) {
      try {
        convEl.innerHTML  = '<span>= </span>' + fmt(r, cb[0]) + ' <span>(' + LABELS[cb[0]] + ')</span>';
        conv2El.innerHTML = '<span>= </span>' + fmt(r, cb[1]) + ' <span>(' + LABELS[cb[1]] + ')</span>';
        conv3El.innerHTML = '<span>= </span>' + fmt(r, cb[2]) + ' <span>(' + LABELS[cb[2]] + ')</span>';
      } catch(e) {
        convEl.innerHTML = conv2El.innerHTML = conv3El.innerHTML = "";
      }
    } else {
      convEl.innerHTML = conv2El.innerHTML = conv3El.innerHTML = "";
    }
    highlightOp();
  }

  function highlightOp() {
    document.querySelectorAll(".op").forEach(function (b) {
      b.classList.toggle("active", !errored && pending && b.getAttribute("data-op") === pending && waiting);
    });
  }

  function clearAll() {
    entry = "0"; acc = null; pending = null; waiting = false; errored = false; render();
  }

  function digit(d) {
    // "." is always allowed (the radix point); other chars must be valid digits
    // in the current base.
    if (d !== "." && VALID[base].indexOf(d.toUpperCase()) < 0) return;
    if (errored) clearAll();
    if (waiting) {
      entry = (d === ".") ? "0." : d;
      waiting = false;
      if (pending === null) acc = null;
    } else if (d === ".") {
      if (entry.indexOf(".") < 0) entry += ".";
    } else if (entry === "0") {
      entry = d.toUpperCase();
    } else if (entry.replace('-', '').length < 36) {
      entry += d.toUpperCase();
    }
    render();
  }

  function op(o) {
    if (errored) return;
    try {
      if (!waiting) {
        acc = (pending === null) ? D.parse(entry, base)
                                 : OPS[pending](acc, D.parse(entry, base));
      }
      pending = o;
      waiting = true;
      render();
    } catch (e) { errored = true; render(); }
  }

  function equals() {
    if (errored || pending === null) return;
    try {
      var operand = waiting ? acc : D.parse(entry, base);
      acc = OPS[pending](acc, operand);
      pending = null;
      waiting = true;
      render();
    } catch (e) { errored = true; render(); }
  }

  function updateButtons() {
    var valid = VALID[base];
    // digits 0-9
    document.querySelectorAll("[data-d]").forEach(function (btn) {
      var d = btn.dataset.d;
      if (d === ".") { btn.disabled = false; return; }
      btn.disabled = valid.indexOf(d.toUpperCase()) < 0;
    });
    // C-F stay visible in every mode (disabled outside HEX by the loop above),
    // so the keypad height is fixed and never shifts when switching base.
    // disable A-B when not valid (keep visible so layout stays fixed)
    document.querySelectorAll(".digit-ab").forEach(function (btn) {
      btn.disabled = (base === 2 || base === 10);
    });
    // mode tabs
    document.querySelectorAll(".mode").forEach(function (m) {
      m.classList.toggle("active", +m.getAttribute("data-base") === base);
    });
  }

  function setBase(b) {
    if (b === base) return;
    var r = errored ? null : shownRat();
    base = b;
    pending = null;
    errored = false;
    if (r !== null) {
      var s = D.format(r, b);
      if (s.indexOf('(') < 0) {
        // Exact representation in new base — keep as editable entry
        entry = s;
        acc = null;
        waiting = false;
      } else {
        // Repeating decimal — show as display value, fresh typing replaces it
        acc = r;
        entry = "0";
        waiting = true;
      }
    } else {
      entry = "0";
      acc = null;
      waiting = false;
    }
    updateButtons();
    render();
  }

  function sign() {
    if (errored) return;
    if (waiting && acc !== null) {
      acc = D.negate(acc);
    } else if (entry !== "0") {
      entry = entry[0] === "-" ? entry.slice(1) : "-" + entry;
    }
    render();
  }

  function back() {
    if (errored || waiting) return;
    if (entry.length <= 1 || (entry.length === 2 && entry[0] === "-")) entry = "0";
    else entry = entry.slice(0, -1);
    render();
  }

  // ---- wire up buttons ----
  document.querySelector(".grid").addEventListener("click", function (e) {
    var b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.d != null) digit(b.dataset.d);
    else if (b.dataset.op) op(b.dataset.op);
    else if (b.dataset.act === "equals") equals();
    else if (b.dataset.act === "clear") clearAll();
    else if (b.dataset.act === "back") back();
    else if (b.dataset.act === "sign") sign();
  });

  document.querySelector(".modebar").addEventListener("click", function (e) {
    var b = e.target.closest(".mode");
    if (b) setBase(+b.getAttribute("data-base"));
  });

  updateButtons();
  render();

  // ---- keyboard ----
  document.addEventListener("keydown", function (e) {
    // Don't hijack typing in form fields (e.g. the SHA-256 input)
    var t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
    var k = e.key;
    if (/^[0-9]$/.test(k)) digit(k);
    else if (k === "a" || k === "A") digit("A");
    else if (k === "b" || k === "B") digit("B");
    else if (k === "c" || k === "C") digit("C");
    else if (k === "d" || k === "D") digit("D");
    else if (k === "e" || k === "E") digit("E");
    else if (k === "f" || k === "F") digit("F");
    else if (k === ".") digit(".");
    else if (k === "+") op("add");
    else if (k === "-") op("sub");
    else if (k === "*") op("mul");
    else if (k === "/") { e.preventDefault(); op("div"); }
    else if (k === "Enter" || k === "=") { e.preventDefault(); equals(); }
    else if (k === "Backspace") { e.preventDefault(); back(); }
    else if (k === "Escape") clearAll();
    else return;
  });

  render();

  // Re-fit the display when the viewport changes size (e.g. rotation, or the
  // mobile breakpoint switching the base font) and once the web font loads.
  window.addEventListener("resize", fitMain);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitMain);

  // Expose the current display value as a hex byte-string (whole-number part,
  // even length) so the SHA-256 tool can pull it in. Returns null when there
  // is no usable value (error state or unparseable entry).
  window.CalcBridge = {
    hexBytes: function () {
      var r = errored ? null : shownRat();
      if (r === null) return null;
      var hex = D.format(r, 16).replace("-", "").split(".")[0]; // integer part, no sign
      if (!/^[0-9A-Fa-f]+$/.test(hex)) return null;
      if (hex.length % 2) hex = "0" + hex;                       // pad to whole bytes
      return hex.toLowerCase();
    }
  };
})();

(function () {
  var input  = document.getElementById('shaInput');
  var btn    = document.getElementById('shaBtn');
  var errEl  = document.getElementById('shaErr');
  var output = document.getElementById('shaOutput');
  var D      = window.Dozenal;

  async function doHash() {
    errEl.textContent = '';
    var raw = input.value.replace(/[\s:_-]/g, '');
    if (!raw) { errEl.textContent = 'Enter hex bytes'; output.style.display = 'none'; return; }
    if (raw.length % 2 !== 0 || /[^0-9a-fA-F]/.test(raw)) {
      errEl.textContent = 'Invalid hex — even number of hex digits only';
      output.style.display = 'none'; return;
    }

    var bytes = new Uint8Array(raw.length / 2);
    for (var i = 0; i < raw.length; i += 2)
      bytes[i / 2] = parseInt(raw.slice(i, i + 2), 16);

    var hashBuf   = await crypto.subtle.digest('SHA-256', bytes);
    var hashBytes = Array.from(new Uint8Array(hashBuf));

    // Standard hex — 8-char groups
    var hex = hashBytes.map(function(b){ return b.toString(16).padStart(2,'0'); }).join('');
    document.getElementById('shaHex').textContent = hex.match(/.{8}/g).join(' ');

    // Binary — first 4 bits only (first nibble of first byte)
    document.getElementById('shaBin').textContent =
      (hashBytes[0] >> 4).toString(2).padStart(4, '0');

    output.style.display = 'block';
  }

  btn.addEventListener('click', doHash);
  input.addEventListener('keydown', function(e){ if (e.key === 'Enter') doHash(); });

  // "From calc" — pull the calculator's current value (whole-number part) into
  // the input as hex bytes, ready to hash.
  var fromBtn = document.getElementById('shaFromCalc');
  fromBtn.addEventListener('click', function () {
    var hex = window.CalcBridge && window.CalcBridge.hexBytes();
    if (!hex) {
      errEl.textContent = 'No whole-number value on the calculator to copy';
      output.style.display = 'none';
      return;
    }
    input.value = hex;
    errEl.textContent = '';
    input.focus();
  });
})();

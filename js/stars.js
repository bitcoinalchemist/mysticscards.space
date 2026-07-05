// stars.js — ambient starfield background for mysticscards.space
// Drifting, twinkling stars on the deep-violet ground. Self-contained so it can
// load on its own (the games don't pull in site.js). Runs on any page that has
// <canvas class="stars-bg"> (pair it with body.starry for the gradient ground,
// both defined in css/site.css). Honours prefers-reduced-motion (one static
// frame). Deferred to DOM-ready so the canvas exists before we query it.
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function initStars() {
    var canvas = document.querySelector('.stars-bg');
    if (!canvas || !canvas.getContext) return;
    var ctx = canvas.getContext('2d');
    var stars = [], shooters = [], dpr = 1, W = 0, H = 0, raf = null, t = 0;

    function rand(a, b) { return a + Math.random() * (b - a); }

    function build() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // Density scales with viewport area; ~1 in 5 stars is warm gold.
      var count = Math.round(Math.min(170, (W * H) / 7000));
      stars = [];
      for (var i = 0; i < count; i++) {
        var gold = Math.random() < 0.2;
        stars.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: rand(0.4, gold ? 1.5 : 1.25),
          base: rand(0.12, 0.6),
          amp: rand(0.08, 0.4),
          spd: rand(0.5, 1.7),
          ph: rand(0, Math.PI * 2),
          drift: rand(0.008, 0.04),
          gold: gold
        });
      }
    }

    function paintStar(s, a) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? 'rgba(231,192,116,' + a + ')'
        : 'rgba(238,236,250,' + a + ')';
      ctx.fill();
    }

    function frame() {
      t += 0.016;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        s.y -= s.drift;                       // slow upward drift
        if (s.y < -2) { s.y = H + 2; s.x = Math.random() * W; }
        var a = s.base + s.amp * Math.sin(t * s.spd + s.ph);
        if (a < 0.04) a = 0.04;
        paintStar(s, a);
      }
      // Rare, faint gold shooting star.
      if (Math.random() < 0.0014 && shooters.length < 1) {
        shooters.push({ x: rand(W * 0.08, W * 0.7), y: rand(H * 0.06, H * 0.5),
                        vx: rand(3.2, 4.8), vy: rand(1, 1.8), life: 1 });
      }
      for (var j = shooters.length - 1; j >= 0; j--) {
        var sh = shooters[j];
        sh.x += sh.vx; sh.y += sh.vy; sh.life -= 0.02;
        if (sh.life <= 0) { shooters.splice(j, 1); continue; }
        var g = ctx.createLinearGradient(sh.x, sh.y, sh.x - sh.vx * 7, sh.y - sh.vy * 7);
        g.addColorStop(0, 'rgba(231,192,116,' + (0.5 * sh.life) + ')');
        g.addColorStop(1, 'rgba(231,192,116,0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(sh.x, sh.y);
        ctx.lineTo(sh.x - sh.vx * 7, sh.y - sh.vy * 7); ctx.stroke();
      }
      raf = requestAnimationFrame(frame);
    }

    function staticFrame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < stars.length; i++) paintStar(stars[i], stars[i].base);
    }

    function start() {
      build();
      if (reduce) { staticFrame(); }
      else { if (raf) cancelAnimationFrame(raf); frame(); }
    }

    start();
    var rt;
    window.addEventListener('resize', function () {
      clearTimeout(rt);
      rt = setTimeout(start, 200);
    }, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initStars);
  else initStars();
})();

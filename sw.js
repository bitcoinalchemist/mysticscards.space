/*
 * sw.js — offline support for mysticscards.space (v2)
 * Network-first for same-origin; cache-first for Google Fonts.
 * Auto-generated precache list — regenerate when files are added/removed.
 */
const CACHE = 'mysticscards-v2-27';
const PRECACHE = [
  './',
  'index.html',
  '404.html',
  'cardsoflife.html',
  'iching.html',
  'celestialkeys.html',
  'seedoracle.html',
  'calculator.html',
  'ouroboros.html',
  'manifest.webmanifest',
  'favicon.ico',
  'css/404.css',
  'css/cardsoflife.css',
  'css/casting.css',
  'css/calculator.css',
  'css/celestialkeys.css',
  'css/iching.css',
  'css/ouroboros.css',
  'css/seedoracle.css',
  'css/site.css',
  'js/astro-lite.js',
  'js/astronomy.js',
  'js/bip39-words.js',
  'js/bip84.js',
  'js/calculator.js',
  'js/cardsdata.js',
  'js/cardsoflife.js',
  'js/casting.js',
  'js/celestialkeys.js',
  'js/dailycarddata.js',
  'js/dozenal.js',
  'js/iching.js',
  'js/ichingdata.js',
  'js/ichingjudgments.js',
  'js/linedata.js',
  'js/ouroboros.js',
  'js/periodcarddata.js',
  'js/planetdata.js',
  'js/richmonddata.js',
  'js/seedoracle.js',
  'js/sevenyearcarddata.js',
  'js/site.js',
  'js/stars.js',
  'js/thirteenyearcarddata.js',
  'js/tzcoords.js',
  'js/yearcarddata.js',
  'assets/favicon.svg',
  'assets/footer-fan.svg',
  'assets/apple-touch-icon.png',
  'assets/icon-192.png',
  'assets/icon-512.png',
  'assets/icon-512-maskable.png',
  'assets/og-image.png',
  'assets/cards/JC.webp',
  'assets/cards/JD.webp',
  'assets/cards/JH.webp',
  'assets/cards/JOKER.webp',
  'assets/cards/JS.webp',
  'assets/cards/KC.webp',
  'assets/cards/KD.webp',
  'assets/cards/KH.webp',
  'assets/cards/KS.webp',
  'assets/cards/QC.webp',
  'assets/cards/QD.webp',
  'assets/cards/QH.webp',
  'assets/cards/QS.webp'
];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    const bypass = req.mode === 'navigate' || /\.(?:html|css|js)$/.test(url.pathname);
    e.respondWith(
      fetch(req, bypass ? { cache: 'reload' } : {})
        .then((res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); } return res; })
        .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => {
          if (hit) return hit;
          if (req.mode === 'navigate') return caches.match('index.html');
          return Response.error();
        }))
    );
  } else if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      if (res && (res.ok || res.type === 'opaque')) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
      return res;
    })));
  }
});

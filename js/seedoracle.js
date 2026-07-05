(function () {
  'use strict';
  var WL = window.BIP39_WORDS || [];
  var IDX = {}; WL.forEach(function (w, i) { IDX[w] = i; });
  var JD = window.ICHING_JUDGMENTS || {};   // direct Zhou Yi judgment translations, by King Wen

  // Binary value (bit5=line1/bottom … bit0=line6/top) → King Wen (verified bijection, from iching.html)
  var VAL_TO_KW = [2,23,8,20,16,35,45,12,15,52,39,53,62,56,31,33,
                   7,4,29,59,40,64,47,6,46,18,48,57,32,50,28,44,
                   24,27,3,42,51,21,17,25,36,22,63,37,55,30,49,13,
                   19,41,60,61,54,38,58,10,11,26,5,9,34,14,43,1];

  // Hexagram SVG from a 6-bit value — same renderer/bit-order as iching.html
  // Identical geometry to iching.html's hexagramSVG so both pages draw the same
  // figures: thin compact bars (lineH 5, gap 4, w 36, segW 14, rx 1.5 — all × size).
  function hexagramSVG(val, size) {
    size = size || 1;
    var lineH = 5*size, gap = 4*size, w = 36*size, segW = 14*size, rx = 1.5*size;
    var svgH = 6*lineH + 5*gap, paths = [];
    for (var i = 0; i < 6; i++) {            // i=0 bottom (line1) … i=5 top (line6)
      var bit = (val >> (5 - i)) & 1;
      var y = svgH - lineH - i*(lineH + gap);
      if (bit === 1) {
        paths.push('<rect data-line="'+i+'" x="0" y="'+y+'" width="'+w+'" height="'+lineH+'" rx="'+rx+'" fill="var(--yang)"/>');
      } else {
        paths.push('<rect data-line="'+i+'" x="0" y="'+y+'" width="'+segW+'" height="'+lineH+'" rx="'+rx+'" fill="var(--yang)"/>');
        paths.push('<rect data-line="'+i+'" x="'+(w-segW)+'" y="'+y+'" width="'+segW+'" height="'+lineH+'" rx="'+rx+'" fill="var(--yang)"/>');
      }
    }
    return '<svg width="'+w+'" height="'+svgH+'" viewBox="0 0 '+w+' '+svgH+'" aria-hidden="true">'+paths.join('')+'</svg>';
  }

  // A hexagram drawn from a SPEC rather than a value — for figures that are
  // partly cast (the chapter-I line-by-line build) or partly unknowable (the
  // seal diagram, the locked 22nd slot). spec = array of up to 6 entries,
  // BOTTOM-UP: { bit: 0|1|null, cls: ''|'free'|'cs' }. null bits draw as
  // dashed slots; classes colour via CSS (.so-l-free/.so-l-cs/.so-l-slot*).
  // Same geometry as hexagramSVG so the figures match everywhere.
  function slotHexSVG(spec, size) {
    size = size || 1;
    var lineH = 5*size, gap = 4*size, w = 36*size, segW = 14*size, rx = 1.5*size;
    var svgH = 6*lineH + 5*gap, paths = [];
    for (var i = 0; i < 6; i++) {
      var s = spec[i] || { bit: null, cls: '' };
      var y = svgH - lineH - i*(lineH + gap);
      var cls = s.cls ? (s.bit === null ? 'so-l-slot-'+s.cls : 'so-l-'+s.cls) : (s.bit === null ? 'so-l-slot' : '');
      var attrs = 'data-line="'+i+'"'+(cls ? ' class="'+cls+'"' : '');
      if (s.bit === null) {
        paths.push('<rect '+attrs+' x="0.75" y="'+(y+0.75)+'" width="'+(w-1.5)+'" height="'+(lineH-1.5)+'" rx="'+rx+'" fill="none" stroke-width="1.2"/>');
      } else if (s.bit === 1) {
        paths.push('<rect '+attrs+' x="0" y="'+y+'" width="'+w+'" height="'+lineH+'" rx="'+rx+'" fill="var(--yang)"/>');
      } else {
        paths.push('<rect '+attrs+' x="0" y="'+y+'" width="'+segW+'" height="'+lineH+'" rx="'+rx+'" fill="var(--yang)"/>');
        paths.push('<rect '+attrs+' x="'+(w-segW)+'" y="'+y+'" width="'+segW+'" height="'+lineH+'" rx="'+rx+'" fill="var(--yang)"/>');
      }
    }
    return '<svg width="'+w+'" height="'+svgH+'" viewBox="0 0 '+w+' '+svgH+'" aria-hidden="true">'+paths.join('')+'</svg>';
  }

  // The bottom two lines of the final hexagram pick one of the four CARD SUITS
  // (the suits are the four elements in the classic tarot link, so this keeps the
  // page's card-and-I-Ching theme). Read bottom-first: yin-yin → Hearts,
  // yin-yang → Clubs, yang-yin → Diamonds, yang-yang → Spades. Hearts/Diamonds
  // are red, Clubs/Spades dark — the same suit colours as the rest of the site.
  var SUITS={
    hearts:   {name:'Hearts',   sym:'♥', cls:'suit-red'},
    clubs:    {name:'Clubs',    sym:'♣', cls:'suit-dark'},
    diamonds: {name:'Diamonds', sym:'♦', cls:'suit-red'},
    spades:   {name:'Spades',   sym:'♠', cls:'suit-dark'}
  };
  var SUIT_ORDER=['hearts','clubs','diamonds','spades'];
  function suitOf(val){               // from the bottom two lines (bottom = MSB)
    var bottom=(val>>5)&1, second=(val>>4)&1;
    return bottom ? (second?'spades':'diamonds') : (second?'clubs':'hearts');
  }
  // ♥/♦ as Unicode (distinct silhouettes); ♣/♠ as inline SVG (.pip-svg, styled in
  // css/site.css with fill:currentColor) so the trefoil + leaf read clearly.
  // Mirrors window.SUIT_PIP_SVG in cardsdata.js (not loaded on this page).
  var SUIT_PIP_SVG={
    '♠':'<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><path d="M50,8 C30,26 6,50 6,66 C6,82 22,90 36,82 C42,78 47,74 50,70 L40,95 L60,95 L50,70 C53,74 58,78 64,82 C78,90 94,82 94,66 C94,50 70,26 50,8 Z"/></svg>',
    '♣':'<svg class="pip-svg" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="30" r="20"/><circle cx="27" cy="58" r="20"/><circle cx="73" cy="58" r="20"/><path d="M44,46 L40,96 L60,96 L56,46 Z"/></svg>'
  };
  function suitPip(sym){ return SUIT_PIP_SVG[sym] || '<span class="pip-uni" aria-hidden="true">'+sym+'</span>'; }

  // ── compact SHA-256 (public domain, for the BIP39 checksum) ──
  function sha256Bytes(bytes) {
    function rotr(n,x){return (x>>>n)|(x<<(32-n));}
    var K=[0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
    0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
    0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
    0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
    0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
    0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
    0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
    0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2];
    var H=[0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
    var l=bytes.length, withOne=l+1, k=(56-withOne%64+64)%64, total=withOne+k+8;
    var m=new Uint8Array(total); m.set(bytes); m[l]=0x80;
    var bitLen=l*8; for(var i=0;i<4;i++){m[total-1-i]=(bitLen>>>(8*i))&0xff;}
    var w=new Int32Array(64);
    for(var off=0; off<total; off+=64){
      for(var t=0;t<16;t++){w[t]=(m[off+t*4]<<24)|(m[off+t*4+1]<<16)|(m[off+t*4+2]<<8)|(m[off+t*4+3]);}
      for(t=16;t<64;t++){var s0=rotr(7,w[t-15])^rotr(18,w[t-15])^(w[t-15]>>>3);var s1=rotr(17,w[t-2])^rotr(19,w[t-2])^(w[t-2]>>>10);w[t]=(w[t-16]+s0+w[t-7]+s1)|0;}
      var a=H[0],b=H[1],c=H[2],d=H[3],e=H[4],f=H[5],g=H[6],h=H[7];
      for(t=0;t<64;t++){var S1=rotr(6,e)^rotr(11,e)^rotr(25,e);var ch=(e&f)^(~e&g);var t1=(h+S1+ch+K[t]+w[t])|0;var S0=rotr(2,a)^rotr(13,a)^rotr(22,a);var maj=(a&b)^(a&c)^(b&c);var t2=(S0+maj)|0;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
      H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0;
    }
    var out=new Uint8Array(32);
    for(i=0;i<8;i++){out[i*4]=(H[i]>>>24)&0xff;out[i*4+1]=(H[i]>>>16)&0xff;out[i*4+2]=(H[i]>>>8)&0xff;out[i*4+3]=H[i]&0xff;}
    return out;
  }
  function bits(n,w){var s=n.toString(2);while(s.length<w)s='0'+s;return s;}

  // ── BIP39 core ──
  function entropyToMnemonic(entBytes){
    var b=''; for(var i=0;i<entBytes.length;i++) b+=bits(entBytes[i],8);
    var cs=entBytes.length*8/32, h=sha256Bytes(entBytes);
    b+=bits(h[0],8).slice(0,cs);
    var words=[]; for(i=0;i<b.length;i+=11) words.push(WL[parseInt(b.slice(i,i+11),2)]);
    return words.join(' ');
  }
  function phraseToBits(words){ return words.map(function(w){return bits(IDX[w],11);}).join(''); }
  function checkPhrase(words){
    if (words.some(function(w){return !(w in IDX);})) return {ok:false, reason:'unknown word'};
    var n=words.length;
    if ([12,18,24].indexOf(n)===-1) return {ok:false, reason:n+' words — use 12 or 24'};
    var b=phraseToBits(words), ent=Math.floor(b.length/33)*32, cs=b.length-ent;
    var eb=b.slice(0,ent), cb=b.slice(ent), bytes=[];
    for(var i=0;i<ent;i+=8) bytes.push(parseInt(eb.slice(i,i+8),2));
    var h=sha256Bytes(new Uint8Array(bytes));
    return {ok: bits(h[0],8).slice(0,cs)===cb, reason:'checksum', entBytes:new Uint8Array(bytes)};
  }
  // mapping
  function phraseToVals(words){ var b=phraseToBits(words), v=[]; for(var i=0;i<b.length;i+=6) v.push(parseInt(b.slice(i,i+6),2)); return v; }
  function valsToWords(vals){ var b=vals.map(function(v){return bits(v,6);}).join(''), w=[]; for(var i=0;i+11<=b.length;i+=11) w.push(WL[parseInt(b.slice(i,i+11),2)]); return w; }

  // ── PBKDF2-HMAC-SHA512 seed (via Web Crypto; graceful if unavailable) ──
  function deriveSeed(mnemonic){
    var out=document.getElementById('soSeed');
    if(!(window.crypto&&crypto.subtle)){ out.textContent='(seed derivation needs a secure context — open via https/localhost)'; return; }
    var enc=new TextEncoder();
    crypto.subtle.importKey('raw',enc.encode(mnemonic.normalize('NFKD')),{name:'PBKDF2'},false,['deriveBits'])
      .then(function(key){return crypto.subtle.deriveBits({name:'PBKDF2',salt:enc.encode('mnemonic'),iterations:2048,hash:'SHA-512'},key,512);})
      .then(function(buf){var a=new Uint8Array(buf),h='';for(var i=0;i<a.length;i++)h+=('0'+a[i].toString(16)).slice(-2);out.textContent=h;})
      .catch(function(){out.textContent='(seed derivation unavailable here)';});
  }

  // ══════════════════════════════════════════════════════════════════
  // Journey state
  //   state       — the COMMITTED (sealed) reading, as before.
  //   _lineBits   — chapter I's first hexagram, built line by line (bottom-up).
  //   _hexVals    — the cast in progress (hexagram 1 arrives from chapter I).
  //   _sealed     — a valid phrase is committed (suit chosen / oracle / pasted).
  //   _tamperOn/_tamperIdx — the chapter-IV "test the seal" toy (sandboxed:
  //                 it flips bits at DISPLAY time only, never in the state).
  // ══════════════════════════════════════════════════════════════════
  var state={ len:12, vals:[], focus:0 };
  var _lineBits=[], _hexVals=[], _sealed=false, _tamperOn=false, _tamperIdx=-1;
  var elPhrase=document.getElementById('soPhrase'), elStack=document.getElementById('soStack'),
      elStatus=document.getElementById('soStatus');
  var RM = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  function setStatus(ok, msg){ elStatus.className='so-status '+(ok?'valid':'invalid'); elStatus.querySelector('.msg').textContent=msg; }
  function escapeHtml(s){ return String(s).replace(/[&<>"]/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function hexCount(){ return state.len*11/6; }          // 22 / 44 — the reading's own count
  function cardNeed(){ return state.len/3*32; }          // 128 / 256 entropy bits
  // How many hexagrams the visitor casts FREELY. At 12 words the 22nd belongs
  // to the seal (2 free lines + 4 checksum lines — chapters IV–V). At 24 the
  // checksum claims the final hexagram whole, so the oracle casts and seals
  // everything itself (the chapter-V footnote explains).
  function castFree(){ return state.len===12 ? hexCount()-1 : hexCount(); }

  // Casts REQUIRE crypto.getRandomValues — no Math.random fallback. This page
  // derives real keys from what it casts; a browser too old to have Web Crypto
  // gets a plain refusal (see init) rather than silently predictable entropy.
  var CRYPTO_OK = !!(window.crypto && window.crypto.getRandomValues);
  function hexRand(){ var u=new Uint8Array(1); window.crypto.getRandomValues(u); return u[0]&63; }   // one hexagram = 6 bits
  function bitRand(){ var u=new Uint8Array(1); window.crypto.getRandomValues(u); return u[0]&1; }    // one line = 1 bit

  // The bits laid down so far (cast surface), and the committed bits (sealed).
  function castBits(){ return _hexVals.map(function(v){ return bits(v,6); }).join(''); }
  function currentWords(){ return elPhrase.value.trim().toLowerCase().split(/\s+/).filter(Boolean); }

  // ══ Gating — the chapters and their unlock tiers ══
  var CHAPTERS=[
    { id:'threshold', label:'Threshold',      lvl:0 },
    { id:'firstline', label:'One line',       lvl:1 },
    { id:'mnemonic',  label:'The cast',       lvl:2 },
    { id:'weave',     label:'The weave',      lvl:3 },
    { id:'seal',      label:'The seal',       lvl:3 },
    { id:'suitseal',  label:'The suit',       lvl:3 },
    { id:'proof',     label:'The proof',      lvl:4 },
    { id:'underhood', label:'Under the hood', lvl:4 },
    { id:'learn',     label:'By hand',        lvl:4 }
  ];
  var _unlock=0;
  try { _unlock=Math.max(0, Math.min(4, +(localStorage.getItem('seedoracle_unlock')||0))); } catch(e){}

  function chapterEl(c){ return document.getElementById(c.id); }
  function announce(msg){ var a=document.getElementById('soAnnounce'); if(a) a.textContent=msg; }

  function applyGates(openNew){
    CHAPTERS.forEach(function(c){
      if(c.lvl===0) return;                          // the threshold is never gated
      var sec=chapterEl(c); if(!sec) return;
      var locked = c.lvl>_unlock;
      var btn=sec.querySelector(':scope > .section-toggle');
      var body=sec.querySelector('.section-bodymin');
      sec.classList.toggle('so-locked', locked);
      if(btn) btn.disabled=locked;
      if(body) body.inert=locked;
      if(locked){
        sec.classList.remove('section-open');
        if(btn) btn.setAttribute('aria-expanded','false');
      } else if(openNew && openNew.indexOf(c.id)>-1 && !sec.classList.contains('section-start-closed')){
        sec.classList.add('section-open');
        if(btn) btn.setAttribute('aria-expanded','true');
      }
    });
    renderRail();
  }
  function raiseUnlock(n, msg){
    if(n<=_unlock) return;
    var fresh=CHAPTERS.filter(function(c){ return c.lvl>_unlock && c.lvl<=n; }).map(function(c){ return c.id; });
    _unlock=n;
    try { localStorage.setItem('seedoracle_unlock', String(n)); } catch(e){}
    applyGates(fresh);
    if(msg) announce(msg);
  }
  function scrollToChapter(id){
    var sec=document.getElementById(id); if(!sec) return;
    if(!sec.classList.contains('section-open') && sec.querySelector(':scope > .section-toggle') && !sec.classList.contains('so-locked')){
      window.toggleSection && window.toggleSection(id);
    }
    sec.scrollIntoView({ behavior: RM?'auto':'smooth', block:'start' });
  }
  function renderRail(){
    var rail=document.getElementById('soRail'); if(!rail) return;
    rail.innerHTML=CHAPTERS.map(function(c,i){
      var locked=c.lvl>_unlock;
      return (i?'<span class="so-rail-sep" aria-hidden="true">·</span>':'')+
        '<button type="button" class="so-rail-item" data-ch="'+c.id+'"'+(locked?' disabled':'')+
        ' aria-label="'+c.label+(locked?' — locked':'')+'">'+c.label+'</button>';
    }).join('');
  }
  document.getElementById('soRail').addEventListener('click', function(e){
    var b=e.target.closest('.so-rail-item'); if(!b||b.disabled) return;
    scrollToChapter(b.getAttribute('data-ch'));
  });

  // ══ Chapter I — one line, one coin ══
  var elLineFig=document.getElementById('soLineFig'), elLineBits=document.getElementById('soLineBits'),
      elLineStat=document.getElementById('soLineStat'), elLineDone=document.getElementById('soLineDone'),
      elLineCast=document.getElementById('soLineCast');

  function renderLine(){
    var spec=[];
    for(var i=0;i<6;i++) spec.push({ bit:(i<_lineBits.length?_lineBits[i]:null), cls:'' });
    elLineFig.innerHTML=slotHexSVG(spec, 2);
    elLineBits.innerHTML=Array.apply(null,Array(6)).map(function(_,i){
      var has=i<_lineBits.length;
      return '<span class="so-line-bit'+(has?'':' is-empty')+'">'+(has?_lineBits[i]:'0')+'</span>';
    }).join('');
    if(_lineBits.length===0){ elLineStat.textContent='no lines yet — six to throw'; }
    else if(_lineBits.length<6){
      var last=_lineBits[_lineBits.length-1];
      elLineStat.textContent='line '+_lineBits.length+' of 6 — '+(last?'solid yang · 1':'broken yin · 0');
    }
    var done=_lineBits.length>=6;
    elLineCast.disabled = done || !CRYPTO_OK;
    elLineDone.hidden = !done;
    if(done){
      var val=parseInt(_lineBits.join(''),2), kw=VAL_TO_KW[val], d=JD[kw]||{};
      elLineStat.textContent='six lines — a hexagram';
      document.getElementById('soLineDoneText').innerHTML=
        'Your six throws, read bottom-up, are <span class="so-mono">'+_lineBits.join('')+'</span> — the number '+val+
        ' — and the figure <strong>'+escapeHtml(d.name||'')+'</strong>, hexagram '+kw+' of the King Wen sequence. '+
        'One event, three scripts. It stands first in your reading.';
    }
  }
  elLineCast.addEventListener('click', function(){
    if(_lineBits.length>=6) return;
    _lineBits.push(bitRand());
    if(_lineBits.length>=6){
      var val=parseInt(_lineBits.join(''),2);
      _hexVals[0]=val;
      renderAll();
      raiseUnlock(2, 'Chapter unlocked — the cast of twenty-one');
    }
    renderLine();
  });
  document.getElementById('soLineRead').addEventListener('click', function(){
    if(_lineBits.length>=6) openHexPopup(parseInt(_lineBits.join(''),2));
  });
  document.getElementById('soLineNext').addEventListener('click', function(){ scrollToChapter('mnemonic'); });

  // ══ Chapter II — the cast of twenty-one (stack of 22 slots) ══
  var elHexStat=document.getElementById('soHexStat');

  function renderHexStat(){
    var free=castFree(), n=Math.min(_hexVals.length, free);
    if(_sealed){ elHexStat.textContent=hexCount()+' / '+hexCount()+' hexagrams · sealed — the reading coheres'; return; }
    if(state.len===12 && n>=free){ elHexStat.textContent='twenty-one cast · 126 lines · the twenty-second waits for the seal ↓'; return; }
    elHexStat.textContent='hexagram '+n+' of '+hexCount()+' · line '+(n*6)+' of '+(state.len*11);
    if(n===0 && _lineBits.length>0 && _lineBits.length<6) elHexStat.textContent='finishing hexagram 1 above — line '+_lineBits.length+' of 6';
  }

  function renderStack(){
    var N=hexCount(), free=castFree(), out='';
    for(var i=0;i<N;i++){
      var isSealSlot = (state.len===12 && i===N-1 && !_sealed);
      var cast = _sealed ? (i<state.vals.length) : (i<_hexVals.length && i<free);
      var v = _sealed ? state.vals[i] : _hexVals[i];
      var inner, cls='so-hex', attrs='';
      if(cast){
        var kw=VAL_TO_KW[v], d=JD[kw]||{};
        inner=hexagramSVG(v,0.72)+'<div class="so-hex-kw">'+kw+'</div>';
        if(_sealed && i===N-1 && state.len===12) cls+=' is-sealed';
        var lbl=_sealed
          ? 'Hexagram '+(i+1)+' of '+N+': '+(d.name||'')+', King Wen '+kw+'. Opens its judgment.'
          : 'Hexagram '+(i+1)+', '+(d.name||'')+', King Wen '+kw+'. Re-casts on click.';
        attrs=' role="button" tabindex="0" data-i="'+i+'" data-hex="'+i+'" aria-label="'+lbl+'"';
      } else if(isSealSlot){
        var ready=_hexVals.length>=free;
        cls+=' is-seal-slot'+(ready?' is-ready':'');
        inner=slotHexSVG([{bit:null,cls:'free'},{bit:null,cls:'free'},{bit:null,cls:'cs'},{bit:null,cls:'cs'},{bit:null,cls:'cs'},{bit:null,cls:'cs'}],0.72)+
              '<div class="so-hex-kw">seal</div>';
        attrs=ready
          ? ' role="button" tabindex="0" data-act="to-seal" aria-label="The twenty-second hexagram — the seal. Opens chapter four."'
          : ' aria-label="The twenty-second hexagram — the seal. Cast the first twenty-one to reach it." title="the seal — cast the first twenty-one"';
      } else {
        cls+=' is-slot';
        inner='';
        attrs=' aria-hidden="true"';
      }
      out+='<div class="so-cell"><div class="so-ord">'+(i+1)+'</div><div class="'+cls+'"'+attrs+'>'+inner+'</div></div>';
    }
    elStack.innerHTML=out;
  }

  function stackActivate(el){
    if(el.getAttribute('data-act')==='to-seal'){ scrollToChapter('seal'); return; }
    var i=+el.getAttribute('data-i');
    if(isNaN(i)) return;
    if(_sealed){ openHexPopup(state.vals[i]); return; }
    _hexVals[i]=hexRand();                      // re-throw just this hexagram
    renderAll();
  }
  elStack.addEventListener('click', function(e){
    var el=e.target.closest('.so-hex[role="button"]'); if(el) stackActivate(el);
  });
  elStack.addEventListener('keydown', function(e){
    if(e.key!=='Enter' && e.key!==' ') return;
    var el=e.target.closest('.so-hex[role="button"]'); if(!el) return;
    e.preventDefault(); stackActivate(el);
  });

  function hexCastOne(){
    if(_sealed || _hexVals.length>=castFree()) return;
    _hexVals.push(hexRand());
    afterCastProgress();
  }
  function hexCastAll(){
    if(_sealed) return;
    while(_hexVals.length<castFree()) _hexVals.push(hexRand());
    afterCastProgress();
  }
  function afterCastProgress(){
    renderAll();
    if(state.len===12 && _hexVals.length>=castFree()){
      raiseUnlock(3, 'Chapters unlocked — the weave, the seal, and the suit');
    }
    if(state.len===24 && _hexVals.length>=castFree()) commitOracle();   // 24-word: the oracle seals it whole
  }
  document.getElementById('soHexOne').addEventListener('click', hexCastOne);
  document.getElementById('soHexAll').addEventListener('click', hexCastAll);

  // ══ Chapter III — the weave (live ribbon, partial while casting) ══
  function tamperView(bstr){
    // returns { bits, req, claim, ok } for the CURRENT display bits with the
    // tampered cell flipped — display-only, never touches the state.
    var ENT=cardNeed();
    var b=bstr.split(''); b[_tamperIdx]=(b[_tamperIdx]==='1'?'0':'1'); b=b.join('');
    var entBits=b.slice(0,ENT), claim=b.slice(ENT), bytes=[];
    for(var i=0;i<ENT;i+=8) bytes.push(parseInt(entBits.slice(i,i+8),2));
    var req=bits(sha256Bytes(new Uint8Array(bytes))[0],8).slice(0,claim.length);
    return { bits:b, req:req, claim:claim, ok:req===claim };
  }
  function renderWeave(){
    var box=document.getElementById('soRibbon'); if(!box) return;
    var total=state.len*11, ENT=cardNeed(), isTwelve=state.len===12;
    var have = _sealed ? phraseToBits(currentWords()) : castBits().slice(0, castFree()*6);
    var tampered=null;
    if(_sealed && _tamperOn && _tamperIdx>=0){ tampered=tamperView(have); have=tampered.bits; }
    var html='';
    for(var w=0; w<total/11; w++){
      var cells='', complete=true;
      for(var i=0;i<11;i++){
        var idx=w*11+i;
        var hexIdx=Math.floor(idx/6);
        var isCS=idx>=ENT;
        var isFree=isTwelve && (idx===ENT-2 || idx===ENT-1);
        var has=idx<have.length;
        if(!has) complete=false;
        var cls='so-bit'+(hexIdx%2?' alt':'')+(isCS?' is-cs':'')+(isFree?' is-free':'')+(has?'':' is-empty');
        if(tampered && idx===_tamperIdx) cls+=' is-flip';
        if(tampered && isCS && tampered.req[idx-ENT]!==tampered.claim[idx-ENT]) cls+=' is-bad';
        cells+='<span class="'+cls+'" data-idx="'+idx+'" data-hex="'+hexIdx+'" title="hexagram '+(hexIdx+1)+', line '+((idx%6)+1)+(isCS?' · checksum':isFree?' · your suit':'')+'">'+(has?have[idx]:'')+'</span>';
      }
      var label;
      if(complete){ label=(w+1)+' · '+WL[parseInt(have.slice(w*11,w*11+11),2)]; }
      else if(have.length>w*11){ label='<span class="is-starving">'+(w+1)+' · starving — '+(11-(have.length-w*11))+' short</span>'; }
      else { label=(w+1)+' · —'; }
      html+='<span class="so-word-group"><span class="so-word-label">'+label+'</span><span class="so-bit-row">'+cells+'</span></span>';
    }
    html+='<p class="so-note so-ribbon-key">'+
      (isTwelve
        ? 'Each band of shading is one hexagram. The <span class="so-key-free">gold-edged cells</span> are the two free lines you seal with a suit; the <span class="so-key-cs">amber tail</span> is the checksum'+(_sealed?'.':' — both still waiting.')
        : 'Each band of shading is one hexagram. The <span class="so-key-cs">amber tail</span> is the checksum — at this length it claims the final hexagram whole, so there is no element seal.')+
      '</p>';
    box.innerHTML=html;
    box.classList.toggle('is-tamper', _sealed && _tamperOn);
  }

  // ribbon ↔ stack linkage: hovering/focusing one lights the other
  function litHex(n, on){
    document.querySelectorAll('#soRibbon .so-bit[data-hex="'+n+'"]').forEach(function(c){ c.classList.toggle('is-lit', on); });
    var t=document.querySelector('#soStack .so-hex[data-hex="'+n+'"]'); if(t) t.classList.toggle('is-lit', on);
  }
  (function(){
    var ribbon=document.getElementById('soRibbon');
    function from(e){ var c=e.target.closest('[data-hex]'); return c ? +c.getAttribute('data-hex') : -1; }
    [['mouseover',true],['mouseout',false],['focusin',true],['focusout',false]].forEach(function(p){
      ribbon.addEventListener(p[0], function(e){ var n=from(e); if(n>=0) litHex(n,p[1]); });
      elStack.addEventListener(p[0], function(e){ var n=from(e); if(n>=0) litHex(n,p[1]); });
    });
    // the tamper toy: in test mode, tapping a cell flips it (display-only)
    ribbon.addEventListener('click', function(e){
      if(!(_sealed && _tamperOn)) return;
      var c=e.target.closest('.so-bit'); if(!c || c.classList.contains('is-empty')) return;
      var idx=+c.getAttribute('data-idx');
      _tamperIdx = (_tamperIdx===idx ? -1 : idx);
      renderWeave(); renderTamperOut();
    });
  })();

  // ══ Chapter IV — the seal ══
  function renderSealFig(){
    var box=document.getElementById('soSealFig'), cap=document.getElementById('soSealFigCap');
    if(!box) return;
    if(_sealed && state.len===12){
      var v=state.vals[state.vals.length-1], kw=VAL_TO_KW[v], d=JD[kw]||{};
      var spec=[];
      for(var i=0;i<6;i++) spec.push({ bit:(v>>(5-i))&1, cls:(i<2?'free':'cs') });
      box.innerHTML=slotHexSVG(spec, 2);
      cap.innerHTML='Your final hexagram — <strong>'+escapeHtml(d.name||'')+'</strong>, King Wen '+kw+'. The '+
        '<span class="so-key-free">two gold lines</span> are yours ('+SUITS[suitOf(v)].name+'); the '+
        '<span class="so-key-cs">four amber</span> are the mathematics’ — the first four bits of SHA-256 over everything you cast.';
    } else {
      box.innerHTML=slotHexSVG([{bit:null,cls:'free'},{bit:null,cls:'free'},{bit:null,cls:'cs'},{bit:null,cls:'cs'},{bit:null,cls:'cs'},{bit:null,cls:'cs'}], 2);
      cap.innerHTML='The twenty-second hexagram: its <span class="so-key-cs">top four lines</span> are the seal — the mathematics’ hand. Its <span class="so-key-free">bottom two</span> are the last free lines. They are covered next.';
    }
  }
  function updateTamperVis(){
    var wrap=document.getElementById('soTamperWrap');
    if(wrap) wrap.hidden = !(_sealed && state.len===12);
    if(!_sealed){ _tamperOn=false; _tamperIdx=-1; var b=document.getElementById('soTamper'); if(b) b.setAttribute('aria-pressed','false'); }
  }
  function renderTamperOut(){
    var out=document.getElementById('soTamperOut'); if(!out) return;
    if(!(_sealed && _tamperOn)){ out.textContent=''; return; }
    if(_tamperIdx<0){ out.textContent='the true cast — valid · tap any cell to flip one line'; return; }
    var t=tamperView(phraseToBits(currentWords()));
    out.textContent = t.ok
      ? 'still coheres — you flipped a checksum-and-entropy pair that happens to agree (rare — 1 in 16)'
      : 'does not cohere — the seal demands '+t.req+' but the reading claims '+t.claim;
  }
  document.getElementById('soTamper').addEventListener('click', function(){
    if(!_sealed) return;
    _tamperOn=!_tamperOn; _tamperIdx=-1;
    this.setAttribute('aria-pressed', _tamperOn?'true':'false');
    this.textContent=_tamperOn?'Leave the test — restore the true cast':'Test the seal — flip a line';
    renderWeave(); renderTamperOut();
  });

  // ── final-word (checksum) calculator — the seal chapter's word-tongue twin ──
  // The last word of a BIP39 seed is partly free entropy, partly checksum, so
  // only a subset of words validly completes any given prefix: 128 for 12 words
  // (7 free + 4 checksum bits), 32 for 18, 8 for 24.
  function finalWords(prefix){
    var n = prefix.length + 1;
    if ([12,18,24].indexOf(n) === -1) return { error: 'Enter exactly ' + (state.len-1) + ' words (all but the final one) — for a ' + state.len + '-word seed.' };
    var bad = prefix.filter(function(w){ return !(w in IDX); });
    if (bad.length) return { error: 'Not in the BIP39 word list: ' + bad.slice(0,4).join(', ') + (bad.length>4?'…':'') };
    var pbits = prefix.map(function(w){ return bits(IDX[w],11); }).join('');
    var ENT = n*11*32/33, CS = ENT/32, kFree = ENT - pbits.length;
    var out = [];
    for (var x=0; x < (1<<kFree); x++){
      var entBits = pbits + bits(x, kFree), bytes = [];
      for (var i=0; i<ENT; i+=8) bytes.push(parseInt(entBits.slice(i, i+8), 2));
      var h = sha256Bytes(new Uint8Array(bytes));
      out.push(WL[parseInt(bits(x, kFree) + bits(h[0],8).slice(0, CS), 2)]);
    }
    return { words: out };
  }
  var elFwIn=document.getElementById('soFwIn'), elFwOut=document.getElementById('soFwOut'), elFwN=document.getElementById('soFwN');
  function seedFinalWordDemo(){            // prefill the demo with the current cast's first n-1 words
    if(!elFwIn) return;
    var ws=elPhrase.value.trim().split(/\s+/).filter(Boolean);
    if(ws.length>=2){ elFwIn.value=ws.slice(0, ws.length-1).join(' '); elFwN.textContent=(ws.length-1); }
    elFwOut.innerHTML='';
  }
  function runFinalWords(){
    var prefix=elFwIn.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
    var r=finalWords(prefix);
    if(r.error){ elFwOut.innerHTML='<p class="so-fw-count warn">'+r.error+'</p>'; return; }
    var chips=r.words.map(function(w){ return '<button type="button" class="so-fw-chip">'+w+'</button>'; }).join('');
    elFwOut.innerHTML='<p class="so-fw-count">'+r.words.length+' words complete this into a valid '+(prefix.length+1)+'-word seed — choose one:</p>'+
      '<div class="so-fw-chips">'+chips+'</div>';
  }
  if(elFwIn){
    document.getElementById('soFwGo').addEventListener('click', runFinalWords);
    elFwOut.addEventListener('click', function(e){
      var chip=e.target.closest('.so-fw-chip'); if(!chip) return;
      var prefix=elFwIn.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
      elPhrase.value=prefix.concat(chip.textContent).join(' ');
      state.focus=0; syncFromPhrase(); seedFinalWordDemo();
      elPhrase.scrollIntoView({ behavior:RM?'auto':'smooth', block:'center' });
    });
  }

  // ── final-hexagram (checksum) calculator — the hexagram-native sibling ──
  // Brute-force all 64 possible last hexagrams; keep those whose full bit-string
  // (prefix + this hexagram) carries a valid BIP39 checksum. Correct for every
  // length, including 24 words where the 8-bit checksum spills into hexagram 43.
  function finalHexagrams(prefixVals){
    var totalHex = prefixVals.length + 1, n = totalHex*6/11;
    if ([12,18,24].indexOf(n) === -1) return { error: 'Need the first ' + (state.len*11/6 - 1) + ' hexagrams.' };
    var ENT = n*11*32/33, CS = ENT/32;
    var pbits = prefixVals.map(function(v){ return bits(v,6); }).join('');
    var out = [];
    for (var v=0; v<64; v++){
      var full = pbits + bits(v,6), entBits = full.slice(0,ENT), csBits = full.slice(ENT), bytes = [];
      for (var i=0; i<ENT; i+=8) bytes.push(parseInt(entBits.slice(i,i+8),2));
      var h = sha256Bytes(new Uint8Array(bytes));
      if (bits(h[0],8).slice(0,CS) === csBits) out.push(v);
    }
    return { vals: out };
  }

  // ══ Chapter V — the suit seal (the climax) ══
  var elFhOut=document.getElementById('soFhOut');
  function suitLinesHTML(v){
    // the two lines this seal sets, drawn as the hexagram will carry them:
    // line 2 above line 1 (bottom). yang = one bar, yin = two segments.
    function row(bit){ return '<span class="so-sl-row">'+(bit?'<i class="so-sl-yang"></i>':'<i class="so-sl-yin"></i><i class="so-sl-yin"></i>')+'</span>'; }
    var bottom=(v>>5)&1, second=(v>>4)&1;
    return '<span class="so-suit-lines" aria-hidden="true">'+row(second)+row(bottom)+'</span>';
  }
  function renderSuitSeals(){
    if(!elFhOut) return;
    if(state.len!==12){
      elFhOut.innerHTML='<p class="so-fw-count">At this length the seal claims the final hexagram whole — the oracle casts and seals all forty-four itself. No suit to choose; switch back to 12 · 22 for the choice.</p>';
      document.getElementById('soOracle').hidden=true;
      return;
    }
    document.getElementById('soOracle').hidden=false;
    if(_hexVals.length<castFree()){
      elFhOut.innerHTML='<p class="so-fw-count">Cast the first twenty-one hexagrams (chapter II) and the four seals appear here.</p>';
      return;
    }
    var r=finalHexagrams(_hexVals.slice(0,castFree()));
    if(r.error || !r.vals || r.vals.length!==4){
      elFhOut.innerHTML='<p class="so-fw-count warn">'+(r.error||'The cast does not resolve to four seals — re-cast and try again.')+'</p>';
      return;
    }
    var cur=_sealed ? state.vals[state.vals.length-1] : null;
    var vals=r.vals.slice().sort(function(a,b){ return SUIT_ORDER.indexOf(suitOf(a)) - SUIT_ORDER.indexOf(suitOf(b)); });
    var opts=vals.map(function(v){
      var kw=VAL_TO_KW[v], d=JD[kw]||{}, key=suitOf(v), s=SUITS[key];
      return '<button type="button" class="so-hex so-fh-opt '+s.cls+(v===cur?' is-cur':'')+'" data-v="'+v+'" '+
        'aria-label="Seal with '+s.name+' — '+(d.name||'')+', hexagram '+kw+(v===cur?', your chosen seal':'')+'">'+
        '<div class="so-suit">'+suitLinesHTML(v)+'<span class="so-suit-pip">'+suitPip(s.sym)+'</span><span class="so-suit-name">'+s.name+'</span></div>'+
        hexagramSVG(v,1.25)+'<div class="so-hex-name">'+(d.name||'—')+'</div>'+
        '<div class="so-hex-kw">'+kw+'</div></button>';
    }).join('');
    elFhOut.innerHTML='<div class="so-fh-opts">'+opts+'</div>';
  }
  if(elFhOut){
    elFhOut.addEventListener('click', function(e){
      var b=e.target.closest('.so-fh-opt'); if(!b) return;
      sealWith(+b.getAttribute('data-v'));
    });
  }
  document.getElementById('soOracle').addEventListener('click', function(){
    if(state.len!==12 || _hexVals.length<castFree()) return;
    var r=finalHexagrams(_hexVals.slice(0,castFree()));
    if(!r.vals || r.vals.length!==4) return;
    var toss=hexRand()&3;   // the oracle throws the two free lines
    var pick=r.vals.filter(function(v){ return ((v>>4)&3)===toss; })[0];
    if(pick!=null) sealWith(pick, true);
  });

  function sealWith(v, byOracle){
    state.vals=_hexVals.slice(0,castFree()).concat(v);
    _sealed=true;
    syncFromVals();
    raiseUnlock(4, 'Sealed — the reading coheres. The proof and the machinery are open.');
    // the payoff cascade: 22nd hexagram assembles → seal cells fill → twelfth
    // word resolves → the phrase breathes in (pure CSS, skipped under reduced motion)
    if(!RM){
      document.body.classList.add('so-just-sealed');
      setTimeout(function(){ document.body.classList.remove('so-just-sealed'); }, 1600);
    }
    announce(byOracle
      ? 'The oracle threw '+SUITS[suitOf(v)].name+' — the reading is sealed.'
      : 'Sealed with '+SUITS[suitOf(v)].name+' — the reading coheres.');
    elPhrase.scrollIntoView({ behavior:RM?'auto':'smooth', block:'center' });
  }

  // 24-word path (the footnote): the oracle casts and seals everything itself —
  // the checksum claims the whole final hexagram, so there is nothing to choose.
  function hexBitsToSeed(){
    var need=cardNeed(), have=castBits();
    var use=have.slice(0,need), bytes=new Uint8Array(need/8);   // LEADING need bits — keeps the cast; the final lines become the checksum seal
    for(var i=0;i<need;i+=8) bytes[i/8]=parseInt(use.slice(i,i+8),2);
    return bytes;
  }
  function commitOracle(){
    elPhrase.value=entropyToMnemonic(hexBitsToSeed());
    _sealed=true;
    syncFromPhrase();
    raiseUnlock(4, 'Sealed — the oracle cast and sealed the whole reading.');
  }

  // ══ Sync (words ↔ hexagrams) ══
  function syncFromVals(){          // hexagrams → words (reverse direction)
    var words=valsToWords(state.vals);
    elPhrase.value=words.join(' ');
    var r=checkPhrase(words);
    setStatus(r.ok, r.ok?'Valid checksum — a coherent reading':'Lines do not yet cohere (checksum) — keep adjusting');
    refreshDisplays(r);
  }
  function syncFromPhrase(){        // words → hexagrams (forward direction)
    var words=currentWords();
    var r=checkPhrase(words);
    if(words.length && [12,24].indexOf(words.length)>-1 && !words.some(function(w){return !(w in IDX);})){
      state.len=words.length; state.vals=phraseToVals(words); syncLenButtons();
      // sync the cast surface to the phrase either way: a VALID phrase is a
      // sealed reading (open the journey); an invalid one becomes a cast in
      // progress — the suit chooser then offers the seals that would repair it.
      _hexVals=state.vals.slice(0, castFree());
      _lineBits=state.vals.length ? bits(state.vals[0],6).split('').map(Number) : [];
      _sealed=r.ok;
      if(r.ok) raiseUnlock(4, 'A coherent reading — every chapter is open.');
    } else if(words.length){ _sealed=false; }
    setStatus(r.ok, r.ok?'Valid checksum — a coherent reading':('Invalid: '+r.reason));
    refreshDisplays(r);
  }
  function refreshDisplays(r){
    renderLine(); renderStack(); renderHexStat(); renderWeave(); renderSealFig(); renderSuitSeals();
    updateTamperVis(); renderTamperOut(); renderEntropy(); renderAddresses();
    if(r && r.ok){ deriveSeed(elPhrase.value.trim()); seedFinalWordDemo(); }
    else document.getElementById('soSeed').textContent='—';
  }
  function renderAll(){ renderStack(); renderHexStat(); renderWeave(); renderSealFig(); renderSuitSeals(); updateTamperVis(); }

  // ══ Chapter VI — the proof ══
  // The bits under the words: raw entropy (hex + binary) and the checksum,
  // split so entropy + checksum = words × 11. Mirrors iancoleman's entropy view.
  function renderEntropy(){
    var box=document.getElementById('soEntOut'); if(!box) return;
    var words=currentWords();
    var r=checkPhrase(words);
    if(!(r.ok && r.entBytes)){ box.innerHTML='<p class="so-note">Seal a reading above to see its entropy.</p>'; return; }
    var eb=r.entBytes, hex=''; for(var i=0;i<eb.length;i++) hex+=('0'+eb[i].toString(16)).slice(-2);
    var all=phraseToBits(words), entLen=eb.length*8, entBin=all.slice(0,entLen), csBin=all.slice(entLen);
    function grp(s,n){ return s.replace(new RegExp('(.{'+n+'})','g'),'$1 ').trim(); }
    var geo='';
    if (window.GEO_FIGURES && window.GEO_FIG_SVG) {
      geo='<div class="so-ent-geo" aria-hidden="true">'+hex.split('').map(function(d){
        var f=window.GEO_FIGURES[parseInt(d,16)];
        return '<span class="so-ent-geo-cell" title="'+f.name+' · '+d+'">'+window.GEO_FIG_SVG(f.lines,0.85)+
               '<span class="so-ent-geo-d">'+d+'</span></span>';
      }).join('')+'</div>'+
      '<p class="so-note" style="margin-top:var(--space-2)">The same entropy written in the sixteen '+
      'figures — the row below is its alphabet: four lines, four bits, one figure per hex digit.</p>';
    }
    box.innerHTML=
      '<div class="so-ent-row"><span class="so-ent-k">Entropy · hex</span><span class="so-ent-v">'+hex+'</span></div>'+
      '<div class="so-ent-row"><span class="so-ent-k">Entropy · '+entLen+' bits</span><span class="so-ent-v">'+grp(entBin,8)+'</span></div>'+
      '<div class="so-ent-row"><span class="so-ent-k">Checksum · '+csBin.length+' bits</span><span class="so-ent-v so-ent-cs">'+csBin+'</span></div>'+
      '<p class="so-note" style="margin-top:var(--space-2)">'+entLen+' entropy + '+csBin.length+' checksum = '+(entLen+csBin.length)+' bits = '+words.length+' words × 11. The checksum is the leading '+csBin.length+' bits of SHA-256(entropy).</p>'+
      geo;
  }

  // The SHA instrument — hash any hex bytes; highlight the first CS bits so the
  // seal can be checked by hand against the final hexagram's amber lines.
  (function(){
    var inp=document.getElementById('soShaIn'), err=document.getElementById('soShaErr'),
        out=document.getElementById('soShaOut');
    if(!inp) return;
    function entropyHex(){
      var r=checkPhrase(currentWords());
      if(!(r.ok&&r.entBytes)) return '';
      var h=''; for(var i=0;i<r.entBytes.length;i++) h+=('0'+r.entBytes[i].toString(16)).slice(-2);
      return h;
    }
    document.getElementById('soShaFrom').addEventListener('click', function(){
      var h=entropyHex();
      if(h){ inp.value=h; err.textContent=''; } else err.textContent='seal a reading first — then its entropy lands here';
    });
    document.getElementById('soShaGo').addEventListener('click', function(){
      var v=inp.value.trim().toLowerCase().replace(/\s+/g,'');
      if(!v || !/^[0-9a-f]+$/.test(v) || v.length%2){ err.textContent='hex bytes only — an even count of 0-9 a-f'; out.hidden=true; return; }
      err.textContent='';
      var bytes=new Uint8Array(v.length/2);
      for(var i=0;i<v.length;i+=2) bytes[i/2]=parseInt(v.slice(i,i+2),16);
      var h=sha256Bytes(bytes), hex='';
      for(i=0;i<h.length;i++) hex+=('0'+h[i].toString(16)).slice(-2);
      var cs=state.len/3;   // 4 seal bits for 12 words, 8 for 24
      var b8=bits(h[0],8);
      document.getElementById('soShaHex').textContent=hex;
      document.getElementById('soShaBits').innerHTML='<span class="so-sha-hl">'+b8.slice(0,cs)+'</span>'+b8.slice(cs);
      var match=document.getElementById('soShaMatch');
      if(_sealed && v===entropyHex()){
        match.innerHTML='And <span class="so-sha-hl">'+b8.slice(0,cs)+'</span> is exactly your seal — the '+(state.len===12?'top four lines of hexagram twenty-two':'final eight checksum lines')+'. You made both halves of that match.';
      } else {
        match.textContent='The highlighted bits are the seal any '+(state.len===12?'128':'256')+'-bit entropy demands of its final lines.';
      }
      out.hidden=false;
    });
  })();

  // ══ Chapter VII — under the hood: derived addresses (lazy) ══
  // Progressive: show the first receiving address; "See more" lists the first 10
  // (index + truncated address); selecting one loads its full keys into the detail
  // panel. The 64-byte seed is PBKDF2'd once and cached, so the 10 children are
  // cheap to derive and re-derive.
  var _addrToken = 0;
  var _addr = { key:'', buf:null, sel:0, shown:false, off:0 };   // key = phrase|scheme; off = list start index
  var ADDR_COUNT = 10;
  var ADDR_MAX = 2147483647 - ADDR_COUNT;   // BIP32 non-hardened index ceiling
  function addrRow(k,v){ return '<div class="so-addr-row"><span class="so-addr-k">'+k+'</span><span class="so-addr-v">'+v+'</span></div>'; }
  function addrTrunc(s){ return s.length > 30 ? s.slice(0,16)+'…'+s.slice(-8) : s; }
  function addrDetailHTML(a, idx){
    return '<p class="so-note">Receiving address #'+idx+' · '+a.label+' — <code>'+a.path+'</code>. The private key is shown in full; this is a toy, never fund it.</p>'+
      addrRow('Address', a.address)+addrRow('Public key', a.pubkey)+addrRow('Private key (WIF)', a.wif);
  }
  function paintAddr(box){
    if(!_addr.buf) return;
    var scheme=(document.getElementById('soAddrType')||{}).value || 'bip84';
    var a=window.BTC.derive(scheme, _addr.buf, 0, _addr.sel);
    var html=addrDetailHTML(a, _addr.sel);
    html+='<button type="button" class="so-addr-more" data-act="'+(_addr.shown?'less':'more')+'">'+
          (_addr.shown?'Show less ↑':'See more addresses ↓')+'</button>';
    if(_addr.shown){
      var off=_addr.off, rows='';
      for(var i=off;i<off+ADDR_COUNT;i++){
        var ai=window.BTC.derive(scheme, _addr.buf, 0, i);
        rows+='<button type="button" class="so-addr-item'+(i===_addr.sel?' is-sel':'')+'" data-i="'+i+'" aria-pressed="'+(i===_addr.sel?'true':'false')+'">'+
          '<span class="so-addr-idx">'+i+'</span><span class="so-addr-mono">'+addrTrunc(ai.address)+'</span></button>';
      }
      html+='<div class="so-addr-listhead">Receiving addresses — select one to load its keys</div>'+
            '<div class="so-addr-list">'+rows+'</div>'+
            '<div class="so-addr-nav">'+
              '<button type="button" class="so-addr-pg" data-d="-10" aria-label="Previous 10"'+(off<=0?' disabled':'')+'>‹ 10</button>'+
              '<span class="so-addr-range">#'+off+'–#'+(off+ADDR_COUNT-1)+'</span>'+
              '<button type="button" class="so-addr-pg" data-d="10" aria-label="Next 10"'+(off>=ADDR_MAX?' disabled':'')+'>10 ›</button>'+
              '<label class="so-addr-jump">go to #<input type="number" id="soAddrJump" min="0" max="'+ADDR_MAX+'" value="'+off+'" inputmode="numeric" aria-label="Jump to address index"></label>'+
            '</div>';
    }
    box.innerHTML=html;
  }
  function renderAddresses(){
    var det=document.getElementById('soAddrFold'), box=document.getElementById('soAddrOut');
    if(!det || !box || !det.open) return;            // derive only when expanded
    var words=currentWords();
    if(!checkPhrase(words).ok){ box.innerHTML='<p class="so-note">Seal or paste a valid seed to derive its addresses.</p>'; return; }
    if(!window.BTC){ box.innerHTML='<p class="so-note">Derivation module not loaded.</p>'; return; }
    if(!(window.crypto && crypto.subtle)){ box.innerHTML='<p class="so-note">Address derivation needs a secure context (https or localhost).</p>'; return; }
    var scheme=(document.getElementById('soAddrType')||{}).value || 'bip84';
    var phrase=words.join(' '), key=phrase+'|'+scheme;
    if(_addr.key!==key){ _addr.key=key; _addr.sel=0; _addr.shown=false; _addr.buf=null; _addr.off=0; }   // reset on phrase/type change
    if(_addr.buf){ paintAddr(box); return; }                                                  // seed cached → repaint sync
    box.innerHTML='<p class="so-note">Deriving…</p>';
    var token=++_addrToken, enc=new TextEncoder();
    crypto.subtle.importKey('raw', enc.encode(phrase.normalize('NFKD')), {name:'PBKDF2'}, false, ['deriveBits'])
      .then(function(k){ return crypto.subtle.deriveBits({name:'PBKDF2', salt:enc.encode('mnemonic'), iterations:2048, hash:'SHA-512'}, k, 512); })
      .then(function(buf){ if(token!==_addrToken) return; _addr.buf=new Uint8Array(buf); paintAddr(box); })
      .catch(function(){ box.innerHTML='<p class="so-note">Couldn’t derive addresses here.</p>'; });
  }
  (function(){
    var det=document.getElementById('soAddrFold'); if(det) det.addEventListener('toggle', function(){ if(det.open) renderAddresses(); });
    var sel=document.getElementById('soAddrType'); if(sel) sel.addEventListener('change', renderAddresses);
    var box=document.getElementById('soAddrOut');
    function clampOff(n){ return Math.max(0, Math.min(ADDR_MAX, n)); }
    if(box){
      box.addEventListener('click', function(e){
        var act=e.target.closest('[data-act]');
        if(act){ var a=act.getAttribute('data-act'); if(a==='more'){ _addr.shown=true; _addr.off=0; } else { _addr.shown=false; } paintAddr(box); return; }
        var pg=e.target.closest('.so-addr-pg');
        if(pg && !pg.disabled){ _addr.off=clampOff(_addr.off + (+pg.getAttribute('data-d'))); paintAddr(box); return; }
        var item=e.target.closest('.so-addr-item');
        if(item){ _addr.sel=+item.getAttribute('data-i'); paintAddr(box); }
      });
      box.addEventListener('change', function(e){
        var jump=e.target.closest('#soAddrJump'); if(!jump) return;
        var n=parseInt(jump.value,10); if(isNaN(n)) n=0;
        n=clampOff(n); _addr.off=n; _addr.sel=n; paintAddr(box);
      });
    }
  })();

  // ══ hexagram detail popup (shared chrome; shows the judgment) ══
  var _hxLast=null;
  function openHexPopup(val){
    var kw=VAL_TO_KW[val], d=JD[kw]||{};
    document.getElementById('hxFig').innerHTML=hexagramSVG(val,1.75);
    document.getElementById('hxFigNum').textContent=val+' · '+bits(val,6);
    document.getElementById('hxKw').textContent='King Wen '+kw;
    document.getElementById('hxName').innerHTML=escapeHtml(d.name||'')+(d.pinyin?' <span class="hx-pin">'+escapeHtml(d.pinyin)+'</span>':'');
    document.getElementById('hxTrig').textContent=d.trig||'';
    document.getElementById('hxContent').innerHTML='<p class="hx-judgment">'+escapeHtml(d.judgment||'')+'</p>';
    document.getElementById('hxContent').scrollTop=0;
    var ov=document.getElementById('hxOverlay');
    if(!ov.classList.contains('open')){ _hxLast=document.activeElement; ov.classList.add('open'); document.getElementById('hxPopup').focus(); }
  }
  function closeHexPopup(){ document.getElementById('hxOverlay').classList.remove('open'); if(_hxLast&&document.contains(_hxLast))_hxLast.focus(); _hxLast=null; }
  document.getElementById('hxClose').addEventListener('click', closeHexPopup);
  document.getElementById('hxOverlay').addEventListener('click', function(e){ if(e.target===this) closeHexPopup(); });
  document.addEventListener('keydown', function(e){ if(e.key==='Escape' && document.getElementById('hxOverlay').classList.contains('open')) closeHexPopup(); });

  // ══ controls ══
  function syncLenButtons(){ document.querySelectorAll('[data-len]').forEach(function(b){ b.setAttribute('aria-pressed', (+b.dataset.len===state.len)?'true':'false'); }); }
  document.querySelectorAll('[data-len]').forEach(function(b){
    b.addEventListener('click', function(){
      var len=+b.dataset.len;
      if(len===state.len) return;
      state.len=len; syncLenButtons();
      // switching resets the journey surface (a reading is a sitting); the
      // unlocked chapters stay unlocked. At 24 the oracle casts + seals whole.
      _lineBits=[]; _hexVals=[]; _sealed=false; state.vals=[]; elPhrase.value='';
      setStatus(false, len===24 ? 'the oracle casts the long reading…' : '—');
      if(len===24 && CRYPTO_OK){ while(_hexVals.length<44) _hexVals.push(hexRand()); commitOracle(); }
      else renderAll();
      renderLine();
    });
  });
  document.getElementById('soCopy').addEventListener('click', function(){ if(navigator.clipboard) navigator.clipboard.writeText(elPhrase.value); });
  var t; elPhrase.addEventListener('input', function(){ clearTimeout(t); t=setTimeout(syncFromPhrase, 250); });

  // threshold actions
  document.getElementById('soBegin').addEventListener('click', function(){
    raiseUnlock(1, 'Chapter unlocked — one line, one coin');
    scrollToChapter('firstline');
  });
  document.getElementById('soSkip').addEventListener('click', function(){
    raiseUnlock(4, 'Every chapter is open.');
  });
  document.getElementById('soHavePhrase').addEventListener('click', function(){
    raiseUnlock(4, 'Every chapter is open — paste your phrase.');
    scrollToChapter('suitseal');
    setTimeout(function(){ elPhrase.focus(); }, RM?0:450);
  });
  document.getElementById('soCaveatLink').addEventListener('click', function(e){
    e.preventDefault();
    raiseUnlock(4);   // the caution must always be reachable — safety outranks ceremony
    var sec=document.getElementById('learn');
    if(sec && !sec.classList.contains('section-open')) window.toggleSection && window.toggleSection('learn');
    scrollToChapter('learn');
  });

  // The geomancy IIFE (end of file) calls this once its glyph renderer exists,
  // so the entropy readout can pick up its geomantic-figure row on first load.
  window._soGeoReady = function(){ renderEntropy(); };

  // ══ init ══
  function init(){
    // deep link / shared state: a #chapter hash opens the journey through there
    var hash=(location.hash||'').replace('#','');
    var target=CHAPTERS.filter(function(c){ return c.id===hash; })[0];
    if(target && target.lvl>_unlock){ _unlock=target.lvl; try{ localStorage.setItem('seedoracle_unlock', String(_unlock)); }catch(e){} }
    applyGates();
    renderLine(); renderAll();
    if(WL.length!==2048){ setStatus(false,'word list failed to load'); }
    else if(!CRYPTO_OK){
      setStatus(false,'Casting needs secure randomness (crypto.getRandomValues) — please use a current browser');
      ['soLineCast','soHexOne','soHexAll','soOracle'].forEach(function(id){ var b=document.getElementById(id); if(b) b.disabled=true; });
    }
  }
  // Run AFTER site.js's _restoreSections (registered earlier, so it fires first):
  // the gates must win over any saved open/closed section state.
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

// ── Geomancy — the sixteen figures. In v2.0 the row lives in the PROOF chapter
// (it is the legend for the entropy readout: four lines, four bits, one hex
// digit per figure) rather than at the top of the page — same markup, same
// behaviour, relocated to where it is used.
// Each figure is 4 lines read Fire·Air·Water·Earth top to bottom (the
// classical top-down reading order); a single point is active (1), a double
// point is passive (0) — the classical Agrippa/Golden Dawn table. hex = the
// 4 bits read Earth-high..Fire-low as one nibble (bottom line = the biggest
// bit), so the row doubles as this page's entropy alphabet (each figure =
// one hex digit of raw seed entropy) without saying "hex" anywhere in the UI
// itself — that correspondence surfaces only in the detail panel once a
// figure is picked. Bottom-line-is-high deliberately MATCHES this site's own
// I Ching convention (js/iching.js: "bit0(LSB) = top, bit5(MSB) = bottom") —
// an earlier pass had this backwards (Fire/top = high bit), which put every
// figure at a different hex value than it has now; flipped 2026-07-01 once
// that mismatch was flagged. None of this numbering is historical geomancy —
// the figures themselves, their line patterns, and their planetary rulers
// are the traditional Agrippa/Golden Dawn table; assigning them a 0-15 order
// at all is a bridge this project built for the entropy-alphabet framing.
(function () {
  'use strict';
  var GEO_FIGURES = [
    { name: 'Populus',       epithet: 'the People',        lines: [0,0,0,0], ruler: 'Moon',
      keywords: ['Gathering','Reflection','Waiting','the Crowd'],
      text: "A field of people stands before you, each face turned toward whatever moves nearest. You have no shape of your own here, only what surrounds you, so choose the ground with care before you settle into it.\n\nWait before you decide. What looks like emptiness is a gathering, and a gathering takes on the color of its center. Let the right voice reach you before you agree to anything.\n\nLeft alone too long, the crowd forgets what it came for.",
      keynote: 'You take the shape of what surrounds you. Choose the ground well.' },
    { name: 'Laetitia',      epithet: 'Joy',               lines: [1,0,0,0], ruler: 'Jupiter',
      keywords: ['Gladness','Health','Rising','Laughter'],
      text: "Something in you lifts, unforced, the way laughter arrives before you decide to laugh. This favors health returning and spirits rising after a hard stretch.\n\nLet the good mood be evidence, not decoration. When things lighten this easily, take it as a sign the ground beneath you has actually changed for the better.\n\nBrush past it too quickly and you miss what it's telling you about the ground itself.",
      keynote: 'When it lifts this easily, believe the ground has changed.' },
    { name: 'Rubeus',        epithet: 'Red',               lines: [0,1,0,0], ruler: 'Mars',
      keywords: ['Passion','Heat','Conflict','Raw Want'],
      text: "Blood runs hot here, and whatever you feel, you feel it without a filter between you and it. Desire and anger are cut from the same cloth in this figure.\n\nName what you want plainly, then decide with a clear head whether to act on it. Heat serves you when you aim it.\n\nLet it aim itself instead, and it burns whoever stands closest, including you.",
      keynote: 'Name the want before you act on it. Aimed heat serves you.' },
    { name: 'Fortuna Minor', epithet: 'Lesser Fortune',    lines: [1,1,0,0], ruler: 'Sun',
      keywords: ['Swift Change','Fleeting Gain','Departure','the Quick Door'],
      text: "You come through the gate from the outside this time, carrying something that will not stay in your hands for long. This fortune is already moving toward the door.\n\nTake what is offered, use it while it is useful, and don't build your whole plan on it lasting. Swift fortune is still fortune. Spend it well before it spends itself.\n\nHold it too tight, waiting for it to become permanent, and you'll lose the use of it while it's still yours.",
      keynote: 'It is already moving toward the door. Use it before it goes.' },
    { name: 'Albus',         epithet: 'White',             lines: [0,0,1,0], ruler: 'Mercury',
      keywords: ['Calm','Clarity','Peace','Settling Water'],
      text: "The storm has passed and the water stands still enough to show your own face in it. Nothing here needs to move yet.\n\nThink before you act. This figure clears the mind, it does not decide for it, so use the quiet to see plainly rather than to leap. What you plan now in stillness will hold later.\n\nMistake this calm for the whole answer and you'll drift instead of choosing.",
      keynote: 'The water is calm enough to plan by, not yet to act by.' },
    { name: 'Amissio',       epithet: 'Loss',              lines: [1,0,1,0], ruler: 'Venus',
      keywords: ['Letting Go','Outflow','Parting','the Open Palm'],
      text: "What was in your hand is already moving away from it, like water through open fingers. Some things here are not meant to be held.\n\nDon't chase what is leaving. Chasing only speeds the loss and tires you besides. Let it go cleanly and keep your palm open, because this figure empties to make room.\n\nClose the fist around it anyway and you'll bruise your own hand for nothing.",
      keynote: 'It empties to make room. Keep the palm open for what comes next.' },
    { name: 'Conjunctio',    epithet: 'Union',             lines: [0,1,1,0], ruler: 'Mercury',
      keywords: ['Meeting','Joining','Exchange','the Crossroads'],
      text: "Two roads meet here and for a moment they run as one. Whatever you carry, you are about to set it down beside someone else's.\n\nThis favors partnership, negotiation, any place where two things must agree to move together. Speak plainly about what you bring and what you need, and the joining will hold.\n\nStay vague about either one and the roads only look joined, they never actually meet.",
      keynote: "Say plainly what you bring. A joining only holds if both sides know." },
    { name: 'Caput Draconis',epithet: 'Head of the Dragon',lines: [1,1,1,0], ruler: 'North Node',
      keywords: ['Beginning','Threshold','Arrival','the Open Door'],
      text: "A door swings open ahead of you and light comes through it before you've even reached the frame. Something new is arriving, and it arrives well.\n\nStep through while it stands open. This favors fresh starts, arrivals, and the first move in a longer sequence, so treat the moment as an invitation.\n\nStand at the frame testing the floorboards and the door has time to swing shut again.",
      keynote: "The door stands open and arrives well. Step through, don't test it." },
    { name: 'Tristitia',     epithet: 'Sorrow',            lines: [0,0,0,1], ruler: 'Saturn',
      keywords: ['Contraction','Grief','Depth','the Seed Buried'],
      text: "Everything here draws inward and down, the way a hand closes or a door shuts against the cold.\n\nLet what must fall away go. A seed buried works in the dark before it ever shows on the surface. Grieve what needs grieving, then wait for the ground to answer in its own season.\n\nHeld onto too long, this sorrow hardens into a wall instead of a season.",
      keynote: 'What closes now works in the dark. Let it, and wait for the season to turn.' },
    { name: 'Carcer',        epithet: 'Prison',            lines: [1,0,0,1], ruler: 'Saturn',
      keywords: ['Delay','Structure','Confinement','the Walls'],
      text: "Walls stand on every side, and for now they are not moving no matter how hard you push. This figure marks a season of limits, not a life sentence.\n\nUse the confinement instead of fighting it. A cell teaches patience that open ground never will, and every wall in this old system opens on its own schedule.\n\nFight the walls instead of the schedule and you only wear yourself out against stone.",
      keynote: 'The walls keep their own schedule. Learn patience while you wait.' },
    { name: 'Acquisitio',    epithet: 'Gain',              lines: [0,1,0,1], ruler: 'Jupiter',
      keywords: ['Increase','Growth','Reward','the Open Hand'],
      text: "Your hand is out and something is coming to fill it, slowly, the way weight settles into a scale. This favors patient accumulation over the sudden windfall.\n\nSay yes to the offer in front of you, and keep working while it arrives. What grows here grows because you kept tending it, not because you asked once and stopped.\n\nStop tending too soon and the growth stalls before it ever reaches your hand.",
      keynote: 'Keep the hand open and keep tending. This grows slowly and stays.' },
    { name: 'Puer',          epithet: 'the Boy',           lines: [1,1,0,1], ruler: 'Mars',
      keywords: ['Courage','Impulse','Action','Raw Youth'],
      text: "Energy moves fast here, ahead of thought, the way a hand reaches before the mind decides to reach. This favors boldness and quick decisive action.\n\nMove while the nerve is with you, but check your aim first. What this figure gives in courage it can take back in carelessness.\n\nSwing before you look and the same speed that could have served you does the damage instead.",
      keynote: 'Move while the nerve is with you, but look before you swing.' },
    { name: 'Fortuna Major', epithet: 'Greater Fortune',   lines: [0,0,1,1], ruler: 'Sun',
      keywords: ['Triumph','Favor','Entering','Earned Success'],
      text: "You come through the gate from the inside, carrying strength you already built before anyone was watching. What meets you outside only confirms it.\n\nThis fortune is the return on work already done. Walk forward, the door stands open to you. Only remember what let you arrive here, and keep doing it.\n\nForget the work behind it and the fortune reads as luck, then vanishes like luck does.",
      keynote: 'You built this before anyone was watching. Now walk through.' },
    { name: 'Puella',        epithet: 'the Girl',          lines: [1,0,1,1], ruler: 'Venus',
      keywords: ['Grace','Harmony','Gentleness','Beauty'],
      text: "Something here moves soft and unhurried, the way a hand smooths a crease from cloth. This favors charm, affection, and quiet diplomacy over force.\n\nChoose the gentle approach. What force cannot move, grace usually can, and this is a season where softness reads as strength.\n\nMistake the softness for weakness and push harder anyway, and you'll crease the cloth you meant to smooth.",
      keynote: 'Grace moves what force cannot. Choose the soft approach here.' },
    { name: 'Cauda Draconis',epithet: 'Tail of the Dragon',lines: [0,1,1,1], ruler: 'South Node',
      keywords: ['Release','Ending','Closing','Letting Go'],
      text: "A door swings shut behind you, and the room on the other side goes dark. You do not need to see it anymore to know it is finished.\n\nLet this end cleanly. Reaching back for what has already closed only drags a weight you no longer need to carry. Whatever comes next needs both your hands free.\n\nKeep one hand on the closed door and the new thing arrives to find you only half ready.",
      keynote: 'Both hands free. What is finished does not need carrying.' },
    { name: 'Via',           epithet: 'the Way',           lines: [1,1,1,1], ruler: 'Moon',
      keywords: ['Movement','Change','Travel','Restlessness'],
      text: "Nothing here sits still, the ground itself keeps shifting under your feet like a road with no end in sight. This figure marks travel, transition, and change for its own sake.\n\nWalk with the motion instead of fighting it. Whatever this touches will not stay as it is, so plan for change rather than permanence.\n\nDig in and root yourself here anyway, and the moving ground will simply carry you regardless.",
      keynote: 'The ground keeps moving. Plan for change rather than permanence.' }
  ];
  // index in GEO_FIGURES already equals its hex value (0-f); keep a hex string per entry.
  // (order above is bottom-line-is-high binary counting: Earth=bit3, Water=bit2, Air=bit1, Fire=bit0 — see the comment block above this IIFE.)
  GEO_FIGURES.forEach(function (f, i) { f.hex = i.toString(16); });
  window.GEO_FIGURES = GEO_FIGURES;
  // Exposed for the proof chapter's entropy readout (each hex digit drawn as its
  // figure); tell the main IIFE we're ready so it can re-render that row.
  window.GEO_FIG_SVG = geoFigureSVG;
  if (window._soGeoReady) window._soGeoReady();

  // Each figure drawn as 4 stacked rows, one dot per row: a single point
  // reads as a SOLID dot, a double point (passive line) reads as a HOLLOW
  // ring at the same spot — the classical geomantic single-vs-double point
  // distinction, kept legible at any size. An earlier version drew passive
  // lines as two dots spaced side by side (closer to the historical mark),
  // but that needs real width to read; once compressed to fit all sixteen
  // figures on one line on a phone (~12-15px per glyph) the two dots blur
  // into a smear. Fill-vs-stroke on a single dot resolves fine down to a
  // handful of px (like a radio button), so the glyph now needs only ONE
  // dot's worth of width per row instead of two, and the whole row fits at
  // full, uncompressed size even on a 375px-wide phone (verified via the
  // page's live gap/padding values — spare room at every common breakpoint,
  // no shrinking needed). Distinct from the trigram/hexagram solid-vs-broken
  // BAR language used elsewhere on the site, so this still reads as its own
  // system at a glance.
  function geoFigureSVG(lines, size) {
    size = size || 1;
    var r = 3 * size;                    // dot radius
    var sw = Math.max(1, 1.3 * size);    // ring stroke width (passive lines)
    var rowGap = 3 * size;               // vertical gap between the 4 rows
    var d = r * 2;                       // dot diameter
    var totalH = 4 * d + 3 * rowGap;
    var w = d + sw * 2 + size;           // just enough width for one dot + its ring
    var cx = w / 2;
    var dots = [];
    for (var i = 0; i < 4; i++) {
      var cy = i * (d + rowGap) + r;
      if (lines[i] === 1) {
        dots.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--gold)"/>');
      } else {
        dots.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + (r - sw / 2) + '" fill="none" stroke="var(--gold)" stroke-width="' + sw + '"/>');
      }
    }
    return '<svg width="' + w + '" height="' + totalH + '" viewBox="0 0 ' + w + ' ' + totalH + '" aria-hidden="true">' + dots.join('') + '</svg>';
  }

  // The original glyph: a single point drawn as one centred dot, a double
  // point as two dots side by side — the traditional geomantic mark, spatial
  // rather than fill/stroke. Only used for the large detail-panel figure,
  // which is a single glyph with plenty of room, not sixteen packed into a
  // row, so the width this needs is never a constraint there.
  function geoFigureSVGClassic(lines, size) {
    size = size || 1;
    var rowH = 7 * size, gap = 5 * size, w = 15 * size, r = 2.3 * size;
    var totalH = 4 * rowH + 3 * gap;
    var cx = w / 2, offset = w / 4;
    var dots = [];
    for (var i = 0; i < 4; i++) {
      var cy = i * (rowH + gap) + rowH / 2;
      if (lines[i] === 1) {
        dots.push('<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="var(--gold)"/>');
      } else {
        dots.push('<circle cx="' + (cx - offset) + '" cy="' + cy + '" r="' + r + '" fill="var(--gold)"/>');
        dots.push('<circle cx="' + (cx + offset) + '" cy="' + cy + '" r="' + r + '" fill="var(--gold)"/>');
      }
    }
    return '<svg width="' + w + '" height="' + totalH + '" viewBox="0 0 ' + w + ' ' + totalH + '" aria-hidden="true">' + dots.join('') + '</svg>';
  }

  var row = document.getElementById('geo-row');
  if (!row) return;   // row markup not on this build yet

  var pop = document.getElementById('geoPop');
  var dwrap = pop ? pop.querySelector('.so-geo-detailwrap') : null;
  if (dwrap) dwrap.inert = true;
  var cur = -1, cells = [];

  function setActiveCell(idx) {
    cells.forEach(function (c) {
      c.classList.remove('active');
      c.setAttribute('aria-pressed', 'false');
    });
    if (idx >= 0 && cells[idx]) {
      cells[idx].classList.add('active');
      cells[idx].setAttribute('aria-pressed', 'true');
    }
  }

  function show(idx) {
    var f = GEO_FIGURES[idx];
    if (!f) return;
    cur = idx;
    document.getElementById('geoFig').innerHTML = geoFigureSVGClassic(f.lines, 2.2);
    document.getElementById('geoName').textContent = f.name;
    document.getElementById('geoSub').textContent = f.epithet + '  ·  ruled by ' + f.ruler + '  ·  hex ' + f.hex;
    document.getElementById('geoKws').innerHTML = f.keywords.map(function (k) { return '<span class="so-geo-kw">' + k + '</span>'; }).join('');
    document.getElementById('geoText').innerHTML = f.text.split('\n\n').map(function (p) { return '<p>' + p + '</p>'; }).join('');
    document.getElementById('geoKeynote').textContent = f.keynote;
    pop.classList.add('open');
    if (dwrap) dwrap.inert = false;
    setActiveCell(idx);
  }
  function hide() {
    pop.classList.remove('open');
    if (dwrap) dwrap.inert = true;
    setActiveCell(-1);
    cur = -1;
  }
  function pick(idx) { if (cur === idx) hide(); else show(idx); }

  GEO_FIGURES.forEach(function (f, idx) {
    var cell = document.createElement('div');
    cell.className = 'so-geo-cell';
    cell.innerHTML = geoFigureSVG(f.lines, 1);
    cell.setAttribute('role', 'button');
    cell.setAttribute('tabindex', '0');
    cell.setAttribute('aria-pressed', 'false');
    cell.setAttribute('aria-label', f.name + ' — show meaning');
    cell.addEventListener('click', function () { pick(idx); });
    cell.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(idx); return; }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        e.preventDefault();
        var dir = e.key === 'ArrowRight' ? 1 : -1;
        var t = ((cur >= 0 ? cur : idx) + dir + 16) % 16;
        if (cur >= 0) show(t);
        cells[t].focus();
      }
    });
    cells.push(cell); row.appendChild(cell);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && cur >= 0) hide();
  });
})();

// js/ouroboros.js — Ouroboros game logic (ported from the uploaded v1
// snake.html; renamed + wired in as a v2 three-file page, unlocked from
// Celestial Keys via a 3-star run — see js/celestialkeys.js).
(() => {
'use strict';
const canvas = document.getElementById('game'), ctx = canvas.getContext('2d');
const N = 21, CELL = canvas.width / N, W = canvas.width, H = canvas.height;
const scoreEl = document.getElementById('score'), bestEl = document.getElementById('best'),
      sphereEl = document.getElementById('sphere');
const shareBtn = document.getElementById('shareBtn'), shareStatus = document.getElementById('shareStatus');
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

const DIRS = { up:{x:0,y:-1}, down:{x:0,y:1}, left:{x:-1,y:0}, right:{x:1,y:0} };

// ---------- The twelve spheres ----------
const SPHERES = [
  {name:'Aries',      hue:355, el:'fire'},  {name:'Taurus',   hue:140, el:'earth'},
  {name:'Gemini',     hue:55,  el:'air'},   {name:'Cancer',   hue:200, el:'water'},
  {name:'Leo',        hue:35,  el:'fire'},  {name:'Virgo',    hue:115, el:'earth'},
  {name:'Libra',      hue:300, el:'air'},   {name:'Scorpio',  hue:330, el:'water'},
  {name:'Sagittarius',hue:265, el:'fire'},  {name:'Capricorn',hue:175, el:'earth'},
  {name:'Aquarius',   hue:215, el:'air'},   {name:'Pisces',   hue:160, el:'water'}
];
const RULES = {
  fire:  'solar flares — surges, stars doubled',
  earth: 'steady ground — a moment of calm',
  air:   'twin stars — the second fades fast',
  water: 'the tide — side walls flow through',
  water3:'the tide — all walls flow through'
};
const STARS_PER_SPHERE = 8;

// seeded PRNG for per-sphere constellations
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function makeConstellation(seed){
  const r = mulberry32(seed*7919+13);
  const cx = W*(0.25+r()*0.5), cy = H*(0.25+r()*0.5), spread = W*0.22;
  const pts = [];
  const n = 5 + (r()*4|0);
  for (let i=0;i<n;i++) pts.push({x:cx+(r()-0.5)*spread*2, y:cy+(r()-0.5)*spread*2});
  return pts;
}
const constellations = SPHERES.map((_,i)=>makeConstellation(i));

// ---------- Audio: generative pentatonic + ambient pad ----------
let AC=null, master=null, muted=false;
const SCALE = [261.6, 293.7, 329.6, 392.0, 440.0, 523.3, 587.3, 659.3, 784.0, 880.0]; // C pentatonic, 2 octaves
function audio(){
  if (AC) return AC;
  try {
    AC = new (window.AudioContext||window.webkitAudioContext)();
    master = AC.createGain(); master.gain.value = muted?0:0.6; master.connect(AC.destination);
  } catch(e){}
  return AC;
}
function tone(freq, dur, type, vol, slide){
  const ac = audio(); if (!ac || muted) return;
  const o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, ac.currentTime);
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, ac.currentTime+dur);
  g.gain.setValueAtTime(vol, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime+dur);
  o.connect(g); g.connect(master);
  o.start(); o.stop(ac.currentTime+dur);
}
function noteForChain(chain){ // eating plays an ascending melody
  const idx = Math.min(chain-1, SCALE.length-1);
  tone(SCALE[idx], 0.22, 'sine', 0.16);
  tone(SCALE[idx]*2, 0.22, 'sine', 0.05);
}
const sBonus  = ()=>{ tone(660,0.1,'sine',0.15,1320); setTimeout(()=>tone(880,0.12,'sine',0.12,1760),70); };
const sPower  = ()=>{ tone(440,0.3,'triangle',0.13,880); };
const sSphere = ()=>{ [0,120,240].forEach((d,i)=>setTimeout(()=>tone(SCALE[i*2],0.4,'sine',0.1),d)); };
const sDeath  = ()=>{ tone(220,0.6,'sawtooth',0.12,50); tone(110,0.8,'sine',0.1,40); };
function setMuted(m){ muted = m; if (master) master.gain.setTargetAtTime(m?0:0.6, AC.currentTime, 0.05); }

// ---------- State ----------
let mode = 'title'; // title | playing | dead
let snake, prevSnake, dir, queue, food, score, best = 0;
let paused, tickMs, lastTick, particles, floats, shake, foodAge;
let bonus = null;            // {type:'comet'|'moon'|'crystal', x, y, expires}
let chain = 0, lastEat = 0, maxChain = 0;  // combo
let phaseUntil = 0, slowUntil = 0;
let eclipseUntil = 0, lastEclipseScore = 0;
let trail = []; // head afterglow
let deathAt = 0;
let displayHue = SPHERES[0].hue;
let shootingStars = [], nextShoot = 0;

const bgStars = Array.from({length:60}, () => ({
  x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.2+0.3,
  a:Math.random()*0.4+0.1, tw:Math.random()*Math.PI*2, ts:Math.random()*1.5+0.5,
  depth:Math.random()*0.5+0.5
}));

const sphereIndex = ()=> Math.min((score/STARS_PER_SPHERE)|0, SPHERES.length-1);
const element = ()=> quint ? quintElement : SPHERES[sphereIndex()].el;
const tier = ()=> quint ? 3 : (sphereIndex()>>2)+1;   // 1st, 2nd, 3rd visit; Quintessence runs at full tier
const mult = ()=> chain>=8 ? 3 : chain>=4 ? 2 : 1;
const hsl = (h,s,l,a)=>`hsla(${h},${s}%,${l}%,${a==null?1:a})`;

// elemental state
let twin = null;                 // air: {x, y, expires}
let quint = false, quintElement = 'fire', quintStage = 0;  // beyond the twelve
let finaleStart = 0, finaleUntil = 0;
const JOURNEY_END = STARS_PER_SPHERE * SPHERES.length;     // 96 stars completes Pisces
let flareUntil = 0, nextFlare = 0; // fire
let lastSphere = -1;

function cellTaken(x,y){
  return snake.some(s=>s.x===x&&s.y===y) ||
         (food && food.x===x && food.y===y) ||
         (bonus && bonus.x===x && bonus.y===y) ||
         (twin && twin.x===x && twin.y===y);
}

function spawnTwin(now){
  let guard = 200, t = null;
  while (guard--){
    const x=(Math.random()*N)|0, y=(Math.random()*N)|0;
    if (!cellTaken(x,y)){ t={x,y}; break; }
  }
  if (t) twin = {...t, expires: now + 6200 - tier()*800};   // fades faster each visit
}

function enterSphere(now, announce){
  lastSphere = sphereIndex();
  const el = element();
  twin = null; flareUntil = 0;
  if (el==='air') spawnTwin(now);
  if (el==='fire') nextFlare = now + 4000 + Math.random()*3000;
  if (announce){
    sSphere();
    const rule = el==='water' && tier()>=3 ? RULES.water3 : RULES[el];
    floats.push({x:W/2, y:H/2-12, text:'— '+SPHERES[sphereIndex()].name+' —', color:'#a99bff', life:1.8, big:true});
    floats.push({x:W/2, y:H/2+16, text:rule, color:'#7e74b4', life:1.8, big:true});
  }
}

function reset(){
  snake = [{x:10,y:10},{x:9,y:10},{x:8,y:10}];
  prevSnake = snake.map(s=>({...s}));
  dir = DIRS.right; queue = [];
  score = 0; paused = false;
  tickMs = 150; lastTick = performance.now();
  particles = []; floats = []; shake = 0; foodAge = 0;
  bonus = null; chain = 0; lastEat = 0; maxChain = 0; phaseUntil = 0; slowUntil = 0;
  eclipseUntil = 0; lastEclipseScore = 0; trail = [];
  quint = false; quintElement = 'fire'; quintStage = 0; finaleStart = 0; finaleUntil = 0;
  placeFood(); enterSphere(performance.now(), false); updateHud();
  hideShare();
  mode = 'playing';
}

function placeFood(){
  do { food = {x:(Math.random()*N)|0, y:(Math.random()*N)|0}; }
  while (snake.some(s=>s.x===food.x&&s.y===food.y) ||
         (bonus && bonus.x===food.x && bonus.y===food.y) ||
         (twin && twin.x===food.x && twin.y===food.y));
  foodAge = 0;
}

function updateHud(pop){
  scoreEl.textContent = score; bestEl.textContent = best;
  sphereEl.textContent = (mode==='playing' || mode==='dead' || mode==='finale')
    ? (quint ? 'the Quintessence' : SPHERES[sphereIndex()].name) : ' ';
  if (pop && !reduceMotion){
    scoreEl.classList.add('pop');
    setTimeout(()=>scoreEl.classList.remove('pop'),150);
  }
}

function addFloat(gx, gy, text, color){
  floats.push({x:gx*CELL+CELL/2, y:gy*CELL+CELL/2, text, color, life:1});
}

function burst(gx, gy, color, n){
  if (reduceMotion) return;
  const cx = gx*CELL+CELL/2, cy = gy*CELL+CELL/2;
  for (let i=0;i<n;i++){
    const a = Math.random()*Math.PI*2, sp = Math.random()*2.4+0.8;
    particles.push({x:cx,y:cy,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,life:1,color});
  }
}

function spawnBonus(now){
  if (bonus) return;
  let type;
  if (score % 5 === 0) type = 'comet';
  else if (Math.random() < 0.18) type = Math.random()<0.5 ? 'moon' : 'crystal';
  else return;
  let b, guard = 200;
  do { b = {x:(Math.random()*N)|0, y:(Math.random()*N)|0}; }
  while (cellTaken(b.x,b.y) && guard--);
  if (guard > 0) bonus = {...b, type, expires: now + 6500};
}

// every ~20 stars an eclipse falls: darkness beyond your glow, all points doubled
function maybeEclipse(now){
  if (score - lastEclipseScore >= 20 && now > eclipseUntil){
    lastEclipseScore = score;
    eclipseUntil = now + 7000;
    tone(98,0.8,'sine',0.12,49);
    floats.push({x:W/2, y:H/2-30, text:'— eclipse · stars doubled —', color:'#e8ecff', life:1.6, big:true});
  }
}

function die(now){
  mode = 'dead'; deathAt = now;
  best = Math.max(best, score); updateHud();
  saveBest();
  shake = reduceMotion ? 0 : 12;
  sDeath();
  // the serpent dissolves back into stars
  snake.forEach((s,i)=> setTimeout(()=>burst(s.x, s.y, hsl(displayHue,70,75), 6), i*30));
  // reveal the share button alongside the "serpent rests" overlay (~800ms in)
  setTimeout(()=>{ if (mode==='dead') showShare(); }, 850);
}

function step(now){
  if (queue.length){
    const d = queue.shift();
    if (!(d.x===-dir.x && d.y===-dir.y)) dir = d;
  }
  prevSnake = snake.map(s=>({...s}));
  const el = element(), tr = tier();
  const head = {x:snake[0].x+dir.x, y:snake[0].y+dir.y};

  // water: the tide — side walls flow through (all walls at the third visit)
  if (el==='water'){
    head.x = (head.x+N)%N;
    if (tr>=3) head.y = (head.y+N)%N;
  }

  const phasing = now < phaseUntil;
  const eclipsed = now < eclipseUntil;
  const flaring = el==='fire' && now < flareUntil;
  const x2 = (eclipsed?2:1)*(flaring?2:1);
  const tip = snake[snake.length-1];
  const hitTip = head.x===tip.x && head.y===tip.y;

  if (head.x<0 || head.y<0 || head.x>=N || head.y>=N) { die(now); return; }
  // tail tip is never lethal (it vacates as you arrive); mid-body still kills
  if (!phasing && !hitTip &&
      snake.slice(0,-1).some(s=>s.x===head.x&&s.y===head.y)) { die(now); return; }

  // the ouroboros devours its own tail: aim for the tip to trade length for stars
  if (hitTip && !phasing && snake.length > 6){
    snake.unshift(head);
    snake.splice(-3);
    const pts = 4*mult()*x2;
    score += pts;
    tone(330,0.18,'triangle',0.14,165); tone(165,0.25,'sine',0.1,82);
    burst(head.x,head.y,hsl(displayHue,70,80),20);
    addFloat(head.x,head.y,'ouroboros +'+pts, hsl(displayHue,70,80));
    afterScore(now);
    return;
  }

  snake.unshift(head);

  if (bonus && head.x===bonus.x && head.y===bonus.y){
    const b = bonus; bonus = null;
    if (b.type==='comet'){
      const pts = 3*mult()*x2;
      score += pts; sBonus();
      burst(b.x,b.y,'#c89bff',24);
      addFloat(b.x,b.y,'+'+pts,'#c89bff');
      snake.push({...snake[snake.length-1]});
    } else if (b.type==='moon'){
      phaseUntil = now + 7000; score += 1; sPower();
      burst(b.x,b.y,'#e8ecff',20);
      addFloat(b.x,b.y,'phase','#e8ecff');
    } else {
      slowUntil = now + 5000; score += 1; sPower();
      burst(b.x,b.y,'#7ec8ff',20);
      addFloat(b.x,b.y,'slow','#7ec8ff');
    }
    afterScore(now);
  } else if (twin && head.x===twin.x && head.y===twin.y){
    // air: the second star counts like the first, if you reach it in time
    twin = null;
    chain = (now - lastEat < 3500) ? chain+1 : 1;
    maxChain = Math.max(maxChain, chain);
    lastEat = now;
    const pts = 1*mult()*x2;
    score += pts;
    noteForChain(chain);
    burst(head.x,head.y,'#ffd97a',14);
    if (pts>1) addFloat(head.x,head.y,'+'+pts+(mult()>1?' ×'+mult():''),'#ffd97a');
    afterScore(now);
  } else if (head.x===food.x && head.y===food.y){
    chain = (now - lastEat < 3500) ? chain+1 : 1;
    maxChain = Math.max(maxChain, chain);
    lastEat = now;
    const pts = 1*mult()*x2;
    score += pts;
    noteForChain(chain);
    burst(food.x,food.y,'#ffd97a',16);
    if (pts>1) addFloat(food.x,food.y,'+'+pts+(mult()>1?' ×'+mult():''),'#ffd97a');
    placeFood();
    spawnBonus(now);
    if (element()==='air' && !twin) spawnTwin(now);
    // speed gain eases off as the game quickens, so late spheres stay fair
    const spdFloor = quint ? 58 : 68;
    if (tickMs > spdFloor) tickMs -= tickMs > 110 ? 2.2 : tickMs > 88 ? 1.3 : 0.6;
    afterScore(now);
  } else snake.pop();

  if (bonus && now > bonus.expires) bonus = null;
  if (twin && now > twin.expires) twin = null;
  if (now - lastEat > 3500) chain = 0;
}

// runs after every score change: sphere transitions, eclipse checks, HUD
function afterScore(now){
  if (!quint && score >= JOURNEY_END){ startFinale(now); updateHud(true); return; }
  if (quint){
    const stage = ((score - JOURNEY_END) / STARS_PER_SPHERE) | 0;
    if (stage !== quintStage){ quintStage = stage; advanceQuintElement(now); }
  } else if (sphereIndex() !== lastSphere) enterSphere(now, true);
  maybeEclipse(now);
  updateHud(true);
}

// the circle closes: 4 seconds where the ouroboros completes itself
function startFinale(now){
  mode = 'finale'; finaleStart = now; finaleUntil = now + 4200;
  [0,140,280,420,560].forEach((d,i)=> setTimeout(()=>tone(SCALE[i*2],0.5,'sine',0.12), d));
}

const QUINT_CYCLE = ['fire','air','water','earth'];
function advanceQuintElement(now){
  quintElement = QUINT_CYCLE[quintStage % QUINT_CYCLE.length];
  twin = null; flareUntil = 0;
  if (quintElement==='air') spawnTwin(now);
  if (quintElement==='fire') nextFlare = now + 4000 + Math.random()*3000;
  sSphere();
  const rule = quintElement==='water' ? RULES.water3 : RULES[quintElement];
  floats.push({x:W/2, y:H/2-12, text:'— the Quintessence · '+quintElement+' —', color:'#e8d9ff', life:1.8, big:true});
  floats.push({x:W/2, y:H/2+16, text:rule, color:'#7e74b4', life:1.8, big:true});
}

// ---------- Render ----------
function frame(now){
  if (mode==='finale' && now > finaleUntil){
    mode = 'playing'; quint = true; quintStage = 0;
    lastTick = now;            // no catch-up jump after the pause
    advanceQuintElement(now);
    updateHud();
  }
  // fire: schedule flares — a brief telegraphed surge
  if (mode==='playing' && !paused && element()==='fire'){
    if (now > nextFlare){
      flareUntil = now + 3000;
      nextFlare = flareUntil + 5500 + Math.random()*3500;
      tone(180,0.5,'sawtooth',0.07,520);
      addFloat(snake[0].x, snake[0].y, 'flare', '#ffb36b');
    }
  }
  const flaring = element()==='fire' && now < flareUntil && mode==='playing';
  const timeScale = (now < slowUntil ? 1.65 : 1) * (flaring ? 0.74 : 1);
  if (mode==='playing' && !paused && now - lastTick >= tickMs*timeScale){
    step(now); lastTick = now;
  }
  const t = (mode==='playing' && !paused) ? Math.min((now-lastTick)/(tickMs*timeScale),1) : 1;
  draw(t, now);
  requestAnimationFrame(frame);
}

function draw(t, now){
  // hue eases toward current sphere
  const targetHue = quint ? (now/120) % 360 : SPHERES[sphereIndex()].hue;
  let dh = ((targetHue - displayHue + 540) % 360) - 180;
  displayHue = (displayHue + dh*0.03 + 360) % 360;

  ctx.save();
  ctx.clearRect(0,0,W,H);
  if (shake>0){ ctx.translate((Math.random()-0.5)*shake,(Math.random()-0.5)*shake); shake*=0.86; if(shake<0.4)shake=0; }

  // nebula wash tinted by sphere
  const neb = ctx.createRadialGradient(W*0.5,H*0.3,40, W*0.5,H*0.5,W*0.8);
  neb.addColorStop(0, hsl(displayHue,60,30,0.12));
  neb.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = neb; ctx.fillRect(0,0,W,H);

  // background stars (twinkle)
  for (const s of bgStars){
    ctx.globalAlpha = s.a*(reduceMotion?1:0.7+0.3*Math.sin(now/1000*s.ts+s.tw));
    ctx.fillStyle = '#b3a9e8';
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // this sphere's constellation, faint (the closed ring, once beyond the twelve)
  if (mode!=='title' && quint){
    ctx.strokeStyle = hsl(displayHue,50,70,0.1); ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.arc(W/2,H/2,W*0.3,0,Math.PI*2); ctx.stroke();
  } else if (mode!=='title'){
    const pts = constellations[sphereIndex()];
    ctx.strokeStyle = hsl(displayHue,50,70,0.1); ctx.lineWidth = 1;
    ctx.beginPath();
    pts.forEach((p,i)=> i===0?ctx.moveTo(p.x,p.y):ctx.lineTo(p.x,p.y));
    ctx.stroke();
    ctx.fillStyle = hsl(displayHue,50,80,0.22);
    for (const p of pts){ ctx.beginPath(); ctx.arc(p.x,p.y,1.8,0,Math.PI*2); ctx.fill(); }
  }

  // shooting stars
  if (!reduceMotion){
    if (now > nextShoot){
      nextShoot = now + 3500 + Math.random()*6000;
      const fromTop = Math.random()<0.7;
      shootingStars.push({
        x: Math.random()*W, y: fromTop? -10 : Math.random()*H*0.4,
        vx: 2.5+Math.random()*2, vy: 1.5+Math.random()*1.5, life:1
      });
    }
    shootingStars = shootingStars.filter(s=>s.life>0);
    for (const s of shootingStars){
      ctx.strokeStyle = `rgba(220,230,255,${s.life*0.7})`; ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(s.x,s.y); ctx.lineTo(s.x-s.vx*8, s.y-s.vy*8); ctx.stroke();
      s.x+=s.vx; s.y+=s.vy; s.life-=0.012;
    }
  }

  // grid
  ctx.strokeStyle = 'rgba(140,120,220,0.06)'; ctx.lineWidth = 1;
  for (let i=1;i<N;i++){
    ctx.beginPath(); ctx.moveTo(i*CELL,0); ctx.lineTo(i*CELL,H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0,i*CELL); ctx.lineTo(W,i*CELL); ctx.stroke();
  }

  if (mode==='title'){ drawTitle(now); ctx.restore(); return; }

  // water: shimmering edges mark the walls that flow
  if (element()==='water' && mode==='playing'){
    const sh = reduceMotion ? 0.25 : 0.18+0.12*Math.sin(now/400);
    ctx.fillStyle = hsl(displayHue,70,70,sh);
    ctx.fillRect(0,0,3,H); ctx.fillRect(W-3,0,3,H);
    if (tier()>=3){ ctx.fillRect(0,0,W,3); ctx.fillRect(0,H-3,W,3); }
  }

  // fire: flare glow, with a brief warning ramp before it hits
  if (element()==='fire' && mode==='playing'){
    const inFlare = now < flareUntil;
    const warning = !inFlare && now > nextFlare-900;
    if (inFlare || warning){
      const k = inFlare ? Math.min((flareUntil-now)/400, 1, (now-(flareUntil-3000))/250)
                        : (now-(nextFlare-900))/900*0.4;
      edgeGlow('rgba(255,150,80,0.22)', Math.max(k,0));
    }
  }

  // food star
  foodAge += 0.05;
  const pulse = reduceMotion?1:1+0.12*Math.sin(foodAge*2);
  drawStar(food.x*CELL+CELL/2, food.y*CELL+CELL/2, CELL*0.32*pulse, '#ffd97a');

  // air: the twin star, smaller and fading
  if (twin){
    const left = Math.max((twin.expires-now)/4500, 0);
    ctx.globalAlpha = Math.max(0.2, Math.min(left*1.6, 1));
    drawStar(twin.x*CELL+CELL/2, twin.y*CELL+CELL/2, CELL*0.24*pulse, '#ffeebd');
    ctx.globalAlpha = 1;
  }

  // bonus entity
  if (bonus){
    const left = (bonus.expires-now)/6500;
    const cx = bonus.x*CELL+CELL/2, cy = bonus.y*CELL+CELL/2;
    ctx.globalAlpha = Math.max(0.25, Math.min(left*2,1));
    const bp = reduceMotion?1:1+0.18*Math.sin(now/120);
    if (bonus.type==='comet'){
      ctx.fillStyle='#c89bff'; ctx.shadowColor='#c89bff'; ctx.shadowBlur=16;
      ctx.beginPath(); ctx.arc(cx,cy,CELL*0.3*bp,0,Math.PI*2); ctx.fill();
    } else if (bonus.type==='moon'){
      ctx.fillStyle='#e8ecff'; ctx.shadowColor='#e8ecff'; ctx.shadowBlur=14;
      ctx.beginPath(); ctx.arc(cx,cy,CELL*0.3*bp,0,Math.PI*2); ctx.fill();
      ctx.globalCompositeOperation='destination-out';
      ctx.beginPath(); ctx.arc(cx+CELL*0.13,cy-CELL*0.08,CELL*0.24*bp,0,Math.PI*2); ctx.fill();
      ctx.globalCompositeOperation='source-over';
    } else {
      ctx.fillStyle='#7ec8ff'; ctx.shadowColor='#7ec8ff'; ctx.shadowBlur=14;
      ctx.save(); ctx.translate(cx,cy); ctx.rotate(Math.PI/4);
      ctx.fillRect(-CELL*0.22*bp,-CELL*0.22*bp,CELL*0.44*bp,CELL*0.44*bp);
      ctx.restore();
    }
    ctx.shadowBlur=0; ctx.globalAlpha=1;
  }

  // snake
  const phasing = now < phaseUntil;
  const deadFade = mode==='dead' ? Math.max(1-(now-deathAt)/900, 0) : 1;
  let headPx = null;
  if (deadFade > 0){
    const pts = snake.map((s,i)=>{
      const p = prevSnake[i] || prevSnake[prevSnake.length-1] || s;
      // a jump of more than one cell means the tide carried it through a wall — don't interpolate
      const jump = Math.abs(s.x-p.x)>1 || Math.abs(s.y-p.y)>1;
      const q = jump ? s : p;
      return {x:(q.x+(s.x-q.x)*t)*CELL+CELL/2, y:(q.y+(s.y-q.y)*t)*CELL+CELL/2};
    });
    headPx = pts[0];
    // afterglow trail behind the head
    if (!reduceMotion && mode==='playing' && !paused){
      trail.push({x:pts[0].x, y:pts[0].y, life:1});
      if (trail.length > 30) trail.shift();
    }
    for (const p of trail) p.life -= 0.045;
    trail = trail.filter(p=>p.life>0);
    for (const p of trail){
      ctx.globalAlpha = p.life*0.25;
      ctx.fillStyle = hsl(displayHue,70,80);
      ctx.beginPath(); ctx.arc(p.x,p.y,Math.max(CELL*0.3*p.life,0.1),0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    ctx.lineCap='round'; ctx.lineJoin='round';
    const bodyAlpha = (phasing?0.45:1)*deadFade;
    for (let i=pts.length-1;i>0;i--){
      // segments separated by a wall-wrap shouldn't draw a streak across the board
      if (Math.abs(pts[i].x-pts[i-1].x) > CELL*2 || Math.abs(pts[i].y-pts[i-1].y) > CELL*2) continue;
      const k = 1-i/pts.length;
      ctx.strokeStyle = hsl(displayHue,65,68);
      ctx.shadowColor = hsl(displayHue,70,65);
      ctx.shadowBlur = 9;
      ctx.lineWidth = CELL*(0.3+0.28*k);
      ctx.globalAlpha = (0.5+0.5*k)*bodyAlpha;
      ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[i-1].x,pts[i-1].y); ctx.stroke();
    }
    // star nodes along the spine — a living constellation
    ctx.shadowBlur = 0;
    ctx.fillStyle = hsl(displayHue,40,92, 0.9*bodyAlpha);
    for (let i=2;i<pts.length;i+=3){
      ctx.beginPath(); ctx.arc(pts[i].x,pts[i].y,1.6,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = bodyAlpha;
    if (mode!=='dead'){
      const hd = pts[0];
      ctx.fillStyle = hsl(displayHue,55,88);
      ctx.shadowColor = hsl(displayHue,60,85); ctx.shadowBlur = 13;
      ctx.beginPath(); ctx.arc(hd.x,hd.y,CELL*0.36,0,Math.PI*2); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#120c24';
      const ex = dir.y!==0?CELL*0.14:0, ey = dir.x!==0?CELL*0.14:0;
      const fx = dir.x*CELL*0.12, fy = dir.y*CELL*0.12;
      ctx.beginPath(); ctx.arc(hd.x+fx+ex,hd.y+fy+ey,CELL*0.07,0,Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(hd.x+fx-ex,hd.y+fy-ey,CELL*0.07,0,Math.PI*2); ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // particles
  particles = particles.filter(p=>p.life>0);
  for (const p of particles){
    p.x+=p.vx; p.y+=p.vy; p.vx*=0.96; p.vy*=0.96; p.life-=0.022;
    ctx.globalAlpha = Math.max(p.life,0);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x,p.y,2.2,0,Math.PI*2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // eclipse: darkness closes in beyond the serpent's own light
  if (now < eclipseUntil && headPx && mode==='playing'){
    const fadeIn = Math.min((eclipseUntil-now)/600, (now-(eclipseUntil-7000))/600, 1);
    const g = ctx.createRadialGradient(headPx.x, headPx.y, CELL*2.2, headPx.x, headPx.y, CELL*7);
    g.addColorStop(0,'rgba(12,8,32,0)');
    g.addColorStop(1,'rgba(12,8,32,0.88)');
    ctx.globalAlpha = Math.max(fadeIn, 0);
    ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
    ctx.globalAlpha = 1;
  }

  // floating texts
  floats = floats.filter(f=>f.life>0);
  for (const f of floats){
    ctx.globalAlpha = Math.min(f.life,1);
    ctx.fillStyle = f.color;
    ctx.font = f.big ? 'italic 22px Georgia' : '13px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText(f.text, f.x, f.y);
    f.y -= f.big ? 0.15 : 0.5; f.life -= f.big ? 0.008 : 0.02;
  }
  ctx.globalAlpha = 1;

  // active-power edge glows
  if (phasing && mode==='playing'){
    edgeGlow('rgba(232,236,255,0.18)', (phaseUntil-now)/7000);
  }
  if (now < slowUntil && mode==='playing'){
    edgeGlow('rgba(126,200,255,0.18)', (slowUntil-now)/5000);
  }

  // status line: combo
  if (chain >= 4 && mode==='playing'){
    ctx.fillStyle = '#ffd97a'; ctx.font = '13px Georgia'; ctx.textAlign = 'left';
    ctx.fillText('chain '+chain+'  ×'+mult(), 10, H-10);
  }
  // sphere rule reminder
  if (mode==='playing'){
    const el = element();
    const label = el==='fire' ? 'flares' : el==='earth' ? 'steady ground' : el==='air' ? 'twin stars' : 'the tide';
    ctx.fillStyle = 'rgba(126,116,180,0.7)'; ctx.font = 'italic 12px Georgia'; ctx.textAlign = 'right';
    ctx.fillText((quint?'Quintessence':SPHERES[sphereIndex()].name)+' · '+label, W-10, H-10);
  }

  // the finale: the ring closes over the frozen board
  if (mode==='finale'){
    const k = Math.min((now-finaleStart)/2600, 1);            // ring sweep
    const fade = Math.min((now-finaleStart)/500, 1);
    ctx.fillStyle = 'rgba(18,12,36,'+(0.6*fade)+')'; ctx.fillRect(0,0,W,H);
    const cx=W/2, cy=H/2-10, R=70;
    ctx.strokeStyle = hsl(displayHue,65,75,0.95);
    ctx.shadowColor = hsl(displayHue,65,75); ctx.shadowBlur = 16;
    ctx.lineWidth = 8; ctx.lineCap='round';
    ctx.beginPath(); ctx.arc(cx,cy,R, -Math.PI/2, -Math.PI/2 + Math.PI*2*k); ctx.stroke();
    ctx.shadowBlur = 0;
    if (k>=1){
      const flash = Math.max(1-(now-finaleStart-2600)/700, 0);
      if (flash>0){ ctx.fillStyle = 'rgba(255,230,160,'+(0.35*flash)+')'; ctx.fillRect(0,0,W,H); }
      ctx.textAlign='center';
      ctx.fillStyle = '#e8d9ff'; ctx.font = '24px Georgia';
      ctx.fillText('the circle closes', cx, cy+R+44);
      ctx.fillStyle = '#7e74b4'; ctx.font = 'italic 14px Georgia';
      ctx.fillText('beyond the twelve lies the Quintessence', cx, cy+R+68);
    }
  }

  if (paused && mode==='playing') overlay('Paused','P to resume · M to '+(muted?'unmute':'mute'));
  if (mode==='dead' && now-deathAt > 800){
    overlay('The serpent rests',
      score+' stars · best chain '+maxChain+' · '+
      (quint ? 'transcended the twelve' : 'reached '+SPHERES[sphereIndex()].name)+
      ' · space or tap for rebirth');
  }
  ctx.restore();
}

function edgeGlow(color, strength){
  const g = ctx.createRadialGradient(W/2,H/2,W*0.32, W/2,H/2,W*0.62);
  g.addColorStop(0,'rgba(0,0,0,0)');
  g.addColorStop(1,color);
  ctx.globalAlpha = Math.min(strength*2,1);
  ctx.fillStyle = g; ctx.fillRect(0,0,W,H);
  ctx.globalAlpha = 1;
}

function drawTitle(now){
  // ouroboros emblem: ring of star-nodes, head meeting tail
  const cx=W/2, cy=H/2-56, R=56;
  ctx.strokeStyle = hsl(displayHue,60,70,0.8);
  ctx.shadowColor = hsl(displayHue,60,70); ctx.shadowBlur = 12;
  ctx.lineWidth = 7; ctx.lineCap='round';
  const a0 = now/3000;
  ctx.beginPath(); ctx.arc(cx,cy,R, a0, a0+Math.PI*1.86); ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.fillStyle = hsl(displayHue,50,90);
  for (let i=0;i<10;i++){
    const a = a0 + Math.PI*1.86*(i/9);
    ctx.beginPath(); ctx.arc(cx+Math.cos(a)*R, cy+Math.sin(a)*R, 2,0,Math.PI*2); ctx.fill();
  }
  const ha = a0+Math.PI*1.86;
  ctx.beginPath(); ctx.arc(cx+Math.cos(ha)*R, cy+Math.sin(ha)*R, 8,0,Math.PI*2); ctx.fill();

  ctx.textAlign='center';
  ctx.fillStyle = '#cdc9ef'; ctx.font = '24px Georgia';
  ctx.fillText('O U R O B O R O S', cx, cy+R+42);
  ctx.fillStyle = '#6a5f97'; ctx.font = 'italic 13px Georgia';
  ctx.fillText('the serpent that devours the stars', cx, cy+R+64);
  ctx.fillStyle = '#7e74b4'; ctx.font = '12px Georgia';
  const hints = [
    'eat stars · chain them quickly for multipliers',
    'devour your own tail tip for a bonus',
    'each sphere of the zodiac brings its element’s rule',
    'comets, moons and crystals are gifts — take them'
  ];
  hints.forEach((h,i)=> ctx.fillText(h, cx, cy+R+92+i*17));
  ctx.fillStyle = '#6a5f97';
  ctx.globalAlpha = 0.6+0.4*Math.sin(now/500);
  ctx.font = '13px Georgia';
  ctx.fillText('press any key or tap to begin', cx, cy+R+92+hints.length*17+24);
  ctx.globalAlpha = 1;
}

function overlay(big, small){
  ctx.fillStyle = 'rgba(18,12,36,0.75)'; ctx.fillRect(0,0,W,H);
  ctx.textAlign='center';
  ctx.fillStyle = '#cdc9ef'; ctx.font = '24px Georgia';
  ctx.fillText(big, W/2, H/2-12);
  ctx.fillStyle = '#6a5f97'; ctx.font = '14px Georgia';
  ctx.fillText(small, W/2, H/2+18);
}

function drawStar(cx, cy, r, color){
  ctx.fillStyle = color; ctx.shadowColor = color; ctx.shadowBlur = 12;
  ctx.beginPath();
  for (let i=0;i<10;i++){
    const a=(Math.PI/5)*i-Math.PI/2, rad=i%2===0?r:r*0.45;
    const x=cx+Math.cos(a)*rad, y=cy+Math.sin(a)*rad;
    i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);
  }
  ctx.closePath(); ctx.fill(); ctx.shadowBlur=0;
}

// ---------- Input ----------
function setDir(name){
  const d = DIRS[name]; if (!d) return;
  const last = queue.length ? queue[queue.length-1] : dir;
  if (d.x===-last.x && d.y===-last.y) return;
  if (queue.length < 2) queue.push(d);
}
function anyStart(){
  audio();
  if (mode==='title') reset();
  else if (mode==='dead') reset();
}

// ---------- Share your best score ----------
const shareDefaultHTML = shareBtn.innerHTML;
const TICK_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 13l4 4L19 7"/></svg>';
let copiedTimer = 0;

function showShare(){ shareBtn.classList.add('show'); }
function resetShareBtn(){
  clearTimeout(copiedTimer);
  shareBtn.classList.remove('copied');
  shareBtn.innerHTML = shareDefaultHTML;
  shareBtn.setAttribute('aria-label', 'Share your best score');
}
function hideShare(){
  shareBtn.classList.remove('show');
  resetShareBtn();
  shareStatus.classList.remove('show'); shareStatus.textContent = '';
}
function setShareStatus(msg){
  shareStatus.textContent = msg;
  shareStatus.classList.toggle('show', !!msg);
}
// brief "✓ Copied" confirmation on the button itself
function flashCopied(){
  shareBtn.classList.add('copied');
  shareBtn.innerHTML = TICK_SVG + 'Copied';
  shareBtn.setAttribute('aria-label', 'Copied to clipboard');
  clearTimeout(copiedTimer);
  copiedTimer = setTimeout(resetShareBtn, 2200);
}
async function shareScore(){
  const stars = best === 1 ? 'star' : 'stars';
  const text = 'My best in Ouroboros, the cosmic serpent, is ' + best + ' ' + stars + '. Can you outshine me?';
  const url = 'https://mysticscards.space/ouroboros.html';
  if (navigator.share){
    try { await navigator.share({ title:'Ouroboros — mysticscards.space', text, url }); setShareStatus(''); return; }
    catch(e){ if (e && e.name === 'AbortError') return; /* unsupported payload — fall through to copy */ }
  }
  try {
    await navigator.clipboard.writeText(text + ' ' + url);
    flashCopied();
  } catch(e){
    setShareStatus('Copy failed — visit ' + url);
  }
}
shareBtn.addEventListener('click', e=>{ e.stopPropagation(); shareScore(); });

document.addEventListener('keydown', e=>{
  const map = {ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',
               w:'up',s:'down',a:'left',d:'right',W:'up',S:'down',A:'left',D:'right'};
  if (e.key==='m'||e.key==='M'){ audio(); setMuted(!muted); return; }
  if (mode==='title'){ e.preventDefault(); anyStart(); return; }
  if (map[e.key]){ e.preventDefault(); audio(); if (mode==='playing') setDir(map[e.key]); }
  else if (e.key===' '){
    // Space restarts, unless the share button has focus (then it shares).
    if (document.activeElement === shareBtn) return;
    e.preventDefault(); if (mode==='dead') anyStart();
  }
  else if ((e.key==='p'||e.key==='P') && mode==='playing'){ paused=!paused; lastTick=performance.now(); }
});

document.querySelectorAll('.pad button').forEach(b=>
  b.addEventListener('pointerdown', e=>{
    e.preventDefault(); audio();
    if (mode!=='playing') anyStart(); else setDir(b.dataset.dir);
  }));
canvas.addEventListener('pointerdown', ()=>{ if (mode!=='playing') anyStart(); });

let touchStart=null;
canvas.addEventListener('touchstart', e=>{
  // remember if we were already playing, so the tap that *starts* a run
  // doesn't also get read as a turn
  touchStart={x:e.touches[0].clientX, y:e.touches[0].clientY, playing:mode==='playing'};
},{passive:true});
canvas.addEventListener('touchend', e=>{
  if (!touchStart) return;
  const ex=e.changedTouches[0].clientX, ey=e.changedTouches[0].clientY;
  const dx=ex-touchStart.x, dy=ey-touchStart.y;
  if (touchStart.playing && mode==='playing'){
    if (Math.abs(dx)+Math.abs(dy)>24){
      // swipe: turn in the swipe's dominant direction
      setDir(Math.abs(dx)>Math.abs(dy)?(dx>0?'right':'left'):(dy>0?'down':'up'));
    } else {
      // tap: 2x2 quadrant of the canvas — turn toward the tapped corner,
      // resolved against the current heading (only a 90° turn is ever legal).
      // Moving horizontally → tap top/bottom; moving vertically → tap left/right.
      const r=canvas.getBoundingClientRect();
      const qx=ex-(r.left+r.width/2), qy=ey-(r.top+r.height/2);
      const head=queue.length ? queue[queue.length-1] : dir;
      setDir(head.y!==0 ? (qx>0?'right':'left') : (qy>0?'down':'up'));
    }
  }
  touchStart=null;
});

// best score persists via localStorage; silently in-memory if unavailable
function loadBest(){
  try {
    const v = localStorage.getItem('ouroboros-best');
    if (v != null) { best = parseInt(v,10)||0; updateHud(); }
  } catch(e){}
}
function saveBest(){
  try { localStorage.setItem('ouroboros-best', String(best)); } catch(e){}
}

updateHud();
loadBest();
requestAnimationFrame(frame);
})();

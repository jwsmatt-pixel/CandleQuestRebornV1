const $ = id => document.getElementById(id);

const state = loadState();
let activeWorld = 1;
let run = null;
let miniTimer = null;

const worlds = [
  {
    id:1, icon:"Ⅰ", title:"Candle Basics", unlock:0,
    short:"Engulfing, hammer, shooting star and doji.",
    lesson:"Candles show a battle between buyers and sellers. Your first job is not to predict; it is to recognise who tried, who failed, and where the candle closed.",
    rules:["Body = accepted movement between open and close.","Wick = attempted movement that failed to fully hold.","A pattern matters more when it appears at a useful level."],
    patterns:["Bullish Engulfing","Bearish Engulfing","Hammer","Shooting Star","Doji"]
  },
  {
    id:2, icon:"Ⅱ", title:"Levels", unlock:80,
    short:"Support, resistance and midpoint.",
    lesson:"Levels are the map. Candles are the footsteps. A beginner improves fastest by learning whether price is rejecting a level, accepting through it, or chopping around the midpoint.",
    rules:["Support = area buyers defend.","Resistance = area sellers defend.","Midpoint = balance; signals are weaker here."],
    patterns:["Support Reclaim","Resistance Reject","Midpoint Chop","Range Bounce","Level Break"]
  },
  {
    id:3, icon:"Ⅲ", title:"Breakouts", unlock:180,
    short:"Break, hold, fakeout and continuation.",
    lesson:"A breakout is only useful if price accepts beyond the level. Wicks through a level are not enough. Wait for hold, failure, or follow-through.",
    rules:["Clean breakout = close and hold outside range.","Fakeout = break outside then fail back in.","Retest = old level is tested from the other side."],
    patterns:["Clean Breakout","Failed Breakout","Breakdown","Retest Hold","Range Expansion"]
  },
  {
    id:4, icon:"Ⅳ", title:"Trend", unlock:320,
    short:"Higher lows, lower highs and structure.",
    lesson:"Trends are not straight lines. In an uptrend, pullbacks should respect structure. In a downtrend, rallies should fail. Your job is to judge whether structure is respected or broken.",
    rules:["Uptrend = higher lows and stronger pushes.","Downtrend = lower highs and weaker bounces.","Trend break = structure no longer respected."],
    patterns:["Uptrend Continuation","Downtrend Continuation","Trend Break","Pullback Hold","Lower High"]
  },
  {
    id:5, icon:"Ⅴ", title:"Risk Brain", unlock:500,
    short:"No-trade, stops, risk and patience.",
    lesson:"A good read is not always a good trade. The best young traders learn one thing early: protecting capital is part of the game.",
    rules:["No-trade is a valid answer.","Bad reward-to-risk can ruin a good idea.","Process beats prediction."],
    patterns:["Good Read Bad Trade","No-Trade Chop","Stop Too Tight","Stop Too Wide","Clean Plan"]
  }
];

const skins = [
  {id:"classic", name:"Classic Green", price:0, desc:"Bright starter theme."},
  {id:"night", name:"Night Desk", price:160, desc:"Dark trading desk look."},
  {id:"neon", name:"Neon Arcade", price:320, desc:"Energetic late-night mode."},
  {id:"gold", name:"Gold Floor", price:600, desc:"Premium pro-desk feel."}
];

function loadState(){
  try{
    const raw = localStorage.getItem("candleQuestRebornV1");
    if(raw) return Object.assign({xp:0,best:0,skin:"classic",owned:["classic"]}, JSON.parse(raw));
  }catch(e){}
  return {xp:0,best:0,skin:"classic",owned:["classic"]};
}
function saveState(){
  localStorage.setItem("candleQuestRebornV1", JSON.stringify(state));
  $("xpText").textContent = `${state.xp} XP`;
  document.body.dataset.skin = state.skin === "classic" ? "" : state.skin;
}
function openScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");
  if(id==="map") renderMap();
  if(id==="shop") renderShop();
  if(id==="home") drawMini();
}
function renderMap(){
  $("worldGrid").innerHTML = worlds.map(w=>{
    const locked = state.xp < w.unlock;
    return `<div class="world-card ${locked?'locked':''}">
      <div class="world-icon">${locked?'🔒':w.icon}</div>
      <h3>${w.title}</h3>
      <p>${w.short}</p>
      <button ${locked?'disabled':''} onclick="openLesson(${w.id})">${locked?`Unlock at ${w.unlock} XP`:'Study / Play'}</button>
    </div>`;
  }).join("");
}
function openLesson(id){
  const w = worlds.find(x=>x.id===id);
  if(!w || state.xp < w.unlock) return;
  activeWorld = id;
  $("lessonEyebrow").textContent = `World ${id}`;
  $("lessonTitle").textContent = w.title;
  $("lessonBody").textContent = w.lesson;
  $("lessonRules").innerHTML = w.rules.map((r,i)=>`<div class="rule"><b>${i+1}.</b> ${r}</div>`).join("");
  $("lessonPlayBtn").onclick = () => startRun(id);
  openScreen("lesson");
}
function renderShop(){
  $("shopGrid").innerHTML = skins.map(s=>{
    const owned = state.owned.includes(s.id);
    const active = state.skin === s.id || (s.id==="classic" && state.skin==="classic");
    const canBuy = state.xp >= s.price;
    return `<div class="skin-card ${(!owned && !canBuy)?'locked':''}">
      <h3>${s.name}</h3>
      <p>${s.desc}</p>
      <button ${(!owned && !canBuy)?'disabled':''} onclick="${owned?`equipSkin('${s.id}')`:`buySkin('${s.id}')`}">${active?'Equipped':owned?'Equip':`Buy ${s.price} XP`}</button>
    </div>`;
  }).join("");
}
function buySkin(id){
  const s = skins.find(x=>x.id===id);
  if(!s || state.owned.includes(id) || state.xp < s.price) return;
  state.xp -= s.price;
  state.owned.push(id);
  state.skin = id;
  saveState();
  renderShop();
}
function equipSkin(id){
  if(!state.owned.includes(id)) return;
  state.skin = id;
  saveState();
  renderShop();
}

function startRun(worldId=activeWorld){
  activeWorld = worldId;
  const world = worlds.find(w=>w.id===worldId) || worlds[0];
  const startPrice = 100;
  run = {
    world,
    score:0,
    time:90,
    price:startPrice,
    candles:[],
    paused:false,
    current:null,
    nextFreeze: 8,
    combo:0,
    timer:null,
    tick:null,

    // v3 price-action engine:
    // stable levels for the run, rather than recalculating random highs/lows every frame.
    support:startPrice - 6,
    resistance:startPrice + 6,
    midpoint:startPrice,
    regime: world.id >= 4 ? "trend" : "range",
    trendDir: 1,
    trendStrength: world.id >= 4 ? 0.18 : 0.03,
    volatility: world.id >= 5 ? 1.05 : 0.72,
    phase:0
  };
  for(let i=0;i<28;i++) addCandle();
  $("runMode").textContent = world.title;
  $("runHint").textContent = "The chart will freeze. Pick the correct read.";
  $("scoreText").textContent = "0";
  $("timeText").textContent = "90";
  $("answerPad").innerHTML = "";
  $("freezeBanner").classList.add("hidden");
  openScreen("game");
  drawGame();
  run.timer = setInterval(()=>{
    if(!run || run.paused) return;
    run.time--;
    $("timeText").textContent = run.time;
    if(run.time<=0) endRun();
  },1000);
  run.tick = setInterval(()=>{
    if(!run || run.paused) return;
    addCandle();
    run.nextFreeze--;
    if(run.nextFreeze<=0) freezeScenario();
    drawGame();
  },520);
}
function quitRun(){
  if(run){clearInterval(run.timer);clearInterval(run.tick);}
  run=null;
  openScreen("home");
}
function endRun(){
  if(!run) return;
  clearInterval(run.timer);clearInterval(run.tick);
  const earned = Math.max(10, Math.round(run.score/2));
  state.xp += earned;
  state.best = Math.max(state.best, run.score);
  saveState();
  $("finalScore").textContent = run.score;
  $("finalXP").textContent = earned;
  $("finalBest").textContent = state.best;
  $("resultTitle").textContent = run.score>=80 ? "Elite run." : run.score>=55 ? "Solid rep." : "Good warm-up.";
  $("resultBody").textContent = run.score>=80 ? "You are reading context quickly. Keep stacking reps." : run.score>=55 ? "You recognised enough to progress. Try to improve decision speed." : "Focus on one world at a time. Clean reps beat rushing.";
  run=null;
  openScreen("result");
}
function addCandle(forced=null){
  if(!run) return;

  const prev = run.candles.length ? run.candles[run.candles.length-1][3] : run.price;
  let o = prev, c, h, l;

  function clampToWorld(v){
    return Math.max(55, Math.min(145, v));
  }

  function normalCandle(){
    // More realistic baseline behaviour:
    // - In ranges, price mean-reverts near support/resistance.
    // - In trends, price has drift with controlled pullbacks.
    // - Randomness still exists, but it is shaped by market context.
    const distHigh = run.resistance - prev;
    const distLow = prev - run.support;
    let bias = 0;

    if(run.regime === "range"){
      bias = (run.midpoint - prev) * 0.075;
      if(distHigh < 1.8) bias -= 0.42;
      if(distLow < 1.8) bias += 0.42;
    } else {
      bias = run.trendDir * run.trendStrength;
      if(run.phase % 5 === 0) bias *= -1.25;
      if(run.trendDir > 0 && distHigh < 1.2) {
        run.support += 0.45;
        run.resistance += 0.55;
        run.midpoint = (run.support + run.resistance) / 2;
      }
      if(run.trendDir < 0 && distLow < 1.2) {
        run.support -= 0.55;
        run.resistance -= 0.45;
        run.midpoint = (run.support + run.resistance) / 2;
      }
    }

    const noise = (Math.random() - 0.5) * run.volatility;
    const body = bias + noise;
    c = clampToWorld(o + body);

    const wickBase = 0.25 + Math.random() * run.volatility * 0.55;
    h = Math.max(o,c) + wickBase;
    l = Math.min(o,c) - wickBase;

    if(run.regime === "range" && h > run.resistance){
      h = run.resistance + Math.random()*0.8;
      c = Math.min(c, run.resistance - Math.random()*0.7);
    }
    if(run.regime === "range" && l < run.support){
      l = run.support - Math.random()*0.8;
      c = Math.max(c, run.support + Math.random()*0.7);
    }
  }

  if(!forced){
    normalCandle();
  } else {
    const p = forced;
    const R = run.resistance;
    const S = run.support;
    const M = run.midpoint;

    if(p==="Bullish Engulfing"){
      const base = Math.max(S + 1.1, prev - 0.8);
      run.candles.push([base+0.8,base+1.0,base-0.7,base-0.6]);
      o=base-0.8;c=base+1.45;h=c+0.35;l=o-0.4;
    }
    else if(p==="Bearish Engulfing"){
      const base = Math.min(R - 1.1, prev + 0.8);
      run.candles.push([base-0.8,base+0.7,base-1.0,base+0.6]);
      o=base+0.8;c=base-1.45;h=o+0.4;l=c-0.35;
    }
    else if(p==="Hammer"){
      o=S+0.7;c=S+1.45;h=c+0.25;l=S-1.35;
    }
    else if(p==="Shooting Star"){
      o=R-0.7;c=R-1.45;h=R+1.35;l=c-0.25;
    }
    else if(p==="Doji"){
      o=M + (Math.random()-0.5)*0.4;c=o+(Math.random()-0.5)*0.12;h=o+1.05;l=o-1.05;
    }
    else if(p==="Support Reclaim"){
      o=S+0.25;l=S-1.55;c=S+1.45;h=c+0.35;
    }
    else if(p==="Resistance Reject"){
      o=R-0.25;h=R+1.55;c=R-1.45;l=c-0.35;
    }
    else if(p==="Midpoint Chop"||p==="No-Trade Chop"){
      o=M+(Math.random()-0.5)*0.6;c=o+(Math.random()-0.5)*0.45;h=Math.max(o,c)+0.65;l=Math.min(o,c)-0.65;
    }
    else if(p==="Range Bounce"){
      o=S+0.4;l=S-0.55;c=S+2.0;h=c+0.35;
    }
    else if(p==="Level Break"){
      o=R-0.55;c=R+1.8;h=c+0.4;l=o-0.25;
    }
    else if(p==="Clean Breakout"||p==="Range Expansion"){
      o=R-0.45;c=R+2.25;h=c+0.45;l=o-0.3;
      run.support += 1.0; run.resistance += 2.0; run.midpoint=(run.support+run.resistance)/2;
    }
    else if(p==="Failed Breakout"){
      o=R-0.35;h=R+1.9;c=R-1.15;l=c-0.35;
    }
    else if(p==="Breakdown"){
      o=S+0.45;c=S-2.1;h=o+0.35;l=c-0.55;
      run.support -= 1.5; run.resistance -= 0.8; run.midpoint=(run.support+run.resistance)/2;
    }
    else if(p==="Retest Hold"||p==="Pullback Hold"){
      o=R+1.1;l=R-0.25;c=R+1.75;h=c+0.35;
    }
    else if(p==="Uptrend Continuation"){
      run.regime="trend"; run.trendDir=1;
      o=prev-0.35;c=prev+1.45;h=c+0.4;l=o-0.35;
    }
    else if(p==="Downtrend Continuation"){
      run.regime="trend"; run.trendDir=-1;
      o=prev+0.35;c=prev-1.45;h=o+0.4;l=c-0.35;
    }
    else if(p==="Trend Break"){
      run.regime="trend";
      o=prev+0.15;c=prev-2.05;h=o+0.35;l=c-0.55;
      run.trendDir=-1;
    }
    else if(p==="Lower High"){
      run.regime="trend"; run.trendDir=-1;
      o=prev+0.45;h=prev+1.0;c=prev-1.05;l=c-0.35;
    }
    else if(p==="Good Read Bad Trade"||p==="Stop Too Wide"){
      o=M;c=M+1.0;h=c+0.45;l=M-3.2;
    }
    else if(p==="Stop Too Tight"){
      o=M-0.3;c=M+1.0;h=c+0.35;l=o-0.85;
    }
    else if(p==="Clean Plan"){
      o=R-0.55;c=R+2.0;h=c+0.35;l=o-0.45;
    }
    else {
      normalCandle();
    }
  }

  c = clampToWorld(c);
  h = Math.max(h, o, c);
  l = Math.min(l, o, c);
  run.price = c;
  run.phase++;
  run.candles.push([o,h,l,c]);
  while(run.candles.length>42) run.candles.shift();
}

function freezeScenario(){
  const pool = run.world.patterns;
  const answer = pool[Math.floor(Math.random()*pool.length)];
  addCandle(answer);
  run.paused = true;
  run.current = answer;
  $("freezeBanner").classList.remove("hidden");
  const options = shuffle([answer,...shuffle(pool.filter(x=>x!==answer)).slice(0,3)]);
  $("answerPad").innerHTML = options.map(o=>`<button onclick="answer('${o.replace(/'/g,"\\'")}')">${o}</button>`).join("");
  drawGame(true);
}
function answer(label){
  if(!run || !run.current) return;
  const ok = label===run.current;
  if(ok){run.combo++; run.score += 10 + Math.min(10,run.combo*2);}
  else{run.combo=0; run.score = Math.max(0,run.score-5);}
  $("scoreText").textContent = run.score;
  document.querySelectorAll("#answerPad button").forEach(b=>{
    b.disabled=true;
    if(b.textContent===run.current)b.classList.add("correct");
    else if(b.textContent===label)b.classList.add("wrong");
  });
  setTimeout(()=>{
    if(!run) return;
    run.paused=false;
    run.current=null;
    run.nextFreeze=5+Math.floor(Math.random()*5);
    $("freezeBanner").classList.add("hidden");
    $("answerPad").innerHTML="";
  },700);
}

function drawFlatCandle(ctx,x,yO,yH,yL,yC,cw,green){
  const color = green ? "#31c977" : "#ff5b5b";
  const wickColor = green ? "#19a463" : "#e04444";
  const bodyTop = Math.min(yO,yC);
  const bodyBottom = Math.max(yO,yC);
  const bodyH = Math.max(3, bodyBottom - bodyTop);

  const px = Math.round(x) + 0.5;
  const left = Math.round(x - cw/2);
  const top = Math.round(bodyTop);
  const width = Math.max(3, Math.round(cw));
  const height = Math.max(3, Math.round(bodyH));

  ctx.strokeStyle = wickColor;
  ctx.lineWidth = 2;
  ctx.lineCap = "butt";
  ctx.beginPath();
  ctx.moveTo(px, Math.round(yH));
  ctx.lineTo(px, Math.round(yL));
  ctx.stroke();

  ctx.fillStyle = color;
  ctx.fillRect(left, top, width, height);

  ctx.strokeStyle = wickColor;
  ctx.lineWidth = 1;
  ctx.strokeRect(left + 0.5, top + 0.5, width - 1, height - 1);
}

function drawGame(frozen=false){
  const canvas = $("gameCanvas"), ctx = canvas.getContext("2d"), W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--card").trim()==="#ffffff" ? "#101913" : "#0b120e";
  ctx.fillRect(0,0,W,H);
  if(!run) return;
  const values = run.candles.flat(), min=Math.min(...values)-2, max=Math.max(...values)+2;
  const mapY=v=>H-54-((v-min)/(max-min))*(H-100);
  // v2: add future space on the right so the final/question candles do not finish off-screen.
  // This gives the user a right-side bleed like TradingView's bar spacing.
  const futurePad = frozen ? 150 : 105;
  const left = 42;
  const right = W - futurePad;
  const gap = (right-left)/Math.max(1,run.candles.length-1);
  const cw = Math.max(5,Math.min(15,gap*.42));
  ctx.strokeStyle="rgba(255,255,255,.07)";ctx.lineWidth=1;
  for(let y=36;y<H-40;y+=44){ctx.beginPath();ctx.moveTo(24,y);ctx.lineTo(W-24,y);ctx.stroke();}
  // Stable educational levels: use the run's support/resistance anchors.
  // This prevents the levels from jumping around randomly as new candles print.
  const hi = run.resistance;
  const lo = run.support;
  const mid = run.midpoint;
  ctx.setLineDash([8,6]);ctx.lineWidth=2;
  ctx.strokeStyle="#ff9f1c";ctx.beginPath();ctx.moveTo(30,mapY(hi));ctx.lineTo(W-24,mapY(hi));ctx.stroke();
  ctx.strokeStyle="#1cb0f6";ctx.beginPath();ctx.moveTo(30,mapY(lo));ctx.lineTo(W-24,mapY(lo));ctx.stroke();
  ctx.setLineDash([3,6]);ctx.strokeStyle="rgba(142,92,247,.75)";ctx.beginPath();ctx.moveTo(30,mapY(mid));ctx.lineTo(W-24,mapY(mid));ctx.stroke();ctx.setLineDash([]);ctx.fillStyle="rgba(255,255,255,.72)";
  ctx.font="800 11px system-ui";
  ctx.fillText("Range High", 36, mapY(hi)-7);
  ctx.fillText("Midpoint", 36, mapY(mid)-7);
  ctx.fillText("Range Low", 36, mapY(lo)+15);
  
  // Future-space zone: keeps the right edge readable during question freeze.
  ctx.fillStyle = frozen ? "rgba(250,204,21,.08)" : "rgba(255,255,255,.025)";
  round(ctx,right+10,32,W-right-34,H-88,18,true);
  if(frozen){
    ctx.fillStyle="rgba(255,255,255,.78)";
    ctx.font="800 12px system-ui";
    ctx.fillText("answer space", right+26, 58);
  }
  run.candles.forEach((c,i)=>{
    const x=left+i*gap,[o,h,l,cl]=c,green=cl>=o,yO=mapY(o),yH=mapY(h),yL=mapY(l),yC=mapY(cl);
    if(frozen && i>=run.candles.length-3){ctx.fillStyle="rgba(250,204,21,.12)";round(ctx,x-gap*.45,32,gap*.9,H-88,12,true);}
    drawFlatCandle(ctx,x,yO,yH,yL,yC,cw,green);
  });
}
function round(ctx,x,y,w,h,r,fill){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath(); if(fill)ctx.fill(); else ctx.stroke();
}
function shuffle(a){return [...a].sort(()=>Math.random()-.5)}

function drawMini(){
  const c=$("miniCanvas"); if(!c)return; const ctx=c.getContext("2d"); ctx.clearRect(0,0,c.width,c.height);
  ctx.fillStyle="#0b120e";ctx.fillRect(0,0,c.width,c.height);
  let price=100, arr=[]; for(let i=0;i<24;i++){let o=price,c2=o+(Math.random()-.45)*4,h=Math.max(o,c2)+Math.random()*2,l=Math.min(o,c2)-Math.random()*2;arr.push([o,h,l,c2]);price=c2}
  const vals=arr.flat(),min=Math.min(...vals)-2,max=Math.max(...vals)+2,mapY=v=>c.height-30-((v-min)/(max-min))*(c.height-70);
  arr.forEach((d,i)=>{const x=24+i*10,[o,h,l,cl]=d,g=cl>=o,yO=mapY(o),yH=mapY(h),yL=mapY(l),yC=mapY(cl);drawFlatCandle(ctx,x,yO,yH,yL,yC,6,g)})
  ctx.fillStyle="#fff";ctx.font="900 22px system-ui";ctx.fillText("90s Runs",28,54);ctx.font="800 13px system-ui";ctx.fillText("Freeze. Read. Answer.",28,78);
}
setInterval(()=>{if($("home").classList.contains("active"))drawMini()},1800);

saveState();
renderMap();
renderShop();
drawMini();


// iOS/PWA helpers
function dismissInstallTip(){
  localStorage.setItem("candleQuestInstallTipDismissed","1");
  const tip = document.getElementById("installTip");
  if(tip) tip.classList.add("hidden");
}
(function setupIOS(){
  const tip = document.getElementById("installTip");
  const dismissed = localStorage.getItem("candleQuestInstallTipDismissed")==="1";
  const standalone = window.navigator.standalone || window.matchMedia("(display-mode: standalone)").matches;
  if(tip && (dismissed || standalone)) tip.classList.add("hidden");

  let lastTouchEnd = 0;
  document.addEventListener("touchend", function(e){
    const now = Date.now();
    if(now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  }, {passive:false});

  const canvas = document.getElementById("gameCanvas");
  if(canvas){
    canvas.addEventListener("touchmove", function(e){ e.preventDefault(); }, {passive:false});
  }
})();

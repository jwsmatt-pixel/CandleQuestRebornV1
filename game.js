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
  run = {
    world,
    score:0,
    time:90,
    price:100,
    candles:[],
    paused:false,
    current:null,
    nextFreeze: 8,
    combo:0,
    timer:null,
    tick:null
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
  let o=prev, c=prev+(Math.random()-.48)*1.6, h=Math.max(o,c)+Math.random()*0.9, l=Math.min(o,c)-Math.random()*0.9;
  if(forced){
    const p = forced;
    if(p==="Bullish Engulfing"){run.candles.push([prev,prev+.4,prev-1.2,prev-.9]);o=prev-1;c=prev+1.6;h=c+.3;l=o-.4;}
    if(p==="Bearish Engulfing"){run.candles.push([prev,prev+1.2,prev-.4,prev+.9]);o=prev+1;c=prev-1.6;h=o+.4;l=c-.3;}
    if(p==="Hammer"){o=prev-.2;c=o+.6;h=c+.25;l=o-2.4;}
    if(p==="Shooting Star"){o=prev+.2;c=o-.6;h=o+2.4;l=c-.25;}
    if(p==="Doji"){o=prev;c=prev+(Math.random()-.5)*.12;h=prev+1.2;l=prev-1.2;}
    if(p==="Support Reclaim"){o=prev-.4;l=prev-2.5;c=prev+1.2;h=c+.3;}
    if(p==="Resistance Reject"){o=prev+.4;h=prev+2.5;c=prev-1.2;l=c-.3;}
    if(p==="Midpoint Chop"||p==="No-Trade Chop"){o=prev+(Math.random()-.5);c=o+(Math.random()-.5)*.5;h=Math.max(o,c)+.7;l=Math.min(o,c)-.7;}
    if(p==="Clean Breakout"||p==="Range Expansion"){o=prev-.4;c=prev+2.4;h=c+.5;l=o-.4;}
    if(p==="Failed Breakout"){o=prev;h=prev+2.4;c=prev-1.2;l=c-.4;}
    if(p==="Breakdown"){o=prev+.3;c=prev-2.2;h=o+.4;l=c-.6;}
    if(p==="Retest Hold"||p==="Pullback Hold"){o=prev-.8;l=o-.9;c=prev+1.2;h=c+.3;}
    if(p==="Uptrend Continuation"){o=prev-.2;c=prev+1.5;h=c+.4;l=o-.4;}
    if(p==="Downtrend Continuation"){o=prev+.2;c=prev-1.5;h=o+.4;l=c-.4;}
    if(p==="Trend Break"){o=prev+.2;c=prev-2.0;h=o+.4;l=c-.6;}
    if(p==="Lower High"){o=prev+.4;h=prev+1;c=prev-1.1;l=c-.4;}
    if(p==="Good Read Bad Trade"||p==="Stop Too Wide"){o=prev;c=prev+1;h=c+.5;l=prev-3.4;}
    if(p==="Stop Too Tight"){o=prev;c=prev+1.1;h=c+.4;l=prev-.9;}
    if(p==="Clean Plan"){o=prev-.4;c=prev+1.8;h=c+.3;l=o-.5;}
  }
  run.price = c;
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
  const highs=run.candles.slice(0,Math.max(6,run.candles.length-8)).map(c=>c[1]), lows=run.candles.slice(0,Math.max(6,run.candles.length-8)).map(c=>c[2]);
  const hi=Math.max(...highs), lo=Math.min(...lows), mid=(hi+lo)/2;
  ctx.setLineDash([8,6]);ctx.lineWidth=2;
  ctx.strokeStyle="#ff9f1c";ctx.beginPath();ctx.moveTo(30,mapY(hi));ctx.lineTo(W-24,mapY(hi));ctx.stroke();
  ctx.strokeStyle="#1cb0f6";ctx.beginPath();ctx.moveTo(30,mapY(lo));ctx.lineTo(W-24,mapY(lo));ctx.stroke();
  ctx.setLineDash([3,6]);ctx.strokeStyle="rgba(142,92,247,.75)";ctx.beginPath();ctx.moveTo(30,mapY(mid));ctx.lineTo(W-24,mapY(mid));ctx.stroke();ctx.setLineDash([]);
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
    ctx.strokeStyle=green?"#31c977":"#ff5b5b";ctx.fillStyle=green?"#31c977":"#ff5b5b";ctx.lineWidth=2.4;
    ctx.beginPath();ctx.moveTo(x,yH);ctx.lineTo(x,yL);ctx.stroke();
    round(ctx,x-cw/2,Math.min(yO,yC),cw,Math.max(4,Math.abs(yC-yO)),5,true);
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
  arr.forEach((d,i)=>{const x=24+i*10,[o,h,l,cl]=d,g=cl>=o,yO=mapY(o),yH=mapY(h),yL=mapY(l),yC=mapY(cl);ctx.strokeStyle=g?"#31c977":"#ff5b5b";ctx.fillStyle=ctx.strokeStyle;ctx.beginPath();ctx.moveTo(x,yH);ctx.lineTo(x,yL);ctx.stroke();round(ctx,x-3,Math.min(yO,yC),6,Math.max(3,Math.abs(yC-yO)),3,true)})
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

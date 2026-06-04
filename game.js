const CANDLE_QUEST_BUILD = "v23_summary_streak_lost";
console.log("Candle Quest build:", CANDLE_QUEST_BUILD);

function showBuildBadge(){
  if(!document.getElementById("buildBadge")){
    const b = document.createElement("div");
    b.id = "buildBadge";
    b.textContent = "v18 · XP Pop"
    b.style.cssText = "position:fixed;right:10px;bottom:10px;z-index:99999;background:rgba(7,12,9,.86);color:white;border:1px solid rgba(255,255,255,.55);border-radius:999px;padding:6px 10px;font:800 11px system-ui;box-shadow:0 4px 14px rgba(0,0,0,.25);pointer-events:none;";
    document.body.appendChild(b);
  }
}
setTimeout(showBuildBadge, 500);

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
    short:"Support, resistance and channel mean.",
    lesson:"Levels are the map. Candles are the footsteps. A beginner improves fastest by learning whether price is rejecting a level, accepting through it, or chopping around the midpoint.",
    rules:["Support = area buyers defend.","Resistance = area sellers defend.","Channel Mean = the middle of the range; signals are weaker here."],
    patterns:["Support Reclaim","Resistance Reject","Mean Chop","Range Bounce","Level Break"]
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


const patternDefinitions = {
  "Candle Basics": [
    {
      name:"Bullish Engulfing",
      type:"Reversal / strength shift",
      read:"A strong green candle fully takes control after a weaker red candle.",
      location:"Most useful near Range Low, support, or after a sell-side flush.",
      cue:"Sellers pushed first, buyers absorbed it, then closed strong."
    },
    {
      name:"Bearish Engulfing",
      type:"Reversal / weakness shift",
      read:"A strong red candle fully takes control after a weaker green candle.",
      location:"Most useful near Range High, resistance, or after a buy-side push.",
      cue:"Buyers pushed first, sellers absorbed it, then closed weak."
    },
    {
      name:"Hammer",
      type:"Rejection candle",
      read:"A candle with a long lower wick and stronger close, showing rejection below.",
      location:"Best near Range Low or support.",
      cue:"Price probed lower, failed to hold, then buyers reclaimed."
    },
    {
      name:"Shooting Star",
      type:"Rejection candle",
      read:"A candle with a long upper wick and weaker close, showing rejection above.",
      location:"Best near Range High or resistance.",
      cue:"Price probed higher, failed to hold, then sellers pushed back."
    },
    {
      name:"Doji",
      type:"Indecision",
      read:"Open and close are very close together, showing hesitation.",
      location:"More meaningful at key zones than in the middle of nowhere.",
      cue:"Neither side achieved a clear close. Wait for confirmation."
    }
  ],
  "Levels": [
    {
      name:"Support Reclaim",
      type:"Failed breakdown / reclaim",
      read:"Price dips below support or Range Low, then closes back above it.",
      location:"Range Low or support area.",
      cue:"The breakdown failed. Buyers reclaimed the level."
    },
    {
      name:"Resistance Reject",
      type:"Failed breakout / rejection",
      read:"Price pushes into resistance or Range High, then closes back below it.",
      location:"Range High or resistance area.",
      cue:"The breakout attempt failed. Sellers defended the level."
    },
    {
      name:"Mean Chop",
      type:"No-trade / balance",
      read:"Price rotates around the Channel Mean without clean acceptance either way.",
      location:"Middle of the channel.",
      cue:"The market is balanced. Signals are weaker here."
    },
    {
      name:"Range Bounce",
      type:"Rotation",
      read:"Price rejects one edge of the channel and rotates back inward.",
      location:"Range High or Range Low.",
      cue:"The edge held. Expect rotation toward the mean or opposite side."
    },
    {
      name:"Level Break",
      type:"Acceptance attempt",
      read:"Price closes beyond a key channel level with intent.",
      location:"Usually Range High or Range Low.",
      cue:"Do not trust the wick alone. Look for close and hold."
    }
  ],
  "Breakouts": [
    {
      name:"Clean Breakout",
      type:"Expansion",
      read:"Price clearly breaks and closes outside Range High.",
      location:"Range High.",
      cue:"A clean breakout should show acceptance outside the channel, not just a wick."
    },
    {
      name:"Failed Breakout",
      type:"Trap / rejection",
      read:"Price breaks above Range High, then fails back inside the range.",
      location:"Range High.",
      cue:"Late buyers can get trapped when price cannot hold above."
    },
    {
      name:"Breakdown",
      type:"Downside expansion",
      read:"Price closes below Range Low with pressure.",
      location:"Range Low.",
      cue:"Support failed. Watch for continuation or reclaim."
    },
    {
      name:"Retest Hold",
      type:"Continuation confirmation",
      read:"Price breaks a level, returns to test it, and holds from the other side.",
      location:"Old resistance becomes support, or old support becomes resistance.",
      cue:"The retest confirms acceptance."
    },
    {
      name:"Range Expansion",
      type:"Volatility shift",
      read:"Price expands with wider candles and stronger movement, but still remains inside the current channel.",
      location:"Inside the range after compression or quiet movement.",
      cue:"Volatility expanded, but price has not cleanly escaped the range yet."
    }
  ],
  "Trend": [
    {
      name:"Uptrend Continuation",
      type:"Trend follow-through",
      read:"Price keeps forming higher lows and pushes upward after pullbacks.",
      location:"Above Channel Mean or after holding a pullback.",
      cue:"Buyers defend dips and push to new highs."
    },
    {
      name:"Downtrend Continuation",
      type:"Trend follow-through",
      read:"Price keeps forming lower highs and sells off after bounces.",
      location:"Below Channel Mean or after rejecting a bounce.",
      cue:"Sellers defend rallies and push to new lows."
    },
    {
      name:"Pullback Hold",
      type:"Trend support",
      read:"Price pulls back but holds structure before continuing.",
      location:"Trendline, prior breakout, or Channel Mean.",
      cue:"A pullback is healthy if structure holds."
    },
    {
      name:"Lower High",
      type:"Bearish structure",
      read:"Price bounces but fails below the previous high.",
      location:"Often near resistance or below Channel Mean.",
      cue:"Buyers could not reclaim higher ground."
    },
    {
      name:"Trend Break",
      type:"Structure failure",
      read:"Price breaks the pattern of higher lows or lower highs.",
      location:"At a key structure level.",
      cue:"The prior trend is losing control. Wait for confirmation."
    }
  ],
  "Risk Brain": [
    {
      name:"Good Read Bad Trade",
      type:"Execution warning",
      read:"The pattern may be correct, but the entry, stop, or reward-to-risk is poor.",
      location:"Usually after price already moved too far.",
      cue:"A good read is not automatically a good trade."
    },
    {
      name:"No-Trade Chop",
      type:"Patience",
      read:"Price is noisy, balanced, and lacking clean location.",
      location:"Often around Channel Mean.",
      cue:"No-trade is a valid decision."
    },
    {
      name:"Stop Too Tight",
      type:"Risk mistake",
      read:"The stop is placed where normal candle noise can easily hit it.",
      location:"Too close to the entry or inside the setup zone.",
      cue:"Give the idea enough room to breathe."
    },
    {
      name:"Stop Too Wide",
      type:"Risk mistake",
      read:"The stop is so far away that the reward no longer justifies the risk.",
      location:"Usually chasing after a large move.",
      cue:"Good direction with bad risk can still be a bad trade."
    },
    {
      name:"Clean Plan",
      type:"Process",
      read:"Clear location, clear invalidation, and reasonable reward-to-risk.",
      location:"At a key level with a defined setup.",
      cue:"Plan first. Execute second."
    }
  ]
};

function renderLibrary(category="Candle Basics"){
  const tabs = Object.keys(patternDefinitions);
  const tabsEl = $("libraryTabs");
  const grid = $("definitionGrid");
  if(!tabsEl || !grid) return;

  tabsEl.innerHTML = tabs.map(t=>`<button class="${t===category?'active':''}" onclick="renderLibrary('${t}')">${t}</button>`).join("");

  grid.innerHTML = patternDefinitions[category].map((d,i)=>`
    <article class="definition-card">
      <div class="definition-topline">
        <span class="definition-number">${i+1}</span>
        <span class="definition-type">${d.type}</span>
      </div>
      <h3>${d.name}</h3>
      <p><b>Read:</b> ${d.read}</p>
      <p><b>Best location:</b> ${d.location}</p>
      <p class="definition-cue"><b>Quest cue:</b> ${d.cue}</p>
    </article>
  `).join("");
}

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

function pulseXPWallet(){
  const wallet = document.querySelector(".wallet");
  if(!wallet) return;
  wallet.classList.remove("xp-pulse");
  void wallet.offsetWidth;
  wallet.classList.add("xp-pulse");
}

function showXPPop(amount, label="Bonus XP"){
  const wallet = document.querySelector(".wallet");
  if(!wallet || !amount || amount <= 0) return;

  pulseXPWallet();

  const pop = document.createElement("div");
  pop.className = "xp-pop";
  pop.innerHTML = `<b>+${amount} XP</b><span>${label}</span>`;
  wallet.appendChild(pop);

  setTimeout(()=>{
    if(pop && pop.parentNode) pop.parentNode.removeChild(pop);
  },1500);
}


function openScreen(id){
  document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));
  $(id).classList.add("active");
  if(id==="map") renderMap();
  if(id==="shop") renderShop();
  if(id==="library") renderLibrary();
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


const runComments = {
  perfect: [
    "Flawless channel reading. You owned every Quest Moment.",
    "Perfect execution — clean reads, clean pressure, clean run.",
    "Channel mastered. No missed reads. That is elite focus.",
    "Perfect run. You read location and candle behaviour like a pro."
  ],
  elite: [
    "Elite run. You stayed sharp under pressure.",
    "Strong channel awareness. You are reading the setup before the candle.",
    "Great work — your zone recognition is becoming automatic.",
    "Elite pressure response. Keep stacking these clean reps."
  ],
  good: [
    "Good run. You are building the right pattern-recognition base.",
    "Solid effort. Keep reading the channel before choosing the candle.",
    "Good progress — the structure is starting to click.",
    "Nice rep. A few cleaner reads and this becomes elite."
  ],
  badluck: [
    "Bad luck. The reps still count — focus on the channel first.",
    "Tough run, but useful data. Slow the read: zone, candle, answer.",
    "Shake it off. Every missed read teaches what to watch next.",
    "Good attempt. Reset, watch the setup zone, and run it back."
  ]
};

function pickRunComment(correct){
  const bucket = correct >= 10 ? "perfect" : correct >= 7 ? "elite" : correct >= 4 ? "good" : "badluck";
  const arr = runComments[bucket];
  return arr[Math.floor(Math.random()*arr.length)];
}

function updateStreakHud(){
  const hud = document.querySelector(".game-hud");
  if(!hud) return;

  let pill = document.getElementById("streakPill");
  if(!pill){
    pill = document.createElement("div");
    pill.id = "streakPill";
    pill.className = "streak-pill idle";
    hud.appendChild(pill);
  }

  const combo = run ? (run.combo || 0) : 0;
  if(combo >= 2){
    pill.textContent = `${combo}x STREAK`;
    pill.className = "streak-pill hot";
  } else {
    pill.textContent = "STREAK —";
    pill.className = "streak-pill idle";
  }
}



function showScoreXPPop(amount, label="Bonus XP", isPerfect=false){
  if(!run || !amount || amount <= 0) return;

  const scoreEl = $("scoreText");
  if(!scoreEl) return;

  const box = scoreEl.closest ? scoreEl.closest(".hud-stats") : scoreEl.parentElement;
  if(!box) return;

  box.classList.remove("score-xp-pulse");
  void box.offsetWidth;
  box.classList.add("score-xp-pulse");

  const pop = document.createElement("div");
  pop.className = isPerfect ? "score-xp-pop perfect" : "score-xp-pop";
  pop.innerHTML = `<b>+${amount} XP</b><span>${label}</span>`;
  box.appendChild(pop);

  setTimeout(()=>{
    if(pop && pop.parentNode) pop.parentNode.removeChild(pop);
  },1500);
}


function showStreakLost(){
  const hud = document.querySelector(".game-hud");
  if(!hud) return;

  let pill = document.getElementById("streakPill");
  if(!pill){
    pill = document.createElement("div");
    pill.id = "streakPill";
    hud.appendChild(pill);
  }

  pill.textContent = "STREAK LOST";
  pill.className = "streak-pill lost";

  setTimeout(()=>{
    updateStreakHud();
  },900);
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
    nextFreeze: 6,
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
    trendStrength: world.id >= 4 ? 0.26 : 0.05,
    volatility: world.id >= 5 ? 1.35 : (world.id >= 3 ? 1.08 : 0.92),
    phase:0,

    // v7: build-up system. Before a quiz freeze, price transitions toward
    // the relevant level instead of teleporting into the answer candle.
    setupTarget:null,
    setupPattern:null,
    setupSteps:0,
    setupZone:null,

    // v9 price-feel model.
    momentum:0,
    volPulse:0,
    compression:0,
    lastDirection:0,
    edgeMemory:null,
    setupPhase:null,
    setupPulse:0,

    // v15: Quest Moment timer. Replay has no timer;
    // each Quest Moment has 7 seconds.
    questCount:0,
    correctCount:0,
    fastCount:0,
    longestStreak:0,
    maxQuests:10,
    questTime:7,
    questLeft:7,
    questTimer:null
  };
  for(let i=0;i<28;i++) addCandle();
  $("runMode").textContent = world.title;
  $("runHint").textContent = "Watch the replay. Timer starts at Quest Moment.";
  $("scoreText").textContent = "0";
  $("timeText").textContent = "—";
  $("answerPad").innerHTML = "";
  $("freezeBanner").classList.add("hidden");
  openScreen("game");
  drawGame();
  updateStreakHud();
  // v15: No global run timer. The timer starts only at Quest Moment.
  run.timer = null;
  run.tick = setInterval(()=>{
    if(!run || run.paused) return;
    addCandle();
    run.nextFreeze--;
    if(run.nextFreeze<=0) freezeScenario();
    drawGame();
  },520);
}
function quitRun(){
  if(run){clearInterval(run.timer);clearInterval(run.tick);clearInterval(run.questTimer);clearInterval(run.questTimer);}
  run=null;
  openScreen("home");
}
function endRun(){
  if(!run) return;
  clearInterval(run.timer);clearInterval(run.tick);clearInterval(run.questTimer);

  const correct = run.correctCount || 0;
  const maxQ = run.maxQuests || 10;
  const baseXP = Math.max(10, Math.round(run.score/2));
  const perfectBonus = correct >= maxQ ? 50 : 0;
  const fastAnswerBonus = (run.fastCount || 0) * 3;
  const bonusXP = perfectBonus + fastAnswerBonus;
  const earned = baseXP + bonusXP;

  state.xp += earned;
  state.best = Math.max(state.best, run.score);
  saveState();
  if(bonusXP > 0){
    setTimeout(()=>showXPPop(bonusXP, perfectBonus > 0 ? "Perfect + speed bonus" : "Speed bonus"), 350);
  } else {
    setTimeout(()=>pulseXPWallet(), 350);
  }

  $("finalScore").textContent = run.score;
  $("finalXP").textContent = earned;
  $("finalBest").textContent = state.best;

  $("resultTitle").textContent = correct >= 10 ? "PERFECT RUN" : correct >= 7 ? "Elite Run" : correct >= 4 ? "Good Run" : "Bad Luck";

  const runComment = pickRunComment(correct);
  const fastLine = (run.fastCount || 0) > 0 ? `<span class="summary-bonus">⚡ ${run.fastCount} under-2s reads · +${(run.fastCount || 0)*3} XP</span>` : "";
  const perfectLine = correct >= maxQ ? `<span class="summary-bonus perfect">PERFECT BONUS +50 XP</span>` : "";
  const earnedLine = bonusXP > 0 ? `<span class="summary-bonus xp-total">Live bonus XP included: +${bonusXP}</span>` : "";
  $("resultBody").innerHTML = `
    <div class="summary-correct">${correct}/${maxQ}</div>
    <div class="summary-label">correct reads</div>
    <div class="summary-comment">${runComment}</div>
    <div class="summary-meta">Longest streak: ${run.longestStreak || 0}x</div>
    ${fastLine}
    ${perfectLine}
    ${earnedLine}
  `;

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
  function capStep(target, maxStep=2.25){
    const delta = target - o;
    if(delta > maxStep) return o + maxStep;
    if(delta < -maxStep) return o - maxStep;
    return target;
  }
  function targetForPattern(pattern){
    const R = run.resistance, S = run.support, M = run.midpoint;
    const upper = ["Bearish Engulfing","Shooting Star","Resistance Reject","Failed Breakout","Level Break","Clean Breakout","Range Expansion","Retest Hold","Clean Plan"];
    const lower = ["Bullish Engulfing","Hammer","Support Reclaim","Range Bounce","Breakdown"];
    const trend = ["Uptrend Continuation","Downtrend Continuation","Trend Break","Lower High","Pullback Hold"];
    if(upper.includes(pattern)) return R - 0.75;
    if(lower.includes(pattern)) return S + 0.75;
    if(trend.includes(pattern)) return prev + (run.trendDir || 1) * 1.0;
    return M;
  }

  function transitionCandle(){
    const target = run.setupTarget;
    const distance = target - prev;
    const direction = distance === 0 ? 0 : Math.sign(distance);
    const absDist = Math.abs(distance);

    // 9.0 build-up: transition candles should walk toward the setup zone,
    // not jump. The closer price gets, the more it compresses.
    const arrival = absDist < 1.25;
    const baseStep = absDist > 5 ? 1.0 : absDist > 3 ? 0.78 : absDist > 1.25 ? 0.52 : 0.25;
    const step = Math.min(absDist, baseStep + Math.random()*0.22);

    const body = direction * step + (Math.random()-0.5)*(arrival ? 0.12 : 0.18);
    c = clampToWorld(o + body);

    const wick = arrival ? 0.22 + Math.random()*0.22 : 0.28 + Math.random()*0.34;
    h = Math.max(o,c) + wick;
    l = Math.min(o,c) - wick;

    // At arrival, create small hesitation candles before the answer candle.
    if(arrival){
      c = o + (target-o)*0.24 + (Math.random()-0.5)*0.16;
      h = Math.max(o,c) + 0.25;
      l = Math.min(o,c) - 0.25;
    }

    run.momentum = (c-o) * 0.22;
    run.setupPulse = Math.min(1, (run.setupPulse || 0) + 0.15);
  }

  function normalCandle(){
    // v9: Intentional price action feel.
    // The market now alternates between compression, expansion,
    // edge rejection and controlled drift.

    const R = run.resistance;
    const S = run.support;
    const M = run.midpoint;
    const channel = Math.max(1, R - S);
    const pos = (prev - S) / channel;

    // Volatility breathes in waves.
    run.volPulse = Math.max(0, run.volPulse - 0.06);
    if(Math.random() < 0.08) run.volPulse = 0.55 + Math.random()*0.55;

    // Compression occasionally reduces candle size before expansion.
    if(Math.random() < 0.07) run.compression = 2 + Math.floor(Math.random()*3);
    const isCompressed = run.compression > 0;
    if(run.compression > 0) run.compression--;

    let bias = 0;

    if(run.regime === "range"){
      // Mean reversion: stronger at edges, gentle around centre.
      bias += (M - prev) * 0.055;

      // Edge defence with memory so price rejects and rotates,
      // rather than teleporting from one extreme to the other.
      if(pos > 0.82){
        bias -= 0.42 + (pos-0.82)*1.8;
        run.edgeMemory = "high";
      } else if(pos < 0.18){
        bias += 0.42 + (0.18-pos)*1.8;
        run.edgeMemory = "low";
      } else if(run.edgeMemory === "high" && pos > 0.55){
        bias -= 0.16;
      } else if(run.edgeMemory === "low" && pos < 0.45){
        bias += 0.16;
      } else {
        run.edgeMemory = null;
      }
    } else {
      // Trend worlds: drift with a pullback rhythm.
      bias += run.trendDir * run.trendStrength;
      if(run.phase % 6 === 0) bias -= run.trendDir * (0.28 + Math.random()*0.25);

      // Shift channel gradually with trend so price remains framed.
      if(run.trendDir > 0 && pos > 0.74){
        run.support += 0.18;
        run.resistance += 0.22;
        run.midpoint = (run.support + run.resistance) / 2;
      }
      if(run.trendDir < 0 && pos < 0.26){
        run.support -= 0.22;
        run.resistance -= 0.18;
        run.midpoint = (run.support + run.resistance) / 2;
      }
    }

    // Momentum has memory, but decays.
    run.momentum = (run.momentum || 0) * 0.58 + bias * 0.42;

    const vol = run.volatility * (isCompressed ? 0.42 : 0.86 + run.volPulse);
    const noise = (Math.random() - 0.5) * vol;
    let targetBody = run.momentum + noise;

    // Avoid visually dead candles while still controlling jumpiness.
    if(!isCompressed && Math.abs(targetBody) < 0.18){
      targetBody += (Math.random() > 0.5 ? 1 : -1) * 0.18;
    }

    const maxBody = isCompressed ? 0.55 : 1.35 + run.volPulse*0.7;
    if(targetBody > maxBody) targetBody = maxBody;
    if(targetBody < -maxBody) targetBody = -maxBody;

    c = clampToWorld(o + targetBody);

    let upperWick = 0.22 + Math.random()*vol*0.42;
    let lowerWick = 0.22 + Math.random()*vol*0.42;

    // Purposeful rejection wicks at channel extremes.
    if(run.regime === "range" && pos > 0.82){
      upperWick += 0.45 + Math.random()*0.45;
      lowerWick *= 0.75;
    }
    if(run.regime === "range" && pos < 0.18){
      lowerWick += 0.45 + Math.random()*0.45;
      upperWick *= 0.75;
    }

    h = Math.max(o,c) + upperWick;
    l = Math.min(o,c) - lowerWick;

    // Soft channel respect.
    if(run.regime === "range"){
      if(h > R + 1.35){
        h = R + 1.35;
        c = Math.min(c, R - 0.18);
      }
      if(l < S - 1.35){
        l = S - 1.35;
        c = Math.max(c, S + 0.18);
      }
    }

    run.lastDirection = Math.sign(c-o);
  }

  if(!forced && run.setupSteps > 0 && run.setupTarget !== null){
    transitionCandle();
    run.setupSteps--;
  } else if(!forced){
    normalCandle();
  } else {
    const p = forced;
    const R = run.resistance;
    const S = run.support;
    const M = run.midpoint;

    if(p==="Bullish Engulfing"){
      const base = Math.max(S + 1.2, prev - 0.55);
      // Shape the current candle only; avoids double-print gaps.
      o=Math.max(prev-0.7,S+0.45);c=capStep(base+1.25,1.65);h=c+0.34;l=Math.min(o-0.34,S+0.1);
    }
    else if(p==="Bearish Engulfing"){
      const base = Math.min(R - 1.2, prev + 0.55);
      // Shape the current candle only; avoids double-print gaps.
      o=Math.min(prev+0.7,R-0.45);c=capStep(base-1.25,1.65);h=Math.max(o+0.34,R-0.1);l=c-0.34;
    }
    else if(p==="Hammer"){
      o=Math.max(prev-0.35,S+0.45);c=capStep(S+1.2,1.75);h=c+0.28;l=S-1.05;
    }
    else if(p==="Shooting Star"){
      o=Math.min(prev+0.35,R-0.45);c=capStep(R-1.2,1.75);h=R+1.05;l=c-0.28;
    }
    else if(p==="Doji"){
      o=M + (Math.random()-0.5)*0.4;c=o+(Math.random()-0.5)*0.12;h=o+1.05;l=o-1.05;
    }
    else if(p==="Support Reclaim"){
      o=Math.max(prev-0.3,S+0.2);l=S-1.05;c=capStep(S+1.2,1.85);h=c+0.32;
    }
    else if(p==="Resistance Reject"){
      o=Math.min(prev+0.3,R-0.2);h=R+1.05;c=capStep(R-1.2,1.85);l=c-0.32;
    }
    else if(p==="Mean Chop"||p==="No-Trade Chop"){
      o=M+(Math.random()-0.5)*0.6;c=o+(Math.random()-0.5)*0.45;h=Math.max(o,c)+0.65;l=Math.min(o,c)-0.65;
    }
    else if(p==="Range Bounce"){
      o=Math.max(prev-0.25,S+0.35);l=S-0.45;c=capStep(S+1.55,1.95);h=c+0.3;
    }
    else if(p==="Level Break"){
      // Level Break = closes beyond the level, but not as decisively as a clean breakout.
      o=Math.min(prev+0.25,R-0.45);
      c=R+0.85;
      h=c+0.34;
      l=o-0.25;
    }
    else if(p==="Clean Breakout"){
      // Clean Breakout = must visibly clear and close outside Range High.
      // Do not immediately move the range before drawing, or the breakout becomes invisible.
      o=Math.min(prev+0.25,R-0.55);
      c=R+2.15;
      h=c+0.42;
      l=o-0.28;
    }
    else if(p==="Range Expansion"){
      // Range Expansion = wider volatility and stronger movement, but still inside the channel.
      // It should feel like the range is becoming active, not like price has escaped it.
      const direction = prev < run.midpoint ? 1 : -1;
      if(direction > 0){
        o=Math.max(S+1.15, Math.min(prev, R-2.6));
        c=Math.min(R-0.65, o+2.05);
        h=Math.min(R-0.18, c+0.62);
        l=Math.max(S+0.25, o-0.48);
      } else {
        o=Math.min(R-1.15, Math.max(prev, S+2.6));
        c=Math.max(S+0.65, o-2.05);
        h=Math.min(R-0.25, o+0.48);
        l=Math.max(S+0.18, c-0.62);
      }
    }
    else if(p==="Failed Breakout"){
      // Failed Breakout = wick outside Range High, close back inside.
      o=Math.min(prev+0.2,R-0.25);
      h=R+1.35;
      c=R-0.85;
      l=c-0.3;
    }
    else if(p==="Breakdown"){
      // Breakdown = must visibly clear and close outside Range Low.
      o=Math.max(prev-0.2,S+0.55);
      c=S-2.05;
      h=o+0.3;
      l=c-0.46;
    }
    else if(p==="Retest Hold"){
      // Breakout context: hold above the old Range High after a retest.
      // Keep it continuous from the previous close; no vertical gap.
      o=prev;
      l=Math.min(o-0.45, R-0.18);
      c=Math.max(o+0.95, R+0.75);
      h=c+0.32;
    }
    else if(p==="Pullback Hold"){
      // Trend context: pullback holds, then buyers respond.
      // Start from previous close so the candle does not jump across the chart.
      run.regime="trend"; run.trendDir=1;
      o=prev;
      l=o-1.05;
      c=o+1.25;
      h=c+0.34;
    }
    else if(p==="Uptrend Continuation"){
      run.regime="trend"; run.trendDir=1;
      // Larger but continuous bullish trend candle.
      o=prev;
      c=o+1.45;
      h=c+0.36;
      l=o-0.34;
    }
    else if(p==="Downtrend Continuation"){
      run.regime="trend"; run.trendDir=-1;
      // Larger but continuous bearish trend candle.
      o=prev;
      c=o-1.45;
      h=o+0.36;
      l=c-0.34;
    }
    else if(p==="Trend Break"){
      run.regime="trend";
      // Continuous bearish structure break; no gap.
      o=prev;
      c=o-1.75;
      h=o+0.32;
      l=c-0.42;
      run.trendDir=-1;
    }
    else if(p==="Lower High"){
      run.regime="trend"; run.trendDir=-1;
      // Bounce fails from near prior price, then closes weak.
      o=prev;
      h=o+0.82;
      c=o-1.05;
      l=c-0.3;
    }
    else if(p==="Good Read Bad Trade"||p==="Stop Too Wide"){
      o=capStep(M,1.2);c=capStep(M+1.0,1.5);h=c+0.35;l=M-2.2;
    }
    else if(p==="Stop Too Tight"){
      o=capStep(M-0.2,1.0);c=capStep(M+0.95,1.45);h=c+0.3;l=o-0.65;
    }
    else if(p==="Clean Plan"){
      o=Math.min(prev+0.2,R-0.45);c=capStep(R+1.45,1.95);h=c+0.3;l=o-0.35;
    }
    else {
      normalCandle();
    }
  }

  c = clampToWorld(c);
  h = Math.max(h, o, c);
  l = Math.min(l, o, c);
  run.momentum = (c - o) * 0.28;
  run.lastDirection = Math.sign(c-o);
  run.price = c;
  run.phase++;
  run.candles.push([o,h,l,c]);
  while(run.candles.length>42) run.candles.shift();
}


function startQuestTimer(){
  if(!run) return;
  clearInterval(run.questTimer);
  run.questLeft = run.questTime || 7;
  $("timeText").textContent = run.questLeft;

  run.questTimer = setInterval(()=>{
    if(!run || !run.paused || !run.current) return;
    run.questLeft--;
    $("timeText").textContent = run.questLeft;

    if(run.questLeft <= 0){
      clearInterval(run.questTimer);
      timeoutQuestMoment();
    }
  },1000);
}

function stopQuestTimer(){
  if(!run) return;
  clearInterval(run.questTimer);
  run.questTimer = null;
}

function timeoutQuestMoment(){
  if(!run || !run.current) return;

  const lostStreak = (run.combo || 0) >= 2;
  run.combo = 0;
  run.score = Math.max(0, run.score - 5);
  if(lostStreak) showStreakLost();
  $("scoreText").textContent = run.score;
  if(!lostStreak) updateStreakHud();
  $("runHint").textContent = `Time up — answer was ${run.current}.`;

  document.querySelectorAll("#answerPad button").forEach(b=>{
    b.disabled = true;
    if(b.textContent === run.current) b.classList.add("correct");
  });

  setTimeout(()=>finishQuestMoment(),850);
}

function finishQuestMoment(){
  if(!run) return;
  stopQuestTimer();

  run.questCount = (run.questCount || 0) + 1;

  if(run.questCount >= (run.maxQuests || 10)){
    endRun();
    return;
  }

  run.paused = false;
  run.current = null;
  run.setupZone = null;
  run.setupPhase = null;
  run.setupPulse = 0;
  run.nextFreeze = 5 + Math.floor(Math.random()*5);

  $("freezeBanner").classList.add("hidden");
  $("answerPad").innerHTML = "";
  $("timeText").textContent = "—";
  $("runHint").textContent = `Quest ${run.questCount}/${run.maxQuests} complete. Watch the channel for the next setup.`;
}


function freezeScenario(){
  const pool = run.world.patterns;

  // Stage 1: market replays and setup forms. No timer pressure here.
  if(!run.setupPattern){
    run.setupPattern = pool[Math.floor(Math.random()*pool.length)];
    run.setupTarget = getSetupTarget(run.setupPattern);
    run.setupZone = getSetupZone(run.setupPattern);
    run.setupSteps = 4 + Math.floor(Math.random()*2);
    run.setupPhase = "forming";
    run.setupPulse = 1;
    run.nextFreeze = run.setupSteps + 1;
    $("timeText").textContent = "—";
    $("runHint").textContent = "Setup forming — watch how price behaves around the channel.";
    return;
  }

  // Stage 2: Quest Moment. 7-second timer starts here.
  const answer = run.setupPattern;
  addCandle(answer);
  run.paused = true;
  run.current = answer;
  run.setupZone = getSetupZone(answer);
  run.setupPattern = null;
  run.setupTarget = null;
  run.setupSteps = 0;
  run.setupPhase = "quest";

  $("freezeBanner").classList.remove("hidden");
  $("runHint").textContent = `Quest Moment ${run.questCount+1}/${run.maxQuests} — 7 seconds to answer.`;
  const options = shuffle([answer,...shuffle(pool.filter(x=>x!==answer)).slice(0,3)]);
  $("answerPad").innerHTML = options.map(o=>`<button onclick="answer('${o.replace(/'/g,"\\'")}')">${o}</button>`).join("");
  drawGame(true);
  startQuestTimer();
}

function getSetupTarget(pattern){
  if(!run) return 100;
  const R = run.resistance, S = run.support, M = run.midpoint;
  const upper = ["Bearish Engulfing","Shooting Star","Resistance Reject","Failed Breakout","Level Break","Clean Breakout","Range Expansion","Retest Hold","Clean Plan"];
  const lower = ["Bullish Engulfing","Hammer","Support Reclaim","Range Bounce","Breakdown"];
  const trendUp = ["Uptrend Continuation","Pullback Hold"];
  const trendDown = ["Downtrend Continuation","Trend Break","Lower High"];
  if(upper.includes(pattern)) return R - 0.75;
  if(lower.includes(pattern)) return S + 0.75;
  // Trend setups should build near current price/structure, not jump to a channel extreme.
  if(trendUp.includes(pattern)) return run.price + 0.45;
  if(trendDown.includes(pattern)) return run.price - 0.45;
  return M;
}

function getSetupZone(pattern){
  if(!run) return null;
  const R = run.resistance, S = run.support, M = run.midpoint;
  const upper = ["Bearish Engulfing","Shooting Star","Resistance Reject","Failed Breakout","Level Break","Clean Breakout","Range Expansion","Retest Hold","Clean Plan"];
  const lower = ["Bullish Engulfing","Hammer","Support Reclaim","Range Bounce","Breakdown"];
  if(upper.includes(pattern)) return {low:R-1.3, high:R+1.3, label:"setup zone: range high"};
  if(lower.includes(pattern)) return {low:S-1.3, high:S+1.3, label:"setup zone: range low"};
  if(pattern === "Mean Chop" || pattern === "No-Trade Chop" || pattern === "Doji") return {low:M-1.1, high:M+1.1, label:"setup zone: midpoint"};
  return {low:Math.min(run.price-1.2, run.price+1.2), high:Math.max(run.price-1.2, run.price+1.2), label:"setup zone"};
}

function answer(label){
  if(!run || !run.current) return;
  stopQuestTimer();

  const ok = label === run.current;

  if(ok){
    const speedBonus = Math.max(0, run.questLeft || 0);
    const underTwoBonus = (run.questLeft || 0) >= 5 ? 5 : 0;
    run.combo++;
    run.correctCount = (run.correctCount || 0) + 1;
    run.longestStreak = Math.max(run.longestStreak || 0, run.combo || 0);
    if(underTwoBonus){
      run.fastCount = (run.fastCount || 0) + 1;
      showScoreXPPop(3, "Fast read");
    }
    if((run.correctCount || 0) >= (run.maxQuests || 10) && (run.questCount || 0) === ((run.maxQuests || 10) - 1)){
      showScoreXPPop(50, "Perfect run", true);
    }
    run.score += 10 + Math.min(10, run.combo*2) + speedBonus + underTwoBonus;
  } else {
    const lostStreak = (run.combo || 0) >= 2;
    run.combo = 0;
    run.score = Math.max(0, run.score - 5);
    if(lostStreak) showStreakLost();
  }

  $("scoreText").textContent = run.score;
  if(ok) updateStreakHud();
  $("runHint").textContent = ok ? "Correct read — market resumes." : `Wrong read — answer was ${run.current}.`;

  document.querySelectorAll("#answerPad button").forEach(b=>{
    b.disabled = true;
    if(b.textContent === run.current) b.classList.add("correct");
    else if(b.textContent === label) b.classList.add("wrong");
  });

  setTimeout(()=>finishQuestMoment(),750);
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


function drawLevelLabel(ctx,text,x,y,color){
  ctx.save();
  ctx.font="800 11px system-ui";
  const w = ctx.measureText(text).width + 14;
  const h = 20;
  ctx.fillStyle="rgba(7,12,9,.82)";
  ctx.strokeStyle=color;
  ctx.lineWidth=1;
  ctx.beginPath();
  if(ctx.roundRect){
    ctx.roundRect(x,y,w,h,8);
    ctx.fill();
    ctx.stroke();
  } else {
    ctx.fillRect(x,y,w,h);
    ctx.strokeRect(x,y,w,h);
  }
  ctx.fillStyle="#ffffff";
  ctx.fillText(text,x+7,y+14);
  ctx.restore();
}

function drawGame(frozen=false){
  const canvas = $("gameCanvas"), ctx = canvas.getContext("2d"), W=canvas.width, H=canvas.height;
  ctx.clearRect(0,0,W,H);
  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue("--card").trim()==="#ffffff" ? "#101913" : "#0b120e";
  ctx.fillRect(0,0,W,H);
  if(!run) return;
  const candleVals = run.candles.flat();
  // Keep the full educational range in view at all times, while also allowing
  // some overshoot for wicks and breakout candles.
  const visibleMin = Math.min(run.support, ...candleVals);
  const visibleMax = Math.max(run.resistance, ...candleVals);
  const pad = Math.max(1.25, (run.resistance - run.support) * 0.18);
  const min = visibleMin - pad;
  const max = visibleMax + pad;
  const mapY=v=>H-54-((v-min)/(max-min))*(H-100);
  // v2: add future space on the right so the final/question candles do not finish off-screen.
  // This gives the user a right-side bleed like TradingView's bar spacing.
  const futurePad = frozen ? 120 : 88;
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
  // Candle Quest signature channel map:
  // solid white Range High / Range Low, dashed white Channel Mean.
  ctx.lineCap = "butt";
  ctx.shadowColor = "rgba(255,255,255,.28)";
  ctx.shadowBlur = 5;

  ctx.setLineDash([]);
  ctx.lineWidth=3.1;
  ctx.strokeStyle="rgba(255,255,255,.92)";
  ctx.beginPath();ctx.moveTo(30,mapY(hi));ctx.lineTo(W-30,mapY(hi));ctx.stroke();
  ctx.beginPath();ctx.moveTo(30,mapY(lo));ctx.lineTo(W-30,mapY(lo));ctx.stroke();

  ctx.setLineDash([10,8]);
  ctx.lineWidth=2.2;
  ctx.strokeStyle="rgba(255,255,255,.72)";
  ctx.beginPath();ctx.moveTo(30,mapY(mid));ctx.lineTo(W-30,mapY(mid));ctx.stroke();
  ctx.setLineDash([]);
  ctx.shadowBlur = 0;drawLevelLabel(ctx,"Range High",36,mapY(hi)-18,"rgba(255,255,255,.92)");
  drawLevelLabel(ctx,"Channel Mean",36,mapY(mid)-18,"rgba(255,255,255,.72)");
  drawLevelLabel(ctx,"Range Low",36,mapY(lo)+8,"rgba(255,255,255,.92)");
  
  // 9.0 Setup Build: before Quest Moment, the relevant channel area
  // gently lights up so the user learns to watch location before candle shape.
  if(!frozen && run.setupZone && run.setupPhase === "forming"){
    const zTop = mapY(run.setupZone.high);
    const zBottom = mapY(run.setupZone.low);
    const alpha = 0.045 + Math.min(0.08, (run.setupPulse || 0) * 0.08);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fillRect(32, Math.min(zTop,zBottom), W-64, Math.max(7, Math.abs(zBottom-zTop)));
    ctx.strokeStyle = "rgba(255,255,255,.16)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4,6]);
    ctx.strokeRect(32, Math.min(zTop,zBottom), W-64, Math.max(7, Math.abs(zBottom-zTop)));
    ctx.setLineDash([]);
  }

  // Highlight the exact zone the learner should be reading during a freeze.
  if(frozen && run.setupZone){
    const zTop = mapY(run.setupZone.high);
    const zBottom = mapY(run.setupZone.low);
    ctx.fillStyle = "rgba(255,255,255,.10)";
    ctx.strokeStyle = "rgba(255,255,255,.55)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([6,5]);
    ctx.fillRect(32, Math.min(zTop,zBottom), W-64, Math.max(8, Math.abs(zBottom-zTop)));
    ctx.strokeRect(32, Math.min(zTop,zBottom), W-64, Math.max(8, Math.abs(zBottom-zTop)));
    ctx.setLineDash([]);
    ctx.fillStyle = "rgba(12,20,15,.82)";
    ctx.fillRect(42, Math.min(zTop,zBottom)+6, 128, 20);
    ctx.fillStyle = "#fff";
    ctx.font = "800 11px system-ui";
    ctx.fillText(run.setupZone.label.replace("setup zone", "Quest Zone"), 50, Math.min(zTop,zBottom)+20);
  }

  // Future-space zone: keeps the right edge readable during question freeze.
  ctx.fillStyle = frozen ? "rgba(255,255,255,.06)" : "rgba(255,255,255,.018)";
  round(ctx,right+12,40,W-right-42,H-104,16,true);
  if(frozen){
    ctx.fillStyle="rgba(255,255,255,.78)";
    ctx.font="800 12px system-ui";
    ctx.fillText("focus", right+28, 62);
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
renderLibrary();
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

/* =========================================================
   Truth or Dare — Filipino Edition
   ========================================================= */

const TRUTHS = [
  "Sino ang una mong minahal nang hindi mo pa alam ang ibig sabihin ng pag-ibig?",
  "Anong pangalan ang nakasulat sa sulat na hindi mo na naipadala?",
  "Kailan ka huling umiyak dahil sa taong mahal mo — at hindi dahil sa pelikula?",
  "Ano ang huling linya na sinabi mo sa taong minahal mo — may paalam ba o biglaan lang?",
  "Sino ang palaging nasa dulo ng bawat tula na sinulat mo?",
  "Anong alaala mo sa kanya ang ayaw mong limutin, kahit gustong-gusto na?",
  "Gaano katagal bago mo nakalimutan ang taong unang sumira ng puso mo?",
  "Ano ang boses ng dating pag-ibig — pamilyar pa rin ba, o echo na lang?",
  "Sino ang tahimik mong mahal habang maingay ang lahat sa paligid?",
  "Anong pangako mo na hindi mo na tinupad sa huling relasyon mo?",
  "Kung babalik ang isang araw kasama ang dating sinta, anong apat na salita ang sasabihin mo?",
  "Ano ang pinakamatamis na maling desisyon na ginawa ng puso mo?",
  "Sino ang nagnakaw ng isang gabi mo sa panaginip?",
  "Anong kanta ang nagpapaalala sa kanya — at ano ang nararamdaman mo sa unang nota pa lang?",
  "Naging tapat ka ba sa huling pag-ibig mo, o naging tangan lang ng takot?",
  "Anong katagang hindi mo na nabura sa isip mo mula sa huling mensahe niya?",
  "Sino ang huling taong pinagdasal mong sana'y masaya — kahit wala ka na roon?",
  "May tao pa rin ba na kapag binanggit, kumikirot pa ang dibdib mo?",
  "Ano ang paalam na hindi mo nasabi — at hanggang kailan mo ito itatago?",
  "Ano ang unang hinahanap mo pagkagising — siya pa rin ba?",
  "Gaano ka kalakas umibig — hanggang sa mabigo, o hanggang sa matuto?",
  "Anong berso ng buhay mo ang isinulat mo sa kamay ng iba?",
  "Sino ang huling taong tinawag mong 'tahanan'?",
  "Kung ang puso mo ay tula, anong pahina ang pinakamadilim?",
  "Ano ang paborito mong katangian niya na siya mismo ay kinamuhian?",
  "Sinong pangalan ang nakaukit sa bawat tula ng pagsisisi mo?",
  "Mayroon ka bang taong minahal nang lihim — at hanggang ngayon, lihim pa rin?",
  "Ano ang huling beses na sinabi mong 'sana' — at kanino ito binitawan?",
  "Kung ang pag-ibig ay dagat, saan ka na ba nalunod at saan ka natutong lumangoy?",
  "Sino ang taong kahit anong gawin mo, hindi matatanggal sa dulo ng bawat kuwento mo?"
];

const DARES = [
  "Kumanta ng 15 segundo ng kahit anong kanta!",
  "Mag-imagine na ikaw ay manok… tumilaok ng 3 beses!",
  "Tumawa nang malakas nang 5 segundo — walang tigil!",
  "Mag-push-up ng 5 beses (walang kain ng patay!)",
  "Mag-post: “Single ako, DM is welcome!” — buhay ng 1 oras",
  "Gumaya sa ibang tao sa room hanggang sa may makahula",
  "Mag-English nang 30 segundo nang walang tumigil",
  "Palitan ang profile pic mo ng litrato ng kasama mo (24 oras)",
  "Mag-robot dance ng 10 segundo",
  "Sabihin ang pangalan ng crush mo ng 5 beses nang malakas",
  "Mag-step touch ng 10 segundo na may bilis!",
  "Mag-plank ng 15 segundo — walang bibitaw!",
  "Ipakita ang pinakahuling litrato sa gallery mo sa lahat",
  "Mag-lipsync ng isang verse ng kanta",
  "Gumawa ng haiku (5-7-5) tungkol sa kasama mo",
  "Sabihin ang isang nakakahiya mong karanasan sa 1 minuto",
  "I-serve ang katabi mo ng tubig nang may bow 🙇",
  "Mag-comment ng “Ang ganda/gwapo mo” sa unang post ng feed mo",
  "Tumakbo nang mabilis sa loob ng bahay ng 2 beses",
  "Sabihin nang malakas: “Ang gwapo/ganda ko!” nang 3 beses",
  "Mag-taglish dialogue mag-isa nang 20 segundo",
  "Ipakita ang pinaka-unang text message sa crush mo",
  "Gumawa ng 3 mukha — kukunan ng picture ng kasama mo",
  "Kumain ng isang kutsarang asukal nang walang tubig",
  "Magsalita gamit ang boses ng robot hanggang sa sumunod na turn mo",
  "Mag-sayaw ng 10 segundo na walang music",
  "I-text ang bestfriend mo ng “Mahal kita” — ipakita ang reply",
  "Mag-pose ng modelo ng 10 segundo sa gitna ng sala",
  "Hulaan kung sino ang unang matutulog dito tonight",
  "Palitan ang pangalan mo sa phone ng kasama mo hanggang mamaya"
];

/* ---------------- State ---------------- */
const state = {
  players: [],
  current: 0,
  round: 1,
  scores: {},
  usedTruth: new Set(),
  usedDare: new Set(),
  pendingType: null
};

/* ---------------- Elements ---------------- */
const $ = (id) => document.getElementById(id);

const screens = {
  setup: $("screenSetup"),
  game: $("screenGame")
};

const playerForm = $("playerForm");
const playerInput = $("playerInput");
const playerList = $("playerList");
const startBtn = $("startBtn");
const quickStart = $("quickStart");
const setupHint = $("setupHint");

const turnName = $("turnName");
const roundLabel = $("roundLabel");
const gameCard = $("gameCard");
const cardFront = $("cardFront");
const cardBadge = $("cardBadge");
const cardText = $("cardText");
const choiceRow = $("choiceRow");
const actionRow = $("actionRow");
const hostPanel = $("hostPanel");
const hostForm = $("hostForm");
const hostInput = $("hostInput");
const waitingText = $("waitingText");
const doneBtn = $("doneBtn");
const passBtn = $("passBtn");
const nextBtn = $("nextBtn");
const scoreOverlay = $("scoreOverlay");
const scoreList = $("scoreList");

/* ---------------- Helpers ---------------- */
function show(name) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[name].classList.add("active");
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function confetti(count = 60) {
  const layer = $("confettiLayer");
  const colors = ["#ff5e7e", "#ffd166", "#06d6a0", "#4cc9f0", "#9b5de5", "#ffffff"];
  for (let i = 0; i < count; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.style.left = Math.random() * 100 + "vw";
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    bit.style.animationDuration = 2 + Math.random() * 2.5 + "s";
    bit.style.animationDelay = Math.random() * 0.4 + "s";
    bit.style.transform = `rotate(${Math.random() * 360}deg)`;
    layer.appendChild(bit);
    setTimeout(() => bit.remove(), 5200);
  }
}

function beep(freq = 520, dur = 0.12) {
  try {
    const ctx = beep.ctx || (beep.ctx = new (window.AudioContext || window.webkitAudioContext)());
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.02);
  } catch (_) { /* audio not available */ }
}

/* ---------------- Setup ---------------- */
function renderPlayers() {
  playerList.innerHTML = "";
  state.players.forEach((name, i) => {
    const li = document.createElement("li");
    li.className = "player-chip";

    const label = document.createElement("span");
    label.textContent = `${i + 1}. ${name}`;

    const del = document.createElement("button");
    del.type = "button";
    del.textContent = "×";
    del.setAttribute("aria-label", `Alisin si ${name}`);
    del.addEventListener("click", () => {
      state.players.splice(i, 1);
      delete state.scores[name];
      renderPlayers();
    });

    li.append(label, del);
    playerList.appendChild(li);
  });

  const enough = state.players.length >= 2;
  startBtn.disabled = !enough;
  setupHint.textContent = enough
    ? `Handa na ang ${state.players.length} manlalaro! Simulan mo na. 🔥`
    : "Kailangan ng hindi bababa sa 2 manlalaro.";
}

playerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = playerInput.value.trim();
  if (!name) return;
  if (state.players.some((p) => p.toLowerCase() === name.toLowerCase())) {
    setupHint.textContent = "Uy, may ganyan nang pangalan. Iba naman!";
    return;
  }
  if (state.players.length >= 8) {
    setupHint.textContent = "8 players na max — sobra na yan, party na yan!";
    return;
  }
  state.players.push(name);
  state.scores[name] = 0;
  playerInput.value = "";
  playerInput.focus();
  beep(660, 0.08);
  renderPlayers();
});

quickStart.addEventListener("click", () => {
  state.players = ["Ikaw", "Katabi"];
  state.scores = { Ikaw: 0, Katabi: 0 };
  renderPlayers();
  startGame();
});

startBtn.addEventListener("click", startGame);

/* ---------------- Game flow ---------------- */
function startGame() {
  if (state.players.length < 2) return;
  state.current = 0;
  state.round = 1;
  state.usedTruth.clear();
  state.usedDare.clear();
  state.players.forEach((p) => (state.scores[p] = 0));
  show("game");
  resetCard();
  updateTurnUI();
  confetti(40);
}

function updateTurnUI() {
  turnName.textContent = state.players[state.current];
  roundLabel.textContent = `Round ${state.round}`;
}

function resetCard() {
  state.pendingType = null;
  gameCard.classList.remove("flipped");
  choiceRow.classList.remove("hidden");
  actionRow.classList.add("hidden");
  hostPanel.classList.add("hidden");
  hostInput.value = "";
}

/* Player only picks T or D — card stays hidden until the host's command */
function chooseType(type) {
  state.pendingType = type;
  beep(type === "truth" ? 740 : 300, 0.16);
  choiceRow.classList.add("hidden");
  hostPanel.classList.remove("hidden");
  waitingText.textContent = `⏳ ${state.players[state.current]}, hintayin mo ang command ng host…`;
  hostInput.value = "";
  hostInput.focus();
}

function revealCard() {
  const type = state.pendingType;
  if (!type) return;

  let text = hostInput.value.trim();

  if (!text) {
    const pool = type === "truth" ? TRUTHS : DARES;
    const used = type === "truth" ? state.usedTruth : state.usedDare;
    if (used.size >= pool.length) used.clear();
    let idx;
    do {
      idx = Math.floor(Math.random() * pool.length);
    } while (used.has(idx));
    used.add(idx);
    text = pool[idx];
  }

  cardFront.classList.toggle("is-truth", type === "truth");
  cardFront.classList.toggle("is-dare", type === "dare");
  cardBadge.textContent = type === "truth" ? "💯 TOOtoO" : "😈 DARE!";
  cardText.textContent = text;

  hostPanel.classList.add("hidden");
  hostInput.value = "";
  gameCard.classList.add("flipped");
  actionRow.classList.remove("hidden");
  beep(520, 0.2);
  confetti(25);
}

$("truthBtn").addEventListener("click", () => chooseType("truth"));
$("dareBtn").addEventListener("click", () => chooseType("dare"));
hostForm.addEventListener("submit", (e) => {
  e.preventDefault();
  revealCard();
});

doneBtn.addEventListener("click", () => {
  const name = state.players[state.current];
  state.scores[name] = (state.scores[name] || 0) + 1;
  beep(920, 0.12);
  confetti(35);
  nextTurn();
});

passBtn.addEventListener("click", () => {
  const name = state.players[state.current];
  state.scores[name] = (state.scores[name] || 0) - 1;
  beep(200, 0.2);
  nextTurn();
});

nextBtn.addEventListener("click", nextTurn);

function nextTurn() {
  state.current++;
  if (state.current >= state.players.length) {
    state.current = 0;
    state.round++;
  }
  resetCard();
  updateTurnUI();
}

/* ---------------- Scoreboard ---------------- */
$("showScores").addEventListener("click", openScores);
$("closeScores").addEventListener("click", () => scoreOverlay.classList.add("hidden"));

function openScores() {
  scoreList.innerHTML = "";

  const ranked = [...state.players].sort(
    (a, b) => state.scores[b] - state.scores[a]
  );

  const medals = ["🥇", "🥈", "🥉"];
  ranked.forEach((name, i) => {
    const li = document.createElement("li");

    const left = document.createElement("span");
    left.innerHTML = `<span class="medal">${medals[i] || "🎲"}</span>${name}`;

    const pts = document.createElement("span");
    pts.className = "pts";
    pts.textContent = `${state.scores[name]} pts`;

    li.append(left, pts);
    scoreList.appendChild(li);
  });

  scoreOverlay.classList.remove("hidden");
  beep(600, 0.1);
}

/* ---------------- Exit ---------------- */
$("backHome").addEventListener("click", () => {
  scoreOverlay.classList.add("hidden");
  show("setup");
});

document.addEventListener("keydown", (e) => {
  if (!screens.game.classList.contains("active")) return;
  if (!scoreOverlay.classList.contains("hidden")) {
    if (e.key === "Escape") scoreOverlay.classList.add("hidden");
    return;
  }
  if (document.activeElement === hostInput) return;
  if (!choiceRow.classList.contains("hidden")) {
    if (e.key === "1" || e.key.toLowerCase() === "t") $("truthBtn").click();
    if (e.key === "2" || e.key.toLowerCase() === "d") $("dareBtn").click();
  }
  if (e.key.toLowerCase() === "s") $("showScores").click();
});

renderPlayers();

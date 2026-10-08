/* =========================================================
   Truth or Dare — Filipino Edition
   ========================================================= */

const TRUTHS = [
  "Sino ang may crush ka ngayon? Sabihin mo nang totoo!",
  "Ano ang huling minessage mo — at kanino?",
  "Sino sa mga nandito ang ayaw mong makasama sa isla?",
  "Ano ang secret crush mo sa showbiz?",
  "Kailan ka huling umiyak? Bakit?",
  "Ano ang pinaka-kakahiya mong kilos sa school/opisina?",
  "Sino ang unang ginawa mong crush?",
  "Ano ang wallpaper ng phone mo ngayon?",
  "Ano ang pinakamalaking linya na nasabi mo sa magulang mo?",
  "Sino sa friends mo ang pinaka-chismis?",
  "Ano ang huling binili mo online (Shopee/Lazada)?",
  "Sino ang gusto mong makasama sa elevator ng isang oras?",
  "Ano ang alam ng lahat dito na secret mo?",
  "Ano ang pinakapangit na outfit na sinuot mo?",
  "Sino ang na-ghost mo na walang paliwanag?",
  "Ano ang pinakanakakatawang pinost mo online?",
  "Sino ang huling name sa call log mo?",
  "Ano ang unang napansin mo sa crush mo?",
  "Anong lie ang sinabi mo kanina lang?",
  "Sino ang mas gusto mo — yung katabi mo o yung kabilang dako?",
  "Ano ang hindi pa alam ng pamilya mo tungkol sa'yo?",
  "Ano ang pinakamatapang na ginawa mo for love?",
  "Sino ang nakakaalam ng password ng phone mo?",
  "Ano ang ayaw mo sa sarili mo?",
  "Kung hindi ito laro, sino ang tatawagin mo ngayon?",
  "Ano ang lihim na pangarap mo sa buhay?",
  "Ano ang pinakahuling 'di mo sinabi sa kaibigan mo?",
  "Sino sa dito ang pupuntahan mo kung may problema ka?",
  "Ano ang pinaka-nakakatawang pinaggawa mo sa harap ng crush?",
  "Magkano ang nasa wallet mo ngayon? Totoo lang!"
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
  pendingTimer: null
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
const cardTimer = $("cardTimer");
const choiceRow = $("choiceRow");
const actionRow = $("actionRow");
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
  clearInterval(state.pendingTimer);
  cardTimer.textContent = "";
  gameCard.classList.remove("flipped");
  choiceRow.classList.remove("hidden");
  actionRow.classList.add("hidden");
}

function pickCard(type) {
  const pool = type === "truth" ? TRUTHS : DARES;
  const used = type === "truth" ? state.usedTruth : state.usedDare;

  if (used.size >= pool.length) used.clear();

  let idx;
  do {
    idx = Math.floor(Math.random() * pool.length);
  } while (used.has(idx));
  used.add(idx);

  cardFront.classList.toggle("is-truth", type === "truth");
  cardFront.classList.toggle("is-dare", type === "dare");
  cardBadge.textContent = type === "truth" ? "💯 TOOtoO" : "😈 DARE!";
  cardText.textContent = pool[idx];

  beep(type === "truth" ? 740 : 300, 0.16);
  gameCard.classList.add("flipped");
  choiceRow.classList.add("hidden");
  actionRow.classList.remove("hidden");

  clearInterval(state.pendingTimer);

  if (type === "dare") {
    let t = 20;
    cardTimer.textContent = `${t}s`;
    state.pendingTimer = setInterval(() => {
      t--;
      cardTimer.textContent = t > 0 ? `${t}s` : "TAGALOG NA! ⏰";
      cardTimer.classList.remove("tick");
      void cardTimer.offsetWidth;
      cardTimer.classList.add("tick");
      if (t <= 5 && t > 0) beep(880, 0.07);
      if (t <= 0) {
        clearInterval(state.pendingTimer);
        beep(220, 0.35);
      }
    }, 1000);
  }
}

$("truthBtn").addEventListener("click", () => pickCard("truth"));
$("dareBtn").addEventListener("click", () => pickCard("dare"));

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
  clearInterval(state.pendingTimer);
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
  clearInterval(state.pendingTimer);
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
  clearInterval(state.pendingTimer);
  scoreOverlay.classList.add("hidden");
  show("setup");
});

document.addEventListener("keydown", (e) => {
  if (!screens.game.classList.contains("active")) return;
  if (!scoreOverlay.classList.contains("hidden")) {
    if (e.key === "Escape") scoreOverlay.classList.add("hidden");
    return;
  }
  if (e.key === "1" || e.key.toLowerCase() === "t") $("truthBtn").click();
  if (e.key === "2" || e.key.toLowerCase() === "d") $("dareBtn").click();
  if (e.key.toLowerCase() === "s") $("showScores").click();
});

renderPlayers();

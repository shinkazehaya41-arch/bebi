/* =========================================================
   Truth or Dare
   ========================================================= */

const TRUTHS = [
  "Who was the first person you loved before you even knew what love meant?",
  "What name is written on the letter you never sent?",
  "When did you last cry because of someone you love — and not because of a movie?",
  "What were the last words you said to the one you loved — was there a goodbye, or did it just end?",
  "Who always appears at the end of every poem you write?",
  "Which memory of them do you refuse to let go, even though you desperately want to?",
  "How long did it take you to forget the person who first broke your heart?",
  "What does the voice of your past love sound like now — familiar, or just an echo?",
  "Who do you love quietly while everyone else is loud?",
  "What promise did you fail to keep in your last relationship?",
  "If you could have one day back with your ex, what four words would you say?",
  "What was the sweetest wrong decision your heart ever made?",
  "Who stole a night of yours from your dreams?",
  "What song reminds you of them — and what do you feel on the very first note?",
  "Were you truly loyal in your last love, or just possessed by fear?",
  "Which word from their last message can you still not erase from your mind?",
  "Who was the last person you prayed for — hoping they'd be happy even without you?",
  "Is there still someone whose name makes your chest ache?",
  "What goodbye did you never say — and how long will you keep it?",
  "What is the first thing you look for when you wake up — is it still them?",
  "How deeply can you love — until you break, or until you learn?",
  "Which page of your life did you write on someone else's hand?",
  "Who was the last person you called 'home'?",
  "If your heart is a poem, which page is the darkest?",
  "What quality of theirs did you love the most — the one they themselves hated?",
  "Whose name is carved into every poem of your regret?",
  "Have you ever loved someone in secret — and is it still a secret?",
  "When was the last time you whispered 'I wish' — and to whom?",
  "If love is an ocean, where did you drown and where did you learn to swim?",
  "Who is the person you can never erase from the end of every story?"
];

const DARES = [
  "Sing for 15 seconds — any song!",
  "Pretend you're a chicken… cluck 3 times!",
  "Laugh out loud for 5 seconds straight — don't stop!",
  "Do 5 push-ups (no dead weight!)",
  "Post: 'I'm single, DMs welcome!' — leave it up for 1 hour",
  "Imitate someone in the room until someone guesses who",
  "Speak only English for 30 seconds without stopping",
  "Change your profile pic to a photo of the person next to you (24 hours)",
  "Do the robot dance for 10 seconds",
  "Say your crush's name 5 times loudly",
  "Do the step-touch for 10 seconds — fast!",
  "Hold a plank for 15 seconds — don't you dare drop!",
  "Show everyone the most recent photo in your gallery",
  "Lip-sync to one verse of a song",
  "Make a haiku (5-7-5) about the person beside you",
  "Tell your most embarrassing story in 1 minute",
  "Serve the person next to you a glass of water with a bow 🙇",
  "Comment 'You're beautiful/handsome' on the first post in your feed",
  "Run around the house twice, fast!",
  "Shout 'I'm so handsome/pretty!' three times",
  "Have a 20-second conversation with yourself",
  "Show the first text you ever sent to your crush",
  "Make 3 funny faces — the person next to you takes a picture",
  "Eat a spoonful of sugar with no water",
  "Talk in a robot voice until your next turn",
  "Dance for 10 seconds with no music",
  "Text your best friend 'I love you' — show the reply",
  "Strike a model pose for 10 seconds in the middle of the room",
  "Guess who will fall asleep first tonight",
  "Rename yourself in this person's phone until later tonight"
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
    del.setAttribute("aria-label", `Remove ${name}`);
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
    ? `${state.players.length} players ready! Let's go. 🔥`
    : "You need at least 2 players.";
}

playerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = playerInput.value.trim();
  if (!name) return;
  if (state.players.some((p) => p.toLowerCase() === name.toLowerCase())) {
    setupHint.textContent = "That name already exists — pick another!";
    return;
  }
  if (state.players.length >= 8) {
    setupHint.textContent = "Max 8 players — that's already a party!";
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
  waitingText.textContent = `⏳ ${state.players[state.current]}, wait for the host's command…`;
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
  cardBadge.textContent = type === "truth" ? "💯 TRUTH" : "😈 DARE!";
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

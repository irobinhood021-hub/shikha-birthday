import './style.css';
import gsap from 'gsap';
// @ts-ignore
import confetti from 'canvas-confetti';
import * as THREE from 'three';

// --- Global Constants & State ---
let currentScore = 0;
let gameActive = false;
let audioStarted = false;
let currentQuestionIndex = 0;
let selectedQuestions: any[] = [];

const romanticQuestions = [
  {
    q: "If loving you was a subject, I'd top the exam every time. 📚❤️",
    opt1: "Teacher's favourite 😌",
    opt2: "You'd still fail 😜",
    ans1: "Because my favourite chapter is YOU. 💕",
    ans2: "Then I'll keep studying you forever. 😉"
  },
  {
    q: "Are you WiFi? Because I'm feeling a strong connection. �",
    opt1: "Connected 🔗",
    opt2: "Weak signal �",
    ans1: "Perfect! No password needed. ❤️",
    ans2: "Don't worry, I'll come closer. �"
  },
  {
    q: "If you were a song, you'd be my favourite playlist. 🎶",
    opt1: "Play it again 🔁",
    opt2: "Skip ⏭",
    ans1: "On repeat forever. 💖",
    ans2: "No skipping allowed, this one is special. 😌"
  },
  {
    q: "Are you magic? Because whenever you appear, everything feels better. ✨",
    opt1: "Abracadabra 🪄",
    opt2: "Just coincidence �",
    ans1: "My favourite kind of magic. ❤️",
    ans2: "Then I guess you're my lucky coincidence. 😉"
  },
  {
    q: "Are you my anime opening theme? Because whenever you appear, my whole world suddenly feels epic. 🎬✨",
    opt1: "Play it again 🎶",
    opt2: "Skip intro ⏭",
    ans1: "No skipping allowed, this opening is legendary. ❤️",
    ans2: "Even if you skip, my heart still replays it. 💫"
  },
  {
    q: "If life was an anime, you'd be the main character of my story. 🌸",
    opt1: "Protagonist energy �",
    opt2: "Side character maybe 🤔",
    ans1: "Then I guess I'm the one always protecting you. 🗡️❤️",
    ans2: "Nope, my story only works with you in the spotlight. ✨"
  },
  {
    q: "Are you a Studio Ghibli scene? Because everything feels calm and magical when you're around. 🌿",
    opt1: "That's sweet 🥹",
    opt2: "Too dreamy 😅",
    ans1: "Just like a sunset in a Ghibli movie. 💖",
    ans2: "Dreamy things are usually the most beautiful. 🌸"
  },
  {
    q: "If I had Naruto's shadow clone jutsu, every clone would still choose you. 🌀",
    opt1: "That's a lot of me 😆",
    opt2: "Clones sound scary 😂",
    ans1: "Worth it, because you're my favourite mission. ❤️",
    ans2: "Even Naruto would approve this decision. 😌"
  },
  {
    q: "Are you the final episode of an anime? Because I never want you to end. 🎥",
    opt1: "Season 2 please 🙋‍♀️",
    opt2: "End credits 😅",
    ans1: "Good, because our story just started. ❤️",
    ans2: "Then I'll keep rewatching you forever. �"
  },
  {
    q: "If I were in Attack on Titan, I'd fight every titan just to reach you. ⚔️",
    opt1: "That's brave 😮",
    opt2: "Sounds dangerous 😅",
    ans1: "Anything for the one who makes my heart race. ❤️",
    ans2: "Danger is worth it if you're waiting at the end. 💖"
  },
  {
    q: "Are you dopamine? Because whenever you're around, my happiness levels spike instantly. 🧠💫",
    opt1: "That's cute 🥰",
    opt2: "Sounds scientific 😅",
    ans1: "Science never lies about happiness. ❤️",
    ans2: "Then let me run more experiments with you. 😉"
  },
  {
    q: "Are you my daily dose of serotonin? Because my mood instantly improves when I see you. 💊✨",
    opt1: "Doctor approved 😌",
    opt2: "Too nerdy 😂",
    ans1: "Best prescription I've ever had. ❤️",
    ans2: "Even nerdy things feel special with you. 💖"
  },
  {
    q: "Are you a miracle drug? Because you fix every bad day I have. 💉🌸",
    opt1: "Happy to help 😊",
    opt2: "Side effects? 😅",
    ans1: "Only side effect: falling for you more. ❤️",
    ans2: "Yeah... increased heart rate when you're near. 💓"
  },
  {
    q: "Are you an antibiotic? Because you fight off every bad mood I have. 💊",
    opt1: "Doctor recommended 😌",
    opt2: "Any side effects? 😅",
    ans1: "Yes… increased smiling whenever you're around. ❤️",
    ans2: "Only side effect: falling for you more. 💖"
  },
  {
    q: "Are you caffeine? Because you keep my heart racing all day. ☕💓",
    opt1: "Energy boost ⚡",
    opt2: "Too much caffeine 😆",
    ans1: "Best energy source ever discovered. ❤️",
    ans2: "Even overdose wouldn't stop me liking you. 😉"
  },
  {
    q: "Are you a clinical trial? Because I'd volunteer for you without reading the risks. 🧪",
    opt1: "Brave choice 😌",
    opt2: "That sounds risky 😅",
    ans1: "Worth it if you're the result. ❤️",
    ans2: "Some risks are worth taking. 💖"
  },
  {
    q: "Are you my heartbeat monitor? Because whenever you're near, my heart rate spikes. 📈💓",
    opt1: "That's adorable 🥰",
    opt2: "That's concerning 😆",
    ans1: "Doctor says it's called love. ❤️",
    ans2: "Good thing I like this condition. 😉"
  },
  {
    q: "Are you a vaccine? Because you've completely changed my system. 💉",
    opt1: "Immunity achieved 😌",
    opt2: "That's intense 😂",
    ans1: "Immune to sadness when you're around. ❤️",
    ans2: "Love works stronger than vaccines. 💖"
  },
  {
    q: "Are you a chemical reaction? Because whenever we meet, sparks happen. ⚗️✨",
    opt1: "Science approved 😄",
    opt2: "That's chemistry 😏",
    ans1: "Exactly… perfect chemistry. ❤️",
    ans2: "And I think it's a stable compound. 💖"
  }
];

function shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// --- DOM Elements ---
const startBtn = document.getElementById('start-btn') as HTMLButtonElement;
const bgMusic = document.getElementById('bg-music') as HTMLAudioElement;
const hbMusic = document.getElementById('hb-music') as HTMLAudioElement;
const questionText = document.getElementById('question-text');
const opt1Btn = document.getElementById('opt1-btn') as HTMLButtonElement;
const opt2Btn = document.getElementById('opt2-btn') as HTMLButtonElement;
const questionContainer = document.getElementById('question-container');
const questionFinal = document.getElementById('question-final');
const interactiveBtns = document.getElementById('interactive-btns');
const responseText = document.getElementById('response-text');

// --- Background Hearts Animation ---
function createBackgroundHearts() {
  const container = document.getElementById('bg-hearts');
  if (!container) return;

  setInterval(() => {
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
    heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
    heart.style.opacity = (Math.random() * 0.5 + 0.2).toString();
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 10000);
  }, 500);
}

// --- Navigation Logic ---
function goToPage(targetId: string) {
  const targetPage = document.getElementById(targetId);
  if (!targetPage) return;

  const activePage = document.querySelector('.page.active');

  if (activePage) {
    gsap.to(activePage, {
      opacity: 0,
      y: -20,
      duration: 0.5,
      onComplete: () => {
        activePage.classList.remove('active');
        setupTargetPage(targetId);
      }
    });
  } else {
    setupTargetPage(targetId);
  }
}

function setupTargetPage(targetId: string) {
  const targetPage = document.getElementById(targetId);
  if (!targetPage) return;

  targetPage.classList.add('active');
  gsap.fromTo(targetPage, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 });

  // Page Specific Init
  if (targetId === 'page-2') initCake();
  if (targetId === 'page-3') startGame();
  if (targetId === 'page-5') startFinalCelebration();
}

// --- Page 1: Start ---
startBtn.addEventListener('click', () => {
  if (!audioStarted) {
    bgMusic.play().catch(e => console.log("Audio play blocked", e));
    audioStarted = true;
  }
  goToPage('page-2');
});

// Generic "Next" buttons
document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const nextId = (e.currentTarget as HTMLElement).getAttribute('data-next');
    if (nextId) goToPage(nextId);
  });
});

// --- Page 2: Realistic Three.js Cake ---
let cakeScene: THREE.Scene, cakeCamera: THREE.PerspectiveCamera, cakeRenderer: THREE.WebGLRenderer;
let candleFlame: THREE.Mesh;

function initCake() {
  const container = document.getElementById('cake-container');
  if (!container || container.children.length > 0) return;

  cakeScene = new THREE.Scene();
  cakeCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  cakeCamera.position.set(0, 4, 10);
  cakeCamera.lookAt(0, 1.5, 0);

  cakeRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  cakeRenderer.setSize(450, 450);
  cakeRenderer.shadowMap.enabled = true;
  container.appendChild(cakeRenderer.domElement);

  const cakeGroup = new THREE.Group();

  // Cake Board
  const boardGeom = new THREE.CylinderGeometry(2.5, 2.5, 0.05, 64);
  const boardMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const board = new THREE.Mesh(boardGeom, boardMat);
  board.position.y = -0.6;
  cakeGroup.add(board);

  // Tiers (Pink)
  const createTier = (y: number, r: number, h: number) => {
    const geom = new THREE.CylinderGeometry(r, r, h, 64);
    const mat = new THREE.MeshStandardMaterial({ color: 0xffadc0, roughness: 0.4 });
    const tier = new THREE.Mesh(geom, mat);
    tier.position.y = y;
    tier.castShadow = true;
    tier.receiveShadow = true;
    return tier;
  }

  const bottomTier = createTier(0, 2, 1.5);
  const topTier = createTier(1.3, 1.4, 1.2);
  cakeGroup.add(bottomTier, topTier);

  // Drips (White Ganache)
  const dripColor = 0xffffff;
  const dripMat = new THREE.MeshStandardMaterial({ color: dripColor, roughness: 0.2 });

  // Top edge drip circle
  const dripTopGeom = new THREE.TorusGeometry(1.42, 0.1, 16, 100);
  const dripTop = new THREE.Mesh(dripTopGeom, dripMat);
  dripTop.rotation.x = Math.PI / 2;
  dripTop.position.y = 1.9;
  cakeGroup.add(dripTop);

  // Vertical drips
  for (let i = 0; i < 12; i++) {
    const dripLen = 0.3 + Math.random() * 0.6;
    const dripGeom = new THREE.CylinderGeometry(0.08, 0.04, dripLen, 8);
    const drip = new THREE.Mesh(dripGeom, dripMat);
    const angle = (i / 12) * Math.PI * 2;
    drip.position.set(Math.cos(angle) * 1.45, 1.9 - dripLen / 2, Math.sin(angle) * 1.45);
    cakeGroup.add(drip);

    // Drip droplet at end
    const dropGeom = new THREE.SphereGeometry(0.08, 8, 8);
    const drop = new THREE.Mesh(dropGeom, dripMat);
    drop.position.set(Math.cos(angle) * 1.45, 1.9 - dripLen, Math.sin(angle) * 1.45);
    cakeGroup.add(drop);
  }

  // Macarons
  const macaronColors = [0xd8bfd8, 0xadd8e6, 0xffc0cb]; // Lavender, Blue, Pink
  const createMacaron = (x: number, y: number, z: number, color: number, scale = 1) => {
    const macGroup = new THREE.Group();
    const halfGeom = new THREE.SphereGeometry(0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const mat = new THREE.MeshStandardMaterial({ color: color, roughness: 0.6 });

    const top = new THREE.Mesh(halfGeom, mat);
    const bottom = new THREE.Mesh(halfGeom, mat);
    bottom.rotation.x = Math.PI;
    bottom.position.y = -0.05;

    const creamGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.05, 16);
    const creamMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const cream = new THREE.Mesh(creamGeom, creamMat);

    macGroup.add(top, bottom, cream);
    macGroup.position.set(x, y, z);
    macGroup.scale.setScalar(scale);
    return macGroup;
  }

  // On top
  cakeGroup.add(createMacaron(0.5, 2.1, 0.3, macaronColors[0]));
  cakeGroup.add(createMacaron(-0.4, 2.1, 0.5, macaronColors[1]));
  cakeGroup.add(createMacaron(0.2, 2.1, -0.4, macaronColors[2]));

  // On side
  const sideMac = createMacaron(1.8, 0.5, 0.8, macaronColors[2], 0.8);
  sideMac.rotation.z = Math.PI / 2;
  cakeGroup.add(sideMac);

  // Lollipop
  const lolliStickGeom = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 8);
  const lolliStickMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const lolliStick = new THREE.Mesh(lolliStickGeom, lolliStickMat);
  lolliStick.position.set(0, 2.4, -0.2);
  cakeGroup.add(lolliStick);

  const lolliHeadGeom = new THREE.TorusGeometry(0.4, 0.1, 16, 100);
  const lolliHeadMat = new THREE.MeshStandardMaterial({ color: 0xff69b4 });
  const lolliHead = new THREE.Mesh(lolliHeadGeom, lolliHeadMat);
  lolliHead.position.set(0, 3.1, -0.2);
  lolliHead.rotation.y = Math.PI / 4;
  cakeGroup.add(lolliHead);

  const lolliCenterGeom = new THREE.SphereGeometry(0.35, 32, 32);
  const lolliCenter = new THREE.Mesh(lolliCenterGeom, lolliHeadMat);
  lolliCenter.position.set(0, 3.1, -0.2);
  lolliCenter.scale.z = 0.2;
  cakeGroup.add(lolliCenter);

  // Tiny Hearts/Dots on sides
  for (let i = 0; i < 30; i++) {
    const dotGeom = new THREE.SphereGeometry(0.03, 8, 8);
    const dotMat = new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xffffff : 0xff69b4 });
    const dot = new THREE.Mesh(dotGeom, dotMat);
    const angle = Math.random() * Math.PI * 2;
    const isTop = Math.random() > 0.5;
    const r = isTop ? 1.42 : 2.02;
    const py = isTop ? 1 + Math.random() * 0.8 : -0.5 + Math.random() * 1.2;
    dot.position.set(Math.cos(angle) * r, py, Math.sin(angle) * r);
    cakeGroup.add(dot);
  }

  // Candle (Single one on top)
  const candleGeom = new THREE.CylinderGeometry(0.05, 0.05, 0.6, 16);
  const candleMat = new THREE.MeshStandardMaterial({ color: 0x98fb98 });
  const candle = new THREE.Mesh(candleGeom, candleMat);
  candle.position.set(-0.6, 2.2, -0.2);
  cakeGroup.add(candle);

  const flameGeom = new THREE.SphereGeometry(0.1, 16, 16);
  const flameMat = new THREE.MeshBasicMaterial({ color: 0xffa500 });
  candleFlame = new THREE.Mesh(flameGeom, flameMat);
  candleFlame.position.set(-0.6, 2.6, -0.2);
  cakeGroup.add(candleFlame);

  cakeScene.add(cakeGroup);

  // Improved Lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  cakeScene.add(ambientLight);

  const pointLight = new THREE.PointLight(0xffffff, 1);
  pointLight.position.set(5, 5, 5);
  pointLight.castShadow = true;
  cakeScene.add(pointLight);

  const fillLight = new THREE.PointLight(0xffffff, 0.5);
  fillLight.position.set(-5, 2, 2);
  cakeScene.add(fillLight);

  function animate() {
    requestAnimationFrame(animate);
    // Optimizing the rendering loop to only render when the cake page is active
    if (document.getElementById('page-2')?.classList.contains('active')) {
      cakeGroup.rotation.y += 0.005;
      if (candleFlame.visible) {
        candleFlame.scale.setScalar(0.9 + Math.random() * 0.3);
      }
      cakeRenderer.render(cakeScene, cakeCamera);
    }
  }
  animate();
}

// Voice Blow Logic
const blowBtn = document.getElementById('blow-btn');
const manualBlowBtn = document.getElementById('manual-blow-btn');

blowBtn?.addEventListener('click', async () => {
  (blowBtn as HTMLButtonElement).innerText = "Listening...";
  manualBlowBtn?.classList.remove('hidden');

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    const microphone = audioContext.createMediaStreamSource(stream);
    microphone.connect(analyser);
    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    function checkBlow() {
      if (!candleFlame.visible) return;
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) sum += dataArray[i];
      const average = sum / bufferLength;

      if (average > 65) {
        extinguishCandles();
        stream.getTracks().forEach(track => track.stop());
        audioContext.close();
      } else {
        requestAnimationFrame(checkBlow);
      }
    }
    checkBlow();
  } catch (err) {
    (blowBtn as HTMLButtonElement).innerText = "Error: Mic Required";
  }
});

manualBlowBtn?.addEventListener('click', () => extinguishCandles());

function extinguishCandles() {
  if (!candleFlame.visible) return;
  candleFlame.visible = false;
  confetti({ particleCount: 200, spread: 80, origin: { y: 0.6 } });

  const msg = document.getElementById('birthday-msg');
  if (msg) {
    msg.classList.remove('hidden');
    gsap.from(msg, { opacity: 0, scale: 0.8, duration: 1, ease: "back.out(1.7)" });
  }

  document.querySelector('.prompt')?.classList.add('hidden');
  blowBtn?.classList.add('hidden');
  manualBlowBtn?.classList.add('hidden');
}

// --- Page 3: Game Logic ---
let baseSpeed = 2.5;
const TARGET_HEARTS = 5;
let consecutiveFailures = 0;
const GAME_ITEMS = [
  { char: '❤️', type: 'heart', color: '#ff69b4', blur: 15 },
  { char: '🎁', type: 'trap', color: '#ff4500', blur: 8 },
  { char: '⭐', type: 'trap', color: '#ffd700', blur: 8 },
  { char: '🎈', type: 'trap', color: '#ff1493', blur: 8 }
];

function startGame() {
  const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d');
  const sliderContainer = document.getElementById('slider-container');
  const slider = document.getElementById('basket-slider') as HTMLInputElement;
  const continueGameBtn = document.getElementById('continue-game-btn');
  const nextBtn = document.querySelector('#game-end .next-btn') as HTMLButtonElement | null;

  if (!ctx || !slider) return;

  canvas.width = 400;
  canvas.height = 400;

  currentScore = 0;
  baseSpeed = 2.5;
  gameActive = true;
  slider.value = '50';
  document.getElementById('score')!.innerText = '0';
  document.getElementById('game-end')?.classList.add('hidden');

  if (nextBtn) nextBtn.classList.add('hidden');
  if (continueGameBtn) continueGameBtn.classList.remove('hidden');

  sliderContainer?.classList.remove('hidden');

  let basketX = 175;
  const basketWidth = 60;
  const items: any[] = [];

  const endGame = (isWin: boolean) => {
    gameActive = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const endMsg = document.getElementById('game-end-msg');

    if (isWin) {
      consecutiveFailures = 0;
      if (endMsg) endMsg.innerText = "🎉 You collected all the hearts! Happy Birthday Shikha ❤️";
      confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
      if (nextBtn) nextBtn.classList.remove('hidden');
      if (continueGameBtn) continueGameBtn.classList.add('hidden');
    } else {
      consecutiveFailures++;
      if (endMsg) endMsg.innerText = "💔 Oops! You caught the wrong item. Game Over.";

      if (consecutiveFailures >= 3) {
        if (nextBtn) nextBtn.classList.remove('hidden');
      } else {
        if (nextBtn) nextBtn.classList.add('hidden');
      }

      if (continueGameBtn) continueGameBtn.classList.remove('hidden');
    }

    document.getElementById('game-end')?.classList.remove('hidden');
    sliderContainer?.classList.add('hidden');
  };

  const update = () => {
    if (!gameActive) return;

    baseSpeed += 0.001;

    if (Math.random() < 0.035 + (baseSpeed * 0.002)) {
      const isHeart = Math.random() < 0.4;
      const itemDef = isHeart ? GAME_ITEMS[0] : GAME_ITEMS[Math.floor(Math.random() * (GAME_ITEMS.length - 1)) + 1];
      items.push({
        x: Math.random() * (canvas.width - 25),
        y: -30,
        size: 25,
        char: itemDef.char,
        type: itemDef.type,
        color: itemDef.color,
        blur: itemDef.blur,
        speed: baseSpeed + (Math.random() * 1.5)
      });
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const maxX = canvas.width - basketWidth;
    basketX = (parseInt(slider.value) / 100) * maxX;

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffb6c1';
    ctx.beginPath();
    ctx.roundRect(basketX, canvas.height - 40, basketWidth, 30, 10);
    ctx.fill();

    for (let i = items.length - 1; i >= 0; i--) {
      const item = items[i];
      item.y += item.speed;

      if (item.y + item.size > canvas.height - 40 && item.x + item.size > basketX && item.x < basketX + basketWidth) {
        if (item.type === 'heart') {
          currentScore++;
          document.getElementById('score')!.innerText = currentScore.toString();
          confetti({ particleCount: 15, spread: 30, origin: { x: (basketX + 30) / 400, y: 0.9 } });
          items.splice(i, 1);

          if (currentScore >= TARGET_HEARTS) {
            endGame(true);
            return;
          }
        } else {
          endGame(false);
          return;
        }
        continue;
      }

      if (item.y > canvas.height) {
        items.splice(i, 1);
        continue;
      }

      ctx.font = '25px Arial';
      ctx.shadowBlur = item.blur;
      ctx.shadowColor = item.color;
      ctx.fillText(item.char, item.x, item.y);
      ctx.shadowBlur = 0;
    }

    if (gameActive) {
      requestAnimationFrame(update);
    }
  };

  continueGameBtn?.addEventListener('click', startGame, { once: true });
  update();
}

// --- Page 4: 4-Random Romantic Question Sequence ---
function loadQuestion() {
  if (currentQuestionIndex >= 4 || currentQuestionIndex >= selectedQuestions.length) {
    questionContainer?.classList.add('hidden');
    questionFinal?.classList.remove('hidden');
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });

    // Add small continuous heart sparkles for final card
    const finalInterval = setInterval(() => {
      if (!document.getElementById('page-4')?.classList.contains('active')) {
        clearInterval(finalInterval);
        return;
      }
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffb6c1', '#ff69b4']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffb6c1', '#ff69b4']
      });
    }, 1000);
    return;
  }

  const qData = selectedQuestions[currentQuestionIndex];
  if (questionText) questionText.innerText = qData.q;
  if (opt1Btn) opt1Btn.innerText = qData.opt1;
  if (opt2Btn) opt2Btn.innerText = qData.opt2;

  interactiveBtns?.classList.remove('hidden');
  responseText?.classList.add('hidden');

  gsap.from([questionText, interactiveBtns], { opacity: 0, y: 20, duration: 0.5, stagger: 0.2 });
}

function handleAnswer(isOpt1: boolean) {
  const qData = selectedQuestions[currentQuestionIndex];
  const reply = isOpt1 ? qData.ans1 : qData.ans2;

  interactiveBtns?.classList.add('hidden');

  if (responseText) {
    responseText.innerText = reply;
    responseText.classList.remove('hidden');
    gsap.fromTo(responseText, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.5 });
  }

  setTimeout(() => {
    currentQuestionIndex++;
    loadQuestion();
  }, 2500);
}

opt1Btn?.addEventListener('click', () => handleAnswer(true));
opt2Btn?.addEventListener('click', () => handleAnswer(false));

// Load first question when arriving on page 4
document.querySelectorAll('.next-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const nextId = (e.currentTarget as HTMLElement).getAttribute('data-next');
    if (nextId === 'page-4') {
      currentQuestionIndex = 0;
      // Shuffle all questions and pick the first 4
      selectedQuestions = shuffleArray([...romanticQuestions]).slice(0, 4);
      loadQuestion();
    }
  });
});

// --- Page 5: Final Message & Birthday Music ---
function startFinalCelebration() {
  // Stop background music and start Happy Birthday
  bgMusic.pause();
  hbMusic.play().catch(e => console.log("HB Music blocked", e));

  const duration = 20 * 1000;
  const animationEnd = Date.now() + duration;

  const interval: any = setInterval(function () {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) return clearInterval(interval);

    const particleCount = 60 * (timeLeft / duration);
    confetti({ particleCount, origin: { x: Math.random(), y: Math.random() - 0.2 } });
  }, 300);

  // Add more balloons
  const colors = ['#ffb6c1', '#d8bfd8', '#ffdab9', '#b0e0e6', '#fff0f5'];
  for (let i = 0; i < 30; i++) {
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'balloon';
      b.style.left = Math.random() * 95 + 'vw';
      b.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      b.style.animationDuration = (Math.random() * 5 + 5) + 's';
      document.body.appendChild(b);
    }, i * 200);
  }
}

// Init
createBackgroundHearts();
goToPage('page-1');

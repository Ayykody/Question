// ---------- SCENE 1: petal burst ----------
const petalBurst = document.getElementById('petalBurst');
const petalColors = ['#FF8FA8', '#FFC7D6', '#F5C563', '#E8637F'];
const PETAL_COUNT = 22;
for (let i = 0; i < PETAL_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  const angle = (360 / PETAL_COUNT) * i + (Math.random() * 10 - 5);
  const dist = 130 + Math.random() * 90;
  p.style.setProperty('--angle', angle + 'deg');
  p.style.setProperty('--dist', dist + 'px');
  p.style.background = petalColors[i % petalColors.length];
  p.style.animationDelay = (Math.random() * 0.25) + 's';
  petalBurst.appendChild(p);
}

function goTo(id) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

document.getElementById('toScene2').addEventListener('click', () => {
  goTo('scene-2');
  startRat();
});

// ---------- SCENE 2: wandering rat ----------
const ratWrap = document.getElementById('ratWrap');
let ratStarted = false;
let ratLastX = 20;

function moveRat() {
  const margin = 90;
  const maxX = window.innerWidth - margin;
  const maxY = window.innerHeight - margin - 40;
  const x = Math.max(10, Math.random() * maxX);
  const y = Math.max(10, Math.random() * maxY * 0.55);
  if (x < ratLastX) {
    ratWrap.classList.add('rat-flip');
  } else {
    ratWrap.classList.remove('rat-flip');
  }
  ratLastX = x;
  ratWrap.style.transform = `translate(${x}px, ${y}px)` + (ratWrap.classList.contains('rat-flip') ? ' scaleX(-1)' : '');
}

let ratInterval;
function startRat() {
  if (ratStarted) return;
  ratStarted = true;
  moveRat();
  ratInterval = setInterval(moveRat, 2200);
}

// ---------- SCENE 2: dodging "no" button ----------
const noBtn = document.getElementById('noBtn2');
const yesBtn2 = document.getElementById('yesBtn2');
const quip = document.getElementById('dodgeQuip');
let dodgeCount = 0;

function dodgeNo() {
  dodgeCount++;
  noBtn.classList.add('dodging');
  const rect = noBtn.getBoundingClientRect();
  const w = rect.width || 110;
  const h = rect.height || 50;
  const pad = 16;
  const maxX = window.innerWidth - w - pad;
  const maxY = window.innerHeight - h - pad;
  const x = pad + Math.random() * Math.max(1, maxX - pad);
  const y = pad + Math.random() * Math.max(1, maxY - pad);
  noBtn.style.left = x + 'px';
  noBtn.style.top = y + 'px';
  noBtn.style.transform = `rotate(${(Math.random() * 20 - 10)}deg)`;

  if (dodgeCount >= 4) {
    quip.style.left = Math.min(Math.max(x - 20, 10), window.innerWidth - 180) + 'px';
    quip.style.top = Math.max(y - 44, 10) + 'px';
    quip.classList.add('show');
    clearTimeout(quip._t);
    quip._t = setTimeout(() => quip.classList.remove('show'), 1200);
  }
}

['mouseenter', 'pointerdown', 'touchstart', 'click'].forEach(evt => {
  noBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    dodgeNo();
  }, { passive: false });
});

window.addEventListener('resize', () => {
  if (noBtn.classList.contains('dodging')) dodgeNo();
});

yesBtn2.addEventListener('click', () => {
  clearInterval(ratInterval);
  goTo('scene-3');
});

// ---------- SCENE 3: celebration ----------
const yesBtn3 = document.getElementById('yesBtn3');
const scene3 = document.getElementById('scene-3');

function launchConfetti() {
  const pieces = ['❤️', '💗', '🐾', '✨'];
  for (let i = 0; i < 46; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.textContent = pieces[Math.floor(Math.random() * pieces.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.animationDuration = (2.4 + Math.random() * 2) + 's';
    el.style.animationDelay = (Math.random() * 0.8) + 's';
    el.style.fontSize = (1 + Math.random() * 1.2) + 'rem';
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 6000);
  }
}

yesBtn3.addEventListener('click', () => {
  scene3.classList.add('celebrated');
  launchConfetti();
});

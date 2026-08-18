// ---------- SCENE 1: petal burst ----------
const petalBurst = document.getElementById('petalBurst');
const petalColors = ['#FF8FA8', '#FFC7D6', '#F5C563', '#E8637F'];
const PETAL_COUNT = 34;
for (let i = 0; i < PETAL_COUNT; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  const angle = (360 / PETAL_COUNT) * i + (Math.random() * 10 - 5);
  const dist = 220 + Math.random() * 160;
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

// ---------- SCENE 2: rat + the "no" button it carries ----------
const ratWrap = document.getElementById('ratWrap');
const noBtn = document.getElementById('noBtn2');
const yesBtn2 = document.getElementById('yesBtn2');
const quip = document.getElementById('dodgeQuip');
const scene2 = document.getElementById('scene-2');

let ratStarted = false;
let ratX = 20, ratY = 20;
let ratFlipped = false;
let fleeing = false;
let dodgeCount = 0;
const WANDER_MS = 2600;      // ambient wander interval
const CHASE_RADIUS = 190;    // how close the cursor must get to spook the rat
const FLEE_DIST_MIN = 260;
const FLEE_DIST_MAX = 400;

function ratBounds() {
  const w = ratWrap.offsetWidth || 110;
  const h = ratWrap.offsetHeight || 74;
  return {
    w, h,
    minX: 10, minY: 10,
    maxX: window.innerWidth - w - 10,
    maxY: window.innerHeight * 0.62 - h
  };
}

function setRatPosition(x, y, fast) {
  const b = ratBounds();
  x = Math.min(Math.max(x, b.minX), Math.max(b.minX, b.maxX));
  y = Math.min(Math.max(y, b.minY), Math.max(b.minY, b.maxY));

  ratFlipped = x < ratX;
  ratX = x; ratY = y;

  ratWrap.style.transitionDuration = fast ? '.45s' : '1.8s';
  ratWrap.classList.toggle('rat-flip', ratFlipped);
  noBtn.style.setProperty('--flip', ratFlipped ? -1 : 1);
  ratWrap.style.transform = `translate(${x}px, ${y}px)` + (ratFlipped ? ' scaleX(-1)' : '');
}

function wander() {
  if (fleeing) return;
  const b = ratBounds();
  const x = b.minX + Math.random() * Math.max(1, b.maxX - b.minX);
  const y = b.minY + Math.random() * Math.max(1, b.maxY - b.minY);
  setRatPosition(x, y, false);
}

let ratInterval;
function startRat() {
  if (ratStarted) return;
  ratStarted = true;
  setRatPosition(ratX, ratY, false);
  ratInterval = setInterval(wander, WANDER_MS);
  document.addEventListener('mousemove', onPointerNear);
  document.addEventListener('touchmove', onPointerNear, { passive: true });
  document.addEventListener('touchstart', onPointerNear, { passive: true });
}

function flee(fromX, fromY) {
  if (fleeing) return;
  fleeing = true;
  dodgeCount++;
  noBtn.classList.add('fleeing');

  const b = ratBounds();
  const centerX = ratX + b.w / 2;
  const centerY = ratY + b.h / 2;
  let dx = centerX - fromX;
  let dy = centerY - fromY;
  const len = Math.hypot(dx, dy) || 1;
  dx /= len; dy /= len;

  // add a little randomness so it doesn't run in a perfectly straight line
  const wobble = (Math.random() * 0.9 - 0.45);
  const angle = Math.atan2(dy, dx) + wobble;
  const dist = FLEE_DIST_MIN + Math.random() * (FLEE_DIST_MAX - FLEE_DIST_MIN);

  const targetX = centerX + Math.cos(angle) * dist - b.w / 2;
  const targetY = centerY + Math.sin(angle) * dist - b.h / 2;

  setRatPosition(targetX, targetY, true);

  if (dodgeCount >= 3) {
    const quipX = Math.min(Math.max(ratX, 10), window.innerWidth - 200);
    const quipY = Math.max(ratY - 40, 10);
    quip.style.left = quipX + 'px';
    quip.style.top = quipY + 'px';
    quip.classList.add('show');
    clearTimeout(quip._t);
    quip._t = setTimeout(() => quip.classList.remove('show'), 1300);
  }

  clearTimeout(flee._t);
  flee._t = setTimeout(() => {
    fleeing = false;
    noBtn.classList.remove('fleeing');
  }, 500);
}

function onPointerNear(e) {
  if (!ratStarted) return;
  const point = e.touches && e.touches[0] ? e.touches[0] : e;
  if (point.clientX === undefined) return;
  const b = ratBounds();
  const centerX = ratX + b.w / 2;
  const centerY = ratY + b.h / 2;
  const dist = Math.hypot(point.clientX - centerX, point.clientY - centerY);
  if (dist < CHASE_RADIUS) {
    flee(point.clientX, point.clientY);
  }
}

// belt-and-suspenders: if a pointer ever actually lands on the button, flee instead of clicking
['pointerdown', 'click', 'touchstart'].forEach(evt => {
  noBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    e.stopPropagation();
    flee(e.clientX ?? (e.touches && e.touches[0] && e.touches[0].clientX) ?? ratX, e.clientY ?? (e.touches && e.touches[0] && e.touches[0].clientY) ?? ratY);
  }, { passive: false });
});

window.addEventListener('resize', () => {
  setRatPosition(ratX, ratY, false);
});

yesBtn2.addEventListener('click', () => {
  clearInterval(ratInterval);
  document.removeEventListener('mousemove', onPointerNear);
  document.removeEventListener('touchmove', onPointerNear);
  document.removeEventListener('touchstart', onPointerNear);
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
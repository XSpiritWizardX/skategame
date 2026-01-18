const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("start-btn");
const overlayTitle = document.getElementById("overlay-title");
const overlayText = document.getElementById("overlay-text");

const scoreLabel = document.getElementById("score");
const bestLabel = document.getElementById("best");
const speedLabel = document.getElementById("speed");

const world = {
  groundY: 320,
  gravity: 0.6,
  speed: 4,
  maxSpeed: 10,
  laneHeight: 50,
};

const skater = {
  x: 180,
  y: world.groundY - 42,
  width: 48,
  height: 42,
  vy: 0,
  jumpPower: 12,
  crouch: false,
  boost: 0,
  rotation: 0,
  combo: 1,
  airborne: false,
};

let obstacles = [];
let particles = [];
let score = 0;
let best = 0;
let running = false;
let tick = 0;

const obstacleTypes = [
  { type: "cone", width: 28, height: 30, color: "#f96f8f" },
  { type: "bin", width: 38, height: 46, color: "#1f242c" },
  { type: "bar", width: 80, height: 18, color: "#3c4656", low: true },
];

function resetGame() {
  obstacles = [];
  particles = [];
  score = 0;
  tick = 0;
  world.speed = 4;
  skater.vy = 0;
  skater.y = world.groundY - skater.height;
  skater.crouch = false;
  skater.boost = 0;
  skater.rotation = 0;
  skater.combo = 1;
  skater.airborne = false;
  updateHUD();
}

function updateHUD() {
  scoreLabel.textContent = `Score: ${Math.floor(score)}`;
  bestLabel.textContent = `Best: ${Math.floor(best)}`;
  speedLabel.textContent = `Speed: ${(world.speed / 4).toFixed(1)}x`;
}

function spawnObstacle() {
  const choice = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
  const gap = 260 + Math.random() * 180;
  const lastX = obstacles.length ? obstacles[obstacles.length - 1].x : canvas.width + 200;

  obstacles.push({
    ...choice,
    x: lastX + gap,
    y: choice.low ? world.groundY - choice.height - 36 : world.groundY - choice.height,
  });
}

function addParticles(x, y) {
  for (let i = 0; i < 6; i += 1) {
    particles.push({
      x,
      y,
      vx: -2 + Math.random() * 4,
      vy: -2 + Math.random() * 2,
      life: 30 + Math.random() * 20,
    });
  }
}

function updateSkater() {
  skater.vy += world.gravity;
  skater.y += skater.vy;

  if (skater.y >= world.groundY - skater.height) {
    if (skater.airborne && skater.vy > 0) {
      skater.combo += 1;
      score += 15 * skater.combo;
      addParticles(skater.x + skater.width / 2, world.groundY - 6);
    }

    skater.y = world.groundY - skater.height;
    skater.vy = 0;
    skater.rotation = 0;
    skater.airborne = false;
  } else {
    skater.airborne = true;
    skater.rotation += 0.08;
  }

  if (skater.crouch) {
    skater.height = 30;
  } else {
    skater.height = 42;
  }

  if (skater.boost > 0) {
    skater.boost -= 1;
    world.speed = Math.min(world.speed + 0.04, world.maxSpeed);
    score += 0.6 * skater.combo;
  } else {
    world.speed = Math.max(4, world.speed - 0.02);
  }
}

function updateObstacles() {
  if (obstacles.length < 4) {
    spawnObstacle();
  }

  obstacles.forEach((obs) => {
    obs.x -= world.speed;
  });

  obstacles = obstacles.filter((obs) => obs.x + obs.width > 0);
}

function checkCollision() {
  for (const obs of obstacles) {
    const skaterTop = skater.y;
    const skaterBottom = skater.y + skater.height;
    const skaterLeft = skater.x + 6;
    const skaterRight = skater.x + skater.width - 6;

    const obsLeft = obs.x;
    const obsRight = obs.x + obs.width;
    const obsTop = obs.y;
    const obsBottom = obs.y + obs.height;

    const hit =
      skaterRight > obsLeft &&
      skaterLeft < obsRight &&
      skaterBottom > obsTop &&
      skaterTop < obsBottom;

    if (hit) {
      return true;
    }
  }
  return false;
}

function updateParticles() {
  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.1;
    p.life -= 1;
  });

  particles = particles.filter((p) => p.life > 0);
}

function drawBackground() {
  ctx.fillStyle = "#ecf8ff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f7c849";
  ctx.beginPath();
  ctx.arc(800, 80, 50, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#cdd9e6";
  for (let i = 0; i < 6; i += 1) {
    ctx.fillRect(i * 180 + 40, 160, 80, 80);
    ctx.fillRect(i * 180 + 80, 120, 60, 120);
  }

  ctx.fillStyle = "#f2e8dc";
  ctx.fillRect(0, world.groundY, canvas.width, canvas.height - world.groundY);

  ctx.strokeStyle = "#c1b8ae";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, world.groundY + 6);
  ctx.lineTo(canvas.width, world.groundY + 6);
  ctx.stroke();
}

function drawSkater() {
  ctx.save();
  ctx.translate(skater.x + skater.width / 2, skater.y + skater.height / 2);
  ctx.rotate(skater.rotation);
  ctx.fillStyle = "#1f242c";
  ctx.fillRect(-22, -10, 44, 20);

  ctx.fillStyle = "#7fe1c7";
  ctx.fillRect(-16, -26, 32, 16);

  ctx.fillStyle = "#f96f8f";
  ctx.beginPath();
  ctx.arc(-14, 12, 6, 0, Math.PI * 2);
  ctx.arc(14, 12, 6, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawObstacles() {
  obstacles.forEach((obs) => {
    ctx.fillStyle = obs.color;
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

    if (obs.type === "bar") {
      ctx.fillStyle = "#f7c849";
      ctx.fillRect(obs.x + 10, obs.y + 4, obs.width - 20, 6);
    }
  });
}

function drawParticles() {
  particles.forEach((p) => {
    ctx.fillStyle = "rgba(249, 111, 143, 0.7)";
    ctx.fillRect(p.x, p.y, 4, 4);
  });
}

function draw() {
  drawBackground();
  drawObstacles();
  drawSkater();
  drawParticles();
}

function gameLoop() {
  if (!running) return;

  tick += 1;
  updateSkater();
  updateObstacles();
  updateParticles();

  if (tick % 90 === 0) {
    score += 10 * skater.combo;
  }

  if (checkCollision()) {
    running = false;
    best = Math.max(best, score);
    overlayTitle.textContent = "Wipeout!";
    overlayText.textContent = "You clipped a street obstacle. Press R or Start to ride again.";
    overlay.classList.remove("hidden");
    updateHUD();
    return;
  }

  score += 0.15 * skater.combo;
  updateHUD();
  draw();
  requestAnimationFrame(gameLoop);
}

function jump() {
  if (skater.y >= world.groundY - skater.height - 2) {
    skater.vy = -skater.jumpPower;
  }
}

function kick() {
  skater.boost = 20;
  skater.combo = Math.min(skater.combo + 1, 6);
  addParticles(skater.x + skater.width / 2, skater.y + skater.height);
}

function startGame() {
  resetGame();
  running = true;
  overlay.classList.add("hidden");
  gameLoop();
}

startBtn.addEventListener("click", startGame);

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    if (!running) {
      startGame();
      return;
    }
    jump();
  }
  if (event.code === "ShiftLeft" || event.code === "ShiftRight") {
    if (running) {
      kick();
    }
  }
  if (event.code === "ArrowDown") {
    skater.crouch = true;
  }
  if (event.code === "KeyR") {
    startGame();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "ArrowDown") {
    skater.crouch = false;
  }
});

resetGame();
draw();

import Board from './board.js';
import { randomPiece } from './piece.js';
import Score from './score.js';
import { addEntry, showLeaderboard, setup as setupLeaderboard } from './leaderboard.js';
import { track } from './analytics.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const board = new Board(10, 20);
const score = new Score();

let scale = 30;
function resizeCanvas() {
  const block = Math.floor(
    Math.min(window.innerWidth / board.width, window.innerHeight / board.height)
  );
  canvas.width = block * board.width;
  canvas.height = block * board.height;
  scale = block;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let currentPiece = randomPiece();
let dropCounter = 0;
const baseDropInterval = 1000;
let dropInterval = baseDropInterval;
let lastTime = 0;
let animationId = null;
let isRunning = false;
let locking = false;
const hud = document.getElementById('hud');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const soundToggle = document.getElementById('sound-toggle');
setupLeaderboard();

startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', pauseGame);
const sounds = {};
let soundEnabled = false;
let soundOn = true;

function playSfx(name) {
  if (!soundEnabled || !soundOn) return;
  const audio = sounds[name];
  if (audio) {
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

async function loadSounds() {
  const load = async (key, src) => {
    try {
      const res = await fetch(src, { method: 'HEAD' });
      if (res.ok) {
        sounds[key] = new Audio(src);
      }
    } catch {
      // ignore missing file
    }
  };

  await Promise.all([
    load('move', './assets/sfx/move.wav'),
    load('rotate', './assets/sfx/rotate.wav'),
    load('line', './assets/sfx/line.wav'),
  ]);

  soundEnabled = Object.keys(sounds).length > 0;
  if (soundEnabled) {
    soundToggle.style.display = 'inline-block';
    soundToggle.addEventListener('click', () => {
      soundOn = !soundOn;
      soundToggle.textContent = soundOn ? 'Mute' : 'Unmute';
    });
  }
}

loadSounds();

function drawMatrix(matrix, offset, colorMap) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value) {
        const color = colorMap ? colorMap : value;
        ctx.fillStyle = color;
        ctx.fillRect((x + offset.x) * scale, (y + offset.y) * scale, scale, scale);
        ctx.strokeStyle = '#000';
        ctx.strokeRect((x + offset.x) * scale, (y + offset.y) * scale, scale, scale);
      }
    });
  });
}

function getGhost() {
  const ghost = {
    x: currentPiece.x,
    y: currentPiece.y,
    matrix: currentPiece.matrix,
  };
  while (!collide(board, ghost, 0, 1)) {
    ghost.y += 1;
  }
  return ghost;
}

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(board.grid, { x: 0, y: 0 }, null);
  const ghost = getGhost();
  ctx.save();
  ctx.globalAlpha = 0.3;
  drawMatrix(ghost.matrix, { x: ghost.x, y: ghost.y }, currentPiece.color);
  ctx.restore();
  drawMatrix(currentPiece.matrix, { x: currentPiece.x, y: currentPiece.y }, currentPiece.color);
}

function collide(boardObj, piece, offsetX = 0, offsetY = 0) {
  const m = piece.matrix;
  for (let y = 0; y < m.length; y += 1) {
    for (let x = 0; x < m[y].length; x += 1) {
      if (m[y][x]) {
        const newX = piece.x + x + offsetX;
        const newY = piece.y + y + offsetY;
        if (newX < 0 || newX >= boardObj.width || newY >= boardObj.height) {
          return true;
        }
        if (newY >= 0 && boardObj.grid[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

function mergeAndSpawn() {
  board.merge(currentPiece);
  const lines = board.clearLines();
  if (lines) {
    playSfx('line');
    track('line_clear', { lines });
  }
  const leveledUp = score.addLines(lines);
  if (leveledUp) {
    dropInterval = Math.max(100, baseDropInterval - score.level * 100);
    track('level_up', { level: score.level });
  }
  currentPiece = randomPiece();
  if (collide(board, currentPiece)) {
    const finalScore = score.score;
    track('game_over', { score: finalScore });
    const name = prompt('Enter your name') || 'Anonymous';
    addEntry(name, finalScore);
    showLeaderboard();
    board.reset();
    score.reset();
    dropInterval = baseDropInterval;
  }
}

function movePiece(dx, dy, user = false) {
  if (locking) return;
  if (!collide(board, currentPiece, dx, dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
    if (user) {
      playSfx('move');
    }
  } else if (dy === 1) {
    if (user) {
      playSfx('move');
    }
    lockPiece();
  }
  dropCounter = 0;
}

function rotatePiece(user = false) {
  if (locking) return;
  currentPiece.rotate();
  if (collide(board, currentPiece)) {
    currentPiece.rotateBack();
  } else if (user) {
    playSfx('rotate');
  }
}

function lockPiece() {
  locking = true;
  const pieceCopy = {
    matrix: currentPiece.matrix.map((row) => row.slice()),
    x: currentPiece.x,
    y: currentPiece.y,
    color: currentPiece.color,
  };
  let alpha = 1;
  function fade() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawMatrix(board.grid, { x: 0, y: 0 }, null);
    ctx.save();
    ctx.globalAlpha = alpha;
    drawMatrix(pieceCopy.matrix, { x: pieceCopy.x, y: pieceCopy.y }, pieceCopy.color);
    ctx.restore();
    alpha -= 0.1;
    if (alpha > 0) {
      requestAnimationFrame(fade);
    } else {
      currentPiece = pieceCopy;
      mergeAndSpawn();
      locking = false;
    }
  }
  fade();
}

document.addEventListener('keydown', (event) => {
  if (!isRunning) return;
  switch (event.key) {
    case 'ArrowLeft':
      movePiece(-1, 0, true);
      break;
    case 'ArrowRight':
      movePiece(1, 0, true);
      break;
    case 'ArrowDown':
      movePiece(0, 1, true);
      break;
    case 'ArrowUp':
      rotatePiece(true);
      break;
    case ' ':
      hardDrop();
      break;
    default:
      break;
  }
});

function hardDrop() {
  if (locking) return;
  const ghost = getGhost();
  let distance = ghost.y - currentPiece.y;
  function step() {
    if (distance > 0) {
      currentPiece.y += 1;
      distance -= 1;
      draw();
      requestAnimationFrame(step);
    } else {
      lockPiece();
    }
  }
  step();
}

function updateHUD() {
  hud.innerHTML = `Score: ${score.score}<br>Level: ${score.level}<br>Lines: ${score.lines}`;
}

function startGame() {
  if (!isRunning) {
    isRunning = true;
    lastTime = 0;
    track('game_start');
    update();
  }
}

function pauseGame() {
  if (isRunning) {
    isRunning = false;
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
  }
}

function update(time = 0) {
  if (!isRunning) return;
  const delta = time - lastTime;
  lastTime = time;
  dropCounter += delta;
  if (!locking) {
    if (dropCounter > dropInterval) {
      movePiece(0, 1);
    }
    draw();
  }
  updateHUD();
  animationId = requestAnimationFrame(update);
}

updateHUD();

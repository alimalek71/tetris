import Board from './board.js';
import { randomPiece } from './piece.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scale = canvas.width / 10; // cell size 30 for 300 width

const board = new Board(10, 20);
let currentPiece = randomPiece();
let dropCounter = 0;
let dropInterval = 1000;
let lastTime = 0;

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

function draw() {
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawMatrix(board.grid, { x: 0, y: 0 }, null);
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
  board.clearLines();
  currentPiece = randomPiece();
  if (collide(board, currentPiece)) {
    board.reset();
  }
}

function movePiece(dx, dy) {
  if (!collide(board, currentPiece, dx, dy)) {
    currentPiece.x += dx;
    currentPiece.y += dy;
  } else if (dy === 1) {
    mergeAndSpawn();
  }
  dropCounter = 0;
}

function rotatePiece() {
  currentPiece.rotate();
  if (collide(board, currentPiece)) {
    currentPiece.rotateBack();
  }
}

document.addEventListener('keydown', (event) => {
  switch (event.key) {
    case 'ArrowLeft':
      movePiece(-1, 0);
      break;
    case 'ArrowRight':
      movePiece(1, 0);
      break;
    case 'ArrowDown':
      movePiece(0, 1);
      break;
    case 'ArrowUp':
      rotatePiece();
      break;
    default:
      break;
  }
});

function update(time = 0) {
  const delta = time - lastTime;
  lastTime = time;
  dropCounter += delta;
  if (dropCounter > dropInterval) {
    movePiece(0, 1);
  }
  draw();
  requestAnimationFrame(update);
}

update();

const SHAPES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

const COLORS = {
  I: 'cyan',
  J: 'blue',
  L: 'orange',
  O: 'yellow',
  S: 'green',
  T: 'purple',
  Z: 'red',
};

function rotateMatrix(matrix) {
  const N = matrix.length;
  const M = matrix[0].length;
  const result = Array.from({ length: M }, () => Array(N).fill(0));
  for (let y = 0; y < N; y += 1) {
    for (let x = 0; x < M; x += 1) {
      result[x][N - 1 - y] = matrix[y][x];
    }
  }
  return result;
}

export class Piece {
  constructor(type) {
    this.type = type;
    this.matrix = SHAPES[type].map((row) => row.slice());
    this.color = COLORS[type];
    this.x = 3;
    this.y = 0;
  }

  rotate() {
    this.matrix = rotateMatrix(this.matrix);
  }

  rotateBack() {
    this.matrix = rotateMatrix(rotateMatrix(rotateMatrix(this.matrix)));
  }
}

export function randomPiece() {
  const types = Object.keys(SHAPES);
  const type = types[(Math.random() * types.length) | 0];
  return new Piece(type);
}

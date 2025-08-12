export default class Board {
  constructor(width = 10, height = 20) {
    this.width = width;
    this.height = height;
    this.reset();
  }

  reset() {
    this.grid = Array.from({ length: this.height }, () => Array(this.width).fill(0));
  }

  inside(x, y) {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  merge(piece) {
    piece.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (this.inside(boardX, boardY)) {
            this.grid[boardY][boardX] = piece.color;
          }
        }
      });
    });
  }

  clearLines() {
    let lines = 0;
    for (let y = this.height - 1; y >= 0; y -= 1) {
      if (this.grid[y].every((cell) => cell !== 0)) {
        this.grid.splice(y, 1);
        this.grid.unshift(Array(this.width).fill(0));
        lines += 1;
        y += 1; // recheck same row index after dropping
      }
    }
    return lines;
  }
}

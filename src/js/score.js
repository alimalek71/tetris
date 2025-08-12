export default class Score {
  constructor() {
    this.reset();
  }

  reset() {
    this.score = 0;
    this.level = 0;
    this.lines = 0;
  }

  calculateScore(lines) {
    const scoring = { 1: 40, 2: 100, 3: 300, 4: 1200 };
    return (scoring[lines] || 0) * (this.level + 1);
  }

  addLines(cleared) {
    if (!cleared) {
      return false;
    }
    this.score += this.calculateScore(cleared);
    this.lines += cleared;
    const newLevel = Math.floor(this.lines / 10);
    const levelUp = newLevel > this.level;
    this.level = newLevel;
    return levelUp;
  }
}

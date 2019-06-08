import { Board } from "../new-tetris/board";
import { randomInteger } from "../utils";

export default class Heuristic {
  completedLines: number;
  height: number;
  holes: number;
  bumpiness: number;

  constructor(data: { completedLines: number, height: number, holes: number, bumpiness: number } = undefined) {
    if (data !== undefined) {
      this.completedLines = data.completedLines;
      this.height = data.height;
      this.holes = data.holes;
      this.bumpiness = data.bumpiness;
    }
  }

  randomize() {
    this.completedLines = Math.random() - 0.5;
    this.height = Math.random() - 0.5;
    this.holes = Math.random() - 0.5;
    this.bumpiness = Math.random() - 0.5;

    this.normalize();
  }

  score(board: Board) {
    return -this.height * board.height()
      + this.completedLines * board.completedLines()
      - this.holes * board.holes()
      - this.bumpiness * board.bumpiness();
  }

  normalize() {
    var norm = Math.sqrt(this.height * this.height + this.completedLines * this.completedLines + this.holes * this.holes + this.bumpiness * this.bumpiness);
    if (norm === 0) {
      return;
    }
    this.height /= norm;
    this.completedLines /= norm;
    this.holes /= norm;
    this.bumpiness /= norm;
  }

  mutate() {
    var quantity = Math.random() * 0.4 - 0.2;
    switch(randomInteger(0, 4)) {
      case 0:
        this.completedLines += quantity;
        break;
      case 1:
        this.height += quantity;
        break;
      case 2:
        this.holes += quantity;
        break;
      case 3:
        this.bumpiness += quantity;
        break;
    }
  }

  toString() {
    return `${this.completedLines}, ${this.height}, ${this.holes}, ${this.bumpiness}`;
  }
}

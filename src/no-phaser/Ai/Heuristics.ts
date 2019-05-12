import Board from "../Tetris/Board";
import { randomNumber } from "../../Utils";

export default class Heuristic {
  _completedLines: number;
  _height: number;
  _holes: number;
  _bumpiness: number;

  constructor(data: { completedLines: number, height: number, holes: number, bumpiness: number } = undefined) {
    if (data !== undefined) {
      this._completedLines = data.completedLines;
      this._height = data.height;
      this._holes = data.holes;
      this._bumpiness = data.bumpiness;
    }
  }

  randomize() {
    this._completedLines = Math.random() - 0.5;
    this._height = Math.random() - 0.5;
    this._holes = Math.random() - 0.5;
    this._bumpiness = Math.random() - 0.5;

    this.normalize();
  }

  score(board: Board) {
    return this._completedLines * this.completedLines(board)
      - this._height * this.height(board)
      - this._holes * this.holes(board)
      - this._bumpiness * this.bumpiness(board);
  }

  normalize() {
    var norm = Math.sqrt(this._height * this._height + this._completedLines * this._completedLines + this._holes * this._holes + this._bumpiness * this._bumpiness);
    this._height /= norm;
    this._completedLines /= norm;
    this._holes /= norm;
    this._bumpiness /= norm;
  }

  mutate() {
    if (Math.random() <= 0.05) {
      const toAdd = randomNumber(-0.2, 0.2);
      switch(randomNumber(0, 3)) {
        case 0:
          this._completedLines += toAdd;
          break;
        case 1:
          this._height += toAdd;
          break;
        case 2:
          this._holes += toAdd;
          break;
        case 3:
          this._bumpiness += toAdd;
          break;
      }
    }
  }

  height(board: Board) {
    for(let y = board.length - 1; y > 0; y--) {
      if (board.isRowEmpty(y)) {
        this._height = (board.length - 1) - y;
        return this._height;
      }
    }
  }

  completedLines(board: Board) {
    this._completedLines = board.grid.reduce((acc, next) => {
      return next.every(value => value !== null) ? acc + 1 : acc;
    }, 0);

    return this._completedLines;
  }

  holes(board: Board) {
    let count = 0;
    for(let y = 0; y < board.length; y++) {
      let block = false;
      for(let x = 0; x < board.row(0).length; x++) {
        if (board.column(x, y) !== null) {
          block = true;
        } else if (board.column(x, y) === null && block) {
          count += 1;
        }
      }
    }
    this._holes = count;
    return this._holes;
  }

  bumpiness(board: Board) {
    let total = 0;
    let previous = 0;
    let current = 0;
    previous = board.columnHeight(0);
    for(let y = 1; y < board.row(0).length - 1; y++) {
      current = board.columnHeight(y);
      total += Math.abs(previous - current);
      previous = current;
    }

    this._bumpiness = total;
    return total;
  }
}

import Board from "../Tetris/Board";
import { randomNumber, randomInteger } from "../../Utils";

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
    return -(this._height * this.height(board))
      + (this._completedLines * this.completedLines(board))
      - (this._holes * this.holes(board))
      - (this._bumpiness * this.bumpiness(board));
  }

  normalize() {
    var norm = Math.sqrt(this._height * this._height + this._completedLines * this._completedLines + this._holes * this._holes + this._bumpiness * this._bumpiness);
    if (norm === 0) {
      return;
    }
    this._height /= norm;
    this._completedLines /= norm;
    this._holes /= norm;
    this._bumpiness /= norm;
  }

  mutate() {
    var quantity = Math.random() * 0.4 - 0.2;
    switch(randomInteger(0, 4)) {
      case 0:
        this._completedLines += quantity;
        break;
      case 1:
        this._height += quantity;
        break;
      case 2:
        this._holes += quantity;
        break;
      case 3:
        this._bumpiness += quantity;
        break;
    }
  }

  height(board: Board) {
    var total = 0;
    for(var c = 0; c < board.row(0).length; c++){
        total += board.columnHeight(c);
    }
    return total;
  }

  completedLines(board: Board) {
    var count = 0;
    for (var r = 0; r < board.row(0).length; r++) {
      if (board.isRowFull(r)){
        count++;
      }
    }
    
    return count;
  }

  holes(board: Board) {
    let count = 0
    for(var c = 0; c < board.row(0).length; c++){
      var block = false;
      for(var r = 0; r < board.grid.length; r++){
        if (board.grid[r][c] !== null) {
            block = true;
        } else if (board.grid[r][c] === null && block){
          count++;
        }
      }
    }

    return count;
  }

  bumpiness(board: Board) {
    let total = 0;
    for(var c = 0; c < board.row(0).length - 1; c++){
      total += Math.abs(board.columnHeight(c) - board.columnHeight(c + 1));
    }

    return total;
  }

  toString() {
    return `${this._completedLines}, ${this._height}, ${this._holes}, ${this._bumpiness}`;
  }
}

import Board from "../Tetris/Board";

interface HeuristicsScore {
  completedLines: number;
  height: number;
  holes: number;
  bumpiness: number;
}

export default class Heuristic {
  heuristicsScore: HeuristicsScore;

  constructor() {
    this.heuristicsScore.completedLines = Math.random();
    this.heuristicsScore.height = Math.random();
    this.heuristicsScore.holes = Math.random();
    this.heuristicsScore.bumpiness = Math.random();
  }

  score(board: Board) {
    return this.heuristicsScore.completedLines * this.completedLines(board)
      - this.heuristicsScore.height * this.height(board)
      - this.heuristicsScore.holes * this.holes(board)
      - this.heuristicsScore.bumpiness * this.bumpiness(board);
  }

  format(): HeuristicsScore {
    return this.heuristicsScore;
  }

  height(board: Board) {
    let result = 0;
    const ignoreList: number[] = [];

    for(let y = 0; y < board.length; y++) {
      for(let x = 0; x < board.row(y).length; x++) {
        if (board.column(y, x) && ignoreList.indexOf(x) >= 0) {
          result += board.length - y;
          ignoreList.push(x);
        }
      }
    }
    return result;
  }

  completedLines(board: Board) {
    return board.grid.reduce((acc, next) => {
      return next.every(value => value !== null) ? acc + 1 : acc;
    }, 0)
  }

  holes(board: Board) {
    let result = 0;
    for(let x = 0; x < board.row(0).length; x++) {
      let isCounting = false;
      for(let y = 0; y < board.length; y++) {
        if (isCounting && board.column(y, x) === null) {
          result += 1;
        } else if (!isCounting && board.column(y, x) !== null) {
          isCounting = true;
        }
      }
    }
    return result;
  }

  bumpiness(board: Board) {
    let result = 0;
    let previous = 0;
    let isFirst = true;
    for(let x = 0; x < board.row(0).length; x++) {
      let found = false;
      for(let y = 0; y < board.length; y++) {
        if (board.column(y, x) !== null) {
          const top = board.length - y;
          result += previous + top;
          previous = top;
          if (isFirst) {
            result = 0;
            isFirst = false;
          }
          found = true;
          break;
        }
      }
      if (!found) {
        result += previous + 0;
        previous = 0;
      }
    }
    return result;
  }
}


Tetris.Heuristics = {
  theMagic: {
    completedLines: 0,
    height: 0,
    holes: 0,
    bumpiness: 0
  },

  init: function() {
    this.theMagic.completedLines = Math.random();
    this.theMagic.height = Math.random();
    this.theMagic.holes = Math.random();
    this.theMagic.bumpiness = Math.random();
  },

  getBestMove: function(board, shapes, index) {
    const clonedBoard = board.clone();

    return this.getBestImprove(clonedBoard, shapes, index);
  },

  getBestImprove: function(board, shapes, index) {
    let best = null;
    let bestScore = null;
    let activeShape = shapes[index];

    for(let rotation = 0; rotation < 3; rotation++){
        const copiedActiveShape = activeShape.clone();
        for(let i = 0; i < rotation; i++){
            copiedActiveShape.rotate(false, false)
        }

        while(copiedActiveShape.moveShape(Tetris.LEFT, false, false));
        
        let direction = Tetris.CURRENT;
        while(copiedActiveShape.moveShape(direction, false, false)){
            const _pieceSet = copiedActiveShape.clone();
            _pieceSet.autoDrop();

            _pieceSet.placeShapeInBoard(board);

            let score = null;
            if (index === (shapes.length - 1)) {
              score = this.computeScore(board, this.theMagic)
            } else {
              score = this.getBestMove(board, shapes, index + 1).score;
            }
            _pieceSet.removeShapeInBoard(board);

            if (score > bestScore || bestScore == null){
              bestScore = score;
              best = copiedActiveShape.clone();
            }

            direction = Tetris.RIGHT;
        }
    }
    console.log(index)
    return { piece: best, score: bestScore };
  },

  computeScore: function(board, parameters) {
    return parameters.completedLines * this.completedLines(board)
    - parameters.height * this.height(board)
    - parameters.holes * this.holes(board)
    - parameters.bumpiness * this.bumpiness(board);
  },

  height: function(board) {
    let result = 0;
    const ignoreList = [];

    for(let y = 0; y < board.length; y++) {
      for(let x = 0; x < board[y].length; x++) {
        if (board[y][x] && !ignoreList.includes(x)) {
          result += board.length - y;
          ignoreList.push(x);
        }
      }
    }
    return result;
  },

  completedLines: function(board) {
    return board.reduce((acc, next) => {
      return next.every(value => value !== null) ? acc + 1 : acc;
    }, 0)
  },

  holes: function(board) {
    let result = 0;
    for(let x = 0; x < board[0].length; x++) {
      let isCounting = false;
      for(let y = 0; y < board.length; y++) {
        if (isCounting && board[y][x] === null) {
          result += 1;
        } else if (!isCounting && board[y][x] !== null) {
          isCounting = true;
        }
      }
    }
    return result;
  },

  bumpiness: function(board) {
    let result = 0;
    let previous = 0;
    let isFirst = true;
    for(let x = 0; x < board[0].length; x++) {
      let found = false;
      for(let y = 0; y < board.length; y++) {
        if (board[y][x] !== null) {
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

Tetris.Board = function() {
  this.board = [];
}

Tetris.Board.prototype = {
    new: function() {
      const board = Array(Tetris.BOARD_HEIGHT);
      for (i = 0; i < Tetris.BOARD_HEIGHT; i++) {
        board[i] = Array(Tetris.BOARD_WIDTH).fill(null);
      }
      return board;
    },
      
    clone: function() {
      const newBoard = Array(Tetris.BOARD_HEIGHT);
    
      for (i = 0; i < Tetris.BOARD_HEIGHT; i++) {
        newBoard[i] = Array(Tetris.BOARD_WIDTH);
        for (j = 0; j < Tetris.BOARD_WIDTH; j++) {
          newBoard[i][j] = this.board[i][j] !== null ? `${i} ${j}` : null;
        }
      }
    
      return newBoard;
    }
}
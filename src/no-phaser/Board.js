
export class Board {
  constructor() {
    this.board = null;
  }

  init() {
    // Creates [][] array of nulls
    this.board = Array.from({length: Tetris.BOARD_HEIGHT},
        () => Array(Tetris.BOARD_WIDTH).fill(null))
  }
    
  clone() {
    const newBoard = Array(Tetris.BOARD_HEIGHT);
    
    for (i = 0; i < Tetris.BOARD_HEIGHT; i++) {
      for (j = 0; j < Tetris.BOARD_WIDTH; j++) {
        newBoard[i][j] = this.board[i][j] !== null ? `${i} ${j}` : null;
      }
    }
  
    return newBoard;
  }

  placeShapeInBoard(blocks) {
    blocks.forEach(block => this.board[block.y][block.x] = block);
  }

  removeShapeInBoard(blocks) {
    blocks.forEach(block => this.board[block.y][block.x] = null);
  }

  isOnBoard(x, y) {
    if (typeof x === 'object') {
      return x.x >= 0 && x.y >= 0 && 
        x.x < this.BOARD_WIDTH && x.y < this.BOARD_HEIGHT  
    }

    return x >= 0 && y >= 0 && 
       x < this.BOARD_WIDTH && y < this.BOARD_HEIGHT
  }
  
  isOccupied(x, y) {
    if (typeof x === 'object') {
      return this.board[x.y][x.x] !== null; 
    }
    return this.board[y][x] !== null;
  }

  moveLogic(block, direction) {
    switch(direction) {
      case Tetris.CURRENT:
        return { x: block.x, y: block.y };
      case Tetris.DOWN:
        return { x: block.x, y: block.y + 1 };
      case Tetris.LEFT:
        return {x: block.x - 1, y: block.y };
      case Tetris.RIGHT:
        return {x: block.x + 1, y: block.y };
    }  
  }

  canMoveShape(blocks, direction) {
    return blocks.every(block => {
      const position = moveLogic(block, direction);
      return this.isOnBoard(position) && !this.isOccupied(position)
    })
  }


}
import { Block } from "./Block";
import { Shape } from "./Shape";

export class Board {
  BOARD_HEIGHT: 10;
  BOARD_WIDTH: 16;
  board: Block[][];
  constructor(init = false) {
    this.board = null;
    if (init) {
      this.init();
    }
  }

  init() {
    // Creates [][] array of nulls
    this.board = Array.from({length: this.BOARD_HEIGHT},
        () => Array(Tetris.BOARD_WIDTH).fill(null))
  }
    
  clone() {
    const newBoard = Array(Tetris.BOARD_HEIGHT);
    
    for (let i = 0; i < Tetris.BOARD_HEIGHT; i++) {
      for (let j = 0; j < Tetris.BOARD_WIDTH; j++) {
        newBoard[i][j] = this.board[i][j] !== null ? `${i} ${j}` : null;
      }
    }
  
    return newBoard;
  }

  placeShapeInBoard(shape) {
    shape.blocks.forEach(block => this.board[block.y][block.x] = block);
  }

  removeShapeInBoard(blocks) {
    blocks.forEach(block => this.board[block.y][block.x] = null);
  }

  isOnBoard(position) {
    return position.x >= 0 &&
          position.y >= 0 && 
          position.x < this.BOARD_WIDTH &&
          position.y < this.BOARD_HEIGHT  
  }
  
  isOccupied(position: {x: number, y: number }): boolean {
    return this.board[position.y][position.x] !== null; 
  }

  moveLogic(block, direction): {x: number, y: number} {
    switch(direction) {
      case Tetris.CURRENT:
        return { x: block.x, y: block.y };
      case Tetris.DOWN:
        return { x: block.x, y: block.y + 1 };
      case Tetris.LEFT:
        return { x: block.x - 1, y: block.y };
      case Tetris.RIGHT:
        return { x: block.x + 1, y: block.y };
    }  
  }

  canMoveShape(blocks: Block[], direction): boolean {
    return blocks.every(block => {
      const position = this.moveLogic(block, direction);
      return this.isOnBoard(position) && !this.isOccupied(position)
    })
  }

  getCompleteRows(): number[] {
    const result = [];
    
    this.board.forEach((_, index) => {
      if (this.isRowFull(index)) {
        result.push(index);
      }
    })

    return result;
  }

  isRowFull(row): boolean {
    return this.board[row].every(column => column !== null);
  }

  clearRows(completedRows) {
    let alreadyShifted = 0;

    for (let i = completedRows.length - 1; i >= 0; i--) {
      let actualRowToClear = completedRows[i] + alreadyShifted;
      let row = this.board[actualRowToClear];

      for (let j = 0; j < row.length; j++) {
        this.board[actualRowToClear][j] = null;
      }
      this.dropRowsAbove(actualRowToClear - 1);
      alreadyShifted++;
    }
  }

  dropRowsAbove(row) {
    for (let i = row; i >= 0; i--) {
      for (let j = 0; j < this.board[i].length; j++) {
        let block = this.board[i][j];
        if (block !== null) {
          this.board[i][j].moveBlock(block.x, block.y + 1);
          this.board[i + 1][j] = this.board[i][j];
          this.board[i][j] = null;
        }
      }
    }
  }

}
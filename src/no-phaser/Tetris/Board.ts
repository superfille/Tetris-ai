import { Block } from "./Block";
import { Shape } from "./Shape";
import { BoardDimension, Directions } from '../../static_numbers';

export class Board {
  board: Block[][];
  constructor(init = false) {
    this.board = null;
    if (init) {
      this.init();
    }
  }

  init() {
    // Creates [][] array of nulls
    this.board = Array.from({length: BoardDimension.BOARD_HEIGHT},
        () => Array(BoardDimension.BOARD_WIDTH).fill(null))
  }
    
  clone() {
    const newBoard = Array(BoardDimension.BOARD_HEIGHT);
    
    for (let i = 0; i < BoardDimension.BOARD_HEIGHT; i++) {
      for (let j = 0; j < BoardDimension.BOARD_WIDTH; j++) {
        newBoard[i][j] = this.board[i][j] !== null ? `${i} ${j}` : null;
      }
    }
  
    return newBoard;
  }

  placeShapeInBoard(shape: Shape) {
    shape.blocks.forEach(block => this.board[block.y][block.x] = block);
  }

  removeShapeInBoard(blocks: Block[]) {
    blocks.forEach(block => this.board[block.y][block.x] = null);
  }

  isOnBoard(position: { x: number, y: number }) {
    return position.x >= 0 &&
          position.y >= 0 && 
          position.x < BoardDimension.BOARD_WIDTH &&
          position.y < BoardDimension.BOARD_HEIGHT  
  }
  
  isOccupied(position: {x: number, y: number }): boolean {
    return this.board[position.y][position.x] !== null; 
  }

  moveLogic(block: Block, direction: Directions): {x: number, y: number} {
    switch(direction) {
      case Directions.CURRENT:
        return { x: block.x, y: block.y };
      case Directions.DOWN:
        return { x: block.x, y: block.y + 1 };
      case Directions.LEFT:
        return { x: block.x - 1, y: block.y };
      case Directions.RIGHT:
        return { x: block.x + 1, y: block.y };
    }  
  }

  canMoveShape(blocks: Block[], direction: Directions): boolean {
    return blocks.every(block => {
      const position = this.moveLogic(block, direction);
      return this.isOnBoard(position) && !this.isOccupied(position)
    })
  }

  getCompleteRows(): number[] {
    const result: number[] = [];
    
    this.board.forEach((_, index) => {
      if (this.isRowFull(index)) {
        result.push(index);
      }
    })

    return result;
  }

  isRowFull(row: number): boolean {
    return this.board[row].every(column => column !== null);
  }

  clearRows(completedRows: number[]) {
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

  dropRowsAbove(row: number) {
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
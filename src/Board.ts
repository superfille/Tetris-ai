import { BoardDimension } from './static_numbers';
import Block from './Block';
import Shape from './Shape';

export default class Board {
  grid: Block[][];

  constructor () {
    this.grid = Array(BoardDimension.BOARD_ROWS);
    for (let i = 0; i < BoardDimension.BOARD_ROWS; i++) {
      const row: Block[] = Array(BoardDimension.BOARD_COLUMNS).fill(null);
      this.grid[i] = row;
    }
  }

  clone() {
    const newBoard = new Board();

    for (let x = 0; x < BoardDimension.BOARD_ROWS; x++) {
      for (let y = 0; y < BoardDimension.BOARD_COLUMNS; y++) {
        newBoard.grid[x][y] =
          this.grid[x][y] !== null ? this.grid[x][y].clone() : null;
      }
    }
  
    return newBoard;
  }
  
  get length(): number {
    return this.grid.length;
  }

  row(y: number): Block[] {
    return this.grid[y];
  }

  column(x: number, y: number): Block {
    return this.grid[y][x];
  }

  columnHeight(column: number): number {
    for(let row = 0; row < this.grid.length; row++) {
      if (this.grid[row][column] !== null) {
        return this.grid.length - row;
      }
    }
    return 0;
  }

  placeShape(shape: Shape) {
    shape.blocks.forEach(block => this.grid[block.y][block.x] = block);
  }

  isRowFull(row: number): boolean {
    return this.grid[row].every(column => column !== null);
  }

  isRowEmpty(row: number): boolean {
    return this.grid[row].every(column => column === null);
  }

  removeShape(shape: Shape) {
    shape.blocks.forEach(block => this.grid[block.y][block.x] = null);
  }

}
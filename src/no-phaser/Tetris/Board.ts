import Block from "./Block";
import Shape from "./Shape";
import { BoardDimension, Directions } from '../../static_numbers';

export default class Board {
  grid: Block[][];

  constructor(init = false) {
    this.init();
  }

  init() {
    // Creates [][] array of nulls
    this.grid = Array.from({length: BoardDimension.BOARD_ROWS},
        () => Array(BoardDimension.BOARD_COLUMNS).fill(null))
  }
    
  clone() {
    const newBoard = new Board();
    
    for (let row = 0; row < BoardDimension.BOARD_ROWS; row++) {
      for (let column = 0; column < BoardDimension.BOARD_COLUMNS; column++) {
        newBoard.grid[row][column] =
          this.column(row, column) !== null ? this.column(row, column).clone() : null;
      }
    }
  
    return newBoard;
  }

  get length(): number {
    return this.grid.length;
  }

  row(row: number): Block[] {
    return this.grid[row];
  }

  column(row: number, column: number): Block {
    return this.grid[row][column];
  }

  placeShape(shape: Shape) {
    shape.blocks.forEach(block => this.grid[block.row][block.column] = block);
  }

  removeShape(shape: Shape) {
    shape.blocks.forEach(block => this.grid[block.row][block.column] = null);
  }

  isOnBoard(position: { row: number, column: number }) {
    return position.row >= 0 &&
          position.column >= 0 && 
          position.column < BoardDimension.BOARD_COLUMNS &&
          position.row < BoardDimension.BOARD_ROWS  
  }
  
  isOccupied(position: {row: number, column: number }): boolean {
    return this.grid[position.row][position.column] !== null;
  }

  moveLogic(block: Block, direction: Directions): { row: number, column: number } {
    switch(direction) {
      case Directions.CURRENT:
        return { row: block.row, column: block.column };
      case Directions.DOWN:
        return { row: block.row + 1, column: block.column };
      case Directions.LEFT:
        return { row: block.row, column: block.column - 1 };
      case Directions.RIGHT:
        return { row: block.row, column: block.column + 1 };
    }  
  }

  canMoveShape(blocks: Block[], direction: Directions): boolean {
    return blocks.every(block => {
      const position = this.moveLogic(block, direction);
      return this.isOnBoard(position) && !this.isOccupied(position)
    });
  }

  getCompleteRows(): number[] {
    const result: number[] = [];
    
    this.grid.forEach((_, index) => {
      if (this.isRowFull(index)) {
        result.push(index);
      }
    })

    return result;
  }

  isRowFull(row: number): boolean {
    return this.grid[row].every(column => column !== null);
  }

  isRowEmpty(row: number): boolean {
    return this.grid[row].every(column => column === null);
  }

  columnHeight(column: number): number {
    var r = 0;
    for(; r < this.grid.length && this.grid[r][column] === null; r++);
    return this.length - r;
  }

  clearRows(completedRows: number[]) {
    let alreadyShifted = 0;

    for (let i = completedRows.length - 1; i >= 0; i--) {
      let actualRowToClear = completedRows[i] + alreadyShifted;
      let row = this.grid[actualRowToClear];

      for (let j = 0; j < row.length; j++) {
        this.grid[actualRowToClear][j] = null;
      }
      this.dropRowsAbove(actualRowToClear - 1);
      alreadyShifted++;
    }
  }

  dropRowsAbove(rowToDrop: number) {
    for (let row = rowToDrop; row >= 0; row--) {
      for (let column = 0; column < this.grid[row].length; column++) {
        let block = this.grid[row][column];
        if (block !== null) {
          this.grid[row][column].moveBlock(block.row, block.column + 1);
          this.grid[row + 1][column] = this.grid[row][column];
          this.grid[row][column] = null;
        }
      }
    }
  }

  isGameOver() {
    return !this.isRowEmpty(0) || !this.isRowEmpty(1);
  }

  printMe(name: string) {
    var body = document.getElementsByTagName('body')[0];
    let tbl = document.getElementById('myTable' + name);
    if (tbl === null) {
      tbl = document.createElement('table');
      tbl.id = 'myTable'  + name;
    } else {
      tbl.innerHTML = null;
    }
  
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');

    for (var row = 0; row < BoardDimension.BOARD_ROWS; row++) {
      var tr = document.createElement('tr');
      for (var column = 0; column < BoardDimension.BOARD_COLUMNS; column++) {
        var td = document.createElement('td');
        if (this.grid[row][column] !== null) {
          td.style.backgroundColor = this.grid[row][column].color;
        }
        td.height = '20';
        td.width = '20';
        tr.appendChild(td)
      }
      tbdy.appendChild(tr);
    }
    tbl.appendChild(tbdy);
    body.appendChild(tbl)

  }

  isSame(otherBoard: Board) {
    for(let row = 0; row < this.grid.length; row++) {
      for(let column = 0; column < this.grid[0].length; column++) {
        if (this.grid[row][column] === null && otherBoard.grid[row][column] !== null) {
          return false;
        } else if (this.grid[row][column] !== null && otherBoard.grid[row][column] === null) {
          return false;
        }
      }
    }
    return true;
  }

}
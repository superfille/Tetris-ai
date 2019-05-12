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
    this.grid = Array.from({length: BoardDimension.BOARD_HEIGHT},
        () => Array(BoardDimension.BOARD_WIDTH).fill(null))
  }
    
  clone() {
    const newBoard = new Board();
    
    for (let y = 0; y < BoardDimension.BOARD_HEIGHT; y++) {
      for (let x = 0; x < BoardDimension.BOARD_WIDTH; x++) {
        newBoard.grid[y][x] =
          this.column(x, y) !== null ? this.column(x, y).clone() : null;
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

  placeShape(shape: Shape) {
    shape.blocks.forEach(block => this.grid[block.y][block.x] = block);
  }

  removeShape(shape: Shape) {
    shape.blocks.forEach(block => this.grid[block.y][block.x] = null);
  }

  isOnBoard(position: { x: number, y: number }) {
    return position.x >= 0 &&
          position.y >= 0 && 
          position.x < BoardDimension.BOARD_WIDTH &&
          position.y < BoardDimension.BOARD_HEIGHT  
  }
  
  isOccupied(position: {x: number, y: number }): boolean {
    return this.grid[position.y][position.x] !== null;
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
    for(let row = 0; row < this.grid.length; row++) {
      if (this.grid[row][column] !== null) {
        return this.grid.length - row;
      }
    }
    return 0;
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

  dropRowsAbove(row: number) {
    for (let i = row; i >= 0; i--) {
      for (let j = 0; j < this.grid[i].length; j++) {
        let block = this.grid[i][j];
        if (block !== null) {
          this.grid[i][j].moveBlock(block.x, block.y + 1);
          this.grid[i + 1][j] = this.grid[i][j];
          this.grid[i][j] = null;
        }
      }
    }
  }

  printMe() {
    var body = document.getElementsByTagName('body')[0];
    let tbl = document.getElementById('myTable');
    if (tbl === null) {
      tbl = document.createElement('table');
      tbl.id = 'myTable';
    } else {
      tbl.innerHTML = null;
    }
  
    tbl.style.width = '100%';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');

    for (var x = 0; x < BoardDimension.BOARD_HEIGHT; x++) {
      var tr = document.createElement('tr');
      for (var y = 0; y < BoardDimension.BOARD_WIDTH; y++) {
        var td = document.createElement('td');
        if (this.grid[x][y] !== null) {
          td.style.backgroundColor = this.grid[x][y].color;
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

}
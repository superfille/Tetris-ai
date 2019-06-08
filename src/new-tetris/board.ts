import { BoardDimension, Directions } from "../constants";
import { Position } from "./shape/position";
import { Shape } from "./shape/shape";

export class Board {
  grid: string[][];

  constructor() {
    this.grid = Array.from({ length: BoardDimension.ROWS },
      () => Array(BoardDimension.COLUMNS).fill(null));
  }

  addShape(shape: Shape) {
    shape.positions.forEach((pos: Position) => {
      if (pos.row >= 0 && pos.column >= 0) {
        this.grid[pos.row][pos.column] = shape.color;
      }
    });
  }

  removeShape(shape: Shape) {
    shape.positions.forEach((pos: Position) => {
      if (pos.row >= 0 && pos.column >= 0) {
        this.grid[pos.row][pos.column] = null;
      }
    });
  }

  isOnBoard(position: Position) {
    return   position.row >= -3
          && position.column >= 0 
          && position.row < BoardDimension.ROWS  
          && position.column < BoardDimension.COLUMNS
  }
  
  isWithinBoard(position: Position) {
    return   position.row >= 0
          && position.column >= 0 
          && position.row < BoardDimension.ROWS  
          && position.column < BoardDimension.COLUMNS
  }

  isOccupied(position: Position): boolean {
    if (position.row < 0) {
      return false;
    }

    return this.grid[position.row][position.column] !== null;
  }

  canMove(shape: Shape, direction: Directions): boolean {
    const newPositions: Position[] = shape.cloneMove(direction);

    return newPositions.every(pos => {
      return this.isOnBoard(pos) && !this.isOccupied(pos);
    });
  }

  isGameOver(shape: Shape): boolean {
    const clonedShape = shape.clone();
    this.moveShapeAlltheWayTo(clonedShape, Directions.DOWN)
    
    return clonedShape.positions.every(p => !this.isWithinBoard(p));
  }

  canRotate(shape: Shape): boolean {
    const newPositions: Position[] = shape.cloneRotate(shape.nextRotation);

    return newPositions.every(pos => {
      return this.isOnBoard(pos) && !this.isOccupied(pos);
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

  clearRows(rows: number[]) {
    let alreadyShifted = 0;

    for (let i = rows.length - 1; i >= 0; i--) {
      let actualRowToClear = rows[i] + alreadyShifted;
      this.naiveRowClear(actualRowToClear);
      alreadyShifted++;
    }
  }

  naiveRowClear = (rowToDrop: number) => {
    for (let row = rowToDrop; row >= 0; row--) {
      for (let column = 0; column < this.grid[row].length; column++) {
        if (row === 0) {
          this.grid[row][column] = null
        } else {
          this.grid[row][column] = this.grid[row - 1][column];
          this.grid[row - 1][column] = null;
        }
      }
    }
  }

  cascadeRowClear() {
    // Todo: https://tetris.fandom.com/wiki/Line_clear
  }

  moveShapeAlltheWayTo(shape: Shape, direction: Directions) {
    while (this.canMove(shape, direction)) {
      shape.move(direction);
    }
  }

  columnHeight(column: number): number {
    var r = 0;
    for(; r < BoardDimension.ROWS && this.grid[r][column] === null; r++);
    return BoardDimension.ROWS - r;
  }

  height() {
    var total = 0;
    for(var c = 0; c < BoardDimension.COLUMNS; c++){
        total += this.columnHeight(c);
    }
    return total;
  }

  completedLines() {
    var count = 0;
    for (var r = 0; r < BoardDimension.ROWS; r++) {
      if (this.isRowFull(r)){
        count++;
      }
    }
    
    return count;
  }

  holes() {
    let count = 0
    for(var c = 0; c < BoardDimension.COLUMNS; c++) {
      var block = false;
      for(var r = 0; r < BoardDimension.ROWS; r++) {
        if (this.grid[r][c] !== null) {
            block = true;
        } else if (this.grid[r][c] === null && block){
          count++;
        }
      }
    }
    return count;
  }

  bumpiness() {
    let total = 0;
    for(var c = 0; c < BoardDimension.COLUMNS - 1; c++) {
      total += Math.abs(this.columnHeight(c) - this.columnHeight(c + 1));
    }

    return total;
  }
    
  clone() {
    const newBoard = new Board();
    
    for (let row = 0; row < BoardDimension.ROWS; row++) {
      for (let column = 0; column < BoardDimension.COLUMNS; column++) {
        newBoard.grid[row][column] = this.grid[row][column];
      }
    }
  
    return newBoard;
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
  
    tbl.style.width = '500px';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');

    for (var row = 0; row < BoardDimension.ROWS; row++) {
      var tr = document.createElement('tr');
      for (var column = 0; column < BoardDimension.COLUMNS; column++) {
        var td = document.createElement('td');
        if (this.grid[row][column] !== null) {
          td.style.backgroundColor = this.grid[row][column];
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
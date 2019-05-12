import Block from "./Block";
import Board from "./Board";
import { ShapeStuff, Directions, Tetrimino } from '../../static_numbers';

export default class Shape {
  centerX: number;
  centerY: number;
  tetrisShape: any;
  type: number;
  orientation: number;
  blocks: Block[];
  board: Board;

  constructor(board: Board) {
    this.centerX = null;
    this.centerY = null;
    this.tetrisShape = null;
    this.blocks = [];
    this.type = Math.floor(Math.random() * ShapeStuff.NUM_SHAPE_TYPES);
    this.orientation = Math.floor(Math.random() * ShapeStuff.NUM_ORIENTATIONS);
    this.board = board;
  }
  
  init(shapes: any) {
    this.tetrisShape = shapes[this.type];
    this.centerX = this.tetrisShape.orientation[this.orientation].startingLocation.x;
    this.centerY = this.tetrisShape.orientation[this.orientation].startingLocation.y;

    for (let i = 0; i < 4; i++) {
      let newX = this.centerX + this.tetrisShape.orientation[this.orientation].blockPosition[i].x;
      let newY = this.centerY + this.tetrisShape.orientation[this.orientation].blockPosition[i].y;
      this.blocks.push(new Block(newY, newX, this.tetrisShape.name));
    }
  }
  
  autoDrop() {
    while (this.board.canMoveShape(this.blocks, Directions.DOWN)) {
      this.moveShape(Directions.DOWN);
    }
  }
  
  allTheWayToLeft() {
    while (this.moveShape(Directions.LEFT));    
  }

  moveShape(direction: Directions): boolean {
    if (!this.board.canMoveShape(this.blocks, direction)){
      return false;
    }

    if (direction === Directions.CURRENT) {
      return true;
    }

    let newX, newY;
    
    // Move the Shape's blocks
    for(let i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Directions.DOWN:
          newX = this.blocks[i].row + 1;
          newY = this.blocks[i].column;
          break;
        case Directions.LEFT:
          newX = this.blocks[i].row;
          newY = this.blocks[i].column - 1;
          break;
        case Directions.RIGHT:
          newX = this.blocks[i].row;
          newY = this.blocks[i].column + 1;
          break;
      }  
      this.blocks[i].moveBlock(newX, newY);
    }
    
    // Update the this.Shape's center
    switch(direction) {
      case Directions.DOWN:
        this.centerX += 0;
        this.centerY += 1;
        break;
      case Directions.LEFT:
        this.centerX += -1;
        this.centerY += 0;
        break;
      case Directions.RIGHT:
        this.centerX += 1;
        this.centerY += 0;
        break;
    }

    return true;
  }

  canRotate() {
    const newOrientation = (this.orientation + 1) % ShapeStuff.NUM_ORIENTATIONS;
    
    return this.blocks.every((_, i) => {
      const newX = this.centerX +
        this.tetrisShape.orientation[newOrientation].blockPosition[i].x;
      const newY = this.centerY +
        this.tetrisShape.orientation[newOrientation].blockPosition[i].y;      
      
      return !this.board.isOnBoard({ row: newX, column: newY }) ||
        this.board.isOccupied({ row: newX, column: newY });
    });
  }
    
  rotate() {
    if(!this.canRotate()) {
      return false;
    }
    
    const newOrientation = (this.orientation + 1) % ShapeStuff.NUM_ORIENTATIONS;
    this.blocks.forEach((block, i) => {
      const newX = this.centerX + this.tetrisShape.orientation[newOrientation].blockPosition[i].x;
      const newY = this.centerY + this.tetrisShape.orientation[newOrientation].blockPosition[i].y;      
      block.moveBlock(newY, newX);
    });
    this.orientation = newOrientation;
    
    return true;
  }

  clone() {
    const newShape = Object.assign(new Shape(this.board), {
      type: this.type,
      orientation: this.orientation,
      centerX: this.centerX,
      centerY: this.centerY,
      tetrisShape: this.tetrisShape
    });
    newShape.blocks = this.blocks.map(block => new Block(block.row, block.column, block.type));

    return newShape;
  }

  addMove(blocks: Block[]) {
    this.blocks.forEach((block, i) => {
      block.row = blocks[i].row;
      block.column = blocks[i].column;
    });
  }

  printMe(index: number) {
    var body = document.getElementsByTagName('body')[0];

    let shapesElement = document.getElementById('shapes');
    if (shapesElement === null) {
      shapesElement = document.createElement('div');
      shapesElement.id = 'shapes';
      shapesElement.style.display = 'flex';
      shapesElement.style.marginBottom = '15px';
      body.appendChild(shapesElement);
    }

    let tbl = document.getElementById(`nextShape${index}`);
    if (tbl === null) {
      tbl = document.createElement('table');
      tbl.id = `nextShape${index}`;
      tbl.style.marginRight = '6px';
      shapesElement.appendChild(tbl);
    } else {
      tbl.innerHTML = null;
    }
  
    tbl.style.width = '80px';
    tbl.setAttribute('border', '1');
    var tbdy = document.createElement('tbody');
    
    this.printMeTetrimino(tbdy);
    tbl.appendChild(tbdy);
    shapesElement.appendChild(tbl);
  }

  printMeTetrimino(tableBody: HTMLElement) {
    switch(this.blocks[0].type) {
      case Tetrimino.I:
        return this.printI(tableBody);
      case Tetrimino.J:
      case Tetrimino.L:
        return this.printJL(tableBody);
      case Tetrimino.O:
        return this.printO(tableBody);
      case Tetrimino.S:
      case Tetrimino.Z:
        return this.printSZ(tableBody);
      case Tetrimino.T:
        return this.printT(tableBody);
    }
  }

  /* [][][]
       []
  */
  printT(tableBody: HTMLElement) {
    for (var x = 0; x < 2; x++) {
      var tr = document.createElement('tr');
      for (var y = 0; y < 3; y++) {
        var td = document.createElement('td');
        if (x === 1 && (y === 0 || y === 2)) {
        } else {
          td.style.backgroundColor = this.blocks[0].color;
        }
        td.height = '20';
        td.width = '20';
        tr.appendChild(td)
      }
      tableBody.appendChild(tr);
    }
  }

  /* [][]
       [][]
  */
  printSZ(tableBody: HTMLElement) {
    for (var x = 0; x < 2; x++) {
      var tr = document.createElement('tr');
      for (var y = 0; y < 3; y++) {
        var td = document.createElement('td');
        if ((x === 0 && y === 2) || (x === 1 && y === 0)) {
        } else {
          td.style.backgroundColor = this.blocks[0].color;
        }
        td.height = '20';
        td.width = '20';
        tr.appendChild(td)
      }
      tableBody.appendChild(tr);
    }
  }

  /* [][]
     [][]
  */
  printO(tableBody: HTMLElement) {
    for (var x = 0; x < 2; x++) {
      var tr = document.createElement('tr');
      for (var y = 0; y < 2; y++) {
        var td = document.createElement('td');
        td.style.backgroundColor = this.blocks[0].color;
        td.height = '20';
        td.width = '20';
        tr.appendChild(td)
      }
      tableBody.appendChild(tr);
    }
  }

  /* [][][]
         []
  */
  printJL(tableBody: HTMLElement) {
    for (var x = 0; x < 2; x++) {
      var tr = document.createElement('tr');
      for (var y = 0; y < 3; y++) {
        var td = document.createElement('td');
        if (x === 1 && (y === 0 || y === 1)) {
        }
        else {
          td.style.backgroundColor = this.blocks[0].color;
        }
        td.height = '20';
        td.width = '20';
        tr.appendChild(td)
      }
      tableBody.appendChild(tr);
    }
  }

  /* []
     []
     []
     []
  */
  printI(tableBody: HTMLElement) {
    var tr = document.createElement('tr');
    for (var x = 0; x < 4; x++) {
      var td = document.createElement('td');
      td.style.backgroundColor = this.blocks[0].color;
      td.height = '20';
      td.width = '20';
      tr.appendChild(td)
    }
    tableBody.appendChild(tr);
  }
}

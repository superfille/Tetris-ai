import Block from "./Block";
import Board from "./Board";
import { ShapeStuff, Directions } from '../../static_numbers';

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

    for(let i = 0; i < 4; i++) {
      let newX = this.centerX + this.tetrisShape.orientation[this.orientation].blockPosition[i].x;
      let newY = this.centerY + this.tetrisShape.orientation[this.orientation].blockPosition[i].y;
      this.blocks.push(new Block(newX, newY));
    }
  }
  
  autoDrop() {
    while(this.board.canMoveShape(this.blocks, Directions.DOWN)) {
      this.moveShape(Directions.DOWN);
    }
  }
  
  moveShape(direction: Directions): boolean {
    if(!this.board.canMoveShape(this.blocks, direction)){
      console.log('Cant move', this.blocks, this.board);
      return false;
    }

    if(direction === Directions.CURRENT) {
      return true;
    }

    let newX, newY;
    
    // Move the Shape's blocks
    for(let i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Directions.DOWN:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y + 1;
          break;
        case Directions.LEFT:
          newX = this.blocks[i].x - 1;
          newY = this.blocks[i].y;
          break;
        case Directions.RIGHT:
          newX = this.blocks[i].x + 1;
          newY = this.blocks[i].y;
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
      
      return this.board.isOnBoard({ x: newX, y: newY }) ||
        !this.board.isOccupied({ x: newX, y: newY });
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
      block.moveBlock(newX, newY);
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
    
    newShape.blocks.forEach((block, i) => {
      block.x = this.blocks[i].x;
      block.y = this.blocks[i].y;
    });

    return newShape;
  }

  addMove(blocks: Block[]) {
    this.blocks.forEach((block, i) => {
      block.x = blocks[i].x;
      block.y = blocks[i].y;
    });
  }
}
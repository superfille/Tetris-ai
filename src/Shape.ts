import { ShapeStuff, Directions, Colors, BoardDimension } from './static_numbers';
import Block from './Block';
import Board from './Board';

export default class Shape {
  type: number = null;
  orientation: number = null;
  color: number = null;
  
  centerX: number = null;
  centerY: number = null;
  
  shape: any = null;
  blocks: Block[];
  
  isTweening = false;
  tweenCounter = 0;
  
  tempCounter = 0;
  isFaking = false;
  hasBeenPlaced = false;

  game: Phaser.Game = null;
  board: Board;
  shapeTypes: any;
  
  constructor(game: Phaser.Game, board: Board, shapeTypes: any) {
    this.game = game;
    this.board = board;
    this.shapeTypes = shapeTypes;
  }

  randomizeShape() {
    this.type = Math.floor(Math.random() * ShapeStuff.NUM_SHAPE_TYPES);
    this.orientation = Math.floor(Math.random() * ShapeStuff.NUM_ORIENTATIONS);
    this.color = Math.floor(Math.random() * Colors.NUM_COLORS);
    
    this.initBlocks();
  }
  
  initBlocks() {
    this.blocks = [];
    for(let i = 0; i < ShapeStuff.NUM_BLOCKS_IN_SHAPE; i++) {
      this.blocks[i] = new Block(this.game);
    }
  }

  activate() {
    this.shape = this.shapeTypes[this.type];
    this.centerX = this.shape.orientation[this.orientation].startingLocation.x;
    this.centerY = this.shape.orientation[this.orientation].startingLocation.y;
    
    var i, newX, newY;

    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.shape.orientation[this.orientation].blockPosition[i].x;
      newY = this.centerY + this.shape.orientation[this.orientation].blockPosition[i].y;
      this.blocks[i].makeBlock(newX, newY, this.color);
    }
  }
  
  clearActive() {
    this.type = null;
    this.orientation = null;
    this.color = null;

    this.centerX = null;
    this.centerY = null;

    this.blocks = null;
  }
  
  placeShapeInBoard(board: Board) {
    if (board) {
      this.blocks.forEach(block => board.grid[block.y][block.x] = block);
    } else {
      this.blocks.forEach(block => this.board.grid[block.y][block.x] = block);
    }
  }

  removeShapeInBoard(board: Board) {
    this.blocks.forEach(block => board.grid[block.y][block.x] = null);
  }

  autoDrop() {
    while(this.canMoveShape(Directions.DOWN)) {
      this.moveShape(Directions.DOWN);
    }
    this.hasBeenPlaced = true;
  }
  
  isOnBoard(x: number, y: number): boolean {
    return x >= 0 && y >= 0 && 
       x < BoardDimension.BOARD_WIDTH && y < BoardDimension.BOARD_HEIGHT
  }
  
  isOccupied(x: number, y: number): boolean {
    return this.board.grid[y][x] !== null;
  }
  
  canMoveShape(direction: Directions): boolean {
    let i, newX, newY;

    for(i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Directions.CURRENT:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y;
          break;
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
      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  }

  moveShape(direction: Directions, throwError = true, tween = true) {
    if(!this.canMoveShape(direction)){
        return false;
    }

    if(direction === Directions.CURRENT) {
      return true;
    }

    var i, newX, newY;
    
    // Move the Shape's blocks
    for(i = 0; i < this.blocks.length; i++) {
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
     this.blocks[i].moveBlock(newX, newY, tween);
    }
    
    // Update the Shape's center
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
    
    if (this.isTweening) {
      return false;
    }
    
    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % ShapeStuff.NUM_ORIENTATIONS;
    
    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.shape.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.shape.orientation[newOrientation].blockPosition[i].y;      
      
      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  }
    
  rotate(throwError = true, tween = true) {
    if(!this.canRotate()) {
      return false;
    }
    
    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % ShapeStuff.NUM_ORIENTATIONS;
    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.shape.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.shape.orientation[newOrientation].blockPosition[i].y;      
      this.blocks[i].moveBlock(newX, newY, tween);
    }
    this.orientation = newOrientation;
    
    if (tween) {
      this.isTweening = true;
    }
    return true;
  }
  
  updateTween() {
    
    if (this.tweenCounter > 10) {
      this.isTweening = false;
      this.tweenCounter = 0;
    } 
    this.tweenCounter++;
  }

  preview() {

  }

  clearPreview() {
  }

  clone() {
    const newShape = new Shape(this.game, this.board, this.shapeTypes);
    newShape.type = this.type;
    newShape.orientation = this.orientation;
    newShape.color = this.color;
    newShape.centerX = this.centerX;
    newShape.centerY = this.centerY;
    newShape.shape = this.shapeTypes[this.type];
    newShape.initBlocks();
    
    for(let i = 0; i < this.blocks.length; i++) {
      newShape.blocks[i].x = this.blocks[i].x;
      newShape.blocks[i].y = this.blocks[i].y;
    }

    return newShape;
  }

  addMove(blocks: Block[]) {
    for(let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].x = blocks[i].x;
      this.blocks[i].y = blocks[i].y;
    }
  }
};

class Shape {
  NUM_BLOCKS_IN_SHAPE = 4;
  NUM_SHAPE_TYPES = 7;
  NUM_ORIENTATIONS = 4;

  // Shape type
  I = 0;
  J = 1;
  L = 2;
  O = 3;
  S = 4;
  Z = 5;
  T = 6;

  constructor() {
    this.centerX = null;
    this.centerY = null;
    
    this.tetrisShape = null;
    this.blocks = [];

    this.type = Math.floor(Math.random() * this.NUM_SHAPE_TYPES);
    this.orientation = Math.floor(Math.random() * this.NUM_ORIENTATIONS);
    this.init();
  }
  
  init() {
    this.tetrisShape = Tetris.shapes[this.type];
    this.centerX = this.tetrisShape.orientation[this.orientation].startingLocation.x;
    this.centerY = this.tetrisShape.orientation[this.orientation].startingLocation.y;
    
    let i, newX, newY;

    for(i = 0; i < 4; i++) {
      newX = this.centerX + this.tetrisShape.orientation[this.orientation].blockPosition[i].x;
      newY = this.centerY + this.tetrisShape.orientation[this.orientation].blockPosition[i].y;
      this.blocks.push(new Block(newX, newY));
    }
  }
  
  autoDrop() {
    while(this.canMoveShape(Tetris.DOWN)) {
      this.moveShape(Tetris.DOWN);
    }
    this.hasBeenPlaced = true;
  }
  

  canRotate() {
    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % this.NUM_ORIENTATIONS;
    
    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.tetrisShape.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.tetrisShape.orientation[newOrientation].blockPosition[i].y;      
      
      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  }
    
  rotate(throwError = true, tween = true) {
    if(!this.canRotate()) {
      if(throwError) {
        throw "Cannot rotate active shape";
      }
      return false;
    }
    
    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % this.NUM_ORIENTATIONS;
    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.tetrisShape.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.tetrisShape.orientation[newOrientation].blockPosition[i].y;      
      this.blocks[i].moveBlock(newX, newY, tween);
    }
    this.orientation = newOrientation;
    
    if (tween) {
      this.isTweening = true;
    }
    return true;
  }

  clone() {
    const newShape = new Tetris.Shape();
    newShape.type = this.type;
    newShape.orientation = this.orientation;
    newShape.color = this.color;
    newShape.centerX = this.centerX;
    newShape.centerY = this.centerY;
    newShape.shape = Tetris.shapes[this.type];
    newShape.initBlocks();
    
    for(let i = 0; i < this.blocks.length; i++) {
      newShape.blocks[i].x = this.blocks[i].x;
      newShape.blocks[i].y = this.blocks[i].y;
    }

    return newShape;
  }

  addMove(blocks) {
    for(let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].x = blocks[i].x;
      this.blocks[i].y = blocks[i].y;
    }
  }
}
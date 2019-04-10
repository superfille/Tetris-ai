Tetris.Shape = function () {
  this.type = null;
  this.orientation = null;
  this.color = null;
  
  this.centerX = null;
  this.centerY = null;
  
  this.shape = null;
  this.blocks = [];
  
  this.isTweening = false;
  this.tweenCounter = 0;
  
  this.tempCounter = 0;
  this.isFaking = false;
  this.hasBeenPlaced = false;
};

Tetris.Shape.prototype = {

  NUM_BLOCKS_IN_SHAPE: 4,
  NUM_SHAPE_TYPES: 7,
  NUM_ORIENTATIONS: 4,

  // Shape type
  I: 0,
  J: 1,
  L: 2,
  O: 3,
  S: 4,
  Z: 5,
  T: 6,
  
  randomizeShape: function () {
    
    this.type = Math.floor(Math.random() * this.NUM_SHAPE_TYPES);
    this.orientation = Math.floor(Math.random() * this.NUM_ORIENTATIONS);
    this.color = Math.floor(Math.random() * Tetris.NUM_COLORS);
    
    this.initBlocks();
  },
  
  initBlocks: function () {
    
    var i;
    for(i = 0; i < this.NUM_BLOCKS_IN_SHAPE; i++) {
      this.blocks[i] = new Tetris.Block();
    }
  },

  activate: function () {
    this.shape = Tetris.shapes[this.type];
    this.centerX = this.shape.orientation[this.orientation].startingLocation.x;
    this.centerY = this.shape.orientation[this.orientation].startingLocation.y;
    
    var i, newX, newY;

    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.shape.orientation[this.orientation].blockPosition[i].x;
      newY = this.centerY + this.shape.orientation[this.orientation].blockPosition[i].y;
      this.blocks[i].makeBlock(newX, newY, this.color);
    }
  },
  
  clearActive: function () {
    
    this.type = null;
    this.orientation = null;
    this.color = null;

    this.centerX = null;
    this.centerY = null;

    this.blocks = null;
  },
  
  placeShapeInBoard: function (board) {
    if (board) {
      this.blocks.forEach(block => board[block.y][block.x] = block);
    } else {
      this.blocks.forEach(block => Tetris.board[block.y][block.x] = block);
    }
  },

  removeShapeInBoard: function(board) {
    this.blocks.forEach(block => board[block.y][block.x] = null);
  },

  autoDrop: function() {
    while(this.canMoveShape(Tetris.DOWN)) {
      this.moveShape(Tetris.DOWN);
    }
    this.hasBeenPlaced = true;
  },
  
  isOnBoard: function (x, y) {
    return x >= 0 && y >= 0 && 
       x < Tetris.BOARD_WIDTH && y < Tetris.BOARD_HEIGHT
  },
  
  isOccupied: function (x, y) {
    return Tetris.board[y][x] !== null;
  },
  
  canMoveShape: function (direction) {
    let i, newX, newY;

    for(i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Tetris.CURRENT:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y;
          break;
        case Tetris.DOWN:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y + 1;
          break;
        case Tetris.LEFT:
          newX = this.blocks[i].x - 1;
          newY = this.blocks[i].y;
          break;
        case Tetris.RIGHT:
          newX = this.blocks[i].x + 1;
          newY = this.blocks[i].y;
          break;
      }
      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  },

  moveShape: function (direction, throwError = true, tween = true) {
    if(!this.canMoveShape(direction)){
      if (throwError) {
        console.log('cant move')
        throw "Cannot move active shape in direction: " + direction;
      } else {
        return;
      }
    }

    if(direction === Tetris.CURRENT) {
      return true;
    }

    var i, newX, newY;
    
    // Move the Shape's blocks
    for(i = 0; i < this.blocks.length; i++) {
      switch(direction) {
        case Tetris.DOWN:
          newX = this.blocks[i].x;
          newY = this.blocks[i].y + 1;
          break;
        case Tetris.LEFT:
          newX = this.blocks[i].x - 1;
          newY = this.blocks[i].y;
          break;
        case Tetris.RIGHT:
          newX = this.blocks[i].x + 1;
          newY = this.blocks[i].y;
          break;
      }  
     this.blocks[i].moveBlock(newX, newY, tween);
    }
    
    // Update the Shape's center
    switch(direction) {
      case Tetris.DOWN:
        this.centerX += 0;
        this.centerY += 1;
        break;
      case Tetris.LEFT:
        this.centerX += -1;
        this.centerY += 0;
        break;
      case Tetris.RIGHT:
        this.centerX += 1;
        this.centerY += 0;
        break;
    }

    return true;
  },
  
  canRotate: function () {
    
    if (this.isTweening) {
      return false;
    }
    
    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % this.NUM_ORIENTATIONS;
    
    for(i = 0; i < this.blocks.length; i++) {
      newX = this.centerX + this.shape.orientation[newOrientation].blockPosition[i].x;
      newY = this.centerY + this.shape.orientation[newOrientation].blockPosition[i].y;      
      
      if (!this.isOnBoard(newX, newY) || this.isOccupied(newX, newY)) {
        return false;
      }
    }
    return true;
  },
    
  rotate: function (throwError = true, tween = true) {
    if(!this.canRotate()) {
      if(throwError) {
        throw "Cannot rotate active shape";
      }
      return false;
    }
    
    var i, newX, newY, newOrientation;
    newOrientation = (this.orientation + 1) % this.NUM_ORIENTATIONS;
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
  },
  
  updateTween: function () {
    
    if (this.tweenCounter > 10) {
      this.isTweening = false;
      this.tweenCounter = 0;
    } 
    this.tweenCounter++;
  },

  preview: function() {

  },

  clearPreview: function() {
  },

  clone: function() {
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
  },

  addMove: function(blocks) {
    for(let i = 0; i < this.blocks.length; i++) {
      this.blocks[i].x = blocks[i].x;
      this.blocks[i].y = blocks[i].y;
    }
  }
};
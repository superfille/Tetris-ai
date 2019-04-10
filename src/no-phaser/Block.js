class Block {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  clean() { 
    this.x = null;
    this.y = null;
  }
  
  moveBlock(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

}

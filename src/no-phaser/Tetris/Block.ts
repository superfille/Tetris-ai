export class Block {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  moveBlock(newX, newY) {
    this.x = newX;
    this.y = newY;
  }

}

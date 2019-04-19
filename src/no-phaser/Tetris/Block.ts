export class Block {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  
  moveBlock(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

}

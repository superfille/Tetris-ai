import { Tetrimino, getColor } from "../../static_numbers";

export default class Block {
  x: number;
  y: number;
  color: string;
  type: Tetrimino;

  constructor(x: number, y: number, type: Tetrimino) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.color = getColor(type);
  }
  
  moveBlock(newX: number, newY: number) {
    this.x = newX;
    this.y = newY;
  }

  clone() {
    return new Block(this.x, this.y, this.type);
  }
}

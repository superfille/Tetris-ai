import { Tetrimino, getColor } from "../Static_numbers";

export default class Block {
  row: number;
  column: number;
  color: string;
  type: Tetrimino;

  constructor(row: number, column: number, type: Tetrimino) {
    this.row = row;
    this.column = column;
    this.type = type;
    this.color = getColor(type);
  }
  
  moveBlock(newRow: number, newColumn: number) {
    this.row = newRow;
    this.column = newColumn;
  }

  clone() {
    return new Block(this.row, this.column, this.type);
  }
}

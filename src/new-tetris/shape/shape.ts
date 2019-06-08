import { Position } from './position';
import { Directions, Tetriminos } from '../../constants';
import { cloneDeep } from 'lodash';
import * as Shapes from './shapes';

export class Shape {
  tetrimino: any;
  positions: Position[];
  rotation: number;
  type: Tetriminos;

  constructor(type: Tetriminos) {
    this.type = type;
    this.rotation = 0;
    this.tetrimino = Shape.getShape(type);
    this.positions = this.tetrimino.getPosition(this.rotation);
  }

  get color(): string {
    return this.tetrimino.color;
  }

  static getShape(tetrimino: Tetriminos) {
    switch(tetrimino) {
      case Tetriminos.I:
          return cloneDeep(Shapes.I);
      case Tetriminos.J:
          return cloneDeep(Shapes.J);
      case Tetriminos.L:
        return cloneDeep(Shapes.L);
      case Tetriminos.O:
        return cloneDeep(Shapes.O);
      case Tetriminos.S:
        return cloneDeep(Shapes.S);
      case Tetriminos.T:
        return cloneDeep(Shapes.T);
      case Tetriminos.Z:
        return cloneDeep(Shapes.Z);
    }
  }

  get nextRotation(): number {
    return this.tetrimino.nextRotation(this.rotation);
  }

  get maxRotations(): number {
    return this.tetrimino.maxRotations();
  }

  move(direction: Directions) {
    this.positions = this.cloneMove(direction)
  }

  cloneMove(direction: Directions): Position[] {
    let column = direction === Directions.LEFT ? -1 : 0;
    column = direction === Directions.RIGHT ? 1 : column;
    
    const row = direction === Directions.DOWN ? 1 : 0;

    return this.positions.reduce((prev, curr) =>
      prev.concat({ row: curr.row + row, column: curr.column + column })
      , []);
  }

  rotate() {
    const nextRotation = this.tetrimino.nextRotation(this.rotation);
    this.positions = this.cloneRotate(nextRotation);
    this.rotation = nextRotation;
  }

  cloneRotate(nextRotation: number) {
    const currentTetrimino: Position[] =  this.tetrimino.rotation(this.rotation);
    const newTetrimino: Position[] = this.tetrimino.rotation(nextRotation);

    return this.updateAllPositions(currentTetrimino, newTetrimino, this.positions);
  }

  clone() {
    const result = new Shape(this.type);
    result.positions = cloneDeep(this.positions);

    return result;
  }

  updatePosition(currentPosition: Position, newPosition: Position, actual: Position): Position {
    return {
      row: (newPosition.row - currentPosition.row) + actual.row,
      column: (newPosition.column - currentPosition.column) + actual.column
    }
  }
  
  updateAllPositions(currentTetrimino: Position[], newTetrimino: Position[], actuals: Position[]): Position[] {
    return actuals.reduce((p, c, index) => {
      return p.concat(this.updatePosition(currentTetrimino[index], newTetrimino[index], c));
    }, []);
  }
}

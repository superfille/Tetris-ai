import { Board } from "./Board";
import { Shape } from "./Shape";

export enum Direction {
  DOWN,
  LEFT,
  RIGHT,
  CURRENT,
}

export class TetrisGame {
  shapes: [];
  board: Board;
  shapesQueue: Shape[];
  score: number;
  activeShape: Shape;
  isGameOver: boolean;

  constructor(game) {
      this.board = new Board(true);
      this.shapesQueue = [];
      this.score = 0;
      this.activeShape;
      this.isGameOver = false
      this.shapes = game.cache.getJSON('shapes').shapes;
      
      this.initShapesQueue();
  }

  initShapesQueue() {
    for (let i = 0; i < 3; i++) {
      const shape = new Shape(this.board);
      shape.init(this.shapes);
      this.shapesQueue.push(shape);
    }
    this.activeShape = this.shapesQueue[0];
  }

  getNextMove(any: any): Shape {
    return {} as Shape;
  } // Override this

  clear() {
    this.board = new Board(true);
    this.shapesQueue = [];
    this.score = 0;
    this.activeShape;
    this.isGameOver = false
  }

  play() {
    while (!this.isGameOver) {
      this.update();
    }
    console.log(this.board);
    return this.score;
  }

  update() {
    const move = this.getNextMove({
      board: this.board,
      activeShape: this.activeShape,
      shapesQueue: this.shapesQueue
    });

    if (!!move) {
      return;
    }

    this.activeShape.addMove(move.blocks);

    this.board.placeShapeInBoard(this.activeShape);
    const completedRows = this.board.getCompleteRows();

    if (completedRows.length > 0) {
      this.board.clearRows(completedRows);
      this.calculateScore(completedRows.length);
    }
    this.updateShapesQueue();
  }

  updateShapesQueue() {
    const newShape = new Shape(this.board);
    newShape.init(this.shapes);
    this.shapesQueue.shift();
    this.shapesQueue.push(newShape);
    this.activeShape = this.shapesQueue[0];
    if (!this.board.canMoveShape(this.activeShape.blocks, Direction.CURRENT)) {
      this.isGameOver = true;
    }
  }

  calculateScore(rowsCleared, level = 0) {
    if (rowsCleared === 1) {
      this.score += 40 * (level + 1);
    } else if (rowsCleared === 2) {
      this.score += 100 * (level + 1);
    } else if (rowsCleared === 3) {
      this.score += 300 * (level + 1);
    } else if (rowsCleared > 3) {
      this.score += 1200 * (level + 1);
    }
  }
}
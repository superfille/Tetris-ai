import { Board } from "./board";
import { Directions } from "../constants";
import { RandomPieceGenerator } from "./shape/randomPiece";
import { Shape } from "./shape/shape";

export class Game {
  board: Board;
  activeShape: Shape;
  nextMove: Directions = Directions.DOWN;
  randomGenerator: RandomPieceGenerator;
  gameOver: boolean = false;
  ai: any;
  points: number = 0;

  constructor(ai: boolean) {
    this.randomGenerator = new RandomPieceGenerator;
    this.board = new Board();
    this.nextTetrimino();
    this.initKeys();

    if (!ai) {
      this.loop();
    }
  }

  initKeys() {
    window.addEventListener('keyup', (event) => {
      switch(event.which) {
        case 65:
          this.handleMovingTetrimino(Directions.LEFT);
          break;
        case 68:
          this.handleMovingTetrimino(Directions.RIGHT);
          break;
        case 83:
          this.handleMovingTetrimino(Directions.DOWN);
          break;
        case 87:
          this.handleMovingTetrimino(Directions.ROTATE);
          break;
      }
    })
  }

  nextTetrimino() {
    this.activeShape = new Shape(this.randomGenerator.nextPiece());
    this.gameOver = this.board.isGameOver(this.activeShape);
  }

  handleMovingTetrimino(direction: Directions): boolean {    
    this.board.removeShape(this.activeShape);
    
    if (direction === Directions.ROTATE) {
      if (this.board.canRotate(this.activeShape)) {
        this.activeShape.rotate();
        this.board.addShape(this.activeShape);
        this.board.printMe('lol');
        return true;
      }
    }
    else if (this.board.canMove(this.activeShape, direction)) {
      this.activeShape.move(direction);
      this.board.addShape(this.activeShape);
      this.board.printMe('lol');
      return true;
    }

    this.board.addShape(this.activeShape);

    return false;
  }

  loop() {
    const interval = setInterval(() => {
      if (!this.handleMovingTetrimino(Directions.DOWN)) {
        this.nextTetrimino();
        if (this.gameOver) {
          clearInterval(interval);
          alert('done');
        }
      }
      const rows = this.board.getCompleteRows();
      if (rows.length > 0) {
        this.board.clearRows(rows);
      }
    }, 500);
  }

  aiMove(shape: Shape) {
    this.board.moveShapeAlltheWayTo(shape, Directions.DOWN)
    this.board.addShape(shape);

    const rows = this.board.getCompleteRows();
    if (rows.length > 0) {
      this.points += rows.length;
      this.board.clearRows(rows);
      console.log(this.points);
    }
    this.board.printMe('lol');
    this.nextTetrimino();
  }
}
import { Board } from "./board";
import { Directions } from "./constants";
import { RandomPieceGenerator } from "./shape/randomPiece";
import { Shape } from "./shape/shape";

export class Game {
  board: Board;
  activeShape: Shape;
  nextMove: Directions = Directions.DOWN;
  randomGenerator: RandomPieceGenerator;

  
  constructor(ai: boolean) {
    this.randomGenerator = new RandomPieceGenerator;
    this.nextTetrimino();
    this.board = new Board();
    this.initKeys();
    this.loop();
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
    setInterval(() => {
      if (!this.handleMovingTetrimino(Directions.DOWN)) {
        this.nextTetrimino();
      }
      const rows = this.board.getCompleteRows();
      if (rows.length > 0) {
        this.board.clearRows(rows);
      }
    }, 500);
  }

  aiLoop() {

  }
}
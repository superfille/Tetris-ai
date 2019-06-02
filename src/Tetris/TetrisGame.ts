import Board from "./Board";
import Shape from "./Shape";
import { Directions } from "../Constants";
import shapesJson from '../../assets/shapes.json';
import shapesJsonAi from '../../assets/ai-shapes.json';
import { RandomPieceGenerator } from "./RandomPice";
import { holeUp } from "../Utils";

export default class TetrisGame {
  shapes: [];
  board: Board;
  shapesQueue: Shape[];
  score: number;
  activeShape: Shape;
  isGameOver: boolean;
  randomGenerator: RandomPieceGenerator;
  stopped: boolean = false;

  constructor() {
    this.randomGenerator = new RandomPieceGenerator();
    this.board = new Board();
    this.shapesQueue = [];
    this.score = 0;
    this.activeShape;
    this.isGameOver = false
    this.shapes = shapesJson.shapes;
    // this.shapes = shapesJsonAi.shapes;
    this.initShapesQueue();

    window.addEventListener('keyup', (event) => {
      this.stopped = event.which === 83 ? !this.stopped : this.stopped;
    })
  }

  initShapesQueue() {
    for (let i = 0; i < 1; i++) {
      const shape = new Shape(this.board);
      //shape.init(this.shapes, this.randomGenerator.nextPiece());
      shape.init(this.shapes, 6);
      this.shapesQueue.push(shape);
    }
    this.activeShape = this.shapesQueue[0];
  }

  // Override this
  getNextMove(any: any): Shape {
    return {} as Shape;
  }

  getNextMoveAsync(any: any): Promise<Shape> {
    return {} as any;
  }

  clear() {
    this.board = new Board();
    this.shapesQueue = [];
    this.score = 0;
    this.activeShape;
    this.isGameOver = false
  }

  play(maxNumberOfMoves: number) {
    for(let i = 0; i < maxNumberOfMoves; i++) {
      if (this.isGameOver) {
        break;
      }
      this.update();
    }
    // while (!this.isGameOver) {
    //   this.update();
    // }
    return this.score;
  }

  async playAsync() {
    let prevScore = this.score;
    while (!this.isGameOver) {
      prevScore = this.score;
      await this.updateAsync();
      if (prevScore !== this.score) {
        console.log('New score ', this.score);
      }
    }
    
   // this.board.canMoveShape(this.activeShape.blocks, Directions.CURRENT);
    return this.score;
  }

  async updateAsync() {
    const move = await this.getNextMoveAsync({
      board: this.board,
      activeShape: this.activeShape,
      shapes: this.shapesQueue
    });
    move.board = this.board;
    
    this.activeShape.addMove(move.blocks);
    this.board.placeShape(this.activeShape);
    const completedRows = this.board.getCompleteRows();

    this.shapesQueue.forEach((shape, index) => shape.printMe(index))
    //this.board.printMe('real');

    if (completedRows.length > 0) {
      this.board.printMe('fake')
      await holeUp(2000);
      this.board.clearRows(completedRows);
      this.calculateScore(completedRows.length);
    }
    this.updateShapesQueue();
    // this.isGameOver = true;
  }

  update() {
    const move = this.getNextMove({
      board: this.board,
      activeShape: this.activeShape,
      shapes: this.shapesQueue
    });

    if (!move) {
      return;
    }

    this.activeShape.addMove(move.blocks);

    this.board.placeShape(this.activeShape);
    
    const completedRows = this.board.getCompleteRows();

    if (completedRows.length > 0) {
      this.board.clearRows(completedRows);
      this.calculateScore(completedRows.length);
    }
    this.updateShapesQueue();

  }

  updateShapesQueue() {
    const newShape = new Shape(this.board);
    // newShape.init(this.shapes, this.randomGenerator.nextPiece());
    newShape.init(this.shapes, 2);
    this.shapesQueue.shift();
    this.shapesQueue.push(newShape);
    this.activeShape = this.shapesQueue[0];

    this.isGameOver = !this.activeShape.canMoveShape(Directions.CURRENT);
  }

  calculateScore(rowsCleared: number, level = 0) {
    this.score += rowsCleared;
    // if (rowsCleared === 1) {
    //   this.score += 40 * (level + 1);
    // } else if (rowsCleared === 2) {
    //   this.score += 100 * (level + 1);
    // } else if (rowsCleared === 3) {
    //   this.score += 300 * (level + 1);
    // } else if (rowsCleared > 3) {
    //   this.score += 1200 * (level + 1);
    // }
  }
}
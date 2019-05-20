import { Directions } from "../../static_numbers";
import Heuristics from './Heuristics';
import Board from "../Tetris/Board";
import Shape from "../Tetris/Shape";
import TetrisGame from "../Tetris/TetrisGame";

interface Best {
  shape: Shape;
  score: number;
}

export default class Chromosome {
  heuristics: Heuristics;
  fitness: number;

  constructor(heuristics: Heuristics = undefined) {
    this.heuristics = heuristics;

    if (this.heuristics === undefined) {
      this.heuristics = new Heuristics();
      this.heuristics.randomize();
    }
  }

  mutate() {
    this.heuristics.mutate();
  }

  normalize() {
    this.heuristics.normalize();
  }

  heuristic(): Heuristics {
    return this.heuristics;
  }

  fitnessOr1(): number {
    return this.fitness > 0 ? this.fitness : 1;
  }

  fitnessHeight(): number {
    return this.fitnessOr1() * this.heuristics._height;
  }

  fitnessBumpiness(): number {
    return this.fitnessOr1() * this.heuristics._bumpiness;
  }

  fitnessCompletedLines(): number {
    return this.fitnessOr1() * this.heuristics._completedLines;
  }

  fitnessHoles(): number {
    return this.fitnessOr1() * this.heuristics._holes;
  }

  async playAsync() {
    const tetrisGame = new TetrisGame;

    tetrisGame.getNextMoveAsync = async (params: any) => {
      const bestMoveShape = await this.getBestMoveAsync(params.board, params.shapes, 0);
      bestMoveShape.shape.autoDrop();
      return bestMoveShape.shape;
    }

    const score = await tetrisGame.playAsync();
    return Promise.resolve(score);
  }

  play(maxNumberOfMoves: number) {
    const tetrisGame = new TetrisGame;
    tetrisGame.getNextMove = (params: any) => {
      const bestMoveShape = this.getBestMove(params.board, params.shapes, 0).shape;
      bestMoveShape.autoDrop();
      return bestMoveShape;
    }

    tetrisGame.play(maxNumberOfMoves);
    return tetrisGame.score;
  }

  getBestMove(board: Board, shapes: Shape[], index: number): Best {
    const clonedBoard = board.clone();

    return this.getBestMoveHelper(clonedBoard, shapes, index);
  }

  async getBestMoveAsync(board: Board, shapes: Shape[], index: number): Promise<Best> {
    const clonedBoard = board.clone();

    await this.holeUp(500);
    return Promise.resolve(this.getBestMoveHelperAsync(clonedBoard, shapes, index));
  }

  async holeUp(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getBestMoveHelperAsync(board: Board, shapes: Shape[], index: number): Promise<Best> {
    let best = null;
    let bestScore = null;
    let activeShape = shapes[index];

    for(let rotation = 0; rotation < activeShape.maxRotations(); rotation++) {
        const copiedActiveShape = activeShape.clone();
        for (let i = 0; i < rotation; i++) {
            copiedActiveShape.rotate()
        }
        copiedActiveShape.allTheWayToLeft();

        let direction = Directions.CURRENT;
        while (copiedActiveShape.moveShape(direction)) {
          const clonedShape = copiedActiveShape.clone();

          clonedShape.board = board;
          clonedShape.autoDrop();

          board.placeShape(clonedShape);
          board.printMe();

          let score = null;
          if (index === (shapes.length - 1)) {
            score = this.heuristics.score(board);
          } else {
            score = this.getBestMove(board, shapes, index + 1).score;
          }

          board.removeShape(clonedShape);
          if (score > bestScore || bestScore == null){
            bestScore = score;
            best = copiedActiveShape.clone();
          }

          direction = Directions.RIGHT;
        }
    }

    return Promise.resolve({ shape: best, score: bestScore });
  }

  getBestMoveHelper(board: Board, shapes: Shape[], index: number): Best {
    let best = null;
    let bestScore = null;
    let activeShape = shapes[index];

    for(let rotation = 0; rotation < activeShape.maxRotations(); rotation++) {
        const copiedActiveShape = activeShape.clone();
        for (let i = 0; i < rotation; i++) {
            copiedActiveShape.rotate()
        }
        copiedActiveShape.allTheWayToLeft();

        let direction = Directions.CURRENT;
        while (copiedActiveShape.moveShape(direction)) {
          const clonedShape = copiedActiveShape.clone();

          clonedShape.board = board;
          clonedShape.autoDrop();

          board.placeShape(clonedShape);

          let score = null;
          if (index === (shapes.length - 1)) {
            score = this.heuristics.score(board);
          } else {
            score = this.getBestMove(board, shapes, index + 1).score;
          }

          board.removeShape(clonedShape);
          if (score > bestScore || bestScore == null){
            bestScore = score;
            best = copiedActiveShape.clone();
          }

          direction = Directions.RIGHT;
        }
    }

    return { shape: best, score: bestScore };
  }

  toString() {
    return `Heuristics ${this.heuristics.toString()}`;
  }

}
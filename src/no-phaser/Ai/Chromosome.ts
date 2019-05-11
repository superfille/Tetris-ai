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
  _fitness: number;
  _finalFitness: number;

  constructor(heuristics: Heuristics = undefined) {
    this.heuristics = heuristics;

    if (this.heuristics === undefined) {
      this.heuristics = new Heuristics();
      this.heuristics.randomize();
    }
  }

  setFinalFitness(fitness: number) {
    this._finalFitness = fitness;
  }

  finalFitness() {
    return this._finalFitness;
  }

  fitness(): number {
    return this._fitness;
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

  fitnessHeight(): number {
    return this._fitness * this.heuristics._height;
  }

  fitnessBumpiness(): number {
    return this._fitness * this.heuristics._bumpiness;
  }

  fitnessCompletedLines(): number {
    return this._fitness * this.heuristics._completedLines;
  }

  fitnessHoles(): number {
    return this._fitness * this.heuristics._holes;
  }

  play() {
    const tetrisGame = new TetrisGame;
    tetrisGame.getNextMove = (params: any) => {
      const bestMoveShape = this.getBestMove(params.board, params.shapes, 0).shape;
      bestMoveShape.autoDrop();
      return bestMoveShape;
    }

    tetrisGame.play();
    this._fitness = tetrisGame.score;
  }

  getBestMove(board: Board, shapes: Shape[], index: number): Best {
    const clonedBoard = board.clone();

    return this.getBestMoveHelper(clonedBoard, shapes, index);
  }

  getBestMoveHelper(board: Board, shapes: Shape[], index: number): Best {
    let best = null;
    let bestScore = null;
    let activeShape = shapes[index];

    for(let rotation = 0; rotation < 3; rotation++){
        const copiedActiveShape = activeShape.clone();
        for(let i = 0; i < rotation; i++){
            copiedActiveShape.rotate()
        }

        while(copiedActiveShape.moveShape(Directions.LEFT));
        
        let direction = Directions.CURRENT;
        while(copiedActiveShape.moveShape(direction)){
            const clonedShape = copiedActiveShape.clone();
            clonedShape.autoDrop();

            board.placeShape(clonedShape);

            let score = null;
            if (index === (shapes.length - 1)) {
              score = this.heuristics.score(board)
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

}
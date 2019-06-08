import Heuristics from './heuristics';
import { Board } from "../new-tetris/Board";
import { Shape } from "../new-tetris/shape/Shape";
import { Game } from '../new-tetris/game';
import { wait } from "../utils";
import { Directions } from '../constants';

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
    return this.fitnessOr1() * this.heuristics.height;
  }

  fitnessBumpiness(): number {
    return this.fitnessOr1() * this.heuristics.bumpiness;
  }

  fitnessCompletedLines(): number {
    return this.fitnessOr1() * this.heuristics.completedLines;
  }

  fitnessHoles(): number {
    return this.fitnessOr1() * this.heuristics.holes;
  }

  async play(maxNumberOfMoves: number, waitTime: number) {
    const game = new Game(true);

    while(!game.gameOver) {
      game.aiMove(this.getBestMove(game.board, [game.activeShape], 0).shape);
      if(waitTime > 0) {
        await wait(waitTime);
      }
    }

    return Promise.resolve(game.points);
  }

  getBestMove(board: Board, shapes: Shape[], index: number): Best {
    const clonedBoard = board.clone();

    return this.getBestMoveHelper(clonedBoard, shapes, index);
  }

  getBestMoveHelper(board: Board, shapes: Shape[], index: number): Best {
    let best = null;
    let bestScore = null;
    let activeShape = shapes[index];

    for(let rotation = 0; rotation < activeShape.maxRotations; rotation++) {
        const copiedActiveShape = activeShape.clone();
        for (let i = 0; i < rotation; i++) {
            copiedActiveShape.rotate()
        }
        board.moveShapeAlltheWayTo(copiedActiveShape, Directions.LEFT);

        let direction = Directions.CURRENT;
        while (board.canMove(copiedActiveShape, direction)) {
          copiedActiveShape.move(direction);
          const clonedShape = copiedActiveShape.clone();

          board.moveShapeAlltheWayTo(clonedShape, Directions.DOWN);
          board.addShape(clonedShape);

          let score = null;
          if (index === (shapes.length - 1)) {
            score = this.heuristics.score(board);
          } else {
            score = this.getBestMove(board, shapes, index + 1).score;
          }

          board.removeShape(clonedShape);
          if (score > bestScore || bestScore == null) {
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
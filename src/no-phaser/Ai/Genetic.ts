import { Directions } from "src/static_numbers";
import Heuristics from './Heuristics';
import Board from "../Tetris/Board";
import Shape from "../Tetris/Shape";
import TetrisGame from "../Tetris/TetrisGame";

interface Best {
  piece: Shape;
  score: number;
}

export default class GeneticAlgorithm {
  heuristics: Heuristics;

  constructor() {
    this.heuristics = new Heuristics;
  }

  play() {
    const tetrisGame = new TetrisGame;
    // tetrisGame.getNextMove = this.getNextMove;
  }

  getNextMove() {

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

        while(copiedActiveShape.moveShape(Directions.LEFT)); // Kan ju förbättras så man inte behöver starta med att flytta till vänster
        
        let direction = Directions.CURRENT;
        while(copiedActiveShape.moveShape(direction)){
            const _pieceSet = copiedActiveShape.clone();
            _pieceSet.autoDrop();

            board.placeShape(_pieceSet);

            let score = null;
            if (index === (shapes.length - 1)) {
              score = this.heuristics.score(board)
            } else {
              score = this.getBestMove(board, shapes, index + 1).score;
            }
            board.removeShape(_pieceSet);

            if (score > bestScore || bestScore == null){
              bestScore = score;
              best = copiedActiveShape.clone();
            }

            direction = Directions.RIGHT;
        }
    }

    return { piece: best, score: bestScore };
  }

}
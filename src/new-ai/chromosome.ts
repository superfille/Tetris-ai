// import { Directions } from "../Constants";
// import Heuristics from './heuristics';
// import { Board } from "../new-tetris/Board";
// import { Shape } from "../new-tetris/shape/Shape";
// import TetrisGame from "../Tetris/TetrisGame";
// import { holeUp } from "../Utils";

// interface Best {
//   shape: Shape;
//   score: number;
// }

// export default class Chromosome {
//   heuristics: Heuristics;
//   fitness: number;

//   constructor(heuristics: Heuristics = undefined) {
//     this.heuristics = heuristics;

//     if (this.heuristics === undefined) {
//       this.heuristics = new Heuristics();
//       this.heuristics.randomize();
//     }
//   }

//   mutate() {
//     this.heuristics.mutate();
//   }

//   normalize() {
//     this.heuristics.normalize();
//   }

//   heuristic(): Heuristics {
//     return this.heuristics;
//   }

//   fitnessOr1(): number {
//     return this.fitness > 0 ? this.fitness : 1;
//   }

//   fitnessHeight(): number {
//     return this.fitnessOr1() * this.heuristics.height;
//   }

//   fitnessBumpiness(): number {
//     return this.fitnessOr1() * this.heuristics.bumpiness;
//   }

//   fitnessCompletedLines(): number {
//     return this.fitnessOr1() * this.heuristics.completedLines;
//   }

//   fitnessHoles(): number {
//     return this.fitnessOr1() * this.heuristics.holes;
//   }

//   play(maxNumberOfMoves: number) {
//     const tetrisGame = new TetrisGame;
//     tetrisGame.getNextMove = (params: any) => {
//       const bestMoveShape = this.getBestMove(params.board, params.shapes, 0).shape;
//       bestMoveShape.autoDrop();
//       return bestMoveShape;
//     }

//     tetrisGame.play(maxNumberOfMoves);
//     return tetrisGame.score;
//   }

//   getBestMove(board: Board, shapes: Shape[], index: number): Best {
//     const clonedBoard = board.clone();

//     return this.getBestMoveHelper(clonedBoard, shapes, index);
//   }

//   async playAsync() {
//     const tetrisGame = new TetrisGame;

//     tetrisGame.getNextMoveAsync = async (params: any) => {
//       const bestMoveShape = await this.getBestMoveAsync(params.board, params.shapes, 0);
//       bestMoveShape.shape.autoDrop();
//       return bestMoveShape.shape;
//     }

//     const score = await tetrisGame.playAsync();
//     return Promise.resolve(score);
//   }

//   async getBestMoveAsync(board: Board, shapes: Shape[], index: number): Promise<Best> {
    
//     return Promise.resolve(this.getBestMoveHelperAsync(board.clone(), shapes, index));
//   }

//   async getBestMoveHelperAsync(board: Board, shapes: Shape[], index: number): Promise<Best> {
//     let best = null;
//     let bestScore = null;
//     let activeShape = shapes[index];

//     for(let rotation = 0; rotation < activeShape.maxRotations(); rotation++) {
//       const copiedActiveShape = activeShape.clone(board);
//       for (let i = 0; i < rotation; i++) {
//           copiedActiveShape.rotate()
//       }
//       copiedActiveShape.allTheWayToLeft();

//       let direction = Directions.CURRENT;
//       if (!copiedActiveShape.moveShape(direction)) {
//         board.placeShape(copiedActiveShape);
//         board.printMe('fake');
//         board.removeShape(copiedActiveShape);
//       }
//       while (copiedActiveShape.moveShape(direction)) {
//         const clonedShape: Shape = copiedActiveShape.clone(board);

//         clonedShape.autoDrop();

//         board.placeShape(clonedShape);
//         board.printMe('fake');
//         await holeUp(200)

//         let score = null;
//         if (index === (shapes.length - 1)) {
//           score = this.heuristics.score(board);
//         } else {
//           score = this.getBestMoveHelper(board, shapes, index + 1).score;
//         }
        
//         board.removeShape(clonedShape);
//         if (score > bestScore || bestScore === null){
//           bestScore = score;
//           best = copiedActiveShape.clone();
//         }

//         direction = Directions.RIGHT;
//       }
//     }

//     return Promise.resolve({ shape: best, score: bestScore });
//   }

//   getBestMoveHelper(board: Board, shapes: Shape[], index: number): Best {
//     let best = null;
//     let bestScore = null;
//     let activeShape = shapes[index];

//     for(let rotation = 0; rotation < activeShape.maxRotations(); rotation++) {
//         const copiedActiveShape = activeShape.clone();
//         for (let i = 0; i < rotation; i++) {
//             copiedActiveShape.rotate()
//         }
//         board.moveShapeAlltheWayTo(copiedActiveShape, Directions.DOWN);

//         let direction = Directions.CURRENT;
//         while (board.canMove(copiedActiveShape, direction)) {
//           copiedActiveShape.move(direction);
//           const clonedShape = copiedActiveShape.clone();

//           board.moveShapeAlltheWayTo(clonedShape, Directions.DOWN);
//           board.addShape(clonedShape);

//           let score = null;
//           if (index === (shapes.length - 1)) {
//             score = this.heuristics.score(board);
//           } else {
//             score = this.getBestMove(board, shapes, index + 1).score;
//           }

//           board.removeShape(clonedShape);
//           if (score > bestScore || bestScore == null) {
//             bestScore = score;
//             best = copiedActiveShape.clone();
//           }

//           direction = Directions.RIGHT;
//         }
//     }

//     return { shape: best, score: bestScore };
//   }

//   toString() {
//     return `Heuristics ${this.heuristics.toString()}`;
//   }

// }
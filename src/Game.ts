import Board from "./Board";
import Shape from "./Shape";
import Shapes from "./Shapes";
import { Directions } from "./static_numbers";
import shapesJson from '../assets/shapes.json';
import Chromosome from "./no-phaser/Ai/Chromosome";
import Heuristic from "./no-phaser/Ai/Heuristics";

export default class Game extends Phaser.State {
  turnLength = 60;
  turnCounter = 0;

  isUpdatingAfterRowClear = false;

  activeShape: Shape = null;

  cursors: Phaser.CursorKeys = null;

  completedRows: number[] = [];
  score: number = 0;
  scores: number[] = [];
  scoreText: Phaser.Text = null;

  isGameOver: boolean = false;

  board: Board;
  shapesQueue: Shapes;

  shapesJSON: any;
  shapes: any;

  ai: Chromosome;

  constructor() {
    super();
  }

  create() {
    this.score = 0;
    this.scoreText = undefined;
    this.isGameOver = false;

    // Create background
    this.stage.backgroundColor = 0x171642;
    this.add.sprite(0, 0, 'background');
    this.add.sprite(0, 0, 'banner');

    // Retrieve blockPositions
   // this.shapesJSON = this.game.cache.getJSON('shapes');
    this.shapes = shapesJson.shapes;

    // Create an empty board filled with nulls
    this.board = new Board();
    this.shapesQueue = new Shapes(this.game, this.board, this.shapes);


    // Set turn length and counter
    this.isUpdatingAfterRowClear = false;
    this.turnLength = 20;
    this.turnCounter = 0;

    this.cursors = this.game.input.keyboard.createCursorKeys();
    // Create Shapes
    this.activeShape = this.shapesQueue.activeShape();

    this.setScoringText();


    this.ai = new Chromosome(new Heuristic({ completedLines: 0.760666, height: 0.510066, holes: 0.35663, bumpiness: 0.184483 }));
    
  }

  update() {
    if (this.isGameOver) {
      // finish ai
      this.scores.push(this.score);
      console.log(this.scores);
      this.create();
      return;
    }

    if (this.activeShape === null || this.activeShape === undefined) {
      return;
    }
    
    // @ts-ignore
    const shape = this.ai.getBestMove(this.board, this.shapesQueue.queue, 0).shape;
    this.activeShape.addMove(shape.blocks);

    this.activeShape.placeShapeInBoard(this.board);
    this.completedRows = this.getCompleteRows();

    if (this.completedRows.length > 0) {
      this.clearRow(this.completedRows);
      this.isUpdatingAfterRowClear = true;
      this.updateScore(this.completedRows.length);
    }

    this.completedRows = [];
    this.promoteShapes();

    // if (this.turnCounter >= this.turnLength) {
    //   if (this.activeShape !== null && this.activeShape.canMoveShape(Directions.DOWN)) {
    //     this.activeShape.moveShape(Directions.DOWN);
    //   } else {
    //     this.activeShape.placeShapeInBoard(this.board);
    //     this.completedRows = this.getCompleteRows();

    //     if (this.completedRows.length > 0) {
    //       this.clearRow(this.completedRows);
    //       this.isUpdatingAfterRowClear = true;
    //       this.updateScore(this.completedRows.length);
    //     } else {
    //       this.promoteShapes();
    //     }

    //     this.completedRows = [];
    //   }
    //   this.turnCounter = 0;

    // } else if (this.isUpdatingAfterRowClear) {
    //   if (this.turnCounter >= this.turnLength / 10) {
    //     this.isUpdatingAfterRowClear = false;
    //     this.promoteShapes();
    //   } else {
    //     this.turnCounter++;
    //   }
    // } else {
    //   this.handleInput();
      
    //   this.turnCounter += 1;
    // }
  }

  handleInput() {
    if (this.activeShape.isTweening) {
      this.activeShape.updateTween();
    } else if (this.cursors.up.isDown) {
      if (this.activeShape.canRotate()) {
        this.activeShape.rotate();
      }
    } else if (this.cursors.left.isDown) {
      if (this.activeShape.canMoveShape(Directions.LEFT)) {
        this.activeShape.moveShape(Directions.LEFT);
        this.activeShape.isTweening = true;
      }
    } else if (this.cursors.right.isDown) {
      if (this.activeShape.canMoveShape(Directions.RIGHT)) {
        this.activeShape.moveShape(Directions.RIGHT);
        this.activeShape.isTweening = true;
      }
    } else if (this.cursors.down.isDown) {
      this.turnCounter += this.turnLength / 5;
    } 
  }

  promoteShapes() {
    this.shapesQueue.nextShape();
    this.activeShape = this.shapesQueue.activeShape();

    if (!this.activeShape.canMoveShape(Directions.CURRENT)) {
      this.gameOver();
    }
  }

  getCompleteRows() {
    return this.board.grid.reduce((acc, _, index) => {
      return this.isRowFull(index) ? acc.concat(index) : acc;
    }, Array());
  }

  isRowFull(row: number) {
    return this.board.grid[row].every(column => column !== null);
  }

  clearRow(completedRows: number[]) {
    var i, j, row, alreadyShifted, actualRowToClear;
    alreadyShifted = 0;

    for (i = completedRows.length - 1; i >= 0; i--) {

      actualRowToClear = completedRows[i] + alreadyShifted;

      row = this.board.grid[actualRowToClear];

      for (j = 0; j < row.length; j++) {
        this.board.grid[actualRowToClear][j].clean();
        this.board.grid[actualRowToClear][j] = null;
      }
      this.dropRowsAbove(actualRowToClear - 1);
      alreadyShifted++;
    }
  }

  dropRowsAbove(row: number) {
    var i, j, block;

    for (i = row; i >= 0; i--) {
      for (j = 0; j < this.board.grid[i].length; j++) {

        block = this.board.grid[i][j];
        if (block !== null) {
          this.board.grid[i][j].moveBlock(block.x, block.y + 1);
          this.board.grid[i + 1][j] = this.board.grid[i][j];
          this.board.grid[i][j] = null;
        }

      }
    }
  }

  setScoringText() {
    if (this.scoreText === undefined) {
      var style = { font: "33px Arial", fill: "#00000", align: "center" };
      this.scoreText = this.add.text(this.world.centerX, 40, `Score: ${this.score}`, style);
      this.scoreText.anchor.set(0.5);
    } else {
      this.scoreText.setText(`Score: ${this.score}`);
    }
  }

  calculateScore(rowsCleared: number, level = 0) {
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

  updateScore(rowsCleared: number) {
    this.calculateScore(rowsCleared);
    this.setScoringText();
  }

  gameOver() {
    this.isGameOver = true;
  }
};

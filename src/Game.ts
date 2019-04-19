import Board from "./Board";
import Shape from "./Shape";
import Shapes from "./Shapes";
import { Directions } from "./static_numbers";

export default class Game extends Phaser.State {
  stateKey = "Game"
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

  Ai = new Tetris.Genetic(this);

  board: Board;
  shapesQueue: Shapes;

  shapesJSON: any;
  shapes: any;

  constructor() {
    super();
  }

  create() {
    console.log('New game')
    this.score = 0;
    this.scoreText = undefined;
    this.isGameOver = false;

    // Create background
    this.stage.backgroundColor = 0x171642;
    this.add.sprite(0, 0, 'background');
    this.add.sprite(0, 0, 'banner');

    // Retrieve blockPositions
    this.shapesJSON = this.game.cache.getJSON('shapes');
    this.shapes = this.shapesJSON.shapes;

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

    // const apa = this.Ai.getMove(this.board, this.shapesQueue.getShapes());
    // apa.piece.autoDrop();
    // this.activeShape.addMove(apa.piece.blocks);

    // this.activeShape.placeShapeInBoard(this.board);
    // this.completedRows = this.getCompleteRows();

    // if (this.completedRows.length > 0) {
    //   this.clearRow(this.completedRows);
    //   this.isUpdatingAfterRowClear = true;
    //   this.updateScore(this.completedRows.length);
    // }

    // this.completedRows = [];
    // this.promoteShapes();

    if (this.turnCounter >= this.turnLength) {
      if (this.activeShape !== null && this.activeShape.canMoveShape(Directions.DOWN)) {
        this.activeShape.moveShape(Directions.DOWN);
      } else {
        this.activeShape.placeShapeInBoard(this.board);
        this.completedRows = this.getCompleteRows();

        if (this.completedRows.length > 0) {
          this.clearRow(this.completedRows);
          this.isUpdatingAfterRowClear = true;
          this.updateScore(this.completedRows.length);
        } else {
          this.promoteShapes();
        }

        this.completedRows = [];
      }
      this.turnCounter = 0;

    } else if (this.isUpdatingAfterRowClear) {
      if (this.turnCounter >= this.turnLength / 10) {
        this.isUpdatingAfterRowClear = false;
        this.promoteShapes();
      } else {
        this.turnCounter++;
      }
    } else {
      this.handleInput();
      
      this.turnCounter += 1;
    }
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
    if (this.activeShape === undefined) {
      debugger
    }
    if (!this.activeShape.canMoveShape(Directions.CURRENT)) {
      this.gameOver();
    }
  }

  getCompleteRows() {
    return this.board.board.reduce((acc, _, index) => {
      return this.isRowFull(index) ? acc.concat(index) : acc;
    }, Array());
  }

  isRowFull(row: number) {
    return this.board.board[row].every(column => column !== null);
  }

  clearRow(completedRows: number[]) {
    var i, j, row, alreadyShifted, actualRowToClear;
    alreadyShifted = 0;

    for (i = completedRows.length - 1; i >= 0; i--) {

      actualRowToClear = completedRows[i] + alreadyShifted;

      row = this.board.board[actualRowToClear];

      for (j = 0; j < row.length; j++) {
        this.board.board[actualRowToClear][j].clean();
        this.board.board[actualRowToClear][j] = null;
      }
      this.dropRowsAbove(actualRowToClear - 1);
      alreadyShifted++;
    }
  }

  dropRowsAbove(row: number) {
    var i, j, block;

    for (i = row; i >= 0; i--) {
      for (j = 0; j < this.board.board[i].length; j++) {

        block = this.board.board[i][j];
        if (block !== null) {
          this.board.board[i][j].moveBlock(block.x, block.y + 1);
          this.board.board[i + 1][j] = this.board.board[i][j];
          this.board.board[i][j] = null;
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

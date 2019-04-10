Tetris.Game = function (game) {

  this.turnLength = 60;
  this.turnCounter = 0;

  this.isUpdatingAfterRowClear = false;

  this.activeShape = null;

  this.cursors = null;

  this.completedRows = [];
  this.scores = [];

  this.Ai = new Tetris.Genetic(this);
};

Tetris.Game.stateKey = "Game";

Tetris.Game.prototype = {

  create: function () {
    console.log('New game')
    this.score = 0;
    this.scoreText = undefined;
    this.isGameOver = false;

    // Create background
    this.stage.backgroundColor = 0x171642;
    this.add.sprite(0, 0, 'background');
    this.add.sprite(0, 0, 'banner');

    // Create an empty board filled with nulls
    Tetris.board = new Tetris.Board();
    Tetris.shapesQueue = new Tetris.Shapes();

    // Retrieve blockPositions
    Tetris.shapesJSON = this.game.cache.getJSON('shapes');
    Tetris.shapes = Tetris.shapesJSON.shapes;

    // Set turn length and counter
    this.isUpdatingAfterRowClear = false;
    this.turnLength = 20;
    this.turnCounter = 0;

    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.scoreKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    // Create Shapes
    Tetris.initShapes();
    this.activeShape = Tetris.activeShape();

    this.setScoringText();
  },

  update: function () {
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

    const apa = this.Ai.getMove(Tetris.board, Tetris.getShapes());
    apa.piece.autoDrop();
    this.activeShape.addMove(apa.piece.blocks);

    this.activeShape.placeShapeInBoard();
    this.completedRows = this.getCompleteRows();

    if (this.completedRows.length > 0) {
      this.clearRow(this.completedRows);
      this.isUpdatingAfterRowClear = true;
      this.updateScore(this.completedRows.length);
    }

    this.completedRows = [];
    this.promoteShapes();

    // if (this.turnCounter >= this.turnLength) {
    //   if (this.activeShape !== null && this.activeShape.canMoveShape(Tetris.DOWN)) {
    //     this.activeShape.moveShape(Tetris.DOWN);
    //   } else {
    //     this.activeShape.placeShapeInBoard();
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
    //   // this.turnCounter++;
    // }
  },

  handleInput: function () {

    if (this.activeShape.isTweening) {

      this.activeShape.updateTween();

    } else if (this.cursors.up.isDown) {

      if (this.activeShape.canRotate()) {
        this.activeShape.rotate();
      }

    } else if (this.cursors.left.isDown) {

      if (this.activeShape.canMoveShape(Tetris.LEFT)) {
        this.activeShape.moveShape(Tetris.LEFT);
        this.activeShape.isTweening = true;
      }

    } else if (this.cursors.right.isDown) {

      if (this.activeShape.canMoveShape(Tetris.RIGHT)) {
        this.activeShape.moveShape(Tetris.RIGHT);
        this.activeShape.isTweening = true;
      }
    } else if (this.cursors.down.isDown) {
      this.turnCounter += this.turnLength / 5;
    } 
  },

  promoteShapes: function () {
    Tetris.nextShape();
    this.activeShape = Tetris.activeShape();
    if (this.activeShape === undefined) {
      debugger
    }
    if (!this.activeShape.canMoveShape(Tetris.CURRENT)) {
      this.gameOver();
    }
  },

  getCompleteRows: function () {
    return Tetris.board.reduce((acc, _, index) => {
      return this.isRowFull(index) ? acc.concat(index) : acc;
    }, [])
  },

  isRowFull: function (row) {
    return Tetris.board[row].every(column => column !== null);
  },

  clearRow: function (completedRows) {
    var i, j, h, row, block, alreadyShifted, actualRowToClear;
    alreadyShifted = 0;

    for (i = completedRows.length - 1; i >= 0; i--) {

      actualRowToClear = completedRows[i] + alreadyShifted;

      row = Tetris.board[actualRowToClear];

      for (j = 0; j < row.length; j++) {
        Tetris.board[actualRowToClear][j].clean();
        Tetris.board[actualRowToClear][j] = null;
      }
      this.dropRowsAbove(actualRowToClear - 1);
      alreadyShifted++;
    }
  },

  dropRowsAbove: function (row) {

    var i, j, block;

    for (i = row; i >= 0; i--) {
      for (j = 0; j < Tetris.board[i].length; j++) {

        block = Tetris.board[i][j];
        if (block !== null) {
          Tetris.board[i][j].moveBlock(block.x, block.y + 1);
          Tetris.board[i + 1][j] = Tetris.board[i][j];
          Tetris.board[i][j] = null;
        }

      }
    }
  },

  setScoringText: function () {
    if (this.scoreText === undefined) {
      var style = { font: "33px Arial", fill: "#00000", align: "center" };
      this.scoreText = this.add.text(this.world.centerX, 40, `Score: ${this.score}`, style);
      this.scoreText.anchor.set(0.5);
    } else {
      this.scoreText.setText(`Score: ${this.score}`);
    }
  },

  calculateScore: function(rowsCleared, level = 0) {
    if (rowsCleared === 1) {
      this.score += 40 * (level + 1);
    } else if (rowsCleared === 2) {
      this.score += 100 * (level + 1);
    } else if (rowsCleared === 3) {
      this.score += 300 * (level + 1);
    } else if (rowsCleared > 3) {
      this.score += 1200 * (level + 1);
    }
  },

  updateScore: function(rowsCleared) {
    this.calculateScore(rowsCleared);
    this.setScoringText();
  },

  gameOver: function() {
    this.isGameOver = true;

  }
};

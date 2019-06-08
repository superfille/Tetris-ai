import { Position } from './position';
import { Directions, Tetriminos } from '../constants';
import { cloneDeep } from 'lodash';

const updatePosition = (currentPosition: Position, newPosition: Position, actual: Position): Position => {
  return {
    row: (newPosition.row - currentPosition.row) + actual.row,
    column: (newPosition.column - currentPosition.column) + actual.column
  }
}

const updateAllPositions =  (currentTetrimino: Position[], newTetrimino: Position[], actuals: Position[]): Position[] => {
  return actuals.reduce((p, c, index) => {
    return p.concat(updatePosition(currentTetrimino[index], newTetrimino[index], c));
  }, []);
}

const O = {
  r0: [
      { row: -2, column: 4 }, // [][]
      { row: -2, column: 5 }, // [][]
      { row: -1, column: 4 },
      { row: -1, column: 5 }
  ],

  color: '#FFEB3B',

  getPosition(rotation: number) {
    return copy(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    return this.r0;
  },

  nextRotation: function(currentRotation: number) {
    return 0;
  },

  maxRotations: function() {
    return 1;
  }
}

const I = {
  r0: [
    { row: -1, column: 3 }, /// [][][][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
    { row: -1, column: 6 }
  ],

  r1: [
    { row: -3, column: 5 }, // []
    { row: -2, column: 5 }, // []
    { row: -1, column: 5 }, // []
    { row: 0, column: 5 }   // []
  ],

  color: '#00BCD4',

  getPosition(rotation: number) {
    return copy(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    if (rotation === 1) {
      return this.r1;
    }
    return this.r0;
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 2;
  },

  maxRotations: function() {
    return 2;
  }
}

const L = {
  r0: [
    { row: -2, column: 5 }, //     []
    { row: -1, column: 3 }, // [][][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
  ],

  r1: [
    { row: 0, column: 5 },  // []
    { row: -2, column: 4 }, // []
    { row: -1, column: 4 }, // [][]
    { row: 0, column: 4 },
  ],

  r2: [
    { row: 0, column: 3 },  // [][][]
    { row: -1, column: 5 }, // []
    { row: -1, column: 4 },
    { row: -1, column: 3 },
  ],

  r3: [
    { row: -2, column: 4 }, // [][]
    { row: 0, column: 4 },  //   []
    { row: -1, column: 4 }, //   []
    { row: -2, column: 3 },
  ],

  color: '#FF9800',

  getPosition(rotation: number) {
    return copy(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      case 2: return this.r2;
      case 3: return this.r3;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 4;
  },

  maxRotations: function() {
    return 4;
  }
}

const J = {
  r0: [
    { row: -2, column: 3 }, // []
    { row: -1, column: 3 }, // [][][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
  ],

  r1: [
    { row: -2, column: 5 }, // [][]
    { row: -2, column: 4 }, // []
    { row: -1, column: 4 }, // []
    { row: 0, column: 4 },
  ],

  r2: [
    { row: 0, column: 5 },  // [][][]
    { row: -1, column: 5 }, //     []
    { row: -1, column: 4 },
    { row: -1, column: 3 },
  ],

  r3: [
    { row: 0 , column: 3 }, //   []
    { row: 0, column: 4 },  //   []
    { row: -1, column: 4 }, // [][]
    { row: -2, column: 4 },
  ],

  color: '#FF9800',

  getPosition(rotation: number) {
    return copy(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      case 2: return this.r2;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 4;
  },

  maxRotations: function() {
    return 4;
  }
}

const S = {
  r0: [
    { row: -2, column: 4 }, //   [][]
    { row: -2, column: 5 }, // [][]
    { row: -1, column: 3 },
    { row: -1, column: 4 },
  ],

  r1: [
    { row: -2, column: 4 }, // []
    { row: -3, column: 4 }, // [][]
    { row: -2, column: 5 }, //   []
    { row: -1, column: 5 },
  ],

  color: '#4CAF50',

  getPosition(rotation: number) {
    return copy(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 2;
  },

  maxRotations: function() {
    return 2;
  }
}

const Z = {
  r0: [
    { row: -2, column: 3 }, // [][]
    { row: -2, column: 4 }, //   [][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
  ],

  r1: [
    { row: -1, column: 4 }, //     []
    { row: -2, column: 4 }, //   [][]
    { row: -2, column: 5 }, //   []
    { row: -3, column: 5 },
  ],

  color: '#4CAF50',

  getPosition(rotation: number) {
    return copy(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 2;
  },

  maxRotations: function() {
    return 2;
  }
}

const T = {
  r0: [
    { row: -2, column: 4 }, //   []
    { row: -1, column: 3 }, // [][][]
    { row: -1, column: 4 },
    { row: -1, column: 5 },
  ],

  r1: [
    { row: -1, column: 5 }, // []
    { row: -2, column: 4 }, // [][]
    { row: -1, column: 4 }, // []
    { row: 0, column: 4 },
  ],

  r2: [
    { row: 0, column: 4 }, // [][][]
    { row: -1, column: 5 }, //   []
    { row: -1, column: 4 },
    { row: -1, column: 3 },
  ],

  r3: [
    { row: -1, column: 3 }, //   []
    { row: 0, column: 4 },  // [][]
    { row: -1, column: 4 }, //   []
    { row: -2, column: 4 },
  ],

  color: '#9C27B0',

  getPosition(rotation: number) {
    return copy(this.rotation(rotation));
  },

  rotation: function(rotation: number) {
    switch(rotation) {
      case 1: return this.r1;
      case 2: return this.r2;
      case 3: return this.r3;
      default: return this.r0;
    }
  },

  nextRotation: function(currentRotation: number) {
    return (currentRotation + 1) % 4;
  },

  maxRotations: function() {
    return 4;
  }
}

const copy = (tetrimino: Position[]) => {
  return tetrimino.reduce((prev, curr) => {
    return prev.concat({ row: curr.row, column: curr.column })
  }, []);
};

const clone = (tetrimino: Tetriminos) => {
  return cloneDeep(T);
}

export class Shape {
  tetrimino: any;
  positions: Position[];
  rotation: number;
  type: Tetriminos;

  constructor(type: Tetriminos) {
    this.type = type;
    this.rotation = 0;
    this.tetrimino = Shape.getShape(type);
    this.positions = this.tetrimino.getPosition(this.rotation);
  }

  get color(): string {
    return this.tetrimino.color;
  }

  static getShape(tetrimino: Tetriminos) {
    switch(tetrimino) {
      case Tetriminos.I:
          return cloneDeep(I);
      case Tetriminos.J:
          return cloneDeep(J);
      case Tetriminos.L:
        return cloneDeep(L);
      case Tetriminos.O:
        return cloneDeep(O);
      case Tetriminos.S:
        return cloneDeep(S);
      case Tetriminos.T:
        return cloneDeep(T);
      case Tetriminos.Z:
        return cloneDeep(Z);
    }
  }

  get nextRotation(): number {
    return this.tetrimino.nextRotation(this.rotation);
  }

  move(direction: Directions) {
    this.positions = this.cloneMove(direction)
  }

  cloneMove(direction: Directions): Position[] {
    let column = direction === Directions.LEFT ? -1 : 0;
    column = direction === Directions.RIGHT ? 1 : column;
    
    const row = direction === Directions.DOWN ? 1 : 0;

    return this.positions.reduce((prev, curr) =>
      prev.concat({ row: curr.row + row, column: curr.column + column }), []);
  }

  rotate() {
    const nextRotation = this.tetrimino.nextRotation(this.rotation);
    this.positions = this.cloneRotate(nextRotation);
    this.rotation = nextRotation;
  }

  cloneRotate(nextRotation: number) {
    const currentTetrimino: Position[] =  this.tetrimino.rotation(this.rotation);
    const newTetrimino: Position[] = this.tetrimino.rotation(nextRotation);

    return updateAllPositions(currentTetrimino, newTetrimino, this.positions);
  }

  clone() {
    const result = new Shape(this.type);
    result.positions = copy(this.positions);

    return result;
  }
}

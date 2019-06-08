
// Board Size
const BoardDimension = {
  COLUMNS: 10,
  ROWS: 20
}

// Movement Directions
enum Directions {
  DOWN,
  LEFT,
  RIGHT,
  CURRENT,
  ROTATE
}
  
// Block colors
enum Colors {
  GREEN,
  RED,
  BLUE,
  YELLOW,
  NUM_COLORS
}

export enum Tetriminos {
  O, I, L, J, S, Z, T
}

const getColor = (shapeType: Tetriminos): string => {
  switch(shapeType) {
    case Tetriminos.I:
      return 'cyan';
    case Tetriminos.J:
    case Tetriminos.L:
      return 'orange';
    case Tetriminos.O:
      return 'yellow';
    case Tetriminos.S:
    case Tetriminos.Z:
      return 'green';
    case Tetriminos.T:
      return 'purple';
  }
  return 'tomato';
}


export {
  BoardDimension, Directions, Colors, getColor
}
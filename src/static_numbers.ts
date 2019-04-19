
const BANNER_HEIGHT = 145;
const LINING_WIDTH = 5;
const BLOCK_WIDTH = 50;

// Board Size
const BoardDimension = {
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 16
}

// Movement Directions
enum Directions{
  DOWN,
  LEFT,
  RIGHT,
  CURRENT
}
  
// Block colors
enum Colors {
  GREEN,
  RED,
  BLUE,
  YELLOW,
  NUM_COLORS
}

const ScreenDimension = {
  SCREEN_WIDTH: 510,
  SCREEN_HEIGHT: 950
}

const ShapeStuff = {
  NUM_SHAPE_TYPES: 7,
  NUM_BLOCKS_IN_SHAPE: 4,
  NUM_ORIENTATIONS: 4,
  Types: {
    I: 0,
    J: 1,
    L: 2,
    O: 3,
    S: 4,
    Z: 5,
    T: 6
  }
}


export {
  BANNER_HEIGHT, LINING_WIDTH, BLOCK_WIDTH,
  BoardDimension, Directions, Colors, ScreenDimension, ShapeStuff
}
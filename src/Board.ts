import { BoardDimension } from './static_numbers';
import Block from './Block';

export default class Board {
  board: Block[][];

  constructor () {
    this.board = Array(BoardDimension.BOARD_HEIGHT);
    for (let i = 0; i < BoardDimension.BOARD_HEIGHT; i++) {
      const row: Block[] = Array(BoardDimension.BOARD_WIDTH).fill(null);
      this.board[i] = row;
    }
  }
    
  clone() {
    const newBoard = Array(BoardDimension.BOARD_HEIGHT);
  
    for (let i = 0; i < BoardDimension.BOARD_HEIGHT; i++) {
      newBoard[i] = Array(BoardDimension.BOARD_WIDTH);
      for (let j = 0; j < BoardDimension.BOARD_WIDTH; j++) {
        newBoard[i][j] = this.board[i][j] !== null ? `${i} ${j}` : null;
      }
    }
  
    return newBoard;
  }
}
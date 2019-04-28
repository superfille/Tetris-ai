import Shape from "./Shape";
import Board from "./Board";
import { Game } from "phaser";

export default class Shapes {
  game: Game;
  board: Board;
  queue: Shape[] = [];
  shapeTypes: any;

  constructor(game: Game, board: Board, shapeTypes: any) {
    this.game = game;
    this.board = board;
    this.queue = [];
    this.shapeTypes = shapeTypes;
    const amount = 3;
    for(let i = 0; i < amount; i++) {
      this.nextShape(i === (amount - 1));
    }
  }
  
  getShapes() {
    return this.queue;
  }
  
  activeShape() {
    return this.queue[0];
  }
  
  nextShape(activate: boolean = true) {
    this.queue.shift();
    const addShape = new Shape(this.game, this.board, this.shapeTypes);
    addShape.randomizeShape();
    this.queue.push(addShape);
    if (activate) {
      this.queue[0].activate();
    }
  }
};
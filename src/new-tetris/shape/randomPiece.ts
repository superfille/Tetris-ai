import { Tetriminos } from "../constants";

export class RandomPieceGenerator {
  bag: number[];
  index: number;

  constructor() {
    this.bag = [Tetriminos.I, Tetriminos.J, Tetriminos.L, Tetriminos.O, Tetriminos.S, Tetriminos.T, Tetriminos.Z];
    this.shuffleBag();
    this.index = -1;
  }

  nextPiece = function(){
    this.index++;
    if (this.index >= this.bag.length) {
        this.shuffleBag();
        this.index = 0;
    }

    return this.bag[this.index];
  }

  shuffleBag = function() {
    var currentIndex = this.bag.length
    let temporaryValue;
    let randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = this.bag[currentIndex];
      this.bag[currentIndex] = this.bag[randomIndex];
      this.bag[randomIndex] = temporaryValue;
    }
  }

}

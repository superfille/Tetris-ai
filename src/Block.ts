import { Colors, LINING_WIDTH, BANNER_HEIGHT, BLOCK_WIDTH } from "./static_numbers";

export default class Block {
  color: Colors = null;
  x: number = null;
  y: number = null;
  
  sprite: Phaser.Sprite = null;
  tween: Phaser.Tween = null;
  game: Phaser.Game

  constructor(game: Phaser.Game) {
    this.game = game;
  }

  clone() {
    const block = new Block(this.game);
    block.x = this.x;
    block.y = this.y;
    return block;
  }

  makeBlock(newX: number, newY: number, newColor: Colors) {
    this.x = newX;
    this.y = newY;
    this.color = newColor;
    
    var spriteLocation = this.getSpriteLocation();
    
    this.sprite = this.game.add.sprite(spriteLocation.x, spriteLocation.y, 'block', this.color);
    //this.tween.frameBased = true;
  }
  
  clean() {
    this.x = null;
    this.y = null;
    this.color = null;
    this.sprite.destroy();
    this.sprite = null;
  }
  
  getSpriteLocation() {
    var spriteX, spriteY;
    
    spriteX = LINING_WIDTH + (this.x * BLOCK_WIDTH);
    spriteY = BANNER_HEIGHT + (this.y * BLOCK_WIDTH);
    
    return {"x": spriteX, "y": spriteY};
  }
  
  moveBlock(newX: number, newY: number, tween = true) {
    this.x = newX;
    this.y = newY;
    if (tween) {
      var spriteLocation = this.getSpriteLocation();
      
      var duration = 55;
      var repeat = 0;
      var ease = Phaser.Easing.Quadratic.In;
      var autoStart = false;
      var delay = 0;
      var yoyo = false;
  
      
      this.tween = this.game.add.tween(this.sprite).to(spriteLocation, duration, ease, autoStart, delay, repeat, yoyo);
      this.tween.start();
    }
  }
};

import * as Phaser from 'phaser';
import { BLOCK_WIDTH } from './static_numbers';

export default class Preloader extends Phaser.State {
  preloader: Phaser.Sprite;

  preload() {
    this.stage.backgroundColor = 0x111111;

    // Setup preloader 'loading' bar
    var preloaderWidth = (this.game.width * 0.67 / 2.0) | 0;
    var preloaderHeight = 32;
    var bmd = this.game.add.bitmapData(preloaderWidth, preloaderHeight);
    bmd.ctx.fillStyle = "#999999";
    bmd.ctx.fillRect(0, 0, preloaderWidth, preloaderHeight);

    this.preloader = this.game.add.sprite( 0, 0, bmd );
    this.preloader.anchor.setTo( 0.5, 0.5 );
    this.preloader.position.setTo(this.world.centerX,
                                  this.world.height - this.preloader.height * 2);
    this.load.setPreloadSprite(this.preloader);

    this.load.path = './assets/';

    // Load images
    this.load.image('background', 'background.png');
    this.load.image('banner', 'banner.png');
    this.load.spritesheet('block', 'blocks.png', BLOCK_WIDTH, BLOCK_WIDTH);
    
    // Load blockPositions.json and put into Tetris.blockPositions
    this.load.json('shapes', 'shapes.json');
  }
  
  create() {
    this.stage.backgroundColor = 0x222222;
  }
  
  start() {
    this.game.state.start('Game');
  }
};

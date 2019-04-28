import * as Phaser from 'phaser';
import { BLOCK_WIDTH } from './static_numbers';
import backgroundImage from '../assets/background.png';
import bannerImage from '../assets/banner.png';
import blocksImage from '../assets/blocks.png';

export default class Preloader extends Phaser.State {
  preloaderSprite: Phaser.Sprite;

  preload() {
    this.stage.backgroundColor = 0x111111;

    // Setup preloader 'loading' bar
    var preloaderWidth = (this.game.width * 0.67 / 2.0) | 0;
    var preloaderHeight = 32;
    var bmd = this.game.add.bitmapData(preloaderWidth, preloaderHeight);
    bmd.ctx.fillStyle = "#999999";
    bmd.ctx.fillRect(0, 0, preloaderWidth, preloaderHeight);

    this.preloaderSprite = this.game.add.sprite( 0, 0, bmd );
    this.preloaderSprite.anchor.setTo( 0.5, 0.5 );
    this.preloaderSprite.position.setTo(this.world.centerX,
                                  this.world.height - this.preloaderSprite.height * 2);
    this.load.setPreloadSprite(this.preloaderSprite);


    // Load images
    this.load.image('background', backgroundImage);
    this.load.image('banner', bannerImage);
    this.load.spritesheet('block', blocksImage, BLOCK_WIDTH, BLOCK_WIDTH);
    
    // Load blockPositions.json and put into Tetris.blockPositions
   // this.load.json('shapes', '../assets/shapes.json');
  }
  
  create() {
    this.stage.backgroundColor = 0x222222;
    this.game.state.start('Game');
  }
  
};

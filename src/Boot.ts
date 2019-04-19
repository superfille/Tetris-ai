import * as Phaser from 'phaser';
import { ScreenDimension } from './static_numbers'

export default class Boot extends Phaser.State {
  preload(){
    this.stage.backgroundColor = 0x000000;
    this.stage.disableVisibilityChange = false;
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    this.scale.minWidth = ( ScreenDimension.SCREEN_WIDTH / 2 ) | 0;
    this.scale.minHeight = ( ScreenDimension.SCREEN_HEIGHT / 2 ) | 0;
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
    // load assets needed for the preloader here 
  }

  create(){ 
    // Go straight to the Preloader
    this.game.state.start('Preloader');
  }

};


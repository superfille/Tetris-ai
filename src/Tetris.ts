import 'pixi';
import 'p2';
import * as Phaser from 'phaser';
import Board from './Board';
import { ScreenDimension } from './static_numbers';
import Boot from './Boot';
import Preloader from './Preloader';
import MainMenu from './MainMenu';
import Game from './Game';

export default class Tetris {
  TITLE = "Tetris";
  titleStyle = { font: "72px Arial", fill: "#ffffff" };

  buttonTextColor = 0xffffff;
  buttonTextOverColor = 0xffff00;
  buttonStyle = { font: "32px Arial", fill: "#ffffff" };
  buttonActiveStyle = { font: "32px Arial", fill: "#ffffff", fontStyle: "italic" };
  
  shapesJSON: any = null;
  shapes: any = null;  
  genetic: any = null;
  board: Board = null;
  shapesQueue: any = null;
  game: Phaser.Game = null

  run() {
    // Create the Phaser game
    this.game = new Phaser.Game( ScreenDimension.SCREEN_WIDTH, ScreenDimension.SCREEN_HEIGHT,
                                 Phaser.AUTO, "", this );

    // Add all the states to the game
    this.game.state.add('Boot', Boot, false);
    this.game.state.add('Preloader', Preloader, false);
    this.game.state.add('MainMenu', MainMenu, false);
    this.game.state.add('Game', Game, false);
  
    // Boot the game
    this.game.state.start('Boot');
  }
};

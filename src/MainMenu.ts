import * as Phaser from 'phaser';

export default class MainMenu extends Phaser.State {
  stateKey = "MainMenu";
  
  preload(){};
  
  create() {
    this.stage.backgroundColor = 0x444444; 
  }
  
  update() {};
};


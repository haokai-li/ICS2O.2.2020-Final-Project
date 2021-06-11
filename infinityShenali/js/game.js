/* global phaser */

// Copyright (c) 2021 Infinity de Guzman & Shenali Alles All rights reserved
//
// Created by Infinity de Guzman & Shenali Alles
// Created on June 2021
// This is the Phaser3 configuration file

import SplashScene1 from './infinityShenali/js/splashScene.js'
import TitleScene1 from './infinityShenali/js/titleScene.js'
import MenuScene1 from './infinityShenali/js/menuScene.js'
import GameScene1 from './infinityShenali/js/gameScene.js'

// Our Game Scene
const splashScene1 = new SplashScene1()
const titleScene1 = new TitleScene1()
const menuScene1 = new MenuScene1()
const gameScene1 = new GameScene1()

//* Game Scene */
const config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true
    }
  },
  // Set backgroundColor
  backgroundColor: 0x050A30,
  scale: {
    mode: Phaser.Scale.FIT,
    // we place it in the middle of the page
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
}

const game = new Phaser.Game(config)

// Load scenes
// NOTE: remember any "key" is global and CANNOT be reused (in the different scenes)
game.scene.add('splashScene1', splashScene1)
game.scene.add('titleScene1', titleScene1)
game.scene.add('menuScene1', menuScene1)
game.scene.add('gameScene1', gameScene1)

// Start title
game.scene.start('splashScene1')
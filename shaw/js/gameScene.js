/* global Phaser */

// Copyright (c) 2021 Ryan-Shaw-2 All rights reserved
//
// Created by: Ryan-Shaw-2
// Created on: May 2021
// This is the Game Scene

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'gameScene' })

    this.background = null
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload () {
    console.log('Game Scene')

    // images
    this.load.image('gameSceneBackground', 'assets/gameSceneBackground.png')
  }

  create (data) {
    this.background = this.add.image(0, 0, 'gameSceneBackground')
    this.background.setOrigin(0, 0)
  }

  update (time, delta) {
  }
}

export default GameScene

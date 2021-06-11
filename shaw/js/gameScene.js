/* global Phaser */

// Copyright (c) 2021 Ryan-Shaw-2 All rights reserved
//
// Created by: Ryan-Shaw-2
// Created on: May 2021
// This is the Game Scene

class GameScene extends Phaser.Scene {
  createGameGrid (x, y) {
    while (y < 1080){
      while (x < 1920){
        const cell = this.add.rectangle(x, y, 192, 180)
        cell.setStrokeStyle(2, 0x000000)
        this.gameGridCellGroup.add(cell)
        x += 192
      }
      if (x > 1920) {
        x = 96
        y += 180
      }
    }
  }
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
    // background
    this.background = this.add.image(0, 0, 'gameSceneBackground')
    this.background.setOrigin(0, 0)

    // Game Grid
    this.gameGridCellGroup = this.add.group()
    this.createGameGrid(96, 270)
  }

  update (time, delta) {
  }
}

export default GameScene

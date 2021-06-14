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
        const cell = this.add.rectangle(x, y, 192, 180).setInteractive()
        cell.setStrokeStyle(2, 0x000000)
        cell.alpha = 0.01
        cell.cellClicked = false
        cell.defenderPlaced = false
        this.gameGridCellGroup.add(cell)
        x += 192
      }
      if (x > 1920) {
        x = 96
        y += 180
      }
    }
  }
  createDefender () {
    console.log('test')
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
    this.load.image('defender', 'assets/spaceMarine.png')
  }

  create (data) {
    // background
    this.background = this.add.image(0, 0, 'gameSceneBackground')
    this.background.setOrigin(0, 0)

    // Game Grid cell group
    this.gameGridCellGroup = this.add.group()
    this.createGameGrid(96, 270)

    // Defender group
    this.defenderGroup = this.add.group()
  }

  update (time, delta) {
    // only shows the cell that the pointer is currently over
    this.gameGridCellGroup.children.each(function(cell) {
      cell.on('pointerover', function(pointer, x, y) {
        cell.alpha = 1
      })
      cell.on('pointerout', function() {
        cell.alpha = 0.01
      })
    })

    // Checks if a cell has been clicked by the pointer
    this.gameGridCellGroup.children.each(function(cell) {
      cell.on('pointerdown', function(x, y) {
        if (this.cellClicked === false) {
          this.defenderPlaced = true
          this.cellClicked = true
          console.log(cell.x, cell.y)
        }
      })
      cell.on('pointerup', function() {
        this.cellClicked = false
      })
    })
  }
}

export default GameScene

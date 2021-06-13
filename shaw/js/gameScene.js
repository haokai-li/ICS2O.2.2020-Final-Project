/* global Phaser */

// Copyright (c) 2021 Ryan-Shaw-2 All rights reserved
//
// Created by: Ryan-Shaw-2
// Created on: May 2021
// This is the Game Scene

class GameScene extends Phaser.Scene {
  // Creates game grid cells
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

  // Creates a defender
  createDefender (x, y) {
    if (this.energy >= 100) {
      this.energy -= 100
      this.energyText.setText('Energy: ' + this.energy.toString())
      const defender = this.physics.add.sprite(x, y, 'defender').setScale(3.5)
      this.defenderGroup.add(defender)
    }
  }

  addEnergy () {
    this.energy += 25
    this.energyText.setText('Energy: ' + this.energy.toString())
    console.log('+25 energy')
    this.energyTimer = this.time.delayedCall(10000, this.addEnergy, [], this)
  }

  constructor () {
    super({ key: 'gameScene' })

    this.background = null
    this.energy = 200
    this.energyText = null
    this.energyTextStyle = { font: '40px Arial', fill: '#000000', }
    this.energyTimer = null
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload () {
    console.log('Game Scene')

    // Images
    this.load.image('gameSceneBackground', 'assets/gameSceneBackground.png')
    this.load.image('defender', 'assets/spaceMarine.png')
  }

  create (data) {
    // Background
    this.background = this.add.image(0, 0, 'gameSceneBackground')
    this.background.setOrigin(0, 0)

    // Energy text
    this.energyText = this.add.text(10, 10, 'Energy: ' + this.energy.toString(), this.energyTextStyle)

    // Game Grid cell group
    this.gameGridCellGroup = this.add.group()
    this.createGameGrid(96, 270)

    // Defender group
    this.defenderGroup = this.add.group()

    // Checks if a cell has been clicked by the pointer
    this.gameGridCellGroup.children.each(function(cell) {
      cell.on('pointerdown', () => this.createDefender(cell.x, cell.y))
      cell.on('pointerup', function() {
        this.cellClicked = false
      })
    }.bind(this))

    // Start timer for energy production
    this.energyTimer = this.time.delayedCall(10000, this.addEnergy, [], this)
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
  }
}

export default GameScene

/* Final assignment */

// Copyright (c) 2021 haokai All rights reserved
//
// Created by: haokai
// Created on: Jun 2021
// This is the menu Scene

class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'menuScene' })

    this.menuSceneBackgroungImage = null
    this.startButton = null
  }

  init (date) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload () {
    console.log('Menu Scene')
    this.load.image('menuSceneBackground', './assets/aliens_screen_image2.jpg')
    this.load.image('startButton', './assets/start.png')
  }

  create (date) {
    this.menuSceneBackgroungImage = this.add.sprite(0, 0, 'menuSceneBackground')
    this.menuSceneBackgroungImage.x = 1920 / 2
    this.menuSceneBackgroungImage.y = 1080 / 2

    this.startButton = this.add.sprite(1920 / 2, (1080 / 2) + 100, 'startButton')
    this.startButton.setInteractive({ useHandCursor: true })
    this.startButton.on('pointerdown', () => this.clickButton())
  }

  update (time, delta) {
  }

  clickButton () {
    this.scene.start('gameScene')
  }
}

export default MenuScene

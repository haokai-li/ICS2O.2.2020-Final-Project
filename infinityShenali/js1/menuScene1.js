/* global Phaser */

// Copyright (c) 2021 Infinity de Guzman & Shenali Alles All rights reserved
//
// Created by: Infinity de Guzman & Shenali Alles 
// Created on: June 2021
// This is the Menu Scene1

class MenuScene1 extends Phaser.Scene {
  constructor () {
    super({ key: 'menuScene1' })

    this.menuSceneBackgroundImage = null
    this.startButton = null
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#050A30')
  }

  preload () {
    console.log('Menu Scene')

    this.load.image('galaxyBackground', 'assets1/galaxyBackground.jpg')
    this.load.image('startButton', 'assets1/startButton.gif')
  }

  create (data) {
    this.menuSceneBackgroundImage = this.add.sprite(0, 0, 'galaxyBackground')
    this.menuSceneBackgroundImage.x = 1920 / 2
    this.menuSceneBackgroundImage.y = 1080 / 2

    this.startButton = this.add.sprite(1920 / 2, (1080 / 2) + 100, 'startButton')
    this.startButton.setInteractive({ useHandCursor: true })
    this.startButton.on('pointerdown', () => this.clickButton())
  }

  update (time, delta) {
  }

  clickButton () {
    this.scene.start('gameScene1')
  }
}

export default MenuScene1

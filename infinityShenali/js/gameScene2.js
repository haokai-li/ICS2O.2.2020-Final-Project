/* global Phaser */

// Copyright (c) 2021 Infinity de Guzman & Shenali Alles All rights reserved
//
// Created by: Infinity de Guzman & Shenali Alles 
// Created on: June 2021
// This is the Game Scene 2

class GameScene2 extends Phaser.Scene {
  constructor () {
    super({ key: 'gameScene2' })

    this.gameSceneBackgroundImage = null
    this.replayButton = null
    this.text = null
    this.textStyle = { font: '65px Fira Sans', fill: '#fff', align: 'center' }
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#050A30')
  }

  preload () {
    console.log('Game Scene 2')

    this.load.image('gameScene2_galaxyBackground', 'assets/galaxyBackground.jpg')
    this.load.image('replayButton', 'assets/startButton.gif')
  }

  create (data) {
    this.gameSceneBackgroundImage = this.add.sprite(0, 0, 'gameScene2_galaxyBackground')
    this.gameSceneBackgroundImage.x = 1920 / 2
    this.gameSceneBackgroundImage.y = 1080 / 2

    this.replayButton = this.add.sprite(1920 / 2, (1080 / 2) + 100, 'replayButton')
    this.replayButton.setInteractive({ useHandCursor: true })
    this.replayButton.on('pointerdown', () => this.clickButton())

    this.text = this.add.text(1100 / 2, (500 / 2) + 100, 'You finished the tutorial!\nPress start to go to the next level.', this.textStyle)
  }

  update (time, delta) {
  }

  clickButton () {
    this.scene.start('gameScene1')
  }
}

export default GameScene2

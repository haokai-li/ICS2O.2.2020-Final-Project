/* global Phaser */

// Copyright (c) 2021 Infinity de Guzman & Shenali Alles All rights reserved
//
// Created by: Infinity de Guzman & Shenali Alles 
// Created on: June 2021
// This is the Menu Scene

class MenuScene extends Phaser.Scene {
  constructor () {
    super({ key: 'menuScene' })

    this.menuSceneBackgroundImage = null
    this.startButton = null
    this.instructionsText = null
    this.textStyle = { font: '65px Fira Sans', fill: '#fff', align: 'center' }
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#050A30')
  }

  preload () {
    console.log('Menu Scene')

    this.load.image('galaxyBackground', 'assets/galaxyBackground.jpg')
    this.load.image('startButton', 'assets/startButton.gif')
  }

  create (data) {
    this.menuSceneBackgroundImage = this.add.sprite(0, 0, 'galaxyBackground')
    this.menuSceneBackgroundImage.x = 1920 / 2
    this.menuSceneBackgroundImage.y = 1080 / 2

    this.startButton = this.add.sprite(1920 / 2, (1080 / 2) + 100, 'startButton')
    this.startButton.setInteractive({ useHandCursor: true })
    this.startButton.on('pointerdown', () => this.clickButton())

    this.instructionsText = this.add.text(675 / 2, (50 / 2) + 100, 'How to play:\nPress left, right, and down keys to move.\nPress the spacebar to jump.\nAvoid spikes and earn as many coins as you can.\nTouch puddles to gain a checkpoint.\nClick the button to start.', this.textStyle)
  }

  update (time, delta) {
  }

  clickButton () {
    this.scene.start('gameScene1')
  }
}

export default MenuScene

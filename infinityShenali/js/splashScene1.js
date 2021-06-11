/* global Phaser */

// Copyright (c) 2021 Infinity de Guzman & Shenali Alles All rights reserved
//
// Created by: Infinity de Guzman & Shenali Alles
// Created on: June 2021
// This is the Splash Scene

class SplashScene1 extends Phaser.Scene {
  constructor () {
    super({ key: 'splashScene1' })

    this.splashSceneBackgroundImage = null
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#050A30')
  }

  preload () {
    console.log('Splash Scene')
    this.load.image('splashSceneBackground', './assets/splashSceneBackground.png')
  }

  create (data) {
    this.splashSceneBackgroundImage = this.add.sprite(0, 0, 'splashSceneBackground')
    this.splashSceneBackgroundImage.x = 1920 / 2
    this.splashSceneBackgroundImage.y = 1080 / 2
  }

  update (time, delta) {
    if (time > 5000) {
      this.scene.switch('titleScene1')
    }
  }
}

export default SplashScene1

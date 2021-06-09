/* global Phaser */

// Copyright (c) 2021 Infinity de Guzman & Shenali Alles All rights reserved
//
// Created by: Infinity de Guzman & Shenali Alles 
// Created on: June 2021
// This is the Game Scene

class GameScene extends Phaser.Scene {
  // create an square 
  createSquare () {
    const squareXLocation = Math.floor(Math.random() * 1920) + 1 // this will get a number between 1 and 1920
    let squareXVelocity = Math.floor(Math.random() * 50) + 1 // this will get a number between 1 and 50;
    squareXVelocity *= Math.round(Math.random()) ? 1 : -1 // this will add minus sign in 50% of cases
    const anSquare = this.physics.add.sprite(squareXLocation, -100, 'square')
    anSquare.body.velocity.y = 200
    anSquare.body.velocity.x = squareXVelocity
    this.squareGroup.add(aSquare)
  }

  constructor () {
    super({ key: 'gameScene' })

    this.background = null
    this.potal = null
    this.checkpoint = false
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload () {
    console.log('Game Scene')

    // images
    this.load.image('galaxyBackground', 'assets/galaxyBackground.jpg')
    this.load.image('coin', 'assets/coin.gif')
    this.load.image('spike', 'assets/spike.png')
    this.load.image('portal', 'assets/portal.gif')
    this.load.image('squareSprite', 'assets/squareSprite.gif')
    // sound
  }

  create (data) {
    this.background = this.add.image(0, 0, 'galaxyBackground').setScale(2.0)
    this.background.setOrigin(0, 0)

    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')

    // create a group for the missiles
    this.missileGroup = this.physics.add.group()

    // create a group for the aliens
    this.alienGroup = this.add.group()
    this.createAlien()

    // Collisions between missiles and aliens
    this.physics.add.collider(this.missileGroup, this.alienGroup, function (missileCollide, alienCollide) {
      alienCollide.destroy()
      missileCollide.destroy()
      this.sound.play('explosion')
      this.createAlien()
      this.createAlien()
    }.bind(this))
  }

  update (time, delta) {
    // called 60 times a second, hopefully!

    const keyLeftObj = this.input.keyboard.addKey('LEFT')
    const keyRightObj = this.input.keyboard.addKey('RIGHT')
    const keySpaceObj = this.input.keyboard.addKey('SPACE')

    if (keyLeftObj.isDown === true) {
      this.ship.x -= 15
      if (this.ship.x < 0) {
        this.ship.x = 0
      }
    }

    if (keyRightObj.isDown === true) {
      this.ship.x += 15
      if (this.ship.x > 1920) {
        this.ship.x = 1920
      }
    }

    if (keySpaceObj.isDown === true) {
      if (this.fireMissile === false) {
        // fire missile
        this.fireMissile = true
        const aNewMissile = this.physics.add.sprite(this.ship.x, this.ship.y, 'missile')
        this.missileGroup.add(aNewMissile)
        this.sound.play('laser')
      }
    }

    if (keySpaceObj.isUp === true) {
      this.fireMissile = false
    }

    this.missileGroup.children.each(function (item) {
      item.y = item.y - 15
      if (item.y < 0) {
        item.destroy()
      }
    })
  }
}

export default GameScene

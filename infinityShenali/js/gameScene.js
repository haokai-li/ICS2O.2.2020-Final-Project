/* global Phaser */

// Copyright (c) 2021 Infinity de Guzman & Shenali Alles All rights reserved
//
// Created by: Infinity de Guzman & Shenali Alles 
// Created on: June 2021
// This is the Game Scene

class GameScene extends Phaser.Scene {

  constructor () {
    super({ key: 'gameScene' })

    this.player = null
    this.platforms = null
    this.background = null    
    this.coin = null
    this.portal = null
    this.spike = null
    this.checkpoint = false
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = { font: '45px Fira Sans', fill: '#fff', align: 'center' }
    this.text1 = null
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#050A30')
  }

  preload () {
    console.log('Game Scene')

    // spritesheets
    this.load.spritesheet('scene1_squareSprite', './assets/squareSprite.png', { frameWidth: 48, frameHeight: 48 })

    // images
    this.load.image('scene1_galaxyBackground', './assets/galaxyBackground.jpg')
    this.load.image('scene1_coin', './assets/coin.png')
    this.load.image('scene1_spike', './assets/spike.png')
    this.load.image('scene1_ground', './assets/platform.png')
    this.load.image('scene1_checkpoint', './assets/checkpoint.gif')
    this.load.image('scene1_portal', './assets/portal.gif')

    // sound
  }

  create (data) {
    this.background = this.add.image(0, 0, 'scene1_galaxyBackground')
    this.background.setOrigin(0, 0)

    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)

    // platforms
    this.platforms = this.physics.add.staticGroup()
    this.platforms.create(100, 250, 'scene1_ground')
    this.platforms.create(292, 250, 'scene1_ground')
    this.platforms.create(484, 250, 'scene1_ground')
    this.platforms.create(676, 250, 'scene1_ground')
    this.platforms.create(868, 250, 'scene1_ground')
    this.platforms.create(1060, 250, 'scene1_ground')
    this.platforms.create(1252, 250, 'scene1_ground')
    this.platforms.create(1444, 250, 'scene1_ground')
    
    this.platforms.create(1820, 520, 'scene1_ground')
    this.platforms.create(1628, 520, 'scene1_ground')
    this.platforms.create(1436, 520, 'scene1_ground')
    this.platforms.create(1244, 520, 'scene1_ground')
    this.platforms.create(1052, 520, 'scene1_ground')
    this.platforms.create(860, 520, 'scene1_ground')
    this.platforms.create(668, 520, 'scene1_ground')
    this.platforms.create(476, 520, 'scene1_ground')

    this.platforms.create(100, 790, 'scene1_ground')
    this.platforms.create(292, 790, 'scene1_ground')
    this.platforms.create(484, 790, 'scene1_ground')
    this.platforms.create(676, 790, 'scene1_ground')
    this.platforms.create(868, 790, 'scene1_ground')
    this.platforms.create(1060, 790, 'scene1_ground')
    this.platforms.create(1252, 790, 'scene1_ground')
    this.platforms.create(1444, 790, 'scene1_ground')

    // checkpoint
    this.checkpoint = this.physics.add.sprite (1800, 400, 'scene1_checkpoint')

    // portal
    this.portal = this.physics.add.sprite (1500, 670, 'scene1_portal')

    // spike
    this.spike = this.physics.add.staticGroup()

    this.spike.create(900, 205, 'scene1_spike')
    this.spike.create(1300, 205, 'scene1_spike')

    this.spike.create(1200, 475, 'scene1_spike')
    this.spike.create(1190, 475, 'scene1_spike')
    this.spike.create(890, 475, 'scene1_spike')

    this.spike.create(500, 745, 'scene1_spike')

    // coin
    this.coin = this.physics.add.staticGroup()
    this.coin.create(1190, 430, 'scene1_coin')
    this.coin.create(1090, 430, 'scene1_coin')
    this.coin.create(990, 430, 'scene1_coin')
    this.coin.create(890, 430, 'scene1_coin')
    this.coin.create(790, 430, 'scene1_coin')
    this.coin.create(690, 430, 'scene1_coin')

    // player
    this.player = this.physics.add.sprite (100, 199, 'scene1_squareSprite');

    this.player.setCollideWorldBounds(true);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('scene1_squareSprite', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    })

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('scene1_squareSprite', { start: 0, end: 1 }),
      frameRate: 5,
      repeat: -1
    })

    // collision between player and platforms
    this.physics.add.collider(this.player, this.platforms)

    // collision between spikes and platforms
    this.physics.add.collider(this.spike, this.platforms)

    // collision between player and spikes
    this.physics.add.collider(this.player, this.spike, function() {
      this.player.setPosition(100, 199)
    }.bind(this))

    // collision between spike and coin
    this.physics.add.collider(this.coin, this.spike)
    
    // collision between spikes and checkpoint and platforms
    this.physics.add.collider(this.checkpoint, this.platforms)
    this.physics.add.collider(this.portal, this.platforms)

    // collision between the player and coins
    this.physics.add.collider(this.player, this.coin, function(playerCollide, coinCollide) {
      coinCollide.destroy();
      this.score = this.score + 1
      this.scoreText.setText('Score: ' + this.score.toString())
    }.bind(this))

    //collision between player and portal
    this.physics.add.collider(this.player, this.portal, function() {
      this.scene.start('menuScene2')
    }.bind(this))
  }

  update (time, delta) {
    // called 60 times a second, hopefully!
    const keySpaceObj = this.input.keyboard.addKey('SPACE') // Get key object
    const keyLeftObj = this.input.keyboard.addKey('LEFT') // Get key object
    const keyRightObj = this.input.keyboard.addKey('RIGHT') // Get key object

    if (keyLeftObj.isDown === true) {
      this.player.setVelocityX(-160)
      this.player.anims.play('left', true)
    } else if (keyRightObj.isDown === true) {
      this.player.setVelocityX(160)
      this.player.anims.play('right', true)
    }

    if (keySpaceObj.isDown === true && this.player.body.touching.down) {
      this.player.setVelocityY(-200)
    }
  }
}

export default GameScene

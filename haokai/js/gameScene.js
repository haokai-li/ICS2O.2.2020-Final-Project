/* Final assignment */

// Copyright (c) 2021 haokai All rights reserved
//
// Created by: haokai
// Created on: Jun 2021
// This is the game Scene
//change

class GameScene extends Phaser.Scene {
  constructor () {
    super({ key: 'gameScene' })

    this.background = null
    this.ship = null
    this.startTime = true
    this.timeAlien = true
    this.timeb = 0
    this.timee = 0
    this.timeTime = 0
    this.gameOverShow = true
    this.score = 0
    this.scoreText = null
    this.scoreTextStyle = { font: '65px Arial', fill: '#ffffff', align: 'center' }
    this.gameOverTextStyle = { font: '65px Arial', fill: '#ff0000', align: 'center' }
  }

  init (date) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload () {
    console.log('Game Scene')

    // image
    this.load.image('starBackground', './assets/starBackground.png')
    this.load.image('ship', './assets/spaceShip.png')
    this.load.image('missile', './assets/missile.png')
    this.load.image('alien', './assets/alien.png')
    // sound
    this.load.audio('laser', './assets/laser1.wav')
    this.load.audio('explosion', './assets/barrelExploding.wav')
    this.load.audio('bomb', './assets/bomb.wav')
  }

  create (date) {
    this.background = this.add.image(0, 0, 'starBackground').setScale(2.0)
    this.background.setOrigin(0, 0)

    this.scoreText = this.add.text(10, 10, 'Score: ' + this.score.toString(), this.scoreTextStyle)


    this.ship = this.physics.add.sprite(1920 / 2, 1080 - 100, 'ship')

    // create a group for the aliens
    this.alienGroup = this.add.group()

    this.startTime = true
    this.gameOverShow = true

    // Colliosions between ship and aliens
    this.physics.add.collider(this.ship, this.alienGroup, function (shipCollide, alienCollide) {
      this.sound.play('bomb')
      this.physics.pause()
      this.gameOverShow = false
      alienCollide.destroy()
      shipCollide.destroy()
      this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick this to play again!', this.gameOverTextStyle).setOrigin(0.5)
      this.gameOverText.setInteractive({ useHandCursor: true })
      this.gameOverText.on('pointerdown', () => this.scene.start('gameScene'))
    }.bind(this))
  }

  update (time, delta) {
    // called 60 times a second, hopefully!
    const keyLeftObj = this.input.keyboard.addKey('LEFT')
    const keyRightObj = this.input.keyboard.addKey('RIGHT')
    const keyUpObj = this.input.keyboard.addKey('UP')
    const keyDownObj = this.input.keyboard.addKey('Down')

    // get time of index start
    let timea = Math.floor(time / 1000)
    let timec = 0 - Math.floor(time / 1000)
    // get time of runing of splash, title and menu
    if (this.startTime == true) {
      this.startTime = false
      this.timeb = timec
    }

    // get time of game runing and give to score
    if (this.gameOverShow === true) {
      this.score = Math.floor(time / 1000) + this.timeb
      this.scoreText.setText('score: ' + this.score.toString())
    }

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

    if (keyUpObj.isDown === true) {
      this.ship.y -= 15
      if (this.ship.y < 0) {
        this.ship.y = 0
      }
    }

    if (keyDownObj.isDown === true) {
      this.ship.y += 15
      if (this.ship.y > 1080) {
        this.ship.y = 1080
      }
    }
    //this destroy old aliens
    this.alienGroup.children.each(function (item) {
      if (item.y > 1080) {
        item.destroy()
        console.log('ok')
      }
    })

    // this create alien each 2 seconds
    if (this.timeAlien === true) {
      this.timee = timec
      this.timeAlien = false
      const alienXLocation = Math.floor(Math.random() * 1920) + 1 // this will get a number between 1 and 1920
      let alienXVelocity = Math.floor(Math.random() * 50) + 1 // this will get a number between 1 and 50
      alienXVelocity *= Math.round(Math.random()) ? 1 : -1 // this will add minus sign in 50% of cases
      const anAlien = this.physics.add.sprite(alienXLocation, -100, 'alien')
      anAlien.body.velocity.y = 200
      anAlien.body.velocity.x = alienXVelocity
      this.alienGroup.add(anAlien)
    }

    if (this.timeAlien === false) {
      this.timeTime = Math.floor(time / 1000) + this.timee
      if (this.timeTime == 2) {
        this.timeAlien = true
      }
    }
    console.log(this.timeTime)
  }
}

export default GameScene

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

    this.timeAlienFirst = true
    this.timeAlienSecond = true
    this.timeAlienThird = true
    this.timeAlienFourth = true

    this.timeb = 0

    this.timeeFirst = 0
    this.timeeSecond = 0
    this.timeeThird = 0
    this.timeeFourth = 0

    this.timeTimeFirst = 0
    this.timeTimeSecond = 0
    this.timeTimeThird = 0
    this.timeTimeFourth = 0

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


    this.ship = this.physics.add.sprite(1920 / 2, 1080 / 2, 'ship')

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
      if (item.y > 1280) {
        item.destroy()
        console.log('ok')
      }

      if (item.y < -200) {
        item.destroy()
        console.log('ok')
      }

      if (item.x > 2020) {
        item.destroy()
        console.log('ok')
      }

      if (item.x < -200) {
        item.destroy()
        console.log('ok')
      }
    })

    // this create alien each some seconds(First)
    if (this.timeAlienFirst === true) {
      this.timeeFirst = timec
      this.timeAlienFirst = false
      const alienXLocationFirst = Math.floor(Math.random() * 1920) + 1 // this will get a number between 1 and 1920
      let alienXVelocityFirst = Math.floor(Math.random() * 50) + 1 // this will get a number between 1 and 50
      alienXVelocityFirst *= Math.round(Math.random()) ? 1 : -1 // this will add minus sign in 50% of cases
      const anAlienFirst = this.physics.add.sprite(alienXLocationFirst, -100, 'alien')
      anAlienFirst.body.velocity.y = 200
      anAlienFirst.body.velocity.x = alienXVelocityFirst
      this.alienGroup.add(anAlienFirst)
    }

    if (this.timeAlienFirst === false) {
      this.timeTimeFirst = Math.floor(time / 1000) + this.timeeFirst
      if (this.timeTimeFirst == 2) {
        this.timeAlienFirst = true
      }
    }

    // this create alien each some seconds(Second)
    if (this.timeAlienSecond === true) {
      this.timeeSecond = timec
      this.timeAlienSecond = false
      const alienXLocationSecond = Math.floor(Math.random() * 1920) + 1 // this will get a number between 1 and 1920
      let alienXVelocitySecond = Math.floor(Math.random() * 50) + 1 // this will get a number between 1 and 50
      alienXVelocitySecond *= Math.round(Math.random()) ? 1 : -1 // this will add minus sign in 50% of cases
      const anAlienSecond = this.physics.add.sprite(alienXLocationSecond, 1180, 'alien')
      anAlienSecond.body.velocity.y = -200
      anAlienSecond.body.velocity.x = alienXVelocitySecond
      this.alienGroup.add(anAlienSecond)
    }

    if (this.timeAlienSecond === false) {
      this.timeTimeSecond = Math.floor(time / 1000) + this.timeeSecond
      if (this.timeTimeSecond == 2) {
        this.timeAlienSecond = true
      }
    }

    // this create alien each some seconds(Third)
    if (this.timeAlienThird === true) {
      this.timeeThird = timec
      this.timeAlienThird = false
      const alienYLocationThird = Math.floor(Math.random() * 1080) + 1 // this will get a number between 1 and 1920
      let alienYVelocityThird = Math.floor(Math.random() * 50) + 1 // this will get a number between 1 and 50
      alienYVelocityThird *= Math.round(Math.random()) ? 1 : -1 // this will add minus sign in 50% of cases
      const anAlienThird = this.physics.add.sprite(-100, alienYLocationThird, 'alien')
      anAlienThird.body.velocity.x = 200
      anAlienThird.body.velocity.y = alienYVelocityThird
      this.alienGroup.add(anAlienThird)
    }

    if (this.timeAlienThird === false) {
      this.timeTimeThird = Math.floor(time / 1000) + this.timeeThird
      if (this.timeTimeThird == 2) {
        this.timeAlienThird = true
      }
    }

    // this create alien each some seconds(Fourth)
    if (this.timeAlienFourth === true) {
      this.timeeFourth = timec
      this.timeAlienFourth = false
      const alienYLocationFourth = Math.floor(Math.random() * 1920) + 1 // this will get a number between 1 and 1920
      let alienYVelocityFourth = Math.floor(Math.random() * 50) + 1 // this will get a number between 1 and 50
      alienYVelocityFourth *= Math.round(Math.random()) ? 1 : -1 // this will add minus sign in 50% of cases
      const anAlienFourth = this.physics.add.sprite(2020, alienYLocationFourth, 'alien')
      anAlienFourth.body.velocity.x = -200
      anAlienFourth.body.velocity.y = alienYVelocityFourth
      this.alienGroup.add(anAlienFourth)
    }

    if (this.timeAlienFourth === false) {
      this.timeTimeFourth = Math.floor(time / 1000) + this.timeeFourth
      if (this.timeTimeFourth == 2) {
        this.timeAlienFourth = true
      }
    }
  } 
}

export default GameScene

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
    if (this.energy >= 100 && this.defenderPositions.indexOf(x + y) === -1) {
      this.energy -= 100
      this.energyText.setText('Energy: ' + this.energy.toString())
      const defender = this.physics.add.sprite(x, y, 'defender').setScale(3.5)
      defender.defenderPosition = x + y
      this.defenderPositions.push(defender.defenderPosition)
      // Makes the defenders shoot
      defender.shootingTimer = null
      defender.shootingTimer = this.time.addEvent({ delay: 2000, callback: this.createLaser, callbackScope: this, args: [x, y], loop: true });
      defender.shootingTimer.paused = true;
      this.defenderGroup.add(defender)
    }
  }

  // Creates a laser
  createLaser (x, y) {
    const laser = this.physics.add.sprite(x, y, 'laser').setScale(1.25)
    this.laserGroup.add(laser)
  }

  // Creates a monster
  createMonster() {
    // Gets a y coordinate corresponding with one of the five rows
    const monsterYLocation = ((Math.floor(Math.random() * 5) + 1) * 180) + 90
    const monster = this.physics.add.sprite(1920, monsterYLocation, 'monster').setScale(0.20)
    monster.body.velocity.x = -40
    monster.health = 100
    this.monsterYPositions.push(monsterYLocation)
    this.monsterGroup.add(monster)
    console.log('Created new monster')
    if (this.monsterDelay > 3000) {
      this.monsterDelay -= 250
      console.log('New delay is: ', this.monsterDelay)
    }
    if (this.gameOver != true) {
      this.monsterTimer = this.time.delayedCall(this.monsterDelay, this.createMonster, [], this)
    }
  }

  // Energy production timer
  addEnergy () {
    if (this.gameOver != true) {
      this.energy += 25
      this.energyText.setText('Energy: ' + this.energy.toString())
      console.log('+25 energy')
      this.energyTimer = this.time.delayedCall(5000, this.addEnergy, [], this)
    }
  }

  // Restart the game
  restartGame () {
    this.scene.start('gameScene')
    this.gameOver = false
    this.gameReset = true
    this.energy = 200
    this.energyText.setText('Energy: ' + this.energy.toString())
    this.score = 0
    this.scoreText.setText('Score: ' + this.score.toString())
    this.monsterDelay = 8000
    this.monsterYPositions = []
    console.log('Game Reset')
  }

  // Plays game music
  playMusic () {
    this.sound.play('gameMusic', {volume: 0.25})
    this.musicTimer = this.time.delayedCall(102000, this.playMusic, [], this)
  }

  constructor () {
    super({ key: 'gameScene' })

    this.background = null
    this.energy = 200
    this.score = 0
    this.energyText = null
    this.scoreText = null
    this.energyTextStyle = { font: '40px Arial', fill: '#000000' }
    this.scoreTextStyle = { font: '40px Arial', fill: '#000000' }
    this.gameOverTextStyle = { font: '65px Arial', fill: '#000000', align: 'center' }
    this.energyTimer = null
    this.monsterTimer = null
    this.musicTimer = null
    this.monsterDelay = 8000
    this.monsterYPositions = []
    this.defenderPositions = []
    this.gameOver = null
    this.gameReset = false
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload () {
    console.log('Game Scene')

    // Images
    this.load.image('gameSceneBackground', 'assets/gameSceneBackground.png')
    this.load.image('defender', 'assets/spaceMarine.png')
    this.load.image('monster', 'assets/monster.png')
    this.load.image('laser', 'assets/laser.png')

    // Audio
    this.load.audio('gameMusic', 'assets/gameMusic.mp3')
    this.load.audio('splat', 'assets/splat.mp3')
  }

  create (data) {
    // Background
    this.background = this.add.image(0, 0, 'gameSceneBackground')
    this.background.setOrigin(0, 0)

    // Play Music
    if (this.gameReset === false) {
      this.playMusic()
    }

    // Energy text
    this.energyText = this.add.text(10, 10, 'Energy: ' + this.energy.toString(), this.energyTextStyle)

    // Score Text
    this.scoreText = this.add.text(10, 60, 'Score: ' + this.score.toString(), this.scoreTextStyle)

    // Game Grid cell group
    this.gameGridCellGroup = this.add.group()
    this.createGameGrid(96, 270)

    // Checks if a cell has been clicked by the pointer then places a defender
    this.gameGridCellGroup.children.each(function(cell) {
      cell.on('pointerdown', () => this.createDefender(cell.x, cell.y))
      cell.on('pointerup', function() {
        this.cellClicked = false
      })
    }.bind(this))

    // Defender group
    this.defenderGroup = this.add.group()

    // Laser group
    this.laserGroup = this.add.group()

    // Monster group
    this.monsterGroup = this.add.group()

    // Start Monster timer
    this.monsterTimer = this.time.delayedCall(this.monsterDelay, this.createMonster, [], this)

    // Start timer for energy production
    this.energyTimer = this.time.delayedCall(10000, this.addEnergy, [], this)

    // Collisions between lasers and monsters
    this.physics.add.collider(this.laserGroup, this.monsterGroup, function (laserCollide, monsterCollide, health,) {
      monsterCollide.health -= 10
      this.sound.play('splat', {volume: 0.1})
      laserCollide.destroy()
    }.bind(this))

    // Collisions between defenders and monsters
    this.physics.add.collider(this.defenderGroup, this.monsterGroup, function (defenderCollide, monsterCollide, defenderPosition) {
      defenderCollide.shootingTimer.remove()
      const removePosition = this.defenderPositions.indexOf(defenderCollide.x + defenderCollide.y);
      if (removePosition > -1) {
        this.defenderPositions.splice(removePosition, 1)
      }
      console.log(this.defenderPositions)
      defenderCollide.destroy()
    }.bind(this))
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

    // Makes lasers move
    this.laserGroup.children.each(function(laser) {
      laser.x += 5
      if (laser.x > 1920) {
        laser.destroy()
      }
    })
    
    // Makes defenders only shoot if a monster is on their row
    this.defenderGroup.children.each(function(defender) {
      if (this.monsterYPositions.includes(defender.y) && this.gameOver != true) {
        defender.shootingTimer.paused = false
      } else {
        defender.shootingTimer.paused = true
      }
    }.bind(this))

    // Destroys montsers if their health is below 0
    this.monsterGroup.children.each(function(monster) {
      if (monster.health <= 0) {
        monster.destroy()
        this.score = this.score + 1
        this.scoreText.setText('Score: ' + this.score.toString())
        const removeMonsterY = this.monsterYPositions.indexOf(monster.y);
        if (removeMonsterY > -1) {
        this.monsterYPositions.splice(removeMonsterY, 1)
        } 
      }
    }.bind(this))

    // Keep velocity of monsters the same
    this.monsterGroup.children.each(function(monster) {
      monster.body.velocity.x = -40
    })

    // If a monster reaches the left, it is Game Over!
    this.monsterGroup.children.each(function(monster) {
      if (monster.x < 0) {
        this.physics.pause()
        this.gameOver = true
        this.gameOverText = this.add.text(1920 / 2, 1080 / 2, 'Game Over!\nClick to play again', this.gameOverTextStyle).setOrigin(0.5)
        this.gameOverText.setInteractive({ useHandCursor: true })
        this.gameOverText.on('pointerdown', () => this.restartGame())
      }
    }.bind(this))
  }
}

export default GameScene

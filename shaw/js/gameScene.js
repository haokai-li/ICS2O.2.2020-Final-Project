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
    // Soldier
    if (this.defenderType === 1 && this.energy >= 100 && this.defenderPositions.indexOf(x + y) === -1) {
      this.energy -= 100
      this.energyText.setText('Energy: ' + this.energy.toString())
      const defender = this.physics.add.sprite(x, y, 'soldier').setScale(3.5)
      defender.defenderPosition = x + y
      this.defenderPositions.push(defender.defenderPosition)
      // Defender attributes
      defender.defenderShoots = true
      defender.makesEnergy = false
      // Makes the soldiers shoot
      defender.shootingTimer = null
      defender.shootingTimer = this.time.addEvent({ delay: 2000, callback: this.createLaser, callbackScope: this, args: [x, y], loop: true });
      defender.shootingTimer.paused = true;
      this.defenderGroup.add(defender)
      // Energy Generator (extra)
    } else if (this.defenderType === 2 && this.energy >= 50 && this.defenderPositions.indexOf(x + y) === -1) {
      this.energy -= 50
      this.energyText.setText('Energy: ' + this.energy.toString())
      const defender = this.physics.add.sprite(x, y, 'generator').setScale(2.0)
      defender.defenderPosition = x + y
      this.defenderPositions.push(defender.defenderPosition)
      // Defender attributes
      defender.defenderShoots = false
      defender.makesEnergy = true
      // Makes generator produce energy
      defender.energyDelay = null
      defender.energyDelay = this.time.addEvent({ delay: 15000, callback: this.generatorAddEnergy, callbackScope: this, loop: true });
      this.defenderGroup.add(defender)
    }
  }

  // Creates a laser
  createLaser (x, y) {
    const laser = this.physics.add.sprite(x, y, 'laser').setScale(1.25)
    this.laserGroup.add(laser)
  }

  // Adds energy to total (extra)
  generatorAddEnergy () {
    if (this.gameOver != true) {
      this.energy += 25
      this.energyText.setText('Energy: ' + this.energy.toString())
      console.log('+25 energy')
    }
  }

  // Creates a monster then sets a timer to create another
  createMonster(createOne) {
    // Gets a y coordinate corresponding with one of the five rows
    const monsterYLocation = ((Math.floor(Math.random() * 5) + 1) * 180) + 90
    const monster = this.physics.add.sprite(1920, monsterYLocation, 'monster').setScale(0.20)
    monster.body.velocity.x = -40
    monster.health = 100
    this.monsterYPositions.push(monsterYLocation)
    this.monsterGroup.add(monster)
    console.log('Created new monster')
    if (this.monsterDelay > 3000 && createOne != true) {
      this.monsterDelay -= 250
      console.log('New delay is: ', this.monsterDelay)
    }
    if (this.gameOver != true && createOne != true ) {
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

  // Restart the game variables
  restartGame () {
    this.scene.start('gameScene')
    this.gameOver = false
    this.gameReset = true
    this.energy = 50
    this.energyText.setText('Energy: ' + this.energy.toString())
    this.score = 0
    this.scoreText.setText('Score: ' + this.score.toString())
    this.monsterDelay = 10000
    this.monsterYPositions = []
    this.defenderPositions = []
    console.log('Game Reset')

    // (extra)
    this.numberOfWaves = 0
    this.defenderType = 1
    
  }

  // Plays game music
  playMusic () {
    this.sound.play('gameMusic', {volume: 0.25})
    this.musicTimer = this.time.delayedCall(102000, this.playMusic, [], this)
  }

  constructor () {
    super({ key: 'gameScene' })

    this.background = null
    this.energy = 50
    this.score = 0
    this.energyText = null
    this.scoreText = null
    this.energyTextStyle = { font: '40px Arial', fill: '#000000' }
    this.scoreTextStyle = { font: '40px Arial', fill: '#000000' }
    this.gameOverTextStyle = { font: '65px Arial', fill: '#000000', align: 'center' }
    this.energyTimer = null
    this.monsterTimer = null
    this.musicTimer = null
    this.startDelay = null
    this.monsterDelay = 10000
    this.monsterYPositions = []
    this.defenderPositions = []
    this.gameOver = null
    this.gameReset = false

    // (extra)
    this.defenderType = 1
    this.defenderTypeText = null
    this.defenderTypeTextStyle = { font: '40px Arial', fill: '#000000', align: 'left' }
    this.numberOfWaves = 0
  }

  init (data) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload () {
    console.log('Game Scene')

    // Images
    this.load.image('gameSceneBackground', 'assets/gameSceneBackground.png')
    this.load.image('soldier', 'assets/soldier.png')
    this.load.image('generator', 'assets/energyGenerator.png')
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

    // Energy text
    this.energyText = this.add.text(10, 10, 'Energy: ' + this.energy.toString(), this.energyTextStyle)

    // Score Text
    this.scoreText = this.add.text(10, 60, 'Score: ' + this.score.toString(), this.scoreTextStyle)

    // Selected defender text
    this.defenderTypeText = this.add.text(1300, 10, 'Selected Defender: Soldier (100E)', this.defenderTypeTextStyle)

     // Play Music
    if (this.gameReset === false) {
      this.playMusic()
    }

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

    // Delay start of monster spawning
    this.startDelay = this.time.delayedCall(20000, this.createMonster, [], this)

    // Start timer for energy production
    this.energyTimer = this.time.delayedCall(5000, this.addEnergy, [], this)

    // Collisions between lasers and monsters
    this.physics.add.collider(this.laserGroup, this.monsterGroup, function (laserCollide, monsterCollide, health,) {
      monsterCollide.health -= 10
      this.sound.play('splat', {volume: 0.1})
      laserCollide.destroy()
    }.bind(this))

    // Collisions between defenders and monsters
    this.physics.add.collider(this.defenderGroup, this.monsterGroup, function (defenderCollide, monsterCollide, defenderPosition, defenderShoots, makesEnergy) {
      if (defenderCollide.defenderShoots === true) {
        defenderCollide.shootingTimer.remove()
      } else if (defenderCollide.makesEnergy === true) {
        defenderCollide.energyDelay.remove()
      }
      const removePosition = this.defenderPositions.indexOf(defenderCollide.x + defenderCollide.y);
      if (removePosition > -1) {
        this.defenderPositions.splice(removePosition, 1)
      }
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
      if (defender.defenderShoots === true) {
        if (this.monsterYPositions.includes(defender.y) && this.gameOver != true) {
          defender.shootingTimer.paused = false
        } else {
          defender.shootingTimer.paused = true
        }
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

    // Keeps velocity of monsters consistant
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

    // Waves of monsters (extra)
    if (this.monsterDelay === 3000) {
      this.monsterDelay = 8000
      this.numberOfMonsters = 8
      this.monstersSpawned = 0
      while (this.numberOfMonsters > this.monstersSpawned) {
        this.createMonster(this.createOne = true)
        this.monstersSpawned += 1
      }
      this.monstersSpawned = 0
      this.numberOfWaves += 1
    }

    const one = this.input.keyboard.addKey('Q')
    const two = this.input.keyboard.addKey('E')

    if (one.isDown === true) {
      this.defenderType = 1
      this.defenderTypeText.setText('Selected Defender: Soldier (100E)')
    }

    if (two.isDown === true) {
      this.defenderType = 2
      this.defenderTypeText.setText('Selected Defender: Generator (50E)')
    }
  }
}

export default GameScene

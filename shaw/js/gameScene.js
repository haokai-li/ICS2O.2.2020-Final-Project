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
        cell.cellClicked = false
        cell.defenderPlaced = false
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
    if (this.energy >= 100) {
      this.energy -= 100
      this.energyText.setText('Energy: ' + this.energy.toString())
      const defender = this.physics.add.sprite(x, y, 'defender').setScale(3.5)
      // Makes the defenders shoot
      defender.shooting = false
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
    console.log(this.monsterYPositions)
    this.monsterGroup.add(monster)
    console.log('Created new monster')
    if (this.monsterDelay > 3000) {
      this.monsterDelay -= 250
      console.log('New delay is: ', this.monsterDelay)
    }
    this.monsterTimer = this.time.delayedCall(this.monsterDelay, this.createMonster, [], this)
  }

  // Energy production timer
  addEnergy () {
    this.energy += 25
    this.energyText.setText('Energy: ' + this.energy.toString())
    console.log('+25 energy')
    this.energyTimer = this.time.delayedCall(10000, this.addEnergy, [], this)
  }

  constructor () {
    super({ key: 'gameScene' })

    this.background = null
    this.energy = 200
    this.energyText = null
    this.energyTextStyle = { font: '40px Arial', fill: '#000000', }
    this.energyTimer = null
    this.monsterTimer = null
    this.monsterDelay = 8000
    this.timedEvent = null
    this.monsterYPositions = []
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
  }

  create (data) {
    // Background
    this.background = this.add.image(0, 0, 'gameSceneBackground')
    this.background.setOrigin(0, 0)

    // Energy text
    this.energyText = this.add.text(10, 10, 'Energy: ' + this.energy.toString(), this.energyTextStyle)

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
    this.physics.add.collider(this.laserGroup, this.monsterGroup, function (laserCollide, monsterCollide, health) {
      monsterCollide.health -= 20
      laserCollide.destroy()
    }.bind(this))

    // Collisions between lasers and monsters
    this.physics.add.collider(this.defenderGroup, this.monsterGroup, function (defenderCollide, monsterCollide) {
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
      if (this.monsterYPositions.includes(defender.y)) {
        defender.shootingTimer.paused = false
      } else {
        defender.shootingTimer.paused = true
      }
    }.bind(this))

    // Destroys montsers if their health is below 0
    this.monsterGroup.children.each(function(monster) {
      if (monster.health <= 0) {
        monster.destroy()
        const index = this.monsterYPositions.indexOf(monster.y);
        if (index > -1) {
        this.monsterYPositions.splice(index, 1)
        } 
        console.log(this.monsterYPositions)
      }
    }.bind(this))

    // Keep velocity of monsters the same
    this.monsterGroup.children.each(function(monster) {
      monster.body.velocity.x = -40
    })

  }
}

export default GameScene

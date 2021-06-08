/* Final assignment */

// Copyright (c) 2021 haokai All rights reserved
//
// Created by: haokai
// Created on: Jun 2021
// This is the game Scene


  constructor () {
    super({ key: 'gameScene' })
  }

  init (date) {
    this.cameras.main.setBackgroundColor('#ffffff')
  }

  preload () {
    console.log('Game Scene')
  }

  update (time, delta) {
}

export default GameScene

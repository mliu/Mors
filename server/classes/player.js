'use strict';
var Actor = require('./actor.js');
var Util = require('./util.js');

var Player = function(id, map, initX, initY) {
  this.color = '#000';
  this.height = 30;
  this.id = id;
  this.input = {};
  this.name = '';
  this.v = 5;
  this.width = 30;
  this.x = initX;
  this.y = initY;
  this.map;
}
Player.prototype = Object.create(Actor.prototype);

// Called by the engine every game loop. Updates player position accordingly
Player.prototype.handleMovement = function() {

  // X-axis movement
  if (this.input.left) {
    this.x -= this.v;
  } 
  if (this.input.right) {
    this.x += this.v;
  }

  // Y-axis movement
  if (this.input.up) {
    this.y -= this.v;
  } 
  if (this.input.down) {
    this.y += this.v;
  }
}

// Called on player setup
Player.prototype.setup = function(data) {
  this.name = data.name;
}

Player.prototype.toJSON = function() {
  return { color: this.color, id: this.id, name: this.name, x: this.x, y: this.y };
}

Player.prototype.updateMovementInput = function(playerData) {
  this.input = playerData.input;
}

module.exports = Player;

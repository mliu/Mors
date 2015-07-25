'use strict';
var Actor = require('./actor.js');
var Util = require('./util.js');

var Player = function(id, map, initX, initY, playerData) {
  // General descriptive properties
  this.id = id;
  this.color = '#000';
  this.height = 30;
  this.width = 30;
  this.name = playerData.name;
  this.v = 5;
  this.x = initX;
  this.y = initY;
  this.map = map;

  // Player input, used for movement
  this.input = {};
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

Player.prototype.toJSON = function() {
  return { color: this.color, id: this.id, name: this.name, x: this.x, y: this.y };
}

Player.prototype.updateMovementInput = function(playerData) {
  this.input = playerData.input;
}

module.exports = Player;

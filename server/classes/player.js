'use strict';
var Actor = require('./actor.js');
var Util = require('./util.js');
var Victor = require('victor');

var Player = function(id, initX, initY, playerData) {
  // General descriptive properties
  this.id = id;
  this.color = '#000';
  this.height = 30;
  this.width = 30;
  this.name = playerData.name;
  this.baseVelocity = 5;
  this.v = new Victor(0, 0);
  this.x = initX;
  this.y = initY;

  // Player input, used for movement
  this.input = {};
}
Player.prototype = Object.create(Actor.prototype);

// Called by the engine every game loop. Updates player position accordingly
Player.prototype.handleMovement = function() {
  var direction = new Victor(this.input.right - this.input.left, this.input.down - this.input.up);

  if(direction.magnitude()) {
    this.v.x = this.baseVelocity * Math.cos(direction.angle());
    this.v.y = this.baseVelocity * Math.sin(direction.angle());

    this.x += this.v.x;
    this.y += this.v.y;
  }
}

Player.prototype.toJSON = function() {
  return { color: this.color, id: this.id, name: this.name, x: this.x, y: this.y };
}

Player.prototype.updateMovementInput = function(playerData) {
  this.input = playerData.input;
}

module.exports = Player;

'use strict';

var WIDTH = 30;
var HEIGHT = 30;

var Player = function(id) {
  this.color = '#000';
  this.id = id;
  this.name = '';
  this.v = 5;
}

// Called on player setup
Player.prototype.setup = function(data) {
  this.name = data.name;
}

// Returns the (x, y) coordinates of the center of this object
Player.prototype.getCenterCoordinates = function() {
  return { x: this.x + WIDTH / 2, y: this.y + HEIGHT / 2 };
}

Player.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
}

// Called by the engine every game loop. Updates player position accordingly
Player.prototype.handleMovement = function() {
  // X-axis movement
  if(this.input.left) {
    this.x -= this.v;
  } else if(this.input.right) {
    this.x += this.v;
  }
  // Y-axis movement
  if(this.input.up) {
    this.y -= this.v;
  } else if(this.input.down) {
    this.y += this.v;
  }
}

Player.prototype.updateMovement = function(playerData) {
  this.input = playerData.input;
}

Player.prototype.toJSON = function() {
  return { color: this.color, id: this.id, name: this.name, x: this.x, y: this.y };
}

module.exports = Player;

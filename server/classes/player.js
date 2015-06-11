'use strict';
var Util = require('./util.js');
var Mapper = require('./mapper.js');

// Mapper that manages this player's map instance
var mapper = new Mapper();

var WIDTH = 30;
var HEIGHT = 30;

var Player = function(id) {
  this.color = '#000';
  this.id = id;
  this.input = {};
  this.name = '';
  this.v = 5;
}

// Called on player setup
Player.prototype.setup = function(data) {
  this.name = data.name;
  mapper.use(this.mapId);
}

// Returns the (x, y) coordinates of the center of this object
Player.prototype.getCenterCoordinates = function() {
  return { x: this.x + WIDTH / 2, y: this.y + HEIGHT / 2 };
}

Player.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
}

Player.prototype.getMapper = function() {
  return mapper;
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

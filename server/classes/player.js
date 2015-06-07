'use strict';

var Player = function(id) {
  this.color = '#000';
  this.id = id;
  this.name = '';
  this.vx = 5;
  this.vy = 5;
}

Player.prototype.setup = function(data) {
  this.name = data.name;
}

Player.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
}

Player.prototype.toJSON = function() {
  return { color: this.color, id: this.id, name: this.name, x: this.x, y: this.y };
}

module.exports = Player;

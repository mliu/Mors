'use strict';

// Constant values for time between status change consideration
var statusTimeThreshold = {
  idle: 100,
  roam: 500,
  chase: 500,
}

// Constant values for minimum distance to nearest user to stay in that state
var statusDistanceThreshold = {
  idle: 0,
  roam: 0,
  chase: 350,
}

// Constant values for a propensity towards a status
var statusChangePercent = {
  idle: 0.4,
  roam: 0.4,
  chase: 0.8
}

var Infected = function(id, initX, initY) {
  this.color = '#539328';
  this.id = id;
  this.vx = Math.random()*2 + 2;
  this.vy = Math.random()*2 + 2;
  this.status = "idle";
  this.statusCounter = 0;
  this.x = initX;
  this.y = initY;
}

// Returns the index of the nearest object. Assumes each element in arr has an x and y property
Infected.prototype.findNearest = function(arr) {
  var minDist = Infinity;
  var nearest = null;
  for(var i = arr.length; i--) {
    if(Math.sqrt(arr[i].x * arr[i].x + arr[i].y * arr[i].y) < minDist) {
      nearest = i;
    }
  }
  return i;
}

Infected.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
}

// Called on each game loop. Go through state of current infected. Determine status changes and new coordinates.
Infected.prototype.think = function(users) {
  var target = users[this.findNearest(users)];
  if()
}

Infected.prototype.toJSON = function() {
  return { color: this.color, id: this.id, x: this.x, y: this.y };
}

module.exports = Infected;

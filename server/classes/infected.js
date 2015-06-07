'use strict';

// Constant values for time between status change consideration
var statusTimeThreshold = {
  idle: 2000,
  roam: 5000,
  chase: 5000,
}

// Constant values for maximum distance from nearest player that proportion of propensity towards a status is halved
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
  this.v = Math.round(Math.random()*2) + 2;
  this.direction = Math.round(Math.random() * 360);
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
  return { distance: minDist, index: nearest };
}

Infected.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
}

// Returns all other states than the one passed in
Infected.prototype.getOtherStates = function(state) {
  var states = [];
  var keys = Object.keys(statusTimeThreshold);
  for(var s = keys.length; s--) {
    if(keys[s] != state) {
      states.push(keys[s]);
    }
  }
  return states;
}

// Called on each game loop. Go through state of current infected. Determine status changes and new coordinates.
Infected.prototype.think = function(users) {
  if(users.length) {
    var nearestData = this.findNearest(users);

    // Find nearest player
    var target = users[this.findNearest(users)];

    // If the amount of thought processes stayed in this status is above the threshold, determine if this infected changes state.
    if(this.statusCounter > this.statusTimeThreshold[this.status]) {
      var possibleStates = this.getOtherStates(this.status);
    }
  }

  this.statusCounter++;
  }
}

Infected.prototype.toJSON = function() {
  return { color: this.color, id: this.id, x: this.x, y: this.y };
}

module.exports = Infected;

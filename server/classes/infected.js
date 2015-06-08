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
  // General descriptive properties
  this.color = '#539328';
  this.id = id;
  this.x = initX;
  this.y = initY;
  this.v = Math.round(Math.random()*2) + 2;

  // Radian value of direction this infected is facing
  this.direction = 0;

  // Current state of this infected
  this.status = "chase";

  // Counter, incremented every gameloop this infected is in the same status
  this.statusCounter = 0;

  // The current target this infected is following
  this.target = null;
}

Infected.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
}

// Returns the index of the nearest object in arr. Assumes each element in arr has an x and y property
Infected.prototype.getNearest = function(arr) {
  var minDist = Infinity;
  var dist = Infinity;
  var nearest = null;
  for(var i = arr.length; i--;) {
    dist = Math.sqrt(arr[i].x * arr[i].x + arr[i].y * arr[i].y);
    if(dist < minDist) {
      nearest = i;
      minDist = dist;
    }
  }
  return [{ distance: minDist, object: arr[nearest] }];
}

// Like getNearest but with an array of 5 closest objects in arr
Infected.prototype.getNearestFive = function(arr) {
  var nearest = [];
  var dist = Infinity;
  for(var i = arr.length; i--;) {
    dist = Math.sqrt((arr[i].x - this.x) * (arr[i].x - this.x) + (arr[i].y - this.y) * (arr[i].y - this.y));
    // Add it to nearest and continue loop if nearest isn't full
    if(nearest.length < 5) {
      nearest.push({ distance: dist, object: arr[i] });
    } else {
      var index = null;
      for(var n = nearest.length; n--;) {
        if(nearest[n].distance < dist) {
          // If the distance is greater than the last element (index is not assigned) we can terminate the loop
          if(index === null) {
            break;
          }
          nearest[index] = { distance: dist, object: arr[i] };
        }
        index = n;
      }
    }
    // Sort the nearest array based on distance at the end of each iteration
    nearest.sort(function(a,b) {
      return b.distance - a.distance;
    });
  }
  return nearest;
}


// Returns all other states than the one passed in
Infected.prototype.getOtherStates = function(state) {
  var states = [];
  var keys = Object.keys(statusTimeThreshold);
  for(var s = keys.length; s--;) {
    if(keys[s] != state) {
      states.push(keys[s]);
    }
  }
  return states;
}

// Called on each game loop. Go through state of current infected. Determine status changes and new coordinates.
Infected.prototype.think = function(users) {
  if(users.length) {
    var statusChanged = false;
    // If the amount of thought processes stayed in this status is above the threshold, determine if this infected changes state.
    if(this.statusCounter > statusTimeThreshold[this.status]) {
      var possibleStates = this.getOtherStates(this.status);

      // TODO: Pick a state
      this.status = "chase";
      statusChanged = true;

      if(statusChanged) {
        this.statusCounter = 0; 
      }
    }

    // Call the status method
    this[this.status + "Think"](users);
    this.statusCounter++;
  }
}

// Think method for chase
Infected.prototype.chaseThink = function(users) {
  if(this.statusCounter == 0) {
    // If this is the first frame in chase, choose a target randomly from the nearest 5 to chase
    var targets = this.getNearestFive(users);
    this.target = targets[Math.round(Math.random() * (targets.length-1))].object;
  }

  // Set direction straight to target
  this.direction = Math.atan2(this.target.y - this.y, this.target.x - this.x);
  this.x += this.v * Math.cos(this.direction);
  this.y += this.v * Math.sin(this.direction);
}

Infected.prototype.toJSON = function() {
  return { color: this.color, id: this.id, x: this.x, y: this.y };
}

module.exports = Infected;

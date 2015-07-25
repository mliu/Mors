'use strict';
var Util = require('./classes/util.js');

var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;

var Actor = function(map) {
  this.map = map;
}

// Returns the (x, y) coordinates of the center of this object given it has properties x, y, width, and height
Actor.prototype.calculateCenterCoordinates = function() {
  return { 
    x: this.x + this.width / 2,
    y: this.y + this.height / 2
  };
}

// Returns the (j, i) position of this object in the map matrix assuming it has x and y properties
Actor.prototype.calculateGridCoordinates = function() {
  return {
    i: Math.floor((this.y + (this.height / 2)) / BLOCK_HEIGHT),
    j: Math.floor((this.x + (this.width / 2)) / BLOCK_WIDTH)
  };
}

// Returns true if this object has a x-axis collision with a block at coordinates (blockI, blockJ)
Actor.prototype.checkXCollision = function(blockI, blockJ) {
  if ((blockJ * BLOCK_WIDTH < this.x + this.width && blockJ * BLOCK_WIDTH + BLOCK_WIDTH > this.x + this.width) ||
      (blockJ * BLOCK_WIDTH < this.x && blockJ * BLOCK_WIDTH + BLOCK_WIDTH > this.x)) {
    return true;
  }
  return false;
}

// Returns true if this object has a y-axis collision with a block at coordinates (blockI, blockJ)
Actor.prototype.checkYCollision = function(blockI, blockJ) {
  if ((blockI * BLOCK_HEIGHT < this.y + this.height && blockI * BLOCK_HEIGHT + BLOCK_HEIGHT > this.y + this.height) ||
      (blockI * BLOCK_HEIGHT < this.y && blockI * BLOCK_HEIGHT + BLOCK_HEIGHT > this.y)) {
    return true;
  }
  return false;
}

// Looks at this object and any collisions in the map it currently has and update the position accordingly
Actor.prototype.evaluateCollisions = function(map) {
  var coordinates = calculateGridCoordinates();
  var surroundings = getThreeByThree(coordinates, map);
  var block;
  var blockI;
  var blockJ;
  var i;
  var j;

  for (i = 0; i < surroundings.length; i++) {
    for (j = 0; j < surroundings.length; j++) {
      block = surroundings[i][j];

      // If block is not empty space, check for collision
      if (block) {

        // Get the blocks (i, j) relative to the entire map
        blockJ = j + coordinates.j - 1;
        blockI = i + coordinates.i - 1;

        // If there's a collision
        if (checkXCollision(blockI, blockJ)) {

          // Handle x-axis collisions
          if (this.x < blockJ * BLOCK_WIDTH + BLOCK_WIDTH) {
            this.x += blockJ * BLOCK_WIDTH + BLOCK_WIDTH - this.x;
          } else if (this.x + this.width > blockJ * BLOCK_WIDTH) {
            this.x += blockJ * BLOCK_WIDTH - (this.x + this.width);
          }
        }

        if (checkYCollision(blockI, blockJ)) {

          // Handle y-axis collisions
          if (this.y < blockI * BLOCK_HEIGHT + BLOCK_HEIGHT) {
            this.y += blockI * BLOCK_HEIGHT + BLOCK_HEIGHT - this.y;
          } else if (this.y + this.height > blockI * BLOCK_HEIGHT) {
            this.y += blockI * BLOCK_HEIGHT - this.y - this.height;
          }
        }

      }
    }
  }
}

// Returns a 3x3 matrix of the block types in the map around obj (assuming it has properties i and j).
Actor.prototype.getThreeByThree = function(obj, map) {
  var res = [];
  var n;

  for (n = -1; n < 2; n++) {
    res.push(map[obj.i + n].slice(obj.j - 1, obj.j + 2));
  }

  for(var i = 0; i < 3; i++) {
    console.log(JSON.stringify(res[i]));
  }
  console.log("======================" + JSON.stringify(obj))
  return res;
}

module.exports = Actor;

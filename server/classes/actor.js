"use strict";
var Util = require("./util.js");

var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;

var Actor = function() {

};

// Returns the (x, y) coordinates of the center of this object given it has properties x, y, width, and height
Actor.prototype.calculateCenterCoordinates = function() {
  return {
    x: this.x + this.width / 2,
    y: this.y + this.height / 2
  };
};

// Returns the (j, i) position of this object in the map matrix assuming it has x and y properties
Actor.prototype.calculateGridCoordinates = function() {
  return {
    i: Math.floor((this.x + (this.width / 2)) / BLOCK_WIDTH),
    j: Math.floor((this.y + (this.height / 2)) / BLOCK_HEIGHT)
  };
};

// Returns true if this object has a x-axis collision with a block at coordinates (blockI, blockJ)
Actor.prototype.checkXCollision = function(blockI, blockJ) {
  if ((blockJ * BLOCK_WIDTH < this.x + this.width && blockJ * BLOCK_WIDTH + BLOCK_WIDTH > this.x + this.width) ||
      (blockJ * BLOCK_WIDTH < this.x && blockJ * BLOCK_WIDTH + BLOCK_WIDTH > this.x)) {
    return true;
  }

  return false;
};

// Returns true if this object has a y-axis collision with a block at coordinates (blockI, blockJ)
Actor.prototype.checkYCollision = function(blockI, blockJ) {
  if ((blockI * BLOCK_HEIGHT < this.y + this.height && blockI * BLOCK_HEIGHT + BLOCK_HEIGHT > this.y + this.height) ||
      (blockI * BLOCK_HEIGHT < this.y && blockI * BLOCK_HEIGHT + BLOCK_HEIGHT > this.y)) {
    return true;
  }

  return false;
};

// Looks at this object and any collisions in the map it currently has and update the position accordingly
Actor.prototype.evaluateCollisions = function() {
  var coordinates = this.calculateGridCoordinates();
  var surroundings = this.getThreeByThree(coordinates);
  var block;
  var blockI;
  var blockJ;
  var i;
  var j;

  for (j = 0; j < surroundings.length; j++) {
    for (i = 0; i < surroundings.length; i++) {
      block = surroundings[j][i];

      // If block is not empty space, check for collision
      if (block) {

        // Get the blocks (i, j) relative to the entire map
        blockJ = j + coordinates.j - 1;
        blockI = i + coordinates.i - 1;

        // // If there's a collision
        // if (checkXCollision(blockI, blockJ)) {

        //   // Handle x-axis collisions
        //   if (this.x < blockJ * BLOCK_WIDTH + BLOCK_WIDTH) {
        //     this.x += blockJ * BLOCK_WIDTH + BLOCK_WIDTH - this.x;
        //   } else if (this.x + this.width > blockJ * BLOCK_WIDTH) {
        //     this.x += blockJ * BLOCK_WIDTH - (this.x + this.width);
        //   }
        // }

        // if (checkYCollision(blockI, blockJ)) {

        //   // Handle y-axis collisions
        //   if (this.y < blockI * BLOCK_HEIGHT + BLOCK_HEIGHT) {
        //     this.y += blockI * BLOCK_HEIGHT + BLOCK_HEIGHT - this.y;
        //   } else if (this.y + this.height > blockI * BLOCK_HEIGHT) {
        //     this.y += blockI * BLOCK_HEIGHT - this.y - this.height;
        //   }
        // }

        if (this.checkXCollision(blockI, blockJ) && this.checkYCollision(blockI, blockJ)) {

        }

      }
    }
  }
};

Actor.prototype.getCoordinates = function() {
  return { x: this.x, y: this.y };
};

// Returns a 3x3 matrix of the block types in the map around obj (assuming it has properties i and j).
Actor.prototype.getThreeByThree = function(obj) {
  var i = obj.i;
  var j = obj.j;
  var res = [];
  var arr;
  var n;

  for (n = -1; n < 2; n++) {
    // Check for overflow
    if (j + n < 0 || j + n >= this.map.length) {
      res.push([1, 1, 1]);
    } else if (i - 1 < 0 || i + 1 >= this.map[0].length) {
      // Automatically generate walls wherever the overflow occurs
      arr = [];
      arr.push((i - 1 < 0 || i - 1 >= this.map[0].length) ? 1 : this.map[j + n][i - 1]);
      arr.push((i < 0 || i >= this.map[0].length) ? 1 : this.map[j + n][i]);
      arr.push((i + 1 < 0 || i + 1 >= this.map[0].length) ? 1 : this.map[j + n][i + 1]);
      res.push(arr);
    } else {
      res.push(this.map[j + n].slice(i - 1, i + 2));
    }
    console.log(JSON.stringify(res[n + 1]));
  }

  console.log("======================" + JSON.stringify(obj));

  return res;
};

Actor.prototype.move = function() {
  this.x += this.v.x;
  this.y += this.v.y;
  this.evaluateCollisions();
};

module.exports = Actor;
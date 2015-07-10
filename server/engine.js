'use strict';
var Util = require('./classes/util.js');

var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;

var engine = {};

engine.evaluateCollisions = evaluateCollisions;

// Returns the (x, y) coordinates of the center of this object given it has properties x, y, WIDTH, and HEIGHT
function calculateCenterCoordinates(obj) {
  return { 
    x: obj.x + obj.WIDTH / 2,
    y: obj.y + obj.HEIGHT / 2
  };
}

// Returns the (j, i) position of obj in the map matrix assuming obj has x and y properties
function calculateGridCoordinates(obj) {
  return {
    i: Math.floor((obj.y + (obj.height / 2)) / BLOCK_HEIGHT),
    j: Math.floor((obj.x + (obj.width / 2)) / BLOCK_WIDTH)
  };
}

// Returns true if obj has a x-axis collision with a block at coordinates (blockI, blockJ)
function checkXCollision(obj, blockI, blockJ) {
  if ((blockJ * BLOCK_WIDTH < obj.x + obj.width && blockJ * BLOCK_WIDTH + BLOCK_WIDTH > obj.x + obj.width) ||
      (blockJ * BLOCK_WIDTH < obj.x && blockJ * BLOCK_WIDTH + BLOCK_WIDTH > obj.x)) {
    return true;
  }
  return false;
}

// Returns true if obj has a y-axis collision with a block at coordinates (blockI, blockJ)
function checkYCollision(obj, blockI, blockJ) {
  if ((blockI * BLOCK_HEIGHT < obj.y + obj.height && blockI * BLOCK_HEIGHT + BLOCK_HEIGHT > obj.y + obj.height) ||
      (blockI * BLOCK_HEIGHT < obj.y && blockI * BLOCK_HEIGHT + BLOCK_HEIGHT > obj.y)) {
    return true;
  }
  return false;
}

// Looks at obj and any collisions in the map it currently has and update the position accordingly
function evaluateCollisions(obj, map) {
  var coordinates = calculateGridCoordinates(obj);
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
        if (checkXCollision(obj, blockI, blockJ)) {

          // Handle x-axis collisions
          if (obj.x < blockJ * BLOCK_WIDTH + BLOCK_WIDTH) {
            obj.x += blockJ * BLOCK_WIDTH + BLOCK_WIDTH - obj.x;
          } else if (obj.x + obj.width > blockJ * BLOCK_WIDTH) {
            obj.x += blockJ * BLOCK_WIDTH - (obj.x + obj.width);
          }
        }

        if (checkYCollision(obj, blockI, blockJ)) {

          // Handle y-axis collisions
          if (obj.y < blockI * BLOCK_HEIGHT + BLOCK_HEIGHT) {
            obj.y += blockI * BLOCK_HEIGHT + BLOCK_HEIGHT - obj.y;
          } else if (obj.y + obj.height > blockI * BLOCK_HEIGHT) {
            obj.y += blockI * BLOCK_HEIGHT - obj.y - obj.height;
          }
        }

      }
    }
  }
}

// Returns a 3x3 matrix of the block types in the map around obj (assuming it has properties i and j).
function getThreeByThree(obj, map) {
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

module.exports = engine;

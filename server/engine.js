'use strict';

var engine = {};

engine.users = [];

engine.addPlayer = addPlayer;
engine.removePlayer = removePlayer;

// Adds a player if it doesn't already exist in the userbase
function addPlayer(player) {
  if(findIndex(engine.users, player.id) === -1) {
    engine.users.push(player);
  }
  setupInitialPlayerLocation(player);
}

// Removes a player from the userbase
function removePlayer(index) {
  return removeIndex(engine.users, index);
}

// Find and return the location of object with property id in arr
function findIndex(arr, id) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i].id == id)
      return i;
  }
  return -1;
}

// Remove and return the object with property id in arr
function removeIndex(arr, id) {
  var index = findIndex(arr, id);
  if(index != -1) {
    return arr.splice(findIndex(arr, id), 1);
  }
  return -1;
}

function setupInitialPlayerLocation(player) {
  player.x = 100;
  player.y = 100;
}

module.exports = engine;

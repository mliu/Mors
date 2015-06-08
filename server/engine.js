'use strict';

var engine = {};

engine.users = [];
engine.infected = [];

engine.addPlayer = addPlayer;
engine.gameLoop = gameLoop;
engine.getGameData = getGameData;
engine.handlePlayerMovement = handlePlayerMovement;
engine.removePlayer = removePlayer;

// Adds a player if it doesn't already exist in the userbase
function addPlayer(player) {
  if(findIndex(engine.users, player.id) === -1) {
    engine.users.push(player);
  }
  setupInitialPlayerLocation(player);
}

// Update all game models controlled by the engine
function gameLoop() {
  for(var i = engine.infected.length; i--;) {
    engine.infected[i].think(engine.users);
  }
}

function generateInfected() {

}

// Calls toJSON() on all elements in arr and returns the array
function getJSONArray(arr) {
  var res = [];
  for(var i = arr.length; i--;) {
    res.push(arr[i].toJSON());
  }
  return res;
}

// Returns JSON of all game models
function getGameData() {
  return {
    users: getJSONArray(engine.users)
  }
}

// Called every time a player input is received.
function handlePlayerMovement(currentPlayer, playerData) {
  // X-axis movement
  if(playerData.input.left) {
    currentPlayer.x -= currentPlayer.v;
  } else if(playerData.input.right) {
    currentPlayer.x += currentPlayer.v;
  }
  // Y-axis movement
  if(playerData.input.up) {
    currentPlayer.y -= currentPlayer.v;
  } else if(playerData.input.down) {
    currentPlayer.y += currentPlayer.v;
  }
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

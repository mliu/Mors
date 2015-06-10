'use strict';
var Infected = require('./classes/infected.js');
var Util = require('./classes/util.js');

var engine = {};
var INFECTED_PER_USER = 1;
var BASE_INFECTED = 0;

engine.infected = [];
engine.looping = false;
engine.users = [];

engine.addPlayer = addPlayer;
engine.gameLoop = gameLoop;
engine.getGameData = getGameData;
engine.handlePlayerMovement = handlePlayerMovement;
engine.removePlayer = removePlayer;
engine.setup = setup;

// Adds a player if it doesn't already exist in the userbase
function addPlayer(player) {
  if(findIndex(engine.users, player.id) === -1) {
    engine.users.push(player);
  }
  setupInitialPlayerLocation(player);

  // Create infected for the user
  for(var i=0; i<INFECTED_PER_USER; i++) {
    engine.infected.push(generateInfected(engine.infected.length + i));
  }
}

// Find and return the location of object with property id in arr
function findIndex(arr, id) {
  for(var i=0; i<arr.length; i++) {
    if(arr[i].id === id)
      return i;
  }
  return -1;
}

// Update all game models controlled by the engine
function gameLoop() {
  if(engine.looping) {
    return;
  }
  engine.looping = true;
  for(var i = engine.infected.length; i--;) {
    engine.infected[i].think(engine.users);
  }
  engine.looping = false;
}

// TODO Actually detect where's a good place to drop an infected
function generateInfected(id) {
  var infected = new Infected(id, Util.randomInt(0, 500), Util.randomInt(0, 500));
  return infected;
}

// Returns JSON of all game models
function getGameData() {
  return {
    users: getJSONArray(engine.users),
    infected: getJSONArray(engine.infected)
  }
}

// Calls toJSON() on all elements in arr and returns the array
function getJSONArray(arr) {
  var res = [];
  for(var i = arr.length; i--;) {
    res.push(arr[i].toJSON());
  }
  return res;
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

// Remove and return the object with property id in arr
function removeIndex(arr, id) {
  var index = findIndex(arr, id);
  if(index != -1) {
    return arr.splice(findIndex(arr, id), 1)[0];
  }
  return -1;
}

// Removes a player from the userbase
function removePlayer(index) {
  // Purge the player from any infected following them
  for(var i = engine.infected.length; i--;) {
    if(engine.infected[i].target && engine.infected[i].target.id === index) {
      engine.infected[i].target = null;
    }
  }
  return removeIndex(engine.users, index);
}

// Called on server start, generates initial batch of zombies
function setup() {
  for(var i = 0; i<BASE_INFECTED; i++) {
    engine.infected.push(generateInfected(i));
  }
}

function setupInitialPlayerLocation(player) {
  // TODO Actually detect where's a good place to drop a player
  player.x = Util.randomInt(0, 500);
  player.y = Util.randomInt(0, 500);
}

module.exports = engine;

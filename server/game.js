"use strict";
global.document = {
  createElement: function () {
    // Canvas
    return {
      getContext: function () {
        return {};
      }
    };
  }
};
global.window = {};
var Infected = require("./classes/infected.js");
var Matter = require("matter-js");
var Player = require("./classes/player.js");
var Util = require("./classes/util.js");
var config = require("./config.json");

// Physics
var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;

var options = {
  render: {
    element: null,
    controller: {
      create: function () {},
      clear: function () {},
      world: function () {}
    }
  },
  input: {
    mouse: {}
  }
};
var engine = Engine.create(options);
Engine.run(engine);

// Load maps
var sandbox = require("./maps/sandbox.js");

// Load vars
var game = {};
game.infected = [];
game.looping = false;
game.users = [];

game.addPlayer = addPlayer;
game.gameLoop = gameLoop;
game.getGameData = getGameData;
game.updatePlayerMovement = updatePlayerMovement;
game.removePlayer = removePlayer;
game.setup = setup;

var INFECTED_PER_USER = config.INFECTED_PER_USER;
var BASE_INFECTED = config.BASE_INFECTED;

// Reference object to be passed to players
var gameReference = {
  engine,
  map: sandbox,
};

// Adds a player if it doesn't already exist in the userbase
function addPlayer(userID, playerData) {
  var coords;
  var i;
  var player;

  if (findIndex(game.users, userID) === -1) {
    coords = getInitialPlayerLocation();
    player = new Player(userID, gameReference, coords.x, coords.y, playerData);
    game.users.push(player);
  }

  // Create infected for the user
  for (i = 0; i < INFECTED_PER_USER; i++) {
    game.infected.push(generateInfected(game.infected.length + i));
  }

  return player;
}

// Find and return the location of object with property id in arr
function findIndex(arr, id) {
  var i;

  for (i = 0; i < arr.length; i++) {
    if (arr[i].id === id)
      return i;
  }

  return -1;
}

// Update all game models controlled by the game
function gameLoop() {
  var i;
  var u;

  if (game.looping) {
    return;
  }

  game.looping = true;
  for (u = game.users.length; u--;) {

    // Handle movement and evaluate collisions
    game.users[u].handleMovement(getGameMap());
  }

  for (i = game.infected.length; i--;) {
    game.infected[i].think(game.users, getGameMap());
  }

  game.looping = false;
}

// TODO Actually detect where's a good place to drop an infected
function generateInfected(id) {
  var infected = new Infected(id, getGameMap(), Util.randomInt(0, 500), Util.randomInt(0, 500));
  return infected;
}

// Returns JSON of all game models
function getGameData() {
  return {
    users: getJSONArray(game.users),
    infected: getJSONArray(game.infected)
  }
}

function getInitialPlayerLocation() {
  // TODO Actually detect where's a good place to drop a player
  return {
    x: Util.randomInt(30, (sandbox[0].length - 2) * 30),
    y: Util.randomInt(30, (sandbox.length - 2) * 30)
  };
}

// Calls toJSON() on all elements in arr and returns the array
function getJSONArray(arr) {
  var res = [];
  var i;

  for (i = arr.length; i--;) {
    res.push(arr[i].toJSON());
  }

  return res;
}

// Called every time a player input is received.
function updatePlayerMovement(currentPlayer, playerData) {
  var index = findIndex(game.users, currentPlayer.id);

  if (index !== -1) {
    game.users[index].updateMovementInput(playerData);
  }
}

// Remove and return the object with property id in arr
function removeIndex(arr, id) {
  var index = findIndex(arr, id);

  if (index !== -1) {
    return arr.splice(findIndex(arr, id), 1)[0];
  }

  return -1;
}

// Removes a player from the userbase
function removePlayer(index) {
  var i;

  // Purge the player from any infected following them
  for (i = game.infected.length; i--;) {
    if (game.infected[i].target && game.infected[i].target.id === index) {
      game.infected[i].target = null;
    }
  }

  return removeIndex(game.users, index);
}

// Called on server start, generates initial batch of zombies
function setup() {
  var i;

  for (i = 0; i < BASE_INFECTED; i++) {
    game.infected.push(generateInfected(i));
  }
}

module.exports = game;

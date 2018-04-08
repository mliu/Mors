"use strict";
var Infected = require("./classes/infected.js");
var MapBuilder = require("./maps/mapBuilder.js");
var Matter = require("matter-js");
var Player = require("./classes/player.js");
var Util = require("./classes/util.js");
var config = require("./config.json");

var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;

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
engine.world.gravity.y = 0;
// Load maps
var sandbox = require("./maps/sandbox.js");

// Load vars
var game = {};
game.engine = engine;
game.infected = [];
game.lastTick = new Date().getTime();
game.looping = false;
game.map = sandbox;
game.newIDCounter = 0;
game.users = [];
game.projectiles = [];

game.addPlayer = addPlayer;
game.gameLoop = gameLoop;
game.getGameData = getGameData;
game.getNewID = getNewID;
game.updatePlayer = updatePlayer;
game.removePlayer = removePlayer;
game.setup = setup;

var INFECTED_PER_USER = config.INFECTED_PER_USER;
var BASE_INFECTED = config.BASE_INFECTED;

// Adds a player if it doesn't already exist in the userbase
function addPlayer(userID, playerData) {
  var coords;
  var i;
  var player;

  if (findIndex(game.users, userID) === -1) {
    coords = getInitialPlayerLocation();
    player = new Player(userID, game, coords.x, coords.y, playerData);
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
  var newTick = new Date().getTime();
  Engine.update(engine, newTick - game.lastTick);
  game.lastTick = newTick;

  // for (u = game.users.length; u--;) {
  //   // Handle movement and evaluate collisions
  //   game.users[u].handleMovement();
  // }
  //
  // for (i = game.infected.length; i--;) {
  //   game.infected[i].think(game.users, null);
  // }

  game.looping = false;
}

// TODO Actually detect where's a good place to drop an infected
function generateInfected(id) {
  var infected = new Infected(id, null, Util.randomInt(0, 500), Util.randomInt(0, 500));
  return infected;
}

// Returns JSON of all game models
function getGameData() {
  return {
    users: getJSONArray(game.users),
    infected: getJSONArray(game.infected),
    projectiles: getJSONArray(game.projectiles),
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

function getNewID() {
  return game.newIDCounter++;
}

// Called every time a player input is received.
function updatePlayer(currentPlayer, playerData) {
  var index = findIndex(game.users, currentPlayer.id);

  if (index !== -1) {
    game.users[index].handleInput(playerData);
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

  MapBuilder.build(game);
}

module.exports = game;

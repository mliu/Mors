"use strict";
var Actor = require("./actor.js");
var Matter = require("matter-js");
var Util = require("./util.js");
var Victor = require("victor");

var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;

var Player = function (id, game, initX, initY, playerData) {
  // General descriptive properties
  this.id = id;
  this.color = '#000';
  this.height = 30;
  this.width = 30;
  this.name = playerData.name;
  this.baseVelocity = 5;
  this.v = new Victor(0, 0);
  this.x = initX;
  this.y = initY;
  this.map = game.map;
  this.engine = game.engine;

  // Player input, used for movement
  this.input = {};

  // Setup physics
  this.body = Bodies.rectangle(this.x, this.y, this.width, this.height, {
    friction: 1,
    intertia: Infinity,
    isStatic: true,
  });
  World.add(this.engine.world, [this.body]);
};
Player.prototype = Object.create(Actor.prototype);

// Called by the engine every game loop. Updates player position accordingly
Player.prototype.handleMovement = function () {
  var direction = new Victor(this.input.right - this.input.left, this.input.down - this.input.up);

  if (direction.magnitude()) {
    this.v.x = this.baseVelocity * Math.cos(direction.angle());
    this.v.y = this.baseVelocity * Math.sin(direction.angle());

    Body.setVelocity(this.body, this.v);
    console.log(this.body.velocity);
  }
};

Player.prototype.toJSON = function () {
  return {
    color: this.color,
    id: this.id,
    name: this.name,
    x: this.body.position.x,
    y: this.body.position.y
  };
};

Player.prototype.updateMovementInput = function (playerData) {
  this.input = playerData.input;
  var direction = new Victor(this.input.right - this.input.left, this.input.down - this.input.up);

  if (direction.magnitude()) {
    this.v.x = this.baseVelocity * Math.cos(direction.angle());
    this.v.y = this.baseVelocity * Math.sin(direction.angle());
  } else {
    this.v = {
      x: 0,
      y: 0
    };
  }

  Body.setVelocity(this.body, this.v);
  console.log(this.body.velocity);
};

module.exports = Player;

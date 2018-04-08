"use strict";
var Actor = require("./actor.js");
var Bullet = require("./bullet.js");
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
  this.game = game;

  // Player input, used for movement
  this.input = {};

  // Setup physics
  this.body = Bodies.rectangle(initX, initY, this.width, this.height, {
    friction: 0,
    intertia: Infinity,
    restitution: 0,
  });
  World.add(this.game.engine.world, [this.body]);
};
Player.prototype = Object.create(Actor.prototype);

Player.prototype.handleInput = function (playerData) {
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

  if (this.input.clickEvent) {
    new Bullet(this.id, this.game.getNewID(), this.game, this.calculateCenterCoordinates().x, this.calculateCenterCoordinates().y, this.input.clickEvent);
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

module.exports = Player;

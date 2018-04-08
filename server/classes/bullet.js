"use strict";
var Actor = require("./actor.js");
var Matter = require("matter-js");
var Util = require("./util.js");
var Victor = require("victor");

var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;
var Body = Matter.Body;

var Bullet = function (playerId, id, game, initX, initY, info) {
  // General descriptive properties
  this.playerId = playerId;
  this.id = id;
  this.baseVelocity = 5;
  this.width = 1;
  this.height = 1;
  this.game = game;
  this.v = {};

  // Setup physics
  this.body = Bodies.rectangle(initX, initY, this.width, this.height, {
    frictionAir: 0,
    isSensor: true,
  });
  var direction = new Victor(info.x, info.y);
  this.v.x = this.baseVelocity * Math.cos(direction.angle());
  this.v.y = this.baseVelocity * Math.sin(direction.angle());
  Body.setVelocity(this.body, this.v);
  World.add(this.game.engine.world, [this.body]);
  this.game.projectiles.push(this);
};

Bullet.prototype.toJSON = function () {
  return {
    id: this.id,
    x: this.body.position.x,
    y: this.body.position.y
  };
};

module.exports = Bullet;

"use strict";
var Matter = require("matter-js");
var config = require("../config.json");

var Engine = Matter.Engine;
var World = Matter.World;
var Bodies = Matter.Bodies;

var mapBuilder = {};

mapBuilder.build = build;

function build(game) {
  for (var j = 0; j < game.map.length; j++) {
    for (var i = 0; i < game.map[0].length; i++) {
      switch (game.map[j][i]) {
      case 1:
        var body = Bodies.rectangle(
          i * config.BLOCK_WIDTH,
          j * config.BLOCK_HEIGHT,
          config.BLOCK_WIDTH,
          config.BLOCK_HEIGHT, {
            chamfer: 1,
            isStatic: true,
          });
        World.add(game.engine.world, [body]);
        break;
      }
    }
  }
}

module.exports = mapBuilder;

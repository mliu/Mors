'use strict';

var stage = null;

// Game objects
var player = null;

// Metrics
var fps = null;

function init() {
  // Create stage
  stage = new createjs.Stage("canvas");

  // Set stage canvas width/height
  stage.canvas.width = document.body.clientWidth;
  stage.canvas.height = window.innerHeight;

  //
  // Create player and add it to the stage
  player = new Player("Test", "#000", 100, 100);
  stage.addChild(player.shapeInstance);

  //Initialize ticker
  createjs.Ticker.addEventListener("tick", tick);
}

function tick(event) {
  fps = createjs.Ticker.getMeasuredFPS();
  stage.update();
}

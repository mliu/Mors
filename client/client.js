'use strict';

var socket;

// Game objects
var stage;
var player;

// Metrics
var dashboard;

// Initialization function
function init() {
  // Initialize socket connection
  socket = io();
  setupSocket();

  // Create stage
  stage = new createjs.Stage("canvas");

  // Set stage canvas width/height
  stage.canvas.width = document.body.clientWidth;
  stage.canvas.height = window.innerHeight;

  // Create player and add it to the stage
  player = new Player();

  // Initialize dashboard
  dashboard = new Dashboard(player, socket);
  stage.addChild(dashboard.metricsContainer);
  dashboard.displayWelcomeScreen();

  //Initialize ticker
  createjs.Ticker.setFPS(60);
  createjs.Ticker.useRAF = true;
  createjs.Ticker.addEventListener("tick", tick);
}

function setupSocket() {
  // Setup success
  socket.on('setupSuccess', function(playerSettings) {
    player.setup(playerSettings);

    // Add player to stage
    stage.addChild(player.shapeInstance);
    
    dashboard.hideWelcomeScreen();
  });
}

// Gameticker function
function tick(event) {
  // Update dashboard fpsCounter
  dashboard.fpsCounter.text = "FPS: " + Math.round(createjs.Ticker.getMeasuredFPS());

  stage.update();
}

// Watch for window resize
window.onresize = function() {
  // Reset stage canvas width/height
  stage.canvas.width = document.body.clientWidth;
  stage.canvas.height = window.innerHeight;

  // Reset dashboard
  dashboard.positionSelf();
}

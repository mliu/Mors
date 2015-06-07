(function() {
  'use strict';

  var socket;

  // Game objects
  var stage;
  var player;

  // Metrics
  var dashboard;

  // Helper variables
  var initialized = false;

  // Initialization function
  function init() {
    if(initialized) {
      return;
    }

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
    dashboard = new Dashboard(stage);
    stage.addChild(dashboard.metricsContainer);
    dashboard.displayWelcomeScreen(player, setupPlayer);

    //Initialize ticker
    createjs.Ticker.setFPS(60);
    createjs.Ticker.useRAF = true;
    createjs.Ticker.addEventListener("tick", tick);

    initialized = true;
  }
  window.init = init;

  // Callback for when the user enters their info on the welcome screen
  function setupPlayer(data) {
    socket.emit('setup', data);
  }

  // Set up socket events
  function setupSocket() {
    // On player movement
    socket.on('playerMove', function(movementData) {
      player.handleMovement(movementData);
    });

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

    // Send back player input
    socket.emit('0', player.toJSON());

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
})();

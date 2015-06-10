(function() {
  'use strict';

  var socket;

  // Game objects
  var infectedModels = {}; // Stores all Infected
  var stage; // HTML5 canvas, renders everything
  var container; // Holds all models that move. Acts as a camera that follows the player around and updates all surroundings in context
  var mapper;
  var player; // Current player
  var userModels = {}; // Holds all other user models

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

    // Create container to house all game models
    container = new createjs.Container();
    stage.addChild(container);

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

  // Updates all infected in the canvas
  function renderInfected(infected) {
    for(var i = infected.length; i--;) {
      var model = infectedModels[infected[i].id];

      // If the infected model already exists
      if(model != null) {
        model.handleMovement(infected[i]);
      } else {

        // Create the infected model if it doesn't exist and add it to the container
        infectedModels[infected[i].id] = new Infected(infected[i].color, infected[i].id, infected[i].x, infected[i].y);
        container.addChild(infectedModels[infected[i].id].shapeInstance);
      }
    }
  }

  // Updates all users in the canvas
  function renderUsers(users) {
    for(var u = users.length; u--;) {

      // Only render if it's another player
      if(users[u].id != player.id) {
        var human = userModels[users[u].id];

        // If the human model already exists
        if(human != null) {
          human.handleMovement(users[u]);
        } else {

          // Create the human model if it doesn't exist and add it to the container
          userModels[users[u].id] = new Human(users[u].color, users[u].id, users[u].name, users[u].x, users[u].y);
          container.addChild(userModels[users[u].id].shapeInstance);
        }
      }
    }
  }

  // Callback for when the user enters their info on the welcome screen
  function setupPlayer(data) {
    socket.emit('setup', data);
  }

  // Set up socket events
  function setupSocket() {
    // On game updates
    socket.on('gameUpdate', function(data) {
      renderUsers(data.users);
      renderInfected(data.infected);
    });

    // On player join
    socket.on('playerJoin', function(playerData) {

    });

    // On player leave
    socket.on('playerLeave', function(playerData) {
      if(playerData) {
        container.removeChild(userModels[playerData.id].shapeInstance);
        userModels[playerData.id] = null;
      }
    });

    // On player movement
    socket.on('playerMove', function(movementData) {
      player.handleMovement(movementData);
      // Center the camera around the player
      container.x = -player.shapeInstance.x + stage.canvas.width/2;
      container.y = -player.shapeInstance.y + stage.canvas.height/2;
    });

    // Setup success
    socket.on('setupSuccess', function(playerSettings) {
      player.setup(playerSettings);

      // Add player to the container
      container.addChild(player.shapeInstance);
      
      dashboard.hideWelcomeScreen();
    });

    // Initial message received on connection.
    socket.on('welcome', function(data) {
      // Setup map
      mapper = new Mapper(data.map);
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

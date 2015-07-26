// Server routing setup
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, { pingTimeout: 26000 });

// Config
var config = require('./config.json');

// Game controllers
var game = require('./game.js');

// Classes
var Player = require('./classes/player.js');

game.setup();

app.use(express.static(__dirname + '/../client'));

io.on('connection', function(socket) {
  console.log("User connected with id " + socket.id);


  // Store the userID and currentPlayer within this function scope for reference
  var userID = socket.id;
  var currentPlayer;

  // When player has entered their data
  socket.on('setup', function(playerData) {

    // Add the player to the game
    currentPlayer = game.addPlayer(userID, playerData);

    // Notify users of player joining
    socket.emit('setupSuccess', { map: game.getGameMap(), player: currentPlayer.toJSON() });
    socket.broadcast.emit('playerJoin', currentPlayer.toJSON());
  });

  // On disconnected
  socket.on('disconnect', function() {
    console.log("User disconnected with id " + userID);

    // If the player was added to users, remove it
    var player = game.removePlayer(userID);

    io.emit('playerLeave', player);
    player = null;
  });

  // Fired from each client every game tick
  socket.on('0', function(playerData) {
    if(currentPlayer) {
      // Update the players movement
      game.updatePlayerMovement(currentPlayer, playerData);

      socket.emit('playerMove', currentPlayer.getCoordinates());
      io.emit('gameUpdate', game.getGameData());
    }
  });

  // Send any initial data to client
  socket.emit('welcome');
});

// Update all CPU managed models according to what FPS we run in
setInterval(game.gameLoop, 16);

// Start server
http.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});

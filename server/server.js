// Server routing setup
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

// Config
var config = require('./config.json');

// Game controllers
var engine = require('./engine.js');

// Classes
var Player = require('./classes/player.js');

app.use(express.static(__dirname + '/../client'));

io.on('connection', function(socket) {
  console.log("User connected with id " + socket.id);

  var userID = socket.id;
  var currentPlayer = new Player(userID);

  // When player has entered their data
  socket.on('setup', function(playerData) {
    // Setup current player
    currentPlayer.setup(playerData.name);

    // Add the player to the game
    engine.addPlayer(currentPlayer);

    // Notify users of player joining
    socket.emit('setupSuccess', currentPlayer.toJSON());
    io.emit('playerJoin', { users: engine.users, player: currentPlayer.toJSON() });
  });

  // On disconnected
  socket.on('disconnect', function() {
    console.log("User disconnected with id " + userID);
    // If the player was added to users, remove it
    io.emit('playerLeave', { player: engine.removePlayer(userID) });
  });

  socket.on('0', function(playerData) {
    engine.handlePlayerMovement(currentPlayer, playerData);

    socket.emit('playerMove', currentPlayer);
    socket.broadcast.emit('gameUpdate', engine.getGameData());
  });
});

// Start server
http.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});

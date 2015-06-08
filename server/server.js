// Server routing setup
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http, { pingTimeout: 26000 });

// Config
var config = require('./config.json');

// Game controllers
var engine = require('./engine.js');

// Classes
var Infected = require('./classes/infected.js');
var Player = require('./classes/player.js');

// Helper values
var updatereq = false;

app.use(express.static(__dirname + '/../client'));

io.on('connection', function(socket) {
  console.log("User connected with id " + socket.id);

  // Store the userID and currentPlayer within this function scope for reference
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
    socket.broadcast.emit('playerJoin', { player: currentPlayer.toJSON() });
  });

  // On disconnected
  socket.on('disconnect', function() {
    console.log("User disconnected with id " + userID);
    // If the player was added to users, remove it
    io.emit('playerLeave', { player: engine.removePlayer(userID) });
  });

  socket.on('0', function(playerData) {
    engine.handlePlayerMovement(currentPlayer, playerData);

    socket.emit('playerMove', currentPlayer.getCoordinates());
    socket.broadcast.emit('gameUpdate', engine.getGameData());
  });
});

// Update all CPU managed models according to what FPS we run in
setInterval(engine.gameLoop, 16);

// Start server
http.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});

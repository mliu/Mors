var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var config = require('./config.json');
var engine = require('./engine.js')

app.use(express.static(__dirname + '/../client'));

io.on('connection', function(socket) {
  console.log("User connected with id " + socket.id);

  var userID = socket.id;
  var currentPlayer = {};

  // When player has entered their data
  socket.on('setup', function(playerData) {
    // Setup current player
    currentPlayer = playerData;
    currentPlayer.id = userID;

    // Add the player to the game
    engine.addPlayer(currentPlayer);

    // Notify users of player joining
    socket.emit('setupSuccess', currentPlayer);
    io.emit('playerJoin', { users: engine.users, player: currentPlayer });
  });

  // On disconnected
  socket.on('disconnect', function() {
    console.log("User disconnected with id " + userID);
    // If the player was added to users, remove it
    io.emit('playerLeave', { player: engine.removePlayer(userID) });
  })
});

// Start server
http.listen(config.port, function() {
  console.log('listening on *:' + config.port);
});

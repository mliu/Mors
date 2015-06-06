var express = require('express');
var app = express();
var http = require('http').Server(app);
var config = require('./config.json');

app.use(express.static(__dirname + '/../client'));

http.listen( config.port, function() {
  console.log('listening on *:' + config.port);
});

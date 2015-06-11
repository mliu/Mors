'use strict';
var sandbox = require('../maps/sandbox.js');
var Util = require('./util.js');

var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;

var Mapper = function() {
  this.map = null;
}

Mapper.prototype.mapToJSON = function() {
  return this.map;
}

// Called to switch the map this mapper uses 
Mapper.prototype.use = function(mapId) {
  switch(mapId) {
    case 0:
      this.map = sandbox;
      break;
  }
}

module.exports = Mapper;

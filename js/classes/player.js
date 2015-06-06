(function() {
  'use strict';

  var PLAYER_WIDTH = 30;
  var PLAYER_HEIGHT = 30;

  var Player = function(name, color, initX, initY) {
    this.name = name;
    // Initialize shape
    this.shapeInstance = new createjs.Shape();
    this.shapeInstance.graphics.beginFill(color).drawRect(initX, initY, PLAYER_WIDTH, PLAYER_HEIGHT);
  }

  window.Player = Player;
})();

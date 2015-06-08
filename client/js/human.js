(function() {
  'use strict';

  var PLAYER_WIDTH = 30;
  var PLAYER_HEIGHT = 30;

  var Human = function(color, id, name, x, y) {
    this.color = color;
    this.id = id;
    this.name = name;

    // Initialize shape
    this.shapeInstance = new createjs.Shape();
    this.shapeInstance.graphics.beginFill(this.color).drawRect(0, 0, PLAYER_WIDTH, PLAYER_HEIGHT);
    this.shapeInstance.x = x;
    this.shapeInstance.y = y;
  }

  Human.prototype.handleMovement = function(movementData) {
    this.shapeInstance.x = movementData.x;
    this.shapeInstance.y = movementData.y;
  };

  window.Human = Human;
})();

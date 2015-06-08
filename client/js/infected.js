(function() {
  'use strict';

  var WIDTH = 30;
  var HEIGHT = 30;

  var Infected = function(color, id, name, x, y) {
    this.color = color;
    this.id = id;
    this.name = name;

    // Initialize shape
    this.shapeInstance = new createjs.Shape();
    this.shapeInstance.graphics.beginFill(this.color).drawRect(0, 0, WIDTH, HEIGHT);
    this.shapeInstance.x = x;
    this.shapeInstance.y = y;
  }

  Infected.prototype.handleMovement = function(movementData) {
    this.shapeInstance.x = movementData.x;
    this.shapeInstance.y = movementData.y;
  };

  window.Infected = Infected;
})();

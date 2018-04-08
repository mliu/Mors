(function () {
  'use strict';

  var WIDTH = 2;
  var HEIGHT = 2;

  var Bullet = function (color, id, name, x, y) {
    this.color = color;
    this.id = id;
    this.name = name;

    // Initialize shape
    this.shapeInstance = new createjs.Shape();
    this.shapeInstance.graphics.beginFill("#000").drawRect(0, 0, WIDTH, HEIGHT);
    this.shapeInstance.x = x;
    this.shapeInstance.y = y;
  }

  Bullet.prototype.handleMovement = function (movementData) {
    this.shapeInstance.x = movementData.x;
    this.shapeInstance.y = movementData.y;
  };

  window.Bullet = Bullet;
})();

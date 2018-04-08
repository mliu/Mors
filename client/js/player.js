(function () {
  'use strict';

  var WIDTH = 30;
  var HEIGHT = 30;

  var Player = function () {
    this.color = null;
    this.id = null;
    this.input = {
      clickEvent: null,
      left: false,
      right: false,
      up: false,
      down: false
    };
    this.name = '';
  }

  Player.prototype.addEventListeners = function () {
    var _this = this;

    document.addEventListener('keydown', function (e) {
      return _this.onkey(e, e.keyCode, true);
    });

    document.addEventListener('keyup', function (e) {
      return _this.onkey(e, e.keyCode, false);
    });

    document.getElementById("canvas").addEventListener('click', function (e) {
      _this.input.clickEvent = {
        y: e.clientY - window.innerHeight / 2,
        x: e.clientX - window.innerWidth / 2,
      };
    });
  }

  Player.prototype.handleMovement = function (movementData) {
    this.shapeInstance.x = movementData.x;
    this.shapeInstance.y = movementData.y;
  }

  Player.prototype.onkey = function (event, key, pressed) {
    switch (key) {
    case 37:
      this.input.left = pressed;
      break;
    case 39:
      this.input.right = pressed;
      break;
    case 38:
      this.input.up = pressed;
      break;
    case 40:
      this.input.down = pressed;
      break;
    }

    // Prevent browser scrolling
    event.preventDefault();
  }

  Player.prototype.postEmitEvents = function () {
    this.input.clickEvent = null;
  }

  Player.prototype.setup = function (playerSettings) {
    this.id = playerSettings.id;
    this.color = playerSettings.color;
    this.name = playerSettings.name;

    // Initialize shape
    this.shapeInstance = new createjs.Shape();
    this.shapeInstance.graphics.beginFill(this.color).drawRect(0, 0, WIDTH, HEIGHT);
    this.shapeInstance.x = playerSettings.x;
    this.shapeInstance.y = playerSettings.y;
    this.addEventListeners();
  }

  Player.prototype.toJSON = function () {
    var ret = {
      id: this.id,
      input: this.input
    };
    return ret;
  }

  window.Player = Player;
})();

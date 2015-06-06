(function() {
  'use strict';

  var PLAYER_WIDTH = 30;
  var PLAYER_HEIGHT = 30;

  var Player = function() {
    this.name = '';
    this.color = null;
    this.id = null;
    this.input = { left: false, right: false, up: false, down: false };
  }

  Player.prototype.addEventListeners = function() {
    var p = this;
    document.addEventListener('keydown', function(e) { 
      return p.onkey(e, e.keyCode, true);
    });
    document.addEventListener('keyup', function(e) {
      return p.onkey(e, e.keyCode, false);
    });
  }

  Player.prototype.onkey = function(event, key, pressed) {
    switch(key) {
      case KEY.LEFT: 
        this.input.left = pressed;
        break;
      case KEY.RIGHT:
        this.input.right = pressed;
        break;
      case KEY.UP:
        this.input.up = pressed;
        break;
      case KEY.DOWN:
        this.input.down = pressed;
        break;
    }
    // Prevent browser scrolling
    event.preventDefault();
  }

  Player.prototype.setup = function(playerSettings) {
    this.name = playerSettings.name;
    this.color = "#000";
    // Initialize shape
    this.shapeInstance = new createjs.Shape();
    this.shapeInstance.graphics.beginFill(this.color).drawRect(playerSettings.x, playerSettings.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    this.addEventListeners();
  }

  window.Player = Player;
})();

(function() {
  'use strict';

  var PADDING_LEFT = 50;
  var PADDING_BOTTOM = 50;

  var Dashboard = function() {
    // Initialize shape
    this.shapeInstance = new createjs.Shape();
    this.shapeInstance.graphics.beginFill(color).drawRect(initX, initY, PLAYER_WIDTH, PLAYER_HEIGHT);
  }

  window.Dashboard = Dashboard;
})();

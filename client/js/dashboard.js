(function() {
  'use strict';

  var PADDING_LEFT = 10;
  var PADDING_BOTTOM = 25;
  var METRICS_FONT = "15px Arial";

  var Dashboard = function(stage) {
    // Initialize metrics container
    this.metricsContainer = new createjs.Container();

    // Add FPS counter to metrics container
    this.fpsCounter = new createjs.Text("FPS: N/A", METRICS_FONT, "#000");
    this.metricsContainer.addChild(this.fpsCounter);

    this.stage = stage;

    this.positionSelf();
  }

  Dashboard.prototype.displayWelcomeScreen = function(player, callback) {
    callback({ name: "Michael" });
  }

  Dashboard.prototype.hideWelcomeScreen = function() {

  }

  Dashboard.prototype.positionSelf = function() {
    this.metricsContainer.x = PADDING_LEFT;
    this.metricsContainer.y = this.stage.canvas.height - PADDING_BOTTOM;
  }

  window.Dashboard = Dashboard;
})();

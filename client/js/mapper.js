(function() {
  'use strict';

  var BLOCK_WIDTH = 30;
  var BLOCK_HEIGHT = 30;
  var BLOCK_REFERENCE = {
    1: { name: "Wall" }
  }

  var Mapper = function(mapData) {
    this.mapData = mapData;
    this.mapContainer = new createjs.Container();

    // Render blocks
    this.renderBlocks();
  }

  Mapper.prototype.addWall = function(x, y) {

    // Create wall at (x, y)
    var shapeInstance = new createjs.Shape();
    shapeInstance.graphics.beginFill("#936C4A").drawRect(0, 0, BLOCK_WIDTH, BLOCK_HEIGHT);
    shapeInstance.x = x;
    shapeInstance.y = y;

    // Add shapeInstance to container
    this.mapContainer.addChild(shapeInstance);
  }

  Mapper.prototype.renderBlocks = function() {
    var i;
    var j;
    var type;

    // Iterate through all blocks
    for(i = 0; i < this.mapData.length; i++) {
      for(j = 0; j < this.mapData[0].length; j++) {
        type = this.mapData[i][j];

        // Render map object if it's not empty space
        if(type !== 0) {
          
          // Call on the render function for this block type
          this["add" + BLOCK_REFERENCE[type].name](j*BLOCK_WIDTH, i*BLOCK_HEIGHT);
        }
      }
    }
  }

  window.Mapper = Mapper;
})();

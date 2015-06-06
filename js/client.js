'use strict';

function init() {
  var stage = new createjs.Stage("canvas");
  var circle = new createjs.Shape();
  circle.graphics.beginFill("#000").drawCircle(100.5, 100.5, 10);
  stage.addChild(circle);
  stage.update();
}

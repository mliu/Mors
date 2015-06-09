'use strict';

// Utility class for common useful methods used by our engine
var util = {};

util.calculateAngle = calculateAngle;
util.calculateDistance = calculateDistance;
util.intervalStep = intervalStep;
util.linearChance = linearChance;
util.random = random;
util.randomInt = randomInt;

// Returns the angle in radians pointing from source to target
function calculateAngle(source, target) {
  return Math.atan2(target.y - source.y, target.x - source.x);
}

// Returns the distance between a and b. Assumes a and b have properties x and y
function calculateDistance(a, b) {
  return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
}

// Helper method for only executing something every (step) game ticks.
function intervalStep(counter, step) {
  return counter % step === 0;
}

// Returns if point (x,y) is inside the triangle formed between the points (0, 0), (a, 0), (0, b). Assumes all are positive.
function linearChance(x, y, a, b) {
  return y < ((-b/a) * x + b);
}

// Returns a random decimal between a and b
function random(a, b) {
  return Math.random() * (b-a) + a;
}

// Returns a random integer between a and b
function randomInt(a, b) {
  return Math.round(Math.random() * (b-a) + a);
}

module.exports = util;

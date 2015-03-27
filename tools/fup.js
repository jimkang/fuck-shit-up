var createFuckItUp = require('../index').create;
var _ = require('lodash');
// var seedrandom = require('seedrandom');
// var createProbable = require('probable').createProbable;

if (process.argv.length < 3) {
  console.log('Usage: node fup.js "Your phrase here."');
  process.exit();
}

var phrase = process.argv[2];

var fuckItUp = createFuckItUp();

fuckItUp(phrase, displayResult);

function displayResult(error, result) {
  if (error) {
    console.log(error);
  }
  console.log(result);
}

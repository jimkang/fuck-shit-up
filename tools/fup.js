var createFuckItUp = require('../index').create;
var _ = require('lodash');
var probable = require('probable');

if (process.argv.length < 3) {
  console.log('Usage: node fup.js "Your phrase here."');
  process.exit();
}

var phrase = process.argv[2];

var fuckItUp = createFuckItUp({
  probable: probable
});

fuckItUp(phrase, displayResult);

function displayResult(error, result) {
  if (error) {
    console.log(error);
  }
  console.log(result);
}

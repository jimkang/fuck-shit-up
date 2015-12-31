#!/usr/bin/env node

var createFuckShitUp = require('../index').create;
var _ = require('lodash');
var getStdin = require('get-stdin');

if (process.argv.length < 3) {
  console.log('Usage: fsu "Your phrase here."');
  process.exit();
}

var phrase = process.argv[2];

if (phrase === '-') {
  // pipe from stdin
  getStdin().then(run);
} else {
  run(phrase);
}

function run(phrase) {
  var fuckShitUp = createFuckShitUp({
    useAlternativeModifiers: true
  });

  fuckShitUp(phrase, displayResult);

  function displayResult(error, result) {
    if (error) {
      console.log(error);
    }
    console.log(result);
  }
}
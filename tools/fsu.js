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
  getStdin().then(function(lines){
    // execute lines in sequence
    lines.split('\n')
      .filter(function(line){
        return !!line.trim();
      })
      .map(makePromise)
      .reduce(function(next, fn){
        return next = next.then(fn);
      }, Promise.resolve());
  });
} else {
  run(phrase);
}

function run(phrase, cb) {
  var fuckShitUp = createFuckShitUp({
    useAlternativeModifiers: true
  });

  fuckShitUp(phrase, cb || displayResult);
}

function displayResult(error, result) {
  if (error) {
    console.log(error);
  }
  console.log(result);
}

function makePromise(line) {
  return function() {
		return new Promise(function (resolve, reject) {
			run(line, function (error, result) {
				displayResult(error, result);
				if (error) reject(error);
				else resolve(result);
			});
		});
	};
}
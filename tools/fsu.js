#!/usr/bin/env node

var createFuckShitUp = require('../index').create;
var _ = require('lodash');
var getStdin = require('get-stdin');

if (process.argv.length < 3) {
  console.log('Usage: fsu "Your phrase here."');
  process.exit();
}

var phrase = process.argv[2],
  vulgar = process.argv[3] === '--vulgar';

if (phrase === '-') {
  // pipe from stdin
  getStdin().then(runFSUOnLines);
}
else {
  run(phrase);
}

function runFSUOnLines(lines){
  // execute lines in sequence
  lines.split('\n')
    .filter(lineIsNonWhitespace)
    .map(makePromise)
    .reduce(runPromise, Promise.resolve());
}

function lineIsNonWhitespace(line){
  return !!line.trim();
}

function run(phrase, cb) {
  var fuckShitUp = createFuckShitUp({
    useAlternativeModifiers: true,
    vulgar: vulgar
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
  return function createPromise() {
		return new Promise(executeRun);
	};

  function executeRun(resolve, reject) {
    run(line, fsuDone);

    function fsuDone(error, result) {
      displayResult(error, result);
      if (error) {
        reject(error);
      }
      else {
        resolve(result);
      }
    }
  }
}

function runPromise(promise, createNextPromise){
  // TODO: onRejected.
  return promise.then(createNextPromise);
}

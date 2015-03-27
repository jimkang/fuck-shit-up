var createFuckItUp = require('./index').create;
var _ = require('lodash');
var lineChomper = require('line-chomper');
var probable = require('probable');
var jsonfile = require('jsonfile');
var callBackOnNextTick = require('conform-async').callBackOnNextTick;
var async = require('async');
var queue = require('queue-async');
var probable = require('probable');

var fuckItUp = createFuckItUp({
  probable: probable
});

var linesInShakespeareFile = 122645;

function sampleLines(done) {
  var lineOffsets = jsonfile.readFileSync(
    __dirname + '/data/shakeslineoffsets.json'
  );

  var numberOfLines = probable.rollDie(4);
  var startingLine = probable.roll(linesInShakespeareFile - numberOfLines);

  lineChomper.chomp(
    __dirname + '/data/shakespeare-pg100.txt',
    {
      lineOffsets: lineOffsets,
      fromLine: startingLine,
      lineCount: numberOfLines
    },
    function readDone(error, lines) {
      if (error) {
        done(error);
      }
      else if (!lines || !Array.isArray(lines) || lines.length < 1) {
        done(new Error('Could not get valid line for offset ' + 
          startingLine + ' numberOfLines: ' + numberOfLines
        ));
      }
      else {
        done(error, lines);
      }
    }
  );  
}

function findLines(done) {
  sampleLines(setUpCheckLines);

  function setUpCheckLines(error, lines) {
    checkLines(error, lines, done);
  }
}

function checkLines(error, lines, done) {
  if (error) {
    done(error);
  }
  else if (lines.length < 1 || lines.every(lineIsNoGood)) {
    console.log('Lines were bad. Trying again.', lines);
        debugger;

    callBackOnNextTick(findLines, done);
  }
  else {
    console.log('Good lines:', lines);
    done(null, lines);
  }
}

function lineIsNoGood(line) {
  return !line || line.length < 1 || !(line.match(/[A-Za-z]/));
}

function cleanLines(lines, done) {
  done(null, lines.map(cleanLine));
}

function cleanLine(line) {
  return line.replace('\\\'', '\'');
}

function fuckUpEachLine(lines, done) {
  var q = queue();

  lines.forEach(queueFuckItUp);

  function queueFuckItUp(line) {
    q.defer(fuckItUp, line);
  }

  q.awaitAll(done);
}

function joinLines(lines, done) {
  done(null, lines.join('\n'));
}

function postModifiedText(text) {
  console.log(text);
}

async.waterfall(
  [
    findLines,
    cleanLines,
    fuckUpEachLine,
    joinLines,
    postModifiedText
  ]
);

var WordPOS = require('wordpos');
var wordpos = new WordPOS();
var _ = require('lodash');
var queue = require('queue-async');

function createFuckItUp(opts) {
  var probable;
  if (opts) {
    probable = opts.probable;
  }

  return function fuckItUp(sentence, done) {
    var pieces = sentence.split(/\s/g);
    var q = queue(4);
    pieces.forEach(queueGetPOS);

    function queueGetPOS(piece) {
      q.defer(adaptedGetPOS, piece);
    }

    q.awaitAll(buildNewSentenceFromPOS);

    function buildNewSentenceFromPOS(error, partsOfSpeech) {
      // getPOS never returns an error, so no need to check that.
      partsOfSpeech.forEach(compactDict);
      done(null, buildParallelSentence(probable, pieces, partsOfSpeech));
    }

    function decorateWords(partsOfSpeech) {
      done(null, reverseDict(partsOfSpeech));
    }
  }
}

function adaptedGetPOS(text, callback) {
  wordpos.getPOS(text, posDone);
  function posDone(result) {
    callback(null, result);
  }
}

function compactDict(dict) {
  for (key in dict) {
    if (!dict[key] || (Array.isArray(dict[key]) && dict[key].length === 0)) {
      delete dict[key];
    }
  }
  return dict;
}

function buildParallelSentence(probable, pieces, posReports) {
  console.log(posReports);

  var newPieces = [];
  for (var i = 0; i < pieces.length; ++i) {
    var posReport = posReports[i];
    var piece = pieces[i];

    var needToCapitalize = false;
    if (i === 0) {
      needToCapitalize = isCapitalized(piece);
    }
    if (shouldPrefix(posReport)) {
      var modifier = 'fucking';
      if (needToCapitalize) {
        modifier = 'Fucking';
        piece = piece.toLowerCase();
      }
      newPieces.push(modifier);
    }
    newPieces.push(piece);
  }
  return newPieces.join(' ');
}

var badBets = [
  'I',
  'May',
  'There'
];

function shouldPrefix(posReport) {
  return (posReport.verbs && !_.contains(badBets, posReport.verbs[0])) ||
    (posReport.adverbs && !_.contains(badBets, posReport.adverbs[0])) ||
    (posReport.nouns && !_.contains(badBets, posReport.nouns[0])) ||
    (posReport.adjectives && !_.contains(badBets, posReport.adjectives[0]));
}

function isCapitalized(fragment) {
  return fragment && fragment[0].match(/[A-Z]/);
}

module.exports = {
  create: createFuckItUp
};

var WordPOS = require('wordpos');
var wordpos = new WordPOS();
var _ = require('lodash');
var queue = require('queue-async');

function createFuckShitUp(opts) {
  var probable;
  if (opts) {
    probable = opts.probable;
  }

  return function FuckShitUp(sentence, done) {
    var pieces = sentence.split(/[\s]/g);
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
  // console.log(posReports);

  var newPieces = [];
  var prefixedLastIteration = false;

  var doNotPrefixTwoInARow = (probable.roll(3) !== 0);
  var skipTheFirstOpportunity = (probable.roll(3) === 0);

  for (var i = 0; i < pieces.length; ++i) {
    var posReport = posReports[i];
    var piece = pieces[i];

    var needToCapitalize = false;
    if (probablyStartOfSentence(pieces, i)) {
      needToCapitalize = isCapitalized(piece);
    }
    if ((!prefixedLastIteration || !doNotPrefixTwoInARow) &&
      (i !== 0 || !skipTheFirstOpportunity) &&
      shouldPrefix(posReport, piece)) {

      var modifier = 'fucking';
      if (posReport.adverbs) {
        modifier = 'the fuck';
      }
      if (needToCapitalize) {
        // Leave ALL CAPS pieces ALL CAPS. Make the modifier match.
        if (hasNoLowerCase(piece)) {
          modifier = modifier.toUpperCase();
        }
        else {
          // Capitalize the modifier, lower case the original piece.
          modifier = titleCaseWord(modifier);
          piece = piece.toLowerCase();
        }

      }
      newPieces.push(modifier);
      prefixedLastIteration = true;
    }
    else {
      prefixedLastIteration = false;
    }

    newPieces.push(piece);
  }
  return newPieces.join(' ');
}

var badBets = [
  'i',
  'may',
  'there',
  'he',
  'she',
  'but',
  'and',
  'oh',
  'o',
  'oh',
  'now',
  'in',
  'so',
  'on',
  'not',
  'it',
  'as',
  'us',
  'will'
];

badBets = badBets.concat(badBets.map(titleCaseWord));

function titleCaseWord(word){
  return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase();
}

function shouldPrefix(posReport, piece) {
  var posIsGood = (posReport.verbs && !_.contains(badBets, posReport.verbs[0])) ||
    (posReport.adverbs && !_.contains(badBets, posReport.adverbs[0])) ||
    (posReport.nouns && !_.contains(badBets, posReport.nouns[0])) ||
    (posReport.adjectives && !_.contains(badBets, posReport.adjectives[0]));

  return posIsGood && !isAStageDirection(piece);
}

function isAStageDirection(fragment) {
  return fragment.indexOf('[') !== -1 && fragment.indexOf(']') !== -1;
}

function isCapitalized(fragment) {
  return fragment && fragment[0].match(/[A-Z]/);
}

function hasNoLowerCase(fragment) {
  return fragment.toUpperCase() === fragment;
}

var endPunctuation = ['.', '?', '!'];

function probablyStartOfSentence(pieces, index) {
  var probablyStart = false;
  if (index === 0) {
    probablyStart = true;
  }
  else if (pieces.length > 1) {
    var previousPiece = pieces[index - 1];
    if (previousPiece.length > 1) {
      if (_.contains(endPunctuation, previousPiece[previousPiece.length - 1])) {
        probablyStart = true;
      }
    }
  }
  return probablyStart;
}

module.exports = {
  create: createFuckShitUp
};

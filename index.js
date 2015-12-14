var WordPOS = require('wordpos');
var wordpos = new WordPOS();
var _ = require('lodash');
var queue = require('queue-async');
var defaultProbable = require('probable');
var jsonfile = require('jsonfile');
var getSpatialPreposition = require('get-spatial-preposition');
var modifierLists = require('./modifiers');

function createFuckShitUp(opts) {
  var probable;
  var useAlternativeModifiers;

  if (opts) {
    probable = opts.probable;
    useAlternativeModifiers = opts.useAlternativeModifiers;
  }

  if (!probable) {
    probable = defaultProbable;
  }

  function getModifier(targetType) {
    var modifier;

    if (useAlternativeModifiers) {
      if (targetType === 'adverbish') {
        modifier = probable.pickFromArray(
          modifierLists.modifiersForAdverbishTargets
        );
      }
      else if (targetType === 'noun') {
        modifier = probable.pickFromArray(
          modifierLists.modifiersForNounTargets
        );
      }
      else {
        modifier = probable.pickFromArray(modifierLists.modifiers);
      }
    }
    else {
      if (targetType === 'adverbish') {
        modifier = 'the fuck';
      }
      else {
        modifier = 'fucking';
      }
    }

    return modifier;
  }

  return function fuckShitUp(sentence, done) {
    var pieces = _.compact(sentence.split(/[\s]/g));
    var q = queue(4);
    pieces.forEach(queueGetPOS);

    function queueGetPOS(piece) {
      q.defer(adaptedGetPOS, piece);
    }

    q.awaitAll(buildNewSentenceFromPOS);

    function buildNewSentenceFromPOS(error, partsOfSpeech) {
      // getPOS never returns an error, so no need to check that.
      partsOfSpeech.forEach(compactDict);
      done(
        null,
        buildParallelSentence(probable, pieces, partsOfSpeech, getModifier)
      );
    }
  }
}

function adaptedGetPOS(text, callback) {
  wordpos.getPOS(text, posDone);
  function posDone(result) {
    var prep = getSpatialPreposition(text);
    if (prep) {
      result.spatialPrepositions = [prep];
    }
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

function buildParallelSentence(probable, pieces, posReports, getModifier) {
  // console.log(posReports);

  var newPieces = [];
  var prefixedLastIteration = false;
  var targetType;

  var prefixTwoInARow = (probable.roll(3) === 0);
  var skipTheFirstOpportunity = (probable.roll(3) === 3);

  for (var i = 0; i < pieces.length; ++i) {
    var posReport = posReports[i];
    var piece = pieces[i];

    var needToCapitalize = false;
    if (probablyStartOfSentence(pieces, i)) {
      needToCapitalize = isCapitalized(piece);
    }
    if ((!prefixedLastIteration || prefixTwoInARow) &&
      (i !== 0 || !skipTheFirstOpportunity) &&
      shouldPrefix(posReport, piece)) {

      targetType = undefined;

      if ((posReport.adverbs || posReport.spatialPrepositions) && 
        !posReport.nouns && !posReport.adjectives && !posReport.verbs) {
        targetType = 'adverbish';
      }
      else if (posReport.nouns &&
        !posReport.adjectives && !posReport.verbs && !posReport.adverbs) {
        targetType = 'noun';
      }
      var modifier = getModifier(targetType);

      if (!repeatsThePreviousPiece(modifier, newPieces) && 
        modifier.toLowerCase() !== piece.toLowerCase()) {

        if (hasNoLowerCase(piece)) {
          modifier = modifier.toUpperCase();
          // Leave ALL CAPS pieces ALL CAPS. Make the modifier match.
        }
        else if (needToCapitalize) {
          // Capitalize the modifier, lower case the original piece.
          modifier = titleCaseWord(modifier);
          piece = piece.toLowerCase();
        }

        newPieces.push(modifier);
        prefixedLastIteration = true;
      }
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

var posTypes = ['verbs', 'adverbs', 'nouns', 'adjectives', 'spatialPrepositions'];

function shouldPrefix(posReport, piece) {
  function partOfSpeechIsGoodInReport(pos) {
    return posReport[pos] && !_.contains(badBets, posReport[pos][0]);
  }

  var posIsGood = posTypes.some(partOfSpeechIsGoodInReport);
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

function repeatsThePreviousPiece(modifier, pieces) {
  return pieces.length > 0 && 
    pieces[pieces.length - 1].toLowerCase() === modifier.toLowerCase();
}

module.exports = {
  create: createFuckShitUp
};

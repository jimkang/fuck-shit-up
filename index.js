var pos = require('pos');
var _ = require('lodash');
var queue = require('queue-async');
var defaultProbable = require('probable');
var callBackOnNextTick = require('conform-async').callBackOnNextTick;

var relationalPrepositions = [
  "abaft",
  "abeam",
  "aboard",
  "about",
  "above",
  "absent",
  "across",
  "afore",
  "after",
  "against",
  "along",
  "alongside",
  "amid",
  "amidst",
  "among",
  "amongst",
  "anenst",
  "apud",
  "around",
  "aside",
  "astride",
  "at",
  "athwart",
  "atop",
  "before",
  "behind",
  "below",
  "beneath",
  "beside",
  "besides",
  "between",
  "beyond",
  "by",
  "chez",
  "down",
  "forenenst",
  "from",
  "in",
  "inside",
  "into",
  "near",
  "nigh",
  "off",
  "on",
  "onto",
  "out",
  "outside",
  "over",
  "past",
  "through",
  "thru",
  "toward",
  "towards",
  "under",
  "underneath",
  "unto",
  "up",
  "upon",
  "with",
  "within",
  "without"
];

var lexer = new pos.Lexer();
var tagger = new pos.Tagger();

function createFuckShitUp(opts) {
  var probable;
  if (opts) {
    probable = opts.probable;
  }

  if (!probable) {
    probable = defaultProbable;
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
      done(null, buildParallelSentence(probable, pieces, partsOfSpeech));
    }
  }
}

var posForTags = {
  JJ: 'adjectives',
  JJR: 'adjectives',
  JJS: 'adjectives',
  NN: 'nouns',
  NNP: 'nouns',
  NNPS: 'nouns',
  NNS: 'nouns',
  RB: 'adverbs',
  RRB: 'adverbs',
  RBS: 'adverbs',
  VB: 'verbs',
  VBD: 'verbs',
  VBN: 'verbs',
  VBP: 'verbs',
  WRB: 'adverbs'
};

function adaptedGetPOS(text, callback) {
  var words = lexer.lex(text);
  var taggedWords = tagger.tag(words);
  
  var word = words[0];
  var tag;
  if (taggedWords.length > 0 && taggedWords[0].length > 1) {
    tag = taggedWords[0][1];
  }

  var result = {};
  if (tag) {
    result[posForTags[tag]] = [word];
  }

  var prep = getRelationalPreposition(word);
  if (prep) {
    result.relationalPrepositions = [prep];
  }

  callBackOnNextTick(callback, null, result);
}

// Expects piece to contain one word, along with punctuation, maybe.
function getRelationalPreposition(piece) {
  var prep;
  var matches = piece.match(/\w+/);
  if (matches && matches.length > 0) {
    var word = matches[0];
    if (relationalPrepositions.indexOf(word) !== -1) {
      prep = word;
    }
  }
  return prep;
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

  var prefixTwoInARow = (probable.roll(3) === 0);
  var skipTheFirstOpportunity = (probable.roll(3) === 3);

  for (var i = 0; i < pieces.length; ++i) {
    var posReport = posReports[i];
    var piece = pieces[i];

    var needToCapitalize = false;
    debugger;
    if (probablyStartOfSentence(pieces, i)) {
      needToCapitalize = isCapitalized(piece);
    }
    if ((!prefixedLastIteration || prefixTwoInARow) &&
      (i !== 0 || !skipTheFirstOpportunity) &&
      shouldPrefix(posReport, piece)) {

      var modifier = 'fucking';
      if ((posReport.adverbs || posReport.relationalPrepositions) && 
        !posReport.nouns && !posReport.adjectives) {

        modifier = 'the fuck';
      }

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

var posTypes = ['verbs', 'adverbs', 'nouns', 'adjectives', 'relationalPrepositions'];

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

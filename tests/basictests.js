var test = require('tape');
var createFuckShitUp = require('../index').create;
var createProbable = require('probable').createProbable;
var seedrandom = require('seedrandom');

var alwaysRolls1Probable = {
  roll: function mockRoll(sides) {
    return 1;
  }
};

var alwaysRolls0Probable = {
  roll: function mockRoll(sides) {
    return 0;
  }
};

var seededProbable = createProbable({
  random: seedrandom('test')
});

function runBasicTest(opts) {
  test(opts.testName, function basicTest(t) {
    t.plan(2);

    var fuckShitUp = createFuckShitUp({
      probable: opts.probable,
      useAlternativeModifiers: opts.useAlternativeModifiers
    });

    fuckShitUp(opts.text, checkResult);

    function checkResult(error, result) {
      t.ok(!error, 'No error occurred.');
      t.equal(result, opts.expectedResult);
    }
  });
}

var simpleTests = [
  {
    testName: 'Basic test',
    probable: alwaysRolls1Probable,
    text: 'My words fly up, my thoughts remain below: Words without thoughts never to heaven go',
    expectedResult: 'My fucking words fly the fuck up, my thoughts fucking remain below: fucking Words without thoughts never to fucking heaven go'
  },
  {
    testName: 'No modifier that the same as the previous word is added.',
    probable: alwaysRolls0Probable,
    text: 'Fucking fuck shit up!',
    expectedResult: 'Fucking fuck fucking shit the fuck up!'
  },
  {
    testName: 'Treats "plain" as a noun, not an adverb.',
    probable: alwaysRolls0Probable,
    text: 'The rain in Spain stays mainly in the plain.',
    expectedResult: 'The fucking rain in fucking Spain fucking stays the fuck mainly in the fucking plain.'
  },
  {
    testName: 'Does not choke on lots of consecutive spaces.',
    probable: alwaysRolls0Probable,
    text: 'Hath charg\'d you should not speak together.             Exit',
    expectedResult: 'Hath charg\'d you should not fucking speak fucking together. Fucking exit'
  },
  {
    testName: 'ALL CAPS modifiers that prefix ALL CAPS words',
    probable: alwaysRolls0Probable,
    text: 'FIRST MURDERER. I\'ll back to the Duke of Gloucester and',
    expectedResult: 'FUCKING FIRST FUCKING MURDERER. I\'ll fucking back to the fucking Duke of fucking Gloucester and'
  },
  {
    testName: 'Use alternative modifiers.',
    useAlternativeModifiers: true,
    probable: seededProbable,
    text: 'The rain in Spain stays mainly in the plain.',
    expectedResult: 'The sodding rain in god-damned Spain stays to hell mainly in the goddamn plain.'
  },
  {
    testName: 'Use alternative modifiers.',
    useAlternativeModifiers: true,
    probable: seededProbable,
    text: 'My words fly up, my thoughts remain below: Words without thoughts never to heaven go',
    expectedResult: 'My shit-ass words fly to hell up, my thoughts god-damned remain below: sodding Words without thoughts never to sodding heaven go'
  }
];

simpleTests.forEach(runBasicTest);

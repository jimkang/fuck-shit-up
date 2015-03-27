var test = require('tape');
var createFuckShitUp = require('../index').create;

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

test('Basic test', function basicTest(t) {
  t.plan(2);

  var fuckShitUp = createFuckShitUp({
    probable: alwaysRolls1Probable
  });

  fuckShitUp(
    'My words fly up, my thoughts remain below: Words without thoughts never to heaven go',
    checkResult
  );

  function checkResult(error, result) {
    t.ok(!error, 'No error occurred.');
    t.equal(
      result,
      'My fucking words fly up, my thoughts fucking remain below: fucking Words without thoughts never to fucking heaven go',
      'Text has "fuck" added to it.'
    );
  }
});

test('Redundancy', function redundancy(t) {
  t.plan(1);

  var fuckShitUp = createFuckShitUp({
    probable: alwaysRolls0Probable
  });

  fuckShitUp('Fucking fuck shit up!', checkResult);

  function checkResult(error, result) {
    t.equal(
      result,
      'Fucking fuck fucking shit up!',
      'No modifier that the same as the previous word is added.'
    );
  }
});

test('Prioritize nounhood', function nounhood(t) {
  t.plan(1);

  var fuckShitUp = createFuckShitUp({
    probable: alwaysRolls0Probable
  });

  fuckShitUp('The rain in Spain stays mainly in the plain.', checkResult);

  function checkResult(error, result) {
    t.equal(
      result,
      'The fucking rain in fucking Spain fucking stays the fuck mainly in the fucking plain.',
      'Treats "plain" as a noun, not an adverb.'
    );
  }
});

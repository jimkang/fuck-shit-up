var test = require('tape');
var createFuckShitUp = require('../index').create;

test('Basic test', function basicTest(t) {
  t.plan(2);

  var fuckShitUp = createFuckShitUp({
    probable: {
      roll: function mockRoll(sides) {
        return 1;
      }
    }
  });

  fuckShitUp(
    'My words fly up, my thoughts remain below: Words without thoughts never to heaven go',
    function checkResult(error, result) {
      t.ok(!error, 'No error occurred.');
      t.equal(
        result, 
        'My fucking words fly up, my thoughts fucking remain below: fucking Words without thoughts never to fucking heaven go',
        'Text has "fuck" added to it.'
      );
    }
  );
});

test('Redundancy', function redundancy(t) {
  t.plan(1);

  var fuckShitUp = createFuckShitUp({
    probable: {
      roll: function mockRoll(sides) {
        return 0;
      }
    }
  });

  fuckShitUp('Fucking fuck shit up!', checkResult);

  function checkResult(error, result) {
    t.equal(
      result,
      'The fuck fucking fuck fucking shit up!',
      'No modifier that the same as the previous word is added.'
    );
  }
});

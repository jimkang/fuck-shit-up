var test = require('tape');
var createFuckItUp = require('../index').create;

test('Basic test', function basicTest(t) {
  t.plan(2);

  var fuckItUp = createFuckItUp({
    probable: {
      roll: function mockRoll(sides) {
        return 0;
      }
    }
  });

  fuckItUp(
    'My words fly up, my thoughts remain below: Words without thoughts never to heaven go',
    function checkResult(error, result) {
      t.ok(!error, 'No error occurred.');
      t.equal(
        result, 
        'My words fly the fuck up, my thoughts remain below: Words without thoughts never to fucking heaven go',
        'Text has "fuck" added to it.'
      );
    }
  );
});

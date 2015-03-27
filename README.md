fuck-shit-up
==================

Adds "fuck" to sentences.

Installation
------------

    npm install fuck-shit-up

Or for command-line usage:

    [sudo] npm install -g fuck-shit-up

Usage
-----

    var fuckShitUp = createFuckShitUp();

    fuckShitUp('The rain in Spain stays mainly in the plain.', displayResult);

    function displayResult(error, result) {
      if (error) {
        console.log(error);
      }
      console.log(result);
    }

Output:

    The fucking rain in fucking Spain stays the fuck mainly in the fucking plain.

Command line:

    fsu "The rain in Spain stays mainly in the plain."

Tests
-----

Run tests with `make test`.

License
-------

MIT.
